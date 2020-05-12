 /**
  * this plugin is derived from a11yhelp plugin from ckeditor.
  * it adds the ability to have a button in the toolbar to show the accessibility help dialog
  */
( function() {
	CKEDITOR.plugins.add( 'e2etriggerimage', {
    icons: 'e2etriggerimage',
		init: function( editor ) {

      editor.widgets.add( 'e2etriggerimage', {
				//defines what element of editor is your widget
				template: '<img class="imagewidget"></img>',

        //set the text that is going to be saved (that's what you see in source mode)
				downcast: function() {
					return new CKEDITOR.htmlParser.text( '[[' + this.data.image + ']]' );
        },
        //initialize this.data.image with the content inside the "src" attribute of your <img> tag
        init: function() {
          this.setData( 'image', $(this.element)[0].getAttribute("src") );
				}
			});

      //define a command that can be called by the plugin button
      editor.addCommand( 'e2eTriggerImage', {
        exec: function( editor ) {
          console.log('image button command: ' + editor.container);
          //fire event
          editor.fire('imageevent');
        }
      });

      //define a button that can be added to the toolbar
      //'E2ETriggerImage' will be Button Name used when defining toolbar in config
      editor.ui.addButton( 'E2ETriggerImage', {
        label: 'Image',
        command: 'e2eTriggerImage',
        toolbar: 'tools'
      });
    },
    afterInit: function( editor ) {
			var widgetReplaceRegex = /\[\[([^\[\]])+\]\]/g;

			editor.dataProcessor.dataFilter.addRules( {
				text: function( text, node ) {
					var dtd = node.parent && CKEDITOR.dtd[ node.parent.name ];

          //[VY] i don't understand this condition
					// Skip the case when widget is in elements like <title> or <textarea>
					// but upcast placeholder in custom elements (no DTD).
					if ( dtd && !dtd.span )
						return;

          //replace the [[imageUrl]] with an <img> tag in editor mode
					return text.replace( widgetReplaceRegex, function( match ) {
            var matchWithoutBracket = match.slice( 2, -2 );
            debugger;
						// Creating widget code.
						var widgetWrapper = null,
							innerElement = new CKEDITOR.htmlParser.element( 'img', {
                'class': 'imagewidget',
                'src': matchWithoutBracket,

              } );


						widgetWrapper = editor.widgets.wrapElement( innerElement, 'e2etriggerimage' );

						// Return outerhtml of widget wrapper so it will be placed
						// as replacement.
						return widgetWrapper.getOuterHtml();
					} );
				}
			} );
    }
	} );
} )();
