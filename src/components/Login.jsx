import React, { Component } from 'react'
import {connect} from 'react-redux'
import {NavLink, Redirect} from 'react-router-dom'
import {onLoginUser} from '../actions'

import AbsoluteWrapper from './AbsoluteWrapper'
import Footer from './Footer'
import Navbar from './Navbar'
import axios from 'axios'

const urlApi = 'http://localhost:7777/auth/'

class Login extends Component {

    state = {
        username: '',
        password: '',
        error: false,
        message: '',
        id: 0
    }

    onLoginClick = () => {
        axios.get(urlApi + 'login', {
            params: {
                username: this.state.username,
                password: this.state.password
            }
        }).then(res=>{
            if(res.data.status==='404' || res.data.status==='401'){
                this.setState({error: true, message: res.data.message})
                setTimeout(
                    () => { this.setState({error: false}) },
                    3000
                )
            } else {
                if(res.data.result[0].isVerified<1) {
                    this.setState({error: true, message:'Silahkan cek email untuk verifikasi terlebih dahulu'})
                    setTimeout(
                        () => { this.setState({error: false}) },
                        3000
                    )
                } else {
                this.props.onLoginUser(res.data.result[0].id, res.data.result[0].username);
            }}
        })
    }

    notification = ()=>{
        if(this.state.error){
            return (
                <div className='row text-center'>
                    <div className='col-8 alert alert-danger mt-4 mx-auto'>
                        {this.state.message}
                    </div>
                </div>
            )
        } else {
            return null
        }
    }


    render() {
    if(!this.props.user_name){
        return(
            <AbsoluteWrapper>
               <Navbar/>
                <div className='row align-items-center dim-height text-light quic700'>
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
                                    <input onChange={(e) => this.setState({username: e.target.value})} type="text" placeholder="Username"/>
                                </div>                 
                                <div class=" col ui input2">
                                    <input onChange={(e) => this.setState({password: e.target.value})} type="password" placeholder="Password"/>
                                </div>                 
                            </div>
                            <div className='row pt-5'>
                                <button onClick={this.onLoginClick} className='col-6 mx-auto ui inverted basic dimdom3 button '>Login</button>
                                <div class="w-100"></div>
                                <div className='col text-center pt-2' style={{fontSize:'80%'}}>Belum punya akun? 
                                <NavLink className='dimdom-pink' to={'/register'}>  Daftar Disini</NavLink>
                                </div>
                            </div>
                            {this.notification()}
                            
                        </div>
                    </div>
                </div>
               <Footer />
            </AbsoluteWrapper>
            
        ) //----------------------------> kurung tutup return
    } else {
        if (this.props.user_name == 'Admin') {
            return <Redirect to='/dashadmin'/>
        } else {
        return <Redirect to='/dashboard'/>
        }
    } 
    }
}

const mapStateToProps = (state) => {
    return {
        user_name : state.auth.username
    }
}

export default connect(mapStateToProps,{onLoginUser})(Login)