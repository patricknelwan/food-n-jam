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

## Tech Stack

- **Frontend**: React Native, TypeScript, Expo
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Backend**: Supabase (Database & Authentication)
- **APIs**: Spotify Web API, TheMealDB API
- **Authentication**: Spotify OAuth with secure token management
- **Styling**: React Native UI Lib, Vector Icons

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- Spotify Developer Account
- Supabase Account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/patricknelwan/food-n-jam.git
   cd food-n-jam
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

   Fill in your API keys:

   - **Supabase Configuration**:
     - Go to your Supabase project settings -> API.
     - Copy `Project URL` to `EXPO_PUBLIC_SUPABASE_URL`.
     - Copy `anon public` key to `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

   - **Spotify Configuration**:
     - Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
     - Create a new app.
     - Copy `Client ID` to `EXPO_PUBLIC_SPOTIFY_CLIENT_ID`.
     - Copy `Client Secret` to `EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET`.
     - **Important**: In your Spotify App settings, add the redirect URI for Expo (usually `exp://localhost:8081` or your custom scheme).

4. **Start the development server**
   ```bash
   npx expo start
   ```

## Project Structure

The source code is located in the `src` directory:

- `src/components`: Reusable UI components (Buttons, Cards, etc.)
- `src/screens`: Main application screens (Home, Search, Profile)
- `src/navigation`: Navigation configuration (Stack, Tab navigators)
- `src/store`: Redux store setup, slices, and selectors
- `src/services`: API service integrations (Spotify, TheMealDB)
- `src/hooks`: Custom React hooks
- `src/contexts`: React Context providers
- `src/utils`: Helper functions and constants
- `src/types`: TypeScript type definitions
- `src/theme`: Styling theme and constants
- `src/assets`: Static assets (images, fonts)

## Scripts

- `npm start`: Start the Expo development server
- `npm run android`: Run on Android emulator/device
- `npm run ios`: Run on iOS simulator/device
- `npm run web`: Run in web browser
- `npm run lint`: Run ESLint to check for code quality issues
- `npm run format`: Format code using Prettier
- `npm run test`: Run Jest tests
