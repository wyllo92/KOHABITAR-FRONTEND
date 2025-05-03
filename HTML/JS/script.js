document.addEventListener("DOMContentLoaded", function () {
    console.log("script.js cargado correctamente");

    const tablaPropietarios = document.querySelector("#tablaPropietarios tbody");
    const tablaResidentes = document.querySelector("#tablaResidentes tbody");

    const modalEditarEl = document.getElementById("modalEditarVehiculo");
    const modalEditar = modalEditarEl ? new bootstrap.Modal(modalEditarEl) : null;

    const formEditar = document.getElementById("formEditarVehiculo");

    const inputEditarNombre = document.getElementById("editarNombre");
    const inputEditarPlaca = document.getElementById("editarPlaca");
    const selectEditarTipo = document.getElementById("editarTipo");
    const selectEditarEstadoAprobacion = document.getElementById("editarEstadoAprobacion");
    const selectEditarEstado = document.getElementById("editarEstado");

    let vehiculoEditando = null;

    function guardarDatosLocalStorage() {
        const propietarios = obtenerDatosDeTabla(tablaPropietarios);
        const residentes = obtenerDatosDeTabla(tablaResidentes);
        localStorage.setItem("vehiculosPropietarios", JSON.stringify(propietarios));
        localStorage.setItem("vehiculosResidentes", JSON.stringify(residentes));
    }

    function obtenerDatosDeTabla(tabla) {
        const datos = [];
        tabla.querySelectorAll("tr").forEach(fila => {
            const celdas = fila.getElementsByTagName("td");
            datos.push({
                nombre: celdas[0].innerText,
                placa: celdas[1].innerText,
                tipo: celdas[2].innerText,
                estadoAprobacion: celdas[3].innerText,
                estado: celdas[4].innerText
            });
        });
        return datos;
    }

    function cargarDatosDesdeLocalStorage() {
        const propietariosGuardados = JSON.parse(localStorage.getItem("vehiculosPropietarios")) || [];
        const residentesGuardados = JSON.parse(localStorage.getItem("vehiculosResidentes")) || [];

        propietariosGuardados.forEach(vehiculo => agregarFila(tablaPropietarios, vehiculo));
        residentesGuardados.forEach(vehiculo => agregarFila(tablaResidentes, vehiculo));
    }

    function agregarFila(tabla, vehiculo) {
        const id = Date.now();
        const nuevaFila = document.createElement("tr");
        nuevaFila.innerHTML = `
            <td>${vehiculo.nombre}</td>
            <td>${vehiculo.placa}</td>
            <td>${vehiculo.tipo}</td>
            <td>${vehiculo.estadoAprobacion}</td>
            <td>${vehiculo.estado}</td>
            <td>
                <button class="btn btn-warning btn-sm editarVehiculo" data-id="${id}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm eliminarVehiculo" data-id="${id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tabla.appendChild(nuevaFila);
        agregarEventosBotones(nuevaFila);
    }

    function agregarVehiculo(tabla, tipo) {
        const nombre = document.getElementById(`nombre${tipo}`).value.trim();
        const placa = document.getElementById(`placa${tipo}`).value.trim();
        const tipoVehiculo = document.getElementById(`tipo${tipo}`).value;
        const estadoAprobacion = document.getElementById(`estadoAprobacion${tipo}`).value;
        const estado = document.getElementById(`estado${tipo}`).value;

        if (!nombre || !placa) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        const vehiculo = { nombre, placa, tipo: tipoVehiculo, estadoAprobacion, estado };
        agregarFila(tabla, vehiculo);
        guardarDatosLocalStorage();

        // Limpiar formulario
        document.getElementById(`formAgregar${tipo}`).reset();
    }

    function agregarEventosBotones(fila) {
        const btnEditar = fila.querySelector(".editarVehiculo");
        const btnEliminar = fila.querySelector(".eliminarVehiculo");

        if (btnEditar) {
            btnEditar.addEventListener("click", function () {
                vehiculoEditando = fila;
                const celdas = fila.getElementsByTagName("td");

                inputEditarNombre.value = celdas[0].innerText;
                inputEditarPlaca.value = celdas[1].innerText;
                selectEditarTipo.value = celdas[2].innerText;
                selectEditarEstadoAprobacion.value = celdas[3].innerText;
                selectEditarEstado.value = celdas[4].innerText;

                modalEditar.show();
            });
        }

        if (btnEliminar) {
            btnEliminar.addEventListener("click", function () {
                if (confirm("¿Seguro que deseas eliminar este vehículo?")) {
                    fila.remove();
                    guardarDatosLocalStorage();
                }
            });
        }
    }

    if (formEditar) {
        formEditar.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!vehiculoEditando) return;

            const celdas = vehiculoEditando.getElementsByTagName("td");
            celdas[0].innerText = inputEditarNombre.value;
            celdas[1].innerText = inputEditarPlaca.value;
            celdas[2].innerText = selectEditarTipo.value;
            celdas[3].innerText = selectEditarEstadoAprobacion.value;
            celdas[4].innerText = selectEditarEstado.value;

            guardarDatosLocalStorage();
            modalEditar.hide();
        });
    }

    const formAgregarPropietario = document.getElementById("formAgregarPropietario");
    if (formAgregarPropietario) {
        formAgregarPropietario.addEventListener("submit", function (e) {
            e.preventDefault();
            agregarVehiculo(tablaPropietarios, "Propietario");
        });
    }

    const formAgregarResidente = document.getElementById("formAgregarResidente");
    if (formAgregarResidente) {
        formAgregarResidente.addEventListener("submit", function (e) {
            e.preventDefault();
            agregarVehiculo(tablaResidentes, "Residente");
        });
    }

    cargarDatosDesdeLocalStorage();
});
