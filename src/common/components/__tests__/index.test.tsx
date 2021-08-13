import * as components from '../index';

const {
	Header,
	HeaderSecond,
	HeaderThird,
	HierarchyTree,
	OrbitSVG,
	SearchApplication,
	Sidebar,
	UserMenu,
} = components;
describe('components imports and re-exports', () => {
	it('re-exports the following items', () => {
		expect(Header).toBeTruthy();
		expect(HeaderSecond).toBeTruthy();
		expect(HeaderThird).toBeTruthy();
		expect(HierarchyTree).toBeTruthy();
		expect(OrbitSVG).toBeTruthy();
		expect(SearchApplication).toBeTruthy();
		expect(Sidebar).toBeTruthy();
		expect(UserMenu).toBeTruthy();
	});
});

// test ./index.tsx
