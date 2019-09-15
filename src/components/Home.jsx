import React, { Component } from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import AbsoluteWrapper from './AbsoluteWrapper'
import Footer from './Footer'


class Home extends Component {

    render() {
        if (!this.props.user_name){
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
                <div className='row align-items-center dimdom-pic'>
                    <div className='col text-right'>
                        <NavLink to='/login' className='ui inverted basic dimdom button'>Login</NavLink>
                    </div>
                    <div className='col text-left'>
                        <NavLink to='/register' className='ui inverted basic dimdom button'>Daftar</NavLink>
                    </div>

                </div>
                <Footer/>
            </AbsoluteWrapper>
        )
    } else {
        return <Redirect to='./dashboard'/>
    }
    }
}


const mapStateToProps = (state)=>{
    return {
        user_name : state.auth.username
    }
}

export default connect(mapStateToProps)(Home)