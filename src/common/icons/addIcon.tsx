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
			width={width || 512}
			height={height || 512}
			viewBox="0 0 512 512">
			<circle cx="256" cy="256" r="256" fill="#fff" fillOpacity="0.75" />
			<path
				fill="#3F98E3"
				d="M375.001 239.001H272.999V136.999c0-9.383-7.616-16.999-16.999-16.999s-16.999 7.616-16.999 16.999v102.002H136.999c-9.383 0-16.999 7.616-16.999 16.999s7.616 16.999 16.999 16.999h102.002v102.002c0 9.383 7.616 16.999 16.999 16.999s16.999-7.616 16.999-16.999V272.999h102.002c9.383 0 16.999-7.616 16.999-16.999s-7.614-16.999-16.999-16.999z"
			/>
		</svg>
	);
};
