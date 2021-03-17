const Tarea = require('../models/Tareas');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');


/* crear una nueva tarea */

exports.crearTarea = async (req, res) => {

    /* revisar si hay errores */
    const errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() })
    }

    
    
    /* extraer proyecto y comprobar si existe */
    try {
        const { proyecto } = req.body;
        
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        /* revisar si el proyecto actual pertenece al usuario autenticado */
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).send({ msg: 'No Autorizado'});
        }

        /* creamos la tarea */
        const tarea = new Tarea(req.body);

        await tarea.save(); // guardar la tarea
        res.json({ tarea }); // pasamos la tarea

        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

/* obtener las tareas por proyecto */
exports.obtenerTareas = async (req, res) => {

    try {
        /* extraer proyecto y comprobar si existe */
        const { proyecto } = req.query;

        //console.log(req.query);

        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        /* revisar si el proyecto actual pertenece al usuario autenticado */
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).send({ msg: 'No Autorizado'});
        }

        /* obtener las tareas por proyecto, para lo cual creamos un nuevo objeto donde se guardara toda la info de la nueva tarea */
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1}); // el sort es para indicar el orden en el cual van a aparecer las tareas, -1 las mas nuevas al principio
        res.json({ tareas }); // vamos a enviar as tareas por el json

    } catch (error) {
       console.log(error);
       res.status(500).send('Hubo un error');     
    }
     
}

/* actualizar tarea */

exports.actualizarTarea = async ( req, res) => {

    try {
        /* distroction para extraer la informacion */
        const { proyecto, nombre, estado } = req.body;
        
        
        /* revisar si la tarea existe o no */
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea) {
            return res.status(404).send('No existe esta Tarea');
        }
       
        /* extraer proyecto y comprobar si existe */
        const existeProyecto = await Proyecto.findById(proyecto);

        /* revisar si el proyecto actual pertenece al usuario autenticado */
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).send({ msg: 'No Autorizado'});
        }

        /* crear objet con la nueva informacion */
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;
        
        /* guardar la tarea */
        tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, {new: true});
        res.json({tarea});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.eliminarTarea = async (req, res) =>{
    try {
        /* distroction para extraer la informacion */
        const { proyecto } = req.query;
        
        
        /* revisar si la tarea existe o no */
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea) {
            return res.status(404).send('No existe esta Tarea');
        }
       
        /* extraer proyecto y comprobar si existe */
        const existeProyecto = await Proyecto.findById(proyecto);

        /* revisar si el proyecto actual pertenece al usuario autenticado */
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).send({ msg: 'No Autorizado'});
        }
        /* if(existeProyecto.creator.toString() !== req.usuario.id) {
            return res.status(401).send({ msg: 'No Autorizado'});
        } */

        /* eliminar tarea */
        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({msg: 'Tarea eliminada'});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

