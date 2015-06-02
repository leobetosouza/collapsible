# Collapsible jQuery Plugin

A jQuery extensible plugin to make accordions and tabs.

Yet without tests.

## Examples

### Simple accordion

```html
<div class="panels">
    <h2 class="panel-collapsible-control" id="panel-header-01">Panel 1</h2>
    <div class="panel-collapsible panel-collapsible--collapsed">
        Closed first panel content.
    </div>
    <h2 class="panel-collapsible-control" id="panel-header-02">Panel 2</h2>
    <div class="panel-collapsible">
        Oppened second panel content
    </div>
</div>
```

```javascript
$( '.panels' ).collapsible({ classPrefix: 'panel-collapsible' });

```

### Accordion with personalized controls and summary

```html
<section class="summary-panels">
    <div class="sum-panel sum-panel--collapsed">
        <div class="sum-panel-summary">
            Summary of content
        </div>
        <div class="sum-panel-content">
            Content
        </div>
    </div>
    <div class="sum-panel sum-panel--collapsed">
        <div class="sum-panel-summary">
            Summary of content
        </div>
        <div class="sum-panel-content">
            Content
        </div>
    </div>
</section>
```

```javascript
$( '.well-collapsible-main' ).collapsible({
    classPrefix: 'sum-collapsible',
    onInit: function ( callbackStuff ) {
        $( this ).find( '.' + callbackStuff.panelClass ).each(function () {
            var panel = $( this ).prepend('<button class="' + callbackStuff.controlClass + '" title="Expandir"></button>');

            if ( panel.hasClass( callbackStuff.collapsedClass ) ) {

                panel.find( '.' + callbackStuff.panelClass + '-summary' ).show().attr( 'aria-hidden', 'false' );

            } else {

                panel.find( '.' + callbackStuff.panelClass + '-summary' ).hide().attr( 'aria-hidden', 'true' );

            }

        });
    },
    beforeHide: function( callbackStuff ) {
        $( this ).find( '.' + callbackStuff.panelClass + '-summary' ).slideDown();
    },
    beforeShow: function( callbackStuff ) {
        $( this ).find( '.' + callbackStuff.panelClass + '-summary' ).slideUp();
    }
});
```

### Respondsive Tabs (On big screens: Tabs; On small screens: accordion)

```html
<div class="responsive-tabs">

    <div class="responsive-tab">
        <h2 class="responsive-tab-control" id="tab-header-01">First Tab</h2>
        <div class="responsive-tab-content" aria-labelledby="tab-header-01">
            First Tab Content
        </div>
    </div>


    <div class="responsive-tab responsive-tab--collapsed">
        <h2 class="responsive-tab-control" id="tab-header-06">Second Tab</h2>
        <div class="responsive-tab-content" aria-labelledby="tab-header-06">
            Second Tab Content
        </div>
    </div>

</div>
```

```css
.responsive-tab-control {
    display: none;
}
.responsive-tabs .tab-control {
    display: block;
}

@media (min-width: 960px) {
    .responsive-tab-control {
        display: block;
    }
    .responsive-tabs .tab-control {
        display: none;
    }

}
```

```javascript
$( '.responsive-tabs' ).collapsible({
    classPrefix: 'responsive-tab',
    multiselectable: false,
    onInit: function( callbackStuff ) {
        var tabs = $( '<ul class="tab-controls"></ul>' );
        var component = $( this ).find( '.' + callbackStuff.controlClass ).each(function() {
            tabs.append( '<li><a href="#' + this.id + '">' + $( this ).text() + '</a></li>' );
        }).end();

        tabs.on( 'click', 'a', function( ev ) {
            ev.preventDefault();
            $( this.hash ).click();
        });

        component.prepend( tabs );
    },
    afterInit: function( callbackStuff ) {
        var panels = $( this ).find( '.' + callbackStuff.panelClass );
        var activePanel = panels.not( '.' + callbackStuff.collapsedClass ).first();

        if ( !activePanel.length ) {
            activePanel = panels.first();
        }

        panels.not( activePanel ).each(function () {
            $( this ).find( '.' + callbackStuff.contentClass ).trigger( callbackStuff.hideEvent );
        });

        activePanel.find( '.' + callbackStuff.contentClass ).trigger( callbackStuff.showEvent )

    },
    afterHide: function( callbackStuff ) {
        var id = $( this ).find( '.' + callbackStuff.controlClass ).first()[0].id;
        $( 'a[href="#' + id + '"' ).removeClass( 'selected' ).attr( 'aria-expanded', 'false' );
    },
    afterShow: function( callbackStuff ) {
        var id = $( this ).find( '.' + callbackStuff.controlClass ).first()[0].id;
        $( 'a[href="#' + id + '"' ).addClass( 'selected' ).attr( 'aria-expanded', 'true' );
    }
});
```

## Milestones

* Better accessibility
* Tests
* Automation (linting, code compression, tests)