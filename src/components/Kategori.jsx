import React, { Component } from 'react'
import {NavLink} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'


import Footer from './Footer'
import Navbar from './Navbar'



class Kategori extends Component {
    state = {
        kategori: ''
    } 

    renderList = () => {
        if(this.state.kategori === 'dist'){
            return (
                <div className='card-nav p-3'>
                    <NavLink to='/overdrive' className='ui inverted basic dimdom4 button mt-5'>Overdrive</NavLink>
                    <br/>
                    <NavLink to='/distortion' className='ui inverted basic dimdom4 button'>Distortion</NavLink>
                    <br/>
                    <NavLink to='/fuzz' className='ui inverted basic dimdom4 button mb-5'>Fuzz</NavLink>
                </div>
            )
        } else if(this.state.kategori === 'dyn'){
            return (
                <div className='card-nav p-3'>
                    <NavLink to='/compressor' className='ui inverted basic dimdom4 button mt-5'>Compressor</NavLink>
                    <br/>
                    <NavLink to='/booster' className='ui inverted basic dimdom4 button'>Booster</NavLink>
                    <br/>
                    <NavLink to='/volume' className='ui inverted basic dimdom4 button'>Volume</NavLink>
                    <br/>
                    <NavLink to='/gate' className='ui inverted basic dimdom4 button mb-5'>Gate/Suppresor</NavLink>
                </div>
            )
        } else if(this.state.kategori === 'filter'){
            return (
                <div className='card-nav p-3'>
                    <NavLink to='/eq' className='ui inverted basic dimdom4 button mt-5'>EQ</NavLink>
                    <br/>
                    <NavLink to='/talkbox' className='ui inverted basic dimdom4 button'>Talk Box</NavLink>
                    <br/>
                    <NavLink to='/synth' className='ui inverted basic dimdom4 button'>Synth</NavLink>
                    <br/>
                    <NavLink to='/wah' className='ui inverted basic dimdom4 button mb-5'>Wah-wah</NavLink>
                </div>
            )
        } else if(this.state.kategori === 'mod'){
            return (
                <div className='card-nav p-3'>
                    <NavLink to='/tremolo' className='ui inverted basic dimdom4 button mt-5'>Tremolo</NavLink>
                    <br/>
                    <NavLink to='/phaser' className='ui inverted basic dimdom4 button'>Phaser</NavLink>
                    <br/>
                    <NavLink to='/flanger' className='ui inverted basic dimdom4 button'>Flanger</NavLink>
                    <br/>
                    <NavLink to='/chorus' className='ui inverted basic dimdom4 button'>Chorus</NavLink>
                    <br/>
                    <NavLink to='/vibrato' className='ui inverted basic dimdom4 button'>Vibrato</NavLink>
                    <br/>
                    <NavLink to='/tremolo' className='ui inverted basic dimdom4 button'>Tremolo</NavLink>
                    <br/>
                    <NavLink to='/ring' className='ui inverted basic dimdom4 button'>Ring Modulator</NavLink>
                </div>
            )
        } else if(this.state.kategori === 'pitch'){
            return (
                <div className='card-nav p-3'>
                    <NavLink to='/shifter' className='ui inverted basic dimdom4 button mt-5'>Pitch Shifter</NavLink>
                    <br/>
                    <NavLink to='/whammy' className='ui inverted basic dimdom4 button'>Whammy</NavLink>
                    <br/>
                    <NavLink to='/harmony' className='ui inverted basic dimdom4 button mb-5'>Harmony</NavLink>
                </div>
            )
        } else if(this.state.kategori === 'time'){
            return (
                <div className='card-nav p-3'>
                    <NavLink to='/delay' className='ui inverted basic dimdom4 button mt-5'>Delay</NavLink>
                    <br/>
                    <NavLink to='/reverb' className='ui inverted basic dimdom4 button'>Reverb</NavLink>
                    <br/>
                    <NavLink to='/looper' className='ui inverted basic dimdom4 button mb-5'>Looper</NavLink>
                </div>
            )
        } else if(this.state.kategori === 'preamp'){
            return (
                <div className='card-nav p-3'>
                    <NavLink to='/preamp' className='ui inverted basic dimdom4 button mt-5'>Preamp</NavLink>
                    <br/>
                    <NavLink to='/cabsim' className='ui inverted basic dimdom4 button'>Cabinet Simulator</NavLink>
                </div>
            )
        } else if(this.state.kategori === 'multi'){
            return (
                <div className='card-nav p-3'>
                    <NavLink to='/delay' className='ui inverted basic dimdom4 button mt-5 mb-5'>Multi Fx</NavLink>
                </div>
            )
        } else if(this.state.kategori === 'bassfx'){
            return (
                <div className='card-nav p-3'>
                    <NavLink to='/delay' className='ui inverted basic dimdom4 button mt-5 mb-5'>Bass Fx</NavLink>
                </div>
            )
        } else {
            return null
        }
    }


    render() {
        return(   
            <AbsoluteWrapper>
                <Navbar/>
                <div className='row dim-height text-light'> 
                    <div className='col-3 mt-3'>
                        <div className='card-nav p-3 dim-height-nav'>
                            <div className='card-title'>
                            <button onClick={()=> this.setState({kategori: 'dist'})} className='ui inverted basic dimdom4 button mt-5'>Distortion</button>
                            <button onClick={()=> this.setState({kategori: 'dyn'})} className='ui inverted basic dimdom4 button'>Dynamics</button>
                            <button onClick={()=> this.setState({kategori: 'filter'})} className='ui inverted basic dimdom4 button'>Filter</button>
                            <button onClick={()=> this.setState({kategori: 'mod'})} className='ui inverted basic dimdom4 button'>Modulation</button>
                            <button onClick={()=> this.setState({kategori: 'pitch'})} className='ui inverted basic dimdom4 button'>Pitch</button>
                            <br/>
                            <button onClick={()=> this.setState({kategori: 'time'})}className='ui inverted basic dimdom4 button'>Time</button>
                            <button onClick={()=> this.setState({kategori: 'preamp'})}className='ui inverted basic dimdom4 button'>Preamp/Cabsim</button>
                            <button onClick={()=> this.setState({kategori: 'multi'})} className='ui inverted basic dimdom4 button'>Multi/Effects</button>
                            <button onClick={()=> this.setState({kategori: 'bassfx'})}className='ui inverted basic dimdom4 button'>BassFX</button>
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
    }
}

export default Kategori