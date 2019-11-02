import React, { Component } from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import axios from 'axios'

import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'


const urlApi = 'http://localhost:7777/auth/'

class OtherProfile extends Component {

    state = {
        otherProfile: [],
        transactionSell: [],
        totalSold : 0,
        totalProduct : 0,
        dataSeller: []
    }

    componentDidMount(){
        this.getProfile()
        this.getOrdersData()
    }

    getProfile = () => {
        axios.get(urlApi+'getuserbyid',{
            params : {
                userid:  this.props.other_id
            }
        }).then(res=>{
            this.setState({ otherProfile: res.data[0] })
            console.log(res.data);
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
            console.log(res.data[0].qtyTerjual);
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

    otherProfile = () => {
        if(this.state.dataSeller){
            var { waktuLogout, totalPuas, totalFeedback } = this.state.dataSeller
            if(totalPuas && totalFeedback && waktuLogout){
                var pembeliPuas = (totalPuas/totalFeedback)*100
                var waktuTerakhir = '5 jam lalu'
            } else {
                var pembeliPuas = (totalPuas/totalFeedback)*100
            }
        } else {
            var { pembeliPuas, totalFeedback, waktuTerakhir } = ''
        }
        var { username, kabupaten, propinsi, tglDaftar, fotoProfil } = this.state.otherProfile;
        var tglll = new Date(`${this.state.otherProfile.tglDaftar}`).toLocaleDateString()
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
                    <div className='col-12 card-title pt-4 pb-1 pl-0 quic700p text-center'>
                        {username}
                    </div>  
                     <div className='col-12 card-title pb-1 pl-0 quic700 text-center'>
                        <p>{kabupaten}, {propinsi}</p>
                    </div> 
                </div>
                </div>
                <div className='dimdom-bottom'></div>
                <div className='card-title subjudul mt-4'>
                    Statistik Seller
                </div>
                <div className='row mt-5' style={{fontSize:'12pt'}}>
                    <div className='col text-right'><i className='child icon large'></i></div>
                    <div className='col-2 pl-0'>Pembeli Puas</div>
                    <div className='col-2'>{pembeliPuas}% Puas</div>
                    <div className='col text-right'><i className='thumbs up outline icon large'></i></div>
                    <div className='col-3 pl-0'>Jumlah Feedback</div>
                    <div className='col-2'>{totalFeedback}</div>
                </div>
                <div className='row mt-4' style={{fontSize:'12pt'}}>
                    <div className='col text-right'><i className='history icon large'></i></div>
                    <div className='col-2 pl-0'>Terakhir Online</div>
                    <div className='col-2'>{waktuTerakhir}</div>
                    <div className='col text-right'><i className='medkit icon large'></i></div>
                    <div className='col-3 pl-0'>Bergabung</div>
                    <div className='col-2'>{tglll}</div>
                </div>
                <div className='row mt-4' style={{fontSize:'12pt'}}>
                    <div className='col text-right'><i className='cube icon large'></i></div>
                    <div className='col-2 pl-0'>Total produk</div>
                    <div className='col-2'>{this.state.totalProduct}</div>
                    <div className='col text-right'><i className='money bill alternate outline icon large'></i></div>
                    <div className='col-3 pl-0'>Produk terjual</div>
                    <div className='col-2'>{this.state.totalSold}</div>
                </div>
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

