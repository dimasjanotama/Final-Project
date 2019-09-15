import React, { Component } from 'react'
import {connect} from 'react-redux'
import {NavLink, Redirect} from 'react-router-dom'

import {onLoginUser} from '../actions/index'
import AbsoluteWrapper from './AbsoluteWrapper'
import Footer from './Footer'


class Login extends Component {

    onLoginClick = () => {
        // Mengambil data dari textbox
        let username = this.username.value
        let password = this.password.value

        // Memanggil action creator
        this.props.onLoginUser(username, password)
    }


    render() {
    if(!this.props.user_name){
        return(
            <AbsoluteWrapper>
                <div className='container-fluid text-light' style={{ backgroundColor:'rgb(33,34,44)', height:'400px', width:'1200px'}}>
                <div style={{height: '50px'}}></div>
                    <div className='row mx-auto align-items-center w-75 text-center' style={{height:'160px'}}>
                        <div className='col monalt900' style={{fontSize:'80pt'}}>Fxpedia.</div> 
                        </div>
                    <div className='mx-auto align-items-center text-center' style={{height:'100px'}}>
                        
                        <h1 className='m-0 mon600' style={{fontSize:'30pt'}}>- Market Place -</h1>
                        <div className='row align-items-center'>
                            <h1 className='col m-0 text-right mon600' style={{fontSize:'30pt'}}>
                                Untuk
                            </h1>
                            <h1 className='col-3 m-0 mon600 dimdom-color' style={{fontSize:'30pt'}}>Pecinta Efek</h1>
                            <br/>
                            <br/>
                            <h1 className='col m-0 text-left mon600' style={{fontSize:'30pt'}}>Pedal</h1>
                        </div>
                    </div>
                </div>
                <div className='row align-items-center dimdom-pic2 text-light mon500'>
                    <div className='col-5 mx-auto card'>
                        <div className='card-body'>
                            <div className='card-title'>
                                Login
                            </div>
                            <div className='row'>
                                <div className='col card-title pt-4 mb-2'>Username</div>
                                <div className='col card-title pt-4 mb-2'>Password</div>
                                <div class="w-100"></div>
                                <div class=" col ui input2">
                                    <input ref={(input) => {this.username = input}} type="text" placeholder="Username"/>
                                </div>                 
                                <div class=" col ui input2">
                                    <input ref={(input) => {this.password = input}} type="text" placeholder="Password"/>
                                </div>                 
                            </div>
                            <div className='row pt-5'>
                                <button onClick={this.onLoginClick} className='col-6 mx-auto ui inverted basic dimdom3 button '>Login</button>
                                <div class="w-100"></div>
                                <div className='col text-center pt-2' style={{fontSize:'80%'}}>Belum punya akun? 
                                <NavLink className='dimdom-pink' to={'/register'}>  Daftar Disini</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <Footer/>
            </AbsoluteWrapper>
            
        ) //----------------------------> kurung tutup return
    } else {
        return <Redirect to='/dashboard'/>
    } 
    }
}

const mapStateToProps = (state) => {
    return {
        user_name : state.auth.username
    }
}

export default connect(mapStateToProps,{onLoginUser})(Login)