import React from 'react';

interface PropTypes extends React.ComponentPropsWithoutRef<'svg'> {
	className: string;
	width: number;
	height: number;
}
export const CloseIcon: React.FunctionComponent<PropTypes> = (
	props: PropTypes,
) => {
	const { className, width, height } = props;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`${className}`}
			width={width}
			height={height}
			viewBox="0 0 329 329"
			fill="none">
			<g clipPath="url(#clip0)">
				<path
					fill="#fff"
					d="M194.641 164.769l128.107-128.11c8.336-8.333 8.336-21.806 0-30.14-8.333-8.332-21.807-8.332-30.14 0L164.498 134.63 36.392 6.52c-8.337-8.333-21.806-8.333-30.14 0-8.336 8.333-8.336 21.806 0 30.14L134.36 164.768 6.253 292.879c-8.337 8.333-8.337 21.807 0 30.14a21.252 21.252 0 0015.07 6.245 21.259 21.259 0 0015.07-6.245l128.105-128.11 128.11 128.11a21.26 21.26 0 0015.07 6.245 21.26 21.26 0 0015.07-6.245c8.336-8.333 8.336-21.807 0-30.14l-128.107-128.11z"
				/>
			</g>
			<defs>
				<clipPath id="clip0">
					<path fill="#fff" d="M0 0h329v329H0z" />
				</clipPath>
			</defs>
		</svg>
	);
};

export default CloseIcon;
