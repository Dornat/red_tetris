import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Board from './Board'

export default function Router()
{
    return (
        <Switch>
            <Route exact path="/" component={Board}/>
        </Switch>
    );
}
