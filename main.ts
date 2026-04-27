import { Plugin, WorkspaceLeaf } from "obsidian";

export default class ViewActionsMover extends Plugin {
	private observer: MutationObserver | null = null;
	private movedElements: Map<Element, Element> = new Map();
	private rafId: number | null = null;

	onload() {
		this.app.workspace.onLayoutReady(() => {
			this.moveAllViewActions();
			this.watchForChanges();
		});

		// Re-run when the active leaf changes (new tabs, splits, etc.)
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
	private schedule() {
		if (this.rafId !== null) return;
		this.rafId = requestAnimationFrame(() => {
			this.rafId = null;
			this.moveAllViewActions();
		});
	}

	private moveAllViewActions() {
		// Each split/window can have its own workspace-tab-header-container.
		// We iterate every leaf's container element to cover all of them,
		// but deduplicate by tabsEl so we process each container exactly once.
		const seen = new Set<Element>();
		this.app.workspace.iterateAllLeaves((leaf: WorkspaceLeaf) => {
			const root = (leaf as any).containerEl as HTMLElement | undefined;
			if (!root) return;

			const tabsEl = root.closest(".workspace-tabs");
			if (!tabsEl || seen.has(tabsEl)) return;
			if (tabsEl.closest(".mod-sidedock")) return;
			seen.add(tabsEl);

			this.moveViewActionsInTabsEl(tabsEl as HTMLElement);
		});
	}

	private moveViewActionsInTabsEl(tabsEl: HTMLElement) {
		const headerContainer = tabsEl.querySelector<HTMLElement>(
			".workspace-tab-header-container"
		);
		if (!headerContainer) return;

		// Prefer the active leaf's view-actions; fall back to any leaf's.
		// This only finds elements still inside the leaf — not ones we already moved.
		const viewActions =
			tabsEl.querySelector<HTMLElement>(
				".workspace-leaf.mod-active .workspace-leaf-content .view-actions"
			) ??
			tabsEl.querySelector<HTMLElement>(
				".workspace-leaf-content .view-actions"
			);

		// Nothing in the leaf content means the right element is already in the
		// header from a previous move. Leave it alone to avoid a restore→move loop.
		if (!viewActions) return;

		// Already in the header — nothing to do.
		if (headerContainer.contains(viewActions)) return;

		// We have a new element to place. Only now is it safe to remove stale
		// ones — we have a replacement, so the header won't end up empty.
		headerContainer.querySelectorAll<HTMLElement>(".view-actions").forEach((existing) => {
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
			this.movedElements.set(viewActions, viewActions.parentElement!);
		}

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
		this.observer = new MutationObserver(() => this.schedule());

		this.observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}
}
