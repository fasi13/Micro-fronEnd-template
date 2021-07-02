import create from 'zustand';

interface myState {
	open: boolean;
	tearSidebar: boolean;
	lastSidebarOpen : boolean;
	setOpen: (opn: boolean) => void;
	setTearSidebar: (ter: boolean) => void;
	setLastSidebarOpen:(opn: boolean)=>void;
}

const isTearedStore = create<myState>((set) => ({
	open: true,
	tearSidebar: false,
	lastSidebarOpen: true,
  setOpen: (opn: boolean) => set( ({ open: opn  })),
  setTearSidebar: (ter: boolean) => set(({ tearSidebar: ter  })),
  setLastSidebarOpen: (opn: boolean) => set({ lastSidebarOpen: opn }),
}))
/* eslint-disable import/prefer-default-export */
export default isTearedStore;
