# Mort ou pas mort ?

Jeu web pour téléphone, avec deux jeux au choix sur l'écran d'accueil :

- **Mort ou pas mort ?** : une personnalité connue en France s'affiche, à toi de deviner si elle est morte ou vivante.
- **Condamné ou pas condamné ?** : à toi de deviner si elle a déjà été condamnée par la justice (condamnation définitive et non annulée). La réponse s'accompagne d'une explication et d'un lien vers Wikipédia.

On peut aussi ouvrir directement un jeu : `#mort` ou `#condamne` à la fin de l'adresse.

- `index.html`, `style.css`, `game.js` : le jeu, 100 % statique (GitHub Pages suffit).
- `manifest.webmanifest`, `sw.js`, `icons/` : de quoi installer le jeu comme une appli (PWA). Pas de mode hors ligne : le service worker ne met rien en cache.
- `data/people.json` : la liste des candidats (identifiant Wikidata + nom).
- À chaque question, le jeu interroge Wikidata en direct pour savoir si la personne est morte, et récupère sa photo et sa description.
- `scripts/update-people.mjs` régénère la liste (Node 18+) ; la GitHub Action `update-people.yml` le lance chaque lundi.

Pour « Condamné ou pas condamné ? » :

- `data/convicts-source.json` : la liste écrite à la main (titre de l'article Wikipédia FR, description, condamné ou non, explication affichée, drapeaux `sensible` / `evolutif` / `verifier` / `annule`). C'est le seul fichier à modifier.
- `scripts/update-convicts.mjs` la valide avec Wikidata (propriété P1399 « condamné pour ») et Wikipédia FR, puis écrit `data/convicts.json` (utilisé par le jeu) et `data/convicts-report.md` (rapport : entrées écartées, cas sensibles, suggestions de personnes à ajouter).
- La GitHub Action `update-convicts.yml` le lance chaque lundi et à chaque modification de la liste source.
- En jeu, Wikidata ne sert qu'à la photo, et à sauter une personne marquée « pas condamnée » si Wikidata indique depuis une condamnation.

Pour jouer en local : `python3 -m http.server` puis ouvrir http://localhost:8000.

Pour l'installer sur téléphone : ouvrir le site, puis « Ajouter à l'écran d'accueil » (Safari : bouton Partager ; Chrome : menu ⋮ ou bannière « Installer »).
