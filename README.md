# Arthur Cotier — Site portfolio

Site vitrine professionnel d'Arthur Cotier, spécialiste IA + web. Site multi-pages, statique, ultra-léger, prêt à déployer sur Cloudflare Pages, Netlify ou Vercel.

> **Promesse client** : « Des sites pensés comme en 2030, livrés en quelques jours. »

---

## 1. Stack & choix techniques

| Couche | Choix | Pourquoi |
|---|---|---|
| Markup | **HTML5 sémantique** | Aucune dépendance, robuste, accessible. |
| Style | **CSS3 vanilla** (variables CSS, grid, flex) | Pas de Tailwind ici — code signé, différenciant, parfait pour un portfolio premium. |
| Script | **JavaScript vanilla** (modules ES) | Léger, lisible, zéro framework. |
| 3D | **Three.js** via importmap CDN (sur le hero uniquement) | Particules + blob mou. ~50 KB, désactivé sur mobile et `prefers-reduced-motion`. |
| Polices | **Space Grotesk** (display) + **Inter** (texte) via Google Fonts | Vibe « Linear / Vercel marketing 2030 ». |

**Aucun build, aucun bundler.** Vous ouvrez `index.html` dans un navigateur, ça marche.

## 2. Structure (flat — tout à la racine)

```
arthur-cotier-site/
├── index.html              # Accueil : hero 3D, méthode, technos, portfolio teaser, pourquoi moi, CTA
├── about.html              # Présentation, vision IA, valeurs
├── services.html           # 4 prestations détaillées
├── realisations.html       # Portfolio (3 mockups SVG/CSS des sites partenaires)
├── contact.html            # Coordonnées + formulaire mailto
├── 404.html                # Page d'erreur stylisée
├── styles.css              # Tous les styles (tokens, base, composants, pages)
├── app.js                  # Interactions partagées (nav, scroll, reveal, curseur, transitions)
├── hero-particles.js       # Three.js — particules + blob (chargé uniquement sur index.html)
├── favicon.svg             # Favicon SVG dégradé
├── og-cover.svg            # Image Open Graph (à convertir en PNG pour la prod, voir CONTENU_A_REMPLIR.md)
├── README.md               # Ce fichier
├── CONTENU_A_REMPLIR.md    # Liste exhaustive des points à personnaliser
└── .gitignore
```

> Tout est à la racine, **aucun sous-dossier**. Vous pouvez déplacer / renommer / dupliquer librement sans casser des chemins relatifs.

## 3. Lancer en local

C'est du HTML statique. Trois options :

### Option A — Ouvrir directement
Double-cliquez sur `index.html`. Tout fonctionne en `file://`, **sauf** Three.js sur le hero (les modules ES nécessitent un serveur HTTP). Pour voir le hero animé, utilisez l'option B ou C.

### Option B — Python (pré-installé sur Mac/Linux)
```bash
cd arthur-cotier-site
python3 -m http.server 8080
```
Puis ouvrez <http://localhost:8080>.

### Option C — Node (si vous avez Node)
```bash
cd arthur-cotier-site
npx serve .
```

## 4. Déploiement

Le site est statique, déployable n'importe où. Trois plateformes recommandées, toutes **gratuites** :

### Cloudflare Pages (recommandé)
1. Pousser le dossier sur un repo GitHub (`git init` → `git push`).
2. Sur <https://dash.cloudflare.com/?to=/:account/pages>, **Create project** → connecter le repo.
3. Build settings :
   - Framework preset : **None**
   - Build command : *(vide)*
   - Build output directory : `/`
4. **Save and Deploy**. Quelques secondes plus tard, le site est en ligne.
5. Brancher le domaine custom dans **Custom domains**.

### Netlify
1. <https://app.netlify.com/start>, glisser-déposer le dossier `arthur-cotier-site/` directement.
2. (Ou connecter le repo Git, mêmes paramètres : pas de build command, publish dir `/`.)
3. Brancher le domaine custom dans **Domain settings**.

### Vercel
1. <https://vercel.com/new>, importer le repo Git.
2. Framework preset : **Other** (statique).
3. **Deploy**.

> **Aucune** plateforme n'a besoin de Node, npm, ou d'un script de build. C'est du HTML statique pur.

## 5. Personnaliser le contenu

Tous les emplacements à compléter sont listés dans `CONTENU_A_REMPLIR.md` à la racine, et marqués dans le code par les commentaires `<!-- À personnaliser -->` ou `<!-- À PERSONNALISER -->`.

### Trouver rapidement les zones à modifier
```bash
# Tous les "à personnaliser" dans le projet
grep -rn "À PERSONNALISER\|À personnaliser" .

# Tous les emplacements où le domaine est en dur (à changer une fois domaine acquis)
grep -rn "arthur-cotier.fr" .
```

### Modifier la palette
Toutes les couleurs sont des variables CSS dans `:root` au début de `styles.css` :
```css
--bg:        #f7f4ee;   /* blanc cassé chaud — fond principal */
--bg-deep:   #1a1726;   /* gris-violet très foncé — sections sombres */
--violet:    #6E45E2;   /* accent principal */
--cyan:      #4FC3F7;   /* accent secondaire */
--sage:      #6BCB77;   /* nature, ponctuel uniquement */
```

### Modifier les polices
Dans le `<head>` de chaque page :
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
```
Et dans `styles.css` :
```css
--font-display: 'Space Grotesk', system-ui, sans-serif;
--font-body:    'Inter', system-ui, sans-serif;
```

### Modifier la nav / le footer
Ils sont dupliqués dans chaque fichier HTML (intentionnel pour rester en pur statique). Pour modifier :
1. Repérer le bloc `<header class="site-header">` (ou `<footer class="site-footer">`)
2. Le modifier dans **chacun** des 5 fichiers HTML

> Une recherche-remplacement dans votre éditeur règle ça en 30 secondes.

### Désactiver Three.js sur le hero
Si vous voulez retirer la 3D (par exemple pour réduire encore le poids), supprimer ces deux lignes de `index.html` :
```html
<script type="importmap">{...}</script>
<script type="module" src="hero-particles.js"></script>
```
Le fallback CSS (gradients animés) reste actif.

## 6. Performance ciblée

- **Lighthouse** : > 95 sur toutes les pages
- **First Contentful Paint** : < 1.2s
- **Three.js** chargé async, désactivé si :
  - `prefers-reduced-motion: reduce`
  - Largeur d'écran ≤ 760 px (mobile)
  - WebGL indisponible
- **Polices** : Google Fonts avec `display=swap`, preconnect en place
- **Images** : aucune image bitmap dans le projet de base — uniquement SVG inline et CSS gradients
- **JS** : ~3 KB gzippé (`app.js`), Three.js en CDN à la demande sur l'accueil seulement

## 7. Accessibilité

- Skip link au début de chaque page
- Hiérarchie `<h1>` → `<h2>` → `<h3>` claire
- `aria-current` sur le lien actif de la nav
- `aria-label` sur les icônes et éléments décoratifs
- Focus visible (anneau violet 3 px) sur tous les éléments interactifs
- `prefers-reduced-motion` respecté partout (Three.js désactivé, transitions raccourcies)
- Contrastes WCAG AA vérifiés sur les textes principaux

## 8. SEO de base inclus

- `<title>` et `<meta description>` uniques par page
- Open Graph + Twitter Cards
- `<link rel="canonical">` par page
- `lang="fr"` + `og:locale=fr_FR`
- JSON-LD `Person` sur l'accueil
- Hiérarchie sémantique propre

À faire après mise en ligne (hors site) :
- Soumettre le `sitemap.xml` à Google Search Console
- Créer une fiche Google Business Profile si pertinent
- Brancher Plausible / Matomo / Cloudflare Web Analytics (recommandé : sans cookie, pas besoin de bandeau RGPD)

## 9. Maintenance & évolutions

Cette structure est volontairement simple pour vous laisser :
- Ajouter des pages (dupliquer une page existante, modifier le contenu, lien dans la nav)
- Ajouter des sections (copier-coller un bloc `<section>` existant)
- Brancher un blog plus tard (ajouter `blog.html` + une sous-page par article, ou migrer sur Astro si volume)
- Brancher des analytics (1 ligne avant `</body>`)

Si à un moment vous voulez passer à un site avec un CMS / blog / espace client, demandez-moi : on peut migrer cette base vers Astro ou Next.js sans toucher au design.

---

## Crédits

Site conçu et codé par Arthur Cotier — © 2026.
arthur.cotier2@gmail.com · 07 67 29 61 53
