import React, { Component } from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import axios from 'axios'
import alertify from 'alertifyjs'

import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import moment from 'moment'


const urlApi = 'http://localhost:7777/auth/'

class Myprofile extends Component {

    state = {
        profile: [],
        transactionBuy: [],
        transactionSell: [],
        ordersBuy: [],
        ordersSell: [],
        toogle: '',
        dataSeller: [],
        error: '',
        success: '',
        username: '',
        email: '',
        namaDepan: '',
        namaBelakang: '',
        noTelp : '',
        alamat: '',
        kelurahan: '',
        kecamatan: '',
        kabupaten: '',
        propinsi: '',
        kodepos: '',
        pulau: '',
        newPassword: '',
        repeatNewPassword: '',
        selectedFile: ''
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
            this.setState({ profile: res.data[0] })
            axios.get(urlApi+'getdataseller',{
                params : {
                    idSeller:  this.props.user_id
                }
            }).then(res=>{
                this.setState({ dataSeller: res.data })
            }).catch(err=>{
                console.log(err);
            })
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

    renderPic = () => {
        if(this.state.profile.fotoProfil){
            return (
                <div className='row text-center'> 
                    <img className="rounded-circle mx-auto" style={{width:'200px'}} src={require('../lib/pictures/user.jpg')}></img>
                </div>
            )
        } else {
            return (
                <div className='row text-center'> 
                    <img className="rounded-circle mx-auto" style={{width:'200px'}} src={require('../lib/pictures/user.jpg')}></img>
                </div>
            )
        }
    }

    updateFoto = ()=>{
        var fd = new FormData()
        var data = this.props.user_id
        console.log(this.state.selectedFile, this.state.selectedFile.name);
        fd.append('anehfoto', this.state.selectedFile, this.state.selectedFile.name)
        fd.append('data', data)
        axios.post(urlApi+'updatefoto', fd)
        .then(res=>{
            alertify.alert('Keterangan', 'Sukses! Berhasil ubah foto profil')
            this.getProfile()
            this.setState({selectedFile: ''})
        }).catch(err=>{
            console.log(err)
        })
    }

    profile = () => {
        var { username, email, namaDepan, namaBelakang, noTelp, alamat, kelurahan, kecamatan, kabupaten, propinsi, tglDaftar, fotoProfil } = this.state.profile
        var tglGabung = tglDaftar
        console.log(fotoProfil);
        
        return (
            <div>
                <div className='card-title subjudul'>
                    Profil
                </div>
                <div className='dimdom-bottom'></div>
                 <div className='row card-title pt-4'>
                 <div class="w-100"></div> 
                 <div className='dimdom-bottom'></div>
                 <div className='row w-100'>
                    <div className='col-4'>
                        <div className='row text-center'> 
                            <img className="rounded-circle mx-auto"  style={{width:'200px'}} 
                            src={fotoProfil ? `http://localhost:7777/files/${fotoProfil}` : require('../lib/pictures/user.jpg')}></img>
                        </div>
                        <div className='row card-title pt-4 pl-0 quic700p text-center'>
                            <div className='col'>
                                {username}
                            </div>
                        </div>
                        <div className='row card-title pb-1 pl-0 quic700 text-center'>
                            <div className='col'>
                                <p>{kabupaten}, {propinsi}</p>
                            </div>
                        </div> 

                        <div className='col card-title pt-4'>
                            <div class="ui inverted basic dimdom3 buttons">
                                <input type='button' onClick={() => this.refs.fileBtn2.click()} className='ui inverted basic dimdom3 button' value='Unggah foto profile'/>
                                <input type='button' onClick={this.updateFoto} className='ui inverted basic dimdom3 button' value='Submit'/>
                            </div>
                                <input type="file" ref='fileBtn2' onChange={(e) => this.setState({selectedFile : e.target.files[0]})} className='d-none'/>
                        </div>
                        <div class="w-100"></div>  
                        <div className='col card-title'>
                            {this.displayfilename()}
                        </div>
                        <div class="w-100"></div> 
                        <div className='pt-3'></div> 
                    </div>
                    <div className='col-8'>
                        <div className='row card-title pb-1 pl-0 quic700'>
                            <div className='col'>
                                <p>Nama Lengkap : {namaDepan} {namaBelakang}</p>
                                <p>Email : {email}</p>
                                <p>No. Telepon : {noTelp}</p>
                                <p>Alamat Lengkap : {alamat}, {kelurahan}, {kecamatan}, {kabupaten}, {propinsi}</p>
                                <p>Bergabung sejak : {moment(tglGabung).format('LL')}</p>
                            </div>
                            <div className='col-2'>
                                <input type="button" onClick={()=>{this.setState({toogle: 'edit'})}} className='ui inverted basic dimdom3 button' value='Edit'/>
                                </div> 
                        </div> 

                    </div>
                </div>
                </div>
            </div>
        )
    }

    dashboard = () => {
        var { waktuLogin, waktuLogout, totalPuas, totalFeedback, totalTransaksi } = 0    
        var pembeliPuas = (parseInt(totalPuas)/parseInt(totalFeedback))*100
        var waktuTerakhir = 0
        return (
            <div>
                <div className='card-title subjudul pb-4'>
                    Dashboard
                </div>
                <div className='dimdom-bottom'></div>
                <div className='row justify-content-center'>
                    <div className='col-8'>
                    <div className='row mt-4' style={{fontSize:'12pt'}}>
                    <div className='col text-right'><i className='child icon large'></i></div>
                    <div className='col-2 pl-0'>Pembeli Puas</div>
                    <div className='col-2'>{pembeliPuas}% Puas</div>
                    <div className='col text-right'><i className='thumbs up outline icon large'></i></div>
                    <div className='col-3 pl-0'>Jumlah Feedback</div>
                    <div className='col-2'>{totalFeedback}</div>
                </div>
                <div className='row mt-4' style={{fontSize:'12pt'}}>
                    <div className='col text-right'><i className='history icon large'></i></div>
                    <div className='col-2 pl-0'>Terakhir Online</div>
                    <div className='col-2'>{waktuTerakhir}</div>
                    <div className='col text-right'><i className='medkit icon large'></i></div>
                   
                </div>
                <div className='row mt-4' style={{fontSize:'12pt'}}>
                    <div className='col text-right'><i className='cube icon large'></i></div>
                    <div className='col-2 pl-0'>Total produk</div>
                    <div className='col-2'>{this.state.totalProduct}</div>
                    <div className='col text-right'><i className='money bill alternate outline icon large'></i></div>
                    <div className='col-3 pl-0'>Produk terjual</div>
                    <div className='col-2'>{this.state.totalSold}</div>
                </div>
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
        )} else if (this.state.toogle==='dashboard'){
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
        )} else {
            return (
            <div className='row align-items-center text-light mon500'>
                    
                <div className='col-8 mx-auto card'>
                    <div className='col text-right mt-4 pr-1'>
                        <i className='times link icon' onClick={()=>this.setState({toogle: 'profile'})}></i>
                    </div>
                    <div className='card-body'>
                        <div className='card-title subjudul'>
                            Edit Profile
                        </div>
                        <div className='row'>
                            <div className='col card-title pt-4 mb-2'>Username</div>
                            <div className='col card-title pt-4 mb-2'>Email</div>
                            <div class="w-100"></div>
                            <div class=" col ui input2">
                                <input onChange={(e) => this.setState({username: e.target.value})} type="text" placeholder="Username"/>
                            </div>                 
                            <div class=" col ui input2">
                                <input onChange={(e) => this.setState({email: e.target.value})} type="email" placeholder="Email"/>
                            </div>                 
                        </div>
                        <div className='row'>
                            <div className='col-4 card-title pt-4 mb-2'>Nama Depan</div>
                            <div className='col-4 card-title pt-4 mb-2'>Nama Belakang</div>
                            <div className='col-4 card-title pt-4 mb-2'>No. HP</div>
                            <div class="w-100"></div>
                            <div class=" col-4 ui input2">
                                <input onChange={(e) => this.setState({namaDepan: e.target.value})} type="text" placeholder="Nama Depan"/>
                            </div>                 
                            <div class=" col-4 ui input2">
                                <input onChange={(e) => this.setState({namaBelakang: e.target.value})} type="text" placeholder="Nama Belakang"/>
                            </div>                 
                            <div class=" col-4 ui input2">
                            <input value={this.state.noTelp} 
                                onChange={(e) => {
                                    if (isNaN(e.target.value)){
                                        this.setState({noTelp: ''})
                                    } else {
                                        this.setState({noTelp:e.target.value})
                                    }}} type="text" placeholder="No HP"/>
                                
                            </div>                 
                        </div>
                        <div className='row'>
                            <div className='col-9 card-title pt-4 mb-2'>Alamat</div>
                            <div className='col-3 card-title pt-4 mb-2'>Kelurahan</div>
                            <div class="w-100"></div>
                            <div class="col-9 ui input2">
                                <input onChange={(e) => this.setState({alamat: e.target.value})} type="text" placeholder="Alamat"/>
                            </div>
                            <div class="col-3 ui input2">
                                <input onChange={(e) => this.setState({kelurahan: e.target.value})} type="text" placeholder="Kelurahan"/>
                            </div>                                  
                        </div>
                        <div className='row'>
                            <div className='col card-title pt-4 mb-2'>Kecamatan</div>
                            <div className='col card-title pt-4 mb-2'>Kabupaten/Kota</div>
                            <div className='col card-title pt-4 mb-2'>Propinsi</div>
                            <div className='col card-title pt-4 mb-2'>Kodepos</div>
                            <div class="w-100"></div>
                            <div class="col-3 ui input2">
                                <input onChange={(e) => this.setState({kecamatan: e.target.value})} type="text" placeholder="Kecamatan"/>
                            </div>                 
                            <div class="col-3 ui input2">
                                <input onChange={(e) => this.setState({kabupaten: e.target.value})} type="text" placeholder="Kabupaten"/>
                            </div>    
                            <div class="col-3 ui input2">
                                <input onChange={(e) => this.setState({propinsi: e.target.value})} type="text" placeholder="Propinsi"/>
                            </div> 
                            <div class="col-3 ui input2">
                                <input value={this.state.kodepos} 
                                onChange={(e) => {
                                    if (isNaN(e.target.value)){
                                        this.setState({kodepos: ''})
                                    } else {
                                        this.setState({kodepos:e.target.value})
                                    }}} type="text" placeholder="Kodepos"/>
                            </div>              
                        </div>
                        <div className='row'>
                            <div className='col-2 card-title pt-4 mb-2'>Kepulauan</div>
                            <div className='col-5 card-title pt-4 mb-2'>Password Baru</div>
                            <div className='col-5 card-title pt-4 mb-2'>Tulis ulang Password Baru</div>
                            <div class="w-100"></div>
                            <div class=" col-2 ui input2">
                                <select onChange={(e)=>{this.setState({pulau: e.target.value})}} className='form-control' name="" id="">
                                    <option selected disabled>Pulau</option>
                                    <option value="Sumatera">Sumatera</option>
                                    <option value="Jawa">Jawa</option>
                                    <option value="Bali">Bali</option>
                                    <option value="NTB">NTB</option>
                                    <option value="NTT">NTT</option>
                                    <option value="Kalimantan">Kalimantan</option>
                                    <option value="Sulawesi">Sulawesi</option>
                                    <option value="Maluku">Maluku</option>
                                    <option value="Papua">Papua</option>
                                </select>  
                            </div>
                            <div class=" col-5 ui input2">
                                <input onChange={(e) => this.setState({password: e.target.value})} type="password" placeholder="Tulis password untuk akun anda"/>
                            </div>
                            <div class=" col-5 ui input2">
                                <input onChange={(e) => this.setState({repeatPassword: e.target.value})} type="password" placeholder="Tulis ulang password anda"/>
                            </div>
                        </div>
                        <div class="w-100"></div>    
                        
                        <div className='row pt-5'>
                            <button onClick={this.onUpdateClick} className='col-4 mx-auto ui inverted basic dimdom3 button '>Update Profile</button>
                            <div class="w-100"></div>
                            
                            {/* {this.notification()} */}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
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