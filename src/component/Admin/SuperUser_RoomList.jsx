import React from 'react'
import { useState, useEffect, useContext } from 'react';
import { AdminContext } from './AdminPage/AdminPage';
import { Link } from 'react-router-dom'
import { TextField, Pagination, Autocomplete, Box, Paper, Typography, Button, Container as MuiContainer, FormControl, Select, MenuItem, InputLabel, Grid, Card, CardActionArea, CardMedia, CardContent, useMediaQuery } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChairIcon from '@mui/icons-material/Chair';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios'
import API_DATA from '../link';

function SuperUser_RoomList() {
    const desktop = useMediaQuery('(min-width:1200px)')
    const [page, setPage] = React.useState(1);
    const itemsPerPage = 10;
    const [roomFilter, setRoomFilter] = useState({

        floor: null,
        status: null,

    })

    // Refactoring Filter Room for Admin
    const { allRoom, linkBookDB } = useContext(AdminContext);
    const [filter, setFilter] = useState({
        floor: null,
        category: '',
        room_name: '',
        status: ''
    })

    const floorsList = allRoom.map((floor) => floor.floor || 'None');
    const uniqueFloor = [...new Set(floorsList)];
    uniqueFloor.sort((a, b) => {
        // Keeping 'None' at the end of the list
        if (a === 'None') return 1;
        if (b === 'None') return -1;
        
        // Converting to numbers and comparing
        return Number(a) - Number(b);
    });
    const handleFloorAutocomplete = (value) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            floor: parseInt(value) || '', // Bug
        }))
    }

    const categoriesList = allRoom.map((category) => category.room_category || 'None');
    const uniqueCategory = [...new Set(categoriesList)];
    const handleCategoryAutocomplete = (value) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            category: value || '',
        }))
    }

    const roomsList = allRoom.map((room) => room.room_name || 'None');
    const uniqueRoomName = [...new Set(roomsList)];
    const handleRoomNameAutocomplete = (value) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            room_name: value || '',
        }))
    }

    const statusList = allRoom.map((status) => status.room_status || 'None');
    const uniqueStatus = [...new Set(statusList)];
    const handleStatusAutocomplete = (value) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            status: value || '',
        }))
    }

    const handleOnKeyDown = (event) => {
        if (event.code === 'Enter') {
            setFilter((prevFilter) => ({
                ...prevFilter,
                [event.target.id]: event.target.value,
            }));
        }
    };

    allRoom.sort((obj1, obj2) => {
        if (obj1.floor < obj2.floor) {
            return -1;
        }

        if (obj1.floor > obj2.floor) {
            return 1;
        }

        return 0;
    })

    const filterRooms = allRoom.filter((room) => 
        (filter.floor === null || parseInt(filter.floor) === room.floor || filter.floor === '') &&
        (filter.category === '' || filter.category === room.room_category) &&
        (filter.room_name === '' || filter.room_name === room.room_name) &&
        (filter.status === '' || filter.status === room.room_status)
    )

    const noOfPages = Math.ceil(filterRooms.length / itemsPerPage);

    // useEffect(() => {

    //     axios.get(API_DATA.room).then((response) => {

    //         setRoomList(response.data)
    //         setFilteredRoomList(response.data)

    //     }).catch((error) => { console.error(error) });
    //     console.dir(roomList);
    // }, []);

    const handleChange = (event, value) => {
        setPage(value);
    }
    let roomNames = {
        'c1': 'Creative and Ideation 1',
        'c2': 'Creative and Ideation 2',
        'pt1': 'Peer Tutor 1',
        'pt2': 'Peer Tutor 2',
        'pt3': 'Peer Tutor 3',
        // add more rooms here
    };
    return (
        <div style={
            {
                marginLeft: '3vw',
                marginRight: '3vw'
            }
        }
        >
            <MuiContainer style={{
                marginTop: "1rem",
            }}>

                <h2><b>รายชื่อห้อง</b></h2>
                <Grid container spacing={2}>
                    <Grid item xl={3} lg={3} md={3} sm={3} xs={3}>
                        <Autocomplete
                            size='small'
                            fullWidth
                            id='floor'
                            name='floor'
                            options={uniqueFloor}
                            value={filter.floor}
                            onChange={(event, value) => handleFloorAutocomplete(value)}
                            getOptionLabel={(option) => String(option)}
                            isOptionEqualToValue={(filterRooms, value) => filterRooms.floor === value.floor}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    key={params}
                                    variant='standard'
                                    label='ชั้น'
                                    onKeyDown={handleOnKeyDown}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xl={3} lg={3} md={3} sm={3} xs={3}>
                        <Autocomplete
                            size='small'
                            fullWidth
                            id='category'
                            name='category'
                            options={uniqueCategory}
                            value={filter.category}
                            onChange={(event, value) => handleCategoryAutocomplete(value)}
                            isOptionEqualToValue={(filterRooms, value) => filterRooms.category === value.category}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    key={params}
                                    variant='standard'
                                    label='ประเภทห้อง'
                                    onKeyDown={handleOnKeyDown}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xl={3} lg={3} md={3} sm={3} xs={3}>
                        <Autocomplete
                            size='small'
                            fullWidth
                            id='room_name'
                            name='room_name'
                            options={uniqueRoomName}
                            value={filter.room_name}
                            onChange={(event, value) => handleRoomNameAutocomplete(value)}
                            isOptionEqualToValue={(filterRooms, value) => filterRooms.room_name === value.room_name}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    key={params}
                                    variant='standard'
                                    label='ชื่อห้อง'
                                    onKeyDown={handleOnKeyDown}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xl={3} lg={3} md={3} sm={3} xs={3}>
                        <Autocomplete
                            size='small'
                            fullWidth
                            id='status'
                            name='status'
                            options={uniqueStatus}
                            value={filter.status}
                            onChange={(event, value) => handleStatusAutocomplete(value)}
                            isOptionEqualToValue={(filterRooms, value) => filterRooms.id === value.id}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    key={params}
                                    variant='standard'
                                    label='สถานะ'
                                    onKeyDown={handleOnKeyDown}
                                />
                            )}
                        />
                    </Grid>
                    {/* <Grid item xl={3} lg={3} md={3} sm={3} xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="floor-select-label" sx={{ fontSize: { xs: '4vw', sm: '2vw', md: '2vw', lg: 'initial' } }}>Floor</InputLabel>
                            <Select
                                labelId='floor-select-label'
                                id='floor-select'
                                value={roomFilter.floor}
                                label='Floor'
                                name='floor'
                                onChange={handleChange}
                                sx={{ fontSize: { xs: '4vw', sm: '2vw', lg: 'initial' } }}
                            >
                                <MenuItem sx={{ fontSize: { xs: '4vw', sm: '2vw', md: '2vw', lg: 'initial' } }} value={null}>None</MenuItem>
                                <MenuItem sx={{ fontSize: { xs: '4vw', sm: '2vw', md: '2vw', lg: 'initial' } }} value={1}>1</MenuItem>
                                <MenuItem sx={{ fontSize: { xs: '4vw', sm: '2vw', md: '2vw', lg: 'initial' } }} value={2}>2</MenuItem>
                                <MenuItem sx={{ fontSize: { xs: '4vw', sm: '2vw', md: '2vw', lg: 'initial' } }} value={3}>3</MenuItem>
                                <MenuItem sx={{ fontSize: { xs: '4vw', sm: '2vw', md: '2vw', lg: 'initial' } }} value={4}>4</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xl={3} lg={3} md={3} sm={3} xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="status-select-label" sx={{ fontSize: { xs: '4vw', sm: '2vw', md: '2vw', lg: 'initial' } }}>Status</InputLabel>
                            <Select
                                labelId='status-select-label'
                                id='status-select'
                                value={roomFilter.status}
                                label='Status'
                                name='status'
                                onChange={handleChange}
                                sx={{ fontSize: { xs: '4vw', sm: '2vw', md: '2vw', lg: 'initial' } }}
                            >
                                <MenuItem sx={{ fontSize: { xs: '4vw', sm: '2vw', md: '2vw', lg: 'initial' } }} value={null}>None</MenuItem>
                                <MenuItem sx={{ fontSize: { xs: '4vw', sm: '2vw', md: '2vw', lg: 'initial' } }} value="Active">Active</MenuItem>
                                <MenuItem sx={{ fontSize: { xs: '4vw', sm: '2vw', md: '2vw', lg: 'initial' } }} value="Unavailable">Unavailable</MenuItem>
                                <MenuItem sx={{ fontSize: { xs: '4vw', sm: '2vw', md: '2vw', lg: 'initial' } }} value="Available">Available</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xl={3} lg={3} md={3} sm={3} xs={6}>
                        <Button fullWidth variant='contained' onClick={filterSearch} sx={{ height: '100%' }} ><SearchIcon />Search</Button>
                    </Grid>
                    <Grid item xl={3} lg={3} md={3} sm={3} xs={6}>
                        <Button fullWidth variant='contained' onClick={resetFilter} sx={{ height: '100%' }} ><RestartAltIcon />Reset</Button>
                    </Grid> */}
                </Grid>

                {filterRooms.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((room_data) => (

                    //Renovate Code

                    // Renovate
                    <Paper key={room_data.id} elevation={3} style={{
                        marginTop: "1rem",
                        marginBottom: "1rem",
                    }}>
                        <Grid container>
                            <Grid item xl={3} lg={3} md={3} xs={12}>
                                <img src={room_data.room_image} style={{
                                    borderRadius: "5px",
                                    width: '100%',
                                }} />
                            </Grid>
                            <Grid item xl={9} lg={9} md={9} sm={12} sx={
                                {
                                    display: 'flex',
                                    justifyContent: 'end',
                                    alignItems: 'center',
                                    // paddingLeft: {lg: '2rem', xs: '1rem'},
                                    // bgcolor: 'pink',
                                }
                            }>
                                <Grid container>
                                    <Grid item xl={8} lg={8} md={7} sm={12} xs={12} sx={{ pl: { xs: '4vw', sm: '1rem', md: '2rem' } }}>
                                        <h5><strong>{room_data.id = roomNames[room_data.id.toLowerCase()] || room_data.id}</strong></h5>
                                        <h6>{room_data.description}</h6>
                                        <Grid container>
                                            <Grid item xl={3} lg={3} md={6} sm={3} xs={4}>
                                                <p><ChairIcon color='disabled' /> {room_data.seat} ที่นั่ง</p>
                                            </Grid>
                                            <Grid item xl={3} lg={3} md={6} sm={3} xs={4}>
                                                <p><DesktopWindowsIcon color='disabled' /> {(room_data.laboratory === null) ? 1 : room_data.laboratory.computer_quantity} เครื่อง</p>
                                            </Grid>
                                            <Grid item xl={3} lg={3} md={12} sm={3} xs={4}>
                                                <p>{room_data.room_status === 'Available' ? <CheckCircleIcon color='success' /> : <AccountCircleIcon sx={{ color: '#CF0505' }} />} {room_data.room_status}</p>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xl={4} lg={4} md={5} xs={12} sx={
                                        {
                                            display: 'flex',
                                            // justifyContent: 'center',
                                            alignItems: { lg: 'center', xs: 'normal' },
                                            // bgcolor: 'yellowgreen'
                                        }
                                    }>
                                        <Grid container spacing={desktop ? 1 : 0} sx={{ m: { lg: '1vw', xs: '0' } }}>
                                            <Grid item xs={6} sm={12} lg={6}>
                                                <Link to={`Edit/${room_data.id}`}>
                                                    <Button variant='outlined' color='error' sx={{ width: '100%', height: { xs: '100%', lg: 'initial' } }}>แก้ไข</Button>
                                                </Link>
                                            </Grid>
                                            <Grid item xs={6} sm={12} lg={6}>
                                                <Link to={`../RoomDetail/${room_data.id}`}>
                                                    <Button variant='outlined' sx={{ width: '100%', height: { xs: '100%', lg: 'initial' } }}>ข้อมูลเพิ่มเติม</Button>
                                                </Link>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* <MuiContainer style={{
                            display: "flex",
                            justifyContent: "space-between"
                        }}>

                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "1rem",
                                marginBottom: "1rem",
                            }}>

                                <div>
                                    <img src={room_data.room_image} width='200rem' style={{ borderRadius: "0.5rem", marginRight: "1rem" }} />
                                </div>
                                <div>
                                    <h5><strong>{room_data.room_name}</strong></h5>
                                    <h6>{room_data.description}</h6>
                                    <ul>
                                        <li>Seat: {room_data.seat}</li>
                                        <li>Status: {room_data.room_status}</li>
                                    </ul>
                                </div>
                            </div>

                            <div style={{
                                display: "flex",
                                alignItems: "center",
                            }}>
                                <Link to={`Edit/${room_data.id}`}>
                                    <Button variant='outlined' color='error'>Edit</Button>
                                </Link>
                                <Link to={`../RoomDetail/${room_data.id}`}>
                                    <Button variant='outlined'>More info</Button>
                                </Link>
                            </div>
                        </MuiContainer> */}
                    </Paper>
                ))}
                <Pagination count={noOfPages} page={page} onChange={handleChange} sx={{ margin: '3vw', display: 'flex', justifyContent: 'center'}}/>
            </MuiContainer>
        </div>
    )
}

export default SuperUser_RoomList
