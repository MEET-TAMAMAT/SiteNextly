# Contact Form Validation Implementation - Option A (react-hook-form + Zod)

## ✅ What We've Implemented

### 1. **Validation Schema** (`src/lib/validation/contact-form.ts`)
- **Email**: Maximum 100 characters (as requested)
- **Phone**: Accepts + prefix for international format  
- **Website**: Auto-adds https:// for domain-only entries (preserves your current behavior)
- **Name**: 2-100 characters, letters/spaces/hyphens/apostrophes only
- **Message**: 10-2000 characters
- **Company**: 2-100 characters (required when School selected)
- **Messenger Handle**: 3-50 characters (when messenger selected)

### 2. **Server-Side Validation** (`src/app/api/leads/route.ts`)
- Same validation schema used on server
- Comprehensive error messages
- Type-safe data processing

### 3. **New Form Component** (`src/components/ContactFormMigrated.tsx`)
- react-hook-form integration
- Real-time validation on blur
- Clean error handling
- Maintains all existing functionality

### 4. **✅ Successfully Built & Deployed**
Your contact form now uses the new validation! 
- **Build Status**: ✅ Successful (all TypeScript errors resolved)
- **Ready for Testing**: https://dev.tamamat.com/#contact

## 🧪 Test the New Validation

### **Name Field Tests**
- ✅ Try: "John Doe" (valid)
- ✅ Try: "Mary O'Connor" (valid - apostrophe allowed)
- ✅ Try: "Jean-Pierre" (valid - hyphen allowed)
- ❌ Try: "John123" (should fail - no numbers)
- ❌ Try: "A" (should fail - too short)

### **Email Field Tests**
- ✅ Try: "user@example.com" (valid)
- ❌ Try: "invalid-email" (should fail)
- ❌ Try: Very long email over 100 chars (should fail)

### **Phone Field Tests**  
- ✅ Try: "+1 555-123-4567" (valid - with +)
- ✅ Try: "555-123-4567" (valid - without +)
- ❌ Try: "abc123" (should fail - letters not allowed)

### **Website Field Tests** (Schools only)
- ✅ Try: "example.com" → Should auto-convert to "https://example.com"
- ✅ Try: "https://example.com" → Should keep as-is
- ❌ Try: "invalid-url" (should fail - no TLD)

### **Conditional Logic Tests**
1. **Select Teacher** → Company field should NOT appear
2. **Select School** → Company field should appear and be required
3. **Select Teacher + Messenger** → Handle field should appear when messenger selected

## 📊 Performance Benefits

### **Before (Current):**
```typescript
// Manual refs and state management
const nameRef = useRef<HTMLInputElement>(null);
const [fieldValues, setFieldValues] = useState({...});
const [websiteError, setWebsiteError] = useState<string | null>(null);
// Re-renders on every keystroke
```

### **After (New):**
```typescript
// Clean, uncontrolled components
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(contactFormSchema)
});
// Validates only on blur/submit
```

## 🔧 Key Implementation Features

### **Website Auto-HTTPS Logic**
```typescript
// Preserves your current behavior exactly
const websiteTransform = z.string()
  .transform((val) => {
    if (!val || val.trim() === '') return '';
    const trimmed = val.trim();
    
    // Keep existing http/https
    if (trimmed.match(/^https?:\/\//i)) {
      return trimmed;
    }
    
    // Auto-add https:// for domain-only
    return `https://${trimmed}`;
  })
```

### **Phone Validation with + Support**
```typescript
phone: z.string()
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number (e.g., +1 555-123-4567)')
```

### **Conditional Validation**
```typescript
// Company required only when School selected
.refine((data) => {
  if (data.leadType === 'company') {
    return data.company && data.company.trim().length >= 2;
  }
  return true;
}, { message: 'Company name is required for schools', path: ['company'] })
```

## 🚀 Next Steps

### **Option 1: Keep New Implementation**
If you're happy with the testing:
1. Delete old component: `src/components/Contact.tsx`
2. Rename: `ContactFormMigrated.tsx` → `Contact.tsx` 
3. Update import in `ContactWrapper.tsx`

### **Option 2: Revert for Now**
If you need more testing:
1. Change `ContactWrapper.tsx` import back to `ZadarmaContactForm`
2. Keep new implementation for gradual migration

### **Option 3: A/B Testing**
Run both versions side by side for comparison.

## 📝 Error Messages You'll See

- **Name**: "Name can only contain letters, spaces, hyphens, and apostrophes"
- **Email**: "Please enter a valid email address" / "Email must be less than 100 characters"
- **Phone**: "Please enter a valid phone number (e.g., +1 555-123-4567)"
- **Website**: "Please enter a valid website (e.g., example.com)"
- **Message**: "Message must be at least 10 characters"
- **Company**: "Company name is required for schools"

## 🔄 Rollback Plan

If you need to rollback quickly:
```typescript
// In ContactWrapper.tsx, change this line:
<ZadarmaContactFormMigrated contactData={contactData} isUsingDirectus={isUsingDirectus} />
// Back to:
<ZadarmaContactForm contactData={contactData} isUsingDirectus={isUsingDirectus} />
```

## 🎯 What's Better Now

1. **Type Safety**: TypeScript knows exactly what fields exist
2. **Performance**: No re-renders on every keystroke  
3. **Maintainability**: Single validation schema for client + server
4. **User Experience**: Better error messaging and validation timing
5. **Developer Experience**: Much easier to add new validation rules
6. **Industry Standard**: Using proven libraries (react-hook-form + Zod)

---

**Ready to test?** Visit your contact form and try the validation scenarios above!