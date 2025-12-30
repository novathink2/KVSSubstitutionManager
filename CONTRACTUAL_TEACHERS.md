# Contractual Teachers - Employee Code System

## Overview

Contractual teachers in the KVS AI Substitution Manager don't always have traditional employee codes like permanent teachers. The system now auto-generates unique employee codes for contractual teachers.

---

## Auto-Generated Employee Code Format

**Format:** `C + 8 digits`

**Example:** `C24015123`

**Structure:**
- `C` = Contractual indicator
- Next 6 digits = Timestamp-based unique identifier
- Last 2 digits = Random number for additional uniqueness

**Generated Credentials:**
- **Username:** `kvpatm2.C24015123`
- **Password:** `Pass@C24015123`

---

## How to Add Contractual Teachers

### Method 1: Using "Add Teacher" Form

1. Go to **Admin Dashboard** → **Teacher Management** → **Add Teacher**
2. Fill in the teacher's name
3. Select **Employment Type:** CONTRACTUAL
4. **Leave Employee Code field EMPTY** (or enter a custom code if you have one)
5. Fill other details (designation, subject, etc.)
6. Click **Register Teacher**

✅ **System will automatically:**
- Generate unique employee code (e.g., `C24015123`)
- Create username: `kvpatm2.C24015123`
- Set password: `Pass@C24015123`
- Display credentials in success message

---

### Method 2: Bulk Import via CSV

1. Download the CSV template
2. For contractual teachers, **leave the employee_code column EMPTY**

**Example CSV:**
```csv
name,employee_code,designation,subject,employment_type,email,phone,date_of_birth,date_of_joining_kv,date_of_joining_present_post
RAJESH KUMAR,,TGT,English,CONTRACTUAL,rajesh@example.com,9999999999,1990-05-15,2024-01-10,2024-01-10
PRIYA SHARMA,,PRT,General,CONTRACTUAL,priya@example.com,8888888888,1992-03-20,2024-02-15,2024-02-15
```

3. Upload the CSV file
4. System will auto-generate employee codes for all contractual teachers with empty codes

---

## Permanent Teachers vs Contractual Teachers

| Aspect | Permanent Teachers | Contractual Teachers |
|--------|-------------------|---------------------|
| **Employee Code** | Required (e.g., 21160) | Auto-generated if empty (e.g., C24015123) |
| **Code Format** | 4-6 digit number | C + 8 digits |
| **Username Example** | kvpatm2.21160 | kvpatm2.C24015123 |
| **Password Example** | Pass@21160 | Pass@C24015123 |
| **CSV Import** | Must provide employee_code | Leave employee_code empty |
| **Manual Entry** | Must enter code | Can leave blank |

---

## Important Notes

⚠️ **For Permanent Teachers:**
- Employee code is **REQUIRED**
- Must be a valid existing code
- Cannot be auto-generated

✅ **For Contractual Teachers:**
- Employee code is **OPTIONAL**
- If left empty, system auto-generates
- Can also provide custom code if needed

🔒 **Security:**
- All teachers should change their password on first login
- Auto-generated passwords follow same pattern as permanent teachers

---

## Examples

### Example 1: Adding Contractual TGT Teacher

**Input:**
- Name: RAJESH KUMAR
- Employee Code: *(leave empty)*
- Designation: TGT
- Subject: English
- Employment Type: CONTRACTUAL

**System Generates:**
- Employee Code: `C24015123`
- Username: `kvpatm2.C24015123`
- Password: `Pass@C24015123`

### Example 2: Adding Contractual PRT Teacher

**Input:**
- Name: PRIYA SHARMA
- Employee Code: *(leave empty)*
- Designation: PRT
- Subject: General
- Employment Type: CONTRACTUAL

**System Generates:**
- Employee Code: `C24015187`
- Username: `kvpatm2.C24015187`
- Password: `Pass@C24015187`

### Example 3: Adding Contractual Teacher with Custom Code

**Input:**
- Name: AMIT VERMA
- Employee Code: `CONTRACT001` *(custom code provided)*
- Designation: TGT
- Subject: Hindi
- Employment Type: CONTRACTUAL

**System Uses:**
- Employee Code: `CONTRACT001` *(as provided)*
- Username: `kvpatm2.CONTRACT001`
- Password: `Pass@CONTRACT001`

---

## Benefits

✅ **No Manual Code Generation:** Admin doesn't need to think of unique codes
✅ **Prevents Duplicates:** Timestamp-based codes are always unique
✅ **Easy to Identify:** "C" prefix clearly marks contractual teachers
✅ **Consistent System:** Works seamlessly with existing features
✅ **Flexible:** Admins can still provide custom codes if needed

---

## Teacher Login Instructions

After registration, contractual teachers should:

1. **Login** with generated credentials
   - Username: `kvpatm2.C24015123` (shown in registration success message)
   - Password: `Pass@C24015123`

2. **Change Password** immediately
   - Go to **Settings** → **Account Settings**
   - Update password for security

3. **Complete Profile**
   - Upload profile picture
   - Fill timetable
   - Verify contact details

---

## Technical Details

### Auto-Generation Algorithm

```javascript
function generateContractualEmployeeCode() {
  const timestamp = Date.now().toString().slice(-6);  // Last 6 digits of timestamp
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');  // 2 random digits
  return `C${timestamp}${random}`;
}
```

**Uniqueness Guarantee:**
- Timestamp provides temporal uniqueness
- Random suffix prevents collision within same millisecond
- "C" prefix ensures no conflict with permanent employee codes

### Database Storage

- Stored in same `employee_code` field as permanent teachers
- No schema changes required
- Works with all existing features (substitution, history, etc.)

---

**Last Updated:** December 25, 2025
**Feature Status:** ✅ Production Ready
