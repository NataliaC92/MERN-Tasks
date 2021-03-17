/* rutas para autenticar usuarios */
const express =  require('express');//importamos expres
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

/* Iniciar Sesion */

// api/auth  aqui lo enviamos
router.post('/', 
    authController.autenticarUsuario
);

//obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);

module.exports = router;
