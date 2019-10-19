import React, { Component } from 'react'
import {NavLink, Redirect, Link} from 'react-router-dom'
import {connect} from 'react-redux'
import { onLogoutUser, searchKeywords, clearKeywords } from '../actions'


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
                        <div class="col pt-1 text-center">                    
                            <NavLink to='/kategori' className='dimdom-pink col'>Browse Kategori</NavLink>
                                        
                        </div>       
                        <div class="col pl-3 pt-2 text-center text-light">
                        <div class="ui icon input2">
                                <input onChange={(e)=>{this.setState({keywords: e.target.value})}} type="text" placeholder="Search fx..."/>
                                <Link to='/search' onClick={() => this.refs.magnifier.click()} className="dimdom-pink col mt-2"> Search
                                </Link>
                                <i ref='magnifier' onClick={this.onSearchClick} class="d-none"></i>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            )
       
    } else {
        if(this.props.key_words){
        return (
            <div>
            <div className='dimdom-bg'></div>
            <div class='container-fluid' >
                <div class="navbar row align-items-center" style={{background:'transparent' ,height:'115px'}}>
                    
                    <div class="col pl-5 pt-1">
                        <NavLink onClick={this.clearKeywords} className="dimdom-pink-logo" style={{fontSize:'40pt'}} to='/'>fxpedia.</NavLink>
                    </div>
                    <div class="col pt-1 text-center">                    
                        <NavLink to='/kategori' className='dimdom-pink col'>Browse Kategori</NavLink>
                                       
                    </div>       
                    
                    <div class="col pt-1 text-center">   
                         
                        <button onClick={this.props.onLogoutUser} className='col-6 mx-auto ui inverted basic dimdom3 button '>Logout</button>      
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
                        <div class="col pt-1 text-center">                    
                            <NavLink to='/kategori' className='dimdom-pink col'>Browse Kategori</NavLink>
                                           
                        </div>       
                        <div class="col pl-3 pt-2 text-center text-light">
                            <div class="ui icon input2">
                                <input onChange={(e)=>{this.setState({keywords: e.target.value})}} type="text" placeholder="Search..."/>
                                <Link to='/search' onClick={() => this.refs.magnifier.click()} className="dimdom-pink col mt-2"> Search
                                </Link>
                                <i ref='magnifier' onClick={this.onSearchClick} class="d-none"></i>
                            </div>
                        </div>
                        <div class="col pt-1 text-center">   
                             
                            <button onClick={this.props.onLogoutUser} className='col-6 mx-auto ui inverted basic dimdom3 button '>Logout</button>      
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
        user_name : state.auth.username,
        key_words : state.auth.keywords
    }
}

export default connect(mapStateToProps,{onLogoutUser,searchKeywords,clearKeywords})(Navbar)







 