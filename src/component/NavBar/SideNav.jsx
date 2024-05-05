import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import moment from 'moment';
import { HomeContext } from '../Home'
import { Link, useLocation } from 'react-router-dom';
import { Grid, Autocomplete, TextField, IconButton } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import BarChartIcon from '@mui/icons-material/BarChart';
import WcIcon from '@mui/icons-material/Wc';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ComputerIcon from '@mui/icons-material/Computer';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import styles from './SideNav.module.css'
import { TouchContext } from '../TV_TouchScreen/TVTouch';
import API_DATA from '../link';
import Swal from 'sweetalert2';

function SideNav({ phoneSize }) {
    
    const location = useLocation();
    const { searchQuery, logo, floorUp, floorDown,
            isSelect, floor, classify, setSearchQuery, currentTime } = useContext(HomeContext);
    const { Touch } = useContext(TouchContext);
    const [canOpen, setCanOpen] = React.useState(true);
    let options = {};
    const [allRoomData, setAllRoomData] = useState([]);
    useEffect(() => {
        axios.get(API_DATA.roomLinkBook)
        .then(response => setAllRoomData(response.data))
        .catch(error => console.log(error));
    }, []);

    allRoomData.forEach(room => {
        options[room.id] = {
            id: room.id,
            room_name: room.room_name,
            room_image: room.room_image,
            floor: room.floor,
            description: room.description,
            seat: room.seat,
            room_status: room.room_status,
            room_category: room.room_category,
            booking: room.booking,
            laboratory: room.laboratory,
            accessories: room.accessories,
        };
    });
    const roomCategoryMapping = {
        'Small_Lecture_Room': ['ห้องบรรยาย', 'ห้องเรียน', 'lecture'],
        'Large_Lecture_Room': ['ห้องบรรยาย', 'ห้องเรียน', 'lecture'],
        'Large_Laboratory_Room': ['ห้องทดลอง', 'ห้องเรียน', 'ห้องlab', 'ห้องคอม', 'computer', 'laboratory'],
        'Small_Laboratory_Room': ['ห้องทดลอง', 'ห้องเรียน', 'ห้องlab', 'ห้องคอม', 'computer', 'laboratory'],
        'Entertainment_Room': ['ห้องส่วนกลาง', 'กิจกรรม', 'activity', 'entertainment'],
        'Education_Service_Room': ['ห้องบริการนักศึกษา', 'ช่วยเหลือ', 'service', 'help', 'support'],
    };
    const roomSpecialMapping = {
        'M05': ['ห้องยืมอุปกรณ์', 'ห้องเอกสาร', 'ห้องฟ้า'],
        'M12': ['ห้องงานกิจกรรม'],
        'COMMON': ['พื้นที่ทำงาน', 'ห้องทำงาน', 'พื้นที่อเนกประสงค์', 'อ่านหนังสือ'],
        '306': ['ห้องเน็ตเวิร์ก', 'ห้องnetwork', 'networkroom'],
        '325': ['ห้องปริ้นเอกสาร', 'ห้องprinter'],
        '333': ['พื้นที่ทำงาน', 'ห้องทำงาน', 'ใช้คอมสำหรับนักศึกษา'],
        'C1': ['จองห้องติวหนังสือ', 'จองห้องทำงาน', 'ห้องครีเอทีฟ', 'c1'],
        'C2': ['จองห้องติวหนังสือ', 'จองห้องทำงาน', 'ห้องครีเอทีฟ', 'c2'],
        'PT1': ['จองห้องติวหนังสือ', 'จองห้องทำงาน', 'p1'],
        'PT2': ['จองห้องติวหนังสือ', 'จองห้องทำงาน', 'p2'],
        'PT3': ['จองห้องติวหนังสือ', 'จองห้องทำงาน', 'p3'],
        '406': ['ห้องslope'],
        '410': ['ห้องDeeptech'],
    };
    const shortWordRoom = {
        'C1': 'Creative and Ideation 1',
        'C2': 'Creative and Ideation 2',
        'PT1': 'Peer Tutor 1',
        'PT2': 'Peer Tutor 2',
        'PT3': 'Peer Tutor 3',
    }
    const getCustomLabel = (option) => {
        if (option.id === '406'){
            return `${option.id} (ห้อง Slope)`;
        }
        if (option.id === '306'){
            return `${option.id} (ห้อง Network)`;
        }
        if (option.id === '410'){
            return `${option.id} (ห้อง Deep Tech)`;
        }
        if (option.room_category.endsWith('_Lecture_Room') && option.id !== '406'){
            return `${option.id} (ห้องบรรยาย)`;
        }
        if (option.room_category.endsWith('_Laboratory_Room')){
            return `${option.id} (ห้องคอม)`;
        }
        if (shortWordRoom[option.id]){
            return `${shortWordRoom[option.id]}`;
        }
        if (option.id === 'M05'){
            return `${option.id} (ห้องฟ้า)`;
        }
        if (option.id === '325'){
            return `${option.id} (ห้องปริ้นเตอร์)`;
        }
        if (option.id === 'M12'){
            return `${option.id} (ห้องงานกิจกรรม)`;
        }
        return option.id || '';
    };
    const howToUseOnce = () => {
        if (canOpen) {
            Swal.fire({
                title: 'คำที่ค้นหาได้',
                html: 'ชื่อกิจกรรม, ชื่อผู้บรรย, ชื่อห้อง, อุปกรณ์ภายในห้อง, hardware, software <br />keyword อื่นๆ เช่น ห้องฟ้า, ห้องปริ้นเตอร์, ห้องทำงาน',
                customClass: {
                    popup: styles.customSwal
                }
            });
            setCanOpen(false);
        }
    }
    const howToUse = () => {
        Swal.fire({
            title: 'keyword ที่ค้นหาได้',
            html: 'ชื่อกิจกรรม, ชื่อผู้บรรย, ชื่อห้อง, อุปกรณ์ภายในห้อง, hardware, software <br />keyword อื่นๆ เช่น ห้องฟ้า, ห้องปริ้นเตอร์, ห้องทำงาน',
            customClass: {
                popup: styles.customSwal
            }
        });
        setCanOpen(false)
    }

    const filterOptions = (options, inputValue, roomCategoryMapping, roomSpecialMapping, currentTime) => {
        return options.filter((option) => {
            inputValue = inputValue.replace(/\s/g, '').toLowerCase();
            // Check if room category matches
            const roomCategoryMatch = Object.entries(roomCategoryMapping).some(([roomCategory, searchTerms]) => {
                return searchTerms.some(searchTerm => searchTerm.toLowerCase().includes(inputValue)) && option.room_category === roomCategory;
            });
            // Check if room name matches
            const nameMatch = (option.room_name.toLowerCase().includes(inputValue) || option.id.toLowerCase().includes(inputValue));
            // Check if roomSpecial matches
            const roomSpecialMatch = Object.entries(roomSpecialMapping).some(([roomSpecial, searchTerms]) => {
                return searchTerms.some(searchTerm => searchTerm.toLowerCase().includes(inputValue)) && option.id === roomSpecial;
            });
            // Check if any booking matches
            const bookingMatch = option.booking.some(booking => {
                const startTime = moment(booking.check_in_datetime);
                const endTime = moment(booking.check_out_datetime);
                // Check if the current time is between the start and end time
                const isCurrentTimeBetween = currentTime.isBetween(startTime, endTime);
                const bookingData = JSON.stringify(booking).replace(/\s/g, '').toLowerCase();
                const doesBookingIncludeInput = bookingData.includes(inputValue);
                return isCurrentTimeBetween && doesBookingIncludeInput;
            });
            // Check if laboratory matches
            const labMatch = option.laboratory && JSON.stringify(option.laboratory).toLowerCase().includes(inputValue);
            // Check if accessories matches
            const accessoriesMatch = option.accessories && JSON.stringify(option.accessories).toLowerCase().includes(inputValue);
            
            return nameMatch || bookingMatch || labMatch || accessoriesMatch || roomCategoryMatch || roomSpecialMatch;
        });
    };

    return (
        <>
            {Touch ? (
                <>
                    <div className={styles.touch}>
                        <h3 className={styles.topic}>Search</h3>
                        <Grid container>
                            <Grid item lg={10} xs={10}>     
                                <Autocomplete
                                    onOpen={howToUseOnce}
                                    noOptionsText={'ไม่พบห้องที่ต้องการค้นหา'}
                                    sx={{ bgcolor: 'white', borderRadius: '4px', ml: '2vw' }}
                                    options={Object.values(options).sort((a, b) => a.floor - b.floor)}
                                    getOptionLabel={getCustomLabel}
                                    renderInput={(params) => <TextField {...params} />}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    onChange={(event, newValue) => {
                                        if (newValue) {
                                            setSearchQuery([newValue.id, newValue.floor]);
                                        } else {
                                            setSearchQuery('');
                                        }
                                    }}
                                    value={options[searchQuery[0]] || null}
                                    filterOptions={(options, params) =>
                                        filterOptions(options, params.inputValue, roomCategoryMapping, roomSpecialMapping, currentTime)
                                    }
                                />
                            </Grid>
                            <Grid item lg={2} xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <IconButton size='small' onClick={howToUse}>
                                    <HelpOutlineIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <h3 className={styles.topic}>Room Category</h3>
                        {(floor !== 2 && floor !== 3) && (
                            <>
                                <h3 className={`${styles.category} ${(isSelect === "Small_Lecture_Room") ? styles.selected : styles.unselected}`} id='sm-lr' onClick={()=>classify("Small_Lecture_Room")}>&emsp;<ImportContactsIcon fontSize='small'/>&emsp; ห้องบรรยายเล็ก</h3>
                            </>
                        )}                        {/* <h3 className={`${styles.category} ${(isSelect === "Medium_Lecture_Room") ? styles.selected : styles.unselected}`} id='lg-lr' onClick={()=>classify("Medium_Lecture_Room")}>&emsp;<ImportContactsIcon fontSize='small' />&emsp; ห้องบรรยายกลาง</h3> */}
                        {floor === 3  && (
                            <>
                                <h3 className={`${styles.category} ${(isSelect === "Medium_Lecture_Room") ? styles.selected : styles.unselected}`} id='cm-r' onClick={()=>classify("Medium_Lecture_Room")}>&emsp;<ImportContactsIcon fontSize='small' />&emsp; ห้องบรรยายกลาง</h3> 
                            </>
                        )}                        
                        <h3 className={`${styles.category} ${(isSelect === "Large_Lecture_Room") ? styles.selected : styles.unselected}`} id='lg-lr' onClick={()=>classify("Large_Lecture_Room")}>&emsp;<ImportContactsIcon fontSize='small' />&emsp; ห้องบรรยายใหญ่</h3>
                        {(floor !== 1 && floor !== 4) && (
                            <>
                                <h3 className={`${styles.category} ${(isSelect === "Small_Laboratory_Room") ? styles.selected : styles.unselected}`} id='ex-r' onClick={()=>classify("Small_Laboratory_Room")}>&emsp;<ComputerIcon fontSize='small'/>&emsp; ห้องทดลองเล็ก</h3>
                            </>
                        )}
                        {(floor !== 1 && floor !== 4) && (
                            <>
                                <h3 className={`${styles.category} ${(isSelect === "Large_Laboratory_Room") ? styles.selected : styles.unselected}`} id='ex-r' onClick={()=>classify("Large_Laboratory_Room")}>&emsp;<ComputerIcon fontSize='small'/>&emsp; ห้องทดลองใหญ่</h3>
                            </>
                        )}
                        <h3 className={`${styles.category} ${(isSelect === "Education_Service_Room") ? styles.selected : styles.unselected}`} id='ex-r' onClick={()=>classify("Education_Service_Room")}>&emsp;<SupportAgentIcon fontSize='small'/>&emsp; ห้องบริการนักศึกษา</h3>
                        {floor === 1 && (
                            <>
                                <h3 className={`${styles.category} ${(isSelect === "Large_Conference_Room") ? styles.selected : styles.unselected}`} id='mt-lr' onClick={()=>classify("Large_Conference_Room")}>&emsp;<i className="bi bi-easel3-fill"></i>&emsp; ห้องประชุมใหญ่</h3>
                            </>
                        )}
                        {floor === 1  && (
                            <>
                                <h3 className={`${styles.category} ${(isSelect === "Entertainment_Room") ? styles.selected : styles.unselected}`} id='cm-r' onClick={()=>classify("Entertainment_Room")}>&emsp;<i className="bi bi-palette-fill"></i>&emsp; ห้องสันทนาการ</h3> 
                            </>
                        )}                        
                        <h3 className={`${styles.category} ${(isSelect === "toilet") ? styles.selected : styles.unselected}`} id='tl-lr' onClick={()=>classify("toilet")}>&emsp;<WcIcon fontSize='small'/>&emsp; ห้องน้ำ</h3>
                        <h3 className={styles.topic}>Announcement</h3>
                        <Link to="/Touch/Advertising" className={styles.category} onClick={()=>classify("unselected")}>
                            <p>&emsp;<AnnouncementIcon />กิจกรรม / ประชาสัมพันธ์</p>
                        </Link>
                    </div>
                </>
            ) : (
                <>
                <div className={`${styles.nav} ${phoneSize ? styles.navPhone : ''}`}>
                    <img src={logo} alt="" width={'95%'} style={{marginBottom: '20px', marginLeft: '5px'}}/>
                        <Grid container spacing={2} className={styles.selectFloorZone}>
                            <Grid item xs={12} sm={12}  md={8} lg={8} className={location.pathname.includes('/Floor') ? styles.floorPlanActive : ""}>
                                <Link to="/" style={{ textDecoration: "none" }}>
                                    <p className={`${styles.floorPlanText}`}>แผนผังห้องเรียน</p>
                                </Link>
                            </Grid>
                            {window.innerWidth >= 900 ? 
                            <Grid item xs={0} sm={4} lg={4} className={styles.floor}>
                                <Grid container spacing={0} style={{paddingRight: '10%'}}>
                                    <Grid item xs={4}>
                                    <p onClick={floorUp} className={styles.selectFloor} id='floorUpBtn' style={{opacity: floor == 4 ? 0.5 : 1}}>
                                        <KeyboardArrowUpIcon />
                                    </p>
                                    </Grid>
                                    <Grid item xs={4}>
                                    <p style={{paddingLeft:'10%',paddingRight: '10%'}}>{floor}</p>
                                    </Grid>
                                    <Grid item xs={4}>
                                    <p onClick={floorDown} className={styles.selectFloor} id='floorDownBtn' style={{opacity: floor == 1 ? 0.5 : 1}}>
                                        <KeyboardArrowDownIcon />
                                    </p>
                                    </Grid>
                                </Grid>
                            </Grid> : null}
                        </Grid>
                    <div className={styles.normal}>
                        <h3 className={styles.topic}>Search</h3>    
                            <Grid container>
                                <Grid item lg={10} xs={10}>     
                                    <Autocomplete
                                        onOpen={howToUseOnce}
                                        noOptionsText={'ไม่พบห้องที่ต้องการค้นหา'}
                                        sx={{ bgcolor: 'white', borderRadius: '4px', ml: '2vw' }}
                                        options={Object.values(options).sort((a, b) => a.floor - b.floor)}
                                        getOptionLabel={getCustomLabel}
                                        renderInput={(params) => <TextField {...params} />}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        onChange={(event, newValue) => {
                                            if (newValue) {
                                                setSearchQuery([newValue.id, newValue.floor]);
                                            } else {
                                                setSearchQuery('');
                                            }
                                        }}
                                        value={options[searchQuery[0]] || null}
                                        filterOptions={(options, params) =>
                                            filterOptions(options, params.inputValue, roomCategoryMapping, roomSpecialMapping, currentTime)
                                        }
                                    />
                                </Grid>
                                <Grid item lg={2} xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <IconButton size='small' onClick={howToUse}>
                                        <HelpOutlineIcon sx={{color: 'white'}}/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        <h3 className={styles.topic}>Room Category</h3>
                        {(floor !== 2 && floor !== 3) && (
                            <>
                                <h3 className={`${styles.category} ${(isSelect === "Small_Lecture_Room") ? styles.selected : styles.unselected}`} id='sm-lr' onClick={()=>classify("Small_Lecture_Room")}>&emsp;<ImportContactsIcon fontSize='small'style={{ color: 'white' }}/>&emsp; ห้องบรรยายเล็ก</h3>
                            </>
                        )}
                        {floor === 3  && (
                            <>
                                <h3 className={`${styles.category} ${(isSelect === "Medium_Lecture_Room") ? styles.selected : styles.unselected}`} id='cm-r' onClick={()=>classify("Medium_Lecture_Room")}>&emsp;<ImportContactsIcon fontSize='small' />&emsp; ห้องบรรยายกลาง</h3> 
                            </>
                        )}   
                        <h3 className={`${styles.category} ${(isSelect === "Large_Lecture_Room") ? styles.selected : styles.unselected}`} id='lg-lr' onClick={()=>classify("Large_Lecture_Room")}>&emsp;<ImportContactsIcon fontSize='small' />&emsp; ห้องบรรยายใหญ่</h3>
                        {(floor !== 1 && floor !== 4) && (
                            <>
                                <h3 className={`${styles.category} ${(isSelect === "Small_Laboratory_Room") ? styles.selected : styles.unselected}`} id='ex-r' onClick={()=>classify("Small_Laboratory_Room")}>&emsp;<ComputerIcon fontSize='small'/>&emsp; ห้องทดลองเล็ก</h3>
                            </>
                        )}
                        {(floor !== 1 && floor !== 4) && (
                            <>
                                <h3 className={`${styles.category} ${(isSelect === "Large_Laboratory_Room") ? styles.selected : styles.unselected}`} id='ex-r' onClick={()=>classify("Large_Laboratory_Room")}>&emsp;<ComputerIcon fontSize='small'/>&emsp; ห้องทดลองใหญ่</h3>
                            </>
                        )}
                        <h3 className={`${styles.category} ${(isSelect === "Education_Service_Room") ? styles.selected : styles.unselected}`} id='ex-r' onClick={()=>classify("Education_Service_Room")}>&emsp;<SupportAgentIcon fontSize='small'/>&emsp; ห้องบริการนักศึกษา</h3>
                        {floor === 1 && (
                            <>
                                <h3 className={`${styles.category} ${(isSelect === "Large_Conference_Room") ? styles.selected : styles.unselected}`} id='mt-lr' onClick={()=>classify("Large_Conference_Room")}>&emsp;<i className="bi bi-easel3-fill"></i>&emsp; ห้องประชุมใหญ่</h3>
                            </>
                        )}
                        {floor === 1  && (
                            <>
                                <h3 className={`${styles.category} ${(isSelect === "Entertainment_Room") ? styles.selected : styles.unselected}`} id='cm-r' onClick={()=>classify("Entertainment_Room")}>&emsp;<i className="bi bi-palette-fill"></i>&emsp; ห้องสันทนาการ</h3> 
                            </>
                        )}
                        <h3 className={`${styles.category} ${(isSelect === "toilet") ? styles.selected : styles.unselected}`} id='tl-lr' onClick={()=>classify("toilet")}>&emsp;<WcIcon fontSize='small'/>&emsp; ห้องน้ำ</h3>
                        <h3 className={styles.topic}>Announcement</h3>
                        <Link to="/Advertise" onClick={()=>classify("unselected")} style={{ textDecoration: 'none' }}>
                            <p className={`${styles.category} ${(location.pathname.includes('/Advertise')) && styles.activeLink}`}>&emsp;<AnnouncementIcon /> กิจกรรม / ประชาสัมพันธ์</p>
                        </Link>
                        <h3 className={styles.topic}>Admin Zone</h3>
                        <Link to="/Login" style={{ textDecoration: 'none' }}>
                            <p className={styles.category}>&emsp;<BarChartIcon /> ADMIN LOGIN</p>
                        </Link>
                    </div>
                </div>
                </>
            )}
        </>
    )
}

export default SideNav