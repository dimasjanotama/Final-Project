import React, { Component } from 'react'

const AbsoluteWrapper = ({ children })=>{
    return (
        <div className='position-absolute w-100' style={{backgroundColor:'rgb(33,34,44)'}}  >
            { children }
        </div>
    )
}

export default AbsoluteWrapper