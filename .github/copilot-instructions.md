# HabitCode - Habit Tracking App

A React Native Expo habit tracking application with TypeScript.

## Project Structure
- `/src/components` - Reusable UI components
- `/src/screens` - App screens
- `/src/context` - React Context providers (Theme, Habits)
- `/src/hooks` - Custom React hooks
- `/src/types` - TypeScript type definitions
- `/src/utils` - Utility functions
- `/src/constants` - App constants and theme definitions

## Key Features
- Habit tracking with tile-based grid visualization
- Customizable habits (name, description, icon, color)
- Streak tracking with configurable frequency
- Push notification reminders
- Dark/Light theme with system adaptation
- Calendar view for managing completions
- Archive/Restore habits
- Import/Export data as JSON
- Local-first privacy (AsyncStorage)

## Development Commands
- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web browser

## Tech Stack
- React Native with Expo
- TypeScript
- AsyncStorage for local data persistence
- Expo Notifications for reminders
- React Navigation for routing
