import React, { Component } from 'react'
import {NavLink, Redirect, Link} from 'react-router-dom'
import {connect} from 'react-redux'
import { onLogoutUser, searchKeywords, clearKeywords } from '../actions'
import Axios from 'axios'
import moment from 'moment'


const urlApi = 'http://localhost:7777/auth/'

class Navbar extends Component {

    state = {
        keywords : ''
    }

    onSearchClick = ()=>{
        this.props.searchKeywords(this.state.keywords)
        
    }

    clearKeywords = ()=>{
        this.props.clearKeywords()
    }

    onLogout=()=>{
        let waktu = moment().format('YYYY-MM-DD')+' '+ moment().format('hh:mm:ss')
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
                            <NavLink onClick={this.clearKeywords} className="dimdom-pink-logo" style={{fontSize:'40pt'}} to='/'>fxpedia.</NavLink>
                        </div>
                       
                    </div>
                </div>
                </div>
            )
       
    } else {
        if(this.props.user_name == 'Admin'){
            return (
            <div>
            <div className='dimdom-bg'></div>
            <div class='container-fluid' >
                <div class="navbar row align-items-center" style={{background:'transparent' ,height:'115px'}}>                     
                    <div class="col pl-5 pt-1">
                        <NavLink onClick={this.clearKeywords} className="dimdom-pink-logo" style={{fontSize:'40pt'}} to='/verifier'>fxpedia.</NavLink>
                    </div>
                    <div class="col pt-1 text-center">                                  
                    </div>                              
                    <div class="col pt-1 text-center">   
                        <button onClick={this.onLogout} className='col-6 mx-auto ui inverted basic dimdom3 button '>Logout</button>      
                    </div>   
                </div>
            </div>
            </div>    
        )} else if(this.props.key_words){
         return (
            <div>
            <div className='dimdom-bg'></div>
            <div class='container-fluid' >
                <div class="navbar row align-items-center" style={{background:'transparent' ,height:'115px'}}>
                    
                    <div class="col pl-5 pt-1">
                        <NavLink onClick={this.clearKeywords} className="dimdom-pink-logo" style={{fontSize:'40pt'}} to='/'>fxpedia.</NavLink>
                    </div>     
                    <div class="col pt-1 text-center">   
                         
                        <button onClick={this.onLogout} className='col-6 mx-auto ui inverted basic dimdom3 button '>Logout</button>      
                    </div>   
                </div>
            </div>
            </div>    
        )} else {
            return (
                <div>
                <div className='dimdom-bg'></div>
                <div class='container-fluid' >
                    <div class="navbar row align-items-center" style={{background:'transparent' ,height:'115px'}}>
                        
                        <div class="col pl-5 pt-1">
                            <NavLink onClick={this.clearKeywords} className="dimdom-pink-logo" style={{fontSize:'40pt'}} to='/'>fxpedia.</NavLink>
                        </div> 
                        <div class="col pl-3 pt-2 text-center text-light">
                            <div class="ui icon input2">
                                <input onChange={(e)=>{this.setState({keywords: e.target.value})}} type="text" placeholder="Search..."/>
                                <Link to='/search' onClick={this.onSearchClick} className="dimdom-pink col mt-2"> Search
                                </Link>
                            </div>
                        </div>
                        <div class="col pt-1 text-center">   
                             
                            <button onClick={this.onLogout} className='col-6 mx-auto ui inverted basic dimdom3 button '>Logout</button>      
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







 