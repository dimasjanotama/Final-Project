import React, { Component } from 'react'
import {NavLink} from 'react-router-dom'


class Navbar extends Component {
    render () {
        return(
            <div>
            <div class='dimdom-bg' ></div>
            <div class='container-fluid dimdom-bottom' >
                <div class="row align-items-center" style={{backgroundColor:'rgb(33,34,44)',height:'115px'}}>
                    
                    <div class="col pl-5 pt-1">
                        <NavLink className="dimdom-pink-logo" style={{fontSize:'30pt'}} to='/'>fxpedia.</NavLink>
                    </div>
                    <div class="col pt-1 text-center">                    
                        <NavLink to='/kategori' className='dimdom-pink col'>Browse Kategori</NavLink>
                                       
                    </div>       
                    <div class="col pl-3 pt-2 text-center text-light">
                        <div class="ui inverted transparent icon input">
                            <input type="text" placeholder="Find Your fx here..."/>
                            <i className="large search icon"></i>
                        </div>
                        {/* <div className="ui dimdom inputt w-100">
                            <input type="text" placeholder="Cari alat miusic..."/>
                            <button class="ui inverted basic dimdom button">
                                SeaRch
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export default Navbar
