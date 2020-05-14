

const crearMensaje = (nombre, mensaje) => {

    return {
        nombre,
        mensaje,
        fecha: new Date().getTime()//obteniendo la hora actual
    }

}


module.exports = {
    crearMensaje
}