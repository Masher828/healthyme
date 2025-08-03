# HealthifyMe Clone - Client-Only UI

A complete HealthifyMe clone built with React, TypeScript, and Tailwind CSS. This is a client-only implementation with mock data for demonstration purposes.

## 🌟 Features

- **User Authentication**: Mock login/logout system with localStorage persistence
- **Dashboard**: Comprehensive health overview with calorie tracking, meal summaries, and workout stats
- **Meal Logging**: Add and track meals with detailed nutrition information (calories, protein, carbs, fat)
- **Workout Tracking**: Log workouts with duration, exercises, and calories burned
- **Progress Monitoring**: Weight tracking with interactive charts and BMI calculations
- **User Profile**: Manage account settings, preferences, and health goals
- **Responsive Design**: Mobile-first design with bottom navigation
- **Modern UI Components**: Built with shadcn/ui and Radix UI primitives

## 🛠️ Tech Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **shadcn/ui**: High-quality, accessible UI components
- **Wouter**: Lightweight client-side routing
- **React Hook Form**: Performant form handling with validation
- **Zod**: Schema validation for form inputs
- **Recharts**: Interactive charts for progress visualization
- **Lucide React**: Beautiful, customizable icons
- **Date-fns**: Modern date utility library

## 📁 Project Structure

```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── bottom-navigation.tsx
│   │   ├── calorie-ring.tsx
│   │   ├── water-tracker.tsx
│   │   └── weight-chart.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts      # Authentication hook with mock data
│   │   ├── use-toast.ts    # Toast notifications
│   │   └── use-mobile.tsx  # Mobile detection
│   ├── lib/                # Utility functions and configurations
│   │   ├── mockData.ts     # Mock data for demo
│   │   ├── queryClient.ts  # API request utilities
│   │   └── utils.ts        # Common utilities
│   ├── pages/              # Application pages
│   │   ├── landing.tsx     # Landing page for unauthenticated users
│   │   ├── home.tsx        # Dashboard/home page
│   │   ├── meals.tsx       # Meal logging and tracking
│   │   ├── workouts.tsx    # Workout logging and history
│   │   ├── progress.tsx    # Progress tracking and charts
│   │   ├── profile.tsx     # User profile and settings
│   │   └── not-found.tsx   # 404 error page
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles and Tailwind imports
├── index.html              # HTML template
└── package.json            # Project dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd healthifyme-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

### Build for Production

```bash
npm run build
```

The production build will be created in the `dist` folder.

## 📱 Usage Guide

### 1. Landing Page
- Visit the homepage to see the landing page for unauthenticated users
- Click "Get Started" to sign in with the mock authentication system

### 2. Dashboard (Home)
- View daily calorie goals, meal summaries, and workout stats
- Interactive calorie ring shows consumed vs. burned calories
- Water intake tracker with visual progress
- Quick overview of today's activities

### 3. Meal Logging
- Navigate to the "Meals" tab using bottom navigation
- Click "Add Meal" to log food intake
- Enter meal details: name, type (breakfast/lunch/dinner/snack), calories, and macros
- View categorized meals by meal type
- Track daily calorie and macronutrient progress

### 4. Workout Tracking
- Go to the "Workouts" tab
- Click "Log Workout" to add exercise sessions
- Enter workout name, duration, calories burned, and exercise description
- View workout history with detailed statistics
- Track total daily exercise time and calories burned

### 5. Progress Monitoring
- Access the "Progress" tab for weight tracking
- Click "Log Weight" to add weight entries with dates
- View interactive weight chart showing progress over time
- Monitor BMI, weight loss, and remaining weight to goal
- Set and track weight goals

### 6. Profile Management
- Visit the "Profile" tab to manage account settings
- View user information and health statistics
- Configure notification preferences (meal reminders, workout alerts)
- Toggle settings like dark mode, units, and weekly reports
- Set health goals (calorie targets, weight goals)
- Logout functionality

## 🎨 Design Features

### Color Scheme
- **Primary**: HealthifyMe green (#22c55e)
- **Secondary**: Various gradient backgrounds for each section
- **Success**: Green tones for positive metrics
- **Warning**: Orange/yellow for attention items
- **Error**: Red tones for alerts

### Responsive Design
- Mobile-first approach with bottom navigation on mobile
- Tablet and desktop layouts with optimized spacing
- Flexible grid systems for different screen sizes
- Touch-friendly interface elements

### Accessibility
- ARIA labels and semantic HTML
- Keyboard navigation support
- High contrast ratios for text readability
- Screen reader compatible

## 🔧 Customization

### Adding New Features
1. Create new components in `src/components/`
2. Add new pages in `src/pages/`
3. Update routing in `src/App.tsx`
4. Add mock data to `src/lib/mockData.ts`

### Styling Customization
- Edit `src/index.css` for global styles
- Modify `tailwind.config.ts` for theme customization
- Update component styles using Tailwind classes

### Mock Data
All data is stored in `src/lib/mockData.ts` including:
- User profile information
- Meal entries with nutrition data
- Workout logs with exercise details
- Weight tracking entries
- Water intake records

## 🚀 Deployment

### Deploy to Replit
1. Push your code to a GitHub repository
2. Import the repository into Replit
3. The app will automatically deploy with Replit's hosting

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure redirects for SPA routing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📝 License

This project is for educational purposes and demonstration only. It is not affiliated with the official HealthifyMe application.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the browser console for errors
2. Ensure all dependencies are installed correctly
3. Verify Node.js version compatibility
4. Clear browser cache and localStorage if needed

---

**Note**: This is a client-only demonstration app with mock data. In a production environment, you would integrate with real backend APIs for user authentication, data persistence, and external services.