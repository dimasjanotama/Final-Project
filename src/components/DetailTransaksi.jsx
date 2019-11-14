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
        this.totalSemua = 0
        let hasil = this.state.detail.map((product)=>{
            let { namaProduk, harga, orderQty, fotoProduk, pulauBuyer, pulauSeller } = product 
            let berat = (product.berat/1000)*orderQty
            if(pulauBuyer==pulauSeller){
                var ongkir = 50000*berat
            } else { var ongkir = 160000*berat}
            let totalHarga = (parseInt(harga)*parseInt(orderQty))+ongkir
            this.totalSemua += totalHarga
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
        this.subtotal = this.totalSemua
        return hasil
    }

    renderList = () => {
        return (
            <div className='row align-items-center quic700'>
                <div className='col-11 mx-auto cardwhite pb-5'>
                <div className='row pt-4'>
                        <div className='col-1 card-title pr-0'>
                            <i className='big shopping cart huge icon text-right' style={{color: 'rgb(255, 31, 210)'}}></i>
                        </div>
                        <div className='col-4 card-title pl-0 pt-3 quic700 text-left' style={{fontSize:'25pt'}}>
                            Detail Belanja
                        </div>   
                    </div>
                    <div className='row pt-4'>
                        <div className='col-11 cardwhite mx-auto'>
                            <div className='row'>
                                <div className='col-4 card-title pt-4 mb-4 text-center'>Produk</div>
                                <div className='col-2 card-title pt-4 mb-4'>Harga Satuan</div>
                                <div className='col-1 card-title pt-4 mb-4'>Qty</div>
                                <div className='col-1 card-title pt-4 mb-4'>Berat</div>
                                <div className='col-4 card-title pt-4 mb-4'>Total Harga + Ongkir</div>
                                <div class="w-100"></div>
                                {this.renderCart()}
                            </div>
                        </div>
                    </div>
                    <div className='row pt-4'>
                        <div className='col-5 cardwhite pt-3 pb-3' style={{left:'53%'}}>
                            <div className='row'>
                                <div className='col-4 card-title pt-2 mb-2 text-right'>Subtotal</div>
                                <div className='col-7 card-title pt-2 mb-2 quic700p' style={{fontSize:'16pt'}}>Rp {this.subtotal.toLocaleString('id')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        if(this.props.user_name && this.props.user_name!=='Admin'){
        return(   
            <AbsoluteWrapper>
                <Navbar/>
                <div className='row dim-wrapper text-light'> 
                    <div className='col-11 mx-auto mt-3'>
                        {this.renderList()}
                    </div>
                </div>
                <Footer />
            </AbsoluteWrapper>
        )
        } else if (this.props.user_name && this.props.user_name=='Admin'){
            return <Redirect to='/verifier'/>
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