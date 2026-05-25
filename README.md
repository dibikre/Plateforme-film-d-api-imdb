# CinéMic - Plateforme d'Exploration de Films et Séries

CinéMic est un mini-projet web moderne développé avec le framework **Angular**. L'application offre une interface fluide et immersive pour explorer une vaste collection de films, séries, fiches d'acteurs, vidéos et favoris.

Le projet a été pensé pour offrir une expérience utilisateur haut de gamme avec un thème sombre élégant, des transitions fluides et une gestion performante des données.

---

## Fonctionnalités Principales

- **Exploration Personnalisée** : Parcourez les films et les séries populaires du moment. La liste est mélangée de manière dynamique pour garantir une découverte variée à chaque visite.
- **Recherche Avancée** : Recherchez des contenus en temps réel avec des filtres précis.
- **Fiches Acteurs Progressives** : Chargement fluide et performant de profils d'acteurs de manière progressive grâce à la lecture de fichiers CSV volumineux découpés en plusieurs lots.
- **Lecteur Vidéo Intégré** : Visionnez des bandes-annonces ou extraits directement depuis l'application via l'intégration YouTube.
- **Gestion des Favoris** : Ajoutez ou supprimez vos films et séries préférés de votre liste de favoris personnelle avec une persistance locale.
- **Espace de Configuration** : Personnalisez votre expérience en connectant vos propres clés API (OMDb et YouTube).

---

## Configuration des Clés API (OMDb & YouTube)

Contrairement aux architectures classiques qui nécessitent de modifier des fichiers de configuration internes ou des variables d'environnement (comme un fichier `.env`), **les clés API de CinéMic se configurent directement depuis l'interface utilisateur de l'application**.

Pour renseigner vos clés :
1. Lancez l'application.
2. Accédez à l'onglet **Configuration** depuis le menu de navigation de l'application.
3. Renseignez vos clés personnelles dans les champs dédiés :
   - **OMDB API Key** : Permet de récupérer les informations détaillées, les résumés et les notes des films et séries.
   - **YouTube API Key** : Permet de charger directement les vidéos et bandes-annonces associées.
4. Les clés saisies sont enregistrées localement de manière sécurisée (avec obfuscation) directement dans le **localStorage** de votre navigateur internet. Aucune donnée n'est envoyée sur un serveur distant, garantissant une confidentialité totale de vos clés personnelles.


Si vous souhaitez le faire systématiquement, c'est ici qu'il faut configurer les clés API **src/app/configuration/config-api.ts**. Pour une sécurité, vous pouvez créer un fichier **.env** et y placer ces contenants là-bas et corriger la direction de l'important dans **server.ts**.
---

## Captures d'Écran du Projet

Voici un aperçu visuel des différentes sections clés de la plateforme CinéMic :

### 1. Accueil & Liste des Médias
Cette vue présente la liste mélangée de films et de séries populaires, offrant des fiches interactives au format carte.
![Accueil CinéMic](public/captures/accueil.png)

### 2. Lecteur Immersif & Détails
La fiche détaillée présente les résumés, les notes OMDb, ainsi qu'un lecteur vidéo intégré pour visionner les extraits des films via YouTube directement en cours de navigation.
![Lecteur et Détails](public/captures/details_lecteur.png)

### 3. Profil du Créateur
Une page dédiée présentant le profil académique et professionnel du créateur de CinéMic à l'école ESTEM, accompagnée de ses coordonnées et réseaux sociaux.
![Profil du Créateur](public/captures/profil_createur.png)

---

## Installation et Lancement

Pour exécuter ce projet localement sur votre machine, suivez les instructions ci-dessous.

### Prérequis

Assurez-vous d'avoir installé :
- Node.js (version 18 ou supérieure recommandée)
- Le CLI d'Angular (`npm install -g @angular/cli`)

### Étape 1 : Cloner le projet

Allez dans votre répertoire de travail et décompressez le projet, puis placez-vous dans le dossier racine :
```bash
cd cinemic
```

### Étape 2 : Installer les dépendances

Installez l'ensemble des modules requis pour faire tourner l'application Angular :
```bash
npm install
```

### Étape 3 : Lancer le serveur de développement

Pour exécuter le projet en mode de développement avec ouverture automatique de votre navigateur internet, utilisez la commande suivante :
```bash
ng serve --open
```

L'application compilera et sera accessible par défaut à l'adresse URL : `http://localhost:4200/`.

---

## Structure du Projet

Le projet Angular s'articule autour des répertoires suivants :
- `src/app/composants/` : Regroupe les différents composants d'interface de l'application (films, séries, profil, configuration, lecteur, etc.).
- `src/app/services/` : Contient les services Angular assurant l'appel des données et la logique métier.
- `src/app/configuration/` : Gère les fiches de paramétrages statiques, notamment les constantes de liens sociaux (`config-sociaux.ts`).
- `public/` : Contient les données applicatives (telles que le dictionnaire CSV des acteurs) et les éléments visuels de l'application (images, logos, captures).

---

## Profil de l'Auteur

Le projet a été conçu et réalisé par **Dibi Kre Michael**, étudiant en 3e année SDDI à l'établissement **ESTEM**.
