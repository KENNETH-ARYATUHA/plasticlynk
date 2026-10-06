// ---------------------------------------------------------------------------
// components.js — small reusable UI pieces shared by all screens.
// Keeping them here means every screen looks consistent.
// ---------------------------------------------------------------------------

import React from 'react';
import { Pressable, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, MIN_TOUCH } from './theme';
import { formatUGX, formatDateTime } from './format';

// ---- Button ---------------------------------------------------------------
// variant: 'primary' (filled green) | 'secondary' (outlined)
export function Button({ title, onPress, variant = 'primary', icon, disabled, loading, style }) {
  const primary = variant === 'primary';
  const fg = primary ? '#FFFFFF' : colors.primary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        primary ? styles.btnPrimary : styles.btnSecondary,
        disabled && styles.btnDisabled,
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={20} color={fg} style={{ marginRight: spacing.sm }} /> : null}
          <Text style={[styles.btnText, { color: fg }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

// ---- Card -----------------------------------------------------------------
export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ---- StatusBadge ----------------------------------------------------------
// Maps a status word to a colour pair. Add new statuses here.
const BADGE = {
  Verified:    { fg: colors.primaryDark, bg: colors.primarySoft },
  Completed:   { fg: colors.primaryDark, bg: colors.primarySoft },
  Pending:     { fg: colors.warning,     bg: colors.warningSoft },
  Flagged:     { fg: colors.warning,     bg: colors.warningSoft },
  Suspended:   { fg: colors.danger,      bg: colors.dangerSoft },
  Deactivated: { fg: colors.danger,      bg: colors.dangerSoft },
};
export function StatusBadge({ status }) {
  const c = BADGE[status] || BADGE.Pending;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.fg }]}>{status}</Text>
    </View>
  );
}

// ---- StatTile -------------------------------------------------------------
// Big number + label, used for "Today" summary on Home.
export function StatTile({ value, label }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

// ---- CollectionRow --------------------------------------------------------
// One line in a list of collections (Home "Recent" and History).
export function CollectionRow({ item }) {
  return (
    <Card style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowId}>{item.id}</Text>
        <Text style={styles.rowMeta}>{formatDateTime(item.capturedAt)}</Text>
        <Text style={styles.rowMeta}>
          {item.weightKg} kg · {formatUGX(item.amountUGX)}
        </Text>
      </View>
      <StatusBadge status={item.status} />
    </Card>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: MIN_TOUCH,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: { backgroundColor: colors.primary },
  btnSecondary: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primary },
  btnDisabled: { opacity: 0.45 },
  btnText: { fontSize: font.body, fontWeight: '700' },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },

  badge: { paddingHorizontal: spacing.sm + 2, paddingVertical: spacing.xs + 1, borderRadius: radius.pill },
  badgeText: { fontSize: font.small, fontWeight: '700' },

  tile: {
    flex: 1,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  tileValue: { fontSize: font.title, fontWeight: '800', color: colors.primaryDark },
  tileLabel: { fontSize: font.small, color: colors.textMuted, marginTop: 2 },

  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  rowId: { fontSize: font.body, fontWeight: '700', color: colors.text },
  rowMeta: { fontSize: font.small, color: colors.textMuted, marginTop: 2 },
});