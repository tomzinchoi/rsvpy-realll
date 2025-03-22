Project Overview
We've been working on RSVPY, a Next.js application for creating and managing invitations and RSVPs using Supabase. The project features a light ivory background with elegant black buttons and a mobile-friendly design.

Current Progress
✅ Set up the Next.js application with TypeScript
✅ Configured Tailwind CSS
✅ Created basic UI components (Header, ProtectedRoute)
✅ Set up authentication context using Supabase
✅ Created login, dashboard, and event creation pages
✅ Fixed TypeScript and import path issues

Current Status
All basic components are in place
Authentication flow is set up but needs Supabase configuration
Pages are created with proper routing
TypeScript errors have been addressed by using relative imports and adding proper type annotations
Coding Rules and Patterns
Project Structure:

/app - Next.js 13+ App Router pages
/components - Reusable UI components
/contexts - React context providers
/lib - Utility functions, Supabase client, type definitions
Import Paths:

Use relative imports (e.g., ../components/Header) instead of path aliases to avoid TypeScript errors
For deeply nested components, consider restructuring imports
TypeScript Patterns:

Explicitly define types for all state variables
Use proper type annotations for function parameters
Create interface/type definitions for database models in lib/database.types.ts
Authentication:

Using Supabase for authentication
AuthContext provider wraps the application
Protected routes redirect unauthenticated users to login page
Styling:

Tailwind CSS for component styling
Custom CSS for specific components like buttons
Mobile-first approach with responsive design
Form Handling:

Controlled components for form inputs
Form validation before submission
Error handling and display
Next Steps
Set up proper Supabase environment variables
Implement RSVP functionality
Create event detail pages
Build the email sending feature
Add more customization options for invitations
Common Issues to Avoid
Path alias issues (stick to relative imports for now)
TypeScript type errors (especially with Supabase responses)
Missing environment variables for Supabase
CSS conflicts between Tailwind and custom styles
By following these rules and understanding our current progress, we can continue developing the RSVPY application efficiently in the next session.