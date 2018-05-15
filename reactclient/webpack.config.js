var path = require('path');
var webpack = require('webpack');
var process = require('process');



// Config values here
let FRONTEND_URL = JSON.stringify(process.env.FRONTEND_URL) || JSON.stringify("http://localhost:9000/");
let API_URL = JSON.stringify(process.env.API_URL) ||  JSON.stringify("http://localhost:5000/api/");
let PRODUCTION = JSON.stringify(process.env.PRODUCTION) ||  JSON.stringify(false);

let definePlugin = new webpack.DefinePlugin({
    PRODUCTION: PRODUCTION,
    API_URL: API_URL,
    FRONTEND_URL: FRONTEND_URL
  });

module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js",
        path: __dirname + "/../site/public/js"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    watch: true,
    mode: 'development',
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            {
                test: /\.scss$/,
                use: [
                  {loader: 'style-loader'},
                  {
                    loader: 'typings-for-css-modules-loader',
                    options: {
                      modules: true,
                      namedExport: true
                    }
                  },
                  { 
                      loader: 'sass-loader',
                      options: {
                        data : "$frontendUrl: " + FRONTEND_URL + "; "
                      }
                  }
                ]
            },
            {
                test: /\.css?$/,
                use: [
                  {loader: 'style-loader'},
                //   {
                //     loader: 'typings-for-css-modules-loader',
                //     options: {
                //       modules: true,
                //       namedExport: true
                //     }
                //   },
                  { loader: 'css-loader'}
                ]
              }
        ]
    },
    plugins: [
        definePlugin
    ]
};
