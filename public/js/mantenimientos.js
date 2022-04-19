var idMantenimiento;
var objAnotacionTemp = {};

$(document).ready(function () {
    $('#formMantenimientos').submit(e => {
        e.preventDefault();
        var accion = (e.originalEvent.submitter).getAttribute("data-action");
        if (accion === 'guardar') {
            var objMantenimiento = generarObjMantenimiento();
            actualizarMantenimiento(objMantenimiento);
        };
    });
});

const getMantenimientosRealizados = () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/forge/mantenimientos/realizado?realizado=true',
            processData: false,
            contentType: 'application/json',
            type: 'GET',
            success: function (res) {
                $('.listaMantenimientosRealizados').empty();
                var anotacionesOrdenadas = res.data.reverse();
                anotacionesOrdenadas.sort(function (a, b) {
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return new Date(b.fechaRealizado) - new Date(a.fechaRealizado);
                });
                anotacionesOrdenadas.forEach(element => {
                    $('.listaMantenimientosRealizados').append(`<div class="contenedorDetalle"><li class="elementoAnotacionRealizada" onclick="detalleMantenimientoRealizado('${element._id}')" data-id="${element._id}"> <img src="./img/time.png" width="12" height="12">
                    ${moment(element.fechaRealizado).format('DD/MM/YYYY HH:mm')} <img src="./img/tag.png" class="tagImg" width="12" height="12"> ${element.titulo}</li></div>`);
                });
                resolve();
            },
            error: function (err) {
                reject(err);
            },
        });
    });
};

const getMantenimientosSinRealizar = () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/forge/mantenimientos/realizado?realizado=false',
            processData: false,
            contentType: 'application/json',
            type: 'GET',
            success: function (res) {
                $('.listaMantenimientosSinRealizar').empty();
                var anotacionesOrdenadas = res.data.reverse();
                anotacionesOrdenadas.forEach(element => {
                    $('.listaMantenimientosSinRealizar').append(`<div class="contenedorDetalle"><li class="elementoAnotacion" onclick="realizarMantenimiento('${element._id}')" data-id="${element._id}"><img src="./img/tag.png" width="12" height="12"> ${element.titulo}</li></div>`);
                });
                resolve();
            },
            error: function (err) {
                reject(err);
            },
        });
    });
};

const detalleMantenimientoRealizado = (id) => {
    detalleMantenimiento(id).then(data => {
        panelGraficoMantenimientoRealizado();
        rellenarModalMantenimiento(data.titulo, data.fechaRealizado, data.usuario, data.descripcion, data.observaciones);
        viewer.isolate(data.elementos);
        viewer.fitToView();
    });
    // $("#ex1").modalJ({
    //     fadeDuration: 350
    // });
}

const pruebaBla = () => {
    $("#ex1").modalJ({
        fadeDuration: 350
    });
}

const realizarMantenimiento = (id) => {
    idMantenimiento = id;
    // $("#realizarMantenimientoModal").modalJ({
    //     fadeDuration: 350
    // })
    panelGraficoMantenimiento();
    detalleMantenimiento(id).then(data => {
        rellenarModalRealizarMantenimiento(data.titulo, data.usuario, data.descripcion, data.observaciones);
        viewer.isolate(data.elementos);
        viewer.fitToView();
    });
}

const detalleMantenimiento = (id) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/forge/mantenimientos/id/' + id,
            processData: false,
            contentType: 'application/json',
            type: 'GET',
            success: function (res) {
                resolve(res.data);
            },
            error: function (err) {
                reject(err);
            },
        });
    });
};

const getInstalaciones = () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/forge/instalaciones',
            processData: false,
            contentType: 'application/json',
            type: 'GET',
            success: function (res) {
                var anotacionesOrdenadas = res.data.reverse();
                anotacionesOrdenadas.forEach(element => {
                    $('.listaInstalacionesMantener').append(`<div class="contenedorDetalle"><li class="elementoInstalacion" onclick="detalleInstalacion('${element._id}')" data-id="${element._id}">${element.nombre}</li></div>`);
                });
                resolve();
            },
            error: function (err) {
                reject(err);
            },
        });
    });
};

const detalleInstalacion = (id) => {
    getInstalacionDetalle(id).then(data => {
        console.log(data);
        panelGraficoInstalaciones(data.nombre, data.rutaPlano);
        rellenarDetallesInstalacion(data);
        viewer.isolate(data.elementos);
        viewer.fitToView();
    });
}

const getInstalacionDetalle = (id) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/forge/instalaciones/id/' + id,
            processData: false,
            contentType: 'application/json',
            type: 'GET',
            success: function (res) {
                resolve(res.data);
            },
            error: function (err) {
                reject(err);
            },
        });
    });
};

const rellenarDetallesInstalacion = (datosInstalacion) => {
    $('#fabricanteInstalacion').text(datosInstalacion.fabricante);
    $('#referenciaInstalacion').text(datosInstalacion.referencia);
    $('#emplazamientoInstalacion').text(datosInstalacion.emplazamiento);
    $('#descripcionInstalacion').text(datosInstalacion.descripcion);
}

const rellenarModalMantenimiento = (titulo, fechaHora, autor, tarea, observaciones) => {
    $('#tituloMantenimiento').text(titulo);
    $('#fechaHoraMantenimiento').text(moment(fechaHora).format("DD/MM/YYYY HH:mm"));
    $('#mantenimientoRealizadoPor').text(autor);
    $('#mantenimientoTarea').text(tarea);
    $('#mantenimientoObservaciones').text(observaciones);
};

const rellenarModalRealizarMantenimiento = (titulo, usuario, tarea, observaciones) => {
    $('#mantenimientoFormTitulo').val(titulo);
    $('#mantenimientoFormAsignado').val(usuario);
    $('#mantenimientoFormUsuario').val(usuario);
    $('#mantenimientoFormDescripcion').val(tarea);
    $('#mantenimientoFormObservaciones').val(observaciones);
}

const guardarAnotacion = (objAnotacion) => {
    $.ajax({
        url: '/api/forge/anotaciones/crear',
        data: JSON.stringify(objAnotacion),
        processData: false,
        contentType: 'application/json',
        type: 'POST',
        success: function (res) {
            toastr.success('Anotación guardada con éxito', '', {
                tapToDismiss: true,
                toastClass: 'toast',
                containerId: 'toast-container',
                debug: false,
                showMethod: 'fadeIn',
                showDuration: 300,
                hideMethod: 'fadeOut',
                hideDuration: 1000,
                hideEasing: 'swing',
                extendedTimeOut: 3500,
                positionClass: 'toast-bottom-left',
                timeOut: 3000,
                titleClass: 'toast-title',
                messageClass: 'toast-message',
                target: 'body',
                newestOnTop: true,
            });
            $("#gestionAnotacionesContainer").slideToggle(500);
            $(".elementoAnotacion").removeClass('elementoAnotacionSeleccionado');
            $("#btnCancelarAnotacion").hide();
            $("#btnGuardarAnotacion").hide();
            $("#btnModificarAnotacion").hide();
            $("#btnEditarAnotacion").show();
            $("#formAnotaciones input").prop("disabled", true);
            $("#formAnotaciones textarea").prop("disabled", true);
            viewer.isolate(0);
            viewer.fitToView();
            viewer.select();
            getAllAnotaciones();
        },
        error: function (err) {
            console.error(err);
        }
    });
};

const actualizarMantenimiento = () => {
    var objMantenimiento = generarObjMantenimiento();
    $.ajax({
        url: '/api/forge/mantenimientos/modificar/' + idMantenimiento,
        data: JSON.stringify(objMantenimiento),
        processData: false,
        contentType: 'application/json',
        type: 'PATCH',
        success: function (res) {
            viewer.isolate(0);
            viewer.fitToView();
            getMantenimientosRealizados();
            getMantenimientosSinRealizar();
            notificacionExito();
            cerrarPanelGraficoMantenimiento();
        },
        error: function (err) {
            console.error(err);
        },
    });
};

const generarObjMantenimiento = () => {
    var objMantenimiento = {};
    objMantenimiento.usuario = $('#mantenimientoFormUsuario').val();
    objMantenimiento.observaciones = $("#mantenimientoFormObservaciones").val();
    objMantenimiento.realizado = true;
    objMantenimiento.fechaRealizado = new Date().getTime();
    return objMantenimiento;
};

const notificacionExito = () => {
    toastr.success('Mantenimiento guardado con éxito', '', {
        tapToDismiss: true,
        toastClass: 'toast',
        containerId: 'toast-container',
        debug: false,
        showMethod: 'fadeIn',
        showDuration: 300,
        hideMethod: 'fadeOut',
        hideDuration: 1000,
        hideEasing: 'swing',
        extendedTimeOut: 3500,
        positionClass: 'toast-bottom-left',
        timeOut: 3000,
        titleClass: 'toast-title',
        messageClass: 'toast-message',
        target: 'body',
        newestOnTop: true,
    });
}

//TODO -> Ventana grafica panel gestion
        // Ventana grafica con un plano y otra con foto