# useClipboard Hook

A custom React hook for copying text to clipboard with state management and callbacks.

## Features

- ✅ Automatic state management (isCopied)
- ✅ Auto-reset after configurable delay
- ✅ Error handling
- ✅ Success/error callbacks
- ✅ Manual reset option
- ✅ TypeScript support with full type safety

## Installation

The hook is already available in your project at:

```
src/hooks/use-clipboard.tsx
```

## Basic Usage

```tsx
import { useClipboard } from '@src/hooks/use-clipboard';

function CopyButton() {
  const { isCopied, copy } = useClipboard();

  return <button onClick={() => copy('Text to copy')}>{isCopied ? 'Copied!' : 'Copy'}</button>;
}
```

## API Reference

### Return Value

```typescript
interface UseClipboardReturn {
  isCopied: boolean; // Whether the text has been copied
  copy: (text: string) => Promise<void>; // Copy text to clipboard
  error: Error | null; // Error that occurred during copy
  reset: () => void; // Reset the copied state manually
}
```

### Options

```typescript
interface UseClipboardOptions {
  resetDelay?: number; // Time in ms to reset (default: 2000)
  onCopySuccess?: (text: string) => void; // Success callback
  onCopyError?: (error: Error) => void; // Error callback
}
```

## Examples

### 1. With AnimatedIconButton

```tsx
import { Check, Copy } from 'lucide-react';
import { AnimatedIconButton } from '@src/components/ui/animated-icon-button';
import { useClipboard } from '@src/hooks/use-clipboard';

function CopyButton() {
  const { isCopied, copy } = useClipboard();

  return (
    <AnimatedIconButton
      onClick={() => copy('Text to copy')}
      icon={isCopied ? <Check /> : <Copy />}
      iconKey={isCopied ? 'check' : 'copy'}
      variant="outline"
    />
  );
}
```

### 2. Custom Reset Delay

```tsx
function CustomDelayExample() {
  const { isCopied, copy } = useClipboard({ resetDelay: 5000 }); // 5 seconds

  return (
    <button onClick={() => copy('Text with longer delay')}>{isCopied ? 'Copied!' : 'Copy'}</button>
  );
}
```

### 3. With Callbacks

```tsx
function WithCallbacksExample() {
  const { isCopied, copy, error } = useClipboard({
    onCopySuccess: text => console.log('Copied:', text),
    onCopyError: error => console.error('Failed:', error),
  });

  return (
    <div>
      <button onClick={() => copy('Text to copy')}>{isCopied ? 'Copied!' : 'Copy'}</button>
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
}
```

### 4. Manual Reset (No Auto-Reset)

```tsx
function ManualResetExample() {
  const { isCopied, copy, reset } = useClipboard({ resetDelay: 0 });

  return (
    <div>
      <button onClick={() => copy('Text to copy')}>{isCopied ? 'Copied!' : 'Copy'}</button>
      {isCopied && <button onClick={reset}>Reset</button>}
    </div>
  );
}
```

### 5. Copy Multiple Values

```tsx
function MultipleValuesExample() {
  const { isCopied, copy } = useClipboard();

  return (
    <div className="flex gap-2">
      <button onClick={() => copy('Value 1')}>Copy Value 1</button>
      <button onClick={() => copy('Value 2')}>Copy Value 2</button>
      <button onClick={() => copy('Value 3')}>Copy Value 3</button>
      {isCopied && <span>✓ Copied!</span>}
    </div>
  );
}
```

## Browser Support

The hook uses the modern Clipboard API (`navigator.clipboard.writeText()`). It includes a check for browser support and will throw an error if the API is not available.

## Error Handling

The hook handles errors gracefully:

- If clipboard API is not available
- If permission is denied
- If copy operation fails for any reason

Errors are exposed via the `error` property and can be handled via the `onCopyError` callback.

## Testing

You can test the hook on the test page at:

```
/[locale]/animated-icon-button-test
```

All copy button examples on this page now use the `useClipboard` hook.
