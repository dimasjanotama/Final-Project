import React, { Component } from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/id'


import Navbar from './Navbar'
import Footer from './Footer'


moment.locale('id');

const urlApi = 'http://localhost:7777/auth/'

class OtherProfile extends Component {

    state = {
        loading: true,
        otherProfile: [],
        transactionSell: [],
        totalSold : 0,
        totalProduct : 0,
        dataSeller: [],
        products: [],
        pembeliPuas: 0,
        totalFeedback: 0,
        totalTransaksi: 0
    }

    componentDidMount(){
        this.getProfile()
    }

    getProfile = () => {
        axios.get(urlApi+'getuserbyid',{
            params : {
                userid:  this.props.other_id
            }
        }).then(res=>{
            console.log('line 40');
            this.setState({ otherProfile: res.data[0] })
            axios.get(urlApi+'getdataseller',{
                params : {
                    idSeller:  this.props.other_id
                }
            }).then(res=>{
                console.log('line 47');
                if(res.data[0]){
                    if(res.data[0].totalFeedback==0){
                        this.setState({ 
                            dataSeller: res.data[0],
                            pembeliPuas: 0,
                            totalFeedback: res.data[0].totalFeedback,
                            totalTransaksi: res.data[0].totalTransaksi
                        })
                    } else { 
                        this.setState({ 
                            dataSeller: res.data[0],
                            pembeliPuas: (res.data[0].totalPuas/res.data[0].totalFeedback)*100,
                            totalFeedback: res.data[0].totalFeedback,
                            totalTransaksi: res.data[0].totalTransaksi
                        })
                    }
                }
                this.getOrdersData()
            }).catch(err=>{
                console.log(err);
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    getOrdersData = () => {
        axios.get(urlApi+'getproductsold',{
            params : {
                idSeller:  this.props.user_id
            }
        }).then(res=>{
            console.log('line 64');
            this.setState({ totalSold: res.data[0].qtyTerjual })
            axios.get(urlApi+'gettotalproduct',{
                params : {
                    idSeller:  this.props.other_id
                }
            }).then(res=>{
                console.log('line 71');
                this.setState({totalProduct: res.data[0].totalProduct})
                this.getProductsData()
            }).catch(err=>{
                console.log(err);
            })
        })
        .catch(err=>{
            console.log(err);
        })
    }

    getProductsData = () => {
        axios.get(urlApi+'getnewestproduct',{
            params : {
                userId: this.props.other_id
            }
        }).then(res=>{
            console.log('line 89');
            this.setState({products: res.data, loading: false})
        }).catch(err=>{
            console.log(err);
        })
    }

    otherProfile = () => {
        let tglDaftar = moment(this.state.otherProfile.tglDaftar).format('D MMMM YYYY')
        var { username, kabupaten, propinsi, fotoProfil } = this.state.otherProfile
        if(!totalPuas && !totalFeedback && !totalTransaksi){
        } else {
            var pembeliPuas = (totalPuas/totalFeedback)*100
            var { waktuLogout, totalPuas, totalFeedback, totalTransaksi } = this.state.dataSeller        
        }
        let keterangan = moment(waktuLogout).startOf('hour').fromNow()

        return (
            <div>
                <div className='col-11 cardgrey ml-5 mr-4 mt-4 mb-4 pt-4 pb-4 pr-3 pl-5 text-dark' style={{fontSize:'16pt'}}>
                    Profil Penjual
                </div>
                 <div className='row text-light'>
                 <div class="w-100"></div> 
                    <div className='col-11 mx-auto'>
                        <div className='row'>    
                            <div className='col-4'>
                                <div className='card pb-3'>
                                <div className='row mt-5 text-center'> 
                                    <img className="rounded-circle mx-auto"  style={{width:'200px'}} 
                                    src={fotoProfil ? `http://localhost:7777/files/${fotoProfil}` : require('../lib/pictures/user.jpg')}></img>
                                </div>
                                <div className='row card-title pt-4 pl-0 quic700p text-center'>
                                    <div className='col'>
                                        {username}
                                    </div>
                                </div>
                                <div className='row card-title pb-1 pl-0 text-center'>
                                    <div className='col'>
                                        <p>{kabupaten}, {propinsi}</p>
                                    </div>
                                </div> 
                                </div>
                                <div class="w-100"></div> 
                                <div className='pt-3'></div> 
                            </div>
                            <div className='col-8 pl-5 quic700'>
                                <div className='row justify-content-center'>
                                    <div className='col-3 pb-5 mr-3 cardwhite text-center'>
                                        <div><i className='big child icon mt-5 mb-4'></i></div>
                                        <div className='w-100'></div>
                                        <div style={{fontSize:'30pt'}}>{this.state.pembeliPuas}%</div>
                                        <div className='w-100'></div>
                                        <div className='mt-4'>Kepuasan Pembeli</div>
                                    </div>
                                    <div className='col-3 pb-5 mr-3 cardwhite text-center'>
                                        <div><i className='big thumbs up outline icon mt-5 mb-4'></i></div>
                                        <div className='w-100'></div>
                                        <div style={{fontSize:'30pt'}}>{this.state.totalFeedback}</div>
                                        <div className='w-100'></div>
                                        <div className='mt-4'>Jumlah Feedback</div>
                                    </div>
                                    <div className='col-3 pb-5 cardwhite text-center'>
                                        <div><i className='big history icon mt-5 mb-4'></i></div>
                                        <div className='w-100'></div>
                                        <div style={{fontSize:'16pt'}}>{keterangan}</div>
                                        <div className='w-100'></div>
                                        <div className='mt-4'>Terakhir Online</div>
                                    </div>
                                    <div className='w-100 mb-3'></div>
                                    <div className='col-3 pb-5 mr-3 cardwhite text-center'>
                                        <div><i className='big cube icon mt-5 mb-4'></i></div>
                                        <div className='w-100'></div>
                                        <div style={{fontSize:'30pt'}}>{this.state.totalProduct}</div>
                                        <div className='w-100'></div>
                                        <div className='mt-4'>Total produk</div>
                                    </div>
                                    <div className='col-3 pb-5 mr-3 cardwhite text-center'>
                                        <div><i className='big money bill alternate outline icon mt-5 mb-4'></i></div>
                                        <div className='w-100'></div>
                                        <div style={{fontSize:'30pt'}}>{this.state.totalTransaksi}</div>
                                        <div className='w-100'></div>
                                        <div className='mt-4'>Produk terjual</div>
                                    </div>
                                    <div className='col-3 pb-5 cardwhite text-center'>
                                        <div><i className='big medkit icon mt-5 mb-4'></i></div>
                                        <div className='w-100'></div>
                                        <div style={{fontSize:'16pt'}}>{tglDaftar}</div>
                                        <div className='w-100'></div>
                                        <div className='mt-4'>Bergabung</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-11 cardgrey ml-5 mr-4 mt-4 mb-4 pt-4 pb-4 pr-3 pl-5 text-dark' style={{fontSize:'16pt'}}>
                    Produk terbaru dari {username}
                </div>
            </div>
        )
    }

    newestProducts = () => {
        return (
        <div className='col-11 mx-auto'>
            <div className='row'>
            {this.state.products.map((product)=>{
                let {id, namaProduk, harga, fotoProduk, kategori, kondisi} = product
                    return (
                        <div className="cardwhite ml-2 mr-2" style={{width: "12rem"}}>
                            <img src={`http://localhost:7777/files/${fotoProduk}`} class="card-img-top" alt="fotoproduk"/>
                            <div class="row card-body p-0 pb-3">
                                <div className='col text-center'>{namaProduk}</div>
                                <div class="w-100"></div>
                                <div className='col ml-3'>
                                    <span className='badge badge-grey mb-2'>{kategori}</span>
                                    <span className='ml-2 mb-2 badge badge-primary'>{kondisi}</span>
                                </div>
                                <div class="w-100"></div>
                                <div className='col card-text ml-3 quic700' style={{fontSize:'16pt'}}>
                                    <span className='badge badge-grey'>Rp. {harga.toLocaleString('id')}</span>
                                </div>
                            </div>
                        </div>
                    ) 
            })}
            </div>
        </div>
        )
    }

    renderList = () => {
        if(this.state.loading==false){
        return (
            <div className='row align-items-center quic700'>
                <div className='col-11 mx-auto cardwhite pb-4'>
                    <div className='card-body'>
                        {this.otherProfile()}
                        {this.newestProducts()}
                    </div>
                </div>
            </div>
        )
        } else {
            return (
                <div>
                    <h1>Loading...</h1>
                </div>
            )
        }
    }

    render() {
        if(this.props.user_name && this.props.user_name!=='Admin'){
        return(   
            <AbsoluteWrapper>
                <Navbar/>
                <div className='row'> 
                    <div className='col-11 mt-3 mx-auto'>
                        {this.renderList()}
                    </div>
                </div>
                <Footer />
            </AbsoluteWrapper>
        )
        } else if (this.props.user_name && this.props.user_name=='Admin'){
            return <Redirect to='/verifier'/>
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

export default connect(mapStateToProps)(OtherProfile)

