/**
 * Critical tests for the HomeEditForm photo upload UI.
 * Verifies client-side 5 MB size guard before hitting the server action.
 */

jest.mock('../src/app/homes/[id]/actions', () => ({
  uploadHomePhoto: jest.fn(),
  removeHomePhoto: jest.fn(),
  updateHome: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: jest.fn(), replace: jest.fn() }),
  usePathname: () => '/homes/1',
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} alt={props.alt ?? ''} />
  ),
}));

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as editActions from '../src/app/homes/[id]/actions';
import { HomeEditForm } from '../src/app/homes/[id]/components/home-edit-form';

const mockUploadHomePhoto = editActions.uploadHomePhoto as jest.Mock;

const stubHome = {
  id: 1,
  description: 'Nice place',
  city: 'Paris',
  country: 'France',
  amenities: [],
  photos: [],
};

const stubCities = [{ city: 'Paris', country: 'France', homes: 10, tagline: '' }];

beforeEach(() => {
  jest.clearAllMocks();
});

function openForm() {
  render(<HomeEditForm home={stubHome} cities={stubCities} defaultOpen />);
}

describe('HomeEditForm photo upload', () => {
  it('rejects files larger than 5 MB without calling the server action', async () => {
    openForm();

    const input = document.querySelector<HTMLInputElement>('input[type="file"]')!;
    const bigFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'big.jpg', {
      type: 'image/jpeg',
    });
    Object.defineProperty(bigFile, 'size', { value: 6 * 1024 * 1024 });

    fireEvent.change(input, { target: { files: [bigFile] } });

    await waitFor(() => {
      expect(screen.getByText(/5 MB or smaller/i)).toBeTruthy();
    });
    expect(mockUploadHomePhoto).not.toHaveBeenCalled();
  });

  it('calls the server action for files within the 5 MB limit', async () => {
    mockUploadHomePhoto.mockResolvedValue({ urls: ['https://blob.example/ok.jpg'] });
    openForm();

    const input = document.querySelector<HTMLInputElement>('input[type="file"]')!;
    const okFile = new File(['data'], 'ok.jpg', { type: 'image/jpeg' });
    Object.defineProperty(okFile, 'size', { value: 1 * 1024 * 1024 });

    fireEvent.change(input, { target: { files: [okFile] } });

    await waitFor(() => {
      expect(mockUploadHomePhoto).toHaveBeenCalledTimes(1);
    });
    expect(screen.queryByText(/5 MB or smaller/i)).toBeNull();
  });
});
