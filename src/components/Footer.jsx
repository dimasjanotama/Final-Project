import React, { Component } from 'react'
import {NavLink} from 'react-router-dom'

class Footer extends Component {
    render() {
        return (
                <div className='container-fluid dimdom-bg-bottom mt-5 position-absolute'>
                    <div className="row align-items-center">
                        <div className='col text-left m-4 quic700 text-light'>Created © 2019 by Dimas J</div>
                        <div className='col-6'></div>
                        <div className='col text-right m-4'>
                            <i class="big google plus g link text-light icon"></i>
                            
                            <i class="big instagram link text-light icon"></i>
                            <i class="big github link text-light icon"></i>
                        </div>
                    </div>
                </div>

            
        )
    }
}

export default Footer