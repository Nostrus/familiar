import { render } from '@testing-library/react';
import Page from '../src/app/page';

jest.mock('../src/components/popular-destinations', () => ({
  PopularDestinations: () => <div>Popular Destinations</div>,
}));

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeTruthy();
  });
});
