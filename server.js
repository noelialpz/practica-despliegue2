const express = require("express"); //crea servidor web
const sqlite3 = require("sqlite3").verbose(); //trabajar con sqlite + ayuda errores

const app = express(); //nuestro servidor
const PORT = process.env.PORT || 3000; 

app.use(express.json()); //recibir datos en forma de json
app.use(express.static("public")); //servir el frontend

const db = new sqlite3.Database("./database.db"); // conectar con database.db

db.run(`
  CREATE TABLE IF NOT EXISTS alumnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    curso TEXT,
    nota REAL
  )
`);

//Rutas crud: 

app.get("/alumnos", (req, res) => {
  db.all("SELECT * FROM alumnos", [], (err, rows) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(rows);
    }
  });
});

app.post("/alumnos", (req, res) => {
  const { nombre, curso, nota } = req.body;

  db.run(
    "INSERT INTO alumnos (nombre, curso, nota) VALUES (?, ?, ?)",
    [nombre, curso, nota],
    function (err) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(201).json({ id: this.lastID });
      }
    }
  );
});

app.put("/alumnos/:id", (req, res) => {
  const { nombre, curso, nota } = req.body;

  db.run(
    "UPDATE alumnos SET nombre = ?, curso = ?, nota = ? WHERE id = ?",
    [nombre, curso, nota, req.params.id],
    function (err) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.sendStatus(200);
      }
    }
  );
});

app.delete("/alumnos/:id", (req, res) => {
  db.run(
    "DELETE FROM alumnos WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.sendStatus(200);
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});