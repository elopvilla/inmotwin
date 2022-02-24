const miPrimeraFuncion = () => {
    viewer.isolate(viewer.getSelection());
    viewer.fitToView(viewer.getSelection());
}

const search = () => {
    var texto = $('#searchText').val();
    viewer.search(texto,
        (dbIds) => {
            viewer.select(dbIds);
            viewer.fitToView(dbIds);
        },
        (error) => {
            console.error(error);
        },
        ['Name', 'Type Name', 'Description']
    );
}

const getArea = () => {
    sumar('Area');
}

const getVolume = () => {
    sumar('Volume');
}

const sumar = (dbIds, parametro) => {
    viewer.model.getBulkProperties(dbIds, [parametro], res => {
        let volumenTotal = 0;
        let texto = res[0].properties[0].displayName;
        res.map((element) => {
            volumenTotal += element.properties[0].displayValue;
        })
        alert(`El ${texto} total es: ${volumenTotal.toFixed(2)}`);
    })
}

const datosSeleccion = (dbIds) => {
    viewer.model.getBulkProperties(dbIds, ['Length', 'Volume', 'Area'], res => {
        var longitud = 0;
        var area = 0;
        var volumen = 0;
        res.map(item => {
            var hasLength = item.properties.find(x => x.displayName === 'Length');
            var hasVolume = item.properties.find(x => x.displayName === 'Volume');
            var hasArea = item.properties.find(x => x.displayName === 'Area');
            if (hasLength !== undefined) longitud += hasLength.displayValue;
            if (hasVolume !== undefined) volumen += hasVolume.displayValue;
            if (hasArea !== undefined) area += hasArea.displayValue;
        });
        $("#sumLongitud").text(`${(longitud/1000).toFixed(2)} m`);
        $("#sumArea").text(`${area.toFixed(2)} m2`);
        $("#sumVolumen").text(`${volumen.toFixed(2)} m3`);
    })
}

const pintarSeleccion = () => {
    var dbIds = viewer.getSelection();
    if (dbIds.length > 0){
        dbIds.forEach(dbId => {
            viewer.setThemingColor(dbId, new THREE.Vector4(180/255,190/255,100/255, $('#addPintura').is(":checked")? 1: 0));
        })
    }
    viewer.clearSelection();
}

