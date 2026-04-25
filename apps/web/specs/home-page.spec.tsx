import { render, screen } from '@testing-library/react';

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(async () => ({ userId: 'user_123' })),
}));

jest.mock('@clerk/nextjs', () => ({
  Show: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('../src/db/queries/get-home', () => ({
  getHome: jest.fn(async () => ({
    id: 7,
    ownerId: 'owner_456',
    city: 'Paris',
    country: 'France',
    description: 'Bright apartment near Canal Saint-Martin',
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    amenities: [],
    photos: [],
    availability: [],
    viewerRequest: null,
    pendingRequestsForOwner: [],
    isFavorited: true,
  })),
}));

jest.mock('../src/app/homes/[id]/components/home-amenities', () => ({
  HomeAmenities: () => <div>HomeAmenities</div>,
}));

jest.mock('../src/app/homes/[id]/components/home-availability', () => ({
  HomeAvailability: () => <div>HomeAvailability</div>,
}));

jest.mock('../src/app/homes/[id]/components/home-edit-form', () => ({
  HomeEditForm: () => <div>HomeEditForm</div>,
}));

jest.mock('../src/app/homes/[id]/components/home-stay-requests', () => ({
  HomeStayRequests: () => <div>HomeStayRequests</div>,
}));

jest.mock('../src/app/homes/[id]/actions', () => ({
  toggleFavorite: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt} />,
}));

import HomePage from '../src/app/homes/[id]/page';

describe('HomePage favorites', () => {
  it('renders a saved favorites button for signed-in users', async () => {
    render(await HomePage({ params: Promise.resolve({ id: '7' }) }));

    expect(screen.getByRole('button', { name: /saved/i })).toBeTruthy();
  });
});
