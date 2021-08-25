import React from 'react';

interface PropTypes extends React.ComponentPropsWithoutRef<'svg'> {
	className: string;
	width: number;
	height: number;
}

export const GroupIcon: React.FunctionComponent<PropTypes> = (
	props: PropTypes,
) => {
	const { className, width, height } = props;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`${className}`}
			width={width}
			height={height}
			viewBox="0 0 106 106"
			fill="none">
			<g fill="#fff" clipPath="url(#clip0)">
				<path d="M103.307 28.28L54.845 6.67a4.51 4.51 0 00-3.693 0L2.692 28.28a4.536 4.536 0 00-.286 8.147L50.865 62.27c.668.359 1.4.534 2.135.534.738 0 1.47-.175 2.139-.534L103.6 36.427a4.545 4.545 0 002.4-4.159 4.554 4.554 0 00-2.693-3.987z" />
				<path d="M99.323 47.617L52.996 72.332 6.675 47.617a4.53 4.53 0 00-6.14 1.87 4.532 4.532 0 001.868 6.138l48.459 25.85c.668.356 1.4.534 2.135.534.738 0 1.47-.175 2.139-.534l48.461-25.85a4.538 4.538 0 10-4.275-8.007z" />
				<path d="M99.323 65.343L52.996 90.05 6.675 65.343a4.53 4.53 0 00-6.14 1.867 4.532 4.532 0 001.868 6.139l48.46 25.841a4.51 4.51 0 002.135.536c.738 0 1.47-.175 2.139-.536l48.461-25.842a4.538 4.538 0 10-4.275-8.005z" />
			</g>
			<defs>
				<clipPath id="clip0">
					<path fill="#fff" d="M0 0h106v106H0z" />
				</clipPath>
			</defs>
		</svg>
	);
};
