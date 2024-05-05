import { useContext } from 'react'
import { HomeContext } from '../Home'
import axios from 'axios'
import { Calendar, momentLocalizer } from 'react-big-calendar'
// import { io } from 'socket.io-client'
import moment from 'moment'
import API_DATA from '../link'
import CustomEventOnUser from './CustomEventOnUser'

const localizer = momentLocalizer(moment);
// const socket = io(`http://localhost:3001`);
// const event = [{
//   title: "Counter Strike 2",
//   allDay: false,
//   start: new Date("2023-09-18T15:00:00"),
//   end: new Date("2023-09-18T18:00:00"),
// }]

function RoomCalendar({ prop_roomID }) {

  const { linkBookDB } = useContext(HomeContext);

  const config_color_category = {
    Small_Lecture_Room: '#72CCFC',
    Large_Lecture_Room: '#4974E7',
    Large_Conference_Room: '#B257D1',
    Small_Laboratory_Room: '#EB6AFF',
    Large_Laboratory_Room: '#EB6AFF',
    Support_Room: '#4FA955',
    Multi_Purpose_Hall: '#4FA955',
    None: '#FF5D5D'
  }

  const formattedEvent = linkBookDB.map((event) => {
    let titlePath = event.title
        let regularExpression_title = /ห้อง\s+(\w+)\s+.*?(?:รหัสวิชา\s+(\d+)\s+)?วิชา\s+([^()]+)/;
        let title_subjectID = '';
        let title_subject = '';

        if (titlePath.match(regularExpression_title) !== null) {
            [, , title_subjectID, title_subject] = titlePath.match(regularExpression_title);
        } else {
            title_subject = event.title;
        }
        
        return (
            {
                roomID: event.room_id,
                roomName: event.room.room_name,
                roomDesc: event.room.description,
                roomCategory: event.room.room_category,
                title: (titlePath.match(regularExpression_title) !== null) ? `${event.room.room_name} | ${title_subjectID} ${title_subject}` : `${event.room.room_name} | ${titlePath}`,
                subjectID: title_subjectID,
                subject: title_subject,
                booker: event.booker.name,
                allDay: false,
                start: new Date(event.check_in_datetime),
                end: new Date(event.check_out_datetime),
                isApproved: event.approvement.is_approved
            }
        )
})

  const filteredEvents = formattedEvent.filter(event => event.roomID === prop_roomID && event.isApproved);
  // console.log(filteredEvents);
  return (
    <div>
      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{
          height: 600,
          margin: "50px"
        }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: config_color_category[event.roomCategory],
            fontSize: '12px'
          }
        })}

        components={
          {
            day: {
              event: CustomEventOnUser
            },
            week: {
              event: CustomEventOnUser
            },
            agenda: {
              event: CustomEventOnUser
            }
          }
        }
      />
    </div>
  )
}

export default RoomCalendar
