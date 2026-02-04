import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  subDays,
  isSameDay,
  parseISO,
  isToday,
  differenceInDays,
  startOfMonth,
  endOfMonth,
  getDay,
} from 'date-fns';
import { Habit, StreakInfo, DayCompletion } from '../types';

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const formatDisplayDate = (date: Date): string => {
  return format(date, 'MMM d, yyyy');
};

export const formatMonthYear = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};

export const getDaysInMonth = (date: Date): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

export const getWeekDays = (date: Date, weekStartsOn: 0 | 1 = 0): Date[] => {
  const start = startOfWeek(date, { weekStartsOn });
  const end = endOfWeek(date, { weekStartsOn });
  return eachDayOfInterval({ start, end });
};

export const getLast7Days = (): Date[] => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
};

export const getLastNDays = (n: number): Date[] => {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => subDays(today, n - 1 - i));
};

export const isDateCompleted = (habit: Habit, date: Date): boolean => {
  const dateStr = formatDate(date);
  return habit.completions.includes(dateStr);
};

export const getCompletionsForRange = (
  habit: Habit,
  days: Date[]
): DayCompletion[] => {
  return days.map((date) => ({
    date: formatDate(date),
    completed: isDateCompleted(habit, date),
  }));
};

export const calculateStreak = (habit: Habit): StreakInfo => {
  const completions = habit.completions
    .map((d) => parseISO(d))
    .sort((a, b) => b.getTime() - a.getTime());

  if (completions.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      completionRate: 0,
    };
  }

  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  let checkDate = today;

  // Check if today or yesterday is completed
  const todayCompleted = isDateCompleted(habit, today);
  const yesterdayCompleted = isDateCompleted(habit, subDays(today, 1));

  if (!todayCompleted && !yesterdayCompleted) {
    currentStreak = 0;
  } else {
    if (!todayCompleted) {
      checkDate = subDays(today, 1);
    }

    while (isDateCompleted(habit, checkDate)) {
      currentStreak++;
      checkDate = subDays(checkDate, 1);
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  const sortedAsc = [...completions].sort((a, b) => a.getTime() - b.getTime());

  for (let i = 0; i < sortedAsc.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const daysDiff = differenceInDays(sortedAsc[i], sortedAsc[i - 1]);
      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // Calculate completion rate (last 30 days)
  const last30Days = getLastNDays(30);
  const completedInLast30 = last30Days.filter((d) =>
    isDateCompleted(habit, d)
  ).length;
  const completionRate = Math.round((completedInLast30 / 30) * 100);

  return {
    currentStreak,
    longestStreak,
    totalCompletions: habit.completions.length,
    completionRate,
  };
};

export const getMonthCalendarDays = (
  date: Date,
  weekStartsOn: 0 | 1 = 0
): (Date | null)[] => {
  const monthDays = getDaysInMonth(date);
  const firstDay = monthDays[0];
  const lastDay = monthDays[monthDays.length - 1];

  // Get the day of week for the first day
  const firstDayOfWeek = getDay(firstDay);
  const startOffset = weekStartsOn === 1
    ? (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1)
    : firstDayOfWeek;

  // Get the day of week for the last day
  const lastDayOfWeek = getDay(lastDay);
  const endOffset = weekStartsOn === 1
    ? (lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek)
    : 6 - lastDayOfWeek;

  const leadingNulls: null[] = Array(startOffset).fill(null);
  const trailingNulls: null[] = Array(endOffset).fill(null);

  return [...leadingNulls, ...monthDays, ...trailingNulls];
};

export const getDayName = (dayIndex: number, short: boolean = true): string => {
  const days = short
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
};

export const getWeekDayHeaders = (weekStartsOn: 0 | 1 = 0): string[] => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  if (weekStartsOn === 1) {
    return [...days.slice(1), days[0]];
  }
  return days;
};
