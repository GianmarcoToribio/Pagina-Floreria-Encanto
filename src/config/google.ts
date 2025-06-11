// Google OAuth Configuration
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";

// For development, you can use this test client ID (replace with your own)
// To get your own client ID:
// 1. Go to https://console.developers.google.com/
// 2. Create a new project or select existing one
// 3. Enable Google+ API
// 4. Create credentials (OAuth 2.0 Client ID)
// 5. Add your domain to authorized origins

export const googleConfig = {
  client_id: GOOGLE_CLIENT_ID,
  callback: "handleGoogleResponse",
  auto_select: false,
  cancel_on_tap_outside: true,
};