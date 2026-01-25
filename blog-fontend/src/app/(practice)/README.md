# Next.js Parallel Routes Practice

This directory contains examples of Next.js parallel routes, which allow multiple route segments to be rendered simultaneously in different named slots.

## How Parallel Routes Work

Parallel routes use the `@slotName` directory naming convention to create named slots that can render content independently. In this example:

- `@marketingSlot` - A slot for marketing-related content
- `@salesSlot` - A slot for sales-related content
- `children` - The main content area

## Directory Structure

```
(practice)/
├── layout.tsx                    # Main layout receiving children, @marketingSlot, @salesSlot
├── page.tsx                      # Default page content
├── @marketingSlot/
│   ├── marketing/page.tsx        # Renders in @marketingSlot when /marketing is accessed
│   ├── marketing/settings/page.tsx # Renders in @marketingSlot when /marketing/settings is accessed
│   └── default.tsx               # Fallback content for @marketingSlot
├── @salesSlot/
│   ├── sales/page.tsx            # Renders in @salesSlot when /sales is accessed
│   └── default.tsx               # Fallback content for @salesSlot
├── marketing/
│   ├── page.tsx                  # Main content when /marketing is accessed
│   └── settings/
│       └── page.tsx              # Main content when /marketing/settings is accessed
├── sales/
│   └── page.tsx                  # Main content when /sales is accessed
└── parallel-demo/                # Advanced example with nested parallel routes
    ├── layout.tsx
    ├── page.tsx
    ├── marketing/
    │   └── analytics/
    │       └── page.tsx
    └── sales/
        └── performance/
            └── page.tsx
```

## Key Concepts

1. **Named Slots**: Directories prefixed with `@` become named slots (e.g., `@marketingSlot`)
2. **Independent Navigation**: Each slot can navigate independently
3. **Fallback Content**: `default.tsx` files provide fallback content when no specific route matches
4. **Simultaneous Rendering**: Multiple route segments render at the same time in their respective slots

## Example Routes

- `/marketing` - Shows marketing page with marketing tools in the marketing slot
- `/marketing/settings` - Shows marketing settings with marketing tools in the marketing slot
- `/sales` - Shows sales page with sales tools in the sales slot
- `/parallel-demo` - Advanced example showing how parallel routes work together
- `/parallel-demo/marketing/analytics` - Shows how nested routes work with parallel routes

## How to Test

1. Visit `/marketing` - You'll see the marketing page with marketing-specific tools in the marketing slot
2. Visit `/sales` - You'll see the sales page with sales-specific tools in the sales slot
3. Visit `/parallel-demo` - See the advanced parallel routes demonstration
4. Navigate between routes to see how each slot updates independently

This setup demonstrates how parallel routes enable complex layouts with multiple simultaneously updating content areas.