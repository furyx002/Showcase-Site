'use client';

import { useState, useEffect } from 'react';
import { api } from './api';

export function useSettings() {
  const [settings, setSettings] = useState({
    whatsappNumber: '+923006255511',
    heroSliderImage1: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=2000',
    heroSliderImage2: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=2000'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getSettings().then(res => {
      if (mounted && res.data) {
        setSettings(prev => ({ ...prev, ...res.data }));
      }
    }).catch(err => {
      console.warn('Failed to load global settings', err);
    }).finally(() => {
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return { settings, loading };
}
