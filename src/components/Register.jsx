import React, { Component } from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {NavLink, Redirect} from 'react-router-dom'
import moment from 'moment'
import AbsoluteWrapper from './AbsoluteWrapper'
import Footer from './Footer'
import Navbar from './Navbar'


// 701ca464c7e78ef9dfd477f0e978c3a0
const urlApi = 'http://localhost:7777/auth/'

class Register extends Component {

    state = {
        loading: false,
        error: '',
        success: '',
        username: '',
        email: '',
        password: '',
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
        repeatPassword: '',
    }

    onRegisterClick = ()=>{
        axios.get(urlApi + 'getuser',
            {
                params: {
                    username: this.state.username
                }
            }
        ).then((res)=>{
            // jika data ditemukan user berdasarkan email diketik
            if (this.state.password !== this.state.repeatPassword){
                this.setState({loading: false, error: `Password yang ditulis ulang tidak sama`})
                setTimeout(
                    () => { this.setState({error: ''}) },
                    3000
                )
            } else if(res.data.length>0){
                this.setState({loading: false, error: `Username "${this.state.username}" sudah digunakan`})
                setTimeout(
                    () => { this.setState({error: ''}) },
                    3000
                )
            } else if(this.state.noTelp.length<10 || this.state.noTelp.length>12){
                this.setState({loading: false, error: `No HP minimal 10 digit dan maksimal 12 digit`})
                setTimeout(
                    () => { this.setState({error: ''}) },
                    3000
                )
            } else if(this.state.password.length<3){
                this.setState({loading: false, error: `Password minimal 3 karakter huruf/angka`})
                setTimeout(
                    () => { this.setState({error: ''}) },
                    3000
                )
            } else if(this.state.username && this.state.email && this.state.password && this.state.namaDepan &&
                this.state.namaBelakang && this.state.noTelp && this.state.alamat && this.state.kelurahan && this.state.kecamatan &&
                this.state.kabupaten && this.state.propinsi && this.state.kodepos && this.state.pulau && this.state.repeatPassword){
                    this.cekEmail()
            } else { 
                this.setState({loading: false, error: `Semua kolom harus diisi`})
                setTimeout(
                () => { this.setState({error: ''}) },
                3000
            )
            }})
        }

    cekEmail = ()=>{           
            axios.get(urlApi + 'getuser',
            {
                params: {
                    email: this.state.email
                }
            }).then((res)=>{
                // jika data ditemukan user berdasarkan email diketik
                if(res.data.length>0){
                    this.setState({loading: false, error: `Email "${this.state.email}" sudah digunakan`})
                    setTimeout(
                        () => { this.setState({error: ''}) },
                        3000
                    )
                } else {
                    this.postUser()
                }})
    }

    postUser = ()=>{
        let tglDaftar = moment().format('YYYY-MM-DD')
        axios.post(urlApi + 'register',
        {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,                     
            namaDepan: this.state.namaDepan,
            namaBelakang: this.state.namaBelakang,
            noTelp: this.state.noTelp,
            alamat: this.state.alamat,
            kelurahan: this.state.kelurahan,
            kecamatan: this.state.kecamatan,
            kabupaten: this.state.kabupaten,
            propinsi: this.state.propinsi,
            pulau: this.state.pulau,
            kodepos: this.state.kodepos,
            tglDaftar: tglDaftar
        }).then((res)=>{
        axios.get(urlApi+'getuser',
        {
            params: {
                username: this.state.username
            }
        }).then(res=>{
            axios.post(urlApi+'postdataseller',
            {
                idSeller: res.data[0].id
            }).then(res=>{
                this.setState({loading: false, success : 'Berhasil registrasi, Silahkan cek email anda untuk verifikasi akun'})
            }).catch(err=>{
                console.log(err);
            })
        }).catch(err=>{
            console.log(err);
        })
        }).catch(err=>{
            console.log(err);
        })
    }
    
    loadingButton = () => {
        if(this.state.loading) {
            return (
                <div className='spinner-grow' role='status'>
                    <span className='sr-only'></span>
                </div>
            )
        }
    }

    notification = ()=>{
        if(this.state.error){
            // notif error, danger
            return (
                <div className='alert alert-danger mt-4 mx-auto'>
                    {this.state.error}
                </div>
            )
        } else if (this.state.success){
            // notif success, success
            return (
                <div className='alert alert-success mt-4 mx-auto'>
                    {this.state.success}
                </div>
            )
        } else {
            return null
        }
    }


    render() {
    if(!this.props.user_name){
        return(
            
            <AbsoluteWrapper>
                <Navbar/>
                <div className='row align-items-center text-light mon500 dim-height'>
                    <div className='col-6 mx-auto card'>
                        <div className='card-body'>
                            <div className='card-title'>
                                Registrasi
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
                                <div className='col-5 card-title pt-4 mb-2'>Password</div>
                                <div className='col-5 card-title pt-4 mb-2'>Tulis ulang Password</div>
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
                            <div className='row pt-5'>
                                <button onClick={this.onRegisterClick} className='col-4 mx-auto ui inverted basic dimdom3 button '>Daftar</button>
                                <div class="w-100"></div>
                                <div className='d-flex justify-content-center'>
                                    {this.loadingButton()}
                                </div>
                                {this.notification()}
                                <div class="w-100"></div>
                                <div className='col text-center pt-2' style={{fontSize:'80%'}}>Sudah punya akun?
                                <NavLink className='dimdom-pink' to={'/login'}>  Silahkan Login</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              
                <Footer/>
            </AbsoluteWrapper>
        ) //-----------------------------> kurung tutup return
    } else {
        return <Redirect to='/dashboard'/>
    }
    }
}

const mapStateToProps = (state)=>{
    return {
        user_name : state.auth.username
    }
}

export default connect(mapStateToProps)(Register)