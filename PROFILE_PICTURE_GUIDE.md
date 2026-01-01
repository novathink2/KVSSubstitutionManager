# Profile Picture Upload Guide

## Overview

Teachers and admins can upload and manage their profile pictures in the KVS AI Substitution Manager. This guide covers the profile picture feature implementation.

---

## Features

### ✨ Key Features

- **Easy Upload**: Click camera icon to upload profile picture
- **Image Preview**: Real-time preview of uploaded image
- **Validation**: Automatic file type and size validation
- **Fallback Display**: Shows initials if no profile picture
- **Responsive Design**: Works on all devices
- **Secure Storage**: Supabase Storage with public access
- **Instant Update**: Profile picture updates across all views

---

## How to Upload Profile Picture

### For Teachers:

1. **Navigate to Profile**:
   - Click "Profile" tab in teacher dashboard sidebar

2. **Upload Picture**:
   - Click the **camera icon** at the bottom-right of your profile picture circle
   - Select an image file from your device
   - Supported formats: JPEG, PNG, JPG, WebP
   - Maximum file size: **5 MB**

3. **Wait for Upload**:
   - A loading spinner appears while uploading
   - Success message appears when upload is complete
   - Page automatically refreshes to show new picture

4. **View Changes**:
   - Profile picture appears in the header circle
   - Replaces the initials display
   - Visible across all pages

### For Admins:

Same process as teachers via "My Profile" in admin dashboard.

---

## Technical Implementation

### Frontend Components

**TeacherProfile.tsx**:
```typescript
- Camera icon button overlay on profile picture
- File input with image/* accept filter
- Upload progress indicator
- Error handling with toast notifications
- Automatic page refresh after upload
```

**Profile Picture Display**:
- Shows uploaded image if available
- Falls back to initials (first letter of each name)
- Circular design with border
- Responsive sizing (96px diameter)

### Backend API

**Storage Bucket**: `profile-pictures` (Public)

**API Function**: `uploadProfilePicture(file, userId)`

**Upload Process**:
1. Validate file type (image/*)
2. Validate file size (<= 5MB)
3. Generate unique filename: `{userId}-{timestamp}.{ext}`
4. Upload to Supabase Storage
5. Get public URL
6. Update user record with `profilePicture` URL
7. Return public URL

### Database Schema

**Users Table**:
```sql
profile_picture TEXT NULL -- stores public URL
```

---

## Validation Rules

### File Type
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ WebP (.webp)
- ❌ GIF, SVG, BMP (not supported)

### File Size
- **Maximum**: 5 MB
- **Recommended**: 500 KB - 2 MB for optimal loading
- **Minimum**: No minimum (but 100x100px recommended)

### Image Dimensions
- **Recommended**: 400x400px or higher
- **Aspect Ratio**: Square (1:1) recommended for best display
- **Minimum**: 100x100px

---

## User Flow

```
┌─────────────────────┐
│  User clicks camera │
│  icon on profile    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  File picker opens  │
│  (accept: image/*)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  User selects image │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Validation:        │
│  - Check file type  │
│  - Check file size  │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌───────┐     ┌─────────┐
│ Error │     │ Upload  │
│ Toast │     │ to      │
└───────┘     │ Supabase│
              └────┬────┘
                   │
                   ▼
            ┌──────────────┐
            │ Get public   │
            │ URL          │
            └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │ Update user  │
            │ profile_pic  │
            │ in database  │
            └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │ Success      │
            │ toast +      │
            │ page refresh │
            └──────────────┘
```

---

## Error Handling

### Common Errors and Solutions

**Error**: "Please upload an image file"
- **Cause**: Non-image file selected
- **Solution**: Select JPEG, PNG, or WebP file

**Error**: "Please upload an image smaller than 5MB"
- **Cause**: File exceeds 5MB limit
- **Solution**: Compress image or choose smaller file

**Error**: "Failed to upload profile picture"
- **Cause**: Network error or storage permission issue
- **Solution**: Check internet connection and try again

**Error**: Upload spinner never stops
- **Cause**: Network timeout or server error
- **Solution**: Refresh page and retry upload

---

## Display Behavior

### With Profile Picture:
```
┌─────────────────┐
│                 │
│   [IMAGE]       │
│                 │
│   📷 (camera)   │
└─────────────────┘
```

### Without Profile Picture (Fallback):
```
┌─────────────────┐
│                 │
│      JD         │ ← Initials (e.g., John Doe → JD)
│                 │
│   📷 (camera)   │
└─────────────────┘
```

---

## Storage Architecture

### Supabase Storage Configuration

**Bucket Name**: `profile-pictures`

**Policies**:
- **Public Access**: Anyone can view images
- **Authenticated Upload**: Only logged-in users can upload
- **Owner Update**: Users can update their own profile picture
- **Owner Delete**: Users can delete their own profile picture

**File Naming Convention**:
```
{userId}-{timestamp}.{extension}

Examples:
- 12345-1703001234567.jpg
- abc-def-456-1703001234890.png
```

---

## Performance Optimization

### Best Practices:
1. **Compress Images**: Use tools like TinyPNG before uploading
2. **Use WebP**: Modern format with better compression
3. **Square Aspect Ratio**: Prevents cropping issues
4. **Moderate Resolution**: 400x400px is optimal (not too large, not too small)
5. **Delete Old Pictures**: Previous uploads are automatically overwritten

### Loading Optimization:
- Images are cached by browser
- Public URLs don't require authentication
- CDN delivery via Supabase

---

## Security Considerations

### ✅ Implemented Security:
- File type validation (client-side)
- File size validation (client-side)
- Unique filenames prevent conflicts
- Public bucket but upload requires authentication
- No sensitive data stored (only profile photos)

### ⚠️ Recommendations:
- **Server-side validation**: Consider adding backend file validation
- **Image scanning**: Implement malware scanning for uploaded files
- **Rate limiting**: Prevent abuse by limiting uploads per user/day
- **NSFW filter**: Add content moderation for inappropriate images

---

## Troubleshooting

### Profile Picture Not Showing?

1. **Check Upload Success**:
   - Look for success toast notification
   - Check browser console for errors

2. **Verify Database**:
   - Open Supabase dashboard
   - Check users table → profile_picture column
   - Should contain a valid URL

3. **Check Storage**:
   - Open Supabase Storage
   - Navigate to profile-pictures bucket
   - Verify file exists with correct naming

4. **Clear Cache**:
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Clear browser cache
   - Try incognito mode

5. **Check Permissions**:
   - Verify storage bucket policies
   - Ensure public read access enabled

---

## Future Enhancements

### Planned Features:
- [ ] Image cropping tool (zoom, rotate, crop to square)
- [ ] Multiple image filters/effects
- [ ] Thumbnail generation for faster loading
- [ ] Drag-and-drop upload
- [ ] Camera capture (for mobile devices)
- [ ] Profile picture history (previous uploads)
- [ ] Admin ability to moderate profile pictures
- [ ] Automatic image optimization on upload

---

## Code Reference

**Main Component**: `src/components/features/teacher/TeacherProfile.tsx`

**API Functions**: `src/lib/api.ts`
- `uploadProfilePicture(file, userId)`
- `updateUser(user)`

**Storage Bucket**: Supabase Storage → `profile-pictures`

**Database Column**: `users.profile_picture` (TEXT)

---

**Last Updated**: January 1, 2026  
**Version**: 1.0 (Profile Picture Feature)
