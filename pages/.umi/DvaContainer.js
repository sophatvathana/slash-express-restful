import { Component } from 'react';
import dva from 'dva';
import createLoading from 'dva-loading';

let app = dva({
  history: window.g_history,
  
});

window.g_app = app;
app.use(createLoading());
app.use(require('../../plugins/onError.js').default);
app.model({ namespace: 'app', ...(require('/Users/sophatvathana/mytest/slash-express-restful/models/app.js').default) });
app.model({ namespace: 'model', ...(require('/Users/sophatvathana/mytest/slash-express-restful/pages/dashboard/model.js').default) });
app.model({ namespace: 'model', ...(require('/Users/sophatvathana/mytest/slash-express-restful/pages/login/model.js').default) });
app.model({ namespace: 'model', ...(require('/Users/sophatvathana/mytest/slash-express-restful/pages/post/model.js').default) });
app.model({ namespace: 'model', ...(require('/Users/sophatvathana/mytest/slash-express-restful/pages/user/model.js').default) });
app.model({ namespace: 'detail', ...(require('/Users/sophatvathana/mytest/slash-express-restful/pages/user/$id/models/detail.js').default) });

class DvaContainer extends Component {
  render() {
    app.router(() => this.props.children);
    return app.start()();
  }
}

export default DvaContainer;
