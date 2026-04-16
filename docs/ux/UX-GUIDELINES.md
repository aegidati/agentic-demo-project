# UX Guidelines

This document defines **UX principles and patterns** that guide design decisions across the application.

These guidelines are **stack-agnostic** — they apply whether the UI is:
- Web (React, Vue, Angular)
- Mobile (iOS, Android, Flutter)
- Desktop (Electron, WPF, Qt)
- Voice/Chat interface

## Core UX Principles

### 1. Clarity
- **Every action should be obvious**: Users should understand what will happen before clicking.
- **Minimize cognitive load**: Use clear labels, logical grouping, and familiar patterns.
- **Visibility**: Important information must not be hidden behind menus or modal dialogs.

### 2. Consistency
- **Uniform patterns**: Repeated actions behave the same way throughout.
- **Visual hierarchy**: Important elements are visually prominent.
- **Language**: Use consistent terminology across all screens.

### 3. Feedback
- **Immediate response**: Users must see the result of their action (loading, success, error).
- **Error clarity**: Error messages must explain what went wrong and how to fix it.
- **Progress indication**: Long-running operations should show progress.

### 4. Accessibility
- **Color contrast**: Text meets WCAG AA standards.
- **Keyboard navigation**: All features accessible via keyboard.
- **Screen readers**: Semantic HTML / proper labeling.
- **Inclusive design**: Consider diverse abilities and contexts.

### 5. Performance
- **Fast feedback**: UI must respond in < 100ms to user input.
- **Lazy loading**: Load content as needed, not upfront.
- **Optimization**: Minimize bandwidth and battery drain (mobile).

## Common UX Patterns

### Forms
- **Label + Input**: Clear labeling, auto-focus on first field
- **Validation**: Real-time feedback, not just submit-time
- **Success state**: Clear indication of successful submission
- **Error handling**: Inline error messages near the field

### Lists / Tables
- **Sorting**: Click column header to sort
- **Pagination**: Clear page indicators, "load more" or numbered pages
- **Search**: Filter/search results as user types
- **Empty state**: Help text when no results

### Navigation
- **Breadcrumbs**: Show user location in hierarchy
- **Back button**: Clear way to return to previous screen
- **Persistent navigation**: Menu visible on all screens (unless fullscreen mode)

### Modals / Dialogs
- **Clear title**: What action is this dialog for?
- **Primary action**: Highlighted, obvious call-to-action
- **Close option**: Always provide a way to cancel/close
- **Focus trap**: Keyboard focus stays within modal

### Notifications
- **Toast/Banner**: Confirmation, warning, error messages
- **Duration**: Auto-dismiss after 5 seconds (unless critical)
- **Positioning**: Consistent location (top, bottom, corner)

## Responsive Design

- **Mobile first**: Design for smallest screen first
- **Breakpoints**: Test at common sizes (mobile, tablet, desktop)
- **Touch-friendly**: Buttons ≥ 44px, spacing for touch interaction
- **Readable text**: Font size ≥ 16px on mobile

## Internationalization (i18n)

- **Text length**: Allow for 30% expansion in other languages
- **Date/time formats**: Use locale-appropriate formats
- **Directionality**: Support RTL languages if applicable
- **Icons**: Avoid culture-specific imagery

## Dark Mode

If supported:
- **Color palette**: Define dark mode colors
- **Contrast**: Ensure readability in dark mode
- **User preference**: Respect `prefers-color-scheme`

## Animation & Motion

- **Purpose-driven**: Animations clarify relationships, not decoration
- **Performance**: Animations should not jank or stutter
- **Accessibility**: Respect `prefers-reduced-motion`

## Voice & Tone

- **Friendly, not cute**: Professional but approachable
- **Active voice**: Use "You can..." instead of "It is possible to..."
- **Error messages**: Explain what happened, offer solutions
- **Terminology**: Use domain language consistently

---

## Enforcement

- **Design reviews**: Check new screens against these principles
- **UX agent**: Validates designs before implementation
- **User testing**: Periodic validation with real users

---

**To populate further**: Add specific component examples, color palettes, and brand guidelines after UI framework selection.
