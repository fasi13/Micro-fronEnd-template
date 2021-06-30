/* eslint-disable import/newline-after-import */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const tailwindcss = require('tailwindcss');
module.exports = {
	// eslint-disable-next-line global-require
	plugins: [tailwindcss('./tailwind.config.js'), require('autoprefixer')],
};
