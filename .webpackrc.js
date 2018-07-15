import { resolve } from 'path';

export default {
  theme: "./theme.config.js",
   
  proxy: {
    "/api/v1/weather": {
      "target": "https://api.seniverse.com/",
      "changeOrigin": true,
      "pathRewrite": { "^/api/v1/weather": "/v3/weather" }
    },
    // "/api/v2": {
    //   "target": "http://192.168.0.110",
    //   "changeOrigin": true,
    //   "pathRewrite": { "^/api/v2" : "/api/v2" }
    // }
  },
  alias: {
    themes: resolve(__dirname, './themes'),
    components: resolve(__dirname,"./components"),
    utils: resolve(__dirname,"./utils"),
    config: resolve(__dirname,"./utils/config"),
    enums: resolve(__dirname,"./utils/enums"),
    services: resolve(__dirname,"./services"),
    models: resolve(__dirname,"./models"),
    routes: resolve(__dirname,"./routes"),
  },
  urlLoaderExcludes: [
    /\.svg$/,
  ],
  ignoreMomentLocale: true,
}
