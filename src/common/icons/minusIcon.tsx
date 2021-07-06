import React from 'react';

interface PropTypes extends React.ComponentPropsWithoutRef<'svg'> {
	className: string;
	width: number;
	height: number;
}
export const MinusIcon: React.FunctionComponent<PropTypes> = (
	props: PropTypes,
) => {
	const { className, width, height } = props;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`${className}`}
			width={width || 22}
			height={height || 22}
			viewBox="0 0 22 22"
			fill="none">
			<rect width="22" height="22" fill="#96A6B3" rx="2" />
			<path fill="#385369" d="M5 10h12v2H5z" />
		</svg>
	);
};

export default MinusIcon;
