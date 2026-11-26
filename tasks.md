# Tâches d’implémentation frontend

> Source de vérité : `AGENT.md` et `plan.md`.  
> Le dossier `backend/` est figé. Cette liste ne prévoit aucune modification dans `backend/`.
>
> Aucun fichier `AGENT_2.md` n’est présent dans le projet ; les cas limites sont donc repris depuis `AGENT.md`, notamment le `POST /auth/logout` qui peut répondre `204` sans cookie ou `200` avec `status: "fail"` et le repli obligatoire lorsque `/doctors/:id` est rechargé directement par un patient.

## Étape 1 — Socle, nettoyage et design de base

- [x] **1.1 — Vérifier le socle existant**
  - Fichiers à inspecter : `frontend/package.json`, `frontend/src/main.jsx`, `frontend/src/App.jsx`, `frontend/src/routes.jsx`, `frontend/src/index.css`.
  - Critères d’acceptation :
    - `npm run lint` et `npm run build` sont exécutables avant les nouvelles fonctionnalités.
    - Aucun fichier de `backend/` n’est modifié.
    - Le routing basé sur `createBrowserRouter` et le layout `Header`/`Outlet`/`Footer` restent utilisés.

- [x] **1.2 — Préparer la structure frontend**
  - Fichiers à créer : `frontend/src/api/`, `frontend/src/context/`, `frontend/src/components/`, `frontend/src/routes/`, `frontend/src/utils/`.
  - Fichiers à modifier : `frontend/src/App.jsx`, `frontend/src/routes.jsx`.
  - Critères d’acceptation :
    - Les appels réseau ne sont pas placés directement dans les pages.
    - Les composants réutilisables sont séparés des pages.
    - Le dossier existant `frontend/src/compnents/` n’est pas supprimé brutalement.
    - Les imports existants continuent de fonctionner pendant la migration vers `components/`.

- [x] **1.3 — Définir les tokens de palette**
  - Fichier à modifier : `frontend/src/index.css`.
  - Critères d’acceptation :
    - Les tokens utilisent exactement `#e0fbfc`, `#c2dfe3`, `#9db4c0`, `#5c6b73`, `#253237`.
    - Le mode clair utilise `#e0fbfc` comme fond principal et `#253237` pour le texte principal.
    - Le mode sombre utilise `#253237` comme surface sombre, avec `#e0fbfc` et `#c2dfe3` pour le texte lisible.
    - `#9db4c0` n’est jamais utilisé seul pour du petit texte.
    - Les bordures, surfaces, boutons primaires, textes secondaires, focus et erreurs ont des variables sémantiques.

- [x] **1.4 — Ajouter les styles responsive globaux**
  - Fichier à modifier : `frontend/src/index.css`.
  - Critères d’acceptation :
    - L’approche est mobile-first.
    - Les contenus ne débordent pas à 320 px de largeur.
    - Les grilles passent d’une colonne mobile à deux colonnes tablette puis trois/quatre colonnes desktop.
    - Les tableaux admin disposent d’une présentation carte ou d’un scroll horizontal contrôlé sur mobile.
    - Les règles utilisent `margin-inline`, `padding-inline` et `text-align: start` lorsque cela est pertinent pour RTL.

- [x] **1.5 — Finaliser le shell de l’application**
  - Fichiers à modifier : `frontend/src/App.jsx`, `frontend/src/compnents/Header.jsx`, `frontend/src/compnents/Footer.jsx`, éventuellement `frontend/src/components/layout/AppLayout.jsx`.
  - Critères d’acceptation :
    - Le shell conserve `Header`, `Outlet` et `Footer`.
    - Le footer reste utilisable sur mobile.
    - Aucun texte d’action essentiel n’est codé uniquement en français ou en anglais dans le shell.
    - Le shell respecte les tokens light/dark et les trois langues.

- [x] **1.6 — Corriger le titre et la langue HTML**
  - Fichier à modifier : `frontend/index.html`.
  - Critères d’acceptation :
    - Le titre n’est plus `radix`.
    - La valeur initiale `lang` correspond à la langue par défaut retenue.
    - Le changement de langue met aussi à jour `document.documentElement.lang`.

## Étape 2 — Dépendances, proxy et client réseau

- [x] **2.1 — Ajouter les dépendances autorisées**
  - Fichiers à modifier : `frontend/package.json`, `frontend/package-lock.json`.
  - Critères d’acceptation :
    - Seules `axios` et `@tanstack/react-query` sont ajoutées.
    - Les dépendances existantes ne sont pas remplacées inutilement.
    - `npm install`, `npm run lint` et `npm run build` restent fonctionnels.

- [x] **2.2 — Configurer le proxy Vite**
  - Fichier à modifier : `frontend/vite.config.js`.
  - Critères d’acceptation :
    - `/api/auth/login` est proxyfié vers `http://localhost:5000/auth/login`.
    - `/api/doctor/getSpecialties` est proxyfié vers `http://localhost:5000/doctor/getSpecialties`.
    - Le préfixe `/api` est retiré, car le backend n’en possède pas.
    - Aucun secret backend n’est ajouté à la configuration frontend.

- [x] **2.3 — Créer `axiosInstance`**
  - Fichier à créer : `frontend/src/api/axiosInstance.js`.
  - Critères d’acceptation :
    - `baseURL` vaut `/api`.
    - `withCredentials` vaut `true`.
    - Les requêtes JSON utilisent `Content-Type: application/json`.
    - Un access token est ajouté uniquement sous la forme `Authorization: Bearer <accessToken>`.
    - Aucun token, mot de passe ou cookie n’est écrit dans les logs.

- [x] **2.4 — Créer le provider TanStack Query**
  - Fichiers à modifier : `frontend/src/main.jsx`.
  - Fichiers à créer éventuellement : `frontend/src/config/queryClient.js`.
  - Critères d’acceptation :
    - `QueryClientProvider` englobe le router.
    - Les erreurs `400`, `401`, `403`, `404` ne sont pas retentées automatiquement.
    - Les erreurs réseau peuvent avoir un retry limité.
    - Les tokens ne sont pas stockés dans le cache React Query.

- [x] **2.5 — Créer l’extraction d’erreurs**
  - Fichier à créer : `frontend/src/utils/apiError.js`.
  - Critères d’acceptation :
    - La fonction lit en priorité `error.response.data.data.title`.
    - Elle gère ensuite `error.response.data.message`.
    - Elle gère les erreurs réseau Axios et fournit un fallback traduit.
    - Elle distingue les statuts `400`, `401`, `403`, `404`, `409`, `413` et `429`.
    - Elle n’affiche jamais de stack trace ou de secret.

## Étape 3 — Session, authentification et gardes

- [x] **3.1 — Créer l’API d’authentification**
  - Fichier à créer : `frontend/src/api/authApi.js`.
  - Critères d’acceptation :
    - `register` appelle `POST /auth/register` avec uniquement `name`, `email`, `phone`, `password`.
    - `isAdmin` n’est jamais envoyé par un formulaire public.
    - `login` appelle `POST /auth/login`.
    - `refresh` appelle `GET /auth/refresh` avec les cookies.
    - `logout` appelle `POST /auth/logout`.

- [x] **3.2 — Gérer correctement le logout**
  - Fichiers à modifier : `frontend/src/api/authApi.js`, `frontend/src/context/AuthContext.jsx`, `frontend/src/compnents/Header.jsx`.
  - Critères d’acceptation :
    - Une réponse `204 No Content` sans cookie est considérée comme un logout réussi.
    - Une réponse `200` avec `{ status: "fail", data: { title: "Logout success" } }` est également considérée comme un logout réussi.
    - L’état local est vidé même si la réponse de logout est atypique.
    - L’utilisateur est redirigé vers `/login`.

- [x] **3.3 — Créer `AuthContext` et `useAuth`**
  - Fichiers à créer : `frontend/src/context/AuthContext.jsx`, `frontend/src/hooks/useAuth.js`.
  - Critères d’acceptation :
    - Le contexte expose `user`, `accessToken`, `isAuthenticated`, `isAdmin`, `isInitializing`.
    - Il expose `login`, `register`, `logout`, `refreshSession`.
    - Le refresh token n’est jamais lu par JavaScript.
    - L’access token n’est pas inclus dans les données de page ou les logs.
    - Un refresh initial est tenté avant toute décision de redirection.

- [x] **3.4 — Ajouter l’interceptor de refresh**
  - Fichier à modifier : `frontend/src/api/axiosInstance.js`.
  - Fichiers à créer éventuellement : `frontend/src/api/tokenStore.js`.
  - Critères d’acceptation :
    - Une seule requête `GET /auth/refresh` est lancée lorsqu’une ou plusieurs requêtes reçoivent `401`.
    - Les requêtes concurrentes sont mises en attente puis rejouées avec le nouveau token.
    - `/auth/refresh` ne déclenche pas de boucle de refresh.
    - Un échec de refresh vide la session et redirige vers `/login`.
    - Une réponse `403` affiche une erreur d’autorisation sans boucle.

- [x] **3.5 — Créer les gardes de routes**
  - Fichiers à créer : `frontend/src/components/auth/ProtectedRoute.jsx`, `frontend/src/components/auth/AdminRoute.jsx`.
  - Fichiers à modifier : `frontend/src/routes.jsx`.
  - Critères d’acceptation :
    - Un loader est affiché pendant `isInitializing`.
    - Un visiteur est redirigé vers `/login` avec la route d’origine conservée.
    - Un utilisateur connecté peut accéder aux routes patient.
    - Un utilisateur non-admin ne peut pas accéder aux routes `/admin`.
    - Les gardes ne se basent pas uniquement sur le chemin URL.

- [x] **3.6 — Brancher le router existant**
  - Fichier à modifier : `frontend/src/routes.jsx`.
  - Critères d’acceptation :
    - `/login` et `/register` restent publiques.
    - `/profile` devient réellement protégée.
    - Le booléen `const auth = true` disparaît.
    - Le catch-all `NotFound` reste présent.
    - Les nouvelles routes sont ajoutées au router existant, sans second router.

- [x] **3.7 — Brancher le header sur la session**
  - Fichier à modifier : `frontend/src/compnents/Header.jsx`.
  - Critères d’acceptation :
    - `const isAuthenticated = true` disparaît.
    - Le menu connecté/non connecté dépend de `AuthContext`.
    - Le profil et le logout fonctionnent sur desktop et mobile.
    - Un admin dispose d’un lien vers `/admin`.
    - Les labels restent traduits et RTL-safe.

## Étape 4 — Thème, langues et RTL

- [ ] **4.1 — Stabiliser `useTheme`**
  - Fichier à modifier : `frontend/src/hooks/useTheme.js`.
  - Critères d’acceptation :
    - `light`, `dark` et `system` sont conservés.
    - La préférence reste persistée dans `localStorage`.
    - Le changement de préférence système fonctionne uniquement en mode `system`.
    - La classe `dark` est appliquée sur `document.documentElement`.
    - Aucun accès DOM inutile n’est effectué pendant le rendu.

- [ ] **4.2 — Synchroniser la langue et la direction**
  - Fichiers à modifier : `frontend/src/main.jsx`, `frontend/src/config/i18n.js`.
  - Critères d’acceptation :
    - `fr` et `en` définissent `lang` et `dir="ltr"`.
    - `ar` définit `lang="ar"` et `dir="rtl"`.
    - Radix reçoit la même direction.
    - Le changement de langue est appliqué sans rechargement.

- [ ] **4.3 — Compléter les traductions**
  - Fichiers à modifier : `frontend/src/locales/fr.json`, `frontend/src/locales/en.json`, `frontend/src/locales/ar.json`.
  - Critères d’acceptation :
    - Les trois fichiers possèdent les mêmes clés.
    - Les clés couvrent navigation, loading, erreurs, formulaire, patient, admin, médecins, rendez-vous et tickets.
    - Aucun texte fonctionnel codé en dur ne reste dans les nouvelles pages.
    - Les messages `Invalid credentials`, `Unauthorized`, `Forbidden`, `Appointment is booked`, `Patient already have ticket`, `All tickets for today are booked` et `Logout success` ont une traduction.

- [ ] **4.4 — Tester la palette dans les deux thèmes**
  - Fichiers à modifier : `frontend/src/index.css` et composants concernés.
  - Critères d’acceptation :
    - Les surfaces, cartes, boutons, bordures et textes utilisent les tokens.
    - Les cinq couleurs demandées sont visibles avec un rôle cohérent.
    - Les contrastes restent lisibles en light et dark.
    - Les composants restent lisibles en `fr`, `en` et `ar`.

## Étape 5 — APIs métier et hooks React Query

- [ ] **5.1 — Créer les API Users**
  - Fichier à créer : `frontend/src/api/usersApi.js`.
  - Critères d’acceptation :
    - Les méthodes correspondent exactement à `/users/`, `/users/:id` et `/users/upload-user-image`.
    - Les permissions admin/propriétaire sont documentées dans les fonctions.
    - Les uploads utilisent `FormData.append("image", file)`.
    - La taille frontend maximale est 1 MiB.

- [ ] **5.2 — Créer les API Doctors**
  - Fichier à créer : `frontend/src/api/doctorsApi.js`.
  - Critères d’acceptation :
    - Les spécialités et médecins par spécialité utilisent les routes publiques.
    - Les routes CRUD utilisent les routes admin.
    - Les payloads utilisent `fullName`, `specialty`, `email`, `phone`, `bio`.
    - L’upload médecin utilise le champ `image`.

- [ ] **5.3 — Créer les API Appointments**
  - Fichier à créer : `frontend/src/api/appointmentsApi.js`.
  - Critères d’acceptation :
    - La création envoie uniquement `doctorId` et `appointmentDate`.
    - Le frontend n’envoie jamais `barcode` ni `barcodeImage`.
    - Les réponses utilisent `data.appointment` et `data.appointments`.
    - Le médecin est lu via `doctor.fullName`.

- [ ] **5.4 — Créer les hooks Doctors**
  - Fichier à créer : `frontend/src/hooks/useDoctors.js`.
  - Critères d’acceptation :
    - Hooks pour specialties, doctors by specialty, admin doctors et doctor patients.
    - Les clés Query sont stables et documentées.
    - Les états loading/error/empty sont directement exploitables par les pages.

- [ ] **5.5 — Créer les hooks Appointments**
  - Fichier à créer : `frontend/src/hooks/useAppointments.js`.
  - Critères d’acceptation :
    - Query des rendez-vous patient.
    - Query admin de tous les rendez-vous.
    - Mutation de création.
    - Mutation d’annulation.
    - Invalidation de la liste après création ou annulation.

- [ ] **5.6 — Créer les hooks Users**
  - Fichier à créer : `frontend/src/hooks/useUsers.js`.
  - Critères d’acceptation :
    - Queries admin users/user.
    - Mutations update/delete/upload.
    - Invalidation après chaque mutation.
    - Aucun mot de passe présent dans l’état affiché.

- [ ] **5.7 — Créer les helpers de date, créneaux et barcode**
  - Fichiers à créer : `frontend/src/utils/date.js`, `frontend/src/utils/appointmentSlots.js`, `frontend/src/utils/barcode.js`.
  - Critères d’acceptation :
    - `appointmentSlots.js` génère `08:00` à `15:30` par pas de 30 minutes.
    - Les créneaux passés sont masqués ou désactivés.
    - Les dates sont formatées selon la langue courante.
    - `barcode.js` affiche seulement les données backend et ne génère aucun code.

## Étape 6 — Login et Register

- [ ] **6.1 — Connecter `Login`**
  - Fichier à modifier : `frontend/src/pages/Login.jsx`.
  - Critères d’acceptation :
    - Le submit appelle `login({ email, password })`.
    - Un bouton loading empêche les doubles soumissions.
    - Une erreur `Invalid credentials` est affichée sans détail sensible.
    - Une réussite redirige vers la destination demandée ou `/`.
    - Le layout reste responsive et lisible dans les trois langues.

- [ ] **6.2 — Connecter `Register`**
  - Fichier à modifier : `frontend/src/pages/Register.jsx`.
  - Critères d’acceptation :
    - Ajouter le champ obligatoire `phone`.
    - Envoyer `name`, `email`, `phone`, `password`, sans `isAdmin`.
    - Afficher le conflit `409 User already exists`.
    - Afficher les erreurs de validation backend.
    - Une réussite redirige vers `/login` ou connecte explicitement selon le flux choisi.

- [ ] **6.3 — Valider les formulaires**
  - Fichiers à modifier : `Login.jsx`, `Register.jsx`, fichiers de traductions.
  - Critères d’acceptation :
    - Labels accessibles et associés aux champs.
    - Validation native et messages traduits.
    - Champs utilisables au clavier et en RTL.
    - Aucun mot de passe n’est loggé.

## Étape 7 — Parcours patient

- [ ] **7.1 — Transformer `Home` en accueil patient**
  - Fichier à modifier : `frontend/src/pages/Home.jsx`.
  - Critères d’acceptation :
    - Présenter l’hôpital et un CTA vers les médecins.
    - Afficher spécialités ou accès au catalogue.
    - Prévoir les états loading/empty/error si des données sont chargées.
    - Responsive sur mobile, tablette et desktop.

- [ ] **7.2 — Créer le catalogue médecins**
  - Fichiers à créer : `frontend/src/pages/patient/DoctorsPage.jsx`, `frontend/src/components/doctors/DoctorCard.jsx`, `frontend/src/components/doctors/SpecialtyFilter.jsx`.
  - Critères d’acceptation :
    - Charger `GET /doctor/getSpecialties`.
    - Charger `GET /doctor/specialty/:specialty`.
    - Afficher `fullName`, `specialty`, `bio`, `profilePhoto.url`.
    - Gérer spécialité absente, aucun médecin et erreur `404`.
    - Grille responsive avec palette light/dark.

- [ ] **7.3 — Créer le détail et la réservation**
  - Fichiers à créer : `frontend/src/pages/patient/DoctorDetailsPage.jsx`, `frontend/src/components/appointments/AppointmentBookingForm.jsx`, `frontend/src/utils/appointmentSlots.js`.
  - Critères d’acceptation :
    - Utiliser le médecin transmis depuis la liste ou un état persistant simple.
    - Si `/doctors/:id` est rechargé directement par un patient et que la donnée n’est pas disponible, afficher un repli clair : retour au catalogue avec message traduit ; ne pas appeler l’endpoint admin-only pour contourner le backend.
    - Envoyer `doctorId` et `appointmentDate`.
    - Proposer uniquement `08:00` à `15:30` par pas de 30 minutes.
    - Désactiver les dates passées et les créneaux invalides.
    - Afficher `Patient already have ticket`, `All tickets for today are booked`, `Appointment is booked`.

- [ ] **7.4 — Créer la liste des tickets**
  - Fichiers à créer : `frontend/src/pages/patient/AppointmentsPage.jsx`, `frontend/src/components/appointments/AppointmentCard.jsx`.
  - Critères d’acceptation :
    - Appeler `GET /appointment/:userId`.
    - Lire `data.appointments`.
    - Afficher `appointmentDate`, `doctor.fullName`, `barcode`, `barcodeImage`.
    - Gérer `404` comme état vide et non comme crash.
    - Cartes mobiles, affichage plus dense desktop.

- [ ] **7.5 — Créer le détail ticket et barcode**
  - Fichiers à créer : `frontend/src/pages/patient/AppointmentDetailsPage.jsx`, `frontend/src/components/appointments/BarcodeTicket.jsx`.
  - Critères d’acceptation :
    - Afficher le texte `HOSP-...`.
    - Afficher `barcodeImage` avec son data URI PNG.
    - Le conteneur barcode reste LTR en arabe.
    - Prévoir impression/téléchargement navigateur sans modifier la donnée reçue.

- [ ] **7.6 — Ajouter l’annulation**
  - Fichiers à modifier : `AppointmentCard.jsx`, `AppointmentsPage.jsx`, hooks/API appointments.
  - Critères d’acceptation :
    - Confirmation avant `DELETE /appointment/:id`.
    - Le propriétaire peut annuler son propre rendez-vous.
    - Les erreurs `403` sont affichées comme refus d’autorisation.
    - La query des rendez-vous est invalidée après succès.

- [ ] **7.7 — Connecter le profil**
  - Fichier à modifier : `frontend/src/pages/Profile.jsx`.
  - Fichiers à créer éventuellement : `frontend/src/components/users/ProfileForm.jsx`, `frontend/src/components/users/ProfilePhotoUpload.jsx`.
  - Critères d’acceptation :
    - Supprimer les données factices et l’avatar Unsplash.
    - Afficher `name`, `email`, `phone`, `profilePhoto`.
    - Upload avec `FormData` et champ `image`.
    - Refuser côté client un fichier de plus de 1 MiB ou d’un format non supporté.
    - Respecter la contrainte backend du `password` lors de `PUT /users/:id`.

## Étape 8 — Parcours admin

- [ ] **8.1 — Créer le layout admin**
  - Fichiers à créer : `frontend/src/pages/admin/AdminLayout.jsx`, `frontend/src/pages/admin/AdminDashboardPage.jsx`.
  - Fichiers à modifier : `frontend/src/routes.jsx`, `frontend/src/components/layout/Header.jsx` ou `frontend/src/compnents/Header.jsx`.
  - Critères d’acceptation :
    - Toutes les routes admin sont derrière `AdminRoute`.
    - Un patient reçoit une redirection ou une page 403.
    - Sidebar/navigation responsive.
    - Compteurs et erreurs possèdent des états de chargement.

- [ ] **8.2 — Implémenter le CRUD médecins**
  - Fichiers à créer : `frontend/src/pages/admin/AdminDoctorsPage.jsx`, `frontend/src/components/doctors/DoctorForm.jsx`, `frontend/src/components/doctors/DoctorTable.jsx`.
  - Critères d’acceptation :
    - CRUD via les endpoints admin exacts.
    - Champs : `fullName`, `specialty`, `email`, `phone`, `bio`.
    - Spécialités limitées à `Dental`, `Children`, `Cardiology`, `Opthalmology`.
    - Confirmation avant suppression.
    - Table desktop et cartes/scroll contrôlé mobile.

- [ ] **8.3 — Ajouter upload photo médecin**
  - Fichiers à modifier : page et composants médecins admin.
  - Critères d’acceptation :
    - Upload `FormData` champ `image`.
    - Taille maximale 1 MiB.
    - Formats PNG/JPEG/GIF/WEBP.
    - Gestion des erreurs `400`, `403`, `404`, `413`.
    - Mise à jour visuelle de `profilePhoto.url` après succès.

- [ ] **8.4 — Afficher les patients d’un médecin**
  - Fichiers à créer : `frontend/src/pages/admin/DoctorPatientsPage.jsx`, `frontend/src/components/users/PatientTable.jsx`.
  - Critères d’acceptation :
    - Appeler `GET /doctor/doctors/:id/patients`.
    - Afficher `_id`, `fullName`, `email`, `phone`.
    - Gérer une liste vide sans afficher une erreur.
    - Responsive et RTL.

- [ ] **8.5 — Implémenter la gestion utilisateurs**
  - Fichiers à créer : `frontend/src/pages/admin/AdminUsersPage.jsx`, `frontend/src/components/users/UserTable.jsx`.
  - Critères d’acceptation :
    - Utiliser `GET /users/`, `GET /users/:id`, `DELETE /users/:id`.
    - Ne jamais afficher `password` ni les champs reset.
    - Confirmation avant suppression.
    - Gérer `403` et `404`.

- [ ] **8.6 — Implémenter le suivi admin des rendez-vous**
  - Fichiers à créer : `frontend/src/pages/admin/AdminAppointmentsPage.jsx`, `frontend/src/components/appointments/AdminAppointmentTable.jsx`.
  - Critères d’acceptation :
    - Appeler `GET /appointment/`.
    - Afficher `appointmentDate`, `barcode`, `doctor.fullName`, `doctor.specialty`.
    - Gérer `404` “aucun rendez-vous” comme un état vide.
    - Table responsive et lisible en arabe.

## Étape 9 — Qualité, accessibilité et cas limites

- [ ] **9.1 — Ajouter les composants d’état communs**
  - Fichiers à créer : `frontend/src/components/common/LoadingState.jsx`, `frontend/src/components/common/ErrorState.jsx`, `frontend/src/components/common/EmptyState.jsx`.
  - Critères d’acceptation :
    - Les pages n’affichent jamais une zone vide silencieuse pendant une requête.
    - Les messages sont traduits.
    - Les boutons de retry sont accessibles.
    - Les états respectent light/dark et la palette.

- [ ] **9.2 — Vérifier les cas d’authentification**
  - Fichiers concernés : `frontend/src/context/AuthContext.jsx`, `frontend/src/api/axiosInstance.js`, `frontend/src/routes.jsx`.
  - Critères d’acceptation :
    - Absence de cookie refresh.
    - Access token expiré.
    - Refresh refusé `403`.
    - Logout `204`.
    - Logout `200` avec `status: "fail"` et `title: "Logout success"`.
    - Un utilisateur non-admin ne voit pas les pages admin.

- [ ] **9.3 — Vérifier les cas API métier**
  - Fichiers concernés : hooks, pages et `frontend/src/utils/apiError.js`.
  - Critères d’acceptation :
    - Les enveloppes `data.title`, `message`, `status` et statuts HTTP sont correctement décodées.
    - Les clés `appointment`/`appointments` sont utilisées.
    - Les anciennes clés `appointmen`/`appointmens` ne sont pas utilisées.
    - `Doctor.fullName` est utilisé partout.
    - Les erreurs `409` de doublon et de créneau réservé sont lisibles.

- [ ] **9.4 — Audit responsive**
  - Fichiers à vérifier : `frontend/src/index.css`, toutes les pages et tous les composants visuels.
  - Critères d’acceptation :
    - Tests à 320 px, 768 px et desktop.
    - Aucun overflow horizontal non intentionnel.
    - Les tableaux basculent correctement vers cartes ou scroll.
    - Les modales et boutons restent utilisables au tactile.

- [ ] **9.5 — Audit thème et RTL**
  - Fichiers à vérifier : `frontend/src/hooks/useTheme.js`, `frontend/src/main.jsx`, `frontend/src/index.css`, traductions et composants.
  - Critères d’acceptation :
    - Light, dark et system fonctionnent après navigation.
    - Les cinq couleurs demandées sont cohérentes dans les deux modes.
    - `fr`/`en` sont LTR et `ar` est RTL.
    - Les icônes, espacements, formulaires, cartes et tableaux restent corrects en RTL.

- [ ] **9.6 — Audit accessibilité**
  - Fichiers à vérifier : pages, formulaires, modales et composants communs.
  - Critères d’acceptation :
    - Tous les champs ont un label.
    - Les erreurs sont associées au champ concerné.
    - Les boutons ont un nom accessible.
    - Le focus clavier est visible.
    - Les loaders et changements de contenu sont compréhensibles par les technologies d’assistance.

## Étape 10 — Validation finale

- [ ] **10.1 — Vérifier lint et build**
  - Fichiers concernés : tout `frontend/`.
  - Critères d’acceptation :
    - `npm run lint` passe sans erreur.
    - `npm run build` passe sans erreur.
    - Aucun import mort ou chemin vers un fichier supprimé.

- [ ] **10.2 — Vérifier le parcours public**
  - Fichiers concernés : routes, `Home`, `Login`, `Register`, pages médecins.
  - Critères d’acceptation :
    - `/login`, `/register`, `/`, `/doctors` et `NotFound` fonctionnent.
    - Le switch de langue fonctionne sur chaque route.
    - Les spécialités publiques sont chargées sans access token.

- [ ] **10.3 — Vérifier le parcours patient**
  - Fichiers concernés : pages patient et hooks associés.
  - Critères d’acceptation :
    - Login, réservation, tickets, barcode, annulation et profil fonctionnent.
    - Le rechargement direct de `/doctors/:id` par un patient utilise le repli prévu sans contourner l’autorisation backend.
    - Les créneaux sont uniquement 08:00–15:30, toutes les 30 minutes.

- [ ] **10.4 — Vérifier le parcours admin**
  - Fichiers concernés : pages admin, `AdminRoute`, hooks admin.
  - Critères d’acceptation :
    - CRUD médecins, photos, patients, utilisateurs et rendez-vous fonctionnent.
    - Un patient ne peut pas accéder aux vues admin.
    - Aucun mot de passe ou champ reset n’est affiché.

- [ ] **10.5 — Vérifier les cookies et le refresh**
  - Fichiers concernés : `axiosInstance`, `AuthContext`, `vite.config.js`.
  - Critères d’acceptation :
    - Les requêtes utilisent `credentials`.
    - Le cookie `jwt` n’est jamais lu par le frontend.
    - Une expiration d’access token est récupérée une seule fois.
    - Les requêtes concurrentes sont rejouées sans duplication de refresh.

- [ ] **10.6 — Vérifier l’absence de fuite sensible**
  - Fichiers à vérifier : tout `frontend/src/`.
  - Critères d’acceptation :
    - Aucun token, mot de passe, secret ou body sensible dans `console.log`.
    - Aucun secret backend dans les fichiers frontend.
    - Aucun accès direct MongoDB.
    - Aucun fichier de `backend/` n’a été modifié.
