import React, { Component } from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import {Line, Bar, Pie} from 'react-chartjs-2'
import axios from 'axios'
import Navbar from './Navbar'

const moment = require('moment')



const urlApi = 'http://localhost:7777/auth/'

class DashboardAdmin extends Component {

    state = {
        transactions : [], 
        transactions2 : [], 
        transactions3 : [], 
        loading: true,
        toogle: 'pembayaran'
    }

    componentDidMount(){
        this.getTransaction()
        this.getTransaction2()
        this.getTransaction3()
    }

    getTransaction = () => {
        axios.get(urlApi+'getunpaidverification')
        .then(res=>{
            this.setState({
                transactions: res.data,
                loading: false
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    getTransaction2 = () => {
        axios.get(urlApi+'getshippingverification')
        .then(res=>{
            this.setState({
                transactions2: res.data,
                loading: false
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    getTransaction3 = () => {
        axios.get(urlApi+'getalltransactions')
        .then(res=>{
            this.setState({
                transactions3: res.data,
                loading: false
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    addHistory = (transaction)=>{
        let tglTerima = `${transaction.tglPenerimaan}`
        var terima = tglTerima.substr(0,10)
        
    }

    renderList = () => {
        var { waktuLogin, waktuLogout, totalPuas, totalFeedback, totalTransaksi } = 0    
        var pembeliPuas = (parseInt(totalPuas)/parseInt(totalFeedback))*100
        var waktuTerakhir = 0
        return (
            <div>
                <div className='card-title subjudul'>
                    Dashboard
                </div>
                <div className='dimdom-bottom'></div>
                <div className='row cardblack pt-4 pb-5 text-light justify-content-center'>
                    <div className='col-4 pr-0'>
                    <div className='cardblue card-body'>
                        <div style={{fontSize:'10pt', color:'rgb(255, 92, 222)'}}>Total Jumlah Users</div>
                        <div className='mt-2 pb-3' style={{fontSize:'19pt'}}>10 users</div>
                        <div className='chart mt-3 mb-3' >
                            <Line
                                data={{
                                    labels : ['SEP', 'OKT', 'NOV', 'DES'],
                                    datasets : [{
                                        label: 'Penambahan users',
                                        data: [
                                            1,
                                            1,
                                            8,
                                            0
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
                                        position: 'bottom',
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
                    <div className='col-4 pr-0'>
                    <div className='text-center cardblue card-body'>
                        <div style={{fontSize:'10pt', color:'rgb(78, 154, 255)'}}>Total Transaksi Selesai</div>
                        <div className='mt-2 pb-3' style={{fontSize:'19pt'}}>3 transaksi</div>
                        <div className='chart mt-3 mb-3' >
                            <Line
                                data={{
                                    labels : ['SEP', 'OKT', 'NOV', 'DES'],
                                    datasets : [{
                                        label: 'Total transaksi',
                                        data: [
                                            0,
                                            2,
                                            1,
                                            0
                                        ],
                                        backgroundColor:'transparent',
                                        borderWidth:3,
                                        borderColor: 'rgb(78, 154, 255)',
                                        pointBackgroundColor: 'rgb(78, 154, 255)',
                                        pointHoverBorderWidth: 10
                                    }]
                                }}
                                options={{
                                    legend : {
                                        display: true,
                                        position: 'bottom',
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
                <div className='col-4 pr-0'>
                <div className='cardblue text-right card-body'>
                    <div style={{fontSize:'10pt', color:'rgb(91, 226, 215)'}}>Total Transaksi Dalam Proses</div>
                        <div className='mt-2 pb-3' style={{fontSize:'19pt'}}>3 transaksi</div>
                        <div className='chart mt-3 mb-3' >
                            <Line
                                data={{
                                    labels : ['SEP', 'OKT', 'NOV', 'DES'],
                                    datasets : [{
                                        label: 'Total pembelian',
                                        data: [
                                            0,
                                            1,
                                            2,
                                            0
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
                                        position: 'bottom',
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
                <div className='row cardblack pb-5 text-light justify-content-center'>
                    <div className='col-4 pr-0'>
                    <div className='cardblue card-body'>
                        <div style={{fontSize:'10pt', color:'rgb(255, 92, 222)'}}>Total Nilai Transaksi</div>
                        <div className='mt-2 pb-3' style={{fontSize:'19pt'}}>18,000,000 IDR</div>
                        <div className='chart mt-3 mb-3' >
                            <Line
                                data={{
                                    labels : ['SEP', 'OKT', 'NOV', 'DES'],
                                    datasets : [{
                                        label: 'Total nilai transaksi',
                                        data: [
                                            2500000,
                                            8000000,
                                            7500000,
                                            0
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
                                        position: 'bottom',
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
                    <div className='col-4 pr-0'>
                    <div className='text-center cardblue card-body'>
                        <div style={{fontSize:'10pt', color:'rgb(255, 92, 222)'}}>Total Penjualan</div>
                        <div className='mt-2 pb-3' style={{fontSize:'19pt'}}>11,000,000 IDR</div>
                        <div className='chart mt-3 mb-3' >
                            <Line
                                data={{
                                    labels : ['SEP', 'OKT', 'NOV', 'DES'],
                                    datasets : [{
                                        label: 'Total penjualan',
                                        data: [
                                            2500000,
                                            8000000,
                                            500000,
                                            0
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
                                        position: 'bottom',
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
                <div className='col-4 pr-0'>
                <div className='cardblue text-right card-body'>
                    <div style={{fontSize:'10pt', color:'rgb(91, 226, 215)'}}>Total Pembelian</div>
                        <div className='mt-2 pb-3' style={{fontSize:'19pt'}}>3,500,000 IDR</div>
                        <div className='chart mt-3 mb-3' >
                            <Line
                                data={{
                                    labels : ['SEP', 'OKT', 'NOV', 'DES'],
                                    datasets : [{
                                        label: 'Total pembelian',
                                        data: [
                                            2000000,
                                            1000000,
                                            500000,
                                            0
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
                                        position: 'bottom',
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
                <div className='dimdom-bottom'></div>
                <div className='pt-3'></div> 
            </div>
        )
    }

    render() {
        if(this.props.user_name=='Admin'){
        return(   
            <AbsoluteWrapper>
                <Navbar/>
                <div className='row dim-height-addproduct text-light'> 
                    <div className='col-3 mt-3'>
                        <div className='card-nav p-3 dim-height-nav'>
                            <div className='card-title'>
                                <NavLink to='/verifier' className='ui inverted basic dimdom4 button mt-5'>Verifikasi</NavLink>   
                                <NavLink to='/dashboardadmin' className='ui inverted basic dimdom4 button mt-5'>Dashboard</NavLink>   
                            </div>
                        </div>
                </div>
                    <div className='col-9 mt-3'>
                        <div className='row align-items-center text-light quic700 mr-4'>
                            <div className='col-12 mx-auto cardblack'>
                                <div className='card-body'>
                                    {this.renderList()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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

export default connect(mapStateToProps)(DashboardAdmin)