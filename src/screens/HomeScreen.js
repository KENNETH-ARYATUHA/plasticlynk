// ---------------------------------------------------------------------------
// HomeScreen — the collector's daily starting point.
// Shows: greeting, today's totals, a big "New collection" button, recent work.
// ---------------------------------------------------------------------------

import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, StatTile, CollectionRow, StatusBadge } from '../components';
import { colors, spacing, font } from '../theme';
import { formatUGX, isToday } from '../format';
import { useData, COLLECTOR } from '../DataContext';

export default function HomeScreen({ navigation }) {
  const { collections } = useData();

  // Today's totals, calculated from the list (the server will do this later)
  const today = collections.filter((c) => isToday(c.capturedAt));
  const todayKg = today.reduce((sum, c) => sum + c.weightKg, 0);
  const todayUGX = today.reduce((sum, c) => sum + c.amountUGX, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Greeting + assigned area */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.hello}>Hello, {COLLECTOR.name}</Text>
            <Text style={styles.sub}>{COLLECTOR.id} · {COLLECTOR.area}</Text>
          </View>
          <StatusBadge status={COLLECTOR.status} />
        </View>

        {/* Today summary */}
        <Text style={styles.section}>Today</Text>
        <View style={styles.tiles}>
          <StatTile value={`${todayKg} kg`} label="Plastic collected" />
          <View style={{ width: spacing.sm }} />
          <StatTile value={String(today.length)} label="Collections" />
        </View>
        <Card style={{ marginTop: spacing.sm }}>
          <Text style={styles.sub}>Cash paid out today</Text>
          <Text style={styles.money}>{formatUGX(todayUGX)}</Text>
        </Card>

        {/* Primary action: always one tap away */}
        <Button
          title="New collection"
          icon="add-circle"
          onPress={() => navigation.navigate('NewCollection')}
          style={{ marginTop: spacing.lg }}
        />

        {/* Recent list (latest 3) */}
        <Text style={[styles.section, { marginTop: spacing.lg }]}>Recent</Text>
        {collections.slice(0, 3).map((c) => (
          <CollectionRow key={c.id} item={c} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  hello: { fontSize: font.title, fontWeight: '800', color: colors.text },
  sub: { fontSize: font.small, color: colors.textMuted, marginTop: 2 },
  section: { fontSize: font.heading, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  tiles: { flexDirection: 'row' },
  money: { fontSize: font.title, fontWeight: '800', color: colors.text, marginTop: 2 },
});