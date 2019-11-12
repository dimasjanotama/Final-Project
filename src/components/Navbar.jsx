import React, { Component } from 'react'
import {NavLink, Redirect, Link} from 'react-router-dom'
import {connect} from 'react-redux'
import { onLogoutUser, searchKeywords, clearKeywords } from '../actions'
import Axios from 'axios'
import moment from 'moment'


const urlApi = 'http://localhost:7777/auth/'

class Navbar extends Component {

    state = {
        keywords : '',
        redirect : false
    }

    onSearchClick = ()=>{
        this.props.searchKeywords(this.state.keywords)
        this.setState({redirect: true})
    }

    clearKeywords = ()=>{
        this.props.clearKeywords()
    }

    onLogout=()=>{
        let waktu = moment().format('YYYY-MM-DD')+' '+ moment().format('HH:mm:ss')
        Axios.put(urlApi+'setlogtime',{
            waktuLogout: waktu,
            userId: this.props.user_id
        }).then(res=>{
            this.props.onLogoutUser()
        }).catch(err=>{
            console.log(err);
        })
    }

    render () {
        if(!this.props.user_name){
            return(
                <div>
                <div className='dimdom-bg'></div>
                <div class='container-fluid' >
                    <div class="navbar row align-items-center" style={{background:'transparent' ,height:'115px'}}>
                        
                        <div class="col pl-5 pt-1">
                            <NavLink onClick={this.clearKeywords} className="dimdom-pink-logo" style={{fontSize:'40pt'}} to='/'>fxpedia</NavLink>
                        </div>
                       
                    </div>
                </div>
                </div>
            )
       
    } else {
        if(this.props.user_name == 'Admin'){
            return (
                <div>
                <div class='container-fluid text-black-50' >
                    <div className='row align-items-center dim-nav' style={{height:'60px'}}>
                        <div className='col-1'></div>
                        <div className='col-2'>
                            <NavLink onClick={this.clearKeywords} className="dimdom-pink-logo2" style={{fontSize:'30pt'}} to='/verifier'>fxpedia</NavLink>
                        </div>
                        <div className='col-5 text-right'>
                           
                        </div>
                        <div className='col-4'>
                            <div className='row text-center'>
                                <div className='col-3 pl-3 ml-0 mr-0 pr-0'>
                                    <NavLink to='/verifier' class="btn btn-one pr-0 pl-0">Verifikasi</NavLink>
                                </div>
                                <div className='col-3 pl-0 mr-2'>
                                    <div class="col text-center ">
                                        <NavLink to='/dashboardadmin' className='btn btn-one pl-0 pr-0'>Dashboard</NavLink>
                                    </div>
                                </div>
                                <div className='col-2 pl-0 mr-0'>
                                    <div onClick={this.onLogout} class="btn btn-one">Logout</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>   
        )}  else {
            return (
                <div className='navbar-fx'>
                <div class='text-black-50' >
                    <div className='row align-items-center dim-nav' style={{height:'60px'}}>
                        <div className='col-1'></div>
                        <div className='col-2'>
                            <NavLink onClick={this.clearKeywords} className="dimdom-pink-logo2" style={{fontSize:'30pt'}} to='/'>fxpedia</NavLink>
                        </div>
                        <div className='col-3 text-right'>
                            <Link to='/search' onClick={this.onSearchClick}>
                                <i className='search icon'></i>
                            </Link>
                        </div>
                        <div className='col-6'>
                            <div className='row align-items-center'>
                                <div className='col-1 pl-0 mr-0 pr-0 text-right'>
                                   <NavLink to='notification' class="btn btn-one pr-0 pl-0">Notifikasi</NavLink>
                                </div>
                                <div className='col-2 pl-0 mr-0 pr-0'>
                                   <div class="col text-right pl-0 pr-0 ">
                                       <NavLink to='/addproduct' className='btn btn-one pl-0 pr-0' >Jual Produk</NavLink>
                                    </div> 
                                </div>
                                <div className='col-2 pl-0 mr-0 pr-0 text-right'>
                                    <NavLink to='/myproduct' class="btn btn-one pr-0 pl-0">Produk Saya</NavLink>
                                </div>
                                <div className='col-2 pl-3 ml-0 mr-0 pr-0 text-center'>
                                     <NavLink to='/mycart' class="btn btn-one pr-0 pl-0">Keranjang</NavLink>
                                </div>
                                <div className='col-1 pl-0 mr-2'>
                                <div class="col text-center ">
                                    <NavLink to='/myprofile' className='btn btn-one pl-0 pr-0'>Profil</NavLink>
                                </div>
                                </div>
                                <div className='col-1 pl-0 mr-0'>
                                    <div onClick={this.onLogout} class="btn btn-one">Logout</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>    
            )
        }
    } 
    }
}

const mapStateToProps = (state) => {
    return {
        user_id : state.auth.id,
        user_name : state.auth.username,
        key_words : state.auth.keywords
    }
}

export default connect(mapStateToProps,{onLogoutUser,searchKeywords,clearKeywords})(Navbar)







 