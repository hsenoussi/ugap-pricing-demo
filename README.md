# UGAP Pricing Intelligence — Prototype IA Lab

Démo interactive pour le cadrage IA Lab UGAP : pricing appels d'offres et veille concurrentielle.

## Démo en ligne (GitHub Pages)

Après déploiement, la démo est accessible à :

`https://<votre-compte>.github.io/<nom-du-repo>/`

## Développement local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Héberger sur GitHub

### 1. Créer le dépôt et pousser le code

```bash
cd "/Users/hamzas./Desktop/Manual Library/ugap/Untitled"

# Se connecter à GitHub (si nécessaire)
gh auth login

# Créer le repo public et pousser
gh repo create ugap-pricing-demo --public --source=. --remote=origin --push
```

Ou manuellement sur [github.com/new](https://github.com/new) puis :

```bash
git init
git add .
git commit -m "Initial commit — démo UGAP Pricing Intelligence"
git branch -M main
git remote add origin https://github.com/<votre-compte>/ugap-pricing-demo.git
git push -u origin main
```

### 2. Activer GitHub Pages

1. Aller dans **Settings → Pages**
2. **Build and deployment** → Source : **GitHub Actions**
3. Le workflow `.github/workflows/deploy-pages.yml` se déclenche automatiquement au push sur `main`
4. Après ~2 min, la démo est live

### 3. Vérifier le déploiement

```bash
gh run list --workflow=deploy-pages.yml
gh run watch
```

## Cas concret — Scraping Rey Office

Réf. UGAP **4048313** — papier Rey Office A4 80g (carton 5 ramettes).

Sur GitHub Pages (site statique), le scraping utilise des données de repli documentées si les sites bloquent les requêtes cross-origin. En local (`npm run dev`), le scraping peut tenter une collecte live depuis ugap.fr.

## Structure

| Fichier | Rôle |
|---------|------|
| `src/components/` | UI (dashboard, pricing AO, veille prix) |
| `src/lib/scraping/rey-office.ts` | Logique scraping cas pilote |
| `public/app.css` | Styles autonomes (layout garanti) |
| `.github/workflows/deploy-pages.yml` | Déploiement GitHub Pages |

## Identité UGAP

- Logo officiel : `public/logo-ugap.svg` (source ugap.fr)
- Couleur principale : `#d20a11`
- Signature : *Le choix de l'achat juste*
