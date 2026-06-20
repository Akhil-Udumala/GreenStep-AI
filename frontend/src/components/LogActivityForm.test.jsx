import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LogActivityForm from './LogActivityForm';

describe('LogActivityForm', () => {
  it('renders the textarea and submit button', () => {
    const mockSubmit = vi.fn();
    render(<LogActivityForm onSubmit={mockSubmit} isLoading={false} />);
    
    expect(screen.getByRole('textbox', { name: /Daily activity description/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Calculate carbon footprint/i })).toBeInTheDocument();
  });

  it('calls onSubmit with trimmed input when submitted', () => {
    const mockSubmit = vi.fn();
    render(<LogActivityForm onSubmit={mockSubmit} isLoading={false} />);
    
    const textarea = screen.getByRole('textbox', { name: /Daily activity description/i });
    fireEvent.change(textarea, { target: { value: '  I drove to work  ' } });
    
    const submitBtn = screen.getByRole('button', { name: /Calculate carbon footprint/i });
    fireEvent.click(submitBtn);
    
    expect(mockSubmit).toHaveBeenCalledWith('I drove to work');
  });

  it('disables input and button when isLoading is true', () => {
    const mockSubmit = vi.fn();
    render(<LogActivityForm onSubmit={mockSubmit} isLoading={true} />);
    
    const textarea = screen.getByRole('textbox', { name: /Daily activity description/i });
    const submitBtn = screen.getByRole('button', { name: /Analyzing your activity/i });
    
    expect(textarea).toBeDisabled();
    expect(submitBtn).toBeDisabled();
  });
});
