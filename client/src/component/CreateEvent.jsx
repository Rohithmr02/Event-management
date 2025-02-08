import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";


const CreateEvent = () => {
  const {url}=useAuth()
  const navigate = useNavigate();
  const[image,setImage]=useState("")
  const [event, setEvent] = useState({ title: "", description: "", dateTime: "", location: "", category: "" ,image:"" });

  function ConverToBase64(e){
    var reader=new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload=()=>{
        setImage(reader.result)
    };
    reader.onerror=error=>{
        console.log(error);
    }
  }
  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const eventData = { ...event, image };
      await axios.post(`${url}/auth/event`, eventData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Event created successfully!", {
        position: "top-right",
        autoClose: 3000, 
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to create event", error)
    }
  };



  return (
    <div className="event-container">
      <form className="event-form" onSubmit={handleSubmit}>
        <h2>Create Event</h2>
        <input type="text" name="title" placeholder="Event Title" onChange={handleChange} required />
        <input type="text" name="description" placeholder="Description" onChange={handleChange} required />
        <input type="datetime-local" name="dateTime" onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
        <input type="text" name="category" placeholder="Category" onChange={handleChange} required />
        <input type="file" accept="image/*"  onChange={ConverToBase64} required/>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateEvent;
