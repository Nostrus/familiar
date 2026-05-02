# @org/types

Shared TypeScript types and interfaces used across web and mobile.

## Usage

```typescript
import type { Home, HomeWithDetails, HomeAvailability, City, User } from '@org/types';
import type {
  HomeStayRequest,
  StayRequestWithHome,
  IncomingStayRequest,
  HomeFavorite,
} from '@org/types';
```

## Exported Types

### Homes (`src/home.ts`)

| Type               | Description                                          |
| ------------------ | ---------------------------------------------------- |
| `Home`             | Base home entity                                     |
| `HomeAvailability` | Available date range for a home                      |
| `HomeWithDetails`  | Home with availability, favorite state, and requests |

### Stay Requests (`src/stay-request.ts`)

| Type                  | Description                                                          |
| --------------------- | -------------------------------------------------------------------- |
| `StayRequestStatus`   | `'pending' \| 'approved' \| 'rejected'`                              |
| `HomeStayRequest`     | Base stay request entity                                             |
| `StayRequestWithHome` | Request enriched with home city/country/description (for guest view) |
| `IncomingStayRequest` | Request enriched with home + requester name (for host view)          |
| `HomeFavorite`        | Favorited home entry                                                 |

### Amenities (`src/amenities.ts`)

| Export                 | Description                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| `AMENITIES`            | Map of all amenity keys with `label`, `webIcon` (Lucide component name), and `mobileIcon` (Feather icon name) |
| `AmenityKey`           | Union type of all valid amenity keys                                                                          |
| `getAmenityLabel(key)` | Returns a human-readable label for any key, with fallback                                                     |

### Other

| Type   | File          | Description              |
| ------ | ------------- | ------------------------ |
| `City` | `src/city.ts` | City entity              |
| `User` | `src/user.ts` | Clerk-synced user entity |
