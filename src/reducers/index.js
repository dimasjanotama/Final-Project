import { combineReducers } from 'redux'


const init = { 
    id: '',
    username: '',
    keywords: '',
    otherId: '',
    transactionId: '',
    kodeUnik: ''
}

const AuthReducer = (state = init, action) => { 
    switch (action.type) {
        case 'LOGIN_SUCCESS':    
            // Akan menyalin property di state untuk kemudian diubah 'id' dan 'username' nya
            return {...state,id: action.payload.id, username: action.payload.username}
        
        case 'LOGOUT_SUCCESS':
            return {...state,id:'', username:''}

        case 'SEARCH_KEYWORDS':
            return {...state,keywords: action.payload.keywords}

        case 'CLEAR_KEYWORDS_SUCCESS':
            return {...state,keywords:''}

        case 'CLICK_SELLER_SUCCESS':
            return {...state,otherId: action.payload.otherId}

        case 'CLICK_DETAIL_TRANSAKSI':
            return {...state,transactionId: action.payload.idTransaksi}

        case 'SET_UNIQUE_DIGIT':
            return {...state,kodeUnik: action.payload.kodeUnik}

        case 'CLEAR_UNIQUE_DIGIT':
            return {...state,kodeUnik:''}

        default:
            return state
    }
}

const reducers = combineReducers(
    {
        auth: AuthReducer
    }
)

export default reducers


// Pertama kali app running, reducer akan menjalankan kode yang ada di 'default'
// pada default kita akan return 'state' yang berisi object 'init' sebagai data awal