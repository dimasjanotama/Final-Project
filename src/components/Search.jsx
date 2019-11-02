import React, { Component } from 'react'
import {Link, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import { clickSeller } from '../actions'
import axios from 'axios'

import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'


const urlApi = 'http://localhost:7777/auth/'

class Search extends Component {

    state = {
        redirect: false,
        display : '',
        currentpage : '',
        products : [],
        namaProduk : '',
        kategori: '',
        subKategori: '',
        hargaMin: '',
        hargaMax: '',
        kondisi: '',
        qty: '',
        product: [],
        selectedId: '',
        toogle: '',
        orderQty: 0,
        pulauUser: '',
        user: [],
        idCart: ''
    }

    componentDidMount(){
        this.setState({
            display: 'group',
            currentpage: 1,
            namaProduk: this.props.key_words,
            toogle: ''
        })
        axios.get(urlApi+'getuserbyid' ,{
            params : {
                userid: this.props.user_id
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
        let {namaProduk, kategori, subKategori, kondisi} = this.state
        let hargamax = parseInt(this.state.hargaMax)
        let hargamin = parseInt(this.state.hargaMin)
        let userid = this.props.user_id
        // this.props.history.push(`/jc10?name=${name}`)
        // let feParams = querystring.parse(this.props.location.search)
        // console.log(feParams)
        if(userid){
            filterData = {...filterData,  userid}
        }
        if(namaProduk){
            filterData = {...filterData,  namaProduk}
        }
        if(hargamax && hargamin){
            filterData = {...filterData, hargamax, hargamin}
        }
        if(kategori){
            filterData = {...filterData, kategori}
        }
        if(subKategori){
            filterData = {...filterData, subKategori}
        }
        if(kondisi == 'baru' || kondisi == 'bekas'){
            filterData = {...filterData, kondisi}
        }
        axios.get(urlApi + 'countfilterproducts', {
            params: filterData
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
        let {namaProduk, kategori, subKategori, kondisi} = this.state
        let hargamax = parseInt(this.state.hargaMax)
        let hargamin = parseInt(this.state.hargaMin)
        let userid = this.props.user_id
        // this.props.history.push(`/jc10?name=${name}`)
        // let feParams = querystring.parse(this.props.location.search)
        // console.log(feParams)
        if(userid){
            filterData = {...filterData,  userid}
        }
        if(namaProduk){
            filterData = {...filterData, userid: userid, namaProduk}
        }
        if(hargamax && hargamin){
            filterData = {...filterData, hargamax, hargamin}
        }
        if(kategori){
            filterData = {...filterData, kategori}
        }
        if(subKategori){
            filterData = {...filterData, subKategori}
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
            params: filterData
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
        axios.get(urlApi + 'getproductsearch', {
            params: {
                userid: this.props.user_id,
                idproduct: idproduct
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
                    <div className='row align-items-center text-light mon500'>
                        <div className='col-11 mx-auto card'>
                            <div className='row'>
                                <div className='col-1 card-title pt-3 pb-1'>
                                    <i className='big info icon text-right' style={{color: 'rgb(255, 31, 210)'}}></i>
                                </div>
                                <div className='col-8 card-title pt-4 pb-1 pl-0 monalt900p text-left'>
                                    Hasil pencarian untuk '{this.state.namaProduk}'
                                </div>   
                            </div>
                        </div>
                    </div>
                    <div className='row ml-2 mr-2'>
                        {this.state.products.map((product)=>{
                            let {id, idUser, namaSeller, namaProduk, kategori, subKategori, berat, kondisi, deskripsi, fotoProduk, qty} = product
                            let harga = parseInt(product.harga)
                            // let numberWithCommas = (x) => {
                            //     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                            // }
                            // let harganya = numberWithCommas(harga)
                            if(id !== this.state.selectedId){
                                return (
                                    <div class="card ml-2 mr-2 mt-5" style={{width: "12rem"}}>
                                        <img class="card-img-top" src={`http://localhost:7777/files/${fotoProduk}`} alt="fotoproduk"/>
                                        <div className='row card-body p-0 pb-3'>
                                            <div className='col'>
                                                <button className='btn dimdom-pink mb-2 text-left' onClick={()=>{this.onDetailClick(id)}}>{namaProduk}</button>
                                            </div>
                                            <div class="w-100"></div>
                                            <i className='ml-3 col-2 pr-1 text-left user icon'></i>
                                            <p className='col pl-0 card-text'>
                                                <Link to='/otherprofile' onClick={()=>{this.props.clickSeller(idUser)}} className="dimdom-pink col mt-2">{namaSeller}</Link>
                                            </p>
                                            <div class="w-100"></div>
                                            <p className='col ml-3 card-text quic700' style={{fontSize:'14pt'}} >
                                                <span className='text-light'>Rp. {harga.toLocaleString('id')}</span>
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
                        <div className='mx-auto'>
                            <nav aria-label="Page navigation example">
                                <p className='text-center'>Page</p>
                                <ul class="pagination">
                                    {this.renderpagination()}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            )
        } else if(this.state.display == 'detail'){
            return (
            <div className='container'>
                    <div className='card col-10 mx-auto my-3 pb-3'>
                        <div className='col text-right mt-4 pr-1'>
                            <i className='times link icon' onClick={()=>this.setState({display: 'group'})}></i>
                        </div>
                        <div className='card-header mt-2'>
                            <h3><b>{this.state.product.namaProduk}</b></h3>
                        </div>
                        <div className='card-body pb-1'>
                            <div className='text-center'>
                            <img className='card-img-top mb-3' src={`http://localhost:7777/files/${this.state.product.fotoProduk}`} style={{width:'220px'}} alt=""/>
                            </div>
                            <h3><b>Description :</b></h3>
                            <p>{this.state.product.deskripsi}</p>
                            <h3><b>Harga :</b></h3>
                            <p>Rp. {this.state.product.harga.toLocaleString('id')}</p>
                            <h3><b>Quantity :</b></h3>
                            <p>{this.state.product.qty}</p>
                            <input onChange={(e) => this.setState({orderQty: e.target.value})} type="number" className='form-control' placeholder='Quantity'/>
                            <br/>
                            <button className='ui inverted basic dimdom3 button mb-1 btn-block' onClick={()=>{this.onClickAtc(this.state.product.id, this.state.product)}}>Add to Cart</button>
                        </div>
                    </div>
                </div>
            )
        } 
    }

    onClickAtc = (idProduct, product)=>{
        if(this.state.orderQty < 1 ){
            alert('Pembelian minimal 1')
        } else if (this.state.orderQty > parseInt(product.qty)){
            alert('Stok produk tidak mencukupi')
        } else if (this.state.orderQty > parseInt(product.qty)){
            alert('Stok produk tidak mencukupi')
        } else {
            this.cekQty(idProduct, product)
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
                    pulauSeller:this.state.product.pulauUser            
                }).then(res=>{
                    alert('Success! Berhasil menambah ke keranjang')
                    this.setState({redirect:true})
                }).catch(err=>{
                    console.log(err);
                })
            } else {
                axios.post(urlApi + 'addtocart',
                {
                    idProduct: idProduct,
                    idBuyer: this.props.user_id,
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
                        alert('Sukses! Berhasil ditambahkan ke keranjang')
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
                <div className='row dim-height text-light'> 
                    <div className='col-3 mt-3'>
                    <div className='card-nav p-3 dim-height-nav'>
                        <div className='card-title pt-2 pl-4'>
                            <div className='subjudul'>
                                Search / Filter
                            </div>
                            <div className='row'>
                                <div className='col card-title pt-5 mb-2 monalt900p'>Nama Produk</div>
                                <div class="w-100"></div>
                                <div class=" col ui input2 mr-3">
                                    <input onChange={(e) => this.setState({namaProduk: e.target.value})} type="text" placeholder="Nama Produk"/>
                                </div>
                                <div className='col card-title pt-3 mb-2 monalt900p'>Kategori</div>
                                <div class="w-100"></div>
                                <div class=" col ui input2 mr-3">
                                    <input onChange={(e) => this.setState({kategori: e.target.value})} type="text" placeholder="Kategori"/>
                                </div>
                                <div className='col card-title pt-3 mb-2 monalt900p'>Sub-Kategori</div>
                                <div class="w-100"></div>
                                <div class=" col ui input2 mr-3">
                                    <input onChange={(e) => this.setState({subKategori: e.target.value})} type="text" placeholder="Sub-Kategori"/>
                                </div>
                                <div className='col card-title pt-3 mb-2 monalt900p'>Harga</div>
                                <div class="w-100"></div>
                                <div class=" col-5 ui input2">
                                    <input onChange={(e) => this.setState({hargaMin: e.target.value})} type="text" placeholder="Min"/>
                                </div>
                                <div class=" col-5 ui input2">
                                    <input onChange={(e) => this.setState({hargaMax: e.target.value})} type="text" placeholder="Max"/>
                                </div>                       
                                <div className='col card-title pt-3 mb-2 monalt900p'>Kondisi</div>
                                <div class="w-100"></div>
                                <div class="col ui input2 mr-3">
                                    <select className='form-control' onChange={(e) => this.setState({kondisi: e.target.value})} name="" id="">
                                        <option selected disabled>Kondisi Barang</option>
                                        <option value="baru">Baru</option>
                                        <option value="bekas">Bekas</option>
                                    </select>
                                </div>
                                <div class="w-100"></div>
                                <div className='col card-title pt-5 mr-3'>
                                    <button onClick={this.onFilterClick} className='ui inverted basic dimdom3 button btn-block'>Filter</button>    
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
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
        key_words : state.auth.keywords
    }
}

export default connect(mapStateToProps,{clickSeller})(Search)