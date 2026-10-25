// Mort ou pas mort ? La liste des candidats vient de data/people.json (mise à jour
// chaque semaine), mais l'info « mort ou pas » est toujours lue en direct sur Wikidata.

const WIKIDATA_API = 'https://www.wikidata.org/w/api.php';
const FEMALE = 'Q6581072';

const $ = id => document.getElementById(id);

let deck = [];
let current = null;  // personne affichée, avec ses infos Wikidata
let upcoming = null; // promesse de la personne suivante (préchargée)

function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function nextCandidate() {
  if (deck.length === 0) deck = shuffle(window.people.slice());
  return deck.pop();
}

// "+1943-06-15T00:00:00Z" -> { year, month, day } (month/day à 0 si inconnus)
function parseTime(claim) {
  const value = claim?.mainsnak?.datavalue?.value;
  if (!value) return null;
  const m = /^([+-]\d+)-(\d\d)-(\d\d)/.exec(value.time);
  if (!m) return null;
  return { year: +m[1], month: +m[2], day: +m[3] };
}

function bestClaim(claims, property) {
  const list = claims[property] || [];
  return list.find(c => c.rank === 'preferred') || list.find(c => c.rank !== 'deprecated');
}

function age(birth, end) {
  let years = end.year - birth.year;
  if (birth.month && end.month &&
      (end.month < birth.month || (end.month === birth.month && end.day && birth.day && end.day < birth.day))) {
    years--;
  }
  return years;
}

async function fetchPerson(candidate) {
  const params = new URLSearchParams({
    action: 'wbgetentities',
    ids: candidate.id,
    props: 'claims|labels|descriptions',
    languages: 'fr',
    languagefallback: '1',
    format: 'json',
    origin: '*',
  });
  const res = await fetch(`${WIKIDATA_API}?${params}`);
  if (!res.ok) throw new Error(`Wikidata ${res.status}`);
  const entity = (await res.json()).entities?.[candidate.id];
  if (!entity || !entity.claims) throw new Error('Entité introuvable');

  const claims = entity.claims;
  const image = bestClaim(claims, 'P18')?.mainsnak?.datavalue?.value;
  const description = (entity.descriptions?.fr?.value || '')
    // Certaines descriptions donnent les dates : on les retire pour ne pas vendre la mèche.
    .replace(/\s*\(?\b\d{3,4}\s*[-–]\s*\d{0,4}\)?/g, '')
    .trim();

  return {
    id: candidate.id,
    name: entity.labels?.fr?.value || candidate.name,
    description,
    female: bestClaim(claims, 'P21')?.mainsnak?.datavalue?.value?.id === FEMALE,
    birth: parseTime(bestClaim(claims, 'P569')),
    death: parseTime(bestClaim(claims, 'P570')),
    dead: Boolean(bestClaim(claims, 'P570')),
    photo: image
      ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(image)}?width=600`
      : null,
  };
}

// Charge la personne suivante en tâche de fond et précharge sa photo.
function prepareNext() {
  upcoming = fetchPerson(nextCandidate()).then(person => {
    if (person.photo) new Image().src = person.photo;
    return person;
  });
  upcoming.catch(() => {}); // l'erreur sera gérée quand on en aura besoin
}

function showError(message) {
  $('error').textContent = message;
  $('error').hidden = false;
  $('choices').hidden = true;
  $('btn-next').hidden = false;
  $('btn-next').textContent = 'Réessayer';
}

async function showQuestion() {
  document.body.classList.add('loading');
  $('error').hidden = true;
  $('result').hidden = true;
  $('btn-next').hidden = true;
  $('choices').hidden = false;
  for (const b of document.querySelectorAll('.choice')) {
    b.disabled = true;
    b.classList.remove('picked');
  }

  try {
    current = await upcoming;
  } catch (err) {
    console.error(err);
    prepareNext();
    showError('Impossible de joindre Wikidata. Vérifie ta connexion.');
    document.body.classList.remove('loading');
    return;
  }
  prepareNext();

  const photo = $('photo');
  photo.classList.remove('revealed');
  photo.hidden = !current.photo;
  $('no-photo').hidden = Boolean(current.photo);
  if (current.photo) {
    photo.src = current.photo;
    photo.alt = current.name;
  }
  $('name').textContent = current.name;
  $('description').textContent = current.description;

  for (const b of document.querySelectorAll('.choice')) b.disabled = false;
  document.body.classList.remove('loading');
}

function answer(saysDead) {
  const p = current;
  if (!p) return;
  const e = p.female ? 'e' : '';
  const right = saysDead === p.dead;

  for (const b of document.querySelectorAll('.choice')) b.disabled = true;
  (saysDead ? $('btn-dead') : $('btn-alive')).classList.add('picked');

  $('verdict').textContent = right ? 'Bonne réponse !' : 'Raté !';
  $('verdict').className = right ? 'good' : 'bad';

  let detail;
  if (p.dead) {
    detail = p.death ? `Mort${e} en ${p.death.year}` : `Mort${e}`;
    if (p.birth && p.death) detail += `, à ${age(p.birth, p.death)} ans`;
  } else {
    detail = `Toujours vivant${e}`;
    if (p.birth) {
      const now = new Date();
      detail += `, ${age(p.birth, { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() })} ans`;
    }
  }
  $('detail').textContent = detail + '.';

  $('photo').classList.add('revealed');
  $('result').hidden = false;
  $('choices').hidden = true;
  $('btn-next').textContent = 'Suivant';
  $('btn-next').hidden = false;
  $('btn-next').focus();
}

async function start() {
  $('btn-dead').addEventListener('click', () => answer(true));
  $('btn-alive').addEventListener('click', () => answer(false));
  $('btn-next').addEventListener('click', showQuestion);

  try {
    const res = await fetch('data/people.json');
    window.people = await res.json();
  } catch (err) {
    console.error(err);
    $('error').textContent = 'Impossible de charger la liste des personnes.';
    $('error').hidden = false;
    $('choices').hidden = true;
    return;
  }
  prepareNext();
  showQuestion();
}

start();
