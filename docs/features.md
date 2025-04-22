# Main Page

## User actions flow
- Create new match -> Set match type -> Select teams -> Upload video -> Create events -> See results in dashboard

## Components
- Match creation form
    - Match type: string (1v1, 2v2, 3v3, 4v4, 5v5)
    - Select teams: array of team objects
    - Video upload: file
    - Date: date
- Video player
    - Video playback (play, pause, seek, volume, zoom in, zoom out, speed)
    - Event timeline bar
- Event tagging interface
    - shot event:
        - player: string (player name)
        - shot type: string (2PT, 3PT)
        - team: string (team name)
        - coordinates: {x: number, y: number} (click on shot chart)
        - result: string (made or missed)
        - assist: string (player name) (optional)
    - free throw event:
        - player: string (player name)
        - team: string (team name)
        - result: string (made or missed)
    - rebound event:
        - player: string (player name)
        - team: string (team name)
        - rebound type: string (offensive, defensive)
    - block event:
        - player: string (player name)
        - team: string (team name)
    - steal event:
        - player: string (player name)
        - team: string (team name)
    - turnover event:
        - player: string (player name)
        - team: string (team name)
    - foul event:
        - player: string (player name)
        - team: string (team name)
        - type: string (personal, technical)

# Dashboard
## User actions flow
- Select match -> View match analytics -> view team analytics -> view player analytics

## Components
- Match list
    - Game analytics
        - Game summary
            - Score
            - Team names
            - Date
        - Team statistics
            - Team name
            - Points
            - Assists
            - Rebounds
            - Blocks
            - Steals
            - Turnovers
            - Fouls
            - Shot chart
        - Player statistics
            - Player name
            - Points
            - Assists
            - Rebounds
            - Blocks
            - Steals
            - Turnovers
            - Fouls
            - Shot chart