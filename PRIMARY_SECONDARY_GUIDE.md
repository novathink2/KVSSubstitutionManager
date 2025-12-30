# Primary-Secondary Substitution System Guide

## Overview

The KVS AI Substitution Manager now implements strict separation between **Primary** and **Secondary** education levels to comply with teacher qualification and training standards.

---

## 🎯 Class Level Classification

### Primary Classes (1-5)
- **Classes**: 1, 2, 3, 4, 5 (with sections A, B, C, etc.)
- **Designated Teachers**: **PRT (Primary Teacher)** only
- **Subjects**: General education (all subjects taught by one teacher)
- **Example Classes**: 1A, 2B, 3C, 4A, 5B

### Secondary Classes (6-12)
- **Classes**: 6, 7, 8, 9, 10, 11, 12 (with sections)
- **Designated Teachers**: **TGT (Trained Graduate Teacher)** and **PGT (Post Graduate Teacher)**
- **Subjects**: Specialized subject teachers
- **Example Classes**: 6A, 7B, 8C, 9A, 10B, 11A, 12B

---

## 🔒 Substitution Rules

### Rule 1: Level Restriction
**Primary classes can ONLY be substituted by PRT teachers**
- ❌ TGT/PGT cannot teach primary classes
- ✅ Only PRT can substitute for another PRT

**Secondary classes can ONLY be substituted by TGT/PGT teachers**
- ❌ PRT cannot teach secondary classes
- ✅ TGT can substitute for PGT and vice versa

### Rule 2: Inter-designation Substitution (Secondary Only)
- TGT and PGT are **interchangeable** for secondary classes
- Example: A TGT Math teacher can substitute for an absent PGT Physics teacher in Class 10
- Priority given to subject match when available

### Rule 3: Subject Priority (Secondary)
For secondary classes, AI prioritizes:
1. **Same Subject Expert**: Math teacher for Math class
2. **Class Teacher**: Teacher who regularly teaches that section
3. **Any TGT/PGT**: Available teacher from secondary pool
4. **Workload Balance**: Distribute substitutions evenly

### Rule 4: Subject Generalization (Primary)
For primary classes:
- All PRT teachers are considered equally qualified
- No subject specialization required
- Priority given to teachers already teaching that section

---

## 🤖 AI Logic Implementation

### Class Detection
```typescript
// Automatically detects class level from class name
isPrimaryClass("3A") → true
isPrimaryClass("10B") → false
isSecondaryClass("9A") → true
```

### Teacher Eligibility Check
```typescript
canTeachClass("PRT", "2A") → true
canTeachClass("PRT", "10A") → false
canTeachClass("TGT", "7B") → true
canTeachClass("PGT", "12A") → true
canTeachClass("TGT", "3A") → false
```

### Filtering Logic
When generating substitutions:
1. **Identify absent teacher's designation** (PRT/TGT/PGT)
2. **Extract class numbers** from their timetable (e.g., "5A" → class 5)
3. **Filter available teachers**:
   - For classes 1-5: Only include PRT teachers
   - For classes 6-12: Only include TGT and PGT teachers
4. **AI generates optimal assignments** within the filtered pool

---

## 📊 Example Scenarios

### Scenario 1: PRT Teacher Absent
**Absent**: Mrs. Rita Mathews (PRT)  
**Classes**: 2A (all periods)  
**Available Substitutes**: Only other PRT teachers

**AI Output**:
```
Period 1, 2A → Mr. Ashish Yadav (PRT) - "Available and experienced with Class 2"
Period 2, 2A → Ms. Pooja Singh (PRT) - "Available for this period"
```

### Scenario 2: TGT Teacher Absent
**Absent**: Mr. Jolly Joseph (TGT - Social Studies)  
**Classes**: 8A, 9B, 10A  
**Available Substitutes**: TGT and PGT teachers (NOT PRT)

**AI Output**:
```
Period 1, 8A SST → Ms. Laxmi M Prayaga (TGT - SST) - "Same subject expert"
Period 3, 9B SST → Mr. Bromly Thomas (PGT - Chemistry) - "Available, TGT/PGT interchangeable"
Period 5, 10A SST → Ms. Laxmi M Prayaga (TGT - SST) - "Same subject, already substituting"
```

### Scenario 3: PGT Teacher Absent
**Absent**: Ms. Padmaja M G (PGT - Physics)  
**Classes**: 11A, 12B  
**Available Substitutes**: TGT and PGT teachers (NOT PRT)

**AI Output**:
```
Period 2, 11A Physics → Mr. T L Bindu (PGT - Physics) - "Same subject expert"
Period 4, 12B Physics → Ms. Jayasree Sreekumar (TGT - Maths) - "Available, TGT can teach senior secondary"
```

### Scenario 4: Mixed Level Teacher (Invalid - Won't Happen)
The system **prevents** a single teacher from having both primary and secondary classes in their timetable.

---

## 🚫 What the System Prevents

### Invalid Substitutions Blocked:
1. ❌ PRT teacher assigned to Class 10 Math
2. ❌ TGT teacher assigned to Class 2 EVS
3. ❌ PGT teacher assigned to Class 4 English
4. ❌ Cross-level assignments

### Valid Substitutions Allowed:
1. ✅ PRT → PRT for Classes 1-5
2. ✅ TGT → TGT for Classes 6-12
3. ✅ PGT → PGT for Classes 6-12
4. ✅ TGT → PGT for Classes 6-12
5. ✅ PGT → TGT for Classes 6-12

---

## 🎓 Educational Rationale

### Why This Separation?

**Pedagogical Training**:
- PRT teachers are trained in **child psychology** and **primary education methods**
- TGT teachers are trained in **subject specialization** for middle/secondary
- PGT teachers have **advanced subject knowledge** for senior secondary

**Curriculum Complexity**:
- Primary (1-5): Foundational skills, play-based learning
- Secondary (6-12): Subject depth, board exam preparation

**KVS Standards**:
- Follows Kendriya Vidyalaya recruitment and posting norms
- Maintains teacher qualification compliance
- Ensures quality education delivery

---

## 🔍 Testing the System

### Test Case 1: PRT Absence
1. Login as Admin
2. Create plan for any date
3. Mark a PRT teacher as absent
4. Generate substitutions
5. **Verify**: Only PRT teachers are assigned

### Test Case 2: TGT Absence
1. Mark a TGT teacher as absent
2. Generate substitutions
3. **Verify**: Only TGT/PGT teachers are assigned
4. **Verify**: No PRT teachers appear in options

### Test Case 3: Cross-Level Check
1. Create a timetable with:
   - Teacher A (PRT): Classes 1A, 2B, 3C
   - Teacher B (TGT): Classes 6A, 7B, 8C
2. Mark both absent
3. Generate substitutions
4. **Verify**: 
   - Teacher A's classes only show PRT substitutes
   - Teacher B's classes only show TGT/PGT substitutes

---

## 📋 Admin Dashboard Changes

### Teacher List Filtering
- **PGT Tab**: Shows only PGT teachers
- **TGT Tab**: Shows only TGT teachers
- **PRT Tab**: Shows only PRT teachers
- **Others Tab**: Non-teaching staff

### Visual Indicators
- Primary teachers (PRT) have distinct color coding
- Secondary teachers (TGT/PGT) grouped together

---

## 🛠️ Technical Implementation

### Updated Functions

**`src/lib/utils.ts`**:
```typescript
getClassNumber(className: string): number
isPrimaryClass(className: string): boolean
isSecondaryClass(className: string): boolean
canTeachClass(designation: string, className: string): boolean
```

**`src/components/features/admin/AdminCreatePlan.tsx`**:
- Enhanced teacher filtering logic
- Class-level detection before substitution
- Designation compatibility checks

**`src/lib/gemini.ts`**:
- Updated AI prompt with primary/secondary rules
- Explicit designation restrictions in prompt
- Enhanced reasoning for cross-designation assignments

---

## 📞 Support

If you encounter:
- **PRT assigned to secondary**: Report as critical bug
- **TGT/PGT assigned to primary**: Report as critical bug
- **No substitutes available**: May indicate insufficient teachers in that level

---

**Last Updated**: December 22, 2025  
**Version**: 4.0 (Primary-Secondary Separation)
