# MealMates React

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) 
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) 
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

## Description du projet

**MealMates** est une application web construite avec React qui permet aux utilisateurs de créer, gérer et partager des offres de repas. L'application facilite la connexion entre les utilisateurs à travers une interface conviviale, permettant la publication d'offres de repas, la gestion de profils, et l'interaction via des messages.

### Fonctionnalités clés
- Authentification des utilisateurs avec inscription et connexion.
- Création et gestion d'offres de repas.
- Visualisation des offres sur une carte interactive.
- Gestion des préférences et historique des utilisateurs.

## Tech Stack

| Technologie | Description |
|-------------|-------------|
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) | Bibliothèque JavaScript pour construire des interfaces utilisateur. |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | Outil de construction rapide pour les projets modernes. |
| ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) | Plateforme pour développer, expédier et exécuter des applications dans des conteneurs. |

## Instructions d'installation

### Prérequis
Assurez-vous d'avoir installé les éléments suivants sur votre machine :
- [Node.js](https://nodejs.org/) (version 14 ou supérieure)
- [Docker](https://www.docker.com/) (si vous souhaitez exécuter l'application dans un conteneur)

### Étapes d'installation
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/nygmasx/mealmates-react.git
   cd mealmates-react
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement :
   - Copiez le fichier `.env.example` en `.env` et modifiez-le selon vos besoins.

4. Démarrez l'application :
   ```bash
   npm run dev
   ```

## Utilisation

Pour exécuter l'application, utilisez la commande suivante :
```bash
npm run dev
```
Cela lancera le serveur de développement et vous pourrez accéder à l'application via `http://localhost:3000`.

## Structure du projet

Voici un aperçu de la structure du projet :

```
mealmates-react/
├── public/                  # Contient les fichiers statiques
│   └── assets/              # Ressources graphiques
├── src/                     # Contient le code source de l'application
│   ├── app/                 # Composants principaux de l'application
│   │   ├── auth/            # Authentification (inscription, connexion)
│   │   ├── map/             # Composants liés à la carte
│   │   ├── offers/          # Gestion des offres de repas
│   │   ├── products/        # Gestion des produits
│   │   └── profile/         # Gestion du profil utilisateur
│   ├── components/          # Composants réutilisables
│   ├── context/             # Gestion des états globaux
│   ├── hooks/               # Hooks personnalisés
│   ├── services/            # Services pour interagir avec l'API
│   ├── App.jsx              # Point d'entrée de l'application
│   └── main.jsx             # Fichier principal pour le rendu
└── docker/                  # Fichiers de configuration Docker
    └── Dockerfile           # Instructions pour construire l'image Docker
```

### Explication des fichiers principaux
- `App.jsx` : Composant principal qui rend l'application.
- `Layout.jsx` : Gère la structure de mise en page de l'application.
- `AuthIndex.jsx`, `Login.jsx`, `Register.jsx` : Gèrent l'authentification des utilisateurs.
- `CreateOffer.jsx` : Permet aux utilisateurs de créer des offres de repas.