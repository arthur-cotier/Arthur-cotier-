# Contenu à remplir / personnaliser

Liste exhaustive des emplacements où vous (Arthur) devez intervenir avant la mise en ligne réelle. Tous les emplacements à compléter sont également repérés dans le code source par le commentaire `<!-- À personnaliser -->` ou `<!-- À PERSONNALISER -->`.

## Priorité 1 — bloquant pour la mise en ligne

### `index.html`
- [ ] Vérifier la baseline du hero. Actuelle : *« Des sites pensés comme en 2030, livrés en quelques jours. »*
- [ ] Lire et valider la formulation des sections « Méthode », « Pourquoi moi », « CTA final ».
- [ ] Confirmer que les statistiques rapides du hero (`4 à 10 jours`, `Sur devis personnalisé`, etc.) reflètent la réalité.

### `about.html` — la page la plus à personnaliser
- [ ] **Trois paragraphes de présentation personnelle** (section « Présentation »). Marqués `<!-- À personnaliser -->` dans le HTML.
  - § 1 : votre contexte (parcours, ce que vous faites)
  - § 2 : votre pourquoi (ce qui vous motive)
  - § 3 : votre comment (comment vous travaillez)
- [ ] **Photo / portrait** (placeholder gradient avec « A.C » pour l'instant). Remplacer le bloc `.portrait-frame` par votre image, ou laisser le placeholder si vous préférez.
- [ ] Relire la section « Ma vision de l'IA » et ajuster si certains chiffres / tournures ne vous correspondent pas.
- [ ] Valider les 3 valeurs en bas de page (Honnêteté de devis / Travail bien fait / Vraie écoute).

### `realisations.html`
- [ ] **URL des 3 sites une fois déployés**. Pour chaque carte projet, le bloc actuel est `<span class="link-arrow">Voir le site live</span>` — le remplacer par un vrai `<a href="https://maisonleon.fr" target="_blank" rel="noopener" class="link-arrow">Voir le site live</a>` quand les sites sont en ligne.
- [ ] Si les 3 sites partenaires ne sont pas encore en production, modifier la phrase de bas de page : *« Les trois sites sont en production. »*

### `contact.html`
- [ ] Vérifier que **arthur.cotier2@gmail.com** et **07 67 29 61 53** sont bien à jour.
- [ ] Lire la section « Disponibilité » — actuel : « Réponse sous 24h, week-end inclus ». Ajuster si nécessaire.
- [ ] Confirmer le statut de disponibilité (point vert sage = disponible).

### Métadonnées globales
- [ ] **Domaine final** : remplacer toutes les occurrences de `https://arthur-cotier.fr/` (dans les `<link rel="canonical">`, `<meta property="og:url">` et le sitemap si vous en ajoutez un) par votre vrai domaine.
  - Recherche : `grep -rn "arthur-cotier.fr" .`

## Priorité 2 — nice-to-have

### Visuels
- [ ] Remplacer `og-cover.svg` (image partagée sur les réseaux sociaux) par une version PNG/JPG 1200×630 px optimisée et la sauvegarder en `og-cover.png`. Mettre à jour les `<meta property="og:image">` en conséquence.
- [ ] Remplacer le `favicon.svg` si vous voulez votre propre logo / monogramme.
- [ ] Si vous ajoutez votre vrai portrait sur `about.html`, l'optimiser : 800×1000 px max, format AVIF/WebP, < 100 Ko.

### Réseaux sociaux et liens externes
- [ ] Footer : pas de section « Suivre » pour l'instant (volontairement minimal). Si vous voulez ajouter Instagram, LinkedIn, GitHub, ouvrez le `<footer>` de chaque page et insérez une 4ᵉ colonne `.footer-col` :
  ```html
  <div class="footer-col">
    <h4>Suivre</h4>
    <ul>
      <li><a href="https://instagram.com/...">Instagram</a></li>
      <li><a href="https://linkedin.com/in/...">LinkedIn</a></li>
      <li><a href="https://github.com/...">GitHub</a></li>
    </ul>
  </div>
  ```
  Et passer le grid du footer de 3 à 4 colonnes dans `styles.css` (recherche : `.footer-grid { grid-template-columns: 1.5fr 1fr 1fr; }`).

### SEO avancé
- [ ] Créer un `sitemap.xml` à la racine listant les 5 pages indexables.
- [ ] Créer un `robots.txt` à la racine (`User-agent: * / Allow: / / Sitemap: ...`).
- [ ] Configurer Google Search Console une fois le domaine branché.
- [ ] Mettre en place une fiche **Google Business Profile** si vous voulez ranker sur "freelance web Bordeaux/Paris/etc.".

### Contenus longs
- [ ] **Témoignages clients** : pas de section témoignages pour l'instant. Une fois 2-3 vrais retours en main, je peux ajouter une section dédiée à `index.html` avant le « Pourquoi moi ». Demandez-moi.
- [ ] **Articles / blog** : si vous voulez ajouter un blog (utile pour le SEO), prévoir une page `blog.html` + sous-pages d'articles. Demandez-moi.
- [ ] **FAQ** : pas de FAQ pour l'instant. Si vous voulez en ajouter une (par exemple sur la page services), c'est une bonne piste pour le SEO + rassurer le client.

## Priorité 3 — quand tout le reste est ok

- [ ] Tester la page 404 : aller manuellement sur `https://votredomaine.fr/page-inexistante` après déploiement, vérifier que la 404 stylisée s'affiche bien.
- [ ] Tester le formulaire de contact (page contact) : il ouvre votre client mail par défaut. Ajuster le texte du `subject` ou `body` si besoin dans `app.js`, fonction `contactForm.addEventListener`.
- [ ] Couleur du curseur custom : actuellement violet `#6E45E2`. Si vous voulez changer, modifier `.cursor-glow { background: ... }` dans `styles.css`.
- [ ] Niveau d'animation Three.js dans le hero : si trop intense ou pas assez, ajuster les paramètres dans `hero-particles.js` (constantes `PARTICLE_COUNT`, taille des sphères, vitesses de rotation).

## Comment chercher les emplacements à modifier

```bash
# Lister tous les "À personnaliser" / "À PERSONNALISER" dans le code
grep -rn "À PERSONNALISER\|À personnaliser" .

# Lister les URL de canonical à changer
grep -rn "arthur-cotier.fr" .
```

---

**Une fois tout passé en revue**, vous pouvez déployer. Voir `README.md` section *Déploiement* pour Cloudflare Pages ou Netlify.
