import React, { Component } from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import AbsoluteWrapper from './AbsoluteWrapper'
import Footer from './Footer'
import Navbar from './Navbar'


class Home extends Component {

    render() {
        if (!this.props.user_name){
        return(   
            <AbsoluteWrapper>
            <div id='bg-base'>   
                <Navbar/>
                <div className='text-light dim-height'>
                    <div className='row mx-auto align-items-center w-75 text-center' style={{height:'180px'}}>
                        <div className='col quic700p dimdom-color' style={{fontSize:'90pt',fontWeight:'bold'}}>fxpedia</div> 
                    </div>
                    <div className='mx-auto align-items-center text-center' style={{height:'100px'}}>
                        <h1 className='m-0 quic700b' style={{fontSize:'30pt'}}>- Portal Jual Beli -</h1>
                        <div className='row align-items-center'>
                            <h1 className='col m-0 quic700b' style={{fontSize:'30pt',left:'16%'}}>Untuk</h1>
                            <h1 className='col-3 m-0 quic700p dimdom-color ' style={{fontSize:'30pt'}}>Pecinta Efek</h1>
                            <h1 className='col m-0 quic700b' style={{fontSize:'30pt',right:'13%'}}>Stompbox</h1>
                        </div>
                    </div>
                    <div className='row align-items-center' style={{height:'320px'}}>
                        <div className='col text-right'>
                            <NavLink to='/login' className='ui inverted basic dimdom button'>Login</NavLink>
                        </div>
                        <div className='col text-left'>
                            <NavLink to='/register' className='ui inverted basic dimdom button'>Daftar</NavLink>
                        </div>
                    </div>
                </div>
            </div>
            </AbsoluteWrapper>
        )
    } else {
        return <Redirect to='./notification'/>
    }
    }
}


const mapStateToProps = (state)=>{
    return {
        user_name : state.auth.username
    }
}

export default connect(mapStateToProps)(Home)