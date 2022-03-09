var viewer;
var viewer2;

function launchViewer(urn) {
  var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken
  };

  Autodesk.Viewing.Initializer(options, () => {
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), { extensions: ['Autodesk.DocumentBrowser', 'ExtensionPrueba'] });
    viewer2 = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer2'), { extensions: ['Autodesk.DocumentBrowser'] });
    viewer.start();
    viewer2.start();
    var documentId = 'urn:' + urn;
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
  });
}

function onDocumentLoadSuccess(doc) {
  var viewables = doc.getRoot().getDefaultGeometry();
  // const view2 = doc.getRoot().getSheetNodes()[0].data.children.find(x => x.type === 'view')
  // const viewables2 = doc.getRoot().findByGuid(view2.guid)
  viewer.loadDocumentNode(doc, viewables).then(i => {
    // documented loaded, any action?
    viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, (ev) => {
      // var dbIds = ev.dbIdArray;
      // $("#nObjetos").text(`${dbIds.length} Objetos seleccionados`);
      // datosSeleccion(dbIds);
    });
    viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, async (ev) => {
      getIncidenciasByStatus('Open');
      // incidencias.data.forEach(element => {
      //   $('#listaIncidencias').append(`<li class="list-group-item">${element.title}</li>`);
      // })
    });
  });

  viewer2.loadDocumentNode(doc, doc.getRoot().getSheetNodes()[0]).then(i => {
    // documented loaded, any action?
    viewer2.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, (ev) => {
      var dbIds = ev.dbIdArray;
      viewer.isolate(dbIds);
      viewer.fitToView();
    });
  });
}

function onDocumentLoadFailure(viewerErrorCode, viewerErrorMsg) {
  console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode + '\n- errorMessage:' + viewerErrorMsg);
}

function getForgeToken(callback) {
  fetch('/api/forge/oauth/token').then(res => {
    res.json().then(data => {
      callback(data.access_token, data.expires_in);
    });
  });
}
