import { linkStyle, textStyle } from '../breadCrumbStyleHelper';

const linkClass = 'link-style';
const firstClass = 'first-style';
const lastClass = 'lastStyle';

describe('linkStyle', () => {
	it(`returns ${firstClass} if index 0`, () => {
		expect(linkStyle(0, linkClass, firstClass)).toBe(firstClass);
	});

	it(`returns ${linkClass} if index is not 0`, () => {
		expect(linkStyle(1, linkClass, firstClass)).toBe(linkClass);
	});
});

describe('textStyle', () => {
	it(`returns ${firstClass} if index 0`, () => {
		expect(textStyle(0, lastClass, firstClass)).toBe(firstClass);
	});

	it(`returns ${linkClass} if index is not 0`, () => {
		expect(textStyle(1, lastClass, firstClass)).toBe(lastClass);
	});
});
