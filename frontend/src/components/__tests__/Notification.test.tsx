import { render, screen } from '@testing-library/react';
import Notification from '../Notification';
import { vi } from 'vitest';

describe('Notification', () => {
  it('renders the message when show is true', () => {
    render(
      <Notification message="Test notification" show={true} onHide={() => {}} />
    );
    expect(screen.getByText('Test notification')).toBeInTheDocument();
  });

  it('does not render when show is false', () => {
    render(
      <Notification message="Hidden notification" show={false} onHide={() => {}} />
    );
    expect(screen.queryByText('Hidden notification')).not.toBeInTheDocument();
  });

  it('calls onHide after duration', () => {
    vi.useFakeTimers();
    const onHide = vi.fn();
    render(
      <Notification message="Auto-hide" show={true} onHide={onHide} duration={1000} />
    );
    expect(onHide).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1000);
    expect(onHide).toHaveBeenCalled();
    vi.useRealTimers();
  });
});