# Team Management System Implementation Details

## Components
- `TeamManagement.js`: Main container, manages all state
- `TeamList.js`: Lists/selects teams
- `TeamForm.js`: Create/edit team
- `RosterManager.js`: Add/remove players, assign roles
- `TeamManagement.css`: Styles for all components

## State Management
- Uses React `useState` for all data
- Teams and players are stored as arrays in state
- Each team has an `id`, `name`, `description`, and `players` array
- Each player has `id`, `name`, `email`, `role`

## Adding/Editing Teams
- Creating a team adds it to the state with a unique id
- Editing a team updates its name/description
- Deleting a team removes it from the state

## Managing Players
- Players are added via a form (name, email, role)
- Players can be removed from the roster
- Roles can be updated via a dropdown (Player/Captain)

## Styling
- All styles are in `TeamManagement.css` for modularity

## Extensibility
- To persist data, connect state to localStorage or backend API
- To enforce roles/auth, integrate with authentication system

---
