import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './helpers';
import Applications from '../components/applications';
import * as nestoApi from '../services/axios/nestoApi';
import { mockApplication, mockProduct } from './helpers';

const mockPageResponse = (data: unknown) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {} as never,
});

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('Applications', () => {
  it('shows a loading state initially', () => {
    vi.spyOn(nestoApi, 'getApplications').mockReturnValue(new Promise(() => {}));
    vi.spyOn(nestoApi, 'getProducts').mockReturnValue(new Promise(() => {}));
    renderWithProviders(<Applications />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows an error message when the API call fails', async () => {
    vi.spyOn(nestoApi, 'getApplications').mockRejectedValue({ data: { message: 'Server error' }, errorType: '03' });
    vi.spyOn(nestoApi, 'getProducts').mockResolvedValue(mockPageResponse([]) as never);
    renderWithProviders(<Applications />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /unable to load applications/i })).toBeInTheDocument();
    });
  });

  it('renders the Applications heading', async () => {
    vi.spyOn(nestoApi, 'getApplications').mockResolvedValue(mockPageResponse([mockApplication]) as never);
    vi.spyOn(nestoApi, 'getProducts').mockResolvedValue(mockPageResponse([mockProduct]) as never);
    renderWithProviders(<Applications />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /applications/i })).toBeInTheDocument();
    });
  });

  it('renders applicant data in table rows', async () => {
    vi.spyOn(nestoApi, 'getApplications').mockResolvedValue(mockPageResponse([mockApplication]) as never);
    vi.spyOn(nestoApi, 'getProducts').mockResolvedValue(mockPageResponse([mockProduct]) as never);
    renderWithProviders(<Applications />);
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('555-1234')).toBeInTheDocument();
    });
  });

  it('renders the product name in the Product column', async () => {
    vi.spyOn(nestoApi, 'getApplications').mockResolvedValue(mockPageResponse([mockApplication]) as never);
    vi.spyOn(nestoApi, 'getProducts').mockResolvedValue(mockPageResponse([mockProduct]) as never);
    renderWithProviders(<Applications />);
    await waitFor(() => {
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    });
  });

  it('renders an Edit button for each applicant row', async () => {
    vi.spyOn(nestoApi, 'getApplications').mockResolvedValue(mockPageResponse([mockApplication]) as never);
    vi.spyOn(nestoApi, 'getProducts').mockResolvedValue(mockPageResponse([mockProduct]) as never);
    renderWithProviders(<Applications />);
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /edit/i })).toHaveLength(1);
    });
  });

  it('navigates to /form with the application when Edit is clicked', async () => {
    vi.spyOn(nestoApi, 'getApplications').mockResolvedValue(mockPageResponse([mockApplication]) as never);
    vi.spyOn(nestoApi, 'getProducts').mockResolvedValue(mockPageResponse([mockProduct]) as never);
    renderWithProviders(<Applications />, { initialEntries: ['/listings'], path: '/listings' });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    await waitFor(() => {
      expect(screen.getByTestId('form-page')).toBeInTheDocument();
    });
  });
});
