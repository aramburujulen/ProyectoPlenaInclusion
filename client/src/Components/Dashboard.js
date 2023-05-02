import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { state } = useLocation();
    const user = state.user;
    const [showChangeEmail, setShowChangeEmail] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [dateInit, setDateInit] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    var currentDate = new Date();
    var endDate = new Date();
    endDate.setDate(currentDate.getDate() + 7);
    currentDate = currentDate.toISOString().slice(0, 10);
    endDate = endDate.toISOString().slice(0, 10);
    
    useEffect(() =>{
        const getActivities = async () => {
            try{ 
                let participations = await axios.post("/getUserParticipations", {
                    nameToSearch: user.name,
                })
                let activities = [];
                for(let i = 0; i < participations.data.length; i++ ){
                    let activity = await axios.post("/findActivityById", {
                        id: participations.data[i].activityId,
                    })
                    activities[i] = activity;
                }
                activities = activities.sort(compareDates);
                for(let i = 0; i < activities.length; i++){
                    if(activities[i].data.date >= currentDate && activities[i].data.date <= endDate){
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

    /**
     * Pre:---
     * Post: This function gets our array of activities as a parameter, creates a card for each of them, and it saves said card in
     * an array that will be later on drawn.
     */
    const PushCard = (activity) => {
        const cardToAdd = (
            <div className="card" style={{borderRadius: "15%"}}>
                <h1 className='card-title' style={{color: "green", fontSize: "xx-large", textAlign: "center"}}>{activity.name}</h1>
                <p className='card-content' style={{ fontSize: "x-large", textAlign: "center"}}>{activity.description}</p>
                <p className='class-footer' style={{ fontSize: "large", textAlign: "center"}}>{activity.date}</p>
            </div>
        );
        setCards(cards => [...cards, cardToAdd]);
    }
    const getActivitiesByDate = async(e) => {
        e.preventDefault(e);
        //We empty the array of cards
        setCards([]);
        try{ 
            let participations = await axios.post("/getUserParticipations", {
                nameToSearch: user.name,
            })
            let activities = [];
            for(let i = 0; i < participations.data.length; i++ ){
                let activity = await axios.post("/findActivityById", {
                    id: participations.data[i].activityId,
                })
                activities[i] = activity;
            }
            activities = activities.sort(compareDates);
            for(let i = 0; i < activities.length; i++){
                if(activities[i].data.date >= dateInit && activities[i].data.date <= dateEnd){
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
    function compareDates(a , b){
        return new Date(a.date) - new Date(b.date);
    }
    const showEmailForm = () => {
        if(showChangePassword) setShowChangePassword(false);
        setShowChangeEmail(!showChangeEmail);
    }
    const showPasswordForm = () => {
        if(showChangeEmail) setShowChangeEmail(false);
        setShowChangePassword(!showChangePassword);
    }

    const ChangeEmail = async(e) => {
        e.preventDefault(e);
        try{
            await axios.post("/changeEmail", {
                email: user.email,
                newEmail: newEmail,
            }).then((response) => {
                alert(response.data.msg);
                navigate("/dashboard", { state: { user: { ...user, email: newEmail } } });
            })
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    } 
    const ChangePassword = async(e) => {
        e.preventDefault(e);
        try{
            await axios.post("/changePassword", {
                oldPw: user.password,
                newPw: newPassword,
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
    const goToList = () => {
        navigate("/listOfActivities", {state:{ user: user}});
    }
    return(  
        <section>
            
            <div className="columns is-centered is-variable"  style={{zIndex: "1000"}}>     
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
                    </div>
                </div>
                <div className="content">
                    <div className="buttons are-small">
                    <button className="button is-primary is-outlined" onClick={showEmailForm}>
                        Cambiar Email</button>
                    {showChangeEmail && (
                        <form onSubmit={ChangeEmail} style={{ position: "absolute", marginTop: "20em" }}> 
                            <div className="field" >
                                <label className="label">Email</label>
                                <div className="control">
                                <input className="input" type="email" placeholder="Nuevo Email"  value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
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
                        <form onSubmit={ChangePassword} style={{ position: "absolute", marginTop: "20em" }}> 
                            <div className="field" >
                                <label className="label">Contraseña</label>
                                <div className="control">
                                <input className="input" type="password" placeholder="Nueva Contraseña"  value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
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
        <div className="columns is-centered" style={{marginTop: "0%", width: "100%",  border: "1px solid black"}}>
            Buscar Actividad Por Fecha:
            <form onSubmit={getActivitiesByDate}>
        <div className="columns" style={{paddingLeft: "4vh"}}>
        <div className="column is-half">
            <input className="input is-primary" type="date" placeholder="dateInit" value={dateInit} onChange={(e) => setDateInit(e.target.value)}/>
        </div>
        <div className="column is-half">
            <input className="input is-primary" type="date" placeholder="dateEnd" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)}/>
        </div>
        </div> 
        <button className="button is-primary" type="submit">Buscar</button>
    </form>
        </div>
        <div className="card-grid expand is-mobile" style={{ display: "grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap: "10px"}}>
        {cards.map((card, index) => <div key={index} className="card" style={{width: "100%", gap: "10%", display:"in-line"}}>{card}</div>)}
        </div>
    </section> 
    )
}

export default Dashboard;