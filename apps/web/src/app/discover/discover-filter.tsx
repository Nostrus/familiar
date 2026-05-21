'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parseISO } from 'date-fns';
import { CalendarDays, Check, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type DateRange } from 'react-day-picker';

type Props = {
  allCities: string[];
};

export function DiscoverFilter({ allCities }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cityOpen, setCityOpen] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  const citiesParam = searchParams.get('cities') ?? '';
  const dateFromParam = searchParams.get('from') ?? '';
  const dateToParam = searchParams.get('to') ?? '';
  const guestsParam = searchParams.get('guests') ?? '';

  const selectedCities = useMemo(
    () => (citiesParam ? citiesParam.split(',').filter(Boolean) : []),
    [citiesParam],
  );

  const [filterCities, setFilterCities] = useState<string[]>(selectedCities);
  const [filterDateFrom, setFilterDateFrom] = useState(dateFromParam);
  const [filterDateTo, setFilterDateTo] = useState(dateToParam);
  const [filterGuests, setFilterGuests] = useState(guestsParam);

  useEffect(() => {
    setFilterCities(selectedCities);
    setFilterDateFrom(dateFromParam);
    setFilterDateTo(dateToParam);
    setFilterGuests(guestsParam);
  }, [selectedCities, dateFromParam, dateToParam, guestsParam]);

  useEffect(() => {
    if (!cityOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!cityRef.current) {
        return;
      }

      if (!cityRef.current.contains(event.target as Node)) {
        setCityOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cityOpen]);

  const filterDateRange = useMemo<DateRange | undefined>(() => {
    if (!filterDateFrom && !filterDateTo) {
      return undefined;
    }

    return {
      from: filterDateFrom ? parseISO(filterDateFrom) : undefined,
      to: filterDateTo ? parseISO(filterDateTo) : undefined,
    };
  }, [filterDateFrom, filterDateTo]);

  const dateRangeLabel =
    filterDateRange?.from && filterDateRange?.to
      ? `${format(filterDateRange.from, 'PPP')} - ${format(filterDateRange.to, 'PPP')}`
      : filterDateRange?.from
        ? format(filterDateRange.from, 'PPP')
        : 'Pick a date range';

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (filterCities.length > 0) {
      params.set('cities', filterCities.join(','));
    } else {
      params.delete('cities');
    }

    if (filterDateFrom) {
      params.set('from', filterDateFrom);
    } else {
      params.delete('from');
    }

    if (filterDateTo) {
      params.set('to', filterDateTo);
    } else {
      params.delete('to');
    }

    if (filterGuests) {
      params.set('guests', filterGuests);
    } else {
      params.delete('guests');
    }

    const query = params.toString();
    router.push(query ? `/discover?${query}` : '/discover');
  }, [router, searchParams, filterCities, filterDateFrom, filterDateTo, filterGuests]);

  const toggleCity = (city: string) => {
    const next = filterCities.includes(city)
      ? filterCities.filter((c) => c !== city)
      : [...filterCities, city];
    setFilterCities(next);
  };

  const clearAll = () => {
    setFilterCities([]);
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterGuests('');
    setCityOpen(false);
    router.push('/discover');
  };

  const hasFilters = filterCities.length > 0 || filterDateFrom || filterDateTo || filterGuests;

  return (
    <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end gap-3 px-6 md:px-10">
        {/* Date range */}
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-slate-500">Date range</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-10 min-w-64 justify-start gap-2 border-slate-200 bg-white px-3 text-left text-sm text-slate-800 hover:bg-white"
              >
                <CalendarDays className="h-4 w-4 text-slate-400" />
                <span className="truncate">{dateRangeLabel}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="range"
                selected={filterDateRange}
                onSelect={(range) => {
                  setFilterDateFrom(range?.from ? format(range.from, 'yyyy-MM-dd') : '');
                  setFilterDateTo(range?.to ? format(range.to, 'yyyy-MM-dd') : '');
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* City Multi-Select */}
        <div className="relative flex flex-col gap-1" ref={cityRef}>
          <p className="text-xs font-medium text-slate-500">Cities</p>
          <button
            type="button"
            onClick={() => setCityOpen((o) => !o)}
            className="flex h-10 min-w-44 items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <span className="truncate">
              {filterCities.length === 0
                ? 'All cities'
                : filterCities.length === 1
                  ? filterCities[0]
                  : `${filterCities.length} cities`}
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${cityOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {cityOpen && (
            <div className="absolute top-full left-0 z-20 mt-1 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <div className="max-h-60 overflow-y-auto p-1">
                {allCities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => toggleCity(city)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        filterCities.includes(city)
                          ? 'border-primary bg-primary text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {filterCities.includes(city) && (
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      )}
                    </span>
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Guests */}
        <div className="flex flex-col gap-1">
          <label htmlFor="discover-guests" className="text-xs font-medium text-slate-500">
            Number of guests
          </label>
          <input
            id="discover-guests"
            type="number"
            min={1}
            max={20}
            placeholder="Any"
            value={filterGuests}
            onChange={(e) => setFilterGuests(e.target.value)}
            className="h-10 w-24 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <Button
          type="button"
          onClick={applyFilters}
          className="inline-flex h-10 items-center gap-2 self-end rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Apply filters
        </Button>

        {/* Clear */}
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="h-10 rounded-lg px-3 text-sm font-medium text-slate-500 hover:text-slate-800 self-end"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
