import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const ListOfActivities = () => {
    const { state } = useLocation();
    const user = state.user;
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
    }, []);

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

    function compareDates(a , b){
        return new Date(a.date) - new Date(b.date);
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
                <button className="button is-primary" type="submit" onClick={goToDashboard}>Dashboard</button>
            </div>
            <div className="columns is-centered" style={{marginTop: "0%", width: "100%"}}>
                <form onSubmit={GetActivitiesByDate}>
                    <div className="columns">
                        <div className="column is-half">
                            <input className="input is-primary" type="date" placeholder="dateInit"  style={{ marginTop: "40%", paddingBottom: "10%"}} value={dateInit} onChange={(e) => setDateInit(e.target.value)}/>
                        </div>
                        <div className="column is-half">
                            <input className="input is-primary" type="date" placeholder="dateEnd" style={{ marginTop: "40%", paddingBottom: "10%" }} value={dateEnd} onChange={(e) => setDateEnd(e.target.value)}/>
                        </div>
                    </div> 
                    <button className="button is-primary" type="submit">Buscar</button>
                </form>
            </div>
            <div className="card-grid expand is-mobile" style={{ display: "grid", paddingBottom: "20em", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px"}}>
            {cards.map((card, index) => <div key={index} className="card" style={{width: "100%", gap: "10%", display:"in-line"}}>{card}</div>)}
            </div>
    </section> 
    )

}
export default ListOfActivities;