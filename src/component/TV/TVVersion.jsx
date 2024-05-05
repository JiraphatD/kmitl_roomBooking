import React, { useState, useEffect, useContext } from 'react'
import { Route, Routes } from 'react-router-dom';
import moment from 'moment';
import QRCode from 'qrcode.react';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import Floor from '../Floor/Floor.jsx'
import { HomeContext } from '../Home.jsx';
function TVVersion() {
    const time = moment().format('HH:mm')
    const { floor } = useContext(HomeContext)
    const [qrCodeData, setQRCodeData] = useState('');
    useEffect(() => {
        const currentUrl = window.location.origin;
        const floorNumber = window.location.pathname.split('/').pop();
        const newUrl = `${currentUrl}/Floor/${floorNumber}`;
        setQRCodeData(newUrl);
    }, []);
    const style = {
        qrCode:{
            position: 'absolute',
            right: '5vw',
            top: '12vw',
            display: 'block',
            textAlign: 'center',
            fontWeight: 'bold'
        },

    }
    return (
        <div>
            <div style={{ position: 'absolute', right: '4vw', fontSize: '8vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <QueryBuilderIcon sx={{fontSize: '5vw'}}/>
                {time}
            </div>
            <div className="qrCode" style={style.qrCode}>
                <QRCode value={qrCodeData} size={200} />
                <p>SCAN QR CODE FOR BOOKING</p>
            </div>
            <Routes>
                <Route path='*' element={<div style={{ marginTop: '1vw' , marginLeft:'1vw'}}><Floor floor={floor} TV={true}/></div>} />
            </Routes>
        </div>
    )
}

export default TVVersion