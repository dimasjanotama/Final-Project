import React, { Component } from 'react'

const AbsoluteWrapper = ({ children })=>{
    return (
        <div  className='position-absolute w-100' style={{backgroundColor: 'rgb(255,255,255'}}>
            { children }
        </div>
    )
}

export default AbsoluteWrapper