import React, { Component } from 'react'
import axios from 'axios';
import {NavLink, Redirect} from 'react-router-dom'
// import {addProduct} from '../actions/index'
import {connect} from 'react-redux'

const urlApi = 'http://localhost:7777/auth/'

class Myproductdetail extends Component {

    state = {
        product: [],
        quantity: '',
        loading: 0
    }

    componentDidMount() {
        axios.get(urlApi + 'getproductbyid', {
            params: {
                userid: this.props.user_id,
                idproduct: this.props.match.params.id
            }
        }).then(res=>{
            this.setState({product: res.data[0]})           
        })
        .catch(err=>{
            console.log(err);
        })
    }
    
    render() {
        if(this.props.user_name){
        if(this.state.product.harga){
        return (
            <div className='card col-4 mx-auto my-3 pb-3'>
                <div className='card-header mt-2'>
                    <h3><b>{this.state.product.namaProduk}</b></h3>
                </div>
                <div className='card-body pb-1'>
                    <div className='text-center'>
                    <img className='card-img-top mb-3' src={this.state.product.fotoProduk} style={{width:'300px'}} alt=""/>
                    </div>
                    <h3><b>Description :</b></h3>
                    <p>{this.state.product.deskripsi}</p>
                    <h3><b>Harga {this.state.product.harga.toLocaleString('id')} :</b></h3>
                    <p>Rp. </p>
                </div>
                <input type='text' value={this.state.quantity} className='form-control' 
                onChange={(e)=>{this.quantityNow(e.target.value)}} placeholder='Quantity'/>
                <NavLink onClick={()=>{this.onAddCart(this.state.product.id, this.state.quantity)}} 
                className='btn btn-dimdom btn-block mt-2'>Add to Cart</NavLink>
            </div>
            )
        } else {
            return <div><h1>Loading</h1></div>
        }} else {
            return <Redirect to='/'/>
        }   
}
}

const mapStateToProps = (state)=>{
    return {
        product_in_cart : state.auth.productInCart,
        user_name: state.auth.username,
        user_id: state.auth.id
    }
}

export default connect(mapStateToProps)(Myproductdetail)