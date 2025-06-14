// eventStepConfig.js
export const eventStepConfigv2 = {
  Shoot: {
    steps: [
      { key: "team", type: "selectTeam" },
      { key: "player", type: "selectPlayer" },
      {
        key: "shotType",
        type: "selectType",
        options: ["TwoPoint", "ThreePoint"],
      },
      // { key: "assistedPlayer", type: "selectAssistedPlayer", optional: true },
      { key: "outcome", type: "selectType", options: ["Made", "Missed"] },
      { key: "location", type: "selectLocation" },
    ],
  },
  Rebound: {
    steps: [
      { key: "team", type: "selectTeam" },
      { key: "player", type: "selectPlayer" },
      {
        key: "reboundType",
        type: "selectType",
        options: ["Offensive", "Defensive"],
      },
    ],
  },
  Foul: {
    steps: [
      { key: "team", type: "selectTeam" },
      { key: "player", type: "selectPlayer" },
      {
        key: "foulType",
        type: "selectType",
        options: ["Personal", "Technical", "Flagrant"],
      },
      // { key: "fouledPlayer", type: "selectFouledPlayer" },
    ],
  },
  Turnover: {
    steps: [
      { key: "team", type: "selectTeam" },
      { key: "player", type: "selectPlayer" },
      // { key: "otherTeamPlayer", type: "selectPlayer", optional: true }
    ],
  },
  Steal: {
    steps: [
      { key: "team", type: "selectTeam" },
      { key: "player", type: "selectPlayer" },
    ],
  },
  Block: {
    steps: [
      { key: "team", type: "selectTeam" },
      { key: "player", type: "selectPlayer" },
      // { key: "otherTeamPlayer", type: "selectPlayer" }
    ],
  },
};
