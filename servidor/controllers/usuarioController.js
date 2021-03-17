const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


exports.crearUsuario = async (req, res) => {


    /* revisamos si hay errores */
    const errors = validationResult(req);// en caso de existir errores los va a devolver con req como un array

    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }


    /* extraer  */
    const { email, password } = req.body; 


    /* aqui es donde se envia lo que se ejecuta, es la peticion  */
    /* se recomienda utilizar try catch para los errores */

    try {
        //validar usuario unico
        let usuario = await Usuario.findOne({ email });//consulta si hay un usuario en la DB que tenga el email que nos envia el usuario en la consulta

        if(usuario){
            //si existe el usuario en la DB
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        /* crear nuevo usuario */
        usuario = new Usuario(req.body);

        /* Hashear el password */
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        /* guardar nuevo usuario */
        await usuario.save();// await porque la solicitud es async (asincrona)

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
            return;
        });

    } catch (error) {
        //imprimimos el error
        console.log(error);
        //enviamos respuesta 400, que diga Hubo un Error
        res.status(400).send('Hubo un Error');
    }
}