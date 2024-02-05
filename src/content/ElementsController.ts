export default class ElementController {
  private body: HTMLBodyElement;
  private elements: NodeListOf<HTMLElement>;
  private abortController: AbortController;

  constructor() {
    this.body = document.querySelector("body");
    this.elements = document.querySelectorAll("button, a, input");
    this.abortController = new AbortController();
  }

  public init() {
    this.setBodyStyle();
    this.setTargetListeners();
  }

  public setBodyStyle() {
    this.body.classList.add("cws-body-selection");
  }

  public removeBodyStyle() {
    this.body.classList.remove("cws-body-selection");
  }

  public setTargetListeners() {
    this.elements.forEach((element) => {
      element.addEventListener("mouseover", this.selectTarget, {
        signal: this.abortController.signal,
        capture: true,
      });
      element.addEventListener("mouseout", this.removeTarget, {
        signal: this.abortController.signal,
        capture: true,
      });
      element.addEventListener("mousedown", this.clickTarget, {
        signal: this.abortController.signal,
        capture: true,
      });
      element.addEventListener("click", this.preventDef, {
        signal: this.abortController.signal,
      });
    });
  }

  private selectTarget(event) {
    this.preventDef(event);
    event.currentTarget.style.outline = "solid 3px red";
  }

  private removeTarget(event) {
    this.preventDef(event);
    event.currentTarget.style.outline = "none";
  }

  private clickTarget(event) {
    this.preventDef(event);
    event.currentTarget.style.outline = "solid 3px green";

    console.log(event.currentTarget);
    console.log(window.location.href);
    return event.currentTarget;
  }

  private preventDef(event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
