# Team Management System Gotchas

- Data is not persisted after page reload (unless localStorage is used)
- No real authentication, so any user can manage any team in the mock UI
- Email invitations are simulated only (no real sending)
- Role assignment is not enforced outside the UI (no backend validation)
- If integrating with backend later, ensure all state updates are replaced with API calls and handle errors
