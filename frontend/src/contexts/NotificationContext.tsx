import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { Snackbar, Alert, type AlertColor } from '@mui/material';

export type NotifyFunction = (
  severity: AlertColor,
  message: string,
  autoHideDuration?: number
) => void;

interface Notification {
  id: string;
  message: string;
  severity: AlertColor;
  autoHideDuration?: number;
}

interface NotificationContextType {
  notify: NotifyFunction;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const notify = (
    severity: AlertColor,
    message: string,
    autoHideDuration: number = 6000
  ) => {
    const id = crypto.randomUUID();
    const notification: Notification = {
      id,
      message,
      severity,
      autoHideDuration,
    };

    setNotifications((prev) => [...prev, notification]);
  };

  const contextValue: NotificationContextType = {
    notify,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.autoHideDuration}
          onClose={() => removeNotification(notification.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => removeNotification(notification.id)}
            severity={notification.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};
