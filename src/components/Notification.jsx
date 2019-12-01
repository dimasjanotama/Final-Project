import React, { Component } from 'react'
import {NavLink, Link, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import axios from 'axios'
import alertify from 'alertifyjs'
import moment from 'moment'

import Navbar from './Navbar'
import Footer from './Footer'
import {clickSeller, detailTransaksi} from '../actions'
import { saveAs } from 'file-saver';




const urlApi = 'http://localhost:7777/auth/'

class Notification extends Component {

    state = {
        unpaid : [],
        paid: [],
        orderTransactions: [],
        orders: [],
        history:[],
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
        adaHistory: false,
        hour: '',
        minute: '',
        second: '',
        hideUnpaid: false
    }

    componentDidMount(){
        this.getBuyTransaction()
        this.getSellTransaction()
        this.getHistory()
        this.setState({toogle: 'buyer'})
    }

    getBuyTransaction = () => {
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
            axios.get(urlApi+'getverifiedtransaction',{
                params : {
                    idBuyer:  this.props.user_id
                },
                headers : {
                    authorization : token
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
        let token = localStorage.getItem('token')
        axios.get(urlApi+'gettransactionorder',{
            params : {
                idSeller:  this.props.user_id
            },
            headers : {
                authorization : token
            }
        }).then(res=>{

            this.setState({ orderTransactions: res.data })
            axios.get(urlApi+'getorderlist',{
                params : {
                    idSeller:  this.props.user_id
                },
                headers : {
                    authorization : token
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

    getHistory = () => {
        let token = localStorage.getItem('token')
        axios.get(urlApi+'gethistory',{
            params : {
                userId:  this.props.user_id
            },
            headers : {
                authorization : token
            }
        }).then(res=>{
            if(res.data[0]){
            this.setState({ 
                history: res.data,
                adaHistory: true,
                loading: false    
            })
            } else {}
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
        if(this.state.noRek && this.state.namaRek && this.state.selectedFile){
        var tglPembayaran = moment().format('YYYY-MM-DD')+' '+ moment().format('HH:mm:ss');
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
            alertify.alert('Keterangan', 'Konfirmasi berhasil! silahkan tunggu max 1X24 jam untuk verifikasi', function(){ 
                alertify.message('Done')})
            this.getBuyTransaction()
        }).catch(err=>{
            console.log(err)
        })
    } else {
        alertify.alert('Keterangan','Mohon lengkapi no.Rekening, Nama Rekening, dan bukti transfer')
    }
    } 

    onShippingConf = ()=>{
        if(this.state.idSellTransaction && this.state.noResi && this.state.hakSeller && this.state.noRekSeller && 
            this.state.namaRekSeller && this.state.selectedFile2){
        var tglPengiriman = moment().format('YYYY-MM-DD')+' '+ moment().format('HH:mm:ss');
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
            alertify.alert('Keterangan', 'Konfirmasi berhasi, silahkan tunggu pembeli mengkonfirmasi penerimaan barang', function(){ 
                alertify.message('Done')})
            this.getSellTransaction()
        }).catch(err=>{
            console.log(err)
        })
    } else {
        alertify.alert('Keterangan','Mohon lengkapi transaksi ID, No Resi, Total Harga+ongkir, No Rekening, Nama Rekening, Bukti Pengiriman ')
    }
    }

    onReceiveConf = (transaction) =>{
        var tglTerima = moment().format('YYYY-MM-DD')+' '+ moment().format('HH:mm:ss');
        axios.put(urlApi + 'receivepacket',{
            id: transaction.id,
            tglPenerimaan: tglTerima
        })
        .then((res)=>{
        alertify.alert('Keterangan', 'Konfirmasi Sukses, Dana akan disalurkan ke Seller', function(){ 
            alertify.message('Done')})
        alertify.confirm('We need your feedback!','Apakah anda puas bertransaksi dengan Seller ini?',
            function(){
                axios.put(urlApi+'feedbackpositif',{
                    idSeller: transaction.idSeller
                }).then(res=>{
                    alertify.success('Terimakasih atas feedback anda');
                    this.getBuyTransaction()
                }).catch(err=>{
                    console.log();
                })
            },
            function(){
                axios.put(urlApi+'feedbacknegatif',
                {
                    idSeller: transaction.idSeller
                }).then(res=>{
                    alertify.error('Terimakasih atas feedback anda');
                    this.getBuyTransaction()
                }).catch(err=>{
                    console.log(err);
                })
            }).set('labels', {ok:'Puas', cancel:'Tidak Puas'});
        }).catch(err=>{
            console.log(err);
        })
    }

    transactionTimeout = (transactionId) => {
        axios.put(urlApi+'transactiontimeout',{
            id: transactionId
        }).then(res=>{

        }).catch(err=>{
            console.log(err);            
        })
    }

    renderUnpaid = () => {
        let hasil = this.state.unpaid.map((transaction)=>{
        if(transaction.ket!=='Hangus'){
            let batasWaktu = new Date(`${transaction.tglExpired}`).getTime()
            let x = setInterval(() => {
                    let now = new Date().getTime()
                    let t = batasWaktu - now
                    // let days = Math.floor((t % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)); 
                    let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); 
                    let minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)); 
                    let seconds = Math.floor((t % (1000 * 60)) / 1000); 
                    if (t < 0) {
                        clearInterval(x)
                        this.transactionTimeout(transaction.id)
                        return
                    }
                    this.setState({
                    hour: hours,
                    minute: minutes,
                    second: seconds
                    })
            }, 1000);
            return (
                <div className='quic700'>
                    <div className='col-11 cardgrey ml-5 mr-4 mt-4 mb-5 pt-4 pb-4 pr-3 pl-5 text-black-50' style={{fontSize:'16pt'}}>
                        Mohon selesaikan pembayaran berikut
                    </div>      
                    <div className='row text-center'>
                        <div className='col-4 mb-4 mx-auto' style={{fontSize:'20pt'}}>Total Tagihan</div>
                        <div className='w-100'></div>
                        <div className='col-5 mx-auto mb-2' style={{fontSize:'25pt'}}>
                        <Link to='/detailtransaksi' onClick={()=>{this.props.detailTransaksi(transaction.id)}}><span 
                            className="dimdom-pink-quic col mt-2">Rp {transaction.nilaiTransaksi.toLocaleString('id')}</span></Link>
                        <Link to='/otherprofile' onClick={()=>{this.props.clickSeller(transaction.idSeller)}}><span className="badge badge-primary"
                            style={{fontSize:'12pt',verticalAlign:'top'}}>{transaction.namaSeller}</span></Link>
                        </div>
                        <div className='w-100'></div>
                        <div className='col-5 mx-auto mb-2 mt-3' style={{fontSize:'20pt'}}>Batas waktu pembayaran</div>
                        <div className='w-100'></div>
                        <div className='col-5 mx-auto mt-2'> 
                            <span className='badge badge-primary' style={{fontSize: '18pt'}}>
                            {this.state.hour} jam {this.state.minute} menit {this.state.second} detik</span>
                        </div>
                        <div class="w-100"></div>    
                        <div className='col-6 card-title pt-4 mb-2 quic700p'></div>    
                        <div class="w-100"></div>  
                        <div className='col-4 cardwhite' style={{right:'-10%'}}>        
                            <div className='col pt-4 mb-2'>Rekening Pembayaran</div>
                            <div className='col card-title mb-2 quic700p'>
                                CIMB Niaga 123456789 an. Fxpedia 
                            </div>      
                        </div>
                        <div className='cardwhite col-4' style={{right:'-20%'}}>
                            <div className='col pt-4 mb-2'>Status Pembayaran</div>
                            <div className='col card-title mb-2 quic700p'>{transaction.statusNow}</div>  
                        </div>
                        <div class="w-100"></div>    
                        <div className='col-2 pt-2 mt-5 ml-5 pr-0 text-right'>
                            <img className='exclamation' src={require('../lib/pictures/EXCLAMATION.png')} alt=""/>
                        </div> 
                        <div className='col-7 pl-5 mt-5 pt-4 text-left'>
                            <div className='col-12 mb-3' style={{fontSize:'21pt'}}>
                                Terimakasih sudah berbelanja di fxpedia.
                            </div>
                            <div className='col-12'>
                                Untuk kenyamanan berbelanja mohon :
                            </div>
                            <div className='col-12'>
                                1. Pastikan nilai transfer kamu sesuai sampai 3 digit terakhir nilai transaksi 
                            </div>
                            <div className='col-12'>
                                2. Setelah transfer mohon konfirmasi pembayaran dan unggah bukti transfer
                            </div>
                        </div>
                    </div>
                    <div className='col-11 cardgrey ml-5 mr-4 mt-4 pt-4 pb-4 pr-3 pl-5 text-black-50' style={{fontSize:'16pt'}}>
                        Konfirmasi Pembayaran
                    </div> 
                    <div className='col-11 mx-auto'>
                        <div class="row mt-4">  
                            <div className='col-5 cardwhite pb-2' style={{right:'-5%'}}>        
                                <div className='col pt-4 mb-2'>Masukkan No.rekening saat pembayaran</div>
                                <div className='col card-title ui input3 quic700p'>
                                <input value={this.state.noRek} 
                                onChange={(e) => {
                                    if (isNaN(e.target.value)){
                                        this.setState({noRek: ''})
                                    } else {
                                        this.setState({noRek:e.target.value})
                                    }}} type="text" placeholder="Masukkan No. Rekening"/>
                                </div>      
                            </div>
                            <div className='cardwhite col-5 pb-2' style={{right:'-10%'}}>
                                <div className='col pt-4 mb-2'>Masukkan Nama di No.Rekening</div>
                                <div className='col card-title ui input3 mb-2 quic700p'>
                                    <input onChange={(e) => this.setState({namaRek: e.target.value})} type="text" placeholder="Masukkan Nama di No.Rekening"/>
                                </div>  
                            </div>
                            <div class="w-100"></div>    
                            <div className='col-6 text-center card-title mt-4'>
                                <input type='button' onClick={() => this.refs.fileBtn.click()} className='ui inverted basic small button' value='Unggah bukti pembayaran'/>
                                <input onClick={()=>{this.onPaymentConf(transaction.id)}} type="button" className="ui inverted basic small button" value="Submit konfirmasi"/>
                    
                                <input type="file" ref='fileBtn' onChange={(e) => this.setState({selectedFile : e.target.files[0]})} className='d-none'/>
                            </div>
                            <div class="w-100"></div>  
                            <div className='col-6 card-title' style={{left:'7%'}}>
                                {this.displayfilename()}
                            </div>
                            <div className='pt-5'></div> 
                        </div> 
                    </div>
                </div>
            )
        } else {
            return (
                <>
                <div className='col-11 cardgrey ml-5 mr-4 mt-4 mb-5 pt-4 pb-4 pr-3 pl-5 text-black-50' style={{fontSize:'16pt'}}>
                    Belum ada pembelian
                </div>
                <div className='row text-center'>
                    <div className='latar'>
                        <i className='info circle huge icon' style={{color:'black',backgroundColor:'transparent'}}></i>
                    </div>
                    <div className='w-100'></div>
                    <div className='col text-center text-black-50 pt-4' style={{fontSize:'12pt'}}>
                        <p>Kamu belum membeli produk apapun, yuk! cari produk yang kamu mau <NavLink to='search' className='dimdom-pink'>disini</NavLink></p>
                    </div>
                </div>
                <div className='row text-right'>
                    <div className='col'>
                        <img className='dino' src={require('../lib/pictures/dino2.png')} alt=""/>
                        <img className='pedal' src={require('../lib/pictures/pedal2.jpg')} alt=""/>
                    </div>
                </div>
                </>
            )
        }
        })
        return hasil
    }

    buyer = ()=>{
        if(!this.state.paid[0] && !this.state.unpaid[0]){
            return (
                <>
                <div className='col-11 cardgrey ml-5 mr-4 mt-4 mb-5 pt-4 pb-4 pr-3 pl-5 text-black-50' style={{fontSize:'16pt'}}>
                    Belum ada pembelian
                </div>
                <div className='row text-center'>
                    <div className='latar'>
                        <i className='info circle huge icon' style={{color:'black',backgroundColor:'transparent'}}></i>
                    </div>
                    <div className='w-100'></div>
                    <div className='col text-center text-black-50 pt-4' style={{fontSize:'12pt'}}>
                        <p>Kamu belum membeli produk apapun, yuk! cari produk yang kamu mau <NavLink to='search' className='dimdom-pink'>disini</NavLink></p>
                    </div>
                </div>
                <div className='row text-right'>
                    <div className='col'>
                        <img className='dino' src={require('../lib/pictures/dino2.png')} alt=""/>
                        <img className='pedal' src={require('../lib/pictures/pedal2.jpg')} alt=""/>
                    </div>
                </div>
                </>
            )
        } else if(!this.state.unpaid[0]){
            return (
                <div>
                    {this.renderPaid()}
                </div>
            )
        } else {
            return (
                <div>
                    {this.renderUnpaid()}
                    {this.renderPaid()}
                </div>
            )
        }
    }

    renderPaid = ()=>{
        if(this.state.paid){
            let hasil = this.state.paid.map((transaction)=>{
                let tglPembayaran = `${transaction.tglPembayaran}`
                let tglBayar = tglPembayaran.substr(0,10)
                if(transaction.statusNow!=='Transaksi selesai' && transaction.statusNow!=='Sudah diterima'){
                    return (
                        <>
                        <div className='col-11 cardgrey ml-5 mr-4 mt-4 mb-5 pt-4 pb-4 pr-3 pl-5 text-black-50' style={{fontSize:'16pt'}}>
                            Status Order
                        </div>
                        <table class="table table-striped col-11 mx-auto">
                        <thead>
                            <tr>
                            <th scope="col">ID Transaksi</th>    
                            <th scope="col">Nama Penjual</th>
                            <th scope="col">Nilai Transaksi</th>
                            <th scope="col">Tgl Pembayaran</th>
                            <th scope="col">Status</th>
                            <th scope="col">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <th scope="col">
                                <Link to='/detailtransaksi' onClick={()=>{this.props.detailTransaksi(transaction.id)}} 
                                className="dimdom-pink-quic col mt-2">{transaction.id}</Link>
                            </th>    
                            <th scope="col">
                                <Link to='/otherprofile' onClick={()=>{this.props.clickSeller(transaction.idSeller)}} 
                                className="dimdom-pink-quic col mt-2">{transaction.namaSeller}</Link>
                            </th>
                            <th scope="col">{transaction.nilaiTransaksi.toLocaleString('id')}</th>
                            <th scope="col">{tglBayar}</th>
                            <th scope="col">{transaction.statusNow}</th>
                            <th scope="col">
                                <input onClick={() => {this.onReceiveConf(transaction)}} type="button" 
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
        } else {
            return null
        }
    }

    renderOrderlist=()=>{
        let hasil = this.state.orders.map((order)=>{
            let totalHarga = (order.harga)*(order.orderQty)
            if(order.isDone<1){
                if(order.isShipped==0) {
                    var statusPengiriman='Belum dikirim'
                 } else if (order.isShipped==1) {
                    var statusPengiriman='Sudah dikirim'
                } else {
                    var statusPengiriman='Tidak dikirim'
                }
                return (
                    <tr>
                        <th scope="col">{order.idTransaction}</th>    
                        <th scope="col">
                            <Link to='/otherprofile' onClick={()=>{this.props.clickSeller(order.idBuyer)}}><span className="badge badge-primary"
                            style={{fontSize:'10pt',verticalAlign:'top'}}>{order.namaBuyer}</span></Link>
                        </th>    
                        <th scope="col">{this.state.orders[0].alamat}, {this.state.orders[0].kelurahan}, {this.state.orders[0].kecamatan}, 
                        {this.state.orders[0].kabupaten}, {this.state.orders[0].propinsi} {this.state.orders[0].kodepos}</th>    
                        <th scope="col"><img style={{width: '50px'}} src={`http://localhost:7777/files/${order.fotoProduk}`} alt="fotoproduk"/></th>
                        <th scope="col">{order.namaProduk}</th>
                        <th scope="col">{order.orderQty}</th>
                        <th scope="col"><span className="badge badge-primary"
                            style={{fontSize:'10pt',verticalAlign:'top'}}>{statusPengiriman}</span></th>
                        <th scope="col">{totalHarga.toLocaleString('id')}</th>
                    </tr>
                )
            } else {
                return null
            }
        })
        return hasil
    }

    seller = () => {
        if(this.state.orderTransactions[0] && this.state.loading==false){
        return (
            <div>
                <div className='col-11 cardgrey ml-5 mr-4 mt-4 mb-5 pt-4 pb-4 pr-3 pl-5 text-black-50' style={{fontSize:'16pt'}}>
                    Status pesanan
                </div>
                <div className='mt-3 col-11 mx-auto'> 
                    <table className="table table-striped">
                    <thead>
                        <tr>
                        <th scope="col">ID Transaksi</th>    
                        <th scope="col">Nama Pembeli</th>    
                        <th scope="col">Alamat Pengiriman</th>    
                        <th scope="col">Foto</th>
                        <th scope="col">Produk</th>
                        <th scope="col">Order Qty</th>
                        <th scope="col">Status</th>
                        <th scope="col">Total Harga</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.renderOrderlist()}
                    </tbody>
                    </table>
                </div> 
                <div class="w-100"></div>    
                <div className='row'>
                    <div className='col-2 pt-2 mt-5 ml-5 pr-0 text-right'>
                        <img className='exclamation' src={require('../lib/pictures/EXCLAMATION.png')} alt=""/>
                    </div> 
                    <div className='col-7 pl-5 mt-5 pt-4 text-left'>
                        <div className='col-12 mb-3' style={{fontSize:'21pt'}}>
                            Ayo, segera proses pesanan produkmu.
                        </div>
                        <div className='col-12'>
                            Untuk kemudahan transaksi mohon :
                        </div>
                        <div className='col-12'>
                            1. Masukkan no.Resi sesuai ID transaksi yang kamu pilih 
                        </div>
                        <div className='col-12'>
                            2. Lengkapi kolom total harga berdasarkan harga produk ditambah biaya pengiriman yang sudah kamu lakukan
                        </div>
                    </div>
                </div>
                <div className='col-11 cardgrey ml-5 mr-4 mt-4 mb-5 pt-4 pb-4 pr-3 pl-5 text-black-50' style={{fontSize:'16pt'}}>
                    Konfirmasi pengiriman
                </div> 
                <div className='row'>
                    <div class="col-11 cardwhite mx-auto">  
                        <div className='row'>
                        <div className='col-2 text-center pt-4'>ID Transaksi</div>
                        <div className='col-3 text-center pt-4'>No.resi pengiriman</div>
                        <div className='col-2 text-center pt-4'>Total harga + biaya pengiriman</div>
                        <div className='col-2 text-center pt-4'>No.Rek (Untuk pencairan dana)</div>
                        <div className='col-3 text-center pt-4'>Nama di Rekening</div>
                    </div>
                        <div class="w-100"></div>   
                        <div className='col-2 ui input3 pt-2 mb-2 quic700p'>
                            <input onChange={(e) => this.setState({idSellTransaction: e.target.value})} type="text" placeholder="ID Transaksi"/>
                        </div> 
                        <div className='col-3 ui input3 pt-2 mb-2 quic700p'>
                            <input onChange={(e) => this.setState({noResi: e.target.value})} type="text" placeholder="No. Resi"/>
                        </div>
                        <div className='col-2 ui input3 pt-2 mb-2 quic700p'>
                            <input onChange={(e) => this.setState({hakSeller: e.target.value})} type="text" placeholder="Total harga + ongkir"/>
                        </div>
                        <div className='col-2 ui input3 pt-2 mb-2 quic700p'>
                            <input onChange={(e) => this.setState({noRekSeller: e.target.value})} type="text" placeholder="No.Rek"/>
                        </div>
                        <div className='col-3 ui input3 pt-2 mb-2 quic700p'>
                            <input onChange={(e) => this.setState({namaRekSeller: e.target.value})} type="text" placeholder="Nama Rekenening"/>
                        </div>
                        <div class="w-100"></div>    
                        <div className='col card-title pt-2'>
                            <input type='button' onClick={() => this.refs.fileBtn2.click()} className='ui inverted basic small button' value='Unggah bukti pengiriman'/>
                            <input onClick={this.onShippingConf} type="button" className="ui inverted basic small button" value="Submit konfirmasi"/>
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
            </div>  
        )} else {
            return (
                <>
                <div className='col-11 cardgrey ml-5 mr-4 mt-4 mb-5 pt-4 pb-4 pr-3 pl-5 text-black-50' style={{fontSize:'16pt'}}>
                    Belum ada pesanan
                </div>
                <div className='row text-center'>
                    <div className='latar'>
                        <i className='info circle huge icon' style={{color:'black',backgroundColor:'transparent'}}></i>
                    </div>
                    <div className='w-100'></div>
                    <div className='col text-center text-black-50 pt-4' style={{fontSize:'12pt'}}>
                        <p>Ingin jual produk kamu? yuk! tambah produk kamu  <NavLink to='addproduct' className='dimdom-pink'>disini</NavLink></p>
                    </div>
                </div>
                <div className='row text-right pt-3 pb-3'>
                    <div className='col'>
                        <img className='pig' src={require('../lib/pictures/PIG.png')} alt=""/>
                        <img className='pedal' src={require('../lib/pictures/pedal2.jpg')} alt=""/>
                    </div>
                </div>
                </>
            )
        }
    }

    history = () => {
        if(this.state.adaHistory){
            return (
                <div>
                    <div className='col-11 cardgrey ml-5 mr-4 mt-4 mb-5 pt-4 pb-4 pr-3 pl-5 text-black-50' style={{fontSize:'16pt'}}>
                        Riwayat Transaksi (5 transaksi terakhir)
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-8'>
                            {this.renderHistory()}
                        </div>
                    </div>
                    <div className='pt-5'></div> 
                </div>
            )
        } else {
            return (
                <>
                <div className='col-11 cardgrey ml-5 mr-4 mt-4 mb-5 pt-4 pb-4 pr-3 pl-5 text-black-50' style={{fontSize:'16pt'}}>
                    Belum ada riwayat transaksi
                </div>
                <div className='row text-center'>
                    <div className='latar'>
                        <i className='info circle huge icon' style={{color:'black',backgroundColor:'transparent'}}></i>
                    </div>
                    <div className='w-100'></div>
                    <div className='col text-center text-black-50 pt-4' style={{fontSize:'12pt'}}>
                        <p>Kamu belum membeli dan menjual produk apapun, yuk! cari produk yang kamu mau <NavLink to='search' className='dimdom-pink'>disini</NavLink></p>
                        <p> dan tambah produk kamu  <NavLink to='addproduct' className='dimdom-pink'>disini</NavLink></p>
                    </div>
                </div>
                <div className='row text-right mt-2 pt-3 mb-3'>
                    <div className='col'>
                        <img className='diplo' src={require('../lib/pictures/DIPLO.png')} alt=""/>
                        <img className='pedal' src={require('../lib/pictures/pedal2.jpg')} alt=""/>
                    </div>
                </div>
                </>
            )
        }
    }

    // download = ()=>{
    //     // axios.get(urlApi+'downloadhistory',{
    //     //         username: 'dimas'
    //     // }).then(res=>{
    //     // }).catch(err=>{
    //     //     console.log(err);
    //     // })
    //     let arrHistory = this.state.history
    //     // console.log(`http://localhost:7777/auth/downloadhistory?history=${arrHistory}`);
    //     window.open(`http://localhost:7777/auth/downloadhistory?history=${arrHistory}`)
    // }

    renderHistory = ()=>{
        let hasil = this.state.history.map((transaction)=>{
            let tanggal = transaction.tanggal
            if (transaction.idBuyer==this.props.user_id && transaction.statusNow=='Done'){
                return (
                    <>
                    <div className='row mt-4 cardgrey'>
                        <div className='col-1'>
                            <i className='handshake outline big icon'></i>
                        </div>
                        <div className='col mt-1' style={{fontSize:'15pt'}}>{moment(tanggal).format('LL')}</div>
                    </div>
                    <div className='row mt-1'>
                        <div className='col-1'></div>
                        <div className='col' style={{fontSize:'14pt'}}>Transaksi dengan <Link to='/otherprofile' onClick={()=>{this.props.clickSeller(transaction.idSeller)}}> 
                        <span className='badge badge-primary'>{transaction.namaSeller}</span></Link></div>
                    </div>
                    <div className='row mt-1'>
                        <div className='col-1'></div>
                        <div className='col'>Pembelian</div>
                        <div className='col-3 text-right'>
                            <span className='badge badge-danger' style={{fontSize:'11pt'}}>Rp {transaction.nilaiTransaksi.toLocaleString('id')}</span>
                        </div>
                    </div>
                    <div className='row mt-1'>
                        <div className='col-1'></div>
                        <div className='col'>Kembalian sisa biaya ongkir</div>
                        <div className='col-3 text-right'>
                            <span className='badge badge-success' style={{fontSize:'11pt'}}>Rp {transaction.hakBuyer.toLocaleString('id')}</span>
                        </div>
                    </div>
                    <div className='row mt-1'>
                        <div className='col-1'></div>
                        <div className='col'>Total Pengeluaran</div>
                        <div className='col-3 text-right'>
                            <span className='badge badge-danger' style={{fontSize:'11pt'}}>Rp {transaction.hakSeller.toLocaleString('id')}</span>
                        </div>
                    </div>
                    </>
                )
            } else if(transaction.idBuyer==this.props.user_id && transaction.statusNow!=='Done'){
                return (
                    <>
                    <div className='row mt-4 cardgrey'>
                        <div className='col-1'>
                            <i className='times big icon'></i>
                        </div>
                        <div className='col mt-1' style={{fontSize:'15pt'}}>{moment(tanggal).format('LL')}</div>
                    </div>
                    <div className='row mt-1'>
                        <div className='col-1'></div>
                        <div className='col' style={{fontSize:'14pt'}}>Transaksi dengan <Link to='/otherprofile' onClick={()=>{this.props.clickSeller(transaction.idSeller)}}> 
                        <span className='badge badge-primary'>{transaction.namaSeller}</span></Link></div>
                    </div>
                    <div className='row mt-1'>
                        <div className='col-1'></div>
                        <div className='col'>Pembelian</div>
                        <div className='col-4 text-right'>
                            <span className='badge badge-warning' style={{fontSize:'11pt'}}>Rp {transaction.nilaiTransaksi.toLocaleString('id')}</span>
                        </div>
                    </div>
                    <div className='row mt-1'>
                        <div className='col-1'></div>
                        <div className='col'>Transaksi Gagal/Dibatalkan</div>
                        <div className='col-5 text-right'>
                            <span className='badge badge-warning' style={{fontSize:'11pt'}}>{transaction.statusNow}</span>
                        </div>
                    </div>
                    </>
                )
            } else if (transaction.idSeller==this.props.user_id && transaction.statusNow=='Done'){
                return (
                    <>
                    <div className='row mt-4 cardgrey'>
                        <div className='col-1'>
                            <i className='handshake outline big icon'></i>
                        </div>
                        <div className='col mt-1' style={{fontSize:'15pt'}}>{moment(tanggal).format('LL')}</div>
                    </div>
                    <div className='row mt-1'>
                        <div className='col-1'></div>
                        <div className='col' style={{fontSize:'14pt'}}>Transaksi dengan <Link to='/otherprofile' onClick={()=>{this.props.clickSeller(transaction.idBuyer)}}> 
                        <span className='badge badge-primary'>{transaction.namaBuyer}</span></Link></div>
                    </div>
                    <div className='row mt-1'>
                        <div className='col-1'></div>
                        <div className='col'>Penjualan + ganti ongkir</div>
                        <div className='col-3 text-right'>
                            <span className='badge badge-success' style={{fontSize:'11pt'}}>Rp {transaction.hakSeller.toLocaleString('id')}</span>
                        </div>
                    </div>
                    </>
                )
            } else {
                if(transaction.statusNow=='Barang tidak dikirim'){
                    return (
                        <>
                        <div className='row mt-4 cardgrey'>
                            <div className='col-1'>
                                <i className='times big icon'></i>
                            </div>
                            <div className='col mt-1' style={{fontSize:'15pt'}}>{moment(tanggal).format('LL')}</div>
                        </div>
                        <div className='row mt-1'>
                            <div className='col-1'></div>
                            <div className='col' style={{fontSize:'14pt'}}>Transaksi dengan <Link to='/otherprofile' onClick={()=>{this.props.clickSeller(transaction.idBuyer)}}> 
                            <span className='badge badge-primary'>{transaction.namaBuyer}</span></Link></div>
                        </div>
                        <div className='row mt-1'>
                            <div className='col-1'></div>
                            <div className='col'>Nilai Transaksi Penjualan</div>
                            <div className='col-3 text-right'>
                                <span className='badge badge-warning' style={{fontSize:'11pt'}}>Rp {transaction.nilaiTransaksi.toLocaleString('id')}</span>
                            </div>
                        </div>
                        <div className='row mt-1'>
                            <div className='col-1'></div>
                            <div className='col'>Transaksi Gagal/Dibatalkan</div>
                            <div className='col-5 text-right'>
                                <span className='badge badge-warning' style={{fontSize:'11pt'}}>{transaction.statusNow}</span>
                            </div>
                        </div>
                        </>
                    )
                } else {
                return null
                }
            }
        })
        return hasil
    }

    renderList = () => {
        if(this.state.toogle=='buyer'){
        return (
            <div className='row align-items-center text-light quic700'>
                <div className='col-11 mx-auto cardwhite'>
                    <div className='card-body'>
                        <div className='row card-title'>
                            <div className='col card-title text-right'>
                                <div class="ui inverted basic dimdom3 buttons">
                                    <button onClick={()=>{this.setState({toogle: 'buyer'})}} class="ui inverted basic dimdom3 button">Beli</button>
                                    <button onClick={()=>{this.setState({toogle: 'seller'})}} class="ui inverted basic dimdom3 button">Jual</button>
                                    <button onClick={()=>{this.setState({toogle: 'history'})}} class="ui inverted basic dimdom3 button">Riwayat</button>
                                </div>
                            </div>
                        </div>
                        {this.buyer()}
                    </div>
                </div>
            </div>
        )} else if(this.state.toogle=='seller'){
            return (
                <div className='row align-items-center quic700'>
                    <div className='col-11 mx-auto cardwhite pb-5'>
                        <div className='card-body'>
                            <div className='row card-title'>
                                <div className='col card-title text-right'>
                                    <div class="ui inverted basic dimdom3 buttons">
                                        <button onClick={()=>{this.setState({toogle: 'buyer'})}} class="ui inverted basic dimdom3 button">Beli</button>
                                        <button onClick={()=>{this.setState({toogle: 'seller'})}} class="ui inverted basic dimdom3 button">Jual</button>
                                        <button onClick={()=>{this.setState({toogle: 'history'})}} class="ui inverted basic dimdom3 button">Riwayat</button>
                                    </div>
                                </div>
                            </div>
                            {this.seller()}
                        </div>
                    </div>
                </div>
        )} else {
            return (
                <div className='row align-items-center quic700'>
                    <div className='col-11 mx-auto cardwhite'>
                        <div className='card-body'>
                            <div className='row card-title'>
                                <div className='col card-title text-right'>
                                    <div class="ui inverted basic dimdom3 buttons">
                                        <button onClick={()=>{this.setState({toogle: 'buyer'})}} class="ui inverted basic dimdom3 button">Beli</button>
                                        <button onClick={()=>{this.setState({toogle: 'seller'})}} class="ui inverted basic dimdom3 button">Jual</button>
                                        <button onClick={()=>{this.setState({toogle: 'history'})}} class="ui inverted basic dimdom3 button">Riwayat</button>
                                    </div>
                                </div>
                            </div>
                            {this.history()}
                        </div>
                    </div>
                </div>
            )   
        }
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
        user_id : state.auth.id
    }
}

export default connect(mapStateToProps,{clickSeller,detailTransaksi})(Notification)