import React from "react";
import { Link } from 'react-router-dom';
function Navbar() {
    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to={"/cg-contact/contact/list"} >
                    <i className="fa fa-phone-flip text-warning"></i>
                    <span className="text-primary fw-bolder mx-2">CodeGym</span>
                    Contact
                </Link>
            </div>
        </nav>
    )
}

export default Navbar;