import "./style.css";
import { DialogueView } from "./ui/DialogueView";
import { LeafletMapView } from "./ui/MapView";

const app = document.querySelector("#app");

if (app) {
  //   const dialogueView = new DialogueView(app as HTMLElement);
  const mapView = new LeafletMapView(app as HTMLElement);
}
