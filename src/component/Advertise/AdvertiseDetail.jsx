import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Grid } from '@mui/material'
import { useParams } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import API_DATA from '../link';
import { HomeContext } from '../Home';
import { TouchContext } from '../TV_TouchScreen/TVTouch';
import styles from './AdvertiseDetail.module.css'
function AdvertiseDetail() {
    const navigate = useNavigate();
    const { Touch } = useContext(TouchContext);
    const { setFloor, setSearchQuery } = useContext(HomeContext);
    const [loading, setLoading] = useState(true);
    const { adsId } = useParams();
    const [adsDetail, setAdsDetail] = useState([]);
    useEffect(() => {
        axios.get(`${API_DATA.linkAds}/${adsId}`)
        .then(response => {
            setAdsDetail(response.data)
            setLoading(false);
        })
    }, [])
    
    const groupedAds = adsDetail.reduce((result, ad) => {
        const existingAd = result.find((group) => group.advertiseId === ad.advertiseId);
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

    const findRoomAds = ({ roomId, floor }) => {
        setFloor(floor)
        if(!Touch){
            navigate(`/Floor/${floor}`);
        }
        else{
            navigate(`/Touch/Floor/${floor}`);
        }
        setSearchQuery([roomId, floor])
    };

    return (
        <div style={
            {
                marginLeft: '3vw',
                marginRight: '3vw',
            }
        }>
            {loading ?(
                <>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <CircularProgress />
                    </div>
                </>
            ):(
                <>
                    {Touch ? (
                        <>
                            <Link to="/Touch/Advertising">
                                <p style={{ marginTop: '2vw' }}><ArrowBackIosNewIcon sx={{fontSize: '5vw'}}/></p>
                            </Link>
                            <div className={styles.touch}>
                                <Grid container spacing={2} sx={{mb: '2vw'}}>
                                    <Grid item md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                        <div className={styles.imgContainer}>
                                            {groupedAds[0].image_url !== 'notHave' ? (
                                                <img
                                                    src={groupedAds[0].image_url}
                                                    alt={groupedAds[0].title}
                                                    className={styles.adsImage}
                                                />
                                            ) : (
                                                <p style={{ textAlign: 'center', fontSize: '5vw', marginTop: '15vw', fontWeight: 'bold', color: 'gainsboro' }} >
                                                    No image
                                                </p>
                                            )}
                                        </div>
                                    </Grid>
                                    <Grid item md={12}>
                                        <div className={styles.adsSpace}>
                                            <h1 className={styles.name}>{groupedAds[0].title}</h1>
                                            <h4>รายละเอียด</h4>
                                            <p className={styles.detail}>&emsp;{groupedAds[0].description}</p>
                                            <Grid container spacing={0}>
                                                <Grid item md={6} >
                                                    <div className={styles.dateContainer}>
                                                        <h4>วันที่</h4>
                                                        <p className={styles.date}>{`${moment(groupedAds[0].active_date).locale('th').format('LL')}`}</p>
                                                    </div>
                                                </Grid>
                                                <Grid item md={6} >
                                                    <div className={styles.timeContainer}>
                                                        <h4>เวลา</h4>
                                                        <p className={styles.time}>{`${moment(groupedAds[0].active_date).locale('th').format('LT')} - ${moment(groupedAds[0].end_date).locale('th').format('LT')}`}</p>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                
                                
                                            <hr />
                                            <div className={styles.adsFind}>
                                                <h4>คลิกเพื่อค้นหาห้องจัดกิจกรรม</h4>
                                                {groupedAds[0].roomData.map(({ roomId, floor }) => (
                                                    <button key={roomId} onClick={() => findRoomAds({ roomId, floor })}>
                                                    {roomId}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </>
                    ):(
                        <>
                            <Link to="/Advertise">
                                <p style={{ marginTop: '1vw' }}><ArrowBackIosNewIcon fontSize='large'/></p>
                            </Link>
                            <Grid container spacing={2} sx={{mb: '2vw'}}>
                                <Grid item lg={5} xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                    <div className={styles.imgContainer}>
                                        {groupedAds[0].image_url !== '' ? (
                                            <img
                                                src={groupedAds[0].image_url}
                                                alt={groupedAds[0].title}
                                                className={styles.adsImage}
                                            />
                                        ) : (
                                            <p style={{ textAlign: 'center', fontSize: '20px', marginTop: '30%', fontWeight: 'bold', color: 'gainsboro' }} >
                                                No image
                                            </p>
                                        )}
                                    </div>
                                </Grid>
                                <Grid item lg={7} xs={12}>
                                    <div className={styles.adsSpace}>
                                        <h1 className={styles.name}>{groupedAds[0].title}</h1>
                                        <h4>รายละเอียด</h4>
                                        <p className={styles.detail}>&emsp;{groupedAds[0].description}</p>                                
                                        <Grid container spacing={2}>
                                            <Grid item lg={6} xs={6}>
                                                <h4>วันที่</h4>
                                                <p className={styles.date}>{`${moment(groupedAds[0].active_date).locale('th').format('LL')}`}</p>
                                            </Grid>
                                            <Grid item lg={6} xs={6}>
                                                <h4>เวลา</h4>
                                                <p className={styles.time}>{`${moment(groupedAds[0].active_date).locale('th').format('LT')} - ${moment(groupedAds[0].end_date).locale('th').format('LT')}`}</p>
                                            </Grid>
                                        </Grid>
                                        
                                        
                                        <hr />
                                        <div className={styles.adsFind}>
                                            <h4>คลิกเพื่อค้นหาห้องจัดกิจกรรม</h4>
                                            {groupedAds[0].roomData.map(({ roomId, floor }) => (
                                                <button key={roomId} onClick={() => findRoomAds({ roomId, floor })}>
                                                {roomId}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </>
                    )}
                </>
            )
            }
            
        </div>
    )
}

export default AdvertiseDetail