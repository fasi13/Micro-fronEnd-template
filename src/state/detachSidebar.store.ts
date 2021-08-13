import createStore from '../util/immer';

interface TDetachState {
	open: boolean;
	detachSidebar: boolean;
	lastSidebarOpen: boolean;
	setOpen: (open: boolean) => void;
	setDetachSidebar: (detach: boolean) => void;
	setLastSidebarOpen: (open: boolean) => void;
}

export const detachStore = (set: any) => ({
	open: true,
	detachSidebar: false,
	lastSidebarOpen: true,
	setOpen: (open: boolean) =>
		set((state: TDetachState) => {
			state.open = open;
		}),
	setDetachSidebar: (detach: boolean) =>
		set((state: TDetachState) => {
			state.detachSidebar = detach;
		}),
	setLastSidebarOpen: (open: boolean) =>
		set((state: TDetachState) => {
			state.lastSidebarOpen = open;
		}),
});

export const useDetachStore = createStore<TDetachState>(detachStore);
