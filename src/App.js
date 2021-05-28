import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Routes from './components/routing/Routes';

// Redux
// import { Provider } from 'react-redux';
// import store from './store';
// import { loadUser } from './actions/auth';
// import setAuthToken from './utils/setAuthToken';

import {autoLogin} from './main/main'

import './App.css';

const App = (props) => {
  autoLogin()
  // return (
  //   <Provider store={store}>
  //     <Router>
  //       <Fragment>
  //         <Navbar />
  //         <Switch>
  //           <Route exact path="/" component={Landing} />
  //           <Route component={Routes} />
  //         </Switch>
  //       </Fragment>
  //     </Router>
  //   </Provider>
  // );

  return (
      <Router>
          <Switch>
            <Route component={Routes} />
          </Switch>
      </Router>
  );
};

export default App;
