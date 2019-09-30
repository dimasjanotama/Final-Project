import React, { Component } from 'react'
import {NavLink} from 'react-router-dom'
import {connect} from 'react-redux'
import { onLogoutUser } from '../actions'


class Navbar extends Component {
    render () {
        if(!this.props.user_name){
        return(
            <div>
            <div className='dimdom-bg'></div>
            <div class='container-fluid' >
                <div class="navbar row align-items-center" style={{background:'transparent' ,height:'115px'}}>
                    
                    <div class="col pl-5 pt-1">
                        <NavLink className="dimdom-pink-logo" style={{fontSize:'40pt'}} to='/'>fxpedia.</NavLink>
                    </div>
                    <div class="col pt-1 text-center">                    
                        <NavLink to='/kategori' className='dimdom-pink col'>Browse Kategori</NavLink>
                                       
                    </div>       
                    <div class="col pl-3 pt-2 text-center text-light">
                    <div class="ui icon input2">
                            <input type="text" placeholder="Search fx..."/>
                            <i class="inverted dimdom search link icon"></i>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
    } else {
        return (
            <div>
            <div className='dimdom-bg'></div>
            <div class='container-fluid' >
                <div class="navbar row align-items-center" style={{background:'transparent' ,height:'115px'}}>
                    
                    <div class="col pl-5 pt-1">
                        <NavLink className="dimdom-pink-logo" style={{fontSize:'40pt'}} to='/'>fxpedia.</NavLink>
                    </div>
                    <div class="col pt-1 text-center">                    
                        <NavLink to='/kategori' className='dimdom-pink col'>Browse Kategori</NavLink>
                                       
                    </div>       
                    <div class="col pl-3 pt-2 text-center text-light">
                        <div class="ui icon input2">
                            <input type="text" placeholder="Search..."/>
                            <i class="inverted dimdom search link icon"></i>
                        </div>
                    </div>
                    <div class="col pt-1 text-center">   
                         
                        <button onClick={this.props.onLogoutUser} className='col-6 mx-auto ui inverted basic dimdom3 button '>Logout</button>      
                    </div>   
                </div>
            </div>
            </div>
            
          
        )}
    }
}

const mapStateToProps = (state) => {
    return {
        user_name : state.auth.username
    }
}

export default connect(mapStateToProps,{onLogoutUser})(Navbar)







 