# HabitCode - Habit Tracking App

A beautiful and intuitive habit tracking application built with React Native and Expo.

## Features

### 📊 Track Your Habits
Monitor your progress with intuitive tile-based grid charts. Try to fill the boxes every day and change your life for the better.

### ✨ Customization
Add your habits in a fast and easy way. Provide a name, description, icon, and color - you're good to go!

### 🔥 Streaks
Get motivated by streaks. Tell the app how often you'd like to complete a habit and watch your streak count grow!

### ⏰ Reminders
Never miss a completion again. Add reminders to your habits and get notifications at your specified time.

### 🎨 Multiple Themes
Choose between different themes and toggle between dark and light mode. Or let it adapt to your system settings.

### 📅 Calendar
The calendar provides a fast and easy way to manage past completions. Simply tap a day to remove or add a completion.

### 📦 Archive
Need a break from a habit? Just archive it and restore it later from the settings menu.

### 💾 Import / Export
Switching phones? Export your data to a file, save it wherever you want, and restore it later.

### 🔒 Privacy
All your data belongs to you and stays on your phone. No cloud, no accounts, no tracking.

## Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
- **iOS**: Press `i` to open in iOS Simulator
- **Android**: Press `a` to open in Android Emulator
- **Physical Device**: Scan the QR code with Expo Go app

## Project Structure

```
habitcode/
├── App.tsx                 # Main app entry point
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── CalendarView.tsx
│   │   ├── ColorPicker.tsx
│   │   ├── HabitCard.tsx
│   │   ├── IconPicker.tsx
│   │   ├── TextInput.tsx
│   │   └── TileGrid.tsx
│   ├── screens/            # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── AddHabitScreen.tsx
│   │   ├── HabitDetailScreen.tsx
│   │   ├── EditHabitScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── context/            # React Context providers
│   │   ├── ThemeContext.tsx
│   │   └── HabitContext.tsx
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── dateUtils.ts
│   │   ├── notifications.ts
│   │   └── storage.ts
│   └── constants/          # App constants
│       └── theme.ts
├── assets/                 # App assets
├── app.json               # Expo configuration
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript configuration
```

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development toolchain
- **TypeScript** - Type safety
- **React Navigation** - Navigation library
- **AsyncStorage** - Local data persistence
- **Expo Notifications** - Push notifications
- **date-fns** - Date manipulation

## Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

## License

MIT License
