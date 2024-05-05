import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Link, Route, Routes, Navigate } from 'react-router-dom';
import RoomComponent from '../Component/RoomComponent'
import axios from 'axios'
import moment from 'moment';
import Man2Icon from '@mui/icons-material/Man2';
import Woman2Icon from '@mui/icons-material/Woman2';
import ElevatorIcon from '@mui/icons-material/Elevator';
import StairsIcon from '@mui/icons-material/Stairs';
import Tooltip from '@mui/material/Tooltip';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import './Floor2.css'
const Floor2 = ({ roomDB, linkBookDB, classify, handleSearch, currentTime, updateRoomStatus}) => {
    //fill data to RoomComponent
    const RoomCheck = (id) => {
        return [roomDB.filter(item => item.room_name === id), linkBookDB.filter(item=> item.room_id === id)];
    };
    //search
    const roomList = document.getElementsByClassName('room');
    Array.from(roomList).forEach(element => {
        let selected = false;
        const roomName = element.getElementsByTagName('h4')[0].innerText.toLowerCase();
        const roomActivity = element.getElementsByTagName('p')[0].innerText.toLowerCase();
        Array.from(linkBookDB).forEach(data => {
        if(roomName == data.room_id.toLowerCase()){
            selected = (data.booker.name.toLowerCase().includes(handleSearch.toLowerCase())) && handleSearch !== '';
        }})
        const addClass = (roomName.includes(handleSearch.toLowerCase()) || roomActivity.includes(handleSearch.toLowerCase()) || selected) && handleSearch !== '';
        element.classList.toggle('selectedRoom', addClass);
    });

    return (
        <div>
            <svg  className='svg_map' width="510" height="955" viewBox="0 0 510 955" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 203 */}
            <rect x="1" y="718" width="146" height="198" fill="white" stroke="black"/>
            <foreignObject x="1" y="718" width="146" height="198">
            <Link to="/RoomDescription/M03" style={{textDecoration:'none', color:'black'}}>
              <RoomComponent id='M03' allclass={`room`} currentTime={currentTime} updateRoomStatus={updateRoomStatus} data={RoomCheck('M03')}/>
            </Link>
            </foreignObject>
            {/* 205 */}
            <rect x="1" y="553" width="146" height="165" fill="white" stroke="black"/>
            <foreignObject x="1" y="553" width="146" height="165">
            <Link to="/RoomDescription/M03" style={{textDecoration:'none', color:'black'}}>
              <RoomComponent id='M03' allclass={`room`} currentTime={currentTime} updateRoomStatus={updateRoomStatus} data={RoomCheck('M03')}/>
            </Link>
            </foreignObject>
            {/* 207 */}
            <rect x="1" y="357" width="146" height="196" fill="white" stroke="black"/>
            <foreignObject x="1" y="357" width="146" height="196">
            <Link to="/RoomDescription/M03" style={{textDecoration:'none', color:'black'}}>
              <RoomComponent id='M03' allclass={`room`} currentTime={currentTime} updateRoomStatus={updateRoomStatus} data={RoomCheck('M03')}/>
            </Link>
            </foreignObject>

            {/* 223 */}
            <rect x="364" y="791" width="145" height="123" fill="white" stroke="black"/>
            <foreignObject x="364" y="791" width="145" height="123">
            <Link to="/RoomDescription/M03" style={{textDecoration:'none', color:'black'}}>
              <RoomComponent id='M03' allclass={`room`} currentTime={currentTime} updateRoomStatus={updateRoomStatus} data={RoomCheck('M03')}/>
            </Link>
            </foreignObject>
            {/* 224 */}
            <rect x="364" y="706" width="145" height="85" fill="white" stroke="black"/>
            <foreignObject x="364" y="706" width="145" height="85">
            <Link to="/RoomDescription/M03" style={{textDecoration:'none', color:'black'}}>
              <RoomComponent id='M03' allclass={`room`} currentTime={currentTime} updateRoomStatus={updateRoomStatus} data={RoomCheck('M03')}/>
            </Link>
            </foreignObject>
            {/* 225 */}
            <rect x="364" y="621" width="145" height="85" fill="white" stroke="black"/>
            <foreignObject x="364" y="621" width="145" height="85">
            <Link to="/RoomDescription/M03" style={{textDecoration:'none', color:'black'}}>
              <RoomComponent id='M03' allclass={`room`} currentTime={currentTime} updateRoomStatus={updateRoomStatus} data={RoomCheck('M03')}/>
            </Link>
            </foreignObject>
            {/* 226 */}
            <rect x="364" y="498" width="145" height="123" fill="white" stroke="black"/>
            <foreignObject x="364" y="498" width="145" height="123">
            <Link to="/RoomDescription/M03" style={{textDecoration:'none', color:'black'}}>
              <RoomComponent id='M03' allclass={`room`} currentTime={currentTime} updateRoomStatus={updateRoomStatus} data={RoomCheck('M03')}/>
            </Link>
            </foreignObject>
            {/* 227 */}
            <rect x="431" y="442" width="78" height="56" fill="white" stroke="black"/>
            <foreignObject x="431" y="442" width="77.5" height="56">
            <Link to="/RoomDescription/M03" style={{textDecoration:'none', color:'black'}}>
              <RoomComponent id='M03' allclass={`room`} currentTime={currentTime} updateRoomStatus={updateRoomStatus} data={RoomCheck('M03')}/>
            </Link>
            </foreignObject>
            {/* 209 */}
            <rect x="1" y="287.5" width="146" height="70" fill="white" stroke="black"/>
            <foreignObject x="1" y="287.5" width="146" height="70">
            <Link to="/RoomDescription/M03" style={{textDecoration:'none', color:'black'}}>
              <RoomComponent id='M03' allclass={`room`} currentTime={currentTime} updateRoomStatus={updateRoomStatus} data={RoomCheck('M03')}/>
            </Link>
            </foreignObject>
            {/* 212 */}
            <rect x="39" y="250" width="108" height="37" fill="white" stroke="black"/>
            <foreignObject x="39" y="250" width="108" height="37">
            <Link to="/RoomDescription/M03" style={{textDecoration:'none', color:'black'}}>
              <RoomComponent id='M03' allclass={`room`} currentTime={currentTime} updateRoomStatus={updateRoomStatus} data={RoomCheck('M03')}/>
            </Link>
            </foreignObject>
            {/* 213 */}
            <rect x="39.4646" y="190.992" width="107.235" height="37.2991" fill="white" stroke="black"/>
            <foreignObject x="39.4646" y="190.992" width="107.235" height="37.2991">
            <Link to="/RoomDescription/M03" style={{textDecoration:'none', color:'black'}}>
              <RoomComponent id='M03' allclass={`room`} currentTime={currentTime} updateRoomStatus={updateRoomStatus} data={RoomCheck('M03')}/>
            </Link>
            </foreignObject>
            {/* 218 */}
            <rect x="177.005" y="738.822" width="79.2605" height="97.9101" fill="white" stroke="black"/>
            <foreignObject x="177.005" y="738.822" width="79.2605" height="97.9101">
            <Link to="/RoomDescription/M03" style={{textDecoration:'none', color:'black'}}>
              <RoomComponent id='M03' allclass={`room`} currentTime={currentTime} updateRoomStatus={updateRoomStatus} data={RoomCheck('M03')}/>
            </Link>
            </foreignObject>
            {/* 219 */}
            <rect x="177.005" y="643.244" width="79.2605" height="95.5789" fill="white" stroke="black"/>
            <foreignObject x="177.005" y="643.244" width="79.2605" height="95.5789">
            <Link to="/RoomDescription/M03" style={{textDecoration:'none', color:'black'}}>
              <RoomComponent id='M03' allclass={`room`} currentTime={currentTime} updateRoomStatus={updateRoomStatus} data={RoomCheck('M03')}/>
            </Link>
            </foreignObject>
            {/* 219 */}
            <rect x="256.266" y="680.543" width="78.0949" height="52.4518" fill="white" stroke="black"/>
            <foreignObject x="256.266" y="680.543" width="78.0949" height="52.4518">
            <Link to="/RoomDescription/M03" style={{textDecoration:'none', color:'black'}}>
              <RoomComponent id='M03' allclass={`room`} currentTime={currentTime} updateRoomStatus={updateRoomStatus} data={RoomCheck('M03')}/>
            </Link>
            </foreignObject>
            {/* 219 */}
            <rect x="256.266" y="732.994" width="78.0949" height="51.2862" fill="white" stroke="black"/>
            <foreignObject x="256.266" y="732.994" width="78.0949" height="51.2862">
            <Link to="/RoomDescription/M03" style={{textDecoration:'none', color:'black'}}>
              <RoomComponent id='M03' allclass={`room`} currentTime={currentTime} updateRoomStatus={updateRoomStatus} data={RoomCheck('M03')}/>
            </Link>
            </foreignObject>
            {/* 219 */}
            <rect x="256.266" y="784.281" width="78.0949" height="52.4518" fill="white" stroke="black"/>
            <foreignObject x="256.266" y="784.281" width="78.0949" height="52.4518">
            <Link to="/RoomDescription/M03" style={{textDecoration:'none', color:'black'}}>
              <RoomComponent id='M03' allclass={`room`} currentTime={currentTime} updateRoomStatus={updateRoomStatus} data={RoomCheck('M03')}/>
            </Link>
            </foreignObject>
            <rect x="174.674" y="913.662" width="2.33119" height="39.6303" fill="white" stroke="black"/>
            <path d="M177.123 954.414H146.713V951.861H177.123V954.414Z" fill="white"/>
            <path d="M177.123 954.414V954.914H177.623V954.414H177.123ZM146.713 954.414H146.213V954.914H146.713V954.414ZM177.123 953.914H146.713V954.914H177.123V953.914ZM147.213 954.414V951.861H146.213V954.414H147.213ZM176.623 951.861V954.414H177.623V951.861H176.623Z" fill="black"/>
            <mask id="path-4-inside-1_42_11" fill="white">
            <path d="M175.222 952.499H146.079V951.222H175.222V952.499Z"/>
            </mask>
            <path d="M175.222 952.499H146.079V951.222H175.222V952.499Z" fill="white"/>
            <path d="M146.079 952.222H175.222V950.222H146.079V952.222Z" fill="black" mask="url(#path-4-inside-1_42_11)"/>
            <rect x="70.6887" y="916.113" width="76.0241" height="38.3004" fill="white" stroke="black"/>
            <path d="M177.123 954.414H146.713V951.861H177.123V954.414Z" fill="white"/>
            <path d="M177.123 954.414V954.914H177.623V954.414H177.123ZM146.713 954.414H146.213V954.914H146.713V954.414ZM177.123 953.914H146.713V954.914H177.123V953.914ZM147.213 954.414V951.861H146.213V954.414H147.213ZM176.623 951.861V954.414H177.623V951.861H176.623Z" fill="black"/>
            <mask id="path-9-inside-2_42_11" fill="white">
            <path d="M175.222 952.499H146.079V951.222H175.222V952.499Z"/>
            </mask>
            <path d="M175.222 952.499H146.079V951.222H175.222V952.499Z" fill="white"/>
            <path d="M146.079 952.222H175.222V950.222H146.079V952.222Z" fill="black" mask="url(#path-9-inside-2_42_11)"/>
            <rect x="70.6887" y="916.113" width="76.0241" height="38.3004" fill="white" stroke="black"/>
            <path d="M175.839 910.165H363.5V913.662H175.839V910.165Z" fill="white"/>
            <path d="M363.5 913.162H175.839V914.162H363.5V913.162Z" fill="black"/>
            <path d="M175.839 910.165H363.5V913.662H175.839V910.165Z" fill="white"/>
            <path d="M363.5 913.162H175.839V914.162H363.5V913.162Z" fill="black"/>
            <path d="M1 228.291H25.4775V250.438H1V228.291Z" fill="white"/>
            <path d="M1.5 250.438V228.291H0.5V250.438H1.5Z" fill="black"/>
            <rect x="1" y="190.992" width="38.4647" height="37.2991" fill="white" stroke="black"/>
            <rect x="1" y="250" width="38" height="37" fill="white" stroke="black"/>
            <rect x="255.1" y="876.363" width="38.4647" height="37.2991" fill="white" stroke="black"/>
            <rect x="217.801" y="876.363" width="37.2991" height="37.2991" fill="white" stroke="black"/>
            <path d="M236 442H509V440H236V442Z" fill="white"/>
            <path d="M236 441.5H509V442.5H236V441.5Z" fill="black"/>
            <rect x="256.266" y="643.244" width="38.4647" height="37.2991" fill="white" stroke="black"/>
            <rect x="294.73" y="643.244" width="39.6303" height="37.2991" fill="white" stroke="black"/>
            <rect x="146.699" y="190.992" width="145.7" height="94.4133" transform="rotate(-180 146.699 190.992)" fill="white" stroke="black"/>
            <rect x="146.699" y="96.5789" width="145.7" height="95.5789" transform="rotate(-180 146.699 96.5789)" fill="white" stroke="black"/>
            <rect x="187" y="367" width="63" height="40" fill="white" stroke="black"/>
            <rect x="187" y="287" width="63" height="80" fill="white" stroke="black"/>
            <rect x="187" y="407" width="31.4711" height="34.9679" fill="white" stroke="black"/>
            <rect x="217.306" y="407" width="32.6367" height="34.9679" fill="white" stroke="black"/>
            <rect x="292.209" y="493.798" width="3.8012" height="90.6443" fill="white" stroke="black"/>
            <rect x="252.93" y="492.522" width="3.8012" height="54.8972" fill="white" stroke="black"/>
            <rect x="217.452" y="541.036" width="35.4779" height="6.3834" fill="white" stroke="black"/>
            <rect x="217.452" y="535.929" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="217.452" y="529.546" width="35.4779" height="6.3834" fill="white" stroke="black"/>
            <rect x="217.452" y="525.715" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="217.452" y="520.609" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="217.452" y="515.502" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="217.452" y="510.395" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="217.452" y="505.289" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="217.452" y="500.182" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="217.452" y="495.075" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="256.731" y="541.036" width="35.4779" height="6.3834" fill="white" stroke="black"/>
            <rect x="256.731" y="535.929" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="256.731" y="529.546" width="35.4779" height="6.3834" fill="white" stroke="black"/>
            <rect x="256.731" y="524.439" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="256.731" y="518.055" width="35.4779" height="6.3834" fill="white" stroke="black"/>
            <rect x="256.731" y="512.949" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="256.731" y="506.565" width="35.4779" height="6.3834" fill="white" stroke="black"/>
            <rect x="256.731" y="501.459" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="256.731" y="495.075" width="35.4779" height="6.3834" fill="white" stroke="black"/>
            <rect x="213.651" y="492.522" width="3.8012" height="91.921" fill="white" stroke="black"/>
            <path d="M252.93 492.522H296.01V495.075H252.93V492.522Z" fill="white"/>
            <path d="M252.93 492.522V492.022H252.43V492.522H252.93ZM296.01 492.522H296.51V492.022H296.01V492.522ZM252.93 493.022H296.01V492.022H252.93V493.022ZM295.51 492.522V495.075H296.51V492.522H295.51ZM253.43 495.075V492.522H252.43V495.075H253.43Z" fill="black"/>
            <path d="M252.93 492.522H296.01V495.075H252.93V492.522Z" fill="white"/>
            <path d="M252.93 492.522V492.022H252.43V492.522H252.93ZM296.01 492.522H296.51V492.022H296.01V492.522ZM252.93 493.022H296.01V492.022H252.93V493.022ZM295.51 492.522V495.075H296.51V492.522H295.51ZM253.43 495.075V492.522H252.43V495.075H253.43Z" fill="black"/>
            <rect x="217.452" y="547.419" width="74.757" height="37.0237" fill="white" stroke="black"/>
            <path d="M296.01 584.443H213.651V581.889H296.01V584.443Z" fill="white"/>
            <path d="M296.01 584.443V584.943H296.51V584.443H296.01ZM213.651 584.443H213.151V584.943H213.651V584.443ZM296.01 583.943H213.651V584.943H296.01V583.943ZM214.151 584.443V581.889H213.151V584.443H214.151ZM295.51 581.889V584.443H296.51V581.889H295.51Z" fill="black"/>
            <mask id="path-77-inside-3_42_11" fill="white">
            <path d="M292.209 583.166H217.452V580.613H292.209V583.166Z"/>
            </mask>
            <path d="M292.209 583.166H217.452V580.613H292.209V583.166Z" fill="white"/>
            <path d="M217.452 581.613H292.209V579.613H217.452V581.613Z" fill="black" mask="url(#path-77-inside-3_42_11)"/>
            <mask id="path-79-inside-4_42_11" fill="white">
            <path d="M256.731 493.798H292.209V496.352H256.731V493.798Z"/>
            </mask>
            <path d="M256.731 493.798H292.209V496.352H256.731V493.798Z" fill="white"/>
            <path d="M292.209 495.352H256.731V497.352H292.209V495.352Z" fill="black" mask="url(#path-79-inside-4_42_11)"/>
            <rect x="187" y="1" width="2" height="286" fill="white" stroke="black"/>
            <path d="M147 1L189 1V3L147 3V1Z" fill="white"/>
            <path d="M147 1V0.5L146.5 0.5V1L147 1ZM189 1H189.5V0.5L189 0.5V1ZM147 1.5L189 1.5V0.5L147 0.5V1.5ZM188.5 1V3L189.5 3V1H188.5ZM147.5 3V1L146.5 1V3H147.5Z" fill="black"/>
            <path d="M147 3H187V287H147V3Z" fill="white" stroke="black"/>
            <rect x="146.8" y="3.5" width="40" height="55" fill="white" stroke="black"/>
            </svg>

        <div>
            <h1 className='floorNumber'>FLOOR 1</h1>
            <h4>นี่เวลา</h4>
            {/* <h4>{currentTime.format('LLLL')}</h4> */}
        </div>
        </div>
        
    )
}

export default Floor2