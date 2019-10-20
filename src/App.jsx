import React, { useContext } from 'react'
import {Route, Switch, __RouterContext} from 'react-router-dom'
import { useTransition, animated } from 'react-spring'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Navbar from './components/Navbar'
import Kategori from './components/Kategori'
import Dashboard from './components/Dashboard'
import Addproduct from './components/Addproduct'
import Myproduct from './components/Myproduct'
import Mycart from './components/Mycart'
import Search from './components/Search'






const App = () => {
        const { location } = useContext(__RouterContext)
        const transitions = useTransition(location, location => location.pathname, {
            from: { opacity: 1 , transform: "translate(100%, 0)" },
            enter: { opacity: 1 , transform: "translate(0%, 0)" },
            leave: { opacity: 0 , transform: "translate(-50%, 0)" }
        });

        return(
            <>
                <main>
                    {transitions.map(({ item, props, key })=>(
                        <animated.div key={ key } style={ props }>
                            <Switch location={ item }>
                                <Route path='/' exact component={Home}/>
                                <Route path='/login' component={Login}/>
                                <Route path='/register' component={Register}/>
                                <Route path='/kategori' component={Kategori}/>                                        
                                <Route path='/search' component={Search}/>                                        
                                <Route path='/dashboard' component={Dashboard}/>
                                <Route path='/addproduct' component={Addproduct}/>
                                <Route path='/myproduct' component={Myproduct}/>                                                                                              
                                <Route path='/mycart' component={Mycart}/>                                                                                              
                            </Switch>
                        </animated.div>
                    ))}   
                </main>
            </>
        )
    }

export default App