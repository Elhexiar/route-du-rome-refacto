import { ApplicationContainer } from "./bootstrap/ApplicationContainer";
import "./style.css";

const app = document.querySelector<HTMLElement>("#app");

if (app) {
  // Bootstrap entire application dependency graph through the container
  // Services and views can access the eventBus for pub/sub communication
  ApplicationContainer.create(app);
}

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}
