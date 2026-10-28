// Régénère data/people.json : les personnalités françaises les plus consultées
// sur Wikipédia FR, nées entre 1900 et 1960 (donc mortes ou susceptibles de l'être).
// Seuls l'identifiant Wikidata et le nom sont stockés : le jeu lit « mort ou pas »
// en direct sur Wikidata à chaque question.
//
// Usage : node scripts/update-people.mjs   (Node 18+, aucune dépendance)

import { writeFile } from 'node:fs/promises';

const OUTPUT = new URL('../data/people.json', import.meta.url);
const USER_AGENT = 'MortOuPasMort/1.0 (https://github.com/Sambutcher/MortouPasMort)';
const MIN_SITELINKS = 25; // filtre grossier de notoriété avant de compter les vues
const KEEP = 500;         // taille finale de la liste
const CONCURRENCY = 2;    // l'API pageviews renvoie des 429 au-delà de quelques requêtes en parallèle
const MAX_MISSING = 0.1;  // part maximale de personnes sans nombre de vues avant d'abandonner

const QUERY = `
SELECT ?person ?personLabel ?article ?sitelinks WHERE {
  ?person wdt:P31 wd:Q5;
          wdt:P27 wd:Q142;
          wdt:P569 ?birth;
          wikibase:sitelinks ?sitelinks.
  FILTER(?sitelinks >= ${MIN_SITELINKS})
  FILTER(?birth >= "1900-01-01"^^xsd:dateTime && ?birth < "1961-01-01"^^xsd:dateTime)
  ?article schema:about ?person;
           schema:isPartOf <https://fr.wikipedia.org/>.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
}`;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getJson(url) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' } });
    if (res.ok) return res.json();
    if (res.status === 404) return null;
    if (attempt >= 6) throw new Error(`${res.status} ${url}`);
    // Respecte Retry-After si le serveur l'indique, sinon attente exponentielle (2 s, 4 s, 8 s…)
    const retryAfter = Number(res.headers.get('retry-after'));
    await sleep(retryAfter > 0 ? retryAfter * 1000 : Math.min(2000 * 2 ** (attempt - 1), 60000));
  }
}

async function fetchCandidates() {
  const url = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(QUERY);
  const data = await getJson(url);
  const byId = new Map();
  for (const row of data.results.bindings) {
    const id = row.person.value.split('/').pop();
    const name = row.personLabel.value;
    if (name === id) continue; // pas de libellé français
    byId.set(id, { id, name, title: decodeURIComponent(row.article.value.split('/wiki/').pop()) });
  }
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
