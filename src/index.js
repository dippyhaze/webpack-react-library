import { WebCallComposite } from "./components/MedCallComposite/WebCallComposite";

customElements.get("call-composite") ||
  customElements.define("call-composite", WebCallComposite);
