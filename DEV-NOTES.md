# TAMAMAT SiteNextly Development Notes

## 🚀 DEPLOYMENT PROCESS
UPDATE GITHUB AFTER MAKING CHANGES LOCALLY

```bash
yarn build
or 
yarn dev
git add . 
git commit -m "Describe what changed" 
git push
```

## 📅 DEVELOPMENT PROGRESS - April 14, 2026

### ✅ MAJOR ACCOMPLISHMENTS

#### 🎨 **Branding & Visual Identity**
- **Logo Implementation**: Added theme-specific logos (light/dark versions)
  - Files: `/public/img/tamamat-logo-light.svg`, `/public/img/tamamat-logo-dark.svg`
  - Dynamic switching based on theme
  - Proper sizing and baseline alignment with company name
- **Typography**: Applied 'Uncial Antiqua' Google Font to TAMAMAT brand name
- **Color Standardization**: Replaced all indigo colors with #3B82F6 throughout entire site

#### 🏗️ **Content Migration**
Successfully copied ALL content from development site (https://tamamat-frontend-production.up.railway.app):
- **Hero Section**: Complete TAMAMAT content for small group teaching platform
- **How It Works**: Manual selection (1-9) and Auto selection (0) methods
- **Features**: 6 key capabilities (Simple Invitations, Student Management, Participation Insights, Device Friendly, No App Needed, Teacher Control)
- **Pricing**: 3 tiers (Free $0/month, Pay-as-You-Go $0.005/participant/minute, Custom contact)
- **Testimonials**: 5 educator testimonials (Daniel Novak, Maria Garcia, Sofia Kos, Matt Brandon, Anton Markov)
- **FAQ**: 8 questions with detailed TAMAMAT-specific answers
- **Contact**: Telegram (@tamamatinfo), email (info@tamamat.com), contact form

#### 🔧 **Technical Improvements**
- **Sticky Header**: Implemented with transparency effects and shadow on scroll
- **Back-to-Top Button**: Replaced chat widget with smooth scroll-to-top functionality
- **Responsive Design**: All components properly responsive across devices
- **Theme Support**: Dark/light mode compatibility throughout

#### 🧹 **Code Cleanup**
- **Fixed Layout Issues**: Removed duplicate header/footer rendering
- **Removed Template Branding**: Eliminated all Web3Templates references
- **Footer Redesign**: Clean layout with social media (left) and copyright (right)
- **Social Media**: Added 5 platforms (Twitter, Facebook, Instagram, LinkedIn, YouTube)

#### 🐛 **Build & Deployment Fixes**
- **Resolved Build Errors**: Removed duplicate files (`page copy.tsx`, `Hero copy.tsx`)
- **TypeScript Fixes**: Fixed styling errors in Testimonials component
- **Production Optimization**: Added Sharp package for image optimization
- **Updated Dependencies**: Browserslist database updated

#### 📂 **Project Organization**
- **Git Branching**: Set up backup system with `backup-before-changes` branch
- **File Structure**: Organized components and removed conflicting files
- **Build Process**: Confirmed successful builds for Railway deployment

### 🎯 **CURRENT STATUS**
- ✅ Complete content migration from development site
- ✅ Full TAMAMAT branding applied
- ✅ Responsive design implemented
- ✅ Build errors resolved
- ✅ Ready for production deployment
- ✅ Backup system established

### 🔄 **BACKUP WORKFLOW ESTABLISHED**
```bash
# Before making changes
git checkout -b backup-before-[description]
git checkout main

# After changes (compare/revert)
git diff backup-before-[description]
git checkout backup-before-[description]  # to revert
```

---
*Last Updated: April 14, 2026*



# 1. Kill the current server
taskkill /IM "node.exe" /F
or
netstat -ano | findstr :3000
# it then gives something like: TCP   0.0.0.0:3000   0.0.0.0:0   LISTENING   12345
# then kill it by replacing the numbers 12345
taskkill /PID 12345 /F


# 2. Start it again
yarn dev



DETERMIN THE ORIGIN OF THE CURRENT FOLDER IN GITHUB REPOSITORY

git remote get-url origin
git config --get remote.origin.url

