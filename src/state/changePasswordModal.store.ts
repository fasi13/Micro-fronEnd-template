import createStore from '../util/immer';

interface TChangePasswordModalState {
	showChangePasswordModal: boolean;
	setShowChangePasswordModal: (opn: boolean) => void;
}

export const changePasswordModalStore = (set: any) => ({
	showChangePasswordModal: false,
	setShowChangePasswordModal: (opn: boolean) =>
		set((state: TChangePasswordModalState) => {
			state.showChangePasswordModal = opn;
		}),
});

export const useChangePasswordModalStore =
	createStore<TChangePasswordModalState>(changePasswordModalStore);
