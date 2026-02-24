## Context

The application is currently utilizing a very basic, flat Material UI theme configuration (`light-theme.ts`). The user wants to modernize the visual aesthetics to feel premium, utilizing modern blue-tones, gradients, and transparencies.

## Goals / Non-Goals

**Goals:**
- Implement a modern blue-toned color palette (Navy primary, Sky/Cyan secondary).
- Add glassmorphic effects (transparencies, back-drop blurs) for premium feel.
- Adjust border-radius and typography values for cleaner visual hierarchy.
- Use CSS gradients for prominent UI elements.

**Non-Goals:**
- Completely rewriting the component structure.
- Altering the React State Management or application core logic.

## Decisions

### Decision 1: Extend MUI Theme Configuration
Instead of installing TailwindCSS or writing massive amounts of vanilla CSS, we will keep leveraging Material UI's `createTheme` to override the default styles. This is the most non-destructive approach for the current architecture.

### Decision 2: Glassmorphism via `sx` prop or CSS Modules
For elements requiring advanced transparencies and gradients (like the top AppBar or specific Cards), we will apply custom static overrides inside the Component definitions or the global theme `styleOverrides`.
