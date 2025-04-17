# Team Management System Quick Reference

## Usage

1. Import and render the main component:

```jsx
import TeamManagement from './components/TeamManagement/TeamManagement';

function App() {
  return <TeamManagement />;
}
```

2. Use the UI:
   - Create a team (enter name, description)
   - Select a team to manage its roster
   - Add players (name, email, role)
   - Assign "Captain" role or remove players
   - Delete teams as needed

## Example
- Create a team called "Demo Squad"
- Add player: Name: Jane, Email: jane@demo.com, Role: Captain
- Add player: Name: Mike, Email: mike@demo.com, Role: Player
- Remove Mike from roster
- Change Jane's role to Player

---
