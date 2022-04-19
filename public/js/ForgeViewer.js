var viewer;
var viewer2;
var guidPlano1 = 'c8d162f9-b2d8-4c01-881c-0e54803db1c1-000e8f3f';
var guidPlano2 = '831920d5-bb61-4772-b216-389d5dac2f92-000e9787';
var guidPlano3 = '831920d5-bb61-4772-b216-389d5dac2f92-000e9801';

const launchViewer = async () => {
  var options = { env: 'AutodeskProduction', getAccessToken: getForgeToken };
  // var urn = await getModelUrnAsync();
  // var urn = "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm1qbGZncHI4NHV3eDYzZnNtY2htNHFkb2phb2F3b2MtYnVja2V0ZW1lYS9WaXZpZW5kYXMucnZ0";
  var urn = "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm1qbGZncHI4NHV3eDYzZnNtY2htNHFkb2phb2F3b2MtcHJ1ZWJhL2Nhc2l0YWZpbmFsLnJ2dA==";

  Autodesk.Viewing.Initializer(options, () => {
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), { extensions: ['Extension', 'Autodesk.DocumentBrowser'] });
    // viewer2 = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer2'), { extensions: ['Autodesk.DocumentBrowser'] });
    viewer.start();
    // viewer2.start();
    var documentId = 'urn:' + urn;
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure, {
      webglInitParams: {
        useWebGL2: false
      }
    });
  });
}

function onDocumentLoadSuccess(doc) {
  console.log(doc);
  // var viewables = doc.getRoot().findByGuid("b53cac9e-bfde-9118-f21c-a7dfbb845bef");
  var viewables = doc.getRoot().findByGuid("c884ae1b-61e7-4f9d-0001-719e20b22d0b-000ea649");
  viewer.loadDocumentNode(doc, viewables, { skipHiddenFragments: false }).then(i => {
    viewer.fitToView();
    // documented loaded, any action?
    viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, (ev) => {
      // datosSeleccion(dbIds);
    });
    viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, async (ev) => {
      loadSensors();
    });
  });
}

function onDocumentLoadFailure(viewerErrorCode, viewerErrorMsg) {
  console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode + '\n- errorMessage:' + viewerErrorMsg);
}

const launchViewer2 = async (piso) => {
  var options = { env: 'AutodeskProduction', getAccessToken: getForgeToken };
  // var urn = await getModelUrnAsync();
  // var urn = "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm1qbGZncHI4NHV3eDYzZnNtY2htNHFkb2phb2F3b2MtYnVja2V0ZW1lYS9WaXZpZW5kYXMucnZ0";
  var urn = "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm1qbGZncHI4NHV3eDYzZnNtY2htNHFkb2phb2F3b2MtcHJ1ZWJhL2Nhc2l0YWZpbmFsLnJ2dA==";

  Autodesk.Viewing.Initializer(options, () => {
    viewer2 = new Autodesk.Viewing.GuiViewer3D(document.getElementById('viewer2D'), { extensions: ['Autodesk.DocumentBrowser'] });
    viewer2.start();
    var documentId = 'urn:' + urn;
    switch (piso){
      case 1: Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccessPlanta1, onDocumentLoadFailure2, {
        webglInitParams: {
          useWebGL2: false
        }
      });
      break;
      case 2: Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccessPlanta2, onDocumentLoadFailure2, {
        webglInitParams: {
          useWebGL2: false
        }
      });
      break;
      case 3: Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccessPlanta3, onDocumentLoadFailure2, {
        webglInitParams: {
          useWebGL2: false
        }
      });
      break;
    }
  });
}

function onDocumentLoadSuccessPlanta1(doc) {
  console.log(doc);
  var viewables = doc.getRoot().findByGuid(guidPlano1);
  viewer2.loadDocumentNode(doc, viewables, { skipHiddenFragments: false }).then(i => {
    viewer2.fitToView();
    // documented loaded, any action?
    viewer2.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, (ev) => {
    });
    viewer2.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, async (ev) => {
      loadSensors();
    });
  });
}

function onDocumentLoadSuccessPlanta2(doc) {
  console.log(doc);
  var viewables = doc.getRoot().findByGuid(guidPlano2);
  viewer2.loadDocumentNode(doc, viewables, { skipHiddenFragments: false }).then(i => {
    viewer2.fitToView();
    // documented loaded, any action?
    viewer2.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, (ev) => {
    });
    viewer2.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, async (ev) => {
      loadSensors();
    });
  });
}

function onDocumentLoadSuccessPlanta3(doc) {
  console.log(doc);
  var viewables = doc.getRoot().findByGuid(guidPlano3);
  viewer2.loadDocumentNode(doc, viewables, { skipHiddenFragments: false }).then(i => {
    viewer2.fitToView();
    // documented loaded, any action?
    viewer2.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, (ev) => {
    });
    viewer2.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, async (ev) => {
      loadSensors();
    });
  });
}

function onDocumentLoadFailure2(viewerErrorCode, viewerErrorMsg) {
  console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode + '\n- errorMessage:' + viewerErrorMsg);
}

function getForgeToken(callback) {
  fetch('/api/forge/oauth/token').then(res => {
    res.json().then(data => {
      callback(data.access_token, data.expires_in);
    });
  });
};