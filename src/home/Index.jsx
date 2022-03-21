import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>React - CLIENTES CRUD </h1>         
            <p><Link to="users">&gt;&gt; Administrar Clientes</Link></p>
        </div>
    );
}

export { Home };