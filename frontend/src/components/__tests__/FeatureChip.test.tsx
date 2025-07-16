import { render, screen } from '@testing-library/react';
import FeatureChip from '../FeatureChip';
import { SettingsProvider } from '../../contexts/SettingsContext';

describe('FeatureChip', () => {
  it('renders the label', () => {
    render(
      <SettingsProvider>
        <FeatureChip feature="Test Label" />
      </SettingsProvider>
    );
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });
});