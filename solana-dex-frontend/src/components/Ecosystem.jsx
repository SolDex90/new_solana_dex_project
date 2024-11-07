import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Gaming from './Gaming';
import Lending from './Lending';
import Music from './Music';
import YieldFarming from './YieldFarming';
import Staking from './Staking';
import Liquidity from './Liquidity';

const Ecosystem = () => {
  return (
    <div>
      <h2>Ecosystem</h2>
      <Switch>
        <Route path="/gaming" component={Gaming} />
        <Route path="/lending" component={Lending} />
        <Route path="/music" component={Music} />
        <Route path="/yield-farming" component={YieldFarming} />
        <Route path="/staking" component={Staking} />
        <Route path="/liquidity" component={Liquidity} />
      </Switch>
    </div>
  );
};

export default Ecosystem;
