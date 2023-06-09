class DOMHelper {
  static moveNodeTo(movedElSelector, destinationElSelector) {
    const movedElNode = document.querySelector(movedElSelector);
    const destinationElNode = document.querySelector(destinationElSelector);
    destinationElNode.append(movedElNode);
  }
}

class Tooltip {
  #tooltipContent;
  #isFirstTime;
  #prjItemEl;
  constructor(tooltipContent, prjItemEl) {
    this.#prjItemEl = prjItemEl;
    this.#tooltipContent = tooltipContent;
    this.#isFirstTime = true;
  }
  show() {
    if (this.#isFirstTime) {
      const tooltipEl = document.createElement("div");
      tooltipEl.className = "card";

      const tooltipTemplate = document.getElementById("tooltip");
      const tooltipBody = document.importNode(tooltipTemplate.content, true);
      tooltipBody.querySelector("p").textContent = this.#tooltipContent;
      tooltipEl.append(tooltipBody);

      const tooltipX = this.#prjItemEl.offsetLeft;
      const tooltipY =
        this.#prjItemEl.offsetTop +
        this.#prjItemEl.offsetHeight -
        this.#prjItemEl.parentElement.scrollTop -
        5;
      tooltipEl.style.position = "absolute";
      tooltipEl.style.left = tooltipX + "px";
      tooltipEl.style.top = tooltipY + "px";

      tooltipEl.addEventListener("click", (_) => {
        tooltipEl.remove();
        this.#isFirstTime = true;
      });
      document.body.append(tooltipEl);
      this.#isFirstTime = false;
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
  #tooltip;

  constructor(id, switchHandler) {
    this.#id = id;
    this.#switchBtnHandler = switchHandler;

    this.#prjItemEl = document.getElementById(this.#id);
    this.#tooltip = new Tooltip(
      this.#prjItemEl.dataset.extraInfo,
      this.#prjItemEl
    );
    this.#titleEl = this.#prjItemEl.querySelector("h2");
    this.#descriptionEl = this.#prjItemEl.querySelector("p");
    this.#moreInfoBtnEl = this.#prjItemEl.querySelector("button");
    this.#switchBtnEl = this.#moreInfoBtnEl.nextElementSibling;

    this.#switchBtnEl.addEventListener("click", (_) => {
      this.#switchBtnHandler(this);
      this.#prjItemEl.scrollIntoView({ behavior: "smooth" });
    });

    this.#moreInfoBtnEl.addEventListener(
      "click",
      this.#tooltip.show.bind(this.#tooltip)
    );

    // make it draggable
    this.#prjItemEl.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", this.#id);
      e.dataTransfer.effectAllowed = "move";
    });
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

    // make it droppable.
    const prjListEl = document.querySelector(`#${this.type}-projects ul`);

    prjListEl.addEventListener("dragenter", (e) => {
      if (e.dataTransfer.types[0] === "text/plain") {
        prjListEl.parentElement.classList.add("droppable");
        e.preventDefault();
      }
    });

    prjListEl.addEventListener("dragover", (e) => {
      if (e.dataTransfer.types[0] === "text/plain") {
        e.preventDefault();
        // console.log(e);
        // prjListEl.parentElement.classList.add("droppable");
      }
    });

    prjListEl.addEventListener("dragleave", (e) => {
      if (e.dataTransfer.types[0] === "text/plain") {
        // e.preventDefault();
        if (
          e.relatedTarget.closest(`#${this.type}-projects ul`) !== prjListEl
        ) {
          prjListEl.parentElement.classList.remove("droppable");
        }
      }
    });

    prjListEl.addEventListener("drop", (e) => {
      const prjId = e.dataTransfer.getData("text/plain");
      prjListEl.parentElement.classList.remove("droppable");

      // check if its the same list
      for (const p of this.projects.values()) {
        if (p.id === prjId) return;
      }

      document.querySelector(`#${prjId} button:last-of-type`).click();

    });
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
