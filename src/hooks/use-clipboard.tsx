import { useCallback, useEffect, useState } from 'react';

interface UseClipboardOptions {
  /**
   * Time in milliseconds to reset the copied state
   * @default 2000
   */
  resetDelay?: number;
  /**
   * Callback fired when copy succeeds
   */
  onCopySuccess?: (text: string) => void;
  /**
   * Callback fired when copy fails
   */
  onCopyError?: (error: Error) => void;
}

interface UseClipboardReturn {
  /**
   * Whether the text has been copied
   */
  isCopied: boolean;
  /**
   * Copy text to clipboard
   */
  copy: (text: string) => Promise<void>;
  /**
   * Error that occurred during copy
   */
  error: Error | null;
  /**
   * Reset the copied state manually
   */
  reset: () => void;
}

/**
 * Custom hook to copy text to clipboard with state management
 *
 * @example
 * ```tsx
 * function CopyButton() {
 *   const { isCopied, copy } = useClipboard();
 *
 *   return (
 *     <button onClick={() => copy('Text to copy')}>
 *       {isCopied ? 'Copied!' : 'Copy'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { resetDelay = 2000, onCopySuccess, onCopyError } = options;

  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(
    async (text: string) => {
      try {
        // Check if clipboard API is available
        if (!navigator?.clipboard) {
          throw new Error('Clipboard API not available');
        }

        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setError(null);

        if (onCopySuccess) {
          onCopySuccess(text);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to copy to clipboard');
        setError(error);
        setIsCopied(false);

        if (onCopyError) {
          onCopyError(error);
        }
      }
    },
    [onCopySuccess, onCopyError],
  );

  const reset = useCallback(() => {
    setIsCopied(false);
    setError(null);
  }, []);

  // Auto-reset after delay
  useEffect(() => {
    if (isCopied && resetDelay > 0) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, resetDelay);

      return () => clearTimeout(timer);
    }
  }, [isCopied, resetDelay]);

  return { isCopied, copy, error, reset };
}
