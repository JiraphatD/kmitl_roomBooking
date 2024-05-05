import React from 'react'
import { useState, useContext } from 'react'
import { AdminContext } from '../AdminPage/AdminPage'
import { Grid, Autocomplete, TextField, Button } from '@mui/material'
import CalendarReservation from '../CalendarReservation/CalendarReservation'

function CalendarView() {

  const { allRoom, linkBookDB } = useContext(AdminContext);
  const [filter, setFilter] = useState({
    location: '',
    booker: '',
    subjectID: '',
    subject: '',
  });

  const locationList = allRoom.map((room) => room.room_name);
  const uniqueLocation = [...new Set(locationList)]
  // console.log(locationList)
  // const bookerList = linkBookDB.map((booking) => {
  //   if (booking.approvement.is_approved) {
  //     return booking.booker.name;
  //   } else {
  //     return 'None';
  //   }
  // })
  const bookerList = linkBookDB
    .filter((booking) => booking.approvement.is_approved)
    .map((booking) => booking.booker.name || 'N/A');

  const uniqueBooker = [...new Set(bookerList)];
  console.log(bookerList)

  const regularExpression_title = /ห้อง\s+(\w+)\s+.*?(?:รหัสวิชา\s+(\d+)\s+)?วิชา\s+([^()]+)/;

  const subjectIDList = linkBookDB
    .filter((booking) => booking.approvement.is_approved)
    .map((booking) => {
      const match = booking.title.match(regularExpression_title);

      // Check if there's a match and capture group indexes are valid
      if (match && match.length >= 3) {
        // Use optional chaining and default value to handle undefined values
        return match[2] || 'N/A'; // Extract subject ID (group 2) with a default
      } else {
        // No match or invalid capture group indexes - return a default value
        return 'None'; // Could find some solution to Remove "undefined" from this confition
      }
    });
  const uniqueSubjectID = [...new Set(subjectIDList)]

  const subjectList = linkBookDB
    .filter((booking) => booking.approvement.is_approved)
    .map((booking) => {
      const match = booking.title.match(regularExpression_title);

      // Check if there's a match and capture group indexes are valid
      if (match && match.length >= 3) {
        // Use optional chaining and default value to handle undefined values
        return match[3] || 'N/A'; // Extract subject ID (group 2) with a default
      } else {
        // No match or invalid capture group indexes - return a default value
        return booking.title; // Could find some solution to Remove "undefined" from this confition
      }
    });

  const uniqueSubject = [...new Set(subjectList)];

  console.log(uniqueSubjectID)

  const handleLocationAutocomplete = (value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      location: value || '',
    }));
  };

  const handleBookerAutocomplete = (value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      booker: value || '',
    }));
  };

  const handleSubjectIDAutocomplete = (value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      subjectID: value || '',
    }));
  };

  const handleSubjectAutocomplete = (value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      subject: value || '',
    }));
  };

  const handleOnKeyDown = (event) => {
    if (event.code === 'Enter') {
      setFilter((prevFilter) => ({
        ...prevFilter,
        [event.target.id]: event.target.value,
      }));
    }
  };

  return (
    <div style={{ margin: '15px 3vw 0 3vw' }}>
      <Grid container spacing={2}>
        <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
          <Autocomplete
            size='small'
            fullWidth
            id='location'
            name='location'
            options={uniqueLocation}
            value={filter.location}
            onChange={(event, value) => handleLocationAutocomplete(value)}
            isOptionEqualToValue={(filteredEvent, value) => filteredEvent.location === value.location}
            renderInput={(params) => (
              <TextField
                {...params}
                key={params}
                variant='standard'
                label='ห้อง'
                onKeyDown={handleOnKeyDown}
              />
            )}
          />
        </Grid>
        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
          <Autocomplete
            size='small'
            fullWidth
            id='booker'
            name='booker'
            options={uniqueBooker}
            value={filter.booker}
            onChange={(event, value) => handleBookerAutocomplete(value)}
            isOptionEqualToValue={(filteredEvent, value) => filteredEvent.booker === value.booker}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='standard'
                label='อ.ผู้สอน/ผู้จอง'
                onKeyDown={handleOnKeyDown}
              />
            )}
          />
        </Grid>
        <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
          <Autocomplete
            size='small'
            fullWidth
            id='subject_id'
            name='subject_id'
            options={uniqueSubjectID}
            value={filter.subjectID}
            onChange={(event, value) => handleSubjectIDAutocomplete(value)}
            isOptionEqualToValue={(filteredEvent, value) => filteredEvent.subjectID === value.subjectID}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='standard'
                label='รหัสวิชา'
                onKeyDown={handleOnKeyDown}
              />
            )}
          />
        </Grid>
        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
          <Autocomplete
            size='small'
            fullWidth
            id='subject'
            name='subject'
            options={uniqueSubject}
            value={filter.subject}
            onChange={(event, value) => handleSubjectAutocomplete(value)}
            isOptionEqualToValue={(filteredEvent, value) => filteredEvent.subject === value.subject}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='standard'
                label='วิชา/กิจกรรม'
                onKeyDown={handleOnKeyDown}
              />
            )}
          />
        </Grid>
      </Grid>
      <CalendarReservation
        location={filter.location}
        booker_name={filter.booker}
        subject_id={filter.subjectID}
        subject_name={filter.subject}
        title_activity={filter.title}
      />
    </div>
  )
}

export default CalendarView