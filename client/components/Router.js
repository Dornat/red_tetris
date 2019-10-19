import React from 'react';
import {Route, Switch} from 'react-router-dom';

// Higher Order Components
import InitSockets from './hoc/InitSockets';

// Components
import Dashboard from './Dashboard';
import Room from './Room';

export default function Router(props)
{
    return (
        <Switch>
            <Route exact path="/" component={InitSockets(props, Dashboard)}/>}/>
            <Route exact path="/room" component={InitSockets(props, Room)}/>
        </Switch>
    );
}
