import React, { Component } from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import axios from 'axios'
import alertify from 'alertifyjs'
import moment from 'moment'
import Navbar from './Navbar'



const urlApi = 'http://localhost:7777/auth/'

class Verifier extends Component {

    state = {
        transactionsPay : [], 
        transactionsShip : [], 
        transactionsReceive : [], 
        loading: true,
        toogle: 'pembayaran'
    }

    componentDidMount(){
        this.getTransaction()
        this.getTransactionPengiriman()
        this.getTransactionPenerimaan()
    }

    getTransaction = () => {
        axios.get(urlApi+'getunpaidverification')
        .then(res=>{
            this.setState({
                transactionsPay: res.data,
                loading: false
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    getTransactionPengiriman = () => {
        axios.get(urlApi+'getshippingverification')
        .then(res=>{
            this.setState({
                transactionsShip: res.data,
                loading: false
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    getTransactionPenerimaan = () => {
        axios.get(urlApi+'getalltransactions')
        .then(res=>{
            this.setState({
                transactionsReceive: res.data,
                loading: false
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    onVerifikasiPembayaran = (transactionId)=>{
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

    onVerifikasiPengiriman = (transaction)=>{
        var forBuyer = parseInt(transaction.nilaiTransaksi)-parseInt(transaction.hakSeller)
        axios.put(urlApi + 'shippingverification',{
            id: transaction.id,
            hakBuyer: forBuyer
        })
        .then((res)=>{
        alertify.alert('Keterangan', 'Verifikasi Sukses', function(){ 
            alertify.message(`Transaction ID ${transaction.id} is verified`)})
        this.getTransactionPengiriman()
        }).catch(err=>{
            console.log(err);
        })
    }

    onTolakPembayaran = (transaction) => {
        axios.put(urlApi + 'rejectverification',{
            id: transaction.id,
            tglDitolak: moment().format('YYYY-MM-DD'),
            idBuyer: transaction.idBuyer,
            namaBuyer: transaction.namaBuyer,
            idSeller: transaction.idSeller,
            namaSeller: transaction.namaSeller,
            nilaiTransaksi: transaction.nilaiTransaksi
        })
        .then((res)=>{
        alertify.alert('Keterangan', 'Transaksi berhasil dihapus', function(){ 
            alertify.message(`Transaction ID ${transaction.id} is REJECTED`)})
        this.getTransaction()
        }).catch(err=>{
            console.log(err);
        })
    }

    onTolakPengiriman = (transaction) => {
        axios.put(urlApi + 'rejectshippingverification',{
            id: transaction.id,
            tglDitolak: moment().format('YYYY-MM-DD'),
            idBuyer: transaction.idBuyer,
            namaBuyer: transaction.namaBuyer,
            idSeller: transaction.idSeller,
            namaSeller: transaction.namaSeller,
            nilaiTransaksi: transaction.nilaiTransaksi
        })
        .then((res)=>{
        alertify.alert('Keterangan', 'Transaksi Ditolak', function(){ 
            alertify.message(`Transaction ID ${transaction.id} is REJECTED`)})
        this.getTransactionPengiriman()
        }).catch(err=>{
            console.log(err);
        })
    }

    onTolakPenerimaan = (transaction) => {
        axios.put(urlApi+'rejectquantity',{
            idTransaction: transaction.id
        }).then(res=>{
            axios.put(urlApi + 'rejectverification',{
                id: transaction.id,
                tglDitolak: moment().format('YYYY-MM-DD'),
                idBuyer: transaction.idBuyer,
                namaBuyer: transaction.namaBuyer,
                idSeller: transaction.idSeller,
                namaSeller: transaction.namaSeller,
                nilaiTransaksi: transaction.nilaiTransaksi
            })
            .then((res)=>{
            alertify.alert('Keterangan', 'Transaksi berhasil dihapus', function(){ 
                alertify.message(`Transaction ID ${transaction.id} was ERASED by admin`)})
            this.getTransactionPenerimaan()
            }).catch(err=>{
                console.log(err);
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    selesai = (transaction)=>{
        axios.put(urlApi + 'transactiondone',{
            id: transaction.id
        })
        .then((res)=>{
            axios.post(urlApi + 'addhistory',{
                idTransaction: transaction.id,
                tglPenerimaan: moment().format('YYYY-MM-DD'),
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
            this.getTransactionPenerimaan()
        }).catch(err=>{
            console.log(err);
        })
    }

    addHistory = (transaction)=>{
        let tglTerima = `${transaction.tglPenerimaan}`
        var terima = tglTerima.substr(0,10)
        
    }

    renderTablePembayaran = () => {
        if(this.state.loading==false){
        let hasil = this.state.transactionsPay.map((transaction)=>{
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
                            <input onClick={()=>{this.onVerifikasiPembayaran(transaction.id)}} className='btn btn-success' type="button" value="Verifikasi"/>
                            <input onClick={()=>{this.onTolakPembayaran(transaction)}} className='btn btn-danger mt-1' type="button" value="Tolak"/>
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

    renderTablePengiriman = () => {
        if(this.state.loading==false){
        let hasil = this.state.transactionsShip.map((transaction)=>{
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
                            <input onClick={()=>{this.onVerifikasiPengiriman(transaction)}} className='btn btn-success' type="button" value="Verifikasi"/>
                            <input onClick={()=>{this.onTolakPengiriman(transaction)}} className='btn btn-danger mt-1' type="button" value="Tolak"/>
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
    
    renderTablePenerimaan = () => {
        if(this.state.loading==false){
        let hasil = this.state.transactionsReceive.map((transaction)=>{
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
                    <td>{transaction.ket}</td>
                    <td>
                        <input onClick={()=>{this.onTolakPenerimaan(transaction)}} className='btn btn-danger' type="button" value="Hapus"/>
                        <input onClick={()=>{this.selesai(transaction)}} className='btn btn-success mt-1' type="button" value="Selesai"/>                    
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
                                        {this.renderTablePembayaran()}
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
                                        {this.renderTablePengiriman()}
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
                                        <th scope="col">Ket</th>
                                        <th scope="col">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderTablePenerimaan()}
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
                                <NavLink to='/verifier' className='ui inverted basic dimdom4 button mt-5'>Verifikasi</NavLink>   
                                <NavLink to='/dashboardadmin' className='ui inverted basic dimdom4 button mt-5'>Dashboard</NavLink>   
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

export default connect(mapStateToProps)(Verifier)