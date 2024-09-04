import React from 'react'

export default function Footer() {
    return (
        <div className="container my-5">
            <footer className="text-center text-lg-start ">
                <div className="container d-flex justify-content-center py-5">
                    <button type="button" className="btn btn-primary btn-lg btn-floating mx-2">
                       {/*  <i className="fab fa-facebook-f"></i> */}
                    </button>
                    <button type="button" className="btn btn-primary btn-lg btn-floating mx-2" >
                        {/* <i className="fab fa-youtube"></i> */}
                    </button>
                    <button type="button" className="btn btn-primary btn-lg btn-floating mx-2" >
                        <i className="fab fa-instagram"></i>
                    </button>
                    <button type="button" className="btn btn-primary btn-lg btn-floating mx-2" >
                       {/*  <i className="fab fa-twitter"></i> */}
                    </button>
                </div>
                <div className="text-center text-black p-3">
                    © 2020 Copyright:
                    <a className="text-black" href="https://mdbootstrap.com/">MDBootstrap.com</a>
                </div>
            </footer>
        </div>
    )
}
