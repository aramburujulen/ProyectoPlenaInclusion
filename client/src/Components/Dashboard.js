import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Cookies from "js-cookie";

const Dashboard = () => {
    const localToken = localStorage.getItem("accessToken");
    const {name} = jwt_decode(localToken);
    const {userId} = jwt_decode(localToken);
    const {email} = jwt_decode(localToken);
    const [user, setUser] = useState({
        userId: userId,
        name: name,
        email: email
    });
    const [showChangeEmail, setShowChangeEmail] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [dateInit, setDateInit] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [wantsNotifs, setWantsNotifs] = useState(false);
    var currentDate = new Date();
    var endDate = new Date();
    endDate.setDate(currentDate.getDate() + 7);
    currentDate = currentDate.toISOString().slice(0, 10);
    endDate = endDate.toISOString().slice(0, 10);
    /**
     * Pre:---
     * Post: Shows the activities the participant has joined that take place in the following 7 days. Does this on component load.
     */
    useEffect(() => {
        refreshToken();
        const getActivities = async () => {
            try {
                await refreshToken();
                setCards([]);
                let participations = await axios.post("/getUserParticipations", {
                    nameToSearch: user.name,
                })
                let activities = [];
                for (let i = 0; i < participations.data.length; i++) {
                    let activity = await axios.post("/findActivityById", {
                        id: participations.data[i].activityId,
                    })
                    activities[i] = activity;
                }
                activities = activities.sort(compareDates);
                for (let i = 0; i < activities.length; i++) {
                    if (activities[i].data.date >= currentDate && activities[i].data.date <= endDate) {
                        PushCard(activities[i].data);
                    }
                }
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        }; 
        getActivities();
    }, []);
    
    const logout = async() => {
        try{
            await axios.delete("/logout");
            localStorage.removeItem('accessToken');
            navigate("/");
        } catch(error){
            console.log(error);
        }
    };
    /**
     * Pre:---
     * Post: Changes the user's choice based on the state of the checkbox.
     */
    const handleChange = async() =>{
        setWantsNotifs(!wantsNotifs);
        if(wantsNotifs){
            await axios.post("/changeNotifs", {
                id: user.userId,
                notifications: true
            });
        }
        else{
            await axios.post("/changeNotifs", {
                id: user.userId,
                notifications: false
            });
        }
    }
    const refreshToken = async () => {
        try {
            const response = await axios.get('/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            localStorage.setItem("accessToken", response.data.accessToken);
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

    /**
     * Pre:---
     * Post: This function gets  activities as a parameter, creates a card for each of them, and it saves said card in
     * an array that will be later on drawn.
     */
    const PushCard = (activity) => {
        const cardToAdd = (
            <div class="card" style={{height: "100%"}}>
                <div class="card-image">
                    <figure class="image is-4by3">
                    <img src="https://7esl.com/wp-content/uploads/2022/08/team-sports.jpg" alt="Placeholder image"></img>
                    </figure>
                </div>
                <div class="card-content">
                    <div class="media-content">
                        <p class="title is-4">{activity.name}</p>
                    </div>
                    <div class="content">
                        {activity.description}
                    </div>
                    <div class="content">
                    
                    <time datetime="2016-1-1">{activity.date}</time>
                    </div>
                </div>
        </div>
        );
        setCards(cards => [...cards, cardToAdd]);
    }
    const getActivitiesByDate = async (e) => {
        e.preventDefault(e);
        //We empty the array of cards
        setCards([]);
        try {
            await refreshToken();
            let participations = await axios.post("/getUserParticipations", {
                nameToSearch: user.name,
            },{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            let activities = [];
            for (let i = 0; i < participations.data.length; i++) {
                let activity = await axios.post("/findActivityById", {
                    id: participations.data[i].activityId,
                },{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                activities[i] = activity;
            }
            activities = activities.sort(compareDates);
            for (let i = 0; i < activities.length; i++) {
                if (activities[i].data.date >= dateInit && activities[i].data.date <= dateEnd) {
                    PushCard(activities[i].data);
                }
            }
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }
    //We setup a function that will be use as a sorting parameter
    function compareDates(a, b) {
        return new Date(a.date) - new Date(b.date);
    }
    const showEmailForm = () => {
        if (showChangePassword) setShowChangePassword(false);
        setShowChangeEmail(!showChangeEmail);
    }
    const showPasswordForm = () => {
        if (showChangeEmail) setShowChangeEmail(false);
        setShowChangePassword(!showChangePassword);
    }

    /**
     * Pre:---
     * Post: Sends a query to change the user's email.
     */
    const ChangeEmail = async (e) => {
        e.preventDefault(e);
        confirmAlert({
            title: 'Confirmacion',
            message: 'Estas seguro de que quieres cambiarlo?',
            buttons: [{
                label: 'Si',
                onClick: async() => {
                    try {
                        await refreshToken();
                        await axios.post("/changeEmail", {
                            email: user.email,
                            newEmail: newEmail,
                        }, {
                            headers: {
                                Authorization: `Bearer ${localToken}`,
                            },
                        }).then((response) => {
                            alert(response.data.msg);
                            navigate("/dashboard");
                        })
                    } catch (error) {
                        if (error.response) {
                            setMsg(error.response.data.msg);
                        }
                    }
                }
            },{
                label: 'No',
                onClick: () => {
                    console.log('No clicked');
                }
            }]
        });
    }
    /**
     * Pre:---
     * Post: Sends a query to change the user's password (new one will also be encrypted).
     */
    const ChangePassword = async (e) => {
        e.preventDefault(e);
        confirmAlert({
            title: 'Confirmacion',
            message: 'Estas seguro de que quieres cambiarla?',
            buttons: [{
                label: 'Si',
                onClick: async() => {
                    try {
                        await refreshToken();
                        await axios.post("/changePassword", {
                            userId: user.userId,
                            newPw: newPassword,
                        },{
                            headers: {
                                Authorization: `Bearer ${localToken}`,
                            },
                        }).then((response) => {
                            alert(response.data.msg);
                            navigate("/login")
                        })
                    } catch (error) {
                        if (error.response) {
                            setMsg(error.response.data.msg);
                        }
                    }
                }
            },
            {
                label: 'No',
                onClick: () => {
                }
            }]
        });
        
    }
    const goToList = () => {
        navigate("/listOfActivities");
    }
    return (
        <section>
            <div className='hero-body' style={{ height: '100%' }}>
                <div className="columns is-centered is-variable" style={{ zIndex: "1000" }}>
                    <div className="column is-50">
                    </div>
                    <div className="column is-one-quarter">
                        <div className="card">
                            <div className="card-content">
                                <div className="media">
                                    <div className="media-left">
                                        <figure className="image is-48x48">
                                            <img src={"https://www.shutterstock.com/image-vector/picture-profile-icon-human-people-260nw-1011304363.jpg"} alt="Profile" />
                                        </figure>
                                    </div>
                                    <div className="media-content">
                                        <p className="title is-40">{user.name}</p>
                                        <p className="subtitle is-60">{user.email}</p>
                                        <button className="button is-primary is-outlined" onClick={logout}>
                                            Logout
                                        </button>
                                        <div>
                                            Activar Notificaciones 
                                            <input type='checkbox' checked={wantsNotifs} onChange={handleChange}></input>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div className="content">
                                    <div className="buttons are-small">
                                        <button className="button is-primary is-outlined" onClick={showEmailForm}>
                                            Cambiar Email</button>
                                        {showChangeEmail && (
                                            <form onSubmit={ChangeEmail} style={{ position: "absolute", marginTop: "20em", backgroundColor: 'white' }}>
                                                <div className="field" >
                                                    <label className="label">Email</label>
                                                    <div className="control">
                                                        <input className="input" type="email" placeholder="Nuevo Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="field is-grouped">
                                                    <div className="control">
                                                        <button className="button is-primary" type="submit">Aceptar</button>
                                                    </div>
                                                    <div className="control">
                                                        <button className="button is-text" type="button" onClick={showEmailForm}>Cancelar</button>
                                                    </div>
                                                </div>
                                            </form>
                                        )}
                                        <button className="button is-primary is-outlined" onClick={showPasswordForm}>
                                            Cambiar Contraseña</button>
                                        {showChangePassword && (
                                            <form onSubmit={ChangePassword} style={{ position: "absolute", marginTop: "20em", backgroundColor: 'white' }}>
                                                <div className="field" >
                                                    <label className="label">Contraseña</label>
                                                    <div className="control">
                                                        <input className="input" type="password" placeholder="Nueva Contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="field is-grouped">
                                                    <div className="control">
                                                        <button className="button is-primary" type="submit">Aceptar</button>
                                                    </div>
                                                    <div className="control">
                                                        <button className="button is-text" type="button" onClick={showEmailForm}>Cancelar</button>
                                                    </div>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <button className="button is-primary" type="submit" onClick={goToList}>Lista de actividades</button>
                </div>
                <div className="columns is-centered" style={{ marginTop: "0%", width: "100%", border: "1px solid black" }}>
                    Buscar Actividad Por Fecha:
                    <form onSubmit={getActivitiesByDate}>
                        <div className="columns" style={{ paddingLeft: "4vh" }}>
                            <div className="column is-half">
                                <input className="input is-primary" type="date" placeholder="dateInit" value={dateInit} onChange={(e) => setDateInit(e.target.value)} />
                            </div>
                            <div className="column is-half">
                                <input className="input is-primary" type="date" placeholder="dateEnd" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
                            </div>
                        </div>
                        <button className="button is-primary" type="submit">Buscar</button>
                    </form>
                </div>
                <div className="card-grid expand is-mobile" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
                    {cards.map((card, index) => <div key={index} className="card" style={{ width: "100%", gap: "10%", display: "in-line" }}>{card}</div>)}
                </div>
            </div>
        </section>
    )
}

export default Dashboard;