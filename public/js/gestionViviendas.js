const pintarCategorias = () => {
    viewer.hide(1);
    viewer.show(12619);
    getAllLeafComponents(viewer, (dbIds) => {
        var idsPrimerPiso = [];
        dbIds.forEach(dbId => {
            viewer.getProperties(dbId, (res) => {
                var category = res.properties.find(element => element.displayName === 'Level');
                if (category !== undefined) {
                    if (category.displayValue < 6) {
                        idsPrimerPiso.push(dbId);
                        viewer.show(dbId);
                    }
                }
            });
        });
        console.log(idsPrimerPiso);
    })
};

const verPiso = (numeroPiso) => {
    viewer.isolate(12619);
    var bar = new Promise((resolve, reject) => {
        getAllLeafComponents(viewer, (dbIds) => {
            dbIds.forEach((dbId, index, array) => {
                viewer.getProperties(dbId, (res) => {
                    var nivel = res.properties.find(element => element.displayName === 'Level');
                    var category = res.properties.find(element => element.displayName === 'Category');
                    if (category !== undefined) {
                        if (category.displayValue !== 'Revit Habitaciones') {
                            if (nivel !== undefined) {
                                if (nivel.displayValue < numeroPiso) {
                                    viewer.show(dbId);
                                }
                            }
                        }
                    }
                });
                if (index === array.length - 1) resolve();
            });
        });
    });
    bar.then(() => {
        launchViewer2(numeroPiso - 5);
        getHabitaciones((numeroPiso - 1)).then((objPiso) => {
            $('#cuerpoTablaEstancias').empty();
            objPiso.habitaciones.sort(function (a, b) {
                if (a.nombre < b.nombre) { return -1; }
                if (a.nombre > b.nombre) { return 1; }
                return 0;
            })
            chartSuperficie(numeroPiso -5 , objPiso.superficie);
            chartHabitaciones(numeroPiso - 5, objPiso.habitaciones.length);
            objPiso.habitaciones.forEach(habitacion => {
                var htmlVR = habitacion.vr ? `<td><img src='./img/gafas.png' class="iconLupa" onclick="setHabitacionVR(${habitacion.numero}, '${habitacion.nombre}')"></td>` : '';
                $('#cuerpoTablaEstancias').append(`<tr><th scope="row">${habitacion.nombre}</th><td>${habitacion.superficie} m²</td><td><img src='./img/lupa.png' class="iconLupa" onclick="viewer.fitToView([${habitacion.dbId}])"></td>
                ${htmlVR}</tr>`);
            })
        })
    })
};

const getInstancesAsync = () => {
    return new Promise((resolve, reject) => {
        getAllLeafComponents(viewer, res => {
            resolve(res);
        }, err => {
            reject(err);
        })
    })
}

const setHabitacionVR = (nHabitacion, nombreHabitacion) => {
    var visor = '<iframe src="./vr/' + nHabitacion + '/pano.html" height="500" width="600" title="Iframe Example"></iframe>';
    $('#ex1').empty();
    $('#ex1').append('<h5>VISITA VIRTUAL ' + nombreHabitacion.toUpperCase() + '</h5>')
    $('#ex1').append(visor);
    $("#ex1").modalJ({
        fadeDuration: 350
    });
}

const ocultarMasaHabitaciones = () => {
    getAllLeafComponents(viewer, (dbIds) => {
        dbIds.forEach(dbId => {
            viewer.getProperties(dbId, (res) => {
                var category = res.properties.find(element => element.displayName === 'Category');
                if (category.displayValue === 'Revit Habitaciones') {
                    viewer.hide(dbId);
                }
            });
        });
    })
}

const getHabitaciones = (planta) => {
    var superficieTotal = 0;
    return new Promise((resolve, reject) => {
        const objPiso = [];
        const detalleHabitaciones = [];
        getAllLeafComponents(viewer, (dbIds) => {
            dbIds.forEach((dbId, index, array) => {
                viewer.getProperties(dbId, (res) => {
                    var nivel = res.properties.find(element => element.displayName === 'Level');
                    var category = res.properties.find(element => element.displayName === 'Category');
                    if (category !== undefined) {
                        if (category.displayValue === 'Revit Habitaciones') {
                            if (nivel !== undefined) {
                                if (nivel.displayValue === planta) {
                                    hasVR = (res.properties.find(element => element.displayName === 'VR').displayValue);
                                    var objHabitacion = {};
                                    objHabitacion.nombre = res.properties.find(element => element.displayName === 'Comentarios').displayValue;
                                    objHabitacion.superficie = (res.properties.find(element => element.displayName === 'Área').displayValue).toFixed(2);
                                    objHabitacion.numero = (res.properties.find(element => element.displayName === 'Número').displayValue);
                                    objHabitacion.vr = hasVR == 1 ? true : false;
                                    objHabitacion.dbId = dbId;
                                    detalleHabitaciones.push(objHabitacion);
                                    superficieTotal += parseFloat(objHabitacion.superficie);
                                }
                            }
                        }
                    }
                    if (index === array.length - 1) {
                        objPiso.habitaciones = detalleHabitaciones;
                        objPiso.superficie = superficieTotal;
                        resolve(objPiso);
                    }
                });
            });
        });
    });
}

const chartSuperficie = (planta, metros) => {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Elemento', 'Superficie'],
            [`Planta ${planta}`, metros],
            ['Total', 390],
        ]);
        var options = {
            title: 'SUPERFICIE (m2)',
            legend: { position: 'bottom' },
            height: 215,
            width: 215,
            fontSize: 12
        };
        var chart = new google.visualization.PieChart(document.getElementById('chartSuperficie'));
        chart.draw(data, options);
    }
}

const chartHabitaciones = (planta, habitaciones) => {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Elemento', 'Numero'],
            [`Planta ${planta}`, habitaciones],
            ['Total', 28],
        ]);
        var options = {
            title: 'HABITACIONES (nº)',
            legend: { position: 'bottom' },
            height: 215,
            width: 215,
            fontSize: 12
        };
        var chart = new google.visualization.PieChart(document.getElementById('chartHabitaciones'));
        chart.draw(data, options);
    }
};

const pruebota = () => {
    $("#ex1").modalJ({
        fadeDuration: 350
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