import { useToast as useToastFromContext } from '../components/ToastContext';

/**
 * Custom hook to access the toast notification context.
 */
export default function useToast() {
  return useToastFromContext();
}
