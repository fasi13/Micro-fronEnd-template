import create from 'zustand';

interface myState {
	showChangePasswordModal: boolean;
	setShowChangePasswordModal: (opn: boolean) => void;
}

export const changePasswordModalStore = create<myState>(set => ({
	showChangePasswordModal: false,
	setShowChangePasswordModal: (opn: boolean) => set({ showChangePasswordModal: opn }),
}));
