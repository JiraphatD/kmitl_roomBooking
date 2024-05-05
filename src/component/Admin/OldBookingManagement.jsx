import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Paper, TextField, Typography, Button, List, ListItem, ListItemText, Select, MenuItem, Container as MuiContainer } from "@mui/material";
import { format } from "date-fns";
import axios from "axios";
import Swal from 'sweetalert2';
import Decline from "./Decline";


function BookingManagement() {
    const [bookingDB, setBookingDB] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [searchedBooking, setSearchedBooking] = useState([]);
    const [showDecline, setShowDecline] = useState(false);
    const [declineId, setDeclineId] = useState();
    const [declineOrDelete, setDeclineOrDelete] = useState();
    const [filter, setFilter] = useState('approve');
    const [search, setSearch] = useState("");
    useEffect(() => {
        axios.get(`http://localhost:3001/BookingList?filter=${filter}`)
            .then(response => { setBookingDB(response.data) }).catch(error => { console.error(error) });
    }, [refresh, showDecline, filter]);
    useEffect(() => {
        setSearchedBooking(bookingDB.filter((booking) => {
            return booking.title.toLowerCase().includes(search.toLowerCase()) || booking.booker.name.toLowerCase().includes(search.toLowerCase())
        }))
    }, [bookingDB, search]);

    const toggleFilter = (e) => {
        setFilter(e.target.value);
    }
    const handleEdit = (bookingId) => {
        // Implement your edit logic here, using the bookingId
        console.log(`Edit button clicked for booking with id ${bookingId}`);
    };

    const handleDelete = (bookingId) => {
        // Implement your delete logic here, using the bookingId
        setShowDecline(!showDecline);
        setDeclineId(bookingId);
        setDeclineOrDelete("Delete");
        console.log(bookingId);
    };

    const handleApprove = async (bookingId) => {
        // Implement your approve logic here, using the bookingId
        const { value } = await Swal.fire({
            title: 'Approve this Booking?',
            text: 'You are about to approve this booking.',
            icon: 'warning',
            iconColor: '#1976D2',
            showCancelButton: true,
            confirmButtonColor: 'green',
            cancelButtonColor: '#d33',
            confirmButtonText: 'YES'
        });
        if (value) {
            try {
                const response = await axios.put('http://localhost:3001/BookingList', { bookingId: bookingId });
                setRefresh(!refresh);
                Swal.fire({
                    title: 'Booking Approved !',
                    html: `The booking has been successfully approved.<br> 
                    Booking ID : ${response.data.updated.booking_id}`,
                    icon: 'success',
                    iconColor: 'green',
                    showConfirmButton: false,
                    timer: 2000,
                });
                console.log(response.data.message);
            }
            catch (error) {
                Swal.fire({
                    title: 'Approved Failed...',
                    text: `${error.response.data.message}`,
                    icon: 'error',
                    iconColor: 'red',
                    timer: 2000,
                });
                console.error(error.response.data.message);
            }
        } else {
            console.log('Approve canceled...');
        }

    };

    const handleDecline = (bookingId) => {
        // Implement your approve logic here, using the bookingId
        setShowDecline(!showDecline);
        setDeclineId(bookingId);
        setDeclineOrDelete("Decline");
        console.log(bookingId);
    };
    const handleApproveAll = async () => {
        //Approve all remaining
        const { value } = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            text: 'This will approve all remaining booking...',
            iconColor: '#1976D2',
            showCancelButton: true,
            confirmButtonColor: 'green',
            cancelButtonColor: '#d33',
            confirmButtonText: 'YES'
        });

        if (value) {
            await axios.put('http://localhost:3001/BookingList/Many')
                .then(response => { console.log(response.data.message) }).catch(error => { console.error(error) });
            setRefresh(!refresh);
            Swal.fire({
                title: 'Booking Approved !',
                text: `All booking has been successfully approved.`,
                icon: 'success',
                iconColor: 'green',
            });
        } else {
            console.log('Approve All canceled...');
        }
    };


    return (
        <MuiContainer>
            <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
                <Typography variant="h4" gutterBottom>
                    Booking List
                </Typography>
                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" style={{ marginBottom: '8px', marginRight: '20px' }}>
                        Filter by:
                    </Typography>
                    <Select value={filter} onChange={toggleFilter} variant="outlined">
                        <MenuItem value="approve">Approve</MenuItem>
                        <MenuItem value="edit">Edit</MenuItem>
                        <MenuItem value="latest">Latest Date (By Check In Time)</MenuItem>
                        <MenuItem value="oldest">Oldest Date (By Check In Time)</MenuItem>
                    </Select>
                    <TextField id="outlined-basic" label="Search" variant="outlined"
                        placeholder="Title... Name..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ marginRight: '20px' }} />
                    <Button variant="contained" color="success" onClick={handleApproveAll}>
                        Approve All
                    </Button>
                </div>
                <List>
                    {searchedBooking.length === 0 ? (
                        <ListItem style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <ListItemText primary="No Booking available." style={{ textAlign: "center" }} />
                        </ListItem>
                    ) : (
                        searchedBooking.map((booking) => (
                            <ListItem key={booking.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #ccc" }}>
                                <div>
                                    <strong>Title:</strong> {booking.title} <br />
                                    <strong>Name:</strong> {booking.booker.name} <br />
                                    <strong>Purpose:</strong> {booking.purpose} <br />
                                    <strong>Check In Time:</strong> {format(new Date(booking.check_in_datetime), "yyyy-MM-dd HH:mm:ss")} <br />
                                    <strong>Check Out Time:</strong> {format(new Date(booking.check_out_datetime), "yyyy-MM-dd HH:mm:ss")}
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                                    {booking.approvement.is_approved === false ? (
                                        <>
                                            <Button variant="contained" onClick={() => handleApprove(booking.id)} style={{ margin: 8, marginLeft: 0, backgroundColor: "green" }}>
                                                Approve
                                            </Button>{" "}
                                            <Button variant="contained" color="error" onClick={() => handleDecline(booking.id)}>
                                                Decline
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to={`Edit-bookingID/${booking.id}`}>
                                                <Button variant="contained" style={{ margin: 8, marginLeft: 0 }}>
                                                    Edit
                                                </Button>{" "}
                                            </Link>
                                            <Button variant="outlined" color="error" onClick={() => handleDelete(booking.id)}>
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </ListItem>
                        ))

                    )}
                </List>
            </Paper>
            <Decline showDecline={showDecline} setShowDecline={setShowDecline} declineOrDelete={declineOrDelete} declineId={declineId} />
        </MuiContainer>
    );
};

export default BookingManagement
