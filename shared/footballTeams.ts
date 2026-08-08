export const FOOTBALL_SPORTS_EDITION_SECTION =
  "Football Teams Sports Edition";

export const FOOTBALL_TEAM_DESIGNS = [
  { id: "500", name: "Atlanta Falcons", assetFile: "atl_falcons.jpg" },
  { id: "501", name: "Baltimore Ravens", assetFile: "bal_ravens.jpeg" },
  { id: "502", name: "Buffalo Bills", assetFile: "buf_bills.jpeg" },
  { id: "503", name: "Carolina Panthers", assetFile: "car_panthers.jpg" },
  { id: "504", name: "Chicago Bears", assetFile: "chi_bears.jpeg" },
  { id: "505", name: "Cincinnati Bengals", assetFile: "cin_bengals.jpg" },
  { id: "506", name: "Cleveland Browns", assetFile: "cle_browns.jpeg" },
  { id: "507", name: "Dallas Cowboys", assetFile: "dal_cowboys.jpeg" },
  { id: "508", name: "Detroit Lions", assetFile: "det_lions.jpg" },
  { id: "509", name: "Green Bay Packers", assetFile: "gb_packers.jpg" },
  { id: "510", name: "Indianapolis Colts", assetFile: "ind_colts.jpeg" },
  {
    id: "511",
    name: "Jacksonville Jaguars",
    assetFile: "jax_jaguars.jpg",
  },
  { id: "512", name: "Kansas City Chiefs", assetFile: "kc_chiefs.png" },
  {
    id: "513",
    name: "Los Angeles Chargers",
    assetFile: "lac_chargers.jpg",
  },
  { id: "514", name: "Los Angeles Rams", assetFile: "lar_rams.jpg" },
  { id: "515", name: "Miami Dolphins", assetFile: "mia_dolphins.jpeg" },
  { id: "516", name: "Minnesota Vikings", assetFile: "min_vikings.jpg" },
  {
    id: "517",
    name: "New England Patriots",
    assetFile: "ne_patriots.png",
  },
  { id: "518", name: "New Orleans Saints", assetFile: "no_saints.jpg" },
  { id: "519", name: "New York Giants", assetFile: "nyg_giants.jpg" },
  { id: "520", name: "New York Jets", assetFile: "nyj_jets.jpeg" },
  {
    id: "521",
    name: "Philadelphia Eagles",
    assetFile: "phi_eagles.jpg",
  },
  { id: "522", name: "Pittsburgh Steelers", assetFile: "pit_steelers.png" },
  {
    id: "523",
    name: "Raiders — Legacy Oakland Edition",
    assetFile: "lv_raiders_legacy.jpg",
  },
  { id: "524", name: "San Francisco 49ers", assetFile: "sf_49ers.png" },
  { id: "525", name: "Seattle Seahawks", assetFile: "sea_seahawks.jpg" },
  {
    id: "526",
    name: "Tampa Bay Buccaneers",
    assetFile: "tb_buccaneers.jpg",
  },
  {
    id: "527",
    name: "Washington Commanders",
    assetFile: "was_commanders.jpg",
  },
] as const;

export type FootballTeamDesign = (typeof FOOTBALL_TEAM_DESIGNS)[number];
export type FootballTeamLogoId = FootballTeamDesign["id"];

export function footballTeamLogoAlt(teamName: string): string {
  return `Khomplete Khemistri Football Sports Edition - ${teamName}`;
}
