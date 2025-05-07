# RSVPY Project Status and Development Guide

## Project Overview
RSVPY is a Next.js application for creating and managing invitations and RSVPs using Supabase. The project features a light ivory background with elegant black buttons and a mobile-friendly design.

## Current Progress
✅ Set up the Next.js application with TypeScript
✅ Configured Tailwind CSS
✅ Created basic UI components (Header, ProtectedRoute)
✅ Set up authentication context using Supabase
✅ Created login, dashboard, and event creation pages
✅ Fixed TypeScript and import path issues
✅ Improved Supabase error handling
✅ Implemented freemium model with subscription tiers
✅ Created pricing page with subscription options
✅ Added event view tracking functionality
✅ Implemented RSVP form with success confirmation
✅ Added database schema with notification settings
✅ Fixed file upload limitations with fallback to placeholders
✅ Consolidated setup documentation
✅ Fixed path aliases in tsconfig.json to prevent import errors
✅ Implemented proper null checks for TypeScript safety
✅ Implemented core page builder structure with drag-and-drop functionality
✅ Created template selection system with 3 initial designs
✅ Added widget management for page builder

## Development Guidelines

### TypeScript Best Practices
1. **Use Type Safety**: Always define interfaces for component props and state
2. **Null Checks**: Add proper null/undefined checks with optional chaining (`?.`) and nullish coalescing (`??`)
3. **Auth Context**: Use the `isLoading` property from AuthContext (not `loading` which is deprecated)

### Component Structure
1. **Client Components**: Use 'use client' directive for client-side components
2. **Loading States**: Implement proper loading states with consistent spinners
3. **Error Handling**: Always include error handling with user-friendly messages

### Supabase Interaction
1. **Error Handling**: Use try/catch blocks with the `handleSupabaseError` utility
2. **RLS Policies**: Be aware of Row Level Security when writing queries
3. **Storage**: Use placeholders for images if storage bucket access fails

### File Organization
1. **Components Directory**: Keep reusable UI components here
2. **App Directory**: Use the Next.js App Router structure
3. **Contexts**: Keep context providers in the contexts directory
4. **Lib**: Store utilities and Supabase config in the lib directory
5. **Page Builder**: Keep page builder components in the components/page-builder directory

### Email Notifications
1. **Status**: Email notifications are marked as "under development"
2. **Implementation**: Database structure is ready, but actual sending is not implemented
3. **UI**: All UI components show appropriate notices about this feature

### Business Model Implementation
1. **Free Tier**: Currently unlimited, will eventually have restrictions
2. **Premium Features**: Custom image uploads, no branding, higher limits
3. **Subscription Plans**: Premium and Professional tiers are defined

### Page Builder Implementation
1. **Templates**: Three initial templates are provided (Elegant Wedding, Birthday Celebration, Corporate Event)
2. **Widgets**: Basic widgets are implemented (Header, Text, Image, Gallery, Map, RSVP Form, Countdown, Calendar)
3. **Editor Interface**: Drag-and-drop functionality and property editing are implemented
4. **State Management**: Page Builder context manages the editor state, including templates, widgets, and styles

## Next Steps
1. Complete the widget implementations for the page builder
2. Implement database storage for page designs
3. Enhance the RSVP customization features
4. Implement free tier limitations:
   - Limit to 3 photos per event
   - Add image compression for free tier
   - Cap guest list at 50 for free users
5. Set up payment processing with Stripe/PayPal
6. Enable email sending when technical infrastructure is ready
7. Add user profile and settings page
8. Implement analytics dashboard for event owners

## Database Schema Updates
The following SQL has been applied to the Supabase database:
1. Base schema with events, rsvps, and email_invitations tables
2. Added notification_settings column to events table
3. Added increment_event_views function
4. Setup storage with appropriate policies

## Common Issues & Solutions
1. **Import Path Issues**: Use the updated `@/*` path mapping in tsconfig.json
2. **Auth Context Type Errors**: Use isLoading instead of loading property
3. **Event New RSVPs Badge**: Always add a null check like: `event.new_rsvps_count !== undefined && event.new_rsvps_count > 0`
4. **Storage Bucket Access**: Handle storage errors gracefully with fallbacks to placeholders

## Future Considerations
- Email sending requires proper SMTP credentials and configuration
- Payment processing will need Stripe or similar integration
- Backups of Supabase data should be implemented
- Consider serverless functions for heavy processing tasks
