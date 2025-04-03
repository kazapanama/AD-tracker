# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- **Client**
  - Dev: `npm run dev` (from client directory)
  - Build: `npm run build`
  - Preview: `npm run preview`
- **Server**
  - Start: `npm run start`
  - Dev: `npm run dev`
  - Test: No tests specified yet

## Code Style Guidelines
- **Components**: Use functional components with hooks
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Imports**: React first, third-party libraries next, local modules last
- **API**: Use async/await with try/catch for error handling
- **File Structure**: Components in src/components, pages in src/pages
- **Error Handling**: Use try/catch blocks, provide user-friendly messages
- **Styling**: Use styled-components with consistent color scheme (#4b0082)
- **Backend**: RESTful routes, model-based architecture, parameterized SQL queries
- **State Management**: React hooks (useState, useEffect, useParams)
- **Database Access**: Always use parameterized statements for security