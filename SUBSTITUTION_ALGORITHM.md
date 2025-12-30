# Smart Substitution Algorithm

## Overview

The KVS AI Substitution Manager uses an intelligent algorithm to automatically assign substitute teachers when a teacher is absent. The algorithm prioritizes teachers who already teach the class to ensure minimal disruption to student learning.

## How It Works

### 1. **Eligibility Filtering**

First, the algorithm filters out teachers who cannot substitute:
- Teachers who are also marked absent
- Teachers who already have a class in that period
- Teachers with incompatible designations:
  - **Primary Classes (1-5)**: Only PRT (Primary Teachers)
  - **Secondary Classes (6-12)**: Only TGT and PGT teachers
  - TGT and PGT are interchangeable for secondary classes

### 2. **Smart Scoring System**

Each eligible teacher is scored based on multiple factors:

### Phase 1: Class Teachers (Absolute Priority)

| Priority | Criteria | Score | Explanation |
|----------|----------|-------|-------------|
| **1** | Already teaches this exact class | +1000 | **STRICT PRIORITY** - minimal disruption |
| **2** | Same subject as absent teacher | +50 | Subject expertise bonus |
| **3** | Lower workload | -10 per period | Fair distribution among class teachers |

### Phase 2: Other Teachers (Fallback Only)

| Priority | Criteria | Score | Explanation |
|----------|----------|-------|-------------|
| **1** | Same subject as absent teacher | +50 | Subject expertise |
| **2** | Same designation (TGT→TGT, PGT→PGT) | +30 | Same qualification level |
| **2b** | Compatible designation (TGT↔PGT) | +20 | Both qualified for secondary |
| **3** | Lower workload | -10 per period | Fair distribution |
| **4** | Available | +10 | Base availability bonus |

**Critical**: Phase 2 is ONLY used when NO teachers from Phase 1 are available.

### 3. **Two-Phase Assignment Process**

For each period that needs coverage:

**PHASE 1: Priority to Class Teachers**
1. Filter only teachers who ALREADY teach this class
2. If any are available and free:
   - Assign the one with lowest workload
   - Skip to next period

**PHASE 2: Backup Assignment** (only if Phase 1 finds no one)
3. Look at all other eligible teachers
4. Score based on subject expertise and designation
5. Assign the best-scoring teacher
6. Track workload to ensure fair distribution
7. Generate a clear reason explaining the choice

### 4. **Workload Balancing**

The algorithm tracks how many periods each teacher is assigned:
- Teachers with fewer substitutions are preferred
- Workload information is shown in the reason
- Prevents overloading individual teachers

## Example Scoring

**Scenario**: Class 10A, Period 3, Physics class

### Phase 1: Class Teachers Available

**Teacher A (TGT Physics)** - Already teaches 10A
- Base score (class teacher): +1000
- Same subject (Physics): +50
- **Total: 1050 points** ✓ **ASSIGNED** (Phase 1)

**Teacher D (PGT Math)** - Already teaches 10A
- Base score (class teacher): +1000
- **Total: 1000 points** (Second choice in Phase 1)

### Phase 2: Only if No Class Teachers Free

**Teacher B (PGT Math)** - Does NOT teach 10A
- Compatible designation: +20
- **Total: 20 points**

**Teacher C (TGT English)** - Does NOT teach 10A
- TGT level: +30
- **Total: 30 points** ✓ Would be assigned in Phase 2

**Note**: Phase 2 teachers are ONLY considered if Phase 1 returns no results.

## Benefits

✅ **Student-Centered**: **STRICTLY** prioritizes teachers who already teach the class
✅ **Minimal Disruption**: Students get familiar teachers whenever possible
✅ **Reliable**: No dependency on external AI services
✅ **Fair**: Distributes workload evenly within each phase
✅ **Transparent**: Clear reasoning showing which phase was used
✅ **Fast**: Instant generation
✅ **Accurate**: Respects designation and class level rules
✅ **Strict Priority**: Other teachers only used when absolutely necessary

## Edge Cases

### No Substitute Available
When no eligible teachers are free:
- System shows "No substitute available"
- Clear reason: "All eligible teachers are occupied or absent"
- Admin can manually adjust the plan

### Multiple Absent Teachers
- Algorithm considers all absent teachers
- Prevents assigning an absent teacher as a substitute
- Workload is distributed across remaining teachers

### Partial Day Absences
Currently supports full-day absences. Partial day functionality can be added by:
1. Filtering periods by time range
2. Applying the same scoring algorithm
3. Generating substitutions only for specified periods

## Technical Details

**File**: `src/lib/substitution-algorithm.ts`

**Key Functions**:
- `generateSmartSubstitutions()`: Main algorithm
- `scoreTeacher()`: Scoring logic
- `generateSubstitutionSummary()`: Report generation

**Integration**: 
- Replaces the previous AI-based approach
- Works with existing database structure
- Compatible with all features (history, reports, etc.)
