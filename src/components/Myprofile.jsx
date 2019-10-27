import React, { Component } from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import axios from 'axios'

import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'


const urlApi = 'http://localhost:7777/auth/'

class Myprofile extends Component {

    state = {
        profile: [],
        transactionBuy: [],
        transactionSell: [],
        ordersBuy: [],
        ordersSell: [],
        toogle: ''
    }

    componentDidMount(){
        this.setState({toogle: 'profile'})
        this.getProfile()
        this.getTransactions()
        this.getOrders()
    }

    getProfile = () => {
        axios.get(urlApi+'getuserbyid',{
            params : {
                userid:  this.props.user_id
            }
        }).then(res=>{
            this.setState({ profile: res.data })
        }).catch(err=>{
            console.log(err);
        })
    }

    getTransactions = () => {
        axios.get(urlApi+'gettransaction',{
            params : {
                idBuyer:  this.props.user_id
            }
        }).then(res=>{
            this.setState({ transactionBuy: res.data })
            axios.get(urlApi+'gettransactionbuy',{
                params : {
                    idSeller:  this.props.user_id
                }
            }).then(res=>{
                this.setState({ transactionSell: res.data })
            }).catch(err=>{
                console.log(err);
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    getOrders = () => {
        axios.get(urlApi+'getorderlist',{
            params : {
                idSeller:  this.props.user_id
            }
        }).then(res=>{
            this.setState({ ordersSell: res.data })
            axios.get(urlApi+'getorderbuy',{
                params : {
                    idBuyer:  this.props.user_id
                }
            }).then(res=>{
                this.setState({ ordersBuy: res.data })
            }).catch(err=>{
                console.log(err);
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    // displayfilename = ()=>{
    //     if (this.state.selectedFile) {
    //         return (
    //             <div className='mt-0'>
    //                 {this.state.selectedFile.name}
    //             </div>
    //         )
    //     } else {
    //         return null
    //     }
    // }

    profile = () => {
        let { username, email, namaDepan, namaBelakang, noTelp, alamat, kelurahan, kecamatan, kabupaten, propinsi, kodepos, tglDaftar, avatar } = this.state.profile
        return (
            <div>
                Profile
            </div>
        )
    }

    


                // {/* <div className='card-title subjudul pt-4'>
                //     Konfirmasi pengiriman
                // </div>
                // <div class="row">  
                //     <div className='col-2 card-title pt-4 mb-2'>ID Transaksi</div>
                //     <div className='col-3 card-title pt-4 mb-2'>No.resi pengiriman</div>
                //     <div className='col-2 card-title pt-4 mb-2'>Total harga + biaya pengiriman</div>
                //     <div className='col-2 card-title pt-4 mb-2'>No.Rek (Untuk pencairan dana)</div>
                //     <div className='col-3 card-title pt-4 mb-2'>Nama di Rekening</div>
                //     <div class="w-100"></div>   
                //     <div className='col-2 ui input2 pt-4 mb-2'>
                //         <input onChange={(e) => this.setState({idSellTransaction: e.target.value})} type="text" placeholder="ID Transaksi"/>
                //     </div> 
                //     <div className='col-3 ui input2 pt-4 mb-2'>
                //         <input onChange={(e) => this.setState({noResi: e.target.value})} type="text" placeholder="Masukkan No. Resi"/>
                //     </div>
                //     <div className='col-2 ui input2 pt-4 mb-2'>
                //         <input onChange={(e) => this.setState({hakSeller: e.target.value})} type="text" placeholder="Masukkan total harga + ongkir"/>
                //     </div>
                //     <div className='col-2 ui input2 pt-4 mb-2'>
                //         <input onChange={(e) => this.setState({noRekSeller: e.target.value})} type="text" placeholder="Masukkan no.Rek"/>
                //     </div>
                //     <div className='col-3 ui input2 pt-4 mb-2'>
                //         <input onChange={(e) => this.setState({namaRekSeller: e.target.value})} type="text" placeholder="Masukkan nama di Rekenening"/>
                //     </div>
                //     <div class="w-100"></div>    
                //     <div className='col card-title pt-4'>
                //         <div class="ui inverted basic dimdom3 buttons">
                //             <input type='button' onClick={() => this.refs.fileBtn2.click()} className='ui inverted basic dimdom3 button' value='Unggah bukti pengiriman'/>
                //             <input onClick={this.onShippingConf} type="button" className="ui inverted basic dimdom3 button" value="Submit konfirmasi"/>
                //         </div>
                //             <input type="file" ref='fileBtn2' onChange={(e) => this.setState({selectedFile2 : e.target.files[0]})} className='d-none'/>
                //     </div>
                //     <div class="w-100"></div>  
                //     <div className='col card-title'>
                //         {this.displayfilename2()}
                //     </div>
                //     <div class="w-100"></div> 
                //     <div className='pt-3'>
                //     </div> 
                // </div>  */}
       
    

    dashboard = () => {
        return (
            <div>
                <div className='card-title subjudul pb-4'>
                    Dashboard
                </div>
                <div className='dimdom-bottom'></div>
                <div className='row justify-content-center'>
                    <div className='col-8'>
                        {this.renderDashboard()}
                    </div>
                </div>
                <div className='dimdom-bottom pt-4'></div>
                <div class="w-100"></div> 
                <div className='pt-3'></div> 
            </div>
            )
    } 


    renderDashboard = ()=>{
                return (
                    <div>INI DASHBOARD
                    {/* <div className='row mt-4'>
                        <div className='col-1'>
                            <i className='handshake outline big icon'></i>
                        </div>
                        <div className='col mt-1' style={{fontSize:'15pt'}}>Tanggal {tgl}</div>
                    </div>
                    <div className='row mt-1'>
                        <div className='col-1'></div>
                        <div className='col' style={{fontSize:'14pt'}}>Transaksi dengan <span className='badge badge-primary'>{transaction.namaSeller}</span></div>
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
                    </div>
                )
            } else {
                return (
                    <>
                    <div className='row mt-4'>
                        <div className='col-1'>
                            <i className='handshake outline big icon'></i>
                        </div>
                        <div className='col mt-1' style={{fontSize:'15pt'}}>Tanggal {tgl}</div>
                    </div>
                    <div className='row mt-1'>
                        <div className='col-1'></div>
                        <div className='col' style={{fontSize:'14pt'}}>Transaksi dengan <span className='badge badge-primary'>{transaction.namaBuyer}</span></div>
                    </div>
                    <div className='row mt-1'>
                        <div className='col-1'></div>
                        <div className='col'>Penjualan + ganti ongkir</div>
                        <div className='col-3 text-right'>
                            <span className='badge badge-success' style={{fontSize:'11pt'}}>Rp {transaction.hakSeller}</span>
                        </div>
                    </div> */}
                    </div>
                )
    }

    renderList = () => {
        if(this.state.toogle==='profile'){
        return (
            <div className='row align-items-center text-light quic700'>
                <div className='col-11 mx-auto card'>
                    <div className='card-body'>
                        <div className='row card-title'>
                            <div className='col card-title text-right'>
                                <div class="ui inverted basic dimdom3 buttons">
                                    <button onClick={()=>{this.setState({toogle: 'profile'})}} class="ui inverted basic dimdom3 button">Profile</button>
                                    <button onClick={()=>{this.setState({toogle: 'dashboard'})}} class="ui inverted basic dimdom3 button">Dashboard</button>
                                </div>
                            </div>
                        </div>
                        {this.profile()}
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
                                        <button onClick={()=>{this.setState({toogle: 'profile'})}} class="ui inverted basic dimdom3 button">Profile</button>
                                        <button onClick={()=>{this.setState({toogle: 'dashboard'})}} class="ui inverted basic dimdom3 button">Dashboard</button>
                                    </div>
                                </div>
                            </div>
                            {this.dashboard()}
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
        user_id : state.auth.id,
        other_id : state.auth.otherId
    }
}

export default connect(mapStateToProps)(Myprofile)