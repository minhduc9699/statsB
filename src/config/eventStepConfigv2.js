// eventStepConfig.js
export const eventStepConfigv2 = {
  Shoot: {
    steps: [
      { key: "team", type: "selectTeam" },
      { key: "player", type: "selectPlayer" },
      { key: "shotType", type: "select", options: ["TwoPoint", "ThreePoint"] },
      { key: "assistedPlayer", type: "selectPlayer", optional: true },
      { key: "outcome", type: "select", options: ["Made", "Missed"] },
      { key: "location", type: "selectLocation" }
    ]
  },
  Rebound: {
    steps: [
      { key: "team", type: "selectTeam" },
      { key: "player", type: "selectPlayer" },
      { key: "reboundType", type: "select", options: ["Offensive", "Defensive"] }
    ]
  },
  Foul: {
    steps: [
      { key: "team", type: "selectTeam" },
      { key: "player", type: "selectPlayer" },
      { key: "foulType", type: "select", options: ["Personal", "Technical", "Flagrant"] },
      { key: "fouledPlayer", type: "selectPlayer" },
    ]
  },
  Turnover: {
    steps: [
      { key: "team", type: "selectTeam" },
      { key: "player", type: "selectPlayer" },
      { key: "otherTeamPlayer", type: "selectPlayer", optional: true }
    ]
  },
  Steal: {
    steps: [
      { key: "team", type: "selectTeam" },
      { key: "player", type: "selectPlayer" }
    ]
  },
  Block: {
    steps: [
      { key: "team", type: "selectTeam" },
      { key: "player", type: "selectPlayer" },
      { key: "otherTeamPlayer", type: "selectPlayer" }
    ]
  }
};