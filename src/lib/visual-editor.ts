import { apply, remove } from '@directus/visual-editing';

let visualEditingInstance: any = null;

// Initialize Directus Visual Editor
export function initVisualEditor() {
  if (typeof window === 'undefined' || visualEditingInstance) return;

  console.log('🚀 Starting Visual Editor initialization...');

  try {
    // Wait for DOM to be ready
    setTimeout(() => {
      const editableElements = document.querySelectorAll('[data-directus-collection]');
      console.log(`🔍 Found ${editableElements.length} editable elements:`, editableElements);

      // Log each element for debugging
      editableElements.forEach((el, index) => {
        console.log(`Element ${index}:`, {
          tag: el.tagName,
          collection: el.getAttribute('data-directus-collection'),
          id: el.getAttribute('data-directus-id'),
          field: el.getAttribute('data-directus-field'),
          text: el.textContent?.substring(0, 50) + '...'
        });
      });

      // Try basic initialization without elements first
      apply({
        directusUrl: process.env.NEXT_PUBLIC_DIRECTUS_URL as string,
        customClass: 'directus-editable',
        onSaved: (data) => {
          console.log('💾 Content saved:', data);
          window.location.reload();
        },
      }).then((instance) => {
        visualEditingInstance = instance;
        if (instance) {
          // Expose instance globally so Directus UI can find it
          (window as any).__directus_visual_editing = instance;
          console.log('✅ Directus Visual Editor instance created:', instance);
          console.log('🌐 Instance exposed globally');
          instance.enable();
          console.log('🎯 Visual Editor enabled');
        } else {
          console.log('❌ Visual Editor instance is null');
        }
      }).catch((error) => {
        console.error('❌ Visual Editor apply() failed:', error);
      });
    }, 2000);
  } catch (error) {
    console.error('❌ Failed to initialize Visual Editor:', error);
  }
}

// Clean up Visual Editor
export function destroyVisualEditor() {
  if (visualEditingInstance) {
    visualEditingInstance.remove?.();
    visualEditingInstance = null;
  } else {
    // Fallback cleanup
    remove();
  }
}

// Check if current request is from Visual Editor
export function isVisualEditorMode() {
  if (typeof window === 'undefined') return false;

  // Check for Visual Editor indicators
  return window.location.search.includes('directus_token') ||
         window.parent !== window ||
         window.location.search.includes('directus_preview') ||
         document.referrer.includes('admin/visual');
}

// Get data attributes for editable content
export function getEditableAttributes(collection: string, id: string | number, field: string) {
  // Always add attributes in development or when in Visual Editor context
  const isDev = process.env.NODE_ENV === 'development';
  const isVisualEditor = isVisualEditorMode();

  if (!isDev && !isVisualEditor) return {};

  return {
    'data-directus-collection': collection,
    'data-directus-id': id,
    'data-directus-field': field,
  };
}