export interface TLinkStyle {
	index: number;
	link: string;
	first: string;
}

export interface TTextStyleProps {
	index: number;
	last: string;
	first: string;
}

export const linkStyle = (
	index: number,
	link: string,
	first: string,
): string => {
	if (index === 0) return first;
	return link;
};

export const textStyle = (
	index: number,
	last: string,
	first: string,
): string => {
	if (index === 0) return first;
	return last;
};
