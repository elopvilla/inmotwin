var _idIncidenciaSeleccionada;

$(document).ready(function () {
    $('#formCrearIncidencia').submit(e => {
        e.preventDefault();
        var accion = (e.originalEvent.submitter).getAttribute("data-action");
        var objIncidencia = {
            title: $('#formTitle').val(),
            user: $('#formUser').val(),
            status: $('#formStatus').val(),
            closedAt: $('#formClosedAt').val(),
            dbIds: viewer.getSelection()
        };
        if (accion === 'guardar'){
            $.ajax({
                url: '/api/forge/incidencias/nuevaIncidencia',
                data: JSON.stringify(objIncidencia),
                processData: false,
                contentType: 'application/json',
                type: 'POST',
                success: function (res) {
                    console.log(res);
                },
                error: function (err) {
                    console.error(err);
                }
            });
        } else if (accion === 'actualizar'){
            $.ajax({
                url: '/api/forge/incidencias/' + _idIncidenciaSeleccionada,
                data: JSON.stringify(objIncidencia),
                processData: false,
                contentType: 'application/json',
                type: 'PATCH',
                success: function (res) {
                    console.log(res);
                },
                error: function (err) {
                    console.error(err);
                }
            });
        } else if (accion === 'cancelar'){
            $('#formCrearIncidencia').trigger("reset");
        };
        getIncidenciasByStatus('Open');
        $('#formCrearIncidencia').trigger("reset");
        $("#btnGuardarIncidencia").show();
        $("#btnModificarIncidencia").hide();
        viewer.isolate();
        viewer.fitToView();
    });
    $("#listaIncidencias").on('click', ".incidencia", ev => {
        var id = ev.target.getAttribute("data-id");
        _idIncidenciaSeleccionada = id;
        getIncidenciaByID(id);
    })
});

const getIncidenciaByID = (id) => {
    $.ajax({
        url: '/api/forge/incidencias/' + id,
        processData: false,
        contentType: 'application/json',
        type: 'GET',
        success: function (res) {
            viewer.isolate(res.data.dbIds);
            viewer.fitToView(res.data.dbIds);
            $("#formTitle").val(res.data.title);
            $('#formUser').val(res.data.user);
            $('#formStatus').val(res.data.status);
            $("#formClosedAt").val(moment(res.data.closedAt).format('YYYY-MM-DD'));
            $("#btnGuardarIncidencia").hide();
            $("#btnModificarIncidencia").show();
        },
        error: function (err) {
            console.error(err)
        },
    });
}

const getIncidenciasByStatus = (status) => {
    $.ajax({
        url: '/api/forge/incidencias/status/' + status,
        processData: false,
        contentType: 'application/json',
        type: 'GET',
        success: function (res) {
            $('#listaIncidencias').empty();
            res.data.forEach(element => {
                $('#listaIncidencias').append(`<li class="list-group-item incidencia" data-id="${element._id}">${element.title}</li>`);
            });
        },
        error: function (err) {
            console.error(err)
        },
    });
};