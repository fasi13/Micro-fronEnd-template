import React from 'react';

interface PropTypes extends React.ComponentPropsWithoutRef<'svg'> {
	className: string;
	width: number;
	height: number;
}

export const AddIcon: React.FunctionComponent<PropTypes> = (
	props: PropTypes,
) => {
	const { className, width, height } = props;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`${className}`}
			width={width}
			height={height}
			viewBox="0 0 62 62"
			fill="none">
			<path
				fill="#fff"
				d="M31 0C13.878 0 0 13.878 0 31s13.878 31 31 31 31-13.869 31-31S48.122 0 31 0zm14.468 32.966a2.485 2.485 0 01-2.477 2.478H35.55v7.441a2.485 2.485 0 01-2.478 2.477h-4.135a2.485 2.485 0 01-2.478-2.477v-7.441h-7.441a2.485 2.485 0 01-2.478-2.478v-4.135a2.486 2.486 0 012.478-2.477h7.441v-7.442a2.485 2.485 0 012.478-2.477h4.135a2.485 2.485 0 012.478 2.477v7.442h7.441a2.485 2.485 0 012.477 2.477v4.135z"
			/>
		</svg>
	);
};
