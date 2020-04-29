 /**
  * this plugin is derived from a11yhelp plugin from ckeditor.
  * it adds the ability to have a button in the toolbar to show the accessibility help dialog
  */
( function() {
	var pluginName = 'e2ea11yhelp',
		commandName = 'e2ea11yHelp';

	CKEDITOR.plugins.add( pluginName, {
		requires: 'a11yhelp',
    icons: 'e2ea11yhelp',
		init: function( editor ) {
      editor.ui.addButton( 'E2EA11yHelp', {
        label: 'Shortcut Key Legend',
        command: 'a11yHelp',
        toolbar: 'tools'
      });
		}
	} );
} )();
