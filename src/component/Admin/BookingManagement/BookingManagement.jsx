import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { Paper, Typography, Button, Select, MenuItem, Container as MuiContainer } from "@mui/material";
import { format } from "date-fns";
import axios from "axios";
import Swal from 'sweetalert2';
import { ToastContainer, toast } from "react-toastify";
import Decline from "../Decline";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import API_DATA from "../../link";
import './BookingManagement.css';


function BookingManagement() {
    const [bookingDB, setBookingDB] = useState([]);
    const [runNotify, setRunNotify] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const refreshRef = useRef(refresh);
    const [showDecline, setShowDecline] = useState(false);
    const [declineId, setDeclineId] = useState();
    const [declineOrDelete, setDeclineOrDelete] = useState();
    const [filter, setFilter] = useState('approve');
    const [hover, setHover] = useState(false);

    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'title', headerName: 'หัวเรื่องการจอง', width: 165, hideable: false },
        { field: 'room_id', headerName: 'ห้อง', width: 80 },
        { field: 'name', headerName: 'ชื่อผู้จอง', width: 190, valueGetter: ({ row }) => row.booker.name },
        { field: 'email', headerName: 'Email', width: 190, valueGetter: ({ row }) => row.booker.email },
        { field: 'purpose', headerName: 'วัตถุประสงค์', width: 125 },
        {
            field: 'check_in_datetime',
            headerName: 'เวลาเข้าใช้งาน',
            width: 160,
            valueFormatter: (params) => format(new Date(params.value), "dd-MM-yyyy HH:mm:ss"),
        },
        {
            field: 'check_out_datetime',
            headerName: 'เวลาสิ้นสุดการใช้งาน',
            width: 160,
            valueFormatter: (params) => format(new Date(params.value), "dd-MM-yyyy HH:mm:ss"),
        },
        {
            field: 'approve_time',
            headerName: 'เวลาการอนุมัติ',
            width: 160,
            valueGetter: ({ row }) => row.approvement.approve_datetime,
            valueFormatter: (params) => format(new Date(params.value), "dd-MM-yyyy HH:mm:ss"),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 240,
            disableExport: true,
            renderCell: (params) => (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {params.row.approvement.is_approved === false ? (
                        <>
                            <Button variant="contained" onClick={() => handleApprove(params.row.id)} style={{ margin: 8, marginLeft: 0, backgroundColor: "green" }}>
                                อนุมัติ
                            </Button>{" "}
                            <Button variant="contained" color="error" onClick={() => handleDecline(params.row.id)} style={{ margin: 8, marginLeft: 0 }}>
                                เพิกถอน
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to={`Edit-bookingID/${params.row.id}`}>
                                <Button variant="contained" style={{ margin: 8, marginLeft: 0 }}>
                                    แก้ไข
                                </Button>
                            </Link>
                            <Button variant="outlined" color="error" onClick={() => handleDelete(params.row.id)} style={{ margin: 8, marginLeft: 0 }}>
                                ลบ
                            </Button>
                        </>
                    )}
                </div>
            ),
        },
    ]);

    useEffect(() => {
        axios.get(API_DATA.bookingList + `?filter=${filter}`)
            .then(response => { setBookingDB(response.data) }).catch(error => { console.error(error) });
        refreshRef.current = refresh;
    }, [refresh, showDecline, filter]);
    useEffect(() => {
        if (bookingDB.length == 0 || !runNotify) {
            return;
        }
        const approvePending = bookingDB.reduce((count, booking) => {
            if (!booking.approvement.is_approved) {
                return count + 1;
            } else {
                return count;
            }
        }, 0);
        toast(`There are ${approvePending} Approve pending...`);
        setRunNotify(false);
    }, [bookingDB]);

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
                const response = await axios.put(API_DATA.bookingList, { bookingId: bookingId });
                setRefresh(!refreshRef.current);
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
            await axios.put(API_DATA.bookingList + '/Many')
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
        <div style={
            {
                marginLeft: '3vw',
                marginRight: '3vw'
            }
        }>
            <ToastContainer />
            <MuiContainer>
                <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
                    <Typography variant="h4" gutterBottom sx={{fontFamily: 'prompt'}}>
                        <b>การจองทั้งหมด</b>
                    </Typography>
                    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1" style={{ marginLeft: '20px', marginRight: '20px' }}>
                            ตัวกรอง โดย:
                        </Typography>
                        <Select value={filter} onChange={toggleFilter} variant="outlined">
                            <MenuItem value="approve">อนุมัติ</MenuItem>
                            <MenuItem value="edit">แก้ไข</MenuItem>
                        </Select>
                        <Button variant="contained" color="success" onClick={handleApproveAll} style={{ margin: 8 }}>
                            อนุมัติการจองทั้งหมด
                        </Button>
                    </div>
                    <DataGrid
                        rows={bookingDB}
                        columns={columns}
                        pageSize={10}
                        initialState={{
                            columns: {
                                columnVisibilityModel: {
                                    name: false,
                                    check_out_datetime: false,
                                    approve_time: false,
                                }
                            },
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        pageSizeOptions={[10, 25, 50]}
                        checkboxSelection
                        disableRowSelectionOnClick
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                            toolbar: {
                                csvOptions: {
                                    utf8WithBom: true,
                                },
                                showQuickFilter: true
                            }
                        }}
                        onRowSelectionModelChange={(newRows) => setRows(newRows)}
                        rowSelectionModel={rows}
                    />
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button variant="outlined" color="error" onClick={() => handleDelete(rows)} style={{ marginTop: '10px' }}
                            disabled={rows.length === 0}>
                            ลบข้อมูลที่เลือก
                        </Button>
                        <Typography variant="body2" style={{ marginTop: '10px' }}>
                            <Link to="DeletedHistory" style={{ color: 'red', textDecoration: hover ? 'underline' : 'none' }}
                                onMouseEnter={() => setHover(!hover)} onMouseLeave={() => setHover(!hover)}>
                                ประวัติการเพิกถอนและลบข้อมูล...
                            </Link>
                        </Typography>
                    </div>
                </Paper>
                <Decline showDecline={showDecline} setShowDecline={setShowDecline} declineOrDelete={declineOrDelete} declineId={declineId} />
            </MuiContainer>
        </div>
    );
};

export default BookingManagement
