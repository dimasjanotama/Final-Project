import React, { Component } from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {
    CSSTransition,
    TransitionGroup,
  } from 'react-transition-group';

import '../dimdom.css'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import Header from './Navbar'
import Sidebar from './Kategori'
import Myhome from './Myhome'


class App extends Component {
    render(){
        return(
            <BrowserRouter>
                    <Header/>
            <Route render = {({location}) => (
                <TransitionGroup>
                <CSSTransition
                    key={location.key}
                    timeout={3000}
                    classNames="fade">
                            <Switch location={location}>
                                <Route path='/' exact component={Home}/>
                                <Route path='/login' component={Login}/>
                                <Route path='/register' component={Register}/>
                                <Route path='/sidebar' component={Sidebar}/>
                                <Route path='/myhome' component={Myhome}/>
                                
                            </Switch>
                 </CSSTransition>
             </TransitionGroup>
             )}/>
             </BrowserRouter>
        )
    }
}

export default App