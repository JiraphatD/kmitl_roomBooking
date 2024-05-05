import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
// import Grid from '@mui/material/Grid';
import { Box, Grid, Button, CircularProgress, Paper, ToggleButtonGroup, ToggleButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import axios from 'axios';
import RoomCalendar from '../../Calendar/RoomCalendar';
// import Button from '@mui/material/Button';
// import CircularProgress from '@mui/material/CircularProgress';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import DesktopAccessDisabledOutlinedIcon from '@mui/icons-material/DesktopAccessDisabledOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeveloperBoardOutlinedIcon from '@mui/icons-material/DeveloperBoardOutlined';
import ChairIcon from '@mui/icons-material/Chair';
import SurroundSoundOutlinedIcon from '@mui/icons-material/SurroundSoundOutlined';
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined';
import ChairOutlinedIcon from '@mui/icons-material/ChairOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import MonitorIcon from '@mui/icons-material/Monitor';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import BookingForm from '../../Booking/BookingForm';
import styles from './RoomDescription.module.css'
import { HomeContext } from '../../Home';
import { TouchContext } from '../../TV_TouchScreen/TVTouch';
import API_DATA from '../../link';
import EventIcon from '@mui/icons-material/Event';
import { CenterFocusStrong, Desk } from '@mui/icons-material';
import { ClassNames } from '@emotion/react';

function RoomDescription() {
    const [view, setView] = useState('calendar')
    const [loading, setLoading] = useState(true);
    const { currentTime, linkBookDB } = useContext(HomeContext);
    const { Touch } = useContext(TouchContext);
    const date = currentTime.format('LLLL');
    const { roomId } = useParams()
    const [imagePath, setImagePath] = useState(null);
    const [seatQuantity, setSeatQuantity] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const toggleBooking = () => {
        setIsOpen(!isOpen);
    }
    //Get API
    const [roomDB, setRoomDB] = useState("");
    const { labData } = useContext(HomeContext);
    useEffect(() => {
        try {
            axios.get(API_DATA.room).then((response) => {
                const events = response.data;
                setRoomDB(events);

                const room = events.find(room => room.id.toUpperCase() === roomId.toUpperCase()); //check room and set image to room
                if (room) {
                    setImagePath(room.room_image);
                    setSeatQuantity(room.seat)
                }
            }).catch((error) => {
                console.log(error);
            })
        } catch (error) {
            console.error(error);
        }
    }, [roomId]);
    useEffect(() => {
            if (imagePath != null) {
                setLoading(false);
            }
    }, [imagePath]);

    let roomDesc = '';
    let activity = 'ไม่มีกิจกรรม';
    let lecturer = 'ไม่มีผู้ใช้งาน';
    let currently_use_time = 'ไม่มีการใช้งาน';
    let laboratory = null;
    let software = null;
    let roomName = '';
    let accessories = [];
    const regularExpression_title = /ห้อง\s+(\w+)\s+.*?(?:รหัสวิชา\s+(\d+)\s+)?วิชา\s+([^()]+)/;

    Array.from(roomDB).forEach(room_data => {
        const dbroomId = room_data.id.toUpperCase();
        if (dbroomId == roomId.toUpperCase()) {
            roomDesc = room_data.description;
            laboratory = room_data.laboratory;
            accessories = room_data.accessories;
            roomName = room_data.room_name
        }
    });

    Array.from(linkBookDB).forEach(linkBook => {
        if (currentTime.isBetween(linkBook.check_in_datetime, linkBook.check_out_datetime) && linkBook.room_id === roomId && linkBook.approvement.is_approved === true) {
            activity = linkBook.title;
            if (linkBook.title.match(regularExpression_title) !== null) {
                activity = linkBook.title.match(regularExpression_title)[3];
            }
            lecturer = linkBook.booker.name;
            currently_use_time = `${moment(linkBook.check_in_datetime).format('HH:mm')} - ${moment(linkBook.check_out_datetime).format('HH:mm')}`
        }
    });

    Array.from(labData).forEach(lab_data => {
        const lab_Room = lab_data.room_id;
        if (roomId === lab_Room) {
            software = lab_data.software;
        }
    })

    const handleChangeView = (event, viewMode) => {
        setView(viewMode)
    }

    console.log(accessories)

    return (
        <>
            {loading ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <CircularProgress />
                    </div>
                </>
            ) : (
                <>
                    {Touch ? (
                        <>

                            <Grid container
                                sx={{
                                    backgroundImage: `url(${imagePath})`,
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    height: '475px',
                                }}
                            >
                                <Grid container
                                    sx={{
                                        backdropFilter: 'brightness(0.3)',
                                        color: '#FFFFFF',
                                        // boxShadow: '0px 5px 10px rgb(0, 0, 0, 0.3)',
                                        textAlign: 'center',
                                    }}
                                >
                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}
                                        sx={{
                                            paddingTop: '50px',
                                        }}
                                    >
                                        <Box>
                                            <h1><b>{roomName}</b></h1>
                                            <h1><b>{roomDesc}</b></h1>
                                            <p>{date}</p>
                                            <br />
                                            <br />
                                        </Box>
                                        <Grid container spacing={2} justifyContent={'center'}>
                                            <Grid item xl={2} lg={1} md={3} sm={12} xs={12}>
                                                <Link to='/Touch'>
                                                    <Button fullWidth sx={{ borderColor: '#FFFFFF', color: '#FFFFFF', fontFamily: 'Prompt' }} variant="outlined" size='large' startIcon={<ArrowBackIosNewIcon />}>กลับไปยังแผนผัง</Button>
                                                </Link>
                                            </Grid>
                                            <Grid item xl={2} lg={1} md={3} sm={12} xs={12}>
                                                <Button fullWidth variant="contained" size='large' startIcon={<BookmarkAddIcon />} onClick={toggleBooking} sx={{fontFamily: 'Prompt'}}>จองห้อง</Button>
                                            </Grid>
                                        </Grid>
                                        <br />
                                        <br />

                                        <Grid container display={'flex'} justifyContent={'center'}>

                                            <Grid item lg={7} md={7} sm={6} xs={10}>
                                                <Paper elevation={2}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                                                            <h5><b>กิจกรรม</b></h5>
                                                            <p>{activity}</p>
                                                        </Grid>
                                                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                                                            <h5><b>ผู้ใช้งาน</b></h5>
                                                            <p>{lecturer}</p>
                                                        </Grid>
                                                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                                                            <h5><b>เวลาใช้งาน</b></h5>
                                                            <p>{currently_use_time}</p>
                                                        </Grid>
                                                    </Grid>
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <div className={styles.moreDetail}>
                                <Grid container>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <ToggleButtonGroup fullWidth exclusive value={view} onChange={handleChangeView}>
                                            <ToggleButton value="calendar"><b>ปฏิทิน</b></ToggleButton>
                                            <ToggleButton value="detail"><b>รายละเอียด</b></ToggleButton>
                                        </ToggleButtonGroup>
                                    </Grid>
                                </Grid>
                                {(view === 'detail') && (
                                    <>
                                        <Grid container >
                                        </Grid>
                                        {(laboratory !== null) && (
                                            <>
                                            <section>
                                                    <br />
                                                    <br />
                                                    <Grid container>
                                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                            <h3><b>ของใช้ภายในห้อง</b></h3>
                                                            <br />
                                                            <TableContainer >
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
                                                <section>
                                                    <br />
                                                    <br />
                                                    <Grid container>
                                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                            <h3><b>Hardware</b></h3>
                                                            <br />
                                                            <TableContainer>
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
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                            <hr />
                                                            <br /><h3><b>Software</b></h3>
                                                            <TableContainer>
                                                                <Table>
                                                                    <TableBody>
                                                                        <TableRow sx={
                                                                            {
                                                                                '&:last-child td, &:last-child th': { border: 0 }
                                                                            }
                                                                        }>
                                                                            <TableCell sx={{ fontFamily: 'prompt' }}>
                                                                                {software.map((data) => (
                                                                                    <Chip key={data.id} sx={{ margin: '3px' }} label={data.software_name} />
                                                                                ))}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        </Grid>
                                                    </Grid>
                                                </section>
                                                
                                            </>
                                        )}

                                        {(laboratory === null) && (
                                            <section>
                                                <br />
                                                <br />
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
                                        )}
                                    </>
                                )}
                                {(view === 'calendar') && (
                                    <RoomCalendar prop_roomID={roomId} />
                                )}
                            </div>
                            {isOpen && <BookingForm isOpen={isOpen} toggleBooking={toggleBooking} booking_roomID={roomId} />}
                        </>
                    ) : (
                        <>
                            {/* Displayed On Laptop */}
                            <Grid container sx={
                                {
                                    backgroundImage: `url(${imagePath})`,
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    height: { xs: '500px', lg: '475px' },
                                    mt: { xs: '-5vh', md: '-6vh', lg: '-3vh' },
                                }
                            }>
                                <Grid container sx={
                                    {
                                        backdropFilter: 'brightness(0.3)',
                                        color: '#FFFFFF',
                                        textAlign: 'center',
                                        mb: { xs: '-20vh', sm: '-5vh', md: '0vh', lg: '0' }
                                    }
                                }>
                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}
                                        sx={{ paddingTop: '50px' }}
                                    >
                                        <Box>
                                            <h1><b>{roomName}</b></h1>
                                            <h1><b>{roomDesc}</b></h1>
                                            <p>{date}</p>
                                            <br />
                                            <br />
                                        </Box>
                                        <Grid container spacing={2} justifyContent={'center'}>
                                            <Grid item xl={2} lg={2} md={3} sm={7} xs={10}>
                                                <Link to='/'>
                                                    <Button fullWidth sx={{ borderColor: '#FFFFFF', color: '#FFFFFF', fontFamily: 'Prompt' }} variant="outlined" size='large' startIcon={<ArrowBackIosNewIcon />} >กลับไปยังแผนผัง</Button>
                                                </Link>
                                            </Grid>
                                            <Grid item xl={2} lg={2} md={3} sm={7} xs={10}>
                                                <Button fullWidth variant="contained" size='large' startIcon={<BookmarkAddIcon />} onClick={toggleBooking} sx={{fontFamily: 'Prompt'}}>จองห้อง</Button>
                                            </Grid>
                                        </Grid>
                                        <br />
                                        <br />

                                        <Grid container display={'flex'} justifyContent={'center'}>

                                            <Grid item lg={7} md={10} sm={11} xs={11}>
                                                <Paper elevation={2}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                                                            <h5><b>กิจกรรม</b></h5>
                                                            <p>{activity}</p>
                                                        </Grid>
                                                        <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                                                            <h5><b>ผู้ใช้งาน</b></h5>
                                                            <p>{lecturer}</p>
                                                        </Grid>
                                                        <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                                                            <h5><b>เวลาใช้งาน</b></h5>
                                                            <p>{currently_use_time}</p>
                                                        </Grid>
                                                    </Grid>
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <div className={styles.moreDetail}>
                                <Grid container>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <ToggleButtonGroup fullWidth exclusive value={view} onChange={handleChangeView}>
                                            <ToggleButton value="calendar"><b>ปฏิทิน</b></ToggleButton>
                                            <ToggleButton value="detail"><b>รายละเอียด</b></ToggleButton>
                                        </ToggleButtonGroup>
                                    </Grid>
                                </Grid>
                                {(view === 'detail') && (
                                    <>
                                        <Grid container >

                                        </Grid>
                                        {(laboratory !== null) && (
                                            <>
                                            <section>
                                                    <br />
                                                    <br />
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
                                                <section>
                                                    <br />
                                                    <br />
                                                    <Grid container>
                                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                            <h3><b>Hardware</b></h3>
                                                            <br />
                                                            <TableContainer>
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
                                                                        </TableRow>
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                            <br /><h3><b>Software</b></h3>
                                                            <TableContainer>
                                                                <Table>
                                                                    <TableBody>
                                                                        <TableRow sx={
                                                                            {
                                                                                '&:last-child td, &:last-child th': { border: 0 }
                                                                            }
                                                                        }>
                                                                            <TableCell sx={{ fontFamily: 'prompt' }}>
                                                                                {software.map((data) => (
                                                                                    <Chip key={data.id} sx={{ margin: '3px' }} label={data.software_name} />
                                                                                ))}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        </Grid>
                                                    </Grid>
                                                </section>
                                                
                                            </>
                                        )}

                                        {(laboratory === null) && (
                                            <section>
                                                <br />
                                                <br />
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
                                        )}
                                    </>
                                )}
                                {(view === 'calendar') && (
                                    <RoomCalendar prop_roomID={roomId} />
                                )}
                            </div>
                            {isOpen && <BookingForm isOpen={isOpen} toggleBooking={toggleBooking} booking_roomID={roomId} />}
                        </>
                    )}

                </>
            )}
        </>
    )
}

export default RoomDescription