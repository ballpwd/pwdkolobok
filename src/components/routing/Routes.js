import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from '../home/Home';
import Calculator from '../calculator/Calculator';
import NotFound from '../layout/NotFound';

const Routes = () => {
  return (
    <section className='container'>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/calculator' component={Calculator} />
        <Route component={NotFound} />
      </Switch>
    </section>
  );
};

export default Routes;
