import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import API_DATA from '../../link';
import Swal from 'sweetalert2';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [rows, setRows] = useState([]);
    const [editData, setEditData] = useState({});
    const [open, setOpen] = useState(false);

    const handleDelete = async (id) => {
        console.log('deleting ' + id);
        const confirm = await Swal.fire({
            title: 'คุณแน่ใจว่าต้องการลบผู้ใช้นี้?',
            text: 'การลบผู้ใช้จะทำการลบการจองทั้งหมดของผู้ใช้นี้ด้วย',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            reverseButtons: true,
        });
        if (confirm.isConfirmed) {
            try {
                Swal.fire({
                    title: "กำลังลบ...",
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
                const response = await axios.delete(API_DATA.booker + `?id=${id}`);
                Swal.close();
                Swal.fire({
                    title: 'สำเร็จ',
                    text: 'ทำการลบผู้ใช้แล้ว',
                    icon: 'success',
                });
                console.log(response.data.message);
                setRefresh(!refresh);
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถทำการลบผู้ใช้ได้',
                    icon: 'error',
                })
            }
        }
    }
    const handleBan = async (id, ban) => {
        console.log(id);
        console.log(ban)
        const text = ban ? '' : 'ปลด';
        const confirm = await Swal.fire({
            title: `คุณแน่ใจว่าต้องการ${text}แบนผู้ใช้นี้?`,
            text: `การ${text}แบนผู้ใช้จะทำให้ผู้ใช้นี้ไม่สามารถจองห้องได้`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `${text}แบน`,
            cancelButtonText: 'ยกเลิก',
            reverseButtons: true,
        });
        if (confirm.isConfirmed) {
            try {
                Swal.fire({
                    title: `กำลัง${text}แบน...`,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
                const response = await axios.put(API_DATA.booker + `?id=${id}&ban=${ban}`);
                Swal.close();
                Swal.fire({
                    title: 'สำเร็จ',
                    text: `ทำการ${text}แบนผู้ใช้แล้ว`,
                    icon: 'success',
                });
                console.log(response.data.message);
                setRefresh(!refresh);
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด',
                    text: `ไม่สามารถทำการ${text}แบนผู้ใช้ได้`,
                    icon: 'error',
                })
            }
        }
    }
    const handleDeleteMany = async () => {
        console.log(rows);
        const confirm = await Swal.fire({
            title: 'คุณแน่ใจว่าต้องการลบผู้ใช้ที่เลือก?',
            text: 'การลบผู้ใช้ที่เลือกจะทำการลบการจองทั้งหมดของผู้ใช้ที่เลือกทั้งหมดด้วย',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            reverseButtons: true,
        });
        if (confirm.isConfirmed) {
            try {
                Swal.fire({
                    title: 'กำลังลบ...',
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                await axios.delete(API_DATA.deleteManyBooker, { data: { booker: rows } });
                setTimeout(() => {
                    Swal.close();
                    Swal.fire({
                        title: 'ทำการลบสำเร็จ',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    setRefresh(!refresh);
                }, 2000);
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถทำการลบผู้ใช้ได้',
                    icon: 'error',
                });
            }
        }
    }

    const handleEdit = (id, name, email, role) => {
        console.log('id', id);
        setEditData({
            id: id,
            name: name,
            email: email,
            role: role
        });
    }
    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(API_DATA.booker, editData);
            Swal.fire({
                title: 'ข้อมูลผู้ใช้ถูกแก้ไขแล้ว',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'เกิดข้อผิดพลาดเกิดขึ้น!',
                text: error.response.data.message,
                icon: 'error'
            });
        }
    }

    const columns =
        [
            { field: 'id', headerName: 'ID', width: 80 },
            { field: 'name', headerName: 'Name', width: 240 },
            { field: 'email', headerName: 'Email', width: 240, hideable: false },
            { field: 'role', headerName: 'Role', width: 150 },
            {
                field: 'actions', headerName: 'Actions', width: 240, disableExport: true,
                renderCell: (params) => (<>
                    <Button variant="contained" style={{ margin: 8, marginLeft: 0 }}
                        onClick={() => {
                            handleEdit(params.row.id, params.row.name, params.row.email, params.row.role);
                            setOpen(!open);
                        }}>
                        แก้ไข
                    </Button>
                    <Button variant="outlined" color="warning"
                        onClick={() => handleBan(params.row.id, params.row.verified)}
                        style={{ margin: 8, marginLeft: 0 }}>
                        {params.row.verified ? 'แบน' : 'ปลดแบน'}
                    </Button>
                    <Button variant="outlined" color="error"
                        onClick={() => handleDelete(params.row.id)}
                        style={{ margin: 8, marginLeft: 0 }}>
                        ลบ
                    </Button>
                </>)
            }
        ]

    useEffect(() => {
        axios.get(API_DATA.booker)
            .then(response => { setUsers(response.data) })
            .catch(error => { console.error(error) });
    }, [refresh]);
    return (
        <Box margin={'1vw 3vw 1vw 3vw'}>
            <Typography variant='h4' sx={{ fontFamily: 'prompt' }}><b>จัดการผู้ใช้</b></Typography>
            <br />
            <DataGrid
                rows={users}
                columns={columns}
                pageSizeOptions={[10, 25, 50]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                    sorting: { sortModel: [{ field: 'id', sort: 'asc' }] }
                }}
                checkboxSelection
                disableRowSelectionOnClick
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        csvOptions: {
                            utf8WithBom: true
                        }
                    }
                }}
                rowSelectionModel={rows}
                onRowSelectionModelChange={(newRows) => setRows(newRows)}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: '10px' }}>
                <Button
                    variant='outlined'
                    color='error'
                    disabled={rows.length == 0}
                    onClick={handleDeleteMany}
                >ลบแถวที่เลือก</Button>
            </Box>
            <Dialog open={open} onClose={() => setOpen(!open)}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>แก้ไข {editData.name}</DialogTitle>
                    <DialogContent>
                        <TextField
                            name='name'
                            label='Name'
                            value={editData.name}
                            onChange={handleChange}
                            fullWidth
                            margin='dense'
                            required
                        />
                        <TextField
                            name='email'
                            label='Email'
                            value={editData.email}
                            onChange={handleChange}
                            type='email'
                            fullWidth
                            margin='dense'
                            required
                        />
                        <TextField
                            name='role'
                            label='Role'
                            value={editData.role}
                            onChange={handleChange}
                            fullWidth
                            margin='dense'
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(!open)} color='error'>ยกเลิก</Button>
                        <Button type='submit' onClick={() => setOpen(!open)}>แก้ไข</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    )
}

export default UserManagement
