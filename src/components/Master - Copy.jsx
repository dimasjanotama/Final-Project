import React, { Component } from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import axios from 'axios'

import Footer from './Footer'
import Navbar from './Navbar'
import Myproduct from './Myproductawal'



const urlApi = 'http://localhost:7777/auth/'

class Dashboard extends Component {

    state = {
        kategori: '',
        show: false,
        namaProduk: '',
        kategori: '',
        subKategori: '',
        harga: '',
        berat: '',
        kondisi: '',
        deskripsi: '',
        message: '',
        error: '',
        selectedFile: '',
        products: [],
    }
    
    componentDidMount(){
        this.renderProducts()
    }

    renderProducts = ()=>{
        axios.get(urlApi + 'getproduct', {
            params: {
                userid: this.props.user_id
            }
        }).then(res=>{
            this.setState({products: res.data})
            console.log(res.data)
        })
        .catch(err=>{
            console.log(err);
        })
    }

    renderList = () => {

        
        if (this.state.kategori === 'dashboard'){
            return(
                <div className='card-nav p-3'>
                    INI DASHBOARD
                </div>
            )
        } else if (this.state.kategori === 'myproducts'){
            return <div className='container'>
                    <div className='row ml-2 mr-2'>
            {this.state.products.map((product)=>{
                return <Myproduct barang={product} key={product.id}/>
            })}
                {/* KUNCINYA DISINI...!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
            </div>
            </div>
            
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
                            <NavLink to='/dashboarddd' className='ui inverted basic dimdom4 button mt-5'>Dashboard</NavLink>
                            <button onClick={this.showModal} className='ui inverted basic dimdom4 button'>Add_Product</button>
                            <button onClick={()=> this.setState({kategori: 'myproducts'})} className='ui inverted basic dimdom4 button'>My_Products</button>
                            <button onClick={()=> this.setState({kategori: 'mycart'})} className='ui inverted basic dimdom4 button'>My_Cart</button>
                            <button onClick={()=> this.setState({kategori: 'myprofile'})} className='ui inverted basic dimdom4 button'>My_Profile</button>    
                            </div>
                        </div>
                    </div>
                    <div className='col-9 mt-3'>
                        {this.renderList()}
                        {this.welcome()}
                    </div>
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
        user_name: state.auth.username,
        toggle_show: state.auth.show,
        user_id : state.auth.id
    }
}

export default connect(mapStateToProps)(Dashboard)