'use client';

import { useEffect } from 'react';
import { initVisualEditor, destroyVisualEditor, isVisualEditorMode } from '@/lib/visual-editor';

export function VisualEditorProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize if we're in Visual Editor mode
    if (!isVisualEditorMode()) {
      return;
    }

    // Initialize Visual Editor with a small delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      initVisualEditor();
    }, 100);

    // Cleanup on unmount
    return () => {
      clearTimeout(initTimer);
      destroyVisualEditor();
    };
  }, []);

  // Re-initialize when switching between editor and preview mode
  useEffect(() => {
    const handlePageShow = () => {
      if (isVisualEditorMode()) {
        initVisualEditor();
      }
    };

    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  return <>{children}</>;
}