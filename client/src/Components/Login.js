import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const Accountless = () => {
        navigate("/registerAcc");
    }
    const Auth = async (e) => {
        e.preventDefault();
        let res;
        let userX;
        try {
            await axios.post('/logIn', {
                email: email,
                password: password
            }).then((response) => {
                alert(response.data.msg);
                res = response.data.msg;
                userX = response.data.emailUser;
            });
            if(res === "¡Datos Correctos, Bienvenido!"){
            navigate("/dashboard", {state: { user: userX }});
            }
            //navigate("/registerAcc");
            
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }

    return (
        <section className="hero has-background-grey-light is-fullheight is-fullwidth" style={{paddingBottom: "5em"}}>
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4-desktop">
                            <form onSubmit={Auth} className="box">
                                <div className="field mt-5 has-text-centered">
                                    <p className="has-text-centered" style={{ fontSize: 45 }}>PlenaInclusión</p>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Email</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder="Email/Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Password</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <button className="button is-success is-fullwidth">Login</button>
                                </div>
                                <div className="field mt-5 has-text-centered">
                                <p onClick={Accountless}>¿No tienes cuenta?</p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
    )
}

export default Login