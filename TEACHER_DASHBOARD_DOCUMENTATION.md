# Teacher Dashboard - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Dashboard Layout](#dashboard-layout)
3. [Pages Documentation](#pages-documentation)
4. [Components Reference](#components-reference)
5. [UI Elements Style Guide](#ui-elements-style-guide)

---

## Overview

The Teacher Dashboard is the main interface for teachers to manage their schedules, apply for leaves, submit requests, and view school information.

**File**: `src/pages/TeacherDashboard.tsx`

### Key Features
- ✅ Home dashboard with overview
- ✅ Leave application and history
- ✅ Request submission (interchange, extra class)
- ✅ Profile management with photo upload
- ✅ Timetable viewing and editing
- ✅ School news and announcements
- ✅ Account settings

---

## Dashboard Layout

### Structure
```
┌──────────────┬────────────────────────────────────┐
│   SIDEBAR    │         MAIN CONTENT               │
│              │                                    │
│  MENU        │                                    │
│  🏠 Home     │      Active Page Content           │
│  📄 Leaves   │                                    │
│  ✉️  Requests│                                    │
│  👤 Profile  │                                    │
│  📅 Timetable│                                    │
│  📰 News     │                                    │
│  ⚙️  Settings│                                    │
│              │                                    │
└──────────────┴────────────────────────────────────┘
│                FOOTER                            │
└──────────────────────────────────────────────────┘
```

### Sidebar
**Width**: `w-64` (256px)
**Background**: `bg-card`
**Border**: `border-r border-border`
**Padding**: `p-4`

#### Menu Header
```tsx
<h2 className="text-sm font-semibold text-muted-foreground 
                uppercase tracking-wide mb-2">
  MENU
</h2>
```

**Styling**:
- Font size: 14px
- Font weight: 600 (semibold)
- Letter spacing: `tracking-wide`
- Color: Muted gray

#### Navigation Buttons
**Active State**:
```css
.sidebar-link-active {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}
```

**Inactive State**:
```css
.sidebar-link {
  color: hsl(var(--muted-foreground));
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background 0.2s;
}
.sidebar-link:hover {
  background: hsl(var(--accent));
}
```

**Icons**: 20×20px (`w-5 h-5`)

**Tab Items**:
- 🏠 Home
- 📄 Leaves
- ✉️ Requests
- 👤 Profile
- 📅 Timetable
- 📰 News
- ⚙️ Settings

### Main Content Area
**Layout**: `flex-1 p-6 bg-muted/30`
**Animation**: `animate-fade-in` on tab change

### Footer
**Position**: `fixed bottom-0`
**Background**: `bg-card`
**Border**: `border-t border-border`
**Padding**: `py-4`
**Text**: `text-sm text-muted-foreground`

```
© 2025 KVS AI Substitution Manager
Made by students of PM SHRI KV PATTOM-2
```

---

## Pages Documentation

### 1. Home (TeacherHome)

**File**: `src/components/features/teacher/TeacherHome.tsx`

#### Purpose
Welcome screen with teacher overview and daily summary.

#### Components

##### Welcome Card
**Style**: `gradient-primary text-white border-0`

```
┌────────────────────────────────────────┐
│  Welcome back, JOLLY JOSEPH!           │
│  Have a productive day at school.      │
├────────────────────────────────────────┤
│  DESIGNATION              USERNAME     │
│  TGT (Mathematics)       kvpatm2.21160 │
└────────────────────────────────────────┘
```

**Card Header**:
- Title: `text-2xl` (32px)
- Description: `text-white/80` (80% opacity)

**Card Content**:
- Layout: Flexbox with `gap-4`
- Labels: `text-sm text-white/70 uppercase tracking-wide`
- Values: `text-xl font-semibold`

##### Today's Overview Card
```
┌────────────────────────────────────────┐
│ 📅 Today's Overview                    │
├────────────────────────────────────────┤
│ You can view your substitution duties  │
│ in the Profile section.                │
└────────────────────────────────────────┘
```

**Icon**: Calendar (`w-5 h-5 text-primary`)
**Text**: `text-muted-foreground`

---

### 2. Leaves (TeacherLeaves)

**File**: `src/components/features/teacher/TeacherLeaves.tsx`

#### Purpose
Apply for leaves and view leave history.

#### Layout
**Grid**: 2-column (`grid md:grid-cols-2 gap-6`)

**Left**: Apply/Mark Leave form
**Right**: Leave history

#### Apply Leave Form

##### Card Header
```
📄 Apply / Mark Leave
```

**Icon**: FileText (`w-5 h-5 text-primary`)

##### Form Fields

###### Date Selection
```tsx
<Label htmlFor="date">Date</Label>
<Input 
  id="date" 
  type="date" 
  value={date}
  onChange={...}
/>
```

**Styling**:
- Input height: 40px
- Border: `border-input`
- Focus: Ring with primary color

###### Leave Type (Radio Group)
```
┌────────────────────────────────────────┐
│ Type                                   │
│ ○ Full Day                             │
│ ○ Partial / Half Day                   │
└────────────────────────────────────────┘
```

**Component**: `<RadioGroup>` with `<RadioGroupItem>`

**Radio Styling**:
- Size: 16×16px
- Checked: Primary color
- Label: `cursor-pointer` for better UX

###### Reason (Textarea)
```tsx
<Label htmlFor="reason">Reason</Label>
<Textarea
  id="reason"
  placeholder="e.g., Sick Leave, Personal Appointment"
  rows={4}
/>
```

**Textarea Styling**:
- Min height: 4 rows
- Resize: Vertical only
- Border: Standard input border

##### Submit Button
```tsx
<Button onClick={handleSubmit} className="w-full">
  {loading ? 'Submitting...' : 'Submit Leave'}
</Button>
```

**States**:
- Normal: Full width, primary color
- Loading: Shows "Submitting..." with disabled state

#### Leave History

##### Card Header
```
My Leave History
```

##### Empty State
```
No leave records found.
```
- Style: `text-muted-foreground italic`

##### Leave Item
```
┌────────────────────────────────────────┐
│ Oct 15, 2024              [🗑]         │
│ Full Day                               │
│ Medical Leave                          │
└────────────────────────────────────────┘
```

**Container**:
- Padding: `p-4`
- Border: `border border-border rounded-lg`
- Hover: `hover:bg-accent/50 transition-colors`

**Date**: `font-semibold text-foreground`
**Type**: `text-sm text-muted-foreground`
**Reason**: `text-sm text-muted-foreground`

**Delete Button**:
- Icon: Trash2 (`w-4 h-4`)
- Color: `text-destructive`
- Hover: `hover:bg-destructive/10`

---

### 3. Requests (TeacherRequests)

**File**: `src/components/features/teacher/TeacherRequests.tsx`

#### Purpose
Submit requests to admin (class interchange, extra class).

#### Layout
**Grid**: 2-column (`grid md:grid-cols-2 gap-6`)

**Left**: Send request form
**Right**: My requests list

#### Send Request Form

##### Card Header
```
✉️ Send Request to Admin
```

**Icon**: Send (`w-5 h-5 text-primary`)

##### Form Fields

###### Request Type (Dropdown)
```tsx
<Label>Request Type</Label>
<Select value={requestType} onValueChange={...}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="INTERCHANGE">
      Class Interchange
    </SelectItem>
    <SelectItem value="EXTRA_CLASS">
      Extra Class
    </SelectItem>
  </SelectContent>
</Select>
```

###### Details (Textarea)
```tsx
<Label htmlFor="details">Details</Label>
<Textarea
  id="details"
  placeholder="e.g., 'Can I swap my 3rd period with Mrs. X?' 
               or 'I am free in 5th period if needed.'"
  rows={6}
/>
```

**Rows**: 6 (taller than leave reason)

##### Submit Button
```tsx
<Button onClick={handleSubmit} className="w-full">
  {loading ? 'Sending...' : 'Send Request'}
</Button>
```

#### My Requests List

##### Empty State
```
No pending requests.
```

##### Request Item
```
┌────────────────────────────────────────┐
│ Class Interchange        [PENDING]     │
│ Oct 15, 2024                           │
│ "Can I swap 3rd period with Mrs. X?"   │
└────────────────────────────────────────┘
```

**Type**: `font-semibold text-foreground`
**Date**: `text-xs text-muted-foreground`
**Details**: `text-sm text-muted-foreground`

**Status Badge**:
- PENDING: `text-status-pending` (Amber)
- APPROVED: `text-status-active` (Green)
- REJECTED: `text-status-absent` (Red)
- Style: `text-sm font-semibold uppercase`

---

### 4. Profile (TeacherProfile)

**File**: `src/components/features/teacher/TeacherProfile.tsx`

#### Purpose
View and edit profile information, upload profile picture.

#### Layout
**Stack**: Vertical cards (`space-y-6`)

#### Profile Header Card
**Background**: `gradient-primary text-white`

```
┌────────────────────────────────────────┐
│  [📷]   JOLLY JOSEPH                   │
│  ┌──────────────────────────────────┐  │
│  │  Upload icon (camera)            │  │
│  └──────────────────────────────────┘  │
│         TGT (Mathematics)              │
│         kvpatm2.21160                  │
└────────────────────────────────────────┘
```

**Profile Picture**:
- Size: 96×96px (`w-24 h-24`)
- Border: `border-4 border-white/30`
- Shadow: `shadow-xl`
- Position: Relative (for camera overlay)

**Camera Upload Button**:
- Position: `absolute bottom-0 right-0`
- Size: 32×32px (`w-8 h-8`)
- Background: `bg-white/90`
- Icon: Camera (`w-4 h-4 text-primary`)
- Hover: `hover:bg-white hover:scale-110`

**Upload Input**:
```tsx
<input
  type="file"
  accept="image/*"
  className="hidden"
  onChange={handleProfilePictureUpload}
/>
```

**Validation**:
- File type: Must be image (`image/*`)
- File size: Max 5MB
- Shows toast on error

**Text Info**:
- Name: `text-2xl font-bold`
- Designation: `text-white/90`
- Username: `text-sm text-white/70`

#### Personal Information Card
```
┌────────────────────────────────────────┐
│ 👤 Personal Information                │
├────────────────────────────────────────┤
│ Full Name           │ Username         │
│ JOLLY JOSEPH        │ kvpatm2.21160    │
│                     │                  │
│ Employee Code       │ Phone            │
│ 21160               │ 9999999999       │
│                     │                  │
│ Subject             │ Designation      │
│ Mathematics         │ TGT              │
└────────────────────────────────────────┘
```

**Grid**: 2-column (`grid grid-cols-2 gap-6`)

**Field Pairs**:
- Label: `text-sm text-muted-foreground`
- Value: `font-medium text-foreground`

**Read-only Fields**:
- Username, Employee Code, Designation, Subject
- Background: `bg-muted` (disabled appearance)

#### Edit Mode

**Toggle Button**:
```tsx
<Button onClick={() => setIsEditing(true)}>
  <Edit2 className="w-4 h-4 mr-2" />
  Edit Profile
</Button>
```

**When Editing**:
- Read-only fields remain disabled
- Name, Phone, Email become editable inputs
- Shows Save and Cancel buttons

**Save/Cancel Buttons**:
```tsx
<div className="flex gap-2">
  <Button onClick={handleSave}>
    <Save className="w-4 h-4 mr-2" />
    Save Changes
  </Button>
  <Button variant="outline" onClick={handleCancel}>
    <X className="w-4 h-4 mr-2" />
    Cancel
  </Button>
</div>
```

---

### 5. Timetable (TeacherTimetable)

**File**: `src/components/features/teacher/TeacherTimetable.tsx`

#### Purpose
View and edit weekly timetable, import/export CSV.

#### Card Header
```
┌────────────────────────────────────────┐
│ 📅 My Timetable                        │
│ Manage your weekly schedule below.     │
│                                        │
│ [Download CSV] [Upload CSV] [Edit]    │
└────────────────────────────────────────┘
```

**Icons**: Calendar, Download, Upload

**Action Buttons**:
- Download CSV: `variant="outline" size="sm"`
- Upload CSV: `variant="outline" size="sm"` with hidden input
- Edit/Save: Toggles between states

#### Timetable Table
```
┌───┬───┬───┬───┬───┬───┬───┬───┬───┐
│DAY│1ST│2ND│3RD│4TH│5TH│6TH│7TH│8TH│
├───┼───┼───┼───┼───┼───┼───┼───┼───┤
│Mon│10A│10B│-  │12A│-  │11B│10A│-  │
│Tue│11A│-  │10B│-  │12A│10A│-  │11B│
│Wed│-  │12A│10A│11B│10B│-  │-  │10A│
│Thu│10B│11A│-  │10A│-  │12A│11B│-  │
│Fri│12A│10A│11B│-  │10B│-  │11A│-  │
│Sat│11B│-  │10A│10B│12A│11A│-  │-  │
└───┴───┴───┴───┴───┴───┴───┴───┴───┘
```

**Table Styling**:
- Border: `border-collapse`
- Header: `bg-muted p-3 font-semibold text-sm`
- Day column: `bg-muted font-semibold text-primary`
- Cells: `border border-border p-1`

**Cell Dimensions**:
- Min width: `min-w-[120px]` (120px minimum)
- Padding: `p-1` (4px)

**Edit Mode**:
```tsx
{isEditing ? (
  <Input
    value={timetable[dayIndex][periodIndex]}
    onChange={(e) => handleCellChange(...)}
    className="w-full min-w-[100px] text-sm"
    placeholder="-"
  />
) : (
  <div className="p-2 text-sm text-center">
    {timetable[dayIndex][periodIndex] || '-'}
  </div>
)}
```

**Save Button**:
- Text changes: "Edit Timetable" → "Save Timetable"
- Calls API to update user timetable
- Shows success toast

#### CSV Import/Export

**Download**:
- Generates CSV with format: `Day,P1,P2,P3,...`
- Downloads as `{username}_timetable.csv`

**Upload**:
- Validates CSV has 6 rows, 8 columns
- Shows error if format invalid
- Updates timetable state on success

---

### 6. News (TeacherNews)

**File**: `src/components/features/teacher/TeacherNews.tsx`

#### Purpose
View school announcements and news.

#### Page Header
```
📰 School News & Announcements
```

**Icon**: Newspaper (`w-6 h-6 text-primary`)
**Title**: `text-2xl font-bold text-foreground`

#### News Item Card
```
┌────────────────────────────────────────┐
│ Important Notice Regarding Exams 1     │
│ [Announcement]          Oct 11, 2024   │
├────────────────────────────────────────┤
│ This is a placeholder for school news. │
│ The content here would typically come  │
│ from an admin announcement system.     │
└────────────────────────────────────────┘
```

**Card Layout**:
- Title: `text-lg` (18px)
- Category Badge: `inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full`
- Date: `text-sm text-muted-foreground`
- Description: `text-muted-foreground`

**Hover Effect**: `hover:shadow-md transition-shadow`

**Spacing**: `space-y-4` between cards

---

### 7. Settings (TeacherSettings)

**File**: `src/components/features/teacher/TeacherSettings.tsx`

#### Purpose
Change password and manage account settings.

#### Card
**Max Width**: `max-w-2xl` (672px)

#### Card Header
```
⚙️ Account Settings
```

**Icon**: Settings (`w-5 h-5 text-primary`)

#### Security Section
```
┌────────────────────────────────────────┐
│ Security                               │
├────────────────────────────────────────┤
│ Change Password                        │
│ [Input type="password"]                │
│                                        │
│ [Update Password]                      │
└────────────────────────────────────────┘
```

**Section Header**: `text-lg font-semibold mb-4`

**Password Input**:
- Type: `password`
- Placeholder: "New Password"
- No validation (for simplicity)

**Update Button**:
- Variant: `default`
- Validates input is not empty
- Shows success toast on update

---

## Components Reference

### UI Components

#### Button
**File**: `src/components/ui/button.tsx`

**Usage in Teacher Dashboard**:
```tsx
// Primary action
<Button variant="default">Submit Leave</Button>

// Secondary action
<Button variant="outline">Cancel</Button>

// Danger action
<Button variant="destructive">Delete</Button>

// With icon
<Button>
  <Send className="w-4 h-4 mr-2" />
  Send Request
</Button>

// Small size
<Button size="sm">Edit</Button>
```

#### Card
**File**: `src/components/ui/card.tsx`

**Common Pattern**:
```tsx
<Card>
  <CardHeader>
    <div className="flex items-center gap-2">
      <Icon className="w-5 h-5 text-primary" />
      <CardTitle>Title</CardTitle>
    </div>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

#### Input
**File**: `src/components/ui/input.tsx`

**Types Used**:
```tsx
// Text input
<Input placeholder="Enter name" />

// Date input
<Input type="date" value={date} onChange={...} />

// Password input
<Input type="password" placeholder="New password" />

// File input (hidden)
<input type="file" accept="image/*" className="hidden" />
```

#### Textarea
**File**: `src/components/ui/textarea.tsx`

**Usage**:
```tsx
<Textarea
  placeholder="Enter details"
  rows={4}
  value={value}
  onChange={onChange}
/>
```

**Styling**: Extends Input component with multi-line support

#### RadioGroup
**File**: `src/components/ui/radio-group.tsx`

**Pattern**:
```tsx
<RadioGroup value={type} onValueChange={setType}>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="FULL_DAY" id="full" />
    <Label htmlFor="full" className="cursor-pointer">
      Full Day
    </Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="PARTIAL_DAY" id="partial" />
    <Label htmlFor="partial" className="cursor-pointer">
      Partial / Half Day
    </Label>
  </div>
</RadioGroup>
```

#### Select
**File**: `src/components/ui/select.tsx`

**Pattern**:
```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select type" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="INTERCHANGE">
      Class Interchange
    </SelectItem>
    <SelectItem value="EXTRA_CLASS">
      Extra Class
    </SelectItem>
  </SelectContent>
</Select>
```

#### Toast
**File**: `src/components/ui/toast.tsx`

**Usage via Hook**:
```tsx
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

// Success toast
toast({
  title: 'Leave Submitted',
  description: 'Your leave has been submitted successfully.',
});

// Error toast
toast({
  title: 'Error',
  description: 'Failed to submit leave.',
  variant: 'destructive',
});
```

**Toast Variants**:
- Default: Informational (blue/gray)
- Destructive: Error (red)

---

## UI Elements Style Guide

### Avatar Component
```tsx
// With profile picture
{user.profilePicture ? (
  <img
    src={user.profilePicture}
    alt={user.name}
    className="w-10 h-10 rounded-full object-cover"
  />
) : (
  <div className="w-10 h-10 bg-primary/10 text-primary 
                  rounded-full flex items-center justify-center 
                  font-semibold">
    {getInitials(user.name)}
  </div>
)}
```

**Sizes**:
- Small: `w-8 h-8` (32px)
- Medium: `w-10 h-10` (40px)
- Large: `w-16 h-16` (64px)
- XL: `w-24 h-24` (96px)

### Status Badges
```tsx
// Pending
<span className="text-status-pending">PENDING</span>

// Approved
<span className="text-status-active">APPROVED</span>

// Rejected
<span className="text-status-absent">REJECTED</span>
```

**Colors**:
- Pending: `#f59e0b` (Amber)
- Active/Approved: `#10b981` (Green)
- Absent/Rejected: `#ef4444` (Red)

### Gradient Headers
```css
.gradient-primary {
  background: linear-gradient(135deg, 
    hsl(var(--primary)), 
    hsl(var(--primary) / 0.8)
  );
}
```

**Usage**: Welcome cards, profile headers

### Empty States
```tsx
<div className="text-center py-16 text-muted-foreground">
  <Icon className="w-16 h-16 mx-auto mb-4 opacity-50" />
  <p>No data found.</p>
</div>
```

**Pattern**:
- Large icon (64px) at 50% opacity
- Centered text
- Generous padding (64px top/bottom)

---

## Responsive Design

### Breakpoints
```css
/* Mobile */
@media (max-width: 768px) {
  .grid.md\\:grid-cols-2 {
    grid-template-columns: 1fr; /* Single column */
  }
  
  .sidebar {
    display: none; /* Hide sidebar on mobile */
  }
}

/* Tablet */
@media (min-width: 768px) {
  .grid.md\\:grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### Mobile Optimizations
- Sidebar becomes bottom navigation
- 2-column grids stack vertically
- Reduced padding/margins
- Touch-friendly button sizes (min 44×44px)

---

## Animations

### Fade In
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
```

**Used**: Page transitions, card appearances

### Hover Transitions
```css
.transition-colors {
  transition-property: background-color, color;
  transition-duration: 200ms;
}

.hover\\:bg-accent:hover {
  background-color: hsl(var(--accent));
}
```

---

## Accessibility

### Form Accessibility
```tsx
// Proper label association
<Label htmlFor="date">Date</Label>
<Input id="date" type="date" />

// Required fields
<Label>Full Name *</Label>
<Input required aria-required="true" />

// Error states
<Input aria-invalid={hasError} aria-describedby="error-msg" />
{hasError && <p id="error-msg" role="alert">{error}</p>}
```

### Keyboard Navigation
- Tab order follows visual flow
- All interactive elements keyboard accessible
- Escape key closes modals/dropdowns
- Enter key submits forms

### Screen Reader Support
```tsx
// Hidden text for screen readers
<span className="sr-only">Upload profile picture</span>

// ARIA labels for icon buttons
<button aria-label="Delete leave request">
  <Trash2 className="w-4 h-4" />
</button>

// Status announcements
<div role="status" aria-live="polite">
  Leave submitted successfully
</div>
```

---

## Data Flow

### Leave Submission Flow
```
User fills form → Validation → 
API call (addLeave) → Database insert → 
Reload leaves → Show toast → Clear form
```

### Profile Picture Upload Flow
```
User selects file → Validate type/size → 
Upload to Supabase Storage → Get public URL → 
Update user profile → Reload page → Show toast
```

### Timetable Edit Flow
```
Click Edit → Enable inputs → User edits cells → 
Click Save → Validate format → 
API call (updateUser) → Database update → 
Disable inputs → Show toast
```

---

## Performance

### Loading States
```tsx
{loading ? (
  <Button disabled>
    <Spinner className="w-4 h-4 mr-2" />
    Loading...
  </Button>
) : (
  <Button>Submit</Button>
)}
```

### Data Caching
- User data cached in memory
- Timetable cached after first load
- Profile picture cached by browser

### Optimizations
- Debounced inputs (search, autocomplete)
- Lazy loading for large lists
- Memoized expensive calculations

---

**Last Updated**: February 10, 2026  
**Version**: 2.0
