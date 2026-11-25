# Plan de construction du frontend — Hospital Ticket App

## Contraintes

- `backend/` est complet et figé : ne modifier, créer ou supprimer aucun fichier dans ce dossier.
- `AGENT.md` est la référence prioritaire pour toute intégration API.
- Ce fichier décrit uniquement le plan : aucun code de page n’est ajouté dans cette étape.
- Conserver React + Vite + JavaScript/JSX.
- Ajouter uniquement `axios` et `@tanstack/react-query`.
- Le frontend ne se connecte jamais directement à MongoDB : toutes les données passent par l’API.

## 1. État actuel de `frontend/`

### Déjà présent

- React 19, React DOM, Vite.
- `react-router-dom` avec `createBrowserRouter`/`RouterProvider`.
- Radix UI et `@radix-ui/react-icons`.
- `react-i18next` et `i18next-browser-languagedetector`.
- Layout global dans `src/App.jsx` avec `Header`, `Outlet`, `Footer`.
- Pages existantes : `Home`, `Login`, `Register`, `Profile`, `NotFound`.
- Hook `src/hooks/useTheme.js` gérant `light`, `dark`, `system`, `localStorage` et `prefers-color-scheme`.
- Switch de thème déjà présent dans `Header.jsx`.
- Langues `fr`, `en`, `ar` déjà configurées dans `src/config/i18n.js`.
- `main.jsx` transmet déjà `dir="rtl"` à Radix pour l’arabe.

### À compléter

- `routes.jsx` utilise encore `const auth = true` en dur.
- `Header.jsx` utilise encore `const isAuthenticated = true` en dur.
- `Login`, `Register` et `Profile` n’appellent pas l’API.
- `onLogout` est un simple `console.log`.
- `Register` ne demande pas encore `phone`, pourtant obligatoire côté backend.
- `Profile` utilise des données factices.
- Aucun `axiosInstance`, contexte d’authentification ou provider TanStack Query.
- `vite.config.js` ne contient aucun proxy.
- `index.css` ne contient pas encore le design system demandé.
- Le dossier existant s’appelle `src/compnents/` ; ne pas le supprimer brutalement. Utiliser progressivement `src/components/` puis migrer les imports.
- `index.html` utilise encore `lang="en"` et le titre `radix`.
- Les fichiers de traduction couvrent actuellement seulement le header, footer, auth, profile et 404.

### Bibliothèques

Dépendances déjà installées :

```text
react
react-dom
react-router-dom
@radix-ui/themes
@radix-ui/react-icons
react-i18next
i18next-browser-languagedetector
```

À ajouter :

```bash
npm install axios @tanstack/react-query
```

Ne pas recréer le routing, le switch de thème ou i18n : les compléter.

## 2. Design system et responsive

### Tokens CSS

Définir les tokens dans `src/index.css` :

```css
:root {
  --color-ice: #e0fbfc;
  --color-mist: #c2dfe3;
  --color-slate: #9db4c0;
  --color-steel: #5c6b73;
  --color-ink: #253237;

  --color-bg: var(--color-ice);
  --color-surface: #ffffff;
  --color-surface-muted: var(--color-mist);
  --color-text: var(--color-ink);
  --color-text-muted: var(--color-steel);
  --color-border: var(--color-slate);
  --color-primary: var(--color-steel);
  --color-primary-strong: var(--color-ink);
  --color-on-primary: #ffffff;
}

:root.dark {
  --color-bg: #182428;
  --color-surface: #253237;
  --color-surface-muted: #34454b;
  --color-text: #e0fbfc;
  --color-text-muted: #c2dfe3;
  --color-border: #5c6b73;
  --color-primary: #9db4c0;
  --color-primary-strong: #c2dfe3;
  --color-on-primary: #182428;
}
```

Rôles :

- `#e0fbfc` : fond clair, texte clair sur surfaces foncées, highlights.
- `#c2dfe3` : surfaces secondaires, badges et hover doux.
- `#9db4c0` : bordures, séparateurs, états désactivés.
- `#5c6b73` : boutons primaires clairs, icônes et texte secondaire fort.
- `#253237` : titres clairs, navigation forte et surface principale dark.

Ne pas utiliser `#9db4c0` seul pour du petit texte. Prévoir des focus visibles, erreurs accessibles et contrastes suffisants.

### Responsive

- Approche mobile-first.
- Une colonne sur mobile, grilles de cartes à 2 colonnes sur tablette et 3–4 sur desktop.
- Les tableaux admin deviennent des cartes empilées sur mobile.
- Les formulaires passent de une à deux colonnes uniquement sur grand écran.
- Les créneaux de rendez-vous utilisent une grille flexible.
- Les modales occupent presque toute la largeur mobile.
- Utiliser `margin-inline`, `padding-inline`, `inset-inline` et `text-align: start` pour RTL.

### RTL

Pour `ar`, synchroniser :

```text
document.documentElement.lang = "ar"
document.documentElement.dir = "rtl"
Theme dir="rtl"
```

Pour `fr`/`en`, utiliser `ltr`. Vérifier menus, icônes directionnelles, champs, tableaux, breadcrumbs et dates. Les codes-barres restent dans un conteneur visuel LTR.

## 3. Architecture proposée

```text
frontend/src/
├── api/
│   ├── axiosInstance.js
│   ├── authApi.js
│   ├── usersApi.js
│   ├── doctorsApi.js
│   └── appointmentsApi.js
├── components/
│   ├── layout/
│   ├── auth/
│   ├── common/
│   ├── doctors/
│   ├── appointments/
│   └── users/
├── config/i18n.js
├── context/AuthContext.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useTheme.js
│   ├── useDoctors.js
│   ├── useAppointments.js
│   └── useUsers.js
├── locales/
├── pages/
│   ├── auth/
│   ├── patient/
│   └── admin/
├── routes/routes.jsx
├── utils/
│   ├── apiError.js
│   ├── date.js
│   ├── appointmentSlots.js
│   └── barcode.js
└── index.css
```

- `api/` : fonctions réseau uniquement.
- `hooks/` : intégration React Query.
- `context/` : session globale.
- `pages/` : composition des vues.
- `components/` : composants réutilisables.
- `utils/` : fonctions pures.
- Chaque flux doit prévoir `loading`, `error`, `empty`, `success`.
- Aucun appel Axios directement depuis une page.

## 4. Axios, proxy et TanStack Query

### Proxy Vite

Le frontend utilise `/api` et Vite réécrit vers le backend :

```text
/api/auth/login        -> http://localhost:5000/auth/login
/api/doctor/getSpecialties -> http://localhost:5000/doctor/getSpecialties
```

Le backend n’a pas de préfixe `/api`. Le proxy doit donc supprimer ce préfixe. Garder `withCredentials: true` pour le cookie `jwt`.

### Axios

Prévoir :

```js
axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
```

Interceptor request :

- ajouter `Authorization: Bearer <accessToken>` si un access token existe ;
- ne jamais logger le token.

Interceptor response :

1. Sur `401`, appeler une seule fois `GET /auth/refresh`.
2. Rejouer les requêtes en attente avec le nouvel access token.
3. Ne pas intercepter `/auth/refresh` lui-même.
4. Si le refresh échoue, vider la session et rediriger vers `/login`.
5. Sur `403`, afficher une erreur d’autorisation sans boucle de refresh.

Le refresh token reste toujours dans le cookie HTTP-only. L’access token peut rester en mémoire ; une persistance courte en `sessionStorage` est possible si nécessaire.

### React Query

Monter `QueryClientProvider` dans `main.jsx`.

Configuration :

- pas de retry sur `400`, `401`, `403`, `404`;
- retry limité sur erreurs réseau;
- `staleTime` court pour session et rendez-vous;
- `invalidateQueries` après chaque mutation;
- aucun token dans le cache.

### Auth API

- `register({ name, email, phone, password })` → `POST /auth/register`.
- `login({ email, password })` → `POST /auth/login`.
- `refresh()` → `GET /auth/refresh`.
- `logout()` → `POST /auth/logout`.

Ne jamais envoyer `isAdmin`.

`AuthContext` expose :

```text
user
accessToken
isAuthenticated
isAdmin
isInitializing
login
register
logout
refreshSession
```

Au chargement, appeler `/auth/refresh` avant de décider d’une redirection.

### Users API

- `getUsers()` → `GET /users/`, admin.
- `getUser(id)` → `GET /users/:id`, admin.
- `updateUser(id, payload)` → `PUT /users/:id`, propriétaire.
- `deleteUser(id)` → `DELETE /users/:id`, admin.
- `uploadUserImage(file)` → `POST /users/upload-user-image`.

Upload :

```js
const formData = new FormData();
formData.append("image", file);
```

Ne pas fixer manuellement `Content-Type`. Vérifier côté client une taille maximale de 1 MiB et les formats PNG/JPEG/GIF/WEBP.

Limite backend : `PUT /users/:id` attend actuellement `name`, `email`, `password` et `phone`, et rehache toujours `password`. Le formulaire doit respecter ce contrat sans inventer une mise à jour partielle.

### Doctors API

- `getSpecialties()` → `GET /doctor/getSpecialties`, public.
- `getDoctorsBySpecialty(specialty)` → `GET /doctor/specialty/:specialty`, public.
- `createDoctor(payload)` → `POST /doctor/new`, admin.
- `getDoctors()` → `GET /doctor/doctors`, admin.
- `getDoctor(id)` → `GET /doctor/doctors/:id`, admin.
- `getDoctorPatients(id)` → `GET /doctor/doctors/:id/patients`, admin.
- `updateDoctor(id, payload)` → `PUT /doctor/doctors/:id`, admin.
- `deleteDoctor(id)` → `DELETE /doctor/doctors/:id`, admin.
- `uploadDoctorImage(id, file)` → `POST /doctor/upload-doctor-image/:id`, admin.

Utiliser `Doctor.fullName`, jamais `Doctor.name`.

Contrainte backend : `GET /doctor/doctors/:id` est admin-only. Le patient peut lister des médecins par spécialité mais ne peut pas recharger directement le détail par ID. Le détail patient doit réutiliser le médecin sélectionné depuis la liste ; ne pas contourner l’autorisation.

### Appointments API

- `createAppointment({ doctorId, appointmentDate })` → `POST /appointment/new`.
- `getAllAppointments()` → `GET /appointment/`, admin.
- `getPatientAppointments(patientId)` → `GET /appointment/:id`, admin ou propriétaire.
- `cancelAppointment(appointmentId)` → `DELETE /appointment/:id`, admin ou propriétaire.

Le backend génère le ticket :

```text
barcode: HOSP-...
barcodeImage: data:image/png;base64,...
```

Réponse de création : `data.appointment`.

Réponse liste : `data.appointments`.

Ne jamais utiliser `appointmen` ou `appointmens`.

Créneaux UI :

```text
08:00, 08:30, ..., 15:30
```

Afficher les erreurs `Patient already have ticket`, `All tickets for today are booked`, `Appointment is booked` et les erreurs de créneau.

### Erreurs

Centraliser `utils/apiError.js` avec cet ordre :

1. `error.response.data.data.title`;
2. `error.response.data.message`;
3. erreur réseau Axios;
4. fallback traduit.

Traiter séparément `401`, `403`, `404`, `409`, `413` et `429`.

## 5. Pages et routes

### Routes publiques

Conserver :

- `/login`;
- `/register`;
- `/*` → `NotFound`.

Remplacer `const auth = true` par `ProtectedRoute` et l’état d’`AuthContext`.

### Patient

#### `/`

- accueil de l’hôpital ;
- sélection de spécialité ;
- médecins disponibles ;
- CTA réservation ;
- états loading/empty/error.

#### `/doctors`

- `GET /doctor/getSpecialties`;
- `GET /doctor/specialty/:specialty`;
- cartes avec `fullName`, `specialty`, `bio`, `profilePhoto.url`;
- filtres et grille responsive.

#### `/doctors/:id`

- réutiliser le médecin sélectionné depuis la liste ;
- ne pas appeler comme patient l’endpoint admin-only de détail;
- formulaire `doctorId` + `appointmentDate`;
- grille 08:00–15:30, intervalle 30 minutes;
- confirmation, mutation et affichage du ticket.

#### `/appointments`

- `GET /appointment/:userId`;
- afficher date, médecin `fullName`, barcode et image;
- annulation avec confirmation;
- invalider `["appointments", userId]`.

#### `/appointments/:id`

- code `HOSP-...`;
- image base64;
- date et médecin;
- impression/téléchargement navigateur si souhaité.

#### `/profile`

- remplacer les données factices par `AuthContext`;
- afficher `name`, `email`, `phone`, `profilePhoto`;
- upload champ `image`;
- respecter la contrainte du mot de passe lors de `PUT /users/:id`.

### Admin

Toutes les routes admin utilisent `AdminRoute`.

#### `/admin`

- compteurs médecins, patients, rendez-vous;
- raccourcis de gestion;
- états loading/error.

#### `/admin/doctors`

- CRUD médecin;
- spécialités autorisées : `Dental`, `Children`, `Cardiology`, `Opthalmology`;
- upload photo;
- recherche, filtres et confirmations.

#### `/admin/doctors/:id/patients`

- `GET /doctor/doctors/:id/patients`;
- afficher `_id`, `fullName`, `email`, `phone`.

#### `/admin/users`

- liste, détail et suppression;
- ne jamais afficher `password` ou les champs reset.

#### `/admin/appointments`

- `GET /appointment/`;
- afficher `appointmentDate`, `barcode`, `doctor.fullName`, `doctor.specialty`;
- gérer l’absence de rendez-vous.

### Gardes

`ProtectedRoute` :

- afficher un loader pendant `isInitializing`;
- rediriger vers `/login` avec `location.state.from` si non connecté;
- sinon rendre l’enfant/`Outlet`.

`AdminRoute` :

- réutiliser `ProtectedRoute`;
- refuser si `user.isAdmin !== true`;
- ne jamais faire confiance uniquement à l’URL.

## 6. Roadmap progressive

### Étape 1 — Socle

- Vérifier build/lint.
- Préserver `Header`, `Footer`, `Home`, `Login`, `Register`, `Profile`.
- Migrer progressivement `compnents/` vers `components/`.
- Ajouter le titre correct et les tokens CSS.

### Étape 2 — Réseau

- Installer Axios et TanStack Query.
- Ajouter le proxy Vite `/api`.
- Créer `axiosInstance`.
- Monter `QueryClientProvider`.
- Tester `GET /doctor/getSpecialties`.

### Étape 3 — Auth

- Créer `AuthContext` et `useAuth`.
- Implémenter login/register/refresh/logout.
- Ajouter interceptors.
- Remplacer les booléens en dur dans `routes.jsx` et `Header.jsx`.
- Ajouter `ProtectedRoute` et `AdminRoute`.

### Étape 4 — Thème et i18n

- Ajouter les clés dans `fr.json`, `en.json`, `ar.json`.
- Déplacer tous les textes codés en dur vers i18n.
- Synchroniser `lang` et `dir` sur `<html>`.
- Tester light/dark/system et RTL.

### Étape 5 — Hooks métier

- Créer `authApi`, `usersApi`, `doctorsApi`, `appointmentsApi`.
- Créer les hooks React Query.
- Ajouter les invalidations après mutations.
- Centraliser les erreurs.

### Étape 6 — Login/Register

- Connecter les formulaires.
- Ajouter loading, erreurs et redirections.
- Ajouter `phone` au register.
- Ne jamais envoyer `isAdmin`.

### Étape 7 — Parcours patient

- Construire accueil et catalogue.
- Construire réservation et créneaux.
- Construire tickets, barcode et annulation.
- Connecter le profil et l’upload photo.

### Étape 8 — Parcours admin

- Dashboard.
- CRUD médecins et photos.
- Patients d’un médecin.
- Gestion utilisateurs.
- Suivi des rendez-vous.

### Étape 9 — Qualité

- Tester mobile/tablette/desktop.
- Tester clavier, focus et labels.
- Tester RTL sur formulaires et tableaux.
- Vérifier loading/empty/error/success.
- Vérifier l’impression du ticket.

### Étape 10 — Validation finale

```bash
npm run lint
npm run build
```

Puis tester :

- cookies `credentials`;
- refresh après expiration;
- `400`, `401`, `403`, `404`, `409`, `429`;
- absence de token/mot de passe dans les logs;
- aucun changement dans `backend/`.
