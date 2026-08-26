import { GameManager } from "./controllers/GameManager";
import "./style.css";

const app = document.querySelector<HTMLElement>("#app");

GameManager.init(app);
