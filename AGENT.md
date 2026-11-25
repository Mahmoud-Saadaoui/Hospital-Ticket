# Référence API frontend — Hospital Ticket App

## Règles impératives

- Le dossier `backend/` est figé, complet et fonctionnel : **ne modifier, ne créer et ne supprimer aucun fichier dans `backend/` sauf demande explicite de l’utilisateur**.
- Consulter ce fichier en priorité pour toute intégration API frontend.
- Cette documentation décrit le code réellement présent dans `backend/`, y compris ses incohérences et bugs. Ne pas remplacer ces comportements par les comportements indiqués dans les commentaires du backend.
- Ne jamais exposer les secrets du fichier `backend/.env` dans le frontend, le dépôt ou les logs.

## État actuel après les phases 1 à 4 de sécurisation

Les corrections des phases 1 à 4 ont été appliquées dans `backend/`. Les règles suivantes remplacent les anciennes descriptions de comportement :

- L’inscription publique ne peut plus définir `isAdmin`; tout nouveau compte est créé avec `isAdmin: false`.
- Un email déjà existant lors de l’inscription retourne `409` et la création s’arrête.
- Les claims JWT utilisent désormais `isAdmin` de manière uniforme.
- Un JWT sans `userInfo.id` ou sans booléen `userInfo.isAdmin` est refusé avec `403`.
- `GET /users/`, `GET /users/:id` et `DELETE /users/:id` nécessitent désormais un administrateur.
- Les opérations d’administration des médecins nécessitent désormais un administrateur.
- Les uploads de photos de médecins nécessitent désormais un administrateur et vérifient que le médecin existe.
- `GET /doctor/getSpecialties` et `GET /doctor/specialty/:specialty` sont désormais publics, conformément à leurs commentaires.
- `GET /appointment/` nécessite désormais un administrateur.
- `GET /appointment/:id` autorise uniquement l’administrateur ou le propriétaire du patient.
- `DELETE /appointment/:id` autorise uniquement l’administrateur ou le propriétaire du rendez-vous.
- CORS utilise désormais directement `corsOption`, vérifie les origines avec `includes`, et autorise aussi `http://localhost:5173`.
- En développement, les cookies utilisent `secure: false` et `sameSite: "lax"`; en production (`NODE_ENV=production`), ils utilisent `secure: true` et `sameSite: "none"`.
- La déconnexion utilise les mêmes options de cookie que la création du cookie.
- Les erreurs d’authentification login utilisent désormais le message commun `Invalid credentials` pour éviter l’énumération des comptes.
- Les champs obligatoires des modèles utilisent désormais `required: true`; les emails User sont normalisés et uniques.
- Les relations `doctor` et `patient` des rendez-vous sont obligatoires.
- Les rendez-vous ont désormais un index unique `{ doctor, appointmentDate }`.
- Les identifiants médecin, patient et rendez-vous sont validés par `validateObjectId` ou `mongoose.Types.ObjectId.isValid`.
- La création d’un rendez-vous refuse les dates invalides, passées et les créneaux hors 08:00–16:00/30 minutes.
- La création d’un rendez-vous vérifie les tickets du patient et la capacité quotidienne de 16 créneaux au lieu de se baser directement sur `doctor.patients.length`.
- La création et l’annulation de rendez-vous utilisent une transaction MongoDB et l’annulation retire le patient de `doctor.patients` lorsqu’il n’a plus de rendez-vous futur.
- La mise à jour d’un utilisateur ignore son propre email lors de la détection des doublons et la suppression utilise directement l’identifiant.
- Les mises à jour User et Doctor utilisent désormais les validateurs Mongoose (`runValidators: true`).
- Le champ `User.password` est désormais exclu des requêtes Mongoose par défaut; le login l’inclut explicitement.
- Les réponses d’authentification retournent désormais `id`, `name`, `email` et `isAdmin`, sans `first_name`/`last_name`.
- Les réponses de rendez-vous utilisent désormais `appointment` et `appointments` au lieu de `appointmen`/`appointmens`.
- Les médecins peuplés dans les rendez-vous utilisent désormais `fullName`.
- Les erreurs asynchrones passent par `asyncHandler` et un gestionnaire global; les routes inconnues retournent `404`.
- Les erreurs Multer, validation Mongoose, CastError et doublons MongoDB sont normalisées.
- Les erreurs internes ne renvoient plus le message technique au client.
- Les erreurs d’authentification et d’identifiant utilisent désormais l’enveloppe `{ status: "fail", data: { title: "..." } }`.
- Les requêtes JSON sont limitées à 100 KiB et les tentatives d’inscription/login sont limitées à 10 par IP sur 15 minutes.
- Le serveur désactive `X-Powered-By` et ajoute des headers de sécurité (`nosniff`, `DENY`, `Referrer-Policy`, CSP).
- Les requêtes sont journalisées avec méthode, URL, statut et durée; aucun body, token ou mot de passe n’est journalisé.
- Les uploads vérifient les signatures binaires PNG, JPEG, GIF et WEBP en plus du MIME déclaré.
- Le dossier temporaire `backend/images` est créé automatiquement et les noms de fichiers sont nettoyés.
- Les fichiers temporaires sont supprimés dans un bloc `finally`, y compris lorsque Cloudinary ou MongoDB échoue.
- Les erreurs Cloudinary sont désormais relancées afin d’être traitées par le gestionnaire global.
- L’image code-barres utilise désormais `data:image/png;base64,...`.
- Les emails utilisent désormais `options.appointmentDate` et non `options.AppointmentDate`.

Les prochaines améliorations peuvent porter sur la rotation des secrets, une solution de rate limiting distribuée (Redis), une validation métier plus avancée des champs et des tests d’intégration automatisés.

## Configuration générale

- Port backend : `5000`.
- URL locale : `http://localhost:5000`.
- Aucun préfixe `/api`.
- Routes montées :
  - `/auth`
  - `/users`
  - `/doctor`
  - `/appointment`
- Le serveur utilise JSON (`express.json()`) et les cookies (`cookie-parser`).
- Le backend attend MongoDB avant de commencer à écouter.

### CORS et cookies

`allowedOrigins.js` contient `http://localhost:5000` et `http://localhost:5173`. `server.js` applique désormais directement `corsOption`.

Le refresh token est placé dans un cookie `jwt`. Les options dépendent de `NODE_ENV` :

- `httpOnly: true`
- développement : `secure: false`, `sameSite: "lax"`
- production : `secure: true`, `sameSite: "none"`
- durée : 7 jours

Les requêtes frontend qui doivent envoyer ou recevoir ce cookie doivent utiliser `credentials: "include"`. En développement HTTP local, `secure: true` peut empêcher le cookie d’être utilisé.

## Authentification et session

### Access token

Les routes protégées exigent :

```http
Authorization: Bearer <accessToken>
```

Le middleware `verifyJWT` :

- lit `Authorization` ou `authorization` ;
- retourne `401` avec `{ status: "fail", data: { title: "Unauthorized" } }` si le header est absent ou ne commence pas par `Bearer ` ;
- retourne `403` avec `{ status: "fail", data: { title: "Forbidden" } }` si le JWT est invalide ou expiré ;
- place `decoded.userInfo.id` dans `req.userId` ;
- place `decoded.userInfo.isAdmin` dans `req.isAdmin`.

Durée de l’access token : 15 minutes.

Payload normalement utilisé :

```json
{
  "userInfo": {
    "id": "<userId>",
    "isAdmin": true
  }
}
```

Toutes les fonctions de création et de refresh utilisent désormais le claim `isAdmin`.

### Refresh token

Le refresh token n’est jamais retourné dans le JSON. Il est envoyé dans le cookie HTTP-only `jwt`.

Après expiration de l’access token :

```http
GET /auth/refresh
```

avec les cookies inclus.

Réponse succès :

```json
{
  "status": "success",
  "data": {
    "accessToken": "jwt"
  }
}
```

Cookie absent : `401`, `{ status: "fail", data: { title: "Unauthorized" } }`.

Cookie invalide/expiré : `403`, `{ status: "fail", data: { title: "Forbidden" } }`.

Utilisateur du token supprimé : `401`, `{ status: "fail", data: { title: "Unauthorized" } }`.

### Statuts de réponse conventionnels

Le backend utilise :

- `success`
- `fail`
- `error`

Les erreurs utilisent principalement `{ status: "fail", data: { title: "..." } }`;
les erreurs serveur utilisent `{ status: "error", message: "Internal server error" }`.

## Endpoints d’authentification

### `POST /auth/register`

Accès public.

Body :

```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string"
}
```

Champs obligatoires : `name`, `email`, `phone`, `password`.

Succès `200` :

```json
{
  "status": "success",
  "data": {
    "id": "<userId>",
    "name": "string",
    "accessToken": "jwt",
    "email": "string",
    "isAdmin": false
  }
}
```

Les champs `first_name` et `last_name` ne sont plus retournés.

Champs manquants : `400`, `data.title = "All fieldes are required"`.

Email déjà utilisé : `409`, `data.title = "User already exists"`.

Le serveur crée aussi le cookie `jwt`.

### `POST /auth/login`

Accès public.

Body :

```json
{
  "email": "string",
  "password": "string"
}
```

Succès `200` :

```json
{
  "status": "success",
  "data": {
    "accessToken": "jwt",
    "id": "<userId>",
    "name": "string",
    "email": "string",
    "isAdmin": false
  }
}
```

Champs manquants : `400`, `data.title = "All fieldes are required"`.

Utilisateur absent ou mot de passe incorrect : `401`, `data.title = "Invalid credentials"`.

Le serveur crée aussi le cookie `jwt`.

### `GET /auth/refresh`

Accès via cookie `jwt`, voir la section session.

### `POST /auth/logout`

La route ne passe pas par `verifyJWT`.

Sans cookie `jwt` : `204 No Content`.

Avec cookie : `200` :

```json
{
  "status": "fail",
  "data": {
    "title": "Logout success"
  }
}
```

Le cookie `jwt` est supprimé.

## Modèle User

```ts
{
  _id: string
  name: string
  email: string
  phone: string
  password: string
  passwordResetCode?: string
  passwordResetExpires?: string
  passwordResetVerified?: boolean
  profilePhoto: {
    url: string
    publicId: string | null
  }
  isAdmin: boolean
  createdAt: string
  updatedAt: string
}
```

Les champs de reset password existent dans le modèle mais aucun endpoint ne les utilise.

## Endpoints utilisateurs

Toutes ces routes nécessitent un access token Bearer.

### `GET /users/`

Accès : administrateur uniquement, vérifié par le middleware `requireAdmin`.

Succès `200` :

```json
{
  "status": "success",
  "data": {
    "user": [/* User[] */]
  }
}
```

Aucun utilisateur : `400`, `data.title = "Not user found"`.

Le mot de passe et les champs de récupération sont exclus de cette réponse.

### `GET /users/:id`

Paramètre : `id`, ObjectId MongoDB valide.

ID invalide : `400`, `{ status: "fail", data: { title: "Invalid identifier" } }`.

Utilisateur absent : `404`, `data.title = "Not user found"`.

Succès `200` :

```json
{
  "status": "success",
  "data": {
    "user": { /* User */ }
  }
}
```

Le contrôle administrateur est effectué par `requireAdmin`.

### `PUT /users/:id`

Accès : propriétaire du compte, vérifié par comparaison entre `req.userId` et `:id`.

Body attendu :

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string"
}
```

Le code hache toujours `req.body.password` et met à jour les quatre champs.

ID invalide : `400`, `data.title = "Invalid identifier"`.

Utilisateur absent : `404`, `data.title = "The post not found"`.

Utilisateur différent du token : `404`, `data.title = "Cant access this post"`.

Email déjà existant : `401`, `data.title = "User already exists"`.

Succès `200` :

```json
{
  "status": "success",
  "data": {
    "updatedUser": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "profilePhoto": {},
      "isAdmin": true,
      "createdAt": "date",
      "updatedAt": "date"
    }
  }
}
```

Le mot de passe est exclu de cette réponse.

### `DELETE /users/:id`

Accès : administrateur uniquement, vérifié par `requireAdmin`.

ID invalide : `400`, `data.title = "Invalid identifier"`.

Utilisateur absent : `400`, `data.title = "Not user found"`.

Succès `200` :

```json
{
  "status": "success",
  "data": {
    "user": null
  }
}
```

### `POST /users/upload-user-image`

Content-Type : `multipart/form-data`.

Champ obligatoire : `image`.

Contraintes Multer :

- MIME type commençant par `image` et signature binaire PNG/JPEG/GIF/WEBP valide ;
- taille maximale : 1 MiB.

Absence de fichier : `400`, `data.title = "Send the Photo"`.

Format invalide : erreur Multer avec `message = "Unsupported file Format"`.

Succès `200` :

```json
{
  "status": "success",
  "data": {
    "profilePhoto": {
      "url": "https://...",
      "publicId": "string"
    }
  }
}
```

La photo est transférée vers Cloudinary et l’ancienne photo est supprimée.

## Modèle Doctor

```ts
{
  _id: string
  fullName: string
  specialty: "Dental" | "Children" | "Cardiology" | "Opthalmology"
  email: string
  phone: string
  bio?: string
  profilePhoto: {
    url: string
    publicId: string | null
  }
  patients: string[]
  createdAt: string
  updatedAt: string
}
```

`patients` contient des ObjectId User.

## Endpoints médecins

Toutes ces routes nécessitent un access token Bearer.

### `POST /doctor/new`

Accès admin vérifié.

Body :

```json
{
  "fullName": "string",
  "specialty": "Dental | Children | Cardiology | Opthalmology",
  "email": "string",
  "phone": "string",
  "bio": "string optionnel"
}
```

Champs obligatoires : `fullName`, `specialty`, `email`, `phone`.

Champs manquants : `400`, `data.title = "All fields are required"`.

Spécialité invalide : `400`, `data.title = "Specialization is not allowed"`.

Utilisateur non-admin : `400`, `data.title = "Only admin can create Doctor"`.

Succès `201` :

```json
{
  "status": "success",
  "data": {
    "doctor": { /* Doctor */ }
  }
}
```

### `GET /doctor/doctors`

Accès : administrateur uniquement, vérifié par `requireAdmin`.

Succès `200` :

```json
{
  "status": "success",
  "data": {
    "doctors": [/* Doctor[] */]
  }
}
```

Aucun médecin : `404`, `data.title = "doctor not found"`.

### `GET /doctor/doctors/:id`

Succès `200` :

```json
{
  "status": "success",
  "data": {
    "doctor": { /* Doctor */ }
  }
}
```

Médecin absent : `404`, `data.title = "doctor not found"`.

### `GET /doctor/doctors/:id/patients`

Le médecin est recherché puis `patients` est peuplé avec uniquement `fullName`, `email`, `phone`.

Succès `200` :

```json
{
  "status": "success",
  "data": {
    "doctorPatients": [
      {
        "_id": "string",
        "fullName": "string",
        "email": "string",
        "phone": "string"
      }
    ]
  }
}
```

Médecin absent : `404`, `data.title = "doctor not found"`.

### `GET /doctor/getSpecialties`

Accès public : cette route ne passe pas par `verifyJWT`.

Succès `200` :

```json
{
  "status": "success",
  "data": {
    "specialties": [
      "Dental",
      "Children",
      "Cardiology",
      "Opthalmology"
    ]
  }
}
```

### `GET /doctor/specialty/:specialty`

Accès public : cette route ne passe pas par `verifyJWT`.

Succès `200` :

```json
{
  "status": "success",
  "data": {
    "doctors": [/* Doctor[] */]
  }
}
```

Aucun médecin : `404`, `data.title = "No specialty hashas been added yet"`.

### `PUT /doctor/doctors/:id`

Body :

```json
{
  "fullName": "string",
  "specialty": "string",
  "email": "string",
  "phone": "string",
  "bio": "string"
}
```

La route est protégée par `verifyJWT` et `requireAdmin`. Le contrôleur vérifie également `req.isAdmin`. Un utilisateur non administrateur reçoit :

```json
{
  "status": "success",
  "data": {
    "title": "you are not authorized"
  }
}
```

Statut : `404`.

Médecin absent : `404`, `data.doctor = "doctor not found"`.

Erreur serveur : `500`, `{ status: "error", message: "..." }`.

### `DELETE /doctor/doctors/:id`

La route est protégée par `verifyJWT` et `requireAdmin`. Un utilisateur non administrateur reçoit `403`.

Médecin absent : `404`, `data.doctor = "doctor not found"`.

Succès `200` :

```json
{
  "status": "success",
  "data": {
    "doctor": null
  }
}
```

### `POST /doctor/upload-doctor-image/:id`

Content-Type : `multipart/form-data`.

Champ obligatoire : `image`.

Contraintes : image PNG/JPEG/GIF/WEBP valide, taille maximale 1 MiB.

Absence de fichier : `400`, `data.title = "Send a photo"`.

Succès `200` :

```json
{
    "status": "success",
  "data": {
    "profilePhoto": {
      "url": "https://...",
      "publicId": "string"
    }
  }
}
```


## Modèle Appointment

```ts
{
  _id: string
  barcode: string
  doctor: string | Doctor
  patient: string | User
  appointmentDate: string
  barcodeImage?: string
}
```

`barcode` est unique et généré côté backend.

## Endpoints rendez-vous

Toutes ces routes nécessitent un access token Bearer.

### `POST /appointment/new`

Accès : utilisateur connecté.

Body :

```json
{
  "doctorId": "string",
  "appointmentDate": "date convertible par new Date()"
}
```

Le middleware génère automatiquement :

- `barcode`, au format `HOSP-<timestamp-base36>-<random>`, en majuscules ;
- `barcodeImage`, image Code128 base64.

Le frontend ne doit pas envoyer ces champs.

Règles :

- le médecin doit exister ;
- un patient déjà présent dans `doctor.patients` ne peut pas reprendre un ticket ;
- la capacité journalière est de 16 créneaux ;
- l’heure doit être entre 08:00 inclus et 16:00 exclus ;
- les minutes doivent être `00` ou `30` ;
- le même médecin ne peut pas avoir deux rendez-vous au même instant.

Succès `201` :

```json
{
  "status": "success",
  "data": {
    "appointment": {
      "_id": "string",
      "barcode": "HOSP-...",
      "barcodeImage": "data:image/png;base64,...",
      "doctor": "doctorId",
      "patient": "userId",
      "appointmentDate": "date"
    }
  }
}
```

La clé s’appelle `appointment`.

Erreurs :

- médecin absent : `404`, `data.title = "doctor not found "` ;
- patient déjà enregistré : `400`, `data.title = "Patient already have ticket"` ;
- tickets considérés complets : `400`, `data.title = "All tickets for today are booked"` ;
- créneau invalide : `400`, `data.title = "Appointment are Only avaliable every half hours from 8am to 4pm "` ;
- rendez-vous existant : `400`, `data.title = "Appointment is booked"` ;
- autres erreurs de génération du barcode/email/DB : non normalisées.

Après création, le backend envoie un email au patient et ajoute le patient dans `doctor.patients`.

### `GET /appointment/`

Accès : administrateur uniquement, vérifié par `requireAdmin`.

Le backend sélectionne `appointmentDate`, `barcode` et `doctor`, puis peuple le médecin avec `fullName specialty`.

Succès `200` :

```json
{
  "status": "success",
  "data": {
    "appointments": [
      {
        "_id": "string",
        "appointmentDate": "date",
        "barcode": "string",
        "doctor": {
          "_id": "string",
          "fullName": "string",
          "specialty": "string"
        }
      }
    ]
  }
}
```

Aucun rendez-vous : `404`, `data.title = "doctor not found ther are no appointment "`.

### `GET /appointment/:id`

Le paramètre `:id` est utilisé comme identifiant du patient, malgré le nom générique de la route.

Succès `200` :

```json
{
  "status": "success",
  "data": {
    "appointments": [
      {
        "_id": "string",
        "appointmentDate": "date",
        "barcode": "string",
        "doctor": {
          "_id": "string",
          "fullName": "string",
          "specialty": "string"
        }
      }
    ]
  }
}
```

La clé s’appelle `appointments`.

Aucun rendez-vous : `404`, `data.title = "There are no appointment for this patien"`.

### `DELETE /appointment/:id`

Ici, `:id` est l’identifiant du rendez-vous.

Rendez-vous absent : `404`, `data.title = "there are no appointment"`.

L’opération est autorisée uniquement à l’administrateur ou au propriétaire du rendez-vous. Sinon, la réponse est `403`.

Succès `200` :

```json
{
  "status": "success",
  "data": {
    "appointment": null
  }
}
```

## Dates, tickets et nettoyage automatique

- Les dates sont des dates MongoDB sérialisées en JSON.
- Les créneaux autorisés sont toutes les demi-heures de 08:00 à 15:30.
- La tâche cron s’exécute à `16:01` chaque jour.
- Elle supprime les rendez-vous dont `appointmentDate <= 16:00`.
- Elle retire le patient de `doctor.patients` s’il n’a pas d’autre rendez-vous futur avec ce médecin.
- Les codes-barres sont de type Code128.
- L’image générée utilise le préfixe `data:image/png;base64,`.

## Checklist d’intégration frontend

- Stocker l’access token uniquement côté client selon la stratégie de sécurité retenue.
- Ajouter `Authorization: Bearer <token>` à chaque route protégée.
- Ajouter `credentials: "include"` pour login, register, refresh et logout si le cookie doit fonctionner.
- Ne pas définir manuellement `Content-Type` pour `FormData`.
- Utiliser `FormData.append("image", file)` pour les uploads.
- Traiter les réponses enveloppées dans `data`.
- Les clés de rendez-vous sont `appointment` et `appointments`.
- Prévoir les réponses `401`, `403`, `404`, `400` et `500`.
- Ne pas supposer qu’une route commentée « admin » vérifie réellement le rôle.
- Le champ `password` n’est pas retourné par les routes utilisateurs.
- Utiliser `Doctor.fullName`, pas `Doctor.name`.
