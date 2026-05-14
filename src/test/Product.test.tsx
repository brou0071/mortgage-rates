import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Product from '../components/product';
import { mockProduct } from './helpers';

describe('Product', () => {
  it('renders the product name', () => {
    render(<Product product={mockProduct} onSelect={vi.fn()} />);
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
  });

  it('renders the product type', () => {
    render(<Product product={mockProduct} onSelect={vi.fn()} />);
    expect(screen.getByText(mockProduct.type)).toBeInTheDocument();
  });

  it('renders the product rate with a % sign', () => {
    render(<Product product={mockProduct} onSelect={vi.fn()} />);
    expect(screen.getByText(`${mockProduct.rate}%`)).toBeInTheDocument();
  });

  it('renders the select button', () => {
    render(<Product product={mockProduct} onSelect={vi.fn()} />);
    expect(screen.getByRole('button', { name: /select this product/i })).toBeInTheDocument();
  });

  it('calls onSelect with the product id when button is clicked', async () => {
    const onSelect = vi.fn();
    render(<Product product={mockProduct} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /select this product/i }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith(mockProduct.id);
  });
});
