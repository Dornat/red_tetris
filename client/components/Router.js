import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Board from './Board'

export default function Router()
{
    // localhost:3000/room/1xx12dadasda

    // localhost:3000/room?player_name=ymarchys
    return (
        <Switch>
            <Route exact path="/" component={Dashboard}/>
            <Route exact path="/room" component={Room}/>
        </Switch>
    );
}
