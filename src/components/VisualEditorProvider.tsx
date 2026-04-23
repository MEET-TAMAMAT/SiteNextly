'use client';

import { useEffect } from 'react';
import { initVisualEditor, destroyVisualEditor } from '@/lib/visual-editor';

export function VisualEditorProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Visual Editor
    initVisualEditor();

    // Cleanup on unmount
    return () => {
      destroyVisualEditor();
    };
  }, []);

  return <>{children}</>;
}