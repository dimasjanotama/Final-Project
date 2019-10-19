import React, { Component } from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import axios from 'axios'

import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'


const urlApi = 'http://localhost:7777/auth/'

class Search extends Component {

    state = {
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
        toogle: ''
    }

    componentDidMount(){
        this.setState({
            display: 'group',
            currentpage: 1,
            namaProduk: this.props.key_words,
            toogle: ''
        })
        this.onFilterClick()
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
                            let {id, namaProduk, kategori, subKategori, berat, kondisi, deskripsi, fotoProduk, qty} = product
                            let harga = parseInt(product.harga)
                            // let numberWithCommas = (x) => {
                            //     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                            // }
                            // let harganya = numberWithCommas(harga)
                            if(id !== this.state.selectedId){
                                return (
                                    <div className='mt-3 ml-2 mr-2 mb-4 col-2 card' >
                                        <button className='btn mt-3 ml-n2' onClick={()=>{this.onDetailClick(id)}}>
                                            <img style={{width: '120px'}} src={`http://localhost:7777/files/${fotoProduk}`} alt="fotoproduk"/>
                                        </button>
                                        <div className='card-body p-0 pb-3'>
                                            <button className='btn dimdom-pink mb-2' onClick={()=>{this.onDetailClick(id)}}>{namaProduk}</button>
                                            <p className='card-text text-center'>Rp. {harga.toLocaleString('id')}</p>
                                            <p className='card-text text-center'>Quantity : {qty}</p>
                                            <button className='ui inverted basic dimdom3 button mb-1 btn-block' onClick={()=>{this.onClickBeli(id, product)}}>Beli</button>
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
                                            <p className='card-text text-center'>Quantity : {qty}</p>
                                            <input type="number" className='form-control' placeholder='Quantity'/>
                                            <br/>
                                            <button className='ui inverted basic dimdom3 button mb-1 btn-block' onClick={()=>{this.onClickAtc(id, product)}}>Add to Cart</button>
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
                            <img className='card-img-top mb-3' src={`http://localhost:7777/files/${this.state.product.fotoProduk}`} style={{width:'300px'}} alt=""/>
                            </div>
                            <h3><b>Description :</b></h3>
                            <p>{this.state.product.deskripsi}</p>
                            <h3><b>Harga :</b></h3>
                            <p>Rp. {this.state.product.harga.toLocaleString('id')}</p>
                            <h3><b>Quantity :</b></h3>
                            <p>{this.state.product.qty}</p>
                        </div>
                    </div>
                </div>
            )
        } 
    }

    onClickBeli = (idProduct, product) => {
        this.setState(
            {
                selectedId: idProduct,
                selectedProductQty: product.qty,
            })
    }

    render() {
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

export default connect(mapStateToProps)(Search)