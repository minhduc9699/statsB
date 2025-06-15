const eventStepConfig = {
  rebound: [
    {
      step: 2,
      label: "Select Team",
      field: "team",
      type: "team-select",
    },
    {
      step: 2,
      label: "Select Player",
      field: "player",
      type: "player-select",
    },
    {
      step: 2,
      label: "Rebound Type",
      field: "reboundType",
      type: "option-select",
      options: ["Offensive", "Defensive"],
    },
    {
      step: 3,
      label: "Select Rebound Position",
      field: "position",
      type: "court-select",
    },
  ],

  shoot: [
    {
      step: 2,
      label: "Select Team",
      field: "team",
      type: "team-select",
    },
    {
      step: 2,
      label: "Select Player",
      field: "player",
      type: "player-select",
    },
    {
      step: 2,
      label: "Shot Type",
      field: "shotType",
      type: "option-select",
      options: ["2PT", "3PT"],
    },
    {
      step: 2,
      label: "Shot Result",
      field: "shotResult",
      type: "option-select",
      options: ["Made", "Missed"],
    },
    {
      step: 3,
      label: "Select Shot Position",
      field: "position",
      type: "court-select",
    },
  ],

  steal: [
    {
      step: 2,
      label: "Select Team",
      field: "team",
      type: "team-select",
    },
    {
      step: 2,
      label: "Select Player",
      field: "player",
      type: "player-select",
    },
    {
      step: 3,
      label: "Steal Position",
      field: "position",
      type: "court-select",
    },
  ],

  turnover: [
    {
      step: 2,
      label: "Select Team",
      field: "team",
      type: "team-select",
    },
    {
      step: 2,
      label: "Select Player",
      field: "player",
      type: "player-select",
    },
    {
      step: 3,
      label: "Turnover Position",
      field: "position",
      type: "court-select",
    },
  ],

  block: [
    {
      step: 2,
      label: "Select Team",
      field: "team",
      type: "team-select",
    },
    {
      step: 2,
      label: "Select Player",
      field: "player",
      type: "player-select",
    },
    {
      step: 3,
      label: "Block Location",
      field: "position",
      type: "court-select",
    },
  ],

  fault: [
    {
      step: 2,
      label: "Select Team",
      field: "team",
      type: "team-select",
    },
    {
      step: 2,
      label: "Select Player",
      field: "player",
      type: "player-select",
    },
    {
      step: 2,
      label: "Fault Type",
      field: "faultType",
      type: "option-select",
      options: ["Offensive", "Defensive", "Technical"],
    },
  ],

  freeThrow: [
    {
      step: 2,
      label: "Select Team",
      field: "team",
      type: "team-select",
    },
    {
      step: 2,
      label: "Select Player",
      field: "player",
      type: "player-select",
    },
    {
      step: 2,
      label: "Result",
      field: "freeThrowResult",
      type: "option-select",
      options: ["Made", "Missed"],
    },
  ],
};

export default eventStepConfig;
