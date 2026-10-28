// Régénère data/people.json : les personnalités les plus consultées sur Wikipédia FR,
// nées entre 1900 et 1960 (donc mortes ou susceptibles de l'être). Deux sources de
// candidats : les Français un peu connus (requête Wikidata par nationalité), et les
// personnes de toute nationalité passées au moins un jour de l'année dans le top 1000
// des pages vues de Wikipédia FR. Le classement final se fait sur les vues de
// Wikipédia FR : c'est donc la notoriété en France qui décide.
// Seuls l'identifiant Wikidata et le nom sont stockés : le jeu lit « mort ou pas »
// en direct sur Wikidata à chaque question.
//
// Usage : node scripts/update-people.mjs   (Node 18+, aucune dépendance)

import { writeFile } from 'node:fs/promises';

const OUTPUT = new URL('../data/people.json', import.meta.url);
const USER_AGENT = 'MortOuPasMort/1.0 (https://github.com/Sambutcher/MortouPasMort)';
const MIN_SITELINKS = 25;      // filtre grossier de notoriété (Français) avant de compter les vues
const TITLES_PER_QUERY = 300;  // titres d'articles recherchés par requête Wikidata
const KEEP = 800;              // taille finale de la liste
const CONCURRENCY = 2;    // l'API pageviews renvoie des 429 au-delà de quelques requêtes en parallèle
const MAX_MISSING = 0.1;  // part maximale de personnes sans nombre de vues avant d'abandonner

// Une requête par décennie : la requête sur 1900-1960 d'un coup dépasse parfois
// les 60 s de Wikidata, qui renvoie alors un JSON tronqué.
const frenchQuery = (from, to) => `
SELECT ?person ?personLabel ?article WHERE {
  ?person wdt:P31 wd:Q5;
          wdt:P27 wd:Q142;
          wdt:P569 ?birth;
          wikibase:sitelinks ?sitelinks.
  FILTER(?sitelinks >= ${MIN_SITELINKS})
  FILTER(?birth >= "${from}-01-01"^^xsd:dateTime && ?birth < "${to}-01-01"^^xsd:dateTime)
  ?article schema:about ?person;
           schema:isPartOf <https://fr.wikipedia.org/>.
  ?person rdfs:label ?personLabel.
  FILTER(LANG(?personLabel) = "fr")
}`;

// Sans filtre de nationalité, parcourir tous les humains nés à une période dépasse
// le délai de Wikidata. On part donc de titres d'articles (recherche indexée) et on
// ne garde que les humains nés entre 1900 et 1960.
const titlesQuery = titles => `
SELECT ?person ?personLabel ?article WHERE {
  VALUES ?title { ${titles.map(t => JSON.stringify(t.replaceAll('_', ' ')) + '@fr').join(' ')} }
  ?article schema:name ?title;
           schema:isPartOf <https://fr.wikipedia.org/>;
           schema:about ?person.
  ?person wdt:P31 wd:Q5;
          wdt:P569 ?birth.
  FILTER(?birth >= "1900-01-01"^^xsd:dateTime && ?birth < "1961-01-01"^^xsd:dateTime)
  ?person rdfs:label ?personLabel.
  FILTER(LANG(?personLabel) = "fr")
}`;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getJson(url, options = {}) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, { ...options, headers: { 'User-Agent': USER_AGENT, Accept: 'application/json', ...options.headers } });
    let error = `${res.status}`;
    if (res.ok) {
      // En cas de délai dépassé, Wikidata répond 200 avec un JSON coupé suivi d'une trace Java
      try { return JSON.parse(await res.text()); } catch { error = 'JSON invalide'; }
    }
    if (res.status === 404) return null;
    if (attempt >= 6) throw new Error(`${error} ${url}`);
    // Respecte Retry-After si le serveur l'indique, sinon attente exponentielle (2 s, 4 s, 8 s…)
    const retryAfter = Number(res.headers.get('retry-after'));
    await sleep(retryAfter > 0 ? retryAfter * 1000 : Math.min(2000 * 2 ** (attempt - 1), 60000));
  }
}

// POST : avec des centaines de titres, la requête est trop longue pour une URL
function sparql(query) {
  return getJson('https://query.wikidata.org/sparql?format=json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ query }),
  });
}

// Titres des articles passés au moins un jour dans le top 1000 de Wikipédia FR sur un an
async function topTitles() {
  const days = [];
  const end = new Date();
  for (let i = 2; i <= 366; i++) days.push(new Date(end.getTime() - i * 86400000));
  const titles = new Set();
  const results = await mapLimit(days, CONCURRENCY, async day => {
    const [y, m, d] = day.toISOString().slice(0, 10).split('-');
    try {
      const data = await getJson(`https://wikimedia.org/api/rest_v1/metrics/pageviews/top/fr.wikipedia/all-access/${y}/${m}/${d}`);
      return data?.items?.[0]?.articles || [];
    } catch (err) {
      console.warn(`Top du ${y}-${m}-${d} introuvable : ${err.message}`);
      return [];
    } finally {
      await sleep(100);
    }
  });
  for (const articles of results) {
    for (const { article } of articles) {
      if (!article.includes(':')) titles.add(article); // écarte Spécial:, Wikipédia:, etc.
    }
  }
  return [...titles];
}

async function fetchCandidates() {
  const byId = new Map();
  const add = rows => {
    for (const row of rows) {
      const id = row.person.value.split('/').pop();
      byId.set(id, { id, name: row.personLabel.value, title: decodeURIComponent(row.article.value.split('/wiki/').pop()) });
    }
  };

  for (let from = 1900; from < 1961; from += 10) {
    add((await sparql(frenchQuery(from, Math.min(from + 10, 1961)))).results.bindings);
  }
  console.log(`${byId.size} candidats français`);

  const titles = await topTitles();
  console.log(`${titles.length} articles passés dans le top 1000 quotidien de Wikipédia FR`);
  for (let i = 0; i < titles.length; i += TITLES_PER_QUERY) {
    add((await sparql(titlesQuery(titles.slice(i, i + TITLES_PER_QUERY)))).results.bindings);
  }
  console.log(`${byId.size} candidats au total`);
  return [...byId.values()];
}

function yyyymmdd(date) {
  return date.toISOString().slice(0, 10).replaceAll('-', '');
}

async function pageviews(title) {
  const end = new Date();
  end.setUTCDate(1);
  const start = new Date(end);
  start.setUTCFullYear(start.getUTCFullYear() - 1);
  const url = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/fr.wikipedia/all-access/user/'
    + `${encodeURIComponent(title)}/monthly/${yyyymmdd(start)}00/${yyyymmdd(end)}00`;
  try {
    const data = await getJson(url);
    return (data?.items || []).reduce((sum, item) => sum + item.views, 0);
  } catch (err) {
    console.warn(`Vues introuvables pour ${title} : ${err.message}`);
    return null;
  } finally {
    await sleep(100); // ménage l'API entre deux requêtes
  }
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }));
  return results;
}

const candidates = await fetchCandidates();
console.log(`${candidates.length} candidats trouvés sur Wikidata`);

const views = await mapLimit(candidates, CONCURRENCY, c => pageviews(c.title));
const missing = views.filter(v => v === null).length;
if (missing > candidates.length * MAX_MISSING) {
  // Trop de trous : on garde l'ancienne liste plutôt que d'en écrire une faussée
  throw new Error(`${missing} personnes sans nombre de vues sur ${candidates.length}, liste non mise à jour`);
}
if (missing) console.warn(`${missing} personnes ignorées faute de nombre de vues`);

const people = candidates
  .map((c, i) => ({ id: c.id, name: c.name, views: views[i] }))
  .filter(p => p.views !== null)
  .sort((a, b) => b.views - a.views)
  .slice(0, KEEP)
  .map(({ id, name }) => ({ id, name }));

const json = '[\n' + people.map(p => JSON.stringify(p)).join(',\n') + '\n]\n';
await writeFile(OUTPUT, json);
console.log(`${people.length} personnes écrites dans data/people.json`);
