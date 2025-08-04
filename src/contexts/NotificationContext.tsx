import { useState, useMemo, useCallback } from 'react';

// 1. Define the interface for a single notification
export interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
}

// 2. Define the shape of the state that will hold the list of notifications
export interface NotificationState {
  notifications: Notification[];
}

// 3. Define the actions that can be performed on the state
export interface NotificationActions {
  addNotification: (message: string, type: 'info' | 'success' | 'error') => void;
  dismissNotification: (id: number) => void;
}

// 4. Create and export a type that combines the state and actions
export type NotificationSlice = NotificationState & NotificationActions;

/**
 * Custom hook to manage notification state.
 * This hook encapsulates the logic for adding and removing notifications.
 */
export const useNotificationState = (): NotificationSlice => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: 'info' | 'success' | 'error' = 'info') => {
    // Create a new notification with a unique ID (timestamp)
    const newNotification: Notification = { id: Date.now(), message, type };
    // Add the new notification to the existing array
    setNotifications(currentNotifications => [...currentNotifications, newNotification]);
  }, []); // useCallback ensures this function is not recreated on every render

  const dismissNotification = useCallback((id: number) => {
    // Remove the notification with the matching ID
    setNotifications(currentNotifications => currentNotifications.filter(n => n.id !== id));
  }, []);

  // useMemo ensures the returned object reference is stable as long as its dependencies don't change,
  // preventing unnecessary re-renders in consuming components.
  return useMemo(() => ({
    notifications,
    addNotification,
    dismissNotification,
  }), [notifications, addNotification, dismissNotification]);
};