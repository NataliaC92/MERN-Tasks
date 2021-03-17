const Proyecto = require('../models/Proyecto');
const { validationResult } =  require('express-validator');

exports.crearProyecto = async (req, res) => {

    /* revisar si hay errores (validar proyecto) */
    const errores = validationResult(req);//validationResult coloca en este arreglo los errores en caso de existir
    if(!errores.isEmpty()) return res.status(400).json( {errores: errores.array() })

    try {
        /* crear un nuevo proyecto */    
        const proyecto = new Proyecto(req.body);

        /* guardar creador del proyecto por JWT */
        proyecto.creador = req.usuario.id

        /* guardar proyecto */
        proyecto.save();//guardar el nuevo proyecto que creamos
        res.json({ proyecto });//si es correcto vamos a pasar como res el json de proyectos


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

/* obtiene todo los proyectos del usuario actual */
exports.obtenerProyectos = async (req, res) => {
    try {
        // aqui estamos buscando en Proyecto de la base de datos y vamos a comparar el creador de cada proyecto con el req.usuario.id(es el id del usuario que vamos a seleccionar)
       const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 }); //sort es para cambiar el orden en el que aparecen en la respuesta
       
       res.json({ proyectos });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

/* actualizar un proyecto */
exports.actualizarProyecto = async (req, res) => {
    
    /* revisar si hay errores (validar proyecto) */
    const errores = validationResult(req);//validationResult coloca en este arreglo los errores en caso de existir
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array() })
    }

    /* extraer la informacion del proyecto */
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    /* actualizar proyecto */
    try {
        //primero revisamos ID
        let proyecto = await Proyecto.findById(req.params.id);

        //corroborar si el proyecto existe
        if(!proyecto){
            return res.status(404).json({msg:'Proyecto no encontrado'});
        }

        //verificar el creador del proyecto (para que solo el pueda mod el proyecto)
        if(proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({nsg: 'No autorizado'});
        }

        //actualizar el proyecto 
        proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id }, { $set: nuevoProyecto}, { new: true });

        res.json({proyecto});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }

}

/* eliminar proyecto por id */
exports.eliminarProyecto = async (req, res) => {
    try {
        //primero revisamos ID
        let proyecto = await Proyecto.findById(req.params.id);

        //corroborar si el proyecto existe
        if(!proyecto){
            return res.status(404).json({msg:'Proyecto no encontrado'});
        }

        //verificar el creador del proyecto (para que solo el pueda mod el proyecto)
        if(proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({nsg: 'No autorizado'});
        }

        //eliminar el proyecto
        await Proyecto.findOneAndRemove({ _id : req.params.id});
        res.json({ msg: 'Proyecto eliminado'});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
        
    }
}