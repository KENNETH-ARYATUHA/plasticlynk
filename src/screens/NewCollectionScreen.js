// ---------------------------------------------------------------------------
// NewCollectionScreen — the evidence flow (the heart of PlasticLink).
//
//   Step 1  'details' : collector types the weight; amount is calculated.
//   Step 2  'camera'  : IN-APP camera only. No gallery picker, by design.
//   Step 3  'review'  : photo + weight + time + GPS + cash confirmation, then save.
//
// Time and GPS are captured automatically at the moment of the photo, so the
// collector never types them. (The server must re-stamp the time on upload,
// because a phone clock can be changed.)
// ---------------------------------------------------------------------------

import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Image, Pressable, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card } from '../components';
import { colors, spacing, radius, font, MIN_TOUCH } from '../theme';
import { formatUGX, formatDateTime } from '../format';
import { useData, PRICE_PER_KG_UGX } from '../DataContext';

export default function NewCollectionScreen({ navigation }) {
  const { addCollection } = useData();

  const [step, setStep] = useState('details');   // 'details' | 'camera' | 'review'
  const [weightText, setWeightText] = useState('');
  const [capture, setCapture] = useState(null);  // { uri, coords, capturedAt }
  const [paid, setPaid] = useState(false);       // cash-paid confirmation
  const [busy, setBusy] = useState(false);

  const cameraRef = useRef(null);
  const [camPerm, requestCamPerm] = useCameraPermissions();

  // Parse the weight. Accept "38" or "38.5"; reject empty, zero, negative.
  const weightKg = parseFloat(weightText.replace(',', '.'));
  const weightValid = !isNaN(weightKg) && weightKg > 0;
  const amountUGX = weightValid ? weightKg * PRICE_PER_KG_UGX : 0;

  // ---- Step 1 -> 2: ask permissions up front, then open camera -------------
  const goToCamera = async () => {
    if (!camPerm?.granted) {
      const res = await requestCamPerm();
      if (!res.granted) {
        Alert.alert('Camera needed', 'PlasticLink needs the camera to record evidence of each collection.');
        return;
      }
    }
    // Location is asked now (not mid-capture) so the shutter feels instant.
    // If denied we continue, and the record is saved without location (it
    // will be flagged for human review on the server).
    await Location.requestForegroundPermissionsAsync();
    setStep('camera');
  };

  // ---- Step 2: take the photo and capture time + GPS together --------------
  const takePhoto = async () => {
    if (!cameraRef.current || busy) return;
    setBusy(true);
    try {
      // quality 0.5 keeps uploads small on weak mobile data
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });

      let coords = null;
      const perm = await Location.getForegroundPermissionsAsync();
      if (perm.granted) {
        try {
          const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        } catch (e) {
          coords = null; // GPS unavailable right now; handled on review screen
        }
      }

      setCapture({ uri: photo.uri, coords, capturedAt: new Date().toISOString() });
      setStep('review');
    } catch (e) {
      Alert.alert('Could not take photo', 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  // ---- Step 3: save --------------------------------------------------------
  const save = () => {
    addCollection({ weightKg, photoUri: capture.uri, coords: capture.coords, capturedAt: capture.capturedAt });
    navigation.goBack();
  };

  // ======================= STEP 1: DETAILS ==================================
  if (step === 'details') {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>How much plastic?</Text>
          <Text style={styles.hint}>Weigh the plastic on your scale, then type the weight.</Text>

          <View style={styles.inputWrap}>
            <TextInput
              value={weightText}
              onChangeText={setWeightText}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              style={styles.weightInput}
              accessibilityLabel="Weight in kilograms"
              autoFocus
            />
            <Text style={styles.unit}>kg</Text>
          </View>

          {/* Live amount: weight x price, always visible before saving */}
          <Card style={{ marginTop: spacing.md }}>
            <Text style={styles.hint}>Price per kg: {formatUGX(PRICE_PER_KG_UGX)}</Text>
            <Text style={styles.amount}>{formatUGX(amountUGX)}</Text>
            <Text style={styles.hint}>Cash to pay the supplier</Text>
          </Card>

          <Button
            title="Next: take photo"
            icon="camera"
            disabled={!weightValid}
            onPress={goToCamera}
            style={{ marginTop: spacing.lg }}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ======================= STEP 2: CAMERA ===================================
  if (step === 'camera') {
    return (
      <View style={styles.cameraWrap}>
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />

        {/* Privacy reminder from the concept paper: plastic only, no faces */}
        <View style={styles.cameraBanner}>
          <Text style={styles.cameraBannerText}>Photograph the plastic only. Keep faces out of the photo.</Text>
        </View>

        <View style={styles.cameraControls}>
          <Pressable onPress={() => setStep('details')} style={styles.cameraBack} accessibilityLabel="Back">
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </Pressable>

          {/* Shutter button */}
          <Pressable
            onPress={takePhoto}
            disabled={busy}
            accessibilityLabel="Take photo"
            style={[styles.shutterOuter, busy && { opacity: 0.5 }]}
          >
            <View style={styles.shutterInner} />
          </Pressable>

          <View style={{ width: 52 }} />
        </View>
      </View>
    );
  }

  // ======================= STEP 3: REVIEW ===================================
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Check and save</Text>

        <Image source={{ uri: capture.uri }} style={styles.photo} />

        <Card style={{ marginTop: spacing.md }}>
          <Row label="Weight" value={`${weightKg} kg`} />
          <Row label="Amount" value={formatUGX(amountUGX)} />
          <Row label="Date and time" value={formatDateTime(capture.capturedAt)} />
          <Row
            label="Location"
            value={capture.coords ? `${capture.coords.lat.toFixed(4)}, ${capture.coords.lng.toFixed(4)}` : 'Not available'}
          />
        </Card>

        {/* Gentle, non-accusing notice if GPS failed */}
        {!capture.coords && (
          <Text style={styles.warn}>
            Location was not captured. You can still save; this record will be checked by an administrator.
          </Text>
        )}

        {/* Cash confirmation: the paper requires a recorded payment status */}
        <Pressable
          onPress={() => setPaid(!paid)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: paid }}
          style={styles.checkRow}
        >
          <Ionicons name={paid ? 'checkbox' : 'square-outline'} size={28} color={colors.primary} />
          <Text style={styles.checkText}>I have paid {formatUGX(amountUGX)} in cash to the supplier</Text>
        </Pressable>

        <Button title="Save collection" icon="checkmark-circle" disabled={!paid} onPress={save} style={{ marginTop: spacing.md }} />
        <Button
          title="Retake photo"
          variant="secondary"
          onPress={() => { setCapture(null); setStep('camera'); }}
          style={{ marginTop: spacing.sm }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// Small label/value line used in the review card
function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  title: { fontSize: font.title, fontWeight: '800', color: colors.text },
  hint: { fontSize: font.small, color: colors.textMuted, marginTop: spacing.xs },

  inputWrap: {
    flexDirection: 'row', alignItems: 'center', marginTop: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.primary, paddingHorizontal: spacing.md,
  },
  weightInput: { flex: 1, fontSize: font.display, fontWeight: '800', color: colors.text, minHeight: 72 },
  unit: { fontSize: font.heading, fontWeight: '700', color: colors.textMuted },
  amount: { fontSize: font.display, fontWeight: '800', color: colors.primaryDark, marginVertical: spacing.xs },

  cameraWrap: { flex: 1, backgroundColor: '#000' },
  cameraBanner: { position: 'absolute', top: spacing.lg, left: spacing.md, right: spacing.md, backgroundColor: 'rgba(0,0,0,0.6)', padding: spacing.sm + 2, borderRadius: radius.sm },
  cameraBannerText: { color: '#fff', fontSize: font.small, textAlign: 'center' },
  cameraControls: { position: 'absolute', bottom: spacing.xl, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  cameraBack: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  shutterOuter: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff' },

  photo: { width: '100%', height: 260, borderRadius: radius.md, marginTop: spacing.md, backgroundColor: colors.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs + 1 },
  rowLabel: { fontSize: font.body, color: colors.textMuted },
  rowValue: { fontSize: font.body, fontWeight: '700', color: colors.text, flexShrink: 1, textAlign: 'right' },
  warn: { fontSize: font.small, color: colors.warning, backgroundColor: colors.warningSoft, padding: spacing.sm + 2, borderRadius: radius.sm, marginTop: spacing.sm },
  checkRow: { flexDirection: 'row', alignItems: 'center', minHeight: MIN_TOUCH, marginTop: spacing.md },
  checkText: { flex: 1, marginLeft: spacing.sm, fontSize: font.body, color: colors.text },
});