import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';

const UpdateEvent = () => {
    const {url}=useAuth()
    const { id } = useParams();
    const navigate = useNavigate();
    const [image,setImage]=useState("")
    const [event, setEvent] = useState({
        title: '',
        description: '',
        dateTime: '',
        location: '',
        category: '',
        image: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function ConverToBase64(e){
        var reader=new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload=()=>{
            setImage(reader.result)
        }

        reader.onerror=error=>{
            console.log(error);
        }
    }

    useEffect(() => {
           axios.get(`${url}/auth/event/${id}`)
            .then(response => {
                setEvent(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch event data');
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        setEvent({ ...event, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const eventData = { ...event, image };
            await axios.put(`${url}/auth/event/${id}`, eventData, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            toast.success("Event updated successfully!")
            navigate("/dashboard");
          } catch (error) {
            console.error("Failed to create event", error)
          }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="update-event-container">
            <h2>Update Event</h2>
            <form onSubmit={handleSubmit}>
                <label>Title:</label>
                <input type="text" name="title" value={event.title} onChange={handleChange} required />

                <label>Description:</label>
                <textarea name="description" value={event.description} onChange={handleChange} required />

                <label>Date & Time:</label>
                <input type="datetime-local" name="dateTime" value={event.dateTime} onChange={handleChange} required />

                <label>Location:</label>
                <input type="text" name="location" value={event.location} onChange={handleChange} required />

                <label>Category:</label>
                <input type="text" name="category" value={event.category} onChange={handleChange} required />

                <label>Image URL:</label>
                <input type="file" accept="image/*"  onChange={ConverToBase64} required/>

                <button type="submit">Update Event</button>
            </form>
        </div>
    );
};

export default UpdateEvent;
