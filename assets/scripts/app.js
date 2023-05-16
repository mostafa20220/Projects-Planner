class DOMHelper {
  static moveNodeTo(movedElSelector, destinationElSelector) {
    const movedElNode = document.querySelector(movedElSelector);
    const destinationElNode = document.querySelector(destinationElSelector);
    destinationElNode.append(movedElNode);
  }
}

class Tooltip {
  isFirstTime = true;
  show() {
    if (this.isFirstTime) {
      const tooltipEl = document.createElement("div");
      tooltipEl.className = "card";
      tooltipEl.textContent = `This is the Tooltip!`;
      tooltipEl.addEventListener("click", (_) => {
        tooltipEl.remove();
        this.isFirstTime = true;
      });
      document.body.append(tooltipEl);
      this.isFirstTime = false;
    }
  }
}

class ProjectItem {
  #id;
  #prjItemEl;
  #titleEl;
  #descriptionEl;
  #moreInfoBtnEl;
  #switchBtnEl;
  #switchBtnHandler;
  #listType;
  tooltip = new Tooltip();

  constructor(id, switchHandler) {
    this.#id = id;
    this.#switchBtnHandler = switchHandler;

    this.#prjItemEl = document.getElementById(this.#id);
    this.#titleEl = this.#prjItemEl.querySelector("h2");
    this.#descriptionEl = this.#prjItemEl.querySelector("p");
    this.#moreInfoBtnEl = this.#prjItemEl.querySelector("button");
    this.#switchBtnEl = this.#moreInfoBtnEl.nextElementSibling;

    this.#switchBtnEl.addEventListener(
      "click",
      this.#switchBtnHandler.bind(null, this)
    );

    this.#moreInfoBtnEl.addEventListener(
      "click",
      this.moreInfoBtnHandler.bind(this)
    );
  }

  updateSwitchBtnHandler(theNewHandler, listType) {
    this.#switchBtnEl.removeEventListener("click", this.#switchBtnHandler);

    this.#switchBtnHandler = theNewHandler;

    this.#switchBtnEl.addEventListener(
      "click",
      this.#switchBtnHandler.bind(null, this)
    );

    this.#listType = listType;
    this.#switchBtnEl.textContent =
      this.#listType === "active" ? "Finish" : "Activate";
  }

  moreInfoBtnHandler() {
    this.tooltip.show();
  }

  get id() {
    return this.#id;
  }
}

class ProjectList {
  projects = new Set();

  constructor(type) {
    this.type = type;
    const prjItems = document.querySelectorAll(`#${this.type}-projects li`);
    prjItems.forEach((p) =>
      this.projects.add(new ProjectItem(p.id, this.switchProject.bind(this)))
    );
  }

  addProject(projectItemObj) {
    this.projects.add(projectItemObj);
    DOMHelper.moveNodeTo(`#${projectItemObj.id}`, `#${this.type}-projects ul`);

    projectItemObj.updateSwitchBtnHandler(
      this.switchProject.bind(this),
      this.type
    );
  }

  switchProject(projectItemObj) {
    this.projects.delete(projectItemObj);
    this.switchHandler(projectItemObj);
    console.log(this.projects);
  }

  setSwitchHandler(switchHandlerFn) {
    this.switchHandler = switchHandlerFn;
  }
}

class App {
  static init() {
    const activeProjectsList = new ProjectList("active");
    const finishedProjectsList = new ProjectList("finished");
    activeProjectsList.setSwitchHandler(
      finishedProjectsList.addProject.bind(finishedProjectsList)
    );
    finishedProjectsList.setSwitchHandler(
      activeProjectsList.addProject.bind(activeProjectsList)
    );
  }
}

App.init();
