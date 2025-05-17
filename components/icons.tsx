import React from 'react';
import {
    LucideProps,
    Loader2,
    Eye,
    EyeOff,
} from "lucide-react";

// Simple Google icon placeholder (replace with actual SVG or a better icon)
const GoogleIcon = (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="1em" height="1em" {...props}>
        <path fill="#EA4335" d="M24 9.5c3.23 0 5.93 1.09 7.92 2.93l5.95-5.95C34.51 3.55 29.72 2 24 2 14.53 2 6.47 7.68 3.52 15.95l6.63 5.15C11.52 14.68 17.27 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.5 24c0-1.69-.15-3.31-.43-4.88H24v9.17h12.78c-.55 2.97-2.19 5.49-4.63 7.24l6.53 5.05c3.83-3.52 6.32-8.67 6.32-14.58z"/>
        <path fill="#FBBC05" d="M10.15 28.08c-.49-1.47-.77-3.03-.77-4.63s.28-3.16.77-4.63l-6.63-5.15C2.05 16.32 1 19.98 1 24s1.05 7.68 3.52 11.05l6.63-5.02z"/>
        <path fill="#34A853" d="M24 46c5.89 0 10.91-1.94 14.56-5.25l-6.53-5.05c-1.94 1.3-4.46 2.05-7.03 2.05-6.73 0-12.48-5.18-14.48-12.07L2.89 32.1C5.83 40.32 14.27 46 24 46z"/>
        <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
);

export const Icons = {
    spinner: Loader2,
    google: GoogleIcon,
    eye: Eye,
    eyeOff: EyeOff,
};

export type Icon = React.FC<LucideProps>; 