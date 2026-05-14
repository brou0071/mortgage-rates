import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../components/header';
import { renderWithProviders } from './helpers';

describe('Header', () => {
  it('renders the Applications nav link', () => {
    renderWithProviders(<Header />);
    expect(screen.getByRole('link', { name: /applications|demandes/i })).toBeInTheDocument();
  });

  it('Applications link points to /listings', () => {
    renderWithProviders(<Header />);
    expect(screen.getByRole('link', { name: /applications|demandes/i })).toHaveAttribute('href', '/listings');
  });

  it('renders the logo image', () => {
    renderWithProviders(<Header />);
    const img = document.querySelector('img.base');
    expect(img).toBeInTheDocument();
  });

  it('logo is wrapped in a link to /home', () => {
    renderWithProviders(<Header />);
    const homeLink = screen.getByRole('link', { name: '' });
    expect(homeLink).toHaveAttribute('href', '/home');
  });

  it('renders a language toggle button', () => {
    renderWithProviders(<Header />);
    expect(screen.getByRole('button', { name: /^(FR|EN)$/ })).toBeInTheDocument();
  });

  it('toggles language when the button is clicked', async () => {
    renderWithProviders(<Header />);
    const btn = screen.getByRole('button', { name: /^(FR|EN)$/ });
    const initialLabel = btn.textContent;
    await userEvent.click(btn);
    expect(btn.textContent).not.toBe(initialLabel);
  });
});
