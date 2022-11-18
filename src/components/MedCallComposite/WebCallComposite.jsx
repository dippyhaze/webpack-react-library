import * as React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import CallCompositeWrapper from "./CallCompositeWrapper";

export class WebCallComposite extends HTMLElement {
  static get observedAttributes() {
    return ["participantids", "token", "displayname", "userid"];
  }

  customAttributesAreValid() {
    const tokenIsValid =
      this.attributes.getNamedItem("token") &&
      this.attributes.getNamedItem("token").value !== "";
    const participantidsIsValid =
      this.attributes.getNamedItem("participantids") &&
      this.attributes.getNamedItem("participantids").value !== "";
    const displaynameIsValid =
      this.attributes.getNamedItem("displayname") &&
      this.attributes.getNamedItem("displayname").value !== "";
    const useridIsValid =
      this.attributes.getNamedItem("userid") &&
      this.attributes.getNamedItem("userid").value !== "";
    return (
      tokenIsValid &&
      participantidsIsValid &&
      displaynameIsValid &&
      useridIsValid
    );
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.mount();
  }

  mount() {
    const props = {
      ...this.getProps(this.attributes),
      ...this.getEvents(),
      children: this.parseHtmlToReact(this.innerHTML),
    };
    if (this.customAttributesAreValid()) {
      render(<CallCompositeWrapper {...props} />, this);
    } else render(<h3> Initializing ...</h3>, this);
  }

  unmount() {
    unmountComponentAtNode(this);
  }

  disconnectedCallback() {
    this.unmount();
  }

  connectedCallback() {
    this.mount();
  }

  parseHtmlToReact(html) {
    return html;
  }

  getProps(attributes) {
    return [...attributes]
      .filter((attr) => attr.name !== "style")
      .map((attr) => this.convert(attr.name, attr.value))
      .reduce((props, prop) => ({ ...props, [prop.name]: prop.value }), {});
  }

  getEvents() {
    return Object.values(this.attributes)
      .filter((key) => /on([a-z].*)/.exec(key.name))
      .reduce(
        (events, ev) => ({
          ...events,
          [ev.name]: (args) =>
            this.dispatchEvent(new CustomEvent(ev.name, { ...args })),
        }),
        {}
      );
  }

  convert(attrName, attrValue) {
    let value = attrValue;
    if (attrValue === "true" || attrValue === "false")
      value = attrValue === "true";
    else if (!isNaN(attrValue) && attrValue !== "") value = +attrValue;
    else if (/^{.*}/.exec(attrValue)) value = JSON.parse(attrValue);
    return {
      name: attrName,
      value: value,
    };
  }
}
