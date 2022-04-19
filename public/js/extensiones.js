class Extensiones extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
    };

    load() {
        console.log('Extensiones IoT y anotaciones en obra cargadas');
        return true;
    };

    unload() {
        // Clean our UI elements if we added any
        if (this._group) {
            this._group.removeControl(this._button);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        console.log('Extensiones IoT y anotaciones en obra deshabilitadas');
        return true;
    };

    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl('AnotacionesIoTToolbar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('AnotacionesIoTToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Primer botón
        // this._button = new Autodesk.Viewing.UI.Button('sensoresIoT');
        // this._button.onClick = (ev) => {
        //     this._button.getState() == 1 ? openIot(this._button) : closeIot(this._button);
        // };
        // this._button.setToolTip('Sensores');
        // this._button.addClass('botonIot');

        // Segundo botón
        this._button2 = new Autodesk.Viewing.UI.Button('anotacionesObra');
        this._button2.onClick = (ev) => {
            this._button2.getState() == 1 ? openGestion(this._button2) : closeGestion(this._button2);
        };
        this._button2.setToolTip('Gestión');
        this._button2.addClass('botonGestion');

        // this._group.addControl(this._button);
        this._group.addControl(this._button2);
    };
};

function openIot(boton) {
    boton.setState(0);
    dataVizExtn.showHideViewables(true, false);
};

function closeIot(boton) {
    boton.setState(1);
    dataVizExtn.showHideViewables(false, false);
};

function openGestion(boton) {
    boton.setState(0);
    transformViewer(0).then(e => {
        $('.panelMantenimientos').show();
        viewer.resize();
        verPiso(6);
    });
};

function closeGestion(boton) {
    boton.setState(1);
    transformViewer(1).then(e => {
        $('.panelMantenimientos').hide();
        viewer.resize();
        viewer.isolate();
        ocultarMasaHabitaciones();
    });
};

const transformViewer = async (state) => {
    state == 0 ? await shrinkViewer() : await enlargeViewer();
};

const shrinkViewer = () => {
    return new Promise((resolve, reject) => {
        $('#viewerContainer').addClass('col-sm-9');
        $('#viewerContainer').removeClass('col-sm-12');
        setTimeout(() => {
            resolve();
        }, 350);
    })
};

const enlargeViewer = () => {
    return new Promise((resolve, reject) => {
        $('#viewerContainer').removeClass('col-sm-9');
        $('#viewerContainer').addClass('col-sm-12');
        setTimeout(() => {
            resolve();
        }, 350);
    })
};

const panelGraficoMantenimientoRealizado = () => {
    //SI NO EXISTE EL PANEL, LO CREA
    if (this._panelMantenimiento == null) {
        this._panelMantenimiento = new ModelSummaryPanel(this.viewer, this.viewer.container, 'solarPanel', 'MANTENIMIENTO REALIZADO', 0, 0, htmlPanelMantenimientoRealizado, 530, 377);
    }
    // Show/hide docking panel
    this._panelMantenimiento.container.style.left = 5 + 'px';
    this._panelMantenimiento.container.style.top = 5 + 'px';

    //SI EXISTE Y ES VISIBLE LO OCULTA, SI EXISTE Y ESTA OCULTO, LO MUESTRA
    if (!this._panelMantenimiento.isVisible()) {
        this._panelMantenimiento.setVisible(true);
    }
    // this._panel5.setVisible(!this._panel5.isVisible());

    // If panel is NOT visible, exit the function
    if (!this._panelMantenimiento.isVisible())
        return;
};

const panelGraficoMantenimiento = () => {
    //SI NO EXISTE EL PANEL, LO CREA
    if (this._panel5 == null) {
        this._panel5 = new ModelSummaryPanel(this.viewer, this.viewer.container, 'solarPanel', 'REALIZAR MANTENIMIENTO', 0, 0, htmlPanelRealizarMantenimiento, 601, 373);
    }
    // Show/hide docking panel
    this._panel5.container.style.left = 5 + 'px';
    this._panel5.container.style.top = 5 + 'px';

    //SI EXISTE Y ES VISIBLE LO OCULTA, SI EXISTE Y ESTA OCULTO, LO MUESTRA
    if (!this._panel5.isVisible()) {
        this._panel5.setVisible(true);
    }
    // this._panel5.setVisible(!this._panel5.isVisible());

    // If panel is NOT visible, exit the function
    if (!this._panel5.isVisible())
        return;
};

const cerrarPanelGraficoMantenimiento = () => {
    if (this._panel5.isVisible()) {
        this._panel5.setVisible(false);
    }
}

const panelGraficoInstalaciones = (titulo, rutaImg) => {
    //SI NO EXISTE EL PANEL, LO CREA
    if (this.panelInstalacion == null) {
        this.panelInstalacion = new ModelSummaryPanel(this.viewer, this.viewer.container, 'solarPanel', titulo, 10, 10, htmlPanelInstalaciones(rutaImg), 500, 373);
    }
    // Show/hide docking panel
    this.panelInstalacion.container.style.left = 5 + 'px';
    this.panelInstalacion.container.style.top = 5 + 'px';

    //SI EXISTE Y ES VISIBLE LO OCULTA, SI EXISTE Y ESTA OCULTO, LO MUESTRA
    if (!this.panelInstalacion.isVisible()) {
        this.panelInstalacion.setVisible(true);
    }
    // this._panel5.setVisible(!this._panel5.isVisible());

    // If panel is NOT visible, exit the function
    if (!this.panelInstalacion.isVisible())
        return;
}

const panelGraficoPlano = (rutaImg) => {
    if (this.panelPlano == null) {
        this.panelPlano = new ModelSummaryPanel(this.viewer, this.viewer.container, 'solarPanel', 'Plano', 600, 5, htmlPanelPlano(rutaImg), 615, 400);
    }

    var canvas = $('canvas')[0];
    this.panelPlano.container.style.left = (canvas.width) - 400 + 'px';
    // Show/hide docking panel
    // this.panelPlano.container.style.top = 5 + 'px';

    //SI EXISTE Y ES VISIBLE LO OCULTA, SI EXISTE Y ESTA OCULTO, LO MUESTRA
    // if (!this.panelPlano.isVisible()) {
    //     this.panelPlano.setVisible(true);
    // }
    this.panelPlano.setVisible(!this.panelPlano.isVisible());

    // If panel is NOT visible, exit the function
    if (!this.panelPlano.isVisible())
        return;
}

const htmlPanelInstalaciones = (rutaImg) => {
    return `<div id="panelInstalacion"><h6>Fabricante:</h6><p id="fabricanteInstalacion" class="list-group-item fondoGris"></p><h6>Referencia:</h6><p id="referenciaInstalacion" class="list-group-item fondoGris"></p><h6>Emplazamiento:</h6><p id="emplazamientoInstalacion" class="list-group-item fondoGris"></p><h6>Descripcion:</h6><p id="descripcionInstalacion" class="list-group-item fondoGris"></p></div><div class="botoneraPlano"><button class="btnForm btnNuevo" onclick="panelGraficoPlano('${rutaImg}')" id="btnPlano">Plano</button></div>`;
};

const htmlPanelPlano = (rutaImg) => {
    return `<div><img src='${rutaImg}' height=550 width=400'></div>`;
}

var htmlPanelMantenimientoRealizado = '<div class="panelMantenimientoRealizado"><h6>Mantenimiento:</h6><p id="tituloMantenimiento" class="list-group-item fondoGris"></p><h6>Realizado por:</h6><p id="mantenimientoRealizadoPor" class="list-group-item fondoGris"></p><h6>Fecha y hora:</h6><p id="fechaHoraMantenimiento" class="list-group-item fondoGris"></p><h6>Tarea:</h6><p id="mantenimientoTarea" class="list-group-item fondoGris"></p><h6>Observaciones:</h6><p id="mantenimientoObservaciones" class="list-group-item fondoGris"></p></div>';
var htmlPanelRealizarMantenimiento = '<div class="formMantenimientoContainer"><div class="form-group"><label for="titulo" class="fontBold">Título</label><input type="text" name="titulo" class="form-control" id="mantenimientoFormTitulo" disabled></div><div class="form-group"><label for="user" class="fontBold">Asignado a</label><input type="text" name="usuario" class="form-control" id="mantenimientoFormAsignado" disabled></div><div class="form-group"><label for="user" class="fontBold">Realizado por</label><input type="text" name="usuario" class="form-control" id="mantenimientoFormUsuario" placeholder="Nombre y apellidos"></div><div class="form-group"><label for="user" class="fontBold">Descripción</label><textarea id="mantenimientoFormDescripcion" name="descripcion" rows="3" class="form-control" disabled></textarea></div><div class="form-group"><label for="user" class="fontBold">Observaciones</label><textarea id="mantenimientoFormObservaciones" name="descripcion" rows="4" class="form-control" placeholder="Observaciones del mantenimiento"></textarea></div><div class="botonera"><button class="btnForm btnNuevo" onclick="actualizarMantenimiento()" rel="modal:close" id="btnGuardarAnotacion">Guardar</button></div></div>'

// var htmlPanelGrafico ='<div><h6>Título:</h6><p id="tituloMantenimiento" class="list-group-item fondoGris"></p><h6>Realizado por:</h6><p id="mantenimientoRealizadoPor" class="list-group-item fondoGris"></p><h6>Fecha y hora:</h6><p id="fechaHoraMantenimiento" class="list-group-item fondoGris"></p><h6>Tarea:</h6><p id="mantenimientoTarea" class="list-group-item fondoGris"></p><h6>Observaciones:</h6><p id="mantenimientoObservaciones" class="list-group-item fondoGris"></p></div>';

Autodesk.Viewing.theExtensionManager.registerExtension('Extension', Extensiones);

class ModelSummaryPanel extends Autodesk.Viewing.UI.DockingPanel {
    constructor(viewer, container, id, title, posX, posY, htmlPanel, height, width, options) {
        super(container, id, title, options);
        this.viewer = viewer;

        this.container.classList.add('docking-panel-container-solid-color-a');
        this.container.style.top = posY + 'px'
        this.container.style.left = posX + 'px'
        this.container.style.width = width + 'px'
        this.container.style.height = height + 'px'
        this.container.style.resize = 'auto'

        this.createTitleBar(title);

        var div = document.createElement('div');
        div.setAttribute('id', 'pruebaIdDP');
        div.innerHTML = htmlPanel;
        this.container.appendChild(div);
    }
};