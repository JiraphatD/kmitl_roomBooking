import React, { useState, useEffect } from 'react'
import axios from 'axios';
import moment from 'moment';
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid';
import { Select, MenuItem, InputLabel, FormControl, ToggleButtonGroup, ToggleButton, Button, useMediaQuery, Hidden, Radio, RadioGroup, FormLabel, FormControlLabel } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CircularProgress from '@mui/material/CircularProgress';
import Export from './Export';
import API_DATA from '../../link';
import styles from './Static.module.css'

function Static() {
  //responsive
  const phone = useMediaQuery('(max-width:600px)');
  const tablet = useMediaQuery('(max-width:1200px)');
  const vwToPx = (value) => window.innerWidth * (value / 100);
  const vhToPx = (value) => window.innerHeight * (value / 100);
  //get API
  const [roomBook, setRoomBook] = useState([]);
    useEffect(() => {
        axios.get(API_DATA.roomBook)
            .then(response => setRoomBook(response.data))
            .catch(error => console.log(error));
    }, []);

  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    if(roomBook.length!=0){
      setLoading(false)
    }
  }, [roomBook])
  //create useState for input dropdown
  const [month, setMonth] = React.useState(0);
  const handleChangeMonth = (event) => {
    setMonth(event.target.value);
  };

  const [year, setYear] = React.useState(parseInt(moment().format('YYYY'))+543);
  const handleChangeYear = (event) => {
    setYear(event.target.value);
  };
  const yearMenuItems = [];
  for (let i = 0; i < 5; i++) { //create 5 year ago to current year item selector
    const year = parseInt(moment().format('YYYY'))+543 - i;
    yearMenuItems.push(
      <MenuItem key={year} value={year}>
        {year}
      </MenuItem>
    );
  }

  const [type, setType] = React.useState('all');
  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  const [role, setRole] = React.useState('all');
  const handleChangeRole = (event) => {
    setRole(event.target.value);
  };

  const [dateType, setDateType] = React.useState('month');
  const handleChangeDateType = (event) => {
    setDateType(event.target.value);
  };

  const [selectDate, setSelectDate] = useState({
    startDate: null,
    endDate: null,
  });
  const handleChangeDate = (event) => {
    const { name, value } = event.target;
    if (name === 'startDate') {
      const startDate = dayjs(value);
      if (startDate !== null && startDate.isValid()) {
        setSelectDate({
              ...selectDate,
              [name]: startDate,
          });
      } else {
          // Handle invalid input (optional)
          console.error('Invalid time format');
      }
    } else if (name === 'endDate') {
        const endDate = dayjs(value);
        if (endDate !== null && endDate.isValid()) {
          setSelectDate({
                ...selectDate,
                [name]: endDate,
            });
        } else {
            // Handle invalid input (optional)
            console.error('Invalid time format');
        }
    } 
  };
  //create useState for select chart type
  const [chartType, setChartType] = React.useState('กราฟแท่ง');
  const handleChartType = (event, newChartType) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };
  //variable for filter and export
  let roomBookArray = [];
  let hourBookArray = [];
  let maxRoomHour = -Infinity;
  let maxRoomMostTimeRange = -Infinity; //use to find used time range
  let maxRoomLeastTimeRange = -Infinity; //use to find used time range
  let maxRoom = '';
  let minRoomHour = Infinity;
  let minRoomMostTimeRange = Infinity;  //use to find used time range
  let minRoomLeastTimeRange = Infinity;  //use to find used time range
  let minRoom = '';
  let maxHourPerFloor = -Infinity;
  let minHourPerFloor = Infinity;
  let maxRoomMostTimeRangePerFloor = -Infinity; //use to find used time range
  let maxRoomLeastTimeRangePerFloor = -Infinity; //use to find used time range
  let minRoomMostTimeRangePerFloor = Infinity; //use to find used time range
  let minRoomLeastTimeRangePerFloor = Infinity; //use to find used time range
  let maxRoomPerFloor = '';
  let minRoomPerFloor = '';
  let bookHourMap = [];     //use for store room and hour, per floor
  let bookHourAllMap = [];  //use for store room and hour, all floor
  let bookExport = [];  //use for store room information for export, raw data
  const roomUsageRanges = {};
  let concludeExport = [];  //use for store room information for export, conclude data
  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
    'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
    'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  const usageDataMap = {};  //create for bottom line chart
  let numberOfRooms = null;
  
  //export
  const [showExport, setShowExport] = useState(false);
  const exportClick = () => {
    setShowExport(!showExport);
  };
  const handleExport = () => {
    // export_something
  };

  //floorNum change
  const [floorNum, setFloorNum] = useState(1);
  const floorUp = () => {
    if (floorNum < 4) {
      setFloorNum(floorNum + 1);
    }
  }
  const floorDown = () => {
    if (floorNum > 1) {
      setFloorNum(floorNum - 1);
    }
  }

  let sortedRoomBook = [...roomBook].sort((a, b) => { //sort rooDB before use
    // Use localeCompare for string comparison
    return a.room_id.localeCompare(b.room_id);
  });

  Array.from(sortedRoomBook).forEach(roomBook => {
    const itemMonth = new Date(roomBook.check_in_datetime).getMonth()+1;
    const itemYear = new Date(roomBook.check_in_datetime).getFullYear()+543;
    const timeDiff = (new Date(roomBook.check_out_datetime) - new Date(roomBook.check_in_datetime))/ (1000 * 60 * 60);
    const purpose = roomBook.purpose;
    //use for find most use time range
    const timeStart = moment(roomBook.check_in_datetime);
    const timeEnd = moment(roomBook.check_out_datetime);
    const timeRange = `${timeStart.format('HH:mm')} - ${timeEnd.format('HH:mm')}`;
    const roomIdKey = roomBook.room_id;
    if (!roomUsageRanges[roomIdKey]) {
      roomUsageRanges[roomIdKey] = { 
        room_name: roomBook.room_id,
        floor: roomBook.room.floor,
        year: itemYear,
        timeStart: timeStart,
        timeEnd: timeEnd,
        timeRanges: [timeRange],
        totalHours: moment.duration(timeEnd.diff(timeStart)).asHours(), 
      };
    }
    else {
      // Increment count for subsequent occurrences
      roomUsageRanges[roomIdKey].timeRanges.push(timeRange);
      roomUsageRanges[roomIdKey].totalHours += moment.duration(timeEnd.diff(timeStart)).asHours();
    }
    //end use for find most used time range

    if(dateType === 'month'){
      if((floorNum == roomBook.room.floor) && (itemMonth == month || month == 0) && (itemYear == year) && (type == 'all' || type == purpose) && (role == 'all' || role == roomBook.booker.role) && (roomBook.approvement.is_approved === true)){ //per floor and specific time
        //create variable use for export
        const room = roomBook.room_id;
        const floor = roomBook.room.floor;
        const time = new Date(roomBook.check_in_datetime);  //for find day that booking
        const startTime = moment(roomBook.check_in_datetime).format('HH:mm');
        const endTime = moment(roomBook.check_out_datetime).format('HH:mm');
        const startDay = time.getDate();
        const startMonth = time.getMonth();
        const monthName = monthNames[startMonth];
        const startYear = time.getFullYear()+543;
        const purpose = roomBook.purpose;
        let role;
        switch(roomBook.booker.role) {
            case 'Admin':
                role = 'เจ้าหน้าที่';
                break;
            case 'Student':
                role = 'นักศึกษา';
                break;
            case 'Guest':
                role = 'บุคคลากรภายนอกคณะ';
                break;
            case 'Teacher':
                role = 'อาจารย์';
                break;
            default:
                role = 'บุคคลากรภายนอกคณะ';
        }
        const concatTime = `${moment(roomBook.check_in_datetime).format('HH:mm')} - ${moment(roomBook.check_out_datetime).format('HH:mm')}`;
        //end use for export

        if (bookHourMap.hasOwnProperty(roomBook.room_id)) { //if in booking has same room name plus hour in same
          // Room exists, update the time difference
          bookHourMap[roomBook.room_id] += timeDiff;
        } else {
          // Room doesn't exist, add a new entry
          bookHourMap[roomBook.room_id] = timeDiff;
        }
        bookExport.push({ room, floor, timeDiff, concatTime, startTime, endTime, purpose, role, startDay, monthName, startYear }) //insert into array for export function
      }

      if((itemMonth == month || month == 0) && (itemYear == year) && (type == 'all' || type == purpose) && (role == 'all' || role == roomBook.booker.role) && (roomBook.approvement.is_approved === true)){ //not check floor, check only date time ----> use for find max room all floor, not for export
        if (bookHourAllMap.hasOwnProperty(roomBook.room_id)) {
          // Room exists, update the time difference
          bookHourAllMap[roomBook.room_id] += timeDiff;
        } else {
          // Room doesn't exist, add a new entry
          bookHourAllMap[roomBook.room_id] = timeDiff;
        }
      }

      if((itemYear == year) && (floorNum == roomBook.room.floor) && (type == 'all' || type == purpose) && (role == 'all' || role == roomBook.booker.role) && (roomBook.approvement.is_approved === true)){ //find room usage for every month, check year
        const roomName = roomBook.room_id;
        const timeDiff = (new Date(roomBook.check_out_datetime) - new Date(roomBook.check_in_datetime)) / (1000 * 60 * 60);

        if (!usageDataMap[roomName]) {
          // If roomName is not present in usageDataMap, initialize it with an array of 12 zeros (for each month)
          usageDataMap[roomName] = Array(12).fill(0);
        }

        // Update the usage hours for the specific month
        usageDataMap[roomName][itemMonth - 1] += timeDiff;
      }
    } else {
      if(dateType === 'date'){
        selectDate.endDate = selectDate.startDate;
      }
      if((floorNum == roomBook.room.floor) && ((dayjs(selectDate.startDate).format('YYYY-MM-DD') <= dayjs(roomBook.check_in_datetime).format('YYYY-MM-DD')) && (dayjs(selectDate.endDate).format('YYYY-MM-DD') >= dayjs(roomBook.check_out_datetime).format('YYYY-MM-DD'))) && (type == 'all' || type == purpose) && (role == 'all' || role == roomBook.booker.role) && (roomBook.approvement.is_approved === true)){ //per floor and specific time
        //create variable use for export
        const room = roomBook.room_id;
        const floor = roomBook.room.floor;
        const time = new Date(roomBook.check_in_datetime);  //for find day that booking
        const startTime = moment(roomBook.check_in_datetime).format('HH:mm');
        const endTime = moment(roomBook.check_out_datetime).format('HH:mm');
        const startDay = time.getDate();
        const startMonth = time.getMonth();
        const monthName = monthNames[startMonth];
        const startYear = time.getFullYear()+543;
        const purpose = roomBook.purpose;
        let role;
        switch(roomBook.booker.role) {
            case 'Admin':
                role = 'เจ้าหน้าที่';
                break;
            case 'Student':
                role = 'นักศึกษา';
                break;
            case 'Guest':
                role = 'บุคคลากรภายนอกคณะ';
                break;
            case 'Teacher':
                role = 'อาจารย์';
                break;
            default:
                role = 'บุคคลากรภายนอกคณะ';
        }
        const concatTime = `${moment(roomBook.check_in_datetime).format('HH:mm')} - ${moment(roomBook.check_out_datetime).format('HH:mm')}`;
        //end use for export

        if (bookHourMap.hasOwnProperty(roomBook.room_id)) { //if in booking has same room name plus hour in same
          // Room exists, update the time difference
          bookHourMap[roomBook.room_id] += timeDiff;
        } else {
          // Room doesn't exist, add a new entry
          bookHourMap[roomBook.room_id] = timeDiff;
        }
        bookExport.push({ room, floor, timeDiff, concatTime, startTime, endTime, purpose, role, startDay, monthName, startYear }) //insert into array for export function
      }

      if(((dayjs(selectDate.startDate).format('YYYY-MM-DD') <= dayjs(roomBook.check_in_datetime).format('YYYY-MM-DD')) && (dayjs(selectDate.endDate).format('YYYY-MM-DD') >= dayjs(roomBook.check_out_datetime).format('YYYY-MM-DD'))) && (type == 'all' || type == purpose) && (role == 'all' || role == roomBook.booker.role) && (roomBook.approvement.is_approved === true)){ //not check floor, check only date time ----> use for find max room all floor, not for export
        if (bookHourAllMap.hasOwnProperty(roomBook.room_id)) {
          // Room exists, update the time difference
          bookHourAllMap[roomBook.room_id] += timeDiff;
        } else {
          // Room doesn't exist, add a new entry
          bookHourAllMap[roomBook.room_id] = timeDiff;
        }
      }
    }

    let roomsPerFloor = {
      1: 10,
      2: 10,
      3: 7,
      4: 10
    };
    numberOfRooms = roomsPerFloor[floorNum] || 0; // 0 is the default value
  });

  const bookHourAllArray = Object.entries(bookHourAllMap).map(([roomName, timeDiff]) => [roomName, timeDiff]); //all floor, insert data into Array ---> use for bar chart
  const bookHourArray = Object.entries(bookHourMap).map(([roomName, timeDiff]) => [roomName, timeDiff]); //per floor, insert data into Array ---> use for bar chart
  
  Object.values(roomUsageRanges).forEach(roomUsage => {   //insert find most used time range into Array
    let timeRangeCounts = {};

    roomUsage.timeRanges.forEach(timeRange => {
      if (!timeRangeCounts[timeRange]) {
        timeRangeCounts[timeRange] = 1;
      } else {
        timeRangeCounts[timeRange]++;
      }
    });

    let mostUsedTimeRange = null;
    let leastUsedTimeRange = null;
    let maxCount = 0;
    let minCount = Infinity;

    for (let timeRange in timeRangeCounts) {
      if (timeRangeCounts[timeRange] > maxCount) {
        maxCount = timeRangeCounts[timeRange];
        mostUsedTimeRange = timeRange;
      }
      if (timeRangeCounts[timeRange] < minCount) {
        minCount = timeRangeCounts[timeRange];
        leastUsedTimeRange = timeRange;
      }
    }
    const [mostUsedTimeRangeStart, mostUsedTimeRangeEnd] = mostUsedTimeRange.split(' - ');
    const [leastUsedTimeRangeStart, leastUsedTimeRangeEnd] = leastUsedTimeRange.split(' - ');
    const formattedResult = {
      name: roomUsage.room_name,
      floor: roomUsage.floor,
      year: roomUsage.year,
      mostUsedTimeRange: mostUsedTimeRange,
      mostUsedTimeRangeStart: mostUsedTimeRangeStart,
      mostUsedTimeRangeEnd: mostUsedTimeRangeEnd,
      leastUsedTimeRange: leastUsedTimeRange,
      leastUsedTimeRangeStart: leastUsedTimeRangeStart,
      leastUsedTimeRangeEnd: leastUsedTimeRangeEnd,
      totalHours: roomUsage.totalHours.toFixed(2),
    };
    // Find the matching room in bookHourAllArray
    const matchingRoom = bookHourArray.find(([room, hour]) => room === formattedResult.name);
    const matchingAllRoom = bookHourAllArray.find(([room, timeDiff]) => room === formattedResult.name);
    if (matchingRoom) {
        // Add the timeRange property to matchingRoom
        matchingRoom.push(formattedResult.mostUsedTimeRange); //push timeRange into bookHourArray
        matchingRoom.push(formattedResult.leastUsedTimeRange); //push timeRange into bookHourArray
    }
    if (matchingAllRoom) {
        // Add the timeRange property to matchingRoom
        matchingAllRoom.push(formattedResult.mostUsedTimeRange);  //push timeRange into bookHourAllArray
        matchingAllRoom.push(formattedResult.leastUsedTimeRange);  //push timeRange into bookHourAllArray
    }

    concludeExport.push(formattedResult);   //insert into array for export
  });
  //create variable for find average hour
  let totalHours = 0;
  
  bookHourArray.forEach(([room, hour, mostUsedTimeRange, leastUsedTimeRange]) => { // insert array into 2 other array (use for chart)
    roomBookArray.push(room);
    hourBookArray.push(parseFloat(hour.toFixed(2)));
    if (hour > maxHourPerFloor) {   //find max per floor
      maxRoomPerFloor = room;
      maxHourPerFloor = hour.toFixed(2);
      maxRoomMostTimeRangePerFloor = mostUsedTimeRange;
      maxRoomLeastTimeRangePerFloor = leastUsedTimeRange;
    }
    if (hour < minHourPerFloor) {   //find min per floor
      minRoomPerFloor = room;
      minHourPerFloor = hour.toFixed(2);
      minRoomMostTimeRangePerFloor = mostUsedTimeRange;
      minRoomLeastTimeRangePerFloor = leastUsedTimeRange;
    }
    totalHours += hour;
  });

  bookHourAllArray.forEach(([room, timeDiff, mostUsedTimeRange, leastUsedTimeRange]) => { 
    if (timeDiff > maxRoomHour) {   //find max all floor
      maxRoom = room;
      maxRoomHour = timeDiff.toFixed(2);
      maxRoomMostTimeRange = mostUsedTimeRange;
      maxRoomLeastTimeRange = leastUsedTimeRange;
    }
    if (timeDiff < minRoomHour) {   //find min all floor
      minRoom = room;
      minRoomHour = timeDiff.toFixed(2);
      minRoomMostTimeRange = mostUsedTimeRange;
      minRoomLeastTimeRange = leastUsedTimeRange;
    }
  });

  const averageHour = numberOfRooms > 0 ? (totalHours / numberOfRooms).toFixed(2) : 0; //find average floor hour

  const barSetting = { //set option in selected bar chart
    yAxis: [
      {
        label: 'ชั่วโมงการใช้งาน',
      },
    ],
    xAxis: [
      {
        scaleType: 'band', data: roomBookArray, label: 'ห้อง',
      }
    ],
    series: [
      {
        data: hourBookArray,
      }
    ],
  };
  if (phone) {
    barSetting.width = vwToPx(100);
    barSetting.height = vhToPx(60);
  } else {
    barSetting.width = vwToPx(70);
    barSetting.height = vhToPx(60);
  }
  //  set variable for bottom line chart
  const monthAbb = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  const series = Object.entries(usageDataMap).map(([roomName, usage]) => ({
    data: usage,
    label: roomName,
  }));
  //  end set variable for bottom line chart
  const lineSetting = { //set option in selected line chart
    yAxis: [
      {
        label: 'ชั่วโมงการใช้งาน',
      },
    ],
    xAxis: [
      {
        scaleType: 'band', data: roomBookArray, label: 'ห้อง',
      }
    ],
    series: [
      {
        data: hourBookArray,
      }
    ],
    width: vwToPx(70),
    height: vhToPx(60),
  };
  if (phone) {
    lineSetting.width = vwToPx(100);
    lineSetting.height = vhToPx(60);
  } else {
    lineSetting.width = vwToPx(70);
    lineSetting.height = vhToPx(60);
  }
  //set data for selected pie chart
  const data = roomBookArray.map((r, i) => ({ value: hourBookArray[i], label: r }));
  const pieSetting = {
    series: [
      {
        arcLabel: (item) => `${item.label} (${item.value} ชั่วโมง)`,
        arcLabelMinAngle: 20,
        data,
      },
    ],
    sx: {
      [`& .${pieArcLabelClasses.root}`]: {
        fill: 'white',
        fontSize: phone ? '3vw': 'initial',
      },
    },
    slotProps: {legend: { hidden: (phone || tablet) ? true : false } }
  };
  if (phone) {
    pieSetting.width = vwToPx(115);
    pieSetting.height = vhToPx(60);
  } else if (tablet){
    pieSetting.width = vwToPx(100);
    pieSetting.height = vhToPx(50);
  } else {
    pieSetting.width = vwToPx(70);
    pieSetting.height = vhToPx(60);
  }
  return (
    <div style={
      {
        marginLeft: '3vw',
        marginRight: '3vw',
      }
    }>
      {loading ? (
        <>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </div>
        </>
        ) : (
        <>
          <div className={styles.contain}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={3}>
                <Grid container sx={{alignItems: 'center'}}>
                  <Grid item xs={6} sm={3} md={4} lg={10}>
                    <p className={styles.floorText}>FLOOR {floorNum}</p>
                  </Grid>
                  <Grid item xs={6} sm={9} md={8} lg={2}>
                    <p className={styles.upBtn} id='upBtn' onClick={floorUp} style={{ opacity: floorNum === 4 ? 0.5 : 1 }}>
                      <KeyboardArrowUpIcon fontSize={phone ? 'medium' : 'large'}/>
                    </p>
                    <p className={styles.downBtn} id='downBtn' onClick={floorDown} style={{ opacity: floorNum === 1 ? 0.5 : 1 }}>
                      <KeyboardArrowDownIcon fontSize={phone ? 'medium' : 'large'}/>
                    </p>
                  </Grid>
                </Grid>
              </Grid>
              {/* <Grid item xs={9}></Grid> */}
            </Grid>

            <Grid container >
              <Grid item lg={2} sm={2} md={12} xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                <p className={styles.usageText}>การใช้งานห้อง:</p>
              </Grid>
              <Grid item lg={8} sm={6} md={8} xs={12} >
                <FormControl sx={{ m: 1, width: {xs: 100, sm: 100, md: 120, lg: 120} }}>
                  <InputLabel id="demo-simple-select-helper-label" sx={{ fontFamily: 'Prompt' }}>ประเภท</InputLabel>
                  <Select
                    defaultValue={1}
                    value={type}
                    label="ประเภท"
                    onChange={handleChangeType}
                    sx={{ fontSize: {xs: '3vw',sm: '2vw', lg: '1vw'}, fontFamily: 'Prompt' }}
                  >
                    <MenuItem sx={{ fontFamily: 'Prompt' }} value={'all'}>ทั้งหมด</MenuItem>
                    <MenuItem sx={{ fontFamily: 'Prompt' }} value={'การเรียนการสอน'}>การเรียนการสอน</MenuItem>
                    <MenuItem sx={{ fontFamily: 'Prompt' }} value={'การสอบ'}>การสอบ</MenuItem>
                    <MenuItem sx={{ fontFamily: 'Prompt' }} value={'กิจกรรมสันทนาการ'}>กิจกรรมสันทนาการ</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ m: 1, width: {xs: 100, sm: 100, md: 120, lg: 120} }}>
                  <InputLabel id="demo-simple-select-helper-label" sx={{ fontFamily: 'Prompt' }}>ตำแหน่งผู้จอง</InputLabel>
                  <Select
                    defaultValue={1}
                    value={role}
                    label="ตำแหน่งผู้จอง"
                    onChange={handleChangeRole}
                    sx={{ fontSize: {xs: '3vw',sm: '2vw', lg: '1vw'}, fontFamily: 'Prompt' }}
                  >
                    <MenuItem sx={{ fontFamily: 'Prompt' }} value={'all'}>ทั้งหมด</MenuItem>
                    <MenuItem sx={{ fontFamily: 'Prompt' }} value={'Student'}>นักศึกษา</MenuItem>
                    <MenuItem sx={{ fontFamily: 'Prompt' }} value={'Teacher'}>อาจารย์</MenuItem>
                    <MenuItem sx={{ fontFamily: 'Prompt' }} value={'Admin'}>เจ้าหน้าที่</MenuItem>
                    <MenuItem sx={{ fontFamily: 'Prompt' }} value={'Guest'}>บุคคลากรภายนอกคณะ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item lg={2} sm={4} md={4} xs={0} >
                <Hidden mdDown implementation="css">
                  <Button variant="contained" startIcon={<FileDownloadIcon />} className={styles.export}
                    onClick={exportClick}>
                      ดาวน์โหลดข้อมูลสถิติ
                  </Button>
                </Hidden>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item lg={12} xs={12}>
                <FormControl>
                  <FormLabel id="demo-controlled-radio-buttons-group" sx={{ fontFamily: 'Prompt' }}>รูปแบบช่วงเวลา</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={dateType}
                    onChange={handleChangeDateType}
                  >
                    <FormControlLabel value="month" control={<Radio />} label="รายเดือน" sx={{ fontFamily: 'Prompt' }}/>
                    <FormControlLabel value="date" control={<Radio />} label="รายวัน" sx={{ fontFamily: 'Prompt' }}/>
                    <FormControlLabel value="range" control={<Radio />} label="ช่วงเวลา" sx={{ fontFamily: 'Prompt' }}/>
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item lg={12} xs={10}>
                {dateType === 'month' && (
                  <>
                    <FormControl sx={{ m: 1, width: {xs: 100, sm: 100, md: 120, lg: 120} }}>
                      <InputLabel id="demo-simple-select-helper-label" sx={{ fontFamily: 'Prompt', fontSize: {sm: '2vw', lg: 'initial'}}}>ประจำเดือน</InputLabel>
                      <Select
                        defaultValue={0}
                        value={month}
                        label="ประจำเดือน"
                        onChange={handleChangeMonth}
                        sx={{ fontSize: {xs: '3vw',sm: '2vw', lg: '1vw'}, fontFamily: 'Prompt'}}
                      >
                        <MenuItem sx={{ fontFamily: 'Prompt' }} value={0}>ทุกเดือน</MenuItem>
                        <MenuItem sx={{ fontFamily: 'Prompt' }} value={1}>มกราคม</MenuItem>
                        <MenuItem sx={{ fontFamily: 'Prompt' }} value={2}>กุมภาพันธ์</MenuItem>
                        <MenuItem sx={{ fontFamily: 'Prompt' }} value={3}>มีนาคม</MenuItem>
                        <MenuItem sx={{ fontFamily: 'Prompt' }} value={4}>เมษายน</MenuItem>
                        <MenuItem sx={{ fontFamily: 'Prompt' }} value={5}>พฤษภาคม</MenuItem>
                        <MenuItem sx={{ fontFamily: 'Prompt' }} value={6}>มิถุนายน</MenuItem>
                        <MenuItem sx={{ fontFamily: 'Prompt' }} value={7}>กรกฎาคม</MenuItem>
                        <MenuItem sx={{ fontFamily: 'Prompt' }} value={8}>สิงหาคม</MenuItem>
                        <MenuItem sx={{ fontFamily: 'Prompt' }} value={9}>กันยายน</MenuItem>
                        <MenuItem sx={{ fontFamily: 'Prompt' }} value={10}>ตุลาคม</MenuItem>
                        <MenuItem sx={{ fontFamily: 'Prompt' }} value={11}>พฤศจิกายน</MenuItem>
                        <MenuItem sx={{ fontFamily: 'Prompt' }} value={12}>ธันวาคม</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, width: {xs: 110, sm: 100, md: 120, lg: 120}}}>
                      <InputLabel id="demo-simple-select-helper-label" sx={{ fontFamily: 'Prompt' }}>ประจำปี</InputLabel>
                      <Select
                        defaultValue={1}
                        value={year}
                        label="ประจำปี"
                        onChange={handleChangeYear}
                        sx={{ fontSize: {xs: '3vw',sm: '2vw', lg: '1vw'}, fontFamily: 'Prompt' }}
                      >
                        {yearMenuItems}
                      </Select>
                    </FormControl>
                  </>
                )}
                {dateType === 'date' && (
                  <>
                    <FormControl sx={{ m: 1, width: {xs: 100, sm: 100, md: 120, lg: 120} }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker 
                          value={selectDate.startDate}
                          onChange={(newValue) => handleChangeDate({ target: { name: 'startDate', value: newValue } })}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </>
                )}
                {dateType === 'range' && (
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <FormControl sx={{ m: 1, width: {xs: 100, sm: 100, md: 120, lg: 120} }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker 
                          value={selectDate.startDate}
                          onChange={(newValue) => handleChangeDate({ target: { name: 'startDate', value: newValue } })}
                        />
                      </LocalizationProvider>
                    </FormControl>
                    ถึง
                    <FormControl sx={{ m: 1, width: {xs: 100, sm: 100, md: 120, lg: 120} }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker 
                          value={selectDate.endDate}
                          onChange={(newValue) => handleChangeDate({ target: { name: 'endDate', value: newValue } })}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </div>
                )}
              </Grid>
              <Grid item lg={0} xs={12}>
                <Hidden mdUp implementation="css">
                  <Button variant="contained" startIcon={<FileDownloadIcon />} className={styles.export}
                    onClick={exportClick}>ดาวน์โหลดข้อมูลสถิติ
                  </Button>
                </Hidden>
              </Grid>
            </Grid>
            <Export showExport={showExport} exportClick={exportClick} handleExport={handleExport} bookExport={bookExport} concludeExport={concludeExport}/>
            {dateType === 'month' ? (
              <>
                <Grid container spacing={2} sx={{ mt: 5 }}>
                  <Grid item xs={12} lg={6}>
                    <div className={styles.displaySpace}>
                      <p className={styles.text}>ชั่วโมงการใช้งานห้องทั้งหมดของชั้นที่ {floorNum}</p>
                      <p className={styles.roomName}>{totalHours.toFixed(2)}</p>
                      <p className={styles.text}>ชั่วโมง</p>
                    </div>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <div className={styles.displaySpace}>
                      <p className={styles.text}>ชั่วโมงการใช้งานห้องโดยเฉลี่ยของชั้นที่ {floorNum}</p>
                      <p className={styles.roomName}>{averageHour}</p>
                      <p className={styles.text}>ชั่วโมง</p>
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={2}sx={{ mt: phone ? 0 : 0, mb: 5}}>
                  <Grid item xs={12} lg={6}>
                    <div className={styles.displaySpace}>
                      <p className={styles.text}>ห้องที่มีการใช้งานมากที่สุดของชั้นที่ {floorNum}</p>
                      <p className={styles.roomName}>{maxRoomPerFloor}</p>
                      <p className={styles.text}>เวลาที่ใช้งาน : {maxHourPerFloor} ชั่วโมง</p>
                      <p className={styles.text}>ช่วงเวลาที่ใช้งานมากที่สุด : {maxRoomMostTimeRangePerFloor}</p>
                      <p className={styles.text}>ช่วงเวลาที่ใช้งานน้อยที่สุด : {maxRoomLeastTimeRangePerFloor}</p>
                    </div>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <div className={styles.displaySpace}>
                      <p className={styles.text}>ห้องที่มีการใช้งานน้อยที่สุดของชั้นที่ {floorNum}</p>
                      <p className={styles.roomName}>{minRoomPerFloor}</p>
                      <p className={styles.text}>เวลาที่ใช้งาน : {minHourPerFloor} ชั่วโมง</p>
                      <p className={styles.text}>ช่วงเวลาที่ใช้งานมากที่สุด : {minRoomMostTimeRangePerFloor}</p>
                      <p className={styles.text}>ช่วงเวลาที่ใช้งานน้อยที่สุด : {minRoomLeastTimeRangePerFloor}</p>
                    </div>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <div className={styles.displaySpace}>
                      <p className={styles.text}>ห้องที่มีการใช้งานมากที่สุด (รวมทุกชั้น)</p>
                      <p className={styles.roomName}>{maxRoom}</p>
                      <p className={styles.text}>เวลาที่ใช้งาน : {maxRoomHour} ชั่วโมง</p>
                      <p className={styles.text}>ช่วงเวลาที่ใช้งานมากที่สุด : {maxRoomMostTimeRange}</p>
                      <p className={styles.text}>ช่วงเวลาที่ใช้งานน้อยที่สุด : {maxRoomLeastTimeRange}</p>
                    </div>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <div className={styles.displaySpace}>
                      <p className={styles.text}>ห้องที่มีไม่ถูกใช้งานมากที่สุด (รวมทุกชั้น)</p>
                      <p className={styles.roomName}>{minRoom}</p>
                      <p className={styles.text}>เวลาที่ใช้งาน : {minRoomHour} ชั่วโมง</p>
                      <p className={styles.text}>ช่วงเวลาที่ใช้งานมากที่สุด : {minRoomMostTimeRange}</p>
                      <p className={styles.text}>ช่วงเวลาที่ใช้งานน้อยที่สุด : {minRoomLeastTimeRange}</p>
                    </div>
                  </Grid>
                </Grid>
              </>
            ):(
              <>
                {(selectDate.startDate && selectDate.endDate) ? (
                  <>
                  <Grid container spacing={2} sx={{ mt: 5 }}>
                    <Grid item xs={12} lg={6}>
                      <div className={styles.displaySpace}>
                        <p className={styles.text}>ชั่วโมงการใช้งานห้องทั้งหมดของชั้นที่ {floorNum}</p>
                        <p className={styles.roomName}>{totalHours.toFixed(2)}</p>
                        <p className={styles.text}>ชั่วโมง</p>
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <div className={styles.displaySpace}>
                        <p className={styles.text}>ชั่วโมงการใช้งานห้องโดยเฉลี่ยของชั้นที่ {floorNum}</p>
                        <p className={styles.roomName}>{averageHour}</p>
                        <p className={styles.text}>ชั่วโมง</p>
                      </div>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}sx={{ mt: phone ? 0 : 0, mb: 5}}>
                    <Grid item xs={12} lg={6}>
                      <div className={styles.displaySpace}>
                        <p className={styles.text}>ห้องที่มีการใช้งานมากที่สุดของชั้นที่ {floorNum}</p>
                        <p className={styles.roomName}>{maxRoomPerFloor}</p>
                        <p className={styles.text}>เวลาที่ใช้งาน : {maxHourPerFloor} ชั่วโมง</p>
                        <p className={styles.text}>ช่วงเวลาที่ใช้งานมากที่สุด : {maxRoomMostTimeRangePerFloor}</p>
                        <p className={styles.text}>ช่วงเวลาที่ใช้งานน้อยที่สุด : {maxRoomLeastTimeRangePerFloor}</p>
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <div className={styles.displaySpace}>
                        <p className={styles.text}>ห้องที่มีการใช้งานน้อยที่สุดของชั้นที่ {floorNum}</p>
                        <p className={styles.roomName}>{minRoomPerFloor}</p>
                        <p className={styles.text}>เวลาที่ใช้งาน : {minHourPerFloor} ชั่วโมง</p>
                        <p className={styles.text}>ช่วงเวลาที่ใช้งานมากที่สุด : {minRoomMostTimeRangePerFloor}</p>
                        <p className={styles.text}>ช่วงเวลาที่ใช้งานน้อยที่สุด : {minRoomLeastTimeRangePerFloor}</p>
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <div className={styles.displaySpace}>
                        <p className={styles.text}>ห้องที่มีการใช้งานมากที่สุด (รวมทุกชั้น)</p>
                        <p className={styles.roomName}>{maxRoom}</p>
                        <p className={styles.text}>เวลาที่ใช้งาน : {maxRoomHour} ชั่วโมง</p>
                        <p className={styles.text}>ช่วงเวลาที่ใช้งานมากที่สุด : {maxRoomMostTimeRange}</p>
                        <p className={styles.text}>ช่วงเวลาที่ใช้งานน้อยที่สุด : {maxRoomLeastTimeRange}</p>
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <div className={styles.displaySpace}>
                        <p className={styles.text}>ห้องที่มีไม่ถูกใช้งานมากที่สุด (รวมทุกชั้น)</p>
                        <p className={styles.roomName}>{minRoom}</p>
                        <p className={styles.text}>เวลาที่ใช้งาน : {minRoomHour} ชั่วโมง</p>
                        <p className={styles.text}>ช่วงเวลาที่ใช้งานมากที่สุด : {minRoomMostTimeRange}</p>
                        <p className={styles.text}>ช่วงเวลาที่ใช้งานน้อยที่สุด : {minRoomLeastTimeRange}</p>
                      </div>
                    </Grid>
                  </Grid>
                  </>
                ):(
                  <p>No data...โปรดเลือกวันที่ต้องการ</p>
                )}
              </>
            )}
            <div className={styles.selectChart}>
              <ToggleButtonGroup
                value={chartType}
                exclusive
                onChange={handleChartType}
                aria-label="chart type"
                fullWidth
              >
                {['กราฟแท่ง', 'กราฟเส้น', 'แผนภูมิวงกลม'].map((type) => (
                  <ToggleButton key={type} value={type} aria-label="left aligned" sx={{fontFamily: 'Prompt'}}>
                    {type}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </div>
            <div className={styles.chart}>
            {roomBookArray.length === 0 ? (
              <p>No data...</p>
              ) : (
              <>
                {dateType === 'month' ?(
                  <div style={{ overflowX: 'hidden' }}>
                    {chartType === 'กราฟแท่ง' && <BarChart {...barSetting} />}
                    {chartType === 'กราฟเส้น' && <LineChart {...lineSetting} />}
                    {chartType === 'แผนภูมิวงกลม' && <PieChart {...pieSetting} />}
                  </div>
                  ):(
                    <>
                      {(selectDate.startDate && selectDate.endDate) ? (
                        <>
                          {chartType === 'กราฟแท่ง' && <BarChart {...barSetting} />}
                          {chartType === 'กราฟเส้น' && <LineChart {...lineSetting} />}
                          {chartType === 'แผนภูมิวงกลม' && <PieChart {...pieSetting} />}
                        </>
                      ):(
                        <>
                          <p>No data...โปรดเลือกวันที่ต้องการ</p>
                        </>
                      )}
                    </>
                  )
                }
              </>
            )}
            </div>
            {dateType === 'month' && (
              <>
                <hr />
                <div style={{ overflowX: 'hidden' }}>
                  <h2>กราฟเส้นแสดงชั่วโมงการใช้งานห้องทุกเดือนของปี {year}</h2>
                  {roomBookArray.length === 0 ? (
                    <p>No data...</p>
                  ) :(
                    <LineChart
                      width={phone ? vwToPx(100) : vwToPx(70)}
                      height={vhToPx(60)}
                      series={series}
                      xAxis={[{ scaleType: 'point', data: monthAbb, label: 'เดือน' }]}
                      yAxis={[{label: 'ชั่วโมงการใช้งาน'}]}
                      margin={{ bottom: 140 }}
                      slotProps={{
                        legend: { 
                          hidden: phone ? false : false,
                          position: { vertical: 'bottom', horizontal: 'middle' },
                          markGap: 15,
                        } 
                      }}
                    />
                  )}
                </div>
              </>)
            }
            <div style={{marginTop: phone ? '20vw' : '5vw'}}></div>
          </div>
        </>
      )}
    </div>
  )
}

export default Static