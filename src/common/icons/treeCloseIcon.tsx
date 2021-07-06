import React from 'react';

interface PropTypes extends React.ComponentPropsWithoutRef<'svg'> {
	className: string;
	width: number;
	height: number;
}
export const TreeCloseIcon: React.FunctionComponent<PropTypes> = (
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
			<path
				fill="#385369"
				d="M6.05 14.536l8.486-8.485 1.414 1.414-8.485 8.485z"
			/>
			<path
				fill="#385369"
				d="M7.464 6.05l8.486 8.485-1.415 1.414L6.05 7.464z"
			/>
		</svg>
	);
};

export default TreeCloseIcon;
