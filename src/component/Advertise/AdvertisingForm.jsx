import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
// import moment from 'moment';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefore)
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Switch, FormHelperText, FormControlLabel, Autocomplete, TextField, Input } from '@mui/material';
import MuiButton from '@mui/material/Button';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import API_DATA from '../link';
import styles from './AdvertisingForm.module.css'
function AdvertisingForm({ isOpen, toggleBooking, editFormData }) {
    //get API
    const [linkBookDB, setLinkBookDB] = useState([]);
    let timerBookId; // Store the timer ID to clear it later
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_DATA.linkBook);
                const events = response.data;
                setLinkBookDB(events);
            } catch (error) {
                console.error(error);
            } finally {
            // Calculate the milliseconds remaining until the next minute
            const delay = 60000 - (dayjs().second() * 1000 + dayjs().millisecond());
            // Schedule the next fetch
            timerBookId = setTimeout(fetchData, delay);
            }
        };
        
        // Fetch data initially
        fetchData();
        
        // Cleanup function to clear the timer on component unmount
        return () => clearTimeout(timerBookId);
    }, []);
     //popUp SweetAlert
    const showAlert = (message) => {
        Swal.fire({
            icon: 'success',
            title: message,
            showConfirmButton: false,
            timer: 1500
        })
    };

    const allRoom = [
        'HALL', //floor 1
        'COMMON',
        'AUDITORIUM',
        'M03',
        'M04',
        'M16',
        'M17',
        'M18',
        'M21',
        'M22',
        'M23',
        '203', //floor 2
        '205',
        '207',
        'C1',
        'C2',
        'PT1',
        'PT2',
        'PT3',
        'Project Base1',
        'Project Base2',
        '304', //floor 3
        '306',
        '308',
        '328',
        'Project Base3',
        '333',
        'Project Base4',
        '403',    //floor 4
        '404',
        '406',
        '424',
        '426',
        '432',
        '433',
        '434',
        '435',
        '436',
    ];
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        room_id: '',
        checkInDate: null,
        checkOutDate: null,
        timeStart: null,
        timeEnd: null,
        sentNotification: 'NotSent',
    });

    const [roomArray, setRoomArray] = React.useState([]);
    const handleChangeSelect = (event, values) => {
        setRoomArray(values);
    };
    const [validated, setValidated] = useState(false)
    const isTimeInBookDBRange = () => { //use for check can booking in any that time or not
        const { checkInDate, timeStart, timeEnd} = formData;
        const dateDayjs = dayjs(checkInDate);
        const timeStartDayjs = dayjs(timeStart);
        const timeEndDayjs = dayjs(timeEnd);
        const selectedDateTimeStart = dayjs(`${dateDayjs.format('YYYY-MM-DD')}T${timeStartDayjs.format('HH:mm:ss')}`);
        const selectedDateTimeEnd = dayjs(`${dateDayjs.format('YYYY-MM-DD')}T${timeEndDayjs.format('HH:mm:ss')}`);
        // Check if the selected time range intersects with any time range in linkBookDB
        for (const booking of linkBookDB) {
            if (editFormData && booking.advertiseId === editFormData[0].advertiseId) {
                continue;
            }
            const bookingStartTime = dayjs(booking.check_in_datetime);
            const bookingEndTime = dayjs(booking.check_out_datetime);
            const room = booking.room_id;
            if ((selectedDateTimeStart.isBefore(bookingEndTime) && selectedDateTimeEnd.isAfter(bookingStartTime)) && roomArray.includes(room)) 
            {
                return false;
            }
        }
        return true;
    };
    // get can book or add ads
    const getNonIntersectingTimeRanges = (roomArray, checkInDate, checkOutDate) => {
        // Define the start and end of the day
        const dayStart = dayjs().startOf('day').format('HH:mm');
        const dayEnd = dayjs().endOf('day').format('HH:mm');
    
        // Generate the date range
        const dateRange = [];
        let currentDate = dayjs(checkInDate);
        const endDate = dayjs(checkOutDate);
        while (currentDate.isSameOrBefore(endDate, 'day')) {
            dateRange.push(currentDate.format('YYYY-MM-DD'));
            currentDate = currentDate.add(1, 'day');
        }
    
        // Object to store non-intersecting time ranges for each room and date
        let nonIntersectingTimeRanges = {};

        roomArray.forEach(roomId => {
            dateRange.forEach(date => {
                if (!nonIntersectingTimeRanges[roomId]) {
                    nonIntersectingTimeRanges[roomId] = {};
                }
                // Initialize with the full day if not already set by a previous iteration
                if (!nonIntersectingTimeRanges[roomId][date]) {
                    nonIntersectingTimeRanges[roomId][date] = [{ start: dayStart, end: dayEnd }];
                }
            });
        });
    
        for (const booking of linkBookDB) {
            if (editFormData && booking.advertiseId === editFormData[0].advertiseId) {
                continue; // Skip the booking if it matches the editFormData's advertiseId
            }
            const bookingDate = dayjs(booking.check_in_datetime).format('YYYY-MM-DD');
            const bookingStartTime = dayjs(booking.check_in_datetime).format('HH:mm');
            const bookingEndTime = dayjs(booking.check_out_datetime).format('HH:mm');
            const roomId = booking.room_id;
    
            // Skip the booking if the room is not in the selected rooms
            if (!roomArray.includes(roomId)) {
                continue;
            }
    
            // Check if the booking is within the date range
            if (dateRange.includes(bookingDate)) {
                // Initialize the array for the room and date if it doesn't exist
                if (!nonIntersectingTimeRanges[roomId]) {
                    nonIntersectingTimeRanges[roomId] = {};
                }
                if (!nonIntersectingTimeRanges[roomId][bookingDate]) {
                    nonIntersectingTimeRanges[roomId][bookingDate] = [{ start: dayStart, end: dayEnd }];
                }
    
                nonIntersectingTimeRanges[roomId][bookingDate] = nonIntersectingTimeRanges[roomId][bookingDate].flatMap(({ start, end }) => {
                    const newTimeRanges = [];
                    if (start < bookingEndTime && end > bookingStartTime) {
                        // Ensure there's a meaningful time range before the booking
                        if (start < bookingEndTime && bookingStartTime > start) { // Adjusted condition
                            newTimeRanges.push({ start, end: bookingStartTime });
                        }
                        // Ensure there's a meaningful time range after the booking
                        if (end > bookingStartTime && bookingEndTime < end) { // Adjusted condition
                            newTimeRanges.push({ start: bookingEndTime, end });
                        }
                    } else {
                        newTimeRanges.push({ start, end });
                    }
    
                    return newTimeRanges;
                });
            }
        }
    
        // Format the non-intersecting time ranges as strings
        for (const roomId in nonIntersectingTimeRanges) {
            for (const date in nonIntersectingTimeRanges[roomId]) {
                nonIntersectingTimeRanges[roomId][date] = nonIntersectingTimeRanges[roomId][date].map(({ start, end }) => `${start} - ${end}`);
            }
        }
    
        // console.log(nonIntersectingTimeRanges);
        return nonIntersectingTimeRanges;
    };

    const displayAvailableTimes = (availableTimes) => {
        let message = '';
        for (const room in availableTimes) {
            message += `<strong>${room}:</strong><br/>`;
            for (const date in availableTimes[room]) {
                message += `<b>${date}</b>:<br/> [ ${availableTimes[room][date].join(", ")} ]<br/>`;
            }
            message += '<hr/>'; // Add extra space between rooms
        }
    
        Swal.fire({
            title: 'ช่วงเวลาที่ว่าง',
            html: message,
            icon: 'info',
            confirmButtonText: 'ตกลง'
        });
    };

    useEffect(() => {
        if (formData.checkInDate && roomArray.length > 0) {
            // Determine endDate based on whether editFormData is present and has data
            let endDate;
            if (editFormData && Object.keys(editFormData).length > 0) {
                // If editFormData is present, use checkInDate as endDate to ignore checkOutDate
                endDate = formData.checkInDate;
            } else {
                // If checkOutDate is not provided or editFormData is not present, use checkInDate as both start and end date
                endDate = formData.checkOutDate || formData.checkInDate;
            }
            const getAvaliableTime = getNonIntersectingTimeRanges(roomArray, formData.checkInDate, endDate);
            if(checked === true){
                if (dayjs(formData.checkInDate).format('YYYY-MM-DD') <= (dayjs(formData.checkOutDate).format('YYYY-MM-DD'))){
                    displayAvailableTimes(getAvaliableTime);
                } else if (dayjs(formData.checkInDate).format('YYYY-MM-DD') >= dayjs(formData.checkOutDate).format('YYYY-MM-DD')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'กรุณาเลือกวันให้ถูกต้อง',
                    })
                }
            } else {
                displayAvailableTimes(getAvaliableTime);
            }
        }
    }, [formData.checkInDate, formData.checkOutDate, roomArray, editFormData]);
    //end get can book or add ads

    const handleSubmit = async (event) => {
        event.preventDefault();
        // const form = event.currentTarget;
        if (!isTimeInBookDBRange()) {
            event.preventDefault();
            if(!isTimeInBookDBRange()){
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่สามารถเพิ่มในช่วงเวลานี้ได้',
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        }
        else if (formData.title === ''){
            event.preventDefault();
            Swal.fire({
                icon: 'error',
                title: 'กรุณากรอกชื่อกิจกรรม',
                showConfirmButton: false,
                timer: 1500,
            });
        }
        else if (formData.description === ''){
            event.preventDefault();
            Swal.fire({
                icon: 'error',
                title: 'กรุณากรอกรายละเอียดกิจกรรม',
                showConfirmButton: false,
                timer: 1500,
            });
        }
        else if (roomArray.length === 0){
            event.preventDefault();
            Swal.fire({
                icon: 'error',
                title: 'กรุณากรอกเลือกสถานที่จัดกิจกรรม',
                showConfirmButton: false,
                timer: 1500,
            });
        }
        else if (!formData.checkInDate || !formData.timeStart || !formData.timeEnd){
            event.preventDefault();
            Swal.fire({
                icon: 'error',
                title: 'กรุณากรอกวันเวลาให้ครบถ้วน',
                showConfirmButton: false,
                timer: 1500,
            });
        }
        else if ((dayjs(formData.timeEnd).isSameOrBefore(dayjs(formData.timeStart)) || dayjs(formData.checkOutDate).isBefore(dayjs(formData.checkInDate))) && checked == true){
            event.preventDefault();
            Swal.fire({
                icon: 'error',
                title: 'กรุณากรอกช่วงเวลาให้ถูกต้อง',
                showConfirmButton: false,
                timer: 1500,
            });
        }
        else if (checked && !formData.checkOutDate){
            event.preventDefault();
            Swal.fire({
                icon: 'error',
                title: 'กรุณากรอกวันที่สิ้นสุดการจอง',
                showConfirmButton: false,
                timer: 1500,
            });
        }
        else {
            try{
                const formDataToSend = new FormData();
                formDataToSend.append('title', formData.title);
                formDataToSend.append('description', formData.description);
                formDataToSend.append('image', formData.image);
                formDataToSend.append('room_id', roomArray);
                formDataToSend.append('checkInDate', formData.checkInDate);
                formDataToSend.append('timeStart', formData.timeStart);
                formDataToSend.append('timeEnd', formData.timeEnd);
                formDataToSend.append('sentNotification', formData.sentNotification);
                if (editFormData) {
                    // Update existing data
                    await handleUpdate(formDataToSend);
                } else {
                    // Create new data
                    await handleCreate(formDataToSend);
                }
                showAlert(editFormData ? 'ปรับปรุงประกาศสำเร็จ' : 'เพิ่มกิจกรรมสำเร็จ');
                toggleBooking();
                setTimeout(() => {
                    window.location.reload();
                }, 1500)
            }
            catch (error) {
                console.error('Error submitting form:', error.response.data.message);
                Swal.fire({
                    icon: 'error',
                    title: 'ประกาศล้มเหลว !',
                    text: error.response.data.message,
                });
            }
        }

        setValidated(true);
    };
    const handleCreate = async (formDataToSend) => {
        Swal.fire({
            title: 'โปรดรอสักครู่',
            html: 'กำลังสร้างประกาศ...',
            allowEscapeKey: false,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        // Create booking entries for each date in the range
        const formattedDateRange = generateDateRange();
        for (const formattedDate of formattedDateRange) {
            const checkInDate = dayjs(formattedDate).format('YYYY-MM-DD');
            formDataToSend.set('checkInDate', checkInDate);
            try {
                const response = await axios.post(API_DATA.createAds, formDataToSend);
                console.log(response.data.message);

                const advertiseId = response.data?.advertise?.id;
                
                if (advertiseId) {
                    await axios.post(API_DATA.adminCreateBooker, {
                        title: formData.title,
                        purpose: 'กิจกรรมสันทนาการ',
                        fullname: 'ผู้จัดกิจกรรม',
                        email: 'admin@kmitl.ac.th',
                        schedule: 'รายวัน',
                        room_id: roomArray,
                        checkInDate: checkInDate,
                        timeStart: formData.timeStart,
                        timeEnd: formData.timeEnd,
                        advertiseId: advertiseId,
                    });
                }
                else{
                    console.error('Advertise ID not found in the response:', response.data);
                }
            }catch (error){
                console.error('Error during advertisement creation:', error);
            }
        }
        Swal.close();
    };

    const handleUpdate = async (formDataToSend) => {
        const response = await axios.put(`${API_DATA.editAds}/${editFormData[0].advertiseId}`, formDataToSend);
        const deleteBook = await axios.delete(API_DATA.bookingList, {
            params:
            {
                advertiseId: editFormData[0].advertiseId,
            }
        });
        try {
            await axios.post(API_DATA.adminCreateBooker, {
                title: formData.title,
                purpose: 'กิจกรรมสันทนาการ',
                fullname: 'ผู้จัดกิจกรรม',
                email: 'Administrator@it.kmitl.ac.th',
                schedule: 'รายวัน',
                room_id: roomArray,
                checkInDate: formData.checkInDate,
                timeStart: formData.timeStart,
                timeEnd: formData.timeEnd,
                advertiseId: editFormData[0].advertiseId,
            });
        }catch (error){
            console.error('Error during advertisement creation:', error);
        }
        console.log(response.data.message);
        Swal.fire({
            icon: 'success',
            timer: 1500,
            title: 'แก้ไขสำเร็จ',
            showConfirmButton: false, 
        });
    };
    const [checked, setChecked] = React.useState(false); //switch for display end Date
    const handleChangeSwitch = (event) => {
        setChecked(event.target.checked);
    };
    const handleDeleteImage = () => {
        setFormData({
            ...formData,
            image: '',
        });
    }
    const handleChange = (event) => {
        const { name, value, checked, files } = event.target;
        if (name === 'picture') {
            setFormData({
                ...formData,
                image: files[0], // Store the selected file
            });
        }
        else if (name === 'checkInDate') {
            const startDate = dayjs(value);
            if (startDate !== null && startDate.isValid()) {
                setFormData({
                    ...formData,
                    [name]: startDate,
                });
            } else {
                // Handle invalid input (optional)
                console.error('Invalid time format');
            }
        } else if (name === 'checkOutDate') {
            const endDate = dayjs(value);
            if (endDate !== null && endDate.isValid()) {
                setFormData({
                    ...formData,
                    [name]: endDate,
                });
            } else {
                // Handle invalid input (optional)
                console.error('Invalid time format');
            }
        } 
        else if (name === 'timeStart') {
            const startTime = dayjs(value, 'HH:mm');
            if (startTime !== null && startTime.isValid()) {
                setFormData({
                    ...formData,
                    [name]: startTime,
                });
            } else {
                // Handle invalid input (optional)
                console.error('Invalid time format');
            }
        } 
        else if (name === 'timeEnd') {
            const endTime = dayjs(value, 'HH:mm');
            if (endTime !== null && endTime.isValid()) {
                setFormData({
                    ...formData,
                    [name]: endTime,
                });
            } else {
                // Handle invalid input (optional)
                console.error('Invalid time format');
            }
        } 
        else if(name === 'sentNotification'){
            setFormData({
                ...formData,
                [name]: checked ? 'Sent' : 'NotSent', // Set to 'Sent' if checked, 'NotSent' otherwise
            });
        } else {
            // Handle other input fields
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const generateDateRange = () => {

        if (!formData.checkOutDate) {
            return [dayjs(formData.checkInDate)];
        }

        const dateRange = [];
        let currentDate = dayjs(formData.checkInDate);
        const endDate = dayjs(formData.checkOutDate);
        
        while (currentDate.isSameOrBefore(endDate, 'day')) {
            dateRange.push(currentDate.clone());
            currentDate = currentDate.add(1, 'day');
        }
        return dateRange;
    };


    useEffect(() => {
        // Update form data when editFormData changes
        if (editFormData) {
            setFormData({
                title: editFormData[0].advertise.title || '',
                description: editFormData[0].advertise.description || '',
                image: editFormData[0].advertise.image_url || '',
                room_id: editFormData.map((data) => data.room.id).join(', ') || '',
                checkInDate: dayjs(editFormData[0].advertise.active_date) || null,
                checkOutDate: dayjs(editFormData[0].advertise.active_date) || null,
                timeStart: dayjs(editFormData[0].advertise.active_date) || null,
                timeEnd: dayjs(editFormData[0].advertise.end_date) || null,
                sentNotification: editFormData[0].advertise.notification || 'NotSent',
            });
            setRoomArray(editFormData.map((data) => data.room.id));
        } else {
            // Reset form data when editFormData is null (form is closed)
            setFormData({
                title: '',
                description: '',
                image: '',
                room_id: '',
                checkInDate: null,
                checkOutDate: null,
                timeStart: null,
                timeEnd: null,
                sentNotification: 'NotSent',
                // Reset other form fields here
            });
        }

    }, [editFormData]);
    // console.log(formData);
    return (
        <Modal show={isOpen} onHide={toggleBooking} backdrop="static" size="lg" dialogClassName={styles.modal}>

            <Modal.Body>
                <Form noValidate validated={validated} encType="multipart/form-data" onSubmit={handleSubmit}>
                    <Row>
                        <div className="d-flex justify-content-end">
                            <button className='btn btn-danger' type="button" onClick={toggleBooking}><i className="bi bi-x"></i></button>
                        </div>
                        <img src="/assets/img/it_logo_color.png" alt="" style={{
                            width: '60vmin',
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginTop: "-2vw"
                        }} />
                    </Row>
                    <Row className='mt-2'>
                        <Form.Group as={Col} md='6' controlId='validationTitle'>
                            <Form.Label>ชื่อกิจกรรม</Form.Label><br/>
                            <TextField
                                required
                                sx={{width: '100%', 
                                    '& .MuiFormHelperText-root': {
                                        fontFamily: 'Prompt',
                                    },
                                }}
                                name='title'
                                value={formData.title}
                                onChange={handleChange}
                                error={validated && formData.title === ""}
                                helperText={validated && formData.title === "" ? "โปรดกรอกชื่อกิจกรรม" : ""}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md='6' controlId='validationImage'>
                            <Form.Label>ภาพกิจกรรม</Form.Label>
                                <div style={{ display: 'flex', height: '55px' }}>
                                    <Input
                                        id="upload-photo"
                                        name="picture"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={handleChange}
                                        inputProps={{ accept: 'image/*' }}
                                    />
                                    <label htmlFor="upload-photo">
                                        <MuiButton variant="contained" color="primary" component="span" sx={{ mr: '5px', height: '100%', fontFamily: 'Prompt' }}>
                                            {formData.image === '' ? 'เพิ่มรูปภาพ' : 'เปลี่ยนรูปภาพ'}
                                        </MuiButton>
                                    </label>
                                    {formData.image !== '' && (
                                        <MuiButton variant="outlined" color="error" onClick={handleDeleteImage} sx={{ fontFamily: 'Prompt' }}>
                                            ลบรูปภาพ
                                        </MuiButton>
                                    )}
                                </div>
                        </Form.Group>
                    </Row>
                    <Row className='mt-2'>
                        <Form.Group as={Col} md='6' controlId='validationDescription'>
                            <Form.Label>รายละเอียดกิจกรรม</Form.Label><br/>
                            <TextField
                                required
                                sx={{width: '100%',
                                    '& .MuiFormHelperText-root': {
                                        fontFamily: 'Prompt',
                                    },
                                }}
                                multiline
                                rows={3}
                                name='description'
                                value={formData.description}
                                onChange={handleChange}
                                error={validated && formData.description === ""}
                                helperText={validated && formData.description === "" ? "โปรดกรอกรายละเอียดกิจกรรม" : ""}
                            />
                        </Form.Group>
                    </Row>
                    <Row className='mt-2'>
                        <Form.Group as={Col} md='6' controlId='validationRoom'>
                            <Form.Label>สถานที่จัดกิจกรรม</Form.Label>
                                <Autocomplete
                                    multiple
                                    id="room-select"
                                    options={allRoom}
                                    value={roomArray}
                                    onChange={handleChangeSelect}
                                    renderInput={(params) => (
                                        <TextField
                                        {...params}
                                        variant="standard"
                                        label="สถานที่"
                                        placeholder="โปรดเลือกสถานที่"
                                        error={validated && roomArray.length === 0}
                                        helperText={validated && roomArray.length === 0 ? "โปรดเลือกสถานที่" : ""}
                                        sx={{
                                            '& .MuiFormHelperText-root': {
                                                fontFamily: 'Prompt',
                                            },
                                        }}
                                        />
                                    )}
                                />
                        </Form.Group>
                    </Row>
                    <Row>
                        <h1 className='mt-4'>เวลาในการจัดกิจกรรม</h1>
                    </Row>
                    {!editFormData && (
                        <FormControlLabel 
                            control={<Switch checked={checked} onChange={handleChangeSwitch} />} 
                            sx={{'& .MuiFormControlLabel-label': {
                                        fontFamily: 'Prompt',
                                    },
                                }} 
                            label="จองหลายวัน" 
                        />
                    )}
                    <Row className='mt-2'>
                        <Form.Group as={Col} md='6' controlId='validationCheckInDate'>
                            {checked ? (<Form.Label>วันที่เริ่มทำการจอง</Form.Label>) : (<Form.Label>วันที่ทำการจอง</Form.Label>)}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MobileDatePicker 
                                    value={formData.checkInDate}
                                    onChange={(newValue) => handleChange({ target: { name: 'checkInDate', value: newValue } })}
                                    sx={{ border: (validated && !formData.checkInDate) ? '1px solid #d32f2f' : '', borderRadius: '4px', width: {xs: '100%'} }}
                                />
                                {(validated && !formData.checkInDate) && <FormHelperText sx={{color:'#E74C3C', fontFamily: 'Prompt'}}>โปรดเลือกวันที่ต้องการจอง</FormHelperText>}
                            </LocalizationProvider>
                        </Form.Group>
                        {(checked && !editFormData) && (
                            <>
                            <Form.Group as={Col}  md='6' controlId='validationCheckOutDate'>
                                <Form.Label>วันที่สิ้นสุดการจอง</Form.Label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileDatePicker 
                                        value={formData.checkOutDate}
                                        onChange={(newValue) => handleChange({ target: { name: 'checkOutDate', value: newValue } })}
                                        sx={{ border: (validated && !formData.checkOutDate && checked) ? '1px solid #d32f2f' : '', borderRadius: '4px', width: {xs: '100%'} }}
                                    />
                                    {(validated && !formData.checkOutDate && checked) && <FormHelperText sx={{color:'#E74C3C', fontFamily: 'Prompt'}}>โปรดเลือกวันที่ต้องการจอง</FormHelperText>}
                                </LocalizationProvider>
                            </Form.Group>
                            </>) }
                    </Row>
                    <Row className='mt-2'>
                        <Form.Group as={Col} md='6' controlId='validationTimeStart'>
                            <Form.Label>เริ่มใช้งาน</Form.Label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    slots={{ textField: TextField }}
                                    slotProps={{ textField: { placeholder: '24 ชั่วโมง เช่น 13:20' } }}
                                    ampm={false}
                                    value={formData.timeStart}
                                    onChange={(newValue) => handleChange({ target: { name: 'timeStart', value: newValue } })}
                                    sx={{ border: (validated && !formData.timeStart) ? '1px solid #d32f2f' : '', borderRadius: '4px', width: {xs: '100%'} }}
                                />
                            </LocalizationProvider>
                            {(validated && !formData.timeStart) && <FormHelperText sx={{color:'#E74C3C', fontFamily: 'Prompt'}}>โปรดเลือกเวลาที่ต้องการจอง</FormHelperText>}
                            {!isTimeInBookDBRange() && <FormHelperText sx={{color:'#E74C3C'}}>ไม่สามารถจองห้องในช่วงเวลานี้ได้</FormHelperText>}
                        </Form.Group>
                        <Form.Group as={Col} md='6' controlId='validationTimeEnd'>
                            <Form.Label>ถึงเวลา</Form.Label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    slots={{ textField: TextField }}
                                    slotProps={{ textField: { placeholder: '24 ชั่วโมง เช่น 13:20' } }}
                                    ampm={false}
                                    value={formData.timeEnd}
                                    onChange={(newValue) => handleChange({ target: { name: 'timeEnd', value: newValue } })}
                                    sx={{ border: (validated && !formData.timeEnd) ? '1px solid #d32f2f' : '', borderRadius: '4px', width: '100%' }}
                                    />
                            </LocalizationProvider>
                            {(validated && !formData.timeStart) && <FormHelperText sx={{color:'#E74C3C', fontFamily: 'Prompt'}}>โปรดเลือกเวลาที่ต้องการจอง</FormHelperText>}
                            {!isTimeInBookDBRange() && <FormHelperText sx={{color:'#E74C3C'}}>ไม่สามารถจองห้องในช่วงเวลานี้ได้</FormHelperText>}
                        </Form.Group>
                        <Form.Group className='mt-3'>
                            <Form.Check
                                type="checkbox"
                                label="ส่งการแจ้งเตือนอีเมลถึงผู้เกี่ยวข้อง" 
                                name='sentNotification'
                                checked={formData.sentNotification === 'Sent'}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>
                    <Row className='mt-5'>
                        <div className="d-flex justify-content-end">
                            {editFormData ? (<Button variant='primary' type='submit'>อัปเดตกิจกรรม</Button>) : (<Button variant='primary' type='submit'>เพิ่มกิจกรรม</Button>)}
                        </div>
                    </Row>
                </Form>

            </Modal.Body>
        </Modal>
    )
}

export default AdvertisingForm