# Admin Dashboard - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Dashboard Layout](#dashboard-layout)
3. [Pages Documentation](#pages-documentation)
4. [Components Reference](#components-reference)
5. [UI Elements Style Guide](#ui-elements-style-guide)

---

## Overview

The Admin Dashboard is the central hub for school administrators to manage teachers, create substitution plans, review requests, and maintain the system.

**File**: `src/pages/AdminDashboard.tsx`

### Key Features
- ✅ Substitution plan creation with smart algorithm
- ✅ Teacher management (add, view, delete)
- ✅ Bulk teacher import via CSV
- ✅ Request approval/rejection system
- ✅ Timetable bulk management
- ✅ Substitution history tracking
- ✅ Profile management with picture upload

---

## Dashboard Layout

### Structure
```
┌─────────────────────────────────────────────┐
│          Navbar (Top Header)                │
├─────────────────────────────────────────────┤
│  Admin Dashboard                            │
│  Manage absences, substitutions, and view   │
│  history.                                   │
├─────────────────────────────────────────────┤
│  [New Plan] [History] [Requests]            │
│  [Manage Teachers] [Add Teacher]            │
│  [Bulk Import] [Bulk Timetable] [Profile]  │
├─────────────────────────────────────────────┤
│                                             │
│         Active Content Area                 │
│                                             │
└─────────────────────────────────────────────┘
│           Footer                            │
└─────────────────────────────────────────────┘
```

### Color Scheme
- **Background**: `bg-muted/30` (Light gray with opacity)
- **Container**: `max-w-7xl` (Maximum width constraint)
- **Padding**: `p-6` (24px all sides)

### Header Section
```tsx
<h1 className="text-3xl font-bold text-foreground">
  Admin Dashboard
</h1>
<p className="text-muted-foreground">
  Manage absences, substitutions, and view history.
</p>
```

**Styles**:
- Title: 48px font size, bold weight
- Subtitle: Default size, muted color

### Action Buttons
**Layout**: Flexbox with wrapping
**Spacing**: `gap-3` (12px between buttons)

**Button States**:
- Active: `variant="default"` (Primary color background)
- Inactive: `variant="outline"` (Border with transparent background)

---

## Pages Documentation

### 1. New Plan (AdminCreatePlan)

**File**: `src/components/features/admin/AdminCreatePlan.tsx`

#### Purpose
Create substitution plans by marking absent teachers and automatically generating substitute assignments.

#### Layout
**Grid**: 2-column layout (`grid md:grid-cols-2 gap-6`)

**Left Column**:
- Date selection card
- Absence marking card with filters

**Right Column**:
- Generated substitution plan display

#### Components

##### A. Date Selection Card
```tsx
<Card>
  <CardHeader>
    <Calendar icon /> Select Date
  </CardHeader>
  <CardContent>
    <Input type="date" />
    <p>{Day Name}</p>
  </CardContent>
</Card>
```

**Fields**:
- **Input Type**: Date picker
- **Display**: Shows day name (e.g., "Monday")
- **Validation**: Cannot select Sundays

##### B. Mark Absences Card
**Filter Buttons**:
- PGT, TGT, PRT, OTHER, All
- **Active Style**: `variant="default"` (primary color)
- **Inactive Style**: `variant="outline"` (bordered)

**Teacher List**:
```
┌────────────────────────────────────────┐
│ [Avatar] PADMAJA M G                   │
│          PGT • Physics                 │
│                         [●] ☑           │
├────────────────────────────────────────┤
│   [Input: Reason for absence]         │
└────────────────────────────────────────┘
```

**Components**:
- **Avatar**: 40×40px circle with initials
  - Background: `bg-primary/10`
  - Text: `text-primary`
- **Status Dot**: 
  - Absent: Red (`status-dot-absent`)
  - Active: Green (`status-dot-active`)
- **Checkbox**: 20×20px standard checkbox

**Reason Input** (shown when checked):
- **Type**: Text input
- **Placeholder**: "Reason for absence"
- **Margin**: `ml-13` (left margin to align with name)

##### C. Generate Button
```tsx
<Button onClick={handleGenerate} disabled={...}>
  <Zap icon /> Generate Substitutions
</Button>
```

**States**:
- Normal: "Generate Substitutions"
- Loading: "Generating Smart Substitutions..."
- Disabled: When no absences marked or already generating

#### Results Display (Right Column)

##### Empty State
```
┌────────────────────────────────────────┐
│          📥 (Inbox icon)               │
│  Select a date and mark absent         │
│  teachers to generate a plan.          │
└────────────────────────────────────────┘
```

##### Generated Plan
For each absent teacher:

```
┌────────────────────────────────────────┐
│ [Avatar] PADMAJA M G                   │
│          Medical Leave                 │
├────────────────────────────────────────┤
│ ┌────────────────────────────────────┐ │
│ │ Period 1 - 10A        [Assigned]   │ │
│ │ → RAJESH KUMAR                     │ │
│ │ • Already teaches 10A (priority)   │ │
│ └────────────────────────────────────┘ │
│ ┌────────────────────────────────────┐ │
│ │ Period 3 - 12B        [Unassigned] │ │
│ │ No substitute available            │ │
│ │ • All teachers occupied/absent     │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

**Substitution Card Styles**:
- **Container**: `p-3 bg-muted/50 rounded-lg border-l-4 border-primary`
- **Assigned Badge**: `bg-green-500/10 text-green-600` 
- **Unassigned Badge**: `bg-amber-500/10 text-amber-600`
- **Substitute Name**: `text-primary font-medium`
- **Reason**: `text-xs text-muted-foreground`

---

### 2. History (AdminHistory)

**File**: `src/components/features/admin/AdminHistory.tsx`

#### Purpose
View past substitution plans with date filtering.

#### Components

##### Date Range Filter
```tsx
<div className="flex gap-2">
  <Input type="date" placeholder="Start Date" />
  <span>-</span>
  <Input type="date" placeholder="End Date" />
</div>
```

**Styling**:
- Width: `w-40` (160px each)
- Separator: Flexbox centered dash

##### History Table
```
┌──────────┬────────────────┬──────────────┬──────────────────┐
│ DATE     │ ABSENT TEACHER │ REASON/NOTE  │ SUBSTITUTIONS    │
├──────────┼────────────────┼──────────────┼──────────────────┤
│ Oct 11   │ PADMAJA M G    │ Medical      │ P1: RAJESH       │
│          │                │              │ P3: PRIYA        │
│          │                │              │ +2 more          │
└──────────┴────────────────┴──────────────┴──────────────────┘
```

**Table Styles**:
- **Header**: `font-semibold text-sm`, `border-b`
- **Rows**: `hover:bg-accent/50 transition-colors`
- **Borders**: `border-collapse` with `border-border`
- **Cell Padding**: `p-3`

**Substitution Preview**:
- Shows first 2 substitutions
- "+" count for remaining (e.g., "+2 more")
- Format: `P{period}: {Teacher Name}`

##### Empty State
```
┌────────────────────────────────────────┐
│    No history found.                   │
└────────────────────────────────────────┘
```
- **Style**: `text-center text-muted-foreground py-8`

---

### 3. Requests (AdminRequests)

**File**: `src/components/features/admin/AdminRequests.tsx`

#### Purpose
Review and respond to teacher requests (class interchange, extra class).

#### Request Card
```
┌────────────────────────────────────────┐
│ RAJESH KUMAR                           │
│ Class Interchange                      │
│ Oct 15, 2024                           │
├────────────────────────────────────────┤
│ "Can I swap my 3rd period with Mrs. X?"│
├────────────────────────────────────────┤
│ [Approve ✓]  [Reject ✗]               │
└────────────────────────────────────────┘
```

**Card Styling**:
- **Container**: `p-4 border border-border rounded-lg`
- **Hover**: `hover:bg-accent/50 transition-colors`

**Request Types**:
- **Class Interchange**: Shown as badge
- **Extra Class**: Shown as badge

**Action Buttons**:
- **Approve**: 
  - Size: `sm`
  - Color: `bg-status-active text-white`
  - Hover: `hover:bg-status-active/90`
- **Reject**:
  - Size: `sm`
  - Variant: `destructive`

**Empty State**:
```
No requests found.
```
- **Style**: `text-center text-muted-foreground py-8`

---

### 4. Manage Teachers (TeacherManagement)

**File**: `src/components/features/admin/TeacherManagement.tsx`

#### Purpose
View all teachers, see details, delete teachers.

#### Layout
**Grid**: 2-column (`grid md:grid-cols-2 gap-6`)

**Left Column**: Teacher list with search
**Right Column**: Selected teacher details

#### Teacher List (Left)

##### Search Bar
```
┌────────────────────────────────────────┐
│ 🔍 Search by name, username, or        │
│    subject...                          │
└────────────────────────────────────────┘
```

**Styling**:
- Icon: `absolute left-3 top-1/2 -translate-y-1/2`
- Input: `pl-10` (padding for icon)
- Border: `border-border`, focus ring: `focus:ring-2 focus:ring-primary`

##### Teacher Card
```
┌────────────────────────────────────────┐
│ [📷] PADMAJA M G            [👁] [🗑]  │
│      PGT • Physics                     │
│      kvpatm2.21160                     │
└────────────────────────────────────────┘
```

**Components**:
- **Profile Picture**: 40×40px circular
  - Fallback: Initials in circle
- **Name**: `font-semibold text-foreground`
- **Details**: `text-xs text-muted-foreground`
- **View Button**: Eye icon, `border border-border`
- **Delete Button**: Trash icon, `bg-destructive`

**Selected State**:
- Background: `bg-primary/10`
- Border: `border-primary`

#### Teacher Details (Right)

##### Empty State
```
┌────────────────────────────────────────┐
│          👁 (Eye icon, large)          │
│   Select a teacher to view details     │
└────────────────────────────────────────┘
```

##### Profile Section
```
┌────────────────────────────────────────┐
│ Teacher Profile                    [✗] │
├────────────────────────────────────────┤
│ [📷]  PADMAJA M G                      │
│       PGT • Physics                    │
├────────────────────────────────────────┤
│ Username      │ Email                  │
│ kvpatm2.21160 │ padmaja@kvs.ac.in     │
│               │                        │
│ Phone         │ Employee Code          │
│ 9999999999    │ 21160                 │
└────────────────────────────────────────┘
```

**Grid**: 2-column layout for fields
**Style**: `text-sm` with label/value pairs

##### Timetable Section
**Table**: 8-column (periods) × 6-row (days)

```
┌───┬───┬───┬───┬───┬───┬───┬───┐
│Mon│ P1│ P2│ P3│ P4│ P5│ P6│ P7│ P8│
├───┼───┼───┼───┼───┼───┼───┼───┤
│10A│10B│-  │12A│-  │11B│10A│-  │
└───┴───┴───┴───┴───┴───┴───┴───┘
```

**Cell Styles**:
- **Filled**: `bg-primary/10`
- **Empty**: `bg-muted/50`
- **Text**: `text-xs`
- **Padding**: `p-1`

##### Absence History Section

**Chart**: Bar chart (using Recharts)
- **Type**: Monthly absence count
- **Height**: 200px
- **Color**: `hsl(var(--primary))`

**List View**:
```
┌────────────────────────────────────────┐
│ Oct 15, 2024              [Full Day]   │
│ Medical Leave                          │
└────────────────────────────────────────┘
```

**Badge Colors**:
- **Full Day**: `bg-destructive/10 text-destructive`
- **Partial**: `bg-yellow-500/10 text-yellow-600`

---

### 5. Add Teacher (AdminAddTeacher)

**File**: `src/components/features/admin/AdminAddTeacher.tsx`

#### Purpose
Add individual teachers with complete profile information.

#### Form Layout
**Grid**: 2-column responsive (`grid md:grid-cols-2 gap-4`)

#### Info Banner
```
┌────────────────────────────────────────┐
│ ℹ Note: Username will be auto-         │
│   generated as kvpatm2.[EmployeeCode]  │
│                                        │
│ ℹ Contractual Teachers: Leave code     │
│   empty - auto-generated (C+8 digits)  │
└────────────────────────────────────────┘
```

**Styling**:
- Background: `bg-primary/10`
- Border: `border-primary/20`
- Text: `text-sm text-primary`

#### Form Fields

##### Full Name (Required)
```tsx
<Label>Full Name *</Label>
<Input id="name" />
```

##### Employee Code
```tsx
<Label>
  Employee Code 
  {employmentType === 'PERMANENT' ? ' *' : ' (Auto-generated if empty)'}
</Label>
<Input 
  placeholder="e.g., 21160" 
  // or for contractual:
  placeholder="Leave empty for auto-generation"
/>
```

**Helper Text** (for contractual):
```
Auto-generated format: C24015123
```
- Style: `text-xs text-muted-foreground`

##### Designation Type (Dropdown)
**Options**:
- PGT (Post Graduate Teacher)
- TGT (Trained Graduate Teacher)
- PRT (Primary Teacher)
- OTHER

**Component**: `<Select>` with `<SelectItem>`

##### Subject (Dropdown)
**Dynamic based on designation**:

**PGT Subjects**:
- Physics, Chemistry, Mathematics, Biology
- English, Hindi, Commerce, Economics
- Computer Science, Accountancy, Business Studies
- Political Science, History, Geography, Civics, Music

**TGT Subjects**:
- English, Hindi, Mathematics, Science, Biology
- Social Science, History, Geography, Civics
- Sanskrit, Urdu, Punjabi, Bengali, Work Education

**PRT Subjects**:
- General

**OTHER**:
- Physical Education, Art Education, Music
- Dance, Yoga, Librarian, Counselor, Work Education

##### Employment Type
**Options**:
- Permanent
- Contractual

**Default**: Permanent

##### Email (Optional)
```tsx
<Input 
  type="email" 
  placeholder="Optional (auto-generated if empty)"
/>
```

##### Phone, Dates (Optional)
- **Phone**: Standard input
- **Date of Birth**: Date picker
- **Date of Joining KV**: Date picker
- **Date of Joining Present Post**: Date picker

#### Submit Button
```tsx
<Button onClick={handleRegister} className="w-full">
  {loading ? 'Registering...' : 'Register Teacher'}
</Button>
```

**States**:
- Normal: Full width, primary color
- Loading: Shows "Registering..." with disabled state

#### Success Behavior
- Form resets
- Toast notification shows username

---

### 6. Bulk Import (BulkTeacherImport)

**File**: `src/components/features/admin/BulkTeacherImport.tsx`

#### Purpose
Import multiple teachers at once via CSV file.

#### Info Box
```
┌────────────────────────────────────────┐
│ CSV Format Instructions:               │
│ • Download template and fill details   │
│ • Required: name, designation          │
│ • Employee Code: Required for          │
│   PERMANENT, leave empty for           │
│   CONTRACTUAL (auto-generated)         │
│ • Designation: PGT, TGT, PRT, OTHER   │
│ • Employment: PERMANENT or CONTRACTUAL │
│ • Usernames: auto-generated            │
│ • Passwords: Pass@[employee_code]     │
└────────────────────────────────────────┘
```

**Styling**:
- Background: `bg-primary/10`
- Border: `border-primary/20`
- List: `list-disc list-inside`

#### Action Buttons
```
[Download Template 📥]  [Upload CSV 📤]
```

**Layout**: Flex with equal width (`flex-1`)

**Download Button**:
- Variant: `outline`
- Icon: `Download`

**Upload Button**:
- Variant: `default`
- Icon: `Upload`
- Hidden file input: `<input type="file" accept=".csv" className="hidden" />`

#### Example Rows
```
Permanent Teacher (with employee code):
PADMAJA M G,21160,PGT,Physics,PERMANENT,...

Contractual Teacher (leave code empty):
RAJESH KUMAR,,TGT,English,CONTRACTUAL,...
```

**Styling**:
- Background: `bg-muted`
- Font: `text-xs font-mono`
- Padding: `p-2`
- Overflow: `overflow-x-auto`

---

### 7. Bulk Timetable (AdminBulkTimetable)

**File**: `src/components/features/admin/AdminBulkTimetable.tsx`

#### Purpose
Download all teachers' timetables, edit in Excel, and re-upload.

#### Description
```
Download the timetable for all teachers, 
edit it in Excel/Sheets, and re-upload to 
update everyone at once.
```

**Style**: `text-muted-foreground`

#### Buttons
```
[Download Master CSV 📥]  [Upload Master CSV 📤]
```

**Layout**: Flex with gap (`flex gap-4`)

#### Instructions Box
```
┌────────────────────────────────────────┐
│ CSV Format Instructions:               │
│ • Don't change EmployeeCode or Name    │
│ • Each column = Period (Mon_1, Mon_2)  │
│ • Enter Class Name (10A, 12B Physical) │
│ • Leave empty for free periods         │
└────────────────────────────────────────┘
```

**Styling**:
- Background: `bg-muted`
- Padding: `p-4`
- Border radius: `rounded-lg`

---

### 8. My Profile (AdminProfile)

**File**: `src/components/features/admin/AdminProfile.tsx`

#### Purpose
View and edit admin profile information.

#### Layout
**Stack**: Vertical cards (`space-y-6`)

#### Header Card
**Style**: `gradient-primary text-white`

```
┌────────────────────────────────────────┐
│ [📷]  PADMAJA M G                      │
│       Administrator                     │
│       [Username: kvpatm2.21160]        │
│       [School: KVPATM2]        [Edit]  │
└────────────────────────────────────────┘
```

**Profile Picture**:
- Size: 96×96px (`w-24 h-24`)
- Border: `border-4 border-white`
- Shadow: `shadow-lg`
- Upload button overlay (camera icon)

**Edit/Save Buttons**:
- Edit: `variant="secondary"` with Edit2 icon
- Save: `variant="secondary"` with Save icon
- Cancel: `variant="outline"` with X icon

#### Personal Information Card
```
┌────────────────────────────────────────┐
│ 👤 Personal Information                │
├────────────────────────────────────────┤
│ Full Name       │ Email                │
│ [Input]         │ [Input]              │
│                 │                      │
│ Phone           │ Employee Code        │
│ [Input]         │ [Disabled]           │
│                 │                      │
│ Date of Birth   │ Date of Joining KV   │
│ [Date]          │ [Date]               │
└────────────────────────────────────────┘
```

**Grid**: 2-column (`grid md:grid-cols-2 gap-6`)

**Field States**:
- **Editable**: Normal input styling
- **Disabled**: `disabled` prop, `bg-muted` background
- **Read-only**: `disabled={!isEditing}`

#### Security Card
```
┌────────────────────────────────────────┐
│ Security                               │
├────────────────────────────────────────┤
│ Change Password                        │
│ [Input type="password"]                │
│                                        │
│ ℹ Leave blank to keep current password│
└────────────────────────────────────────┘
```

**Helper Text**: Only shown in edit mode
- Style: `text-sm text-muted-foreground`

---

## Components Reference

### UI Components

#### Button
**File**: `src/components/ui/button.tsx`

**Variants**:
```tsx
variant="default"      // Primary color background
variant="destructive"  // Red/danger background
variant="outline"      // Border with transparent bg
variant="secondary"    // Secondary color background
variant="ghost"        // No background, hover effect
variant="link"         // Underlined text link style
```

**Sizes**:
```tsx
size="default"  // h-10 px-4 py-2 (40px height)
size="sm"       // h-9 px-3 (36px height)
size="lg"       // h-11 px-8 (44px height)
size="icon"     // h-10 w-10 (square)
```

**Examples**:
```tsx
<Button variant="default" size="sm">
  Click Me
</Button>

<Button variant="outline" disabled>
  Disabled
</Button>

<Button variant="destructive" size="lg">
  <Trash2 className="w-4 h-4 mr-2" />
  Delete
</Button>
```

#### Card
**File**: `src/components/ui/card.tsx`

**Components**:
- `<Card>`: Container
- `<CardHeader>`: Top section
- `<CardTitle>`: Title text
- `<CardDescription>`: Subtitle text
- `<CardContent>`: Main content area
- `<CardFooter>`: Bottom section

**Styling**:
```tsx
Card         // rounded-lg border shadow-sm
CardHeader   // p-6 space-y-1.5
CardTitle    // text-2xl font-semibold
CardContent  // p-6 pt-0
```

**Example**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title Here</CardTitle>
    <CardDescription>Optional subtitle</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

#### Input
**File**: `src/components/ui/input.tsx`

**Types**:
- `text` (default)
- `email`
- `password`
- `date`
- `number`
- `file`

**Styling**:
```css
h-10 w-full rounded-md border border-input
bg-background px-3 py-2 text-sm
focus:ring-2 focus:ring-ring
disabled:opacity-50 disabled:cursor-not-allowed
```

**Examples**:
```tsx
<Input placeholder="Enter name" />
<Input type="email" disabled />
<Input type="date" value={date} onChange={...} />
```

#### Select
**File**: `src/components/ui/select.tsx`

**Components**:
- `<Select>`: Wrapper
- `<SelectTrigger>`: Button that opens dropdown
- `<SelectValue>`: Selected value display
- `<SelectContent>`: Dropdown content
- `<SelectItem>`: Individual option

**Example**:
```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Choose..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

#### Label
**File**: `src/components/ui/label.tsx`

**Usage**:
```tsx
<Label htmlFor="name">Full Name</Label>
<Input id="name" />
```

**Styling**: `text-sm font-medium`

---

## UI Elements Style Guide

### Colors

#### Status Colors
```css
/* Active/Available */
.status-dot-active {
  background: #10b981; /* Green */
}

/* Absent/Unavailable */
.status-dot-absent {
  background: #ef4444; /* Red */
}

/* Pending */
.status-dot-pending {
  background: #f59e0b; /* Amber */
}
```

#### Background Colors
```css
/* Primary gradient (headers) */
.gradient-primary {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
}

/* Muted background */
bg-muted/30       /* Light gray with 30% opacity */
bg-accent/50      /* Accent color with 50% opacity */
bg-primary/10     /* Primary color with 10% opacity */
```

### Typography

#### Headings
```css
text-3xl font-bold         /* Dashboard title (48px) */
text-2xl font-semibold     /* Card titles (32px) */
text-lg font-semibold      /* Section headers (18px) */
text-sm font-medium        /* Labels (14px) */
text-xs                    /* Helper text (12px) */
```

#### Text Colors
```css
text-foreground            /* Primary text */
text-muted-foreground      /* Secondary text */
text-primary               /* Accent/brand color */
text-destructive           /* Error/danger text */
```

### Spacing

#### Padding
```css
p-2    /* 8px */
p-3    /* 12px */
p-4    /* 16px */
p-6    /* 24px */
```

#### Gaps
```css
gap-2  /* 8px */
gap-3  /* 12px */
gap-4  /* 16px */
gap-6  /* 24px */
```

#### Margins
```css
mb-2   /* margin-bottom: 8px */
mb-4   /* margin-bottom: 16px */
mb-6   /* margin-bottom: 24px */
mt-4   /* margin-top: 16px */
```

### Borders
```css
border              /* 1px solid */
border-2            /* 2px solid */
border-4            /* 4px solid */
border-border       /* Default border color */
border-primary      /* Brand color border */
border-l-4          /* Left border 4px */
rounded-lg          /* 8px border radius */
rounded-full        /* 9999px (perfect circle) */
```

### Shadows
```css
shadow-sm          /* Subtle shadow */
shadow-md          /* Medium shadow */
shadow-lg          /* Large shadow */
shadow-xl          /* Extra large shadow */
```

### Transitions
```css
transition-colors  /* Smooth color changes */
transition-all     /* All properties transition */
hover:bg-accent    /* Background on hover */
hover:scale-110    /* Scale up on hover */
```

---

## Accessibility

### Keyboard Navigation
- All buttons are keyboard accessible (Tab/Enter)
- Form inputs support Tab navigation
- Modal dialogs trap focus

### ARIA Labels
- Buttons have descriptive labels
- Form fields linked to labels via `htmlFor`
- Status indicators have aria-live regions

### Screen Reader Support
- Semantic HTML (`<button>`, `<input>`, `<label>`)
- Descriptive alt text for images
- Proper heading hierarchy

---

## Performance Optimizations

### Loading States
- All async operations show loading indicators
- Buttons disable during processing
- Skeleton screens for data loading

### Data Fetching
- Debounced search inputs
- Cached API responses
- Lazy loading for large lists

---

**Last Updated**: February 10, 2026  
**Version**: 2.0
