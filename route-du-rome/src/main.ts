import { GameManager } from "./controllers/GameManager";
import "./style.css";

const app = document.querySelector("#app");

GameManager.init(app);
