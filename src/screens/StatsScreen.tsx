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



const StatsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { activeHabits, habits } = useHabits();

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
    health: '#ef4444',
    fitness: '#f97316',
    work: '#3b82f6',
    learning: '#8b5cf6',
    personal: '#06b6d4',
    finance: '#22c55e',
    social: '#ec4899',
    mindfulness: '#a855f7',
    other: '#6b7280',
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
    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
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
            color="#22c55e"
          />
          <StatCard
            icon="today"
            label="This Week"
            value={stats.weeklyCompletions}
            color="#3b82f6"
          />
          <StatCard
            icon="local-fire-department"
            label="Best Streak"
            value={stats.bestStreak}
            color="#f97316"
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
              width={Math.max(width - 100, 200)}
              barWidth={Math.max(20, Math.min(32, (width - 120) / 10))}
              spacing={Math.max(8, (width - 180) / 14)}
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
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: 130,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  chartContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 13,
    marginBottom: 20,
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
    fontSize: 24,
    fontWeight: '700',
  },
  pieCenterLabel: {
    fontSize: 11,
  },
  legend: {
    marginTop: 20,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickStats: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  quickStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickStatLabel: {
    flex: 1,
    fontSize: 15,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
});

export default StatsScreen;
