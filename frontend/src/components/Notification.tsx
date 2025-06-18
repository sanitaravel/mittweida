import React, { useEffect } from "react";
import { Check } from "lucide-react";

interface NotificationProps {
  message: string;
  show: boolean;
  onHide: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  show,
  onHide,
  duration = 3000,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onHide]);

  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-sage text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
        <Check size={20} />
        <span className="text-body font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Notification;
