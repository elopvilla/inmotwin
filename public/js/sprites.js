const loadSensors = async () => {

    const dataVizExtn = await viewer.loadExtension("Autodesk.DataVisualization");
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

    viewer.addEventListener(DataVizCore.MOUSE_HOVERING, onSpriteHovering);
    viewer.addEventListener(DataVizCore.MOUSE_CLICK, onSpriteClicked);
};

const onSpriteHovering = (event) => {
    const targetDbId = event.dbId;
    console.log(event);
    if (event.hovering) {
        console.log(`The mouse hovers over ${targetDbId}`);
    } else {
        console.log(`The mouse hovers off ${targetDbId}`);
    }
}

const onSpriteClicked = (event) => {
    console.log(`Sprite clicked: ${event.dbId}`);
};

