# Resume Project Section

## Petry - Kanban Project Management App

**Tech Stack:** Next.js 16 (App Router), React, TypeScript, Tailwind CSS, dnd-kit, Clerk Auth, Supabase, TanStack Query

Built a modern Kanban-style project management platform with secure authentication, responsive UI, and smooth drag-and-drop workflows for boards and tasks.

- Designed and implemented interactive board and task management flows, including cross-column drag-and-drop with `dnd-kit` and optimized drag UX.
- Refactored dashboard architecture from monolithic page logic into modular, reusable components for maintainability and faster feature delivery.
- Implemented Clerk-based route protection and redirect logic in middleware/proxy, ensuring authenticated and unauthenticated users are routed correctly.
- Added safe board deletion with confirmation-by-name workflow (Supabase-style) and optimistic UI patterns for responsive user feedback.
- Built production-ready UI improvements including dark/light theme support, reusable dialogs, and improved accessibility/hydration stability in interactive components.
- Diagnosed and resolved production build/runtime issues (font loading/build failures, Clerk env-key handling, hydration edge cases), improving reliability.

---

## Shorter Version (if space is tight)

### Petry - Kanban Project Management App

- Built a full-stack Kanban app using Next.js, Clerk, Supabase, and TanStack Query with secure auth and protected routing.
- Implemented smooth drag-and-drop for columns/tasks (including cross-column movement) and improved interaction quality/performance.
- Refactored dashboard into reusable components and added theme support (dark/light), confirmation-based deletion flows, and resilient build/runtime handling.
