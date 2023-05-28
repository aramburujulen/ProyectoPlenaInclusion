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
        let token;
        try {
            await axios.post('/logIn', {
                email: email,
                password: password
            }).then((response) => {
                alert(response.data.msg);
                res = response.data;
                userX = response.data.emailUser;
                token = res.accessToken;
            });
            if(res.msg === "¡Datos Correctos, Bienvenido!"){
                localStorage.setItem('accessToken', token);
                navigate('/dashboard')
            }
            
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }

    return (
        <section className="hero has-background-light is-fullheight is-fullwidth" style={{paddingBottom: "5em"}}>

            <div className="hero-body">

                <div className='columns is-centered is-vcentered is-responsive'>

                    <div className='column is-flex-desktop is-hidden-mobile'>
                        <img src='https://www.plenainclusion.org/wp-content/uploads/2021/04/Social-media-bro-1536x1536.png' class="img-fluid" style={{height:'100%  '}}></img>
                    </div>
                    <div className="column is-full-mobile is-centered is-responsive">
                        <form onSubmit={Auth} className="box">
                            <div className="field mt-5 has-text-centered">
                                <img src='https://www.plenainclusion.org/wp-content/uploads/2021/01/logo_plena-inclusion.png' class="img-fluid"></img>
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
        </section>
        
    )
}

export default Login