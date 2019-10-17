import React, { Component } from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import axios from 'axios'

import Footer from './Footer'
import Navbar from './Navbar'
import Myproduct from './Myproduct'



const urlApi = 'http://localhost:7777/auth/'

class Dashboard extends Component {

    state = {
        kategori: '',
        show: false,
        namaProduk: '',
        kategori: '',
        subKategori: '',
        harga: '',
        berat: '',
        kondisi: '',
        deskripsi: '',
        message: '',
        error: '',
        selectedFile: '',
        products: [],
    }
    
    componentDidMount(){
        this.renderProducts()
    }

    renderProducts = ()=>{
        axios.get(urlApi + 'getproduct', {
            params: {
                userid: this.props.user_id
            }
        }).then(res=>{
            this.setState({products: res.data})
            console.log(res.data)
        })
        .catch(err=>{
            console.log(err);
        })
    }

    showModal = ()=>{
        this.setState({
            show: true
        }) 
    }

    hideModal = ()=>{
        this.setState({
            show: false
        })
    }

    welcome = () => {
       return (
                <div className='mt-5'>
                <div style={{height:'200px'}}></div>
                <h1 className='fade-out' style={{fontSize:'72pt'}}>Hello! {this.props.user_name}</h1>
                </div>
       )
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

    renderList = () => {

        
        if (this.state.kategori === 'dashboard'){
            return(
                <div className='card-nav p-3'>
                    INI DASHBOARD
                </div>
            )
        } else if (this.state.kategori === 'myproducts'){
            return <div className='container'>
                    <div className='row ml-2 mr-2'>
            {this.state.products.map((product)=>{
                return <Myproduct barang={product} key={product.id}/>
            })}
                {/* KUNCINYA DISINI...!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
            </div>
            </div>
            
        } else if (this.state.kategori === 'mycart'){
            return(
                <div className='card p-3'>
                    INI MYCART
                </div>
            )
        } else if (this.state.kategori === 'myprofile'){
            return(
                <div className='card p-3'>
                    INI MYPROFILE
                </div>
            )
        } else {
            return null
        }
    }

    render() {
        if(this.props.user_name){
        return(   
            <AbsoluteWrapper>
                <Navbar/>
                <Modal show={this.state.show} handleClose={this.hideModal}>
                <div className='row align-items-center text-light mon500 dim-height'>
                    <div className='col-6 mx-auto card'>
                        <div className='col text-right mt-4 pr-1'>
                            <i className='times link icon' onClick={()=>this.setState({show: false})}></i>
                        </div>
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
                            </div>
                        </div>
                        <div className='row text-center pt-5'>
                            <div className='col mx-auto'>
                                <button onClick={()=>this.setState({show: false})} className='ui inverted basic dimdom3 button '>  Batal  </button>
                                <button onClick={this.onTambahClick} className='ui inverted basic dimdom3 button '>Tambah</button>
                                {this.notification()}
                            </div>
                            <div class="w-100"></div>
                        </div>
                        </div>
                    </div>
                </div>
                </Modal>
                <div className='row dim-height text-light'> 
                    <div className='col-3 mt-3'>
                        <div className='card-nav p-3 dim-height-nav'>
                            <div className='card-title'>
                            <NavLink to='/dashboarddd' className='ui inverted basic dimdom4 button mt-5'>Dashboard</NavLink>
                            <button onClick={this.showModal} className='ui inverted basic dimdom4 button'>Add_Product</button>
                            <button onClick={()=> this.setState({kategori: 'myproducts'})} className='ui inverted basic dimdom4 button'>My_Products</button>
                            <button onClick={()=> this.setState({kategori: 'mycart'})} className='ui inverted basic dimdom4 button'>My_Cart</button>
                            <button onClick={()=> this.setState({kategori: 'myprofile'})} className='ui inverted basic dimdom4 button'>My_Profile</button>    
                            </div>
                        </div>
                    </div>
                    <div className='col-9 mt-3'>
                        {this.renderList()}
                        {this.welcome()}
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

const Modal = ({ handleClose, show, children }) => {
    const showHideClassName = show ? 'modal display-block' : 'modal display-none';
  
    return (
      <div className={showHideClassName}>
        <section className='modal-main'>
          {children}
        </section>
      </div>
    );
  };

const mapStateToProps = (state)=>{
    return {
        user_name: state.auth.username,
        toggle_show: state.auth.show,
        user_id : state.auth.id
    }
}

export default connect(mapStateToProps)(Dashboard)