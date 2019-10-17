import React, { Component } from 'react'
import {NavLink} from 'react-router-dom'

class Sidebar extends Component {

    render() {
        return(   
            <div className='col-3 mt-3'>
                <div className='card-nav p-3 dim-height-nav'>
                    <div className='card-title'>
                    <NavLink to='/dashboard' className='ui inverted basic dimdom4 button mt-5'>Dashboard</NavLink>
                    <NavLink to='/addproduct' className='ui inverted basic dimdom4 button'>Add_Product</NavLink>
                    <NavLink to='/myproduct' className='ui inverted basic dimdom4 button'>My_Products</NavLink>
                    <button onClick={()=> this.setState({kategori: 'mycart'})} className='ui inverted basic dimdom4 button'>My_Cart</button>
                    <button onClick={()=> this.setState({kategori: 'myprofile'})} className='ui inverted basic dimdom4 button'>My_Profile</button>    
                    </div>
                </div>
            </div>
        )
    }
}


export default Sidebar