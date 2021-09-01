import React from "react";

interface PropTypes extends React.ComponentPropsWithoutRef<'svg'> {
	className: string;
	width: number;
	height: number;
}

export const  GroupIcon: React.FunctionComponent<PropTypes> = (props: PropTypes) =>  {
	const { className, width, height } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}`}
			width={width}
			height={height}
      viewBox="0 0 112 112"
      fill="none"
    >
      <g fill="#fff" clipPath="url(#clip0)">
        <path d="M109.154 29.881L57.949 7.047a4.766 4.766 0 00-3.902 0L2.844 29.88a4.792 4.792 0 00-.302 8.608l51.202 27.306a4.76 4.76 0 002.256.564c.78 0 1.552-.185 2.26-.564l51.204-27.306a4.8 4.8 0 002.535-4.395 4.81 4.81 0 00-2.845-4.213z"/>
        <path d="M104.945 50.313l-48.95 26.112L7.053 50.313a4.786 4.786 0 00-6.486 1.975 4.788 4.788 0 001.973 6.485l51.202 27.314a4.79 4.79 0 002.256.564c.78 0 1.553-.185 2.26-.564l51.204-27.314a4.796 4.796 0 10-4.517-8.46z"/>
        <path d="M104.945 69.042l-48.95 26.104L7.053 69.042a4.787 4.787 0 00-6.486 1.972A4.789 4.789 0 002.54 77.5l51.202 27.305c.706.379 1.48.567 2.256.567.78 0 1.553-.185 2.26-.567L109.462 77.5a4.8 4.8 0 001.974-6.486 4.795 4.795 0 00-6.491-1.972z"/>
      </g>
      <defs>
        <clipPath id="clip0">
          <path fill="#fff" d="M0 0h112v112H0z"/>
        </clipPath>
      </defs>
    </svg>
  );
}

