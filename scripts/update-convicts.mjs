// Mode « Condamné ou pas condamné » : valide la liste écrite à la main
// (data/convicts-source.json) avec Wikidata et Wikipédia FR, puis écrit :
//  - data/convicts.json : la liste utilisée par le jeu (seulement les entrées validées) ;
//  - data/convicts-report.md : le rapport de validation, à relire.
//
// Règles de validation :
//  - « condamné » : gardé si Wikidata porte une condamnation (P1399, « condamné pour »)
//    ou, à défaut, si l'article Wikipédia FR parle d'une condamnation. Sinon écarté.
//  - « pas condamné » : écarté si Wikidata porte une condamnation, sauf pour les
//    condamnations annulées (drapeau "annule"), qui restent avec une note.
//  - Toute entrée dont l'article Wikipédia FR ou l'élément Wikidata est introuvable,
//    ou qui n'est pas une personne, est écartée.
// Le script propose aussi, dans le rapport, des personnes très connues que Wikidata
// dit condamnées et qui ne sont pas encore dans la liste. Elles ne sont jamais
// ajoutées automatiquement : il faut écrire leur explication à la main.
//
// Usage : node scripts/update-convicts.mjs   (Node 18+, aucune dépendance)

import { readFile, writeFile } from 'node:fs/promises';

const SOURCE = new URL('../data/convicts-source.json', import.meta.url);
const OUTPUT = new URL('../data/convicts.json', import.meta.url);
const REPORT = new URL('../data/convicts-report.md', import.meta.url);
const USER_AGENT = 'MortOuPasMort/1.0 (https://github.com/Sambutcher/MortouPasMort)';
const FRWIKI_API = 'https://fr.wikipedia.org/w/api.php';
const WIKIDATA_API = 'https://www.wikidata.org/w/api.php';
const HUMAN = 'Q5';
const FEMALE = 'Q6581072';
const MAX_EXCLUDED = 0.25;   // au-delà, on suppose une panne et on n'écrit rien
const SUGGEST_SITELINKS = 70; // notoriété minimale des suggestions

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getJson(url, options = {}) {
  for (let attempt = 1; ; attempt++) {
    let error;
    try {
      const res = await fetch(url, { ...options, headers: { 'User-Agent': USER_AGENT, Accept: 'application/json', ...options.headers } });
      error = `${res.status}`;
      if (res.ok) {
        try { return JSON.parse(await res.text()); } catch { error = 'JSON invalide'; }
      }
    } catch (err) {
      error = err.message;
    }
    if (attempt >= 6) throw new Error(`${error} ${url}`);
    await sleep(Math.min(2000 * 2 ** (attempt - 1), 60000));
  }
}

const api = (base, params) => getJson(`${base}?${new URLSearchParams({ format: 'json', formatversion: '2', ...params })}`);

function chunks(list, size) {
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

// Titre Wikipédia FR -> { title, qid } en suivant les redirections.
async function resolveTitles(titles) {
  const result = new Map();
  for (const batch of chunks(titles, 50)) {
    const data = await api(FRWIKI_API, {
      action: 'query', titles: batch.join('|'), redirects: '1', prop: 'pageprops', ppprop: 'wikibase_item',
    });
    const q = data.query || {};
    const follow = new Map();
    for (const n of q.normalized || []) follow.set(n.from, n.to);
    for (const r of q.redirects || []) follow.set(r.from, r.to);
    const pages = new Map((q.pages || []).map(p => [p.title, p]));
    for (const title of batch) {
      let t = title;
      for (let i = 0; i < 3 && follow.has(t); i++) t = follow.get(t);
      const page = pages.get(t);
      if (page && !page.missing) result.set(title, { title: page.title, qid: page.pageprops?.wikibase_item || null });
    }
  }
  return result;
}

async function wikitext(title) {
  const data = await api(FRWIKI_API, { action: 'query', titles: title, prop: 'revisions', rvprop: 'content', rvslots: 'main' });
  return data.query?.pages?.[0]?.revisions?.[0]?.slots?.main?.content || '';
}

function active(claims, prop) {
  return (claims?.[prop] || []).filter(c => c.rank !== 'deprecated' && c.mainsnak?.datavalue);
}

async function entities(ids) {
  const result = new Map();
  for (const batch of chunks(ids, 50)) {
    const data = await api(WIKIDATA_API, { action: 'wbgetentities', ids: batch.join('|'), props: 'claims|labels', languages: 'fr' });
    for (const [id, e] of Object.entries(data.entities || {})) result.set(id, e);
  }
  return result;
}

async function labels(ids) {
  const result = new Map();
  for (const batch of chunks([...new Set(ids)], 50)) {
    const data = await api(WIKIDATA_API, { action: 'wbgetentities', ids: batch.join('|'), props: 'labels', languages: 'fr|en' });
    for (const [id, e] of Object.entries(data.entities || {})) {
      result.set(id, e.labels?.fr?.value || e.labels?.en?.value || id);
    }
  }
  return result;
}

// Condamnations Wikidata, avec leur année si elle est donnée (qualificatif P585 ou P580).
function convictions(entity) {
  return active(entity.claims, 'P1399').map(c => {
    const time = (c.qualifiers?.P585 || c.qualifiers?.P580 || [])[0]?.datavalue?.value?.time;
    return { crime: c.mainsnak.datavalue.value.id, year: time ? Number(time.slice(1, 5)) : null, sourced: (c.references || []).length > 0 };
  });
}

async function suggestions(knownIds) {
  const query = `
SELECT ?person ?personLabel ?sitelinks WHERE {
  ?person wdt:P1399 ?crime; wdt:P31 wd:Q5; wikibase:sitelinks ?sitelinks.
  FILTER(?sitelinks >= ${SUGGEST_SITELINKS})
  ?article schema:about ?person; schema:isPartOf <https://fr.wikipedia.org/>.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}`;
  try {
    const data = await getJson('https://query.wikidata.org/sparql?format=json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ query }),
    });
    const seen = new Map();
    for (const b of data.results.bindings) {
      const id = b.person.value.split('/').pop();
      if (!knownIds.has(id)) seen.set(id, { id, name: b.personLabel.value, sitelinks: Number(b.sitelinks.value) });
    }
    return [...seen.values()].sort((a, b) => b.sitelinks - a.sitelinks).slice(0, 60);
  } catch (err) {
    console.warn('Suggestions indisponibles :', err.message);
    return null;
  }
}

async function main() {
  const source = JSON.parse(await readFile(SOURCE, 'utf8'));
  console.log(`${source.length} entrées dans la liste source`);

  const resolved = await resolveTitles(source.map(e => e.wiki));
  const ids = [...new Set([...resolved.values()].map(r => r.qid).filter(Boolean))];
  const items = await entities(ids);

  const rows = [];
  for (const entry of source) {
    const flags = entry.flags || [];
    const row = { entry, flags, kept: false, status: '', convictions: [] };
    rows.push(row);
    const r = resolved.get(entry.wiki);
    if (!r) { row.status = 'Article Wikipédia FR introuvable'; continue; }
    row.title = r.title;
    const item = r.qid && items.get(r.qid);
    if (!item || item.missing !== undefined) { row.status = 'Élément Wikidata introuvable'; continue; }
    row.id = item.id;
    row.name = item.labels?.fr?.value || r.title;
    row.female = active(item.claims, 'P21')[0]?.mainsnak.datavalue.value.id === FEMALE;
    if (!active(item.claims, 'P31').some(c => c.mainsnak.datavalue.value.id === HUMAN)) {
      row.status = 'Pas une personne selon Wikidata'; continue;
    }
    row.convictions = convictions(item);

    if (entry.convicted) {
      if (row.convictions.length) {
        row.kept = true; row.status = 'Confirmé par Wikidata';
      } else {
        const text = await wikitext(r.title);
        if (/condamn/i.test(text)) { row.kept = true; row.status = 'Confirmé par Wikipédia FR (absent de Wikidata)'; }
        else row.status = 'Non confirmé : ni Wikidata ni Wikipédia FR ne mentionnent de condamnation';
      }
    } else if (row.convictions.length && !flags.includes('annule')) {
      row.status = 'Conflit : Wikidata indique une condamnation';
    } else {
      row.kept = true;
      row.status = row.convictions.length ? 'Condamnation annulée (Wikidata la mentionne encore)' : 'Aucune condamnation dans Wikidata';
    }
  }

  const crimeLabels = await labels(rows.flatMap(r => r.convictions.map(c => c.crime)));
  const describe = r => r.convictions.map(c => `${crimeLabels.get(c.crime)}${c.year ? ` (${c.year})` : ''}${c.sourced ? '' : ' [sans source]'}`).join(' ; ');

  const kept = rows.filter(r => r.kept);
  const excluded = rows.filter(r => !r.kept);
  if (excluded.length > source.length * MAX_EXCLUDED) {
    throw new Error(`${excluded.length} entrées écartées sur ${source.length} : probable panne, rien n'est écrit.`);
  }

  const game = kept.map(r => ({
    id: r.id,
    name: r.name,
    desc: r.entry.desc,
    female: r.female,
    convicted: r.entry.convicted,
    why: r.entry.why,
    wiki: r.title,
    ...(r.flags.includes('annule') ? { annulled: true } : {}),
  }));
  await writeFile(OUTPUT, '[\n' + game.map(p => JSON.stringify(p)).join(',\n') + '\n]\n');

  const suggested = await suggestions(new Set(rows.map(r => r.id).filter(Boolean)));

  const line = r => `| ${r.name || r.entry.wiki} | ${r.entry.convicted ? 'Condamné' : 'Pas condamné'} | ${r.status} | ${describe(r) || '—'} | ${r.flags.join(', ') || ''} |`;
  const table = list => ['| Personne | Réponse | Validation | Wikidata (P1399) | Drapeaux |', '|---|---|---|---|---|', ...list.map(line)].join('\n');
  const flagged = (flag, list = kept) => list.filter(r => r.flags.includes(flag));

  const report = `# Condamné ou pas condamné : rapport de validation

Généré par \`scripts/update-convicts.mjs\`. Liste source : \`data/convicts-source.json\` (à modifier à la main).

- Entrées dans la liste source : ${source.length}
- Gardées dans le jeu : ${kept.length} (${kept.filter(r => r.entry.convicted).length} condamnées, ${kept.filter(r => !r.entry.convicted).length} non condamnées)
- Écartées : ${excluded.length}

Drapeaux : \`sensible\` = affaire délicate (mœurs, violences, présomption d'innocence) à relire ; \`evolutif\` = procédure qui peut encore bouger ; \`verifier\` = fait à confirmer ; \`annule\` = condamnation annulée, la bonne réponse est « pas condamné ».

## Écartées (à corriger dans la liste source)

${excluded.length ? table(excluded) : 'Aucune.'}

## Cas sensibles gardés (à relire)

${flagged('sensible').length ? table(flagged('sensible')) : 'Aucun.'}

## Procédures évolutives et faits à vérifier

${[...flagged('evolutif'), ...flagged('verifier')].length ? table([...new Set([...flagged('evolutif'), ...flagged('verifier')])]) : 'Aucun.'}

## Suggestions : personnes très connues que Wikidata dit condamnées, absentes de la liste

${suggested === null ? 'Requête Wikidata indisponible cette fois-ci.' : suggested.length ? suggested.map(s => `- [${s.name}](https://www.wikidata.org/wiki/${s.id}) (${s.sitelinks} wikis)`).join('\n') : 'Aucune.'}

## Toutes les entrées gardées

${table(kept)}
`;
  await writeFile(REPORT, report);
  console.log(`${kept.length} gardées, ${excluded.length} écartées. Rapport : data/convicts-report.md`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
