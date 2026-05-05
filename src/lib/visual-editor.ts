import { apply, remove } from '@directus/visual-editing';

let initialized = false;

export async function initVisualEditor() {
  if (typeof window === 'undefined' || initialized) return;

  // Only initialize if we're actually in Visual Editor mode
  if (!isVisualEditorMode()) return;

  initialized = true;

  try {
    await apply({
      directusUrl: process.env.NEXT_PUBLIC_DIRECTUS_URL as string,
      onSaved: () => {
        // Force a hard refresh to clear all caches
        console.log('Visual Editor: Content saved, refreshing page...');
        window.location.href = window.location.href;
      },
    });
    console.log('Visual Editor initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Visual Editor:', error);
    initialized = false;
  }
}

export function destroyVisualEditor() {
  if (!initialized) return;
  remove();
  initialized = false;
}

export function isVisualEditorMode() {
  if (typeof window === 'undefined') return false;
  return (
    window.parent !== window ||
    window.location.search.includes('directus_token') ||
    window.location.search.includes('directus_preview')
  );
}

export function getEditableAttributes(
  collection: string,
  id: string | number,
  field: string
) {
  return {
    'data-directus': `collection:${collection};item:${String(id)};fields:${field}`,
  };
}