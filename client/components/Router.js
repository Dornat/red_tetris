import React from 'react';
import {Route, Switch} from 'react-router-dom';

// Higher Order Components
import InitSockets from './hoc/InitSockets';

// Components
import Dashboard from './Dashboard';
import Room from './Room';
import NotFound from './NotFound';
import Score from './Score';

export default function Router(props) {
    return (
        <Switch>
            <Route exact path="/" component={InitSockets(props, Dashboard)}/>
            <Route exact path="/room/:id" component={InitSockets(props, Room)}/>
            <Route exact path="/score" component={InitSockets(props, Score)}/>
            <Route path="*" component={NotFound}/>
        </Switch>
    );
}
