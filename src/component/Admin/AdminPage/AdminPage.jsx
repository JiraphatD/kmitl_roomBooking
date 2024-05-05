import React, { useState, useEffect, createContext } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Grid, Box, Drawer, Hidden, useMediaQuery } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import Static from '../Static/Static'
import Advertising from '../../Advertise/Advertising';
import BookingManagement from '../BookingManagement/BookingManagement';
import UserManagement from '../UserManagement/UserManagement';
import EditBooking from '../BookingManagement/EditBooking';
import RoomDetail from '../RoomDetail';
import SuperUser_RoomList from '../SuperUser_RoomList';
import BookingPage from '../BookingPage/BookingPage';
import ReservationForm from '../ReservationForm/ReservationForm';
import CalendarView from '../ReservationForm/CalendarView';
import API_DATA from '../../link';
// Current Use for firstpage when login
import DashBoard from '../Dashboard/DashBoard';
import DeletedHistory from '../DeletedHistory';
import styles from './AdminPage.module.css';
import EditRoomData from '../EditRoomData';
import { CorporateFare, PeopleAlt } from '@mui/icons-material';
import { Calendar } from 'react-big-calendar';

export const AdminContext = createContext();

function AdminPage() {
    const phoneHorizon = useMediaQuery('(min-width:600px) and (max-width:1000px) and (min-height:300px) and (max-height:600px)');
    const location = useLocation();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [roomBook, setRoomBook] = useState([]);
    useEffect(() => {
        axios.get(API_DATA.roomBook)
            .then(response => setRoomBook(response.data))
            .catch(error => console.log(error));
    }, []);

    const [linkBookDB, setLinkBookDB] = useState([]);
    useEffect(() => {
        axios.get(API_DATA.linkBook)
            .then(response => setLinkBookDB(response.data))
            .catch(error => console.log(error));
    }, []);

    const [bookerData, setBookerData] = useState([]);
    useEffect(() => {
        axios.get(API_DATA.booker)
            .then(response => setBookerData(response.data))
            .catch(error => console.log(error));
    }, [])

    const [allRoom, setAllRoom] = useState([]);
    useEffect(() => {
        axios.get(API_DATA.room)
            .then(response => setAllRoom(response.data))
            .catch(error => console.log(error));
    }, []);

    const [approvementList, setApprovementList] = useState([]);
    useEffect(() => {
        axios.get(API_DATA.adminApprovementNumber)
            .then(response => setApprovementList(response.data))
            .catch(error => console.log(error))
    }, [])

    const [rejectedList, setRejectedList] = useState([]);
    useEffect(() => {
        axios.get(API_DATA.adminRejectBooking)
            .then(response => setRejectedList(response.data))
            .catch(error => console.log(error))
    }, [])

    const [labData, setLabData] = useState([]);
    useEffect(() => {
        setTimeout(() => {
            axios.get(API_DATA.laboratory)
                .then(response => {
                    setLabData(response.data)
                })
                .catch(error => console.log(error))
        })
    }, [])

    const [logo, setLogo] = useState('')
    useEffect(() => {
        setLogo('/assets/img/it_logo.svg')
    })
    const notifyWhenLogout = () => {
        localStorage.removeItem('token');
        localStorage.setItem('notify', true);
    }
    const currentPath = location.pathname;

    return (
        <AdminContext.Provider value={{ allRoom, labData, linkBookDB, roomBook, bookerData, approvementList, rejectedList }}>
            {phoneHorizon ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p>กรุณาหมุนโทรศัพท์เพื่อการแสดงผลที่ดีที่สุด</p>
                        <div className={styles.rotate}>
                            <ScreenRotationIcon />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <Grid container spacing={0}>
                        <Grid item xs={openDrawer && 0} lg={2} md={3}>
                            <Hidden mdDown implementation="css">
                                <div className={styles.left}>
                                    <Link to='' style={{ textDecoration: 'none' }}>
                                        <div className={(
                                            !currentPath.includes('/Booking') && !currentPath.includes('/BookingManagement') &&
                                            !currentPath.includes('/Static') && !currentPath.includes('/Advertise') &&
                                            !currentPath.includes('/RoomList') && !currentPath.includes('/CalendarView') &&
                                            !currentPath.includes('/UserManagement')
                                        )
                                            ? styles.activeHome : ""}
                                        >
                                            <img src={logo} width='6vw' alt="" /><hr style={{ color: 'white', margin: '1vw' }} />
                                        </div>
                                    </Link>
                                    <Link to='RoomList' style={{ textDecoration: 'none' }}>
                                        <p className={`${styles.itemNav} ${(currentPath.includes('/RoomList')) && styles.activeLink}`}>
                                            <MeetingRoomIcon />&emsp;รายชื่อห้อง
                                        </p>
                                    </Link>
                                    <Link to='CalendarView' style={{ textDecoration: 'none' }}>
                                        <p className={`${styles.itemNav} ${(currentPath.includes('/CalendarView')) && styles.activeLink}`}>
                                            <CalendarMonthIcon />&emsp;ปฎิทินการใช้งานและกิจกรรม
                                        </p>
                                    </Link>
                                    <Link to='Booking' style={{ textDecoration: 'none' }}>
                                        <p className={`${styles.itemNav} ${(currentPath.includes('/Booking') && !currentPath.includes('/BookingManagement')) && styles.activeLink}`}>
                                            <BookmarkAddIcon />&emsp;จองห้อง
                                        </p>
                                    </Link>
                                    <Link to='Static' style={{ textDecoration: 'none' }}>
                                        <p className={`${styles.itemNav} ${(currentPath.includes('/Static')) && styles.activeLink}`}>
                                            <EqualizerIcon />&emsp;สถิติการใช้งาน
                                        </p>
                                    </Link>
                                    <Link to='Advertise' style={{ textDecoration: 'none' }}>
                                        <p className={`${styles.itemNav} ${(currentPath.includes('/Advertise')) && styles.activeLink}`}>
                                            <AnnouncementIcon />&emsp;กิจกรรม / ประชาสัมพันธ์
                                        </p>
                                    </Link>
                                    <Link to='BookingManagement' style={{ textDecoration: 'none' }}>
                                        <p className={`${styles.itemNav} ${(currentPath.includes('/BookingManagement')) && styles.activeLink}`}>
                                            <BeenhereIcon />&emsp;รับเรื่องการจองห้อง
                                        </p>
                                    </Link>
                                    <Link to='UserManagement' style={{ textDecoration: 'none' }}>
                                        <p className={`${styles.itemNav} ${(currentPath.includes('/UserManagement')) && styles.activeLink}`}>
                                            <PeopleAlt />&emsp;จัดการผู้ใช้
                                        </p>
                                    </Link>
                                    <Link to='/' onClick={notifyWhenLogout} style={{ textDecoration: 'none' }}>
                                        <p className={styles.itemNav}><LogoutIcon />&emsp;Log out</p>
                                    </Link>
                                    <Link to='/' style={{ textDecoration: 'none' }}>
                                        <p className={styles.itemNav}><CorporateFare />&emsp;Back to Floorplan</p>
                                    </Link>
                                </div>
                            </Hidden>
                        </Grid>
                        <Grid item lg={10} md={9} xs={12}>
                            <Grid container spacing={{ xs: 12, md: 0 }}>
                                <Grid item xs={12} >
                                    <Hidden mdUp implementation="css">
                                        <div className={styles.NavContainer}>
                                            <IconButton onClick={() => setOpenDrawer(!openDrawer)} sx={{}}>
                                                <MenuIcon sx={{ color: 'white' }} fontSize='large' />
                                            </IconButton>
                                            <Drawer anchor='left' open={openDrawer} onClose={() => setOpenDrawer(false)} sx={{ zIndex: '1300' }}>
                                                <div style={{ width: '50vw', height: '100vh' }}>
                                                    <div className={styles.left}>
                                                        <Link to='' style={{ textDecoration: 'none' }}>
                                                            <div className={(
                                                                !currentPath.includes('/Booking') && !currentPath.includes('/BookingManagement') &&
                                                                !currentPath.includes('/Static') && !currentPath.includes('/Advertise') &&
                                                                !currentPath.includes('/RoomList') && !currentPath.includes('/CalendarView') &&
                                                                !currentPath.includes('/UserManagement')
                                                            )
                                                                ? styles.activeHome : ""}
                                                            >
                                                                <img src={logo} width='6vw' alt="" /><hr />
                                                            </div>
                                                        </Link>
                                                        <Link to='RoomList' style={{ textDecoration: 'none' }}>
                                                            <p className={`${styles.itemNav} ${(currentPath.includes('/RoomList')) && styles.activeLink}`}>
                                                                <MeetingRoomIcon />&emsp;รายชื่อห้อง
                                                            </p>
                                                        </Link>
                                                        <Link to='CalendarView' style={{ textDecoration: 'none' }}>
                                                            <p className={`${styles.itemNav} ${(currentPath.includes('/CalendarView')) && styles.activeLink}`}>
                                                                <CalendarMonthIcon />&emsp;ปฎิทินการใช้งานและกิจกรรม
                                                            </p>
                                                        </Link>
                                                        <Link to='Booking' style={{ textDecoration: 'none' }}>
                                                            <p className={`${styles.itemNav} ${(currentPath.includes('/Booking') && !currentPath.includes('/BookingManagement')) && styles.activeLink}`}>
                                                                <BookmarkAddIcon />&emsp;จองห้อง
                                                            </p>
                                                        </Link>
                                                        <Link to='Static' style={{ textDecoration: 'none' }}>
                                                            <p className={`${styles.itemNav} ${(currentPath.includes('/Static')) && styles.activeLink}`}>
                                                                <EqualizerIcon />&emsp;สถิติการใช้งาน
                                                            </p>
                                                        </Link>
                                                        <Link to='Advertise' style={{ textDecoration: 'none' }}>
                                                            <p className={`${styles.itemNav} ${(currentPath.includes('/Advertise')) && styles.activeLink}`}>
                                                                <AnnouncementIcon />&emsp;กิจกรรม / ประชาสัมพันธ์
                                                            </p>
                                                        </Link>
                                                        <Link to='BookingManagement' style={{ textDecoration: 'none' }}>
                                                            <p className={`${styles.itemNav} ${(currentPath.includes('/BookingManagement')) && styles.activeLink}`}>
                                                                <BeenhereIcon />&emsp;รับเรื่องการจองห้อง
                                                            </p>
                                                        </Link>
                                                        <Link to='UserManagement' style={{ textDecoration: 'none' }}>
                                                            <p className={`${styles.itemNav} ${(currentPath.includes('/UserManagement')) && styles.activeLink}`}>
                                                                <BeenhereIcon />&emsp;จัดการผู้ใช้
                                                            </p>
                                                        </Link>
                                                        <Link to='/' style={{ textDecoration: 'none' }} onClick={notifyWhenLogout}>
                                                            <p className={styles.itemNav}><LogoutIcon />&emsp;Log out</p>
                                                        </Link>
                                                        <Link to='/' style={{ textDecoration: 'none' }}>
                                                            <p className={styles.itemNav}><CorporateFare />&emsp;Back to Floorplan</p>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </Drawer>
                                        </div>
                                    </Hidden>
                                </Grid>
                                <Grid item lg={12} xs={12} md={12} sx={{ mt: { xs: '-3vh', sm: '-1vh', md: '1vh', lg: '0' } }}>
                                    <Routes>
                                        <Route path='*' element={<DashBoard />} />
                                        <Route path='Static' element={<Static />} />
                                        <Route path='Advertise' element={<Advertising adminRight={true} />} />
                                        <Route path='BookingManagement' element={<BookingManagement />} />
                                        <Route path='BookingManagement/DeletedHistory' element={<DeletedHistory />} />
                                        <Route path='BookingManagement/Edit-bookingID/:bookingId' element={<EditBooking />} />
                                        <Route path='UserManagement' element={<UserManagement />} />
                                        <Route path='RoomDetail/:roomID' element={<RoomDetail />} />
                                        <Route path='CalendarView' element={<CalendarView />} />
                                        <Route path='Booking' element={<ReservationForm />} />
                                        <Route path='RoomList' element={<SuperUser_RoomList />} />
                                        <Route path='RoomList/Edit/:roomID' element={<EditRoomData />} />
                                    </Routes>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </>
            )}
        </AdminContext.Provider>
    );
}

export default AdminPage
