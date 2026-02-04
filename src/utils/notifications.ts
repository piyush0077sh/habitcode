import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Habit } from '../types';

// Configure notification handling
const notificationBehavior = {
  shouldShowAlert: true,
  shouldPlaySound: true,
  shouldSetBadge: false,
  shouldShowBanner: true,
  shouldShowList: true,
};

Notifications.setNotificationHandler({
  handleNotification: async () => notificationBehavior as any,
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  // Skip on web - notifications not supported
  if (Platform.OS === 'web') return false;
  
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('habits', {
      name: 'Habit Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#a78bfa',
    });
  }

  return true;
};

export const scheduleHabitReminder = async (habit: Habit): Promise<string | null> => {
  // Skip on web - notifications not supported
  if (Platform.OS === 'web') return null;
  
  if (!habit.reminderEnabled || !habit.reminderTime) {
    return null;
  }

  // Cancel existing notification for this habit
  await cancelHabitReminder(habit.id);

  const [hours, minutes] = habit.reminderTime.split(':').map(Number);

  const trigger = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour: hours,
    minute: minutes,
  } as Notifications.DailyTriggerInput;

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to complete your habit! 💪",
      body: `Don't forget: ${habit.name}`,
      data: { habitId: habit.id },
    },
    trigger,
  });

  return identifier;
};

export const cancelHabitReminder = async (habitId: string): Promise<void> => {
  // Skip on web - notifications not supported
  if (Platform.OS === 'web') return;
  
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  
  for (const notification of scheduledNotifications) {
    if (notification.content.data?.habitId === habitId) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
};

export const cancelAllReminders = async (): Promise<void> => {
  // Skip on web - notifications not supported
  if (Platform.OS === 'web') return;
  
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const getScheduledNotifications = async () => {
  // Skip on web - notifications not supported
  if (Platform.OS === 'web') return [];
  
  return Notifications.getAllScheduledNotificationsAsync();
};
