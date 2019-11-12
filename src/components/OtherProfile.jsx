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
        otherProfile: [],
        transactionSell: [],
        totalSold : 0,
        totalProduct : 0,
        dataSeller: [],
        products: []
    }

    componentDidMount(){
        this.getProfile()
        this.getOrdersData()
        this.getProductsData()
    }

    getProfile = () => {
        axios.get(urlApi+'getuserbyid',{
            params : {
                userid:  this.props.other_id
            }
        }).then(res=>{
            this.setState({ otherProfile: res.data[0] })
            axios.get(urlApi+'getdataseller',{
                params : {
                    idSeller:  this.props.other_id
                }
            }).then(res=>{
                this.setState({ dataSeller: res.data[0]})
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
            this.setState({ totalSold: res.data[0].qtyTerjual })
            axios.get(urlApi+'gettotalproduct',{
                params : {
                    idSeller:  this.props.other_id
                }
            }).then(res=>{
                this.setState({totalProduct: res.data[0].totalProduct})
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
            this.setState({products: res.data})
        }).catch(err=>{
            console.log(err);
        })
    }

    otherProfile = () => {
        let tglDaftar = moment(this.state.otherProfile.tglDaftar).format('D MMMM YYYY')
        var { username, kabupaten, propinsi, fotoProfil } = this.state.otherProfile
        var { waktuLogout, totalPuas, totalFeedback, totalTransaksi } = this.state.dataSeller        
        if(!totalPuas && !totalFeedback && !totalTransaksi){
            var pembeliPuas = 0
            var totalFeedback = 0
            var totalTransaksi = 0
        } else {
            var pembeliPuas = (totalPuas/totalFeedback)*100
        }

        // let now = new Date().getTime()
        // let lastLogout = new Date(`${waktuLogout}`).getTime()
        // let t = now - lastLogout
        // let days = Math.floor(t / (1000 * 60 * 60 * 24))
        // let hours = Math.floor(t / (1000 * 60 * 60))
        // let minutes = Math.floor(t / (1000 * 60))
        // console.log(days);
        // console.log(hours);
        // console.log(minutes);
        // var keterangan = minutes+' manit yang lalu'
        // if(minutes>60 && hours<24){
        //     var keterangan = hours+' jam yang lalu'
        // } else if(minutes>60 && hours>24){
        //     var keterangan = days+' hari yang lalu'
        // }
        

        let keterangan = moment(waktuLogout).startOf('hour').fromNow()

        return (
            <div>
                <div className='card-title subjudul'>
                    Profil
                </div>
                 <div className='row card-title pt-4'>
                 <div class="w-100"></div> 
                 <div className='dimdom-bottom'></div>
                 <div className='row text-center w-100'>
                    <div className='col-12'>
                        <img className="rounded-circle" style={{width:'200px'}} 
                        src={fotoProfil ? `http://localhost:7777/files/${fotoProfil}` : require('../lib/pictures/user.jpg')}></img>
                    </div>
                    <div className='col-12 card-title pt-2 pb-1 quic700p text-center'>
                        {username}
                    </div>  
                     <div className='col-12 card-title quic700 text-center'>
                        <p>{kabupaten}, {propinsi}</p>
                    </div> 
                </div>
                </div>
                <div className='card-title subjudul mt-2'>
                    Statistik Seller
                </div>
                <div className='dimdom-bottom'></div>
                <div className='row mt-3' style={{fontSize:'12pt'}}>
                    <div className='col text-right'><i className='child icon large'></i></div>
                    <div className='col-2 pl-0'>Pembeli Puas</div>
                    <div className='col-2'>{pembeliPuas}% Puas</div>
                    <div className='col text-right'><i className='thumbs up outline icon large'></i></div>
                    <div className='col-2 pl-0'>Jumlah Feedback</div>
                    <div className='col-3'>{totalFeedback}</div>
                </div>
                <div className='row mt-2' style={{fontSize:'12pt'}}>
                    <div className='col text-right'><i className='history icon large'></i></div>
                    <div className='col-2 pl-0'>Terakhir Online</div>
                    <div className='col-2'>{keterangan}</div>
                    <div className='col text-right'><i className='medkit icon large'></i></div>
                    <div className='col-2 pl-0'>Bergabung</div>
                    <div className='col-3'>{tglDaftar}</div>
                </div>
                <div className='row mt-2' style={{fontSize:'12pt'}}>
                    <div className='col text-right'><i className='cube icon large'></i></div>
                    <div className='col-2 pl-0'>Total produk</div>
                    <div className='col-2'>{this.state.totalProduct}</div>
                    <div className='col text-right'><i className='money bill alternate outline icon large'></i></div>
                    <div className='col-2 pl-0'>Produk terjual</div>
                    <div className='col-3'>{totalTransaksi}</div>
                </div>
                <div className='pt-5'></div>
                <div className='card-title subjudul mt-2'>
                    Produk terbaru dari {username}
                </div>
                <div className='dimdom-bottom'></div>
            </div>
        )
    }

    newestProducts = () => {
        return (
        <div className='row ml-2 mr-2 mt-3 mb-5'>
            {this.state.products.map((product)=>{
                let {id, namaProduk, harga, fotoProduk} = product
                    let numberWithCommas = (x) => {
                        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    }
                    let harganya = numberWithCommas(harga)
                    return (
                        <div class="cardproduct ml-2 mr-2" style={{width: "12rem"}}>
                            <img src={`http://localhost:7777/files/${fotoProduk}`} class="card-img-top" alt="fotoproduk"/>
                            <div class="card-body">
                                <p className='mb-2 text-left'>{namaProduk}</p>
                                <p className='card-text text-center quic700' style={{fontSize:'14pt'}} >
                                    <span className='text-light'>Rp. {harganya}</span>
                                </p>
                            </div>
                        </div>
                    ) 
            })}
        </div>
        )
    }

    renderList = () => {
        return (
            <div className='row align-items-center text-light quic700'>
                <div className='col-11 mx-auto card'>
                    <div className='card-body'>
                        <div className='row card-title'>
                            <div className='col card-title text-right'>
                            </div>
                        </div>
                        {this.otherProfile()}
                        {this.newestProducts()}
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

export default connect(mapStateToProps)(OtherProfile)

