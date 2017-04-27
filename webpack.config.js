const path = require('path')

module.exports = {
	context: __dirname,
	entry: './js/ClientApp.js',
	devtool: 'source-map',
	output: {
		path: path.join(__dirname, '/public'),
		filename: 'bundle.js'
	},
	devServer: {
		publicPath: '/public',
    historyApiFallback: true
	},
	resolve: {
		extensions: ['.js', '.json']
	},
	stats: {
		colors: true,
		reasons: true,
		chunks: false
	},
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: 'eslint-loader',
				exclude: /node_modules/
			},
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
			{
				test: /\.(js|jsx)$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							url: true
						}
					}
				]
			}
		]
	}
}

