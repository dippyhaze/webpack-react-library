import * as React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import CallCompositeWrapper from "./CallCompositeWrapper";

export class WebCallComposite extends HTMLElement {
  disconnectedCallback() {
    this.unmount();
  }

  connectedCallback() {
    this.mount();
  }

  mount() {
    const props = {
      ...this.getProps(this.attributes),
      ...this.getEvents(),
      children: this.parseHtmlToReact(this.innerHTML),
    };
    console.log({ ...props });
    render(<CallCompositeWrapper {...props} />, this);
  }

  unmount() {
    unmountComponentAtNode(this);
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
