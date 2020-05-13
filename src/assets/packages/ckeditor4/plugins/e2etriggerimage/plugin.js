( function() {
	CKEDITOR.plugins.add( 'e2etriggerimage', {
    icons: 'e2etriggerimage',
    require:['ajax'],
		init: function( editor ) {

      //we add the definition of our widget to ckeditor.
      editor.widgets.add( 'e2etriggerimage', {
        //set the text that is going to be saved (that's what you see in source mode)
        //it replace the widget you see in wysywig mode with the text you want to save in database instead of the widget html
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

    //afterInit will be used to define what we want see in wysywig editor for a given pattern
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

            var imageUrl = matchWithoutBracket;
            //TODO: set imageUrl with result of ajax call to api that will return image url. jquery works here $.ajax(...)
            //another way to do ajax call is CKEDITOR.ajax.load(...)

						// Creating widget code.
            //define the element that will appear in widget container in wysywig editor
            innerElement = new CKEDITOR.htmlParser.element( 'img', {
              'class': 'imagewidget',
              'src': imageUrl,

            } );



            //wrap the innerElement within a "widget container",
            //specifying it's for e2etriggerimage widget
						var widgetElement = editor.widgets.wrapElement( innerElement, 'e2etriggerimage' );

						// Return outerhtml of widget element so it will be placed
						// as replacement in wysywig.
						return widgetElement.getOuterHtml();
					} );
				}
			} );
    }
	} );
} )();
