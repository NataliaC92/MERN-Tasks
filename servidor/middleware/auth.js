const jwt = require('jsonwebtoken'); // lo necesitamos porque debemos enviar el token y validar si pertenece a este proyecto

module.exports = function(req, res, next) {
    /* vamos a crear el middellwear */
    /* leer el token del header */
    const token = req.header('x-auth-token');

    /* revisar si no hay token */
    if(!token) {
        return res.status(401).json({msg: 'No hay Token, permiso no valido' })
    }

    /* validar el token */
    try {
        const cifrado = jwt.verify(token, process.env.SECRETA); //este metodo nos permite verificar el token - el primer parametro es el toekn y el segundo la palabra secreta que determinamos anteriormente
    
        req.usuario = cifrado.usuario;//agregamos un nuevo parametro en el req de usuario, el cifrado usuario que va a tener el id del usuario

        next(); // para que salga de este middleweare y continue con el siguiente
    } catch (error) {
        res.status(401).json({msg:"Token no valido"});
    }

}

