import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';
import { IoIosRemoveCircle } from "react-icons/io";


const AttendeesList = () => {
    const {user,url}=useAuth()
    const { id } = useParams();
    const [attendees, setAttendees] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getdata=async()=>{
            await axios.get(`${url}/auth/event/${id}/attendees`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then((result)=>{
                setAttendees(result.data.attendees)
            })
            .catch(() => setError('Failed to fetch attendees'));
        }
        getdata()
    }, [id]);

    const removeAttendance = async (userId) => {
        try {
            await axios.delete(`${url}/auth/event/${id}/attend`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success("Deleted successfully.")
            setAttendees(attendees.filter(attendee => attendee._id !== userId));
        } catch {
            setError('Failed to remove attendee');
        }
    };

    return (
        <div className="attendees-list-container">
            <h2>Event Attendees</h2>
            {attendees.length>0
            ?
            <>
            {error && <p className="error">{error}</p>}
            <ul>
                {attendees.map(users => (
                    <li key={users._id}>
                        Name : {users.name}
                        {user._id===users._id ? <button onClick={() => removeAttendance(users._id)}><IoIosRemoveCircle/></button>:""}
                    </li>
                ))}
            </ul>
            </>
            :<><p className='error'>No user found!</p></>
            }
            
        </div>
    );
};

export default AttendeesList;
