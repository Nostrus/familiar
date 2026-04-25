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

  const [draftCities, setDraftCities] = useState<string[]>(selectedCities);
  const [draftDateFrom, setDraftDateFrom] = useState(dateFromParam);
  const [draftDateTo, setDraftDateTo] = useState(dateToParam);
  const [draftGuests, setDraftGuests] = useState(guestsParam);

  useEffect(() => {
    setDraftCities(selectedCities);
    setDraftDateFrom(dateFromParam);
    setDraftDateTo(dateToParam);
    setDraftGuests(guestsParam);
  }, [selectedCities, dateFromParam, dateToParam, guestsParam]);

  const draftDateRange = useMemo<DateRange | undefined>(() => {
    if (!draftDateFrom && !draftDateTo) {
      return undefined;
    }

    return {
      from: draftDateFrom ? parseISO(draftDateFrom) : undefined,
      to: draftDateTo ? parseISO(draftDateTo) : undefined,
    };
  }, [draftDateFrom, draftDateTo]);

  const dateRangeLabel =
    draftDateRange?.from && draftDateRange?.to
      ? `${format(draftDateRange.from, 'PPP')} - ${format(draftDateRange.to, 'PPP')}`
      : draftDateRange?.from
        ? format(draftDateRange.from, 'PPP')
        : 'Pick a date range';

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (draftCities.length > 0) {
      params.set('cities', draftCities.join(','));
    } else {
      params.delete('cities');
    }

    if (draftDateFrom) {
      params.set('from', draftDateFrom);
    } else {
      params.delete('from');
    }

    if (draftDateTo) {
      params.set('to', draftDateTo);
    } else {
      params.delete('to');
    }

    if (draftGuests) {
      params.set('guests', draftGuests);
    } else {
      params.delete('guests');
    }

    const query = params.toString();
    router.push(query ? `/discover?${query}` : '/discover');
  }, [router, searchParams, draftCities, draftDateFrom, draftDateTo, draftGuests]);

  const toggleCity = (city: string) => {
    const next = draftCities.includes(city)
      ? draftCities.filter((c) => c !== city)
      : [...draftCities, city];
    setDraftCities(next);
  };

  const clearAll = () => {
    setDraftCities([]);
    setDraftDateFrom('');
    setDraftDateTo('');
    setDraftGuests('');
    setCityOpen(false);
    router.push('/discover');
  };

  const hasFilters = draftCities.length > 0 || draftDateFrom || draftDateTo || draftGuests;

  return (
    <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end gap-3 px-6 md:px-10">
        {/* Date range */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">Date range</label>
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
                selected={draftDateRange}
                onSelect={(range) => {
                  setDraftDateFrom(range?.from ? format(range.from, 'yyyy-MM-dd') : '');
                  setDraftDateTo(range?.to ? format(range.to, 'yyyy-MM-dd') : '');
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* City Multi-Select */}
        <div className="relative flex flex-col gap-1" ref={cityRef}>
          <label className="text-xs font-medium text-slate-500">Cities</label>
          <button
            type="button"
            onClick={() => setCityOpen((o) => !o)}
            className="flex h-10 min-w-44 items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <span className="truncate">
              {draftCities.length === 0
                ? 'All cities'
                : draftCities.length === 1
                  ? draftCities[0]
                  : `${draftCities.length} cities`}
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
                        draftCities.includes(city)
                          ? 'border-primary bg-primary text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {draftCities.includes(city) && (
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
            value={draftGuests}
            onChange={(e) => setDraftGuests(e.target.value)}
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
