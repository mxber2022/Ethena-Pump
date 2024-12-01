import { useState } from 'react';
import toast from 'react-hot-toast';

interface TransactionState {
  isLoading: boolean;
  error: string | null;
}

export function useTransaction() {
  const [state, setState] = useState<TransactionState>({
    isLoading: false,
    error: null
  });

  const execute = async <T>(
    operation: () => Promise<T>,
    {
      loadingMessage,
      successMessage,
      errorMessage
    }: {
      loadingMessage: string;
      successMessage: string;
      errorMessage: string;
    }
  ): Promise<T | null> => {
    setState({ isLoading: true, error: null });
    const toastId = toast.loading(loadingMessage);

    try {
      const result = await operation();
      toast.dismiss(toastId);
      toast.success(successMessage);
      setState({ isLoading: false, error: null });
      return result;
    } catch (error: any) {
      toast.dismiss(toastId);
      const errorMsg = error.reason || error.message || errorMessage;
      toast.error(errorMsg);
      setState({ isLoading: false, error: errorMsg });
      return null;
    }
  };

  return {
    state,
    execute
  };
}