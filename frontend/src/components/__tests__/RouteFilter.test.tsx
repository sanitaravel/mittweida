import { render, screen, fireEvent } from '@testing-library/react';
import RouteFilter, { type RouteFilters } from '../RouteFilter';
import { vi } from 'vitest';

// Mock translation hook
vi.mock('../../hooks/useTranslation', () => ({
  useTranslation: () => ({ t: (x: string) => x })
}));

describe('RouteFilter', () => {
  const defaultFilters: RouteFilters = {
    maxDuration: 120,
    maxStops: 5,
    minStops: 2,
    features: ['museum'],
  };
  const availableFeatures = ['museum', 'park', 'restaurant'];

  it('renders when open and displays filters', () => {
    render(
      <RouteFilter
        isOpen={true}
        onClose={() => {}}
        filters={defaultFilters}
        onFiltersChange={() => {}}
        availableFeatures={availableFeatures}
      />
    );
    expect(screen.getByText('filterRoutes')).toBeInTheDocument();
    expect(screen.getByText('maxDuration')).toBeInTheDocument();
    expect(screen.getByText('numberOfStops')).toBeInTheDocument();
    expect(screen.getByText('routeFeatures')).toBeInTheDocument();
    expect(screen.getByText('museum')).toBeInTheDocument();
    expect(screen.getByText('park')).toBeInTheDocument();
    expect(screen.getByText('restaurant')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <RouteFilter
        isOpen={true}
        onClose={onClose}
        filters={defaultFilters}
        onFiltersChange={() => {}}
        availableFeatures={availableFeatures}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: '' })); // The close button has no accessible name
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onFiltersChange and onClose when apply is clicked', () => {
    const onFiltersChange = vi.fn();
    const onClose = vi.fn();
    render(
      <RouteFilter
        isOpen={true}
        onClose={onClose}
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        availableFeatures={availableFeatures}
      />
    );
    fireEvent.click(screen.getByText('applyFilters'));
    expect(onFiltersChange).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onFiltersChange with empty filters when clearAll is clicked', () => {
    const onFiltersChange = vi.fn();
    render(
      <RouteFilter
        isOpen={true}
        onClose={() => {}}
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        availableFeatures={availableFeatures}
      />
    );
    fireEvent.click(screen.getByText('clearAll'));
    expect(onFiltersChange).toHaveBeenCalledWith({
      maxDuration: undefined,
      maxStops: undefined,
      minStops: undefined,
      features: [],
    });
  });
});
