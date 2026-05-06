import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';

type LocationType = 'home' | 'work' | 'other';

type SavedLocation = {
  id: string;
  nickname: string;
  address: string;
  type: LocationType;
  isDefault?: boolean;
};

const TYPE_CONFIG: Record<LocationType, { icon: string; label: string; color: string }> = {
  home: { icon: 'home', label: 'Home', color: T.brand },
  work: { icon: 'building', label: 'Work', color: T.ink },
  other: { icon: 'pin', label: 'Other', color: T.textSub },
};

const INITIAL_LOCATIONS: SavedLocation[] = [
  {
    id: '1',
    nickname: 'Home',
    address: 'Prestige Lake Ridge, Uttarahalli',
    type: 'home',
  },
  {
    id: '2',
    nickname: 'Office',
    address: 'Helix HQ, Bellandur',
    type: 'work',
    isDefault: true,
  },
  {
    id: '3',
    nickname: 'Gym',
    address: 'Cult Fit, HSR Layout',
    type: 'other',
  },
];

export default function SavedLocationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [locations, setLocations] = useState<SavedLocation[]>(INITIAL_LOCATIONS);
  const [showForm, setShowForm] = useState(false);

  const [nickname, setNickname] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<LocationType>('home');

  function handleDelete(id: string) {
    setLocations(prev => prev.filter(l => l.id !== id));
  }

  function handleEdit(id: string) {
    const loc = locations.find(l => l.id === id);
    if (!loc || loc.isDefault) return;
    setNickname(loc.nickname);
    setAddress(loc.address);
    setType(loc.type);
    handleDelete(id);
    setShowForm(true);
  }

  function handleSave() {
    if (!nickname.trim() || !address.trim()) return;
    const newLoc: SavedLocation = {
      id: `${Date.now()}`,
      nickname: nickname.trim(),
      address: address.trim(),
      type,
    };
    setLocations(prev => [...prev, newLoc]);
    setNickname('');
    setAddress('');
    setType('home');
    setShowForm(false);
  }

  function handleCancel() {
    setNickname('');
    setAddress('');
    setType('home');
    setShowForm(false);
  }

  const isEmpty = locations.length === 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: T.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 12 }}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Icon name="chev" size={16} color={T.text} />
            </Pressable>
            <Text style={styles.headerTitle}>Saved locations</Text>
            <View style={{ width: 36 }} />
          </View>
          <Text style={styles.pageTitle}>Frequent stops</Text>
          <Text style={styles.pageSub}>
            {isEmpty ? 'Add addresses you use often' : `${locations.length} saved`}
          </Text>
        </View>

        {/* Empty state */}
        {isEmpty && (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <Icon name="pin" size={28} color={T.textMute} />
            </View>
            <Text style={styles.emptyTitle}>No saved locations</Text>
            <Text style={styles.emptySub}>Add your home and frequent stops</Text>
          </View>
        )}

        {/* Locations list */}
        {!isEmpty && (
          <View style={{ paddingHorizontal: 16 }}>
            <Card padded={false}>
              {locations.map((loc, index) => {
                const config = TYPE_CONFIG[loc.type];
                const isLast = index === locations.length - 1;
                return (
                  <View
                    key={loc.id}
                    style={[styles.locRow, !isLast && styles.locRowBorder]}
                  >
                    <View
                      style={[
                        styles.locIcon,
                        { backgroundColor: loc.isDefault ? T.ink : T.brandSoft },
                      ]}
                    >
                      <Icon
                        name={config.icon}
                        size={18}
                        color={loc.isDefault ? '#fff' : T.brand}
                      />
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <View style={styles.locTitleRow}>
                        <Text style={styles.locNickname}>{loc.nickname}</Text>
                        {loc.isDefault && (
                          <Chip tone="dark" icon="lock">
                            Default
                          </Chip>
                        )}
                      </View>
                      <Text style={styles.locAddress} numberOfLines={1}>
                        {loc.address}
                      </Text>
                    </View>
                    {!loc.isDefault && (
                      <View style={styles.locActions}>
                        <Pressable
                          onPress={() => handleEdit(loc.id)}
                          style={styles.actionBtn}
                          accessibilityRole="button"
                          accessibilityLabel={`Edit ${loc.nickname}`}
                        >
                          <Icon name="edit" size={16} color={T.textMute} />
                        </Pressable>
                        <Pressable
                          onPress={() => handleDelete(loc.id)}
                          style={styles.actionBtn}
                          accessibilityRole="button"
                          accessibilityLabel={`Delete ${loc.nickname}`}
                        >
                          <Icon name="close" size={16} color={T.danger} />
                        </Pressable>
                      </View>
                    )}
                    {loc.isDefault && (
                      <View style={styles.locActions}>
                        <Icon name="lock" size={16} color={T.textMute} />
                      </View>
                    )}
                  </View>
                );
              })}
            </Card>
          </View>
        )}

        {/* Add form */}
        {showForm && (
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <Card>
              <Text style={styles.formTitle}>Add location</Text>

              <Text style={styles.inputLabel}>Nickname</Text>
              <TextInput
                value={nickname}
                onChangeText={setNickname}
                placeholder="e.g. Home, Gym, Cafe"
                placeholderTextColor={T.textMute}
                style={styles.input}
                autoFocus
              />

              <Text style={[styles.inputLabel, { marginTop: 12 }]}>Address</Text>
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Full address"
                placeholderTextColor={T.textMute}
                style={[styles.input, { height: 64, textAlignVertical: 'top' }]}
                multiline
              />

              <Text style={[styles.inputLabel, { marginTop: 12 }]}>Type</Text>
              <View style={styles.typeRow}>
                {(['home', 'work', 'other'] as LocationType[]).map(t => {
                  const selected = type === t;
                  return (
                    <Pressable
                      key={t}
                      onPress={() => setType(t)}
                      style={[
                        styles.typeBtn,
                        selected && { backgroundColor: T.brandSoft, borderColor: T.brand },
                      ]}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                    >
                      <Icon
                        name={TYPE_CONFIG[t].icon}
                        size={16}
                        color={selected ? T.brand : T.textSub}
                      />
                      <Text
                        style={[
                          styles.typeBtnText,
                          selected && { color: T.brand, fontWeight: '700' },
                        ]}
                      >
                        {TYPE_CONFIG[t].label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.formActions}>
                <Btn variant="ghost" onPress={handleCancel}>
                  Cancel
                </Btn>
                <Btn onPress={handleSave} style={{ flex: 1 }}>
                  Save
                </Btn>
              </View>
            </Card>
          </View>
        )}
      </ScrollView>

      {/* Add button */}
      {!showForm && (
        <View
          style={{
            position: 'absolute',
            bottom: insets.bottom + 16,
            left: 16,
            right: 16,
          }}
        >
          <Btn size="lg" icon="plus" full onPress={() => setShowForm(true)}>
            Add location
          </Btn>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '180deg' }],
    shadowColor: '#0F1428',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: { fontSize: 15, fontWeight: '700', color: T.text },
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.6,
    color: T.text,
    marginTop: 16,
  },
  pageSub: { fontSize: 13, color: T.textSub, marginTop: 2 },

  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: T.lineSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.text,
    marginTop: 16,
  },
  emptySub: {
    fontSize: 13,
    color: T.textSub,
    marginTop: 4,
    textAlign: 'center',
  },

  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    paddingHorizontal: 16,
  },
  locRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: T.lineSoft,
  },
  locIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  locTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locNickname: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: T.text,
  },
  locAddress: {
    fontSize: 13,
    color: T.textSub,
    marginTop: 2,
  },
  locActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: T.lineSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  formTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: T.text,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: T.textSub,
    marginBottom: 6,
  },
  input: {
    backgroundColor: T.cardAlt,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: T.text,
    borderWidth: 1,
    borderColor: T.lineSoft,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: T.cardAlt,
    borderWidth: 1,
    borderColor: T.lineSoft,
  },
  typeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.textSub,
  },
  formActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
    alignItems: 'center',
  },
});
