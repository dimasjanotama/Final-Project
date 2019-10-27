otherProfile = () => {
    var { username, kabupaten, propinsi, tglDaftar, avatar } = this.state.profile
    return (
        <div>
            <div className='card-title subjudul'>
                Profil
            </div>
             <div className='row card-title pt-4'>
             <div class="w-100"></div> 
             <div className='dimdom-bottom'></div>
             <img class="ui medium circular image" src={`http://localhost:7777/files/${avatar}`}></img>
             <div className='dimdom-bottom'></div>
                <div className='col-8 card-title pt-4 pb-1 pl-0 quic700p text-center'>
                    {username}
                </div>  
            <div className='row'>
                 <div className='col-8 card-title pt-4 pb-1 pl-0 quic700 text-center'>
                    <p>{kabupaten}, {propinsi}</p>
                </div> 
            </div> 
            </div>
                <div className='dimdom-bottom'></div>
                </div>
    )
}