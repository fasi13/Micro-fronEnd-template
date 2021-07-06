import create from 'zustand';

interface myState {
	open: boolean;
	detachSidebar: boolean;
	lastSidebarOpen: boolean;
	setOpen: (opn: boolean) => void;
	setDetachSidebar: (detach: boolean) => void;
	setLastSidebarOpen: (opn: boolean) => void;
}

export const detachStore = create<myState>(set => ({
	open: true,
	detachSidebar: false,
	lastSidebarOpen: true,
	setOpen: (opn: boolean) => set({ open: opn }),
	setDetachSidebar: (detach: boolean) => set({ detachSidebar: detach }),
	setLastSidebarOpen: (opn: boolean) => set({ lastSidebarOpen: opn }),
}));
