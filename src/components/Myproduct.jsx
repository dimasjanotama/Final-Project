import React, { Component } from 'react'
import {Redirect, Link, NavLink} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import axios from 'axios'
import alertify from 'alertifyjs'

import Navbar from './Navbar'
import Footer from './Footer'


const urlApi = 'http://localhost:7777/auth/'

class Myproduct extends Component {

    state = {
        products : [],
        display : '',
        product : [],
        namaProduk: '',
        kategori: '',
        subKategori: '',
        harga: '',
        qty: 0,
        berat: '',
        kondisi: '',
        deskripsi: '',
        message: '',
        error: '',
        selectedFile: '',
        idproduct : '',
        totalitem : '',
        currentpage : '',
        totalpage : '',
        propinsiUser : ''
    }

    componentDidMount(){
        this.setState({
            display: 'group',
            currentpage: 1
        })
        let token = localStorage.getItem('token')
        axios.get(urlApi+'getuserbyid' ,{
            params : {
                userid: this.props.user_id
            },
            headers : {
                authorization : token
            }
        }).then(res=>{
            this.setState({propinsiUser: res.data[0].propinsi})
            this.renderProducts()
        }).catch(err=>{
            console.log(err);
        })
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

    onSubmitEdit = () => {
        if (parseInt(this.state.qty) < 1) { 
            this.setState({error: `Kuantitas barang minimal 1`})
            setTimeout(
            () => {this.setState({error: ''})},
            3000
        )} else if(this.state.harga<50000){
            this.setState({error: `Harga barang minimal 50.000`})
            setTimeout(
            () => {this.setState({error: ''})},
            3000
        )} else if(this.state.harga%1000>0){
            this.setState({error: `Harga barang harus kelipatan 1000`})
            setTimeout(
            () => {this.setState({error: ''})},
            3000
        )} else if (this.state.namaProduk && this.state.kategori && this.state.subKategori && 
            this.state.harga && this.state.berat && this.state.kondisi && this.state.deskripsi && this.state.selectedFile &&
            this.state.qty){
                var fd = new FormData()
                var data = {
                    id: this.state.idproduct,   
                    idUser: this.props.user_id,
                    namaProduk: this.state.namaProduk,
                    kategori: this.state.kategori,
                    subKategori: this.state.subKategori,                     
                    harga: this.state.harga,
                    berat: this.state.berat,
                    kondisi: this.state.kondisi,
                    deskripsi: this.state.deskripsi,
                    qty: this.state.qty,
                    propinsiUser: this.state.propinsiUser
                }
                console.log(this.state.selectedFile, this.state.selectedFile.name);
                fd.append('anehedit', this.state.selectedFile, this.state.selectedFile.name)
                fd.append('data', JSON.stringify(data))
                axios.post(urlApi+'editproduct', fd)
                .then(res=>{
                    alertify.message('Berhasil edit produk')
                    this.setState({display: 'detail'})
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

    renderProducts = ()=>{
        let token = localStorage.getItem('token')
        axios.get(urlApi + 'countproducts', {
            params: {
                userid: this.props.user_id
            },
            headers : {
                authorization : token
            }
        }).then(res=>{
            let activepage = this.state.currentpage
            let totalitem = res.data[0].totalitem
            this.setState({totalitem: totalitem})
            let totalpage = Math.ceil(totalitem/10)
            this.setState({totalpage: totalpage})
            console.log(totalitem,totalpage);
            var indexke = 0
            if (totalitem==1 && activepage==1){
                indexke = 0
            } else if (activepage==1){
                indexke += 0
            } else {
                indexke += (activepage-1)*10 
            } 
            let token = localStorage.getItem('token')
            axios.get(urlApi + 'paginationproducts', {
                params: {
                    userid: this.props.user_id,
                    indexke: indexke
                },
                headers : {
                    authorization : token
                }
            }).then(res=>{
                this.setState({products: res.data})
            })
        })
        .catch(err=>{
            console.log(err);
        })
    }

    onDetailClick = (idproduct) => {
        let token = localStorage.getItem('token')
        axios.get(urlApi + 'getproductbyid', {
            params: {
                userid: this.props.user_id,
                idproduct: idproduct
            },
            headers : {
                authorization : token
            }
        }).then(res=>{
            this.setState({product: res.data[0]})
            this.setState({display: 'detail'})           
        })
        .catch(err=>{
            console.log(err);
        })
    }

    onEditClick = (idproduct) => {
        this.setState({
            idproduct : idproduct,
            display : 'edit'
        })
    }

    onDeleteClick = (idproduct) => {
        axios.delete(urlApi+'deleteproduct',{
            data : {
                id : idproduct
            }
        }
        ).then(res=>{
            alertify.alert('Berhasil menghapus produk')
            this.renderProducts()
        }).catch(err=>{
            console.log(err);
        })
    }

    pagination = (pageNum)=>{
        this.setState({currentpage: pageNum})
        this.renderProducts()
    }

    renderpagination = ()=>{
        if(this.state.totalpage){
            let pagination = []
            for (let i = 1; i < this.state.totalpage+1 ; i++) {
                pagination.push(i)
            }
            
            let hasil = pagination.map((pageNum)=>{
                return <li class="page-item"><button class="page-link" onClick={()=>{this.pagination(pageNum)}}>{pageNum}</button></li>
            })
            return hasil
        } else {
            return null
        }
    }

    renderList = () => {
        if(this.state.display == 'group'){
            if(this.state.products[0]){
            return (
                    <div className='row quic700'>
                        <div className='col-3'>
                            <img className='diamond' src={require('../lib/pictures/DIAMOND.png')} alt=""/>
                        </div>
                        <div className='col-8 mt-4'>
                        {this.state.products.map((product)=>{
                            let {id, namaProduk, kategori, subKategori, harga, berat, kondisi, deskripsi, fotoProduk, qty} = product
                            let numberWithCommas = (x) => {
                                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                            }
                            let harganya = numberWithCommas(harga)
                            return (
                                <div className="cardwhite ml-2 mr-2 pb-3 mb-4 row">
                                    <div className='col-2 pt-4 pl-5'>
                                        <img src={`http://localhost:7777/files/${fotoProduk}`} style={{width:'70px'}} alt="fotoproduk"/>
                                    </div>
                                    <div className="col-7">
                                        <div className='col'>
                                            <button className='btn dimdom-pink-black pt-4 text-left pl-0' onClick={()=>{this.onDetailClick(id)}}>{namaProduk}</button>  
                                        </div>
                                        <div className='w-100'></div>
                                        <div className='col mb-2'>
                                            <span className='badge badge-primary'>{product.kondisi}</span>
                                            <span className='badge badge-primary ml-4' style={{top:'50%'}}>Kuantitas {qty}</span>
                                        </div>
                                        <div className='w-100'></div>
                                        <div className='col'>
                                            <span className='badge badge-grey' style={{fontSize:'12pt'}}>Rp {harganya}</span>
                                        </div>
                                    </div>
                                    <div className='col-2 pt-5'>
                                        <button className='ui inverted basic small button mb-1 btn-block' onClick={()=>{this.onEditClick(id)}}>Edit</button>
                                        <button className='ui inverted basic small button mb-1 btn-block' onClick={()=>{this.onDeleteClick(id)}}>Hapus</button>
                                    </div>
                                </div>
                            ) 
                        })}
                        </div>
                        <div class="w-100"></div>
                        <div className='mx-auto pt-5'>
                            <nav aria-label="Page navigation example">
                                <p className='text-center quic700'>Page</p>
                                <ul class="pagination">
                                    {this.renderpagination()}
                                </ul>
                            </nav>
                        </div>
                    </div>
                
            )
            } else {
                return (
                    <div className='row align-items-center text-light quic700'>
                    <div className='col-11 mx-auto cardwhite'>
                        <div className='card-body'>
                            <div className='col-11 cardgrey ml-5 mr-4 mt-4 mb-5 pt-4 pb-4 pr-3 pl-5 text-black-50' style={{fontSize:'16pt'}}>
                                Kamu belum memiliki produk untuk dijual
                            </div>
                            <div className='row text-center'>
                                <div className='latar'>
                                    <i className='info circle huge icon' style={{color:'black',backgroundColor:'transparent'}}></i>
                                </div>
                                <div className='w-100'></div>
                                <div className='col text-center text-black-50 pt-4' style={{fontSize:'12pt'}}>
                                    <p>Ingin jual produk kamu? yuk! tambah produk kamu  <NavLink to='addproduct' className='dimdom-pink'>disini</NavLink></p>
                                </div>
                            </div>
                            <div className='row text-right pt-3 pb-3'>
                                <div className='col'>
                                    <img className='pig' src={require('../lib/pictures/PIG.png')} alt=""/>
                                    <img className='pedal' src={require('../lib/pictures/pedal2.jpg')} alt=""/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )
            }
        } else if(this.state.display == 'detail'){
            let berat = this.state.product.berat/1000
            return (
            <div className='container'>
            <div className='card col-10 mx-auto text-light my-3 pb-3 quic700'>
                <div className='col text-right mt-4 pr-1'>
                    <i className='times link icon text-light' onClick={()=>this.setState({display: 'group'})}></i>
                </div>
                <div className='row card-body pb-1'>
                    <div className='col-5 text-center'>
                        <img className='card-img-top mb-3' src={`http://localhost:7777/files/${this.state.product.fotoProduk}`} style={{width:'300px', borderRadius:'20pt'}} alt=""/>
                    </div>
                    <div className='col-7'>
                        <h2 className='quic700 text-light'><b>{this.state.product.namaProduk}</b>
                            <span className='badge badge-primary ml-3'>{this.state.product.kategori}</span></h2>
                        <div className='dimdom-bottom'></div>
                        <p style={{fontSize:'22pt'}} className='quic700p mt-3'>Rp. {this.state.product.harga.toLocaleString('id')}</p>
                        <div className='row'>
                            <div className='col-3'>
                                Pengiriman
                            </div>
                            <div className='col-1 text-right'>
                                <i className='shipping fast icon text-light'></i>
                            </div>
                            <div className='col-8 pl-0 text-left'>
                                JNE Reguler
                            </div>
                            <div className='col-4'></div>
                            <div className='col-8 pl-0 text-left'>
                                Dalam Pulau Rp 9.000 - Rp 50.000
                            </div>
                            <div className='col-4'></div>
                            <div className='col-8 pl-0 text-left'>
                                Antar Pulau Rp 50.000 - Rp.160.000
                            </div>
                            <div className='col-3 pt-4 mt-2'>
                                Berat
                            </div>
                            <div className='col-9 pt-4 mt-2 text-left ui input2'>
                                {berat} kg                         
                            </div>
                            <div className='col-3 pt-4 mt-2'>
                                Kuantitas
                            </div>
                            <div className='col-3 pt-4 mt-2 text-left'>
                                <p>{this.state.product.qty} buah</p>                   
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row cardwhite ml-4 mr-3 mt-5 mb-5 pr-4 pl-4 justify-content-center'>
                    <div className='col-12 cardgrey ml-4 mr-4 mt-4 mb-5 pt-4 pb-4 pr-3 pl-5 text-dark' style={{fontSize:'16pt'}}>
                        Deskripsi Produk
                    </div>
                    <div className='col text-dark pb-5'>
                        <p>{this.state.product.deskripsi}</p>
                    </div>
                </div>
            </div>
        </div>
        )
        } else {
            return (
                <div className='row text-light quic700'>
                <div className='col-2'>
                    <img className='pedal2' src={require('../lib/pictures/ADDPRODUCT.png')} alt=""/>
                </div>
                <div className='col-8 mx-auto card pt-2 pl-4 pr-4 pb-4'>
                    <div className='col text-right mt-4 pr-1'>
                        <i className='times link icon text-light' onClick={()=>this.setState({display: 'group'})}></i>
                    </div>
                    <div className='card-body'>
                    <div className='row cardwhite ml-3 mr-3 mb-4 pr-4 pl-4 justify-content-center'>
                        <div className='col-12 cardgrey ml-4 mr-4 mt-4 mb-4 pt-4 pb-4 pr-3 pl-5 text-dark' style={{fontSize:'16pt'}}>
                            Perbarui Produk
                        </div>
                    </div>
                    <div className='card-title pt-1'>
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
                        <div className='col-6 card-title pt-4 mb-2'>Harga (Harga harus kelipatan 1000)</div>
                        <div className='col-2 card-title pt-4 mb-2'>Kuantitas</div>
                        <div className='col-4 card-title pt-4 mb-2'>Perkiraan Berat</div>
                        <div class="w-100"></div>
                        <div class="col-6 ui input2">
                            <input value={this.state.harga} 
                                onChange={(e) => {
                                    if (isNaN(e.target.value)){
                                        this.setState({harga: ''})
                                    } else {
                                        this.setState({harga:e.target.value})
                                    }}} type="text" placeholder="Masukkan harga"/>
                        </div>
                        <div class="col-2 ui input">
                            <input onChange={(e) => {
                                    this.setState({qty:e.target.value})
                                    }} type="number" placeholder="qty"/>
                        </div>  
                        <div class="col-3 ui right labeled input">
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
                            <select className='form-control2' onChange={(e) => this.setState({kondisi: e.target.value})} name="" id="">
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
                    <div className='row mt-4'>
                        <div class=" col ui form">
                            <div class="field">
                                <textarea style={{borderRadius:'15px'}} className='form-control' rows='4' 
                                onChange={(e) => this.setState({deskripsi: e.target.value})} placeholder="Tulis deskripsi efek anda">
                                </textarea>
                            </div>
                        </div>                               
                    </div>
                    <div className='row'>
                        <div className='col pt-3'>
                            <input type="file" ref='fileBtn' onChange={(e) => this.setState({selectedFile : e.target.files[0]})} className='d-none'/>
                            <input type='button' onClick={() => this.refs.fileBtn.click()} className='ui inverted basic small button' value='Unggah foto'/>
                            {this.displayfilename()}
                        </div>
                    </div>
                    <div className='row text-center pt-5'>
                        <div className='col mx-auto'>
                            <button onClick={this.onSubmitEdit} className='ui inverted basic dimdom3 button '>Perbarui</button>
                            {this.notification()}
                        </div>
                        <div class="w-100"></div>
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
                <div className='row dim-wrapper'> 
                    <div className='col-11 mx-auto mt-3'>
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

export default connect(mapStateToProps)(Myproduct)