# AGENTS.md — Vocam Engineering & Acceptance Standard

> **Purpose:** This file is the source of truth for Codex/IDE agents working on Vocam.
>
> The goal is **not** to make an agent say “100% complete”.  
> The goal is to make Vocam **feature-complete and release-ready within the thesis scope**, with evidence.

---

## 1. Project Quality Target

Vocam is considered ready only when it satisfies both:

### Feature-complete
Every in-scope feature reaches its defined runtime outcome and passes its acceptance criteria.

### Release-ready
Feature-complete **plus**:

- TypeScript/build checks are clean.
- Backend tests/build are clean.
- Core end-to-end flow works without manual rescue.
- Negative/error cases are handled without app crashes.
- Security and authorization are enforced server-side.
- Data persists correctly across restart/login/logout.
- No old out-of-scope business logic remains active.
- Claims in the thesis match measurable system behavior/data.

Do **not** use the term “bug-free 100%”. Absolute bug freedom is not a valid engineering claim.

---

# 2. Agent Rules — Mandatory

Every coding agent must follow these rules.

## 2.1 Never declare completion without evidence

Do **not** say:

- “100% complete”
- “fully implemented”
- “all good”
- “production ready”
- “feature works”

unless the relevant acceptance criteria have evidence.

Evidence may include:

1. exact file path;
2. class/function/component;
3. runtime call path;
4. test that exercises the behavior;
5. command output;
6. runtime/manual acceptance result.

A file existing is **not** proof that a feature works.

An API existing is **not** proof that the UI uses it.

A function existing is **not** proof that the function is reachable in runtime.

A successful happy path is **not** proof that error handling is complete.

---

## 2.2 Static code inspection is not runtime verification

The agent must distinguish:

- **Code exists**
- **Code path is reachable**
- **Runtime behavior is verified**

If runtime behavior cannot be verified, state that clearly.

### Official acceptance status

Use only:

- `PASS`
- `FAIL`
- `BLOCKED`

Do not use “almost done”, “mostly works”, “90%”, or similar wording.

### Static audit evidence status

During source-code inspection, the agent may mark evidence as:

- `VERIFIED`
- `UNVERIFIED`

`UNVERIFIED` never counts as `PASS`.

If a criterion is required for release and cannot be verified, it must remain `FAIL` unless it is genuinely blocked by an external dependency, in which case use `BLOCKED`.

---

## 2.3 Do not fake implementation

The following do not count as implementation:

- placeholder UI;
- hard-coded fake result;
- mock data presented as real backend data;
- `console.log` instead of a real effect;
- function that is never called;
- API endpoint unused by the product;
- local state pretending to be persisted data;
- manually editing DB to make a demo pass;
- requiring hot reload/restart to repair normal flow;
- silent fallback that hides a broken service.

---

## 2.4 Fix root causes, not screenshots

When a bug is found:

1. identify the runtime path;
2. identify the actual root cause;
3. fix the smallest correct layer;
4. preserve architecture boundaries;
5. add/update validation or tests when practical;
6. re-check impacted acceptance criteria.

Do not patch only the visible screen if the underlying state/API/data model remains wrong.

---

# 3. Current Architecture

Use this architecture unless an explicit project decision changes it.

```text
React Native + Expo + TypeScript
        |
        | Supabase Auth access token
        | Authorization: Bearer <JWT>
        v
Spring Boot 3 / Java 17
Spring Security / Resource Server
REST API / application services
        |
        +----> PostgreSQL persistence
        |
        +----> FastAPI internal AI service
                    |
                    +----> object detection / AI pipeline
```

## Mobile application

There is one mobile app.

Role-based navigation must separate:

- `LEARNER`
- `ADMIN`

The frontend should use a centralized API client for authenticated requests.

The mobile app must **not** connect directly to the database.

---

# 4. Identity, Authentication, Authorization

## Canonical user identity

The canonical user ID is:

```text
Supabase JWT `sub`
```

Treat it as a UUID.

Do not use legacy `device_uuid` as the authenticated account identity.

Do not trust a user ID sent by the client when the backend can derive the authenticated user from the JWT.

---

## Required security behavior

Spring Security must:

- validate JWTs;
- derive authenticated identity from JWT claims;
- enforce Learner/Admin authorization server-side;
- reject unauthorized Admin API access;
- reject or restrict a locked user according to product rules;
- prevent one user from reading/writing another user's private data.

Frontend route hiding is **not authorization**.

---

# 5. Source-of-Truth Priority

When instructions conflict, use this order:

1. current explicit product/refactoring decision;
2. this `AGENTS.md`;
3. database/API contracts;
4. implementation;
5. older code/comments/mock behavior.

Old code is not automatically a requirement.

Do not preserve obsolete behavior only because it already exists.

---

# 6. Engineering Code Review Standard

Every changed area should be evaluated across the following dimensions.

## 6.1 Functional correctness

Check:

- Does the feature produce the required user-visible result?
- Is the runtime path actually connected?
- Are state transitions correct?
- Are edge cases handled?
- Is persisted state reloaded correctly?

---

## 6.2 Architecture correctness

Check:

- UI does not contain unnecessary business logic.
- API/network logic is centralized where appropriate.
- Backend controllers do not contain excessive domain logic.
- Services own business rules.
- Repository/data access stays in persistence layer.
- AI service responsibilities remain separated from Spring business/security logic.
- No direct mobile-to-database access.

---

## 6.3 Security

Check:

- authenticated user comes from verified JWT;
- no trust in client-supplied role/user ID;
- Admin endpoints are protected server-side;
- locked account behavior is enforced;
- cross-user data access is prevented;
- sensitive errors/tokens are not logged unnecessarily.

---

## 6.4 Data integrity

Check:

- user-owned records belong to the correct UUID;
- duplicate prevention is enforced reliably;
- update/delete operations target the correct owner/resource;
- mappings use canonical identifiers;
- persistence survives application restart;
- migrations do not silently destroy existing valid data.

Where uniqueness is a business invariant, prefer enforcing it at the database level in addition to UI/service checks.

---

## 6.5 Error handling

The system must fail safely when:

- network is unavailable;
- backend is unavailable;
- FastAPI is unavailable;
- AI provider/service is unavailable;
- payload is invalid;
- permission is denied;
- no detection is returned;
- database operation fails.

Expected behavior:

- no unhandled crash;
- no fake success;
- user gets an understandable state/message;
- retry/recovery is possible where appropriate.

---

## 6.6 UI/runtime consistency

Check:

- loading state;
- empty state;
- error state;
- disabled/duplicate actions;
- stale data after mutations;
- navigation back/forward;
- app restart;
- logout/login with another user;
- device orientation/image aspect-ratio-sensitive behavior where relevant.

---

## 6.7 Dead code and scope cleanliness

Remove or isolate obsolete business behavior.

Do not leave old feature logic active “just in case”.

Unused code that can alter runtime behavior is a release risk.

---

# 7. Global Definition of Done

A feature is `PASS` only when all applicable conditions below are true.

- [ ] Required runtime behavior is implemented.
- [ ] UI is connected to the real runtime path.
- [ ] Backend/API path is connected when required.
- [ ] Persistence works when required.
- [ ] Authentication/authorization is enforced when required.
- [ ] Loading/empty/error states are handled.
- [ ] Duplicate/race/data-integrity risks are addressed.
- [ ] Negative cases do not crash the app.
- [ ] No manual DB edit is required for normal operation.
- [ ] No hot reload/restart is required to rescue normal flow.
- [ ] Relevant build/test commands pass.
- [ ] Evidence is recorded.

---

# 8. Feature Acceptance Criteria

---

## 8.1 Auth & Security

### Target outcome

A user can authenticate reliably, restore the session, access only the correct role area, and be blocked when authorization/account state forbids access.

### Acceptance criteria

- [ ] Email login works.
- [ ] Google login works if included in the current shipped auth flow.
- [ ] Password reset works if included in the current shipped auth flow.
- [ ] Session restores after app restart.
- [ ] Logout removes authenticated access.
- [ ] `LEARNER` sees Learner navigation/features.
- [ ] `ADMIN` sees Admin navigation/features.
- [ ] Learner cannot call Admin APIs successfully.
- [ ] Backend derives user identity from verified JWT `sub`.
- [ ] Backend does not trust arbitrary client user IDs for user-owned data.
- [ ] Locked user behavior is enforced.
- [ ] User A cannot access User B's private progress/flashcards.

### PASS proof

At minimum, demonstrate:

```text
login
→ authenticated request
→ correct role navigation
→ protected backend route
→ logout
→ protected access rejected
```

and:

```text
Learner token
→ Admin endpoint
→ rejected
```

---

## 8.2 Scanner

### Required end-to-end result

```text
Camera/Gallery
→ image
→ multiple object detections
→ correct bounding boxes
→ user taps a bounding box
→ correct vocabulary item opens
→ user can save flashcard
→ duplicate is prevented
```

### Acceptance criteria

- [ ] Camera input works.
- [ ] Gallery input works.
- [ ] Multiple objects can be rendered.
- [ ] Bounding boxes align with the displayed image.
- [ ] Box math handles image resizing/aspect ratio correctly.
- [ ] Tapping a box resolves the intended detection.
- [ ] Detection resolves to the correct vocabulary item.
- [ ] Word Detail shows the resolved vocabulary data.
- [ ] Save Flashcard uses the correct vocabulary ID.
- [ ] Repeated save/scan does not create unintended duplicates.
- [ ] No-object result has a valid empty state.
- [ ] AI/FastAPI/network failure has a valid error state.
- [ ] App does not crash on unusual aspect ratios.

### Required negative tests

Test at least:

```text
image with no recognizable object
very wide image
very tall image
overlapping boxes
same word scanned repeatedly
FastAPI unavailable
AI provider unavailable
network unavailable
```

---

## 8.3 Vocabulary & Detection Mapping

### Target outcome

Every canonical detector label in the shipped model/data scope maps deterministically to the expected vocabulary record.

Current target for the thesis scope:

```text
365 canonical labels / vocabulary mappings
```

If the target dataset changes, update code, database, tests, and thesis claims together.

### Acceptance criteria

- [ ] Canonical vocabulary count matches the documented claim.
- [ ] Detection labels use one canonical field/convention.
- [ ] Detector label → DB vocabulary mapping is deterministic.
- [ ] No duplicate canonical detection label exists.
- [ ] All detector canonical labels exist in DB.
- [ ] No unintended DB canonical label is missing from the detector label set.
- [ ] Vocabulary search works.
- [ ] Admin changes are reflected when Learner reloads/refetches the word.

### Required measurable proof

For a 365-word thesis claim, verify equivalent invariants such as:

```text
COUNT(DISTINCT detection_label) = 365
len(canonical_detector_labels) = 365
detector_labels - db_labels = 0
db_labels - detector_labels = 0
```

If the schema still uses a legacy name such as `coco_class`, migration/compatibility must be explicit. Do not allow ambiguous parallel canonical fields.

---

## 8.4 Flashcard Save / Collection

### Target outcome

A Learner can save vocabulary as a persistent, user-owned flashcard collection without accidental duplicates.

### Acceptance criteria

- [ ] Save from Word Detail works.
- [ ] Saved card persists after app restart.
- [ ] Saved card belongs to authenticated User UUID.
- [ ] Duplicate save is prevented.
- [ ] Flashcard list loads from the intended persistence layer.
- [ ] Search/filter works if present in the current UI.
- [ ] Delete works.
- [ ] Deleted card does not reappear due to stale local state.
- [ ] Logout A → login B does not expose A's cards.
- [ ] Login A again restores A's cards correctly.

### Duplicate invariant

Prefer a durable invariant equivalent to:

```text
one active saved flashcard per (user_id, vocabulary_id)
```

unless the product explicitly defines another rule.

---

## 8.5 SM-2 Review

### Required end-to-end result

```text
review card
→ choose Again / Good / Easy
→ scheduling values change
→ nextReviewAt changes correctly
→ restart app
→ scheduling state remains
→ Review Today only returns due cards
```

### Required card scheduling data

The persisted model must contain the SM-2/scheduling state required by the implementation, such as:

```text
easinessFactor
repetitions
interval
nextReviewAt
```

Use the actual project naming consistently.

### Acceptance criteria

- [ ] `Again` changes scheduling according to the chosen algorithm.
- [ ] `Good` changes scheduling according to the chosen algorithm.
- [ ] `Easy` changes scheduling according to the chosen algorithm.
- [ ] Updated scheduling data is persisted.
- [ ] Restarting the app preserves scheduling.
- [ ] Review Today includes only cards where the due condition is true.
- [ ] Future cards do not appear in Review Today.
- [ ] No-due-card state is handled.
- [ ] Review updates any required learning statistics consistently.
- [ ] `wordsSaved` reflects saved-card semantics.
- [ ] `wordsLearned` reflects the explicitly defined learned-card semantics.
- [ ] Counts are not fabricated from unrelated UI state.

### Critical proof

The agent must be able to show the real runtime path that enforces an equivalent condition to:

```text
nextReviewAt <= now
```

for due-card selection.

Do not count a helper function as proof unless the Review UI/service actually calls it.

---

## 8.6 Lesson & Quiz

### Required end-to-end result

```text
open Lesson A
→ Lesson A loads its vocabulary
→ Quiz A uses Lesson A vocabulary
→ submit quiz
→ result is calculated
→ incorrect answers are identifiable
→ Lesson A progress changes
→ progress persists
```

### Acceptance criteria

- [ ] Lesson list/content uses real project data, not abandoned mock data.
- [ ] Lesson vocabulary belongs to the selected lesson/topic.
- [ ] Quiz questions are generated/loaded from the selected lesson's intended vocabulary set.
- [ ] Quiz does not silently mix unrelated lesson vocabulary.
- [ ] Answers are evaluated correctly.
- [ ] Result is shown.
- [ ] Incorrect answers can be reviewed if this UI is in scope.
- [ ] Lesson progress changes according to documented rules.
- [ ] Progress belongs to authenticated User UUID.
- [ ] Progress persists after restart/re-login.
- [ ] Empty lesson / no-question case is handled.

### Required relationship proof

For a selected lesson, the agent must prove:

```text
selected lesson ID/topic
→ vocabulary source
→ quiz source
→ result
→ progress write
```

---

## 8.7 Notifications

### Target outcome

A real study reminder notification appears on a physical device/emulator under the supported app state.

### Acceptance criteria

- [ ] Permission flow is implemented.
- [ ] Denied permission state is handled.
- [ ] Reminder scheduling uses the real notification API.
- [ ] Scheduled reminder survives the expected app lifecycle for the chosen implementation.
- [ ] A real notification appears.
- [ ] The test includes the app closed/backgrounded as required by the thesis/demo.
- [ ] Tapping the notification behaves sensibly if deep-link/navigation behavior is in scope.
- [ ] No duplicate accidental scheduling occurs.

### Non-proof examples

The following do **not** count as notification completion:

```text
notification helper exists
console.log("scheduled")
UI says reminder enabled
mock toast appears
```

### PASS proof

A real device/emulator must visibly receive the notification.

If this cannot be executed in the agent environment, mark runtime verification as `BLOCKED`; never claim `PASS` based only on source code.

---

## 8.8 Admin — Authorization & User Management

### Target outcome

An Admin can manage authorized system data, while Learners cannot access Admin capabilities.

### Acceptance criteria

- [ ] Admin role is validated by backend security.
- [ ] User list uses real backend data.
- [ ] Lock user works.
- [ ] Unlock user works.
- [ ] Lock state affects subsequent authenticated behavior as designed.
- [ ] Learner cannot perform Admin operations by directly calling the API.
- [ ] Admin user-management mutations refresh UI state correctly.

### Required security test

```text
Learner JWT
→ lock/unlock/user-management Admin endpoint
→ rejected
```

---

## 8.9 Admin — Vocabulary Management

### Target outcome

Admin can update the vocabulary data used by the Learner experience.

### Acceptance criteria

- [ ] Admin can read vocabulary data.
- [ ] Admin can update allowed fields.
- [ ] Validation prevents invalid canonical mapping data.
- [ ] Image upload works if included in current scope.
- [ ] Stored image/reference is persisted correctly.
- [ ] Learner sees updated vocabulary after intended refresh/refetch.
- [ ] Update does not break detector-label mapping.
- [ ] Canonical count/mapping invariants remain valid.

---

# 9. Out-of-Scope Cleanup

The release scope must not retain active legacy/gamification/product features that are explicitly removed.

Search the entire repository for at least:

```text
XP
totalXp
streak
badge
leaderboard
coin
dailyQuest
```

Also inspect for abandoned/fake implementations related to removed features such as:

```text
Chatbot
Speech
fake CMS
placeholder business flows
```

A text match is not automatically a failure; classify each result.

### PASS conditions

- No active out-of-scope business logic is reachable.
- No obsolete navigation exposes removed features.
- No stale model/service field changes behavior.
- No thesis/demo claim depends on removed features.
- Historical migration/comments may remain only when harmless and clearly non-runtime.

Do not keep broken scope merely to reduce deleted code.

---

# 10. Required Clean Demo Flow

Before declaring release readiness, execute one clean scenario equivalent to:

```text
fresh install / clean app start
→ register/login Learner
→ scan image containing multiple objects
→ select a detected object
→ open Word Detail
→ save flashcard
→ review flashcard with SM-2
→ verify Review Today behavior
→ open Lesson
→ complete Quiz
→ verify Lesson progress
→ receive real notification
→ logout
→ login Admin
→ update vocabulary and/or vocabulary image
→ verify Learner can later see update
→ lock Learner
→ verify locked Learner is blocked as designed
```

### The demo is not PASS if it requires:

- manual database edits;
- modifying source code mid-demo;
- changing hard-coded variables;
- hot reload to repair state;
- restarting app/server to rescue a normal flow;
- bypassing authentication;
- manually inserting fake records solely for the step to work.

---

# 11. Required Negative Test Matrix

At minimum, test these cases before release:

| Area | Negative case | Expected result |
|---|---|---|
| Scanner | no object detected | valid empty result, no crash |
| Scanner | very wide/tall image | boxes still align |
| Scanner | overlapping detections | interaction remains deterministic |
| Flashcard | same word saved repeatedly | no unintended duplicates |
| AI | FastAPI unavailable | understandable error, no fake success |
| AI | upstream AI unavailable | understandable error |
| Network | Wi-Fi/network unavailable | recoverable error state |
| Security | Learner calls Admin API | server rejects |
| Security | locked user acts/logs in | blocked according to rule |
| SM-2 | no due cards | valid empty Review Today |
| Session | logout A → login B | no A data leakage |
| Session | login A again | A data restored correctly |
| Admin | Admin edits vocabulary | Learner sees correct refreshed data |

Add tests for any new failure mode introduced by future features.

---

# 12. Build & Machine-Checkable Gates

Run the applicable commands from the correct project directory.

## Frontend

```bash
npx tsc --noEmit
```

Required result:

```text
0 TypeScript errors
```

If the project defines lint/test scripts, run the real existing scripts as additional gates.

Do not invent npm scripts that do not exist.

---

## Spring Boot backend

```bash
mvn clean test
```

Required result:

```text
BUILD SUCCESS
```

A successful compile with skipped failing tests is not equivalent to a clean test gate.

---

## AI service

Run the actual repository-defined tests/checks if present.

Do not claim the AI service is tested merely because the server starts.

---

## Repository scope scan

Search all source directories for out-of-scope terms and inspect each hit.

Example:

```bash
rg -n -i "XP|totalXp|streak|badge|leaderboard|coin|dailyQuest"
```

If `rg` is unavailable, use an equivalent repository search.

---

# 13. Database & Migration Rules

For schema changes:

1. inspect existing schema and data assumptions;
2. use controlled migrations;
3. preserve valid production/demo data when required;
4. add indexes/constraints for real invariants;
5. update JPA entities/repositories/services/DTOs consistently;
6. update API contracts;
7. update frontend types/calls;
8. verify migration on a realistic database state.

Examples of critical invariants:

```text
authenticated user ownership uses user_id UUID
canonical vocabulary detection label is unique
saved flashcard duplicate rule is durable
review scheduling fields persist
lesson progress belongs to user + lesson
```

Do not solve migration problems by instructing the developer to manually fix random rows unless that is an explicit one-time migration procedure documented for the release.

---

# 14. User UUID Refactor Rule

All new/refactored authenticated progress data must use the authenticated Supabase User UUID.

Target concept:

```text
JWT.sub → authenticated user UUID → backend business operation
```

Avoid:

```text
frontend sends arbitrary userId
backend trusts it
```

Legacy `device_uuid` references must be classified as:

- migrated;
- compatibility-only and justified;
- obsolete and removed.

No hidden active ownership path should still depend on device identity.

---

# 15. API Review Rule

For each important API, verify:

```text
UI action
→ frontend hook/service
→ centralized API client
→ HTTP endpoint
→ Spring Security
→ controller
→ service/business rule
→ repository / AI service
→ persisted/result state
→ response
→ UI refresh
```

An endpoint with no runtime caller may be dead code.

A UI button with no real backend effect is incomplete.

---

# 16. Evidence Required From Codex

When asked to audit a feature, do not answer with a summary only.

Use this format:

```markdown
## Criterion
<exact acceptance criterion>

Status: PASS | FAIL | BLOCKED

### Evidence
- UI entry point: `path:line` — component/function
- Frontend call: `path:line` — function
- Backend route: `METHOD /path`
- Security rule: `path:line`
- Service logic: `path:line`
- Persistence/query: `path:line`
- Test: `path:line` or runtime command/result

### Runtime path
UI → ... → final effect

### Why this status
Short explanation.

### Missing proof / required fix
Only if not PASS.
```

Do not cite files that do not actually participate in the runtime path.

---

# 17. Recommended Agent Audit Prompt

When auditing the whole project, follow this instruction:

```text
Do not conclude that the project is complete.

Audit the repository against AGENTS.md.

For every acceptance criterion:
1. find the real runtime code path;
2. provide exact file/function/API evidence;
3. run applicable tests/checks;
4. classify the official result only as PASS, FAIL, or BLOCKED.

A file, function, endpoint, mock, or console.log existing is not sufficient proof.

If runtime behavior cannot be proven, do not mark PASS.

For security criteria, prove server-side enforcement.

For persistence criteria, prove the write path and reload/read path.

For UI criteria, prove the UI actually calls the implementation.

At the end, list:
- Core FAIL items
- BLOCKED runtime tests
- Release blockers
- Evidence commands and outputs
- Whether the project is feature-complete
- Whether the project is release-ready

Never use “100% complete” as a substitute for evidence.
```

---

# 18. Feature-Specific Proof Questions

Use questions like these instead of:

> “Is this feature complete?”

### SM-2

```text
Prove that Review Today only loads cards whose nextReviewAt <= now.
Show the UI entry point, frontend function, API/query/service path,
persistence field, and a test/runtime proof.
```

### Scanner

```text
Prove the runtime path:
Camera/Gallery → detections → rendered boxes → tapped detection
→ vocabulary lookup → Word Detail → save flashcard.

Show how box coordinates are transformed to the displayed image.
```

### Auth

```text
Prove that a Learner JWT cannot call an Admin endpoint.
Show the Spring Security rule and test/runtime response.
```

### Flashcard

```text
Prove that User A cannot read User B's flashcards and that the same
vocabulary cannot be unintentionally saved multiple times by the same user.
```

### Lesson/Quiz

```text
Prove that Quiz A derives its questions from Lesson A's vocabulary and
that completing the quiz updates persisted progress for Lesson A.
```

### Notification

```text
Show the real notification scheduling API and distinguish source-code
verification from a real device notification test.
Do not mark PASS without runtime proof.
```

---

# 19. Release Decision

Use two independent final decisions.

## Feature-complete

`YES` only when every core in-scope feature criterion is `PASS`.

A core `FAIL` means:

```text
Feature-complete = NO
```

A required criterion that is `BLOCKED` means completion is not fully proven.

---

## Release-ready

`YES` only when:

```text
Feature-complete = YES
AND frontend type/build gates pass
AND backend test/build gates pass
AND clean E2E demo passes
AND required negative tests pass
AND security gates pass
AND data/mapping invariants pass
AND no active out-of-scope logic remains
```

Otherwise:

```text
Release-ready = NO
```

---

# 20. Final Acceptance Report Template

```markdown
# Vocam Final Acceptance Report

## Summary

Feature-complete: YES / NO
Release-ready: YES / NO

## Build Gates

| Gate | Status | Evidence |
|---|---|---|
| `npx tsc --noEmit` | PASS/FAIL/BLOCKED | ... |
| `mvn clean test` | PASS/FAIL/BLOCKED | ... |
| AI checks | PASS/FAIL/BLOCKED | ... |
| Out-of-scope scan | PASS/FAIL/BLOCKED | ... |
| 365 mapping invariant | PASS/FAIL/BLOCKED | ... |

## Feature Matrix

| Feature | Status | Main evidence | Remaining issue |
|---|---|---|---|
| Auth/Security | PASS/FAIL/BLOCKED | ... | ... |
| Scanner | PASS/FAIL/BLOCKED | ... | ... |
| Vocabulary mapping | PASS/FAIL/BLOCKED | ... | ... |
| Flashcard | PASS/FAIL/BLOCKED | ... | ... |
| SM-2 | PASS/FAIL/BLOCKED | ... | ... |
| Lesson/Quiz | PASS/FAIL/BLOCKED | ... | ... |
| Notification | PASS/FAIL/BLOCKED | ... | ... |
| Admin Users | PASS/FAIL/BLOCKED | ... | ... |
| Admin Vocabulary | PASS/FAIL/BLOCKED | ... | ... |
| Scope cleanup | PASS/FAIL/BLOCKED | ... | ... |

## Core FAIL Items

- ...

## BLOCKED Runtime Tests

- ...

## Release Blockers

- ...

## Final Decision

Do not write “100% complete”.

State only whether the evidence supports:

- feature-complete;
- release-ready.
```

---

# 21. Definition of Success for Vocam

The target is:

> **Vocam is feature-complete and release-ready within the approved thesis scope.**

Success means the implemented system can demonstrate its promised user outcomes, security boundaries, persistence, AI mapping, study flow, Admin flow, and failure handling with evidence.

The agent's confidence is irrelevant unless the evidence supports it.
