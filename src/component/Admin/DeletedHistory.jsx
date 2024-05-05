import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_DATA from '../link';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { ArrowBackIosNew } from '@mui/icons-material';
import { format } from 'date-fns';
import { Typography } from '@mui/material';

const DeletedHistory = () => {
    const [historyList, setHistoryList] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_DATA.historyList);
                setHistoryList(response.data.data);
            }
            catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'warning',
                    title: 'No records found...',
                    text: 'no records found on database.',
                    timer: 5000,
                });
            }
        }
        fetchData();
    }, []);

    const columns = [
        { field: 'id', headerName: 'Booking ID', width: 90, hideable: false },
        { field: 'booker_name', headerName: 'Booker Name', width: 200 },
        { field: 'room', headerName: 'Room', width: 90 },
        { field: 'title', headerName: 'Title', width: 165 },
        { field: 'purpose', headerName: 'Purpose', width: 200 },
        { field: 'reason', headerName: 'Reason', width: 200 },
        { field: 'approved', headerName: 'Approved', width: 120 },
        {
            field: 'check_in_datetime', headerName: 'Check-in DateTime', width: 200,
            valueFormatter: (params) => format(new Date(params.value), "yyyy-MM-dd HH:mm:ss")
        },
        {
            field: 'datetime', headerName: 'DateTime', width: 200,
            valueFormatter: (params) => format(new Date(params.value), "yyyy-MM-dd HH:mm:ss")
        },
    ];

    return (
        <div style={
            {
                marginLeft: '3vw',
                marginRight: '3vw'
            }
        }>
            <div style={{ width: '100%', marginTop: '35px' }}>
                <Link to={"../BookingManagement"}>
                    <p><ArrowBackIosNew /></p>
                </Link>
                <Typography variant="h4" gutterBottom>
                    Deleted history list
                </Typography>
                <DataGrid
                    rows={historyList}
                    columns={columns}
                    pageSize={10}
                    pageSizeOptions={[10, 25, 50]}
                    checkboxSelection
                    disableSelectionOnClick
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10
                            }
                        }
                    }}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            csvOptions: {
                                fileName: 'Deleted_Declined_History',
                                utf8WithBom: true
                            },
                            showQuickFilter: true
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default DeletedHistory
