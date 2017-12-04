/*
 * jQuery Mobile Framework : plugin to provide number spinbox.
 * Copyright (c) JTSage
 * CC 3.0 Attribution.  May be relicensed without permission/notification.
 * https://github.com/jtsage/jquery-mobile-spinbox
 */

(function($) {
    $.widget( "mobile.spinbox", {
        options: {
            // All widget options
            dmin: false,
            dmax: false,
            step: false,
            theme: false,
            mini: null,
            repButton: true,
            version: "1.4.4-2014091500",
            initSelector: "input[data-role='spinbox']",
            clickEvent: "vclick",
            type: "horizontal", // or vertical
        },
        _sbox_run: function () {
            //console.log("_sbox_run");
            var w = this,
                timer = 150;
                
            if ( w.g.cnt > 10 ) { timer = 100; }
            if ( w.g.cnt > 30 ) { timer = 50; }
            if ( w.g.cnt > 60 ) { timer = 20; }
            
            w.g.didRun = true;
            w._offset( this, w.g.delta );
            w.g.cnt++;
            w.runButton = setTimeout( function() { w._sbox_run(); }, timer );
        },
        _offset: function( obj, step, direction ) {
            //console.log("_offset");
            var tmp,
                w = this,
                o = this.options;
                
            if ( !w.disabled ) {
                if ( direction < 1 ) {
                    tmp = parseInt( w.d.input.val(), 10 ) - step;
                    if ( tmp >= o.dmin ) { 
                        w.d.input.val( tmp ).trigger( "change" );
                    } else {
                        Toast.toast("Min: " + o.dmin);
                    }
                } else {
                    tmp = parseInt( w.d.input.val(), 10 ) + step;
                    if ( tmp <= o.dmax ) { 
                        w.d.input.val( tmp ).trigger( "change" );
                    } else {
                        Toast.toast("Max: " + o.dmax);
                    }
                }
            }
        },
        _tally: function() {
            //console.log("_tally");
            var tmp,
                w = this,
                o = this.options,
                id=w.d.input.attr("id");
                
                //console.log(w);
                //console.log(0);
                //console.log(w.d);
                //console.log(w.d.input);
                
                
                    //console.log("Tally click " + id);
                    tmp = parseFloat(w.d.input.val());
                    //console.log("tmp: " + tmp);
                    var total = parseFloat($('#total' + id).val());
                    //console.log("total: " + total);
                    var newTotal = tmp + total;
                    //console.log("newTotal: " + newTotal);
                    //console.log("o.dmax: " + o.dmax);
                    if (tmp <= o.dmax && newTotal <= o.dmax) {
                        w.d.input.val(0);
                        Toast.toastMini("Added " + tmp);
                        $('#total' + id).val(newTotal);
                        app.addScoreTally(id, tmp);
                        w.d.input.trigger('change');
                    } else {
                        //console.log("max");
                        w.d.input.val(o.dmax);
                        w.d.input.trigger('change');
                    }  
        },
        _tallyHistory: function() {
            //console.log("_tallyHistory");
            var tmp,
                w = this,
                o = this.options,
                id=w.d.input.attr("id");
                
                //console.log("TallyHistory click " + id);
                    var s = "";
                    var ob = app.currGameDetails.tallyHistory;
                    var l = ob.length;
                    var bFound=false;
                    var p;
                    var pad=0;
                    //console.log("padlength: " + l);
                    
                    for (var i = 0; i < l; i++) {
                        p = ob[i];
                        //console.log(p);
                        //console.log(id);
                        if (p.id == id) {
                            var m = p.history.length;
                            if ( m < 10) {
                                pad = 1;
                            } else if (m < 100) {
                                pad = 2;
                            } else if (m < 1000) {
                                pad = 3;
                            } else {
                                pad = 4;
                            }
                            for (var j = 0; j < m; j++) {
                                s += "Turn " + doPad((j + 1).toString(), pad) + ": ";
                                s += p.history[j];
                                if (j < m - 1) {
                                    s += "<BR>";
                                }
                            }
                            Toast.toastLeft(s);
                            bFound = true;
                            break;
                        }
                    }
                    if (l === 0 || bFound === false) {
                        s += " None";
                        Toast.toast(s);
                    }
        },
        _create: function() {
            //console.log("_create");
            var w = this,
                o = $.extend( this.options, this.element.data( "options" ) ),
                d = {
                    input: this.element,
                    inputWrap: this.element.parent()
                },
                touch = ( typeof window.ontouchstart !== "undefined" ),
                drag =  {
                    eStart : (touch ? "touchstart" : "mousedown")+".spinbox",
                    eMove  : (touch ? "touchmove" : "mousemove")+".spinbox",
                    eEnd   : (touch ? "touchend" : "mouseup")+".spinbox",
                    eEndA  : (touch ? 
                        "mouseup.spinbox touchend.spinbox touchcancel.spinbox touchmove.spinbox" :
                        "mouseup.spinbox"
                    ),
                    move   : false,
                    start  : false,
                    end    : false,
                    pos    : false,
                    target : false,
                    delta  : false,
                    tmp    : false,
                    cnt    : 0
                };
                
            w.d = d;
            w.g = drag;
            
            o.theme = ( ( o.theme === false ) ?
                    $.mobile.getInheritedTheme( this.element, "a" ) :
                    o.theme
                );
            
            if ( w.d.input.prop( "disabled" ) ) {
                o.disabled = true;
            }
            
            if ( o.dmin === false ) { 
                o.dmin = ( typeof w.d.input.attr( "min" ) !== "undefined" ) ?
                    parseInt( w.d.input.attr( "min" ), 10 ) :
                    Number.MAX_VALUE * -1;
            }
            if ( o.dmax === false ) { 
                o.dmax = ( typeof w.d.input.attr( "max" ) !== "undefined" ) ?
                    parseInt(w.d.input.attr( "max" ), 10 ) :
                    Number.MAX_VALUE;
            }
            if ( o.step === false) {
                o.step = ( typeof w.d.input.attr( "step") !== "undefined" ) ?
                    parseInt( w.d.input.attr( "step" ), 10 ) :
                    1;
                }
            
            o.mini = Globals.bMini;
            
            //o.mini = ( o.mini === null ? 
             //   ( w.d.input.data("mini") ? true : false ) :
               // o.mini );
                
            
            w.d.wrap = $( "<div>", {
                    "data-role": "controlgroup",
                    "data-type": o.type,
                    "data-mini": o.mini,
                    "data-theme": o.theme
                } )
                .insertBefore( w.d.inputWrap )
                .append( w.d.inputWrap );
            
            w.d.inputWrap.addClass( "ui-btn" );
            w.d.input.css( { textAlign: "center" } );
            
            if ( o.type !== "vertical" ) {
                w.d.inputWrap.css( { 
                    padding: o.mini ? "1px 0" : "4px 0 3px" 
                } );
                w.d.input.css( { 
                    width: o.mini ? "60px" : "80px",
                    height: o.mini ? "22px" : "35px"
                } );
            } else {
                w.d.wrap.css( { 
                    width: "auto"
                } );
                w.d.inputWrap.css( {
                    padding: 0
                } );
            }
            
            w.d.up = $( "<div>", {
                "class": "ui-btn ui-icon-plus ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.upHalf = $( "<div>", {
                "class": "ui-btn ui-icon-myapp-half ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.up5 = $( "<div>", {
                "class": "ui-btn ui-icon-myapp-5 ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.up10 = $( "<div>", {
                "class": "ui-btn ui-icon-myapp-10 ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.up50 = $( "<div>", {
                "class": "ui-btn ui-icon-myapp-50 ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.up100 = $( "<div>", {
                "class": "ui-btn ui-icon-myapp-100 ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.up500 = $( "<div>", {
                "class": "ui-btn ui-icon-myapp-500 ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.up1000 = $( "<div>", {
                "class": "ui-btn ui-icon-myapp-1000 ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.up5000 = $( "<div>", {
                "class": "ui-btn ui-icon-myapp-5000 ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.up10000 = $( "<div>", {
                "class": "ui-btn ui-icon-myapp-10000 ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.tally = $( "<div>", {
                "theme": "g",
                "class": "ui-btn ui-icon-action ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.tallyHistory = $( "<div>", {
                "class": "ui-btn ui-icon-info ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.down = $( "<div>", {
                "class": "ui-btn ui-icon-minus ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.downHalf = $( "<div>", {
                "class": "ui-btn ui-icon-myapp-half ui-btn-icon-notext"
            }).html( "&nbsp;" );
     
            w.d.down5 = $( "<div>", {
                "class": "ui-btn ui-icon-myapp-5 ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.down10 = $( "<div>", {
                "class": "ui-btn ui-icon-myapp-10 ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.down50 = $( "<div>", {
                "class": "ui-btn ui-icon-myapp-50 ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.down100 = $( "<div>", {
                "class": "ui-btn ui-icon-myapp-100 ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.down500 = $( "<div>", {
                "class": "ui-btn ui-icon-myapp-500 ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.down1000 = $( "<div>", {
                "class": "ui-btn ui-icon-myapp-1000 ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.down5000 = $( "<div>", {
                "class": "ui-btn ui-icon-myapp-5000 ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.down10000 = $( "<div>", {
                "class": "ui-btn ui-icon-myapp-10000 ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.tally = $( "<div>", {
                "class": "ui-btn ui-icon-action ui-body-d ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            w.d.tallyHistory = $( "<div>", {
                "class": "ui-btn ui-icon-info ui-btn-icon-notext"
            }).html( "&nbsp;" );
            
            //SUBTRACTION
            
            if (w.d.input.attr('data-buttonm1') !== 'false') {
                w.d.wrap.prepend(w.d.down);
            }
            
            if (w.d.input.attr('data-buttonmhalf') === 'true') {
                w.d.wrap.prepend(w.d.downHalf);
            }
            
            if (w.d.input.attr('data-buttonm5') === 'true') {
                w.d.wrap.prepend(w.d.down5);
            }
            
            if (w.d.input.attr('data-buttonm10') === 'true') {
                w.d.wrap.prepend(w.d.down10);
            }
            
            if (w.d.input.attr('data-buttonm50') === 'true') {
                w.d.wrap.prepend(w.d.down50);
            }
            
            if (w.d.input.attr('data-buttonm100') === 'true') {
                w.d.wrap.prepend(w.d.down100);
            }
            
            if (w.d.input.attr('data-buttonm500') === 'true') {
                w.d.wrap.prepend(w.d.down500);
            }
            
            if (w.d.input.attr('data-buttonm1000') === 'true') {
                w.d.wrap.prepend(w.d.down1000);
            }
            
            if (w.d.input.attr('data-buttonm5000') === 'true') {
                w.d.wrap.prepend(w.d.down5000);
            }
            
            if (w.d.input.attr('data-buttonm10000') == 'true') {
                w.d.wrap.prepend(w.d.down10000);
            }
            
            //ADDITION
            
            if (w.d.input.attr('data-button1') !== 'false') {
                w.d.wrap.append(w.d.up);
            }
            
            if (w.d.input.attr('data-buttonhalf') === 'true') {
                w.d.wrap.append(w.d.upHalf);
            }
            
            if (w.d.input.attr('data-button5') !== 'false') {
                w.d.wrap.append(w.d.up5);
            }
            
            if (w.d.input.attr('data-button10') !== 'false') {
                w.d.wrap.append(w.d.up10);
            }
            
            if (w.d.input.attr('data-button50') === 'true') {
                w.d.wrap.append(w.d.up50);
            }
            
            if (w.d.input.attr('data-button100') === 'true') {
                w.d.wrap.append(w.d.up100);
            }
            
            if (w.d.input.attr('data-button500') === 'true') {
                w.d.wrap.append(w.d.up500);
            }
            
            if (w.d.input.attr('data-button1000') === 'true') {
                w.d.wrap.append(w.d.up1000);
            }
            
            if (w.d.input.attr('data-button5000') === 'true') {
                w.d.wrap.append(w.d.up5000);
            }
            
            if (w.d.input.attr('data-button10000') == 'true') {
                w.d.wrap.append(w.d.up10000);
            }
            
            if (w.d.input.attr('data-tally') == 'true') {
                w.d.wrap.append(w.d.tally);
                w.d.wrap.append(w.d.tallyHistory);
                w.d.wrap.append(w.d.tallyPlaceholder);
            }
            
            w.d.wrap.controlgroup();
            
            if ( o.repButton === false ) {
                w.d.up.on( o.clickEvent, function(e) { 
                    e.preventDefault();
                    w._offset( e.currentTarget, 1, 1 ); 
                });
                w.d.down.on( o.clickEvent, function(e) {
                    e.preventDefault();
                    w._offset( e.currentTarget, 1, -1 );
                });
                
                w.d.upHalf.on( o.clickEvent, function(e) { 
                    e.preventDefault();
                    w._offset( e.currentTarget, .5, 1 ); 
                });
                w.d.downHalf.on( o.clickEvent, function(e) {
                    e.preventDefault();
                    w._offset( e.currentTarget, .5, -1 );
                });
                
                w.d.up5.on( o.clickEvent, function(e) { 
                    e.preventDefault();
                    w._offset( e.currentTarget, 5, 1 ); 
                });
                w.d.down5.on( o.clickEvent, function(e) {
                    e.preventDefault();
                    w._offset( e.currentTarget, 5, -1 );
                });
                
                w.d.up10.on( o.clickEvent, function(e) { 
                    e.preventDefault();
                    w._offset( e.currentTarget, 10, 1 ); 
                });
                w.d.down10.on( o.clickEvent, function(e) {
                    e.preventDefault();
                    w._offset( e.currentTarget, 10, -1 );
                });
                
                w.d.up50.on( o.clickEvent, function(e) { 
                    e.preventDefault();
                    w._offset( e.currentTarget, 50, 1 ); 
                });
                w.d.down50.on( o.clickEvent, function(e) {
                    e.preventDefault();
                    w._offset( e.currentTarget, 50, -1 );
                });
                
                w.d.up100.on( o.clickEvent, function(e) { 
                    e.preventDefault();
                    w._offset( e.currentTarget, 100, 1 ); 
                });
                w.d.down100.on( o.clickEvent, function(e) {
                    e.preventDefault();
                    w._offset( e.currentTarget, 100, -1 );
                });
                
                w.d.up500.on( o.clickEvent, function(e) { 
                    e.preventDefault();
                    w._offset( e.currentTarget, 500, 1 ); 
                });
                w.d.down500.on( o.clickEvent, function(e) {
                    e.preventDefault();
                    w._offset( e.currentTarget, 500, -1 );
                });
                
                w.d.up1000.on( o.clickEvent, function(e) { 
                    e.preventDefault();
                    w._offset( e.currentTarget, 1000, 1 ); 
                });
                w.d.down1000.on( o.clickEvent, function(e) {
                    e.preventDefault();
                    w._offset( e.currentTarget, 1000, -1 );
                });
                
                w.d.up5000.on( o.clickEvent, function(e) { 
                    e.preventDefault();
                    w._offset( e.currentTarget, 5000, 1 ); 
                });
                w.d.down5000.on( o.clickEvent, function(e) {
                    e.preventDefault();
                    w._offset( e.currentTarget, 5000, -1 );
                });
                
                w.d.up10000.on( o.clickEvent, function(e) { 
                    e.preventDefault();
                    w._offset( e.currentTarget, 10000, 1 ); 
                });
                w.d.down10000.on( o.clickEvent, function(e) {
                    e.preventDefault();
                    w._offset( e.currentTarget, 10000, -1 );
                });
                
                w.d.tally.on(o.clickEvent, function(e) {
                    //console.log("clicktally");
                    e.preventDefault();
                    w._tally( e.currentTarget);
                });

            w.d.tallyHistory.on(o.clickEvent, function(e) {
                e.preventDefault();
                w._tallyHistory( e.currentTarget);
            });
                
                
            } else {
                //console.log("else");
                //start
                w.d.up.on( w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._offset( e.currentTarget, 1, 1 );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = 1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.down.on(w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._offset( e.currentTarget, 1, -1 );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = -1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.up.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                w.d.down.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                // end 
                
                //start
                w.d.upHalf.on( w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._offset( e.currentTarget, .5, 1 );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = 1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.downHalf.on(w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._offset( e.currentTarget, .5, -1 );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = -1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.upHalf.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                w.d.downHalf.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                // end 
                
                //start
                w.d.up5.on( w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._offset( e.currentTarget, 5, 1 );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = 1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.down5.on(w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._offset( e.currentTarget, 5, -1 );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = -1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.up5.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                w.d.down5.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                // end 
                
                //start
                w.d.up10.on( w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._offset( e.currentTarget, 10, 1 );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = 1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.down10.on(w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._offset( e.currentTarget, 10, -1 );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = -1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.up10.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                w.d.down10.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                // end 
                
                //start
                w.d.up50.on( w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._offset( e.currentTarget, 50, 1 );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = 1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.down50.on(w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._offset( e.currentTarget, 50, -1 );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = -1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.up50.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                w.d.down50.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                // end 
                
                //start
                w.d.up100.on( w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._offset( e.currentTarget, 100, 1 );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = 1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.down100.on(w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._offset( e.currentTarget, 100, -1 );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = -1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.up100.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                w.d.down100.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                // end 
                
                //start
                w.d.up500.on( w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._offset( e.currentTarget, 500, 1 );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = 1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.down500.on(w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._offset( e.currentTarget, 500, -1 );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = -1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.up500.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                w.d.down500.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                // end 
                
                //start
                w.d.up1000.on( w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._offset( e.currentTarget, 1000, 1 );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = 1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.down1000.on(w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._offset( e.currentTarget, 1000, -1 );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = -1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.up1000.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                w.d.down1000.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                // end 
                
                //start
                w.d.up5000.on( w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._offset( e.currentTarget, 5000, 1 );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = 1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.down5000.on(w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._offset( e.currentTarget, 5000, -1 );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = -1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.up5000.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                w.d.down5000.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                
                
                //start
                w.d.up10000.on( w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._offset( e.currentTarget, 10000, 1 );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = 1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.down10000.on(w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._offset( e.currentTarget, 10000, -1 );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = -1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.up10000.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                w.d.down10000.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                w.d.tally.on(w.g.eEndA, function(e) {
                    if ( w.g.move ) {
                        e.preventDefault();
                        clearTimeout( w.runButton );
                        w.runButton = false;
                        w.g.move = false;
                    }
                });
                
                w.d.tally.on( w.g.eStart, function(e) {
                    w.d.input.blur();
                    w._tally( e.currentTarget );
                    w.g.move = true;
                    w.g.cnt = 0;
                    w.g.delta = 1;
                    if ( !w.runButton ) {
                        w.g.target = e.currentTarget;
                        w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    }
                });
                
                w.d.tallyHistory.on(w.g.eEndA, function(e) {
                    // if ( w.g.move ) {
                        // e.preventDefault();
                        // clearTimeout( w.runButton );
                        // w.runButton = false;
                        // w.g.move = false;
                    // }
                });
                
                w.d.tallyHistory.on( w.g.eStart, function(e) {
                   
                    w._tallyHistory( e.currentTarget );
                    // w.g.move = true;
                    // w.g.cnt = 0;
                    // w.g.delta = 1;
                    // if ( !w.runButton ) {
                        // w.g.target = e.currentTarget;
                        // w.runButton = setTimeout( function() { w._sbox_run(); }, 500 );
                    // }
                });
                
                // end 
                
                // end 
            }
            
            if ( typeof $.event.special.mousewheel !== "undefined" ) { 
                // Mousewheel operation, if plugin is loaded
                w.d.input.on( "mousewheel", function(e,d) {
                    e.preventDefault();
                    w._offset( e.currentTarget, ( d < 0 ? -1 : 1 ) );
                });
            }
            
            if ( o.disabled ) {
                w.disable();
            }
            
            // var id=w.d.input.attr("id");
            // //console.log("id: " + id);
            // $('#' + id).autoGrowInput({minWidth:30,comfortZone:30});
            
        },
        disable: function(){
            //console.log("disable");
            // Disable the element
            var dis = this.d,
                cname = "ui-state-disabled";
            
            dis.input.attr( "disabled", true ).blur();
            dis.inputWrap.addClass( cname );
            dis.up.addClass( cname );
            dis.down.addClass( cname );
            this.options.disabled = true;
        },
        enable: function(){
            //console.log("enable");
            // Enable the element
            var dis = this.d,
                cname = "ui-state-disabled";
            
            dis.input.attr( "disabled", false );
            dis.inputWrap.removeClass( cname );
            dis.up.removeClass( cname );
            dis.down.removeClass( cname );
            this.options.disabled = false;
        }
    });
})( jQuery );