var path = require('path');
var fs = require('fs');
var webpack = require('webpack');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
	context: __dirname,
	entry: {
		app: './app/index.js'
	},
	target: 'node',
	externals: nodeModules,
	output: {
		path: 'dist',
		filename: '[name].js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: /node_modules/
			}
			, {
				test: /\.json$/,
				loader: 'json'
			}
		]
	},
	resolve: {
		extensions: ['', '.js']
	}
};
