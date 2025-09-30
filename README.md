# Food n' Jam 🍽️🎵

A React Native mobile app that pairs your favorite meals with the perfect Spotify playlists.

## What is Food n' Jam?

Food n' Jam connects your culinary experiences with your musical taste. Discover new meals, find the perfect playlist to match your dining mood, and save your favorite food-music pairings.

## Features

- **Meal Discovery**: Browse and search through thousands of recipes from TheMealDB
- **Spotify Integration**: Connect your Spotify account to access your playlists
- **Smart Pairing**: Create and save combinations of meals with matching playlists
- **Personal Collection**: Keep track of your favorite meal-music pairings
- **User Profiles**: Manage your account and view your activity

## Screenshots

<!-- Add your app screenshots here -->
<div align="center">
  
### Login & Authentication
<!-- ![Login Screen](screenshots/login.png) -->
*Connect your Spotify account to get started*

### Home & Discovery
<!-- ![Home Screen](screenshots/home.png) -->
*Browse featured meals and discover new food-music pairings*

### Meal Search
<!-- ![Search Screen](screenshots/search.png) -->
*Find specific meals and ingredients*

### Playlist Integration
<!-- ![Playlist Screen](screenshots/playlists.png) -->
*Access your Spotify playlists and create perfect pairings*

### Favorites & Profile
<!-- ![Favorites Screen](screenshots/favorites.png) -->
<!-- ![Profile Screen](screenshots/profile.png) -->
*Keep track of your saved pairings and manage your account*

</div>

## Tech Stack

- **Frontend**: React Native, TypeScript, Expo
- **Backend**: Supabase (Database & Authentication)
- **APIs**: Spotify Web API, TheMealDB API
- **Authentication**: Spotify OAuth with secure token management

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- Spotify Developer Account
- Supabase Account

### Installation

1. Clone the repository
`git clone https://github.com/patricknelwan/food-n-jam.git
cd food-n-jam`

2. Install dependencies
`npm install`

3. Set up environment variables
`cp .env.example .env`

Fill in your API keys:
- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `EXPO_PUBLIC_SPOTIFY_CLIENT_ID`: Your Spotify app client ID
- `EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET`: Your Spotify app client secret

4. Start the development server
`npx expo start`


## App Structure

- **Login**: Secure Spotify authentication
- **Home**: Discover new meals and browse pairings
- **Search**: Find specific meals or ingredients
- **Favorites**: Your saved meal-playlist combinations
- **Profile**: Account management and settings

---

*Created by Patrick Nelwan*
