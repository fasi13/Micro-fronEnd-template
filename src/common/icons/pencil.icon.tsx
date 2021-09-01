import React from 'react';

interface PropTypes extends React.ComponentPropsWithoutRef<'svg'> {
	className: string;
	width: number;
	height: number;
}

export const PencilIcon: React.FunctionComponent<PropTypes> = (
	props: PropTypes,
) => {
	const { className, width, height } = props;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`${className}`}
			width={width}
			height={height}
			fill="none"
			viewBox="0 0 128 128">
			<path
				fill="#fff"
				d="M110.734 19.899L92.103 1.266a4.32 4.32 0 00-6.11-.001L67.359 19.899l-.008.008L31.61 55.65a4.32 4.32 0 00-1.263 2.923l-.585 19.217a4.321 4.321 0 004.45 4.449l19.216-.586a4.322 4.322 0 002.923-1.263l54.383-54.381a4.32 4.32 0 000-6.11zM89.046 35.476L76.523 22.955 89.048 10.43l12.521 12.523-12.523 12.523zM51.453 73.069l-12.915.394.393-12.915 31.482-31.484 12.524 12.522L51.453 73.07z"
			/>
			<path
				fill="#fff"
				d="M76.144 67.448a4.32 4.32 0 00-4.32 4.32v31.592H8.64V40.177h31.591a4.32 4.32 0 100-8.64H4.321A4.32 4.32 0 000 35.856v71.822a4.32 4.32 0 004.32 4.32h71.823a4.32 4.32 0 004.32-4.32V71.767a4.319 4.319 0 00-4.32-4.32z"
			/>
		</svg>
	);
};
