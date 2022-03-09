jQuery(function () {
    $('#checkPropertiesButton').on('change', function () {
        this.value == 0 ? viewer.clearThemingColors() : hasProperty(this.value);
    });
});

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
        $("#sumLongitud").text(`${(longitud / 1000).toFixed(2)} m`);
        $("#sumArea").text(`${area.toFixed(2)} m2`);
        $("#sumVolumen").text(`${volumen.toFixed(2)} m3`);
    })
}

const pintarSeleccion = () => {
    var dbIds = viewer.getSelection();
    if (dbIds.length > 0) {
        dbIds.forEach(dbId => {
            viewer.setThemingColor(dbId, new THREE.Vector4(180 / 255, 190 / 255, 100 / 255, $('#addPintura').is(":checked") ? 1 : 0));
        })
    }
    viewer.clearSelection();
}

const guardarSeleccion = () => {
    const seleccion = viewer.getSelection();
    $.ajax({
        url: '/api/forge/miprimerapi/seleccion',
        data: JSON.stringify(seleccion),
        processData: false,
        contentType: 'application/json',
        type: 'POST',
        success: function (res) {
            console.log(res)
        },
        error: function (err) {
            console.error(err);
        }
    });
}

const recuperarSeleccion = () => {
    $.ajax({
        url: '/api/forge/miprimerapi/seleccion',
        contentType: 'application/json',
        type: 'GET',
        success: function (data) {
            viewer.select(data.seleccion);
        },
        error: function (err) {
            console.error(err);
        }
    });
}

function getAllLeafComponents(visor, callback) {
    var cbCount = 0; // count pending callbacks
    var components = []; // store the results
    var tree; // the instance tree

    function getLeafComponentsRec(parent) {
        cbCount++;
        if (tree.getChildCount(parent) != 0) {
            tree.enumNodeChildren(parent, function (children) {
                getLeafComponentsRec(children);
            }, false);
        } else {
            components.push(parent);
        }
        if (--cbCount == 0) callback(components);
    }
    visor.getObjectTree(function (objectTree) {
        tree = objectTree;
        var allLeafComponents = getLeafComponentsRec(tree.getRootId());
    });
}

const pintarCategorias = () => {
    getAllLeafComponents(viewer, (dbIds) => {
        var categorias = [];
        dbIds.forEach(dbId => {
            viewer.getProperties(dbId, (res) => {
                var category = res.properties.find(element => element.displayName === 'Category');
                // if (categorias.indexOf(category.displayValue) === -1){
                //     categorias.push(category.displayValue);
                // }
                switch (category.displayValue) {
                    case 'Revit Walls':
                        viewer.setThemingColor(dbId, new THREE.Vector4(1, 0, 0, 1));
                        break;
                    case 'Revit Floors':
                        viewer.setThemingColor(dbId, new THREE.Vector4(0, 1, 0, 1));
                        break;
                    case 'Revit Furniture':
                        viewer.setThemingColor(dbId, new THREE.Vector4(0, 0, 1, 1));
                        break;
                    default:
                        viewer.hide(dbId);
                }
            });
        });
        console.log(categorias);
    })
}

const pintarNiveles = () => {
    getAllLeafComponents(viewer, (dbIds) => {
        var niveles = [];
        dbIds.forEach(dbId => {
            viewer.getProperties(dbId, (res) => {
                var nivel = res.properties.find(element => element.displayName === 'Level');
                if (nivel !== undefined) {
                    niveles.push(nivel);
                }
            })
        });
        console.log(niveles);
    })
}

$('checkPropertiesButton').on('change', function () {
    alert(this.value);
});

const hasProperty = (property) => {
    getAllLeafComponents(viewer, (dbIds) => {
        dbIds.forEach(dbId => {
            viewer.getProperties(dbId, (res) => {
                var keynote = res.properties.find(element => element.displayName === property);
                if (keynote === undefined) {
                    viewer.setThemingColor(dbId, new THREE.Vector4(1, 1, 0, 1));
                } else if (keynote.displayValue !== '') {
                    viewer.setThemingColor(dbId, new THREE.Vector4(0, 1, 0, 1));
                    var objetoCheck = {
                        dbId,
                        check: 'Sin rellenar',
                        fecha: Date.now(),
                        checkedBy: "Eric Lopez"
                    }
                    $.ajax({
                        url: '/api/forge/miprimerapi/check',
                        data: JSON.stringify(objetoCheck),
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
                } else {
                    viewer.setThemingColor(dbId, new THREE.Vector4(1, 0, 0, 1));
                }
            });
        });
    })
}

