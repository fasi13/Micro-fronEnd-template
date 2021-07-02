module.exports = {
	purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				"skyblue": '#3F98E3',
				"faded-skyblue": "#81B1DB"
			},
			height: {
				"10.5": "42px",
				".5": "2px"
			},
			width: {
				".5": "2px"
			}
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
