module.exports = {
	purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				skyblue: '#3F98E3',
				'faded-skyblue': '#81B1DB',
				grayblue: '#31506a',
				balihai: '#8C9DAC',
				lightgrayblue: '#BDC6CD',
				sanjuan: '#31506A',
				regentgray: '#8999A6',
        breadNormal: '#b6c0c8',
        breadDisable: '#808080'
			},
			height: {
				'10.5': '42px',
				'.5': '2px',
			},
			width: {
				'.5': '2px',
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
