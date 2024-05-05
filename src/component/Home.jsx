import React, { createContext, useState, useEffect } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import { Grid, Box, Drawer, Hidden, useMediaQuery } from '@mui/material';
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import styles from './Home.module.css'
import Floor from './Floor/Floor';
import API_DATA from './link';
import Advertising from './Advertise/Advertising';
import RoomDescription from './Floor/Description/RoomDescription';
import ClientCancelReservation from './Booking/ClientCancelReservation';
import AdvertiseDetail from './Advertise/AdvertiseDetail';
import SideNav from './NavBar/SideNav';
import TVVersion from './TV/TVVersion';
import TVTouch from './TV_TouchScreen/TVTouch';
import logoSVG from '/assets/img/it_logo.svg';
import DisplaySigninPage from './User_Sign_in/DisplaySigninPage';

export const HomeContext = createContext('');

function Home() {
  const phoneHorizon = useMediaQuery('(min-width:600px) and (max-width:1000px) and (min-height:300px) and (max-height:600px)');
  //clock
  const [currentTime, setCurrentTime] = useState(moment());
  useEffect(() => {
    const intervalId = setInterval(() => {setCurrentTime(moment());}, 1000);
    return () => {clearInterval(intervalId);};
  }, []);
  const [openDrawer, setOpenDrawer] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isTVPath = location.pathname.includes('/TV');
  const isTVTouchPath = location.pathname.includes('/Touch');
  const isAdsPath = location.pathname.includes('/Advertise');
  //get API
  const [linkBookDB, setLinkBookDB] = useState([]);
  let timerBookId; // Store the timer ID to clear it later
  useEffect(() => {
      const fetchData = async () => {
        if (!isAdsPath){
          try {
              const response = await axios.get(API_DATA.linkBook);
              const events = response.data;
              setLinkBookDB(events);
          } catch (error) {
              console.error(error);
          } finally {
            // Calculate the milliseconds remaining until the next minute
            const delay = 60000 - (moment().seconds() * 1000 + moment().milliseconds());
            // Schedule the next fetch
            timerBookId = setTimeout(fetchData, delay);
          }
        }
      };
      
      // Fetch data initially
      fetchData();
      
      // Cleanup function to clear the timer on component unmount
      return () => clearTimeout(timerBookId);
  }, [isAdsPath]);

  const [roomDB, setRoomDB] = useState([]);
  let timerRoomId; // Store the timer ID to clear it later
  useEffect(() => {
      const fetchData = async () => {
        if (!isAdsPath){
          try {
              const response = await axios.get(API_DATA.room);
              const events = response.data;
              setRoomDB(events);
          } catch (error) {
              console.error(error);
          } finally {
            // Calculate the milliseconds remaining until the next minute
            const delay = 60000 - (moment().seconds() * 1000 + moment().milliseconds());
            // Schedule the next fetch
            timerRoomId = setTimeout(fetchData, delay);
          }
        }
      };
      
      // Fetch data initially
      fetchData();
      
      // Cleanup function to clear the timer on component unmount
      return () => clearTimeout(timerRoomId);
  }, [isAdsPath]);

  const [haveAdsData, setHaveAdsData] = useState(false);
  const [linkAdsDB, setLinkAdsDB] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      axios.get(API_DATA.linkAds)
      .then(response => {
        setLinkAdsDB(response.data)
        setHaveAdsData(true)
      })
      .catch(error => console.log(error));
    }, 1000)
  }, []);

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

  const notifyLogout = () => {
    toast.success("Logged out...");
  }
  useEffect(() => {
    if (!sessionStorage.getItem('token') && sessionStorage.getItem('notify')) {
      notifyLogout();
      sessionStorage.removeItem('notify');
    }
  }, []);

  useEffect(() => {
    // Function to group rooms by advertiseId
    const groupRoomsByAdvertiseId = () => {
      const roomGroups = {};
      linkAdsDB.forEach(item => {
        const { advertiseId, roomId } = item;
        if (!roomGroups[advertiseId]) {
          roomGroups[advertiseId] = [roomId];
        } else {
          roomGroups[advertiseId].push(roomId);
        }
      });
      return roomGroups;
    };
  
    // Function to format room IDs
    const formatRoomIds = (roomIds) => {
      return roomIds.map((roomId) => roomId).join(', ');
    };
  
    // Call the function to group rooms
    const groupedRooms = groupRoomsByAdvertiseId();
  
    // Variable to store the last displayed advertiseId
    let lastDisplayedAdvertiseId = null;
  
    // Iterate through each item in linkAdsDB
    linkAdsDB.forEach(item => {
      const isToday = (moment().isSame(moment(item.advertise.active_date), 'day') && moment().isBefore(moment(item.advertise.end_date))); // Check if data pulled from the database is the same day as today
      if (isToday) {
        // Check if the current advertiseId is different from the last displayed one
        if (item.advertiseId !== lastDisplayedAdvertiseId) {
          const adsItem = () => (
            <Link to='/Advertise' style={{ textDecoration: 'none', color: 'gray' }}>
              <div style={{ cursor: 'pointer' }}>
                <p className={styles.toastAds}>กิจกรรมวันนี้: {item.advertise.title}</p>
                {/* Display all rooms related to this advertiseId */}
                <React.Fragment>
                  <p className={styles.toastRoom}>สถานที่: {formatRoomIds(groupedRooms[item.advertiseId])}</p>
                </React.Fragment>
                เวลา: {moment(item.advertise.active_date).locale('th').format('LT')} - {moment(item.advertise.end_date).locale('th').format('LT')}
              </div>
            </Link>
          );
          // Display the toast
          toast(adsItem, {
            position: 'top-right',
            hideProgressBar: true,
            autoClose: 60000,
            draggable: true,
          });
          
          // Update the lastDisplayedAdvertiseId
          lastDisplayedAdvertiseId = item.advertiseId;
        }
      }
    });
  }, [haveAdsData]);
  

  const updateRoomStatus = (roomArray) => {
    axios.put(API_DATA.updateRoom, {
      roomArray:roomArray,
    })
    // .then(response => console.log(response.data))
    .catch(error => console.log(error));
  };

  //set floor level
  const [floor, setFloor] = useState(1);
  const [direction, setDirection] = useState('up');
  const floorUp = () => {
    if (floor < 4 && location.pathname.includes('/Floor')) {
      setFloor(floor + 1);
      setDirection('up')
    }
  }
  const floorDown = () => {
    if (floor > 1 && location.pathname.includes('/Floor')) {
      setFloor(floor - 1);
      setDirection('down')
    }
  }

  const [logo, setLogo] = useState(logoSVG)

  //category
  const [isSelect, setSelect] = useState("unselected");
  const classify = (category)=>{
    setSearchQuery('');
    if(!location.pathname.includes('/Advertise')){
      if(isSelect != category){
        setSelect(category);
      }
      else{
        setSelect('unselected')
      }
    }
  }
  //end category

  //search
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    if (searchQuery != ''){
      setFloor(searchQuery[1]);
      if (!isTVTouchPath){
        navigate(`/Floor/${searchQuery[1]}`);
      } else if (isTVTouchPath){
        navigate(`/Touch/Floor/${searchQuery[1]}`);
      }
    }
  }, [searchQuery])
  //end search

  //classify
    useEffect(() => {
      let roomList = document.querySelectorAll('.sroom, .lroom, .room');

      Array.from(roomList).forEach(element => {
        const roomNameElement = element.getElementsByTagName('h5')[0];
        const roomActivityElement = element.getElementsByTagName('p')[0];

        if (roomNameElement && roomActivityElement) {
          const roomName = roomNameElement.innerText.toLowerCase();
          const roomSearch = (roomName.includes(String(searchQuery[0]).toLowerCase()) && searchQuery !== '');
          let roomFilter = false;
          if (searchQuery !== '' && searchQuery !== ' '){
            setSelect("unselected")
            roomFilter = roomSearch;
          } else{ 
            roomFilter = (isSelect != "unselected" ? element.classList.contains(isSelect) : false)
          }
          element.classList.toggle('selectedRoom', roomFilter);
        }
      });
    });
  //end classify

  const shouldShowToast = location.pathname === `/Floor/${floor}`;
  const GeneralRoom = ['R111','M05','M12','M13','M14','M15','215','310','316','317','322','323','324','325', '331', '332','410','412','416','418','424','426','427','428','430','431','437','438','439'];
  return (
    <HomeContext.Provider value={{ roomDB, linkBookDB, searchQuery, isSelect, currentTime, GeneralRoom, updateRoomStatus, setFloor, setSearchQuery
    , floorUp, floorDown, logo, floor, classify, labData, direction }}>
      {phoneHorizon ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <p>กรุณาหมุนโทรศัพท์เพื่อการแสดงผลที่ดีที่สุด</p>
            <div className={styles.rotate}>
              <ScreenRotationIcon />
            </div>
          </div>
        </div>
      ):(
        <>
          <Box sx={{ flexGrow: 1 }}>
            {shouldShowToast && (
              <ToastContainer />
            )}
            {isTVPath &&(
              <TVVersion />
            )}
            {isTVTouchPath && (
              <TVTouch floor={floor} setFloor={setFloor}/>
            )}
            {(!isTVPath && !isTVTouchPath) && (
              <>
              <Grid container spacing={0}>   
                <Grid item xs={openDrawer && 0} lg={2} md={3}>
                  <Hidden mdDown implementation="css">
                    <SideNav />
                  </Hidden>
                </Grid>
                <Grid item lg={10} md={9} xs={12}>
                  <Grid container spacing={{xs:0,md:0}}>
                    <Grid item xs={12} >
                      <Hidden mdUp implementation="css">
                        <div className={styles.NavContainer}>
                          <IconButton onClick={() => setOpenDrawer(!openDrawer)} >
                            <MenuIcon sx={{color:'white'}} fontSize='large'/>
                          </IconButton>
                        </div>
                          <Drawer anchor='left' open={openDrawer} onClose={() => setOpenDrawer(false)} sx={{zIndex: 100}}>
                            <div style={{width: '50vw', height: '100vh'}}>
                              <SideNav phoneSize={true}/>
                            </div>
                          </Drawer>
                      </Hidden>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: {xs: '10vh', md: '2vh', lg: '1vh'} }}>
                        <Routes>
                          <Route path='*' element={<Floor  floor={floor} />}/>
                          <Route path='/RoomDescription/:roomId' element={<RoomDescription />}/>
                          <Route path='/Advertise' element={<Advertising adminRight={false} setFloor={setFloor} setSearchQuery={setSearchQuery}/>}/>
                          <Route path='/Cancellation' element={<ClientCancelReservation />} />
                          <Route path='/AdvertiseDetail/:adsId' element={<AdvertiseDetail />}/>
                          <Route path='/sign_in' element={<DisplaySigninPage />}/>
                        </Routes>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </>
            )}
          </Box>
        </>
      )}
    </HomeContext.Provider>
  );
}
export default Home
