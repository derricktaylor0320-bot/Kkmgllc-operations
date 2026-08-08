import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  FOOTBALL_TEAM_DESIGNS,
  footballTeamLogoAlt,
} from "./footballTeams";
import { LOGO_ALT_SET } from "./logoNames";

test("Football Sports Edition contains 28 unique uploaded designs", () => {
  assert.equal(FOOTBALL_TEAM_DESIGNS.length, 28);
  assert.equal(
    new Set(FOOTBALL_TEAM_DESIGNS.map((team) => team.id)).size,
    FOOTBALL_TEAM_DESIGNS.length,
  );
  assert.equal(
    new Set(FOOTBALL_TEAM_DESIGNS.map((team) => team.name)).size,
    FOOTBALL_TEAM_DESIGNS.length,
  );
});

test("every football design has an image in the canonical folder", () => {
  const assetDirectory = path.resolve(
    process.cwd(),
    "attached_assets",
    "seasonal-football-sports-edition",
  );

  for (const team of FOOTBALL_TEAM_DESIGNS) {
    assert.equal(
      existsSync(path.join(assetDirectory, team.assetFile)),
      true,
      `Missing artwork for ${team.name}: ${team.assetFile}`,
    );
  }
});

test("every football design is accepted by server-side logo validation", () => {
  for (const team of FOOTBALL_TEAM_DESIGNS) {
    assert.equal(LOGO_ALT_SET.has(footballTeamLogoAlt(team.name)), true);
  }
});
