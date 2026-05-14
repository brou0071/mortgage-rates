import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './helpers';
import Form from '../views/form';
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
  vi.spyOn(nestoApi, 'getProducts').mockResolvedValue(mockPageResponse([mockProduct]) as never);
});

function renderForm(application?: typeof mockApplication) {
  return renderWithProviders(<Form />, {
    initialEntries: [{ pathname: '/form', state: application ? { application } : undefined }],
    path: '/form',
  });
}

describe('Form', () => {
  it('renders all input fields', async () => {
    renderForm();
    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    });
  });

  it('renders the submit button', async () => {
    renderForm();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });
  });

  it('pre-populates fields from the application in router state', async () => {
    renderForm(mockApplication);
    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('555-1234')).toBeInTheDocument();
    });
  });

  it('allows editing the input fields', async () => {
    renderForm();
    await waitFor(() => expect(screen.getByLabelText(/first name/i)).toBeInTheDocument());

    const firstNameInput = screen.getByLabelText(/first name/i);
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'Jane');
    expect(firstNameInput).toHaveValue('Jane');
  });

  it('calls updateApplication with the form data on submit', async () => {
    vi.spyOn(nestoApi, 'updateApplication').mockResolvedValue({ data: mockApplication } as never);
    renderForm(mockApplication);

    await waitFor(() => expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(nestoApi.updateApplication).toHaveBeenCalledWith(
        mockApplication.id,
        { applicants: [mockApplication.applicants[0]] }
      );
    });
  });

  it('shows a success message after a successful submit', async () => {
    vi.spyOn(nestoApi, 'updateApplication').mockResolvedValue({ data: mockApplication } as never);
    renderForm(mockApplication);

    await waitFor(() => expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/form submitted successfully/i)).toBeInTheDocument();
    });
  });

  it('shows an error message when updateApplication fails', async () => {
    vi.spyOn(nestoApi, 'updateApplication').mockRejectedValue(new Error('Network error'));
    renderForm(mockApplication);

    await waitFor(() => expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to update application/i)).toBeInTheDocument();
    });
  });

  it('disables the submit button while submitting', async () => {
    vi.spyOn(nestoApi, 'updateApplication').mockReturnValue(new Promise(() => {}));
    renderForm(mockApplication);

    await waitFor(() => expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
    });
  });
});
