import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";

const ListOfActivities = () => {
    const localToken = localStorage.getItem("accessToken");
    const {name} = jwt_decode(localToken);
    const {userId} = jwt_decode(localToken);
    const {email} = jwt_decode(localToken);
    const [user, setUser] = useState({
        userId: userId,
        name: name,
        email: email
    });
    const [msg, setMsg] = useState('');
    const [dateInit, setDateInit] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [joined, setJoined] = useState(false);
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('')
    var currentDate = new Date();
    var endDate = new Date();
    endDate.setDate(currentDate.getDate() + 7);
    currentDate = currentDate.toISOString().slice(0, 10);
    endDate = endDate.toISOString().slice(0, 10);

    useEffect(() =>{
        const getActivities = async () => {
            try{ 
                refreshToken();
                setCards([]);
                let nullActivities = await axios.post("/getNullParticipations", {
                    nameToSearch: user.name,
                })
                nullActivities.data = nullActivities.data.sort(compareDates);
                for(let i = 0; i < nullActivities.data.length; i++){
                    if(nullActivities.data[i].date >= currentDate && nullActivities.data[i].date <= endDate){
                        PushCard(nullActivities.data[i]);
                    }
                }
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getActivities();
    }, [joined]);

    const refreshToken = async () => {
        try {
            const response = await axios.get('/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setUser({
                ...user, 
                userId: decoded.userId,
                name: decoded.name,
                email: decoded.email
            });
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                navigate("/");
            }
        }
    }
    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime() || expire == undefined) {
            const response = await axios.get('/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setUser({
                ...user, // Copy other fields
                userId: decoded.userId,
                name: decoded.name,
                email: decoded.email
            });
            config.params = {
                userId: decoded.userId
            }
            setExpire(decoded.exp);
        } else {
            config.headers.Authorization = `Bearer ${token}`;
            config.params = {
                userId: user.userId
            }
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const PushCard = (activity) => {
        const cardToAdd = (
          <div className="card" style={{ height: "100%", flexDirection: "column", display: "flex" }}>
            <div className="card-image">
              <figure className="image is-4by3">
                <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image" />
              </figure>
            </div>
            <div className="card-content" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div className="media-content">
                <p className="title is-4">{activity.name}</p>
              </div>
              <div className="content">
                {activity.description}
              </div>
              <div className="content">
                <time dateTime="2016-1-1">{activity.date}</time>
              </div>
              <div className="content">
                <button className="button is-success" onClick={(e) => JoinActivity(e, activity.id)}>JOIN</button>
              </div>
            </div>
          </div>
        );
        setCards(cards => [...cards, cardToAdd]);
      }
      

    function compareDates(a , b){
        return new Date(a.date) - new Date(b.date);
    }
    const JoinActivity = async(e, idActivity) => {
        e.preventDefault();
        await refreshToken();
        try{
            const tokenTemp = localStorage.getItem("accessToken");
            console.log(tokenTemp)
            await axios.post("/addParticipation", {
                userId: user.userId,
                activityId: idActivity,
            }, {
                headers: {
                    Authorization: `Bearer ${tokenTemp}`,
                },
            });
            setJoined(!joined);
        }  catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }
    const GetActivitiesByDate = async(e) => {
        e.preventDefault();
        setCards([]);
        try{ 
            let nullActivities = await axios.post("/getNullParticipations", {
                nameToSearch: user.name,
            })
            nullActivities.data = nullActivities.data.sort(compareDates);
            for(let i = 0; i < nullActivities.data.length; i++){
                if(nullActivities.data[i].date >= dateInit && nullActivities.data[i].date <= dateEnd){
                    PushCard(nullActivities.data[i]);
                }
            }
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }
    const goToDashboard = () => {
        navigate("/dashboard", {state:{ user: user}});
    }
    return(  
        <section>
            <h1 style={{marginTop: "2em", textAlign:"center", fontSize:"xx-large"}}>Lista de actividades</h1>
            <div>
                <button className="button is-primary" style={{marginLeft:"5em"}} type="submit" onClick={goToDashboard}>Dashboard</button>
            </div>
            <div className="columns is-centered" style={{ marginTop: "0%", width: "100%" }}>
                <form onSubmit={GetActivitiesByDate}>
                    <div className="columns is-centered align-row">
                        <div className="column auto">
                            <input className="input is-primary" type="date" placeholder="dateInit" value={dateInit} onChange={(e) => setDateInit(e.target.value)} />
                        </div>
                        <div className="column auto">
                            <input className="input is-primary" type="date" placeholder="dateEnd" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
                        </div>
                        <div className="column auto">
                            <button className="button is-primary" type="submit">Buscar</button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="card-grid expand is-mobile" style={{ display: "grid",padding:"5em", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1em", justifyItems:'center'}}>
            {cards.map((card, index) => <div key={index} className="card" style={{width: "100%", gap: "10%", display:"in-line"}}>{card}</div>)}
            </div>
    </section> 
    )

}
export default ListOfActivities;