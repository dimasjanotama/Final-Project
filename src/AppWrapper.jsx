import React, { Component } from 'react'
import {Route, BrowserRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import App from './App'
import { keepLogin, keepClickSeller , keepDetail} from './actions'

class AppWrapper extends Component {

    state = {
        check: false
    }

    componentDidMount() {
        let userStorage = JSON.parse(localStorage.getItem('userData','userCart')) 
        let otherIdStorage = JSON.parse(localStorage.getItem('otherId')) 
        let transactionIdStorage = JSON.parse(localStorage.getItem('transactionId')) 
        if(userStorage){
            this.props.keepLogin(userStorage)
        } 
        if(otherIdStorage){
            this.props.keepClickSeller(otherIdStorage)
        }
        if(transactionIdStorage){
            this.props.keepDetail(transactionIdStorage)
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

export default connect(null, {keepLogin,keepClickSeller, keepDetail})(AppWrapper)