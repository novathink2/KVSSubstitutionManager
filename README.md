# KVS AI Substitution Manager

An intelligent school management web application designed for Kendriya Vidyalaya Sangathan (KVS) schools. It automates the creation of substitution timetables when teachers are absent using Google Gemini AI.

## Features

- **☁️ Cloud-Based**: Built on OnSpace Cloud (Supabase) for multi-user support and real-time data sync
- **🎯 Smart Substitution Algorithm**: Automatically generates optimal teacher substitutions with intelligent scoring
  - Prioritizes teachers already teaching the class
  - Subject expertise matching
  - Fair workload distribution
  - Respects designation levels (PRT/TGT/PGT)
- **👨‍🏫 Teacher Dashboard**: Manage leaves, view timetable, submit requests
- **👨‍💼 Admin Dashboard**: Create substitution plans, view history, manage teachers
- **📅 Timetable Management**: Individual and bulk CSV import/export
- **🔢 Smart Employee Code Generation**: Auto-generates unique codes for contractual teachers
- **💬 Real-time Chat Assistant**: AI-powered help system (optional)
- **📱 Responsive Design**: Works seamlessly on desktop and mobile
- **🖼️ Profile Pictures**: Upload and manage teacher profile photos
- **🔒 Secure**: Row-level security with Supabase

## Tech Stack

- React + TypeScript
- Tailwind CSS
- OnSpace Cloud (Supabase)
- Google Gemini AI
- Radix UI components

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Add your Google Gemini API key to `.env`
5. Run the development server: `npm run dev`

## Environment Variables

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=auto_configured_by_onspace
VITE_SUPABASE_ANON_KEY=auto_configured_by_onspace
```

Get your Gemini API key from: https://makersuite.google.com/app/apikey

## Database Schema

The application uses the following tables:
- **users**: Teacher and admin profiles with timetables
- **leaves**: Leave applications and history (with optional document attachments)
- **requests**: Teacher requests (interchange, extra class)
- **substitution_history**: Generated substitution plans
- **announcements**: School-wide announcements and circulars

Storage buckets:
- **profile-pictures**: Teacher profile photos (public, 5MB)
- **leave-documents**: Medical certificates and leave proof (private, 10MB)
- **school-documents**: Official circulars and forms (public, 10MB)
- **timetable-exports**: CSV backups of timetables (private, 5MB)
- **substitution-reports**: Generated plan reports (private, 10MB)

See [STORAGE_GUIDE.md](./STORAGE_GUIDE.md) for detailed storage architecture.

## Usage

### First Time Setup
1. Click "Get Started" on the landing page
2. Register as Admin with your school code (e.g., kvpatm2)
3. Login with the generated credentials
4. Add teachers via "Add Teacher" button

### Admin Features
- Create substitution plans by marking absent teachers
- View substitution history with date filtering
- Manage teacher requests (approve/reject)
- Add new teachers with complete profiles
- Auto-generate employee codes for contractual teachers
- Bulk timetable upload/download via CSV
- Real-time data synchronization

### Teacher Features
- Apply for leaves (full day or partial)
- View personal timetable (editable)
- Submit interchange/extra class requests
- Upload profile picture
- Update profile information
- View school announcements
- Track request status (pending/approved/rejected)

## Database Features

- **Multi-school support**: Each school has isolated data
- **Real-time updates**: Changes sync across all users
- **Secure access**: Row-level security policies
- **File storage**: Profile pictures stored in Supabase Storage
- **Scalable**: Cloud infrastructure handles growing data

## Smart Substitution Algorithm

The substitution algorithm uses intelligent scoring to:
- **Priority 1**: Assign teachers already teaching the class (100 points)
- **Priority 2**: Match subject expertise (50 points)
- **Priority 3**: Maintain designation compatibility (20-30 points)
- **Priority 4**: Prefer teachers familiar with the class (25 points)
- **Priority 5**: Distribute workload fairly (-10 points per period assigned)
- **Automatic**: Respects PRT/TGT/PGT designation rules
- **Transparent**: Clear reasoning for each assignment

See [SUBSTITUTION_ALGORITHM.md](./SUBSTITUTION_ALGORITHM.md) for detailed documentation.

## Contractual Teachers

The system automatically generates unique employee codes for contractual teachers:
- **Format**: `C + 8 digits` (e.g., C24015123)
- **When Adding**: Leave employee code field empty for auto-generation
- **Bulk Import**: Leave employee_code column empty in CSV
- **Benefits**: No manual code management, prevents duplicates, easy identification

See [CONTRACTUAL_TEACHERS.md](./CONTRACTUAL_TEACHERS.md) for complete documentation.

### Optional: AI Chat Assistant

Google Gemini AI is used for the chat assistant feature:
- Help users understand the application
- Answer questions about features
- Provide guidance on using the system

## Made By

Students of PM SHRI KV PATTOM-2

---

**Note**: This application requires OnSpace Cloud backend. The database schema is automatically created when you first run the application.
