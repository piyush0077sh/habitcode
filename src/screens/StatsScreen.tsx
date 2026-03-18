import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import { formatDate } from '../utils/dateUtils';
import { FONT, RADIUS, SPACING, SHADOW, hexToRgba } from '../constants/theme';

const StatsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { activeHabits, habits } = useHabits();
  const { width } = useWindowDimensions();

  // Calculate statistics
  const stats = useMemo(() => {
    const today = new Date();
    const last30Days: string[] = [];
    const last7Days: string[] = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last30Days.push(formatDate(date));
      if (i < 7) last7Days.push(formatDate(date));
    }

    // Total completions
    const totalCompletions = activeHabits.reduce(
      (sum, habit) => sum + habit.completions.length,
      0
    );

    // Completions in last 7 days
    const weeklyCompletions = activeHabits.reduce((sum, habit) => {
      return sum + habit.completions.filter(c => last7Days.includes(c)).length;
    }, 0);

    // Completions in last 30 days
    const monthlyCompletions = activeHabits.reduce((sum, habit) => {
      return sum + habit.completions.filter(c => last30Days.includes(c)).length;
    }, 0);

    // Best streak across all habits
    let bestStreak = 0;
    activeHabits.forEach(habit => {
      const sorted = [...habit.completions].sort();
      let streak = 0;
      let maxStreak = 0;
      
      for (let i = 0; i < sorted.length; i++) {
        if (i === 0) {
          streak = 1;
        } else {
          const prev = new Date(sorted[i - 1]);
          const curr = new Date(sorted[i]);
          const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            streak++;
          } else {
            streak = 1;
          }
        }
        maxStreak = Math.max(maxStreak, streak);
      }
      bestStreak = Math.max(bestStreak, maxStreak);
    });

    // Completions by day of week
    const dayOfWeekData = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
    activeHabits.forEach(habit => {
      habit.completions.forEach(dateStr => {
        const date = new Date(dateStr);
        dayOfWeekData[date.getDay()]++;
      });
    });

    // Category breakdown
    const categoryData: { [key: string]: number } = {};
    activeHabits.forEach(habit => {
      const cat = habit.category || 'other';
      categoryData[cat] = (categoryData[cat] || 0) + habit.completions.length;
    });

    // Completion rate
    const possibleCompletions = activeHabits.length * 30;
    const completionRate = possibleCompletions > 0 
      ? Math.round((monthlyCompletions / possibleCompletions) * 100)
      : 0;

    return {
      totalCompletions,
      weeklyCompletions,
      monthlyCompletions,
      bestStreak,
      activeHabitsCount: activeHabits.length,
      completionRate,
      dayOfWeekData,
      categoryData,
    };
  }, [activeHabits]);

  // Responsive bar width: calculate based on available width (width - padding - chart gaps)
  // 7 bars + 6 gaps (spacing=16): (width - 2*xl - 2*xl) / 7 - 16
  const responsiveBarWidth = Math.max(16, Math.floor((width - 80) / 7 - 16));

  // Bar chart data for days of week
  const barChartData = [
    { value: stats.dayOfWeekData[0], label: 'Sun', frontColor: colors.primary },
    { value: stats.dayOfWeekData[1], label: 'Mon', frontColor: colors.primary },
    { value: stats.dayOfWeekData[2], label: 'Tue', frontColor: colors.primary },
    { value: stats.dayOfWeekData[3], label: 'Wed', frontColor: colors.primary },
    { value: stats.dayOfWeekData[4], label: 'Thu', frontColor: colors.primary },
    { value: stats.dayOfWeekData[5], label: 'Fri', frontColor: colors.primary },
    { value: stats.dayOfWeekData[6], label: 'Sat', frontColor: colors.primary },
  ];

  // Pie chart data for categories
  const categoryColors: { [key: string]: string } = {
    health: '#ef6b6b',
    fitness: '#f09a5c',
    work: '#5ca8f0',
    learning: '#7c8cf0',
    personal: '#47b8b8',
    finance: '#6ec96e',
    social: '#f06b9a',
    mindfulness: '#a67df0',
    other: '#8e8e93',
  };

  const pieChartData = Object.entries(stats.categoryData).map(([cat, value]) => ({
    value,
    color: categoryColors[cat] || '#6b7280',
    text: cat.charAt(0).toUpperCase() + cat.slice(1),
  }));

  const StatCard: React.FC<{
    icon: string;
    label: string;
    value: string | number;
    color: string;
  }> = ({ icon, label, value, color }) => (
    <View style={[styles.statCard, { backgroundColor: colors.surface, width: (width - 44) / 2 }]}>
      <View style={[styles.statIconContainer, { backgroundColor: hexToRgba(color, 0.12) }]}>
        <MaterialIcons name={icon as any} size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );

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
        {/* Overview Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="check-circle"
            label="Total Done"
            value={stats.totalCompletions}
            color="#6ec96e"
          />
          <StatCard
            icon="today"
            label="This Week"
            value={stats.weeklyCompletions}
            color="#5ca8f0"
          />
          <StatCard
            icon="local-fire-department"
            label="Best Streak"
            value={stats.bestStreak}
            color="#f09a5c"
          />
          <StatCard
            icon="speed"
            label="30d Rate"
            value={`${stats.completionRate}%`}
            color={colors.primary}
          />
        </View>

        {/* Weekly Activity Chart */}
        <View style={[styles.chartContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            Activity by Day
          </Text>
          <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>
            Total completions per day of week
          </Text>
          <View style={styles.chartWrapper}>
            <BarChart
              data={barChartData}
              barWidth={responsiveBarWidth}
              spacing={16}
              roundedTop
              roundedBottom
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 11 }}
              noOfSections={4}
              maxValue={Math.max(...stats.dayOfWeekData, 1)}
              isAnimated
              animationDuration={500}
            />
          </View>
        </View>

        {/* Category Breakdown */}
        {pieChartData.length > 0 && (
          <View style={[styles.chartContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>
              By Category
            </Text>
            <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>
              Completions breakdown
            </Text>
            <View style={styles.pieWrapper}>
              <PieChart
                data={pieChartData}
                donut
                radius={80}
                innerRadius={50}
                innerCircleColor={colors.surface}
                centerLabelComponent={() => (
                  <View style={styles.pieCenter}>
                    <Text style={[styles.pieCenterValue, { color: colors.text }]}>
                      {stats.monthlyCompletions}
                    </Text>
                    <Text style={[styles.pieCenterLabel, { color: colors.textSecondary }]}>
                      30 days
                    </Text>
                  </View>
                )}
              />
              <View style={styles.legend}>
                {pieChartData.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                    <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                      {item.text}
                    </Text>
                    <Text style={[styles.legendValue, { color: colors.text }]}>
                      {item.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Quick Stats */}
        <View style={[styles.quickStats, { backgroundColor: colors.surface }]}>
          <View style={styles.quickStatRow}>
            <MaterialIcons name="list" size={20} color={colors.primary} />
            <Text style={[styles.quickStatLabel, { color: colors.textSecondary }]}>
              Active Habits
            </Text>
            <Text style={[styles.quickStatValue, { color: colors.text }]}>
              {stats.activeHabitsCount}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.quickStatRow}>
            <MaterialIcons name="calendar-month" size={20} color={colors.primary} />
            <Text style={[styles.quickStatLabel, { color: colors.textSecondary }]}>
              This Month
            </Text>
            <Text style={[styles.quickStatValue, { color: colors.text }]}>
              {stats.monthlyCompletions}
            </Text>
          </View>
        </View>
      </ScrollView>
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
    padding: SPACING.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  statValue: {
    fontSize: 26,
    fontFamily: FONT.bold,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: FONT.medium,
  },
  chartContainer: {
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  chartTitle: {
    fontSize: 17,
    fontFamily: FONT.bold,
    marginBottom: SPACING.xs,
  },
  chartSubtitle: {
    fontSize: 13,
    fontFamily: FONT.regular,
    marginBottom: SPACING.xl,
  },
  chartWrapper: {
    alignItems: 'center',
  },
  pieWrapper: {
    alignItems: 'center',
  },
  pieCenter: {
    alignItems: 'center',
  },
  pieCenterValue: {
    fontSize: 22,
    fontFamily: FONT.bold,
  },
  pieCenterLabel: {
    fontSize: 11,
    fontFamily: FONT.regular,
  },
  legend: {
    marginTop: SPACING.xl,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.sm,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONT.regular,
  },
  legendValue: {
    fontSize: 14,
    fontFamily: FONT.semibold,
  },
  quickStats: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  quickStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  quickStatLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONT.regular,
  },
  quickStatValue: {
    fontSize: 17,
    fontFamily: FONT.bold,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: SPACING.md,
  },
});

export default StatsScreen;
