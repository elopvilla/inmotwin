const getInstancesAsync = () => {
    return new Promise((resolve, reject) => {
        getAllLeafComponents(viewer, res => {
            resolve(res);
        }, err => {
            reject(err);
        })
    })
}

const getPropertiesAsync = (dbId) => {
    return new Promise((resolve, reject) => {
        viewer.getProperties(dbId, res => {
            resolve(res);
        }, err => {
            reject(err);
        })
    })
};

const getPropValues = async (propName) => {
    const dbIds = await getInstancesAsync();
    const array = [];
    for (const dbId of dbIds) {
        const result = await getPropertiesAsync(dbId);
        const propiedad = result.properties.find(x => x.displayName == propName);
        if (propiedad !== undefined && propiedad.displayValue !== '') {
            array.push(propiedad.displayValue);
        }
    }
    const propiedadesUnicas = array.filter(onlyUnique);
    rellenarLista(propiedadesUnicas);
}

function rellenarLista(objetos){
    $('#lista').empty();
    objetos.forEach(prop => {
        $('#lista').append(`<li class="list-group-item">${prop}</li>`);
    })
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index
}



