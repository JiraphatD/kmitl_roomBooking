import React, { useState, useEffect, useContext } from 'react';
import './RoomComponent.css';
import moment from 'moment';
import ComputerIcon from '@mui/icons-material/Computer';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import FlightIcon from '@mui/icons-material/Flight';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import LanIcon from '@mui/icons-material/Lan';
import AdjustIcon from '@mui/icons-material/Adjust';
import { HomeContext } from '../../Home';

const RoomComponent = ({ id, roomData, bookingData, status, allclass }) => {
  // console.log("RoomComponent Rendered with id:", roomData[0]);
  // console.log("Data received:", data);
  // console.log("All class:", allclass);
  const notDisplay = ['PT1','PT2','PT3','C1','C2','316','317','416','418','430','431','438','439']

  const { currentTime, updateRoomStatus, GeneralRoom} = useContext(HomeContext);
  // console.log(id,":",status)
  const [roomStatus, setRoomStatus] = useState({}                                                                                                );
  useEffect(() => {
    setTimeout(()=>{
      if (roomData && Array.isArray(roomData)) {
        const newRoomStatus = {};
        roomData.forEach(item => {
          const status = RoomStatus(item);
          // const icon = IconStatus(item);
          newRoomStatus[item.id] = status;
        });
        setRoomStatus(newRoomStatus);
      }
    }, 10000)
  }, [roomData, currentTime]);

  const IconStatus = (item) => {
    let iconComponent = null;
    roomData.map(item => {
      const icon = item.room_category;
      if (icon == 'Large_Lecture_Room') {
        iconComponent = <ImportContactsIcon fontSize='small'/>;
      }
      else if(icon == 'Medium_Lecture_Room'){
        iconComponent = <ImportContactsIcon fontSize='small'/>;
      } 
      else if(icon == 'Small_Lecture_Room'){
        iconComponent = <ImportContactsIcon fontSize='small'/>;
      }
      else if(icon == 'Multi_Purpose_Hall'){
        iconComponent = <AdjustIcon fontSize='small'/>;
      } 
      else if(icon == 'Small_Laboratory_Room'){
        iconComponent = <ComputerIcon fontSize='small'/>;
      }
      else if(icon == 'Large_Laboratory_Room'){
        iconComponent = <ComputerIcon fontSize='small'/>;
      }
      else if(icon == 'Entertainment_Room'){
        iconComponent = <i className="bi bi-palette-fill"></i>;
      }
      else if(icon == 'Large_Conference_Room'){
        iconComponent = <i className="bi bi-easel3-fill"></i>;
      }
      else if(icon == 'Education_Service_Room' || item.id == '323'){
        iconComponent = <SupportAgentIcon fontSize='small'/>;
      }else if(item.id == "215"){
        iconComponent = <LocalLibraryIcon fontSize='small'/>;
      }else if(item.id == "310"){
        iconComponent = <FlightIcon fontSize='small'/>;
      }else if(item.room_name == 'ห้องเก็บอุปกรณ์'){
        iconComponent = <WarehouseIcon fontSize='small'/>;
      }else if(item.id == "322"){
        iconComponent = <LanIcon fontSize='small'/>;
      }
    }); 

    return iconComponent;
  }
  const RoomStatus = (item) => {
    const isDataArrayValid = bookingData !== null && Array.isArray(bookingData);
    if (!isDataArrayValid) {
      // Handle the case when bookingData is not valid
      return 'Invalid data';
    }
      if(!GeneralRoom.includes(item.id)){
        if(!notDisplay.includes(item.id)){
          if(status == 'Active'){
            for (const dataItem of bookingData) {
                const startTime = moment(dataItem.check_in_datetime);
                const endTime = moment(dataItem.check_out_datetime);
                if (currentTime.isBetween(startTime, endTime)) {
                  return dataItem.title;
                }
              }
          }else{
          if(item.id == 'HALL' || item.id == 'COMMON'){
            return item.room_name;
          }else{return 'Available'}
          }
        }else{
            return "";
          }
      }else{
        if(notDisplay.includes(item.id)){
          return "";
        }else return item.room_name
      }
  };

  const styles = {
    componentActivity: {
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: '4',
      overflow: 'hidden'
    }
  }

  return (
    <div>

{roomData && Array.isArray(roomData) && roomData.map(item => (
        <div key={item.id} id={id} className={`${allclass} ${RoomStatus(item.id) === 'Available' ? 'noUse' : 'use'} ${item.room_category} ${item.id === "HALL" ? "t_mphall" : ""} box` }>
          {IconStatus(item)}
          <h5>{item.id}</h5>
          <p style={styles.componentActivity}>{RoomStatus(item)}</p>
        </div>
      ))}
    </div>
  );
};

export default RoomComponent;
