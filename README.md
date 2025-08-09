# HealthifyMe Clone - Client-Only Demo

A complete HealthifyMe clone built as a client-only demonstration application. Features include meal tracking, workout logging, progress charts, and user profile management using mock data and localStorage persistence.

## Features

- **Home Dashboard**: Calorie tracking with visual progress rings, water intake tracker, and quick stats
- **Meal Logging**: Add breakfast, lunch, dinner, and snacks with nutrition information
- **Workout Tracking**: Log exercises with duration and calories burned
- **Progress Charts**: Weight tracking with visual progress over time
- **User Profile**: Manage personal information and health goals
- **Mock Authentication**: Demo login/logout functionality with localStorage
- **Responsive Design**: Mobile-first UI with bottom navigation

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with responsive design
- **Routing**: Wouter for client-side navigation
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite for fast development and optimized builds
- **Server**: Minimal Express server for static file serving

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the client application**:
   ```bash
   npm run build
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to http://localhost:5000

## Development Scripts

- `npm run dev` - Start development server (builds client + serves files)
- `npm run build` - Build client application for production
- `npm run client:dev` - Start Vite dev server for client development only
- `npm run client:build` - Build client application only

## Project Structure

```
├── client/                 # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and mock data
│   │   └── ...
│   └── dist/              # Built client files (generated)
├── server/                # Minimal Express server
│   └── index.ts          # Static file server
├── dist/                  # Server build output
└── README.md
```

## Demo Data

The application comes with pre-populated mock data including:

- **Sample User**: Demo profile with health stats and goals
- **Meal Entries**: Various meals with nutrition information
- **Workout History**: Different types of exercises and activities
- **Weight Progress**: Historical weight data for chart visualization
- **Water Intake**: Daily hydration tracking

All data is stored in localStorage and persists between sessions.

## Key Features Walkthrough

### Authentication
- Click "Get Started - Sign In" on the landing page
- Automatically logs in with demo user credentials
- Session persists until logout

### Home Dashboard
- View daily calorie progress with visual rings
- Track water intake with interactive glass counter
- See quick stats and recent activity

### Meal Tracking
- Navigate to Meals tab via bottom navigation
- Add meals by category (breakfast, lunch, dinner, snacks)
- View nutrition breakdown and daily totals

### Workout Logging
- Access Workouts tab to log exercises
- Add different types of activities with duration
- Track calories burned and exercise frequency

### Progress Monitoring
- View Progress tab for weight tracking charts
- Add new weight entries with date
- Visualize progress over time with interactive charts

### Profile Management
- Access Profile tab to view user information
- See health stats and goals
- Logout functionality available

## Customization

### Adding New Data
Edit `client/src/lib/mockData.ts` to:
- Add new meal options
- Include different workout types
- Modify user profile information
- Adjust health goals and targets

### Styling Changes
Modify `client/src/index.css` for:
- Color scheme adjustments
- Typography changes
- Component styling overrides

### Adding Features
The modular architecture makes it easy to:
- Add new pages in `client/src/pages/`
- Create reusable components in `client/src/components/`
- Extend functionality with custom hooks in `client/src/hooks/`

## Deployment

The built application is a static site that can be deployed to any static hosting service:

1. Run `npm run build` to create production files
2. Upload the `dist/public/` directory to your hosting provider
3. Configure your server to serve `index.html` for all routes (SPA routing)

## Browser Support

- Modern browsers with ES6+ support
- Mobile-responsive design
- Touch-friendly interface for mobile devices

## License

This is a demonstration project for educational purposes.