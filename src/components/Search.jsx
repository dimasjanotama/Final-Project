import React, { Component } from 'react'
import {Link, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import { clickSeller } from '../actions'
import axios from 'axios'
import alertify from 'alertifyjs'

import Navbar from './Navbar'
import Footer from './Footer'


const urlApi = 'http://localhost:7777/auth/'

class Search extends Component {

    state = {
        redirect: false,
        display : '',
        currentpage : '',
        products : [],
        namaProduk : '',
        namaSeller : '',
        kategori: '',
        hargaMin: '',
        hargaMax: '',
        kondisi: '',
        qty: '',
        product: [],
        selectedId: '',
        toogle: '',
        orderQty: '',
        pulauUser: '',
        user: [],
        idCart: '',
        buyerCartQty: [],
        stockQty : ''
    }

    componentDidMount(){
        this.setState({
            display: 'group',
            currentpage: 1,
            namaProduk: this.props.key_words,
            toogle: ''
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
            this.setState({user: res.data[0]})
            this.setState({pulauUser: res.data[0].pulau})
            this.onFilterClick()
        }).catch(err=>{
            console.log(err);
            
        })
    }

    onFilterClick = ()=>{
        let filterData = {}
        let {namaProduk, namaSeller, kategori, kondisi} = this.state
        let hargamax = parseInt(this.state.hargaMax)
        let hargamin = parseInt(this.state.hargaMin)
        let userid = this.props.user_id
        let token = localStorage.getItem('token')
        // this.props.history.push(`/jc10?name=${name}`)
        // let feParams = querystring.parse(this.props.location.search)
        // console.log(feParams)
        if(userid){
            filterData = {...filterData,  userid}
        }
        if(namaProduk){
            filterData = {...filterData,  namaProduk}
        }
        if(namaSeller){
            filterData = {...filterData,  namaSeller}
        }
        if(hargamax && hargamin){
            filterData = {...filterData, hargamax, hargamin}
        }
        if(kategori){
            filterData = {...filterData, kategori}
        }
        if(kondisi == 'baru' || kondisi == 'bekas'){
            filterData = {...filterData, kondisi}
        }
        axios.get(urlApi + 'countfilterproducts', {
            params: filterData,
            headers : {
                authorization : token
            }  
        }).then(res=>{
            this.setState({products: res.data})
            let totalitem = res.data[0].totalitem
            this.setState({totalitem: totalitem})
            let totalpage = Math.ceil(totalitem/10)
            this.setState({totalpage: totalpage})
            console.log(this.state.totalitem, this.state.totalpage);
            this.renderProducts()
        })
        .catch(err=>{
            console.log(err);
        })
    }

    renderProducts = ()=>{
        let filterData = {}
        let {namaProduk, namaSeller, kategori, kondisi} = this.state
        let hargamax = parseInt(this.state.hargaMax)
        let hargamin = parseInt(this.state.hargaMin)
        let userid = this.props.user_id
        let token = localStorage.getItem('token')
        // this.props.history.push(`/jc10?name=${name}`)
        // let feParams = querystring.parse(this.props.location.search)
        // console.log(feParams)
        if(userid){
            filterData = {...filterData,  userid}
        }
        if(namaSeller){
            filterData = {...filterData, userid: userid, namaSeller}
        }
        if(namaProduk){
            filterData = {...filterData, userid: userid, namaProduk}
        }
        if(hargamax && hargamin){
            filterData = {...filterData, hargamax, hargamin}
        }
        if(hargamax){
            filterData = {...filterData, hargamax}
        }
        if(hargamin){
            filterData = {...filterData, hargamin}
        }
        if(kategori){
            filterData = {...filterData, kategori}
        }
        if(kondisi == 'baru' || kondisi == 'bekas'){
            filterData = {...filterData, kondisi}
        }
        let activepage = this.state.currentpage
        var indexke = 0
        if (activepage==1){
            indexke +=0
            filterData = {...filterData, indexke}
        } else {
            indexke += (activepage-1)*10 
            filterData = {...filterData, indexke}
        }
        axios.get(urlApi + 'paginationfilterproducts', {
            params: filterData,
            headers : {
                authorization : token
            }  
        }).then(res=>{
            this.setState({products: res.data})
        }).catch(err=>{
            console.log(err);
        })
    }

    pagination = (pageNum)=>{
        this.setState({currentpage: pageNum})
        this.renderProducts(this.onFilterClick())
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

    onDetailClick = (idproduct) => {
        let token = localStorage.getItem('token')
        axios.get(urlApi + 'getproductsearch', {
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

    renderList = () => {
        if(this.state.display == 'group'){
            return (
                <div className='container'>
                    <div className='row align-items-center quic700'>
                        <div className='col-11 mx-auto mb-n4'>
                            <div className='row'>
                                <div className='col-1 card-title pt-4'>
                                    <i className='huge info icon text-right' style={{color: 'rgb(255, 31, 210)'}}></i>
                                </div>
                                <div className='col-8 card-title pt-4 mt-4 ml-2 text-left' style={{fontSize:'20pt'}}>
                                    Hasil pencarian untuk '{this.state.namaProduk}'
                                </div>   
                            </div>
                        </div>
                    </div>
                    <div className='row ml-2 mr-2'>
                        {this.state.products.map((product)=>{
                            let {id, idUser, namaSeller, namaProduk, kategori, kondisi, fotoProduk} = product
                            let harga = parseInt(product.harga)
                            if(id !== this.state.selectedId){
                                return (
                                    <div class="cardwhite ml-2 mr-2 mt-5" style={{width: "12rem"}}>
                                        <img class="card-img-top" src={`http://localhost:7777/files/${fotoProduk}`} alt="fotoproduk"/>
                                        <div className='row card-body p-0 pb-3'>
                                            <div className='col text-center'>
                                                <button className='btn dimdom-pink-black mb-1' onClick={()=>{this.onDetailClick(id)}}>{namaProduk}</button>
                                            </div>
                                            <div class="w-100"></div>
                                            <div className='col ml-3'>
                                                <span className='badge badge-grey mb-2'>{kategori}</span>
                                                <span className='ml-2 mb-2 badge badge-primary'>{kondisi}</span>
                                            </div>
                                            <div class="w-100"></div>
                                            <i className='ml-3 col-2 pr-1 text-left user icon'></i>
                                            <p className='col pl-0'>
                                                <Link to='/otherprofile' onClick={()=>{this.props.clickSeller(idUser)}} className="col mt-2 pl-0">
                                                    <span className='badge badge-primary' style={{fontSize:'10pt'}}>{namaSeller}</span></Link>
                                            </p>
                                            <div class="w-100"></div>
                                            <p className='col card-text ml-3 quic700' style={{fontSize:'16pt'}} >
                                                <span className='badge badge-grey'>Rp. {harga.toLocaleString('id')}</span>
                                            </p>
                                        </div>
                                    </div>
                                ) 
                            } else {
                                return (
                                    <div className='mt-3 ml-2 mr-2 mb-4 col-2 card' >
                                        <button className='btn mt-3 ml-n2' onClick={()=>{this.onDetailClick(id)}}>
                                            <img style={{width: '120px'}} src={`http://localhost:7777/files/${fotoProduk}`} alt="fotoproduk"/>
                                        </button>
                                        <div className='card-body p-0 pb-3'>
                                            <button className='btn dimdom-pink mb-2' onClick={()=>{this.onDetailClick(id)}}>{namaProduk}</button>
                                            <p className='card-text text-center'>Rp. {harga.toLocaleString('id')}</p>
                                        </div>
                                    </div>
                                ) 
                            }
                        })}
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
                </div>
            )
        } else if(this.state.display == 'detail'){
            let berat = this.state.product.berat/1000
            return (
            <div className='container'>
                    <div className='card col-10 mx-auto my-3 pb-3 quic700 text-light'>
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
                                <p style={{fontSize:'22pt'}} className='quic700p mt-3'>Rp {this.state.product.harga.toLocaleString('id')}</p>
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
                                    <div className='col-3 pt-4 text-left ui input2'>
                                        <input value={this.state.orderQty} 
                                            onChange={(e) => {
                                                if (isNaN(e.target.value)){
                                                    this.setState({orderQty: ''})
                                                } else {
                                                    this.setState({orderQty:e.target.value})
                                                }}} type="text" placeholder="Qty"/>                           
                                    </div>
                                    <div className='col-6 pt-4 mt-2 pl-0 text-left'>
                                        <p>Tersisa {this.state.product.qty} buah</p>
                                    </div>
                                    <div className='col-8 pt-3 mt-2'>
                                        <div class="ui inverted basic dimdom3 buttons">
                                            <button className='ui inverted basic dimdom3 button mb-1 btn-block' onClick={()=>{this.onClickAtc(this.state.product.id, this.state.product)}}>Tambahkan ke Dalam Keranjang</button>                            
                                        </div> 
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
        } 
    }

    onClickAtc = (idProduct, product)=>{
        if(this.state.orderQty < 1 ){
            alertify.alert('Keterangan', 'Pembelian minimal 1')
        } else if (this.state.orderQty > parseInt(product.qty)){
            alertify.alert('Keterangan', 'Stok produk tidak mencukupi')
        } else {
            axios.get(urlApi+'getbuyercartqty',{
                params: {
                    idBuyer: this.props.user_id,
                    idProduct: idProduct
                }
            }).then(res=>{
                console.log('line 368');
                console.log(res.data);
                if(res.data){
                    let totalOrder = 0
                    for(let i=0;i<res.data.length;i++){
                        console.log(res.data[i]);
                        totalOrder+= res.data[i].orderQty 
                    }
                    console.log(totalOrder);
                    if(totalOrder+this.state.orderQty > product.qty){
                        alertify.alert('Keterangan','Maaf stok product tidak mencukupi')
                    } else {
                        this.cekQty(idProduct, product)
                    }
                } else {
                    console.log('line 381');
                    this.cekQty(idProduct, product)
                }
            }).catch(err=>{
                console.log(err);
            })
        } 
    }

    cekQty = (idProduct, product)=>{
        
        axios.get(urlApi+'cekqty',{
            params : {
                idProduct : idProduct,
                idBuyer: this.props.user_id
            }
        }).then(res=>{
            if(res.data[0].sudahada>0){
                let orderQtyNow = parseInt(res.data[0].orderQty) + parseInt(this.state.orderQty)
                axios.put(urlApi+'addqty',{
                    orderQtyNow: orderQtyNow,
                    orderQty: this.state.orderQty,
                    idProduct: idProduct,
                    qty: this.state.qty,
                    pulauSeller:this.state.product.pulauUser,
                    idBuyer: this.props.user_id,
                    namaBuyer: this.props.user_name,
                }).then(res=>{
                    alertify.alert('Keterangan', 'Success! Berhasil menambah ke keranjang')
                    this.setState({redirect:true})
                }).catch(err=>{
                    console.log(err);
                })
            } else {
                axios.post(urlApi + 'addtocart',
                {
                    idProduct: idProduct,
                    idBuyer: this.props.user_id,
                    namaBuyer: this.props.user_name,
                    idSeller: product.idUser,
                    namaSeller: product.namaSeller,      
                    pulauBuyer: this.state.pulauUser,               
                    pulauSeller: product.pulauUser,               
                    namaProduk: product.namaProduk,
                    harga: product.harga,
                    berat: product.berat,
                    qty: parseInt(product.qty),
                    orderQty: parseInt(this.state.orderQty),
                    fotoProduk: product.fotoProduk
                }).then((res)=>{
                    axios.post(urlApi+'addorder',{
                        idBuyer: this.props.user_id,
                        namaBuyer: this.state.user.namaDepan +' '+ this.state.user.namaBelakang,
                        idSeller: product.idUser,  
                        namaSeller: product.namaSeller,
                        pulauBuyer: this.state.pulauUser,               
                        pulauSeller: product.pulauUser, 
                        alamat: this.state.user.alamat,
                        kelurahan: this.state.user.kelurahan,
                        kecamatan: this.state.user.kecamatan,
                        kabupaten: this.state.user.kabupaten,
                        propinsi: this.state.user.propinsi,
                        kodepos: this.state.user.kodepos,
                        idProduct: idProduct,
                        namaProduk: product.namaProduk,
                        orderQty: parseInt(this.state.orderQty),
                        harga: product.harga,
                        berat: product.berat,
                        fotoProduk: product.fotoProduk
                    }
                    ).then(res=>{
                        alertify.alert('Keterangan', 'Sukses! Berhasil ditambahkan ke keranjang')
                        this.setState({redirect:true})
                    }).catch(err=>{
                        console.log(err);
                    })    
            })
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    render() {
        if(this.state.redirect){
            return <Redirect to='/mycart'/>
        }
        if(this.props.user_name){
        return(   
            <AbsoluteWrapper>
                <Navbar/>
                <div className='container quic700'>
                <div className='row'> 
                    <div className='col-11 mt-3 mx-auto'>
                    <div className='cardwhite p-3 row'>
                        <div className='col-2'>
                            <img className='magnify' src={require('../lib/pictures/MAGNIFY.jpg')} alt=""/>
                        </div>
                        <div className='card-title col-10 pt-2'>
                            <div className='col-11 cardgrey ml-5 mr-4 mt-4 pt-4 pb-4 pr-3 pl-5 text-black-50' style={{fontSize:'16pt'}}>
                                Cari efek yang kamu mau disini
                            </div>
                            <div className='row pt-3 col-11 mx-auto'>
                                <div className='col-2 card-title pt-2 mb-2 pr-0'>Nama Produk</div>
                                <div class=" col-4 ui input3 mr-3 mb-1">
                                    <input onChange={(e) => this.setState({namaProduk: e.target.value})} type="text" placeholder="Nama Produk"/>
                                </div>
                                <div className='col-1 card-title pt-1 mb-2 '>Harga</div>
                                <div class=" col-2 ui input3 mb-1">
                                    <input onChange={(e) => this.setState({hargaMin: e.target.value})} type="text" placeholder="Min"/>
                                </div>
                                <div class=" col-2 ui input3 mb-1">
                                    <input onChange={(e) => this.setState({hargaMax: e.target.value})} type="text" placeholder="Max"/>
                                </div>    
                                <div class="w-100"></div>
                                <div className='col-2 card-title pt-2 mb-2 pr-0'>Nama Seller</div>
                                <div class=" col-4 ui input3 mr-3 mb-1">
                                    <input onChange={(e) => this.setState({namaSeller: e.target.value})} type="text" placeholder="Nama Seller"/>
                                </div>
                                <div className='col-1 card-title pt-2 mb-2'>Kondisi</div>
                                <div class="col-4 ui input3 mr-3">
                                    <select className='form-control custom-select mb-1' onChange={(e) => this.setState({kondisi: e.target.value})} name="" id="">
                                        <option selected disabled>Kondisi Barang</option>
                                        <option value="">All</option>
                                        <option value="baru">Baru</option>
                                        <option value="bekas">Bekas</option>
                                    </select>
                                </div>
                                <div class="w-100"></div>
                                <div className='col-2 card-title pt-2 mb-2 pr-0'>Kategori</div>
                                <div class=" col-4 ui input3 mr-3">
                                    <select onChange={(e) => this.setState({kategori: e.target.value})} className='form-control custom-select' name="" id="">
                                        <option selected disabled>Kategori</option>
                                        <option value="">All</option>
                                        <option value="Distortion">Distortion</option>
                                        <option value="Dynamics">Dynamics</option>
                                        <option value="Filter">Filter</option>
                                        <option value="Modulation">Modulation</option>
                                        <option value="Pitch">Pitch</option>
                                        <option value="Time">Time</option>
                                        <option value="Preamp">Preamp/Cabsim</option>
                                        <option value="Multi Effect">Multi Effect</option>
                                        <option value="Bass FX">Bass FX</option>
                                    </select>  
                                </div>
                                <div className='col-3 card-title' style={{left:'12%'}}>
                                    <button onClick={this.onFilterClick} className='ui inverted basic dimdom3 button btn-block'>Cari</button>    
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-11 mx-auto mt-3'>
                        {this.renderList()}
                    </div>
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
        key_words : state.auth.keywords
    }
}

export default connect(mapStateToProps,{clickSeller})(Search)