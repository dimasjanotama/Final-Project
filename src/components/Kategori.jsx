import React, { Component } from 'react'
import {NavLink} from 'react-router-dom'
import AbsoluteWrapper from './AbsoluteWrapper'

import Footer from './Footer'


class Kategori extends Component {

    render() {
        return(   
            <AbsoluteWrapper>
                <div className='container-fluid text-light' style={{ backgroundColor:'rgb(33,34,44)', height:'1280px', width:'1200px'}}>
                <div style={{height: '50px'}}></div>
                    
                <h1>INI KATEGORI</h1>
                    <h1>BELUM BIKIN LOGOUT</h1>
                    
                </div>
                <Footer />
            </AbsoluteWrapper>
        )
    }
}

export default Kategori