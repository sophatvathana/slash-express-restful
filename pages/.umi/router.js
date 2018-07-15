import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';
import { routerRedux } from 'dva/router';



let Router = DefaultRouter;
const { ConnectedRouter } = routerRedux;
Router = ConnectedRouter;


let routes = [
  {
    "path": "/",
    "component": require('../../layouts/index.js').default,
    "routes": [
      {
        "path": "/404",
        "exact": true,
        "component": require('../404.js').default
      },
      {
        "path": "/",
        "exact": true,
        "component": require('../index.js').default
      },
      {
        "path": "/UIElement/dropOption",
        "exact": true,
        "component": require('../UIElement/dropOption/index.js').default
      },
      {
        "path": "/UIElement/editor",
        "exact": true,
        "component": require('../UIElement/editor/index.js').default
      },
      {
        "path": "/UIElement/iconfont/emoji",
        "exact": true,
        "component": require('../UIElement/iconfont/emoji.js').default
      },
      {
        "path": "/UIElement/iconfont",
        "exact": true,
        "component": require('../UIElement/iconfont/index.js').default
      },
      {
        "path": "/UIElement/layer",
        "exact": true,
        "component": require('../UIElement/layer/index.js').default
      },
      {
        "path": "/UIElement/search",
        "exact": true,
        "component": require('../UIElement/search/index.js').default
      },
      {
        "path": "/chart/ECharts",
        "exact": true,
        "component": require('../chart/ECharts/page.js').default
      },
      {
        "path": "/chart/Recharts",
        "exact": true,
        "component": require('../chart/Recharts/page.js').default
      },
      {
        "path": "/chart/highCharts",
        "exact": true,
        "component": require('../chart/highCharts/page.js').default
      },
      {
        "path": "/dashboard",
        "exact": true,
        "component": require('../dashboard/index.js').default
      },
      {
        "path": "/UIElement/dataTable",
        "exact": true,
        "component": require('../UIElement/dataTable/index.js').default
      },
      {
        "path": "/login",
        "exact": true,
        "component": require('../login/index.js').default
      },
      {
        "path": "/post",
        "exact": true,
        "component": require('../post/index.js').default
      },
      {
        "path": "/request",
        "exact": true,
        "component": require('../request/index.js').default
      },
      {
        "path": "/user",
        "exact": true,
        "component": require('../user/index.js').default
      },
      {
        "path": "/user/:id",
        "exact": true,
        "component": require('../user/$id/index.js').default
      },
      {
        "component": () => React.createElement(require('/Users/sophatvathana/mytest/slash-express-restful/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'pages', routes: '[{"path":"/","component":"./layouts/index.js","routes":[{"path":"/404","exact":true,"component":"./pages/404.js"},{"path":"/","exact":true,"component":"./pages/index.js"},{"path":"/UIElement/dropOption","exact":true,"component":"./pages/UIElement/dropOption/index.js"},{"path":"/UIElement/editor","exact":true,"component":"./pages/UIElement/editor/index.js"},{"path":"/UIElement/iconfont/emoji","exact":true,"component":"./pages/UIElement/iconfont/emoji.js"},{"path":"/UIElement/iconfont","exact":true,"component":"./pages/UIElement/iconfont/index.js"},{"path":"/UIElement/layer","exact":true,"component":"./pages/UIElement/layer/index.js"},{"path":"/UIElement/search","exact":true,"component":"./pages/UIElement/search/index.js"},{"path":"/chart/Container","exact":true,"component":"./pages/chart/Container.js"},{"path":"/chart/ECharts","exact":true,"component":"./pages/chart/ECharts/page.js"},{"path":"/chart/Recharts","exact":true,"component":"./pages/chart/Recharts/page.js"},{"path":"/chart/highCharts","exact":true,"component":"./pages/chart/highCharts/page.js"},{"path":"/dashboard/components/user","exact":true,"component":"./pages/dashboard/components/user.js"},{"path":"/dashboard","exact":true,"component":"./pages/dashboard/index.js"},{"path":"/dashboard/model","exact":true,"component":"./pages/dashboard/model.js"},{"path":"/dashboard/components/cpu","exact":true,"component":"./pages/dashboard/components/cpu.js"},{"path":"/dashboard/components/recentSales","exact":true,"component":"./pages/dashboard/components/recentSales.js"},{"path":"/dashboard/components","exact":true,"component":"./pages/dashboard/components/index.js"},{"path":"/dashboard/components/completed","exact":true,"component":"./pages/dashboard/components/completed.js"},{"path":"/dashboard/components/browser","exact":true,"component":"./pages/dashboard/components/browser.js"},{"path":"/dashboard/components/comments","exact":true,"component":"./pages/dashboard/components/comments.js"},{"path":"/dashboard/components/weather","exact":true,"component":"./pages/dashboard/components/weather.js"},{"path":"/UIElement/dataTable","exact":true,"component":"./pages/UIElement/dataTable/index.js"},{"path":"/dashboard/components/sales","exact":true,"component":"./pages/dashboard/components/sales.js"},{"path":"/dashboard/components/numberCard","exact":true,"component":"./pages/dashboard/components/numberCard.js"},{"path":"/dashboard/services/dashboard","exact":true,"component":"./pages/dashboard/services/dashboard.js"},{"path":"/dashboard/services/weather","exact":true,"component":"./pages/dashboard/services/weather.js"},{"path":"/user/:id/models/detail","exact":true,"component":"./pages/user/$id/models/detail.js"},{"path":"/login","exact":true,"component":"./pages/login/index.js"},{"path":"/login/model","exact":true,"component":"./pages/login/model.js"},{"path":"/login/service","exact":true,"component":"./pages/login/service.js"},{"path":"/post/components/List","exact":true,"component":"./pages/post/components/List.js"},{"path":"/post","exact":true,"component":"./pages/post/index.js"},{"path":"/post/model","exact":true,"component":"./pages/post/model.js"},{"path":"/post/service","exact":true,"component":"./pages/post/service.js"},{"path":"/request","exact":true,"component":"./pages/request/index.js"},{"path":"/user/components/Filter","exact":true,"component":"./pages/user/components/Filter.js"},{"path":"/user/components/List","exact":true,"component":"./pages/user/components/List.js"},{"path":"/user/components/Modal","exact":true,"component":"./pages/user/components/Modal.js"},{"path":"/user","exact":true,"component":"./pages/user/index.js"},{"path":"/user/model","exact":true,"component":"./pages/user/model.js"},{"path":"/user/services/user","exact":true,"component":"./pages/user/services/user.js"},{"path":"/user/services/users","exact":true,"component":"./pages/user/services/users.js"},{"path":"/user/:id","exact":true,"component":"./pages/user/$id/index.js"},{"path":"/dashboard/components/quote","exact":true,"component":"./pages/dashboard/components/quote.js"}]}]' })
      }
    ]
  }
];


export default function() {
  return (
<Router history={window.g_history}>
  <Route render={({ location }) =>
    renderRoutes(routes, {}, { location })
  } />
</Router>
  );
}
