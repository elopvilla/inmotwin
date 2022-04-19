var _selectedAnotacion;
var objAnotacionTemp = {};

$(document).ready(function () {

    $('#formAnotaciones').submit(e => {
        e.preventDefault();
        var accion = (e.originalEvent.submitter).getAttribute("data-action");
        if (accion === 'guardar') {
            var objAnotacion = generarObjAnotacion();
            guardarAnotacion(objAnotacion);
        } else if (accion === 'actualizar') {
            var objAnotacion = {};
            objAnotacion.titulo = $("#tituloAnotacion").val();
            objAnotacion.usuario = $('#usuarioAnotacion').val();
            objAnotacion.prioridad = $('#prioridadAnotacion').val();
            objAnotacion.descripcion = $("#descripcionAnotacion").val();
            actualizarAnotacion(_selectedAnotacion, objAnotacion);
        } else if (accion === 'cancelar') {
            $("#formAnotaciones input").prop("disabled", true);
            $("#formAnotaciones textarea").prop("disabled", true);
            $("#btnCancelarAnotacion").hide();
            $("#btnModificarAnotacion").hide();
            $("#btnEditarAnotacion").show();
            rellenarFormulario(objAnotacionTemp);
        } else if (accion == 'activarEditar') {
            objAnotacionTemp = generarObjAnotacion();
            $("#formAnotaciones input").prop("disabled", false);
            $("#formAnotaciones textarea").prop("disabled", false);
            $("#btnCancelarAnotacion").show();
            $("#btnModificarAnotacion").show();
            $("#btnEditarAnotacion").hide();
        };
    });
});

const toCrearAnotacion = () => {
    $(".elementoAnotacion").removeClass('elementoAnotacionSeleccionado')
    $('#formAnotaciones').trigger("reset");
    _selectedAnotacion = 0;
    var estadoPanel = $('#gestionAnotacionesContainer').css('display');
    $("#cabeceraAnotacion").text("NUEVA ANOTACIÓN");
    $("#formAnotaciones input").prop("disabled", false);
    $("#formAnotaciones textarea").prop("disabled", false);
    $("#btnGuardarAnotacion").show();
    $("#btnCancelarAnotacion").hide();
    $("#btnModificarAnotacion").hide();
    $("#btnEditarAnotacion").hide();
    if (estadoPanel == 'none') {
        $("#gestionAnotacionesContainer").slideToggle(500);
    } else {
        viewer.isolate(0);
        viewer.fitToView();
        viewer.select();
    }
}

const getAllAnotaciones = () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/forge/anotaciones',
            processData: false,
            contentType: 'application/json',
            type: 'GET',
            success: function (res) {
                $('.listaAnotaciones').empty();
                var anotacionesOrdenadas = res.data.reverse();
                anotacionesOrdenadas.forEach(element => {
                    $('.listaAnotaciones').append(`<li class="elementoAnotacion" data-id="${element._id}" onclick="recuperarAnotacion('${element._id}', true)"> <img src="./img/time.png" width="12" height="12">
                    ${moment(element.creacion).format('DD/MM/YYYY HH:mm')} <img src="./img/tag.png" class="tagImg" width="12" height="12"> ${element.titulo}</li>`);
                });
                resolve();
            },
            error: function (err) {
                reject(err);
            },
        });
    });
};

const recuperarAnotacion = (id, animacion) => {
    $("#btnGuardarAnotacion").hide();
    if (id != _selectedAnotacion) {
        $("#cabeceraAnotacion").text("DETALLE ANOTACIÓN");
        if (animacion) {
            animacionAnotacion(id);
        };
        _selectedAnotacion = id;
        $.ajax({
            url: '/api/forge/anotaciones/' + id,
            processData: false,
            contentType: 'application/json',
            type: 'GET',
            success: function (res) {
                rellenarFormulario(res.data);
                viewer.isolate(res.data.elementos);
                viewer.fitToView();
            },
            error: function (err) {
                console.error(err)
            },
        });
    } else {
        $("[data-id='" + id + "']").removeClass("elementoAnotacionSeleccionado");
        $("#gestionAnotacionesContainer").slideToggle(500);
        editarToDetalle();
        viewer.isolate(0);
        viewer.fitToView();
        viewer.select();
        _selectedAnotacion = 0;
    };
};

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

const actualizarAnotacion = (id, objAnotacion) => {
    $.ajax({
        url: '/api/forge/anotaciones/modificar/' + id,
        data: JSON.stringify(objAnotacion),
        processData: false,
        contentType: 'application/json',
        type: 'PATCH',
        success: function (res) {
            _selectedAnotacion = 0;
            $("#gestionAnotacionesContainer").slideToggle(500);
            $(".elementoAnotacion").removeClass('elementoAnotacionSeleccionado');
            $("#btnCancelarAnotacion").hide();
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
        },
    });
};

const rellenarFormulario = (objAnotacion) => {
    $("#tituloAnotacion").val(objAnotacion.titulo);
    $('#usuarioAnotacion').val(objAnotacion.usuario);
    $('#prioridadAnotacion').val(objAnotacion.prioridad);
    $("#descripcionAnotacion").val(objAnotacion.descripcion);
};

const animacionAnotacion = (id) => {
    $(".elementoAnotacion").removeClass('elementoAnotacionSeleccionado')
    var estadoPanel = $('#gestionAnotacionesContainer').css('display');
    //CUANDO PINCHAN EN UNA ANOTACIÓN Y NO HAY PANEL
    if (estadoPanel == 'none') {
        $("[data-id='" + id + "']").toggleClass("elementoAnotacionSeleccionado");
        $("#gestionAnotacionesContainer").slideToggle(500);
        $('.listaAnotaciones').animate({
            scrollTop: ($("[data-id='" + id + "']").offset().top) - 200
        }, 1000);
    }
    //CUANTO PINCHAN EN LA MISMA ANOTACIÓN OTRA VEZ 
    else if (id == _selectedAnotacion) {
        $("[data-id='" + id + "']").removeClass("elementoAnotacionSeleccionado");
        $("#gestionAnotacionesContainer").slideToggle(500);
        editarToDetalle();
        viewer.isolate(0);
        viewer.fitToView();
        viewer.select();
        //CUANDO YA HAY PANEL Y PINCHAN EN UNA ANOTACIÓN DIFERENTE
    } else {
        $("[data-id='" + id + "']").addClass("elementoAnotacionSeleccionado");
        $('.listaAnotaciones').animate({
            scrollTop: ($("[data-id='" + id + "']").offset().top) - 200
        }, 1000);
        editarToDetalle();
    };
};

const generarObjAnotacion = () => {
    var objAnotacion = {};
    objAnotacion.titulo = $("#tituloAnotacion").val();
    objAnotacion.usuario = $('#usuarioAnotacion').val();
    objAnotacion.prioridad = $('#prioridadAnotacion').val();
    objAnotacion.descripcion = $("#descripcionAnotacion").val();
    objAnotacion.elementos = viewer.getSelection();
    return objAnotacion;
};

const editarToDetalle = () => {
    $("#formAnotaciones input").prop("disabled", true);
    $("#formAnotaciones textarea").prop("disabled", true);
    $("#btnCancelarAnotacion").hide();
    $("#btnModificarAnotacion").hide();
    $("#btnEditarAnotacion").show();
}
