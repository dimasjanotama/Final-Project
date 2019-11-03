import React, { Component } from 'react'
import {NavLink} from 'react-router-dom'

class Sidebar extends Component {

    render() {
        return(   
            <div className='col-3 mt-3'>
                <div className='card-nav p-3 dim-height-nav'>
                    <div className='card-title'>
                    <NavLink to='/dashboard' className='ui inverted basic dimdom4 button mt-5'>Notification</NavLink>
                    <NavLink to='/addproduct' className='ui inverted basic dimdom4 button'>Add Product</NavLink>
                    <NavLink to='/myproduct' className='ui inverted basic dimdom4 button'>My Products</NavLink>
                    <NavLink to='/mycart' className='ui inverted basic dimdom4 button'>My Cart</NavLink>
                    <NavLink to='/myprofile' className='ui inverted basic dimdom4 button'>My Profile</NavLink>      
                    </div>
                </div>
            </div>
        )
    }
}


export default Sidebar