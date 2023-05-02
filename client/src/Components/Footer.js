import React from 'react'
const Footer = () => {
    return(
        <footer className="footer is-responsive" style={{ borderTop: '1px solid lightgray' , bottom: '0', width: '100%', height: '1px'} }>
        <div className="container">
          <div className="columns">
            <div className="column is-responsive">
              <p className="has-text-centered-touch has-text-left-desktop" style={{padding:"0", height: "10%"}}>
                © 2023 Plena Inclusión Inc. All rights reserved.
              </p>
            </div>
            <div className="column is-narrow is-responsive">
              <figure className="image is-128x128  is-inline-block">
                <img
                  src="https://planetafacil.plenainclusion.org/wp-content/uploads/2019/12/Plena-inclusi%C3%B3n.jpeg"
                  alt="Logo"
                />
              </figure>
            </div>
            <div className="column is-responsive">
              <div className="has-text-centered-touch has-text-right-desktop" style={{color: 'green'}}>
                Twitter:
                <div className="container">
                <figure className="image is-32x32  is-inline-block">
                    <a href="https://twitter.com/plenaaragon?lang=en">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1384/1384065.png"
                            alt="Twitter"
                        />
                    </a>
                </figure>

                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
 )
}

export default Footer;





