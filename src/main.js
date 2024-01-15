import OBR from "@owlbear-rodeo/sdk";
import { createInstantSummonsTool, createPlaceMonstersToolMode, createChooseMonsterToolAction } from '/src/create-tools.js';


OBR.onReady(() => {
  createInstantSummonsTool();
  createPlaceMonstersToolMode();
  createChooseMonsterToolAction();
});
