---
description: Implémente une ou plusieurs tâches précises depuis tasks.md en respectant AGENT.md et plan.md
---

Implémente uniquement la ou les tâches demandées dans `@tasks.md` :

**$ARGUMENTS**

## Contexte et références obligatoires

1. Lis d’abord la section correspondante dans `@tasks.md`.
2. Consulte `@AGENT.md` pour le contrat API, les payloads, les réponses, les erreurs et les règles de sécurité backend.
3. Consulte `@plan.md` pour l’architecture frontend, les tokens CSS, le responsive et les conventions i18n/RTL.
4. Inspecte les fichiers déjà présents dans `frontend/` avant toute modification.

## Règles impératives

- Le dossier `backend/` est complet et figé : ne modifie, ne crée et ne supprime aucun fichier dans `backend/`.
- Respecte strictement le périmètre des tâches indiquées dans `$ARGUMENTS`.
- Ne modifie pas une autre fonctionnalité ou une autre tâche non demandée.
- Respecte la structure et les patterns déjà présents dans `frontend/`.
- Utilise un code React/Vite simple, lisible et maintenable par un développeur junior–midlevel.
- Respecte la palette :
  - `#e0fbfc`
  - `#c2dfe3`
  - `#9db4c0`
  - `#5c6b73`
  - `#253237`
- Vérifie les modes light et dark.
- Assure le responsive mobile, tablette et desktop.
- Assure l’internationalisation `fr`, `en`, `ar`.
- Assure le support RTL pour l’arabe avec les propriétés CSS logiques.
- Utilise les bibliothèques déjà présentes et uniquement les dépendances prévues dans `plan.md`.
- Ne mets jamais de token, mot de passe, secret ou cookie dans les logs, le code affiché ou les messages utilisateur.
- Respecte strictement les contrats backend, notamment :
  - `Authorization: Bearer <accessToken>`;
  - `withCredentials: true`;
  - `GET /auth/refresh`;
  - `appointment` et `appointments`;
  - `Doctor.fullName`;
  - `FormData` avec le champ `image`;
  - limite upload de 1 MiB;
  - `barcodeImage` en data URI PNG;
  - réponses d’erreur `data.title`, `message` et statuts HTTP.

## Cas limites obligatoires

- Traite `POST /auth/logout` comme réussi dans les deux cas :
  - `204 No Content` sans cookie ;
  - `200` avec `status: "fail"` et `data.title = "Logout success"`.
- Ne tente jamais de contourner les permissions backend.
- Si `/doctors/:id` est rechargée directement par un patient et que le détail n’est pas disponible localement, utilise le repli prévu dans `tasks.md` : retour au catalogue ou message explicite, sans appeler une route admin-only pour contourner le backend.
- Affiche des états explicites `loading`, `error`, `empty` et `success`.
- Gère au minimum les statuts `400`, `401`, `403`, `404`, `409`, `413` et `429` lorsque la tâche les concerne.

## Procédure d’implémentation

1. Identifie les tâches exactes correspondant à `$ARGUMENTS`.
2. Liste mentalement les fichiers autorisés par les critères de ces tâches.
3. Lis ces fichiers avant de les modifier.
4. Implémente uniquement ces tâches.
5. Vérifie que les critères d’acceptation sont respectés.
6. Vérifie qu’aucun fichier `backend/` n’a été modifié.

## Clôture obligatoire

1. Coche `- [x]` uniquement les tâches effectivement terminées dans `tasks.md`.
2. Si des critères restent incomplets, laisse la tâche décochée et explique le blocage.
3. Si des fichiers JavaScript ou JSX ont été modifiés, lance :

```bash
npm run lint
```

depuis `frontend/`.

4. Lance aussi `npm run build` lorsque la modification concerne la compilation, le routing, Vite ou les dépendances.
5. Fournis un résumé court en français contenant :
   - les fichiers créés ou modifiés ;
   - les tâches cochées ;
   - les vérifications effectuées ;
   - les éventuels blocages ;
   - la prochaine tâche recommandée.
