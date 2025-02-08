import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const EventDetails = () => {
  const navigate=useNavigate()
  const { id } = useParams(); // Get event ID from URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attending, setAttending] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/auth/event/${id}`
        );
        setEvent(response.data);
      } catch (err) {
        setError("Event not found or server error");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleAttend = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.warning("Please login to attend the event!");
        return;
      }

      const res = await axios.post(
        `http://localhost:5000/auth/event/${id}/attend`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data.message);
      if(res.data.message === "You are already attending this event"){
        toast.warning("You are already attending this event")
        navigate('/dashboard')
      }else{
          setEvent(res.data);
          setAttending(true);
          toast.success("Attendance added!");
          navigate('/dashboard')
      }
    } catch (error) {
      console.error("Failed to attend event", error);
    }
  };

  if (loading) return <p className="loading">Loading event details...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="event-details">
      {event && (
        <>
          <h2>{event.title}</h2>
          <p className="description">{event.description}</p>
          <p>
            <strong>Date & Time:</strong>{" "}
            {new Date(event.dateTime).toLocaleString()}
          </p>
          <p>
            <strong>Location:</strong> {event.location}
          </p>
          <p>
            <strong>Category:</strong> {event.category}
          </p>
          <p>
            <strong>Organizer:</strong>{" "}
            {event.createdBy
              ? `${event.createdBy.name} (${event.createdBy.email})`
              : "Unknown"}
          </p>
          {event.image && (
            <img src={event.image} alt={event.title} className="event-image" />
          )}

          {!attending && (
            <button className="attend-btn" onClick={handleAttend} >
              Attend Event
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default EventDetails;
