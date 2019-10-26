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
        unpaid : [],
        paid: [],
        orders: [],
        selectedFile: '',
        selectedFile2: '',
        noRek: '',
        namaRek: '',
        toogle: '',
        loading: true,
        idBuyTransaction : '',
        idSellTransaction: '',
        noResi: '',
        hakSeller: '',
        noRekSeller: '',
        namaRekSeller: '',
        adaOrder: false
    }

    componentDidMount(){
        this.getBuyTransaction()
        this.getSellTransaction()
        this.setState({toogle: 'buyer'})
    }

    getBuyTransaction = () => {
        axios.get(urlApi+'getunverifiedtransaction',{
            params : {
                idBuyer:  this.props.user_id
            }
        }).then(res=>{
            this.setState({ unpaid: res.data })
            axios.get(urlApi+'getverifiedtransaction',{
                params : {
                    idBuyer:  this.props.user_id
                }
            }).then(res=>{
                this.setState({ paid: res.data })
            }).catch(err=>{
                console.log(err);
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    getSellTransaction = () => {
        axios.get(urlApi+'gettransactionorder',{
            params : {
                idSeller:  this.props.user_id
            }
        }).then(res=>{

            this.setState({ adaOrder: true })
            axios.get(urlApi+'getorderlist',{
                params : {
                    idSeller:  this.props.user_id
                }
            }).then(res=>{
                if(res.data[0]){
                this.setState({
                    adaorder: true,
                    orders: res.data,
                    loading: false
                })
                } else {}
            }).catch(err=>{
                console.log(err);
            })
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

    displayfilename2 = ()=>{
        if (this.state.selectedFile2) {
            return (
                <div className='mt-0'>
                    {this.state.selectedFile2.name}
                </div>
            )
        } else {
            return null
        }
    }
    

    onPaymentConf = (idTransaction) => {
        let today = new Date()
        let year = today.getFullYear()
        let month = today.getMonth()+1
        let date = today.getDate()
        var tglPembayaran = `${year}-${month}-${date}`
        let fd = new FormData()
        let data = {   
            idBuyTransaction: idTransaction,
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
            this.getBuyTransaction()
        }).catch(err=>{
            console.log(err)
        })
    } 

    onShippingConf = ()=>{
        let today = new Date()
        let year = today.getFullYear()
        let month = today.getMonth()+1
        let date = today.getDate()
        var tglPengiriman = `${year}-${month}-${date}`
        let fd = new FormData()
        let data = {   
            idSellTransaction: this.state.idSellTransaction,
            tglPengiriman: tglPengiriman,
            noResi: this.state.noResi,
            hakSeller: this.state.hakSeller,
            noRekSeller: this.state.noRekSeller,
            namaRekSeller: this.state.namaRekSeller
        }
        fd.append('anehshipping', this.state.selectedFile2, this.state.selectedFile2.name)
        fd.append('data', JSON.stringify(data))
        axios.post(urlApi+'shippingconfirm', fd)
        .then(res=>{
            alert('Konfirmasi berhasi, silahkan tunggu pembeli mengkonfirmasi penerimaan barang')
            this.getSellTransaction()
        }).catch(err=>{
            console.log(err)
        })
    }

    onReceiveConf = (transactionId) =>{
        axios.put(urlApi + 'receivepacket',{
            id: transactionId
        })
        .then((res)=>{
        alert('Konfirmasi Sukses, Dana akan disalurkan ke Seller')
        this.getBuyTransaction()
        }).catch(err=>{
            console.log(err);
        })
    }

    renderUnpaid = () => {
        let hasil = this.state.unpaid.map((transaction)=>{
            let batasWaktu = `${transaction.tglExpired}`
            var batas = batasWaktu.substr(0,10)
            return (
                <div>       
                    <div className='row'>
                        <div className='col card-title pt-4 mb-2'>Total Tagihan</div>
                        <div className='col card-title pt-4 mb-2'>Unggah bukti pembayaran sebelum Tanggal</div>
                        <div class="w-100"></div>    
                        <div className='col card-title pt-4 mb-2 quic700p'>Rp. {transaction.nilaiTransaksi}</div>
                        <div className='col card-title pt-4 mb-2 quic700p'>{batas}</div>    
                        <div class="w-100"></div>          
                        <div className='col card-title pt-4 mb-2'>Rekening Pembayaran</div>
                        <div className='col card-title pt-4 mb-2'>Status Pembayaran</div>
                        <div class="w-100"></div>   
                        <div className='col card-title pt-4 mb-2 quic700p'>
                            <img style={{width: '100px'}} src={require('../lib/pictures/cimb.jpg')}/>  123456789 an. Fxpedia 
                        </div>
                        <div className='col card-title pt-4 mb-2 quic700p'>{transaction.statusNow}</div>   
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
                                <input onClick={()=>{this.onPaymentConf(transaction.id)}} type="button" className="ui inverted basic dimdom3 button" value="Submit konfirmasi"/>
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
        })
        return hasil
    }

    renderPaid = ()=>{
        let hasil = this.state.paid.map((transaction)=>{
            let tglPembelian = `${transaction.tglPembelian}`
            let tglBeli = tglPembelian.substr(0,10)
            let tglPembayaran = `${transaction.tglPembayaran}`
            let tglBayar = tglPembayaran.substr(0,10)
            if(transaction.statusNow!=='Transaksi selesai'){
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
                        <th scope="col">{transaction.id}</th>    
                        <th scope="col">{tglBeli}</th>
                        <th scope="col">{transaction.nilaiTransaksi.toLocaleString('id')}</th>
                        <th scope="col">{tglBayar}</th>
                        <th scope="col">{transaction.statusNow}</th>
                        <th scope="col">
                            <input onClick={() => {this.onReceiveConf(transaction.id)}} type="button" 
                            className="ui inverted basic dimdom3 button" value="Konfirmasi Terima"/>
                        </th>
                        </tr>
                    </tbody>
                    </table>
                    </>
                )
            } else {
                return null
            }
        })
        return hasil
    }
            
    renderOrderlist=()=>{
        let hasil = this.state.orders.map((order)=>{
            return (
                <tr>
                    <th scope="col">{order.idTransaction}</th>    
                    <th scope="col">{order.namaBuyer}</th>    
                    <th scope="col">{this.state.orders[0].alamat}, {this.state.orders[0].kelurahan}, {this.state.orders[0].kecamatan}, 
                    {this.state.orders[0].kabupaten}, {this.state.orders[0].propinsi} {this.state.orders[0].kodepos}</th>    
                    <th scope="col"><img style={{width: '50px'}} src={`http://localhost:7777/files/${order.fotoProduk}`} alt="fotoproduk"/></th>
                    <th scope="col">{order.namaProduk}</th>
                    <th scope="col">{order.orderQty}</th>
                    <th scope="col">{order.isShipped}</th>
                    <th scope="col">{order.harga.toLocaleString('id')}</th>
                </tr>
            )
        })
        return hasil
    }

    seller = () => {
        if(this.state.adaOrder && this.state.loading==false){
        return (
            <div>
                <div className='card-title subjudul'>
                    Ada orderan baru, silahkan lakukan pengiriman!
                    </div>
                    <div className='row card-title pt-4'>
                        <div className='col-1 card-title pt-3 pb-1'>
                            <i className='big info icon text-right' style={{color: 'rgb(255, 31, 210)'}}></i>
                        </div>
                        <div className='col-8 card-title pt-4 pb-1 pl-0 quic700p text-left'>
                            Silahkan kirim produk berikut sesuai ID Transaksi
                        </div>   
                    </div>
                    <div className='dimdom-bottom'></div>
                    <table class="table table-striped table-dark mt-3">
                    <thead>
                        <tr>
                        <th scope="col">ID Transaksi</th>    
                        <th scope="col">Nama Pembeli</th>    
                        <th scope="col">Alamat Pengiriman</th>    
                        <th scope="col">Foto</th>
                        <th scope="col">Produk</th>
                        <th scope="col">Order Qty</th>
                        <th scope="col">Status</th>
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
                    <div className='col-2 card-title pt-4 mb-2'>ID Transaksi</div>
                    <div className='col-3 card-title pt-4 mb-2'>No.resi pengiriman</div>
                    <div className='col-2 card-title pt-4 mb-2'>Total harga + biaya pengiriman</div>
                    <div className='col-2 card-title pt-4 mb-2'>No.Rek (Untuk pencairan dana)</div>
                    <div className='col-3 card-title pt-4 mb-2'>Nama di Rekening</div>
                    <div class="w-100"></div>   
                    <div className='col-2 ui input2 pt-4 mb-2'>
                        <input onChange={(e) => this.setState({idSellTransaction: e.target.value})} type="text" placeholder="ID Transaksi"/>
                    </div> 
                    <div className='col-3 ui input2 pt-4 mb-2'>
                        <input onChange={(e) => this.setState({noResi: e.target.value})} type="text" placeholder="Masukkan No. Resi"/>
                    </div>
                    <div className='col-2 ui input2 pt-4 mb-2'>
                        <input onChange={(e) => this.setState({hakSeller: e.target.value})} type="text" placeholder="Masukkan total harga + ongkir"/>
                    </div>
                    <div className='col-2 ui input2 pt-4 mb-2'>
                        <input onChange={(e) => this.setState({noRekSeller: e.target.value})} type="text" placeholder="Masukkan no.Rek"/>
                    </div>
                    <div className='col-3 ui input2 pt-4 mb-2'>
                        <input onChange={(e) => this.setState({namaRekSeller: e.target.value})} type="text" placeholder="Masukkan nama di Rekenening"/>
                    </div>
                    <div class="w-100"></div>    
                    <div className='col card-title pt-4'>
                        <div class="ui inverted basic dimdom3 buttons">
                            <input type='button' onClick={() => this.refs.fileBtn2.click()} className='ui inverted basic dimdom3 button' value='Unggah bukti pengiriman'/>
                            <input onClick={this.onShippingConf} type="button" className="ui inverted basic dimdom3 button" value="Submit konfirmasi"/>
                        </div>
                            <input type="file" ref='fileBtn2' onChange={(e) => this.setState({selectedFile2 : e.target.files[0]})} className='d-none'/>
                    </div>
                    <div class="w-100"></div>  
                    <div className='col card-title'>
                        {this.displayfilename2()}
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
                        <div className='card-title subjudul'>
                            Mohon segera selesaikan pembayaran Anda
                        </div>
                        {this.renderUnpaid()}
                        {this.renderPaid()}
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