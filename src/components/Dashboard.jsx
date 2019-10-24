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
        noTransaction : false,
        selectedFile: '',
        noRek: '',
        namaRek: ''
    }

    componentDidMount(){
        this.getTransaction()
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

    notification = ()=>{
        console.log(this.state.noTransaction);
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
                        <th scope="col">Konfirmasi Terima Barang</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <th scope="col">{this.state.bills.id}</th>    
                        <th scope="col">{tglBeli}</th>
                        <th scope="col">{this.state.bills.nilaiTransaksi.toLocaleString('id')}</th>
                        <th scope="col">{tglBayar}</th>
                        <th scope="col">{status}</th>
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
                                <img style={{width: '100px'}} src={require('./cimb.jpg')}/>  123456789 an. Fxpedia 
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

    renderList = () => {
        
        return (
            <div className='row align-items-center text-light quic700'>
                <div className='col-11 mx-auto card'>
                    <div className='card-body'>
                        <div className='row card-title'>
                            <div className='col card-title text-right'>
                                <div class="ui inverted basic dimdom3 buttons">
                                    <button class="ui inverted basic dimdom3 button">Buyer</button>
                                    <button class="ui inverted basic dimdom3 button">Seller</button>
                                </div>
                            </div>
                        </div>
                        {this.notification()}
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