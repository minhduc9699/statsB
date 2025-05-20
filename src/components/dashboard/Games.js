import React from "react";
import DashboardFilter from "./Filter";
import infoIcon from "../../assets/info-icon.png";

const Games = () => {
  const matches = [
    {
      gameType: "5vs5",
      date: "DEC 8 2021",
      homeTeam: {
        name: "Boston Celtics",
        logo: "https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg",
        score: 111,
        points: "J. Tatum 29",
        rebounds: "J. Tatum 10",
        assists: "D. Schroder 8",
        turnovers: "J. Tatum 6",
      },
      awayTeam: {
        name: "Los Angeles Clippers",
        logo: "https://upload.wikimedia.org/wikipedia/en/b/bb/LA_Clippers_logo.svg",
        score: 114,
        points: "B. Boston Jr. 27",
        rebounds: "T. Mann 10",
        assists: "R. Jackson 7",
        turnovers: "R. Jackson 6",
      },
    },
    {
      gameType: "3vs3",
      date: "DEC 8 2021",
      homeTeam: {
        name: "Portland Trail Blazers",
        logo: "https://upload.wikimedia.org/wikipedia/en/2/21/Portland_Trail_Blazers_logo.svg",
        score: 94,
        points: "N. Powell 26",
        rebounds: "J. Nurkic 13",
        assists: "J. Nurkic 6",
        turnovers: "J. Nurkic 5",
      },
      awayTeam: {
        name: "Golden State Warriors",
        logo: "https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg",
        score: 104,
        points: "S. Curry 22",
        rebounds: "D. Green 10",
        assists: "D. Green 8",
        turnovers: "S. Curry 4",
      },
    },
  ];
  return (
    <>
      <div className="bg-dark text-white font-roboto text-[14px] flex items-center justify-between px-[24px] py-[10px]">
        <div className="">Match List</div>
        <button className="bg-green flex items-center p-[12px] rounded-[10px]">
          <img className="pr-[5px]" src={infoIcon} alt="info-icon" />
          Creat New Match
        </button>
      </div>
      <div className="grid grid-cols-12 gap-[6px] bg-white px-[24px]">
        <div className="col-span-3">
          <DashboardFilter />
        </div>
        <div className="col-span-9 matches-list">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-tgray text-[12px]">
                <th className="p-2">Game</th>
                <th className="p-2">Score</th>
                <th className="p-2">Points</th>
                <th className="p-2">Rebounds</th>
                <th className="p-2">Assists</th>
                <th className="p-2">Turnovers</th>
                <th className="p-2">GameType</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match, index) => (
                <React.Fragment key={index}>
                  {/* Home Team */}
                  <tr className="odd:bg-gray-100 even:bg-white">
                    <td className="p-2 flex items-center space-x-2">
                      <img
                        src={match.homeTeam.logo}
                        alt={match.homeTeam.name}
                        className="h-8 w-8"
                      />
                      <span>{match.homeTeam.name}</span>
                    </td>
                    <td className="p-2 text-center font-bold">
                      {match.homeTeam.score}
                    </td>
                    <td className="p-2 text-center">{match.homeTeam.points}</td>
                    <td className="p-2 text-center">
                      {match.homeTeam.rebounds}
                    </td>
                    <td className="p-2 text-center">
                      {match.homeTeam.assists}
                    </td>
                    <td className="p-2 text-center">
                      {match.homeTeam.turnovers}
                    </td>
                    <td
                      rowSpan={2}
                      className="p-2 text-center font-bold bg-gray-200"
                    >
                      {match.gameType}
                    </td>
                    <td rowSpan={2} className="p-2 text-center">
                      <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                        View Details
                      </button>
                    </td>
                  </tr>

                  {/* Divider */}
                  <tr>
                    <td colSpan={6} className="p-0">
                      <div className="h-1px w-full bg-gray-300"></div>
                    </td>
                  </tr>

                  {/* Away Team */}
                  <tr className="odd:bg-gray-100 even:bg-white">
                    <td className="p-2 flex items-center space-x-2">
                      <img
                        src={match.awayTeam.logo}
                        alt={match.awayTeam.name}
                        className="h-8 w-8"
                      />
                      <span>{match.awayTeam.name}</span>
                    </td>
                    <td className="p-2 text-center font-bold">
                      {match.awayTeam.score}
                    </td>
                    <td className="p-2 text-center">{match.awayTeam.points}</td>
                    <td className="p-2 text-center">
                      {match.awayTeam.rebounds}
                    </td>
                    <td className="p-2 text-center">
                      {match.awayTeam.assists}
                    </td>
                    <td className="p-2 text-center">
                      {match.awayTeam.turnovers}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Games;
