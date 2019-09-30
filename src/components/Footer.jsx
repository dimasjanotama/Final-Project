import React, { Component } from 'react'
import {NavLink} from 'react-router-dom'

class Footer extends Component {
    render() {
        return (
                <div className='container-fluid dimdom-bg-bottom'>
                    <div className="row align-items-center">
                        <div className='col pt-2 text-left m-5 manj700'>Created © 2019 by Dimas J</div>
                        <div className='col-6'></div>
                        <div className='col pt-2 text-right m-4'>
                        
                            <i class="big google plus g link icon"></i>
                            <i class="big instagram link icon"></i>
                            <i class="big github link icon"></i>
                        
                        </div>
                    </div>
                </div>

            
        )
    }
}

export default Footer