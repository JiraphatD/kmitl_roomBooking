import React, { useState, useEffect, useContext, useRef } from 'react';
import './Floor.css';
import { Grid } from '@mui/material';
import styles from './Floor.module.css'
import Floor1 from './1/Floor1';
import Floor2 from './2/Floor2';
import Floor3 from './3/Floor3';
import Floor4 from './4/Floor4';
import { HomeContext } from '../Home';
import { TouchContext } from '../TV_TouchScreen/TVTouch';
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { AnimatePresence, motion } from 'framer-motion';
function Floor({ floor, TV, tvFloor }) {

  const floorRef = React.useRef(null);
  const { currentTime, floorDown, floorUp, setFloor, direction } = useContext(HomeContext);
  const { Touch } = useContext(TouchContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const colors = ['#21449d', '#3779fa'];

  const handleScroll = (e) => {
    if (e.deltaY < 0) {
      // Scroll up, increase number
      floorUp();
    } else {
      // Scroll down, decrease number
      floorDown();
    }
  };
  useEffect(() => {
    const floorElement = floorRef.current;
    if (floorElement) {
        floorElement.addEventListener('wheel', handleScroll);
        return () => {
            floorElement.removeEventListener('wheel', handleScroll);
        };
    }
  }, [floor, location]);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 500); // Change color every 3 seconds (3000 milliseconds)

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('.selectedRoom');
    elements.forEach((element) => {
      element.style.borderColor = colors[currentColorIndex];
      
    });
  }, [currentColorIndex]);
  useEffect(() => { //change floor in TV
    const intervalId = setInterval(() => {
      if (TV) {
        const currentFloor = parseInt(location.pathname.split('/').pop(), 10);
        const nextFloor = (currentFloor % 4) + 1;
        navigate(`/TV/Floor/${nextFloor}`);
        setFloor(nextFloor);
      }
    }, 60000);  //change every 60 second

    return () => clearInterval(intervalId);
  }, [location.pathname, TV, navigate]);

  useEffect(() => { //change floor in touch screen TV
    if (Touch) {
      navigate(`/Touch/Floor/${tvFloor}`);
    }
  }, [tvFloor])
  const pageTransition = direction === 'up' ?
  {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -100 }
  }:{
    hidden: { opacity: 0, y: -100 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 100 }
  };
  return (
      <div style={{ marginLeft: '3vw', marginRight: '3vw'}} ref={floorRef}>
        <Grid container spacing={0} className={styles.FloorBtnContainer}>
          <Grid container spacing={0}>
            <Grid item xs={7} sm={5} className={styles.FloorName}>
              {!tvFloor ? (<h1>FLOOR {floor}</h1>) : (<h1>FLOOR {tvFloor}</h1>)}
            </Grid>
            {screen.width >= 900 ? null :
              <Grid item xs={5} sm={7}>
                <Grid container spacing={0} className={styles.FloorBtn}>
                  <Grid item xs={6}>
                    <p onClick={floorUp} className={styles.selectFloor} id='floorUpBtn' style={{ opacity: floor == 4 ? 0.5 : 1 }}>
                      <KeyboardArrowUpIcon />
                    </p>
                  </Grid>
                  <Grid item xs={6}>
                    <p onClick={floorDown} className={styles.selectFloor} id='floorDownBtn' style={{ opacity: floor == 1 ? 0.5 : 1 }}>
                      <KeyboardArrowDownIcon />
                    </p>
                  </Grid>
                </Grid>
              </Grid>}
          </Grid>
          <Grid item xs={12} className={styles.FloorName}>
            <h5>{currentTime.format('LLLL')}</h5>
          </Grid>
        </Grid>
        <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
          {(!TV && !Touch) && (
            <>
              <Route path='*' element={<Navigate to="/Floor/1" />} />
              <Route path='/Floor/1' element={floor === 1 ? <motion.div initial="hidden" animate="visible" exit="exit" variants={pageTransition}><Floor1 /></motion.div> : <Navigate to={`/Floor/${floor}`} />} />
              <Route path='/Floor/2' element={floor === 2 ? <motion.div initial="hidden" animate="visible" exit="exit" variants={pageTransition}><Floor2 /></motion.div> : <Navigate to={`/Floor/${floor}`} />} />
              <Route path='/Floor/3' element={floor === 3 ? <motion.div initial="hidden" animate="visible" exit="exit" variants={pageTransition}><Floor3 /></motion.div> : <Navigate to={`/Floor/${floor}`} />} />
              <Route path='/Floor/4' element={floor === 4 ? <motion.div initial="hidden" animate="visible" exit="exit" variants={pageTransition}><Floor4 /></motion.div> : <Navigate to={`/Floor/${floor}`} />} />
            </>
          )}
          {TV && (
            <>
              <Route path="*" element={<Navigate to="/TV/Floor/1" />} />
              <Route path="/TV/Floor/1" element={<motion.div initial="hidden" animate="visible" exit="exit" variants={pageTransition}><Floor1 /></motion.div>} />
              <Route path="/TV/Floor/2" element={<motion.div initial="hidden" animate="visible" exit="exit" variants={pageTransition}><Floor2 /></motion.div>} />
              <Route path="/TV/Floor/3" element={<motion.div initial="hidden" animate="visible" exit="exit" variants={pageTransition}><Floor3 /></motion.div>} />
              <Route path="/TV/Floor/4" element={<motion.div initial="hidden" animate="visible" exit="exit" variants={pageTransition}><Floor4 /></motion.div>} />
            </>
          )}
          {Touch && (
            <>
              <Route path="*" element={<Navigate to="/Touch/Floor/1" />} />
              <Route path="/Touch/Floor/1" element={<motion.div initial="hidden" animate="visible" exit="exit" variants={pageTransition}><Floor1 Touch={Touch} /></motion.div>} />
              <Route path="/Touch/Floor/2" element={<motion.div initial="hidden" animate="visible" exit="exit" variants={pageTransition}><Floor2 Touch={Touch} /></motion.div>} />
              <Route path="/Touch/Floor/3" element={<motion.div initial="hidden" animate="visible" exit="exit" variants={pageTransition}><Floor3 Touch={Touch} /></motion.div>} />
              <Route path="/Touch/Floor/4" element={<motion.div initial="hidden" animate="visible" exit="exit" variants={pageTransition}><Floor4 Touch={Touch} /></motion.div>} />
            </>
          )}
        </Routes>
        </AnimatePresence>
    </div>
  )
}

export default Floor
