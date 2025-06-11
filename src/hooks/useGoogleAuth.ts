import { useEffect, useRef } from 'react';
import { GOOGLE_CLIENT_ID } from '../config/google';

interface UseGoogleAuthProps {
  onSuccess: (credential: string) => void;
  onError?: (error: any) => void;
}

export const useGoogleAuth = ({ onSuccess, onError }: UseGoogleAuthProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (!window.google || isInitialized.current) return;

      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: any) => {
            if (response.credential) {
              onSuccess(response.credential);
            } else {
              onError?.(new Error('No credential received'));
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (buttonRef.current) {
          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signin_with",
            shape: "rectangular",
          });
        }

        isInitialized.current = true;
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
        onError?.(error);
      }
    };

    // Check if Google script is already loaded
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      // Wait for Google script to load
      const checkGoogleLoaded = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogleLoaded);
          initializeGoogleSignIn();
        }
      }, 100);

      // Cleanup interval after 10 seconds
      setTimeout(() => clearInterval(checkGoogleLoaded), 10000);
    }
  }, [onSuccess, onError]);

  const signInWithPopup = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  return { buttonRef, signInWithPopup };
};