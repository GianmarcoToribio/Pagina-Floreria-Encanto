# Florería Encanto Management System

A comprehensive flower shop management system built with React, TypeScript, and Tailwind CSS.

## Features

- **Authentication**: Email/password and Google OAuth integration
- **Role-based Access**: Admin, Supervisor, and Customer roles
- **Inventory Management**: Product catalog with categories and stock tracking
- **Sales Management**: Point of sale system with receipt generation
- **Purchase Management**: Supplier orders and inventory replenishment
- **Customer Store**: Online shopping experience with cart and checkout
- **Reports**: Analytics and business intelligence dashboards
- **Customer Support**: Integrated messaging system

## Google OAuth Setup

To enable real Google authentication:

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create credentials (OAuth 2.0 Client ID)
5. Add your domain to authorized origins:
   - For development: `http://localhost:5173`
   - For production: your actual domain
6. Copy your client ID and add it to your environment variables

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your Google OAuth credentials (see above)

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Test Accounts

- **Admin**: admin@floreria.com / admin123
- **Supervisor**: supervisor@floreria.com / super123
- **Google**: Use your real Google account

## Technologies Used

- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Lucide React for icons
- Chart.js for analytics
- React PDF for receipt generation
- Google OAuth for authentication

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── config/         # Configuration files
└── types/          # TypeScript type definitions
```

## License

This project is licensed under the MIT License.