import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
return (
        <nav className="navbar navbar-expand is-fixed-top" role="navigation" aria-label="main navigation" style={{zIndex: "0"}}>
            

        <div className="navbar-menu">
            <div className="navbar-start">
                <a className="navbar-item" href="/">
                    Login
                </a>
                <a className="navbar-item"  style={{marginLeft: "50%"}} href="/registerAcc">
                    Register
                </a>
            </div>    
            </div>
        </nav>
    );
}

export default Navbar;