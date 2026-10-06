// ---------------------------------------------------------------------------
// HistoryScreen — every collection this collector has recorded, newest first.
// FlatList is used (not ScrollView) so long lists stay smooth on cheap phones.
// ---------------------------------------------------------------------------

import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CollectionRow } from '../components';
import { colors, spacing, font } from '../theme';
import { useData } from '../DataContext';

export default function HistoryScreen() {
  const { collections } = useData();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={collections}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => <CollectionRow item={item} />}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<Text style={styles.title}>History</Text>}
        // Friendly empty state instead of a blank screen
        ListEmptyComponent={
          <View style={{ marginTop: spacing.xl }}>
            <Text style={styles.empty}>No collections yet. Record your first one from Home.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  title: { fontSize: font.title, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  empty: { fontSize: font.body, color: colors.textMuted, textAlign: 'center' },
});