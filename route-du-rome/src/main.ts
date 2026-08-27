import { GameManager } from "./controllers/GameManager";
import "./style.css";

const app = document.querySelector<HTMLElement>("#app");

GameManager.init(app);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}
