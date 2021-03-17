/* rutas para crear usuarios */
const express =  require('express');//importamos expres
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');

/* crear un usuario */
// api/usuario  aqui lo enviamos
router.post('/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(), // aqui estamos revisandoque el nombre no eeste vacio
        check('email', 'Agregar email valido').isEmail(), // vorrobora que email sea un email
        check('password', ' El password debe ser minimo de 6 caracteres').isLength({min:6})
    ],
    usuarioController.crearUsuario
);

module.exports = router;
