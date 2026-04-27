var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ViewActionsMover
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var ViewActionsMover = class extends import_obsidian.Plugin {
  observer = null;
  movedElements = /* @__PURE__ */ new Map();
  rafId = null;
  onload() {
    this.app.workspace.onLayoutReady(() => {
      this.moveAllViewActions();
      this.watchForChanges();
    });
    this.registerEvent(
      this.app.workspace.on("layout-change", () => this.schedule())
    );
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => this.schedule())
    );
  }
  onunload() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.observer?.disconnect();
    this.observer = null;
    this.restoreAll();
  }
  // Coalesce rapid-fire triggers (observer + workspace events) into one run per frame.
  schedule() {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.moveAllViewActions();
    });
  }
  moveAllViewActions() {
    const seen = /* @__PURE__ */ new Set();
    this.app.workspace.iterateAllLeaves((leaf) => {
      const root = leaf.containerEl;
      if (!root) return;
      const tabsEl = root.closest(".workspace-tabs");
      if (!tabsEl || seen.has(tabsEl)) return;
      seen.add(tabsEl);
      this.moveViewActionsInTabsEl(tabsEl);
    });
  }
  moveViewActionsInTabsEl(tabsEl) {
    const headerContainer = tabsEl.querySelector(
      ".workspace-tab-header-container"
    );
    if (!headerContainer) return;
    const viewActions = tabsEl.querySelector(
      ".workspace-leaf.mod-active .workspace-leaf-content .view-actions"
    ) ?? tabsEl.querySelector(
      ".workspace-leaf-content .view-actions"
    );
    if (!viewActions) return;
    if (headerContainer.contains(viewActions)) return;
    headerContainer.querySelectorAll(".view-actions").forEach((existing) => {
      if (!this.movedElements.has(existing)) return;
      const originalParent = this.movedElements.get(existing);
      if (originalParent?.isConnected) {
        originalParent.appendChild(existing);
      } else {
        existing.remove();
      }
      this.movedElements.delete(existing);
    });
    if (!this.movedElements.has(viewActions)) {
      this.movedElements.set(viewActions, viewActions.parentElement);
    }
    headerContainer.appendChild(viewActions);
  }
  restoreAll() {
    for (const [el, originalParent] of this.movedElements) {
      if (el.isConnected && originalParent.isConnected) {
        originalParent.appendChild(el);
      }
    }
    this.movedElements.clear();
  }
  watchForChanges() {
    this.observer = new MutationObserver(() => this.schedule());
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
};
