import React, { Component } from 'react'

const AbsoluteWrapper = ({ children })=>{
    return (
        <div  className='position-absolute w-100' style={{backgroundColor: 'rgba(19,19,19,0.3'}}>
            { children }
        </div>
    )
}

export default AbsoluteWrapper