import React from 'react'
import { Route } from 'react-router'

import Application from './views/Application'
import Card from './views/Card'
import Home from './views/Home'

const routes = <Route path="/" component={Application}>
    <Route path="home" component={Home} />
    <Route path="card/:cardId" component={Card} />
</Route>

export default routes
