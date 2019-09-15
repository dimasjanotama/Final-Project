import { combineReducers } from 'redux'


const init = { 
    id: '',
    username: ''
}

const AuthReducer = (state = init, action) => { 
    switch (action.type) {
        case 'LOGIN_SUCCESS':    
            // Akan menyalin property di state untuk kemudian diubah 'id' dan 'username' nya
            return {...state,id: action.payload.id, username: action.payload.username}
        
        case 'LOGOUT_SUCCESS':
            return {...state,id:'', username:''}

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