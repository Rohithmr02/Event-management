import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { MdDelete } from "react-icons/md";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { MdEditSquare } from "react-icons/md";
import { CiViewList } from "react-icons/ci";
import ImageCarousel from "./ImageCarousel";
import { toast } from "react-toastify";

const Dashboard = () => {
  const {url}=useAuth()
  const {user}=useAuth()
  const [events, setEvents] = useState([]);
  const [Category,setCategory]=useState("")
  
  
  
  
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${url}/auth/event`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params:{keyword:Category}
        });
        setEvents(res.data);
      } catch (error) {
        console.error("Failed to load events", error);
      }
    };

    fetchEvents();
  }, [Category]);



  const HandleEventDeleteButton=async(id)=>{
    try {
      const res= await axios.delete(`${url}/auth/event/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      )
      if(res.data.message === "Event deleted successfully"){
        toast.success("Event deleted successfully!");
        setEvents((prevdata)=>prevdata.filter((item)=>item._id!==id))
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (!user) return <p>Loading user data...</p>;

  return (
    <div className="dashboard-container">
      <ImageCarousel/>
      <h2>Event Dashboard</h2>
      <Link to="/create-event" className="btn">
        Create Event
      </Link>
      <input 
      type="text"
      placeholder="Search by category"
      onChange={(e)=>setCategory(e.target.value)}
      value={Category}
      className="search-btn"/>
      <div className="event-list">
        {events && events.map((event) => (
          
            <div className="event-card" key={event?._id}>
              <div className="event-card-title">
              <h3>{event?.title}</h3>
              {event?.createdBy?._id === user._id ? <Link to={`/update-event/${event?._id}`}><button><MdEditSquare/></button></Link>:""}
              </div>
              <p>{event?.description}</p>
              <p>Author : {event?.createdBy?.name}</p>
              <div className="event-card-attendee">
              <p>Attendees: {event?.attendees?.length}</p>
              <Link to={`/attendees-list/${event?._id}`}><button><CiViewList/></button></Link>
              </div>
              <p>Category : {event?.category}</p>
              <span>Date : {new Date(event?.dateTime).toLocaleString()}</span><br/>
              
                <Link to={`/Event-details/${event?._id}`}>
                  <button className="view-btn"><BsBoxArrowUpRight/></button>
                </Link>
              
              {user?._id === event?.createdBy?._id ? (
                <button className="dlt-btn" onClick={() => HandleEventDeleteButton(event?._id)}>
                  <MdDelete />
                </button>
              ) : ""}
            </div>
          
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
