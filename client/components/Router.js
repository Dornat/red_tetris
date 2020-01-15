import React from 'react';
import {Route, Switch} from 'react-router-dom';

// Higher Order Components
import InitSockets from './hoc/InitSockets';
import ApplicationActions from './hoc/ApplicationActions';

// Components
import Dashboard from './Dashboard';
import Room from './Room';
import NotFound from './NotFound';
import Score from './Score';

export default function Router() {
    return (
        <Switch>
            <Route exact path="/" component={
                ApplicationActions(
                    InitSockets(Dashboard)
                )
            }/>
            <Route exact path="/room/:id" component={
                ApplicationActions(
                    InitSockets(Room)
                )
            }/>
            <Route exact path="/score" component={
                ApplicationActions(
                    InitSockets(Score)
                )
            }/>
            <Route path="*" component={NotFound}/>
        </Switch>
    );
}
