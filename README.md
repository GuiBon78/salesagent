# OS Lingueo — Dashboard Agents IA

## 1. Objectif

Ce projet met en place le socle technique du dashboard commercial IA Lingueo.

Il permet de piloter :

- Jordan : feedback global, arbitrage, priorités Guillaume
- Walid : préparation RDV, relances, brief entreprise, DISC, MEDDIC
- Ken : RevOps, pipeline, prise d'ordre, closing, opportunités
- Veille : CPF, OPCO, LILATE, concurrents, formation langues

L’architecture cible est volontairement simple :

```txt
Vercel / Next.js Dashboard
↓
API route Next.js
↓
Webhook n8n
↓
Lecture Drive .md + sources métier
↓
OpenAI / ChatGPT
↓
JSON structuré
↓
Dashboard HTML
```

## 2. Triggers retenus

### Trigger principal

Cron n8n : lundi à 07h00.

Objectif : générer la weekly review avant le démarrage de la semaine.

### Trigger manuel

Bouton `Refresh dashboard` dans l’interface Vercel.

Objectif : relancer l’analyse à n’importe quel moment, sans multiplier les crons ni créer de bruit API.

## 3. Structure du projet

```txt
os_lingueo_dashboard/
  app/
    api/
      dashboard/
        latest/route.ts
        refresh/route.ts
    globals.css
    layout.tsx
    page.tsx
  components/
    Dashboard.tsx
  lib/
    mock-data.ts
  n8n/
    os-lingueo-jordan-weekly-review.json
  .env.example
  package.json
  README.md
```

## 4. Installation locale

```bash
npm install
npm run dev
```

Puis ouvrir :

```txt
http://localhost:3000
```

## 5. Variables d’environnement

Créer un fichier `.env.local` à partir de `.env.example`.

```bash
cp .env.example .env.local
```

Variables nécessaires :

```env
N8N_JORDAN_WEBHOOK_URL=https://YOUR-N8N-DOMAIN/webhook/jordan-weekly-review
INTERNAL_API_KEY=change-me
```

## 6. Déploiement Vercel

1. Créer un repo GitHub.
2. Pousser ce projet dans le repo.
3. Importer le repo dans Vercel.
4. Ajouter les variables d’environnement dans Vercel.
5. Déployer.

## 7. n8n

Importer le workflow :

```txt
n8n/os-lingueo-jordan-weekly-review.json
```

Le workflow contient déjà :

- un cron lundi 07h00
- un webhook refresh manuel
- une réponse JSON vers Vercel

Il reste à brancher les vrais nodes :

- Google Drive : lecture `MASTER.md`, `JORDAN.md`, `WALID.md`, `KEN.md`, `PHILIPPE.md`, `TALINE.md`, `ALEX.md`
- Gmail : recherche mails Lingueo, relances, prospects, clients
- Calendar : RDV semaine
- Salesforce : opportunités, PO, pipe, closing, raisons de perte
- Veille web : mots-clés CPF, OPCO, LILATE, concurrents
- OpenAI : génération JSON structuré

## 8. Contrat JSON attendu par le dashboard

À terme, n8n doit retourner un JSON de ce type :

```json
{
  "generatedAt": "2026-05-24T07:00:00.000Z",
  "jordan": {
    "weeklyScore": "7,4 / 10",
    "criticalAlerts": 3,
    "summary": "Synthèse courte",
    "priorities": ["Action 1", "Action 2", "Action 3"]
  },
  "walid": {
    "meetingsCount": 12,
    "briefsReady": 8,
    "followupsSuggested": 17,
    "meetings": [
      {
        "company": "Decathlon",
        "date": "Mardi 10:30",
        "stake": "Assessment langues international",
        "disc": "Bleu / Rouge",
        "status": "Fort potentiel"
      }
    ]
  },
  "ken": {
    "poCurrentMonth": "184 k€",
    "openRevenue": "612 k€",
    "weightedPipeline": "327 k€",
    "closingRate": "24%",
    "lastOpportunities": [],
    "salesRanking": []
  },
  "veille": {
    "signals": 18,
    "critical": 2,
    "items": []
  }
}
```

## 9. Règles de sécurité

- Aucun token en dur dans le code.
- Les clés sont dans n8n ou Vercel.
- Le dashboard appelle seulement une route interne Next.js.
- La route Next.js appelle n8n.
- Option recommandée : vérifier `x-internal-api-key` côté n8n.

## 10. Ce qu’il faut fournir pour finaliser la mise en production

### Obligatoire

- URL publique du webhook n8n
- Clé OpenAI dans n8n
- Connexion Google Drive n8n
- Connexion Google Calendar n8n
- Connexion Gmail n8n
- Accès Salesforce ou export Salesforce exploitable
- Repo GitHub ou projet Vercel cible

### Très recommandé

- Liste officielle des concurrents à surveiller
- Liste des mots-clés de veille
- Objectifs mensuels / trimestriels par commercial
- Mapping des champs Salesforce :
  - owner
  - amount
  - close date
  - stage
  - funding source
  - market
  - lost reason
  - created date
  - last activity date

## 11. Prochaine étape

V1 technique :

- Déployer le dashboard
- Brancher webhook n8n
- Tester refresh manuel

V2 métier :

- Brancher Drive + Gmail + Calendar
- Générer vrai JSON Jordan / Walid

V3 RevOps :

- Brancher Salesforce
- Calcul KPI dans n8n
- GPT ne fait que l’interprétation

V4 production :

- Cache
- logs
- failsafe
- contrôle d’accès
