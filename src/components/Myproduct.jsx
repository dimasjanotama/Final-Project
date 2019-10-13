import React, { Component } from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

class Myproduct extends Component {
    render() {
        let {id, name, price, picture} = this.props.barang 
        let numberWithCommas = (x) => {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        let pricey = numberWithCommas(price)
        // membuat variabel dg menyamakan property pada 
            // this.props.barang=searchProduct=res.data (data produk yang disearch) 
        return (
            <div className='card col-3 mx-4 my-3' >
                <img src={picture} alt='fotoproduk.jpg' className='card-img-top'/>
                <div className='card-body'>
                    <h5 className='card-title'>{name}</h5>
                    <p className='card-text'>Rp. {pricey}</p>
                    <input type="number" className='form-control' ref={(input)=>{this.qty=input}} />
                    <Link to={`/productdetail/${id}`}>
                        <button className='btn btn-block btn-dimdom mb-2 mt-2'>Detail</button>
                    </Link>
                    <button className='btn btn-dimdom btn-block' onClick={this.onAddToCart}>Add To cart</button>
                </div>
            </div>)
    }
}

const mapStateToProps = (state)=>{
    return {
        user_id : state.auth.id,
        user_name : state.auth.username
    }
}

export default connect(mapStateToProps)(Myproduct)
