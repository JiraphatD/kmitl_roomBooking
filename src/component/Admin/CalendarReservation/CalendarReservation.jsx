import moment from 'moment'
import React from 'react'
import { useState, useContext, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import { AdminContext } from '../AdminPage/AdminPage';
import CustomEvent from './CustomEvent';
import EventDetail from './EventDetail';

const localizer = momentLocalizer(moment);

function CalendarReservation({ location, booker_name = null, subject_id = null, subject_name = null }) {

    const { linkBookDB } = useContext(AdminContext);

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

    // const formattedEvent = linkBookDB.map((event) => (
    //     {
    //         roomName: event.room.room_name,
    //         roomDesc: event.room.description,
    //         roomCategory: event.room.room_category,
    //         title: event.title,
    //         booker: event.booker.name,
    //         allDay: false,
    //         start: new Date(event.check_in_datetime),
    //         end: new Date(event.check_out_datetime),
    //         isApproved: event.approvement.is_approved
    //     }
    // ))

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

    console.log('formatevent:', formattedEvent)

    // const formattedEvent = linkBookDB.map((event) => {
    //     if (event.approvement.is_approved) {
    //         return (
    //             {
    //                 roomName: event.room.room_name,
    //                 roomCategory: event.room.room_category,
    //                 title: event.title,
    //                 allDay: false,
    //                 start: new Date(event.check_in_datetime),
    //                 end: new Date(event.check_out_datetime),
    //             }
    //         )
    //     }
    // })

    // const filtered = formattedEvent.filter((event_in_room) => {
    //     if ((event_in_room.roomName === location) && event_in_room.isApproved) {
    //         return event_in_room;
    //     }

    //     if ((event_in_room.booker === booker_name) && event_in_room.isApproved) {
    //         return event_in_room;
    //     }

    //     if ((event_in_room.subjectID === subject_id) && event_in_room.isApproved) {
    //         return event_in_room;
    //     }
    // });

    const filteredEvents = formattedEvent.filter((event) =>
    // Filter by location, booker, and subject ID (if provided):
    ((location === null || location === '') || event.roomName === location) &&
    ((booker_name === null || booker_name === '') || event.booker === booker_name) &&
    ((subject_id === null || subject_id === '') || event.subjectID === subject_id) &&
    ((subject_name === null || subject_name === '') || event.subject === subject_name) &&
    event.isApproved // Ensure only approved events are displayed
  );

    // console.log('Filter Room',filtered)

    return (
        <>
            <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                views={['month', 'week', 'day', 'agenda']}
                style={
                    {
                        height: 600,
                        margin: "25px 0 50px 0",
                        
                    }
                }
                eventPropGetter={(event) => ({
                    style: {
                        backgroundColor: config_color_category[event.roomCategory],
                        fontSize: '12px',
                        border: '1px solid #FFFFFF',
                    },
                })}
                components={
                    {
                        week: {
                            event: CustomEvent,
                        },
                        day: {
                            event: CustomEvent,
                        },
                    }
                }
            />
        </>
    )
}

export default CalendarReservation