import React, { Component } from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import axios from 'axios'

import Footer from './Footer'
import Navbar from './Navbar'
import Sidebar from './Sidebar'




const urlApi = 'http://localhost:7777/auth/'

class Addproduct extends Component {

    state = {
        namaProduk: '',
        kategori: '',
        subKategori: '',
        harga: '',
        berat: '',
        kondisi: '',
        deskripsi: '',
        message: '',
        error: '',
        selectedFile: ''
    }

    notification = () => {
        if (this.state.error) {
            return (
                <div className='alert alert-danger mt-4 mx-auto'>
                    {this.state.error}
                </div>
            )
        } else {
            return null
        }
    }

    onTambahClick = () => {
        if (this.state.namaProduk && this.state.kategori && this.state.subKategori && 
            this.state.harga && this.state.berat && this.state.kondisi && this.state.deskripsi && this.state.selectedFile){
                var fd = new FormData()
                var data = {   
                    idUser: this.props.user_id,
                    namaProduk: this.state.namaProduk,
                    kategori: this.state.kategori,
                    subKategori: this.state.subKategori,                     
                    harga: this.state.harga,
                    berat: this.state.berat,
                    kondisi: this.state.kondisi,
                    deskripsi: this.state.deskripsi
                }
                console.log(this.state.selectedFile, this.state.selectedFile.name);
                fd.append('aneh', this.state.selectedFile, this.state.selectedFile.name)
                fd.append('data', JSON.stringify(data))
                axios.post(urlApi+'uploadproduct', fd)
                .then(res=>{
                    console.log(res)
                    alert('Berhasil upload produk')
                    return <Redirect to='/myproduct'/>
                }).catch(err=>{
                    console.log(err)
                })
            } else { 
                this.setState({error: `Semua kolom harus diisi`})
                setTimeout(
                () => {this.setState({error: ''})},
                3000
            )
            }
    }

    displayfilename = ()=>{
        if (this.state.selectedFile) {
            return (
                <div className='mt-4'>
                    {this.state.selectedFile.name}
                </div>
            )
        } else {
            return null
        }
    }

    renderList = () => {
        return (
            <div className='row align-items-center text-light mon500'>
                <div className='col-10 mx-auto card'>
                    <div className='card-body'>
                    <div className='card-title subjudul'>
                        Tambah Produk
                    </div>
                    <div className='card-title pt-4'>
                        Informasi &#38; Detail Produk
                    </div>
                    <div className='dimdom-bottom'></div>
                    <div className='row'>
                        <div className='col card-title pt-3 mb-2'>Nama Efek</div>
                        
                        <div class="w-100"></div>
                        <div class=" col ui input2">
                            <input onChange={(e) => this.setState({namaProduk: e.target.value})} type="text" placeholder="Nama Produk"/>
                        </div>                          
                    </div>
                    <div className='row'>
                        <div className='col card-title pt-4 mb-2'>Kategori Efek</div>
                        <div className='col card-title pt-4 mb-2'>Sub-Kategori Efek</div>
                        <div class="w-100"></div>
                        <div class=" col ui input2">
                            <input onChange={(e) => this.setState({kategori: e.target.value})} type="text" placeholder="Kategori"/>
                        </div>                 
                        <div class=" col ui input2">
                            <input onChange={(e) => this.setState({subKategori: e.target.value})} type="text" placeholder="Sub Kategori"/>
                        </div>                 
                    </div>
                    <div className='row'>
                        <div className='col-7 card-title pt-4 mb-2'>Harga (Harga harus kelipatan 100)</div>
                        <div className='col-5 card-title pt-4 mb-2'>Perkiraan Berat</div>
                        <div class="w-100"></div>
                        <div class="col-7 ui input2">
                            <input value={this.state.harga} 
                                onChange={(e) => {
                                    if (isNaN(e.target.value)){
                                        this.setState({harga: ''})
                                    } else {
                                        this.setState({harga:e.target.value})
                                    }}} type="text" placeholder="Masukkan harga"/>
                        </div>
                        <div class="col-5 ui right labeled input">
                            <input value={this.state.berat} 
                                onChange={(e) => {
                                    if (isNaN(e.target.value)){
                                        this.setState({berat: ''})
                                    } else {
                                        this.setState({berat:e.target.value})
                                    }}} type="text" placeholder="Berat"/>
                            <div class="ui basic label">
                                gram
                            </div> 
                        </div>                            
                    </div>
                    <div className='row'>
                        <div className='col card-title pt-4 mb-2'>Kondisi Barang</div>
                    
                        <div class="w-100"></div>
                        <div class="col ui input2">
                            <select className='form-control' onChange={(e) => this.setState({kondisi: e.target.value})} name="" id="">
                                <option selected disabled>Kondisi Barang</option>
                                <option value="Baru">Baru</option>
                                <option value="Bekas">Bekas</option>
                            </select>
                        </div>                 
                    </div>
                    <div className='card-title pt-5'>
                        Deskripsi Produk
                    </div>
                    <div className='dimdom-bottom'></div>           
                    <div className='row'>
                        <div class=" col ui form">
                            <div class="field">
                                <label>Text</label>
                                <textarea rows='4' onChange={(e) => this.setState({deskripsi: e.target.value})} type="text" placeholder="Tulis deskripsi efek anda">
                                </textarea>
                            </div>
                        </div>                               
                    </div>
                    <div className='card-title pt-5'>
                        Foto Produk
                    </div>
                    <div className='dimdom-bottom'></div>
                    <div className='row'>
                        <div className='col pt-3'>
                            <input type="file" ref='fileBtn' onChange={(e) => this.setState({selectedFile : e.target.files[0]})} className='d-none'/>
                            <input type='button' onClick={() => this.refs.fileBtn.click()} className='ui inverted basic dimdom3 button' value='Unggah foto'/>
                            {this.displayfilename()}
                        </div>
                    </div>
                    <div className='row text-center pt-5'>
                        <div className='col mx-auto'>
                            <button onClick={this.onTambahClick} className='ui inverted basic dimdom3 button '>Tambah</button>
                            {this.notification()}
                        </div>
                        <div class="w-100"></div>
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
                    <Sidebar/>
                    <div className='col-9'>
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
        toggle_show: state.auth.show,
        user_id : state.auth.id
    }
}

export default connect(mapStateToProps)(Addproduct)