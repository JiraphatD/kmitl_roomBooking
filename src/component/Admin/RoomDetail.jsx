import React from 'react'
import { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { useParams, Link, Route, Routes } from 'react-router-dom'
import { Chip, Paper, CircularProgress, Button, Container as MuiContainer, FormControl, Select, MenuItem, InputLabel, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import moment from 'moment';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import API_DATA from '../link';
import CalendarReservation from './CalendarReservation/CalendarReservation';
import { AdminContext } from './AdminPage/AdminPage';

function RoomDetail() {

    const { linkBookDB, labData } = useContext(AdminContext);
    const { roomID } = useParams();
    const [imagePath, setImagePath] = useState();
    const [roomDB, setRoomDB] = useState([]);
    const [seatQuantity, setSeatQuantity] = useState(0);
    const [currentTime, setCurrentTime] = useState(moment());
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        axios.get(API_DATA.room).then((response) => {

            const roomData = response.data;
            setRoomDB(roomData);

            const room = roomData.find(room => room.room_name.toUpperCase() === roomID.toUpperCase());

            if (room) {

                setImagePath(room.room_image);
                setSeatQuantity(room.seat)

            }

            console.log(roomData);
        }).catch((error) => {

            console.log(error);

        })

    }, [roomID]);

    useEffect(() => {
        setTimeout(() => {
            if (imagePath != null) {
                setLoading(false);
            }
        }, 1000)
    }, [imagePath]);

    useEffect(() => {

        const intervalID = setInterval(() => {

            setCurrentTime(moment());

        }, 1000);

    }, []);

    const clock = currentTime.format('HH:mm:ss');
    const date = currentTime.format('LLLL');
    let roomDesc = '';
    let activity = 'ไม่มีกิจกรรม';
    let lecturer = 'ไม่มีผู้ใช้งาน';
    let currently_use_time = 'ไม่มีการใช้งาน';
    let laboratory = null;
    let software = null;
    let accessories = [];

    Array.from(roomDB).forEach(room_data => {

        const dbRoomID = room_data.room_name.toUpperCase();

        if (dbRoomID == roomID) {

            roomDesc = room_data.description;
            laboratory = room_data.laboratory;
            accessories = room_data.accessories;
            console.log(laboratory);
        }
    })

    Array.from(linkBookDB).forEach(linkBook => {
        if (currentTime.isBetween(linkBook.check_in_datetime, linkBook.check_out_datetime) && linkBook.room_id === roomID && linkBook.approvement.is_approved === true) {
            activity = linkBook.title;
            lecturer = linkBook.booker.name;
            // console.log(linkBook)
            currently_use_time = `${moment(linkBook.check_in_datetime).format('HH:mm')} - ${moment(linkBook.check_out_datetime).format('HH:mm')}`
        }
    });

    Array.from(labData).forEach(lab_data => {
        const lab_Room = lab_data.room_id;
        if (roomID === lab_Room) {
            software = lab_data.software;
            console.log(software)
        }
    })

    console.log(roomID)

    return (
        <>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </div>
            ) : (
                <MuiContainer>
                    <h1><strong>{roomID}</strong></h1>
                    <p>{date}</p>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <img src={imagePath != null ? imagePath : "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="" id='roomIMG' width={'80%'} />
                        </Grid>

                        <Grid item xs={6}>
                            <h2>Room Feature</h2>
                            <Grid container spacing={2}>
                                <Grid item xs={6}><p><AirlineSeatReclineNormalIcon />&emsp;{seatQuantity} ที่นั่ง</p></Grid>
                                <Grid item xs={6}><p><DesktopWindowsIcon />&emsp;ติดตั้งอุปกรณ์โปรเจกเตอร์</p></Grid>
                            </Grid>
                            <h2>รายละเอียดห้อง</h2>
                            <Grid container>
                                <Grid item xs={12}>
                                    <p id="roomDesc">{roomDesc}</p>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={6}>
                                    <h2>กิจกรรม</h2>
                                    <p>{activity}</p>
                                </Grid>
                                <Grid item xs={6}>
                                    <h2>ผู้ใช้งาน</h2>
                                    <p>{lecturer}</p>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12}>
                            <br /><br />
                            <section>
                                    <Grid container>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <h3><b>ของใช้ภายในห้อง</b></h3>
                                            <br />
                                            <TableContainer>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell><b>ชื่อของใช้</b></TableCell>
                                                            <TableCell><b>จำนวน</b></TableCell>
                                                            <TableCell><b>วันที่ติดตั้ง</b></TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {accessories.map((accessory) => (
                                                            <TableRow
                                                                key={accessory.id}
                                                                sx={
                                                                    {
                                                                        '&:last-child td, &:last-child th': { border: 0 }
                                                                    }
                                                                }>
                                                                <TableCell sx={{ fontFamily: 'prompt' }}>{accessory.accessory_name}</TableCell>
                                                                <TableCell sx={{ fontFamily: 'prompt' }}>{accessory.quantity}</TableCell>
                                                                <TableCell sx={{ fontFamily: 'prompt' }}>{`${moment(accessory.setup_date).format('DD MMMM')} ${moment(accessory.setup_date).year() + 543}`}</TableCell>
                                                            </TableRow>
                                                        ))}

                                                        <TableRow sx={
                                                            {
                                                                '&:last-child td, &:last-child th': { border: 0 }
                                                            }
                                                        }>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                    </Grid>
                                </section>
                                <br />
                            {(laboratory !== null) && (
                                <TableContainer>
                                    <h3><b>Computer</b></h3>
                                    <Table>
                                        <TableBody>
                                            {[
                                                { 'ยี่ห้อ': laboratory.computer_brand },
                                                { 'จอแสดงผล': laboratory.display },
                                                { 'CPU': laboratory.cpu },
                                                { 'RAM': laboratory.ram },
                                                { 'GPU': laboratory.gpu },
                                                { 'หน่วยความจำหลัก': laboratory.main_memory },
                                                { 'ระบบปฏิบัติการ': laboratory.operation_system },
                                                { 'ระบบป้องกัน': laboratory.protection_system }
                                            ].map((row) => (
                                                <TableRow
                                                    key={Object.keys(row)}
                                                    sx={
                                                        {
                                                            '&:last-child td, &:last-child th': { border: 0 }
                                                        }
                                                    }>
                                                    <TableCell width={175}><b>{Object.keys(row)}</b></TableCell>
                                                    <TableCell sx={{ fontFamily: 'prompt' }}>{Object.values(row)}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow sx={
                                                {
                                                    '&:last-child td, &:last-child th': { border: 0 }
                                                }
                                            }>
                                                <TableCell >
                                                    <b>Software ที่ถูกติดตั้ง</b>
                                                </TableCell>
                                                <TableCell sx={{ fontFamily: 'prompt' }}>
                                                    {software.map((data) => (
                                                        // <li key={data.id}>{data.software_name}</li>
                                                        <Chip key={data.id} sx={{ margin: '3px' }} label={data.software_name} />
                                                    ))}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow sx={
                                                {
                                                    '&:last-child td, &:last-child th': { border: 0 }
                                                }
                                            }>

                                            </TableRow>

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            {/* {(laboratory === null) && (
                                <section>
                                    <Grid container>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <h3><b>ของใช้ภายในห้อง</b></h3>
                                            <br />
                                            <TableContainer>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell><b>ชื่อของใช้</b></TableCell>
                                                            <TableCell><b>จำนวน</b></TableCell>
                                                            <TableCell><b>วันที่ติดตั้ง</b></TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {accessories.map((accessory) => (
                                                            <TableRow
                                                                key={accessory.id}
                                                                sx={
                                                                    {
                                                                        '&:last-child td, &:last-child th': { border: 0 }
                                                                    }
                                                                }>
                                                                <TableCell sx={{ fontFamily: 'prompt' }}>{accessory.accessory_name}</TableCell>
                                                                <TableCell sx={{ fontFamily: 'prompt' }}>{accessory.quantity}</TableCell>
                                                                <TableCell sx={{ fontFamily: 'prompt' }}>{moment(accessory.setup_date).format('LL')}</TableCell>
                                                            </TableRow>
                                                        ))}

                                                        <TableRow sx={
                                                            {
                                                                '&:last-child td, &:last-child th': { border: 0 }
                                                            }
                                                        }>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                    </Grid>
                                </section>
                            )} */}
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container borderBottom={'1px solid #C5C5C5'}>
                        <Grid item xs={12}>
                            <h3><b>Calendar</b></h3>
                        </Grid>
                    </Grid>
                    <CalendarReservation location={roomID} />
                </MuiContainer>
            )}
        </>

    )
}

export default RoomDetail