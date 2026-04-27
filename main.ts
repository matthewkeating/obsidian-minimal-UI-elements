import { Plugin, WorkspaceLeaf } from "obsidian";

export default class ViewActionsMover extends Plugin {
	private observer: MutationObserver | null = null;
	// Track original parents so we can restore on unload
	private movedElements: Map<Element, Element> = new Map();

	onload() {
		this.app.workspace.onLayoutReady(() => {
			this.moveAllViewActions();
			this.watchForChanges();
		});

		// Re-run when the active leaf changes (new tabs, splits, etc.)
		this.registerEvent(
			this.app.workspace.on("layout-change", () => this.moveAllViewActions())
		);
		this.registerEvent(
			this.app.workspace.on("active-leaf-change", () => this.moveAllViewActions())
		);
	}

	onunload() {
		this.observer?.disconnect();
		this.observer = null;
		this.restoreAll();
	}

	private moveAllViewActions() {
		// Each split/window can have its own workspace-tab-header-container.
		// We iterate every leaf's container element to cover all of them.
		this.app.workspace.iterateAllLeaves((leaf: WorkspaceLeaf) => {
			const root = (leaf as any).containerEl as HTMLElement | undefined;
			if (!root) return;

			// Walk up to find the workspace-tabs wrapper that owns this leaf.
			const tabsEl = root.closest(".workspace-tabs");
			if (!tabsEl) return;

			this.moveViewActionsInTabsEl(tabsEl as HTMLElement);
		});
	}

	private moveViewActionsInTabsEl(tabsEl: HTMLElement) {
		const headerContainer = tabsEl.querySelector<HTMLElement>(
			".workspace-tab-header-container"
		);
		if (!headerContainer) return;

		// The active leaf's view-actions lives inside .workspace-leaf-content
		// which is inside the tabsEl.
		const viewActions = tabsEl.querySelector<HTMLElement>(
			".workspace-leaf-content .view-actions"
		);
		if (!viewActions) return;

		// Already moved into this header — nothing to do.
		if (headerContainer.contains(viewActions)) return;

		// Remember original parent for clean restore on unload.
		if (!this.movedElements.has(viewActions)) {
			this.movedElements.set(viewActions, viewActions.parentElement!);
		}

		// Append to the right of the tab list inside the header container.
		headerContainer.appendChild(viewActions);
	}

	private restoreAll() {
		for (const [el, originalParent] of this.movedElements) {
			if (el.isConnected && originalParent.isConnected) {
				originalParent.appendChild(el);
			}
		}
		this.movedElements.clear();
	}

	private watchForChanges() {
		// Use a MutationObserver to catch Obsidian rebuilding the DOM after
		// tab switches, pane splits, or theme changes.
		this.observer = new MutationObserver(() => {
			this.moveAllViewActions();
		});

		this.observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}
}
