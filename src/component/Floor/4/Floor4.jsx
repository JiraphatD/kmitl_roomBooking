import React, { useState, useEffect, useContext, useCallback } from 'react';
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
import { HomeContext } from '../../Home';
import { TouchContext } from '../../TV_TouchScreen/TVTouch';


function Floor4() {
  useEffect(() => {
    setTimeout(()=>{
      if(roomUpdateArray.length != 0){
        updateRoomStatus(roomUpdateArray)
        // console.log('yippi')
        // console.log(roomUpdateArray)
      }
    }, 1000)
  });
  const { roomDB, linkBookDB, searchQuery, isSelect, currentTime, GeneralRoom, updateRoomStatus } = useContext(HomeContext);
  const { Touch } = useContext(TouchContext);

  const RoomSVG = [
    { id: '403', x: 1, y: 797, width: 146, height: 120, room_type:'sroom'},{ id: '404', x: 1, y: 677, width: 146, height: 120, room_type:'sroom'},

    { id: '406', x: 1, y: 557, width: 146, height: 120, room_type:'sroom'},{ id: '410', x: 1, y: 407, width: 146, height: 150, room_type:'lroom'},
    { id: '412', x: 1, y: 307, width: 146, height: 100, room_type:'lroom'},
    { id: '416', x: 1, y: 102, width: 146, height: 100, room_type:'lroom'},{ id: '418', x: 1, y: 1, width: 146, height: 101, room_type:'lroom'},
    { id: '424', x: 188, y: 653, width: 140, height: 184, room_type:'lroom'},{ id: '426', x: 188, y: 469, width: 140, height: 184, room_type:'lroom'},
    { id: '427', x: 256, y: 389, width: 72, height: 80, room_type:'lroom'},{ id: '428', x: 256, y: 309, width: 72, height: 80, room_type:'lroom'},
    { id: '430', x: 364, y: 838, width: 146, height: 76, room_type:'lroom'},
    { id: '431', x: 364, y: 762, width: 146, height: 76, room_type:'lroom'},{ id: '432', x: 364, y: 662, width: 146, height: 100, room_type:'sroom'},
    { id: '433', x: 364, y: 562, width: 146, height: 100, room_type:'sroom'},{ id: '434', x: 364, y: 462, width: 146, height: 100, room_type:'sroom'},
    { id: '435', x: 364, y: 362, width: 146, height: 100, room_type:'sroom'},{ id: '436', x: 364, y: 262, width: 146, height: 100, room_type:'sroom'},
    { id: '437', x: 340, y: 132, width: 170, height: 130, room_type:'lroom'},{ id: '439', x: 250, y: 132, width: 90, height: 65, room_type:'lroom'},
    { id: '438', x: 250, y: 197, width: 90, height: 65, room_type:'lroom'},

    // UX UI LAB 412?
    // <rect x="1" y="307" width="146" height="100" fill="white" stroke="black"/>

  ]
  const roomUpdateArray = [];
  const StatusCheck = (id) => {
    const BookingData = linkBookDB.filter(item => item.room_id === id);
    if(linkBookDB.filter(item => item.room_id === id)[0] != null){
        let status = 'Available'
        for(const data of BookingData){
          // console.log(data,":",status)
          const startTime = moment(data.check_in_datetime);
          const endTime = moment(data.check_out_datetime);
          if (currentTime.isBetween(startTime, endTime) && data.approvement.is_approved === true) {
            status = 'Active';
          }
          if( status != data.room.room_status){
            updateArrayValue(roomUpdateArray, id, status);
          }
        }
        return status;
      }
  }
  //fill data to RoomComponent
  const RoomCheck = (id) => {
    return roomDB.filter(item => item.id === id);
  };
  const BookingCheck = (id) => {
    return linkBookDB.filter(item => item.room_id === id);
  };
  const createRoomRect = useCallback((room) => <RoomRect key={room.id} room={room} />, [roomDB]);
  
  const RoomRect = React.memo(({ room }) => {
    const [rectFillColor, setRectFillColor] = useState('white');
    // สี
    useEffect(() => {
      const updateRoomColor = () =>{
        if (document.getElementById(room.id) != null) {
          const element = document.getElementById(room.id);
          if (element) {
            const hasNoUseClass = element.classList.contains('use');
            let newColor = hasNoUseClass ? '#E74C3C' : '#DAF7A6';
            if(GeneralRoom.includes(room.id)){newColor = 'white'; }
            // if(element.classList.contains('selectedRoom')){newColor = 'lightblue';}
            // console.log(newColor)
            setRectFillColor(newColor);
          }
        }
      }
      setTimeout(updateRoomColor, 0);
    }, [room]);

    if (GeneralRoom.includes(room.id)) {
      return (
        <g>
          <rect x={room.x} y={room.y} width={room.width} height={room.height} className="color-transition" fill={rectFillColor} stroke="black"/>
          <foreignObject x={room.x} y={room.y} width={room.width} height={room.height}>
            <RoomComponent id={room.id} allclass={`${room.room_type}`} status={StatusCheck(room.id)} roomData={RoomCheck(room.id)} bookingData={BookingCheck(room.id)} />
          </foreignObject>
        </g>
      );
    } else {
      return (
        <g>
          <rect x={room.x} y={room.y} width={room.width} height={room.height} className="color-transition" fill={rectFillColor} stroke="black"/>
          <foreignObject x={room.x} y={room.y} width={room.width} height={room.height}>
          {Touch ? (
              <>
                <Link to={`/Touch/RoomDescription/${room.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                  <RoomComponent id={room.id} allclass={`${room.room_type}`} status={StatusCheck(room.id)} roomData={RoomCheck(room.id)} bookingData={BookingCheck(room.id)} />
                </Link>
              </>
            ):(
              <>
                <Link to={`/RoomDescription/${room.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                  <RoomComponent id={room.id} allclass={`${room.room_type}`} status={StatusCheck(room.id)} roomData={RoomCheck(room.id)} bookingData={BookingCheck(room.id)} />
                </Link>
              </>
            )}
          </foreignObject>
        </g>
      );
    }

  });
  
  const updateArrayValue = (arr, key, newValue) => {
    const index = roomUpdateArray.findIndex(item => item[0] === key);
    if (index !== -1) {
      // If the key exists, update the value
      roomUpdateArray[index][1] = newValue;
    } else {
      // If the key doesn't exist, add a new key-value pair
      roomUpdateArray.push([key, newValue]);
    }
    // console.log(roomUpdateArray)
    return roomUpdateArray;
    
  };
    return (
      <>
      {/* <div className='floorNumber'>
          <h1>FLOOR 4</h1>
          <h4>{currentTime.format('LLLL')}</h4>
      </div> */}
      <div className='map'>
          <svg className='svg_map2' width="511" height="955" viewBox="0 0 511 955" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M175.839 910.165H363.5V913.662H175.839V910.165Z" fill="white"/>

            {RoomSVG.map(createRoomRect)}
            <rect x="174.674" y="913.662" width="2.33119" height="39.6303" fill="white" stroke="black"/>
            <path d="M177.123 954.414H146.713V951.861H177.123V954.414Z" fill="white"/>
            <path d="M177.123 954.414V954.914H177.623V954.414H177.123ZM146.713 954.414H146.213V954.914H146.713V954.414ZM177.123 953.914H146.713V954.914H177.123V953.914ZM147.213 954.414V951.861H146.213V954.414H147.213ZM176.623 951.861V954.414H177.623V951.861H176.623Z" fill="black"/>
            <mask id="path-4-inside-1_18_2" fill="white">
            <path d="M175.222 952.499H146.079V951.222H175.222V952.499Z"/>
            </mask>
            <path d="M175.222 952.499H146.079V951.222H175.222V952.499Z" fill="white"/>
            <path d="M146.079 952.222H175.222V950.222H146.079V952.222Z" fill="black" mask="url(#path-4-inside-1_18_2)"/>
            <path d="M177.123 954.414H146.713V951.861H177.123V954.414Z" fill="white"/>
            <path d="M177.123 954.414V954.914H177.623V954.414H177.123ZM146.713 954.414H146.213V954.914H146.713V954.414ZM177.123 953.914H146.713V954.914H177.123V953.914ZM147.213 954.414V951.861H146.213V954.414H147.213ZM176.623 951.861V954.414H177.623V951.861H176.623Z" fill="black"/>
            <mask id="path-9-inside-2_18_2" fill="white">
            <path d="M175.222 952.499H146.079V951.222H175.222V952.499Z"/>
            </mask>
            <path d="M175.222 952.499H146.079V951.222H175.222V952.499Z" fill="white"/>
            <path d="M146.079 952.222H175.222V950.222H146.079V952.222Z" fill="black" mask="url(#path-9-inside-2_18_2)"/>
            <path d="M363.5 913.162H175.839V914.162H363.5V913.162Z" fill="black"/>
            <path d="M175.839 910.165H363.5V913.662H175.839V910.165Z" fill="white"/>
            <path d="M363.5 913.162H175.839V914.162H363.5V913.162Z" fill="black"/>
            <path d="M1 239H25V270H1V239Z" fill="white"/>
            <path d="M1.5 270V239H0.5V270H1.5Z" fill="black"/>
            <rect x="1" y="270" width="38" height="37" fill="white" stroke="black"/>
            <rect x="217.801" y="876.363" width="37.2991" height="37.2991" fill="white" stroke="black"/>
              <foreignObject x="217.801" y="876.363" width="37.2991" height="37.2991">
              <div id='womanToilet1' className={`cube bgcolor-transition ${isSelect === "toilet" ? "categorized" : ""}`}> 
                <Woman2Icon fontSize='large'/>
              </div>
              </foreignObject>
              <rect x="255.1" y="876.363" width="38.4647" height="37.2991" fill="white" stroke="black"/>
              <foreignObject x="255.1" y="876.363" width="38.4647" height="37.2991">
              <div id='menToilet1' className={`cube bgcolor-transition ${isSelect === "toilet" ? "categorized" : ""}`}>
                <Man2Icon fontSize='large'/>
              </div>
              </foreignObject>
            <rect x="187" y="132" width="63" height="95" fill="white" stroke="black"/>
            <rect x="39" y="270" width="108" height="37" fill="white" stroke="black"/>
            <rect x="1" y="202" width="38" height="37" fill="white" stroke="black"/>
            <rect x="39" y="202" width="108" height="37" fill="white" stroke="black"/>
            {/* <path d="M189 134H509V132H189V134Z" fill="white"/> */}
            {/* <path d="M189 133.5H509V134.5H189V133.5Z" fill="black"/> */}
            <rect x="187" y="1" width="2" height="133" fill="white" stroke="black"/>
            <rect x="251.558" y="351.277" width="3.8012" height="90.6443" fill="white" stroke="black"/>
            <rect x="212.279" y="350" width="3.8012" height="54.8972" fill="white" stroke="black"/>
            <rect x="176.801" y="398.514" width="35.4779" height="6.3834" fill="white" stroke="black"/>
            <rect x="176.801" y="393.407" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="176.801" y="387.024" width="35.4779" height="6.3834" fill="white" stroke="black"/>
            <rect x="176.801" y="383.194" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="176.801" y="378.087" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="176.801" y="372.98" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="176.801" y="367.874" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="176.801" y="362.767" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="176.801" y="357.66" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="176.801" y="352.553" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="216.081" y="398.514" width="35.4779" height="6.3834" fill="white" stroke="black"/>
            <rect x="216.081" y="393.407" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="216.081" y="387.024" width="35.4779" height="6.3834" fill="white" stroke="black"/>
            <rect x="216.081" y="381.917" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="216.081" y="375.534" width="35.4779" height="6.3834" fill="white" stroke="black"/>
            <rect x="216.081" y="370.427" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="216.081" y="364.043" width="35.4779" height="6.3834" fill="white" stroke="black"/>
            <rect x="216.081" y="358.937" width="35.4779" height="5.10672" fill="white" stroke="black"/>
            <rect x="216.081" y="352.553" width="35.4779" height="6.3834" fill="white" stroke="black"/>
            <rect x="173" y="350" width="3.8012" height="91.921" fill="white" stroke="black"/>
            <path d="M212.279 350H255.36V352.553H212.279V350Z" fill="white"/>
            <path d="M212.279 350V349.5H211.779V350H212.279ZM255.36 350H255.86V349.5H255.36V350ZM212.279 350.5H255.36V349.5H212.279V350.5ZM254.86 350V352.553H255.86V350H254.86ZM212.779 352.553V350H211.779V352.553H212.779Z" fill="black"/>
            <path d="M212.279 350H255.36V352.553H212.279V350Z" fill="white"/>
            <path d="M212.279 350V349.5H211.779V350H212.279ZM255.36 350H255.86V349.5H255.36V350ZM212.279 350.5H255.36V349.5H212.279V350.5ZM254.86 350V352.553H255.86V350H254.86ZM212.779 352.553V350H211.779V352.553H212.779Z" fill="black"/>
            <rect x="176.801" y="404.897" width="74.757" height="37.0237" fill="white" stroke="black"/>
            <path d="M255.359 441.921H173V439.368H255.359V441.921Z" fill="white"/>
            <path d="M255.359 441.921V442.421H255.859V441.921H255.359ZM173 441.921H172.5V442.421H173V441.921ZM255.359 441.421H173V442.421H255.359V441.421ZM173.5 441.921V439.368H172.5V441.921H173.5ZM254.859 439.368V441.921H255.859V439.368H254.859Z" fill="black"/>
            <mask id="path-79-inside-3_18_2" fill="white">
            <path d="M251.558 440.644H176.801V438.091H251.558V440.644Z"/>
            </mask>
            <path d="M251.558 440.644H176.801V438.091H251.558V440.644Z" fill="white"/>
            <path d="M176.801 439.091H251.558V437.091H176.801V439.091Z" fill="black" mask="url(#path-79-inside-3_18_2)"/>
            <mask id="path-81-inside-4_18_2" fill="white">
            <path d="M216.081 351.277H251.558V353.83H216.081V351.277Z"/>
            </mask>
            <path d="M216.081 351.277H251.558V353.83H216.081V351.277Z" fill="white"/>
            <path d="M251.558 352.83H216.081V354.83H251.558V352.83Z" fill="black" mask="url(#path-81-inside-4_18_2)"/>
            {/* Lift */}
            <rect x="187" y="227" width="31.4711" height="34.9679" fill="white" stroke="black"/>
            <foreignObject x="187" y="227" width="31.4711" height="34.9679">
            <div id="elevator1" className="cube">
              <ElevatorIcon fontSize='large' />
            </div>
          </foreignObject>
            <rect x="217.306" y="227" width="32.6367" height="34.9679" fill="white" stroke="black"/>
            <foreignObject x="217.306" y="227" width="32.6367" height="34.9679">
            <div id="elevator1" className="cube">
              <ElevatorIcon fontSize='large' />
            </div>
          </foreignObject>
            {/* Fire Exit */}
            <rect x="147" y="1" width="40" height="40" fill="white" stroke="black"/>
            <foreignObject x="147" y="1" width="40" height="40">
              <div id="exit" className='cube center'>
                <DirectionsRunIcon fontSize='large' />
              </div>
            </foreignObject>
            <rect x="107" y="917" width="40" height="38" fill="white" stroke="black"/>
            <foreignObject x="107" y="917" width="40" height="38">
              <div id="exit" className='cube center'>
                <DirectionsRunIcon fontSize='large' />
              </div>
            </foreignObject>
            {/* Toilet  */}
            <rect x="1" y="270" width="38" height="37" fill="white" stroke="black"/>
              <foreignObject x="1" y="270" width="38" height="37">
              <div id='womanToilet1' className={`cube bgcolor-transition ${isSelect === "toilet" ? "categorized" : ""}`}> 
                <Woman2Icon fontSize='large'/>
              </div>
              </foreignObject>
              <rect x="1" y="202" width="38" height="37" fill="white" stroke="black"/>
              <foreignObject x="1" y="202" width="38" height="37">
              <div id='menToilet1' className={`cube bgcolor-transition ${isSelect === "toilet" ? "categorized" : ""}`}>
                <Man2Icon fontSize='large'/>
              </div>
              </foreignObject>
            </svg>
      </div>
        </>
        
    )
}

export default Floor4