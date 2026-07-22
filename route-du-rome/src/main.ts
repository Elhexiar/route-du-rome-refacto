import "./style.css";
import { LeafletMapView } from "./ui/map/MapView";

const app = document.querySelector("#app");

if (app) {
  new LeafletMapView(app as HTMLElement);
}
