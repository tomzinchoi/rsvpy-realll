# RSVPY Setup Guide

This document provides all the information needed to set up and configure RSVPY. It consolidates information from previously separate documents.

## Environment Setup

1. Create a `.env.local` file at the root of your project with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase project under Settings > API.

## Automatic Setup

RSVPY includes an automatic setup process that will configure your database and storage when you first log in. Simply:

1. Create an account or log in
2. The system will automatically attempt to set up required resources
3. Start creating events!

## Manual Supabase Setup

If the automatic setup doesn't work, follow these manual steps:

### Database Setup

1. **Log in to Supabase Dashboard**: Go to [app.supabase.com](https://app.supabase.com) and select your project.

2. **Open SQL Editor**: Click on "SQL Editor" in the left sidebar.

3. **Create Database Tables**: Use the SQL from our consolidated schema file in `/migrations/consolidated_schema.sql`

### Storage Setup

1. **Go to Storage**: Click on "Storage" in the left sidebar.

2. **Create Bucket**:
   - Click "New Bucket"
   - Enter "events" as the bucket name
   - Enable "Public bucket" option
   - Click "Create bucket"

3. **Set Up Policies**: After creating the bucket, go to the "Policies" tab and create the following policies:

#### Public Read Policy
- For: SELECT operations
- Policy name: "Public Read Policy"
- Using expression: `bucket_id = 'events'`

#### Auth Insert Policy
- For: INSERT operations
- Policy name: "Auth Insert Policy"
- Using expression: `bucket_id = 'events' AND auth.role() = 'authenticated'`

## Subscription Features

RSVPY uses a freemium model with the following tiers:

### Free Tier
- Up to 3 events
- Basic RSVP functionality
- Up to 50 guests per event
- Basic customization
- RSVPY branding included

### Premium Tier
- Unlimited events
- Advanced RSVP features
- Up to 200 guests per event
- Custom image uploads
- No RSVPY branding

### Professional Tier
- Everything in Premium
- Custom domain support
- Unlimited guests
- Advanced analytics
- Priority support

## Troubleshooting

If you encounter issues:

1. Check browser console for error messages
2. Verify Supabase environment variables are correctly set
3. Ensure your Supabase project has the necessary tables and storage bucket
4. Try running the setup wizard again from `/setup`
