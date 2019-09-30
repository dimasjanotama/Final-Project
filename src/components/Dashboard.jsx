import React, { Component } from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'

import Footer from './Footer'
import Navbar from './Navbar'



class Dashboard extends Component {

    state = {
        kategori: ''
    }

            
        


    welcome = () => {
       return (
                <div className='mt-5'>
                <div style={{height:'200px'}}></div>
                <h1 className='fade-out' style={{fontSize:'72pt'}}>Hello! {this.props.user_name}</h1>
                </div>
       )
    }

    renderList = () => {
        if (this.state.kategori === 'dashboard'){
            return(
                <div className='card-nav p-3'>
                    INI DASHBOARD
                </div>
            )
        } else if (this.state.kategori === 'myproducts'){
            return(
                <div className='card-nav p-3'>
                    <NavLink to='/addfx' className='ui inverted basic dimdom4 button mt-5'>Tambah Produk</NavLink>
                    <br/>
                    <NavLink to='/booster' className='ui inverted basic dimdom4 button mb-5'>Produk Saya</NavLink>
                    <br/>
                
                </div>
            )
        } else if (this.state.kategori === 'mycart'){
            return(
                <div className='card p-3'>
                    INI MYCART
                </div>
            )
        } else if (this.state.kategori === 'myprofile'){
            return(
                <div className='card p-3'>
                    INI MYPROFILE
                </div>
            )
        } else {
            return null
        }
    }

    render() {
        if(this.props.user_name){
        return(   
            <AbsoluteWrapper>
                <Navbar/>
                <div className='row dim-height text-light'> 
                    <div className='col-3 mt-3'>
                        <div className='card-nav p-3 dim-height-nav'>
                            <div className='card-title'>
                            <button onClick={()=> this.setState({kategori: 'dashboard'})} className='ui inverted basic dimdom4 button mt-5'>Dashboard</button>
                            <button onClick={()=> this.setState({kategori: 'myproducts'})} className='ui inverted basic dimdom4 button'>MyProducts</button>
                            <button onClick={()=> this.setState({kategori: 'mycart'})} className='ui inverted basic dimdom4 button'>MyCart</button>
                            <button onClick={()=> this.setState({kategori: 'myprofile'})} className='ui inverted basic dimdom4 button'>MyProfile</button>    
                            </div>
                        </div>
                    </div>
                    <div className='col-9 mt-3'>
                        {this.renderList()}
                        {this.welcome()}
                    </div>
                    {/* <div className='col-3 mt-3'>
                        <div className='card p-3'>
                            <div className='card-title'>
                                <h1>Dashboard</h1>
                                <h1>Dashboard</h1>
                                <h1>Dashboard</h1>
                                <h1>Dashboard</h1>
                                <h1>Dashboard</h1>
                            </div>
                        </div>
                    </div> */}
                </div>
                <Footer />
            </AbsoluteWrapper>
        )
        } else {
            return <Redirect to='/'/>
        }
    }
}

const mapStateToProps = (state)=>{
    return {
        user_name : state.auth.username
    }
}

export default connect(mapStateToProps)(Dashboard)