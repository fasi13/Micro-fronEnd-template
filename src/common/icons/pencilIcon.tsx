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
			className={`${className}`}
			width={width || 470}
			height={height || 470}
			fill="none"
			viewBox="0 0 470 470"
			stroke="#ffff"
			xmlns="http://www.w3.org/2000/svg">
			<path
				d="M456.836 76.168l-64-64.054c-16.125-16.139-44.177-16.17-60.365.031L45.763 301.682a10.733 10.733 0 00-2.688 4.587L.409 455.73a10.682 10.682 0 0010.261 13.606c.979 0 1.969-.136 2.927-.407l149.333-42.703a10.714 10.714 0 004.583-2.69l289.323-286.983c8.063-8.069 12.5-18.787 12.5-30.192 0-11.405-4.437-22.124-12.5-30.193zM285.989 89.737l39.264 39.264-204.996 204.997-14.712-29.434a10.671 10.671 0 00-9.542-5.896H78.921L285.989 89.737zm-259.788 353.4L40.095 394.5l34.742 34.742-48.636 13.895zm123.135-35.177l-51.035 14.579-51.503-51.503 14.579-51.035h28.031l18.385 36.771a10.671 10.671 0 004.771 4.771l36.771 18.385v28.032h.001zm21.334-17.543v-17.082c0-4.042-2.281-7.729-5.896-9.542l-29.434-14.712 204.996-204.996 39.264 39.264-208.93 207.068zM441.784 121.72l-47.033 46.613-93.747-93.747 46.582-47.001c8.063-8.063 22.104-8.063 30.167 0l64 64a21.187 21.187 0 016.25 15.083c0 5.698-2.219 11.052-6.219 15.052z"
				fill="#fff"
			/>
		</svg>
	);
};

export const EyobComp = (name: string) => <div>{name}</div>;
