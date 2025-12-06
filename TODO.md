# Weekly Meal Planner - TODO

**What's left**

- [ ] Remove Sign UP
- [✅] Remove Log Out
- [ ] Backend
- [✅] Add recipe from suggestions on the first available place in the current week
- [ ] Unit Tests

---

Implementation roadmap for Phase 7 and Phase 8.

---

## Phase 7: Security Hardening & Visual Polish

**Status:** Ready to implement
**Estimated Time:** 12-14 hours
**Priority:** High (Production readiness)

### Overview
Phase 7 focuses on making the app production-ready with security improvements and UX polish. No session timeouts (users stay logged in), no unit tests (deferred to Phase 8), no performance optimizations (app is fast).

### Key Features
1. Fix mobile drag-and-drop bug
2. Add toast notification system
3. Implement skeleton loaders
4. Harden security (CSP, audit logs, remove debug code)
5. User-friendly error messages

---

## Phase 7 Tasks

### 1. CRITICAL: Fix Mobile Drag-and-Drop (2-3 hours)

**Problem:** Drag-and-drop doesn't work on mobile/simulated mobile screens.

**Solution:**
- [ ] Add `touch-action: none` to drag handle in `src/components/meal-plan/MealRow.jsx`
  - Add `touch-none` class to drag handle div (line 271)
  - Add inline style `style={{ touchAction: 'none' }}`
- [ ] Reduce TouchSensor delay in `src/components/meal-plan/MealTable.jsx`
  - Change delay from 200ms to 150ms
  - Change tolerance from 8px to 5px
- [ ] Test on real devices:
  - [ ] iPhone Safari
  - [ ] Android Chrome
  - [ ] iPad
  - [ ] Verify scrolling still works

**Files to modify:**
- `src/components/meal-plan/MealRow.jsx` (line 271-288)
- `src/components/meal-plan/MealTable.jsx` (lines 35-47)

---

### 2. Toast Notification System (3-4 hours)

**Goal:** Replace browser `alert()` with beautiful toast notifications.

**Tasks:**
- [ ] Create `src/components/ui/Toast.jsx` component
  - 4 types: success, error, info, warning
  - Auto-close after 4 seconds
  - Manual close button
  - Slide-in animation from right
- [ ] Create `src/components/ui/ToastContainer.jsx`
  - Fixed bottom-right position
  - Stack multiple toasts vertically
- [ ] Create `src/hooks/useToast.js` hook
  - Manage toast state
  - Add/remove toasts
  - Auto-dismiss logic
- [ ] Create `src/contexts/ToastContext.jsx`
  - Provide showToast function globally
  - Wrap with ToastProvider
- [ ] Add slide-in-right animation to `tailwind.config.js`
  - Add keyframe definition
  - Add to animation config
- [ ] Wrap App with ToastProvider in `src/App.jsx`
- [ ] Replace alert() calls:
  - [ ] `src/components/auth/AuthForm.jsx` (line 80)
  - [ ] `src/components/layout/Header.jsx` (line 13)

**New files to create:**
- `src/components/ui/Toast.jsx`
- `src/components/ui/ToastContainer.jsx`
- `src/hooks/useToast.js`
- `src/contexts/ToastContext.jsx`

**Files to modify:**
- `tailwind.config.js`
- `src/App.jsx`
- `src/components/auth/AuthForm.jsx`
- `src/components/layout/Header.jsx`

---

### 3. Skeleton Loaders (2 hours)

**Goal:** Replace spinners with skeleton screens for better UX.

**Tasks:**
- [ ] Create `src/components/ui/SkeletonLoader.jsx` component
  - 3 variants: text, card, row
  - Configurable count
  - Pulse animation
- [ ] Replace spinner in `src/components/meal-plan/MealTable.jsx`
  - Show 7 row skeletons while loading
  - Keep "Loading meal plan..." text
- [ ] Replace spinner in `src/components/suggestions/RecipeSuggestions.jsx`
  - Show 6 card skeletons in grid
  - Add descriptive subtitle

**New files to create:**
- `src/components/ui/SkeletonLoader.jsx`

**Files to modify:**
- `src/components/meal-plan/MealTable.jsx` (lines 72-79)
- `src/components/suggestions/RecipeSuggestions.jsx` (lines 58-70)

---

### 4. Remove Debug Console Logs (1 hour)

**Goal:** Strip console.log from production builds for security.

**Tasks:**
- [ ] Create `src/utils/logger.js` utility
  - Only logs in development mode
  - Strips logs in production build
- [ ] Replace all console.log/error/warn calls:
  - [ ] `src/components/meal-plan/MealTable.jsx` (lines 56, 59, 67)
  - [ ] `src/components/meal-plan/MealRow.jsx` (lines 91, 104)
  - [ ] `src/contexts/MealPlanContext.jsx` (lines 58, 61, 76, 120, 216)
  - [ ] `src/components/suggestions/RecipeSuggestions.jsx` (line 50)
  - [ ] `src/contexts/AuthContext.jsx` (line 23)

**New files to create:**
- `src/utils/logger.js`

**Files to modify:**
- 5 files listed above

---

### 5. Content Security Policy (30 minutes)

**Goal:** Add CSP headers to prevent XSS attacks.

**Tasks:**
- [ ] Add CSP meta tag to `index.html`
  - Place in `<head>` section
  - Allow Supabase API calls
  - Allow recipe images from any HTTPS
  - Upgrade insecure requests
- [ ] Create `vercel.json` for production deployment
  - Add CSP header
  - Add X-Frame-Options: DENY
  - Add X-Content-Type-Options: nosniff
  - Add Referrer-Policy

**New files to create:**
- `vercel.json`

**Files to modify:**
- `index.html`

---

### 6. Audit Logging (2 hours)

**Goal:** Track all data changes for security and debugging.

**Tasks:**
- [ ] Run migration in Supabase SQL Editor
  - Create `audit_logs` table
  - Add indexes on created_at and user_id
  - Enable RLS with proper policies
- [ ] Create `src/services/audit.service.js`
  - Log function with action, entity_type, entity_id, details
  - Capture user email and user_id automatically
- [ ] Add audit calls in `src/contexts/MealPlanContext.jsx`:
  - [ ] After meal update (line 112)
  - [ ] After meal swap (line 209)
- [ ] Test audit logs appear in Supabase

**New files to create:**
- `audit-log-migration.sql`
- `src/services/audit.service.js`

**Files to modify:**
- `src/contexts/MealPlanContext.jsx`

---

### 7. User-Friendly Error Messages (1 hour)

**Goal:** Replace technical errors with helpful messages.

**Tasks:**
- [ ] Create `src/utils/errorMessages.js`
  - Map common errors to friendly messages
  - Export getUserFriendlyError() function
- [ ] Update error handlers in services and contexts
  - Use getUserFriendlyError() wrapper
  - Show helpful messages to users

**New files to create:**
- `src/utils/errorMessages.js`

**Files to modify:**
- Error handlers in service files (as needed)

---

### 8. Update Documentation (1 hour)

**Tasks:**
- [ ] Update `README.md`
  - Add Phase 7 section with features
  - Update status to show Phase 7 complete
  - Update roadmap to show Phase 8 as next
- [ ] Update project structure section if needed
- [ ] Verify all instructions still accurate

**Files to modify:**
- `README.md`

---

## Phase 7 Testing Checklist

### Mobile Drag-and-Drop
- [ ] Works on iPhone Safari
- [ ] Works on Android Chrome
- [ ] Scrolling works normally
- [ ] Drag activates without triggering scroll

### Toasts
- [ ] Success toast on signup
- [ ] Error toast on logout fail
- [ ] Auto-close after 4 seconds
- [ ] Multiple toasts stack correctly
- [ ] Close button works

### Skeletons
- [ ] 7 row skeletons in meal table
- [ ] 6 card skeletons in recipes
- [ ] Pulse animation smooth

### Security
- [ ] No console.log in production build
- [ ] CSP headers visible in DevTools Network tab
- [ ] Audit logs created in Supabase
- [ ] Error messages are user-friendly

---

## Phase 7 Implementation Order

Follow this sequence to minimize conflicts:

1. **Mobile Drag-and-Drop Fix** (2-3 hours)
2. **Toast System** (3-4 hours)
3. **Skeleton Loaders** (2 hours)
4. **Remove Debug Logs** (1 hour)
5. **CSP Headers** (30 min)
6. **Audit Logging** (2 hours)
7. **Error Messages** (1 hour)
8. **Documentation** (1 hour)

**Total: 12-14 hours**

---

# Phase 8: Testing & Deployment

**Status:** Planned
**Estimated Time:** 8-10 hours
**Priority:** Medium

### Overview
Phase 8 adds comprehensive testing and prepares for production deployment.

---

## Phase 8 Tasks

### 1. Unit Testing Setup (2-3 hours)

**Goal:** Set up testing infrastructure with Vitest and React Testing Library.

**Tasks:**
- [ ] Install testing dependencies
  - `npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`
- [ ] Configure Vitest in `vite.config.js`
  - Add test environment: jsdom
  - Add test globals
  - Add coverage reporter
- [ ] Create `src/setupTests.js`
  - Import @testing-library/jest-dom
  - Add custom matchers
- [ ] Add test scripts to `package.json`
  - `test`: run tests
  - `test:coverage`: run with coverage
  - `test:watch`: watch mode

---

### 2. Component Tests (3-4 hours)

**Goal:** Test critical UI components.

**Priority Components:**
- [ ] `MealRow.jsx` - Test meal input, checkbox, drag handle
- [ ] `MealAutocomplete.jsx` - Test suggestions, keyboard navigation
- [ ] `Toast.jsx` - Test auto-close, manual close
- [ ] `AuthForm.jsx` - Test login/signup validation

**Test Coverage Goals:**
- 70%+ coverage on components
- All critical user flows tested

---

### 3. Service Tests (2 hours)

**Goal:** Test Supabase service functions.

**Tasks:**
- [ ] Mock Supabase client
- [ ] Test `mealPlan.service.js` functions
- [ ] Test `history.service.js` autocomplete
- [ ] Test `suggestions.service.js` recipe fetching
- [ ] Test `audit.service.js` logging

---

### 4. Integration Tests (1-2 hours)

**Goal:** Test key user flows end-to-end.

**Critical Flows:**
- [ ] User signup and login
- [ ] Add meal and see autocomplete
- [ ] Mark meal as cooked
- [ ] Drag and drop to reorder
- [ ] Navigate between weeks

---

### 5. Production Build & Optimization (1 hour)

**Tasks:**
- [ ] Run production build: `npm run build`
- [ ] Analyze bundle size
- [ ] Test production build locally: `npm run preview`
- [ ] Verify no console.log in build
- [ ] Check for unused dependencies

---

### 6. Deployment to Vercel (1 hour)

**Tasks:**
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Run `vercel` to deploy
- [ ] Add environment variables in Vercel dashboard:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
- [ ] Test deployed app
- [ ] Verify CSP headers work
- [ ] Test on real mobile devices

---

### 7. Final Documentation (1 hour)

**Tasks:**
- [ ] Update README with deployment URL
- [ ] Document testing commands
- [ ] Add troubleshooting section
- [ ] Create SECURITY.md with security measures
- [ ] Update status to "Phase 8 Complete"

---

## Phase 8 Testing Checklist

### Unit Tests
- [ ] All component tests pass
- [ ] All service tests pass
- [ ] 70%+ code coverage achieved

### Production Build
- [ ] Build completes without errors
- [ ] Bundle size under 500KB
- [ ] No warnings in console
- [ ] CSP doesn't block resources

### Deployment
- [ ] App accessible at Vercel URL
- [ ] HTTPS enforced
- [ ] Environment variables loaded
- [ ] Mobile drag-and-drop works
- [ ] All features functional

---

## Notes

- **No dependencies needed for Phase 7** - All features use React, Tailwind, and Supabase
- **Phase 8 requires:** Vitest, @testing-library/react, jsdom
- **Test before deploy:** Always test production build locally first
- **Real device testing:** Critical for mobile drag-and-drop verification

---

**Last Updated:** 2025-11-28
