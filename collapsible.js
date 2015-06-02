;(function ( $, window, document, undefined ) {

    "use strict";

    var pluginName = "collapsible",
        defaults = {
            classPrefix: pluginName,
            onInit: null,
            afterInit: null,
            beforeShow: null,
            afterShow: null,
            beforeHide: null,
            afterHide: null,
            showFunction: 'slideDown',
            hideFunction: 'slideUp',
            showDuration: 600,
            hideDuration: 600,
            multiselectable: true
        };

    function Plugin ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.extend(Plugin.prototype, {
        init: function () {
            var callbackStuff = {
                    panelClass: this.settings.classPrefix,
                    controlClass: this.settings.classPrefix + '-control',
                    contentClass: this.settings.classPrefix + '-content',
                    collapsedClass: this.settings.classPrefix + '--collapsed',
                    showEvent: this._name + ':show',
                    hideEvent: this._name + ':hide',
                    plugin: this
                },
                $e = $( this.element )
                        .attr( 'role', 'tablist' )
                        .attr( 'aria-multiselectable', '' + this.settings.multiselectable ),
                panels = $e.find( '.' + callbackStuff.panelClass ),
                pControls = $e.find( '.' + callbackStuff.controlClass ),
                pContents = $e.find( '.' + callbackStuff.contentClass ),
                control, content;

            if ( $.isFunction( callbackStuff.plugin.settings.onInit ) ) {
                this.settings.onInit.call( this.element, callbackStuff );
            }

            for ( var i = 0, l = panels.length; i < l; i++ ) {
                control = $( pControls[ i ] )
                    .attr( 'role', 'tab' )
                    .attr( 'tabindex', '0' );

                content = $( pContents[ i ] )
                    .attr( 'role', 'tabpanel' )
                    .on( this._name + ':hide', callbackStuff, contentHideHandler )
                    .on( this._name + ':show', callbackStuff, contentShowHandler );

                if ( $( panels[ i ] ).hasClass( callbackStuff.collapsedClass ) ) {
                    control.attr( 'aria-expanded', 'false' );
                    content.attr( 'aria-hidden', 'true' );
                } else {
                    control.attr( 'aria-expanded', 'true' );
                    content.attr( 'aria-hidden', 'false' );
                }
            }

            $e.on( 'click.' + this._name, '.' + callbackStuff.controlClass, callbackStuff, controlClickHandler );

            $e.on( 'focus.' + this._name, '.' + callbackStuff.controlClass, function controlFocusHandler ( ev ) {
                ev.preventDefault();

                $( this ).attr( 'aria-selected', 'true' );
            });

            $e.on( 'blur.' + this._name, '.' + callbackStuff.controlClass, function controlBlurHandler ( ev ) {
                ev.preventDefault();

                $( this ).attr( 'aria-selected', 'false' );
            });

            if ( $.isFunction( callbackStuff.plugin.settings.afterInit ) ) {
                this.settings.afterInit.call( this.element, callbackStuff );
            }

        }
    });

    function contentShowHandler( ev ) {
        var content = $( this );
        var callbackStuff = ev.data;

            var showFunction = callbackStuff.plugin.settings.showFunction;
            var showDuration = callbackStuff.plugin.settings.showDuration;
            var component = content.parents( '.' + callbackStuff.panelClass ).first();

            if ( $.isFunction( callbackStuff.plugin.settings.beforeShow ) ) {
                callbackStuff.plugin.settings.beforeShow.call( component[0], callbackStuff );
            }

            content[showFunction]( showDuration, function() {
                var content = $( this );
                var component = content.parents( '.' + callbackStuff.panelClass ).first();
                var control = component.find( '.' + callbackStuff.controlClass ).first();

                component.removeClass( callbackStuff.collapsedClass );
                content.attr( 'aria-hidden', 'false' );
                control.attr( 'aria-expanded', 'true' );

                if ( $.isFunction( callbackStuff.plugin.settings.afterShow ) ) {
                    callbackStuff.plugin.settings.afterShow.call( component[0], callbackStuff );
                }

            });
    }

    function contentHideHandler( ev ) {
        var content = $( this );
        var callbackStuff = ev.data;

            var hideFunction = callbackStuff.plugin.settings.hideFunction;
            var hideDuration = callbackStuff.plugin.settings.hideDuration;
            var component = content.parents( '.' + callbackStuff.panelClass ).first();

            if ( $.isFunction( callbackStuff.plugin.settings.beforeHide ) ) {
                callbackStuff.plugin.settings.beforeHide.call( component[0], callbackStuff );
            }

            content[hideFunction]( hideDuration, function() {
                var content = $( this );
                var component = content.parents( '.' + callbackStuff.panelClass ).first();
                var control = component.find( '.' + callbackStuff.controlClass ).first();

                component.addClass( callbackStuff.collapsedClass );
                content.attr( 'aria-hidden', 'true' );
                control.attr( 'aria-expanded', 'false' );

                if ( $.isFunction( callbackStuff.plugin.settings.afterHide ) ) {
                    callbackStuff.plugin.settings.afterHide.call( component[0], callbackStuff );
                }

            });
    }

    function controlClickHandler ( ev ) {
        ev.preventDefault();

        callbackStuff = ev.data;

        var callbackStuff = ev.data;
        var multiselectable = callbackStuff.plugin.settings.multiselectable;

        var component = $( this ).parents( '.' + callbackStuff.panelClass ).first();
        var content = component.find( '.' + callbackStuff.contentClass ).first();

        if ( component.hasClass( callbackStuff.collapsedClass ) ) {

            if ( !multiselectable ) {
                $( callbackStuff.plugin.element )
                    .find( '.' + callbackStuff.contentClass ).not( content )
                    .trigger( callbackStuff.hideEvent );
            }

            console.log( "call: " + callbackStuff.plugin._name + ':show' );
            content.trigger( callbackStuff.showEvent );

        } else if ( multiselectable ) {
            console.log( "call: " + callbackStuff.plugin._name + ':hide' );
            content.trigger( callbackStuff.hideEvent );

        }

    }

    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };

})( jQuery, window, document );
