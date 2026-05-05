import Feather from '@expo/vector-icons/Feather';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';
import type { MarkedDates } from 'react-native-calendars/src/types';
import { Text } from './Themed';

export type DiscoverFiltersValue = {
  cities: string[];
  from: string;
  to: string;
  guests: string;
};

type DiscoverFiltersProps = {
  allCities: string[];
  value: DiscoverFiltersValue;
  hasAppliedFilters: boolean;
  onChange: (next: DiscoverFiltersValue) => void;
  onApply: () => void;
  onClear: () => void;
};

export type DiscoverFiltersHandle = {
  closePopovers: () => void;
};

function hasDraftFilters(filters: DiscoverFiltersValue) {
  return (
    filters.cities.length > 0 ||
    filters.from.trim().length > 0 ||
    filters.to.trim().length > 0 ||
    filters.guests.trim().length > 0
  );
}

function formatDateLabel(value: string) {
  if (!value) {
    return '';
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getTodayValue() {
  return toDateValue(new Date());
}

function buildMarkedDates(from: string, to: string): MarkedDates {
  if (!from) {
    return {};
  }

  if (!to || to < from) {
    return {
      [from]: {
        startingDay: true,
        endingDay: true,
        color: '#0f172a',
        textColor: '#ffffff',
      },
    };
  }

  const marks: MarkedDates = {};
  const current = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);

  while (current <= end) {
    const value = toDateValue(current);
    const isStart = value === from;
    const isEnd = value === to;

    marks[value] = {
      color: isStart || isEnd ? '#0f172a' : '#dbeafe',
      textColor: isStart || isEnd ? '#ffffff' : '#0f172a',
      startingDay: isStart,
      endingDay: isEnd,
    };

    current.setDate(current.getDate() + 1);
  }

  return marks;
}

export const DiscoverFilters = forwardRef<DiscoverFiltersHandle, DiscoverFiltersProps>(
  function DiscoverFilters(
    { allCities, value, hasAppliedFilters, onChange, onApply, onClear }: DiscoverFiltersProps,
    ref,
  ) {
    const [cityOpen, setCityOpen] = useState(false);
    const [dateOpen, setDateOpen] = useState(false);

    function closePopovers() {
      setCityOpen(false);
      setDateOpen(false);
    }

    useImperativeHandle(
      ref,
      () => ({
        closePopovers,
      }),
      [],
    );

    function stopEventPropagation(event: GestureResponderEvent) {
      event.stopPropagation();
    }

    const cityLabel =
      value.cities.length === 0
        ? 'All cities'
        : value.cities.length === 1
          ? value.cities[0]
          : `${value.cities.length} cities`;

    const dateLabel =
      value.from && value.to
        ? `${formatDateLabel(value.from)} - ${formatDateLabel(value.to)}`
        : value.from
          ? `${formatDateLabel(value.from)} - Select end`
          : 'Any time';

    const markedDates = useMemo(
      () => buildMarkedDates(value.from, value.to),
      [value.from, value.to],
    );
    const todayValue = getTodayValue();

    function updateCities(nextCities: string[]) {
      onChange({
        ...value,
        cities: nextCities,
      });
    }

    function toggleCity(city: string) {
      const next = value.cities.includes(city)
        ? value.cities.filter((selected) => selected !== city)
        : [...value.cities, city];

      updateCities(next);
    }

    function onDayPress(day: DateData) {
      const selectedDate = day.dateString;

      if (!value.from || value.to) {
        onChange({
          ...value,
          from: selectedDate,
          to: '',
        });
        return;
      }

      if (selectedDate < value.from) {
        onChange({
          ...value,
          from: selectedDate,
          to: value.from,
        });
        return;
      }

      onChange({
        ...value,
        to: selectedDate,
      });
    }

    return (
      <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
        <Text className="mb-3 text-lg font-bold text-slate-900">Filters</Text>

        <Text className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
          Cities
        </Text>
        <Pressable
          onPress={(event) => {
            stopEventPropagation(event);
            setDateOpen(false);
            setCityOpen((open) => !open);
          }}
          className="mb-3 rounded-xl border border-slate-300 bg-white px-3 py-2"
        >
          <Text className="text-slate-800">{cityLabel}</Text>
        </Pressable>

        {cityOpen && (
          <View
            className="mb-4 max-h-52 rounded-xl border border-slate-200 bg-white"
            onTouchStart={stopEventPropagation}
          >
            <ScrollView nestedScrollEnabled>
              <View className="p-2">
                {allCities.map((city) => {
                  const selected = value.cities.includes(city);

                  return (
                    <Pressable
                      key={city}
                      onPress={(event) => {
                        stopEventPropagation(event);
                        toggleCity(city);
                      }}
                      className={`mb-1 rounded-lg px-3 py-2 ${selected ? 'bg-slate-900' : 'bg-white'}`}
                    >
                      <Text className={`${selected ? 'text-white' : 'text-slate-700'}`}>
                        {city}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}

        <Text className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
          Date range
        </Text>
        <Pressable
          onPress={(event) => {
            stopEventPropagation(event);
            setCityOpen(false);
            setDateOpen((open) => !open);
          }}
          className="mb-3 rounded-xl border border-slate-300 bg-white px-3 py-2"
        >
          <Text className="text-slate-800">{dateLabel}</Text>
        </Pressable>

        {dateOpen && (
          <View
            className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white"
            onTouchStart={stopEventPropagation}
          >
            <Text className="px-3 pt-3 pb-2 text-xs text-slate-500">
              Tap a start date, then tap an end date.
            </Text>
            <Calendar
              current={value.from || todayValue}
              minDate={todayValue}
              markingType="period"
              markedDates={markedDates}
              onDayPress={onDayPress}
              enableSwipeMonths
              renderArrow={(direction) => (
                <Feather
                  name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
                  size={18}
                  color="#0f172a"
                />
              )}
              theme={{
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#64748b',
                monthTextColor: '#0f172a',
                dayTextColor: '#0f172a',
                todayTextColor: '#2563eb',
                arrowColor: '#0f172a',
                textDayFontFamily: 'Nunito-Regular',
                textMonthFontFamily: 'Nunito-Regular',
                textDayHeaderFontFamily: 'Nunito-Regular',
              }}
            />
          </View>
        )}

        <Text className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
          Guests
        </Text>
        <View className="mb-4 flex-row gap-2">
          {[1, 2, 3, 4, 5, 6].map((count) => {
            const selected = value.guests === String(count);
            return (
              <Pressable
                key={count}
                onPress={() => onChange({ ...value, guests: String(count) })}
                className={`rounded-full border px-3 py-1.5 ${
                  selected ? 'border-slate-900 bg-slate-900' : 'border-slate-300 bg-white'
                }`}
              >
                <Text className={`text-sm ${selected ? 'text-white' : 'text-slate-700'}`}>
                  {count}
                </Text>
              </Pressable>
            );
          })}
          <Pressable
            onPress={() => onChange({ ...value, guests: '' })}
            className="rounded-full border border-slate-300 bg-white px-3 py-1.5"
          >
            <Text className="text-sm text-slate-700">Any</Text>
          </Pressable>
        </View>

        <View className="flex-row gap-2">
          <Pressable
            onPress={() => {
              closePopovers();
              onApply();
            }}
            className="rounded-xl bg-slate-900 px-4 py-2 active:bg-blue-800"
          >
            <Text className="font-medium text-white">Apply filters</Text>
          </Pressable>
          {(hasDraftFilters(value) || hasAppliedFilters) && (
            <Pressable
              onPress={onClear}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 active:bg-blue-100"
            >
              <Text className="font-medium text-slate-700">Clear all</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  },
);
