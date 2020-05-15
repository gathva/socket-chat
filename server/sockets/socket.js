const { io } = require('../server');

const { Usuarios } = require('../classes/usuarios');

const { crearMensaje } = require('../utilidades/utilidades');


const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback)=>{

        console.log(usuario);

        if(!usuario.nombre || !usuario.sala){

            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });

        }

        client.join(usuario.sala);//uniendo al usuario a la sala k viene en usuario

        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

        client.broadcast.to(usuario.sala).emit('listaPersona',usuarios.getPersonasPorSala(usuario.sala));
    
        client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensaje('Administrador',`${usuario.nombre} se unió`));

        callback(usuarios.getPersonasPorSala(usuario.sala));

        //console.log(personas);
    });

    client.on('crearMensaje', (data, callback)=>{

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);
    });

    client.on('disconnect',()=>{

        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador',`${personaBorrada.nombre} abandono la sala`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersona',usuarios.getPersonasPorSala(personaBorrada.sala));

    });
  
    //Mensajes Privados
    client.on('mensajePrivado', (data)=>{

        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre,data.mensaje));

    });


});

