import React, { Component } from 'react'
import {connect} from 'react-redux'
import App from './App'
import { keepLogin, keepClickSeller , keepDetail, keepKodeUnik} from './actions'

class AppWrapper extends Component {

    state = {
        check: false
    }

    componentDidMount() {
        let userStorage = JSON.parse(localStorage.getItem('userData','userCart')) 
        let otherIdStorage = JSON.parse(localStorage.getItem('otherId')) 
        let transactionIdStorage = JSON.parse(localStorage.getItem('transactionId')) 
        let kodeUnikStorage = localStorage.getItem('kodeUnik')
        if(userStorage){
            this.props.keepLogin(userStorage)
        } 
        if(otherIdStorage){
            this.props.keepClickSeller(otherIdStorage)
        }
        if(transactionIdStorage){
            this.props.keepDetail(transactionIdStorage)
        }
        if(kodeUnikStorage){
            this.props.keepKodeUnik(kodeUnikStorage)
        }
        this.setState({check: true})
    }
    
    render () {
        if(this.state.check) {
            return ( 
                <App/> 
        )} else {
            return <div><h1>Loading</h1></div>
        }   
}
}

export default connect(null, {keepLogin,keepClickSeller, keepDetail, keepKodeUnik})(AppWrapper)