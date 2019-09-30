import React, { Component } from 'react'
import {Route, BrowserRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import App from './App'
import { keepLogin } from './actions'

class AppWrapper extends Component {

    state = {
        check: false
    }

    componentDidMount() {
        let userStorage = JSON.parse(localStorage.getItem('userData','userCart')) 
        if(userStorage){
            this.props.keepLogin(userStorage)
        }
        this.setState({check: true})
    }
    
    render () {
        if(this.state.check) {
            return ( 
                <div id='bg-base'>   
                    <App/> 
                </div>
               
        )} else {
            return <div><h1>Loading</h1></div>
        }   
}
}

export default connect(null, {keepLogin})(AppWrapper)