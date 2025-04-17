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
