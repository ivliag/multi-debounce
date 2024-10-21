# Multi-Debounce

Smart debouncing utility that allows immediate execution on certain triggers (like Enter key or paste) while maintaining standard debouncing for regular input changes.

## Why Multi-Debounce?

When building search inputs, you typically want to:
- **Debounce** regular typing to avoid excessive API calls
- **Execute immediately** when user presses Enter or pastes text
- **Avoid complex state management** that comes with controlling this behavior in React

With standard `useDebounce`, you'd need additional state to handle immediate execution scenarios. Multi-Debounce solves this by providing multiple debounced functions with different delays that automatically cancel each other.

## Installation

```bash
npm install multi-debounce
```

## Usage

### React Hook

```tsx
import { useMultiDebounce } from 'multi-debounce/useMultiDebounce';

function SearchInput() {
  const search = useMultiDebounce((query: string) => {
    console.log('Searching for:', query);
    // Make API call here
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Debounced search with 200ms delay
    search.m(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Immediate search, cancels any pending debounced calls
      search.none((e.target as HTMLInputElement).value);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // Immediate search on paste
    search.none(e.clipboardData.getData('text'));
  };

  return (
    <input
      type="text"
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      placeholder="Search..."
    />
  );
}
```

### Vanilla JavaScript

```javascript
import { multiDebounce } from 'multi-debounce/mutliDebounce';

const search = multiDebounce((query) => {
  console.log('Searching for:', query);
  // Make API call here
});

// Regular typing - debounced
input.addEventListener('input', (e) => {
  search.m(e.target.value);
});

// Enter key - immediate
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    search.none(e.target.value);
  }
});

// Paste - immediate
input.addEventListener('paste', (e) => {
  search.none(e.clipboardData.getData('text'));
});
```

## Available Delays

The library provides pre-configured delays:

```javascript
{
  none: 0,      // Immediate execution
  xs: 10,       // 10ms
  s: 50,        // 50ms
  m: 200,       // 200ms (good for search)
  l: 1000,      // 1 second
  xl: 3000,     // 3 seconds
  0: 0,         // Numeric alternatives
  50: 50,
  100: 100,
  200: 200,
  500: 500,
  1000: 1000,
  2000: 2000,
  3000: 3000
}
```

## Custom Delays

You can provide custom delay configurations:

```javascript
const customDelays = {
  immediate: 0,
  fast: 100,
  slow: 800
};

// React
const debouncedFn = useMultiDebounce(myFunction, customDelays);

// Vanilla JS
const debouncedFn = multiDebounce(myFunction, customDelays);

// Usage
debouncedFn.immediate(data); // Executes immediately
debouncedFn.fast(data);      // 100ms delay
debouncedFn.slow(data);      // 800ms delay
```

## Advanced Usage

### Manual Control

```javascript
const search = multiDebounce(searchFunction);

// Cancel all pending calls
search.cancelAll();

// Execute all pending calls immediately
search.flushAll();

// Cancel specific delay
search.m.cancel();

// Flush specific delay
search.m.flush();
```

### Form Validation Example

```tsx
function EmailInput() {
  const validateEmail = useMultiDebounce((email: string) => {
    // Validate email format and availability
    if (isValidEmail(email)) {
      checkEmailAvailability(email);
    }
  });

  return (
    <input
      type="email"
      onChange={(e) => validateEmail.m(e.target.value)} // 200ms delay
      onBlur={(e) => validateEmail.s(e.target.value)}   // 50ms delay on blur
    />
  );
}
```

## TypeScript Support

Fully typed with TypeScript. Generic types preserve function signatures:

```typescript
const typedDebounce = useMultiDebounce(
  (id: number, name: string) => Promise<User>,
  { quick: 100, normal: 300 }
);

// TypeScript knows these return Promise<User>
typedDebounce.quick(1, "John");
typedDebounce.normal(2, "Jane");
```

## License

ISC