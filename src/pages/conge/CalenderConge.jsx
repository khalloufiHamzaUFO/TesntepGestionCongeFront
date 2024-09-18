import React, { useEffect, useState } from 'react';
import { getAllConges } from '../../service/congeDemandeService';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // needed for clickable events

const CalendarConge = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllConges();
                const eventsData = data.map(conge => ({
                    title: `${conge.motif} (${conge.etat})`, // Combine motif and etat into one title
                    start: new Date(conge.dateDebut),
                    end: new Date(conge.dateFin)
                }));
                
                setEvents(eventsData);
            } catch (err) {
                console.error('Failed to fetch conges:', err);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                style={{ height: '600px' }}
            />
        </div>
    );
};

export default CalendarConge;
