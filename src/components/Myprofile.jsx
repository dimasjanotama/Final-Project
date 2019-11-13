import React, { Component } from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import axios from 'axios'
import alertify from 'alertifyjs'
import {Line} from 'react-chartjs-2'
import moment from 'moment'

import Navbar from './Navbar'
import Footer from './Footer'
var crypto = require('crypto')


const urlApi = 'http://localhost:7777/auth/'

class Myprofile extends Component {

    state = {
        loadingProfile: true,
        loadingDashboard: true,
        sellChart: [],
        buyChart: [],
        profile: [],
        dataSeller: [],
        totalSell: '',
        totalBuy: '',
        totalProdukTerjual: '',
        totalProdukDijual: '',
        produkTerlaris: '',
        totalTransaksiBeli: '',
        toogle: '',
        error: '',
        success: '',
        username: '',
        email: '',
        namaDepan: '',
        namaBelakang: '',
        noTelp : '',
        alamat: '',
        kelurahan: '',
        kecamatan: '',
        kabupaten: '',
        propinsi: '',
        kodepos: '',
        pulau: '',
        newPassword: '',
        repeatNewPassword: '',
        selectedFile: ''
    }

    componentDidMount(){
        this.setState({toogle: 'profile'})
        this.getProfile()
    }

    getProfile = () => {
        axios.get(urlApi+'getuserbyid',{
            params : {
                userid:  this.props.user_id
            }
        }).then(res=>{
            this.setState({ profile: res.data[0] })
            axios.get(urlApi+'getdataseller',{
                params : {
                    idSeller:  this.props.user_id
                }
            }).then(res=>{
                if(res.data[0]){
                    this.setState({ dataSeller: res.data[0]})
                }
                this.setState({loadingProfile: false})
                this.getStats()
            }).catch(err=>{
                console.log(err);
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    getStats = ()=>{
        axios.get(urlApi+'totaltransactionbuy',{
            params: {
                userId: this.props.user_id
            }
        }).then(res=>{
            console.log('line 88');
            if(res.data[0].totalTransaksi){
                this.setState({totalTransaksiBeli: res.data[0].totalTransaksi})
            } else {
                this.setState({totalTransaksiBeli: 0})
            }
            axios.get(urlApi+'totalproductnow',{
                params: {
                    userId: this.props.user_id
                }
            }).then(res=>{
                console.log('line 99');
                if(res.data[0].totalProduk){
                    this.setState({totalProdukDijual: res.data[0].totalProduk})
                } else {
                    this.setState({totalProdukDijual: 0})
                }
                axios.get(urlApi+'totalproductsold',{
                    params: {
                        userId: this.props.user_id
                    }
                }).then(res=>{
                    console.log('line 110');
                    if(res.data[0].totalProduk){
                        this.setState({totalProdukTerjual: res.data[0].totalProduk})
                    } else {
                        this.setState({totalProdukTerjual: 0})
                    }
                    axios.get(urlApi+'mostwantedproduct',{
                        params: {
                            userId: this.props.user_id
                        }
                    }).then(res=>{
                        console.log('line 121');
                        if(res.data[0]){
                        this.setState({produkTerlaris: res.data[0].namaProduk})
                        } else {
                            this.setState({produkTerlaris: 'Belum ada'})
                        }
                        this.getChart()
                    }).catch(err=>{
                        console.log(err);
                    })
                }).catch(err=>{
                    console.log(err);
                })
            }).catch(err=>{
                console.log(err);
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    getChart = () => {
        axios.get(urlApi+'getsellchart',{
            params: {
                idSeller: this.props.user_id
            }
        }).then(res=>{
            console.log('line 148');
            if(res.data){
            this.setState({sellChart: res.data})
            }
            axios.get(urlApi+'getbuychart',{
                params: {
                    idBuyer: this.props.user_id
                }
            }).then(res=>{
                console.log('line 155');
                this.setState({buyChart: res.data})
                axios.get(urlApi+'gettotalsell',{
                    params: {
                        idSeller: this.props.user_id
                    }
                }).then(res=>{
                    console.log('line 162');
                    this.setState({totalSell: res.data[0].totalSell})
                    axios.get(urlApi+'gettotalbuy',{
                        params: {
                            idBuyer: this.props.user_id
                        }
                    }).then(res=>{
                        this.setState({totalBuy: res.data[0].totalBuy, loadingDashboard:false})
                    }).catch(err=>{
                        console.log(err);
                    })
                }).catch(err=>{
                    console.log(err);
                })
            }).catch(err=>{
                console.log(err);
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    displayfilename = ()=>{
        if (this.state.selectedFile) {
            return (
                <div className='mt-0'>
                    {this.state.selectedFile.name}
                </div>
            )
        } else {
            return null
        }
    }

    renderPic = () => {
        if(this.state.profile.fotoProfil){
            return (
                <div className='row text-center'> 
                    <img className="rounded-circle mx-auto" style={{width:'200px'}} src={require('../lib/pictures/user.jpg')}></img>
                </div>
            )
        } else {
            return (
                <div className='row text-center'> 
                    <img className="rounded-circle mx-auto" style={{width:'200px'}} src={require('../lib/pictures/user.jpg')}></img>
                </div>
            )
        }
    }

    updateFoto = ()=>{
        var fd = new FormData()
        var data = this.props.user_id
        fd.append('anehfoto', this.state.selectedFile, this.state.selectedFile.name)
        fd.append('data', data)
        axios.post(urlApi+'updatefoto', fd)
        .then(res=>{
            alertify.alert('Keterangan', 'Sukses! Berhasil ubah foto profil')
            this.getProfile()
            this.setState({selectedFile: ''})
        }).catch(err=>{
            console.log(err)
        })
    }

    profile = () => {
        if(this.state.loadingProfile==false){
        var { username, email, namaDepan, namaBelakang, noTelp, alamat, kelurahan, kecamatan, kabupaten, propinsi, tglDaftar, fotoProfil } = this.state.profile
        var tglGabung = tglDaftar
        return (
            <div>
                <div className='col-11 cardgrey ml-5 mr-4 mt-4 mb-4 pt-4 pb-4 pr-3 pl-5 text-dark' style={{fontSize:'16pt'}}>
                    Profil
                </div>
                 <div className='row text-light'>
                 <div class="w-100"></div> 
                 <div className='col-10 mx-auto'>
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
                        <div className='col pt-4 ml-2'>
                            <input type='button' onClick={() => this.refs.fileBtn2.click()} className='ui inverted basic small button' value='Unggah foto profile'/>
                            <input type='button' onClick={this.updateFoto} className='ui inverted basic small button' value='Submit'/>
                            <input type="file" ref='fileBtn2' onChange={(e) => this.setState({selectedFile : e.target.files[0]})} className='d-none'/>
                        </div>
                        <div class="w-100"></div>  
                        <div className='col card-title'>
                            {this.displayfilename()}
                        </div>
                        <div class="w-100"></div> 
                        <div className='pt-3'></div> 
                    </div>
                    <div className='ml-4 p-5 col-7 cardwhite quic700'>
                        <div className='row card-title pb-1 pl-0'>
                            <div className='col'>
                                <p><span className='badge badge-grey' style={{fontSize:'10pt'}}>Nama Lengkap</span></p>
                                <p className='mt-n3 ml-4' style={{fontSize:'15pt'}}>{namaDepan} {namaBelakang}</p>
                                <p className='mt-n3'><span className='badge badge-grey' style={{fontSize:'10pt'}}>Email</span></p>
                                <p className='mt-n3 ml-4' style={{fontSize:'15pt'}}>{email}</p>
                                <p className='mt-n3'><span className='badge badge-grey' style={{fontSize:'10pt'}}>No. Telepon</span></p>
                                <p className='mt-n3 ml-4' style={{fontSize:'15pt'}}>{noTelp}</p>
                                <p className='mt-n3'><span className='badge badge-grey' style={{fontSize:'10pt'}}>Alamat Lengkap</span></p>
                                <p className='mt-n3 ml-4' style={{fontSize:'15pt'}}>{alamat}, {kelurahan}, {kecamatan}, {kabupaten}, {propinsi}</p>
                                <p className='mt-n3'><span className='badge badge-grey' style={{fontSize:'10pt'}}>Bergabung Sejak</span></p>
                                <p className='mt-n3 ml-4' style={{fontSize:'15pt'}}>{moment(tglGabung).format('LL')}</p>
                            </div>
                            <div className='col-2'>
                                <input type="button" onClick={()=>{this.setState({toogle: 'edit'})}} className='ui inverted basic small button' value='Edit'/>
                                </div> 
                        </div> 

                    </div>
                    </div>
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

    dashboard = () => {
        if(this.state.loadingDashboard==false){
            if(this.state.totalSell){
                var totSell = this.state.totalSell.toLocaleString('id')
            } else {
                var totSell = 0
            }
            if(this.state.totalBuy){
                var totBuy = this.state.totalBuy.toLocaleString('id')
            } else {
                var totBuy = 0
            }
        let bulanIni = (moment().format('M'))
        this.buy1 = 0
        this.buy2 = 0
        this.buy3 = 0
        this.buy4 = 0
        this.sell1 = 0
        this.sell2 = 0
        this.sell3 = 0
        this.sell4 = 0
        var chartBulan = []
        if (bulanIni==1){
            var chartBulan = ['OKT','NOV','DES','JAN']   
        } else if(bulanIni==2){
            var chartBulan = ['NOV','DES','JAN','FEB']  
        } else if(bulanIni==3){
            var chartBulan = ['DES','JAN','FEB','MAR']  
        } else if(bulanIni==4){
            var chartBulan = ['JAN','FEB','MAR','APR']  
        } else if(bulanIni==5){
            var chartBulan = ['FEB','MAR','APR','MEI']  
        } else if(bulanIni==6){
            var chartBulan = ['MAR','APR','MEI','JUN']  
        } else if(bulanIni==7){
            var chartBulan = ['APR','MEI','JUN','JUL']  
        } else if(bulanIni==8){
            var chartBulan = ['MEI','JUN','JUL','AGS']  
        } else if(bulanIni==9){
            var chartBulan = ['JUN','JUL','AGS','SEP']  
        } else if(bulanIni==10){
            var chartBulan = ['JUL','AGS','SEP','OKT']  
        } else if(bulanIni==11){
            var chartBulan = ['AGS','SEP','OKT','NOV']
            this.state.sellChart.map((perbulan)=>{
                if(perbulan.bulan==8){
                    this.sell1 = perbulan.totalPenjualan
                } else if (perbulan.bulan==9){
                    this.sell2 = perbulan.totalPenjualan
                } else if (perbulan.bulan==10){
                    this.sell3 = perbulan.totalPenjualan
                } else if (perbulan.bulan==11){
                    this.sell4 = perbulan.totalPenjualan
                } else {}
            })  
            this.state.buyChart.map((perbulan)=>{
                if(perbulan.bulan==8){
                    this.buy1 = perbulan.totalPembelian
                } else if (perbulan.bulan==9){
                    this.buy2 = perbulan.totalPembelian
                } else if (perbulan.bulan==10){
                    this.buy3 = perbulan.totalPembelian
                } else if (perbulan.bulan==11){
                    this.buy4 = perbulan.totalPembelian
                } else {}
            }) 
        } else if(bulanIni==12){
            var chartBulan = ['SEP','OKT','NOV','DES']  
        }
        var pembeliPuas = 0
        var totalFeedback = 0
        var totalTransaksi = 0
        if(!totalPuas && !totalFeedback && !totalTransaksi && !terlaris){   
        } else {
            var pembeliPuas = (totalPuas/totalFeedback)*100
            var { totalPuas, totalFeedback, totalTransaksi } = this.state.dataSeller        
            var terlaris = this.state.produkTerlaris
        }
        return (
            <div>
                <div className='col-11 cardgrey ml-5 mr-4 mt-4 pt-4 pb-4 pr-3 pl-5 text-dark' style={{fontSize:'16pt'}}>
                    Statistik
                </div>
                <div className='row'>
                <div className='col-11 mx-auto'>
                <div className='row pt-4 pb-5 pl-3 pr-3 text-light justify-content-center'>
                    <div className='col cardblue mr-4'>
                        <div className='mt-3' style={{fontSize:'10pt', color:'rgb(255, 92, 222)'}}>Total Penjualan</div>
                        <div className='mt-2 pb-3' style={{fontSize:'19pt'}}>{totSell} IDR</div>
                        <div className='chart mt-3 mb-3' >
                            <Line
                                data={{
                                    labels : [chartBulan[0], chartBulan[1], chartBulan[2], chartBulan[3]],
                                    datasets : [{
                                        label: 'Total penjualan',
                                        data: [
                                            this.sell1,
                                            this.sell2,
                                            this.sell3,
                                            this.sell4
                                        ],
                                        backgroundColor:'transparent',
                                        borderWidth:3,
                                        borderColor: 'rgb(255, 92, 222)',
                                        pointBackgroundColor: 'rgb(255, 92, 222)',
                                        pointHoverBorderWidth: 10
                                    }]
                                }}
                                options={{
                                    legend : {
                                        display: true,
                                        position: 'right',
                                        labels: {
                                            fontFamily: 'Quicksand',
                                            fontColor: 'rgb(192,192,192)'
                                        }
                                    },
                                    scales: {
                                        yAxes: [{
                                            ticks: {
                                                beginAtZero:true,
                                                fontFamily: 'Quicksand',
                                                fontColor: 'rgb(192,192,192)'
                                            },
                                        }],
                                      xAxes: [{
                                            ticks: {
                                                fontFamily: 'Quicksand',
                                                fontColor: 'rgb(224, 224, 224)'
                                            },
                                        }]
                                    }
                                }}
                                />
                        </div>
                    </div>
                <div className='col cardblue text-right'>
                    <div className='mt-3' style={{fontSize:'10pt', color:'rgb(91, 226, 215)'}}>Total Pembelian</div>
                        <div className='mt-2 pb-3' style={{fontSize:'19pt'}}>{totBuy} IDR</div>
                        <div className='chart mt-3 mb-3' >
                            <Line
                                data={{
                                    labels : [chartBulan[0], chartBulan[1], chartBulan[2], chartBulan[3]],
                                    datasets : [{
                                        label: 'Total pembelian',
                                        data: [
                                            this.buy1,
                                            this.buy2,
                                            this.buy3,
                                            this.buy4
                                        ],
                                        backgroundColor:'transparent',
                                        borderWidth:3,
                                        borderColor: 'rgb(91, 226, 215)',
                                        pointBackgroundColor: 'rgb(91, 226, 215)',
                                        pointHoverBorderWidth: 10
                                    }]
                                }}
                                options={{
                                    legend : {
                                        display: true,
                                        position: 'left',
                                        labels: {
                                            fontFamily: 'Quicksand',
                                            fontColor: 'rgb(192,192,192)'
                                        }
                                    },
                                    scales: {
                                        yAxes: [{
                                            ticks: {
                                                beginAtZero:true,
                                                fontFamily: 'Quicksand',
                                                fontColor: 'rgb(192,192,192)'
                                            },
                                        }],
                                      xAxes: [{
                                            ticks: {
                                                fontFamily: 'Quicksand',
                                                fontColor: 'rgb(224, 224, 224)'
                                            },
                                        }]
                                    }
                                }}
                                />
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                <div className='col-11 cardgrey ml-5 mr-4 pt-4 pb-4 pr-3 pl-5 text-dark' style={{fontSize:'16pt'}}>
                    Penjualan
                </div>
                <div className='row justify-content-center'>
                <div className='col-9 mb-5'>
                    <div className='row mt-5 justify-content-between'>
                        <div className='col-3 pb-5 cardwhite text-center'>
                            <div><i className='big child icon mt-5 mb-4'></i></div>
                            <div className='w-100'></div>
                            <div className='quic700p' style={{fontSize:'30pt'}}>{pembeliPuas}%</div>
                            <div className='w-100'></div>
                            <div className='mt-4'>Kepuasan Pembeli</div>
                        </div>
                        <div className='col-3 pb-5 cardwhite text-center'>
                            <div><i className='big thumbs up outline icon mt-5 mb-4'></i></div>
                            <div className='w-100'></div>
                            <div className='quic700p' style={{fontSize:'30pt'}}>{totalFeedback}</div>
                            <div className='w-100'></div>
                            <div className='mt-4'>Jumlah Feedback</div>
                        </div>
                        <div className='col-3 pb-5 cardwhite text-center'>
                            <div><i className='big medkit icon mt-5 mb-4'></i></div>
                            <div className='w-100'></div>
                            <div className='quic700p' style={{fontSize:'30pt'}}>{totalTransaksi}</div>
                            <div className='w-100'></div>
                            <div className='mt-4'>Total Transaksi</div>
                        </div>
                        <div className='w-100 mb-5'></div>
                        <div className='col-3 pb-5 cardwhite text-center'>
                            <div><i className='big cube icon mt-5 mb-4'></i></div>
                            <div className='w-100'></div>
                            <div className='quic700p' style={{fontSize:'30pt'}}>{this.state.totalProdukDijual}</div>
                            <div className='w-100'></div>
                            <div className='mt-4'>Produk Yang Dijual</div>
                        </div>
                        <div className='col-3 pb-5 cardwhite text-center'>
                            <div><i className='big money bill alternate outline icon mt-5 mb-4'></i></div>
                            <div className='w-100'></div>
                            <div className='quic700p' style={{fontSize:'30pt'}}>{this.state.totalProdukTerjual}</div>
                            <div className='w-100'></div>
                            <div className='mt-4'>Total Produk Terjual</div>
                        </div>
                        <div className='col-3 pb-5 cardwhite text-center'>
                            <div><i className='big heart outline icon mt-5 mb-4'></i></div>
                            <div className='w-100'></div>
                            <div className='quic700p' style={{fontSize:'18pt'}}>{this.state.produkTerlaris}</div>
                            <div className='w-100'></div>
                            <div className='mt-4'>Produk terlaris</div>
                        </div>
                    </div>
                </div>
                </div>
                <div className='col-11 cardgrey ml-5 mr-4 mt-4 pt-4 pb-4 pr-3 pl-5 text-dark' style={{fontSize:'16pt'}}>
                    Pembelian
                </div>
                <div className='row justify-content-center'>
                <div className='col-9 pb-5'>
                    <div className='row mt-5 justify-content-center'>
                        <div className='col-3 pb-5 cardwhite text-center'>
                            <div><i className='big medkit icon mt-5 mb-4'></i></div>
                            <div className='w-100'></div>
                            <div className='quic700p' style={{fontSize:'30pt'}}>{this.state.totalTransaksiBeli}</div>
                            <div className='w-100'></div>
                            <div className='mt-4'>Total Transaksi Pembelian</div>
                        </div>
                    </div>
                </div>
                </div>
                <div class="w-100"></div> 
                <div className='pt-3'></div> 
            </div>
            )
    } else {
        return(
            <div>
                <h1>Loading...</h1>
            </div>
        )
    }}

    onUpdateClick = ()=>{
        axios.get(urlApi + 'getuser',
            {
                params: {
                    username: this.state.username
                }
            }
        ).then((res)=>{
            // jika data ditemukan user berdasarkan email diketik
            if (this.state.newPassword !== this.state.repeatNewPassword){
                this.setState({loading: false, error: `Password yang ditulis ulang tidak sama`})
                setTimeout(
                    () => { this.setState({error: ''}) },
                    3000
                )
            } else if(res.data[0] && this.state.username!==this.props.user_name){
                this.setState({loading: false, error: `Username "${this.state.username}" sudah digunakan`})
                setTimeout(
                    () => { this.setState({error: ''}) },
                    3000
                )
            } else if(this.state.noTelp.length<10 || this.state.noTelp.length>12){
                this.setState({loading: false, error: `No HP minimal 10 digit dan maksimal 12 digit`})
                setTimeout(
                    () => { this.setState({error: ''}) },
                    3000
                )
            } else if(this.state.newPassword.length<3){
                console.log(this.state.newPassword);
                this.setState({loading: false, error: `Password minimal 3 karakter huruf/angka`})
                setTimeout(
                    () => { this.setState({error: ''})},
                    3000
                )
            } else if(this.state.username && this.state.email && this.state.newPassword && this.state.namaDepan &&
                this.state.namaBelakang && this.state.noTelp && this.state.alamat && this.state.kelurahan && this.state.kecamatan &&
                this.state.kabupaten && this.state.propinsi && this.state.kodepos && this.state.pulau && this.state.repeatNewPassword){
                    this.cekEmail()
            } else { 
                this.setState({loading: false, error: `Semua kolom harus diisi`})
                setTimeout(
                () => { this.setState({error: ''}) },
                3000
            )}
        })
    }

    cekEmail = ()=>{           
        axios.get(urlApi + 'getuser',
        {
            params: {
                email: this.state.email
            }
        }).then((res)=>{
            // jika data ditemukan user berdasarkan email diketik
            if(res.data[0] && this.state.email!==this.state.profile.email){
                this.setState({loading: false, error: `Email "${this.state.email}" sudah digunakan`})
                setTimeout(
                    () => { this.setState({error: ''}) },
                    3000
                )
            } else {
                this.updateUser()
            }
        })
    }

    updateUser = ()=>{
        function encryptMyPass (pw) { //algoritma  //punya kita
            let result = crypto.createHmac('sha256','fxpedia').update(pw).digest('hex')
            return result
        }
        let password = encryptMyPass(this.state.newPassword)
        axios.put(urlApi + 'updateprofile',
        {
            username: this.state.username,
            email: this.state.email,
            password: password,                     
            namaDepan: this.state.namaDepan,
            namaBelakang: this.state.namaBelakang,
            noTelp: this.state.noTelp,
            alamat: this.state.alamat,
            kelurahan: this.state.kelurahan,
            kecamatan: this.state.kecamatan,
            kabupaten: this.state.kabupaten,
            propinsi: this.state.propinsi,
            pulau: this.state.pulau,
            kodepos: this.state.kodepos,
            userId: this.props.user_id
        }).then(res=>{
            this.getProfile()
            alertify.alert('Keterangan', 'Sukses! Berhasil update profile')
            this.setState({toogle: 'profile'})
        }).catch(err=>{
            console.log(err);
        })
    }

    notification = ()=>{
        if(this.state.error){
            // notif error, danger
            return (
                <div className='alert alert-danger mt-4 mx-auto'>
                    {this.state.error}
                </div>
            )
        } else if (this.state.success){
            // notif success, success
            return (
                <div className='alert alert-success mt-4 mx-auto'>
                    {this.state.success}
                </div>
            )
        } else {
            return null
        }
    }

    renderList = () => {
        if(this.state.toogle==='profile'){
            return (
                <div className='row align-items-center quic700'>
                    <div className='col-11 mx-auto cardwhite pb-5'>
                        <div className='card-body'>
                            <div className='row card-title'>
                                <div className='col card-title text-right'>
                                    <div class="ui inverted basic dimdom3 buttons">
                                        <button onClick={()=>{this.setState({toogle: 'profile'})}} class="ui inverted basic dimdom3 button">Profile</button>
                                        <button onClick={()=>{this.setState({toogle: 'dashboard'})}} class="ui inverted basic dimdom3 button">Dashboard</button>
                                    </div>
                                </div>
                            </div>
                            {this.profile()}
                        </div>
                    </div>
                </div>
            ) 
    } else if (this.state.toogle==='dashboard'){
            return (
                <div className='row align-items-center quic700'>
                    <div className='col-11 mx-auto cardwhite'>
                        <div className='card-body'>
                            <div className='row card-title'>
                                <div className='col card-title text-right'>
                                    <div class="ui inverted basic dimdom3 buttons">
                                        <button onClick={()=>{this.setState({toogle: 'profile'})}} class="ui inverted basic dimdom3 button">Profile</button>
                                        <button onClick={()=>{this.setState({toogle: 'dashboard'})}} class="ui inverted basic dimdom3 button">Dashboard</button>
                                    </div>
                                </div>
                            </div>
                            {this.dashboard()}
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
            <div className='row align-items-center text-light quic700'>
                <div className='col-9 mx-auto card pl-5 pr-5 pb-4'>
                    <div className='col text-right mt-4 pr-1'>
                        <i className='times link icon text-light' onClick={()=>this.setState({toogle: 'profile'})}></i>
                    </div>
                    <div className='card-body'>
                        <div className='row cardwhite ml-3 mr-3 mb-4 pr-4 pl-4 justify-content-center'>
                            <div className='col-12 cardgrey ml-4 mr-4 mt-4 mb-4 pt-4 pb-4 pr-3 pl-5 text-dark' style={{fontSize:'16pt'}}>
                                Ubah Profil
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col card-title pt-4 mb-2'>Username</div>
                            <div className='col card-title pt-4 mb-2'>Email</div>
                            <div class="w-100"></div>
                            <div class=" col ui input2">
                                <input onChange={(e) => this.setState({username: e.target.value})} type="text" placeholder="Username"/>
                            </div>                 
                            <div class=" col ui input2">
                                <input onChange={(e) => this.setState({email: e.target.value})} type="email" placeholder="Email"/>
                            </div>                 
                        </div>
                        <div className='row'>
                            <div className='col-4 card-title pt-4 mb-2'>Nama Depan</div>
                            <div className='col-4 card-title pt-4 mb-2'>Nama Belakang</div>
                            <div className='col-4 card-title pt-4 mb-2'>No. HP</div>
                            <div class="w-100"></div>
                            <div class=" col-4 ui input2">
                                <input onChange={(e) => this.setState({namaDepan: e.target.value})} type="text" placeholder="Nama Depan"/>
                            </div>                 
                            <div class=" col-4 ui input2">
                                <input onChange={(e) => this.setState({namaBelakang: e.target.value})} type="text" placeholder="Nama Belakang"/>
                            </div>                 
                            <div class=" col-4 ui input2">
                            <input value={this.state.noTelp} 
                                onChange={(e) => {
                                    if (isNaN(e.target.value)){
                                        this.setState({noTelp: ''})
                                    } else {
                                        this.setState({noTelp:e.target.value})
                                    }}} type="text" placeholder="No HP"/>
                            </div>                 
                        </div>
                        <div className='row'>
                            <div className='col-9 card-title pt-4 mb-2'>Alamat</div>
                            <div className='col-3 card-title pt-4 mb-2'>Kelurahan</div>
                            <div class="w-100"></div>
                            <div class="col-9 ui input2">
                                <input onChange={(e) => this.setState({alamat: e.target.value})} type="text" placeholder="Alamat"/>
                            </div>
                            <div class="col-3 ui input2">
                                <input onChange={(e) => this.setState({kelurahan: e.target.value})} type="text" placeholder="Kelurahan"/>
                            </div>                                  
                        </div>
                        <div className='row'>
                            <div className='col card-title pt-4 mb-2'>Kecamatan</div>
                            <div className='col card-title pt-4 mb-2'>Kabupaten/Kota</div>
                            <div className='col card-title pt-4 mb-2'>Propinsi</div>
                            <div className='col card-title pt-4 mb-2'>Kodepos</div>
                            <div class="w-100"></div>
                            <div class="col-3 ui input2">
                                <input onChange={(e) => this.setState({kecamatan: e.target.value})} type="text" placeholder="Kecamatan"/>
                            </div>                 
                            <div class="col-3 ui input2">
                                <input onChange={(e) => this.setState({kabupaten: e.target.value})} type="text" placeholder="Kabupaten"/>
                            </div>    
                            <div class="col-3 ui input2">
                                <input onChange={(e) => this.setState({propinsi: e.target.value})} type="text" placeholder="Propinsi"/>
                            </div> 
                            <div class="col-3 ui input2">
                                <input value={this.state.kodepos} 
                                onChange={(e) => {
                                    if (isNaN(e.target.value)){
                                        this.setState({kodepos: ''})
                                    } else {
                                        this.setState({kodepos:e.target.value})
                                    }}} type="text" placeholder="Kodepos"/>
                            </div>              
                        </div>
                        <div className='row'>
                            <div className='col-2 card-title pt-4 mb-2'>Kepulauan</div>
                            <div className='col-5 card-title pt-4 mb-2'>Password Baru</div>
                            <div className='col-5 card-title pt-4 mb-2'>Tulis ulang Password Baru</div>
                            <div class="w-100"></div>
                            <div class=" col-2 ui input2">
                                <select onChange={(e)=>{this.setState({pulau: e.target.value})}} className='form-control2 custom-select' name="" id="">
                                    <option selected disabled>Pulau</option>
                                    <option value="Sumatera">Sumatera</option>
                                    <option value="Jawa">Jawa</option>
                                    <option value="Bali">Bali</option>
                                    <option value="NTB">NTB</option>
                                    <option value="NTT">NTT</option>
                                    <option value="Kalimantan">Kalimantan</option>
                                    <option value="Sulawesi">Sulawesi</option>
                                    <option value="Maluku">Maluku</option>
                                    <option value="Papua">Papua</option>
                                </select>  
                            </div>
                            <div class=" col-5 ui input2">
                                <input onChange={(e) => this.setState({newPassword: e.target.value})} type="password" placeholder="Tulis password untuk akun anda"/>
                            </div>
                            <div class=" col-5 ui input2">
                                <input onChange={(e) => this.setState({repeatNewPassword: e.target.value})} type="password" placeholder="Tulis ulang password anda"/>
                            </div>
                        </div>
                        <div class="w-100"></div>    
                        
                        <div className='row pt-5'>
                            <button onClick={this.onUpdateClick} className='col-4 mx-auto ui inverted basic dimdom3 button '>Update Profile</button>
                            <div class="w-100"></div>
                            {this.notification()}
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
                <div className='row  text-light'> 
                    <div className='col-11 mt-3 mx-auto'>
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

export default connect(mapStateToProps)(Myprofile)