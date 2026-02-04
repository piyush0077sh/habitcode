import { Alert, Linking } from 'react-native';

// Update this version with each release
const CURRENT_VERSION = '1.0.0';

// Your GitHub Gist URL for version checking
const VERSION_URL = 'https://gist.githubusercontent.com/piyush0077sh/22d988bd21780b099fde60235bd0916f/raw/version.json';

export const checkForUpdates = async () => {
  try {
    const response = await fetch(VERSION_URL, { cache: 'no-store' });
    const data = await response.json();

    if (data.latestVersion !== CURRENT_VERSION) {
      Alert.alert(
        'Update Available! 🎉',
        `Version ${data.latestVersion} is available.\n\n${data.changelog}`,
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Update Now', onPress: () => Linking.openURL(data.downloadUrl) }
        ]
      );
    }
  } catch (error) {
    // Silently fail - don't bother user if check fails
    console.log('Update check skipped');
  }
};

export const getCurrentVersion = () => CURRENT_VERSION;
