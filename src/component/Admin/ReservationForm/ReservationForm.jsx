import React from 'react'
import axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { Grid, TextField, MenuItem, Button, Autocomplete, Switch, FormControlLabel, Checkbox, Box, FormHelperText } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import API_DATA from '../../link'
import Swal from 'sweetalert2';
import moment from 'moment'
import { AdminContext } from '../AdminPage/AdminPage'
import CalendarReservation from '../CalendarReservation/CalendarReservation'

function ReservationForm() {

    const { linkBookDB, allRoom } = useContext(AdminContext);

    const [formData, setFormData] = useState({
        title: '',
        purpose: '',
        location: null,
        fullname: '',
        email: '',
        start_date: null,
        start_time: null,
        end_time: null,
        end_date: null,
        selectedDays: [],
    })

    const showAlert = () => {
        Swal.fire({
            icon: 'success',
            title: 'จองสำเร็จ',
            showConfirmButton: false,
            timer: 1500
        }).then(
            setTimeout(() => {
                window.location.reload();
            }, 1500)
        );
    };

    const [makeRecurrence, setMakeRecurrence] = useState(false);
    const [makeWeeklyReserve, setMakeWeeklyReserve] = useState(false);

    console.log(moment(formData.start_date).format('YYYY-MM-DD'))

    const [errors, setErrors] = useState({});

    const purposeMenuList = [
        {
            value: 'การเรียนการสอน',
            label: 'การเรียนการสอน'
        },
        {
            value: 'การสอบ',
            label: 'การสอบ'
        },
        {
            value: 'กิจกรรมสันทนาการ',
            label: 'กิจกรรมสันทนาการ'
        },
    ]

    const queryRoomName = allRoom.map((room) => room.id);
    const location_list = [...new Set(queryRoomName)];

    // Beacareful Obj Moment
    const generateRecurringDates = () => {

        const start_date_recurring = moment(formData.start_date);
        const end_date_recurring = (makeRecurrence && makeWeeklyReserve) ? moment(formData.end_date) : moment(formData.start_date);
        const recurringDates = [];

        while (start_date_recurring.isBefore(end_date_recurring) || start_date_recurring.isSame(end_date_recurring, 'day')) {

            console.log(recurringDates, start_date_recurring, end_date_recurring)

            if (makeRecurrence && makeWeeklyReserve) {

                // recurringDates.push(start_date_recurring.format("YYYY-MM-DD"));
                switch (formData.selectedDays.includes(start_date_recurring.format("dddd"))) {

                    case true:
                        recurringDates.push(start_date_recurring.format("YYYY-MM-DD"));
                        break;
                    case false:
                        // recurringDates.push(start_date_recurring.format("YYYY-MM-DD"));
                        break;
                }
            } else {

                recurringDates.push(start_date_recurring.format("YYYY-MM-DD"));

            }

            start_date_recurring.add(1, "days");
        }


        console.log(start_date_recurring.format("dddd"))
        return recurringDates;
    };


    const isEventOverlap = (recurrence_date) => {

        const { start_time, end_time } = formData;

        for (const start_date_select of recurrence_date) {

            const event_start = moment(`${start_date_select}T${start_time}`);
            const event_end = moment(`${start_date_select}T${end_time}`);

            for (const event_booked of linkBookDB) {

                const booked_starttime = moment(event_booked.check_in_datetime);
                const booked_endtime = moment(event_booked.check_out_datetime);
                const booked_room = event_booked.room_id;

                if (
                    (event_start.isBetween(booked_starttime, booked_endtime) ||
                        event_end.isBetween(booked_starttime, booked_endtime) ||
                        event_start.isSame(booked_starttime))
                    && (booked_room === formData.location)) {

                    return false;
                }
            }
        }

        return true;

    }

    const handleDayToggle = (day) => {
        const updatedDays = formData.selectedDays.includes(day)
            ? formData.selectedDays.filter((selectedDay) => selectedDay !== day)
            : [...formData.selectedDays, day];

        setFormData({
            ...formData,
            selectedDays: updatedDays,
        });

        const validationErrors = validateField('selectedDays', updatedDays);
        setErrors((prevErrors) => ({
            ...prevErrors,
            selectedDays: validationErrors,
        }))
    }

    const handleRecurringChange = () => {
        setMakeRecurrence(!makeRecurrence);
        setMakeWeeklyReserve(!makeWeeklyReserve);
        setFormData({
            ...formData,
            end_date: null,
            selectedDays: [],
        });
    }

    const handleLocationAutocomplete = (value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            location: value || '', // Ensure empty string if no value is selected
        }));

        const validationErrors = validateField('location', value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            location: validationErrors,
        }));
    };

    const handleStartDateChange = (date) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            start_date: moment(date).format('YYYY-MM-DD'),
        }))

        const validationErrors = validateField('start_date', date);
        setErrors((prevErrors) => ({
            ...prevErrors,
            start_date: validationErrors,
        }))
    }

    const handleEndDateChange = (date) => {

        setFormData((prevFormData) => ({
            ...prevFormData,
            end_date: moment(date).format('YYYY-MM-DD'),
        }))

        const validationErrors = validateField('end_date', date);
        setErrors((prevErrors) => ({
            ...prevErrors,
            end_date: validationErrors,
        }))
    }

    const handleStartTimeChange = (time) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            start_time: moment(time).format('HH:mm'),
        }))

        const validationErrors = validateField('start_time', time);
        setErrors((prevErrors) => ({
            ...prevErrors,
            start_time: validationErrors,
        }))
    }

    const handleEndTimeChange = (time) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            end_time: moment(time).format('HH:mm'),
        }))

        const validationErrors = validateField('end_time', time);
        setErrors((prevErrors) => ({
            ...prevErrors,
            end_time: validationErrors,
        }))
    }
    console.log('end_time hour:' ,moment(formData.end_time, 'HH:mm').hour(), 'minute', moment(formData.end_time, 'HH:mm').minute())

    const handleChange = (e) => {

        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }))

        const validationErrors = validateField(name, value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validationErrors[name],
        }))
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (makeRecurrence === false) {
            setFormData({
                ...formData,
                end_date: formData.start_date,
            })
        }

        const validationErrors = validateForm(formData);

        if (Object.keys(validationErrors).length == 0) { // Validation is no error.
            console.log(formData)
            const recurrencDates = generateRecurringDates();

            if (!isEventOverlap(recurrencDates)) {
                e.preventDefault();
                e.stopPropagation();
                Swal.fire({
                    icon: 'error',
                    title: 'การจองล้มเหลว !',
                    text: "event is overlap",
                });
            } else {

                try {

                    Swal.fire({
                        title: 'โปรดรอสักครู่',
                        html: 'กำลังสร้างการจอง...',
                        allowEscapeKey: false,
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                    });

                    console.log('Recurring Generate :', recurrencDates)

                    const booking_many = [];

                    for (const recurringReserve of recurrencDates) {

                        booking_many.push({
                            title: formData.title,
                            purpose: formData.purpose,
                            room_name: formData.location,
                            booker_name: formData.fullname,
                            booker_email: formData.email,
                            start_date: recurringReserve,
                            start_time: formData.start_time,
                            end_time: formData.end_time,
                        })
                    }

                    // const response = await axios.post(API_DATA.adminCreateManyBooker, { booking_many });
                    const response = await axios.post(API_DATA.adminCreateBooker, { booking_many });
                    console.log(response.data.message);

                    setFormData({
                        title: '',
                        purpose: '',
                        location: null,
                        fullname: '',
                        email: '',
                        start_date: null,
                        start_time: null,
                        end_time: null,
                        end_date: null,
                        selectedDays: [],
                    })

                    setMakeRecurrence(false);
                    setMakeWeeklyReserve(false);
                    Swal.close();
                    showAlert();
                } catch (error) {
                    console.error('Error submitting form:', error.response.data.message);
                    Swal.fire({
                        icon: 'error',
                        title: 'การจองล้มเหลว !',
                        text: error.response.data.message,
                    });
                }
            }

        } else {
            setErrors(validationErrors)
            console.log(errors)
        }


    }

    const validateForm = (data) => {

        let errors = {};

        for (let fieldName in data) {
            const fieldErrors = validateField(fieldName, data[fieldName]);
            if (fieldErrors) {
                errors[fieldName] = fieldErrors;
            }
        }

        return errors;
    }

    const isEmailValidation = (email) => {
        return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email);
    }

    const validateField = (name, value) => {

        let error = '';

        switch (name) {
            case 'title':
                if (!value) {
                    error = 'กรอกหัวข้อการจอง'
                }
                break;
            case 'purpose':
                if (!value) {
                    error = 'เลือกวัตถุประสงค์การจอง'
                }
                break;
            case 'location':
                if (!value) {
                    error = 'เลือกห้องที่เข้าใช้งาน'
                }
                break;
            case 'fullname':
                if (!value) {
                    error = 'กรอกชื่อผู้ใช้งาน'
                }
                break;
            case 'email':
                if (!value) {
                    error = 'กรอก Email'
                } else if (!isEmailValidation(value)) {
                    error = 'Invalid email.'
                }
                break;
            case 'start_date':
                if (!value) {
                    error = 'เลือกวันที่เข้าใช้งาน'
                } else if (moment(value, 'YYYY-MM-DD').isBefore(moment().format('YYYY-MM-DD'))) {
                    error = `วันที่เข้าใช้งานต้องเริ่มตั้งแต่วันที่ ${moment().format('YYYY/MM/DD')} `
                }
                break;
            case 'start_time':
                if (!value) {
                    error = 'เลือกเวลาเข้าใช้งาน'
                } else if (moment(value, 'HH:mm').isBefore(moment('07:00', 'HH:mm'))) {
                    error = 'เวลาเข้าใช้งานสามารถเลือกได้ตั้งแต่ 07:00 - 19:00 น.'
                } else if (moment(value, 'HH:mm').isAfter(moment('19:00', 'HH:mm'))) {
                    error = 'เวลาเข้าใช้งานสามารถเลือกได้ตั้งแต่ 07:00 - 19:00 น.'
                } else if (formData.start_time === 'Invalid date') {
                    error = 'กรอกเวลาให้ครบ'
                }
                break;
            case 'end_time':
                if (!value) {
                    error = 'เลือกเวลาสิ้นสุดการใช้งาน'
                } else if (moment(value, 'HH:mm').isBefore(moment(formData.start_time, 'HH:mm'))) {
                    error = `เวลาสิ้นสุดการใช้งานสามารถเลือกได้ตั้งแต่ ${moment(formData.start_time, 'HH:mm').format('HH:mm')} - 22:00 น.`
                } else if (moment(value, 'HH:mm').isAfter(moment('22:00', 'HH:mm'))) {
                    error = `เวลาสิ้นสุดการใช้งานสามารถเลือกได้ตั้งแต่ ${moment(formData.start_time, 'HH:mm').format('HH:mm')} - 22:00 น.`
                } else if (moment(value, 'HH:mm').isBefore(moment('07:00', 'HH:mm'))) {
                    error = `เวลาสิ้นสุดการใช้งานสามารถเลือกได้ตั้งแต่ 07:00 - 22:00 น.`
                } else if (formData.end_time === 'Invalid date') {
                    error = 'กรอกเวลาให้ครบ'
                }
                break;
            case 'end_date':
                if (!value && makeRecurrence) {
                    error = 'เลือกวันที่สิ้นสุดการใช้งาน'
                } else if (moment(value, 'YYYY-MM-DD').isBefore(moment(formData.start_date, 'YYYY-MM-DD'))) {
                    error = `วันที่สิ้นสุดการใช้งานสามารถเลือกได้ตั้งแต่ ${moment(formData.start_date).format('YYYY/MM/DD')}`
                }
                break;
            case 'selectedDays':
                if (value.length === 0 && makeRecurrence) {
                    error = 'เลือกวันอย่างน้อย 1 วัน'
                }
                break;
            default:
                break;
        }

        return error;
    }

    

    // console.dir(document.getElementById('start_date').value)

    return (
        <div style={
            {
                margin: '1vw 3vw 3vw 3vw'
            }
        }>
            <Box>
                <h3><b>ระบบจองห้องคณะเทคโนโลยีสารสนเทศ</b></h3>
            </Box>
            <br />
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                            fullWidth
                            variant='filled'
                            id='title'
                            name='title'
                            label='หัวเรื่องการจอง'
                            value={formData.title}
                            onChange={handleChange}
                            error={!!errors.title}
                            helperText={errors.title}
                        />
                    </Grid>
                    <Grid item lg={8} md={6} sm={12} xs={12}>
                        <TextField
                            fullWidth
                            select
                            variant='filled'
                            id='purpose'
                            name='purpose'
                            label='วัตถุประสงค์การจอง'
                            value={formData.purpose}
                            onChange={handleChange}
                            error={!!errors.purpose}
                            helperText={errors.purpose}
                        >
                            {purposeMenuList.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item lg={4} md={6} sm={12} xs={12}>
                        <Autocomplete
                            fullWidth
                            id='location'
                            name='location'
                            options={location_list}
                            value={formData.location}
                            onChange={(event, value) => handleLocationAutocomplete(value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant='filled'
                                    label='สถานที่/ห้อง'
                                    error={!!errors.location}
                                    helperText={errors.location}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item lg={4} md={6} sm={12} xs={12}>
                        <TextField
                            fullWidth
                            variant='filled'
                            id='fullname'
                            name='fullname'
                            label='ชื่อผู้ใช้งานห้อง'
                            value={formData.fullname}
                            onChange={handleChange}
                            error={!!errors.fullname}
                            helperText={errors.fullname}
                        />
                    </Grid>
                    <Grid item lg={4} md={6} sm={12} xs={12}>
                        <TextField
                            fullWidth
                            // type='email'
                            variant='filled'
                            id='email'
                            name='email'
                            label='Email'
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                    </Grid>
                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <MobileDatePicker
                                orientation='portrait'
                                // value={formData.start_date}
                                onChange={handleStartDateChange}
                                slotProps={
                                    {
                                        textField: {
                                            variant: 'filled',
                                            fullWidth: true,
                                            id: 'start_date',
                                            label: 'วันที่เริ่มใช้งาน',
                                            error: !!errors.start_date,
                                            helperText: errors.start_date
                                        }
                                    }
                                }
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item lg={4} md={4} sm={6} xs={6}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <TimePicker
                                orientation='portrait'
                                // value={formData.start_time}
                                defaultValue={moment('00:00', 'HH:mm')}
                                onChange={handleStartTimeChange}
                                slotProps={
                                    {
                                        textField: {
                                            variant: 'filled',
                                            fullWidth: true,
                                            id: 'start_time',
                                            label: 'เวลาเริ่มใช้งาน',
                                            error: !!errors.start_time,
                                            helperText: errors.start_time
                                        }
                                    }
                                }
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item lg={4} md={4} sm={6} xs={6}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <TimePicker
                                orientation='portrait'
                                // value={formData.end_time}
                                onChange={handleEndTimeChange}
                                defaultValue={moment('00:00', 'HH:mm')}
                                slotProps={
                                    {
                                        textField: {
                                            variant: 'filled',
                                            fullWidth: true,
                                            id: 'end_time',
                                            label: 'เวลาสิ้นสุดใช้งาน',
                                            error: !!errors.end_time,
                                            helperText: errors.end_time,
                                        }
                                    }
                                }
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <FormControlLabel
                            label='Make Recurrence'
                            control={
                                <Switch checked={makeRecurrence} onChange={handleRecurringChange} />
                            }
                        />
                    </Grid>
                    {makeRecurrence && (
                        <Box sx={
                            {
                                marginTop: '1rem',
                                marginLeft: '1.5rem'
                            }
                        }>
                            <Grid container spacing={1}>
                                {["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"].map((days) => (
                                    <Grid key={`day-${days}`} item lg={3}>
                                        <FormControlLabel
                                            label={`วัน${days}`}
                                            control={
                                                <Checkbox
                                                    onChange={() => handleDayToggle(days)}
                                                />
                                            }
                                        
                                        />
                                        <FormHelperText sx={{color: '#BE0505'}}>{errors.selectedDays}</FormHelperText>
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid item lg={5} sx={{ marginTop: '1rem' }}>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <MobileDatePicker
                                        orientation='portrait'
                                        // value={formData.end_date}
                                        onChange={handleEndDateChange}
                                        slotProps={
                                            {
                                                textField: {
                                                    variant: 'filled',
                                                    fullWidth: true,
                                                    id: 'end_date',
                                                    label: 'วันที่สิ้นสุดใช้งาน',
                                                    error: !!errors.end_date,
                                                    helperText: errors.end_date
                                                }
                                            }
                                        }
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Box>
                    )}

                </Grid>
                <Button type="submit" variant="contained" color="primary">
                    สร้างการจอง
                </Button>
            </form>
            <CalendarReservation location={formData.location} />
        </div>
    )
}

export default ReservationForm