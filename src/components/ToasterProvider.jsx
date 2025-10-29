// components/ToasterProvider.jsx
import { ToastProvider as RadixToastProvider } from '@/components/ui/toast';

export const ToasterProvider = ({ children }) => {
  return (
    <RadixToastProvider>
      {children}
    </RadixToastProvider>
  );
};