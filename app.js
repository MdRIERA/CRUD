const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let usuarios = [
  { id: 1, nombre: 'Ryu', edad: 32, lugarProcedencia: 'Japón' },
  { id: 2, nombre: 'Chun-Li', edad: 29, lugarProcedencia: 'China' },
  { id: 3, nombre: 'Guile', edad: 35, lugarProcedencia: 'Estados Unidos' },
  { id: 4, nombre: 'Dhalsim', edad: 45, lugarProcedencia: 'India' },
  { id: 5, nombre: 'Blanka', edad: 32, lugarProcedencia: 'Brasil' },
];

//CREATE
app.get('/usuarios/nuevo', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Nuevo usuario</title>
    </head>
    <body>

      <h1>Crear nuevo usuario</h1>

      <form action="/usuarios" method="POST">
        <label>Nombre:</label>
        <input type="text" name="nombre" required>
        <br><br>

        <label>Edad:</label>
        <input type="number" name="edad" required>
        <br><br>

        <label>Lugar de procedencia:</label>
        <input type="text" name="lugarProcedencia" required>
        <br><br>

        <button type="submit">Crear usuario</button>
      </form>

      <a href="/">Volver al inicio</a>

    </body>
    </html>
  `);
});

app.post('/usuarios', (req, res) => {
  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre: req.body.nombre,
    edad: Number(req.body.edad),
    lugarProcedencia: req.body.lugarProcedencia
  };

  usuarios.push(nuevoUsuario);
  res.redirect('/usuarios');
});

//READ
app.get('/usuarios', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Lista de usuarios</title>
    </head>
    <body>

      <h1>Lista de usuarios</h1>

      <ul>
        ${usuarios.map(usuario => `
          <li>
            ID: ${usuario.id} |
            Nombre: ${usuario.nombre} |
            Edad: ${usuario.edad} |
            Procedencia: ${usuario.lugarProcedencia}
          </li>
        `).join('')}
      </ul>

      <a href="/">Volver al inicio</a>

    </body>
    </html>
  `);
});

app.get('/usuarios/buscar', (req, res) => {
  const nombreBuscado = req.query.nombre;
  if (!nombreBuscado) {
    return res.send(`
      <h1>Buscar usuario por nombre</h1>
      <form method="GET">
        <input type="text" name="nombre" required>
        <button type="submit">Buscar</button>
      </form>
      <a href="/">Volver</a>
    `);
  }

  const usuario = usuarios.find(
    u => u.nombre.toLowerCase() === nombreBuscado.toLowerCase()
  );

  if (!usuario) {
    return res.send(`
      <h1>Usuario no encontrado</h1>
      <p>No existe un usuario con nombre "${nombreBuscado}"</p>
      <a href="/usuarios/buscar">Volver a buscar</a>
    `);
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Resultado búsqueda</title>
    </head>
    <body>

      <h1>Usuario encontrado</h1>

      <ul>
        <li>ID: ${usuario.id}</li>
        <li>Nombre: ${usuario.nombre}</li>
        <li>Edad: ${usuario.edad}</li>
        <li>Lugar de procedencia: ${usuario.lugarProcedencia}</li>
      </ul>

      <a href="/usuarios/buscar">Buscar otro</a><br>
      <a href="/">Volver al inicio</a>

    </body>
    </html>
  `);
});
//UPDATE
app.get('/usuarios/actualizar', (req, res) => {
  const nombreBuscado = req.query.nombre;

  
  if (!nombreBuscado) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="UTF-8"><title>Actualizar usuario</title></head>
      <body>
        <h1>Actualizar usuario por nombre</h1>

        <form method="GET" action="/usuarios/actualizar">
          <label>Nombre del usuario:</label>
          <input type="text" name="nombre" required>
          <button type="submit">Buscar</button>
        </form>

        <a href="/">Volver al inicio</a>
      </body>
      </html>
    `);
  }

  const usuario = usuarios.find(
    u => u.nombre.toLowerCase() === nombreBuscado.toLowerCase()
  );

  if (!usuario) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="UTF-8"><title>No encontrado</title></head>
      <body>
        <h1>Usuario no encontrado</h1>
        <p>No existe un usuario con nombre "${nombreBuscado}".</p>
        <a href="/usuarios/actualizar">Volver</a>
      </body>
      </html>
    `);
  }


  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><title>Actualizar usuario</title></head>
    <body>
      <h1>Actualizar: ${usuario.nombre}</h1>

      <form method="POST" action="/usuarios/actualizar">
        <input type="hidden" name="nombre" value="${usuario.nombre}">

        <label>Nueva edad:</label>
        <input type="number" name="edad" value="${usuario.edad}" required>
        <br><br>

        <label>Nuevo lugar de procedencia:</label>
        <input type="text" name="lugarProcedencia" value="${usuario.lugarProcedencia}" required>
        <br><br>

        <button type="submit">Guardar cambios</button>
      </form>

      <a href="/usuarios">Volver a la lista</a><br>
      <a href="/">Volver al inicio</a>
    </body>
    </html>
  `);
});

app.post('/usuarios/actualizar', (req, res) => {
  const { nombre, edad, lugarProcedencia } = req.body;

  const usuario = usuarios.find(
    u => u.nombre.toLowerCase() === nombre.toLowerCase()
  );

  if (!usuario) {
    return res.send(`
      <h1>Error</h1>
      <p>No se encontró el usuario para actualizar.</p>
      <a href="/usuarios/actualizar">Volver</a>
    `);
  }

  usuario.edad = Number(edad);
  usuario.lugarProcedencia = lugarProcedencia;

  res.redirect('/usuarios');
});

//DELETE
app.get('/usuarios/borrar', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Borrar usuario</title>
    </head>
    <body>

      <h1>Borrar usuario por nombre</h1>

      <form action="/usuarios/borrar" method="POST">
        <label>Nombre del usuario:</label>
        <input type="text" name="nombre" required>
        <button type="submit">Borrar usuario</button>
      </form>

      <a href="/">Volver al inicio</a>

    </body>
    </html>
  `);
});



app.post('/usuarios/borrar', (req, res) => {
  const nombreBuscado = req.body.nombre;

  const index = usuarios.findIndex(
    u => u.nombre.toLowerCase() === nombreBuscado.toLowerCase()
  );

  if (index === -1) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="UTF-8"><title>No encontrado</title></head>
      <body>
        <h1>Usuario no encontrado</h1>
        <p>No existe un usuario con nombre "${nombreBuscado}".</p>
        <a href="/usuarios/borrar">Volver</a>
      </body>
      </html>
    `);
  }

  usuarios.splice(index, 1);

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><title>Borrado</title></head>
    <body>
      <h1>Usuario borrado correctamente</h1>
      <p>El usuario "${nombreBuscado}" ha sido eliminado.</p>
      <a href="/usuarios">Ver lista de usuarios</a><br>
      <a href="/">Volver al inicio</a>
    </body>
    </html>
  `);
});





app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Inicio</title>
    </head>
    <body>
      <h1>Gestión de Usuarios</h1>

      <ul>
        <li><a href="/usuarios">Ver lista de usuarios</a></li>
        <li><a href="/usuarios/nuevo">Crear nuevo usuario</a></li>
        <li><a href="/usuarios/buscar">Buscar usuario por nombre</a></li>
        <li><a href="/usuarios/actualizar">Actualizar usuario por nombre</a></li>
        <li><a href="/usuarios/borrar">Borrar usuario por nombre</a></li>
      </ul>
    </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log('Servidor arrancado en http://localhost:3000');
});
