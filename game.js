// Deux jeux sur la même mécanique (une carte, deux boutons, la réponse) :
// - « Mort ou pas mort ? » : la liste des candidats vient de data/people.json (mise à
//   jour chaque semaine), mais l'info « mort ou pas » est toujours lue en direct sur Wikidata.
// - « Condamné ou pas condamné ? » : la liste vient de data/convicts.json, validée chaque
//   semaine avec Wikidata (scripts/update-convicts.mjs). La photo est lue en direct.

const WIKIDATA_API = 'https://www.wikidata.org/w/api.php';
const FEMALE = 'Q6581072';

const $ = id => document.getElementById(id);

let mode = null;     // jeu en cours (voir MODES en bas du fichier)
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
async function loadNext() {
  // Un candidat peut être sauté (voir fetchConvict) : on en essaie quelques-uns.
  const m = mode;
  for (let i = 0; ; i++) {
    const person = await m.load(m.nextCandidate());
    if (person || i >= 4) return person || m.load(m.nextCandidate(), true);
  }
}

function prepareNext() {
  upcoming = loadNext().then(person => {
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

  const m = mode;
  let next;
  try {
    next = await upcoming;
  } catch (err) {
    console.error(err);
    if (mode !== m) return;
    prepareNext();
    showError('Impossible de joindre Wikidata. Vérifie ta connexion.');
    document.body.classList.remove('loading');
    return;
  }
  if (mode !== m) return; // changement de jeu pendant le chargement
  current = next;
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
  $('btn-dead').textContent = mode.yesLabel(current);
  $('btn-alive').textContent = mode.noLabel(current);

  for (const b of document.querySelectorAll('.choice')) b.disabled = false;
  document.body.classList.remove('loading');
}

function answer(saysDead) {
  const p = current;
  if (!p) return;
  const right = saysDead === mode.isYes(p);

  for (const b of document.querySelectorAll('.choice')) b.disabled = true;
  (saysDead ? $('btn-dead') : $('btn-alive')).classList.add('picked');

  $('verdict').textContent = right ? 'Bonne réponse !' : 'Raté !';
  $('verdict').className = right ? 'good' : 'bad';

  $('detail').textContent = mode.detail(p);
  $('source').hidden = !p.source;
  if (p.source) $('source').firstElementChild.href = p.source;

  $('photo').classList.add('revealed');
  $('result').hidden = false;
  $('choices').hidden = true;
  $('btn-next').textContent = 'Suivant';
  $('btn-next').hidden = false;
  $('btn-next').focus();
}

function deathDetail(p) {
  const e = p.female ? 'e' : '';
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
  return detail + '.';
}

// Mode « Condamné ou pas condamné » : la réponse et l'explication viennent de la liste
// validée ; Wikidata ne sert en direct qu'à la photo, et à sauter une personne marquée
// « pas condamnée » si Wikidata indique désormais une condamnation (liste pas encore
// revalidée). Sans Wikidata, on joue quand même, sans photo.
async function fetchConvict(candidate, force = false) {
  const person = {
    id: candidate.id,
    name: candidate.name,
    description: candidate.desc,
    female: candidate.female,
    convicted: candidate.convicted,
    why: candidate.why,
    source: `https://fr.wikipedia.org/wiki/${encodeURIComponent(candidate.wiki.replaceAll(' ', '_'))}`,
    photo: null,
  };
  try {
    const params = new URLSearchParams({ action: 'wbgetentities', ids: candidate.id, props: 'claims', format: 'json', origin: '*' });
    const res = await fetch(`${WIKIDATA_API}?${params}`);
    if (!res.ok) throw new Error(`Wikidata ${res.status}`);
    const claims = (await res.json()).entities?.[candidate.id]?.claims || {};
    const newlyConvicted = (claims.P1399 || []).some(c => c.rank !== 'deprecated');
    if (!force && !candidate.convicted && !candidate.annulled && newlyConvicted) return null;
    const image = bestClaim(claims, 'P18')?.mainsnak?.datavalue?.value;
    if (image) person.photo = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(image)}?width=600`;
  } catch (err) {
    console.warn(err);
  }
  return person;
}

const MODES = {
  mort: {
    title: 'Mort ou pas mort ?',
    data: 'data/people.json',
    load: fetchPerson,
    nextCandidate() {
      if (deck.length === 0) deck = shuffle(this.list.slice());
      return deck.pop();
    },
    isYes: p => p.dead,
    yesLabel: () => 'Mort',
    noLabel: () => 'Pas mort',
    detail: deathDetail,
  },
  condamne: {
    title: 'Condamné ou pas condamné ?',
    data: 'data/convicts.json',
    load: fetchConvict,
    // Une chance sur deux pour chaque réponse, même si la liste n'est pas équilibrée.
    nextCandidate() {
      if (!deck.yes?.length) deck.yes = shuffle(this.list.filter(p => p.convicted));
      if (!deck.no?.length) deck.no = shuffle(this.list.filter(p => !p.convicted));
      return (Math.random() < 0.5 ? deck.yes : deck.no).pop();
    },
    isYes: p => p.convicted,
    yesLabel: p => p.female ? 'Condamnée' : 'Condamné',
    noLabel: p => p.female ? 'Pas condamnée' : 'Pas condamné',
    detail: p => p.why,
  },
};

function showHome() {
  mode = null;
  document.body.classList.add('home');
  document.title = 'Mort ou pas mort ?';
}

async function startMode(name) {
  const m = MODES[name];
  document.body.classList.remove('home');
  if (mode === m) return;
  mode = m;
  deck = [];
  current = null;
  $('title').textContent = m.title;
  document.title = m.title;
  $('name').textContent = '';
  $('description').textContent = '';
  $('photo').hidden = true;
  $('no-photo').hidden = true;
  $('result').hidden = true;
  $('btn-next').hidden = true;
  document.body.classList.add('loading');

  try {
    if (!m.list) m.list = await (await fetch(m.data)).json();
  } catch (err) {
    console.error(err);
    $('error').textContent = 'Impossible de charger la liste des personnes.';
    $('error').hidden = false;
    $('choices').hidden = true;
    return;
  }
  if (mode !== m) return; // changement de jeu pendant le chargement
  prepareNext();
  showQuestion();
}

function route() {
  const name = location.hash.slice(1);
  if (MODES[name]) startMode(name);
  else showHome();
}

function start() {
  $('btn-dead').addEventListener('click', () => answer(true));
  $('btn-alive').addEventListener('click', () => answer(false));
  $('btn-next').addEventListener('click', showQuestion);
  $('btn-home').addEventListener('click', () => { location.hash = ''; });
  for (const card of document.querySelectorAll('.mode-card')) {
    card.addEventListener('click', () => { location.hash = card.dataset.mode; });
  }
  window.addEventListener('hashchange', route);
  route();
}

start();
