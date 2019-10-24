import React, { Component } from 'react'
import {NavLink, Redirect, Link} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import axios from 'axios'

import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'


const urlApi = 'http://localhost:7777/auth/'

class DashboardAdmin extends Component {

    state = {
        transactions : [] 
    }

    componentDidMount(){
        this.getTransaction()
    }

    getTransaction = () => {
        axios.get(urlApi+'getalltransaction')
        .then(res=>{
            this.setState({transactions: res.data})
        }).catch(err=>{
            console.log(err);
        })
    }

    onVerifikasi = (transactionId)=>{
        axios.put(urlApi + 'paymentverification',{
            id: transactionId
        })
        .then((res)=>{
        alert('Succes')
        this.getTransaction()
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
    

    renderTable = () => {
        
        let hasil = this.state.transactions.map((transaction)=>{
            let tglBeli = transaction.tglPembelian.substr(0,10)
            let tglExp = transaction.tglExpired.substr(0,10)
            let tglBayar = transaction.tglPembayaran.substr(0,10)
            if (transaction.isVerified==0){
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
                        <td>Belum Diverifikasi</td>
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
    }

    renderList = () => {
        return (
            <div className='row align-items-center text-light quic700'>
                <div className='col-11 mx-auto card'>
                    <div className='card-body'>
                        <div className='col card-title text-right'>
                            <div class="ui inverted basic dimdom3 buttons">
                                <button class="ui inverted basic dimdom3 button">Pembayaran</button>
                                <button class="ui inverted basic dimdom3 button">Pengiriman</button>
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
    }

    render() {
        if(this.props.user_name){
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