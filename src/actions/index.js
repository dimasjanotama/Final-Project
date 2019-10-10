import axios from 'axios'
import React, { Component } from 'react'


const urlApi = 'http://localhost:7777/auth/'

export const onLoginUser = (inputId, inputUsername) => { 
    return (dispatch)=>{
        localStorage.setItem(
            'userData',
            JSON.stringify({id: inputId, username: inputUsername}) // --> property dan nama data sama maka bisa dipersingkat dg --> {id,username}
            )
            dispatch ({
            type: 'LOGIN_SUCCESS',
            payload: {
                id: inputId,
                username: inputUsername
            }  
        })
}}

export const keepLogin = (objUser) => {
    return {
        type: 'LOGIN_SUCCESS',
        payload: {
            id: objUser.id,
            username: objUser.username
        }
    }
}

export const onLogoutUser = () => {
    localStorage.clear();
    // Menghapus data di redux (cara menghapus adalah mereturn type tanpa payload)
    return {
        type: 'LOGOUT_SUCCESS'
    }
}

export const toggleModalOn = () => {
    return {
        type: 'TOGGLE_ON'
    }
}

export const toggleModalOff = () => {
    return {
        type: 'TOGGLE_OFF'
    }
}

