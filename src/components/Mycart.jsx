import React, { Component } from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import axios from 'axios'
import moment from 'moment'
import alertify from 'alertifyjs'

import Footer from './Footer'
import Navbar from './Navbar'
import { setKodeUnik, clearKodeUnik } from '../actions'





const urlApi = 'http://localhost:7777/auth/'

class Mycart extends Component {

    state = {
        carts: [],
        user: [],
        totalBerat: 0,
        redirect : false,
        unpaid:[]
    }

    componentDidMount = ()=>{
        let token = localStorage.getItem('token')
        axios.get(urlApi+'getuserbyid' ,{
            params : {
                userid: this.props.user_id
            },
            headers : {
                authorization : token
            }
        }).then(res=>{
            this.setState({user: res.data[0]})
            this.getCart()
            this.getUnpaid()
            
        }).catch(err=>{
            console.log(err);
        })
    }

    getUnpaid = ()=>{
        let token = localStorage.getItem('token')
        axios.get(urlApi+'getunverifiedtransaction',{
            params : {
                idBuyer:  this.props.user_id
            },
            headers : {
                authorization : token
            }
        }).then(res=>{
            this.setState({ unpaid: res.data })
            if(!this.props.kode_unik){
                let kodeUnik = Math.floor(Math.random()*500)
                this.props.setKodeUnik(kodeUnik)
                } else {}
        }).catch(err=>{
            console.log(err);
        })
    }



    getCart = ()=>{
        let token = localStorage.getItem('token')
        axios.get(urlApi+'getcart',{
            params : {
                idBuyer:  this.props.user_id
            },
            headers : {
                authorization : token
            }
        }).then(res=>{
            this.setState({carts: res.data}) 
        }).catch(err=>{
            console.log(err);
        })
    }

    onDeleteClick = (product) => {
        axios.delete(urlApi+'deletecart',{
            data : {
                idCart : product.id,
                idProduct : product.idProduct,
                orderQty: product.orderQty,
                idBuyer: this.props.user_id
            }
        }
        ).then(res=>{
            alertify.message('Berhasil menghapus produk')
            this.getCart()
        }).catch(err=>{
            console.log(err);
        })
    }

    renderCart = () => {
        this.totalSemua = 0
        let hasil = this.state.carts.map((product)=>{
            let totalSemua = 0
            let { id, namaProduk, harga, orderQty, fotoProduk, pulauBuyer, pulauSeller } = product 
            let berat = (Math.ceil(product.berat/1000))*orderQty
            if(pulauBuyer==pulauSeller){
                var ongkir = 50000*berat
            } else { var ongkir = 160000*berat}
            let totalHarga = (parseInt(harga)*parseInt(orderQty))+ongkir
            this.totalSemua += totalHarga
            // this.subtotal = totalSemua + parseInt(this.props.kode_unik)
            return (
                <>
                    <div className='col-1 card-title pt-3 pb-1'>
                        <img style={{width: '50px'}} src={`http://localhost:7777/files/${fotoProduk}`} alt="fotoproduk"/>
                    </div>
                    <div className='col-3 card-title pt-4 mb-2'>{namaProduk}</div>
                    <div className='col-2 card-title pt-4 mb-2'>Rp {harga.toLocaleString('id')}</div>
                    <div className='col-1 card-title pt-4 mb-2'>{orderQty}</div>
                    <div className='col-1 card-title pt-4 mb-2'>{berat}kg</div>
                    <div className='col-2 card-title pt-4 mb-2'>Rp {totalHarga.toLocaleString('id')}</div>
                    <div className='col-2 card-title pt-4 mb-2'>
                        <button onClick={()=>{this.onDeleteClick(product)}} className='ui inverted basic dimdom3 button mt-n2'>Hapus</button>
                    </div>
                </>
            )
        })
        this.subtotal = this.totalSemua + parseInt(this.props.kode_unik)
        return hasil
    }

    checkOut = () => {
        if(this.state.unpaid[0]){
            alertify.alert('Keterangan','Selesaikan terlebih dahulu pembayaran untuk orderan anda yang sebelumnya')
        } else {
            this.state.carts.map((product)=>{
                axios.put(urlApi+'refreshquantity',{
                    idProduct: product.idProduct,
                    orderQty: product.orderQty
                }).then(res=>{
                }).catch(err=>{
                    console.log(err);
                })
            })
            axios.post(urlApi+'addtransaction',{
                tglPembelian: moment().format('YYYY-MM-DD')+' '+ moment().format('HH:mm:ss'),
                tglExpired: moment().add(1, 'd').format('YYYY-MM-DD')+' '+ moment().format('HH:mm:ss'),
                idBuyer: this.props.user_id,
                namaBuyer: this.state.user.username,
                nilaiTransaksi: this.subtotal,
                idSeller: this.state.carts[0].idSeller,
                namaSeller: this.state.carts[0].namaSeller
            }).then(res=>{
                axios.delete(urlApi+'deletecartbyuserid',{
                    data : {
                        idBuyer: this.props.user_id
                    }
                }
                ).then(res=>{
                    this.props.clearKodeUnik()
                    alertify.alert('Keterangan', 'Berhasil, Silahkan lakukan prosedur pembayaran sesuai petunjuk')
                    this.getCart()
                    this.setState({redirect: true})
                }).catch(err=>{
                    console.log(err);
                })
            }).catch(err=>{
                console.log(err);
            })
        }
    }



    renderList = () => {
        if(this.state.carts[0]){
        return (
            <div className='row align-items-center quic700'>
                <div className='col-11 mx-auto card'>
                <div className='row cardwhite ml-3 mr-3 mt-4 mb-4 pr-4 pl-4 justify-content-center'>
                    <div className='col-12 cardgrey ml-4 mr-4 mt-4 mb-5 pt-4 pb-4 pr-3 pl-5 text-dark' style={{fontSize:'16pt'}}>
                        Keranjang Belanja
                    </div>
                    <div className='col text-dark pb-5'>
                        <div className='row'>
                            <div className='col-1 card-title pr-0'>
                                <i className='big map marker alternate huge icon text-right' style={{color: 'rgb(255, 31, 210)'}}></i>
                            </div>
                            <div className='col-4 card-title pl-0 pt-3 quic700 text-left' style={{fontSize:'25pt'}}>
                                Alamat Pengiriman
                            </div>   
                        </div>
                        <div className='row'>
                            <div className='col-1 card-title pb-1 pr-0'></div>
                            <div className='col-8 card-title pb-1 pl-0 mb-3 text-left'  style={{fontSize:'17pt'}}><b>{this.state.user.namaDepan} {this.state.user.namaBelakang} ({this.state.user.noTelp})</b></div>
                            <div class="w-100"></div>
                            <div className='col-1 card-title pb-1 pr-0'></div>
                            <div className='col-11 card-title pb-1 pl-0 mb-2 text-left'  style={{fontSize:'14pt'}}>{this.state.user.alamat} {this.state.user.kelurahan}, {this.state.user.kecamatan}, {this.state.user.kabupaten}, {this.state.user.propinsi} {this.state.user.kodepos}
                        </div>
                        <div class="w-100"></div>
                    </div>
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
                                <div className='col-3 card-title pt-2 mb-2 text-right'>Digit Unik</div>
                                <div className='col-5 card-title pt-2 mb-2 quic700' style={{fontSize:'12pt'}}>{this.props.kode_unik}</div>
                                <div className='col-2 card-title pt-2 mb-2'></div>
                            </div>
                            <div className='row'>
                                <div className='col-3 card-title pt-2 mb-2 text-right'>Subtotal</div>
                                <div className='col-5 card-title pt-2 mb-2 quic700p' style={{fontSize:'16pt'}}>Rp {this.subtotal.toLocaleString('id')}</div>
                                <div className='col-2 card-title pt-2 mb-2'>
                                    <button onClick={this.checkOut} className='ui inverted basic dimdom3 button mt-n2'>Bayar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>      
            </div>
            </div>
        )
        } else {
            this.props.clearKodeUnik()
            return (
                <div className='col-11 mx-auto cardwhite quic700'>
                    <div className='card-body'>
                        <div className='col-11 cardgrey ml-5 mr-4 mt-4 mb-5 pt-4 pb-4 pr-3 pl-5 text-black-50' style={{fontSize:'16pt'}}>
                            Keranjang kamu masih kosong
                        </div>
                        <div className='row text-center'>
                            <div className='latar'>
                                <i className='info circle huge icon' style={{color:'black',backgroundColor:'transparent'}}></i>
                            </div>
                            <div className='w-100'></div>
                            <div className='col text-center text-black-50 pt-4' style={{fontSize:'12pt'}}>
                                <p>Yuk! cari produk yang kamu mau <NavLink to='search' className='dimdom-pink'>disini</NavLink></p>
                            </div>
                        </div>
                        <div className='row text-right pt-3 pb-3'>
                            <div className='col'>
                                <img className='dino' src={require('../lib/pictures/dino2.png')} alt=""/>
                                <img className='pedal' src={require('../lib/pictures/pedal2.jpg')} alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    render() {
        if(this.state.redirect){
            return <Redirect to='/notification'/>
        }
        if(this.props.user_name){
        return(   
            <AbsoluteWrapper>
                <Navbar/>
                <div className='row'> 
                    <div className='col-11 mx-auto mt-3'>
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
        kode_unik : state.auth.kodeUnik
    }
}

export default connect(mapStateToProps,{setKodeUnik, clearKodeUnik})(Mycart)