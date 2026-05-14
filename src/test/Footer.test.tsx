import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../components/footer';

describe('Footer', () => {
  it('renders the phone number', () => {
    render(<Footer />);
    expect(screen.getByText(/1\.866\.606\.6481/)).toBeInTheDocument();
  });

  it('renders the email link', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /info@nestogroup\.ca/i });
    expect(link).toHaveAttribute('href', 'mailto:info@nestogroup.ca');
  });

  it('renders the current year in the copyright notice', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });
});
