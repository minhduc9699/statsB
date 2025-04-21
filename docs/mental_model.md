# Mental Model

## Player and Team State Rationale

### Why Keep Both `players` and `teams` State?
- `players` slice holds the canonical data for all players (name, number, etc.), acting as the single source of truth.
- `teams` slice only stores team structure: which players are on which team (by `playerId`), their team-specific roles (e.g., captain), and "in game" status.
- This separation prevents data duplication and ensures that any player update (e.g., name/number) is reflected everywhere they're referenced, across all teams and events.
- Teams referencing players by ID keeps team data lean and avoids duplicating player info.
- Global operations (search, update, remove) are straightforward and always consistent.

### Using Selectors for Event Creation
- Use selectors to "join" the two states for UI and event creation, producing a structure with each team's in-game players as full player objects.
- This approach is DRY: selectors are a computed view, not a new source of truth or duplication.
- Only store player IDs in teams; never duplicate player details in team state.

### Best Practice
- `players` = single source of player data.
- `teams` = team structure and assignments.
- Use selectors to merge for UI/event logic.

### Summary
This pattern ensures:
- No redundancy
- Consistent, up-to-date data
- Simple, maintainable code
- Easy extensibility for future features (multi-team, global player search, etc.)

# Team Management System (Mock Data)

## Conceptual Overview
This feature allows coaches to create teams, invite players, manage rosters, and assign roles (e.g., captain) using mock data, all on the frontend. No backend or API calls are used. All data is stored in React state only.

- Coaches can create/edit/delete teams
- Coaches can add/remove players and assign roles
- Invitations are simulated (no real email sending)
- All changes are local to the session (not persisted after reload)

## User Flow
1. Coach opens the Team Management interface
2. Coach creates a new team or selects an existing one
3. Coach adds players (name, email, role)
4. Coach can assign the "Captain" role to any player
5. Coach can remove players or teams as needed

## Limitations
- No authentication or real user management
- No persistence (unless extended with localStorage)
- No backend integration

---
