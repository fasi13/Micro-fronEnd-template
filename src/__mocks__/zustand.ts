import actualCreate from 'zustand';

// a variable to hold reset functions for all stores declared in the app
// eslint-disable-next-line @typescript-eslint/ban-types
const stores = new Set<Function>();

// when creating a store, we get its initial state, create a reset function and add it in the set
const create: typeof actualCreate = createState => {
	const store = actualCreate(createState);
	const initialState = store.getState();
	stores.add(() => store.setState(initialState, true));

	return store;
};

afterEach(() => {
	stores.forEach(resetFn => resetFn());
});

export default create;
