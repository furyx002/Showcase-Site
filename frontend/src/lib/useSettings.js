'use client';

import { useState, useEffect } from 'react';
import { api } from './api';

export function useSettings() {
  const [settings, setSettings] = useState({
    whatsappNumber: '+923401013889',
    heroSliders: ['/slider1.jpg', '/slider2.jpg']
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
