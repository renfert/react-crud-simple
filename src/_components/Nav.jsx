import React from 'react';
import { NavLink } from 'react-router-dom';

function Nav() {
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav">
                <NavLink exact to="/" className="nav-item nav-link">Home</NavLink>
                <NavLink to="/tasks" className="nav-item nav-link">Tareas</NavLink>
                <NavLink to="/users" className="nav-item nav-link">Clientes</NavLink>
            </div>
        </nav>
    );
}

export { Nav };