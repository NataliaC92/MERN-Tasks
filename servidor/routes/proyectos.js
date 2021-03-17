const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');


/* crear un proyectos */
// api/proyectos  aqui lo enviamos
router.post('/', 
    /* primero sacamos el auth */
    /* el programa en primer lugar va a al middleware de auth, lo verifica y una vez que ejecuta lo que tenemos en el mismo pasa al
    siguiente middleware */
    auth,
    [
        check('name', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    //crearProyecto es lo que se va a ejecutar cuando se envie el post a proyectoController
    proyectoController.crearProyecto    
)

/* obtener todo los proyectos */
router.get('/', 
    /* este valida si hay un token en el header, tal como se debio colocar anteriormente si existiera el token */
    auth,
    proyectoController.obtenerProyectos    
)
/* actualizar proyectos via ID*/
router.put('/:id', 
    auth,
    [
        check('name', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
)

/* eliminar proyecto */
router.delete('/:id', 
    auth,
    proyectoController.eliminarProyecto
)


module.exports = router;