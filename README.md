# Dexa Employee Attendance (React + Vite)

A modern employee attendance application built with React and Vite. It features a themed UI, geolocation-powered clock-in/out, and real-time notifications via WebSocket.

## Key Features
- Authentication with token persistence and secure Axios interceptor
- Attendance clock-in/out with browser geolocation and reverse geocoding (OpenStreetMap, graceful fallback)
- Real-time notifications using WebSocket (socket.io-client)
- Data fetching and caching with TanStack React Query
- Theming with next-themes (class-based dark mode) and Tailwind CSS v4
- Color system using CSS variables (OKLCH tokens) for consistent theming
- Routing with React Router v7
- UI primitives with Radix UI and icons via lucide-react

## Tech Stack
- React 19, Vite 7
- Tailwind CSS v4, tailwindcss-animate
- next-themes for theme switching
- Axios for HTTP, socket.io-client for WebSocket
- TanStack React Query for server-state management
- Zustand for lightweight client-state
- Leaflet and React-Leaflet for map visualization (where applicable)

## Getting Started
### Prerequisites
- Node.js 18+
- npm (or pnpm/yarn)

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file (see `.env.example`):
```env
VITE_API_URL=https://your-api.example.com/api
VITE_WS_URL=wss://your-api.example.com
```

### Development
```bash
npm run dev
```

### Build and Preview
```bash
npm run build
npm run preview
```

## UI Theme and Colors
- Theme provider is configured with next-themes using `attribute="class"` (see `src/main.jsx`).
- Color tokens are defined as CSS variables in `src/index.css` under `:root` and `.dark` using OKLCH values.
- Use semantic classes like `bg-background`, `text-foreground`, `border-border`, and component tokens (e.g., `bg-card`, `text-card-foreground`).
- A simple `ThemeToggle` exists in `src/components/ui/theme-toggle.jsx` using `Sun`/`Moon` icons.


## API Client
- Centralized Axios instance in `src/lib/api.js` reads `VITE_API_URL`.
- Automatically attaches `Authorization: Bearer <token>` if available.
- On `401`, clears token and redirects to `/login`.

## Geolocation
- `src/hooks/useGeolocation.js` wraps `navigator.geolocation`.
- Reverse geocoding via OpenStreetMap (Nominatim) with a fallback to `geocode.maps.co` and CORS-safe access.
- Returns enriched location data (latitude, longitude, accuracy, address).

## Project Structure (high level)
- `src/components/` UI components and attendance controls
- `src/pages/` route-level pages (auth, attendance, profile, summary)
- `src/hooks/` reusable hooks (auth mutation, geolocation, attendance, summary)
- `src/store/` Zustand stores (auth, location)
- `src/lib/` client utilities (API and helpers)
- `src/index.css` theme and tokens

## Scripts
- `npm run dev` start development server
- `npm run build` build for production
- `npm run preview` preview built app locally
- `npm run lint` run ESLint

## Deployment
- The project includes `netlify.toml` for Netlify deployments. Adjust environment variables in your hosting provider accordingly.

## License
MIT License