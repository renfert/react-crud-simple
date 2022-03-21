import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { userService } from '@/_services';

function List({ match }) {
    const { path } = match;
    const [users, setUsers ] = useState(null);
    const [average, setAverage] = useState("");

    useEffect(() => {
        userService.getAll().then(x => setUsers(x));
        userService.calculate().then(y => setAverage(y.message) );
    }, []);

    function deleteUser(id) {
        setUsers(users.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        userService.delete(id).then(() => {
            setUsers(users => users.filter(x => x.id !== id));
            userService.calculate().then(y => setAverage(y.message) );
        });
        
    }

    return (
        <div>
            <h1>Clientes</h1>
            <h3>Promedio de edades {average}</h3>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Agregar cliente</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>Nombre</th>
                        <th style={{ width: '30%' }}>Apellido</th>
                        <th style={{ width: '30%' }}>Fecha de nacimiento</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.map(user =>
                        <tr key={user.id}>
                            <td>{user.firstName} </td>
                            <td>{user.lastName}</td>
                            <td>{user.bornDate}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${path}/edit/${user.id}`} className="btn btn-sm btn-primary mr-1">Editar</Link>
                                <button onClick={() => deleteUser(user.id)} className="btn btn-sm btn-danger btn-delete-user" disabled={user.isDeleting}>
                                    {user.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Eliminar</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!users &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="spinner-border spinner-border-lg align-center"></div>
                            </td>
                        </tr>
                    }
                    {users && !users.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">No hay clientes que mostrar</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

export { List };