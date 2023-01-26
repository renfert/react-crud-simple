import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { taskService, alertService } from '@/_services';

function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;

    // form validation rules 
    const validationSchema = Yup.object().shape({

        name: Yup.string()
            .required('Nombre de la tarea es requerido'),
        completed: Yup.string()
            .required('Apellido es requerido')

    });

    // functions to build form returned by useForm() hook
    const { register, handleSubmit, reset, setValue, errors, formState } = useForm({
        resolver: yupResolver(validationSchema)
    });

    function onSubmit(data) {
        return isAddMode
            ? createTask(data)
            : updateTask(id, data);
    }

    function createTask(data) {
        return taskService.create(data)
            .then(() => {
                alertService.success('Tarea agregada', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(alertService.error);
    }

    function updateTask(id, data) {
        return taskService.update(id, data)
            .then(() => {
                alertService.success('Tarea actualizada', { keepAfterRouteChange: true });
                history.push('..');
            })
            .catch(alertService.error);
    }

    useEffect(() => {
        if (!isAddMode) {
            // get task and set form fields
            taskService.getById(id).then(task => {
                const fields = ['name', 'completed', 'bornDate'];
                fields.forEach(field => setValue(field, task[field]));
            });
        }
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
            <h1>{isAddMode ? 'Agregar Tarea' : 'Editar Tarea'}</h1>
            <div className="form-row">

                <div className="form-group col-5">
                    <label>Nombre</label>
                    <input name="name" type="text" ref={register} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.name?.message}</div>
                </div>

            </div>

            <div className="form-row">
                <div className="form-group col-5">
                    <label>Fue completada?</label>
                    <input name="completed" type="checkbox" ref={register} className={`form-control ${errors.completed ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.completed?.message}</div>
                </div>
            </div>


            <div className="form-group">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Guardar
                </button>
                <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancelar</Link>
            </div>
        </form>
    );
}

export { AddEdit };