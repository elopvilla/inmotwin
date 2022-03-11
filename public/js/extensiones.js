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
        this._button = new Autodesk.Viewing.UI.Button('sensoresIoT');
        this._button.onClick = (ev) => {
            //EVENTOS BOTON 1
            alert("Este apartado estará disponible proximamente!");
        };
        this._button.setToolTip('Sensores');
        this._button.addClass('primeraExtensionIcon');

        // Segundo botón
        this._button2 = new Autodesk.Viewing.UI.Button('anotacionesObra');
        this._button2.onClick = (ev) => {
            this._button2.getState() == 1? openAnotaciones(this._button2) : closeAnotaciones(this._button2);
        };
        this._button2.setToolTip('Anotaciones de obra');
        this._button2.addClass('botonTarea');
        
        this._group.addControl(this._button);
        this._group.addControl(this._button2);
    };
};

function openAnotaciones(boton){
    boton.setState(0);
    transformViewer(0).then(e => {
        $('.panelAnotaciones').show();
    });
};

function closeAnotaciones(boton){
    boton.setState(1);
    transformViewer(1).then(e => {
        $('.panelAnotaciones').hide();
    });
};

const transformViewer = async (state) => {
    state == 0? await shrinkViewer() : await enlargeViewer();
};

const shrinkViewer = () => {
    return new Promise((resolve, reject) => {
        $('#viewerContainer').addClass('col-sm-9');
        $('#viewerContainer').removeClass('col-sm-12');
        setTimeout(() => {
            resolve();
        }, 500);
    })
};

const enlargeViewer = () => {
    return new Promise((resolve, reject) => {
        $('#viewerContainer').removeClass('col-sm-9');
        $('#viewerContainer').addClass('col-sm-12');
        setTimeout(() => {
            resolve();
        }, 500);
    })
};

Autodesk.Viewing.theExtensionManager.registerExtension('Extension', Extensiones);
