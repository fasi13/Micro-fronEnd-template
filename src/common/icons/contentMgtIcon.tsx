import { SvgIcon } from '@material-ui/core';
import React from 'react';

interface PropTypes extends React.ComponentPropsWithoutRef<'svg'> {
	className: string;
	width: number;
	height: number;
}

export const ContentMgtIcon: React.FunctionComponent<PropTypes> = (
	props: PropTypes,
) => {
	const { className, width, height } = props;

	return (
		<SvgIcon
			xmlns="http://www.w3.org/2000/svg"
			className={`${className}`}
			width={width}
			height={height}
			fill="#6D899E"
			x="0px"
			y="0px"
			viewBox="0 0 480 480">
			<path d="m370.589844 230.964844c-5.523438 0-10 4.476562-10 10v88.792968c-.019532 16.558594-13.4375 29.980469-30 30h-280.589844c-16.5625-.019531-29.980469-13.441406-30-30v-260.589843c.019531-16.5625 13.4375-29.980469 30-30h88.789062c5.523438 0 10-4.476563 10-10 0-5.523438-4.476562-10-10-10h-88.789062c-27.601562.03125-49.96875 22.398437-50 50v260.589843c.03125 27.601563 22.398438 49.96875 50 50h280.589844c27.601562-.03125 49.96875-22.398437 50-50v-88.789062c0-5.523438-4.476563-10.003906-10-10.003906zm0 0" />
			<path d="m156.367188 178.34375 146.011718-146.015625 47.089844 47.089844-146.011719 146.015625zm0 0" />
			<path d="m132.542969 249.257812 52.039062-14.414062-37.625-37.625zm0 0" />
			<path d="m362.488281 7.578125c-9.769531-9.746094-25.585937-9.746094-35.355469 0l-10.605468 10.605469 47.089844 47.089844 10.605468-10.605469c9.75-9.769531 9.75-25.585938 0-35.355469zm0 0" />
		</SvgIcon>
	);
};
