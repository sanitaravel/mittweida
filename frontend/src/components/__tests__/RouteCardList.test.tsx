import { render, screen, fireEvent } from '@testing-library/react';
import RouteCardList from '../RouteCardList';
import type { Route } from '../RouteCard';
import { SettingsProvider } from '../../contexts/SettingsContext';
import { vi } from 'vitest';

// Mock translation hook
vi.mock('../../hooks/useTranslation', () => ({
  useTranslation: () => ({ t: (x: string) => x })
}));

// Mock routeUtils functions
vi.mock('../../utils/routeUtils', () => ({
  getColorClass: () => 'bg-mock',
  getColorValue: () => '#123456',
  formatDuration: () => '1h 30m',
  calculateRouteDuration: () => 90,
  getRoutingTimeFromCache: () => 10,
}));

describe('RouteCardList', () => {
  const mockRoutes: Route[] = [
    {
      id: '1',
      name: 'Route 1',
      stops: 2,
      features: [
        { key: 'f1', name: 'Feature 1' },
      ],
      color: 'blue',
      places: [],
      description: 'First route',
    },
    {
      id: '2',
      name: 'Route 2',
      stops: 3,
      features: [
        { key: 'f2', name: 'Feature 2' },
      ],
      color: 'red',
      places: [],
      description: 'Second route',
    },
  ];

  it('renders all route cards', () => {
    render(
      <SettingsProvider>
        <RouteCardList
          routes={mockRoutes}
          selectedRouteId={null}
          onRouteSelect={() => {}}
        />
      </SettingsProvider>
    );
    expect(screen.getByText('Route 1')).toBeInTheDocument();
    expect(screen.getByText('Route 2')).toBeInTheDocument();
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
  });

  it('calls onRouteSelect when a card is clicked', () => {
    const onRouteSelect = vi.fn();
    render(
      <SettingsProvider>
        <RouteCardList
          routes={mockRoutes}
          selectedRouteId={null}
          onRouteSelect={onRouteSelect}
        />
      </SettingsProvider>
    );
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]); // Click the second route
    expect(onRouteSelect).toHaveBeenCalledWith('2');
  });
});
