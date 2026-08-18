export const FOOTBALL_SPORTS_EDITION_SECTION =
  "Football Teams Sports Edition";

export const FOOTBALL_TEAM_DESIGNS = [
  { id: "400", name: "Atlanta Falcons", assetFile: "atl_falcons.jpg" },
  { id: "401", name: "Baltimore Ravens", assetFile: "bal_ravens.jpeg" },
  { id: "402", name: "Buffalo Bills", assetFile: "buf_bills.jpeg" },
  { id: "403", name: "Carolina Panthers", assetFile: "car_panthers.jpg" },
  { id: "404", name: "Chicago Bears", assetFile: "chi_bears.jpeg" },
  { id: "405", name: "Cincinnati Bengals", assetFile: "cin_bengals.jpg" },
  { id: "406", name: "Cleveland Browns", assetFile: "cle_browns.jpeg" },
  { id: "407", name: "Dallas Cowboys", assetFile: "dal_cowboys.jpeg" },
  { id: "408", name: "Detroit Lions", assetFile: "det_lions.jpg" },
  { id: "409", name: "Green Bay Packers", assetFile: "gb_packers.jpg" },
  { id: "410", name: "Indianapolis Colts", assetFile: "ind_colts.jpeg" },
  {
    id: "411",
    name: "Jacksonville Jaguars",
    assetFile: "jax_jaguars.jpg",
  },
  { id: "412", name: "Kansas City Chiefs", assetFile: "kc_chiefs.png" },
  {
    id: "413",
    name: "Los Angeles Chargers",
    assetFile: "lac_chargers.jpg",
  },
  { id: "414", name: "Los Angeles Rams", assetFile: "lar_rams.jpg" },
  { id: "415", name: "Miami Dolphins", assetFile: "mia_dolphins.jpeg" },
  { id: "416", name: "Minnesota Vikings", assetFile: "min_vikings.jpg" },
  {
    id: "417",
    name: "New England Patriots",
    assetFile: "ne_patriots.png",
  },
  { id: "418", name: "New Orleans Saints", assetFile: "no_saints.jpg" },
  { id: "419", name: "New York Giants", assetFile: "nyg_giants.jpg" },
  { id: "420", name: "New York Jets", assetFile: "nyj_jets.jpeg" },
  {
    id: "421",
    name: "Philadelphia Eagles",
    assetFile: "phi_eagles.jpg",
  },
  { id: "422", name: "Pittsburgh Steelers", assetFile: "pit_steelers.png" },
  {
    id: "423",
    name: "Raiders — Legacy Oakland Edition",
    assetFile: "lv_raiders_legacy.jpg",
  },
  { id: "424", name: "San Francisco 49ers", assetFile: "sf_49ers.png" },
  { id: "425", name: "Seattle Seahawks", assetFile: "sea_seahawks.jpg" },
  {
    id: "426",
    name: "Tampa Bay Buccaneers",
    assetFile: "tb_buccaneers.jpg",
  },
  {
    id: "427",
    name: "Washington Commanders",
    assetFile: "was_commanders.jpg",
  },
] as const;

export type FootballTeamDesign = (typeof FOOTBALL_TEAM_DESIGNS)[number];
export type FootballTeamLogoId = FootballTeamDesign["id"];

export function footballTeamLogoAlt(teamName: string): string {
  return `Khomplete Khemistri Football Sports Edition - ${teamName}`;
}
