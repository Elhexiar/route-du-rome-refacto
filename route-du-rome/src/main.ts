import { ApplicationContainer } from "./bootstrap/ApplicationContainer";
import { GameManager } from "./controllers/GameManager";
import { ConsoleTestController } from "./controllers/ConsoleTestController";
import "./style.css";

const app = document.querySelector<HTMLElement>("#app");

if (app) {
  // Bootstrap entire application dependency graph through the container
  // Services and views can access the eventBus for pub/sub communication
  const dependencies = ApplicationContainer.create(app);

  // Keep the legacy singleton available for browser console inspection.
  GameManager.create(app);
  GameManager.heroController = dependencies.heroController;
  GameManager.npcController = dependencies.npcController;
  GameManager.mapController = dependencies.mapController;
  GameManager.dialogueController = dependencies.dialogueController;
  GameManager.experienceController = dependencies.experienceController;
  GameManager.headerView = dependencies.headerView;
  GameManager.consoleTestController = new ConsoleTestController({
    heroController: dependencies.heroController as any,
    npcController: dependencies.npcController,
    dialogueController: dependencies.dialogueController as any,
    experienceController: dependencies.experienceController,
    questService: dependencies.experienceController.questService as any,
    badgeService: dependencies.experienceController.badgeService as any,
  });
}

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}
