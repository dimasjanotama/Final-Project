// Action Creator
// A.C = Function biasa yg terhubung dengan reducer melalui connect
// Harus return object yang memiliki property 'type

import axios from 'axios'

// Action Creator
// Setelah di masukkan ke connect, akan di panggil sebagai this.props.onLoginUser
export const onLoginUser = (USERNAME, PASSWORD) => { //<==== Ibarat Seorang kurir yang akan mengirim payload nya (Action Creator)
    return (dispatch)=>{
    //Action
    //ini akan jadi parameter kedua di AuthReducer
    axios.get(
        // Hanya ketika menggunakan GET, data harus di dalam params: {}
        'http://localhost:7777/users', //jika cm ini maka akan mengambil semua database oleh krn itu ditambah code bawahnya
        {
            params: { 
                username: USERNAME,
                password: PASSWORD
            }
        }
    ).then((res)=>{
            // res.data merupakan sebuah array
            // jika data ditemukan, length > 0
            // jika data tidak ditemukan, length = 0
            // console.log(res.data);
            if (res.data.length === 0) {
                alert('user tidak ditemukan');
            } else {
                let {id, username} = res.data[0] //let{id,username} mendeclare 2 variabel secara langsung
                // res.data[0] = {id , email, username, password}

                // Menyimpan data ke local storage
                localStorage.setItem(
                    'userData',
                    JSON.stringify({id: id, username: username}) // --> property dan nama data sama maka bisa dipersingkat dg --> {id,username}
                    // JSON.stringify akan mengubah bentuk object menjadi string
                    )
                    // Menyimpan data di redux state
                    dispatch ( {
                    type: 'LOGIN_SUCCESS',
                    payload: {
                        id: id,
                        username: username
                    }  
                })
                
    }}).catch(()=>{})
}}

export const onLogoutUser = () => {
    // Menghapus data di localstorage
    localStorage.removeItem('userData');
    // Menghapus data di redux (cara menghapus adalah mereturn type tanpa payload)
    return {
        type: 'LOGOUT_SUCCESS'
    }
}

// export dengan 'default'
    // ketika di import di file lain 'tidak' menggunakan kurung kurawal {}

//  export tanpa 'default'
    // ketika diimport di file lain 'harus' menggunakan kurung kurawal {}

// HANYA ADA SATU 'export default' DALAM SATU FILE