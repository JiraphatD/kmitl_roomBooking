import React, { useState, useEffect, useContext } from 'react';
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
// import './Floor1.css'
import { HomeContext } from '../../Home';
import { FloorContext } from '../Floor';

const Floor1 = () => {

  const { roomDB, linkBookDB, searchQuery, isSelect } = useContext(HomeContext);
  const { currentTime } = useContext(FloorContext)

  //fill data to RoomComponent
  const RoomCheck = (id) => {
    return [roomDB.filter(item => item.id === id), linkBookDB.filter(item => item.room_id === id)];
  };

  return (
    <>

      <div className='map'>
        {/* map line */}
        <svg className='svg_map' width="729" height="953" viewBox="0 0 729 953" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M395.058 911.146H582.584V913.7H395.058V911.146Z" fill="white" />
          <path d="M582.584 913.2H395.058V914.2H582.584V913.2Z" fill="black" />
          <path d="M395.058 909.87H582.584V913.7H395.058V909.87Z" fill="white" />
          <path d="M582.584 913.2H395.058V914.2H582.584V913.2Z" fill="black" />
          <path d="M395.058 909.87H582.584V913.7H395.058V909.87Z" fill="white" />
          <path d="M582.584 913.2H395.058V914.2H582.584V913.2Z" fill="black" />
          <path d="M395.058 909.87H582.584V913.7H395.058V909.87Z" fill="white" />
          {/* Multi-purpose hall*/}
          <rect x="1.5" y="172" width="727" height="255" fill="white" stroke="black" />
          <foreignObject x="1.5" y="172" width="727" height="255">
          <RoomComponent id='HALL' allclass={`room`} data={RoomCheck('HALL')} />
          </foreignObject>
          {/* <rect x="1.5" y="172" width="220" height="255" fill="white" stroke="black"></rect> */}
          
          {/* 111 */}
          <rect x="221.47" y="306" width="146" height="122" fill="white" stroke="black" />
          <foreignObject x="221.47" y="306" width="146" height="121" >
            <RoomComponent id='R111' allclass={`room`} data={RoomCheck('R111')} />
          </foreignObject>
          {/* M03 */}
          <rect x="221.47" y="751.561" width="145.713" height="162.138" fill="white" stroke="black" />
          <foreignObject x="221.47" y="751.561" width="145.713" height="162.138">
            <Link to="/RoomDescription/M03" style={{ textDecoration: 'none', color: 'black' }}>
              <RoomComponent id='M03' allclass={`room`} data={RoomCheck('M03')} />
            </Link>
          </foreignObject>
          {/* M04 */}
          <rect x="221.47" y="589.423" width="145.713" height="163.415" fill="white" stroke="black" />
          <foreignObject x="221.47" y="589.423" width="145.713" height="163.415">
            <Link to="/RoomDescription/M04" style={{ textDecoration: 'none', color: 'black' }}>
              <RoomComponent id='M04' allclass={`room`} data={RoomCheck('M04')} />
            </Link>
          </foreignObject>
          {/* M05 */}
          <rect x="221.47" y="427.285" width="145.713" height="163.415" fill="white" stroke="black" />
          <foreignObject x="221.47" y="427.285" width="145.713" height="163.415">
            <RoomComponent id='M05' allclass={`room`} data={RoomCheck('M05')} />
          </foreignObject>

          {/* M21 */}
          <rect x="582.584" y="751.561" width="145.713" height="162.138" fill="white" stroke="black" />
          <foreignObject x="582.584" y="751.561" width="145.713" height="162.138">
            <Link to="/RoomDescription/M21" style={{ textDecoration: 'none', color: 'black' }}>
              <RoomComponent id='M21' allclass={`room`} data={RoomCheck('M21')} />
            </Link>
          </foreignObject>
          {/* M22 */}
          <rect x="582.584" y="589.423" width="145.713" height="163.415" fill="white" stroke="black" />
          <foreignObject x="582.584" y="589.423" width="145.713" height="163.415">
            <Link to="/RoomDescription/M22" style={{ textDecoration: 'none', color: 'black' }}>
              <RoomComponent id='M22' allclass={`room`} data={RoomCheck('M22')} />
            </Link>
          </foreignObject>
          {/* M23 */}
          <rect x="582.584" y="427.285" width="145.713" height="163.415" fill="white" stroke="black" />
          <foreignObject x="582.584" y="427.285" width="145.713" height="163.415">
            <Link to="/RoomDescription/M23" style={{ textDecoration: 'none', color: 'black' }}>
              <RoomComponent id='M23' allclass={`room`} data={RoomCheck('M23')} />
            </Link>
          </foreignObject>

          {/* Common */}
          {/* <rect x="221.302" y="0.873535" width="189.652" height="170" fill="white" stroke="black" /> */}
          <foreignObject x="221.302" y="0.873535" width="189.652" height="17">
            <RoomComponent id='COMMON' allclass={`room`} data={RoomCheck('COMMON')} />
          </foreignObject>

          {/* Audit */}
          <rect x="1.5" y="427" width="200" height="162.138" fill="white" stroke="black" />
          <foreignObject x="1.5" y="427" width="200" height="162.138">
            <Link to="/RoomDescription/AUDITORIUM" style={{ textDecoration: 'none', color: 'black' }}>
              <RoomComponent id='AUDTORIUM' allclass={`room`} data={RoomCheck('AUDITORIUM')} />
            </Link>
          </foreignObject>

          {/* Toilet Common */}
          <rect x="222" y="171.5" width="38.012" height="37.0237" fill="white" stroke="black" />
          <foreignObject x="222" y="171.5" width="38.012" height="37.0237">
            <div id='womanToilet1' className={`cube ${isSelect === "toilet" ? "categorized" : ""}`}>
              <Woman2Icon fontSize='large' />
            </div>
          </foreignObject>
          <rect x="258.658" y="171.5" width="38.012" height="37.0237" fill="white" stroke="black" />
          <foreignObject x="258.658" y="171.5" width="38.012" height="37.0237">
            <div id='menToilet1' className={`cube ${isSelect === "toilet" ? "categorized" : ""}`}>
              <Man2Icon fontSize='large' />
            </div>
          </foreignObject>

          <rect x="221.47" y="172" width="0.1" height="256" fill="white" stroke="black" strokeWidth="0.5" />

          {/* Toilet M21 */}
          <rect x="438.138" y="876.676" width="38.012" height="37.0237" fill="white" stroke="black" />
          <foreignObject x="438.138" y="876.676" width="38.012" height="37.0237">
            <div id='womanToilet1' className={`cube ${isSelect === "toilet" ? "categorized" : ""}`}>
              <Woman2Icon fontSize='large' />
            </div>
          </foreignObject>
          <rect x="476.151" y="876.676" width="38.012" height="37.0237" fill="white" stroke="black" />
          <foreignObject x="476.151" y="876.676" width="38.012" height="37.0237">
            <div id='menToilet1' className={`cube ${isSelect === "toilet" ? "categorized" : ""}`}>
              <Man2Icon fontSize='large' />
            </div>
          </foreignObject>
          {/* Lift */}
          <rect x="398" y="299" width="31.6767" height="38.3004" fill="white" stroke="black" />
          <foreignObject x="398" y="299" width="31.6767" height="38.3004">
            <div id="elevator1" className="cube">
              <ElevatorIcon fontSize='large' />
            </div>
          </foreignObject>
          <rect x="429.677" y="299" width="31.6767" height="38.3004" fill="white" stroke="black" />
          <foreignObject x="429.677" y="299" width="31.6767" height="38.3004">
            <div id="elevator2" className="cube">
              <ElevatorIcon fontSize='large' />
            </div>
          </foreignObject>

          {/* Stair */}
          <rect x="402" y="357" width="74" height="35" fill="white" stroke="black" />
          <foreignObject x="402" y="357" width="74" height="35">
            <div id="stair" className='cube center'>
              <StairsIcon fontSize='large' />
            </div>
          </foreignObject>

          {/* M12 */}
          <rect x="397.592" y="762.378" width="78.5682" height="75.9976" fill="white" stroke="black" />
          <foreignObject x="397.592" y="762.378" width="78.5682" height="75.9976">
            <Link to="/RoomDescription/M12" style={{ textDecoration: 'none', color: 'black' }}>
              <RoomComponent id='M12' allclass={`sroom`} data={RoomCheck('M12')} />
            </Link>
          </foreignObject>
          {/* M13 */}
          <rect x="397.592" y="685.174" width="78.5682" height="77.2039" fill="white" stroke="black" />
          <foreignObject x="397.592" y="685.174" width="78.5682" height="77.2039">
            <Link to="/RoomDescription/M13" style={{ textDecoration: 'none', color: 'black' }}>
              <RoomComponent id='M13' allclass={`sroom`} data={RoomCheck('M13')} />
            </Link>
          </foreignObject>
          {/* M14 */}
          <rect x="397.592" y="609.176" width="78.5682" height="75.9976" fill="white" stroke="black" />
          <foreignObject x="397.592" y="609.176" width="78.5682" height="75.9976">
            <Link to="/RoomDescription/M14" style={{ textDecoration: 'none', color: 'black' }}>
              <RoomComponent id='M14' allclass={`sroom`} data={RoomCheck('M14')} />
            </Link>
          </foreignObject>
          {/* M15 */}
          <rect x="397.592" y="531.972" width="78.5682" height="77.2039" fill="white" stroke="black" />
          <foreignObject x="397.592" y="531.972" width="78.5682" height="77.2039">
            <Link to="/RoomDescription/M15" style={{ textDecoration: 'none', color: 'black' }}>
              <RoomComponent id='M15' allclass={`sroom`} data={RoomCheck('M15')} />
            </Link>
          </foreignObject>
          {/* M16 */}
          <rect x="476.141" y="762.378" width="78.5682" height="75.9976" fill="white" stroke="black" />
          <foreignObject x="476.141" y="762.378" width="78.5682" height="75.9976">
            <Link to="/RoomDescription/M16" style={{ textDecoration: 'none', color: 'black' }}>
              <RoomComponent id='M16' allclass={`sroom`} data={RoomCheck('M16')} />
            </Link>
          </foreignObject>
          {/* M17 */}
          <rect x="476.141" y="685.174" width="78.5682" height="77.2039" fill="white" stroke="black" />
          <foreignObject x="476.141" y="685.174" width="78.5682" height="77.2039">
            <Link to="/RoomDescription/M17" style={{ textDecoration: 'none', color: 'black' }}>
              <RoomComponent id='M17' allclass={`sroom`} data={RoomCheck('M17')} />
            </Link>
          </foreignObject>
          {/* M18 */}
          <rect x="476.141" y="609.176" width="78.5682" height="75.9976" fill="white" stroke="black" />
          <foreignObject x="476.141" y="609.176" width="78.5682" height="75.9976">
            <Link to="/RoomDescription/M18" style={{ textDecoration: 'none', color: 'black' }}>
              <RoomComponent id='M18' allclass={`sroom`} data={RoomCheck('M18')} />
            </Link>
          </foreignObject>
          {/* M19 */}
          <rect x="476.141" y="570.574" width="78.5682" height="38.602" fill="white" stroke="black" />
          <foreignObject x="476.141" y="570.574" width="78.5682" height="38.602">
            <Link to="/RoomDescription/M19" style={{ textDecoration: 'none', color: 'black' }}>
              <RoomComponent id='M19' allclass={`room`} data={RoomCheck('M19')} />
            </Link>
          </foreignObject>
          {/* M20 */}
          <rect x="476.141" y="531.972" width="33.6721" height="38.602" fill="white" stroke="black" />
          {/* <foreignObject x="568" y="548" width="43" height="45" transform="translate(20, 1160) rotate(-90)"> */}
          <foreignObject x="476.141" y="531.972" width="33.6721" height="38.602">
            <Link to="/RoomDescription/M20" style={{ textDecoration: 'none', color: 'black' }}>
              <RoomComponent id='M20' allclass={`room`} data={RoomCheck('M20')} />
            </Link>
          </foreignObject>
          {/* M24 */}
          <rect x="509.812" y="531.972" width="44.8961" height="38.602" fill="white" stroke="black" />
          <foreignObject x="509.812" y="531.972" width="44.8961" height="38.602">
            <Link to="/RoomDescription/M24" style={{ textDecoration: 'none', color: 'black' }}>
              <RoomComponent id='M24' allclass={`room`} data={RoomCheck('M24')} />
            </Link>
          </foreignObject>
          {/* Fire Exit */}
          <rect x="410.954" y="3.74701" width="38.3134" height="76.6269" fill="white" stroke="black" />
          <foreignObject x="410.954" y="3.74701" width="38.3134" height="76.6269">
            <div id="exit" className='cube center'>
              <DirectionsRunIcon fontSize='large' />
            </div>
          </foreignObject>
          <rect x="291.159" y="913.7" width="76.0241" height="38.3004" fill="white" stroke="black" />
          <foreignObject x="291.159" y="913.7" width="76.0241" height="38.3004">
            <div id="exit" className='cube center'>
              <DirectionsRunIcon fontSize='large' />
            </div>
          </foreignObject>
          <rect x="395.058" y="913.7" width="2.53414" height="37.0237" fill="white" stroke="black" />
          <path d="M397.592 952H367.183V949.447H397.592V952Z" fill="white" />
          <path d="M397.592 952V952.5H398.092V952H397.592ZM367.183 952H366.683V952.5H367.183V952ZM397.592 951.5H367.183V952.5H397.592V951.5ZM367.683 952V949.447H366.683V952H367.683ZM397.092 949.447V952H398.092V949.447H397.092Z" fill="black" />
          <mask id="path-11-inside-1_33_373" fill="white">
            <path d="M395.692 950.085H366.549V948.808H395.692V950.085Z" />
          </mask>
          <path d="M395.692 950.085H366.549V948.808H395.692V950.085Z" fill="white" />
          <path d="M366.549 949.808H395.692V947.808H366.549V949.808Z" fill="black" mask="url(#path-11-inside-1_33_373)" />
          <rect x="449.267" y="4.70483" width="2.87351" height="75.669" fill="white" stroke="black" />
          <path d="M410.954 0.873535L452.141 0.873535V5.66271L410.954 5.66271V0.873535Z" fill="white" />
          <path d="M410.954 0.873535V0.373535L410.454 0.373535V0.873535L410.954 0.873535ZM452.141 0.873535L452.641 0.873535V0.373535L452.141 0.373535V0.873535ZM410.954 1.37354L452.141 1.37354V0.373535L410.954 0.373535V1.37354ZM451.641 0.873535V5.66271H452.641V0.873535L451.641 0.873535ZM411.454 5.66271V0.873535L410.454 0.873535V5.66271H411.454Z" fill="black" />
          <path d="M397.592 952H367.183V949.447H397.592V952Z" fill="white" />
          <path d="M397.592 952V952.5H398.092V952H397.592ZM367.183 952H366.683V952.5H367.183V952ZM397.592 951.5H367.183V952.5H397.592V951.5ZM367.683 952V949.447H366.683V952H367.683ZM397.092 949.447V952H398.092V949.447H397.092Z" fill="black" />
          <mask id="path-21-inside-2_33_373" fill="white">
            <path d="M395.692 950.085H366.549V948.808H395.692V950.085Z" />
          </mask>
          <path d="M395.692 950.085H366.549V948.808H395.692V950.085Z" fill="white" />
          <path d="M366.549 949.808H395.692V947.808H366.549V949.808Z" fill="black" mask="url(#path-21-inside-2_33_373)" />
          <rect x="511.766" y="417.856" width="67.4418" height="4.61511" fill="white" stroke="black" />
          <rect x="513.171" y="413.241" width="64.6317" height="4.61511" fill="white" stroke="black" />
          <rect x="229.799" y="281.896" width="56.3121" height="4.39954" transform="rotate(-90 229.799 281.896)" fill="white" stroke="black" />
          <rect x="225.4" y="284.515" width="60.8957" height="4.39954" transform="rotate(-90 225.4 284.515)" fill="white" stroke="black" />
          <rect x="221" y="287.134" width="66.134" height="4.39954" transform="rotate(-90 221 287.134)" fill="white" stroke="black" />
          <path d="M582.584 913.2H395.058V914.2H582.584V913.2Z" fill="black" />
          <rect x="510.361" y="422.471" width="70.2519" height="4.61511" fill="white" stroke="black" />
          <rect x="401.393" y="445.158" width="3.8012" height="90.6443" transform="rotate(-180 401.393 445.158)" fill="white" stroke="black" />
          <rect x="440.673" y="446.435" width="3.8012" height="54.8972" transform="rotate(-180 440.673 446.435)" fill="white" stroke="black" />
          <rect x="476.15" y="397.921" width="35.4779" height="6.3834" transform="rotate(-180 476.15 397.921)" fill="white" stroke="black" />
          <rect x="476.15" y="403.028" width="35.4779" height="5.10672" transform="rotate(-180 476.15 403.028)" fill="white" stroke="black" />
          <rect x="476.15" y="409.411" width="35.4779" height="6.3834" transform="rotate(-180 476.15 409.411)" fill="white" stroke="black" />
          <rect x="476.15" y="413.241" width="35.4779" height="5.10672" transform="rotate(-180 476.15 413.241)" fill="white" stroke="black" />
          <rect x="476.15" y="418.348" width="35.4779" height="5.10672" transform="rotate(-180 476.15 418.348)" fill="white" stroke="black" />
          <rect x="476.15" y="423.455" width="35.4779" height="5.10672" transform="rotate(-180 476.15 423.455)" fill="white" stroke="black" />
          <rect x="476.15" y="428.561" width="35.4779" height="5.10672" transform="rotate(-180 476.15 428.561)" fill="white" stroke="black" />
          <rect x="476.15" y="433.668" width="35.4779" height="5.10672" transform="rotate(-180 476.15 433.668)" fill="white" stroke="black" />
          <rect x="476.15" y="438.775" width="35.4779" height="5.10672" transform="rotate(-180 476.15 438.775)" fill="white" stroke="black" />
          <rect x="476.15" y="443.881" width="35.4779" height="5.10672" transform="rotate(-180 476.15 443.881)" fill="white" stroke="black" />
          <rect x="436.871" y="397.921" width="35.4779" height="6.3834" transform="rotate(-180 436.871 397.921)" fill="white" stroke="black" />
          <rect x="436.871" y="403.028" width="35.4779" height="5.10672" transform="rotate(-180 436.871 403.028)" fill="white" stroke="black" />
          <rect x="436.871" y="409.411" width="35.4779" height="6.3834" transform="rotate(-180 436.871 409.411)" fill="white" stroke="black" />
          <rect x="436.871" y="414.518" width="35.4779" height="5.10672" transform="rotate(-180 436.871 414.518)" fill="white" stroke="black" />
          <rect x="436.871" y="420.901" width="35.4779" height="6.3834" transform="rotate(-180 436.871 420.901)" fill="white" stroke="black" />
          <rect x="436.871" y="426.008" width="35.4779" height="5.10672" transform="rotate(-180 436.871 426.008)" fill="white" stroke="black" />
          <rect x="436.871" y="432.391" width="35.4779" height="6.3834" transform="rotate(-180 436.871 432.391)" fill="white" stroke="black" />
          <rect x="436.871" y="437.498" width="35.4779" height="5.10672" transform="rotate(-180 436.871 437.498)" fill="white" stroke="black" />
          <rect x="436.871" y="443.881" width="35.4779" height="6.3834" transform="rotate(-180 436.871 443.881)" fill="white" stroke="black" />
          <rect x="479.952" y="446.435" width="3.8012" height="91.921" transform="rotate(-180 479.952 446.435)" fill="white" stroke="black" />
          <path d="M440.673 446.435H397.592V443.881H440.673V446.435Z" fill="white" />
          <path d="M440.673 446.435V446.935H441.173V446.435H440.673ZM397.592 446.435H397.092V446.935H397.592V446.435ZM440.673 445.935H397.592V446.935H440.673V445.935ZM398.092 446.435V443.881H397.092V446.435H398.092ZM440.173 443.881V446.435H441.173V443.881H440.173Z" fill="black" />
          <path d="M440.673 446.435H397.592V443.881H440.673V446.435Z" fill="white" />
          <path d="M440.673 446.435V446.935H441.173V446.435H440.673ZM397.592 446.435H397.092V446.935H397.592V446.435ZM440.673 445.935H397.592V446.935H440.673V445.935ZM398.092 446.435V443.881H397.092V446.435H398.092ZM440.173 443.881V446.435H441.173V443.881H440.173Z" fill="black" />
          <path d="M397.592 354.514H479.952V357.067H397.592V354.514Z" fill="white" />
          <path d="M397.592 354.514V354.014H397.092V354.514H397.592ZM479.952 354.514H480.452V354.014H479.952V354.514ZM397.592 355.014H479.952V354.014H397.592V355.014ZM479.452 354.514V357.067H480.452V354.514H479.452ZM398.092 357.067V354.514H397.092V357.067H398.092Z" fill="black" />
          <mask id="path-81-inside-3_33_373" fill="white">
            <path d="M401.393 355.79H476.15V358.344H401.393V355.79Z" />
          </mask>
          <path d="M401.393 355.79H476.15V358.344H401.393V355.79Z" fill="white" />
          <path d="M476.15 357.344H401.393V359.344H476.15V357.344Z" fill="black" mask="url(#path-81-inside-3_33_373)" />
          <mask id="path-83-inside-4_33_373" fill="white">
            <path d="M436.871 445.158H401.393V442.605H436.871V445.158Z" />
          </mask>
          <path d="M436.871 445.158H401.393V442.605H436.871V445.158Z" fill="white" />
          <path d="M401.393 443.605H436.871V441.605H401.393V443.605Z" fill="black" mask="url(#path-83-inside-4_33_373)" />
        </svg>

        {/* map line */}
        <div>
          {/* <p className='liveTime'>{clock}</p> */}
          <h1 className='floorNumber'>FLOOR 1</h1>
          <h4>{currentTime.format('LLLL')}</h4>
          {/* <div className="time" style={{position:'absolute'}}>
              <p>Current Time: {currentTime.format('YYYY-MM-DD HH:mm:ss')}</p>
              <p>Time Range: {timeStart.format('YYYY-MM-DD HH:mm:ss')} - {timeEnd.format('YYYY-MM-DD HH:mm:ss')}</p>
            </div> */}
        </div>
        {/* <div id="emergency1">
            <DirectionsRunIcon fontSize='large'/>
          </div>
          <div id="emergency2">
            <DirectionsRunIcon fontSize='large'/>
          </div> */}
      </div>
    </>
  )
}

export default Floor1
