import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import history from './history'
import Login from './pages/login'
import Main from './pages/main'

export default function Routes() {
    return (
        <BrowserRouter history={history}>
            <Route path="/" exact component={Login} />
            <Route path="/main" component={Main} />
        </BrowserRouter>
    )
}