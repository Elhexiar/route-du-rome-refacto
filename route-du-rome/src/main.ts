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
  GameManager.bind(dependencies);
  GameManager.consoleTestController = new ConsoleTestController({
    heroController: dependencies.heroController,
    npcController: dependencies.npcController,
    dialogueController: dependencies.dialogueController,
    experienceController: dependencies.experienceController,
    questService: dependencies.experienceController.questService,
    badgeService: dependencies.experienceController.badgeService,
  });
}

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}
