import { WebCallComposite } from "./WebCallComposite";

customElements.get("call-composite") ||
  customElements.define("call-composite", WebCallComposite);
