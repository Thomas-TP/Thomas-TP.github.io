'use client';

import { useEffect } from 'react';

export function NotFound() {
    useEffect(() => {
        window.location.replace('https://links.thomastp.ch');
    }, []);

    // Shown only for an instant before redirect
    return null;
}
