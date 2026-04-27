import { render, screen } from '@testing-library/react';

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(async () => ({ userId: 'user_123' })),
}));

jest.mock('@org/db', () => ({
  getMyFavoriteHomes: jest.fn(async () => [
    {
      id: 11,
      ownerId: 'owner_1',
      cityId: 2,
      city: 'Lisbon',
      country: 'Portugal',
      description: 'Sunny flat with balcony',
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      amenities: [],
      photos: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
}));

import MyFavoritesPage from '../src/app/my-favorites/page';

describe('MyFavoritesPage', () => {
  it('renders saved homes instead of the placeholder copy', async () => {
    render(await MyFavoritesPage());

    expect(screen.getByRole('heading', { name: /my favorites/i })).toBeTruthy();
    expect(screen.getByText(/keep track of the homes/i)).toBeTruthy();
    expect(screen.getByRole('link')).toBeTruthy();
  });
});
