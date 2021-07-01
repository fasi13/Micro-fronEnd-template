import create from 'zustand';

interface myState {
	open: boolean;
	tearSidebar: boolean;
	lastSidebarOpen : boolean;
	setOpen: () => void;
	setTearSidebar: () => void;
	setLastSidebarOpen:()=>void;
}

const isTearedStore = create<myState>((set) => ({
	open: true,
	tearSidebar: false,
	lastSidebarOpen: true,
  setOpen: () => set(state => ({ open: !state.open  })),
  setTearSidebar: () => set(state => ({ tearSidebar: !state.tearSidebar  })),
  setLastSidebarOpen: () => set(state => ({ lastSidebarOpen: !state.lastSidebarOpen  })),
}))
/* eslint-disable import/prefer-default-export */
export default isTearedStore;
