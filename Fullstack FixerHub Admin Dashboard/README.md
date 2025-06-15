# FixerHub Admin Dashboard

This is the fullstack admin dashboard for FixerHub.

## Features

- User Management
- Professional Documents Management
- Categories Management
- Sub Categories Management
- Professional Jobs Management 
- Job Sub Category Pricing Management
- Messages Management
- Reviews Management
- Email Verifications Management
- CRUD ability for all managements

## Prerequisites

- vite
- Supabse database
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd FixerHub-Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
SUPABASE_URL="your supabase url"
SUPABASE_ANON_KEY="your supabase anon"
```

## Project Structure

```
FixerHub-AdminDashboard/
├── Public/         # Images
├── src/            # Pages
│    ├── componets  # Reusable components
│    ├── hooks      # Hooks
│    ├── integrations # Integrations
│    ├── lib          # Lib
│    ├── pages       # Website pages
├── supabase/       # Config file
└── package.json    # Project dependencies
```

## Available Scripts

- `npm start` - Start the server 

 

## Dependencies

- react - UI Library
- react-dom - DOM Rendering
- vite - Fast Bundling
- typescript - Type Safety

- tailwindcss-animate - CSS Animations
- tailwind-merge - Class Merging
- class-variance-authority - Variant Management
- clsx - Conditional Classes
- next-themes - Theme Switching

- @radix-ui/* (22 packages) - Accessible Components
- lucide-react - Icon Library
- sonner - Toast Notifications
- vaul - Drawer Component
- cmdk - Command Palette
- embla-carousel-react - Carousel Component
- recharts - Chart Library

- react-hook-form - Form Management
- @hookform/resolvers - Form Validation
- zod - Schema Validation
- input-otp - OTP Input


- @supabase/supabase-js - Database Client
- @tanstack/react-query - Data Fetching

- react-router-dom - Client Routing

- date-fns - Date Utilities
- react-day-picker - Date Picker
- react-resizable-panels - Resizable Layouts

 

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request to the `main` branch


