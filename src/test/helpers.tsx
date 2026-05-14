import { type ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function renderWithProviders(
  ui: ReactNode,
  { initialEntries = ['/'], path = '/' }: { initialEntries?: (string | { pathname: string; state?: unknown })[]; path?: string } = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path={path} element={ui} />
          <Route path="/form" element={<div data-testid="form-page" />} />
          <Route path="/listings" element={<div data-testid="listings-page" />} />
          <Route path="/home" element={<div data-testid="home-page" />} />
          <Route path="*" element={ui} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

export const mockProduct = {
  id: 1,
  name: 'Test Fixed Product',
  family: 'STANDARD' as const,
  type: 'FIXED' as const,
  term: '5_YEAR' as const,
  insurable: true,
  insurance: 'INSURED' as const,
  prepaymentOption: 'STANDARD' as const,
  restrictionsOption: 'NO_RESTRICTIONS' as const,
  restrictions: '',
  fixedPenaltySpread: '0',
  helocOption: 'HELOC_WITHOUT' as const,
  helocDelta: 0,
  lenderName: 'Test Lender',
  lenderType: 'BANK',
  rateHold: '90_DAYS' as const,
  rate: 4.5,
  ratePrimeVariance: 0,
  bestRate: 4.5,
  created: '2024-01-01',
  updated: '2024-01-01',
};

export const mockApplication = {
  id: 'app-123',
  token: 'tok-abc',
  type: 'NEW' as const,
  applicants: [
    { firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '555-1234' },
  ],
  productId: 1,
  createdAt: '2024-01-01T00:00:00Z',
};
