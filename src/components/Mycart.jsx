import React, { Component } from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import axios from 'axios'

import Footer from './Footer'
import Navbar from './Navbar'
import Sidebar from './Sidebar'




const urlApi = 'http://localhost:7777/auth/'

class Mycart extends Component {

    state = {
        carts: [],
        user: []
    }

    componentDidMount = ()=>{
        axios.get(urlApi+'getuserbyid' ,{
            params : {
                userid: this.props.user_id
            }
        }).then(res=>{
            this.setState({user: res.data[0]})
            this.getCart()
        }).catch(err=>{
            console.log(err);
            
        })
    }

    getCart = ()=>{
        axios.get(urlApi+'getcart',{
            params : {
                idBuyer:  this.props.user_id
            }
        }).then(res=>{
            this.setState({carts: res.data})
            console.log(res.data);  
        }).catch(err=>{
            console.log(err);
        })
    }

    onDeleteClick = (idcart) => {
        axios.delete(urlApi+'deletecart',{
            data : {
                idCart : idcart
            }
        }
        ).then(res=>{
            alert('Berhasil menghapus produk')
            this.getCart()
        }).catch(err=>{
            console.log(err);
        })
    }

    renderCart = () => {
        let hasil = this.state.carts.map((product)=>{
            let { id, namaProduk, harga, orderQty, fotoProduk } = product 
            let totalHarga = parseInt(harga)*parseInt(orderQty)
            return (
                <>
                    <div className='col-1 card-title pt-3 pb-1'>
                        <img style={{width: '50px'}} src={`http://localhost:7777/files/${fotoProduk}`} alt="fotoproduk"/>
                    </div>
                    <div className='col-4 card-title pt-4 mb-2'>{namaProduk}</div>
                    <div className='col-2 card-title pt-4 mb-2'>{harga}</div>
                    <div className='col-1 card-title pt-4 mb-2'>{orderQty}</div>
                    <div className='col-2 card-title pt-4 mb-2'>{totalHarga}</div>
                    <div className='col-2 card-title pt-4 mb-2'>
                        <button onClick={()=>{this.onDeleteClick(id)}} className='ui inverted basic dimdom3 button mt-n2'>Hapus</button>
                    </div>
                </>
            )
        })
        return hasil
    }

    renderList = () => {
        return (
            <div className='row align-items-center text-light quic700'>
                <div className='col-10 mx-auto card'>
                    <div className='card-body'>
                    <div className='card-title subjudul'>
                        My Cart
                    </div>
                    <div className='row card-title pt-4'>
                        <div className='col-1 card-title pt-3 pb-1'>
                            <i className='big map marker alternate icon text-right' style={{color: 'rgb(255, 31, 210)'}}></i>
                        </div>
                        <div className='col-8 card-title pt-4 pb-1 pl-0 quic700p text-left'>
                            Alamat Pengiriman
                        </div>   
                    </div>
                    <div className='dimdom-bottom'></div>
                    <div className='row'>
                        <div className='col-3 card-title pt-3 mb-2 quic700b'><b>{this.state.user.namaDepan} {this.state.user.namaBelakang}</b></div>
                        <div className='col-9 card-title pt-3 mb-2 quic700'>{this.state.user.alamat} {this.state.user.kelurahan}, {this.state.user.kecamatan}, {this.state.user.kabupaten}, {this.state.user.propinsi} {this.state.user.kodepos}
                        </div>
                        <div class="w-100"></div>
                    </div>
                    <div className='row card-title pt-4'>
                        <div className='col-1 card-title pt-3 pb-1'>
                            <i className='big shopping cart icon text-right' style={{color: 'rgb(255, 31, 210)'}}></i>
                        </div>
                        <div className='col-8 card-title pt-4 pb-1 pl-0 quic700p text-left'>
                            Detail Belanja
                        </div>   
                    </div>
                    <div className='dimdom-bottom'></div>
                    <div className='row'>
                        <div className='col-5 card-title pt-4 mb-2 text-center'>Produk</div>
                        <div className='col-2 card-title pt-4 mb-2'>Harga Satuan</div>
                        <div className='col-1 card-title pt-4 mb-2'>Qty</div>
                        <div className='col-2 card-title pt-4 mb-2'>Total Harga</div>
                        <div className='col-2 card-title pt-4 mb-2 text-center'>Aksi</div>
                        <div class="w-100"></div>
                        {this.renderCart()}
                    </div>
                    <br/>
                    <div className='dimdom-bottom'></div>
                    <div className='row card-title pt-4'>
                        <div className='col-5 card-title pt-3 pb-1'>
                        </div>
                        <div className='col-2 card-title pt-4 mb-2 text-right'>Ongkir</div>
                        <div className='col-3 card-title pt-4 mb-2'>Rp 15.000</div>
                        <div className='col-2 card-title pt-4 mb-2'>
                        </div>
                    </div>
                    <div className='row card-title'>
                        <div className='col-5 card-title pt-2 pb-1'>
                        </div>
                        <div className='col-2 card-title pt-2 mb-2 text-right'>Subtotal</div>
                        <div className='col-3 card-title pt-2 mb-2 quic700p' style={{fontSize:'16pt'}}>Rp 1.500.000</div>
                        <div className='col-2 card-title pt-2 mb-2'>
                            <button className='ui inverted basic dimdom3 button mt-n2'>Bayar</button>
                        </div>
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
                    <Sidebar/>
                    <div className='col-9'>
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
        user_id : state.auth.id
    }
}

export default connect(mapStateToProps)(Mycart)