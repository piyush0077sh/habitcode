import React, { useState } from 'react';
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
import { NewHabit, HabitFrequency, HabitCategory } from '../types';
import { HABIT_COLORS, HABIT_ICONS } from '../constants/theme';
import { requestNotificationPermissions } from '../utils/notifications';

interface AddHabitScreenProps {
  navigation: any;
}

const AddHabitScreen: React.FC<AddHabitScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { addHabit } = useHabits();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[10]);
  const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0]);
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory>('personal');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
      const newHabit: NewHabit = {
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
      };

      await addHabit(newHabit);
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
                        ? selectedColor + '20'
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
              trackColor={{ false: colors.border, true: selectedColor + '60' }}
              thumbColor={reminderEnabled ? selectedColor : colors.surface}
            />
          </View>

          {reminderEnabled && (
            <TouchableOpacity
              style={[styles.timeButton, { backgroundColor: colors.surfaceVariant }]}
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
          title="Create Habit"
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
    padding: 24,
    paddingTop: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginTop: 3,
    opacity: 0.8,
  },
  frequencyOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  frequencyButton: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
  },
  frequencyText: {
    fontSize: 15,
    fontWeight: '700',
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginTop: 14,
    gap: 10,
  },
  timeText: {
    fontSize: 17,
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
  },
});

export default AddHabitScreen;
