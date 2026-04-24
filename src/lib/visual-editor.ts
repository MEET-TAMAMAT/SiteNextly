import { apply, remove } from '@directus/visual-editing';

let initialized = false;

export async function initVisualEditor() {
  if (typeof window === 'undefined' || initialized) return;
  initialized = true;

  await apply({
    directusUrl: process.env.NEXT_PUBLIC_DIRECTUS_URL as string,
    onSaved: () => {
      window.location.reload();
    },
  });
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
  const isDev = process.env.NODE_ENV === 'development';
  const isVisualEditor = isVisualEditorMode();

  if (!isDev && !isVisualEditor) return {};

  return {
    'data-directus-collection': collection,
    'data-directus-item': String(id),   // ← was data-directus-id
    'data-directus-field': field,
  };
}