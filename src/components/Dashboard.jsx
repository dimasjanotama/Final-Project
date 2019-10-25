import React, { Component } from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import axios from 'axios'

import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'


const urlApi = 'http://localhost:7777/auth/'

class Dashboard extends Component {

    state = {
        bills: [],
        orders: [],
        noTransaction : false,
        noOrder : false,
        selectedFile: '',
        selectedFile2: '',
        noRek: '',
        namaRek: '',
        toogle: ''
    }

    componentDidMount(){
        this.getTransaction()
        this.setState({toogle: 'buyer'})
        this.getOrderlist()
    }

    getTransaction = () => {
        axios.get(urlApi+'gettransaction',{
            params : {
                idBuyer:  this.props.user_id
            }
        }).then(res=>{
            if(res.data[0]){
            this.setState({
                bills: res.data[0],
                status: res.data[0].isVerified
            })
            } else {this.setState({noTransaction: true})} 
        }).catch(err=>{
            console.log(err);
        })
    }

    getOrderlist = () => {
        axios.get(urlApi+'getorderlist',{
            params : {
                idSeller:  this.props.user_id
            }
        }).then(res=>{
            console.log(res.data[0]);
            if(res.data[0]){
            this.setState({
                orders: res.data
            })
            } else {this.setState({noOrder: true})} 
        }).catch(err=>{
            console.log(err);
        })
    }

    displayfilename = ()=>{
        if (this.state.selectedFile) {
            return (
                <div className='mt-0'>
                    {this.state.selectedFile.name}
                </div>
            )
        } else {
            return null
        }
    }

    onSubmitClick = () => {
        var today = new Date()
        var year = today.getFullYear()
        var month = today.getMonth()+1
        var date = today.getDate()
        var tglPembayaran = `${year}-${month}-${date}`
        var fd = new FormData()
        var data = {   
            idBuyer: this.props.user_id,
            tglPembayaran: tglPembayaran,
            noRek: this.state.noRek,
            namaRek: this.state.namaRek
        }
        console.log(this.state.selectedFile, this.state.selectedFile.name);
        fd.append('anehkonfirmasi', this.state.selectedFile, this.state.selectedFile.name)
        fd.append('data', JSON.stringify(data))
        axios.post(urlApi+'paymentconfirm', fd)
        .then(res=>{
            alert('Konfirmasi berhasi, silahkan tunggu max 1X24 jam untuk verifikasi')
            this.getTransaction()
        }).catch(err=>{
            console.log(err)
        })
    } 

    konfirmasiTerima = (transactionId) =>{
        axios.put(urlApi + 'receivepacket',{
            id: transactionId
        })
        .then((res)=>{
        alert('Success')
        this.getTransaction()
        }).catch(err=>{
            console.log(err);
        })
    }

    buyer = ()=>{
        let batasWaktu = `${this.state.bills.tglExpired}`
        let batas = batasWaktu.substr(0,10)
        let tglPembelian = `${this.state.bills.tglPembelian}`
        let tglBeli = tglPembelian.substr(0,10)
        let tglPembayaran = `${this.state.bills.tglPembayaran}`
        let tglBayar = tglPembayaran.substr(0,10)
        if (this.state.bills.isVerified){
            var status = 'Sudah Dibayar'
        } else {
            if(this.state.bills.buktiPembayaran){
                var status = 'Proses Verifikasi'
            } else {
            var status = 'Belum Dibayar'
            }
        } 
        if (!this.state.noTransaction){
            if(this.state.status==1) {
                let status = 'Menunggu Dikirim'
                return (
                    <>
                    <div className='card-title subjudul'>
                        Status Order
                    </div>
                    <table class="table table-striped table-dark">
                    <thead>
                        <tr>
                        <th scope="col">ID Transaksi</th>    
                        <th scope="col">Tgl Pembelian</th>
                        <th scope="col">Nilai Transaksi</th>
                        <th scope="col">Tgl Pembayaran</th>
                        <th scope="col">Status</th>
                        <th scope="col">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <th scope="col">{this.state.bills.id}</th>    
                        <th scope="col">{tglBeli}</th>
                        <th scope="col">{this.state.bills.nilaiTransaksi.toLocaleString('id')}</th>
                        <th scope="col">{tglBayar}</th>
                        <th scope="col">{status}</th>
                        <th scope="col">
                          <input onClick={() => {this.konfirmasiTerima(this.state.bills.id)}} type="button" 
                          className="ui inverted basic dimdom3 button" value="Konfirmasi Terima"/>
                        </th>
                        </tr>
                    </tbody>
                    </table>
                    </>
                )
            } else if(this.state.status==0) {
                return (
                    <div>
                        <div className='card-title subjudul'>
                            Mohon segera selesaikan pembayaran Anda
                        </div>
                        <div className='row'>
                            <div className='col card-title pt-4 mb-2'>Total Tagihan</div>
                            <div className='col card-title pt-4 mb-2'>Unggah bukti pembayaran sebelum Tanggal</div>
                            <div class="w-100"></div>    
                            <div className='col card-title pt-4 mb-2 quic700p'>Rp. {this.state.bills.nilaiTransaksi}</div>
                            <div className='col card-title pt-4 mb-2 quic700p'>{batas}</div>    
                            <div class="w-100"></div>          
                            <div className='col card-title pt-4 mb-2'>Rekening Pembayaran</div>
                            <div className='col card-title pt-4 mb-2'>Status Pembayaran</div>
                            <div class="w-100"></div>   
                            <div className='col card-title pt-4 mb-2 quic700p'>
                                <img style={{width: '100px'}} src={require('../lib/pictures/cimb.jpg')}/>  123456789 an. Fxpedia 
                            </div>
                            <div className='col card-title pt-4 mb-2 quic700p'>{status}</div>   
                        </div>
                        <div className='dimdom-bottom pt-4'></div>
                        <div className='card-title subjudul pt-4'>
                            Konfirmasi pembayaran
                        </div>
                        <div class="row">  
                            <div className='col card-title pt-4 mb-2'>Masukkan No.rekening yang digunakan saat pembayaran</div>
                            <div className='col card-title pt-4 mb-2'>Masukkan Nama di No.Rekening</div>
                            <div class="w-100"></div>    
                            <div className='col ui input2 pt-4 mb-2'>
                                <input onChange={(e) => this.setState({noRek: e.target.value})} type="text" placeholder="Masukkan No. Rekening"/>
                            </div>
                            <div className='col ui input2 pt-4 mb-2'>
                                <input onChange={(e) => this.setState({namaRek: e.target.value})} type="text" placeholder="Masukkan Nama di No.Rekening"/>
                            </div>
                            <div class="w-100"></div>    
                            <div className='col card-title pt-4'>
                                <div class="ui inverted basic dimdom3 buttons">
                                    <input type='button' onClick={() => this.refs.fileBtn.click()} className='ui inverted basic dimdom3 button' value='Unggah bukti pembayaran'/>
                                    <input onClick={this.onSubmitClick} type="button" className="ui inverted basic dimdom3 button" value="Submit konfirmasi"/>
                                </div>
                                    <input type="file" ref='fileBtn' onChange={(e) => this.setState({selectedFile : e.target.files[0]})} className='d-none'/>
                            </div>
                            <div class="w-100"></div>  
                            <div className='col card-title'>
                                {this.displayfilename()}
                            </div>
                            <div class="w-100"></div> 
                            <div className='pt-3'>
                            </div> 
                            
                        </div> 
                    </div>  
                )
            } else {
                return null
            }
            }  else {
            return null
        }}

    renderOrderlist=()=>{
        let hasil = this.state.orders.map((order)=>{
            return (
                <tr>
                    <th scope="col">{order.idTransaction}</th>    
                    <th scope="col"><img style={{width: '50px'}} src={`http://localhost:7777/files/${order.fotoProduk}`} alt="fotoproduk"/></th>
                    <th scope="col">{order.namaProduk}</th>
                    <th scope="col">{order.orderQty}</th>
                    <th scope="col">{order.harga.toLocaleString('id')}</th>
                </tr>
            )
        })
        return hasil
    }

    seller = () => {
        if(!this.state.noOrder){
        return (
            <div>
                <div className='card-title subjudul'>
                    Ada orderan baru, silahkan lakukan pengiriman!
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
                    <table class="table table-striped table-dark">
                    <thead>
                        <tr>
                        <th scope="col">ID Transaksi</th>    
                        <th scope="col">Foto</th>
                        <th scope="col">Produk</th>
                        <th scope="col">Order Qty</th>
                        <th scope="col">Harga</th>
                        </tr>
                        
                    </thead>
                    <tbody>
                        {this.renderOrderlist()}
                    </tbody>
                    </table>

                <div className='dimdom-bottom pt-4'></div>
                <div className='card-title subjudul pt-4'>
                    Konfirmasi pengiriman
                </div>
                <div class="row">  
                    <div className='col card-title pt-4 mb-2'>Masukkan No.resi pengiriman</div>
                    <div className='col card-title pt-4 mb-2'>Masukkan total harga + biaya pengiriman</div>
                    <div class="w-100"></div>    
                    <div className='col ui input2 pt-4 mb-2'>
                        <input onChange={(e) => this.setState({noResi: e.target.value})} type="text" placeholder="Masukkan No. Resi"/>
                    </div>
                    <div className='col ui input2 pt-4 mb-2'>
                        <input onChange={(e) => this.setState({hakSeller: e.target.value})} type="text" placeholder="Masukkan total harga + ongkir"/>
                    </div>
                    <div class="w-100"></div>    
                    <div className='col card-title pt-4'>
                        <div class="ui inverted basic dimdom3 buttons">
                            <input type='button' onClick={() => this.refs.fileBtn2.click()} className='ui inverted basic dimdom3 button' value='Unggah bukti pengiriman'/>
                            <input onClick={this.onSubmitClick} type="button" className="ui inverted basic dimdom3 button" value="Submit konfirmasi"/>
                        </div>
                            <input type="file" ref='fileBtn2' onChange={(e) => this.setState({selectedFile2 : e.target.files[0]})} className='d-none'/>
                    </div>
                    <div class="w-100"></div>  
                    <div className='col card-title'>
                        {this.displayfilename()}
                    </div>
                    <div class="w-100"></div> 
                    <div className='pt-3'>
                    </div> 
                </div> 
            </div>  
        )} else {
            return null
        }
    }

    renderList = () => {
        if(this.state.toogle=='buyer'){
        return (
            <div className='row align-items-center text-light quic700'>
                <div className='col-11 mx-auto card'>
                    <div className='card-body'>
                        <div className='row card-title'>
                            <div className='col card-title text-right'>
                                <div class="ui inverted basic dimdom3 buttons">
                                    <button onClick={()=>{this.setState({toogle: 'buyer'})}} class="ui inverted basic dimdom3 button">Buyer</button>
                                    <button onClick={()=>{this.setState({toogle: 'seller'})}} class="ui inverted basic dimdom3 button">Seller</button>
                                </div>
                            </div>
                        </div>
                        {this.buyer()}
                    </div>
                </div>
            </div>
        )} else {
            return (
                <div className='row align-items-center text-light quic700'>
                    <div className='col-11 mx-auto card'>
                        <div className='card-body'>
                            <div className='row card-title'>
                                <div className='col card-title text-right'>
                                    <div class="ui inverted basic dimdom3 buttons">
                                        <button onClick={()=>{this.setState({toogle: 'buyer'})}} class="ui inverted basic dimdom3 button">Buyer</button>
                                        <button onClick={()=>{this.setState({toogle: 'seller'})}} class="ui inverted basic dimdom3 button">Seller</button>
                                    </div>
                                </div>
                            </div>
                            {this.seller()}
                        </div>
                    </div>
                </div>
            )}
    }

    render() {
        if(this.props.user_name){
        return(   
            <AbsoluteWrapper>
                <Navbar/>
                <div className='row dim-height-addproduct text-light'> 
                    <Sidebar/>
                    <div className='col-9 mt-3'>
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

export default connect(mapStateToProps)(Dashboard)