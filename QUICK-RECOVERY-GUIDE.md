# Quick Recovery Guide

## 🆘 If Deployment Breaks Again

### Step 1: Check Railway Environment Variables
1. Go to Railway → SiteNextly service → Variables
2. **DELETE any NODE_ENV variable** (Railway should manage this automatically)
3. Verify these exist:
   - `DIRECTUS_URL`
   - `NEXT_PUBLIC_DIRECTUS_URL`

### Step 2: Revert to Last Working State
```bash
# Quick revert to working baseline
git checkout backup-before-working-version-2026-04-18
git checkout -b emergency-restore-$(date +%Y%m%d)
git push origin emergency-restore-$(date +%Y%m%d)

# Update Railway to point to new branch
# (or force push to main if you're sure)
```

### Step 3: Working Commit Reference
- **Commit:** 3eaf877 "Version 2026-04-17"
- **Status:** Confirmed working April 18, 2026
- **Build time:** ~90 seconds
- **No SSR errors, builds successfully**

## 🔍 Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| "Non-standard NODE_ENV" warning | Delete NODE_ENV from Railway variables |
| SSR/Html import errors | Usually caused by wrong NODE_ENV |
| Node.js download failures | Infrastructure issue, try redeploying |
| Build works locally but fails on Railway | Check environment variables |

## 📞 Emergency Contacts

- **User:** Andri (meet.tamamat@gmail.com)
- **Platform:** Railway (railway.app)
- **Repository:** GitHub - SiteNextly

---
*Keep this file updated with each major milestone*