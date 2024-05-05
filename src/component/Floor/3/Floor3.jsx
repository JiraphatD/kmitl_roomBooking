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


const Floor3 = () => {
  useEffect(() => {
    setTimeout(()=>{
      if(roomUpdateArray.length != 0){
        updateRoomStatus(roomUpdateArray)
      }
    }, 1000)
  });
  const { roomDB, linkBookDB, searchQuery, isSelect, currentTime, GeneralRoom, updateRoomStatus } = useContext(HomeContext);
  const { Touch } = useContext(TouchContext);

  const RoomSVG = [
    { id: '304', x: 1, y: 746.5, width: 146, height: 169, room_type:'room'},{ id: '306', x: 1, y: 577, width: 146, height: 170, room_type:'room'},
    { id: '308', x: 1, y: 407, width: 146, height: 170, room_type:'room'},{ id: '310', x: 1, y: 307, width: 146, height: 100, room_type:'lroom'},
    { id: '316', x: 1, y: 102, width: 146, height: 101, room_type:'room'},{ id: '317', x: 1, y: 1, width: 146, height: 101, room_type:'room'},
    { id: 'Project Base3', x: 364, y: 736, width: 146, height: 178, room_type:'room'},
    // { id: '329', x: 930, y: 818, width: 145, height: 140, room_type:'room'},{ id: '330', x: 930, y: 718, width: 145, height: 100, room_type:'room'},
    { id: '331', x: 364, y: 595, width: 146, height: 142, room_type:'lroom'},{ id: '332', x: 364, y: 453, width: 146, height: 142, room_type:'lroom'},
    { id: '333', x: 364, y: 312, width: 146, height: 142, room_type:'room'},

    { id: 'Project Base4', x: 364, y: 134, width: 146, height: 178, room_type:'room'},
    // { id: '334', x: 930, y: 318, width: 145, height: 100, room_type:'room'},{ id: '335', x: 930, y: 178, width: 145, height: 140, room_type:'room'},
    { id: '320', x: 744, y: 781, width: 79, height: 100, room_type:'room'},
    { id: '321', x: 823, y: 781, width: 79, height: 100, room_type:'sroom'},{ id: '322', x: 257, y: 607, width: 79, height: 80, room_type:'lroom'},
    { id: '325', x: 257, y: 367, width: 79, height: 80, room_type:'lroom'},{ id: '324', x: 257, y: 447, width: 79, height: 80, room_type:'lroom'},
    { id: '323', x: 257, y: 527, width: 79, height: 80, room_type:'lroom'},
      // seed 328
    { id: '328', x: 254, y: 179, width: 79, height: 130, room_type:'sroom'},
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
            <h1>FLOOR 3</h1>
            <h4>{currentTime.format('LLLL')}</h4>6" height="17
      </div> */}
      <div className='map'>
      <svg className='svg_map3' width="511" height="957" viewBox="0 0 511 957" fill="none" xmlns="http://www.w3.org/2000/svg">
      {RoomSVG.map(createRoomRect)}
      
      <rect x="175" y="913.65" width="2" height="42" fill="white" stroke="black"/>
      <path d="M177 956H147V954H177V956Z" fill="white"/>
      <path d="M177 956V956.5H177.5V956H177ZM147 956H146.5V956.5H147V956ZM177 955.5H147V956.5H177V955.5ZM147.5 956V954H146.5V956H147.5ZM176.5 954V956H177.5V954H176.5Z" fill="black"/>
      <mask id="path-5-inside-1_117_5" fill="white">
      <path d="M175.5 954.5H147V953.5H175.5V954.5Z"/>
      </mask>
      <path d="M175.5 954.5H147V953.5H175.5V954.5Z" fill="white"/>
      <path d="M147 954.5H175.5V952.5H147V954.5Z" fill="black" mask="url(#path-5-inside-1_117_5)"/>
      <path d="M175.839 910.165H363.5V913.662H175.839V910.165Z" fill="white"/>
      <path d="M363.5 913.162H175.839V914.162H363.5V913.162Z" fill="black"/>
      <path d="M175.839 910.165H363.5V913.662H175.839V910.165Z" fill="white"/>
      <path d="M363.5 913.162H175.839V914.162H363.5V913.162Z" fill="black"/>
      <path d="M1 239H25V270H1V239Z" fill="white"/>
      <path d="M1.5 270V239H0.5V270H1.5Z" fill="black"/>
      <rect x="178" y="736.756" width="79.2605" height="100" fill="white" stroke="black"/>
      <rect x="257" y="737" width="79" height="100" fill="white" stroke="black"/>
      <rect x="191" y="179" width="63" height="95" fill="white" stroke="black"/>
      <rect x="39" y="270" width="108" height="37" fill="white" stroke="black"/>
      <rect x="39" y="202" width="108" height="37" fill="white" stroke="black"/>
      <rect x="253.558" y="443.277" width="3.8012" height="90.6443" fill="white" stroke="black"/>
      <rect x="214.279" y="442" width="3.8012" height="54.8972" fill="white" stroke="black"/>
      <rect x="178.801" y="490.514" width="35.4779" height="6.3834" fill="white" stroke="black"/>
      <rect x="178.801" y="485.407" width="35.4779" height="5.10672" fill="white" stroke="black"/>
      <rect x="178.801" y="479.024" width="35.4779" height="6.3834" fill="white" stroke="black"/>
      <rect x="178.801" y="475.194" width="35.4779" height="5.10672" fill="white" stroke="black"/>
      <rect x="178.801" y="470.087" width="35.4779" height="5.10672" fill="white" stroke="black"/>
      <rect x="178.801" y="464.98" width="35.4779" height="5.10672" fill="white" stroke="black"/>
      <rect x="178.801" y="459.874" width="35.4779" height="5.10672" fill="white" stroke="black"/>
      <rect x="178.801" y="454.767" width="35.4779" height="5.10672" fill="white" stroke="black"/>
      <rect x="178.801" y="449.66" width="35.4779" height="5.10672" fill="white" stroke="black"/>
      <rect x="178.801" y="444.553" width="35.4779" height="5.10672" fill="white" stroke="black"/>
      <rect x="218.08" y="490.514" width="35.4779" height="6.3834" fill="white" stroke="black"/>
      <rect x="218.08" y="485.407" width="35.4779" height="5.10672" fill="white" stroke="black"/>
      <rect x="218.08" y="479.024" width="35.4779" height="6.3834" fill="white" stroke="black"/>
      <rect x="218.08" y="473.917" width="35.4779" height="5.10672" fill="white" stroke="black"/>
      <rect x="218.08" y="467.534" width="35.4779" height="6.3834" fill="white" stroke="black"/>
      <rect x="218.08" y="462.427" width="35.4779" height="5.10672" fill="white" stroke="black"/>
      <rect x="218.08" y="456.043" width="35.4779" height="6.3834" fill="white" stroke="black"/>
      <rect x="218.08" y="450.937" width="35.4779" height="5.10672" fill="white" stroke="black"/>
      <rect x="218.08" y="444.553" width="35.4779" height="6.3834" fill="white" stroke="black"/>
      <rect x="175" y="442" width="3.8012" height="91.921" fill="white" stroke="black"/>
      <path d="M214.279 442H257.359V444.553H214.279V442Z" fill="white"/>
      <path d="M214.279 442V441.5H213.779V442H214.279ZM257.359 442H257.859V441.5H257.359V442ZM214.279 442.5H257.359V441.5H214.279V442.5ZM256.859 442V444.553H257.859V442H256.859ZM214.779 444.553V442H213.779V444.553H214.779Z" fill="black"/>
      <path d="M214.279 442H257.359V444.553H214.279V442Z" fill="white"/>
      <path d="M214.279 442V441.5H213.779V442H214.279ZM257.359 442H257.859V441.5H257.359V442ZM214.279 442.5H257.359V441.5H214.279V442.5ZM256.859 442V444.553H257.859V442H256.859ZM214.779 444.553V442H213.779V444.553H214.779Z" fill="black"/>
      <rect x="178.801" y="496.897" width="74.757" height="37.0237" fill="white" stroke="black"/>
      <path d="M257.359 533.921H175V531.368H257.359V533.921Z" fill="white"/>
      <path d="M257.359 533.921V534.421H257.859V533.921H257.359ZM175 533.921H174.5V534.421H175V533.921ZM257.359 533.421H175V534.421H257.359V533.421ZM175.5 533.921V531.368H174.5V533.921H175.5ZM256.859 531.368V533.921H257.859V531.368H256.859Z" fill="black"/>
      <mask id="path-67-inside-2_117_5" fill="white">
      <path d="M253.558 532.644H178.801V530.091H253.558V532.644Z"/>
      </mask>
      <path d="M253.558 532.644H178.801V530.091H253.558V532.644Z" fill="white"/>
      <path d="M178.801 531.091H253.558V529.091H178.801V531.091Z" fill="black" mask="url(#path-67-inside-2_117_5)"/>
      <mask id="path-69-inside-3_117_5" fill="white">
      <path d="M218.08 443.277H253.558V445.83H218.08V443.277Z"/>
      </mask>
      <path d="M218.08 443.277H253.558V445.83H218.08V443.277Z" fill="white"/>
      <path d="M253.558 444.83H218.08V446.83H253.558V444.83Z" fill="black" mask="url(#path-69-inside-3_117_5)"/>
      <path d="M147 1L189 1V3L147 3V1Z" fill="white"/>
      <path d="M147 1V0.5L146.5 0.5V1L147 1ZM189 1H189.5V0.5L189 0.5V1ZM147 1.5L189 1.5V0.5L147 0.5V1.5ZM188.5 1V3L189.5 3V1H188.5ZM147.5 3V1L146.5 1V3H147.5Z" fill="black"/>
      <path d="M189 134H364V132H189V134Z" fill="white"/>
      <path d="M189 133.5H364V134.5H189V133.5Z" fill="black"/>
      <rect x="187" y="1" width="2" height="133" fill="white" stroke="black"/>
      {/* Lift */}
      <rect x="191" y="274" width="31.4711" height="34.9679" fill="white" stroke="black"/>
      <foreignObject x="191" y="274" width="31.4711" height="34.9679">
        <div id="elevator2" className ="cube bgcolor-transition">
          <ElevatorIcon fontSize='large'/>
        </div>
      </foreignObject>
      <rect x="221.306" y="274" width="32.6367" height="34.9679" fill="white" stroke="black"/>
      <foreignObject x="221.306" y="274" width="38" height="37">
        <div id="elevator2" className ="cube bgcolor-transition">
                <ElevatorIcon fontSize='large'/>
         </div>
      </foreignObject>
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

        <rect x="107" y="916" width="40" height="39" fill="white" stroke="black"/>
        <foreignObject x="107" y="916" width="40" height="39">
          <div className={`cube bgcolor-transition `}>
            <DirectionsRunIcon fontSize='large' />
          </div>
        </foreignObject>
        <rect x="147" y="3" width="40" height="39" fill="white" stroke="black"/>
        <foreignObject x="147" y="3" width="40" height="39">
          <div className={`cube bgcolor-transition `}>
            <DirectionsRunIcon fontSize='large' />
          </div>
        </foreignObject>


      </svg>



      </div>
      </>
    )
}

export default Floor3