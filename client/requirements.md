## Packages
framer-motion | Essential for page transitions and the welcome animation
react-hook-form | Form state management
@hookform/resolvers | Zod integration for forms

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["var(--font-sans)"],
  display: ["var(--font-display)"],
}

Student Identity:
The app expects 'email' and 'device_id' in localStorage.
For development/demo, if these are missing, we should probably simulate them or show a "Connect via App" prompt, but I will default to a demo user for smoother testing.

Images:
System Logo: https://raw.githubusercontent.com/MODERN-SERVER/Assets/main/BackgroundEraser_20250906_184426881.png
KMTC Logo: https://raw.githubusercontent.com/MODERN-SERVER/Assets/main/BackgroundEraser_20251010_092733868.png
