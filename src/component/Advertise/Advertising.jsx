import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import {Button, Select, MenuItem, FormControl, InputLabel} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdvertisingForm from './AdvertisingForm';
import moment from 'moment';
import 'moment/dist/locale/th';
import API_DATA from '../link';
import Swal from 'sweetalert2';
import styles from './Advertising.module.css';
import { TouchContext } from '../TV_TouchScreen/TVTouch';

const Advertising = ({ adminRight }) => {
  const { Touch } = useContext(TouchContext);
  const [loading, setLoading] = useState(true);
  const [linkAdsDB, setLinkAdsDB] = useState([]);
  let timerAds; // Store the timer ID to clear it later
  useEffect(() => {
      const fetchData = async () => {
        try {
            const response = await axios.get(API_DATA.linkAds);
            const events = response.data;
            setLinkAdsDB(events);
            setLoading(false);
        } catch (error) {
            console.error(error);
        } finally {
          // Calculate the milliseconds remaining until the next minute
          const delay = 60000 - (moment().seconds() * 1000 + moment().milliseconds());
          // Schedule the next fetch
          timerAds = setTimeout(fetchData, delay);
        }
      };
      
      // Fetch data initially
      fetchData();
      
      // Cleanup function to clear the timer on component unmount
      return () => clearTimeout(timerAds);
  }, []);
  const currentTime = moment();
  const [isOpen, setIsOpen] = useState(false);
  const [visibleAds, setVisibleAds] = useState([]);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  const toggleBooking = () => {
    setIsOpen(!isOpen);
  };
  
  const [type, setType] = React.useState(0);  //create for filter type
  const handleChangeType = (event) => {
    setType(event.target.value);
  };
  const [floor, setFloor] = React.useState(0);  //create for filter floor
  const handleChangeFloor = (event) => {
    setFloor(event.target.value);
  };

  const handleEdit = async (advertiseId) => {
    try {
      // Fetch data for the advertisement with the given ID
      const response = await axios.get(`${API_DATA.linkAds}/${advertiseId}`);
      const { data } = response;
      // Set the state to open the edit form and pass the data
      setEditFormData(data);
      setIsEditFormOpen(true);
    } catch (error) {
      console.error('Error fetching advertisement data for editing:', error.message);
    }
  };
  const confirmDelete = async (advertiseId) => {
    try {
      const response = await axios.get(`${API_DATA.linkAds}/${advertiseId}`);
      const { data } = response;
      const adsTitle = data[0].advertise.title;
      Swal.fire({
        icon: 'warning',
        title: 'ยืนยันการลบ',
        text: adsTitle,
        showCancelButton: true,
        confirmButtonText: "ยืนยันการลบ",
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed){
          handleDelete(advertiseId);
        }
      })
    } catch (error) {
      console.error('Error fetching advertisement data for confirm DELETE:', error.message);
    }
  }
  const handleDelete = async (advertiseId) => {
    // Implement logic to delete the advertisement with the given ID
    try {
      const deleteBook = await axios.delete(API_DATA.bookingList, {
        params:
        {
          advertiseId: advertiseId,
        }
      });
      const deleteAds = await axios.delete(`${API_DATA.deleteAds}/${advertiseId}`);
      console.log(deleteAds.data.message);
      console.log(deleteBook.data.message);
      Swal.fire({
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
        title: 'ลบสำเร็จ'
      });
    } catch (error) {
      console.error('Error deleting advertisement:', error.message);
    }
    setTimeout(() => {
      window.location.reload();
    }, 1500)
  };

  const groupedAds = linkAdsDB.reduce((result, ad) => {
    const existingAd = result.find((group) => group.advertiseId === ad.advertise.id);

    if (existingAd) {
      existingAd.roomData.push({ roomId: ad.roomId, floor: ad.room.floor });
    } else {
      result.push({
        advertiseId: ad.advertise.id,
        image_url: ad.advertise.image_url,
        title: ad.advertise.title,
        description: ad.advertise.description,
        active_date: ad.advertise.active_date,
        end_date: ad.advertise.end_date,
        roomData: [{ roomId: ad.roomId, floor: ad.room.floor }],
      });
    }
    return result;
  }, []);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedVisibleAds = groupedAds.filter((ad) => {
        const endTime = moment(ad.end_date);
        let floorFilterPassed = true;
        if (floor) {
          floorFilterPassed = ad.roomData.some(room => room.floor === floor);
        }
        return (
          (type === 0 || (type === 1 && currentTime.isSame(endTime, 'day')) ||
          (type === 2 && currentTime.isSame(endTime, 'week')) ||
          (type === 3 && currentTime.isSame(endTime, 'month'))) &&
          currentTime.isBefore(endTime) &&
          floorFilterPassed
        );
      })
      .slice() // Create a shallow copy to avoid mutating the original array
      .sort((a, b) => moment(a.active_date) - moment(b.active_date)); //sort data by date
      setVisibleAds(updatedVisibleAds);
    });
    return () => clearInterval(intervalId);
  }, [groupedAds, currentTime, floor]);

  return (
    <div style={
      {
        marginLeft: '3vw',
        marginRight: '3vw'
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
          {Touch ? (
            <>
              <div className={styles.touch}>
                
                <div className={styles.topicAdvertise}>
                  <Link to='/Touch'>
                    <ArrowBackIosNewIcon sx={{ fontSize: '5vw' }} />
                  </Link>
                  <p>กิจกรรม / ประชาสัมพันธ์ <AnnouncementIcon sx={{ fontSize: '5vw' }}/></p>
                </div>
                <FormControl sx={{ m: 1 }}>
                  <InputLabel sx={{ fontSize: '2vw', fontFamily: 'Prompt' }} id="demo-simple-select-helper-label">แสดงกิจกรรม</InputLabel>
                  <Select
                    defaultValue={0}
                    value={type}
                    label="แสดงกิจกรรม"
                    onChange={handleChangeType}
                    sx={{fontSize: '2vw', fontFamily: 'Prompt'}}
                  >
                    <MenuItem sx={{ fontFamily: 'Prompt'}} value={0}>ไม่คัดกรอง</MenuItem>
                    <MenuItem sx={{ fontFamily: 'Prompt'}} value={1}>วันนี้</MenuItem>
                    <MenuItem sx={{ fontFamily: 'Prompt'}} value={2}>สัปดาห์นี้</MenuItem>
                    <MenuItem sx={{ fontFamily: 'Prompt'}} value={3}>เดือนนี้</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ m: 1 }}>
                  <InputLabel sx={{ fontSize: '2vw', fontFamily: 'Prompt' }} id="demo-simple-select-helper-label">แสดงชั้นที่</InputLabel>
                  <Select
                    defaultValue={0}
                    value={floor}
                    label="แสดงชั้นที่"
                    onChange={handleChangeFloor}
                    sx={{fontSize: '2vw', fontFamily: 'Prompt'}}
                  >
                    <MenuItem sx={{ fontFamily: 'Prompt'}} value={0}>เลือกทุกชั้น</MenuItem>
                    <MenuItem sx={{ fontFamily: 'Prompt'}} value={1}>1</MenuItem>
                    <MenuItem sx={{ fontFamily: 'Prompt'}} value={2}>2</MenuItem>
                    <MenuItem sx={{ fontFamily: 'Prompt'}} value={3}>3</MenuItem>
                    <MenuItem sx={{ fontFamily: 'Prompt'}} value={4}>4</MenuItem>
                  </Select>
                </FormControl>
                <Grid container spacing={2} sx={{mb:'3vw' }}>
                  {visibleAds.map((ad) => (
                    <Grid item lg={3} md={6} xs={12} key={ad.advertiseId}>
                      <Link to={`/Touch/AdvertiseDetail/${ad.advertiseId}`} className={styles.cardUser}>
                        <span className={styles.cardText}>
                          ดูรายละเอียด
                        </span>
                        <div className={styles.imgContainer}>
                        {ad.image_url !== '' ? (
                          <img
                          src={ad.image_url}
                          alt={ad.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          ) : (
                            <p style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', color: 'gainsboro' }} >
                                No image
                            </p>
                        )}
                        </div>
                        <div className={styles.cardDetail}>
                          <p className={styles.cardDetailName}>{ad.title}</p>
                          <p className={styles.cardDetailDescription}>{ad.description}</p>
                          <p className={styles.cardDetailRoom} style={{fontWeight: 'bold'}}>{ad.roomData.map(({ roomId }) => roomId).join(', ')}</p>
                          <p className={styles.cardDetailDate}>{`วันที่ ${moment(ad.active_date).locale('th').format('LL')}`} <br /> {`เวลา ${moment(ad.active_date).locale('th').format('LT')} - ${moment(ad.end_date).locale('th').format('LT')}`}</p>
                        </div>
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </>
          ):(
            <>
              <div className={styles.topicAdvertise}>
                {!adminRight ? (
                  <Link to='/'>
                    <ArrowBackIosNewIcon fontSize='large' />
                  </Link>
                  ):(
                  <Link to='/admin'>
                    <ArrowBackIosNewIcon fontSize='large' />
                  </Link>
                  )
                }
                <p>กิจกรรม / ประชาสัมพันธ์ <AnnouncementIcon fontSize='large'/></p>
              </div>
              {linkAdsDB && (
                <>
                  <Grid container sx={{ mb: '2vw' }}>
                    <Grid item lg={3} xs={12}>
                      <Grid container spacing={1}>
                        <Grid item lg={6} xs={6}>
                          <FormControl sx={{ mt: 1, minWidth: '100%' }}>
                            <InputLabel id="demo-simple-select-helper-label" sx={{ fontFamily: 'Prompt' }}>แสดงกิจกรรม</InputLabel>
                            <Select
                              defaultValue={0}
                              value={type}
                              label="แสดงกิจกรรม"
                              onChange={handleChangeType}
                              sx={{ fontFamily: 'Prompt' }}
                            >
                              <MenuItem value={0} sx={{ fontFamily: 'Prompt' }}>ไม่คัดกรอง</MenuItem>
                              <MenuItem value={1} sx={{ fontFamily: 'Prompt' }}>วันนี้</MenuItem>
                              <MenuItem value={2} sx={{ fontFamily: 'Prompt' }}>สัปดาห์นี้</MenuItem>
                              <MenuItem value={3} sx={{ fontFamily: 'Prompt' }}>เดือนนี้</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item lg={6} xs={6}>
                          <FormControl sx={{ mt: 1, width: '100%' }}>
                            <InputLabel  id="demo-simple-select-helper-label" sx={{ fontFamily: 'Prompt' }} >แสดงชั้นที่</InputLabel>
                            <Select
                              defaultValue={0}
                              value={floor}
                              label="แสดงชั้นที่"
                              onChange={handleChangeFloor}
                              sx={{ fontFamily: 'Prompt' }}
                            >
                              <MenuItem value={0} sx={{ fontFamily: 'Prompt' }}>เลือกทุกชั้น</MenuItem>
                              <MenuItem value={1} sx={{ fontFamily: 'Prompt' }}>1</MenuItem>
                              <MenuItem value={2} sx={{ fontFamily: 'Prompt' }}>2</MenuItem>
                              <MenuItem value={3} sx={{ fontFamily: 'Prompt' }}>3</MenuItem>
                              <MenuItem value={4} sx={{ fontFamily: 'Prompt' }}>4</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item lg={9} xs={12}>
                    {adminRight && 
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ float: 'right', width: {xs: '100%', lg: 'initial'}, mt: {xs: '2vw', lg: '0'}, height: {xs: 'initial', lg: '100%'}, fontFamily: 'Prompt' }}
                        onClick={toggleBooking}
                      >
                        เพิ่มกิจกรรม
                      </Button>
                    }
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} sx={{mb:'3vw' }}>
                    {visibleAds.map((ad) => (
                      <Grid item lg={3} md={6} xs={12} key={ad.advertiseId}>
                        {!adminRight ? (
                          <>
                              <Link to={`/AdvertiseDetail/${ad.advertiseId}`} className={styles.cardUser}>
                                <span className={styles.cardText}>
                                  ดูรายละเอียด
                                </span>
                                <div className={styles.imgContainer}>
                                {ad.image_url !== '' ? (
                                  <img
                                  src={ad.image_url}
                                  alt={ad.title}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                  ) : (
                                    <p style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', color: 'gainsboro' }} >
                                        No image
                                    </p>
                                )}
                                </div>
                                <div className={styles.cardDetail}>
                                  <p className={styles.cardDetailName}>{ad.title}</p>
                                  <p className={styles.cardDetailDescription}>{ad.description}</p>
                                  <p className={styles.cardDetailRoom} style={{fontWeight: 'bold'}}>{ad.roomData.map(({ roomId }) => roomId).join(', ')}</p>
                                  <p className={styles.cardDetailDate}>{`วันที่ ${moment(ad.active_date).locale('th').format('LL')}`} <br /> {`เวลา ${moment(ad.active_date).locale('th').format('LT')} - ${moment(ad.end_date).locale('th').format('LT')}`}</p>
                                </div>
                              </Link>
                          </>
                          ) : (
                          <>
                            <div className={styles.cardAdmin}>
                              <div className={styles.imgContainer}>
                              {ad.image_url !== '' ? (
                                  <img
                                      src={ad.image_url}
                                      alt={ad.title}
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <p style={{ textAlign: 'center', fontSize: '20px', marginTop: '30%', fontWeight: 'bold', color: 'gainsboro' }} >
                                      No image
                                  </p>
                              )}
                              </div>
                              <div className={styles.cardDetail}>
                                <p className={styles.cardDetailName}>{ad.title}</p>
                                <p className={styles.cardDetailDescription}>{ad.description}</p>
                                <p className={styles.cardDetailRoom} >{ad.roomData.map(({ roomId }) => roomId).join(', ')}</p>
                                <p className={styles.cardDetailDate}>{`วันที่ ${moment(ad.active_date).locale('th').format('LL')}`} <br /> {`เวลา ${moment(ad.active_date).locale('th').format('LT')} - ${moment(ad.end_date).locale('th').format('LT')}`}</p>
                              </div>
                              {adminRight && (
                                <Grid container>  
                                    <Grid item xs={6}>
                                      <Button
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                        color='warning'
                                        onClick={() => handleEdit(ad.advertiseId)}
                                        sx={{width: '100%', fontFamily: 'Prompt'}}
                                      >
                                        แก้ไข
                                      </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Button
                                        variant="contained"
                                        startIcon={<DeleteIcon />}
                                        color='error'
                                        onClick={() => confirmDelete(ad.advertiseId)}
                                        sx={{width: '100%', fontFamily: 'Prompt'}}
                                        >
                                        ลบกิจกรรม
                                      </Button>
                                    </Grid>
                                  </Grid>
                              )}
                            </div>
                          </>)
                        }
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
              {isOpen && <AdvertisingForm isOpen={isOpen} toggleBooking={toggleBooking} />}
              {isEditFormOpen && (
                <AdvertisingForm
                  isOpen={isEditFormOpen}
                  toggleBooking={() => {
                    setIsEditFormOpen(false);
                    setEditFormData(null); // Clear the editFormData when the form is closed
                  }}
                  editFormData={editFormData} // Pass the data to the form
                  />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Advertising;