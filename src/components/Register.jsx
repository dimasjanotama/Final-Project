import React, { Component } from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {NavLink, Redirect} from 'react-router-dom'

import AbsoluteWrapper from './AbsoluteWrapper'
import Footer from './Footer'


class Register extends Component {

    state = {
        loading: false,
        error: '',
        success: ''
    }

    onRegisterClick = ()=>{
        //Ambil semua data dari input text
        let data_username =this.username.value
        let data_email = this.email.value
        let data_namaDepan = this.namaDepan.value
        let data_namaBelakang = this.namaBelakang.value
        let data_alamat = this.alamat.value
        let data_kelurahan = this.kelurahan.value
        let data_kecamatan = this.kecamatan.value
        let data_kabupaten = this.kabupaten.value
        let data_propinsi = this.propinsi.value
        let data_kodepos = this.kodepos.value
        let data_password = this.password.value

        axios.get(
            'http://localhost:7777/users',
            {
                params: {
                    username: data_username
                }
            }
        ).then((res)=>{
            // jika data ditemukan user berdasarkan email diketik
            if(res.data.length>0){
                this.setState({loading: false, error: `Username "${this.username.value}" sudah digunakan`})
                setTimeout(
                    () => { this.setState({error: ''}) },
                    3000
                )
            } else { 
                axios.get(
                    'http://localhost:7777/users',
                {
                    params: {
                        email: data_email
                    }
                }).then((res)=>{
                    // jika data ditemukan user berdasarkan email diketik
                    if(res.data.length>0){
                        this.setState({loading: false, error: `Email "${this.email.value}" sudah digunakan`})
                    } else {
                        axios.post(
                            'http://localhost:7777/users',
                            {
                                username: data_username,
                                email: data_email,
                                password: data_password,
                                namaDepan: data_namaDepan,
                                namaBelakang : data_namaBelakang,
                                alamat : data_alamat,
                                kelurahan : data_kelurahan, 
                                kecamatan : data_kecamatan, 
                                kabupaten : data_kabupaten, 
                                propinsi : data_propinsi,
                                kodepos : data_kodepos
                            }
                        ).then((res)=>{
                            // Jika berhasil
                            this.setState({loading: false, success : 'Berhasil registrasi, silahkan Login dahulu'})
                            console.log(res.data);
                        })
                    }
                } )
            }
        })
        // console.log(data_username, data_email, data_password);
        //Post data tersebut ke db.json
        
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
                <div className='alert alert-danger mt-4'>
                    {this.state.error}
                </div>
            )
        } else if (this.state.success){
            // notif success, success
            return (
                <div className='alert alert-success mt-4'>
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
                <div className='container-fluid text-light' style={{ backgroundColor:'rgb(33,34,44)', height:'400px', width:'1200px'}}>
                <div style={{height: '50px'}}></div>
                    <div className='row mx-auto align-items-center w-75 text-center' style={{height:'160px'}}>
                        <div className='col monalt900' style={{fontSize:'80pt'}}>Fxpedia.</div> 
                        </div>
                    <div className='mx-auto align-items-center text-center' style={{height:'100px'}}>
                        
                        <h1 className='m-0 mon600' style={{fontSize:'30pt'}}>- Market Place -</h1>
                        <div className='row align-items-center'>
                            <h1 className='col m-0 text-right mon600' style={{fontSize:'30pt'}}>
                                Untuk
                            </h1>
                            <h1 className='col-3 m-0 mon600 dimdom-color' style={{fontSize:'30pt'}}>Pecinta Efek</h1>
                            <br/>
                            <br/>
                            <h1 className='col m-0 text-left mon600' style={{fontSize:'30pt'}}>Pedal</h1>
                        </div>
                    </div>
                </div>
                <div className='row align-items-center dimdom-pic2 text-light mon500'>
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
                                    <input ref={(input) => {this.username = input}} type="text" placeholder="Username"/>
                                </div>                 
                                <div class=" col ui input2">
                                    <input ref={(input) => {this.email = input}} type="text" placeholder="Email"/>
                                </div>                 
                            </div>
                            <div className='row'>
                                <div className='col card-title pt-4 mb-2'>Nama Depan</div>
                                <div className='col card-title pt-4 mb-2'>Nama Belakang</div>
                                <div class="w-100"></div>
                                <div class=" col ui input2">
                                    <input ref={(input) => {this.namaDepan = input}} type="text" placeholder="Nama Depan"/>
                                </div>                 
                                <div class=" col ui input2">
                                    <input ref={(input) => {this.namaBelakang = input}} type="text" placeholder="Nama Belakang"/>
                                </div>                 
                            </div>
                            <div className='row'>
                                <div className='col-9 card-title pt-4 mb-2'>Alamat</div>
                                <div className='col-3 card-title pt-4 mb-2'>Kelurahan</div>
                                <div class="w-100"></div>
                                <div class="col-9 ui input2">
                                    <input ref={(input) => {this.alamat = input}} type="text" placeholder="Alamat"/>
                                </div>
                                <div class="col-3 ui input2">
                                    <input ref={(input) => {this.kelurahan = input}} type="text" placeholder="Kelurahan"/>
                                </div>                                  
                            </div>
                            <div className='row'>
                                <div className='col card-title pt-4 mb-2'>Kecamatan</div>
                                <div className='col card-title pt-4 mb-2'>Kabupaten/Kota</div>
                                <div className='col card-title pt-4 mb-2'>Propinsi</div>
                                <div className='col card-title pt-4 mb-2'>Kodepos</div>
                                <div class="w-100"></div>
                                <div class="col-3 ui input2">
                                    <input ref={(input) => {this.kecamatan = input}} type="text" placeholder="Kecamatan"/>
                                </div>                 
                                <div class="col-3 ui input2">
                                    <input ref={(input) => {this.kabupaten = input}} type="text" placeholder="Kabupaten"/>
                                </div>    
                                <div class="col-3 ui input2">
                                    <input ref={(input) => {this.propinsi = input}} type="text" placeholder="Propinsi"/>
                                </div> 
                                <div class="col-3 ui input2">
                                    <input ref={(input) => {this.kodepos = input}} type="text" placeholder="Kodepos"/>
                                </div>              
                            </div>
                            <div className='row'>
                                <div className='col card-title pt-4 mb-2'>Password</div>
                                <div class="w-100"></div>
                                <div class=" col ui input2">
                                    <input ref={(input) => {this.password = input}} type="password" placeholder="Tulis password untuk akun anda"/>
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