import React, { Component } from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import axios from 'axios'

import Footer from './Footer'
import Navbar from './Navbar'





const urlApi = 'http://localhost:7777/auth/'

class DetailTransaksi extends Component {

    state = {
        detail: [],
        totalBerat: 0
    }

    componentDidMount(){
        console.log(this.props.transaction_id);
        console.log(this.props.user_id);
        this.getDetail()
    }

    getDetail = ()=>{
        axios.get(urlApi+'gettransactiondetail',{
            params : {
                idBuyer:  this.props.user_id,
                idTransaction: this.props.transaction_id
            }
        }).then(res=>{
            this.setState({detail: res.data}) 
        }).catch(err=>{
            console.log(err);
        })
    }

    renderCart = () => {
        console.log(this.state.detail);
        this.subtotal = 0
        let hasil = this.state.detail.map((product)=>{
            let { namaProduk, harga, orderQty, fotoProduk, pulauBuyer, pulauSeller } = product 
            let berat = (product.berat/1000)*orderQty
            if(pulauBuyer==pulauSeller){
                var ongkir = 50000*berat
            } else { var ongkir = 160000*berat}
            let totalHarga = (parseInt(harga)*parseInt(orderQty))+ongkir
            this.subtotal += totalHarga   
            return (
                <>
                    <div className='col-1 card-title pt-3 pb-1'>
                        <img style={{width: '50px'}} src={`http://localhost:7777/files/${fotoProduk}`} alt="fotoproduk"/>
                    </div>
                    <div className='col-4 card-title pt-4 mb-2'>{namaProduk}</div>
                    <div className='col-2 card-title pt-4 mb-2'>Rp {harga.toLocaleString('id')}</div>
                    <div className='col-1 card-title pt-4 mb-2'>{orderQty}</div>
                    <div className='col-1 card-title pt-4 mb-2'>{berat}kg</div>
                    <div className='col-3 card-title pt-4 mb-2'>Rp {totalHarga.toLocaleString('id')}</div>
                </>
            )
        })
        return hasil
    }

    renderList = () => {
        return (
            <div className='row align-items-center text-light quic700'>
                <div className='col-11 mx-auto card'>
                    <div className='card-body'>
                    <div className='row card-title pt-4'>
                        <div className='col-1 card-title pt-3 pb-1'>
                            <i className='big shopping cart icon text-right' style={{color: 'rgb(255, 31, 210)'}}></i>
                        </div>
                        <div className='col-8 card-title pt-4 pb-1 pl-0 quic700p text-left'>
                            Detail Belanja
                        </div>   
                    </div>
                    <div className='dimdom-bottom'></div>
                    <div className='row justify-content-center'>
                        <div className='col-5 card-title pt-4 mb-2 text-center'>Produk</div>
                        <div className='col-2 card-title pt-4 mb-2'>Harga Satuan</div>
                        <div className='col-1 card-title pt-4 mb-2'>Qty</div>
                        <div className='col-1 card-title pt-4 mb-2'>Berat</div>
                        <div className='col-3 card-title pt-4 mb-2'>Total Harga + Ongkir</div>
                        <div class="w-100"></div>
                        {this.renderCart()}
                    </div>
                    <br/>
                    <div className='dimdom-bottom'></div>
                    <div className='row card-title pt-4'>
                        <div className='col-5 card-title pt-2 pb-1'>
                        </div>
                        <div className='col-2 card-title pt-2 mb-2 text-right'>Subtotal</div>
                        <div className='col-3 card-title pt-2 mb-2 quic700p' style={{fontSize:'16pt'}}>Rp {this.subtotal.toLocaleString('id')}</div>
                    </div>                    
                    <div className='row'>
                        <div className='col pt-3'>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        if(this.props.user_name){
        return(   
            <AbsoluteWrapper>
                <Navbar/>
                <div className='row dim-height-addproduct text-light'> 
                    <div className='col-12'>
                        {this.renderList()}
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
        user_id : state.auth.id,
        transaction_id : state.auth.transactionId
    }
}

export default connect(mapStateToProps)(DetailTransaksi)