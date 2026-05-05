import type { Home } from '@org/types';
import { Modal, Pressable, ScrollView, TextInput, View } from 'react-native';
import { AMENITIES } from '../lib/amenities';
import { Text } from './Themed';

export type HomeEditDraft = {
  description: string;
  city: string;
  country: string;
  bedrooms: string;
  bathrooms: string;
  maxGuests: string;
  amenities: string[];
};

type HomeEditModalProps = {
  home: Home | null;
  draft: HomeEditDraft;
  saving: boolean;
  onClose: () => void;
  onSave: () => void;
  onDraftChange: (nextDraft: HomeEditDraft) => void;
};

export function HomeEditModal({
  home,
  draft,
  saving,
  onClose,
  onSave,
  onDraftChange,
}: HomeEditModalProps) {
  return (
    <Modal visible={!!home} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/35">
        <View className="rounded-t-3xl bg-white" style={{ maxHeight: '90%' }}>
          <ScrollView
            className="p-5"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-lg font-semibold text-slate-900 mb-4">Edit home</Text>

            <Text className="text-xs text-slate-500 mb-1">Description</Text>
            <TextInput
              value={draft.description}
              onChangeText={(value) => onDraftChange({ ...draft, description: value })}
              className="mb-3 rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              placeholder="Describe your home"
              multiline
            />

            <Text className="text-xs text-slate-500 mb-1">City</Text>
            <TextInput
              value={draft.city}
              onChangeText={(value) => onDraftChange({ ...draft, city: value })}
              className="mb-3 rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              placeholder="City"
            />

            <Text className="text-xs text-slate-500 mb-1">Country</Text>
            <TextInput
              value={draft.country}
              onChangeText={(value) => onDraftChange({ ...draft, country: value })}
              className="mb-3 rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              placeholder="Country"
            />

            <View className="flex-row gap-2 mb-4">
              <View className="flex-1">
                <Text className="text-xs text-slate-500 mb-1">Beds</Text>
                <TextInput
                  value={draft.bedrooms}
                  onChangeText={(value) => onDraftChange({ ...draft, bedrooms: value })}
                  keyboardType="number-pad"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-500 mb-1">Baths</Text>
                <TextInput
                  value={draft.bathrooms}
                  onChangeText={(value) => onDraftChange({ ...draft, bathrooms: value })}
                  keyboardType="number-pad"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-500 mb-1">Guests</Text>
                <TextInput
                  value={draft.maxGuests}
                  onChangeText={(value) => onDraftChange({ ...draft, maxGuests: value })}
                  keyboardType="number-pad"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                />
              </View>
            </View>

            {/* Amenities */}
            <Text className="text-xs text-slate-500 mb-2">Amenities</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {Object.values(AMENITIES).map(({ key, label }) => {
                const selected = draft.amenities.includes(key);
                return (
                  <Pressable
                    key={key}
                    onPress={() => {
                      const next = selected
                        ? draft.amenities.filter((a) => a !== key)
                        : [...draft.amenities, key];
                      onDraftChange({ ...draft, amenities: next });
                    }}
                    className={`rounded-lg border px-3 py-2 ${
                      selected ? 'border-primary bg-primary/10' : 'border-slate-300 bg-white'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selected ? 'text-primary' : 'text-slate-600'
                      }`}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View className="flex-row justify-end gap-2 pb-2">
              <Pressable onPress={onClose} className="rounded-lg border border-slate-300 px-4 py-2">
                <Text className="text-slate-700">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={onSave}
                disabled={saving}
                className="rounded-lg bg-primary px-4 py-2"
              >
                <Text className="text-white font-medium">{saving ? 'Saving...' : 'Save'}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
