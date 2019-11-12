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

export const searchKeywords = (keywords) => {
    return {
        type: 'SEARCH_KEYWORDS',
        payload: {
            keywords: keywords
        }
    }
}

export const clearKeywords = () => {
    return {
        type: 'CLEAR_KEYWORDS_SUCCESS'
    }
}

export const clickSeller = (idSeller) => {
    return (dispatch)=>{
        localStorage.setItem(
            'otherId',
            JSON.stringify({otherId: idSeller}) // --> property dan nama data sama maka bisa dipersingkat dg --> {id,username}
            )
            dispatch ({
                type: 'CLICK_SELLER_SUCCESS',
                payload: {
                    otherId: idSeller
            }  
        })
}
}

export const keepClickSeller = (obj) => {
    return {
        type: 'CLICK_SELLER_SUCCESS',
        payload: {
            otherId: obj.otherId
        }
    }
}

export const detailTransaksi = (idTransaksi) => {
    return (dispatch)=>{
        localStorage.setItem(
            'transactionId',
            JSON.stringify({transactionId: idTransaksi}) // --> property dan nama data sama maka bisa dipersingkat dg --> {id,username}
            )
            dispatch ({
                type: 'CLICK_DETAIL_TRANSAKSI',
                payload: {
                    idTransaksi: idTransaksi
            }  
        })
}
}

export const keepDetail = (obj) => {
    return {
        type: 'CLICK_DETAIL_TRANSAKSI',
        payload: {
            idTransaksi: obj.transactionId
        }
    }
}

export const setKodeUnik = (kode) => {
    return (dispatch)=>{
        localStorage.setItem('kodeUnik',kode)
            dispatch ({
                type: 'SET_UNIQUE_DIGIT',
                payload: {
                    kodeUnik: kode
            }  
        })
}
}

export const keepKodeUnik = (kode) => {
    return {
        type: 'SET_UNIQUE_DIGIT',
        payload: {
            kodeUnik: kode
        }
    }
}

export const clearKodeUnik = () => {
    localStorage.removeItem('kodeUnik')
    return {
        type: 'CLEAR_UNIQUE_DIGIT'
    }
}