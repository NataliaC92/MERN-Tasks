const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    /* revisamos si hay errores */
    const errores = validationResult(req);// en caso de existir errores los va a devolver con req como un array

    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array() });
    }

    /* extraer email y password del req  */
    const { email, password } = req.body;

    try {
       /* revisar que exista usuario con email que se coloca */ 
       let usuario = await Usuario.findOne({ email });

       /* si usuario no existe */
       if(!usuario) {
           return res.status(400).json({msg: 'El usuario o el Password no existe'});
       }

       /* si se cumple la condicion del email ahora revisamos el password */
       const passCorrecto = await bcryptjs.compare(password, usuario.password);

       if(!passCorrecto){
           return res.status(400).json({msg: 'Password incorrecto'})
       }

       /* si todo es correcto, creamos el JWT */

       /* crear y firmar el JWT */
       const payload = {
            usuario: {
                id: usuario.id
            }
        };

        /* firmar el JWT */
        jwt.sign(payload, process.env.SECRETA, {
            /* configuramos cuanto va a durar el token */
            expiresIn: 3600
        }, (error, token) => {
            if(error) throw error;

            /* mensaje de confirmacion */
            res.json({ token });
        });


    } catch (error) {
        console.log(error);
    }

}

// obtiene que usuario se encuentra autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        //con select.(-password) le indicamos a moongos que no queremos que nos pase el password
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}