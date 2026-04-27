import { fireEvent, render, screen } from '@testing-library/react';

// Mock next/navigation
const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
}));

import { DiscoverFilter } from '../src/components/discover-filter';

const allCities = ['Paris', 'London', 'Tokyo', 'New York'];

beforeEach(() => {
  mockPush.mockClear();
  // Reset search params
  mockSearchParams.forEach((_, key) => mockSearchParams.delete(key));
});

describe('DiscoverFilter', () => {
  it('renders date-range picker, city picker, and guests filter', () => {
    render(<DiscoverFilter allCities={allCities} />);
    expect(screen.getByText('Date range')).toBeTruthy();
    expect(screen.getByText('Cities')).toBeTruthy();
    expect(screen.getByLabelText('Number of guests')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Apply filters/i })).toBeTruthy();
  });

  it('shows "All cities" when no cities are selected', () => {
    render(<DiscoverFilter allCities={allCities} />);
    expect(screen.getByText('All cities')).toBeTruthy();
  });

  it('opens city dropdown when button is clicked', () => {
    render(<DiscoverFilter allCities={allCities} />);
    fireEvent.click(screen.getByText('All cities'));
    for (const city of allCities) {
      expect(screen.getByText(city)).toBeTruthy();
    }
  });

  it('closes city dropdown when clicking outside', () => {
    render(<DiscoverFilter allCities={allCities} />);
    fireEvent.click(screen.getByText('All cities'));
    expect(screen.getByText('Paris')).toBeTruthy();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText('Paris')).toBeNull();
  });

  it('does not call router.push when a city is selected until apply is clicked', () => {
    render(<DiscoverFilter allCities={allCities} />);
    fireEvent.click(screen.getByText('All cities'));
    fireEvent.click(screen.getByText('Paris'));
    expect(mockPush).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Apply filters/i }));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('cities=Paris'));
  });

  it('does not render "Clear all" when no filters are active', () => {
    render(<DiscoverFilter allCities={allCities} />);
    expect(screen.queryByText('Clear all')).toBeNull();
  });

  it('opens date-range picker and does not push until apply is clicked', () => {
    render(<DiscoverFilter allCities={allCities} />);
    fireEvent.click(screen.getByRole('button', { name: /Pick a date range/i }));

    expect(screen.getAllByRole('grid').length).toBeGreaterThan(0);

    expect(mockPush).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Apply filters/i }));
    expect(mockPush).toHaveBeenCalled();
  });

  it('applies guests filter when apply is clicked', () => {
    render(<DiscoverFilter allCities={allCities} />);
    const guestsInput = screen.getByLabelText('Number of guests');
    fireEvent.change(guestsInput, { target: { value: '4' } });

    expect(mockPush).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Apply filters/i }));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('guests=4'));
  });
});
