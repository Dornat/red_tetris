import React from 'react';
import {Route, Switch} from 'react-router-dom';
import InitSockets from './hoc/InitSockets';
import Dashboard from './Dashboard';

export default function Router(props)
{
    return (
        <Switch>
            <Route exact path="/" component={InitSockets(props, Dashboard)}/>}/>
            {/*<Route exact path="/room" component={InitSockets(props, Room)}/>*/}
            {/*<Route exact path="/room" component={Room}/>*/}
        </Switch>
    );
}
