class ExtensionPrueba extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
    }

    load() {
        console.log('Mi extensión CREMÓN has been loaded');
        return true;
    }

    unload() {
        // Clean our UI elements if we added any
        if (this._group) {
            this._group.removeControl(this._button);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        console.log('Mi extensión CREMÓN has been unloaded');
        return true;
    }

    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl('allMyAwesomeExtensionsToolbar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('allMyAwesomeExtensionsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Primer botón
        this._button = new Autodesk.Viewing.UI.Button('extensionPrueba1');
        this._button.onClick = (ev) => {
            alert("Has clicado en la extensión del amor");
        };
        this._button.setToolTip('La primera');
        this._button.addClass('primeraExtensionIcon');

        // Segundo botón
        this._button2 = new Autodesk.Viewing.UI.Button('extensionPrueba2');
        this._button2.onClick = (ev) => {
            alert("Has clicado en la extensión del folleteo");
        };
        this._button2.setToolTip('La segunda');
        this._button2.addClass('segundaExtensionIcon');

        this._group.addControl(this._button);
        this._group.addControl(this._button2);

    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('ExtensionPrueba', ExtensionPrueba);
