import { render } from '@testing-library/react';
import Page from '../src/app/page';

jest.mock('../src/components/hero', () => ({
  Hero: () => <div>Hero</div>,
}));

jest.mock('../src/components/featured-homes', () => ({
  FeaturedHomes: () => <div>Featured Homes</div>,
}));

jest.mock('../src/components/popular-destinations', () => ({
  PopularDestinations: () => <div>Popular Destinations</div>,
}));

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeTruthy();
  });
});
