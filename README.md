# Mort ou pas mort ?

Jeu web pour téléphone : une personnalité connue en France s'affiche, à toi de deviner si elle est morte ou vivante.

- `index.html`, `style.css`, `game.js` : le jeu, 100 % statique (GitHub Pages suffit).
- `data/people.json` : la liste des candidats (identifiant Wikidata + nom).
- À chaque question, le jeu interroge Wikidata en direct pour savoir si la personne est morte, et récupère sa photo et sa description.
- `scripts/update-people.mjs` régénère la liste (Node 18+) ; la GitHub Action `update-people.yml` le lance chaque lundi.

Pour jouer en local : `python3 -m http.server` puis ouvrir http://localhost:8000.
