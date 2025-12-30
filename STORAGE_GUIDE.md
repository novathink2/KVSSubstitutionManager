# KVS AI Substitution Manager - Storage Architecture Guide

## Overview

This application uses a hybrid storage architecture with **Supabase Database** for structured data and **Supabase Storage Buckets** for file management.

---

## 🗄️ Database Storage (Structured Data)

All core application data is stored in PostgreSQL database tables:

### 1. **Users Table**
- **Purpose**: Store all teacher and admin profiles
- **Data Includes**: 
  - Personal info (name, email, phone, DOB)
  - Employment details (code, designation, type)
  - School affiliation
  - Weekly timetable (stored as JSONB)
  - Profile picture URL (reference to storage bucket)
- **Access**: Row-level security ensures users can only access their own data

### 2. **Leaves Table**
- **Purpose**: Track teacher leave applications and absence records
- **Data Includes**:
  - Teacher reference
  - Date and type (full/partial)
  - Reason
  - Optional leave certificate document URL
- **Access**: Teachers can view all but only create/delete their own

### 3. **Requests Table**
- **Purpose**: Manage teacher requests (class interchange, extra class)
- **Data Includes**:
  - Request type and details
  - Status (pending/approved/rejected)
  - Timestamps
- **Access**: Teachers create, admins approve/reject

### 4. **Substitution History Table**
- **Purpose**: Archive all generated substitution plans
- **Data Includes**:
  - Date and absent teacher info
  - Complete substitution plan (stored as JSONB)
  - Reason for absence
- **Access**: Read-only for all authenticated users

### 5. **Announcements Table** *(New)*
- **Purpose**: School-wide announcements and circulars
- **Data Includes**:
  - Title, content, category
  - Optional document attachment URL
  - Creator and school reference
- **Access**: All can read, admins can create/edit

---

## 📁 File Storage (Buckets)

Supabase Storage buckets for file management:

### 1. **profile-pictures** *(Public)*
- **Max Size**: 5 MB
- **Allowed Types**: JPEG, PNG, JPG, WebP
- **Purpose**: Teacher and admin profile photos
- **Access**: 
  - Anyone can view (public bucket)
  - Authenticated users can upload/update/delete
- **Naming**: `{userId}-{timestamp}.{ext}`

### 2. **leave-documents** *(Private)*
- **Max Size**: 10 MB
- **Allowed Types**: PDF, JPEG, PNG, JPG
- **Purpose**: Medical certificates, leave proof documents
- **Access**:
  - Only authenticated users can view their own documents
  - Teachers upload when applying for leave
- **Naming**: `leave-{leaveId}-{timestamp}.{ext}`
- **Reference**: Stored in `leaves.document_url` column

### 3. **school-documents** *(Public)*
- **Max Size**: 10 MB
- **Allowed Types**: PDF, Images, Word documents
- **Purpose**: Official circulars, announcements, school forms
- **Access**:
  - Anyone can view (public bucket for transparency)
  - Only admins can upload/edit/delete
- **Naming**: `{schoolId}-{timestamp}.{ext}`
- **Reference**: Stored in `announcements.document_url` column

### 4. **timetable-exports** *(Private)*
- **Max Size**: 5 MB
- **Allowed Types**: CSV, Excel
- **Purpose**: Backup exports of teacher and master timetables
- **Access**:
  - Only authenticated users can access
  - Auto-generated when downloading timetables
- **Naming**: `timetable-{schoolId}-{timestamp}.csv`

### 5. **substitution-reports** *(Private)*
- **Max Size**: 10 MB
- **Allowed Types**: PDF, CSV
- **Purpose**: Generated substitution plan reports for archiving
- **Access**:
  - Only authenticated users (teachers and admins)
  - Auto-generated when creating substitution plans
- **Naming**: `report-{date}-{timestamp}.pdf`

---

## 🔒 Security (Row Level Security)

### Database RLS Policies:
- **Users**: Can view all in same school, update only own profile
- **Leaves**: Can view all, create/delete only own
- **Requests**: Can view all, create own, admins can update status
- **History**: Read-only for all authenticated users
- **Announcements**: All can read, admins can write

### Storage RLS Policies:
- **Profile Pictures**: Public read, authenticated write
- **Leave Documents**: Private, owner-only access
- **School Documents**: Public read, admin write
- **Timetable Exports**: Private, authenticated access
- **Substitution Reports**: Private, authenticated access

---

## 📊 Data Flow Examples

### Example 1: Teacher Applies for Leave with Certificate
```
1. Teacher fills leave form
2. Teacher uploads PDF certificate → stored in leave-documents bucket
3. Leave record created in database with document_url reference
4. Admin views leave with embedded certificate link
```

### Example 2: Admin Posts School Circular
```
1. Admin creates announcement
2. Admin uploads circular PDF → stored in school-documents bucket
3. Announcement created in database with document_url
4. All teachers can view announcement and download circular
```

### Example 3: Bulk Timetable Backup
```
1. Admin clicks "Download Master CSV"
2. System generates CSV from database timetables
3. CSV uploaded to timetable-exports bucket
4. Download link provided to admin
5. Original data remains in users.timetable (JSONB)
```

---

## 🛠️ API Functions

### Storage Upload Functions:
```typescript
// Profile picture
uploadProfilePicture(file: File, userId: string): Promise<string>

// Leave certificate
uploadLeaveDocument(file: File, leaveId: string): Promise<string>

// School documents
uploadSchoolDocument(file: File, schoolId: string): Promise<string>

// Timetable exports
uploadTimetableExport(file: File, schoolId: string): Promise<string>

// Substitution reports
uploadSubstitutionReport(file: File, date: string): Promise<string>

// Generic download
downloadFile(bucket: string, path: string): Promise<Blob>

// Generic delete
deleteFile(bucket: string, path: string): Promise<void>
```

---

## 📈 Storage Limits

| Bucket | Max File Size | Total Limit | Retention |
|--------|--------------|-------------|-----------|
| profile-pictures | 5 MB | Unlimited | Permanent |
| leave-documents | 10 MB | Unlimited | Permanent |
| school-documents | 10 MB | Unlimited | Permanent |
| timetable-exports | 5 MB | 1 GB | 90 days |
| substitution-reports | 10 MB | 2 GB | 180 days |

---

## 🔄 Backup Strategy

### Automated Backups:
- **Database**: OnSpace Cloud automatic daily backups
- **Files**: Manual export recommended quarterly

### Manual Backup Process:
1. Admin downloads master timetable CSV
2. Admin downloads all active leave documents
3. Admin exports substitution history as CSV
4. Store locally or in school server

---

## 💡 Best Practices

1. **Always reference files by URL**: Store public URLs in database, never file paths
2. **Validate file types**: Use allowed_mime_types bucket configuration
3. **Cleanup old files**: Delete unused timetable exports and reports periodically
4. **Compress large files**: Optimize PDFs before uploading
5. **Use descriptive names**: Include timestamps and references in filenames
6. **Check file size**: Validate before upload to avoid errors

---

## 🐛 Troubleshooting

### Common Issues:

**Error: "File too large"**
- Check bucket file_size_limit
- Compress file before upload

**Error: "Invalid file type"**
- Verify file extension matches allowed_mime_types
- Convert to supported format

**Error: "Access denied"**
- Check RLS policies
- Ensure user is authenticated
- Verify bucket permissions

**File not appearing after upload**
- Check if upload returned error
- Verify file URL was saved to database
- Check browser console for errors

---

## 📞 Support

For issues with:
- **Database**: Check table RLS policies in Supabase dashboard
- **Storage**: Verify bucket policies and MIME types
- **API**: Review backend logs for error details

---

**Last Updated**: December 20, 2025
**Version**: 2.0 (Cloud Storage Enhanced)
