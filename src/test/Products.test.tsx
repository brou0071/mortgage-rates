import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './helpers';
import Products from '../components/products';
import * as nestoApi from '../services/axios/nestoApi';
import { mockProduct } from './helpers';

const variableProduct = { ...mockProduct, id: 2, name: 'Variable Product', type: 'VARIABLE' as const, rate: 3.9 };

const mockPageResponse = (products: nestoApi.ProductType[]) => ({
  data: products,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {} as never,
});

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('Products', () => {
  it('shows a loading state initially', () => {
    vi.spyOn(nestoApi, 'getProducts').mockReturnValue(new Promise(() => {}));
    renderWithProviders(<Products />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows an error message when the API call fails', async () => {
    vi.spyOn(nestoApi, 'getProducts').mockRejectedValue({ data: { message: 'Network error' }, errorType: '01' });
    renderWithProviders(<Products />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /unable to load/i })).toBeInTheDocument();
    });
  });

  it('renders fixed and variable product headings after load', async () => {
    vi.spyOn(nestoApi, 'getProducts').mockResolvedValue(
      mockPageResponse([mockProduct, variableProduct]) as never
    );
    renderWithProviders(<Products />);
    await waitFor(() => {
      expect(screen.getByText(/lowest fixed rate products/i)).toBeInTheDocument();
      expect(screen.getByText(/lowest variable rate products/i)).toBeInTheDocument();
    });
  });

  it('renders product cards after load', async () => {
    vi.spyOn(nestoApi, 'getProducts').mockResolvedValue(
      mockPageResponse([mockProduct, variableProduct]) as never
    );
    renderWithProviders(<Products />);
    await waitFor(() => {
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
      expect(screen.getByText(variableProduct.name)).toBeInTheDocument();
    });
  });

  it('calls createApplication and getApplication then navigates to /form on product select', async () => {
    vi.spyOn(nestoApi, 'getProducts').mockResolvedValue(
      mockPageResponse([mockProduct]) as never
    );
    vi.spyOn(nestoApi, 'createApplication').mockResolvedValue({
      data: { id: 'app-123' },
    } as never);
    vi.spyOn(nestoApi, 'getApplication').mockResolvedValue({
      data: { id: 'app-123', applicants: [], type: 'NEW', token: '', createdAt: '', productId: 1 },
    } as never);

    const { container } = renderWithProviders(<Products />, { initialEntries: ['/home'], path: '/home' });

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /select this product|choisir ce produit/i }).length).toBeGreaterThan(0);
    });

    await userEvent.click(screen.getAllByRole('button', { name: /select this product|choisir ce produit/i })[0]);

    await waitFor(() => {
      expect(nestoApi.createApplication).toHaveBeenCalledWith({ productId: mockProduct.id });
      expect(nestoApi.getApplication).toHaveBeenCalledWith('app-123', {});
    });
  });
});
