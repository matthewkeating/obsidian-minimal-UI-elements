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
      if (tabsEl.closest(".mod-sidedock")) return;
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgUGx1Z2luLCBXb3Jrc3BhY2VMZWFmIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXdBY3Rpb25zTW92ZXIgZXh0ZW5kcyBQbHVnaW4ge1xuXHRwcml2YXRlIG9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyIHwgbnVsbCA9IG51bGw7XG5cdHByaXZhdGUgbW92ZWRFbGVtZW50czogTWFwPEVsZW1lbnQsIEVsZW1lbnQ+ID0gbmV3IE1hcCgpO1xuXHRwcml2YXRlIHJhZklkOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuXHRvbmxvYWQoKSB7XG5cdFx0dGhpcy5hcHAud29ya3NwYWNlLm9uTGF5b3V0UmVhZHkoKCkgPT4ge1xuXHRcdFx0dGhpcy5tb3ZlQWxsVmlld0FjdGlvbnMoKTtcblx0XHRcdHRoaXMud2F0Y2hGb3JDaGFuZ2VzKCk7XG5cdFx0fSk7XG5cblx0XHQvLyBSZS1ydW4gd2hlbiB0aGUgYWN0aXZlIGxlYWYgY2hhbmdlcyAobmV3IHRhYnMsIHNwbGl0cywgZXRjLilcblx0XHR0aGlzLnJlZ2lzdGVyRXZlbnQoXG5cdFx0XHR0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJsYXlvdXQtY2hhbmdlXCIsICgpID0+IHRoaXMuc2NoZWR1bGUoKSlcblx0XHQpO1xuXHRcdHRoaXMucmVnaXN0ZXJFdmVudChcblx0XHRcdHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImFjdGl2ZS1sZWFmLWNoYW5nZVwiLCAoKSA9PiB0aGlzLnNjaGVkdWxlKCkpXG5cdFx0KTtcblx0fVxuXG5cdG9udW5sb2FkKCkge1xuXHRcdGlmICh0aGlzLnJhZklkICE9PSBudWxsKSB7XG5cdFx0XHRjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnJhZklkKTtcblx0XHRcdHRoaXMucmFmSWQgPSBudWxsO1xuXHRcdH1cblx0XHR0aGlzLm9ic2VydmVyPy5kaXNjb25uZWN0KCk7XG5cdFx0dGhpcy5vYnNlcnZlciA9IG51bGw7XG5cdFx0dGhpcy5yZXN0b3JlQWxsKCk7XG5cdH1cblxuXHQvLyBDb2FsZXNjZSByYXBpZC1maXJlIHRyaWdnZXJzIChvYnNlcnZlciArIHdvcmtzcGFjZSBldmVudHMpIGludG8gb25lIHJ1biBwZXIgZnJhbWUuXG5cdHByaXZhdGUgc2NoZWR1bGUoKSB7XG5cdFx0aWYgKHRoaXMucmFmSWQgIT09IG51bGwpIHJldHVybjtcblx0XHR0aGlzLnJhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcblx0XHRcdHRoaXMucmFmSWQgPSBudWxsO1xuXHRcdFx0dGhpcy5tb3ZlQWxsVmlld0FjdGlvbnMoKTtcblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgbW92ZUFsbFZpZXdBY3Rpb25zKCkge1xuXHRcdC8vIEVhY2ggc3BsaXQvd2luZG93IGNhbiBoYXZlIGl0cyBvd24gd29ya3NwYWNlLXRhYi1oZWFkZXItY29udGFpbmVyLlxuXHRcdC8vIFdlIGl0ZXJhdGUgZXZlcnkgbGVhZidzIGNvbnRhaW5lciBlbGVtZW50IHRvIGNvdmVyIGFsbCBvZiB0aGVtLFxuXHRcdC8vIGJ1dCBkZWR1cGxpY2F0ZSBieSB0YWJzRWwgc28gd2UgcHJvY2VzcyBlYWNoIGNvbnRhaW5lciBleGFjdGx5IG9uY2UuXG5cdFx0Y29uc3Qgc2VlbiA9IG5ldyBTZXQ8RWxlbWVudD4oKTtcblx0XHR0aGlzLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUFsbExlYXZlcygobGVhZjogV29ya3NwYWNlTGVhZikgPT4ge1xuXHRcdFx0Y29uc3Qgcm9vdCA9IChsZWFmIGFzIGFueSkuY29udGFpbmVyRWwgYXMgSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cdFx0XHRpZiAoIXJvb3QpIHJldHVybjtcblxuXHRcdFx0Y29uc3QgdGFic0VsID0gcm9vdC5jbG9zZXN0KFwiLndvcmtzcGFjZS10YWJzXCIpO1xuXHRcdFx0aWYgKCF0YWJzRWwgfHwgc2Vlbi5oYXModGFic0VsKSkgcmV0dXJuO1xuXHRcdFx0aWYgKHRhYnNFbC5jbG9zZXN0KFwiLm1vZC1zaWRlZG9ja1wiKSkgcmV0dXJuO1xuXHRcdFx0c2Vlbi5hZGQodGFic0VsKTtcblxuXHRcdFx0dGhpcy5tb3ZlVmlld0FjdGlvbnNJblRhYnNFbCh0YWJzRWwgYXMgSFRNTEVsZW1lbnQpO1xuXHRcdH0pO1xuXHR9XG5cblx0cHJpdmF0ZSBtb3ZlVmlld0FjdGlvbnNJblRhYnNFbCh0YWJzRWw6IEhUTUxFbGVtZW50KSB7XG5cdFx0Y29uc3QgaGVhZGVyQ29udGFpbmVyID0gdGFic0VsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFxuXHRcdFx0XCIud29ya3NwYWNlLXRhYi1oZWFkZXItY29udGFpbmVyXCJcblx0XHQpO1xuXHRcdGlmICghaGVhZGVyQ29udGFpbmVyKSByZXR1cm47XG5cblx0XHQvLyBQcmVmZXIgdGhlIGFjdGl2ZSBsZWFmJ3Mgdmlldy1hY3Rpb25zOyBmYWxsIGJhY2sgdG8gYW55IGxlYWYncy5cblx0XHQvLyBUaGlzIG9ubHkgZmluZHMgZWxlbWVudHMgc3RpbGwgaW5zaWRlIHRoZSBsZWFmIFx1MjAxNCBub3Qgb25lcyB3ZSBhbHJlYWR5IG1vdmVkLlxuXHRcdGNvbnN0IHZpZXdBY3Rpb25zID1cblx0XHRcdHRhYnNFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50Pihcblx0XHRcdFx0XCIud29ya3NwYWNlLWxlYWYubW9kLWFjdGl2ZSAud29ya3NwYWNlLWxlYWYtY29udGVudCAudmlldy1hY3Rpb25zXCJcblx0XHRcdCkgPz9cblx0XHRcdHRhYnNFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50Pihcblx0XHRcdFx0XCIud29ya3NwYWNlLWxlYWYtY29udGVudCAudmlldy1hY3Rpb25zXCJcblx0XHRcdCk7XG5cblx0XHQvLyBOb3RoaW5nIGluIHRoZSBsZWFmIGNvbnRlbnQgbWVhbnMgdGhlIHJpZ2h0IGVsZW1lbnQgaXMgYWxyZWFkeSBpbiB0aGVcblx0XHQvLyBoZWFkZXIgZnJvbSBhIHByZXZpb3VzIG1vdmUuIExlYXZlIGl0IGFsb25lIHRvIGF2b2lkIGEgcmVzdG9yZVx1MjE5Mm1vdmUgbG9vcC5cblx0XHRpZiAoIXZpZXdBY3Rpb25zKSByZXR1cm47XG5cblx0XHQvLyBBbHJlYWR5IGluIHRoZSBoZWFkZXIgXHUyMDE0IG5vdGhpbmcgdG8gZG8uXG5cdFx0aWYgKGhlYWRlckNvbnRhaW5lci5jb250YWlucyh2aWV3QWN0aW9ucykpIHJldHVybjtcblxuXHRcdC8vIFdlIGhhdmUgYSBuZXcgZWxlbWVudCB0byBwbGFjZS4gT25seSBub3cgaXMgaXQgc2FmZSB0byByZW1vdmUgc3RhbGVcblx0XHQvLyBvbmVzIFx1MjAxNCB3ZSBoYXZlIGEgcmVwbGFjZW1lbnQsIHNvIHRoZSBoZWFkZXIgd29uJ3QgZW5kIHVwIGVtcHR5LlxuXHRcdGhlYWRlckNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi52aWV3LWFjdGlvbnNcIikuZm9yRWFjaCgoZXhpc3RpbmcpID0+IHtcblx0XHRcdGlmICghdGhpcy5tb3ZlZEVsZW1lbnRzLmhhcyhleGlzdGluZykpIHJldHVybjtcblx0XHRcdGNvbnN0IG9yaWdpbmFsUGFyZW50ID0gdGhpcy5tb3ZlZEVsZW1lbnRzLmdldChleGlzdGluZyk7XG5cdFx0XHRpZiAob3JpZ2luYWxQYXJlbnQ/LmlzQ29ubmVjdGVkKSB7XG5cdFx0XHRcdG9yaWdpbmFsUGFyZW50LmFwcGVuZENoaWxkKGV4aXN0aW5nKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGV4aXN0aW5nLnJlbW92ZSgpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5tb3ZlZEVsZW1lbnRzLmRlbGV0ZShleGlzdGluZyk7XG5cdFx0fSk7XG5cblx0XHRpZiAoIXRoaXMubW92ZWRFbGVtZW50cy5oYXModmlld0FjdGlvbnMpKSB7XG5cdFx0XHR0aGlzLm1vdmVkRWxlbWVudHMuc2V0KHZpZXdBY3Rpb25zLCB2aWV3QWN0aW9ucy5wYXJlbnRFbGVtZW50ISk7XG5cdFx0fVxuXG5cdFx0aGVhZGVyQ29udGFpbmVyLmFwcGVuZENoaWxkKHZpZXdBY3Rpb25zKTtcblx0fVxuXG5cdHByaXZhdGUgcmVzdG9yZUFsbCgpIHtcblx0XHRmb3IgKGNvbnN0IFtlbCwgb3JpZ2luYWxQYXJlbnRdIG9mIHRoaXMubW92ZWRFbGVtZW50cykge1xuXHRcdFx0aWYgKGVsLmlzQ29ubmVjdGVkICYmIG9yaWdpbmFsUGFyZW50LmlzQ29ubmVjdGVkKSB7XG5cdFx0XHRcdG9yaWdpbmFsUGFyZW50LmFwcGVuZENoaWxkKGVsKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5tb3ZlZEVsZW1lbnRzLmNsZWFyKCk7XG5cdH1cblxuXHRwcml2YXRlIHdhdGNoRm9yQ2hhbmdlcygpIHtcblx0XHQvLyBVc2UgYSBNdXRhdGlvbk9ic2VydmVyIHRvIGNhdGNoIE9ic2lkaWFuIHJlYnVpbGRpbmcgdGhlIERPTSBhZnRlclxuXHRcdC8vIHRhYiBzd2l0Y2hlcywgcGFuZSBzcGxpdHMsIG9yIHRoZW1lIGNoYW5nZXMuXG5cdFx0dGhpcy5vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHRoaXMuc2NoZWR1bGUoKSk7XG5cblx0XHR0aGlzLm9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge1xuXHRcdFx0Y2hpbGRMaXN0OiB0cnVlLFxuXHRcdFx0c3VidHJlZTogdHJ1ZSxcblx0XHR9KTtcblx0fVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxzQkFBc0M7QUFFdEMsSUFBcUIsbUJBQXJCLGNBQThDLHVCQUFPO0FBQUEsRUFDNUMsV0FBb0M7QUFBQSxFQUNwQyxnQkFBdUMsb0JBQUksSUFBSTtBQUFBLEVBQy9DLFFBQXVCO0FBQUEsRUFFL0IsU0FBUztBQUNSLFNBQUssSUFBSSxVQUFVLGNBQWMsTUFBTTtBQUN0QyxXQUFLLG1CQUFtQjtBQUN4QixXQUFLLGdCQUFnQjtBQUFBLElBQ3RC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
