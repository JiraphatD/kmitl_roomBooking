import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';
import { InputGroup } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { HomeContext } from '../Home';
import { TouchContext } from '../TV_TouchScreen/TVTouch';
import { Margin } from '@mui/icons-material';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import API_DATA from '../link';
import styles from './BookingForm.module.css'

function BookingForm({ isOpen, toggleBooking, booking_roomID }) {
    //popUp SweetAlert
    const showAlert = () => {
        Swal.fire({
            icon: 'success',
            title: 'ยื่นเรื่องจองห้องสำเร็จ',
            text: 'เจ้าหน้าที่กำลังพิจารณาคำขอของคุณ'
        });
    };



    const [formData, setFormData] = useState({
        title: '',
        purpose: '',
        fullname: '',
        email: '',
        schedule: 'รายวัน',
        room_id: booking_roomID,
        checkInDate: '',
        timeStart: '',
        timeEnd: '',
        otp: ''
    });

    const [validated, setValidated] = useState(false)

    const { linkBookDB } = useContext(HomeContext); // import data from Home.jsx
    const { Touch } = useContext(TouchContext);

    const isEventOverlap = () => {

        const { checkInDate, timeStart, timeEnd } = formData;
        const selectDateTimeStart = moment(`${checkInDate} ${timeStart}`)
        const selectDateTimeEnd = moment(`${checkInDate} ${timeEnd}`);

        for (const eventBooked of linkBookDB) {

            const bookedStartTime = moment(eventBooked.check_in_datetime);
            const bookedEndTime = moment(eventBooked.check_out_datetime);
            const room = eventBooked.room_id;

            if (
                (
                    selectDateTimeStart.isBetween(bookedStartTime, bookedEndTime) ||
                    selectDateTimeEnd.isBetween(bookedStartTime, bookedEndTime)
                ) && (room === booking_roomID)) {

                return false;
            }

        }

        return true;
    }

    const requestOTP = async () => {
        try {
            const response = await axios.post(API_DATA.userRequestVerify, { email: formData.email })
            console.log("Verification requested.");
            console.log(response.data.message);
        }
        catch (error) {
            console.error("Error :", error, error.response.data);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false || !isEventOverlap()) {
            event.preventDefault();
            event.stopPropagation();
        } else {

            // await getEventExist();

            // const filteredEventsByRoomID = eventExist.filter(
            //     (event) => event.roomID === booking_roomID
            // );

            // setEventExist(filteredEventsByRoomID);

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

                const response = await axios.post(API_DATA.createBooker, {
                    title: formData.title,
                    purpose: formData.purpose,
                    fullname: formData.fullname,
                    email: formData.email,
                    schedule: formData.schedule,
                    room_id: formData.room_id,
                    checkInDate: formData.checkInDate,
                    timeStart: formData.timeStart,
                    timeEnd: formData.timeEnd,
                    otp: formData.otp
                });

                console.log(response.data.message);

                setFormData({
                    title: '',
                    purpose: '',
                    fullname: '',
                    email: '',
                    schedule: 'รายวัน',
                    room_id: booking_roomID,
                    checkInDate: '',
                    timeStart: '',
                    timeEnd: '',
                    otp: ''
                });
                Swal.close()
                showAlert();
                toggleBooking();
            } catch (error) {
                console.error('Error submitting form:', error.response.data.message);
                Swal.fire({
                    icon: 'error',
                    title: 'การจองล้มเหลว !',
                    text: error.response.data.message,
                });
            }
            // if (!isEventOverlap(newEvent)) {

            // } else {
            //     alert('Event overlaps with existing events. Choose different dates.');
            // }

        }
        setValidated(true);

        if (!isEventOverlap()) {
            Swal.fire({
                icon: 'error',
                title: 'การจองล้มเหลว !',
                text: "มีการจองก่อนหน้าการจองของท่านโปรดเลือกช่วงเวลาอื่น",
            });
        }
    }

    // const newEvent = {
    //     title: formData.title,
    //     start: new Date(`${formData.checkInDate}T${formData.timeStart}:00.000Z`),
    //     end: new Date(`${formData.checkInDate}T${formData.timeEnd}:00.000Z`),
    //     roomID: booking_roomID,
    // };
    // const [eventExist, setEventExist] = useState([]);
    // const getEventExist = async () => {

    //     try {
    //         const response = await axios.get('http://localhost:3001/reservationList');
    //         const events = response.data;

    //         const formattedEvents = events.map((event) => ({
    //             roomID: event.room_id,
    //             title: event.title,
    //             allDay: false,
    //             start: new Date(event.check_in_datetime),
    //             end: new Date(event.check_out_datetime),
    //         }));

    //         setEventExist(formattedEvents);

    //     } catch (error) {
    //         console.error('Error fetching events:', error);
    //     }
    // }

    // const isEventOverlap = (newEvent) => {

    //     for (const existingEvent of eventExist) {
    //         const newEventStartLocal = new Date(newEvent.start);
    //         const newEventEndLocal = new Date(newEvent.end);
    //         const existingEventStartLocal = new Date(existingEvent.start);
    //         const existingEventEndLocal = new Date(existingEvent.end);

    //         if (
    //             newEvent.roomID === existingEvent.roomID &&
    //             ((newEventStartLocal >= existingEventStartLocal && newEventStartLocal < existingEventEndLocal) ||
    //                 (newEventEndLocal > existingEventStartLocal && newEventEndLocal <= existingEventEndLocal) ||
    //                 (newEventStartLocal <= existingEventStartLocal && newEventEndLocal >= existingEventEndLocal))
    //         ) {
    //             return true;
    //         }
    //     }

    //     return false;
    // }

    const getCurrentDate = () => {
        const toDay = new Date();
        const year = toDay.getUTCFullYear();
        const month = String(toDay.getMonth() + 1).padStart(2, '0');
        const day = String(toDay.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    const getCookie = (name) => {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName === name) {
                return cookieValue;
            }
        }
        return null;
    };

    const setCookie = (name, value, expirationMinutes) => {
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + expirationMinutes * 60 * 1000); // Convert minutes to milliseconds
        const cookieString = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
        document.cookie = cookieString;
    };

    const clearCookie = (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    };


    const [delayOTP, setDelayOTP] = useState(parseInt(getCookie('delayOTP')));
    const [disableDelayButton, setDisableDelayButton] = useState(getCookie('disableDelayButton') === 'true');
    const delayFx = () => {
        if (!disableDelayButton) {
            setDisableDelayButton(true);
            setDelayOTP(20);
            requestOTP();
        }
    }
    useEffect(() => {
        setCookie('delayOTP', delayOTP.toString(), 1);
        setCookie('disableDelayButton', disableDelayButton.toString(), 1);
    }, [delayOTP, disableDelayButton])
    useEffect(() => {
        let timer;
        if (delayOTP > 0 && disableDelayButton) {
            timer = setInterval(() => {
                setDelayOTP((prevDelay) => prevDelay - 1);
            }, 1000);
        }
        else if (disableDelayButton) {
            setDisableDelayButton(false);
        }
        return () => {
            clearInterval(timer);
        };
    }, [delayOTP, disableDelayButton]);

    return (
        <>
            {Touch ? (
                <>
                    <Modal show={isOpen} onHide={toggleBooking} backdrop="static" dialogClassName={styles.touchModal}>
                        <Modal.Body>
                            <Row>
                                <div className="d-flex justify-content-end">
                                    <button className='btn btn-danger' type="button" onClick={toggleBooking}><i className="bi bi-x"></i></button>
                                </div>
                            </Row>
                            <img src="/assets/img/it_logo_color.png" alt="" style={{
                                width: '60vmin',
                                display: "block",
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginTop: "-2vw"
                            }} />

                            <Container style={{
                                paddingLeft: "2vw",
                                paddingRight: "2vw"
                            }}>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Row className='mt-2'>
                                        <Form.Group as={Col} md='6' controlId='validationTitle'>
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control
                                                required
                                                type='text'
                                                name='title'
                                                value={formData.title}
                                                onChange={handleChange}
                                                placeholder='Example: 060XXXXX วิชา Subject (ท) S-3....'
                                            />
                                            <Form.Control.Feedback type='invalid'>ป้อนหัวข้อการจอง</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} md='6' controlId='validationPurpose'>
                                            <Form.Label>Reservation purpose</Form.Label>
                                            <Form.Select aria-label='select-prupose' name='purpose' value={formData.purpose} onChange={handleChange} required>
                                                <option value="">-----Select-----</option>
                                                <option value="การเรียนการสอน">การเรียนการสอน</option>
                                                <option value="การสอบ">การสอบ</option>
                                                <option value="กิจกรรมสันทนาการ">กิจกรรมสันทนาการ</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type='invalid'>เลือกวัตถุประสงค์การใช้งาน</Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row className='mt-2'>
                                        <Form.Group as={Col} md='6' controlId='validationName'>
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                required
                                                type='text'
                                                name='fullname'
                                                value={formData.fullname}
                                                // pattern='[\p{L}]+'
                                                onChange={handleChange}
                                                placeholder='John Doe'
                                            />
                                            <Form.Control.Feedback type='invalid'>ป้อนชื่อผู้จอง</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} md='6' controlId='validationEmail'>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                required
                                                type='text'
                                                name='email'
                                                pattern='[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$'
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder='example@email.com'
                                            />
                                            <Form.Control.Feedback type='invalid'>ป้อนอีเมล</Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row className='mt-4'>
                                        {/* <Form.Group as={Col} md='4' controlId='validationSchedule'>
                                            <Form.Label>กำหนดการ</Form.Label>
                                            <Form.Select aria-label='select-schedule' name='schedule' value={formData.schedule} onChange={handleChange} required>
                                                <option value="">-----Select-----</option>
                                                <option value="Daily">รายวัน</option>
                                                <option value="Weekly">รายสัปดาห์</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type='invalid'>โปรดเลือกกำหนดการจอง</Form.Control.Feedback>
                                        </Form.Group> */}
                                        <Form.Group as={Col} md='4' controlId='validationCheckInDate'>
                                            <Form.Label>วันที่ทำการจอง</Form.Label>
                                            <Form.Control
                                                required
                                                type='date'
                                                name='checkInDate'
                                                value={formData.checkInDate}
                                                onChange={handleChange}
                                                min={getCurrentDate()}
                                            />
                                            <Form.Control.Feedback type='invalid'>เลือกวันเริ่มเข้าใช้งาน</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} md='4' controlId='validationTimeStart'>
                                            <Form.Label>Start time</Form.Label>
                                            <Form.Control
                                                required
                                                type='time'
                                                name='timeStart'
                                                value={formData.timeStart}
                                                onChange={handleChange}
                                                min={(formData.checkInDate === getCurrentDate()) ? getCurrentTime() : '07:00'}
                                                max='18:30'
                                            />
                                            {moment(formData.timeStart, 'HH:mm') < moment('07:00', 'HH:mm') && (
                                                <Form.Control.Feedback type='invalid'>เวลาเข้าใช้งานเลือกได้ตั้งแต่ 07:00 - 22:00 น.</Form.Control.Feedback>
                                            )}
                                            {formData.timeStart === '' && (
                                                <Form.Control.Feedback type='invalid'>เลือกเวลาเข้าใช้งาน</Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                        <Form.Group as={Col} md='4' controlId='validationTimeEnd'>
                                            <Form.Label>End time</Form.Label>
                                            <Form.Control
                                                required
                                                type='time'
                                                name='timeEnd'
                                                value={formData.timeEnd}
                                                onChange={handleChange}
                                                min={formData.timeStart}
                                                max={(['C1', 'C2', 'PT1', 'PT2', 'PT3'].includes(booking_roomID)) ? moment(formData.timeStart, 'HH:mm').add(3, 'hours').format('HH:mm') : '22:00'}
                                            />
                                            {(['C1', 'C2', 'PT1', 'PT2', 'PT3'].includes(booking_roomID) &&
                                                moment(formData.timeEnd, 'HH:mm') > moment(formData.timeStart, 'HH:mm').add(3, 'hours')) && (
                                                    <Form.Control.Feedback type='invalid'>เวลาเข้าใช้งานไม่ควรเกิน 3 ชั่วโมง</Form.Control.Feedback>
                                                )}
                                            {moment(formData.timeEnd, 'HH:mm') <= moment(formData.timeStart, 'HH:mm') && (
                                                <Form.Control.Feedback type='invalid'>เวลาเข้าใช้งานเลือกได้ตั้งแต่ {formData.timeStart} - 22:00 น.</Form.Control.Feedback>

                                            )}
                                            {formData.timeEnd === '' && (
                                                <Form.Control.Feedback type='invalid'>เลือกเวลาสิ้นสุดการใช้งาน</Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Row>
                                    <Row className='mt-2'>
                                    </Row>
                                    <Row className="mt-2">
                                        <Form.Group as={Col} md="6" controlId="validationOtp">
                                            <Form.Label>Verification Code</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    type="text"
                                                    name="otp"
                                                    value={formData.otp}
                                                    onChange={handleChange}
                                                    pattern='\d{6}'
                                                    required
                                                />
                                                <Button
                                                    variant="primary"
                                                    type="button"
                                                    onClick={delayFx}
                                                    disabled={disableDelayButton}
                                                    style={{ borderTopRightRadius: '0.25rem', borderBottomRightRadius: '0.25rem' }}
                                                >
                                                    {disableDelayButton ? `Retry in ${delayOTP}s` : 'Request OTP'}
                                                </Button>
                                                <Form.Control.Feedback type="invalid">Enter a verification code.</Form.Control.Feedback>
                                            </InputGroup>
                                            <Form.Text className="text-muted">
                                                Please enter the 6-digit verification code sent to your provided email address.
                                            </Form.Text>
                                        </Form.Group>
                                    </Row>
                                    <Row className='mt-5'>
                                        <div className="d-flex justify-content-end">
                                            <Button variant='primary' type='submit'>Booking</Button>
                                        </div>
                                    </Row>
                                </Form>
                            </Container>
                        </Modal.Body>
                    </Modal>
                </>
            ) : (
                <>
                    <Modal show={isOpen} onHide={toggleBooking} backdrop="static" dialogClassName={styles.modal}>
                        <Modal.Body>
                            <Row>
                                <div className="d-flex justify-content-end">
                                    <button className='btn btn-danger' type="button" onClick={toggleBooking}><i className="bi bi-x"></i></button>
                                </div>
                            </Row>
                            <img src="/assets/img/it_logo_color.png" alt="" style={{
                                width: '60vmin',
                                display: "block",
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginTop: "-2vw"
                            }} />

                            <Container style={{
                                paddingLeft: "2vw",
                                paddingRight: "2vw"
                            }}>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Row className='mt-2'>
                                        <Form.Group as={Col} md='6' controlId='validationTitle'>
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control
                                                required
                                                type='text'
                                                name='title'
                                                value={formData.title}
                                                onChange={handleChange}
                                                placeholder='Example: 060XXXXX วิชา Subject (ท) S-3....'
                                            />
                                            <Form.Control.Feedback type='invalid'>ป้อนหัวข้อการจอง</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} md='6' controlId='validationPurpose'>
                                            <Form.Label>Reservation purpose</Form.Label>
                                            <Form.Select aria-label='select-prupose' name='purpose' value={formData.purpose} onChange={handleChange} required>
                                                <option value="">-----Select-----</option>
                                                <option value="การเรียนการสอน">การเรียนการสอน</option>
                                                <option value="การสอบ">การสอบ</option>
                                                <option value="กิจกรรมสันทนาการ">กิจกรรมสันทนาการ</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type='invalid'>เลือกวัตถุประสงค์การใช้งาน</Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row className='mt-2'>
                                        <Form.Group as={Col} md='6' controlId='validationName'>
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                required
                                                type='text'
                                                name='fullname'
                                                value={formData.fullname}
                                                onChange={handleChange}
                                                placeholder='John Doe'
                                            />
                                            <Form.Control.Feedback type='invalid'>ป้อนชื่อผู้จอง</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} md='6' controlId='validationEmail'>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                required
                                                type='text'
                                                name='email'
                                                pattern='[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$'
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder='example@email.com'
                                            />
                                            <Form.Control.Feedback type='invalid'>ป้อนอีเมล</Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row className='mt-4'>
                                        {/* <Form.Group as={Col} md='4' controlId='validationSchedule'>
                                            <Form.Label>กำหนดการ</Form.Label>
                                            <Form.Select aria-label='select-schedule' name='schedule' value={formData.schedule} onChange={handleChange} required>
                                                <option value="">-----Select-----</option>
                                                <option value="Daily">รายวัน</option>
                                                <option value="Weekly">รายสัปดาห์</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type='invalid'>โปรดเลือกกำหนดการจอง</Form.Control.Feedback>
                                        </Form.Group> */}
                                        <Form.Group as={Col} md='4' controlId='validationCheckInDate'>
                                            <Form.Label>วันที่ทำการจอง</Form.Label>
                                            <Form.Control
                                                required
                                                type='date'
                                                name='checkInDate'
                                                value={formData.checkInDate}
                                                onChange={handleChange}
                                                min={getCurrentDate()}
                                            />
                                            <Form.Control.Feedback type='invalid'>เลือกวันเริ่มเข้าใช้งาน</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} md='4' controlId='validationTimeStart'>
                                            <Form.Label>Start time</Form.Label>
                                            <Form.Control
                                                required
                                                type='time'
                                                name='timeStart'
                                                value={formData.timeStart}
                                                onChange={handleChange}
                                                min={(formData.checkInDate === getCurrentDate()) ? getCurrentTime() : '07:00'}
                                                max='18:30'
                                            />
                                            {moment(formData.timeStart, 'HH:mm') < moment('07:00', 'HH:mm') && (
                                                <Form.Control.Feedback type='invalid'>เวลาเข้าใช้งานเลือกได้ตั้งแต่ 07:00 - 22:00 น.</Form.Control.Feedback>
                                            )}
                                            {formData.timeStart === '' && (
                                                <Form.Control.Feedback type='invalid'>เลือกเวลาเข้าใช้งาน</Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                        <Form.Group as={Col} md='4' controlId='validationTimeEnd'>
                                            <Form.Label>End time</Form.Label>
                                            <Form.Control
                                                required
                                                type='time'
                                                name='timeEnd'
                                                value={formData.timeEnd}
                                                onChange={handleChange}
                                                min={formData.timeStart}
                                                max={(['C1', 'C2', 'PT1', 'PT2', 'PT3'].includes(booking_roomID)) ? moment(formData.timeStart, 'HH:mm').add(3, 'hours').format('HH:mm') : '22:00'}
                                            />
                                            {(['C1', 'C2', 'PT1', 'PT2', 'PT3'].includes(booking_roomID) &&
                                                moment(formData.timeEnd, 'HH:mm') > moment(formData.timeStart, 'HH:mm').add(3, 'hours')) && (
                                                    <Form.Control.Feedback type='invalid'>เวลาเข้าใช้งานไม่ควรเกิน 3 ชั่วโมง</Form.Control.Feedback>
                                                )}
                                            {moment(formData.timeEnd, 'HH:mm') <= moment(formData.timeStart, 'HH:mm') && (
                                                <Form.Control.Feedback type='invalid'>เวลาเข้าใช้งานเลือกได้ตั้งแต่ {formData.timeStart} - 22:00 น.</Form.Control.Feedback>

                                            )}
                                            {formData.timeEnd === '' && (
                                                <Form.Control.Feedback type='invalid'>เลือกเวลาสิ้นสุดการใช้งาน</Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Row>
                                    <Row className='mt-2'>
                                    </Row>
                                    <Row className="mt-2">
                                        <Form.Group as={Col} md="6" controlId="validationOtp">
                                            <Form.Label>Verification Code</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    type="text"
                                                    name="otp"
                                                    value={formData.otp}
                                                    onChange={handleChange}
                                                    pattern='\d{6}'
                                                    required
                                                />
                                                <Button
                                                    variant="primary"
                                                    type="button"
                                                    onClick={delayFx}
                                                    disabled={disableDelayButton}
                                                    style={{ borderTopRightRadius: '0.25rem', borderBottomRightRadius: '0.25rem' }}
                                                >
                                                    {disableDelayButton ? `Retry in ${delayOTP}s` : 'Request OTP'}
                                                </Button>
                                                <Form.Control.Feedback type="invalid">Enter a verification code.</Form.Control.Feedback>
                                            </InputGroup>
                                            <Form.Text className="text-muted">
                                                Please enter the 6-digit verification code sent to your provided email address.
                                            </Form.Text>
                                        </Form.Group>
                                    </Row>
                                    <Row className='mt-5'>
                                        <div className="d-flex justify-content-end">
                                            <Button variant='primary' type='submit'>Booking</Button>
                                        </div>
                                    </Row>
                                </Form>
                            </Container>
                        </Modal.Body>
                    </Modal>
                </>
            )}
        </>
    )
}

export default BookingForm
