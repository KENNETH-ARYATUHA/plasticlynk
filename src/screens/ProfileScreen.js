// ---------------------------------------------------------------------------
// ProfileScreen — read-only collector identity.
// PRIVACY: the NIN is never shown in the app (administrators only).
// ---------------------------------------------------------------------------

import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, StatusBadge } from '../components';
import { colors, spacing, font } from '../theme';
import { COLLECTOR } from '../DataContext';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>

        <Card>
          <View style={styles.top}>
            <Text style={styles.name}>{COLLECTOR.name}</Text>
            <StatusBadge status={COLLECTOR.status} />
          </View>
          <Field label="Collector ID" value={COLLECTOR.id} />
          <Field label="Phone" value={COLLECTOR.phone} />
          <Field label="Assigned area" value={COLLECTOR.area} />
        </Card>

        <Text style={styles.note}>
          Your National ID details are kept private and are visible only to PlasticLink administrators.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, value }) {
  return (
    <View style={{ marginTop: spacing.md }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  title: { fontSize: font.title, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontSize: font.heading, fontWeight: '800', color: colors.text },
  label: { fontSize: font.small, color: colors.textMuted },
  value: { fontSize: font.body, fontWeight: '600', color: colors.text, marginTop: 2 },
  note: { fontSize: font.small, color: colors.textMuted, marginTop: spacing.md },
});