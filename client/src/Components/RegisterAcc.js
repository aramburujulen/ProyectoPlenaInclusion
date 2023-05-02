import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const RegisterAcc = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [emailPro, setEmailPro] = useState('');
    const [namePro, setNamePro] = useState('');
    const [agePro, setAgePro] = useState('');
    const [disability, setDisability] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [availability, setAvailability] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setconfPassword] = useState('');
    const [msg, setMsg] = useState('');

    const navigate = useNavigate();

    const Register = async(e) => {
        e.preventDefault();
        try{
            await axios.post("/generateAccount", {
                email: email,
                name: name,
                age: age,
                notifications: true,
                disability: disability
            }).then((response) => {
                alert(response.data.msg);
            })
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }
    //email, name, age, specialization, availability, password, confPassword
    const RegisterPro = async(e) => {
        e.preventDefault();
        try{
            await axios.post("/registerProfessional", {
                email: emailPro,
                name: namePro,
                age: agePro,
                specialization: specialization,
                availability: availability,
                password: password,
                confPassword: confPassword
            }).then((response) => {
                alert(response.data.msg);
            })
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }
    return (
        <section className="hero has-background-grey-light is-fullheight is-fullwidth" style={{zIndex: "-99"}}>
            <div className="hero-body" style={{paddingBottom: "30%"}}>
                <div className="container">
                    <div className="columns">
                        <div className="column is-half">
                            <form onSubmit={Register} className="box">
                                <div className="field mt-5 has-text-centered">
                                    <p className="has-text-centered" style={{ fontSize: 45 }}>Registrar Participante</p>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Email</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder="Email/Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Nombre</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Edad</label>
                                    <div className="controls">
                                        <input type="number" className="input" placeholder="Edad" value={age} onChange={(e) => setAge(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Disabilidad</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder="Disabilidad" value={disability} onChange={(e) => setDisability(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <button className="button is-success is-fullwidth">Registrar Usuario</button>
                                </div>
                            </form>
                        </div>
                        <div className="column is-half">
                            <form onSubmit={RegisterPro} className="box">
                                <div className="field mt-5 has-text-centered">
                                    <p className="has-text-centered" style={{ fontSize: 45 }}>Registrar Professional</p>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Email</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder="Email/Correo" value={emailPro} onChange={(e) => setEmailPro(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Nombre</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder="Nombre" value={namePro} onChange={(e) => setNamePro(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Edad</label>
                                    <div className="controls">
                                        <input type="number" className="input" placeholder="Edad" value={agePro} onChange={(e) => setAgePro(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Especialidad</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder="Especialidad" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Disponibilidad</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder="Disponibilidad" value={availability} onChange={(e) => setAvailability(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Contraseña</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Repite la contraseña</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder="conPassword" value={confPassword} onChange={(e) => setconfPassword(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <button className="button is-success is-fullwidth">Registrar Professional</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
        </section>
        
    )
}
export default RegisterAcc;