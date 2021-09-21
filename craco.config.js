module.exports = {
	webpack: {
		configure: (config, { paths }) => {
			if (process.env.NODE_ENV === 'production') {
				// Set separate entry point when building the injectable lib
				// https://webpack.js.org/concepts/entry-points
				config.entry = `${paths.appSrc}/index.injectable.js`;

				// Output a "window" module and define its name via the library key.
				// This key will be what is referenced when the hub looks for
				// the correct module to dynamically load after the bundle is
				// injected into the DOM
				// https://webpack.js.org/configuration/output
				config.output.library = 'micro.frontend.template';
				config.output.libraryTarget = 'window';
				config.output.filename = 'main.js';

				// Because this is being injected in the hub's index.html,
				// we don't need the HTML plugin
				config.plugins = config.plugins.filter(
					plugin => plugin.constructor.name !== 'HtmlWebpackPlugin',
				);

				// If we're including custom CSS, make sure it's bundle
				// easily identified
				const cssPluginIdx = config.plugins
					.map(p => p.constructor.name)
					.indexOf('MiniCssExtractPlugin');
				if (cssPluginIdx !== -1) {
					config.plugins[cssPluginIdx].options.filename = 'main.css';
				}

				// Exclude shared dependencies to reduce bundle size
				// https://webpack.js.org/configuration/externals
				config.externals = ['react'];

				// Consolidate bundle instead of creating chunks
				delete config.optimization;
			}
			return config;
		},
	},
	devServer: {
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	},
	style: {
		postcss: {
			/* eslint-disable global-require */
			plugins: [require('tailwindcss'), require('autoprefixer')],
			/* eslint-disable global-require */
		},
	},
};
