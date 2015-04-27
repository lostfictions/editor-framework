(function () {

// only window open with panelID needs send request
if ( Editor.argv.panelID ) {
    Editor.sendRequestToCore('panel:query-info', Editor.argv.panelID, function ( panelInfo ) {
        var Path = require('fire-path');
        var viewPath = Path.join( panelInfo.path, panelInfo.view );

        Editor.Panel.load( viewPath,
                           Editor.argv.panelID,
                           panelInfo,
                           function ( err, viewEL ) {
                               if ( panelInfo.type === 'dockable' ) {
                                   var dock = new EditorUI.Dock();
                                   dock.setAttribute('no-collapse', '');
                                   dock.classList.add('fit');

                                   var panel = new EditorUI.Panel();
                                   panel.add(viewEL);
                                   panel.select(0);

                                   Polymer.dom(dock).appendChild(panel);
                                   document.body.appendChild(dock);

                                   EditorUI.DockUtils.root = dock;
                               }
                               else {
                                   document.body.appendChild(viewEL);

                                   EditorUI.DockUtils.root = viewEL;
                               }
                               EditorUI.DockUtils.reset();

                               Editor.sendToCore( 'panel:ready', Editor.argv.panelID );

                               // save layout after css layouted
                               window.requestAnimationFrame ( function () {
                                   Editor.sendToCore( 'window:save-layout',
                                                      Editor.Panel.getLayout(),
                                                      Editor.requireIpcEvent );
                               });
                           });
    } );
}

})();
