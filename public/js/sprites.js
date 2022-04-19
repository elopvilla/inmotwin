var dataVizExtn;

const loadSensors = async () => {
    
    dataVizExtn = await viewer.loadExtension("Autodesk.DataVisualization");
    const DataVizCore = Autodesk.DataVisualization.Core;

    const viewableType = DataVizCore.ViewableType.SPRITE;
    const spriteColor = new THREE.Color(0xffffff);
    const colorAmarillo = new THREE.Color('rgb(255, 255, 0)');
    const colorAzul = new THREE.Color('#1A3C97');
    const spriteIot = './img/motion.svg';
    const spriteTemp = './img/co2.svg';

    const style = new DataVizCore.ViewableStyle(viewableType, spriteColor, spriteIot, colorAzul);
    const style2 = new DataVizCore.ViewableStyle(viewableType, spriteColor, spriteTemp, colorAzul);

    const viewableData = new DataVizCore.ViewableData();
    viewableData.spriteSize = 28; // Sprites as points of size 24 x 24 pixels

    const sensoresIot = [
        { position: { x: -52, y: 55, z: -2 } },
        { position: { x: 61, y: 52, z: 10 } }
    ];

    sensoresIot.forEach((myData, index) => {
        const dbId = 10 + index;
        const position = myData.position;
        const viewable = new DataVizCore.SpriteViewable(position, style, dbId);

        viewableData.addViewable(viewable);
    });

    const sensoresTemp = [
        { position: { x: 35, y: 2, z: -10 } },
    ];

    sensoresTemp.forEach((myData, index) => {
        const dbId = 20 + index;
        const position = myData.position;
        const viewable = new DataVizCore.SpriteViewable(position, style2, dbId);

        viewableData.addViewable(viewable);
    });

    await viewableData.finish();
    dataVizExtn.addViewables(viewableData);
    dataVizExtn.showHideViewables(false, false);

    viewer.addEventListener(DataVizCore.MOUSE_HOVERING, onSpriteHovering);
    viewer.addEventListener(DataVizCore.MOUSE_CLICK, onSpriteClicked);
};

const onSpriteHovering = (event) => {
    const targetDbId = event.dbId;
    if (event.hovering) {
        var canvas = $('canvas')[0];
        var rect = canvas.getBoundingClientRect();
        var x = event.originalEvent.clientX - rect.left;
        var y = event.originalEvent.clientY - rect.top;
        var htmlPanelesSolares = '<div class="centrarPanel"><img src="./img/iotanimation.gif" class="iotGraphic" width="400" height="150"><div class="panelesTexto"><p>Potencia generada</p><img src="./img/iotanimationtext.gif" class="iotGraphic" width="125" height="45"></div></div>';
        var htmlTurbinasEolicas = '<div class="centrarPanel"><img src="./img/iotAnimationTurbina.gif" class="iotGraphic" width="400" height="150"><div class="panelesTexto"><p>Potencia generada</p><img src="./img/iotanimationtext.gif" class="iotGraphic" width="125" height="45"></div></div>';
        var htmlTemperaturaCasa = '<div class="centrarPanel"><div class="textoIotCasa"><div>TEMPERATURA</div><img src="./img/tempAnimation.gif" class="iotGraphic" width="125" height="125"></div><div class="textoIotCasa"><div>HUMEDAD</div><img src="./img/humedadAnimation.gif" class="iotGraphic" width="125" height="125"></div></div>';
        if (targetDbId == 10){
            if (this._panel == null) {
                this._panel = new ModelSummaryPanel(this.viewer, this.viewer.container, 'solarPanel', 'x12 Paneles solares SunPower	SPR-X22-370', x, y, htmlPanelesSolares, 260, 580);
            }
            // Show/hide docking panel
            this._panel.container.style.left = x + 'px';
            this._panel.container.style.top = y + 'px';
            this._panel.setVisible(!this._panel.isVisible());
            // If panel is NOT visible, exit the function
            if (!this._panel.isVisible())
            return;
        } else if (targetDbId == 11){
            if (this._panel2 == null) {
                this._panel2 = new ModelSummaryPanel(this.viewer, this.viewer.container, 'solarPanel', 'x3 Turbinas eólicas	E200', x, y, htmlTurbinasEolicas, 260, 580);
            } 
            // Show/hide docking panel
            this._panel2.container.style.left = x + 'px';
            this._panel2.container.style.top = y + 'px';
            this._panel2.setVisible(!this._panel2.isVisible());
            // If panel is NOT visible, exit the function
            if (!this._panel2.isVisible())
            return;
        } else if (targetDbId == 20){
            if (this._panel3 == null) {
                this._panel3 = new ModelSummaryPanel(this.viewer, this.viewer.container, 'solarPanel', 'Parámetros de confort salón inferior', x, y, htmlTemperaturaCasa, 280, 400);
            }
            // Show/hide docking panel
            this._panel3.container.style.left = x + 'px';
            this._panel3.container.style.top = y + 'px';
            this._panel3.setVisible(!this._panel3.isVisible());
            // If panel is NOT visible, exit the function
            if (!this._panel3.isVisible())
            return;
        }
    } else {
        if (targetDbId == 10){
            // Show/hide docking panel
            this._panel.setVisible(!this._panel.isVisible());
        } else if (targetDbId == 11){
            this._panel2.setVisible(!this._panel2.isVisible());
        } else if (targetDbId == 20){
            this._panel3.setVisible(!this._panel3.isVisible());
        }
    }
}

const onSpriteClicked = (event) => {
    console.log(`Sprite clicked: ${event.dbId}`);
};



