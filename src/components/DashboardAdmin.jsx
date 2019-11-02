import React, { Component } from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import axios from 'axios'
import alertify from 'alertifyjs'
import Navbar from './Navbar'

const moment = require('moment')



const urlApi = 'http://localhost:7777/auth/'

class DashboardAdmin extends Component {

    state = {
        transactions : [], 
        transactions2 : [], 
        transactions3 : [], 
        loading: true,
        toogle: 'pembayaran'
    }

    componentDidMount(){
        this.getTransaction()
        this.getTransaction2()
        this.getTransaction3()
    }

    getTransaction = () => {
        axios.get(urlApi+'getunpaidverification')
        .then(res=>{
            this.setState({
                transactions: res.data,
                loading: false
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    getTransaction2 = () => {
        axios.get(urlApi+'getshippingverification')
        .then(res=>{
            this.setState({
                transactions2: res.data,
                loading: false
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    getTransaction3 = () => {
        axios.get(urlApi+'getalltransactions')
        .then(res=>{
            this.setState({
                transactions3: res.data,
                loading: false
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    onVerifikasi = (transactionId)=>{
        axios.put(urlApi + 'paymentverification',{
            id: transactionId
        })
        .then((res)=>{
            alertify.alert('Keterangan', 'Verifikasi Sukses', function(){ 
                alertify.message(`Transaction ID ${transactionId} is verified`)})
        this.getTransaction()
        }).catch(err=>{
            console.log(err);
        })
    }

    onVerifikasi2 = (transaction)=>{
        var forBuyer = parseInt(transaction.nilaiTransaksi)-parseInt(transaction.hakSeller)
        axios.put(urlApi + 'shippingverification',{
            id: transaction.id,
            hakBuyer: forBuyer
        })
        .then((res)=>{
            alertify.alert('Keterangan', 'Verifikasi Sukses', function(){ 
                alertify.message(`Transaction ID ${transaction.id} is verified`)})
        this.getTransaction2()
        }).catch(err=>{
            console.log(err);
        })
    }

    onTolak = (transactionId) => {
        axios.put(urlApi + 'rejectverification',{
            id: transactionId
        })
        .then((res)=>{
        alert('Success')
        this.getTransaction()
        }).catch(err=>{
            console.log(err);
        })
    }

    onTolak2 = (transactionId) => {
        axios.put(urlApi + 'rejectshippingverification',{
            id: transactionId
        })
        .then((res)=>{
        alert('Success')
        this.getTransaction()
        }).catch(err=>{
            console.log(err);
        })
    }

    selesai = (transaction)=>{
        let tglTerima = `${transaction.tglPenerimaan}`
        var terima = tglTerima.substr(0,10)
        axios.put(urlApi + 'transactiondone',{
            id: transaction.id
        })
        .then((res)=>{
            axios.post(urlApi + 'addhistory',{
                idTransaction: transaction.id,
                tglPenerimaan: terima,
                idBuyer: transaction.idBuyer,
                namaBuyer: transaction.namaBuyer,
                idSeller: transaction.idSeller,
                namaSeller: transaction.namaSeller,
                nilaiTransaksi: transaction.nilaiTransaksi,
                hakSeller: transaction.hakSeller,
                hakBuyer: transaction.hakBuyer 
            })
            .then((res)=>{
                this.deleteTransaction(transaction)
            }).catch(err=>{
                console.log(err);
            })       
        }).catch(err=>{
            console.log(err);
        })
    }
    
    deleteTransaction = (transaction)=>{
        axios.delete(urlApi+'deletetransaction',{
            data : {
                id : transaction.id
            }
        }
        ).then(res=>{
            alertify.alert('Keterangan', 'Verifikasi Sukses', function(){ 
                alertify.message(`Transaction ID ${transaction.id} is all DONE`)})
            this.getTransaction3()
        }).catch(err=>{
            console.log(err);
        })
    }

    addHistory = (transaction)=>{
        let tglTerima = `${transaction.tglPenerimaan}`
        var terima = tglTerima.substr(0,10)
        
    }

    renderTable = () => {
        if(this.state.loading==false){
        let hasil = this.state.transactions.map((transaction)=>{
            let tglBeli = transaction.tglPembelian.substr(0,10)
            let tglExp = transaction.tglExpired.substr(0,10)
            let tglBayar = transaction.tglPembayaran.substr(0,10)
            if(!transaction.isVerified){
                return (
                    <tr>
                        <th scope="row">{transaction.id}</th>
                        <td>{transaction.idBuyer}</td>
                        <td>{tglBeli}</td>
                        <td>{tglExp}</td>
                        <td>{transaction.nilaiTransaksi.toLocaleString('id')}</td>
                        <td>{tglBayar}</td>
                        <td>{transaction.noRek}</td>
                        <td>{transaction.NamaRek}</td>
                        <td><a href={`http://localhost:7777/files/${transaction.buktiPembayaran}`}>{transaction.buktiPembayaran}</a></td>
                        <td>{transaction.statusNow}</td>
                        <td>
                            <input onClick={()=>{this.onVerifikasi(transaction.id)}} className='btn btn-success' type="button" value="Verifikasi"/>
                            <input onClick={()=>{this.onTolak(transaction.id)}} className='btn btn-danger mt-1' type="button" value="Tolak"/>
                        </td>
                    </tr>
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

    renderTable2 = () => {
        if(this.state.loading==false){
        let hasil = this.state.transactions2.map((transaction)=>{
            let tglKirim = transaction.tglPengiriman.substr(0,10)
            if(!transaction.isShipped){
                return (
                    <tr>
                        <th scope="row">{transaction.id}</th>
                        <td>{transaction.idSeller}</td>
                        <td>{transaction.nilaiTransaksi.toLocaleString('id')}</td>
                        <td>{tglKirim}</td>
                        <td>{transaction.noResi}</td>
                        <td><a href={`http://localhost:7777/files/${transaction.buktiPengiriman}`}>{transaction.buktiPengiriman}</a></td>
                        <td>{transaction.hakSeller.toLocaleString('id')}</td>
                        <td>{transaction.statusNow}</td>
                        <td>
                            <input onClick={()=>{this.onVerifikasi2(transaction)}} className='btn btn-success' type="button" value="Verifikasi"/>
                            <input onClick={()=>{this.onTolak2(transaction.id)}} className='btn btn-danger mt-1' type="button" value="Tolak"/>
                        </td>
                    </tr>
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
    
    renderTable3 = () => {
        if(this.state.loading==false){
        let hasil = this.state.transactions3.map((transaction)=>{
          if(transaction.hakSeller){
              var hakBuyer = parseInt(transaction.nilaiTransaksi)-parseInt(transaction.hakSeller)
          } else {
              var hakBuyer = ''
          }
          if(transaction.tglPenerimaan){
              var tglTerima = transaction.tglPenerimaan.substr(0,10)
          } else {
              var tglTerima = ''
          }
            return (
                <tr>
                    <th scope="row">{transaction.id}</th>
                    <td>{(transaction.noResi) ? transaction.noResi : ""}</td>
                    <td>{(transaction.nilaiTransaksi.toLocaleString('id')) ? transaction.nilaiTransaksi.toLocaleString('id') : "" }</td>
                    <td>{(transaction.hakSeller.toLocaleString('id')) ? transaction.hakSeller.toLocaleString('id') : "" }</td>
                    <td>{(transaction.noRekSeller) ? transaction.noRekSeller : ""}</td>
                    <td>{(transaction.namaRekSeller) ? transaction.namaRekSeller : ""}</td>
                    <td>{hakBuyer.toLocaleString('id')}</td>
                    <td>{(transaction.noRek) ? transaction.noRek : ""}</td>
                    <td>{(transaction.NamaRek) ? transaction.NamaRek : ""}</td>
                    <td>{transaction.statusNow}</td>
                    <td>{tglTerima}</td>
                    <td>
                        <input onClick={()=>{this.selesai(transaction)}} className='btn btn-success' type="button" value="Selesai"/>
                    </td>
                </tr>
            )
            })
        return hasil
        } else {
            return null
        }
    }

    renderList = () => {
        if(this.state.toogle=='pembayaran'){
            return (
                <div className='row align-items-center text-light quic700'>
                    <div className='col-11 mx-auto card'>
                        <div className='card-body'>
                            <div className='col card-title text-right'>
                                <div class="ui inverted basic dimdom3 buttons">
                                    <button onClick={()=>{this.setState({toogle: 'pembayaran'})}} class="ui inverted basic dimdom3 button">Pembayaran</button>
                                    <button onClick={()=>{this.setState({toogle: 'pengiriman'})}} class="ui inverted basic dimdom3 button">Pengiriman</button>
                                    <button onClick={()=>{this.setState({toogle: 'penerimaan'})}} class="ui inverted basic dimdom3 button">Penerimaan</button>
                                </div>
                            </div>
                            <div className='row card-title'>
                                <div className='col card-title'>
                                <div class="table-responsive">
                                <table class="table table-striped table-dark">
                                    <thead>
                                        <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">ID Pembeli</th>
                                        <th scope="col">Tgl Pembelian</th>
                                        <th scope="col">Tgl Expired</th>
                                        <th scope="col">Nilai Transaksi</th>
                                        <th scope="col">Tgl Pembayaran</th>
                                        <th scope="col">No.Rek</th>
                                        <th scope="col">Nama Rek</th>
                                        <th scope="col">Bukti Pembayaran</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderTable()}
                                    </tbody>
                                    </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else if (this.state.toogle=='pengiriman'){
            return (
                <div className='row align-items-center text-light quic700'>
                    <div className='col-11 mx-auto card'>
                        <div className='card-body'>
                            <div className='col card-title text-right'>
                                <div class="ui inverted basic dimdom3 buttons">
                                    <button onClick={()=>{this.setState({toogle: 'pembayaran'})}} class="ui inverted basic dimdom3 button">Pembayaran</button>
                                    <button onClick={()=>{this.setState({toogle: 'pengiriman'})}} class="ui inverted basic dimdom3 button">Pengiriman</button>
                                    <button onClick={()=>{this.setState({toogle: 'penerimaan'})}} class="ui inverted basic dimdom3 button">Penerimaan</button>
                                </div>
                            </div>
                            <div className='row card-title'>
                                <div className='col card-title'>
                                <div class="table-responsive">
                                <table class="table table-striped table-dark">
                                    <thead>
                                        <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">ID Seller</th>
                                        <th scope="col">Nilai Transaksi</th>
                                        <th scope="col">Tgl Pengiriman</th>
                                        <th scope="col">No Resi</th>
                                        <th scope="col">Bukti Pengiriman</th>
                                        <th scope="col">Total Harga+Ongkir</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderTable2()}
                                    </tbody>
                                    </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className='row align-items-center text-light quic700'>
                    <div className='col-11 mx-auto card'>
                        <div className='card-body'>
                            <div className='col card-title text-right'>
                                <div class="ui inverted basic dimdom3 buttons">
                                    <button onClick={()=>{this.setState({toogle: 'pembayaran'})}} class="ui inverted basic dimdom3 button">Pembayaran</button>
                                    <button onClick={()=>{this.setState({toogle: 'pengiriman'})}} class="ui inverted basic dimdom3 button">Pengiriman</button>
                                    <button onClick={()=>{this.setState({toogle: 'penerimaan'})}} class="ui inverted basic dimdom3 button">Penerimaan</button>
                                </div>
                            </div>
                            <div className='row card-title'>
                                <div className='col card-title'>
                                <div class="table-responsive">
                                <table class="table table-striped table-dark">
                                    <thead>
                                        <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">No.Resi</th>
                                        <th scope="col">Nilai Transaksi</th>
                                        <th scope="col">Hak Seller</th>
                                        <th scope="col">No.Rek Seller</th>
                                        <th scope="col">Nama Rek Seller</th>
                                        <th scope="col">Hak Buyer</th>
                                        <th scope="col">No.Rek Buyer</th>
                                        <th scope="col">Nama Rek Buyer</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Tgl Penerimaan</th>
                                        <th scope="col">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderTable3()}
                                    </tbody>
                                    </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    render() {
        if(this.props.user_name=='Admin'){
        return(   
            <AbsoluteWrapper>
                <Navbar/>
                <div className='row dim-height-addproduct text-light'> 
                    <div className='col-3 mt-3'>
                        <div className='card-nav p-3 dim-height-nav'>
                            <div className='card-title'>
                                <NavLink to='/dashadmin' className='ui inverted basic dimdom4 button mt-5'>Dashboard</NavLink>   
                            </div>
                        </div>
                </div>
                    <div className='col-9 mt-3'>
                        {this.renderList()}
                    </div>
                </div>
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

export default connect(mapStateToProps)(DashboardAdmin)