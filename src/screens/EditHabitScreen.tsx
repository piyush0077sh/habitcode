import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import {
  TextInput,
  Button,
  ColorPicker,
  IconPicker,
  CategoryPicker,
} from '../components';
import { HabitFrequency, HabitCategory } from '../types';
import { requestNotificationPermissions } from '../utils/notifications';
import { FONT, RADIUS, SPACING, hexToRgba } from '../constants/theme';

const EditHabitScreen = ({
  route,
  navigation,
}: any) => {
  const { habitId } = route.params;
  const { colors } = useTheme();
  const { habits, updateHabit } = useHabits();

  const habit = habits.find((h) => h.id === habitId);

  const [name, setName] = useState(habit?.name || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [selectedColor, setSelectedColor] = useState(habit?.color || '#6366f1');
  const [selectedIcon, setSelectedIcon] = useState(
    habit?.icon || 'fitness-center'
  );
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory>(
    habit?.category || 'other'
  );
  const [frequency, setFrequency] = useState<HabitFrequency>(
    habit?.frequency || 'daily'
  );
  const [reminderEnabled, setReminderEnabled] = useState(
    habit?.reminderEnabled || false
  );
  const [reminderTime, setReminderTime] = useState(() => {
    if (habit?.reminderTime) {
      const [hours, minutes] = habit.reminderTime.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    }
    return new Date();
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!habit) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Text style={{ color: colors.text }}>Habit not found</Text>
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    if (reminderEnabled) {
      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications to use reminders'
        );
        return;
      }
    }

    setIsSaving(true);

    try {
      await updateHabit(habitId, {
        name: name.trim(),
        description: description.trim(),
        color: selectedColor,
        icon: selectedIcon,
        category: selectedCategory,
        frequency,
        reminderEnabled,
        reminderTime: reminderEnabled
          ? `${reminderTime.getHours().toString().padStart(2, '0')}:${reminderTime
              .getMinutes()
              .toString()
              .padStart(2, '0')}`
          : null,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save habit');
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['bottom']}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g., Morning Exercise"
          maxLength={50}
        />

        <TextInput
          label="Description (optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="e.g., 30 minutes of cardio"
          maxLength={100}
          multiline
          numberOfLines={2}
        />

        <ColorPicker
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
        />

        <IconPicker
          selectedIcon={selectedIcon}
          selectedColor={selectedColor}
          onSelectIcon={setSelectedIcon}
        />

        <CategoryPicker
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Frequency
          </Text>
          <View style={styles.frequencyOptions}>
            {(['daily', 'weekly'] as HabitFrequency[]).map((freq) => (
              <TouchableOpacity
                key={freq}
                style={[
                  styles.frequencyButton,
                  {
                    backgroundColor:
                      frequency === freq
                        ? hexToRgba(selectedColor, 0.12)
                        : colors.surfaceVariant,
                    borderColor:
                      frequency === freq ? selectedColor : 'transparent',
                  },
                ]}
                onPress={() => setFrequency(freq)}
              >
                <Text
                  style={[
                    styles.frequencyText,
                    {
                      color:
                        frequency === freq ? selectedColor : colors.textSecondary,
                    },
                  ]}
                >
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.reminderHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Reminder
              </Text>
              <Text
                style={[styles.sectionSubtitle, { color: colors.textSecondary }]}
              >
                Get notified to complete your habit
              </Text>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
              trackColor={{ false: colors.border, true: hexToRgba(selectedColor, 0.4) }}
              thumbColor={reminderEnabled ? selectedColor : colors.surface}
            />
          </View>

          {reminderEnabled && (
            <TouchableOpacity
              style={[
                styles.timeButton,
                { backgroundColor: colors.surfaceVariant },
              ]}
              onPress={() => setShowTimePicker(true)}
            >
              <MaterialIcons
                name="access-time"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={[styles.timeText, { color: colors.text }]}>
                {formatTime(reminderTime)}
              </Text>
            </TouchableOpacity>
          )}

          {showTimePicker && (
            <DateTimePicker
              value={reminderTime}
              mode="time"
              is24Hour={false}
              onChange={(event, selectedDate) => {
                setShowTimePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setReminderTime(selectedDate);
                }
              }}
            />
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={isSaving}
          disabled={!name.trim()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  section: {
    marginVertical: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: FONT.semibold,
    marginBottom: SPACING.md,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: FONT.regular,
    marginTop: 3,
  },
  frequencyOptions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  frequencyButton: {
    flex: 1,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  frequencyText: {
    fontSize: 15,
    fontFamily: FONT.semibold,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  timeText: {
    fontSize: 16,
    fontFamily: FONT.semibold,
  },
  footer: {
    padding: SPACING.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});

export default EditHabitScreen;
