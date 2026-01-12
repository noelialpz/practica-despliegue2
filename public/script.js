let alumnoEditando = null;

async function cargarAlumnos() {
  const res = await fetch("/alumnos");
  const alumnos = await res.json();

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  alumnos.forEach((a) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${a.nombre} - ${a.curso} - Nota: ${a.nota}
      <button onclick="editarAlumno(${a.id}, '${a.nombre}', '${a.curso}', ${a.nota})">
        Editar
      </button>
      <button onclick="eliminarAlumno(${a.id})">
        Eliminar
      </button>
    `;
    lista.appendChild(li);
  });
}

function editarAlumno(id, nombre, curso, nota) {
  document.getElementById("nombre").value = nombre;
  document.getElementById("curso").value = curso;
  document.getElementById("nota").value = nota;

  alumnoEditando = id;
}

async function crearAlumno() {
  const data = {
    nombre: nombre.value,
    curso: curso.value,
    nota: nota.value,
  };

  if (alumnoEditando) {
    // UPDATE
    await fetch(`/alumnos/${alumnoEditando}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    alumnoEditando = null;
  } else {
    // CREATE
    await fetch("/alumnos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  nombre.value = "";
  curso.value = "";
  nota.value = "";

  cargarAlumnos();
}

async function eliminarAlumno(id) {
  await fetch(`/alumnos/${id}`, {
    method: "DELETE",
  });

  cargarAlumnos();
}

cargarAlumnos();