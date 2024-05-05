import React, { useContext, useEffect, useState } from 'react';
import { Grid, TextField, Button, Slide, Autocomplete, Grow, Typography, List, ListItem, ListItemText, Card, Box, Tooltip, IconButton } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminContext } from './AdminPage/AdminPage';
import axios from 'axios';
import moment from 'moment';
import API_DATA from '../link';
import Swal from 'sweetalert2';
import EditAccessories from './EditAccessories';
import { ArrowBackIosNew, DoDisturbOnOutlined } from '@mui/icons-material';

function EditRoomData() {
  const { roomID } = useParams();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [dataToDialog, setDataToDialog] = useState({ id: null, name: '', quantity: 0 });
  const { allRoom } = useContext(AdminContext);
  const [edited, setEdited] = useState(false);
  const [openTip, setOpenTip] = useState(false);
  const [showComputerForm, setShowComputerForm] = useState(false);
  const thisRoom = allRoom.find(room => room.id === roomID) || {};
  const [roomData, setRoomData] = useState({
    id: 'COMMON',
    room_name: '',
    floor: 0,
    description: '',
    seat: 0,
    room_status: 'Active',
    room_category: 'None',
    accessories: [{ id: 1, accessory_name: 'a', quantity: 20, setup_date: '...' },
    { id: 2, accessory_name: 'b', quantity: 20, setup_date: '...' }],
  });
  const [computerSpecs, setComputerSpecs] = useState({
    computer_quantity: 0,
    computer_brand: '',
    display: '',
    cpu: '',
    ram: '',
    main_memory: '',
    gpu: '',
    operation_system: '',
    protection_system: '',
    software_installed: [],
  });

  const handleComputerChange = (e) => {
    setComputerSpecs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  useEffect(() => {
    if (Object.keys(thisRoom).length !== 0) {
      setRoomData((prev) => ({
        ...prev,
        id: thisRoom.id,
        room_name: thisRoom.room_name,
        floor: thisRoom.floor,
        description: thisRoom.description,
        seat: thisRoom.seat,
        room_status: thisRoom.room_status,
        room_category: thisRoom.room_category,
        accessories: thisRoom.accessories,
      })
      );
      if (thisRoom.laboratory !== null) {
        setComputerSpecs((prev) => ({
          ...prev,
          computer_quantity: thisRoom.laboratory.computer_quantity,
          computer_brand: thisRoom.laboratory.computer_brand,
          display: thisRoom.laboratory.display,
          cpu: thisRoom.laboratory.cpu,
          ram: thisRoom.laboratory.ram,
          main_memory: thisRoom.laboratory.main_memory,
          gpu: thisRoom.laboratory.gpu,
          operation_system: thisRoom.laboratory.operation_system,
          protection_system: thisRoom.laboratory.protection_system,
          software_installed: thisRoom.laboratory.software.map((each) => each.software_name),
        })
        );
      }
      // console.log(thisRoom);
    }
  }, [thisRoom]);

  useEffect(() => {
    const handleReload = (event) => {
      event.preventDefault();
    }
    if (edited) {
      window.onbeforeunload = handleReload;
    }
    return () => {
      window.onbeforeunload = null;
    }
  }, [edited]);

  const handleChange = (e) => {
    if (!edited) {
      setEdited(true);
    }
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
  };

  const handleTip = (id) => {
    console.log(id)
    if (!id) {
      setOpenTip(true);
    }
  }
  const addNewAccessory = () => {
    setDataToDialog({ id: null, name: '', quantity: 1 });
    setShowDialog(true);
  }
  const handleAccessory = (data) => {
    if (data.id == null) {
      console.log('no ID');
      setRoomData({ ...roomData, accessories: [...roomData.accessories, { id: data.id, accessory_name: data.name, quantity: data.quantity }] })
      console.log(roomData)
      return;
    }
    setRoomData(prev => {
      const index = prev.accessories.findIndex(accessory => accessory.id == data.id && data.id != null);
      const updatedAccessories = [...prev.accessories];
      updatedAccessories[index] = { ...updatedAccessories[index], accessory_name: data.name, quantity: data.quantity };
      return {
        ...prev,
        accessories: updatedAccessories
      };
    });
  }
  const handleDeleteAccs = (accessory) => {
    console.log("delete " + accessory.id);
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      text: 'You are deleting this accessory',
      showCancelButton: true,
      customClass: {
        cancelButton: 'order-1',
        confirmButton: 'order-2',
      }
    }).then(result => {
      if (result.isConfirmed) {
        const index = roomData.accessories.findIndex(accs => accs == accessory);
        const deletedAccs = [...roomData.accessories];
        deletedAccs.splice(index, 1);
        setRoomData({
          ...roomData,
          accessories: deletedAccs
        })
        Swal.fire({
          title: 'Success!',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
        });
      }
    });
  }
  const displayedAccessories = roomData.accessories.slice();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(roomData);
    // Perform your desired action here, e.g., send data to the server
    let dataToSend = {
      roomData,
      computerSpecs,
    }
    const confirmSave = await Swal.fire({
      title: 'Save the edited data?',
      text: 'All data will be save...',
      icon: 'question',
      showCancelButton: true,
    });
    if (confirmSave.isConfirmed) {
      try {
        const response = await axios.put(API_DATA.updateEditRoom, dataToSend);
        const confirm = await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message,
          timer: 3000,
        });
        setEdited(false);
        if (confirm.isConfirmed) {
          navigate("/Admin/RoomList");
          window.location.reload();
        }
      }
      catch (error) {
        Swal.fire({
          title: 'Update Failed...',
          icon: 'error',
          text: error.response.data.message,
        })
      }
    }
  };

  return (
    <div style={
      {
        marginLeft: '3vw',
        marginRight: '3vw'
      }
    }>
      <Slide direction='left' in={true}>
        <form onSubmit={handleSubmit}>
          <h1 style={{ marginTop: '20px' }}>
            <IconButton color='primary' aria-label='back' onClick={() => navigate("/Admin/RoomList")}>
              <ArrowBackIosNew />
            </IconButton> Editing {roomData.id}
          </h1>
          {thisRoom && (
            <>
              <EditAccessories showDialog={showDialog} setShowDialog={setShowDialog} dataToDialog={dataToDialog}
                handleAccessory={handleAccessory} />
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <TextField
                    name='description'
                    label='Description'
                    value={roomData.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                    margin='dense'
                    required
                  />
                  <Box sx={{ height: '375px', overflowY: 'auto' }}>
                    <Typography>ของใช้ภายในห้อง</Typography>
                    <List>
                      {displayedAccessories.map(accessory => (
                        <Card key={accessory.id} sx={{ marginTop: '10px', boxShadow: '4', display: 'flex' }}>
                          <DoDisturbOnOutlined sx={{ color: 'red', cursor: 'pointer' }}
                            onClick={() => handleDeleteAccs(accessory)} />
                          <ListItem>
                            <ListItemText primary={accessory.accessory_name}
                              secondary={`จำนวน: ${accessory.quantity} | แก้ไขล่าสุด: ${moment(accessory.setup_date).format('DD MMMM')} ${moment(accessory.setup_date).year() + 543} ${moment(accessory.setup_date).format('LT')}`} />
                          </ListItem>
                          <Tooltip title="You can't edit new accessory..." arrow
                            open={openTip && accessory.id == null} onOpen={() => handleTip(accessory.id)} onClose={() => setOpenTip(false)}>
                            <Box>
                              <Button variant='contained' onClick={() => {
                                setDataToDialog({
                                  id: accessory.id, name: accessory.accessory_name, quantity: accessory.quantity
                                });
                                setShowDialog(true);
                              }}
                                disabled={accessory.id == null ? true : false}
                                sx={{ height: '100%' }}
                              >แก้ไข</Button>
                            </Box>
                          </Tooltip>
                        </Card>
                      ))}
                    </List>
                  </Box>
                  <Button
                    variant='contained'
                    onClick={() => addNewAccessory()}
                    sx={{ marginTop: '10px' }}
                  >+ เพิ่มของใช้ภายในห้อง
                  </Button>
                </Grid>
                <Grid item sm={6}>
                  <Autocomplete sx={{ marginTop: '10px' }}
                    id="status"
                    value={roomData.room_status}
                    options={['Active', 'Available', 'Unavailable']}
                    onChange={(event, newValue) => {
                      setRoomData((prevState) => ({
                        ...prevState,
                        room_status: newValue
                      }))
                    }}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Status" required />}
                  />
                  <Autocomplete sx={{ marginTop: '10px' }}
                    id="category"
                    value={roomData.room_category}
                    options={['Small_Lecture_Room',
                      'Medium_Lecture_Room',
                      'Large_Lecture_Room',
                      'Education_Service_Room',
                      'Entertainment_Room',
                      'Large_Conference_Room',
                      'Small_Laboratory_Room',
                      'Large_Laboratory_Room',
                      'Support_Room',
                      'Multi_Purpose_Hall',
                      'None']}
                    onChange={(event, newValue) => {
                      setRoomData((prevState) => ({
                        ...prevState,
                        room_category: newValue
                      }))
                    }}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Category" required />}
                  />
                </Grid>
              </Grid>



              {(showComputerForm) && (
                <Grow in={true} timeout={500}>
                  <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                    <Grid item sm={12}>
                      <h1>Computer Specifications</h1>
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        name='computer_quantity'
                        label='Computer Quantity'
                        value={computerSpecs.computer_quantity}
                        onChange={handleComputerChange}
                        type='number'
                        fullWidth
                        margin='dense'
                        required
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        name='computer_brand'
                        label='Computer Brand'
                        value={computerSpecs.computer_brand}
                        onChange={handleComputerChange}
                        fullWidth
                        margin='dense'
                        required
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        name='display'
                        label='Display'
                        value={computerSpecs.display}
                        onChange={handleComputerChange}
                        fullWidth
                        margin='dense'
                        required
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        name='cpu'
                        label='CPU'
                        value={computerSpecs.cpu}
                        onChange={handleComputerChange}
                        fullWidth
                        margin='dense'
                        required
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        name='ram'
                        label='RAM'
                        value={computerSpecs.ram}
                        onChange={handleComputerChange}
                        fullWidth
                        margin='dense'
                        required
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        name='main_memory'
                        label='Main Memory'
                        value={computerSpecs.main_memory}
                        onChange={handleComputerChange}
                        fullWidth
                        margin='dense'
                        required
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        name='gpu'
                        label='GPU'
                        value={computerSpecs.gpu}
                        onChange={handleComputerChange}
                        fullWidth
                        margin='dense'
                        required
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        name='operation_system'
                        label='Operation System'
                        value={computerSpecs.operation_system}
                        onChange={handleComputerChange}
                        fullWidth
                        margin='dense'
                        required
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        name='protection_system'
                        label='Protection System'
                        value={computerSpecs.protection_system}
                        onChange={handleComputerChange}
                        fullWidth
                        margin='dense'
                        required
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <Autocomplete sx={{ marginTop: '9px' }}
                        multiple
                        freeSolo
                        options={computerSpecs.software_installed}
                        defaultValue={computerSpecs.software_installed}
                        onChange={(event, newValue) => {
                          setComputerSpecs((prev) => ({
                            ...prev,
                            software_installed: newValue
                          })
                          )
                        }}
                        fullWidth
                        renderInput={(params) => <TextField {...params} label="Software Installed" />}
                      />
                    </Grid>
                  </Grid>
                </Grow>
              )}
              <Grid container spacing={2} sx={{ marginTop: '10px', marginBottom: '25px' }}>
                <Grid item sm={12}>
                  {['203', '205', '207', '304', '306', '308'].includes(roomID) && (
                    <Button onClick={() => setShowComputerForm(!showComputerForm)} sx={{ marginRight: '20px' }}>
                      {showComputerForm ? 'ซ่อน Computer Specs' : 'แสดง Computer Specs'}
                    </Button>
                  )}
                  <Button type='submit' variant='contained' color='primary'>
                    บันทึกข้อมูล
                  </Button>
                </Grid>
              </Grid>
            </>)}
        </form>
      </Slide>
    </div>
  );
}

export default EditRoomData;
