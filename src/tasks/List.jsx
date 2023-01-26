import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { taskService } from '@/_services';


function List({ match }) {
    const { path } = match;
    const [tasks, setTasks] = useState(null);
    const [tasksOriginal, setTasksOriginal] = useState(null);


    useEffect(() => {
        taskService.getAll().then((x) => {
            setTasks(x)
            setTasksOriginal(x)
        });
    }, []);

    function deleteTask(id) {
        setTasks(tasks.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        taskService.delete(id).then(() => {
            setTasks(tasks => tasks.filter(x => x.id !== id));

        });
    }

    const handleChange = (event) => {
        setTasks(tasksOriginal.filter((t) => {
            return t.name.toString().includes(event.target.value)
        }));
    };

    const handleChangeCheckbox = (event) => {
        console.log('event.target.value', event.target.value)
        setTasks(tasksOriginal.filter((t) => {
            return t.completed.toString().includes(event.target.value)
        }));
    };

    return (
        <div>

            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Agregar tarea</Link>
            <div className="form-row">
                <div className="form-group col-5">
                    <label>Filtrar por nombre</label>
                    <input name="name" type="text" className={`form-control`} onChange={handleChange} />
                </div>
                <div className="form-group col-5">
                    <label>Filtrar por estado</label>
                    <select className={`form-control`} name="select" onChange={handleChangeCheckbox}>
                        <option value="">Todos</option>
                        <option value="true">Completadas</option>
                        <option value="false">No completadas</option>
                    </select>
                </div>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>Nombre de la tarea</th>
                        <th style={{ width: '30%' }}>Completada?</th>
                        <th style={{ width: '30%' }}>Fecha de creacion</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {tasks && tasks.map(task =>
                        <tr key={task.id}>
                            <td>{task.name} </td>
                            {task.completed && <td>  <span>Completado</span>  </td>}
                            {!task.completed && <td>  <span>Incompleto</span>  </td>}
                            <td>{Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(task.createdAt))}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${path}/edit/${task.id}`} className="btn btn-sm btn-primary mr-1">Editar</Link>
                                <button onClick={() => deleteTask(task.id)} className="btn btn-sm btn-danger btn-delete-task" disabled={task.isDeleting}>
                                    {task.isDeleting
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Eliminar</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!tasks &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="spinner-border spinner-border-lg align-center"></div>
                            </td>
                        </tr>
                    }
                    {tasks && !tasks.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">No hay tareas que mostrar</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

export { List };