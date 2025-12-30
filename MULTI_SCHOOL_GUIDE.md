# Multi-School Support - KVS AI Substitution Manager

## Overview
The application now supports multiple schools with complete data isolation. Each school has its own set of teachers, leaves, requests, and substitution history.

## Admin Login Credentials

### KV Pattom Shift 2
- **Email**: kendriyavidyalaya_pattom@yahoo.co.in
- **Password**: Admin@kvpatm2
- **School ID**: kvpatm2
- **Teachers**: 45 teachers (12 PGT, 17 TGT, 16 PRT)

## How Multi-School Works

### 1. School Registration
When an admin registers a new school:
1. Admin provides a unique **School Short Code** (e.g., "kvpatm2")
2. System checks if the code already exists
3. If exists → Shows "This short code is unavailable"
4. If unique → Creates the school with admin account

### 2. Data Isolation
All data is filtered by `school_id`:
- **Teachers**: Each school only sees their own teachers
- **Leaves**: Only leave records for teachers in the same school
- **Requests**: Only requests from the same school
- **History**: Only substitution history for the same school
- **Announcements**: School-specific announcements

### 3. Teacher Import
When importing teachers via CSV:
- All teachers must have the same `school_id`
- Teachers can only be viewed by admins/teachers from their school
- Username format: `{school_code}.{employee_code}`

### 4. Login System
- **Teachers**: Login with username (e.g., `kvpatm2.21160`)
- **Admins**: Login with email (e.g., `kendriyavidyalaya_pattom@yahoo.co.in`)
- Both passwords are case-sensitive
- After login, all data queries filter by the user's `school_id`

## API Changes

All API functions now accept optional `schoolId` parameter:
```typescript
getUsers(schoolId?: string) // Filters users by school
getLeaves(schoolId?: string) // Filters leaves by school
getRequests(schoolId?: string) // Filters requests by school
getHistory(schoolId?: string) // Filters history by school
```

Helper function:
```typescript
getUsersBySchool(schoolId: string) // Get all users for a specific school
```

## Database Schema

### School Identification
- `school_id` column in `users` table stores the unique school code
- All other tables reference users via foreign keys
- Data isolation enforced at application level (filtering by school_id)

### Example School IDs
- `kvpatm2` → KV Pattom Shift 2
- `kvpatm1` → KV Pattom Shift 1 (if registered)
- `kvtvm` → KV Trivandrum (if registered)

## Adding a New School

1. **Admin Registration**:
   - Navigate to Auth Page → "Admin Registration"
   - Enter unique school short code
   - Fill admin details and email
   - Create password

2. **Add Teachers**:
   - Login as admin
   - Go to Admin Dashboard → "Add Teacher"
   - Manually add each teacher OR
   - Use "Bulk Timetable" to import CSV

3. **CSV Import Format**:
   ```csv
   id,name,username,email,password,role,designation,subject,employee_code,employment_type,school_id,...
   ```
   **Important**: Ensure all rows have the same `school_id`

## Security

- School data completely isolated
- No cross-school data access
- Users can only view/modify data from their own school
- Row Level Security (RLS) policies enforce access control

## Testing Multi-School

### Create Second School:
1. Sign out from current school
2. Go to Auth Page → "Admin Registration"
3. Use different school code (e.g., "kvtvm")
4. Register and add teachers

### Verify Isolation:
1. Login to School 1 → Note teacher count
2. Sign out and login to School 2
3. Verify different teacher list
4. Check that leaves/requests/history are separate

## Troubleshooting

### "This short code is unavailable"
- The school code already exists in the database
- Choose a different unique code
- Contact support if you believe this is an error

### Not seeing all teachers
- Verify you're logged in to the correct school
- Check the `school_id` in the teachers CSV
- Ensure all teachers have the same `school_id` as the admin

### Cross-school data appearing
- This should NOT happen (report as bug)
- Verify API calls include `schoolId` parameter
- Check component implementations

## Current Schools in Database

1. **KV Pattom Shift 2** (kvpatm2)
   - Admin: kendriyavidyalaya_pattom@yahoo.co.in
   - Teachers: 45
   - Status: Active

---

**Last Updated**: December 22, 2025
**Version**: 3.0 (Multi-School Support)
