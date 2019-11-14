import React, { Component } from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'
import {connect} from 'react-redux'
import {Line, Doughnut, Pie} from 'react-chartjs-2'
import axios from 'axios'
import moment from 'moment'
import Navbar from './Navbar'
import Footer from './Footer'



const urlApi = 'http://localhost:7777/auth/'

class DashboardAdmin extends Component {

    state = {
        userChart: [],
        transdoneChart: [],
        transvalueChart: [],
        totUsers: '',
        totTransdone: '',
        totTransvalue: '',
        totFeedback: 0,
        totalPuas: '',
        transStatusChart: [],
        satisfactionChart: [],
        productsChart: [],
        activeSeller: [],
        activeBuyer: [],
        loading: true,
        totTransaksiBuyer: 0,
        totTransaksiSeller: 0
    }

    componentDidMount(){
        this.getAllChart()
    }

    getAllChart = () => {
        let token = 
        axios.get(urlApi+'getuserschart')
        .then(res=>{
            console.log('line 42');
            if(res.data[0]){
                this.setState({userChart: res.data})
            }
            axios.get(urlApi+'gettotalusers')
            .then(res=>{
                console.log('line 48');
                if(res.data[0]){
                    this.setState({totUsers: res.data[0].totalUsers})
                }
                axios.get(urlApi+'transactiondonechart')
                .then(res=>{
                    console.log('line 54');
                    if(res.data[0]){
                        this.setState({transdoneChart: res.data})
                    }
                    axios.get(urlApi+'totaltransactiondone')
                    .then(res=>{
                        console.log('line 60');
                        if(res.data[0]){
                            this.setState({totTransdone: res.data[0].totalTransactions})
                        }
                        axios.get(urlApi+'transactionvaluechart')
                        .then(res=>{
                            console.log('line 66');
                            if(res.data[0]){
                                this.setState({transvalueChart: res.data})
                            }
                            axios.get(urlApi+'totaltransactionvalue')
                            .then(res=>{
                                console.log('line 72');
                                if(res.data[0]){
                                    this.setState({totTransvalue: res.data[0].transactionsValue})
                                }
                                this.getAllDiagram()    
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
            }).catch(err=>{
                console.log(err);
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    getAllDiagram = () => {
        axios.get(urlApi+'transactionstatuschart')
        .then(res=>{
            console.log('line 100');
            if(res.data[0]){
                this.setState({transStatusChart: res.data})
            }
            axios.get(urlApi+'custsatisfactionchart')
            .then(res=>{
                console.log('line 106');
                if(res.data[0].totalFeedback){
                    this.setState({satisfactionChart: res.data, totFeedback: res.data[0].totalFeedback, totalPuas: res.data[0].totalPuas})
                } else {this.setState({totFeedback: 0})}
                axios.get(urlApi+'productschart')
                .then(res=>{
                    console.log('line 112');
                    if(res.data[0]){
                        this.setState({productsChart: res.data})
                    }
                    axios.get(urlApi+'activeseller')
                    .then(res=>{
                        console.log('line 118');
                        if(res.data[0]){
                            this.setState({activeSeller: res.data[0].namaSeller, totTransaksiSeller: res.data[0].totalTransaksi})
                        } else {
                            this.setState({activeSeller: 'Belum Ada'})
                        }
                        axios.get(urlApi+'activebuyer')
                        .then(res=>{
                            console.log('line 126');
                            if(res.data[0]){
                                this.setState({
                                    activeBuyer: res.data[0].namaBuyer,
                                    totTransaksiBuyer: res.data[0].totalTransaksi
                                })
                            } else {
                                this.setState({activeBuyer: 'Belum Ada'})
                            }
                            this.condition()
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
        }).catch(err=>{
            console.log(err);
        })
    }

    condition = () => {
        if(!this.state.totUsers){
            this.setState({totUsers: 0})
        }
        if(!this.state.totTransdone){
            this.setState({totTransdone: 0})
        }
        if(!this.state.totTransvalue){
            this.setState({
                totTransvalue: 0,
                loading: false
            })
        } else {
            this.setState({ loading: false })
        }
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

    renderList = () => {
        if(this.state.loading==false){

        // DIAGRAM STATUS TRANSAKSI
        this.transaksiSelesai = 0
        this.totalPuas = 0
        this.totalTidakPuas = 0
        var transProses = 0
        var allTransaction = 0
        this.state.transStatusChart.map((perstatus)=>{
            if(perstatus.statusNow=='Transaksi selesai'){
                this.transaksiSelesai = perstatus.totalTransactions
                allTransaction+= perstatus.totalTransactions
            } else {
                transProses+= perstatus.totalTransactions
                allTransaction+= perstatus.totalTransactions
            }
        })
        this.transaksiProses = transProses
        this.totalJmlTransaksi = allTransaction
        
        // DIAGRAM KEPUASAN
        if(this.state.totFeedback){
            this.totalTidakPuas = (this.state.satisfactionChart[0].totalFeedback)-(this.state.satisfactionChart[0].totalPuas)
        }
        // DIAGRAM TOTAL PRODUK DAN KATEGORI
        this.distortion = 0
        this.dynamics = 0
        this.filter = 0
        this.modulation = 0
        this.pitch = 0
        this.time = 0
        this.preamp = 0
        this.multi = 0
        this.bass = 0
        var totProduct = 0
        this.state.productsChart.map((perkategori)=>{
            if(perkategori.kategori=='Distortion'){
                this.distortion = perkategori.totalProduct
                totProduct+= perkategori.totalProduct
            } else if(perkategori.kategori=='Dynamics'){
                this.dynamics = perkategori.totalProduct
                totProduct+= perkategori.totalProduct
            } else if(perkategori.kategori=='Filter'){
                this.filter = perkategori.totalProduct
                totProduct+= perkategori.totalProduct
            } else if(perkategori.kategori=='Modulation'){
                this.modulation = perkategori.totalProduct
                totProduct+= perkategori.totalProduct
            } else if(perkategori.kategori=='Pitch'){
                this.pitch = perkategori.totalProduct
                totProduct+= perkategori.totalProduct
            } else if(perkategori.kategori=='Time'){
                this.time = perkategori.totalProduct
                totProduct+= perkategori.totalProduct
            } else if(perkategori.kategori=='Preamp'){
                this.preamp = perkategori.totalProduct
                totProduct+= perkategori.totalProduct
            } else if(perkategori.kategori=='Multi Effect'){
                this.multi = perkategori.totalProduct
                totProduct+= perkategori.totalProduct
            } else if(perkategori.kategori=='Bass FX'){
                this.bass = perkategori.totalProduct
                totProduct+= perkategori.totalProduct
            }
        })
        this.totalProducts = totProduct

        // GRAFIK USERS, TRANSAKSI SELESAI, NILAI TRANSAKSI
        let bulanIni = (moment().format('M'))
        this.user1 = 0
        this.user2 = 0
        this.user3 = 0
        this.user4 = 0
        this.transdone1 = 0
        this.transdone2 = 0
        this.transdone3 = 0
        this.transdone4 = 0
        this.transvalue1 = 0
        this.transvalue2 = 0
        this.transvalue3 = 0
        this.transvalue4 = 0
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
            this.state.userChart.map((perbulan)=>{
                if(perbulan.bulan==8){
                    this.user1 = perbulan.newUser
                } else if (perbulan.bulan==9){
                    this.user2 = perbulan.newUser
                } else if (perbulan.bulan==10){
                    this.user3 = perbulan.newUser
                } else if (perbulan.bulan==11){
                    this.user4 = perbulan.newUser
                } else {}
            })  
            this.state.transdoneChart.map((perbulan)=>{
                if(perbulan.bulan==8){
                    this.transdone1 = perbulan.totalTransaksi
                } else if (perbulan.bulan==9){
                    this.transdone2 = perbulan.totalTransaksi
                } else if (perbulan.bulan==10){
                    this.transdone3 = perbulan.totalTransaksi
                } else if (perbulan.bulan==11){
                    this.transdone4 = perbulan.totalTransaksi
                } else {}
            }) 
            this.state.transvalueChart.map((perbulan)=>{
                if(perbulan.bulan==8){
                    this.transvalue1 = perbulan.nilaiTransaksi
                } else if (perbulan.bulan==9){
                    this.transvalue2 = perbulan.nilaiTransaksi
                } else if (perbulan.bulan==10){
                    this.transvalue3 = perbulan.nilaiTransaksi
                } else if (perbulan.bulan==11){
                    this.transvalue4 = perbulan.nilaiTransaksi
                } else {}
            }) 
        } else if(bulanIni==12){
            var chartBulan = ['SEP','OKT','NOV','DES']  
        }
        return (
            <div>
                <div className='col-11 cardgrey ml-5 mr-4 mt-4 mb-5 pt-4 pb-4 pr-3 pl-5 text-dark' style={{fontSize:'16pt'}}>
                    Dashboard Admin
                </div>
                <div className='col-11 pl-0 mx-auto'>
                <div className='row pb-5 text-light justify-content-center'>
                    <div className='col-4 pr-0'>
                    <div className='cardblue card-body'>
                        <div style={{fontSize:'10pt', color:'rgb(255, 92, 222)'}}>Total Jumlah Users</div>
                        <div className='mt-2 pb-3' style={{fontSize:'19pt'}}>{this.state.totUsers} users</div>
                        <div className='chart mt-3 mb-3' >
                            <Line
                                data={{
                                    labels : [chartBulan[0], chartBulan[1], chartBulan[2], chartBulan[3]],
                                    datasets : [{
                                        label: 'Penambahan users',
                                        data: [
                                            this.user1,
                                            this.user2,
                                            this.user3,
                                            this.user4
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
                        <div className='mt-2 pb-3' style={{fontSize:'19pt'}}>{this.state.totTransdone} transaksi</div>
                        <div className='chart mt-3 mb-3' >
                            <Line
                                data={{
                                    labels : [chartBulan[0], chartBulan[1], chartBulan[2], chartBulan[3]],
                                    datasets : [{
                                        label: 'Total transaksi',
                                        data: [
                                            this.transdone1,
                                            this.transdone2,
                                            this.transdone3,
                                            this.transdone4
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
                    <div style={{fontSize:'10pt', color:'rgb(91, 226, 215)'}}>Total Nilai Transaksi</div>
                        <div className='mt-2 pb-3' style={{fontSize:'19pt'}}>{this.state.totTransvalue.toLocaleString('en')} IDR</div>
                        <div className='chart mt-3 mb-3' >
                            <Line
                                data={{
                                    labels : [chartBulan[0], chartBulan[1], chartBulan[2], chartBulan[3]],
                                    datasets : [{
                                        label: 'Total nilai transaksi',
                                        data: [
                                            this.transvalue1,
                                            this.transvalue2,
                                            this.transvalue3,
                                            this.transvalue4
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
                <div className='row pb-5 text-light justify-content-center'>
                    <div className='col-4 pr-0'>
                    <div className='cardblue card-body'>
                        <div style={{fontSize:'10pt', color:'rgb(255, 92, 222)'}}>Transaksi Hingga Saat Ini</div>
                        <div className='mt-2 pb-3' style={{fontSize:'19pt'}}>{this.totalJmlTransaksi} transaksi</div>
                        <div className='chart mt-3 mb-3' >
                            <Pie
                                data={{
                                    labels: ['Selesai','Dalam Proses'],
                                    datasets : [{
                                        data: [
                                            this.transaksiSelesai,
                                            this.transaksiProses
                                        ],
                                        backgroundColor:['rgb(78, 154, 255)','rgb(91, 226, 215)'],
                                        borderWidth:3,
                                        borderColor: 'rgb(39, 41, 61)',
                                        hoverBorderColor: 'rgb(39, 41, 61)',
                                        hoverBorderWidth: 6
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
                                    }
                                }}
                                />
                        </div>
                        </div>
                    </div>
                    <div className='col-4 pr-0'>
                    <div className='text-center cardblue card-body'>
                        <div style={{fontSize:'10pt', color:'rgb(78, 154, 255)'}}>Total Feedback</div>
                        <div className='mt-2 pb-3' style={{fontSize:'19pt'}}>{this.state.totFeedback} Feedback</div>
                        <div className='chart mt-3 mb-3' >
                        <Pie
                                data={{
                                    labels: ['Puas','Tidak Puas'],
                                    datasets : [{
                                        data: [
                                            this.state.totalPuas,
                                            this.totalTidakPuas
                                        ],
                                        backgroundColor:['rgb(255, 92, 222)','rgb(91, 226, 215)'],
                                        borderWidth:3,
                                        borderColor: 'rgb(39, 41, 61)',
                                        hoverBorderColor: 'rgb(39, 41, 61)',
                                        hoverBorderWidth: 6
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
                                    }
                                }}
                                />
                            </div>
                        </div>
                    </div>
                <div className='col-4 pr-0'>
                <div className='cardblue text-right card-body'>
                    <div style={{fontSize:'10pt', color:'rgb(91, 226, 215)'}}>Total Produk Dijual</div>
                        <div className='mt-2 pb-3' style={{fontSize:'19pt'}}>{this.totalProducts} Produk</div>
                        <div className='chart mt-3 mb-3' >
                        <Pie
                                data={{
                                    labels: ['Distortion','Dynamics','Filter','Modulation','Pitch','Time','Preamp/Cabsim','Multi FX','Bass FX'],
                                    datasets : [{
                                        data: [
                                            this.distortion,
                                            this.dynamics,
                                            this.filter,
                                            this.modulation,
                                            this.pitch,
                                            this.time,
                                            this.preamp,
                                            this.multi,
                                            this.bass
                                        ],
                                        backgroundColor:['rgb(248, 107, 107)','rgb(255, 248, 148)','grey','rgb(210, 95, 255)','rgb(255, 180, 119)',
                                            'rgb(78, 154, 255)','rgb(117, 255, 135)','rgb(155, 125, 92)','rgb(57, 209, 255)'],
                                        borderWidth:3,
                                        borderColor: 'rgb(39, 41, 61)',
                                        hoverBorderColor: 'rgb(39, 41, 61)',
                                        hoverBorderWidth: 6
                                    }]
                                }}
                                options={{
                                    legend : {
                                        display: true,
                                        position: 'right',
                                        labels: {
                                            boxWidth: 25,
                                            padding: 2,
                                            fontFamily: 'Quicksand',
                                            fontColor: 'rgb(192,192,192)',
                                            fontSize: 12
                                        }
                                    }
                                }}
                                />
                        </div>
                        </div>
                    </div>
                </div>
                <div className='row justify-content-between w-75 mx-auto'>
                    <div className='col-4 pb-5 cardblue text-center mx-auto'>
                        <div><i className='big trophy icon mt-5 mb-4 text-light'></i></div>
                        <div className='w-100'></div>
                        <div className='quic700p' style={{fontSize:'22pt'}}>{this.state.activeSeller}</div>
                        <div className='w-100'></div>
                        <div className='mt-4 text-light'>Penjual teraktif</div>
                        <div className='w-100'></div>
                        <div className='mt-1' style={{fontSize:'10pt', color:'rgb(192,192,192)'}}>{this.state.totTransaksiSeller} transaksi</div>
                    </div>
                    <div className='col-4 pb-5 cardblue text-center mx-auto'>
                        <div><i className='big flag icon mt-5 mb-4 text-light'></i></div>
                        <div className='w-100'></div>
                        <div className='quic700p' style={{fontSize:'22pt'}}>{this.state.activeBuyer}</div>
                        <div className='w-100'></div>
                        <div className='mt-4 text-light'>Pembeli teraktif</div>
                        <div className='w-100'></div>
                        <div className='mt-1' style={{fontSize:'10pt', color:'rgb(192,192,192)'}}>{this.state.totTransaksiBuyer} transaksi</div>
                    </div>
                <div className='pt-3'></div> 
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
        if(this.props.user_name=='Admin'){
        return(   
            <AbsoluteWrapper>
                <Navbar/>
                    <div className='col-11 mx-auto mt-3'>
                        <div className='row align-items-center quic700 mr-4'>
                            <div className='col-12 mx-auto cardwhite pb-5'>
                                <div className='card-body'>
                                    {this.renderList()}
                                </div>
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
        user_id : state.auth.id
    }
}

export default connect(mapStateToProps)(DashboardAdmin)