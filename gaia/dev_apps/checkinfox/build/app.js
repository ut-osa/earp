
// lib\onyx\version.js
enyo && enyo.version && (enyo.version.onyx = "2.4.0-pre.2");

// lib\onyx\source\Icon.js
enyo.kind({
    name: "onyx.Icon",
    published: {
        src: "",
        disabled: !1
    },
    classes: "onyx-icon",
    create: function() {
        this.inherited(arguments), this.src && this.srcChanged(), this.disabledChanged();
    },
    disabledChanged: function() {
        this.addRemoveClass("disabled", this.disabled);
    },
    srcChanged: function() {
        this.applyStyle("background-image", "url(" + enyo.path.rewrite(this.src) + ")");
    }
});

// lib\onyx\source\Button.js
enyo.kind({
    name: "onyx.Button",
    kind: "enyo.Button",
    classes: "onyx-button enyo-unselectable",
    handlers: {
        ondown: "down",
        onenter: "enter",
        ondragfinish: "dragfinish",
        onleave: "leave",
        onup: "up"
    },
    down: function() {
        this.addClass("pressed"), this._isPressed = !0;
    },
    enter: function() {
        this._isPressed && this.addClass("pressed");
    },
    dragfinish: function() {
        this.removeClass("pressed"), this._isPressed = !1;
    },
    leave: function() {
        this.removeClass("pressed");
    },
    up: function() {
        this.removeClass("pressed"), this._isPressed = !1;
    }
});

// lib\onyx\source\IconButton.js
enyo.kind({
    name: "onyx.IconButton",
    kind: "onyx.Icon",
    published: {
        active: !1
    },
    classes: "onyx-icon-button",
    handlers: {
        ondown: "down",
        onenter: "enter",
        ondragfinish: "dragfinish",
        onleave: "leave",
        onup: "up"
    },
    rendered: function() {
        this.inherited(arguments), this.activeChanged();
    },
    tap: function() {
        return this.disabled ? !0 : (this.setActive(!0), void 0);
    },
    down: function() {
        return this.disabled ? !0 : (this.addClass("pressed"), this._isPressed = !0, void 0);
    },
    enter: function() {
        return this.disabled ? !0 : (this._isPressed && this.addClass("pressed"), void 0);
    },
    dragfinish: function() {
        return this.disabled ? !0 : (this.removeClass("pressed"), this._isPressed = !1, 
        void 0);
    },
    leave: function() {
        return this.disabled ? !0 : (this.removeClass("pressed"), void 0);
    },
    up: function() {
        return this.disabled ? !0 : (this.removeClass("pressed"), this._isPressed = !1, 
        void 0);
    },
    activeChanged: function() {
        this.bubble("onActivate");
    }
});

// lib\onyx\source\Checkbox.js
enyo.kind({
    name: "onyx.Checkbox",
    classes: "onyx-checkbox",
    kind: enyo.Checkbox,
    tag: "div",
    handlers: {
        onclick: ""
    },
    tap: function() {
        return this.disabled || (this.setChecked(!this.getChecked()), this.bubble("onchange")), 
        !this.disabled;
    },
    dragstart: function() {}
});

// lib\onyx\source\Drawer.js
enyo.kind({
    name: "onyx.Drawer",
    kind: "enyo.Drawer"
});

// lib\onyx\source\Grabber.js
enyo.kind({
    name: "onyx.Grabber",
    classes: "onyx-grabber"
});

// lib\onyx\source\Groupbox.js
enyo.kind({
    name: "onyx.Groupbox",
    classes: "onyx-groupbox"
}), enyo.kind({
    name: "onyx.GroupboxHeader",
    classes: "onyx-groupbox-header"
});

// lib\onyx\source\Input.js
enyo.kind({
    name: "onyx.Input",
    kind: "enyo.Input",
    classes: "onyx-input"
});

// lib\onyx\source\Popup.js
enyo.kind({
    name: "onyx.Popup",
    kind: "enyo.Popup",
    classes: "onyx-popup",
    published: {
        scrimWhenModal: !0,
        scrim: !1,
        scrimClassName: "",
        defaultZ: 120
    },
    protectedStatics: {
        count: 0,
        highestZ: 120
    },
    showingChanged: function() {
        this.showing ? (onyx.Popup.count++, this.applyZIndex()) : onyx.Popup.count > 0 && onyx.Popup.count--, 
        this.showHideScrim(this.showing), this.inherited(arguments);
    },
    showHideScrim: function(e) {
        if (this.floating && (this.scrim || this.modal && this.scrimWhenModal)) {
            var s = this.getScrim();
            if (e) {
                var n = this.getScrimZIndex();
                this._scrimZ = n, s.showAtZIndex(n);
            } else s.hideAtZIndex(this._scrimZ);
            enyo.call(s, "addRemoveClass", [ this.scrimClassName, s.showing ]);
        }
    },
    getScrimZIndex: function() {
        return onyx.Popup.highestZ >= this._zIndex ? this._zIndex - 1 : onyx.Popup.highestZ;
    },
    getScrim: function() {
        return this.modal && this.scrimWhenModal && !this.scrim ? onyx.scrimTransparent.make() : onyx.scrim.make();
    },
    applyZIndex: function() {
        this._zIndex = 2 * onyx.Popup.count + this.findZIndex() + 1, this._zIndex <= onyx.Popup.highestZ && (this._zIndex = onyx.Popup.highestZ + 1), 
        this._zIndex > onyx.Popup.highestZ && (onyx.Popup.highestZ = this._zIndex), this.applyStyle("z-index", this._zIndex);
    },
    findZIndex: function() {
        var e = this.defaultZ;
        return this._zIndex ? e = this._zIndex : this.hasNode() && (e = Number(enyo.dom.getComputedStyleValue(this.node, "z-index")) || e), 
        this.defaultZ > e && (e = this.defaultZ), this._zIndex = e, this._zIndex;
    }
});

// lib\onyx\source\TextArea.js
enyo.kind({
    name: "onyx.TextArea",
    kind: "enyo.TextArea",
    classes: "onyx-textarea"
});

// lib\onyx\source\RichText.js
enyo.kind({
    name: "onyx.RichText",
    kind: "enyo.RichText",
    classes: "onyx-richtext"
});

// lib\onyx\source\InputDecorator.js
enyo.kind({
    name: "onyx.InputDecorator",
    kind: "enyo.ToolDecorator",
    tag: "label",
    classes: "onyx-input-decorator",
    published: {
        alwaysLooksFocused: !1
    },
    handlers: {
        onDisabledChange: "disabledChange",
        onfocus: "receiveFocus",
        onblur: "receiveBlur"
    },
    create: function() {
        this.inherited(arguments), this.updateFocus(!1);
    },
    alwaysLooksFocusedChanged: function() {
        this.updateFocus(this.focus);
    },
    updateFocus: function(e) {
        this.focused = e, this.addRemoveClass("onyx-focused", this.alwaysLooksFocused || this.focused);
    },
    receiveFocus: function() {
        this.updateFocus(!0);
    },
    receiveBlur: function() {
        this.updateFocus(!1);
    },
    disabledChange: function(e, s) {
        this.addRemoveClass("onyx-disabled", s.originator.disabled);
    }
});

// lib\onyx\source\Tooltip.js
enyo.kind({
    name: "onyx.Tooltip",
    kind: "onyx.Popup",
    classes: "onyx-tooltip below left-arrow",
    autoDismiss: !1,
    showDelay: 500,
    defaultLeft: -6,
    handlers: {
        onRequestShowTooltip: "requestShow",
        onRequestHideTooltip: "requestHide"
    },
    requestShow: function() {
        return this.showJob = setTimeout(this.bindSafely("show"), this.showDelay), !0;
    },
    cancelShow: function() {
        clearTimeout(this.showJob);
    },
    requestHide: function() {
        return this.cancelShow(), this.inherited(arguments);
    },
    showingChanged: function() {
        this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
    },
    applyPosition: function(e) {
        var s = "";
        for (var n in e) s += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
        this.addStyles(s);
    },
    adjustPosition: function() {
        if (this.showing && this.hasNode()) {
            var e = this.node.getBoundingClientRect();
            e.top + e.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), 
            this.addRemoveClass("below", !0)), e.left + e.width > window.innerWidth && (this.applyPosition({
                "margin-left": -e.width,
                bottom: "auto"
            }), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
        }
    },
    resizeHandler: function() {
        this.applyPosition({
            "margin-left": this.defaultLeft,
            bottom: "auto"
        }), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), 
        this.adjustPosition(!0), this.inherited(arguments);
    }
});

// lib\onyx\source\TooltipDecorator.js
enyo.kind({
    name: "onyx.TooltipDecorator",
    defaultKind: "onyx.Button",
    classes: "onyx-popup-decorator",
    handlers: {
        onenter: "enter",
        onleave: "leave"
    },
    enter: function() {
        this.requestShowTooltip();
    },
    leave: function() {
        this.requestHideTooltip();
    },
    tap: function() {
        this.requestHideTooltip();
    },
    requestShowTooltip: function() {
        this.waterfallDown("onRequestShowTooltip");
    },
    requestHideTooltip: function() {
        this.waterfallDown("onRequestHideTooltip");
    }
});

// lib\onyx\source\MenuDecorator.js
enyo.kind({
    name: "onyx.MenuDecorator",
    kind: "onyx.TooltipDecorator",
    defaultKind: "onyx.Button",
    classes: "onyx-popup-decorator enyo-unselectable",
    handlers: {
        onActivate: "activated",
        onHide: "menuHidden"
    },
    activated: function(e, n) {
        this.requestHideTooltip(), n.originator.active && (this.menuActive = !0, this.activator = n.originator, 
        this.activator.addClass("active"), this.requestShowMenu());
    },
    requestShowMenu: function() {
        this.waterfallDown("onRequestShowMenu", {
            activator: this.activator
        });
    },
    requestHideMenu: function() {
        this.waterfallDown("onRequestHideMenu");
    },
    menuHidden: function() {
        this.menuActive = !1, this.activator && (this.activator.setActive(!1), this.activator.removeClass("active"));
    },
    enter: function() {
        this.menuActive || this.inherited(arguments);
    },
    leave: function() {
        this.menuActive || this.inherited(arguments);
    }
});

// lib\onyx\source\Menu.js
enyo.kind({
    name: "onyx.Menu",
    kind: "onyx.Popup",
    modal: !0,
    defaultKind: "onyx.MenuItem",
    classes: "onyx-menu",
    published: {
        maxHeight: 200,
        scrolling: !0,
        scrollStrategyKind: "TouchScrollStrategy"
    },
    handlers: {
        onActivate: "itemActivated",
        onRequestShowMenu: "requestMenuShow",
        onRequestHideMenu: "requestHide"
    },
    childComponents: [ {
        name: "client",
        kind: "enyo.Scroller"
    } ],
    showOnTop: !1,
    scrollerName: "client",
    create: function() {
        this.inherited(arguments), this.maxHeightChanged();
    },
    initComponents: function() {
        this.scrolling && this.createComponents(this.childComponents, {
            isChrome: !0,
            strategyKind: this.scrollStrategyKind
        }), this.inherited(arguments);
    },
    getScroller: function() {
        return this.$[this.scrollerName];
    },
    maxHeightChanged: function() {
        this.scrolling && this.getScroller().setMaxHeight(this.maxHeight + "px");
    },
    itemActivated: function(e, t) {
        return t.originator.setActive(!1), !0;
    },
    showingChanged: function() {
        this.inherited(arguments), this.scrolling && this.getScroller().setShowing(this.showing), 
        this.adjustPosition(!0);
    },
    requestMenuShow: function(e, t) {
        if (this.floating) {
            var i = t.activator.hasNode();
            if (i) {
                var n = this.activatorOffset = this.getPageOffset(i);
                this.applyPosition({
                    top: n.top + (this.showOnTop ? 0 : n.height),
                    left: n.left,
                    width: n.width
                });
            }
        }
        return this.show(), !0;
    },
    applyPosition: function(e) {
        var t = "";
        for (var i in e) t += i + ":" + e[i] + (isNaN(e[i]) ? "; " : "px; ");
        this.addStyles(t);
    },
    getPageOffset: function(e) {
        var t = e.getBoundingClientRect(), i = void 0 === window.pageYOffset ? document.documentElement.scrollTop : window.pageYOffset, n = void 0 === window.pageXOffset ? document.documentElement.scrollLeft : window.pageXOffset, o = void 0 === t.height ? t.bottom - t.top : t.height, s = void 0 === t.width ? t.right - t.left : t.width;
        return {
            top: t.top + i,
            left: t.left + n,
            height: o,
            width: s
        };
    },
    adjustPosition: function() {
        if (this.showing && this.hasNode()) {
            this.scrolling && !this.showOnTop && this.getScroller().setMaxHeight(this.maxHeight + "px"), 
            this.removeClass("onyx-menu-up"), this.floating || this.applyPosition({
                left: "auto"
            });
            var e = this.node.getBoundingClientRect(), t = void 0 === e.height ? e.bottom - e.top : e.height, i = void 0 === window.innerHeight ? document.documentElement.clientHeight : window.innerHeight, n = void 0 === window.innerWidth ? document.documentElement.clientWidth : window.innerWidth;
            if (this.menuUp = e.top + t > i && i - e.bottom < e.top - t, this.addRemoveClass("onyx-menu-up", this.menuUp), 
            this.floating) {
                var o = this.activatorOffset;
                this.menuUp ? this.applyPosition({
                    top: o.top - t + (this.showOnTop ? o.height : 0),
                    bottom: "auto"
                }) : e.top < o.top && i > o.top + (this.showOnTop ? 0 : o.height) + t && this.applyPosition({
                    top: o.top + (this.showOnTop ? 0 : o.height),
                    bottom: "auto"
                });
            }
            if (e.right > n && (this.floating ? this.applyPosition({
                left: n - e.width
            }) : this.applyPosition({
                left: -(e.right - n)
            })), 0 > e.left && (this.floating ? this.applyPosition({
                left: 0,
                right: "auto"
            }) : "auto" == this.getComputedStyleValue("right") ? this.applyPosition({
                left: -e.left
            }) : this.applyPosition({
                right: e.left
            })), this.scrolling && !this.showOnTop) {
                e = this.node.getBoundingClientRect();
                var s;
                s = this.menuUp ? this.maxHeight < e.bottom ? this.maxHeight : e.bottom : i > e.top + this.maxHeight ? this.maxHeight : i - e.top, 
                this.getScroller().setMaxHeight(s + "px");
            }
        }
    },
    resizeHandler: function() {
        this.inherited(arguments), this.adjustPosition();
    },
    requestHide: function() {
        this.setShowing(!1);
    }
});

// lib\onyx\source\MenuItem.js
enyo.kind({
    name: "onyx.MenuItem",
    kind: "enyo.Button",
    events: {
        onSelect: "",
        onItemContentChange: ""
    },
    classes: "onyx-menu-item",
    tag: "div",
    create: function() {
        this.silence(), this.inherited(arguments), this.unsilence(), this.active && this.bubble("onActivate");
    },
    tap: function() {
        this.inherited(arguments), this.bubble("onRequestHideMenu"), this.doSelect({
            selected: this,
            content: this.content
        });
    },
    contentChanged: function() {
        this.inherited(arguments), this.doItemContentChange({
            content: this.content
        });
    }
});

// lib\onyx\source\Submenu.js
enyo.kind({
    name: "onyx.Submenu",
    defaultKind: "onyx.MenuItem",
    initComponents: function() {
        this.createChrome([ {
            name: "label",
            kind: "enyo.Control",
            classes: "onyx-menu-item",
            content: this.content || this.name,
            isChrome: !0,
            ontap: "toggleOpen"
        }, {
            kind: "onyx.Drawer",
            name: "client",
            classes: "client onyx-submenu",
            isChrome: !0,
            open: !1
        } ]), this.inherited(arguments);
    },
    toggleOpen: function() {
        this.setOpen(!this.getOpen());
    },
    setOpen: function(e) {
        this.$.client.setOpen(e);
    },
    getOpen: function() {
        return this.$.client.getOpen();
    }
});

// lib\onyx\source\PickerDecorator.js
enyo.kind({
    name: "onyx.PickerDecorator",
    kind: "onyx.MenuDecorator",
    classes: "onyx-picker-decorator",
    defaultKind: "onyx.PickerButton",
    handlers: {
        onChange: "change"
    },
    change: function(e, t) {
        this.waterfallDown("onChange", t);
    }
});

// lib\onyx\source\PickerButton.js
enyo.kind({
    name: "onyx.PickerButton",
    kind: "onyx.Button",
    handlers: {
        onChange: "change"
    },
    change: function(e, t) {
        void 0 !== t.content && this.setContent(t.content);
    }
});

// lib\onyx\source\Picker.js
enyo.kind({
    name: "onyx.Picker",
    kind: "onyx.Menu",
    classes: "onyx-picker enyo-unselectable",
    published: {
        selected: null
    },
    events: {
        onChange: ""
    },
    handlers: {
        onItemContentChange: "itemContentChange"
    },
    floating: !0,
    showOnTop: !0,
    initComponents: function() {
        this.setScrolling(!0), this.inherited(arguments);
    },
    showingChanged: function() {
        this.getScroller().setShowing(this.showing), this.inherited(arguments), this.showing && this.selected && this.scrollToSelected();
    },
    scrollToSelected: function() {
        this.getScroller().scrollToControl(this.selected, !this.menuUp);
    },
    itemActivated: function(e, t) {
        return this.processActivatedItem(t.originator), this.inherited(arguments);
    },
    processActivatedItem: function(e) {
        e.active && this.setSelected(e);
    },
    selectedChanged: function(e) {
        e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), 
        this.doChange({
            selected: this.selected,
            content: this.selected.content
        }));
    },
    itemContentChange: function(e, t) {
        t.originator == this.selected && this.doChange({
            selected: this.selected,
            content: this.selected.content
        });
    },
    resizeHandler: function() {
        this.inherited(arguments), this.adjustPosition();
    }
});

// lib\onyx\source\FlyweightPicker.js
enyo.kind({
    name: "onyx.FlyweightPicker",
    kind: "onyx.Picker",
    classes: "onyx-flyweight-picker",
    published: {
        count: 0
    },
    events: {
        onSetupItem: "",
        onSelect: ""
    },
    handlers: {
        onSelect: "itemSelect"
    },
    components: [ {
        name: "scroller",
        kind: "enyo.Scroller",
        strategyKind: "TouchScrollStrategy",
        components: [ {
            name: "flyweight",
            kind: "FlyweightRepeater",
            noSelect: !0,
            ontap: "itemTap"
        } ]
    } ],
    scrollerName: "scroller",
    initComponents: function() {
        this.controlParentName = "flyweight", this.inherited(arguments), this.$.flyweight.$.client.children[0].setActive(!0);
    },
    create: function() {
        this.inherited(arguments), this.countChanged();
    },
    rendered: function() {
        this.inherited(arguments), this.selectedChanged();
    },
    scrollToSelected: function() {
        var e = this.$.flyweight.fetchRowNode(this.selected);
        this.getScroller().scrollToNode(e, !this.menuUp);
    },
    countChanged: function() {
        this.$.flyweight.count = this.count;
    },
    processActivatedItem: function(e) {
        this.item = e;
    },
    selectedChanged: function(e) {
        if (this.item) {
            null != e && (this.item.removeClass("selected"), this.$.flyweight.renderRow(e));
            var t;
            null != this.selected && (this.item.addClass("selected"), this.$.flyweight.renderRow(this.selected), 
            this.item.removeClass("selected"), t = this.$.flyweight.fetchRowNode(this.selected)), 
            this.doChange({
                selected: this.selected,
                content: t && t.textContent || this.item.content
            });
        }
    },
    itemTap: function(e, t) {
        this.setSelected(t.rowIndex), this.doSelect({
            selected: this.item,
            content: this.item.content
        });
    },
    itemSelect: function(e, t) {
        return t.originator != this ? !0 : void 0;
    }
});

// lib\onyx\source\DatePicker.js
enyo.kind({
    name: "onyx.DatePicker",
    classes: "onyx-toolbar-inline",
    published: {
        disabled: !1,
        locale: "en-US",
        dayHidden: !1,
        monthHidden: !1,
        yearHidden: !1,
        minYear: 1900,
        maxYear: 2099,
        value: null
    },
    events: {
        onSelect: ""
    },
    create: function() {
        this.inherited(arguments), window.ilib && (this.locale = ilib.getLocale()), this.initDefaults();
    },
    initDefaults: function() {
        var e;
        window.ilib ? (e = [], this._tf = new ilib.DateFmt({
            locale: this.locale,
            timezone: "local"
        }), e = this._tf.getMonthsOfYear({
            length: "long"
        })) : e = [ void 0, "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ], 
        this.setupPickers(this._tf ? this._tf.getTemplate() : "mdy"), this.dayHiddenChanged(), 
        this.monthHiddenChanged(), this.yearHiddenChanged();
        for (var t, n = this.value = this.value || new Date(), i = 0; t = e[i + 1]; i++) this.$.monthPicker.createComponent({
            content: t,
            value: i,
            active: i == n.getMonth()
        });
        var s = n.getFullYear();
        for (this.$.yearPicker.setSelected(s - this.minYear), i = 1; this.monthLength(n.getYear(), n.getMonth()) >= i; i++) this.$.dayPicker.createComponent({
            content: i,
            value: i,
            active: i == n.getDate()
        });
    },
    monthLength: function(e, t) {
        return 32 - new Date(e, t, 32).getDate();
    },
    setupYear: function(e, t) {
        return this.$.year.setContent(this.minYear + t.index), !0;
    },
    setupPickers: function(e) {
        var t, n, i, s = e.split(""), o = !1, a = !1, h = !1;
        for (n = 0, i = s.length; i > n; n++) switch (t = s[n], t.toLowerCase()) {
          case "d":
            h || (this.createDay(), h = !0);
            break;

          case "m":
            a || (this.createMonth(), a = !0);
            break;

          case "y":
            o || (this.createYear(), o = !0);
            break;

          default:        }
    },
    createYear: function() {
        var e = this.maxYear - this.minYear;
        this.createComponent({
            kind: "onyx.PickerDecorator",
            onSelect: "updateYear",
            components: [ {
                classes: "onyx-datepicker-year",
                name: "yearPickerButton",
                disabled: this.disabled
            }, {
                name: "yearPicker",
                kind: "onyx.FlyweightPicker",
                count: ++e,
                onSetupItem: "setupYear",
                components: [ {
                    name: "year"
                } ]
            } ]
        });
    },
    createMonth: function() {
        this.createComponent({
            kind: "onyx.PickerDecorator",
            onSelect: "updateMonth",
            components: [ {
                classes: "onyx-datepicker-month",
                name: "monthPickerButton",
                disabled: this.disabled
            }, {
                name: "monthPicker",
                kind: "onyx.Picker"
            } ]
        });
    },
    createDay: function() {
        this.createComponent({
            kind: "onyx.PickerDecorator",
            onSelect: "updateDay",
            components: [ {
                classes: "onyx-datepicker-day",
                name: "dayPickerButton",
                disabled: this.disabled
            }, {
                name: "dayPicker",
                kind: "onyx.Picker"
            } ]
        });
    },
    localeChanged: function() {
        this.refresh();
    },
    dayHiddenChanged: function() {
        this.$.dayPicker.getParent().setShowing(this.dayHidden ? !1 : !0);
    },
    monthHiddenChanged: function() {
        this.$.monthPicker.getParent().setShowing(this.monthHidden ? !1 : !0);
    },
    yearHiddenChanged: function() {
        this.$.yearPicker.getParent().setShowing(this.yearHidden ? !1 : !0);
    },
    minYearChanged: function() {
        this.refresh();
    },
    maxYearChanged: function() {
        this.refresh();
    },
    valueChanged: function() {
        this.refresh();
    },
    disabledChanged: function() {
        this.$.yearPickerButton.setDisabled(this.disabled), this.$.monthPickerButton.setDisabled(this.disabled), 
        this.$.dayPickerButton.setDisabled(this.disabled);
    },
    updateDay: function(e, t) {
        var n = this.calcDate(this.value.getFullYear(), this.value.getMonth(), t.selected.value);
        return this.doSelect({
            name: this.name,
            value: n
        }), this.setValue(n), !0;
    },
    updateMonth: function(e, t) {
        var n = this.calcDate(this.value.getFullYear(), t.selected.value, this.value.getDate());
        return this.doSelect({
            name: this.name,
            value: n
        }), this.setValue(n), !0;
    },
    updateYear: function(e, t) {
        if (-1 != t.originator.selected) {
            var n = this.calcDate(this.minYear + t.originator.selected, this.value.getMonth(), this.value.getDate());
            this.doSelect({
                name: this.name,
                value: n
            }), this.setValue(n);
        }
        return !0;
    },
    calcDate: function(e, t, n) {
        return new Date(e, t, n, this.value.getHours(), this.value.getMinutes(), this.value.getSeconds(), this.value.getMilliseconds());
    },
    refresh: function() {
        this.destroyClientControls(), this.initDefaults(), this.render();
    }
});

// lib\onyx\source\TimePicker.js
enyo.kind({
    name: "onyx.TimePicker",
    classes: "onyx-toolbar-inline",
    published: {
        disabled: !1,
        locale: "en-US",
        is24HrMode: null,
        value: null
    },
    events: {
        onSelect: ""
    },
    create: function() {
        this.inherited(arguments), window.ilib && (this.locale = ilib.getLocale()), this.initDefaults();
    },
    initDefaults: function() {
        if (this._strAm = "AM", this._strPm = "PM", window.ilib) {
            this._tf = new ilib.DateFmt({
                locale: this.locale
            });
            var e = new ilib.DateFmt({
                locale: this.locale,
                type: "time",
                template: "a"
            }), t = ilib.Date.newInstance({
                locale: this.locale,
                hour: 1
            });
            this._strAm = e.format(t), t.hour = 13, this._strPm = e.format(t), null == this.is24HrMode && (this.is24HrMode = "24" == this._tf.getClock());
        } else null == this.is24HrMode && (this.is24HrMode = !1);
        this.setupPickers(this._tf ? this._tf.getTimeComponents() : "hma");
        var i, n = this.value = this.value || new Date();
        if (this.is24HrMode) for (i = 0; 24 > i; i++) this.$.hourPicker.createComponent({
            content: i,
            value: i,
            active: i == n.getHours()
        }); else {
            var s = n.getHours();
            for (s = 0 === s ? 12 : s, i = 1; 12 >= i; i++) this.$.hourPicker.createComponent({
                content: i,
                value: i,
                active: i == (s > 12 ? s % 12 : s)
            });
        }
        for (i = 0; 59 >= i; i++) this.$.minutePicker.createComponent({
            content: 10 > i ? "0" + i : i,
            value: i,
            active: i == n.getMinutes()
        });
        n.getHours() >= 12 ? this.$.ampmPicker.createComponents([ {
            content: this._strAm
        }, {
            content: this._strPm,
            active: !0
        } ]) : this.$.ampmPicker.createComponents([ {
            content: this._strAm,
            active: !0
        }, {
            content: this._strPm
        } ]), this.$.ampmPicker.getParent().setShowing(!this.is24HrMode);
    },
    setupPickers: function(e) {
        -1 !== e.indexOf("h") && this.createHour(), -1 !== e.indexOf("m") && this.createMinute(), 
        -1 !== e.indexOf("a") && this.createAmPm();
    },
    createHour: function() {
        this.createComponent({
            kind: "onyx.PickerDecorator",
            onSelect: "updateHour",
            components: [ {
                classes: "onyx-timepicker-hour",
                name: "hourPickerButton",
                disabled: this.disabled
            }, {
                name: "hourPicker",
                kind: "onyx.Picker"
            } ]
        });
    },
    createMinute: function() {
        this.createComponent({
            kind: "onyx.PickerDecorator",
            onSelect: "updateMinute",
            components: [ {
                classes: "onyx-timepicker-minute",
                name: "minutePickerButton",
                disabled: this.disabled
            }, {
                name: "minutePicker",
                kind: "onyx.Picker"
            } ]
        });
    },
    createAmPm: function() {
        this.createComponent({
            kind: "onyx.PickerDecorator",
            onSelect: "updateAmPm",
            components: [ {
                classes: "onyx-timepicker-ampm",
                name: "ampmPickerButton",
                disabled: this.disabled
            }, {
                name: "ampmPicker",
                kind: "onyx.Picker"
            } ]
        });
    },
    disabledChanged: function() {
        this.$.hourPickerButton.setDisabled(this.disabled), this.$.minutePickerButton.setDisabled(this.disabled), 
        this.$.ampmPickerButton.setDisabled(this.disabled);
    },
    localeChanged: function() {
        this.is24HrMode = null, this.refresh();
    },
    is24HrModeChanged: function() {
        this.refresh();
    },
    valueChanged: function() {
        this.refresh();
    },
    updateHour: function(e, t) {
        var i = t.selected.value;
        if (!this.is24HrMode) {
            var n = this.$.ampmPicker.getParent().controlAtIndex(0).content;
            i = i + (12 == i ? -12 : 0) + (this.isAm(n) ? 0 : 12);
        }
        return this.setValue(this.calcTime(i, this.value.getMinutes())), this.doSelect({
            name: this.name,
            value: this.value
        }), !0;
    },
    updateMinute: function(e, t) {
        return this.setValue(this.calcTime(this.value.getHours(), t.selected.value)), this.doSelect({
            name: this.name,
            value: this.value
        }), !0;
    },
    updateAmPm: function(e, t) {
        var i = this.value.getHours();
        return this.is24HrMode || (i += i > 11 ? this.isAm(t.content) ? -12 : 0 : this.isAm(t.content) ? 0 : 12), 
        this.setValue(this.calcTime(i, this.value.getMinutes())), this.doSelect({
            name: this.name,
            value: this.value
        }), !0;
    },
    calcTime: function(e, t) {
        return new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate(), e, t, this.value.getSeconds(), this.value.getMilliseconds());
    },
    isAm: function(e) {
        return e == this._strAm ? !0 : !1;
    },
    refresh: function() {
        this.destroyClientControls(), this.initDefaults(), this.render();
    }
});

// lib\onyx\source\RadioButton.js
enyo.kind({
    name: "onyx.RadioButton",
    kind: "enyo.Button",
    classes: "onyx-radiobutton"
});

// lib\onyx\source\RadioGroup.js
enyo.kind({
    name: "onyx.RadioGroup",
    kind: "enyo.Group",
    defaultKind: "onyx.RadioButton",
    highlander: !0
});

// lib\onyx\source\ToggleButton.js
enyo.kind({
    name: "onyx.ToggleButton",
    classes: "onyx-toggle-button",
    published: {
        active: !1,
        value: !1,
        onContent: "On",
        offContent: "Off",
        disabled: !1
    },
    events: {
        onChange: ""
    },
    handlers: {
        ondragstart: "dragstart",
        ondrag: "drag",
        ondragfinish: "dragfinish"
    },
    components: [ {
        name: "contentOn",
        classes: "onyx-toggle-content on"
    }, {
        name: "contentOff",
        classes: "onyx-toggle-content off"
    }, {
        classes: "onyx-toggle-button-knob"
    } ],
    create: function() {
        this.inherited(arguments), this.value = Boolean(this.value || this.active), this.onContentChanged(), 
        this.offContentChanged(), this.disabledChanged();
    },
    rendered: function() {
        this.inherited(arguments), this.updateVisualState();
    },
    updateVisualState: function() {
        this.addRemoveClass("off", !this.value), this.$.contentOn.setShowing(this.value), 
        this.$.contentOff.setShowing(!this.value), this.setActive(this.value);
    },
    valueChanged: function() {
        this.updateVisualState(), this.doChange({
            value: this.value
        });
    },
    activeChanged: function() {
        this.setValue(this.active), this.bubble("onActivate");
    },
    onContentChanged: function() {
        this.$.contentOn.setContent(this.onContent || ""), this.$.contentOn.addRemoveClass("empty", !this.onContent);
    },
    offContentChanged: function() {
        this.$.contentOff.setContent(this.offContent || ""), this.$.contentOff.addRemoveClass("empty", !this.onContent);
    },
    disabledChanged: function() {
        this.addRemoveClass("disabled", this.disabled);
    },
    updateValue: function(e) {
        this.disabled || this.setValue(e);
    },
    tap: function() {
        this.updateValue(!this.value);
    },
    dragstart: function(e, t) {
        return t.horizontal ? (t.preventDefault(), this.dragging = !0, this.dragged = !1, 
        !0) : void 0;
    },
    drag: function(e, t) {
        if (this.dragging) {
            var n = t.dx;
            return Math.abs(n) > 10 && (this.updateValue(n > 0), this.dragged = !0), !0;
        }
    },
    dragfinish: function(e, t) {
        this.dragging = !1, this.dragged && t.preventTap();
    }
});

// lib\onyx\source\ToggleIconButton.js
enyo.kind({
    name: "onyx.ToggleIconButton",
    kind: "onyx.Icon",
    published: {
        active: !1,
        value: !1
    },
    events: {
        onChange: ""
    },
    classes: "onyx-icon-button onyx-icon-toggle",
    activeChanged: function() {
        this.addRemoveClass("active", this.value), this.bubble("onActivate");
    },
    updateValue: function(e) {
        this.disabled || (this.setValue(e), this.doChange({
            value: this.value
        }));
    },
    tap: function() {
        this.updateValue(!this.value);
    },
    valueChanged: function() {
        this.setActive(this.value);
    },
    create: function() {
        this.inherited(arguments), this.value = Boolean(this.value || this.active);
    },
    rendered: function() {
        this.inherited(arguments), this.valueChanged(), this.removeClass("onyx-icon");
    }
});

// lib\onyx\source\Toolbar.js
enyo.kind({
    name: "onyx.Toolbar",
    classes: "onyx onyx-toolbar onyx-toolbar-inline",
    create: function() {
        this.inherited(arguments), this.hasClass("onyx-menu-toolbar") && enyo.platform.android >= 4 && this.applyStyle("position", "static");
    }
});

// lib\onyx\source\ProgressBar.js
enyo.kind({
    name: "onyx.ProgressBar",
    classes: "onyx-progress-bar",
    published: {
        progress: 0,
        min: 0,
        max: 100,
        barClasses: "",
        showStripes: !0,
        animateStripes: !0,
        increment: 0
    },
    events: {
        onAnimateProgressFinish: ""
    },
    components: [ {
        name: "progressAnimator",
        kind: "enyo.Animator",
        onStep: "progressAnimatorStep",
        onEnd: "progressAnimatorComplete"
    }, {
        name: "bar",
        classes: "onyx-progress-bar-bar"
    } ],
    create: function() {
        this.inherited(arguments), this.progressChanged(), this.barClassesChanged(), this.showStripesChanged(), 
        this.animateStripesChanged();
    },
    barClassesChanged: function(e) {
        this.$.bar.removeClass(e), this.$.bar.addClass(this.barClasses);
    },
    showStripesChanged: function() {
        this.$.bar.addRemoveClass("striped", this.showStripes);
    },
    animateStripesChanged: function() {
        this.$.bar.addRemoveClass("animated", this.animateStripes);
    },
    progressChanged: function() {
        this.progress = this.clampValue(this.min, this.max, this.progress);
        var e = this.calcPercent(this.progress);
        this.updateBarPosition(e);
    },
    calcIncrement: function(e) {
        return Math.round(e / this.increment) * this.increment;
    },
    clampValue: function(e, t, n) {
        return Math.max(e, Math.min(n, t));
    },
    calcRatio: function(e) {
        return (e - this.min) / (this.max - this.min);
    },
    calcPercent: function(e) {
        return 100 * this.calcRatio(e);
    },
    updateBarPosition: function(e) {
        this.$.bar.applyStyle("width", e + "%");
    },
    animateProgressTo: function(e) {
        this.$.progressAnimator.play({
            startValue: this.progress,
            endValue: e,
            node: this.hasNode()
        });
    },
    progressAnimatorStep: function(e) {
        return this.setProgress(e.value), !0;
    },
    progressAnimatorComplete: function(e) {
        return this.doAnimateProgressFinish(e), !0;
    }
});

// lib\onyx\source\ProgressButton.js
enyo.kind({
    name: "onyx.ProgressButton",
    kind: "onyx.ProgressBar",
    classes: "onyx-progress-button",
    events: {
        onCancel: ""
    },
    components: [ {
        name: "progressAnimator",
        kind: "enyo.Animator",
        onStep: "progressAnimatorStep",
        onEnd: "progressAnimatorComplete"
    }, {
        name: "bar",
        classes: "onyx-progress-bar-bar onyx-progress-button-bar"
    }, {
        name: "client",
        classes: "onyx-progress-button-client"
    }, {
        kind: "onyx.Icon",
        src: "$lib/onyx/images/progress-button-cancel.png",
        classes: "onyx-progress-button-icon",
        ontap: "cancelTap"
    } ],
    cancelTap: function() {
        this.doCancel();
    }
});

// lib\onyx\source\Scrim.js
enyo.kind({
    name: "onyx.Scrim",
    showing: !1,
    classes: "onyx-scrim enyo-fit",
    floating: !1,
    create: function() {
        this.inherited(arguments), this.zStack = [], this.floating && this.setParent(enyo.floatingLayer);
    },
    showingChanged: function() {
        this.floating && this.showing && !this.hasNode() && this.render(), this.inherited(arguments);
    },
    addZIndex: function(e) {
        0 > enyo.indexOf(e, this.zStack) && this.zStack.push(e);
    },
    removeZIndex: function(e) {
        enyo.remove(e, this.zStack);
    },
    showAtZIndex: function(e) {
        this.addZIndex(e), void 0 !== e && this.setZIndex(e), this.show();
    },
    hideAtZIndex: function(e) {
        if (this.removeZIndex(e), this.zStack.length) {
            var t = this.zStack[this.zStack.length - 1];
            this.setZIndex(t);
        } else this.hide();
    },
    setZIndex: function(e) {
        this.zIndex = e, this.applyStyle("z-index", e);
    },
    make: function() {
        return this;
    }
}), enyo.kind({
    name: "onyx.scrimSingleton",
    kind: null,
    constructor: function(e, t) {
        this.instanceName = e, enyo.setPath(this.instanceName, this), this.props = t || {};
    },
    make: function() {
        var e = new onyx.Scrim(this.props);
        return enyo.setPath(this.instanceName, e), e;
    },
    showAtZIndex: function(e) {
        var t = this.make();
        t.showAtZIndex(e);
    },
    hideAtZIndex: enyo.nop,
    show: function() {
        var e = this.make();
        e.show();
    }
}), new onyx.scrimSingleton("onyx.scrim", {
    floating: !0,
    classes: "onyx-scrim-translucent"
}), new onyx.scrimSingleton("onyx.scrimTransparent", {
    floating: !0,
    classes: "onyx-scrim-transparent"
});

// lib\onyx\source\Slider.js
enyo.kind({
    name: "onyx.Slider",
    kind: "onyx.ProgressBar",
    classes: "onyx-slider",
    published: {
        value: 0,
        lockBar: !0,
        tappable: !0
    },
    events: {
        onChange: "",
        onChanging: "",
        onAnimateFinish: ""
    },
    showStripes: !1,
    handlers: {
        ondragstart: "dragstart",
        ondrag: "drag",
        ondragfinish: "dragfinish"
    },
    moreComponents: [ {
        kind: "Animator",
        onStep: "animatorStep",
        onEnd: "animatorComplete"
    }, {
        classes: "onyx-slider-taparea"
    }, {
        name: "knob",
        classes: "onyx-slider-knob"
    } ],
    create: function() {
        this.inherited(arguments), this.moreComponents[2].ondown = "knobDown", this.moreComponents[2].onup = "knobUp", 
        this.createComponents(this.moreComponents), this.valueChanged();
    },
    valueChanged: function() {
        this.value = this.clampValue(this.min, this.max, this.value);
        var e = this.calcPercent(this.value);
        this.updateKnobPosition(e), this.lockBar && this.setProgress(this.value);
    },
    updateKnobPosition: function(e) {
        this.$.knob.applyStyle("left", e + "%");
    },
    calcKnobPosition: function(e) {
        var t = e.clientX - this.hasNode().getBoundingClientRect().left;
        return t / this.getBounds().width * (this.max - this.min) + this.min;
    },
    dragstart: function(e, t) {
        return t.horizontal ? (t.preventDefault(), this.dragging = !0, e.addClass("pressed"), 
        !0) : void 0;
    },
    drag: function(e, t) {
        if (this.dragging) {
            var n = this.calcKnobPosition(t);
            return n = this.increment ? this.calcIncrement(n) : n, this.setValue(n), this.doChanging({
                value: this.value
            }), !0;
        }
    },
    dragfinish: function(e, t) {
        return this.dragging = !1, t.preventTap(), this.doChange({
            value: this.value
        }), e.removeClass("pressed"), !0;
    },
    tap: function(e, t) {
        if (this.tappable) {
            var n = this.calcKnobPosition(t);
            return n = this.increment ? this.calcIncrement(n) : n, this.tapped = !0, this.animateTo(n), 
            !0;
        }
    },
    knobDown: function() {
        this.$.knob.addClass("pressed");
    },
    knobUp: function() {
        this.$.knob.removeClass("pressed");
    },
    animateTo: function(e) {
        this.$.animator.play({
            startValue: this.value,
            endValue: e,
            node: this.hasNode()
        });
    },
    animatorStep: function(e) {
        return this.setValue(e.value), !0;
    },
    animatorComplete: function(e) {
        return this.tapped && (this.tapped = !1, this.doChange({
            value: this.value
        })), this.doAnimateFinish(e), !0;
    }
});

// lib\onyx\source\RangeSlider.js
enyo.kind({
    name: "onyx.RangeSlider",
    kind: "onyx.ProgressBar",
    classes: "onyx-slider",
    published: {
        rangeMin: 0,
        rangeMax: 100,
        rangeStart: 0,
        rangeEnd: 100,
        beginValue: 0,
        endValue: 0
    },
    events: {
        onChange: "",
        onChanging: ""
    },
    showStripes: !1,
    showLabels: !1,
    handlers: {
        ondragstart: "dragstart",
        ondrag: "drag",
        ondragfinish: "dragfinish",
        ondown: "down"
    },
    moreComponents: [ {
        name: "startKnob",
        classes: "onyx-slider-knob"
    }, {
        name: "endKnob",
        classes: "onyx-slider-knob onyx-range-slider-knob"
    } ],
    create: function() {
        this.inherited(arguments), this.createComponents(this.moreComponents), this.initControls();
    },
    rendered: function() {
        this.inherited(arguments);
        var e = this.calcPercent(this.beginValue);
        this.updateBarPosition(e);
    },
    initControls: function() {
        this.$.bar.applyStyle("position", "relative"), this.refreshRangeSlider(), this.showLabels && (this.$.startKnob.createComponent({
            name: "startLabel",
            kind: "onyx.RangeSliderKnobLabel"
        }), this.$.endKnob.createComponent({
            name: "endLabel",
            kind: "onyx.RangeSliderKnobLabel"
        })), this.$.startKnob.ondown = "knobDown", this.$.startKnob.onup = "knobUp", this.$.endKnob.ondown = "knobDown", 
        this.$.endKnob.onup = "knobUp";
    },
    refreshRangeSlider: function() {
        this.beginValue = this.calcKnobPercent(this.rangeStart), this.endValue = this.calcKnobPercent(this.rangeEnd), 
        this.beginValueChanged(), this.endValueChanged();
    },
    calcKnobRatio: function(e) {
        return (e - this.rangeMin) / (this.rangeMax - this.rangeMin);
    },
    calcKnobPercent: function(e) {
        return 100 * this.calcKnobRatio(e);
    },
    beginValueChanged: function(e) {
        if (void 0 === e) {
            var t = this.calcPercent(this.beginValue);
            this.updateKnobPosition(t, this.$.startKnob);
        }
    },
    endValueChanged: function(e) {
        if (void 0 === e) {
            var t = this.calcPercent(this.endValue);
            this.updateKnobPosition(t, this.$.endKnob);
        }
    },
    calcKnobPosition: function(e) {
        var t = e.clientX - this.hasNode().getBoundingClientRect().left;
        return t / this.getBounds().width * (this.max - this.min) + this.min;
    },
    updateKnobPosition: function(e, t) {
        t.applyStyle("left", e + "%"), this.updateBarPosition();
    },
    updateBarPosition: function() {
        if (void 0 !== this.$.startKnob && void 0 !== this.$.endKnob) {
            var e = this.calcKnobPercent(this.rangeStart), t = this.calcKnobPercent(this.rangeEnd) - e;
            this.$.bar.applyStyle("left", e + "%"), this.$.bar.applyStyle("width", t + "%");
        }
    },
    calcRangeRatio: function(e) {
        return e / 100 * (this.rangeMax - this.rangeMin) + this.rangeMin - this.increment / 2;
    },
    swapZIndex: function(e) {
        "startKnob" === e ? (this.$.startKnob.applyStyle("z-index", 1), this.$.endKnob.applyStyle("z-index", 0)) : "endKnob" === e && (this.$.startKnob.applyStyle("z-index", 0), 
        this.$.endKnob.applyStyle("z-index", 1));
    },
    down: function(e) {
        this.swapZIndex(e.name);
    },
    dragstart: function(e, t) {
        return t.horizontal ? (t.preventDefault(), this.dragging = !0, e.addClass("pressed"), 
        !0) : void 0;
    },
    drag: function(e, t) {
        if (this.dragging) {
            var n, i, s, o = this.calcKnobPosition(t);
            if ("startKnob" === e.name && o >= 0) {
                if (!(this.endValue >= o && -1 === t.xDirection || this.endValue >= o)) return this.drag(this.$.endKnob, t);
                this.setBeginValue(o), n = this.calcRangeRatio(this.beginValue), i = this.increment ? this.calcIncrement(n + .5 * this.increment) : n, 
                s = this.calcKnobPercent(i), this.updateKnobPosition(s, this.$.startKnob), this.setRangeStart(i), 
                this.doChanging({
                    value: i
                });
            } else if ("endKnob" === e.name && 100 >= o) {
                if (!(o >= this.beginValue && 1 === t.xDirection || o >= this.beginValue)) return this.drag(this.$.startKnob, t);
                this.setEndValue(o), n = this.calcRangeRatio(this.endValue), i = this.increment ? this.calcIncrement(n + .5 * this.increment) : n, 
                s = this.calcKnobPercent(i), this.updateKnobPosition(s, this.$.endKnob), this.setRangeEnd(i), 
                this.doChanging({
                    value: i
                });
            }
            return !0;
        }
    },
    dragfinish: function(e, t) {
        this.dragging = !1, t.preventTap();
        var n;
        return "startKnob" === e.name ? (n = this.calcRangeRatio(this.beginValue), this.doChange({
            value: n,
            startChanged: !0
        })) : "endKnob" === e.name && (n = this.calcRangeRatio(this.endValue), this.doChange({
            value: n,
            startChanged: !1
        })), e.removeClass("pressed"), !0;
    },
    knobDown: function(e) {
        e.addClass("pressed");
    },
    knobUp: function(e) {
        e.removeClass("pressed");
    },
    rangeMinChanged: function() {
        this.refreshRangeSlider();
    },
    rangeMaxChanged: function() {
        this.refreshRangeSlider();
    },
    rangeStartChanged: function() {
        this.refreshRangeSlider();
    },
    rangeEndChanged: function() {
        this.refreshRangeSlider();
    },
    setStartLabel: function(e) {
        this.$.startKnob.waterfallDown("onSetLabel", e);
    },
    setEndLabel: function(e) {
        this.$.endKnob.waterfallDown("onSetLabel", e);
    }
}), enyo.kind({
    name: "onyx.RangeSliderKnobLabel",
    classes: "onyx-range-slider-label",
    handlers: {
        onSetLabel: "setLabel"
    },
    setLabel: function(e, t) {
        this.setContent(t);
    }
});

// lib\onyx\source\Item.js
enyo.kind({
    name: "onyx.Item",
    classes: "onyx-item",
    tapHighlight: !0,
    handlers: {
        onhold: "hold",
        onrelease: "release"
    },
    hold: function(e, t) {
        this.tapHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, "onyx-highlight", !0, t);
    },
    release: function(e, t) {
        this.tapHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, "onyx-highlight", !1, t);
    },
    statics: {
        addRemoveFlyweightClass: function(e, t, n, i, s) {
            var o = i.flyweight;
            if (o) {
                var a = void 0 !== s ? s : i.index;
                o.performOnRow(a, function() {
                    e.addRemoveClass(t, n);
                });
            }
        }
    }
});

// lib\onyx\source\Spinner.js
enyo.kind({
    name: "onyx.Spinner",
    classes: "onyx-spinner",
    stop: function() {
        this.setShowing(!1);
    },
    start: function() {
        this.setShowing(!0);
    },
    toggle: function() {
        this.setShowing(!this.getShowing());
    }
});

// lib\onyx\source\MoreToolbar.js
enyo.kind({
    name: "onyx.MoreToolbar",
    classes: "onyx-toolbar onyx-more-toolbar",
    menuClass: "",
    movedClass: "",
    layoutKind: "FittableColumnsLayout",
    noStretch: !0,
    handlers: {
        onHide: "reflow"
    },
    published: {
        clientLayoutKind: "FittableColumnsLayout"
    },
    tools: [ {
        name: "client",
        noStretch: !0,
        fit: !0,
        classes: "onyx-toolbar-inline"
    }, {
        name: "nard",
        kind: "onyx.MenuDecorator",
        showing: !1,
        onActivate: "activated",
        components: [ {
            kind: "onyx.IconButton",
            classes: "onyx-more-button"
        }, {
            name: "menu",
            kind: "onyx.Menu",
            scrolling: !1,
            classes: "onyx-more-menu"
        } ]
    } ],
    initComponents: function() {
        this.menuClass && this.menuClass.length > 0 && !this.$.menu.hasClass(this.menuClass) && this.$.menu.addClass(this.menuClass), 
        this.createChrome(this.tools), this.inherited(arguments), this.$.client.setLayoutKind(this.clientLayoutKind);
    },
    clientLayoutKindChanged: function() {
        this.$.client.setLayoutKind(this.clientLayoutKind);
    },
    reflow: function() {
        this.inherited(arguments), this.isContentOverflowing() ? (this.$.nard.show(), this.popItem() && this.reflow()) : this.tryPushItem() ? this.reflow() : this.$.menu.children.length || (this.$.nard.hide(), 
        this.$.menu.hide());
    },
    activated: function(e, t) {
        this.addRemoveClass("active", t.originator.active);
    },
    popItem: function() {
        var e = this.findCollapsibleItem();
        if (e) {
            this.movedClass && this.movedClass.length > 0 && !e.hasClass(this.movedClass) && e.addClass(this.movedClass), 
            this.$.menu.addChild(e, null);
            var t = this.$.menu.hasNode();
            return t && e.hasNode() && e.insertNodeInParent(t), !0;
        }
    },
    pushItem: function() {
        var e = this.$.menu.children, t = e[0];
        if (t) {
            this.movedClass && this.movedClass.length > 0 && t.hasClass(this.movedClass) && t.removeClass(this.movedClass), 
            this.$.client.addChild(t);
            var n = this.$.client.hasNode();
            if (n && t.hasNode()) {
                for (var i, s, o = 0; this.$.client.children.length > o; o++) {
                    var a = this.$.client.children[o];
                    if (void 0 !== a.toolbarIndex && a.toolbarIndex != o) {
                        i = a, s = o;
                        break;
                    }
                }
                if (i && i.hasNode()) {
                    t.insertNodeInParent(n, i.node);
                    var h = this.$.client.children.pop();
                    this.$.client.children.splice(s, 0, h);
                } else t.appendNodeToParent(n);
            }
            return !0;
        }
    },
    tryPushItem: function() {
        if (this.pushItem()) {
            if (!this.isContentOverflowing()) return !0;
            this.popItem();
        }
    },
    isContentOverflowing: function() {
        if (this.$.client.hasNode()) {
            var e = this.$.client.children, t = e.length && e[e.length - 1].hasNode();
            if (t) return this.$.client.reflow(), t.offsetLeft + t.offsetWidth > this.$.client.node.clientWidth;
        }
    },
    findCollapsibleItem: function() {
        for (var e, t = this.$.client.children, n = t.length - 1; e = t[n]; n--) {
            if (!e.unmoveable) return e;
            void 0 === e.toolbarIndex && (e.toolbarIndex = n);
        }
    }
});

// lib\onyx\source\IntegerPicker.js
enyo.kind({
    name: "onyx.IntegerPicker",
    kind: "onyx.Picker",
    published: {
        value: 0,
        min: 0,
        max: 9
    },
    create: function() {
        this.inherited(arguments), this.rangeChanged();
    },
    minChanged: function() {
        this.destroyClientControls(), this.rangeChanged(), this.render();
    },
    maxChanged: function() {
        this.destroyClientControls(), this.rangeChanged(), this.render();
    },
    rangeChanged: function() {
        for (var e = this.min; this.max >= e; e++) this.createComponent({
            content: e,
            active: e === this.value ? !0 : !1
        });
    },
    valueChanged: function() {
        var e = this.getClientControls(), t = e.length;
        this.value = Math.min(this.max, Math.max(this.value, this.min));
        for (var n = 0; t > n; n++) if (this.value === parseInt(e[n].content, 10)) {
            this.setSelected(e[n]);
            break;
        }
    },
    selectedChanged: function(e) {
        e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), 
        this.doChange({
            selected: this.selected,
            content: this.selected.content
        })), this.setValue(parseInt(this.selected.content, 10));
    }
});

// lib\onyx\source\ContextualPopup.js
enyo.kind({
    name: "onyx.ContextualPopup",
    kind: "enyo.Popup",
    modal: !0,
    autoDismiss: !0,
    floating: !1,
    classes: "onyx-contextual-popup enyo-unselectable",
    published: {
        maxHeight: 100,
        scrolling: !0,
        title: void 0,
        actionButtons: []
    },
    statics: {
        subclass: function(t, e) {
            var i = t.prototype;
            e.actionButtons && (i.kindActionButtons = e.actionButtons, delete i.actionButtons);
        }
    },
    vertFlushMargin: 60,
    horizFlushMargin: 50,
    widePopup: 200,
    longPopup: 200,
    horizBuffer: 16,
    events: {
        onTap: ""
    },
    handlers: {
        onActivate: "childControlActivated",
        onRequestShowMenu: "requestShow",
        onRequestHideMenu: "requestHide"
    },
    components: [ {
        name: "title",
        classes: "onyx-contextual-popup-title"
    }, {
        classes: "onyx-contextual-popup-scroller",
        components: [ {
            name: "client",
            kind: "enyo.Scroller",
            vertical: "auto",
            classes: "enyo-unselectable",
            thumb: !1,
            strategyKind: "TouchScrollStrategy"
        } ]
    }, {
        name: "actionButtons",
        classes: "onyx-contextual-popup-action-buttons"
    } ],
    scrollerName: "client",
    create: function() {
        this.inherited(arguments), this.maxHeightChanged(), this.titleChanged(), this.actionButtonsChanged();
    },
    getScroller: function() {
        return this.$[this.scrollerName];
    },
    titleChanged: function() {
        this.$.title.setContent(this.title);
    },
    actionButtonsChanged: function() {
        this.actionButtons ? enyo.forEach(this.actionButtons, function(t) {
            t.kind = "onyx.Button", t.classes = t.classes + " onyx-contextual-popup-action-button", 
            t.popup = this, t.actionButton = !0, this.$.actionButtons.createComponent(t, {
                owner: this.getInstanceOwner()
            });
        }, this) : this.kindActionButtons && enyo.forEach(this.kindActionButtons, function(t) {
            t.kind = "onyx.Button", t.classes = t.classes + " onyx-contextual-popup-action-button", 
            t.popup = this, t.actionButton = !0, this.$.actionButtons.createComponent(t, {
                owner: this
            });
        }, this), this.hasNode() && this.$.actionButtons.render();
    },
    maxHeightChanged: function() {
        this.scrolling && this.getScroller().setMaxHeight(this.maxHeight + "px");
    },
    showingChanged: function() {
        this.inherited(arguments), this.scrolling && this.getScroller().setShowing(this.showing), 
        this.adjustPosition();
    },
    childControlActivated: function() {
        return !0;
    },
    requestShow: function(t, e) {
        var i = e.activator.hasNode();
        return i && (this.activatorOffset = this.getPageOffset(i)), this.show(), !0;
    },
    applyPosition: function(t) {
        var e = "";
        for (var i in t) e += i + ":" + t[i] + (isNaN(t[i]) ? "; " : "px; ");
        this.addStyles(e);
    },
    getPageOffset: function(t) {
        var e = this.getBoundingRect(t), i = void 0 === window.pageYOffset ? document.documentElement.scrollTop : window.pageYOffset, n = void 0 === window.pageXOffset ? document.documentElement.scrollLeft : window.pageXOffset, s = void 0 === e.height ? e.bottom - e.top : e.height, o = void 0 === e.width ? e.right - e.left : e.width;
        return {
            top: e.top + i,
            left: e.left + n,
            height: s,
            width: o
        };
    },
    adjustPosition: function() {
        if (this.showing && this.hasNode()) {
            this.resetPositioning();
            var t = this.getViewWidth(), e = this.getViewHeight(), i = this.vertFlushMargin, n = e - this.vertFlushMargin, s = this.horizFlushMargin, o = t - this.horizFlushMargin;
            if (i > this.activatorOffset.top + this.activatorOffset.height || this.activatorOffset.top > n) {
                if (this.applyVerticalFlushPositioning(s, o)) return;
                if (this.applyHorizontalFlushPositioning(s, o)) return;
                if (this.applyVerticalPositioning()) return;
            } else if ((s > this.activatorOffset.left + this.activatorOffset.width || this.activatorOffset.left > o) && this.applyHorizontalPositioning()) return;
            var a = this.getBoundingRect(this.node);
            if (a.width > this.widePopup) {
                if (this.applyVerticalPositioning()) return;
            } else if (a.height > this.longPopup && this.applyHorizontalPositioning()) return;
            if (this.applyVerticalPositioning()) return;
            if (this.applyHorizontalPositioning()) return;
        }
    },
    initVerticalPositioning: function() {
        this.resetPositioning(), this.addClass("vertical");
        var t = this.getBoundingRect(this.node), e = this.getViewHeight();
        return this.floating ? e / 2 > this.activatorOffset.top ? (this.applyPosition({
            top: this.activatorOffset.top + this.activatorOffset.height,
            bottom: "auto"
        }), this.addClass("below")) : (this.applyPosition({
            top: this.activatorOffset.top - t.height,
            bottom: "auto"
        }), this.addClass("above")) : t.top + t.height > e && e - t.bottom < t.top - t.height ? this.addClass("above") : this.addClass("below"), 
        t = this.getBoundingRect(this.node), t.top + t.height > e || 0 > t.top ? !1 : !0;
    },
    applyVerticalPositioning: function() {
        if (!this.initVerticalPositioning()) return !1;
        var t = this.getBoundingRect(this.node), e = this.getViewWidth();
        if (this.floating) {
            var i = this.activatorOffset.left + this.activatorOffset.width / 2 - t.width / 2;
            i + t.width > e ? (this.applyPosition({
                left: this.activatorOffset.left + this.activatorOffset.width - t.width
            }), this.addClass("left")) : 0 > i ? (this.applyPosition({
                left: this.activatorOffset.left
            }), this.addClass("right")) : this.applyPosition({
                left: i
            });
        } else {
            var n = this.activatorOffset.left + this.activatorOffset.width / 2 - t.left - t.width / 2;
            t.right + n > e ? (this.applyPosition({
                left: this.activatorOffset.left + this.activatorOffset.width - t.right
            }), this.addRemoveClass("left", !0)) : 0 > t.left + n ? this.addRemoveClass("right", !0) : this.applyPosition({
                left: n
            });
        }
        return !0;
    },
    applyVerticalFlushPositioning: function(t, e) {
        if (!this.initVerticalPositioning()) return !1;
        var i = this.getBoundingRect(this.node), n = this.getViewWidth();
        return t > this.activatorOffset.left + this.activatorOffset.width / 2 ? (this.activatorOffset.left + this.activatorOffset.width / 2 < this.horizBuffer ? this.applyPosition({
            left: this.horizBuffer + (this.floating ? 0 : -i.left)
        }) : this.applyPosition({
            left: this.activatorOffset.width / 2 + (this.floating ? this.activatorOffset.left : 0)
        }), this.addClass("right"), this.addClass("corner"), !0) : this.activatorOffset.left + this.activatorOffset.width / 2 > e ? (this.activatorOffset.left + this.activatorOffset.width / 2 > n - this.horizBuffer ? this.applyPosition({
            left: n - this.horizBuffer - i.right
        }) : this.applyPosition({
            left: this.activatorOffset.left + this.activatorOffset.width / 2 - i.right
        }), this.addClass("left"), this.addClass("corner"), !0) : !1;
    },
    initHorizontalPositioning: function() {
        this.resetPositioning();
        var t = this.getBoundingRect(this.node), e = this.getViewWidth();
        return this.floating ? e / 2 > this.activatorOffset.left + this.activatorOffset.width ? (this.applyPosition({
            left: this.activatorOffset.left + this.activatorOffset.width
        }), this.addRemoveClass("left", !0)) : (this.applyPosition({
            left: this.activatorOffset.left - t.width
        }), this.addRemoveClass("right", !0)) : this.activatorOffset.left - t.width > 0 ? (this.applyPosition({
            left: this.activatorOffset.left - t.left - t.width
        }), this.addRemoveClass("right", !0)) : (this.applyPosition({
            left: this.activatorOffset.width
        }), this.addRemoveClass("left", !0)), this.addRemoveClass("horizontal", !0), t = this.getBoundingRect(this.node), 
        0 > t.left || t.left + t.width > e ? !1 : !0;
    },
    applyHorizontalPositioning: function() {
        if (!this.initHorizontalPositioning()) return !1;
        var t = this.getBoundingRect(this.node), e = this.getViewHeight(), i = this.activatorOffset.top + this.activatorOffset.height / 2;
        return this.floating ? i >= e / 2 - .05 * e && e / 2 + .05 * e >= i ? this.applyPosition({
            top: this.activatorOffset.top + this.activatorOffset.height / 2 - t.height / 2,
            bottom: "auto"
        }) : e / 2 > this.activatorOffset.top + this.activatorOffset.height ? (this.applyPosition({
            top: this.activatorOffset.top - this.activatorOffset.height,
            bottom: "auto"
        }), this.addRemoveClass("high", !0)) : (this.applyPosition({
            top: this.activatorOffset.top - t.height + 2 * this.activatorOffset.height,
            bottom: "auto"
        }), this.addRemoveClass("low", !0)) : i >= e / 2 - .05 * e && e / 2 + .05 * e >= i ? this.applyPosition({
            top: (this.activatorOffset.height - t.height) / 2
        }) : e / 2 > this.activatorOffset.top + this.activatorOffset.height ? (this.applyPosition({
            top: -this.activatorOffset.height
        }), this.addRemoveClass("high", !0)) : (this.applyPosition({
            top: t.top - t.height - this.activatorOffset.top + this.activatorOffset.height
        }), this.addRemoveClass("low", !0)), !0;
    },
    applyHorizontalFlushPositioning: function(t, e) {
        if (!this.initHorizontalPositioning()) return !1;
        var i = this.getBoundingRect(this.node), n = this.getViewHeight();
        return this.floating ? n / 2 > this.activatorOffset.top ? (this.applyPosition({
            top: this.activatorOffset.top + this.activatorOffset.height / 2
        }), this.addRemoveClass("high", !0)) : (this.applyPosition({
            top: this.activatorOffset.top + this.activatorOffset.height / 2 - i.height
        }), this.addRemoveClass("low", !0)) : i.top + i.height > n && n - i.bottom < i.top - i.height ? (this.applyPosition({
            top: i.top - i.height - this.activatorOffset.top - this.activatorOffset.height / 2
        }), this.addRemoveClass("low", !0)) : (this.applyPosition({
            top: this.activatorOffset.height / 2
        }), this.addRemoveClass("high", !0)), t > this.activatorOffset.left + this.activatorOffset.width ? (this.addClass("left"), 
        this.addClass("corner"), !0) : this.activatorOffset.left > e ? (this.addClass("right"), 
        this.addClass("corner"), !0) : !1;
    },
    getBoundingRect: function(t) {
        var e = t.getBoundingClientRect();
        return e.width && e.height ? e : {
            left: e.left,
            right: e.right,
            top: e.top,
            bottom: e.bottom,
            width: e.right - e.left,
            height: e.bottom - e.top
        };
    },
    getViewHeight: function() {
        return void 0 === window.innerHeight ? document.documentElement.clientHeight : window.innerHeight;
    },
    getViewWidth: function() {
        return void 0 === window.innerWidth ? document.documentElement.clientWidth : window.innerWidth;
    },
    resetPositioning: function() {
        this.removeClass("right"), this.removeClass("left"), this.removeClass("high"), this.removeClass("low"), 
        this.removeClass("corner"), this.removeClass("below"), this.removeClass("above"), 
        this.removeClass("vertical"), this.removeClass("horizontal"), this.applyPosition({
            left: "auto"
        }), this.applyPosition({
            top: "auto"
        });
    },
    resizeHandler: function() {
        this.inherited(arguments), this.adjustPosition();
    },
    requestHide: function() {
        this.setShowing(!1);
    }
});

// lib\layout\version.js
enyo && enyo.version && (enyo.version.layout = "2.4.0-pre.2");

// lib\layout\contextual\source\ContextualLayout.js
enyo.kind({
    name: "enyo.ContextualLayout",
    kind: "Layout",
    adjustPosition: function() {
        if (this.container.showing && this.container.hasNode()) {
            this.resetPositioning();
            var t = this.getViewWidth(), e = this.getViewHeight(), i = this.container.vertFlushMargin, n = e - this.container.vertFlushMargin, s = this.container.horizFlushMargin, o = t - this.container.horizFlushMargin;
            if (i > this.offset.top + this.offset.height || this.offset.top > n) {
                if (this.applyVerticalFlushPositioning(s, o)) return;
                if (this.applyHorizontalFlushPositioning(s, o)) return;
                if (this.applyVerticalPositioning()) return;
            } else if ((s > this.offset.left + this.offset.width || this.offset.left > o) && this.applyHorizontalPositioning()) return;
            var a = this.getBoundingRect(this.container.node);
            if (a.width > this.container.widePopup) {
                if (this.applyVerticalPositioning()) return;
            } else if (a.height > this.container.longPopup && this.applyHorizontalPositioning()) return;
            if (this.applyVerticalPositioning()) return;
            if (this.applyHorizontalPositioning()) return;
        }
    },
    initVerticalPositioning: function() {
        this.resetPositioning(), this.container.addClass("vertical");
        var t = this.getBoundingRect(this.container.node), e = this.getViewHeight();
        return this.container.floating ? e / 2 > this.offset.top ? (this.applyPosition({
            top: this.offset.top + this.offset.height,
            bottom: "auto"
        }), this.container.addClass("below")) : (this.applyPosition({
            top: this.offset.top - t.height,
            bottom: "auto"
        }), this.container.addClass("above")) : t.top + t.height > e && e - t.bottom < t.top - t.height ? this.container.addClass("above") : this.container.addClass("below"), 
        t = this.getBoundingRect(this.container.node), t.top + t.height > e || 0 > t.top ? !1 : !0;
    },
    applyVerticalPositioning: function() {
        if (!this.initVerticalPositioning()) return !1;
        var t = this.getBoundingRect(this.container.node), e = this.getViewWidth();
        if (this.container.floating) {
            var i = this.offset.left + this.offset.width / 2 - t.width / 2;
            i + t.width > e ? (this.applyPosition({
                left: this.offset.left + this.offset.width - t.width
            }), this.container.addClass("left")) : 0 > i ? (this.applyPosition({
                left: this.offset.left
            }), this.container.addClass("right")) : this.applyPosition({
                left: i
            });
        } else {
            var n = this.offset.left + this.offset.width / 2 - t.left - t.width / 2;
            t.right + n > e ? (this.applyPosition({
                left: this.offset.left + this.offset.width - t.right
            }), this.container.addRemoveClass("left", !0)) : 0 > t.left + n ? this.container.addRemoveClass("right", !0) : this.applyPosition({
                left: n
            });
        }
        return !0;
    },
    applyVerticalFlushPositioning: function(t, e) {
        if (!this.initVerticalPositioning()) return !1;
        var i = this.getBoundingRect(this.container.node), n = this.getViewWidth();
        return t > this.offset.left + this.offset.width / 2 ? (this.offset.left + this.offset.width / 2 < this.container.horizBuffer ? this.applyPosition({
            left: this.container.horizBuffer + (this.container.floating ? 0 : -i.left)
        }) : this.applyPosition({
            left: this.offset.width / 2 + (this.container.floating ? this.offset.left : 0)
        }), this.container.addClass("right"), this.container.addClass("corner"), !0) : this.offset.left + this.offset.width / 2 > e ? (this.offset.left + this.offset.width / 2 > n - this.container.horizBuffer ? this.applyPosition({
            left: n - this.container.horizBuffer - i.right
        }) : this.applyPosition({
            left: this.offset.left + this.offset.width / 2 - i.right
        }), this.container.addClass("left"), this.container.addClass("corner"), !0) : !1;
    },
    initHorizontalPositioning: function() {
        this.resetPositioning();
        var t = this.getBoundingRect(this.container.node), e = this.getViewWidth();
        return this.container.floating ? e / 2 > this.offset.left + this.offset.width ? (this.applyPosition({
            left: this.offset.left + this.offset.width
        }), this.container.addRemoveClass("left", !0)) : (this.applyPosition({
            left: this.offset.left - t.width
        }), this.container.addRemoveClass("right", !0)) : this.offset.left - t.width > 0 ? (this.applyPosition({
            left: this.offset.left - t.left - t.width
        }), this.container.addRemoveClass("right", !0)) : (this.applyPosition({
            left: this.offset.width
        }), this.container.addRemoveClass("left", !0)), this.container.addRemoveClass("horizontal", !0), 
        t = this.getBoundingRect(this.container.node), 0 > t.left || t.left + t.width > e ? !1 : !0;
    },
    applyHorizontalPositioning: function() {
        if (!this.initHorizontalPositioning()) return !1;
        var t = this.getBoundingRect(this.container.node), e = this.getViewHeight(), i = this.offset.top + this.offset.height / 2;
        return this.container.floating ? i >= e / 2 - .05 * e && e / 2 + .05 * e >= i ? this.applyPosition({
            top: this.offset.top + this.offset.height / 2 - t.height / 2,
            bottom: "auto"
        }) : e / 2 > this.offset.top + this.offset.height ? (this.applyPosition({
            top: this.offset.top,
            bottom: "auto"
        }), this.container.addRemoveClass("high", !0)) : (this.applyPosition({
            top: this.offset.top - t.height + 2 * this.offset.height,
            bottom: "auto"
        }), this.container.addRemoveClass("low", !0)) : i >= e / 2 - .05 * e && e / 2 + .05 * e >= i ? this.applyPosition({
            top: (this.offset.height - t.height) / 2
        }) : e / 2 > this.offset.top + this.offset.height ? (this.applyPosition({
            top: -this.offset.height
        }), this.container.addRemoveClass("high", !0)) : (this.applyPosition({
            top: t.top - t.height - this.offset.top + this.offset.height
        }), this.container.addRemoveClass("low", !0)), !0;
    },
    applyHorizontalFlushPositioning: function(t, e) {
        if (!this.initHorizontalPositioning()) return !1;
        var i = this.getBoundingRect(this.container.node), n = this.getViewHeight();
        return this.container.floating ? n / 2 > this.offset.top ? (this.applyPosition({
            top: this.offset.top + this.offset.height / 2
        }), this.container.addRemoveClass("high", !0)) : (this.applyPosition({
            top: this.offset.top + this.offset.height / 2 - i.height
        }), this.container.addRemoveClass("low", !0)) : i.top + i.height > n && n - i.bottom < i.top - i.height ? (this.applyPosition({
            top: i.top - i.height - this.offset.top - this.offset.height / 2
        }), this.container.addRemoveClass("low", !0)) : (this.applyPosition({
            top: this.offset.height / 2
        }), this.container.addRemoveClass("high", !0)), t > this.offset.left + this.offset.width ? (this.container.addClass("left"), 
        this.container.addClass("corner"), !0) : this.offset.left > e ? (this.container.addClass("right"), 
        this.container.addClass("corner"), !0) : !1;
    },
    getBoundingRect: function(t) {
        var e = t.getBoundingClientRect();
        return e.width && e.height ? e : {
            left: e.left,
            right: e.right,
            top: e.top,
            bottom: e.bottom,
            width: e.right - e.left,
            height: e.bottom - e.top
        };
    },
    getViewHeight: function() {
        return void 0 === window.innerHeight ? document.documentElement.clientHeight : window.innerHeight;
    },
    getViewWidth: function() {
        return void 0 === window.innerWidth ? document.documentElement.clientWidth : window.innerWidth;
    },
    applyPosition: function(t) {
        var e = "";
        for (var i in t) e += i + ":" + t[i] + (isNaN(t[i]) ? "; " : "px; ");
        this.container.addStyles(e);
    },
    resetPositioning: function() {
        this.container.removeClass("right"), this.container.removeClass("left"), this.container.removeClass("high"), 
        this.container.removeClass("low"), this.container.removeClass("corner"), this.container.removeClass("below"), 
        this.container.removeClass("above"), this.container.removeClass("vertical"), this.container.removeClass("horizontal"), 
        this.applyPosition({
            left: "auto"
        }), this.applyPosition({
            top: "auto"
        });
    },
    reflow: function() {
        this.offset = this.container.activatorOffset, this.adjustPosition();
    }
});

// lib\layout\fittable\source\FittableLayout.js
enyo.kind({
    name: "enyo.FittableLayout",
    kind: "Layout",
    constructor: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.container.addRemoveClass("force-left-to-right", enyo.Control.prototype.rtl && !this.container.get("rtl"));
        };
    }),
    calcFitIndex: function() {
        var t, e, i = this.container.children;
        for (e = 0; i.length > e; e++) if (t = i[e], t.fit && t.showing) return e;
    },
    getFitControl: function() {
        var t = this.container.children, e = t[this.fitIndex];
        return e && e.fit && e.showing || (this.fitIndex = this.calcFitIndex(), e = t[this.fitIndex]), 
        e;
    },
    shouldReverse: function() {
        return this.container.rtl && "h" === this.orient;
    },
    getFirstChild: function() {
        var t = this.getShowingChildren();
        return this.shouldReverse() ? t[t.length - 1] : t[0];
    },
    getLastChild: function() {
        var t = this.getShowingChildren();
        return this.shouldReverse() ? t[0] : t[t.length - 1];
    },
    getShowingChildren: function() {
        for (var t = [], e = 0, i = this.container.children, n = i.length; n > e; e++) i[e].showing && t.push(i[e]);
        return t;
    },
    _reflow: function(t, e, i, n) {
        this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
        var s, o, a, h, r, l = this.getFitControl(), d = this.container.hasNode(), c = 0, u = 0, f = 0;
        if (l && d) {
            if (s = enyo.dom.calcPaddingExtents(d), o = l.getBounds(), c = d[e] - (s[i] + s[n]), 
            this.shouldReverse()) {
                h = this.getFirstChild(), f = c - (o[i] + o[t]);
                var g = enyo.dom.getComputedBoxValue(h.hasNode(), "margin", i) || 0;
                if (h == l) u = g; else {
                    var p = h.getBounds(), m = p[i];
                    u = o[i] + g - m;
                }
            } else {
                a = this.getLastChild(), u = o[i] - (s[i] || 0);
                var v = enyo.dom.getComputedBoxValue(a.hasNode(), "margin", n) || 0;
                if (a == l) f = v; else {
                    var y = a.getBounds(), C = o[i] + o[t], w = y[i] + y[t] + v;
                    f = w - C;
                }
            }
            r = c - (u + f), l.applyStyle(t, r + "px");
        }
    },
    reflow: function() {
        "h" == this.orient ? this._reflow("width", "clientWidth", "left", "right") : this._reflow("height", "clientHeight", "top", "bottom");
    }
}), enyo.kind({
    name: "enyo.FittableColumnsLayout",
    kind: "FittableLayout",
    orient: "h",
    layoutClass: "enyo-fittable-columns-layout"
}), enyo.kind({
    name: "enyo.FittableRowsLayout",
    kind: "FittableLayout",
    layoutClass: "enyo-fittable-rows-layout",
    orient: "v"
});

// lib\layout\fittable\source\FittableRows.js
enyo.kind({
    name: "enyo.FittableRows",
    layoutKind: "FittableRowsLayout",
    noStretch: !1
});

// lib\layout\fittable\source\FittableColumns.js
enyo.kind({
    name: "enyo.FittableColumns",
    layoutKind: "FittableColumnsLayout",
    noStretch: !1
});

// lib\layout\fittable\source\FittableHeaderLayout.js
enyo.kind({
    name: "enyo.FittableHeaderLayout",
    kind: "FittableColumnsLayout",
    applyFitSize: enyo.inherit(function(t) {
        return function(e, i, n, s) {
            var o = n - s, a = this.getFitControl();
            0 > o ? (a.applyStyle("padding-left", Math.abs(o) + "px"), a.applyStyle("padding-right", null)) : o > 0 ? (a.applyStyle("padding-left", null), 
            a.applyStyle("padding-right", Math.abs(o) + "px")) : (a.applyStyle("padding-left", null), 
            a.applyStyle("padding-right", null)), t.apply(this, arguments);
        };
    })
});

// lib\layout\list\source\FlyweightRepeater.js
enyo.kind({
    name: "enyo.FlyweightRepeater",
    published: {
        count: 0,
        noSelect: !1,
        multiSelect: !1,
        toggleSelected: !1,
        clientClasses: "",
        clientStyle: "",
        rowOffset: 0,
        orient: "v"
    },
    events: {
        onSetupItem: "",
        onRenderRow: ""
    },
    bottomUp: !1,
    components: [ {
        kind: "Selection",
        onSelect: "selectDeselect",
        onDeselect: "selectDeselect"
    }, {
        name: "client"
    } ],
    create: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.noSelectChanged(), this.multiSelectChanged(), this.clientClassesChanged(), 
            this.clientStyleChanged();
        };
    }),
    noSelectChanged: function() {
        this.noSelect && this.$.selection.clear();
    },
    multiSelectChanged: function() {
        this.$.selection.setMulti(this.multiSelect);
    },
    clientClassesChanged: function() {
        this.$.client.setClasses(this.clientClasses);
    },
    clientStyleChanged: function() {
        this.$.client.setStyle(this.clientStyle);
    },
    setupItem: function(t) {
        this.doSetupItem({
            index: t,
            selected: this.isSelected(t)
        });
    },
    generateChildHtml: enyo.inherit(function(t) {
        return function() {
            var e = "";
            this.index = null;
            for (var i = 0, n = 0; this.count > i; i++) n = this.rowOffset + (this.bottomUp ? this.count - i - 1 : i), 
            this.setupItem(n), this.$.client.setAttribute("data-enyo-index", n), "h" == this.orient && this.$.client.setStyle("display:inline-block;"), 
            e += t.apply(this, arguments), this.$.client.teardownRender();
            return e;
        };
    }),
    previewDomEvent: function(t) {
        var e = this.index = this.rowForEvent(t);
        t.rowIndex = t.index = e, t.flyweight = this;
    },
    decorateEvent: enyo.inherit(function(t) {
        return function(e, i) {
            var n = i && null != i.index ? i.index : this.index;
            i && null != n && (i.index = n, i.flyweight = this), t.apply(this, arguments);
        };
    }),
    tap: function(t, e) {
        this.noSelect || -1 === e.index || (this.toggleSelected ? this.$.selection.toggle(e.index) : this.$.selection.select(e.index));
    },
    selectDeselect: function(t, e) {
        this.renderRow(e.key);
    },
    getSelection: function() {
        return this.$.selection;
    },
    isSelected: function(t) {
        return this.getSelection().isSelected(t);
    },
    renderRow: function(t) {
        if (!(this.rowOffset > t || t >= this.count + this.rowOffset)) {
            this.setupItem(t);
            var e = this.fetchRowNode(t);
            e && (enyo.dom.setInnerHtml(e, this.$.client.generateChildHtml()), this.$.client.teardownChildren(), 
            this.doRenderRow({
                rowIndex: t
            }));
        }
    },
    fetchRowNode: function(t) {
        return this.hasNode() ? this.node.querySelector('[data-enyo-index="' + t + '"]') : void 0;
    },
    rowForEvent: function(t) {
        if (!this.hasNode()) return -1;
        for (var e = t.target; e && e !== this.node; ) {
            var i = e.getAttribute && e.getAttribute("data-enyo-index");
            if (null !== i) return Number(i);
            e = e.parentNode;
        }
        return -1;
    },
    prepareRow: function(t) {
        if (!(this.rowOffset > t || t >= this.count + this.rowOffset)) {
            this.setupItem(t);
            var e = this.fetchRowNode(t);
            enyo.FlyweightRepeater.claimNode(this.$.client, e);
        }
    },
    lockRow: function() {
        this.$.client.teardownChildren();
    },
    performOnRow: function(t, e, i) {
        this.rowOffset > t || t >= this.count + this.rowOffset || e && (this.prepareRow(t), 
        enyo.call(i || null, e), this.lockRow());
    },
    statics: {
        claimNode: function(t, e) {
            var i;
            e && (i = e.id !== t.id ? e.querySelector("#" + t.id) : e), t.generated = Boolean(i || !t.tag), 
            t.node = i, t.node && t.rendered();
            for (var n, s = 0, o = t.children; n = o[s]; s++) this.claimNode(n, e);
        }
    }
});

// lib\layout\list\source\List.js
enyo.kind({
    name: "enyo.List",
    kind: "Scroller",
    classes: "enyo-list",
    published: {
        count: 0,
        rowsPerPage: 50,
        orient: "v",
        bottomUp: !1,
        noSelect: !1,
        multiSelect: !1,
        toggleSelected: !1,
        fixedSize: !1,
        reorderable: !1,
        centerReorderContainer: !0,
        reorderComponents: [],
        pinnedReorderComponents: [],
        swipeableComponents: [],
        enableSwipe: !1,
        persistSwipeableItem: !1
    },
    events: {
        onSetupItem: "",
        onSetupReorderComponents: "",
        onSetupPinnedReorderComponents: "",
        onReorder: "",
        onSetupSwipeItem: "",
        onSwipeDrag: "",
        onSwipe: "",
        onSwipeComplete: ""
    },
    handlers: {
        onAnimateFinish: "animateFinish",
        onRenderRow: "rowRendered",
        ondragstart: "dragstart",
        ondrag: "drag",
        ondragfinish: "dragfinish",
        onup: "up",
        onholdpulse: "holdpulse",
        onflick: "flick"
    },
    rowSize: 0,
    listTools: [ {
        name: "port",
        classes: "enyo-list-port enyo-border-box",
        components: [ {
            name: "generator",
            kind: "FlyweightRepeater",
            canGenerate: !1,
            components: [ {
                tag: null,
                name: "client"
            } ]
        }, {
            name: "holdingarea",
            allowHtml: !0,
            classes: "enyo-list-holdingarea"
        }, {
            name: "page0",
            allowHtml: !0,
            classes: "enyo-list-page"
        }, {
            name: "page1",
            allowHtml: !0,
            classes: "enyo-list-page"
        }, {
            name: "placeholder",
            classes: "enyo-list-placeholder"
        }, {
            name: "swipeableComponents",
            style: "position:absolute; display:block; top:-1000px; left:0;"
        } ]
    } ],
    reorderHoldTimeMS: 600,
    draggingRowIndex: -1,
    initHoldCounter: 3,
    holdCounter: 3,
    holding: !1,
    draggingRowNode: null,
    placeholderRowIndex: -1,
    dragToScrollThreshold: .1,
    prevScrollTop: 0,
    autoScrollTimeoutMS: 20,
    autoScrollTimeout: null,
    autoscrollPageY: 0,
    pinnedReorderMode: !1,
    initialPinPosition: -1,
    itemMoved: !1,
    currentPageNumber: -1,
    completeReorderTimeout: null,
    swipeIndex: null,
    swipeDirection: null,
    persistentItemVisible: !1,
    persistentItemOrigin: null,
    swipeComplete: !1,
    completeSwipeTimeout: null,
    completeSwipeDelayMS: 500,
    normalSwipeSpeedMS: 200,
    fastSwipeSpeedMS: 100,
    percentageDraggedThreshold: .2,
    importProps: enyo.inherit(function(t) {
        return function(e) {
            e && e.reorderable && (this.touch = !0), t.apply(this, arguments);
        };
    }),
    create: enyo.inherit(function(t) {
        return function() {
            this.pageSizes = [], this.orientV = "v" == this.orient, this.vertical = this.orientV ? "default" : "hidden", 
            t.apply(this, arguments), this.$.generator.orient = this.orient, this.getStrategy().translateOptimized = !0, 
            this.$.port.addRemoveClass("horizontal", !this.orientV), this.$.port.addRemoveClass("vertical", this.orientV), 
            this.$.page0.addRemoveClass("vertical", this.orientV), this.$.page1.addRemoveClass("vertical", this.orientV), 
            this.bottomUpChanged(), this.noSelectChanged(), this.multiSelectChanged(), this.toggleSelectedChanged(), 
            this.$.generator.setRowOffset(0), this.$.generator.setCount(this.count);
        };
    }),
    initComponents: enyo.inherit(function(t) {
        return function() {
            this.createReorderTools(), t.apply(this, arguments), this.createSwipeableComponents();
        };
    }),
    createReorderTools: function() {
        this.createComponent({
            name: "reorderContainer",
            classes: "enyo-list-reorder-container",
            ondown: "sendToStrategy",
            ondrag: "sendToStrategy",
            ondragstart: "sendToStrategy",
            ondragfinish: "sendToStrategy",
            onflick: "sendToStrategy"
        });
    },
    createStrategy: enyo.inherit(function(t) {
        return function() {
            this.controlParentName = "strategy", t.apply(this, arguments), this.createChrome(this.listTools), 
            this.controlParentName = "client", this.discoverControlParent();
        };
    }),
    createSwipeableComponents: function() {
        for (var t = 0; this.swipeableComponents.length > t; t++) this.$.swipeableComponents.createComponent(this.swipeableComponents[t], {
            owner: this.owner
        });
    },
    rendered: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.$.generator.node = this.$.port.hasNode(), this.$.generator.generated = !0, 
            this.reset();
        };
    }),
    resizeHandler: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.refresh();
        };
    }),
    bottomUpChanged: function() {
        this.$.generator.bottomUp = this.bottomUp, this.$.page0.applyStyle(this.pageBound, null), 
        this.$.page1.applyStyle(this.pageBound, null), this.pageBound = this.orientV ? this.bottomUp ? "bottom" : "top" : this.rtl ? this.bottomUp ? "left" : "right" : this.bottomUp ? "right" : "left", 
        !this.orientV && this.bottomUp && (this.$.page0.applyStyle("left", "auto"), this.$.page1.applyStyle("left", "auto")), 
        this.hasNode() && this.reset();
    },
    noSelectChanged: function() {
        this.$.generator.setNoSelect(this.noSelect);
    },
    multiSelectChanged: function() {
        this.$.generator.setMultiSelect(this.multiSelect);
    },
    toggleSelectedChanged: function() {
        this.$.generator.setToggleSelected(this.toggleSelected);
    },
    countChanged: function() {
        this.hasNode() && this.updateMetrics();
    },
    sendToStrategy: function(t, e) {
        this.$.strategy.dispatchEvent("on" + e.type, e, t);
    },
    updateMetrics: function() {
        this.defaultPageSize = this.rowsPerPage * (this.rowSize || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), 
        this.portSize = 0;
        for (var t = 0; this.pageCount > t; t++) this.portSize += this.getPageSize(t);
        this.adjustPortSize();
    },
    holdpulse: function(t, e) {
        return this.getReorderable() && !this.isReordering() ? e.holdTime >= this.reorderHoldTimeMS && this.shouldStartReordering(t, e) ? (this.startReordering(e), 
        !1) : void 0 : void 0;
    },
    dragstart: function(t, e) {
        return this.isReordering() ? !0 : this.isSwipeable() ? this.swipeDragStart(t, e) : void 0;
    },
    drag: function(t, e) {
        return this.shouldDoReorderDrag(e) ? (e.preventDefault(), this.reorderDrag(e), !0) : this.isSwipeable() ? (e.preventDefault(), 
        this.swipeDrag(t, e), !0) : void 0;
    },
    dragfinish: function(t, e) {
        this.isReordering() ? this.finishReordering(t, e) : this.isSwipeable() && this.swipeDragFinish(t, e);
    },
    up: function(t, e) {
        this.isReordering() && this.finishReordering(t, e);
    },
    generatePage: function(t, e) {
        this.page = t;
        var i = this.rowsPerPage * this.page;
        this.$.generator.setRowOffset(i);
        var n = Math.min(this.count - i, this.rowsPerPage);
        this.$.generator.setCount(n);
        var o = this.$.generator.generateChildHtml();
        e.setContent(o), this.getReorderable() && this.draggingRowIndex > -1 && this.hideReorderingRow();
        var s = e.getBounds(), a = this.orientV ? s.height : s.width;
        if (!this.rowSize && a > 0 && (this.rowSize = Math.floor(a / n), this.updateMetrics()), 
        !this.fixedSize) {
            var h = this.getPageSize(t);
            h != a && a > 0 && (this.pageSizes[t] = a, this.portSize += a - h);
        }
    },
    pageForRow: function(t) {
        return Math.floor(t / this.rowsPerPage);
    },
    preserveDraggingRowNode: function(t) {
        this.draggingRowNode && this.pageForRow(this.draggingRowIndex) === t && (this.$.holdingarea.hasNode().appendChild(this.draggingRowNode), 
        this.draggingRowNode = null, this.removedInitialPage = !0);
    },
    update: function(t) {
        var e = !1, i = this.positionToPageInfo(t), n = i.pos + this.scrollerSize / 2, o = Math.floor(n / Math.max(i.size, this.scrollerSize) + .5) + i.no, s = 0 === o % 2 ? o : o - 1;
        this.p0 != s && this.isPageInRange(s) && (this.preserveDraggingRowNode(this.p0), 
        this.generatePage(s, this.$.page0), this.positionPage(s, this.$.page0), this.p0 = s, 
        e = !0, this.p0RowBounds = this.getPageRowSizes(this.$.page0)), s = 0 === o % 2 ? Math.max(1, o - 1) : o, 
        this.p1 != s && this.isPageInRange(s) && (this.preserveDraggingRowNode(this.p1), 
        this.generatePage(s, this.$.page1), this.positionPage(s, this.$.page1), this.p1 = s, 
        e = !0, this.p1RowBounds = this.getPageRowSizes(this.$.page1)), e && (this.$.generator.setRowOffset(0), 
        this.$.generator.setCount(this.count), this.fixedSize || (this.adjustBottomPage(), 
        this.adjustPortSize()));
    },
    getPageRowSizes: function(t) {
        for (var e, i, n = {}, o = t.hasNode().querySelectorAll("div[data-enyo-index]"), s = 0; o.length > s; s++) e = o[s].getAttribute("data-enyo-index"), 
        null !== e && (i = enyo.dom.getBounds(o[s]), n[parseInt(e, 10)] = {
            height: i.height,
            width: i.width
        });
        return n;
    },
    updateRowBounds: function(t) {
        this.p0RowBounds[t] ? this.updateRowBoundsAtIndex(t, this.p0RowBounds, this.$.page0) : this.p1RowBounds[t] && this.updateRowBoundsAtIndex(t, this.p1RowBounds, this.$.page1);
    },
    updateRowBoundsAtIndex: function(t, e, i) {
        var n = i.hasNode().querySelector('div[data-enyo-index="' + t + '"]'), o = enyo.dom.getBounds(n);
        e[t].height = o.height, e[t].width = o.width;
    },
    updateForPosition: function(t) {
        this.update(this.calcPos(t));
    },
    calcPos: function(t) {
        return this.bottomUp ? this.portSize - this.scrollerSize - t : t;
    },
    adjustBottomPage: function() {
        var t = this.p0 >= this.p1 ? this.$.page0 : this.$.page1;
        this.positionPage(t.pageNo, t);
    },
    adjustPortSize: function() {
        this.scrollerSize = this.orientV ? this.getBounds().height : this.getBounds().width;
        var t = Math.max(this.scrollerSize, this.portSize);
        this.$.port.applyStyle(this.orientV ? "height" : "width", t + "px"), this.orientV || this.$.port.applyStyle("height", this.getBounds().height + "px");
    },
    positionPage: function(t, e) {
        e.pageNo = t;
        var i = this.pageToPosition(t);
        e.applyStyle(this.pageBound, i + "px");
    },
    pageToPosition: function(t) {
        for (var e = 0, i = t; i > 0; ) i--, e += this.getPageSize(i);
        return e;
    },
    positionToPageInfo: function(t) {
        for (var e = -1, i = this.calcPos(t), n = this.defaultPageSize; i >= 0; ) e++, n = this.getPageSize(e), 
        i -= n;
        return e = Math.max(e, 0), {
            no: e,
            size: n,
            pos: i + n,
            startRow: e * this.rowsPerPage,
            endRow: Math.min((e + 1) * this.rowsPerPage - 1, this.count - 1)
        };
    },
    isPageInRange: function(t) {
        return t == Math.max(0, Math.min(this.pageCount - 1, t));
    },
    getPageSize: function(t) {
        var e = this.pageSizes[t];
        if (!e) {
            var i = this.rowsPerPage * t, n = Math.min(this.count - i, this.rowsPerPage);
            e = this.defaultPageSize * (n / this.rowsPerPage);
        }
        return Math.max(1, e);
    },
    invalidatePages: function() {
        this.p0 = this.p1 = null, this.p0RowBounds = {}, this.p1RowBounds = {}, this.$.page0.setContent(""), 
        this.$.page1.setContent("");
    },
    invalidateMetrics: function() {
        this.pageSizes = [], this.rowSize = 0, this.updateMetrics();
    },
    scroll: enyo.inherit(function(t) {
        return function(e, i) {
            var n = t.apply(this, arguments), o = this.orientV ? this.getScrollTop() : this.getScrollLeft();
            return this.lastPos === o ? n : (this.lastPos = o, this.update(o), this.pinnedReorderMode && this.reorderScroll(e, i), 
            n);
        };
    }),
    setScrollTop: enyo.inherit(function(t) {
        return function(e) {
            this.update(e), t.apply(this, arguments), this.twiddle();
        };
    }),
    getScrollPosition: function() {
        return this.calcPos(this[this.orientV ? "getScrollTop" : "getScrollLeft"]());
    },
    setScrollPosition: function(t) {
        this[this.orientV ? "setScrollTop" : "setScrollLeft"](this.calcPos(t));
    },
    scrollToBottom: enyo.inherit(function(t) {
        return function() {
            this.update(this.getScrollBounds().maxTop), t.apply(this, arguments);
        };
    }),
    scrollToRow: function(t) {
        var e = this.pageForRow(t), i = this.pageToPosition(e);
        if (this.updateForPosition(i), i = this.pageToPosition(e), this.setScrollPosition(i), 
        e == this.p0 || e == this.p1) {
            var n = this.$.generator.fetchRowNode(t);
            if (n) {
                var o = this.orientV ? n.offsetTop : n.offsetLeft;
                this.bottomUp && (o = this.getPageSize(e) - (this.orientV ? n.offsetHeight : n.offsetWidth) - o);
                var s = this.getScrollPosition() + o;
                this.setScrollPosition(s);
            }
        }
    },
    scrollToStart: function() {
        this[this.bottomUp ? this.orientV ? "scrollToBottom" : "scrollToRight" : "scrollToTop"]();
    },
    scrollToEnd: function() {
        this[this.bottomUp ? this.orientV ? "scrollToTop" : "scrollToLeft" : this.orientV ? "scrollToBottom" : "scrollToRight"]();
    },
    refresh: function() {
        this.invalidatePages(), this.update(this[this.orientV ? "getScrollTop" : "getScrollLeft"]()), 
        this.stabilize(), 4 === enyo.platform.android && this.twiddle();
    },
    reset: function() {
        this.getSelection().clear(), this.invalidateMetrics(), this.invalidatePages(), this.stabilize(), 
        this.scrollToStart();
    },
    getSelection: function() {
        return this.$.generator.getSelection();
    },
    select: function(t, e) {
        return this.getSelection().select(t, e);
    },
    deselect: function(t) {
        return this.getSelection().deselect(t);
    },
    isSelected: function(t) {
        return this.$.generator.isSelected(t);
    },
    renderRow: function(t) {
        this.$.generator.renderRow(t);
    },
    rowRendered: function(t, e) {
        this.updateRowBounds(e.rowIndex);
    },
    prepareRow: function(t) {
        this.$.generator.prepareRow(t);
    },
    lockRow: function() {
        this.$.generator.lockRow();
    },
    performOnRow: function(t, e, i) {
        this.$.generator.performOnRow(t, e, i);
    },
    animateFinish: function() {
        return this.twiddle(), !0;
    },
    twiddle: function() {
        var t = this.getStrategy();
        enyo.call(t, "twiddle");
    },
    pageForPageNumber: function(t, e) {
        return 0 === t % 2 ? e && t !== this.p0 ? null : this.$.page0 : e && t !== this.p1 ? null : this.$.page1;
    },
    shouldStartReordering: function(t, e) {
        return !this.getReorderable() || null == e.rowIndex || 0 > e.rowIndex || this.pinnedReorderMode || t !== this.$.strategy || null == e.index || 0 > e.index ? !1 : !0;
    },
    startReordering: function(t) {
        this.$.strategy.listReordering = !0, this.buildReorderContainer(), this.doSetupReorderComponents(t), 
        this.styleReorderContainer(t), this.draggingRowIndex = this.placeholderRowIndex = t.rowIndex, 
        this.draggingRowNode = t.target, this.removedInitialPage = !1, this.itemMoved = !1, 
        this.initialPageNumber = this.currentPageNumber = this.pageForRow(t.rowIndex), this.prevScrollTop = this.getScrollTop(), 
        this.replaceNodeWithPlaceholder(t.rowIndex);
    },
    buildReorderContainer: function() {
        this.$.reorderContainer.destroyClientControls();
        for (var t = 0; this.reorderComponents.length > t; t++) this.$.reorderContainer.createComponent(this.reorderComponents[t], {
            owner: this.owner
        });
        this.$.reorderContainer.render();
    },
    styleReorderContainer: function(t) {
        this.setItemPosition(this.$.reorderContainer, t.rowIndex), this.setItemBounds(this.$.reorderContainer, t.rowIndex), 
        this.$.reorderContainer.setShowing(!0), this.centerReorderContainer && this.centerReorderContainerOnPointer(t);
    },
    appendNodeToReorderContainer: function(t) {
        this.$.reorderContainer.createComponent({
            allowHtml: !0,
            content: t.innerHTML
        }).render();
    },
    centerReorderContainerOnPointer: function(t) {
        var e = enyo.dom.calcNodePosition(this.hasNode()), i = t.pageX - e.left - parseInt(this.$.reorderContainer.domStyles.width, 10) / 2, n = t.pageY - e.top + this.getScrollTop() - parseInt(this.$.reorderContainer.domStyles.height, 10) / 2;
        "ScrollStrategy" != this.getStrategyKind() && (i -= this.getScrollLeft(), n -= this.getScrollTop()), 
        this.positionReorderContainer(i, n);
    },
    positionReorderContainer: function(t, e) {
        this.$.reorderContainer.addClass("enyo-animatedTopAndLeft"), this.$.reorderContainer.addStyles("left:" + t + "px;top:" + e + "px;"), 
        this.setPositionReorderContainerTimeout();
    },
    setPositionReorderContainerTimeout: function() {
        this.clearPositionReorderContainerTimeout(), this.positionReorderContainerTimeout = setTimeout(this.bindSafely(function() {
            this.$.reorderContainer.removeClass("enyo-animatedTopAndLeft"), this.clearPositionReorderContainerTimeout();
        }), 100);
    },
    clearPositionReorderContainerTimeout: function() {
        this.positionReorderContainerTimeout && (clearTimeout(this.positionReorderContainerTimeout), 
        this.positionReorderContainerTimeout = null);
    },
    shouldDoReorderDrag: function() {
        return !this.getReorderable() || 0 > this.draggingRowIndex || this.pinnedReorderMode ? !1 : !0;
    },
    reorderDrag: function(t) {
        this.positionReorderNode(t), this.checkForAutoScroll(t), this.updatePlaceholderPosition(t.pageY);
    },
    updatePlaceholderPosition: function(t) {
        var e = this.getRowIndexFromCoordinate(t);
        -1 !== e && (e >= this.placeholderRowIndex ? this.movePlaceholderToIndex(Math.min(this.count, e + 1)) : this.movePlaceholderToIndex(e));
    },
    positionReorderNode: function(t) {
        var e = this.$.reorderContainer.getBounds(), i = e.left + t.ddx, n = e.top + t.ddy;
        n = "ScrollStrategy" == this.getStrategyKind() ? n + (this.getScrollTop() - this.prevScrollTop) : n, 
        this.$.reorderContainer.addStyles("top: " + n + "px ; left: " + i + "px"), this.prevScrollTop = this.getScrollTop();
    },
    checkForAutoScroll: function(t) {
        var e, i = enyo.dom.calcNodePosition(this.hasNode()), n = this.getBounds();
        this.autoscrollPageY = t.pageY, t.pageY - i.top < n.height * this.dragToScrollThreshold ? (e = 100 * (1 - (t.pageY - i.top) / (n.height * this.dragToScrollThreshold)), 
        this.scrollDistance = -1 * e) : t.pageY - i.top > n.height * (1 - this.dragToScrollThreshold) ? (e = 100 * ((t.pageY - i.top - n.height * (1 - this.dragToScrollThreshold)) / (n.height - n.height * (1 - this.dragToScrollThreshold))), 
        this.scrollDistance = 1 * e) : this.scrollDistance = 0, 0 === this.scrollDistance ? this.stopAutoScrolling() : this.autoScrollTimeout || this.startAutoScrolling();
    },
    stopAutoScrolling: function() {
        this.autoScrollTimeout && (clearTimeout(this.autoScrollTimeout), this.autoScrollTimeout = null);
    },
    startAutoScrolling: function() {
        this.autoScrollTimeout = setInterval(this.bindSafely(this.autoScroll), this.autoScrollTimeoutMS);
    },
    autoScroll: function() {
        0 === this.scrollDistance ? this.stopAutoScrolling() : this.autoScrollTimeout || this.startAutoScrolling(), 
        this.setScrollPosition(this.getScrollPosition() + this.scrollDistance), this.positionReorderNode({
            ddx: 0,
            ddy: 0
        }), this.updatePlaceholderPosition(this.autoscrollPageY);
    },
    movePlaceholderToIndex: function(t) {
        var e, i;
        if (!(0 > t)) {
            t >= this.count ? (e = null, i = this.pageForPageNumber(this.pageForRow(this.count - 1)).hasNode()) : (e = this.$.generator.fetchRowNode(t), 
            i = e.parentNode);
            var n = this.pageForRow(t);
            n >= this.pageCount && (n = this.currentPageNumber), i.insertBefore(this.placeholderNode, e), 
            this.currentPageNumber !== n && (this.updatePageSize(this.currentPageNumber), this.updatePageSize(n), 
            this.updatePagePositions(n)), this.placeholderRowIndex = t, this.currentPageNumber = n, 
            this.itemMoved = !0;
        }
    },
    finishReordering: function(t, e) {
        return !this.isReordering() || this.pinnedReorderMode || this.completeReorderTimeout ? void 0 : (this.stopAutoScrolling(), 
        this.$.strategy.listReordering = !1, this.moveReorderedContainerToDroppedPosition(e), 
        this.completeReorderTimeout = setTimeout(this.bindSafely(this.completeFinishReordering, e), 100), 
        e.preventDefault(), !0);
    },
    moveReorderedContainerToDroppedPosition: function() {
        var t = this.getRelativeOffset(this.placeholderNode, this.hasNode()), e = "ScrollStrategy" == this.getStrategyKind() ? t.top : t.top - this.getScrollTop(), i = t.left - this.getScrollLeft();
        this.positionReorderContainer(i, e);
    },
    completeFinishReordering: function(t) {
        return this.completeReorderTimeout = null, this.placeholderRowIndex > this.draggingRowIndex && (this.placeholderRowIndex = Math.max(0, this.placeholderRowIndex - 1)), 
        this.draggingRowIndex != this.placeholderRowIndex || !this.pinnedReorderComponents.length || this.pinnedReorderMode || this.itemMoved ? (this.removeDraggingRowNode(), 
        this.removePlaceholderNode(), this.emptyAndHideReorderContainer(), this.pinnedReorderMode = !1, 
        this.reorderRows(t), this.draggingRowIndex = this.placeholderRowIndex = -1, this.refresh(), 
        void 0) : (this.beginPinnedReorder(t), void 0);
    },
    beginPinnedReorder: function(t) {
        this.buildPinnedReorderContainer(), this.doSetupPinnedReorderComponents(enyo.mixin(t, {
            index: this.draggingRowIndex
        })), this.pinnedReorderMode = !0, this.initialPinPosition = t.pageY;
    },
    emptyAndHideReorderContainer: function() {
        this.$.reorderContainer.destroyComponents(), this.$.reorderContainer.setShowing(!1);
    },
    buildPinnedReorderContainer: function() {
        this.$.reorderContainer.destroyClientControls();
        for (var t = 0; this.pinnedReorderComponents.length > t; t++) this.$.reorderContainer.createComponent(this.pinnedReorderComponents[t], {
            owner: this.owner
        });
        this.$.reorderContainer.render();
    },
    reorderRows: function(t) {
        this.doReorder(this.makeReorderEvent(t)), this.positionReorderedNode(), this.updateListIndices();
    },
    makeReorderEvent: function(t) {
        return t.reorderFrom = this.draggingRowIndex, t.reorderTo = this.placeholderRowIndex, 
        t;
    },
    positionReorderedNode: function() {
        if (!this.removedInitialPage) {
            var t = this.$.generator.fetchRowNode(this.placeholderRowIndex);
            if (t && (t.parentNode.insertBefore(this.hiddenNode, t), this.showNode(this.hiddenNode)), 
            this.hiddenNode = null, this.currentPageNumber != this.initialPageNumber) {
                var e, i, n = this.pageForPageNumber(this.currentPageNumber), o = this.pageForPageNumber(this.currentPageNumber + 1);
                this.initialPageNumber < this.currentPageNumber ? (e = n.hasNode().firstChild, o.hasNode().appendChild(e)) : (e = n.hasNode().lastChild, 
                i = o.hasNode().firstChild, o.hasNode().insertBefore(e, i)), this.correctPageSizes(), 
                this.updatePagePositions(this.initialPageNumber);
            }
        }
    },
    updateListIndices: function() {
        if (this.shouldDoRefresh()) return this.refresh(), this.correctPageSizes(), void 0;
        var t, e, i, n, o = Math.min(this.draggingRowIndex, this.placeholderRowIndex), s = Math.max(this.draggingRowIndex, this.placeholderRowIndex), a = this.draggingRowIndex - this.placeholderRowIndex > 0 ? 1 : -1;
        if (1 === a) {
            for (t = this.$.generator.fetchRowNode(this.draggingRowIndex), t && t.setAttribute("data-enyo-index", "reordered"), 
            e = s - 1, i = s; e >= o; e--) t = this.$.generator.fetchRowNode(e), t && (n = parseInt(t.getAttribute("data-enyo-index"), 10), 
            i = n + 1, t.setAttribute("data-enyo-index", i));
            t = this.hasNode().querySelector('[data-enyo-index="reordered"]'), t.setAttribute("data-enyo-index", this.placeholderRowIndex);
        } else for (t = this.$.generator.fetchRowNode(this.draggingRowIndex), t && t.setAttribute("data-enyo-index", this.placeholderRowIndex), 
        e = o + 1, i = o; s >= e; e++) t = this.$.generator.fetchRowNode(e), t && (n = parseInt(t.getAttribute("data-enyo-index"), 10), 
        i = n - 1, t.setAttribute("data-enyo-index", i));
    },
    shouldDoRefresh: function() {
        return Math.abs(this.initialPageNumber - this.currentPageNumber) > 1;
    },
    getNodeStyle: function(t) {
        var e = this.$.generator.fetchRowNode(t);
        if (e) {
            var i = this.getRelativeOffset(e, this.hasNode()), n = enyo.dom.getBounds(e);
            return {
                h: n.height,
                w: n.width,
                left: i.left,
                top: i.top
            };
        }
    },
    getRelativeOffset: function(t, e) {
        var i = {
            top: 0,
            left: 0
        };
        if (t !== e && t.parentNode) do i.top += t.offsetTop || 0, i.left += t.offsetLeft || 0, 
        t = t.offsetParent; while (t && t !== e);
        return i;
    },
    replaceNodeWithPlaceholder: function(t) {
        var e = this.$.generator.fetchRowNode(t);
        if (!e) return enyo.log("No node - " + t), void 0;
        this.placeholderNode = this.createPlaceholderNode(e), this.hiddenNode = this.hideNode(e);
        var i = this.pageForPageNumber(this.currentPageNumber);
        i.hasNode().insertBefore(this.placeholderNode, this.hiddenNode);
    },
    createPlaceholderNode: function(t) {
        var e = this.$.placeholder.hasNode().cloneNode(!0), i = enyo.dom.getBounds(t);
        return e.style.height = i.height + "px", e.style.width = i.width + "px", e;
    },
    removePlaceholderNode: function() {
        this.removeNode(this.placeholderNode), this.placeholderNode = null;
    },
    removeDraggingRowNode: function() {
        this.draggingRowNode = null;
        var t = this.$.holdingarea.hasNode();
        t.innerHTML = "";
    },
    removeNode: function(t) {
        t && t.parentNode && t.parentNode.removeChild(t);
    },
    updatePageSize: function(t) {
        if (!(0 > t)) {
            var e = this.pageForPageNumber(t, !0);
            if (e) {
                var i = this.pageSizes[t], n = Math.max(1, e.getBounds().height);
                this.pageSizes[t] = n, this.portSize += n - i;
            }
        }
    },
    updatePagePositions: function(t) {
        this.positionPage(this.currentPageNumber, this.pageForPageNumber(this.currentPageNumber)), 
        this.positionPage(t, this.pageForPageNumber(t));
    },
    correctPageSizes: function() {
        var t = this.initialPageNumber % 2;
        this.updatePageSize(this.currentPageNumber, this.$["page" + this.currentPage]), 
        t != this.currentPageNumber && this.updatePageSize(this.initialPageNumber, this.$["page" + t]);
    },
    hideNode: function(t) {
        return t.style.display = "none", t;
    },
    showNode: function(t) {
        return t.style.display = "block", t;
    },
    dropPinnedRow: function(t) {
        this.moveReorderedContainerToDroppedPosition(t), this.completeReorderTimeout = setTimeout(this.bindSafely(this.completeFinishReordering, t), 100);
    },
    cancelPinnedMode: function(t) {
        this.placeholderRowIndex = this.draggingRowIndex, this.dropPinnedRow(t);
    },
    getRowIndexFromCoordinate: function(t) {
        var e = this.getScrollTop() + t - enyo.dom.calcNodePosition(this.hasNode()).top;
        if (0 > e) return -1;
        var i = this.positionToPageInfo(e), n = i.no == this.p0 ? this.p0RowBounds : this.p1RowBounds;
        if (!n) return this.count;
        for (var o = i.pos, s = this.placeholderNode ? enyo.dom.getBounds(this.placeholderNode).height : 0, a = 0, h = i.startRow; i.endRow >= h; ++h) {
            if (h === this.placeholderRowIndex && (a += s, a >= o)) return -1;
            if (h !== this.draggingRowIndex && (a += n[h].height, a >= o)) return h;
        }
        return h;
    },
    getIndexPosition: function(t) {
        return enyo.dom.calcNodePosition(this.$.generator.fetchRowNode(t));
    },
    setItemPosition: function(t, e) {
        var i = this.getNodeStyle(e), n = "ScrollStrategy" == this.getStrategyKind() ? i.top : i.top - this.getScrollTop(), o = "top:" + n + "px; left:" + i.left + "px;";
        t.addStyles(o);
    },
    setItemBounds: function(t, e) {
        var i = this.getNodeStyle(e), n = "width:" + i.w + "px; height:" + i.h + "px;";
        t.addStyles(n);
    },
    reorderScroll: function() {
        "ScrollStrategy" == this.getStrategyKind() && this.$.reorderContainer.addStyles("top:" + (this.initialPinPosition + this.getScrollTop() - this.rowSize) + "px;"), 
        this.updatePlaceholderPosition(this.initialPinPosition);
    },
    hideReorderingRow: function() {
        var t = this.hasNode().querySelector('[data-enyo-index="' + this.draggingRowIndex + '"]');
        t && (this.hiddenNode = this.hideNode(t));
    },
    isReordering: function() {
        return this.draggingRowIndex > -1;
    },
    isSwiping: function() {
        return null != this.swipeIndex && !this.swipeComplete && null != this.swipeDirection;
    },
    swipeDragStart: function(t, e) {
        return null == e.index || e.vertical ? !0 : (this.completeSwipeTimeout && this.completeSwipe(e), 
        this.swipeComplete = !1, this.swipeIndex != e.index && (this.clearSwipeables(), 
        this.swipeIndex = e.index), this.swipeDirection = e.xDirection, this.persistentItemVisible || this.startSwipe(e), 
        this.draggedXDistance = 0, this.draggedYDistance = 0, !0);
    },
    swipeDrag: function(t, e) {
        return this.persistentItemVisible ? (this.dragPersistentItem(e), this.preventDragPropagation) : this.isSwiping() ? (this.dragSwipeableComponents(this.calcNewDragPosition(e.ddx)), 
        this.draggedXDistance = e.dx, this.draggedYDistance = e.dy, !0) : !1;
    },
    swipeDragFinish: function(t, e) {
        if (this.persistentItemVisible) this.dragFinishPersistentItem(e); else {
            if (!this.isSwiping()) return !1;
            var i = this.calcPercentageDragged(this.draggedXDistance);
            i > this.percentageDraggedThreshold && e.xDirection === this.swipeDirection ? this.swipe(this.fastSwipeSpeedMS) : this.backOutSwipe(e);
        }
        return this.preventDragPropagation;
    },
    isSwipeable: function() {
        return this.enableSwipe && 0 !== this.$.swipeableComponents.controls.length && !this.isReordering() && !this.pinnedReorderMode;
    },
    positionSwipeableContainer: function(t, e) {
        var i = this.$.generator.fetchRowNode(t);
        if (i) {
            var n = this.getRelativeOffset(i, this.hasNode()), o = enyo.dom.getBounds(i), s = 1 == e ? -1 * o.width : o.width;
            this.$.swipeableComponents.addStyles("top: " + n.top + "px; left: " + s + "px; height: " + o.height + "px; width: " + o.width + "px;");
        }
    },
    calcNewDragPosition: function(t) {
        var e = this.$.swipeableComponents.getBounds(), i = e.left, n = this.$.swipeableComponents.getBounds(), o = 1 == this.swipeDirection ? 0 : -1 * n.width, s = 1 == this.swipeDirection ? i + t > o ? o : i + t : o > i + t ? o : i + t;
        return s;
    },
    dragSwipeableComponents: function(t) {
        this.$.swipeableComponents.applyStyle("left", t + "px");
    },
    startSwipe: function(t) {
        t.index = this.swipeIndex, this.positionSwipeableContainer(this.swipeIndex, t.xDirection), 
        this.$.swipeableComponents.setShowing(!0), this.setPersistentItemOrigin(t.xDirection), 
        this.doSetupSwipeItem(t);
    },
    dragPersistentItem: function(t) {
        var e = 0, i = "right" == this.persistentItemOrigin ? Math.max(e, e + t.dx) : Math.min(e, e + t.dx);
        this.$.swipeableComponents.applyStyle("left", i + "px");
    },
    dragFinishPersistentItem: function(t) {
        var e = this.calcPercentageDragged(t.dx) > .2, i = t.dx > 0 ? "right" : 0 > t.dx ? "left" : null;
        this.persistentItemOrigin == i ? e ? this.slideAwayItem() : this.bounceItem(t) : this.bounceItem(t);
    },
    setPersistentItemOrigin: function(t) {
        this.persistentItemOrigin = 1 == t ? "left" : "right";
    },
    calcPercentageDragged: function(t) {
        return Math.abs(t / this.$.swipeableComponents.getBounds().width);
    },
    swipe: function(t) {
        this.swipeComplete = !0, this.animateSwipe(0, t);
    },
    backOutSwipe: function() {
        var t = this.$.swipeableComponents.getBounds(), e = 1 == this.swipeDirection ? -1 * t.width : t.width;
        this.animateSwipe(e, this.fastSwipeSpeedMS), this.swipeDirection = null;
    },
    bounceItem: function() {
        var t = this.$.swipeableComponents.getBounds();
        t.left != t.width && this.animateSwipe(0, this.normalSwipeSpeedMS);
    },
    slideAwayItem: function() {
        var t = this.$.swipeableComponents, e = t.getBounds().width, i = "left" == this.persistentItemOrigin ? -1 * e : e;
        this.animateSwipe(i, this.normalSwipeSpeedMS), this.persistentItemVisible = !1, 
        this.setPersistSwipeableItem(!1);
    },
    clearSwipeables: function() {
        this.$.swipeableComponents.setShowing(!1), this.persistentItemVisible = !1, this.setPersistSwipeableItem(!1);
    },
    completeSwipe: function() {
        this.completeSwipeTimeout && (clearTimeout(this.completeSwipeTimeout), this.completeSwipeTimeout = null), 
        this.getPersistSwipeableItem() ? this.swipeComplete && (this.persistentItemVisible = !0) : (this.$.swipeableComponents.setShowing(!1), 
        this.swipeComplete && this.doSwipeComplete({
            index: this.swipeIndex,
            xDirection: this.swipeDirection
        })), this.swipeIndex = null, this.swipeDirection = null;
    },
    animateSwipe: function(t, e) {
        var i = enyo.now(), n = this.$.swipeableComponents, o = parseInt(n.domStyles.left, 10), s = t - o;
        this.stopAnimateSwipe();
        var a = this.bindSafely(function() {
            var t = enyo.now() - i, h = t / e, r = o + s * Math.min(h, 1);
            n.applyStyle("left", r + "px"), this.job = enyo.requestAnimationFrame(a), t / e >= 1 && (this.stopAnimateSwipe(), 
            this.completeSwipeTimeout = setTimeout(this.bindSafely(function() {
                this.completeSwipe();
            }), this.completeSwipeDelayMS));
        });
        this.job = enyo.requestAnimationFrame(a);
    },
    stopAnimateSwipe: function() {
        this.job && (this.job = enyo.cancelRequestAnimationFrame(this.job));
    }
});

// lib\layout\list\source\PulldownList.js
enyo.kind({
    name: "enyo.PulldownList",
    kind: "List",
    touch: !0,
    pully: null,
    pulldownTools: [ {
        name: "pulldown",
        classes: "enyo-list-pulldown",
        components: [ {
            name: "puller",
            kind: "Puller"
        } ]
    } ],
    events: {
        onPullStart: "",
        onPullCancel: "",
        onPull: "",
        onPullRelease: "",
        onPullComplete: ""
    },
    handlers: {
        onScrollStart: "scrollStartHandler",
        onScrollStop: "scrollStopHandler",
        ondragfinish: "dragfinish"
    },
    pullingMessage: "Pull down to refresh...",
    pulledMessage: "Release to refresh...",
    loadingMessage: "Loading...",
    pullingIconClass: "enyo-puller-arrow enyo-puller-arrow-down",
    pulledIconClass: "enyo-puller-arrow enyo-puller-arrow-up",
    loadingIconClass: "",
    create: enyo.inherit(function(t) {
        return function() {
            var e = {
                kind: "Puller",
                showing: !1,
                text: this.loadingMessage,
                iconClass: this.loadingIconClass,
                onCreate: "setPully"
            };
            this.listTools.splice(0, 0, e), t.apply(this, arguments), this.setPulling();
        };
    }),
    initComponents: enyo.inherit(function(t) {
        return function() {
            this.createChrome(this.pulldownTools), this.accel = enyo.dom.canAccelerate(), this.translation = this.accel ? "translate3d" : "translate", 
            this.strategyKind = this.resetStrategyKind(), t.apply(this, arguments);
        };
    }),
    resetStrategyKind: function() {
        return enyo.platform.android >= 3 ? "TranslateScrollStrategy" : "TouchScrollStrategy";
    },
    setPully: function(t, e) {
        this.pully = e.originator;
    },
    scrollStartHandler: function() {
        this.firedPullStart = !1, this.firedPull = !1, this.firedPullCancel = !1;
    },
    scroll: enyo.inherit(function(t) {
        return function() {
            var e = t.apply(this, arguments);
            this.completingPull && this.pully.setShowing(!1);
            var i = this.getStrategy().$.scrollMath || this.getStrategy(), n = -1 * this.getScrollTop();
            return i.isInOverScroll() && n > 0 && (enyo.dom.transformValue(this.$.pulldown, this.translation, "0," + n + "px" + (this.accel ? ",0" : "")), 
            this.firedPullStart || (this.firedPullStart = !0, this.pullStart(), this.pullHeight = this.$.pulldown.getBounds().height), 
            n > this.pullHeight && !this.firedPull && (this.firedPull = !0, this.firedPullCancel = !1, 
            this.pull()), this.firedPull && !this.firedPullCancel && this.pullHeight > n && (this.firedPullCancel = !0, 
            this.firedPull = !1, this.pullCancel())), e;
        };
    }),
    scrollStopHandler: function() {
        this.completingPull && (this.completingPull = !1, this.doPullComplete());
    },
    dragfinish: function() {
        if (this.firedPull) {
            var t = this.getStrategy().$.scrollMath || this.getStrategy();
            t.setScrollY(-1 * this.getScrollTop() - this.pullHeight), this.pullRelease();
        }
    },
    completePull: function() {
        this.completingPull = !0;
        var t = this.getStrategy().$.scrollMath || this.getStrategy();
        t.setScrollY(this.pullHeight), t.start();
    },
    pullStart: function() {
        this.setPulling(), this.pully.setShowing(!1), this.$.puller.setShowing(!0), this.doPullStart();
    },
    pull: function() {
        this.setPulled(), this.doPull();
    },
    pullCancel: function() {
        this.setPulling(), this.doPullCancel();
    },
    pullRelease: function() {
        this.$.puller.setShowing(!1), this.pully.setShowing(!0), this.doPullRelease();
    },
    setPulling: function() {
        this.$.puller.setText(this.pullingMessage), this.$.puller.setIconClass(this.pullingIconClass);
    },
    setPulled: function() {
        this.$.puller.setText(this.pulledMessage), this.$.puller.setIconClass(this.pulledIconClass);
    }
}), enyo.kind({
    name: "enyo.Puller",
    classes: "enyo-puller",
    published: {
        text: "",
        iconClass: ""
    },
    events: {
        onCreate: ""
    },
    components: [ {
        name: "icon"
    }, {
        name: "text",
        tag: "span",
        classes: "enyo-puller-text"
    } ],
    create: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.doCreate(), this.textChanged(), this.iconClassChanged();
        };
    }),
    textChanged: function() {
        this.$.text.setContent(this.text);
    },
    iconClassChanged: function() {
        this.$.icon.setClasses(this.iconClass);
    }
});

// lib\layout\list\source\AroundList.js
enyo.kind({
    name: "enyo.AroundList",
    kind: "enyo.List",
    listTools: [ {
        name: "port",
        classes: "enyo-list-port enyo-border-box",
        components: [ {
            name: "aboveClient"
        }, {
            name: "generator",
            kind: "FlyweightRepeater",
            canGenerate: !1,
            components: [ {
                tag: null,
                name: "client"
            } ]
        }, {
            name: "holdingarea",
            allowHtml: !0,
            classes: "enyo-list-holdingarea"
        }, {
            name: "page0",
            allowHtml: !0,
            classes: "enyo-list-page"
        }, {
            name: "page1",
            allowHtml: !0,
            classes: "enyo-list-page"
        }, {
            name: "belowClient"
        }, {
            name: "placeholder"
        }, {
            name: "swipeableComponents",
            style: "position:absolute; display:block; top:-1000px; left:0px;"
        } ]
    } ],
    aboveComponents: null,
    initComponents: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.aboveComponents && this.$.aboveClient.createComponents(this.aboveComponents, {
                owner: this.owner
            }), this.belowComponents && this.$.belowClient.createComponents(this.belowComponents, {
                owner: this.owner
            });
        };
    }),
    updateMetrics: function() {
        this.defaultPageSize = this.rowsPerPage * (this.rowSize || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), 
        this.aboveHeight = this.$.aboveClient.getBounds().height, this.belowHeight = this.$.belowClient.getBounds().height, 
        this.portSize = this.aboveHeight + this.belowHeight;
        for (var t = 0; this.pageCount > t; t++) this.portSize += this.getPageSize(t);
        this.adjustPortSize();
    },
    positionPage: function(t, e) {
        e.pageNo = t;
        var i = this.pageToPosition(t), n = this.bottomUp ? this.belowHeight : this.aboveHeight;
        i += n, e.applyStyle(this.pageBound, i + "px");
    },
    scrollToContentStart: function() {
        var t = this.bottomUp ? this.belowHeight : this.aboveHeight;
        this.setScrollPosition(t);
    }
});

// lib\layout\list\source\GridListImageItem.js
enyo.kind({
    name: "enyo.GridListImageItem",
    classes: "enyo-gridlist-imageitem",
    components: [ {
        name: "image",
        kind: "enyo.Image",
        classes: "image"
    }, {
        name: "caption",
        classes: "caption"
    }, {
        name: "subCaption",
        classes: "sub-caption"
    } ],
    published: {
        source: "",
        caption: "",
        subCaption: "",
        selected: !1,
        centered: !0,
        imageSizing: "",
        useCaption: !0,
        useSubCaption: !0
    },
    bindings: [ {
        from: ".source",
        to: ".$.image.src"
    }, {
        from: ".caption",
        to: ".$.caption.content"
    }, {
        from: ".caption",
        to: ".$.caption.showing",
        kind: "enyo.EmptyBinding"
    }, {
        from: ".subCaption",
        to: ".$.subCaption.content"
    }, {
        from: ".subCaption",
        to: ".$.subCaption.showing",
        kind: "enyo.EmptyBinding"
    } ],
    create: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.selectedChanged(), this.imageSizingChanged(), this.centeredChanged();
        };
    }),
    selectedChanged: function() {
        this.addRemoveClass("selected", this.selected);
    },
    disabledChanged: function() {
        this.addRemoveClass("disabled", this.disabled);
    },
    imageSizingChanged: function() {
        this.$.image.setSizing(this.imageSizing), this.addRemoveClass("sized-image", !!this.imageSizing), 
        this.imageSizing && (this.useCaptionChanged(), this.useSubCaptionChanged());
    },
    useCaptionChanged: function() {
        this.addRemoveClass("use-caption", this.useCaption);
    },
    useSubCaptionChanged: function() {
        this.addRemoveClass("use-subcaption", this.useSubCaption);
    },
    centeredChanged: function() {
        this.addRemoveClass("centered", this.centered);
    }
});

// lib\layout\slideable\source\Slideable.js
enyo.kind({
    name: "enyo.Slideable",
    kind: "Control",
    published: {
        axis: "h",
        value: 0,
        unit: "px",
        min: 0,
        max: 0,
        accelerated: "auto",
        overMoving: !0,
        draggable: !0
    },
    events: {
        onAnimateFinish: "",
        onChange: ""
    },
    preventDragPropagation: !1,
    tools: [ {
        kind: "Animator",
        onStep: "animatorStep",
        onEnd: "animatorComplete"
    } ],
    handlers: {
        ondragstart: "dragstart",
        ondrag: "drag",
        ondragfinish: "dragfinish"
    },
    kDragScalar: 1,
    dragEventProp: "dx",
    unitModifier: !1,
    canTransform: !1,
    create: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.acceleratedChanged(), this.transformChanged(), this.axisChanged(), 
            this.valueChanged(), this.addClass("enyo-slideable");
        };
    }),
    initComponents: enyo.inherit(function(t) {
        return function() {
            this.createComponents(this.tools), t.apply(this, arguments);
        };
    }),
    rendered: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.canModifyUnit(), this.updateDragScalar();
        };
    }),
    resizeHandler: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.updateDragScalar();
        };
    }),
    canModifyUnit: function() {
        if (!this.canTransform) {
            var t = this.getInitialStyleValue(this.hasNode(), this.boundary);
            t.match(/px/i) && "%" === this.unit && (this.unitModifier = this.getBounds()[this.dimension]);
        }
    },
    getInitialStyleValue: function(t, e) {
        var i = enyo.dom.getComputedStyle(t);
        return i ? i.getPropertyValue(e) : t && t.currentStyle ? t.currentStyle[e] : "0";
    },
    updateBounds: function(t, e) {
        var i = {};
        i[this.boundary] = t, this.setBounds(i, this.unit), this.setInlineStyles(t, e);
    },
    updateDragScalar: function() {
        if ("%" == this.unit) {
            var t = this.getBounds()[this.dimension];
            this.kDragScalar = t ? 100 / t : 1, this.canTransform || this.updateBounds(this.value, 100);
        }
    },
    transformChanged: function() {
        this.canTransform = enyo.dom.canTransform();
    },
    acceleratedChanged: function() {
        (!enyo.platform.android || 2 >= enyo.platform.android) && enyo.dom.accelerate(this, this.accelerated);
    },
    axisChanged: function() {
        var t = "h" == this.axis;
        this.dragMoveProp = t ? "dx" : "dy", this.shouldDragProp = t ? "horizontal" : "vertical", 
        this.transform = t ? "translateX" : "translateY", this.dimension = t ? "width" : "height", 
        this.boundary = t ? "left" : "top";
    },
    setInlineStyles: function(t, e) {
        var i = {};
        this.unitModifier ? (i[this.boundary] = this.percentToPixels(t, this.unitModifier), 
        i[this.dimension] = this.unitModifier, this.setBounds(i)) : (e ? i[this.dimension] = e : i[this.boundary] = t, 
        this.setBounds(i, this.unit));
    },
    valueChanged: function(t) {
        var e = this.value;
        this.isOob(e) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(e) : this.clampValue(e)), 
        enyo.platform.android > 2 && (this.value ? (0 === t || void 0 === t) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), 
        this.canTransform ? enyo.dom.transformValue(this, this.transform, this.value + this.unit) : this.setInlineStyles(this.value, !1), 
        this.doChange();
    },
    getAnimator: function() {
        return this.$.animator;
    },
    isAtMin: function() {
        return this.value <= this.calcMin();
    },
    isAtMax: function() {
        return this.value >= this.calcMax();
    },
    calcMin: function() {
        return this.min;
    },
    calcMax: function() {
        return this.max;
    },
    clampValue: function(t) {
        var e = this.calcMin(), i = this.calcMax();
        return Math.max(e, Math.min(t, i));
    },
    dampValue: function(t) {
        return this.dampBound(this.dampBound(t, this.min, 1), this.max, -1);
    },
    dampBound: function(t, e, i) {
        var n = t;
        return e * i > n * i && (n = e + (n - e) / 4), n;
    },
    percentToPixels: function(t, e) {
        return Math.floor(e / 100 * t);
    },
    pixelsToPercent: function(t) {
        var e = this.unitModifier ? this.getBounds()[this.dimension] : this.container.getBounds()[this.dimension];
        return 100 * (t / e);
    },
    shouldDrag: function(t) {
        return this.draggable && t[this.shouldDragProp];
    },
    isOob: function(t) {
        return t > this.calcMax() || this.calcMin() > t;
    },
    dragstart: function(t, e) {
        return this.shouldDrag(e) ? (e.preventDefault(), this.$.animator.stop(), e.dragInfo = {}, 
        this.dragging = !0, this.drag0 = this.value, this.dragd0 = 0, this.preventDragPropagation) : void 0;
    },
    drag: function(t, e) {
        if (this.dragging) {
            e.preventDefault();
            var i = this.canTransform ? e[this.dragMoveProp] * this.kDragScalar : this.pixelsToPercent(e[this.dragMoveProp]), n = this.drag0 + i, o = i - this.dragd0;
            return this.dragd0 = i, o && (e.dragInfo.minimizing = 0 > o), this.setValue(n), 
            this.preventDragPropagation;
        }
    },
    dragfinish: function(t, e) {
        return this.dragging ? (this.dragging = !1, this.completeDrag(e), e.preventTap(), 
        this.preventDragPropagation) : void 0;
    },
    completeDrag: function(t) {
        this.value !== this.calcMax() && this.value != this.calcMin() && this.animateToMinMax(t.dragInfo.minimizing);
    },
    isAnimating: function() {
        return this.$.animator.isAnimating();
    },
    play: function(t, e) {
        this.$.animator.play({
            startValue: t,
            endValue: e,
            node: this.hasNode()
        });
    },
    animateTo: function(t) {
        this.play(this.value, t);
    },
    animateToMin: function() {
        this.animateTo(this.calcMin());
    },
    animateToMax: function() {
        this.animateTo(this.calcMax());
    },
    animateToMinMax: function(t) {
        t ? this.animateToMin() : this.animateToMax();
    },
    animatorStep: function(t) {
        return this.setValue(t.value), !0;
    },
    animatorComplete: function(t) {
        return this.doAnimateFinish(t), !0;
    },
    toggleMinMax: function() {
        this.animateToMinMax(!this.isAtMin());
    }
});

// lib\layout\panels\source\arrangers\Arranger.js
enyo.kind({
    name: "enyo.Arranger",
    kind: "Layout",
    layoutClass: "enyo-arranger",
    accelerated: "auto",
    dragProp: "ddx",
    dragDirectionProp: "xDirection",
    canDragProp: "horizontal",
    incrementalPoints: !1,
    destroy: enyo.inherit(function(t) {
        return function() {
            for (var e, i = this.container.getPanels(), n = 0; e = i[n]; n++) e._arranger = null;
            t.apply(this, arguments);
        };
    }),
    arrange: function() {},
    size: function() {},
    start: function() {
        var t = this.container.fromIndex, e = this.container.toIndex, i = this.container.transitionPoints = [ t ];
        if (this.incrementalPoints) for (var n = Math.abs(e - t) - 2, o = t; n >= 0; ) o += t > e ? -1 : 1, 
        i.push(o), n--;
        i.push(this.container.toIndex);
    },
    finish: function() {},
    calcArrangementDifference: function() {},
    canDragEvent: function(t) {
        return t[this.canDragProp];
    },
    calcDragDirection: function(t) {
        return t[this.dragDirectionProp];
    },
    calcDrag: function(t) {
        return t[this.dragProp];
    },
    drag: function(t, e, i, n, o) {
        var s = this.measureArrangementDelta(-t, e, i, n, o);
        return s;
    },
    measureArrangementDelta: function(t, e, i, n, o) {
        var s = this.calcArrangementDifference(e, i, n, o), a = s ? t / Math.abs(s) : 0;
        return a *= this.container.fromIndex > this.container.toIndex ? -1 : 1;
    },
    _arrange: function(t) {
        this.containerBounds || this.reflow();
        var e = this.getOrderedControls(t);
        this.arrange(e, t);
    },
    arrangeControl: function(t, e) {
        t._arranger = enyo.mixin(t._arranger || {}, e);
    },
    flow: function() {
        this.c$ = [].concat(this.container.getPanels()), this.controlsIndex = 0;
        for (var t, e = 0, i = this.container.getPanels(); t = i[e]; e++) if (enyo.dom.accelerate(t, !t.preventAccelerate && this.accelerated), 
        enyo.platform.safari) for (var n, o = t.children, s = 0; n = o[s]; s++) enyo.dom.accelerate(n, this.accelerated);
    },
    reflow: function() {
        var t = this.container.hasNode();
        this.containerBounds = t ? {
            width: t.clientWidth,
            height: t.clientHeight
        } : {}, this.size();
    },
    flowArrangement: function() {
        var t = this.container.arrangement;
        if (t) for (var e, i = 0, n = this.container.getPanels(); (e = n[i]) && t[i]; i++) this.flowControl(e, t[i]);
    },
    flowControl: function(t, e) {
        enyo.Arranger.positionControl(t, e);
        var i = e.opacity;
        null != i && enyo.Arranger.opacifyControl(t, i);
    },
    getOrderedControls: function(t) {
        for (var e = Math.floor(t), i = e - this.controlsIndex, n = i > 0, o = this.c$ || [], s = 0; Math.abs(i) > s; s++) n ? o.push(o.shift()) : o.unshift(o.pop());
        return this.controlsIndex = e, o;
    },
    statics: {
        positionControl: function(t, e, i) {
            var n = i || "px";
            if (!this.updating) if (!enyo.dom.canTransform() || t.preventTransform || enyo.platform.android || 10 === enyo.platform.ie) enyo.dom.canTransform() && t.preventTransform && enyo.dom.transform(t, {
                translateX: null,
                translateY: null
            }), t.setBounds(e, i); else {
                var o = e.left, s = e.top;
                o = enyo.isString(o) ? o : o && o + n, s = enyo.isString(s) ? s : s && s + n, enyo.dom.transform(t, {
                    translateX: o || null,
                    translateY: s || null
                });
            }
        },
        opacifyControl: function(t, e) {
            var i = e;
            i = i > .99 ? 1 : .01 > i ? 0 : i, 9 > enyo.platform.ie ? t.applyStyle("filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + 100 * i + ")") : t.applyStyle("opacity", i);
        }
    }
});

// lib\layout\panels\source\arrangers\CardArranger.js
enyo.kind({
    name: "enyo.CardArranger",
    kind: "Arranger",
    layoutClass: "enyo-arranger enyo-arranger-fit",
    calcArrangementDifference: function() {
        return this.containerBounds.width;
    },
    arrange: function(t) {
        for (var e, i, n = 0; e = t[n]; n++) i = 0 === n ? 1 : 0, this.arrangeControl(e, {
            opacity: i
        });
    },
    start: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments);
            for (var e, i = this.container.getPanels(), n = 0; e = i[n]; n++) {
                var o = e.showing;
                e.setShowing(n == this.container.fromIndex || n == this.container.toIndex), e.showing && !o && e.resized();
            }
        };
    }),
    finish: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments);
            for (var e, i = this.container.getPanels(), n = 0; e = i[n]; n++) e.setShowing(n == this.container.toIndex);
        };
    }),
    destroy: enyo.inherit(function(t) {
        return function() {
            for (var e, i = this.container.getPanels(), n = 0; e = i[n]; n++) enyo.Arranger.opacifyControl(e, 1), 
            e.showing || e.setShowing(!0);
            t.apply(this, arguments);
        };
    })
});

// lib\layout\panels\source\arrangers\CardSlideInArranger.js
enyo.kind({
    name: "enyo.CardSlideInArranger",
    kind: "CardArranger",
    start: function() {
        for (var t, e = this.container.getPanels(), i = 0; t = e[i]; i++) {
            var n = t.showing;
            t.setShowing(i == this.container.fromIndex || i == this.container.toIndex), t.showing && !n && t.resized();
        }
        var o = this.container.fromIndex;
        i = this.container.toIndex, this.container.transitionPoints = [ i + "." + o + ".s", i + "." + o + ".f" ];
    },
    finish: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments);
            for (var e, i = this.container.getPanels(), n = 0; e = i[n]; n++) e.setShowing(n == this.container.toIndex);
        };
    }),
    arrange: function(t, e) {
        for (var i, n, o = e.split("."), s = o[0], a = o[1], r = "s" == o[2], h = this.containerBounds.width, l = 0, d = this.container.getPanels(); i = d[l]; l++) n = h, 
        a == l && (n = r ? 0 : -h), s == l && (n = r ? h : 0), a == l && a == s && (n = 0), 
        this.arrangeControl(i, {
            left: n
        });
    },
    destroy: enyo.inherit(function(t) {
        return function() {
            for (var e, i = this.container.getPanels(), n = 0; e = i[n]; n++) enyo.Arranger.positionControl(e, {
                left: null
            });
            t.apply(this, arguments);
        };
    })
});

// lib\layout\panels\source\arrangers\CarouselArranger.js
enyo.kind({
    name: "enyo.CarouselArranger",
    kind: "Arranger",
    size: function() {
        var t, e, i, n, o, s = this.container.getPanels(), a = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, r = this.containerBounds;
        r.height -= a.top + a.bottom, r.width -= a.left + a.right;
        var h;
        for (t = 0, i = 0; o = s[t]; t++) n = enyo.dom.calcMarginExtents(o.hasNode()), o.width = o.getBounds().width, 
        o.marginWidth = n.right + n.left, i += (o.fit ? 0 : o.width) + o.marginWidth, o.fit && (h = o);
        if (h) {
            var l = r.width - i;
            h.width = l >= 0 ? l : h.width;
        }
        for (t = 0, e = a.left; o = s[t]; t++) o.setBounds({
            top: a.top,
            bottom: a.bottom,
            width: o.fit ? o.width : null
        });
    },
    arrange: function(t, e) {
        this.container.wrap ? this.arrangeWrap(t, e) : this.arrangeNoWrap(t, e);
    },
    arrangeNoWrap: function(t, e) {
        var i, n, o, s, a = this.container.getPanels(), r = this.container.clamp(e), h = this.containerBounds.width;
        for (i = r, o = 0; (s = a[i]) && (o += s.width + s.marginWidth, !(o > h)); i++) ;
        var l = h - o, d = 0;
        if (l > 0) for (i = r - 1, n = 0; s = a[i]; i--) if (n += s.width + s.marginWidth, 
        0 >= l - n) {
            d = l - n, r = i;
            break;
        }
        var c, u;
        for (i = 0, u = this.containerPadding.left + d; s = a[i]; i++) c = s.width + s.marginWidth, 
        r > i ? this.arrangeControl(s, {
            left: -c
        }) : (this.arrangeControl(s, {
            left: Math.floor(u)
        }), u += c);
    },
    arrangeWrap: function(t) {
        for (var e, i = 0, n = this.containerPadding.left; e = t[i]; i++) this.arrangeControl(e, {
            left: n
        }), n += e.width + e.marginWidth;
    },
    calcArrangementDifference: function(t, e, i, n) {
        var o = Math.abs(t % this.c$.length);
        return e[o].left - n[o].left;
    },
    destroy: enyo.inherit(function(t) {
        return function() {
            for (var e, i = this.container.getPanels(), n = 0; e = i[n]; n++) enyo.Arranger.positionControl(e, {
                left: null,
                top: null
            }), e.applyStyle("top", null), e.applyStyle("bottom", null), e.applyStyle("left", null), 
            e.applyStyle("width", null);
            t.apply(this, arguments);
        };
    })
});

// lib\layout\panels\source\arrangers\CollapsingArranger.js
enyo.kind({
    name: "enyo.CollapsingArranger",
    kind: "CarouselArranger",
    peekWidth: 0,
    size: enyo.inherit(function(t) {
        return function() {
            this.clearLastSize(), t.apply(this, arguments);
        };
    }),
    clearLastSize: function() {
        for (var t, e = 0, i = this.container.getPanels(); t = i[e]; e++) t._fit && e != i.length - 1 && (t.applyStyle("width", null), 
        t._fit = null);
    },
    constructor: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.peekWidth = null != this.container.peekWidth ? this.container.peekWidth : this.peekWidth;
        };
    }),
    arrange: function(t, e) {
        for (var i, n = this.container.getPanels(), o = 0, s = this.containerPadding.left, a = 0; i = n[o]; o++) i.getShowing() ? (this.arrangeControl(i, {
            left: s + a * this.peekWidth
        }), o >= e && (s += i.width + i.marginWidth - this.peekWidth), a++) : (this.arrangeControl(i, {
            left: s
        }), o >= e && (s += i.width + i.marginWidth)), o == n.length - 1 && 0 > e && this.arrangeControl(i, {
            left: s - e
        });
    },
    calcArrangementDifference: function(t, e, i, n) {
        var o = this.container.getPanels().length - 1;
        return Math.abs(n[o].left - e[o].left);
    },
    flowControl: enyo.inherit(function(t) {
        return function(e, i) {
            if (t.apply(this, arguments), this.container.realtimeFit) {
                var n = this.container.getPanels(), o = n.length - 1, s = n[o];
                e == s && this.fitControl(e, i.left);
            }
        };
    }),
    finish: enyo.inherit(function(t) {
        return function() {
            if (t.apply(this, arguments), !this.container.realtimeFit && this.containerBounds) {
                var e = this.container.getPanels(), i = this.container.arrangement, n = e.length - 1, o = e[n];
                this.fitControl(o, i[n].left);
            }
        };
    }),
    fitControl: function(t, e) {
        t._fit = !0, t.applyStyle("width", this.containerBounds.width - e + "px"), t.resized();
    }
});

// lib\layout\panels\source\arrangers\DockRightArranger.js
enyo.kind({
    name: "enyo.DockRightArranger",
    kind: "Arranger",
    basePanel: !1,
    overlap: 0,
    layoutWidth: 0,
    constructor: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.overlap = null != this.container.overlap ? this.container.overlap : this.overlap, 
            this.layoutWidth = null != this.container.layoutWidth ? this.container.layoutWidth : this.layoutWidth;
        };
    }),
    size: function() {
        var t, e, i, n = this.container.getPanels(), o = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, s = this.containerBounds;
        s.width -= o.left + o.right;
        var a, r = s.width, h = n.length;
        for (this.container.transitionPositions = {}, t = 0; i = n[t]; t++) i.width = 0 === t && this.container.basePanel ? r : i.getBounds().width;
        for (t = 0; i = n[t]; t++) {
            0 === t && this.container.basePanel && i.setBounds({
                width: r
            }), i.setBounds({
                top: o.top,
                bottom: o.bottom
            });
            for (var l = 0; i = n[l]; l++) {
                var d;
                if (0 === t && this.container.basePanel) d = 0; else if (t > l) d = r; else {
                    if (t !== l) break;
                    a = r > this.layoutWidth ? this.overlap : 0, d = r - n[t].width + a;
                }
                this.container.transitionPositions[t + "." + l] = d;
            }
            if (h > l) for (var c = !1, u = t + 1; h > u; u++) {
                if (a = 0, c) a = 0; else if (n[t].width + n[u].width - this.overlap > r) a = 0, 
                c = !0; else {
                    for (a = n[t].width - this.overlap, e = t; u > e; e++) {
                        var g = a + n[e + 1].width - this.overlap;
                        if (!(r > g)) {
                            a = r;
                            break;
                        }
                        a = g;
                    }
                    a = r - a;
                }
                this.container.transitionPositions[t + "." + u] = a;
            }
        }
    },
    arrange: function(t, e) {
        var i, n, o = this.container.getPanels(), s = this.container.clamp(e);
        for (i = 0; n = o[i]; i++) {
            var a = this.container.transitionPositions[i + "." + s];
            this.arrangeControl(n, {
                left: a
            });
        }
    },
    calcArrangementDifference: function(t, e, i) {
        var n = this.container.getPanels(), o = i > t ? n[i].width : n[t].width;
        return o;
    },
    destroy: enyo.inherit(function(t) {
        return function() {
            for (var e, i = this.container.getPanels(), n = 0; e = i[n]; n++) enyo.Arranger.positionControl(e, {
                left: null,
                top: null
            }), e.applyStyle("top", null), e.applyStyle("bottom", null), e.applyStyle("left", null), 
            e.applyStyle("width", null);
            t.apply(this, arguments);
        };
    })
});

// lib\layout\panels\source\arrangers\OtherArrangers.js
enyo.kind({
    name: "enyo.LeftRightArranger",
    kind: "Arranger",
    margin: 40,
    axisSize: "width",
    offAxisSize: "height",
    axisPosition: "left",
    constructor: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.margin = null != this.container.margin ? this.container.margin : this.margin;
        };
    }),
    size: function() {
        for (var t, e, i = this.container.getPanels(), n = this.containerBounds[this.axisSize], o = n - this.margin - this.margin, s = 0; e = i[s]; s++) t = {}, 
        t[this.axisSize] = o, t[this.offAxisSize] = "100%", e.setBounds(t);
    },
    start: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments);
            for (var e, i = this.container.fromIndex, n = this.container.toIndex, o = this.getOrderedControls(n), s = Math.floor(o.length / 2), a = 0; e = o[a]; a++) i > n ? a == o.length - s ? e.applyStyle("z-index", 0) : e.applyStyle("z-index", 1) : a == o.length - 1 - s ? e.applyStyle("z-index", 0) : e.applyStyle("z-index", 1);
        };
    }),
    arrange: function(t, e) {
        var i, n, o;
        if (1 == this.container.getPanels().length) return o = {}, o[this.axisPosition] = this.margin, 
        this.arrangeControl(this.container.getPanels()[0], o), void 0;
        var s = Math.floor(this.container.getPanels().length / 2), a = this.getOrderedControls(Math.floor(e) - s), r = this.containerBounds[this.axisSize] - this.margin - this.margin, h = this.margin - r * s;
        for (i = 0; n = a[i]; i++) o = {}, o[this.axisPosition] = h, this.arrangeControl(n, o), 
        h += r;
    },
    calcArrangementDifference: function(t, e, i, n) {
        if (1 == this.container.getPanels().length) return 0;
        var o = Math.abs(t % this.c$.length);
        return e[o][this.axisPosition] - n[o][this.axisPosition];
    },
    destroy: enyo.inherit(function(t) {
        return function() {
            for (var e, i = this.container.getPanels(), n = 0; e = i[n]; n++) enyo.Arranger.positionControl(e, {
                left: null,
                top: null
            }), enyo.Arranger.opacifyControl(e, 1), e.applyStyle("left", null), e.applyStyle("top", null), 
            e.applyStyle("height", null), e.applyStyle("width", null);
            t.apply(this, arguments);
        };
    })
}), enyo.kind({
    name: "enyo.TopBottomArranger",
    kind: "LeftRightArranger",
    dragProp: "ddy",
    dragDirectionProp: "yDirection",
    canDragProp: "vertical",
    axisSize: "height",
    offAxisSize: "width",
    axisPosition: "top"
}), enyo.kind({
    name: "enyo.SpiralArranger",
    kind: "Arranger",
    incrementalPoints: !0,
    inc: 20,
    size: function() {
        for (var t, e = this.container.getPanels(), i = this.containerBounds, n = this.controlWidth = i.width / 3, o = this.controlHeight = i.height / 3, s = 0; t = e[s]; s++) t.setBounds({
            width: n,
            height: o
        });
    },
    arrange: function(t) {
        for (var e, i = this.inc, n = 0, o = t.length; e = t[n]; n++) {
            var s = Math.cos(2 * (n / o) * Math.PI) * n * i + this.controlWidth, a = Math.sin(2 * (n / o) * Math.PI) * n * i + this.controlHeight;
            this.arrangeControl(e, {
                left: s,
                top: a
            });
        }
    },
    start: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments);
            for (var e, i = this.getOrderedControls(this.container.toIndex), n = 0; e = i[n]; n++) e.applyStyle("z-index", i.length - n);
        };
    }),
    calcArrangementDifference: function() {
        return this.controlWidth;
    },
    destroy: enyo.inherit(function(t) {
        return function() {
            for (var e, i = this.container.getPanels(), n = 0; e = i[n]; n++) e.applyStyle("z-index", null), 
            enyo.Arranger.positionControl(e, {
                left: null,
                top: null
            }), e.applyStyle("left", null), e.applyStyle("top", null), e.applyStyle("height", null), 
            e.applyStyle("width", null);
            t.apply(this, arguments);
        };
    })
}), enyo.kind({
    name: "enyo.GridArranger",
    kind: "Arranger",
    incrementalPoints: !0,
    colWidth: 100,
    colHeight: 100,
    size: function() {
        for (var t, e = this.container.getPanels(), i = this.colWidth, n = this.colHeight, o = 0; t = e[o]; o++) t.setBounds({
            width: i,
            height: n
        });
    },
    arrange: function(t) {
        for (var e, i = this.colWidth, n = this.colHeight, o = Math.max(1, Math.floor(this.containerBounds.width / i)), s = 0, a = 0; t.length > a; s++) for (var r = 0; o > r && (e = t[a]); r++, 
        a++) this.arrangeControl(e, {
            left: i * r,
            top: n * s
        });
    },
    flowControl: enyo.inherit(function(t) {
        return function(e, i) {
            t.apply(this, arguments), enyo.Arranger.opacifyControl(e, 0 !== i.top % this.colHeight ? .25 : 1);
        };
    }),
    calcArrangementDifference: function() {
        return this.colWidth;
    },
    destroy: enyo.inherit(function(t) {
        return function() {
            for (var e, i = this.container.getPanels(), n = 0; e = i[n]; n++) enyo.Arranger.positionControl(e, {
                left: null,
                top: null
            }), e.applyStyle("left", null), e.applyStyle("top", null), e.applyStyle("height", null), 
            e.applyStyle("width", null);
            t.apply(this, arguments);
        };
    })
});

// lib\layout\panels\source\Panels.js
enyo.kind({
    name: "enyo.Panels",
    classes: "enyo-panels",
    published: {
        index: 0,
        draggable: !0,
        animate: !0,
        wrap: !1,
        arrangerKind: "CardArranger",
        narrowFit: !0
    },
    events: {
        onTransitionStart: "",
        onTransitionFinish: ""
    },
    handlers: {
        ondragstart: "dragstart",
        ondrag: "drag",
        ondragfinish: "dragfinish",
        onscroll: "domScroll"
    },
    tools: [ {
        kind: "Animator",
        onStep: "step",
        onEnd: "completed"
    } ],
    fraction: 0,
    create: enyo.inherit(function(t) {
        return function() {
            this.transitionPoints = [], t.apply(this, arguments), this.arrangerKindChanged(), 
            this.narrowFitChanged(), this.indexChanged();
        };
    }),
    rendered: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), enyo.makeBubble(this, "scroll");
        };
    }),
    domScroll: function() {
        this.hasNode() && this.node.scrollLeft > 0 && (this.node.scrollLeft = 0);
    },
    initComponents: enyo.inherit(function(t) {
        return function() {
            this.createChrome(this.tools), t.apply(this, arguments);
        };
    }),
    arrangerKindChanged: function() {
        this.setLayoutKind(this.arrangerKind);
    },
    narrowFitChanged: function() {
        this.addRemoveClass("enyo-panels-fit-narrow", this.narrowFit && enyo.Panels.isScreenNarrow());
    },
    destroy: enyo.inherit(function(t) {
        return function() {
            this.destroying = !0, t.apply(this, arguments);
        };
    }),
    removeControl: enyo.inherit(function(t) {
        return function(e) {
            if (this.destroying) return t.apply(this, arguments);
            var i = -1, n = enyo.indexOf(e, this.controls);
            n === this.index && (i = Math.max(n - 1, 0)), t.apply(this, arguments), -1 !== i && this.controls.length > 0 && (this.setIndex(i), 
            this.flow(), this.reflow());
        };
    }),
    isPanel: function() {
        return !0;
    },
    flow: enyo.inherit(function(t) {
        return function() {
            this.arrangements = [], t.apply(this, arguments);
        };
    }),
    reflow: enyo.inherit(function(t) {
        return function() {
            this.arrangements = [], t.apply(this, arguments), this.refresh();
        };
    }),
    getPanels: function() {
        var t = this.controlParent || this;
        return t.children;
    },
    getActive: function() {
        var t = this.getPanels(), e = this.index % t.length;
        return 0 > e && (e += t.length), t[e];
    },
    getAnimator: function() {
        return this.$.animator;
    },
    setIndex: function(t) {
        var e = this.get("index"), i = this.clamp(t);
        this.index = i, this.notifyObservers("index", e, i);
    },
    setIndexDirect: function(t) {
        this.setIndex(t), this.completed();
    },
    selectPanelByName: function(t) {
        if (t) for (var e = 0, i = this.getPanels(), n = i.length; n > e; ++e) if (t === i[e].name) return this.setIndex(e), 
        e;
    },
    previous: function() {
        var t = this.index - 1;
        this.wrap && 0 > t && (t = this.getPanels().length - 1), this.setIndex(t);
    },
    next: function() {
        var t = this.index + 1;
        this.wrap && t >= this.getPanels().length && (t = 0), this.setIndex(t);
    },
    clamp: function(t) {
        var e = this.getPanels().length;
        return this.wrap ? (t %= e, 0 > t ? t + e : t) : Math.max(0, Math.min(t, e - 1));
    },
    indexChanged: function(t) {
        this.lastIndex = t, !this.dragging && this.$.animator && (this.$.animator.isAnimating() && (this.finishTransitionInfo && (this.finishTransitionInfo.animating = !0), 
        this.completed()), this.$.animator.stop(), this.hasNode() && (this.animate ? (this.startTransition(!0), 
        this.$.animator.play({
            startValue: this.fraction
        })) : this.refresh()));
    },
    step: function(t) {
        return this.fraction = t.value, this.stepTransition(), !0;
    },
    completed: function() {
        return this.$.animator.isAnimating() && this.$.animator.stop(), this.fraction = 1, 
        this.stepTransition(), this.finishTransition(!0), !0;
    },
    dragstart: function(t, e) {
        return this.draggable && this.layout && this.layout.canDragEvent(e) ? (e.preventDefault(), 
        this.dragstartTransition(e), this.dragging = !0, this.$.animator.stop(), !0) : void 0;
    },
    drag: function(t, e) {
        this.dragging && (e.preventDefault(), this.dragTransition(e));
    },
    dragfinish: function(t, e) {
        this.dragging && (this.dragging = !1, e.preventTap(), this.dragfinishTransition(e));
    },
    dragstartTransition: function(t) {
        if (this.$.animator.isAnimating()) this.verifyDragTransition(t); else {
            var e = this.fromIndex = this.index;
            this.toIndex = e - (this.layout ? this.layout.calcDragDirection(t) : 0);
        }
        this.fromIndex = this.clamp(this.fromIndex), this.toIndex = this.clamp(this.toIndex), 
        this.fireTransitionStart(), this.layout && this.layout.start();
    },
    dragTransition: function(t) {
        var e = this.layout ? this.layout.calcDrag(t) : 0, i = this.transitionPoints, n = i[0], o = i[i.length - 1], s = this.fetchArrangement(n), a = this.fetchArrangement(o), r = this.layout ? this.layout.drag(e, n, s, o, a) : 0, h = e && !r;
        this.fraction += r;
        var l = this.fraction;
        (l > 1 || 0 > l || h) && ((l > 0 || h) && this.dragfinishTransition(t), this.dragstartTransition(t), 
        this.fraction = 0), this.stepTransition();
    },
    dragfinishTransition: function(t) {
        this.verifyDragTransition(t), this.setIndex(this.toIndex), this.dragging && this.fireTransitionFinish();
    },
    verifyDragTransition: function(t) {
        var e = this.layout ? this.layout.calcDragDirection(t) : 0, i = Math.min(this.fromIndex, this.toIndex), n = Math.max(this.fromIndex, this.toIndex);
        if (e > 0) {
            var o = i;
            i = n, n = o;
        }
        i != this.fromIndex && (this.fraction = 1 - this.fraction), this.fromIndex = i, 
        this.toIndex = n;
    },
    refresh: function() {
        this.$.animator && this.$.animator.isAnimating() && this.$.animator.stop(), this.startTransition(!1), 
        this.fraction = 1, this.stepTransition(), this.finishTransition(!1);
    },
    startTransition: function(t) {
        this.fromIndex = null != this.fromIndex ? this.fromIndex : this.lastIndex || 0, 
        this.toIndex = null != this.toIndex ? this.toIndex : this.index, this.layout && this.layout.start(), 
        t && this.fireTransitionStart();
    },
    finishTransition: function(t) {
        this.layout && this.layout.finish(), this.transitionPoints = [], this.fraction = 0, 
        this.fromIndex = this.toIndex = null, t && this.fireTransitionFinish();
    },
    fireTransitionStart: function() {
        var t = this.startTransitionInfo;
        !this.hasNode() || t && t.fromIndex == this.fromIndex && t.toIndex == this.toIndex || (this.startTransitionInfo = {
            fromIndex: this.fromIndex,
            toIndex: this.toIndex
        }, this.doTransitionStart(enyo.clone(this.startTransitionInfo)));
    },
    fireTransitionFinish: function() {
        var t = this.finishTransitionInfo;
        !this.hasNode() || t && t.fromIndex == this.lastIndex && t.toIndex == this.index || (this.finishTransitionInfo = t && t.animating ? {
            fromIndex: t.toIndex,
            toIndex: this.lastIndex
        } : {
            fromIndex: this.lastIndex,
            toIndex: this.index
        }, this.doTransitionFinish(enyo.clone(this.finishTransitionInfo)));
    },
    stepTransition: function() {
        if (this.hasNode()) {
            var t = this.transitionPoints, e = (this.fraction || 0) * (t.length - 1), i = Math.floor(e);
            e -= i;
            var n = t[i], o = t[i + 1], s = this.fetchArrangement(n), a = this.fetchArrangement(o);
            this.arrangement = s && a ? enyo.Panels.lerp(s, a, e) : s || a, this.arrangement && this.layout && this.layout.flowArrangement();
        }
    },
    fetchArrangement: function(t) {
        return null != t && !this.arrangements[t] && this.layout && (this.layout._arrange(t), 
        this.arrangements[t] = this.readArrangement(this.getPanels())), this.arrangements[t];
    },
    readArrangement: function(t) {
        for (var e, i = [], n = 0, o = t; e = o[n]; n++) i.push(enyo.clone(e._arranger));
        return i;
    },
    statics: {
        isScreenNarrow: function() {
            var t = navigator.userAgent, e = enyo.dom.getWindowWidth();
            switch (enyo.platform.platformName) {
              case "ios":
                return /iP(?:hone|od;(?: U;)? CPU) OS (\d+)/.test(t);

              case "android":
                return /Mobile/.test(t) && (enyo.platform.android > 2 ? !0 : 800 >= e);

              case "androidChrome":
                return /Mobile/.test(t);
            }
            return 800 >= e;
        },
        lerp: function(t, e, i) {
            for (var n, o = [], s = 0, a = enyo.keys(t); n = a[s]; s++) o.push(this.lerpObject(t[n], e[n], i));
            return o;
        },
        lerpObject: function(t, e, i) {
            var n, o, s = enyo.clone(t);
            if (e) for (var a in t) n = t[a], o = e[a], n != o && (s[a] = n - (n - o) * i);
            return s;
        }
    }
});

// lib\layout\tree\source\Node.js
enyo.kind({
    name: "enyo.Node",
    published: {
        expandable: !1,
        expanded: !1,
        icon: "",
        onlyIconExpands: !1,
        selected: !1
    },
    style: "padding: 0 0 0 16px;",
    content: "Node",
    defaultKind: "Node",
    classes: "enyo-node",
    components: [ {
        name: "icon",
        kind: "Image",
        showing: !1
    }, {
        kind: "Control",
        name: "caption",
        Xtag: "span",
        style: "display: inline-block; padding: 4px;",
        allowHtml: !0
    }, {
        kind: "Control",
        name: "extra",
        tag: "span",
        allowHtml: !0
    } ],
    childClient: [ {
        kind: "Control",
        name: "box",
        classes: "enyo-node-box",
        Xstyle: "border: 1px solid orange;",
        components: [ {
            kind: "Control",
            name: "client",
            classes: "enyo-node-client",
            Xstyle: "border: 1px solid lightblue;"
        } ]
    } ],
    handlers: {
        ondblclick: "dblclick"
    },
    events: {
        onNodeTap: "nodeTap",
        onNodeDblClick: "nodeDblClick",
        onExpand: "nodeExpand",
        onDestroyed: "nodeDestroyed"
    },
    create: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.selectedChanged(), this.iconChanged();
        };
    }),
    destroy: enyo.inherit(function(t) {
        return function() {
            this.doDestroyed(), t.apply(this, arguments);
        };
    }),
    initComponents: enyo.inherit(function(t) {
        return function() {
            this.expandable && (this.kindComponents = this.kindComponents.concat(this.childClient)), 
            t.apply(this, arguments);
        };
    }),
    contentChanged: function() {
        this.$.caption.setContent(this.content);
    },
    iconChanged: function() {
        this.$.icon.setSrc(this.icon), this.$.icon.setShowing(Boolean(this.icon));
    },
    selectedChanged: function() {
        this.addRemoveClass("enyo-selected", this.selected);
    },
    rendered: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.expandable && !this.expanded && this.quickCollapse();
        };
    }),
    addNodes: function(t) {
        this.destroyClientControls();
        for (var e, i = 0; e = t[i]; i++) this.createComponent(e);
        this.$.client.render();
    },
    addTextNodes: function(t) {
        this.destroyClientControls();
        for (var e, i = 0; e = t[i]; i++) this.createComponent({
            content: e
        });
        this.$.client.render();
    },
    tap: function(t, e) {
        return this.onlyIconExpands ? e.target == this.$.icon.hasNode() ? this.toggleExpanded() : this.doNodeTap() : (this.toggleExpanded(), 
        this.doNodeTap()), !0;
    },
    dblclick: function() {
        return this.doNodeDblClick(), !0;
    },
    toggleExpanded: function() {
        this.setExpanded(!this.expanded);
    },
    quickCollapse: function() {
        this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "0");
        var t = this.$.client.getBounds().height;
        this.$.client.setBounds({
            top: -t
        });
    },
    _expand: function() {
        this.addClass("enyo-animate");
        var t = this.$.client.getBounds().height;
        this.$.box.setBounds({
            height: t
        }), this.$.client.setBounds({
            top: 0
        }), setTimeout(this.bindSafely(function() {
            this.expanded && (this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "auto"));
        }), 225);
    },
    _collapse: function() {
        this.removeClass("enyo-animate");
        var t = this.$.client.getBounds().height;
        this.$.box.setBounds({
            height: t
        }), setTimeout(this.bindSafely(function() {
            this.addClass("enyo-animate"), this.$.box.applyStyle("height", "0"), this.$.client.setBounds({
                top: -t
            });
        }), 25);
    },
    expandedChanged: function() {
        if (this.expandable) {
            var t = {
                expanded: this.expanded
            };
            this.doExpand(t), t.wait || this.effectExpanded();
        } else this.expanded = !1;
    },
    effectExpanded: function() {
        this.$.client && (this.expanded ? this._expand() : this._collapse());
    }
});

// lib\layout\imageview\source\PanZoomView.js
enyo.kind({
    name: "enyo.PanZoomView",
    kind: enyo.Scroller,
    touchOverscroll: !1,
    thumb: !1,
    animate: !0,
    verticalDragPropagation: !0,
    horizontalDragPropagation: !0,
    published: {
        scale: "auto",
        disableZoom: !1
    },
    events: {
        onZoom: ""
    },
    touch: !0,
    preventDragPropagation: !1,
    handlers: {
        ondragstart: "dragPropagation",
        onSetDimensions: "setDimensions"
    },
    components: [ {
        name: "animator",
        kind: "Animator",
        onStep: "zoomAnimationStep",
        onEnd: "zoomAnimationEnd"
    }, {
        name: "viewport",
        style: "overflow:hidden;min-height:100%;min-width:100%;",
        classes: "enyo-fit",
        ongesturechange: "gestureTransform",
        ongestureend: "saveState",
        ontap: "singleTap",
        ondblclick: "doubleClick",
        onmousewheel: "mousewheel",
        components: [ {
            name: "content"
        } ]
    } ],
    create: enyo.inherit(function(t) {
        return function() {
            this.scaleKeyword = this.scale;
            var e = this.components;
            if (this.components = [], t.apply(this, arguments), this.$.content.applyStyle("width", this.contentWidth + "px"), 
            this.$.content.applyStyle("height", this.contentHeight + "px"), this.unscaledComponents) {
                var i = this.hasOwnProperty("unscaledComponents") ? this.getInstanceOwner() : this;
                this.createComponents(this.unscaledComponents, {
                    owner: i
                });
            }
            this.controlParentName = "content", this.discoverControlParent(), this.createComponents(e), 
            this.canTransform = enyo.dom.canTransform(), this.canTransform || this.$.content.applyStyle("position", "relative"), 
            this.canAccelerate = enyo.dom.canAccelerate(), this.getStrategy().setDragDuringGesture(!1);
        };
    }),
    rendered: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.getOriginalScale();
        };
    }),
    dragPropagation: function(t, e) {
        var i = this.getStrategy().getScrollBounds(), n = 0 === i.top && e.dy > 0 || i.top >= i.maxTop - 2 && 0 > e.dy, o = 0 === i.left && e.dx > 0 || i.left >= i.maxLeft - 2 && 0 > e.dx;
        return !(n && this.verticalDragPropagation || o && this.horizontalDragPropagation);
    },
    mousewheel: function(t, e) {
        e.pageX |= e.clientX + e.target.scrollLeft, e.pageY |= e.clientY + e.target.scrollTop;
        var i = (this.maxScale - this.minScale) / 10, n = this.scale;
        return e.wheelDelta > 0 || 0 > e.detail ? this.scale = this.limitScale(this.scale + i) : (0 > e.wheelDelta || e.detail > 0) && (this.scale = this.limitScale(this.scale - i)), 
        this.eventPt = this.calcEventLocation(e), this.transform(this.scale), n != this.scale && this.doZoom({
            scale: this.scale
        }), this.ratioX = this.ratioY = null, e.preventDefault(), !0;
    },
    resizeHandler: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.scaleChanged();
        };
    }),
    setDimensions: function(t, e) {
        return this.$.content.applyStyle("width", e.width + "px"), this.$.content.applyStyle("height", e.height + "px"), 
        this.originalWidth = e.width, this.originalHeight = e.height, this.scale = this.scaleKeyword, 
        this.scaleChanged(), !0;
    },
    getOriginalScale: function() {
        this.$.content.hasNode() && (this.originalWidth = this.$.content.node.clientWidth, 
        this.originalHeight = this.$.content.node.clientHeight, this.scale = this.scaleKeyword, 
        this.scaleChanged());
    },
    scaleChanged: function() {
        var t = this.hasNode();
        if (t) {
            this.containerWidth = t.clientWidth, this.containerHeight = t.clientHeight;
            var e = this.containerWidth / this.originalWidth, i = this.containerHeight / this.originalHeight;
            this.minScale = Math.min(e, i), this.maxScale = 1 > 3 * this.minScale ? 1 : 3 * this.minScale, 
            "auto" == this.scale ? this.scale = this.minScale : "width" == this.scale ? this.scale = e : "height" == this.scale ? this.scale = i : "fit" == this.scale ? (this.fitAlignment = "center", 
            this.scale = Math.max(e, i)) : (this.maxScale = Math.max(this.maxScale, this.scale), 
            this.scale = this.limitScale(this.scale));
        }
        this.eventPt = this.calcEventLocation(), this.transform(this.scale), this.getStrategy().$.scrollMath && this.getStrategy().$.scrollMath.start(), 
        this.align();
    },
    align: function() {
        if (this.fitAlignment && "center" === this.fitAlignment) {
            var t = this.getScrollBounds();
            this.setScrollLeft(t.maxLeft / 2), this.setScrollTop(t.maxTop / 2);
        }
    },
    gestureTransform: function(t, e) {
        this.eventPt = this.calcEventLocation(e), this.transform(this.limitScale(this.scale * e.scale));
    },
    calcEventLocation: function(t) {
        var e = {
            x: 0,
            y: 0
        };
        if (t && this.hasNode()) {
            var i = this.node.getBoundingClientRect();
            e.x = Math.round(t.pageX - i.left - this.bounds.x), e.x = Math.max(0, Math.min(this.bounds.width, e.x)), 
            e.y = Math.round(t.pageY - i.top - this.bounds.y), e.y = Math.max(0, Math.min(this.bounds.height, e.y));
        }
        return e;
    },
    transform: function(t) {
        this.tapped = !1;
        var e = this.bounds || this.innerBounds(t);
        this.bounds = this.innerBounds(t), this.scale > this.minScale ? this.$.viewport.applyStyle("cursor", "move") : this.$.viewport.applyStyle("cursor", null), 
        this.$.viewport.setBounds({
            width: this.bounds.width + "px",
            height: this.bounds.height + "px"
        }), this.ratioX = this.ratioX || (this.eventPt.x + this.getScrollLeft()) / e.width, 
        this.ratioY = this.ratioY || (this.eventPt.y + this.getScrollTop()) / e.height;
        var i, n;
        if (this.$.animator.ratioLock ? (i = this.$.animator.ratioLock.x * this.bounds.width - this.containerWidth / 2, 
        n = this.$.animator.ratioLock.y * this.bounds.height - this.containerHeight / 2) : (i = this.ratioX * this.bounds.width - this.eventPt.x, 
        n = this.ratioY * this.bounds.height - this.eventPt.y), i = Math.max(0, Math.min(this.bounds.width - this.containerWidth, i)), 
        n = Math.max(0, Math.min(this.bounds.height - this.containerHeight, n)), this.canTransform) {
            var o = {
                scale: t
            };
            o = this.canAccelerate ? enyo.mixin({
                translate3d: Math.round(this.bounds.left) + "px, " + Math.round(this.bounds.top) + "px, 0px"
            }, o) : enyo.mixin({
                translate: this.bounds.left + "px, " + this.bounds.top + "px"
            }, o), enyo.dom.transform(this.$.content, o);
        } else if (enyo.platform.ie) {
            var s = '"progid:DXImageTransform.Microsoft.Matrix(M11=' + t + ", M12=0, M21=0, M22=" + t + ", SizingMethod='auto expand')\"";
            this.$.content.applyStyle("-ms-filter", s), this.$.content.setBounds({
                width: this.bounds.width * t + "px",
                height: this.bounds.height * t + "px",
                left: this.bounds.left + "px",
                top: this.bounds.top + "px"
            }), this.$.content.applyStyle("width", t * this.bounds.width), this.$.content.applyStyle("height", t * this.bounds.height);
        }
        this.setScrollLeft(i), this.setScrollTop(n), this.positionClientControls(t);
    },
    limitScale: function(t) {
        return this.disableZoom ? t = this.scale : t > this.maxScale ? t = this.maxScale : this.minScale > t && (t = this.minScale), 
        t;
    },
    innerBounds: function(t) {
        var e = this.originalWidth * t, i = this.originalHeight * t, n = {
            x: 0,
            y: 0,
            transX: 0,
            transY: 0
        };
        return this.containerWidth > e && (n.x += (this.containerWidth - e) / 2), this.containerHeight > i && (n.y += (this.containerHeight - i) / 2), 
        this.canTransform && (n.transX -= (this.originalWidth - e) / 2, n.transY -= (this.originalHeight - i) / 2), 
        {
            left: n.x + n.transX,
            top: n.y + n.transY,
            width: e,
            height: i,
            x: n.x,
            y: n.y
        };
    },
    saveState: function(t, e) {
        var i = this.scale;
        this.scale *= e.scale, this.scale = this.limitScale(this.scale), i != this.scale && this.doZoom({
            scale: this.scale
        }), this.ratioX = this.ratioY = null;
    },
    doubleClick: function(t, e) {
        8 == enyo.platform.ie && (this.tapped = !0, e.pageX = e.clientX + e.target.scrollLeft, 
        e.pageY = e.clientY + e.target.scrollTop, this.singleTap(t, e), e.preventDefault());
    },
    singleTap: function(t, e) {
        setTimeout(this.bindSafely(function() {
            this.tapped = !1;
        }), 300), this.tapped ? (this.tapped = !1, this.smartZoom(t, e)) : this.tapped = !0;
    },
    smartZoom: function(t, e) {
        var i = this.hasNode(), n = this.$.content.hasNode();
        if (i && n && this.hasNode() && !this.disableZoom) {
            var o = this.scale;
            if (this.scale = this.scale != this.minScale ? this.minScale : this.maxScale, this.eventPt = this.calcEventLocation(e), 
            this.animate) {
                var s = {
                    x: (this.eventPt.x + this.getScrollLeft()) / this.bounds.width,
                    y: (this.eventPt.y + this.getScrollTop()) / this.bounds.height
                };
                this.$.animator.play({
                    duration: 350,
                    ratioLock: s,
                    baseScale: o,
                    deltaScale: this.scale - o
                });
            } else this.transform(this.scale), this.doZoom({
                scale: this.scale
            });
        }
    },
    zoomAnimationStep: function() {
        var t = this.$.animator.baseScale + this.$.animator.deltaScale * this.$.animator.value;
        return this.transform(t), !0;
    },
    zoomAnimationEnd: function() {
        return this.stabilize(), this.doZoom({
            scale: this.scale
        }), this.$.animator.ratioLock = void 0, !0;
    },
    positionClientControls: function(t) {
        this.waterfallDown("onPositionPin", {
            scale: t,
            bounds: this.bounds
        });
    }
});

// lib\layout\imageview\source\ImageViewPin.js
enyo.kind({
    name: "enyo.ImageViewPin",
    kind: "enyo.Control",
    published: {
        highlightAnchorPoint: !1,
        anchor: {
            top: 0,
            left: 0
        },
        position: {
            top: 0,
            left: 0
        }
    },
    style: "position:absolute;z-index:1000;width:0px;height:0px;",
    handlers: {
        onPositionPin: "reAnchor"
    },
    create: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.styleClientControls(), this.positionClientControls(), 
            this.highlightAnchorPointChanged(), this.anchorChanged();
        };
    }),
    styleClientControls: function() {
        for (var t = this.getClientControls(), e = 0; t.length > e; e++) t[e].applyStyle("position", "absolute");
    },
    positionClientControls: function() {
        for (var t = this.getClientControls(), e = 0; t.length > e; e++) for (var i in this.position) t[e].applyStyle(i, this.position[i] + "px");
    },
    highlightAnchorPointChanged: function() {
        this.addRemoveClass("pinDebug", this.highlightAnchorPoint);
    },
    anchorChanged: function() {
        var t = null, e = null;
        for (e in this.anchor) t = ("" + this.anchor[e]).match(/^(\d+(?:\.\d+)?)(.*)$/), 
        t && (this.anchor[e + "Coords"] = {
            value: t[1],
            units: t[2] || "px"
        });
    },
    reAnchor: function(t, e) {
        var i = e.scale, n = e.bounds, o = this.anchor.right ? "px" == this.anchor.rightCoords.units ? n.width + n.x - this.anchor.rightCoords.value * i : n.width * (100 - this.anchor.rightCoords.value) / 100 + n.x : "px" == this.anchor.leftCoords.units ? this.anchor.leftCoords.value * i + n.x : n.width * this.anchor.leftCoords.value / 100 + n.x, s = this.anchor.bottom ? "px" == this.anchor.bottomCoords.units ? n.height + n.y - this.anchor.bottomCoords.value * i : n.height * (100 - this.anchor.bottomCoords.value) / 100 + n.y : "px" == this.anchor.topCoords.units ? this.anchor.topCoords.value * i + n.y : n.height * this.anchor.topCoords.value / 100 + n.y;
        this.applyStyle("left", o + "px"), this.applyStyle("top", s + "px");
    }
});

// lib\layout\imageview\source\ImageView.js
enyo.kind({
    name: "enyo.ImageView",
    kind: "enyo.PanZoomView",
    subKindComponents: [ {
        kind: "Image",
        ondown: "down",
        style: "vertical-align: text-top;"
    } ],
    create: enyo.inherit(function(t) {
        return function() {
            this.unscaledComponents = this.components, this.components = [], this.kindComponents[1].components[0].components = this.subKindComponents, 
            t.apply(this, arguments), this.$.content.applyStyle("display", "inline-block"), 
            this.bufferImage = new Image(), this.bufferImage.onload = enyo.bind(this, "imageLoaded"), 
            this.bufferImage.onerror = enyo.bind(this, "imageError"), this.srcChanged(), this.getStrategy().$.scrollMath && this.getStrategy().$.scrollMath.start();
        };
    }),
    destroy: enyo.inherit(function(t) {
        return function() {
            this.bufferImage && (this.bufferImage.onerror = void 0, this.bufferImage.onerror = void 0, 
            delete this.bufferImage), t.apply(this, arguments);
        };
    }),
    down: function(t, e) {
        e.preventDefault();
    },
    srcChanged: function() {
        this.src && this.src.length > 0 && this.bufferImage && this.src != this.bufferImage.src && (this.bufferImage.src = this.src);
    },
    imageLoaded: function() {
        this.scale = this.scaleKeyword, this.originalWidth = this.contentWidth = this.bufferImage.width, 
        this.originalHeight = this.contentHeight = this.bufferImage.height, this.scaleChanged(), 
        this.$.image.setSrc(this.bufferImage.src), enyo.dom.transformValue(this.getStrategy().$.client, "translate3d", "0px, 0px, 0"), 
        this.positionClientControls(this.scale), this.align();
    },
    imageError: function(t) {
        enyo.error("Error loading image: " + this.src), this.bubble("onerror", t);
    }
});

// lib\layout\imageview\source\ImageCarousel.js
enyo.kind({
    name: "enyo.ImageCarousel",
    kind: enyo.Panels,
    arrangerKind: "enyo.CarouselArranger",
    defaultScale: "auto",
    disableZoom: !1,
    lowMemory: !1,
    published: {
        images: []
    },
    handlers: {
        onTransitionStart: "transitionStart",
        onTransitionFinish: "transitionFinish"
    },
    create: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.imageCount = this.images.length, this.images.length > 0 && (this.initContainers(), 
            this.loadNearby());
        };
    }),
    initContainers: function() {
        for (var t = 0; this.images.length > t; t++) this.$["container" + t] || (this.createComponent({
            name: "container" + t,
            style: "height:100%; width:100%;"
        }), this.$["container" + t].render());
        for (t = this.images.length; this.imageCount > t; t++) this.$["image" + t] && this.$["image" + t].destroy(), 
        this.$["container" + t].destroy();
        this.imageCount = this.images.length;
    },
    loadNearby: function() {
        var t = this.getBufferRange();
        for (var e in t) this.loadImageView(t[e]);
    },
    getBufferRange: function() {
        var t = [];
        if (this.layout.containerBounds) {
            var e, i, n, o, s = 1, a = this.layout.containerBounds;
            for (i = this.index - 1, n = 0, o = a.width * s; i >= 0 && o >= n; ) e = this.$["container" + i], 
            n += e.width + e.marginWidth, t.unshift(i), i--;
            for (i = this.index, n = 0, o = a.width * (s + 1); this.images.length > i && o >= n; ) e = this.$["container" + i], 
            n += e.width + e.marginWidth, t.push(i), i++;
        }
        return t;
    },
    reflow: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.loadNearby();
        };
    }),
    loadImageView: function(t) {
        return this.wrap && (t = (t % this.images.length + this.images.length) % this.images.length), 
        t >= 0 && this.images.length - 1 >= t && (this.$["image" + t] ? this.$["image" + t].src != this.images[t] && (this.$["image" + t].setSrc(this.images[t]), 
        this.$["image" + t].setScale(this.defaultScale), this.$["image" + t].setDisableZoom(this.disableZoom)) : (this.$["container" + t].createComponent({
            name: "image" + t,
            kind: "ImageView",
            scale: this.defaultScale,
            disableZoom: this.disableZoom,
            src: this.images[t],
            verticalDragPropagation: !1,
            style: "height:100%; width:100%;"
        }, {
            owner: this
        }), this.$["image" + t].render())), this.$["image" + t];
    },
    setImages: function(t) {
        this.set("images", t);
    },
    imagesChanged: function() {
        this.initContainers(), this.loadNearby();
    },
    indexChanged: enyo.inherit(function(t) {
        return function() {
            this.loadNearby(), this.lowMemory && this.cleanupMemory(), t.apply(this, arguments);
        };
    }),
    transitionStart: function(t, e) {
        return e.fromIndex == e.toIndex ? !0 : void 0;
    },
    transitionFinish: function() {
        this.loadNearby(), this.lowMemory && this.cleanupMemory();
    },
    getActiveImage: function() {
        return this.getImageByIndex(this.index);
    },
    getImageByIndex: function(t) {
        return this.$["image" + t] || this.loadImageView(t);
    },
    cleanupMemory: function() {
        for (var t = this.getBufferRange(), e = 0; this.images.length > e; e++) -1 === enyo.indexOf(e, t) && this.$["image" + e] && this.$["image" + e].destroy();
    }
});

// source\json3.js
(function(t) {
    function e(t) {
        if (e[t] !== o) return e[t];
        var i;
        if ("bug-string-char-index" == t) i = "a" != "a"[0]; else if ("json" == t) i = e("json-stringify") && e("json-parse"); else {
            var n, a = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
            if ("json-stringify" == t) {
                var r = h.stringify, d = "function" == typeof r && l;
                if (d) {
                    (n = function() {
                        return 1;
                    }).toJSON = n;
                    try {
                        d = "0" === r(0) && "0" === r(new Number()) && '""' == r(new String()) && r(s) === o && r(o) === o && r() === o && "1" === r(n) && "[1]" == r([ n ]) && "[null]" == r([ o ]) && "null" == r(null) && "[null,null,null]" == r([ o, s, null ]) && r({
                            a: [ n, !0, !1, null, "\0\b\n\f\r	" ]
                        }) == a && "1" === r(null, n) && "[\n 1,\n 2\n]" == r([ 1, 2 ], null, 1) && '"-271821-04-20T00:00:00.000Z"' == r(new Date(-864e13)) && '"+275760-09-13T00:00:00.000Z"' == r(new Date(864e13)) && '"-000001-01-01T00:00:00.000Z"' == r(new Date(-621987552e5)) && '"1969-12-31T23:59:59.999Z"' == r(new Date(-1));
                    } catch (c) {
                        d = !1;
                    }
                }
                i = d;
            }
            if ("json-parse" == t) {
                var u = h.parse;
                if ("function" == typeof u) try {
                    if (0 === u("0") && !u(!1)) {
                        n = u(a);
                        var g = 5 == n.a.length && 1 === n.a[0];
                        if (g) {
                            try {
                                g = !u('"	"');
                            } catch (c) {}
                            if (g) try {
                                g = 1 !== u("01");
                            } catch (c) {}
                            if (g) try {
                                g = 1 !== u("1.");
                            } catch (c) {}
                        }
                    }
                } catch (c) {
                    g = !1;
                }
                i = g;
            }
        }
        return e[t] = !!i;
    }
    var i, n, o, s = {}.toString, a = "function" == typeof define && define.amd, r = "object" == typeof JSON && JSON, h = "object" == typeof exports && exports && !exports.nodeType && exports;
    h && r ? (h.stringify = r.stringify, h.parse = r.parse) : h = t.JSON = r || {};
    var l = new Date(-0xc782b5b800cec);
    try {
        l = -109252 == l.getUTCFullYear() && 0 === l.getUTCMonth() && 1 === l.getUTCDate() && 10 == l.getUTCHours() && 37 == l.getUTCMinutes() && 6 == l.getUTCSeconds() && 708 == l.getUTCMilliseconds();
    } catch (d) {}
    if (!e("json")) {
        var c = "[object Function]", u = "[object Date]", g = "[object Number]", f = "[object String]", p = "[object Array]", m = "[object Boolean]", y = e("bug-string-char-index");
        if (!l) var v = Math.floor, w = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ], C = function(t, e) {
            return w[e] + 365 * (t - 1970) + v((t - 1969 + (e = +(e > 1))) / 4) - v((t - 1901 + e) / 100) + v((t - 1601 + e) / 400);
        };
        (i = {}.hasOwnProperty) || (i = function(t) {
            var e, n = {};
            return (n.__proto__ = null, n.__proto__ = {
                toString: 1
            }, n).toString != s ? i = function(t) {
                var e = this.__proto__, i = (this.__proto__ = null, t in this);
                return this.__proto__ = e, i;
            } : (e = n.constructor, i = function(t) {
                var i = (this.constructor || e).prototype;
                return t in this && !(t in i && this[t] === i[t]);
            }), n = null, i.call(this, t);
        });
        var x = {
            "boolean": 1,
            number: 1,
            string: 1,
            undefined: 1
        }, S = function(t, e) {
            var i = typeof t[e];
            return "object" == i ? !!t[e] : !x[i];
        };
        if (n = function(t, e) {
            var o, a, r, h = 0;
            (o = function() {
                this.valueOf = 0;
            }).prototype.valueOf = 0, a = new o();
            for (r in a) i.call(a, r) && h++;
            return o = a = null, h ? n = 2 == h ? function(t, e) {
                var n, o = {}, a = s.call(t) == c;
                for (n in t) a && "prototype" == n || i.call(o, n) || !(o[n] = 1) || !i.call(t, n) || e(n);
            } : function(t, e) {
                var n, o, a = s.call(t) == c;
                for (n in t) a && "prototype" == n || !i.call(t, n) || (o = "constructor" === n) || e(n);
                (o || i.call(t, n = "constructor")) && e(n);
            } : (a = [ "valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor" ], 
            n = function(t, e) {
                var n, o, r = s.call(t) == c, h = !r && "function" != typeof t.constructor && S(t, "hasOwnProperty") ? t.hasOwnProperty : i;
                for (n in t) r && "prototype" == n || !h.call(t, n) || e(n);
                for (o = a.length; n = a[--o]; h.call(t, n) && e(n)) ;
            }), n(t, e);
        }, !e("json-stringify")) {
            var b = {
                92: "\\\\",
                34: '\\"',
                8: "\\b",
                12: "\\f",
                10: "\\n",
                13: "\\r",
                9: "\\t"
            }, P = "000000", R = function(t, e) {
                return (P + (e || 0)).slice(-t);
            }, I = "\\u00", k = function(t) {
                var e, i = '"', n = 0, o = t.length, s = o > 10 && y;
                for (s && (e = t.split("")); o > n; n++) {
                    var a = t.charCodeAt(n);
                    switch (a) {
                      case 8:
                      case 9:
                      case 10:
                      case 12:
                      case 13:
                      case 34:
                      case 92:
                        i += b[a];
                        break;

                      default:
                        if (32 > a) {
                            i += I + R(2, a.toString(16));
                            break;
                        }
                        i += s ? e[n] : y ? t.charAt(n) : t[n];
                    }
                }
                return i + '"';
            }, $ = function(t, e, a, r, h, l, d) {
                var c, y, w, x, S, b, P, I, T, M, N, D, B, A, H, O;
                try {
                    c = e[t];
                } catch (z) {}
                if ("object" == typeof c && c) if (y = s.call(c), y != u || i.call(c, "toJSON")) "function" == typeof c.toJSON && (y != g && y != f && y != p || i.call(c, "toJSON")) && (c = c.toJSON(t)); else if (c > -1 / 0 && 1 / 0 > c) {
                    if (C) {
                        for (S = v(c / 864e5), w = v(S / 365.2425) + 1970 - 1; S >= C(w + 1, 0); w++) ;
                        for (x = v((S - C(w, 0)) / 30.42); S >= C(w, x + 1); x++) ;
                        S = 1 + S - C(w, x), b = (c % 864e5 + 864e5) % 864e5, P = v(b / 36e5) % 24, I = v(b / 6e4) % 60, 
                        T = v(b / 1e3) % 60, M = b % 1e3;
                    } else w = c.getUTCFullYear(), x = c.getUTCMonth(), S = c.getUTCDate(), P = c.getUTCHours(), 
                    I = c.getUTCMinutes(), T = c.getUTCSeconds(), M = c.getUTCMilliseconds();
                    c = (0 >= w || w >= 1e4 ? (0 > w ? "-" : "+") + R(6, 0 > w ? -w : w) : R(4, w)) + "-" + R(2, x + 1) + "-" + R(2, S) + "T" + R(2, P) + ":" + R(2, I) + ":" + R(2, T) + "." + R(3, M) + "Z";
                } else c = null;
                if (a && (c = a.call(e, t, c)), null === c) return "null";
                if (y = s.call(c), y == m) return "" + c;
                if (y == g) return c > -1 / 0 && 1 / 0 > c ? "" + c : "null";
                if (y == f) return k("" + c);
                if ("object" == typeof c) {
                    for (A = d.length; A--; ) if (d[A] === c) throw TypeError();
                    if (d.push(c), N = [], H = l, l += h, y == p) {
                        for (B = 0, A = c.length; A > B; B++) D = $(B, c, a, r, h, l, d), N.push(D === o ? "null" : D);
                        O = N.length ? h ? "[\n" + l + N.join(",\n" + l) + "\n" + H + "]" : "[" + N.join(",") + "]" : "[]";
                    } else n(r || c, function(t) {
                        var e = $(t, c, a, r, h, l, d);
                        e !== o && N.push(k(t) + ":" + (h ? " " : "") + e);
                    }), O = N.length ? h ? "{\n" + l + N.join(",\n" + l) + "\n" + H + "}" : "{" + N.join(",") + "}" : "{}";
                    return d.pop(), O;
                }
            };
            h.stringify = function(t, e, i) {
                var n, o, a, r;
                if ("function" == typeof e || "object" == typeof e && e) if ((r = s.call(e)) == c) o = e; else if (r == p) {
                    a = {};
                    for (var h, l = 0, d = e.length; d > l; h = e[l++], r = s.call(h), (r == f || r == g) && (a[h] = 1)) ;
                }
                if (i) if ((r = s.call(i)) == g) {
                    if ((i -= i % 1) > 0) for (n = "", i > 10 && (i = 10); i > n.length; n += " ") ;
                } else r == f && (n = 10 >= i.length ? i : i.slice(0, 10));
                return $("", (h = {}, h[""] = t, h), o, a, n, "", []);
            };
        }
        if (!e("json-parse")) {
            var T, M, N = String.fromCharCode, D = {
                92: "\\",
                34: '"',
                47: "/",
                98: "\b",
                116: "	",
                110: "\n",
                102: "\f",
                114: "\r"
            }, B = function() {
                throw T = M = null, SyntaxError();
            }, A = function() {
                for (var t, e, i, n, o, s = M, a = s.length; a > T; ) switch (o = s.charCodeAt(T)) {
                  case 9:
                  case 10:
                  case 13:
                  case 32:
                    T++;
                    break;

                  case 123:
                  case 125:
                  case 91:
                  case 93:
                  case 58:
                  case 44:
                    return t = y ? s.charAt(T) : s[T], T++, t;

                  case 34:
                    for (t = "@", T++; a > T; ) if (o = s.charCodeAt(T), 32 > o) B(); else if (92 == o) switch (o = s.charCodeAt(++T)) {
                      case 92:
                      case 34:
                      case 47:
                      case 98:
                      case 116:
                      case 110:
                      case 102:
                      case 114:
                        t += D[o], T++;
                        break;

                      case 117:
                        for (e = ++T, i = T + 4; i > T; T++) o = s.charCodeAt(T), o >= 48 && 57 >= o || o >= 97 && 102 >= o || o >= 65 && 70 >= o || B();
                        t += N("0x" + s.slice(e, T));
                        break;

                      default:
                        B();
                    } else {
                        if (34 == o) break;
                        for (o = s.charCodeAt(T), e = T; o >= 32 && 92 != o && 34 != o; ) o = s.charCodeAt(++T);
                        t += s.slice(e, T);
                    }
                    if (34 == s.charCodeAt(T)) return T++, t;
                    B();

                  default:
                    if (e = T, 45 == o && (n = !0, o = s.charCodeAt(++T)), o >= 48 && 57 >= o) {
                        for (48 == o && (o = s.charCodeAt(T + 1), o >= 48 && 57 >= o) && B(), n = !1; a > T && (o = s.charCodeAt(T), 
                        o >= 48 && 57 >= o); T++) ;
                        if (46 == s.charCodeAt(T)) {
                            for (i = ++T; a > i && (o = s.charCodeAt(i), o >= 48 && 57 >= o); i++) ;
                            i == T && B(), T = i;
                        }
                        if (o = s.charCodeAt(T), 101 == o || 69 == o) {
                            for (o = s.charCodeAt(++T), (43 == o || 45 == o) && T++, i = T; a > i && (o = s.charCodeAt(i), 
                            o >= 48 && 57 >= o); i++) ;
                            i == T && B(), T = i;
                        }
                        return +s.slice(e, T);
                    }
                    if (n && B(), "true" == s.slice(T, T + 4)) return T += 4, !0;
                    if ("false" == s.slice(T, T + 5)) return T += 5, !1;
                    if ("null" == s.slice(T, T + 4)) return T += 4, null;
                    B();
                }
                return "$";
            }, H = function(t) {
                var e, i;
                if ("$" == t && B(), "string" == typeof t) {
                    if ("@" == (y ? t.charAt(0) : t[0])) return t.slice(1);
                    if ("[" == t) {
                        for (e = []; t = A(), "]" != t; i || (i = !0)) i && ("," == t ? (t = A(), "]" == t && B()) : B()), 
                        "," == t && B(), e.push(H(t));
                        return e;
                    }
                    if ("{" == t) {
                        for (e = {}; t = A(), "}" != t; i || (i = !0)) i && ("," == t ? (t = A(), "}" == t && B()) : B()), 
                        ("," == t || "string" != typeof t || "@" != (y ? t.charAt(0) : t[0]) || ":" != A()) && B(), 
                        e[t.slice(1)] = H(A());
                        return e;
                    }
                    B();
                }
                return t;
            }, O = function(t, e, i) {
                var n = z(t, e, i);
                n === o ? delete t[e] : t[e] = n;
            }, z = function(t, e, i) {
                var o, a = t[e];
                if ("object" == typeof a && a) if (s.call(a) == p) for (o = a.length; o--; ) O(a, o, i); else n(a, function(t) {
                    O(a, t, i);
                });
                return i.call(t, e, a);
            };
            h.parse = function(t, e) {
                var i, n;
                return T = 0, M = "" + t, i = H(A()), "$" != A() && B(), T = M = null, e && s.call(e) == c ? z((n = {}, 
                n[""] = i, n), "", e) : i;
            };
        }
    }
    a && define(function() {
        return h;
    });
})(this);

// source\jsoauth.js
var exports = exports || this;

exports.OAuth = function(t) {
    function e(t) {
        var e, i = arguments, n = i.callee, o = (i.length, this);
        if (!(this instanceof n)) return new n(t);
        for (e in t) t.hasOwnProperty(e) && (o[e] = t[e]);
        return o;
    }
    function i() {}
    function n(t) {
        var e, i, n, s, a, r, h, l = arguments, c = l.callee, d = /^([^:\/?#]+?:\/\/)*([^\/:?#]*)?(:[^\/?#]*)*([^?#]*)(\?[^#]*)?(#(.*))*/, u = this;
        return this instanceof c ? (u.scheme = "", u.host = "", u.port = "", u.path = "", 
        u.query = new o(), u.anchor = "", null !== t && (e = t.match(d), i = e[1], n = e[2], 
        s = e[3], a = e[4], r = e[5], h = e[6], i = void 0 !== i ? i.replace("://", "").toLowerCase() : "http", 
        s = s ? s.replace(":", "") : "https" === i ? "443" : "80", i = "http" == i && "443" === s ? "https" : i, 
        r = r ? r.replace("?", "") : "", h = h ? h.replace("#", "") : "", ("https" === i && "443" !== s || "http" === i && "80" !== s) && (n = n + ":" + s), 
        u.scheme = i, u.host = n, u.port = s, u.path = a || "/", u.query.setQueryParams(r), 
        u.anchor = h || ""), void 0) : new c(t);
    }
    function o(t) {
        var e, i = arguments, n = i.callee, o = (i.length, this);
        if (s.urlDecode, !(this instanceof n)) return new n(t);
        if (void 0 != t) for (e in t) t.hasOwnProperty(e) && (o[e] = t[e]);
        return o;
    }
    function s(t) {
        return this instanceof s ? this.init(t) : new s(t);
    }
    function a(t) {
        var e, i, n = [];
        for (e in t) t[e] && void 0 !== t[e] && "" !== t[e] && ("realm" === e ? i = e + '="' + t[e] + '"' : n.push(e + '="' + s.urlEncode(t[e] + "") + '"'));
        return n.sort(), i && n.unshift(i), n.join(", ");
    }
    function r(t, e, i, n) {
        var o, a = [], r = s.urlEncode;
        for (o in i) void 0 !== i[o] && "" !== i[o] && a.push([ s.urlEncode(o), s.urlEncode(i[o] + "") ]);
        for (o in n) if (void 0 !== n[o] && "" !== n[o] && !i[o]) if ("object" != typeof n[o]) "data[0]" != o ? a.push([ r(o), r(n[o] + "") ]) : a.push([ r(o), n[o] + "" ]); else for (var h = 0; n[o].length > h; h++) a.push([ o + "[" + h + "]", n[o][h] ]);
        return a = a.sort(function(t, e) {
            return t[0] < e[0] ? -1 : t[0] > e[0] ? 1 : t[1] < e[1] ? -1 : t[1] > e[1] ? 1 : 0;
        }).map(function(t) {
            return t.join("=");
        }), [ t, r(e), r(a.join("&")) ].join("&");
    }
    function h() {
        return parseInt(+new Date() / 1e3, 10);
    }
    function l(t) {
        function e() {
            return Math.floor(Math.random() * r.length);
        }
        t = t || 64;
        var i, n = t / 8, o = "", s = n / 4, a = n % 4, r = [ "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2A", "2B", "2C", "2D", "2E", "2F", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3A", "3B", "3C", "3D", "3E", "3F", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4A", "4B", "4C", "4D", "4E", "4F", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5A", "5B", "5C", "5D", "5E", "5F", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6A", "6B", "6C", "6D", "6E", "6F", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7A", "7B", "7C", "7D", "7E" ];
        for (i = 0; s > i; i++) o += r[e()] + r[e()] + r[e()] + r[e()];
        for (i = 0; a > i; i++) o += r[e()];
        return o;
    }
    function c() {
        var e;
        if (t.Titanium !== void 0 && t.Titanium.Network.createHTTPClient !== void 0) e = t.Titanium.Network.createHTTPClient(); else if ("undefined" != typeof require) try {
            e = new require("xhr").XMLHttpRequest();
        } catch (i) {
            if (void 0 === t.XMLHttpRequest) throw "No valid request transport found.";
            e = enyo.platform.firefoxOS ? new t.XMLHttpRequest({
                mozSystem: !0,
                mozAnon: !0
            }) : new t.XMLHttpRequest();
        } else {
            if (void 0 === t.XMLHttpRequest) throw "No valid request transport found.";
            e = enyo.platform.firefoxOS ? new t.XMLHttpRequest({
                mozSystem: !0,
                mozAnon: !0
            }) : new t.XMLHttpRequest();
        }
        return e;
    }
    function d(t) {
        var e = Array(++t);
        return e.join(0).split("");
    }
    function u(t) {
        var e, i, n = [];
        for (i = 0; t.length > i; i++) e = t.charCodeAt(i), 128 > e ? n.push(e) : 2048 > e ? n.push(192 + (e >> 6), 128 + (63 & e)) : 65536 > e ? n.push(224 + (e >> 12), 128 + (63 & e >> 6), 128 + (63 & e)) : 2097152 > e && n.push(240 + (e >> 18), 128 + (63 & e >> 12), 128 + (63 & e >> 6), 128 + (63 & e));
        return n;
    }
    function g(t) {
        var e, i = [];
        for (e = 0; 32 * t.length > e; e += 8) i.push(255 & t[e >>> 5] >>> 24 - e % 32);
        return i;
    }
    function f(t) {
        var e, i = [], n = t.length;
        for (e = 0; n > e; e++) i.push((t[e] >>> 4).toString(16)), i.push((15 & t[e]).toString(16));
        return i.join("");
    }
    function p(t) {
        var e, i = "", n = t.length;
        for (e = 0; n > e; e++) i += String.fromCharCode(t[e]);
        return i;
    }
    function m(t, e) {
        return t << e | t >>> 32 - e;
    }
    function y(t) {
        if (void 0 !== t) {
            var e, i, n = t;
            return n.constructor === String && (n = u(n)), e = this instanceof y ? this : new y(t), 
            i = e.hash(n), f(i);
        }
        return this instanceof y ? this : new y();
    }
    function v(t, e, i, n) {
        var o, s, a, r, h = u(e), l = u(i), c = h.length;
        for (c > t.blocksize && (h = t.hash(h), c = h.length), h = h.concat(d(t.blocksize - c)), 
        s = h.slice(0), a = h.slice(0), r = 0; t.blocksize > r; r++) s[r] ^= 92, a[r] ^= 54;
        return o = t.hash(s.concat(t.hash(a.concat(l)))), n ? f(o) : p(o);
    }
    i.prototype = {
        join: function(t) {
            return t = t || "", this.values().join(t);
        },
        keys: function() {
            var t, e = [], i = this;
            for (t in i) i.hasOwnProperty(t) && e.push(t);
            return e;
        },
        values: function() {
            var t, e = [], i = this;
            for (t in i) i.hasOwnProperty(t) && e.push(i[t]);
            return e;
        },
        shift: function() {
            throw "not implimented";
        },
        unshift: function() {
            throw "not implimented";
        },
        push: function() {
            throw "not implimented";
        },
        pop: function() {
            throw "not implimented";
        },
        sort: function() {
            throw "not implimented";
        },
        ksort: function(t) {
            var e, i, n, o = this, s = o.keys();
            for (void 0 == t ? s.sort() : s.sort(t), e = 0; s.length > e; e++) n = s[e], i = o[n], 
            delete o[n], o[n] = i;
            return o;
        },
        toObject: function() {
            var t, e = {}, i = this;
            for (t in i) i.hasOwnProperty(t) && (e[t] = i[t]);
            return e;
        }
    }, e.prototype = new i(), n.prototype = {
        scheme: "",
        host: "",
        port: "",
        path: "",
        query: "",
        anchor: "",
        toString: function() {
            var t = this, e = t.query + "";
            return t.scheme + "://" + t.host + t.path + ("" != e ? "?" + e : "") + ("" !== t.anchor ? "#" + t.anchor : "");
        }
    }, o.prototype = new e(), o.prototype.toString = function() {
        var t, e = this, i = [], n = "", o = "", a = s.urlEncode;
        e.ksort();
        for (t in e) e.hasOwnProperty(t) && void 0 != t && void 0 != e[t] && (o = a(t) + "=" + a(e[t]), 
        i.push(o));
        return i.length > 0 && (n = i.join("&")), n;
    }, o.prototype.setQueryParams = function(t) {
        var e, i, n, o, a = arguments, r = a.length, h = this, l = s.urlDecode;
        if (1 == r) {
            if ("object" == typeof t) for (e in t) h[e] = t.hasOwnProperty(e) && "string" == typeof t[e] ? l(t[e]) : t[e]; else if ("string" == typeof t) for (i = t.split("&"), 
            e = 0, n = i.length; n > e; e++) o = i[e].split("="), "" != o[0] && (h[o[0]] = l(o[1]));
        } else for (e = 0; r > e; e += 2) h[a[e]] = l(a[e + 1]);
    };
    var w = "1.0";
    return s.prototype = {
        realm: "",
        requestTokenUrl: "",
        authorizationUrl: "",
        accessTokenUrl: "",
        init: function(t) {
            var e = "", i = {
                enablePrivilege: t.enablePrivilege || !1,
                proxyUrl: t.proxyUrl,
                callbackUrl: t.callbackUrl || "oob",
                consumerKey: t.consumerKey,
                consumerSecret: t.consumerSecret,
                accessTokenKey: t.accessTokenKey || e,
                accessTokenSecret: t.accessTokenSecret || e,
                verifier: e,
                signatureMethod: t.signatureMethod || "HMAC-SHA1"
            };
            return this.realm = t.realm || e, this.requestTokenUrl = t.requestTokenUrl || e, 
            this.authorizationUrl = t.authorizationUrl || e, this.accessTokenUrl = t.accessTokenUrl || e, 
            this.getAccessToken = function() {
                return [ i.accessTokenKey, i.accessTokenSecret ];
            }, this.getAccessTokenKey = function() {
                return i.accessTokenKey;
            }, this.getAccessTokenSecret = function() {
                return i.accessTokenSecret;
            }, this.setAccessToken = function(t, e) {
                e && (t = [ t, e ]), i.accessTokenKey = t[0], i.accessTokenSecret = t[1];
            }, this.getVerifier = function() {
                return i.verifier;
            }, this.setVerifier = function(t) {
                i.verifier = t;
            }, this.setCallbackUrl = function(t) {
                i.callbackUrl = t;
            }, this.request = function(t) {
                var e, o, d, u, g, f, p, m, y, v, C, x, S, b, P, R, k = [], T = {};
                e = t.method || "GET", o = n(t.url), d = t.data || {}, u = t.headers || {}, g = t.success || function() {}, 
                f = t.failure || function() {}, P = function() {
                    var t = !1;
                    for (var e in d) (d[e] instanceof File || d[e].fileName !== void 0) && (t = !0);
                    return t;
                }(), S = t.appendQueryString ? t.appendQueryString : !1, i.enablePrivilege && netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead UniversalBrowserWrite"), 
                p = c(), p.onreadystatechange = function() {
                    if (4 === p.readyState) {
                        var t, e = /^(.*?):\s*(.*?)\r?$/gm, i = u, n = {}, o = "";
                        if (p.getAllResponseHeaders) for (o = p.getAllResponseHeaders(); t = e.exec(o); ) n[t[1]] = t[2]; else if (p.getResponseHeaders) {
                            o = p.getResponseHeaders();
                            for (var s = 0, a = o.length; a > s; ++s) n[o[s][0]] = o[s][1];
                        }
                        var r = !1;
                        "Content-Type" in n && "text/xml" == n["Content-Type"] && (r = !0);
                        var h = {
                            text: p.responseText,
                            xml: r ? p.responseXML : "",
                            requestHeaders: i,
                            responseHeaders: n
                        };
                        p.status >= 200 && 226 >= p.status || 304 == p.status || 0 === p.status ? g(h) : p.status >= 400 && 0 !== p.status && f(h);
                    }
                }, y = {
                    oauth_callback: i.callbackUrl,
                    oauth_consumer_key: i.consumerKey,
                    oauth_token: i.accessTokenKey,
                    oauth_signature_method: i.signatureMethod,
                    oauth_timestamp: h(),
                    oauth_nonce: l(),
                    oauth_verifier: i.verifier,
                    oauth_version: w
                }, v = i.signatureMethod, b = o.query.toObject();
                for (m in b) T[m] = b[m];
                if (!("Content-Type" in u && "application/x-www-form-urlencoded" != u["Content-Type"] || P)) for (m in d) T[m] = d[m];
                if (R = o.scheme + "://" + o.host + o.path, C = r(e, R, y, T), C = C.replace(/\%257E/g, "~"), 
                x = s.signatureMethod[v](i.consumerSecret, i.accessTokenSecret, C), y.oauth_signature = x, 
                this.realm && (y.realm = this.realm), i.proxyUrl && (o = n(i.proxyUrl + o.path)), 
                S || "GET" == e) o.query.setQueryParams(d), k = null; else if (P) {
                    if (P) {
                        k = new FormData();
                        for (m in d) k.append(m, d[m]);
                    }
                } else if ("string" == typeof d) k = d, "Content-Type" in u || (u["Content-Type"] = "text/plain"); else {
                    for (m in d) if (void 0 !== d[m] && "" !== d[m]) if ("object" != typeof d[m]) k.push(s.urlEncode(m) + "=" + s.urlEncode(d[m] + "")); else for (var I = 0; d[m].length > I; I++) k.push(s.urlEncode(m + "[" + I + "]") + "=" + d[m][I]);
                    k = k.sort().join("&"), "Content-Type" in u || (u["Content-Type"] = "application/x-www-form-urlencoded");
                }
                p.open(e, o + "", !0), p.setRequestHeader("Authorization", "OAuth " + a(y)), p.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                for (m in u) p.setRequestHeader(m, u[m]);
                p.send(k);
            }, this;
        },
        get: function(t, e, i, n) {
            this.request({
                url: t,
                data: e,
                success: i,
                failure: n
            });
        },
        post: function(t, e, i, n) {
            this.request({
                method: "POST",
                url: t,
                data: e,
                success: i,
                failure: n
            });
        },
        getJSON: function(t, e, i) {
            this.get(t, function(t) {
                e(JSON.parse(t.text));
            }, i);
        },
        postJSON: function(t, e, i, n) {
            this.request({
                method: "POST",
                url: t,
                data: JSON.stringify(e),
                success: function(t) {
                    i(JSON.parse(t.text));
                },
                failure: n,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        },
        parseTokenRequest: function(t, e) {
            switch (e) {
              case "text/xml":
                var i = t.xml.getElementsByTagName("token"), n = t.xml.getElementsByTagName("secret");
                h[s.urlDecode(i[0])] = s.urlDecode(n[0]);
                break;

              default:
                for (var o = 0, a = t.text.split("&"), r = a.length, h = {}; r > o; ++o) {
                    var l = a[o].split("=");
                    h[s.urlDecode(l[0])] = s.urlDecode(l[1]);
                }
            }
            return h;
        },
        fetchRequestToken: function(t, e) {
            var i = this;
            i.setAccessToken("", "");
            var n = i.authorizationUrl;
            this.get(this.requestTokenUrl, function(e) {
                var o = i.parseTokenRequest(e, e.responseHeaders["Content-Type"] || void 0);
                i.setAccessToken([ o.oauth_token, o.oauth_token_secret ]), t(n + "?" + e.text);
            }, e);
        },
        fetchAccessToken: function(t, e) {
            var i = this;
            this.get(this.accessTokenUrl, function(e) {
                var n = i.parseTokenRequest(e, e.responseHeaders["Content-Type"] || void 0);
                i.setAccessToken([ n.oauth_token, n.oauth_token_secret ]), i.setVerifier(""), t(e);
            }, e);
        }
    }, s.signatureMethod = {
        "HMAC-SHA1": function(e, i, n) {
            var o, a, r = s.urlEncode;
            return e = r(e), i = r(i || ""), o = e + "&" + i, a = v(y.prototype, o, n), t.btoa(a);
        }
    }, s.urlEncode = function(t) {
        function e(t) {
            var e = t.toString(16).toUpperCase();
            return 2 > e.length && (e = 0 + e), "%" + e;
        }
        if (!t) return "";
        t += "";
        var i, n, o = /[ \t\r\n!*"'();:@&=+$,\/?%#\[\]<>{}|`^\\\u0080-\uffff]/, s = t.length, a = t.split("");
        for (i = 0; s > i; i++) (n = a[i].match(o)) && (n = n[0].charCodeAt(0), 128 > n ? a[i] = e(n) : 2048 > n ? a[i] = e(192 + (n >> 6)) + e(128 + (63 & n)) : 65536 > n ? a[i] = e(224 + (n >> 12)) + e(128 + (63 & n >> 6)) + e(128 + (63 & n)) : 2097152 > n && (a[i] = e(240 + (n >> 18)) + e(128 + (63 & n >> 12)) + e(128 + (63 & n >> 6)) + e(128 + (63 & n))));
        return a.join("");
    }, s.urlDecode = function(t) {
        return t ? t.replace(/%[a-fA-F0-9]{2}/gi, function(t) {
            return String.fromCharCode(parseInt(t.replace("%", ""), 16));
        }) : "";
    }, y.prototype = new y(), y.prototype.blocksize = 64, y.prototype.hash = function(t) {
        function e(t, e, i, n) {
            switch (t) {
              case 0:
                return e & i | ~e & n;

              case 1:
              case 3:
                return e ^ i ^ n;

              case 2:
                return e & i | e & n | i & n;
            }
            return -1;
        }
        var i, n, o, s, a, r, h, l, c, f, p, y, v, w, C, x, S, b, P, R = [ 1732584193, 4023233417, 2562383102, 271733878, 3285377520 ], k = [ 1518500249, 1859775393, 2400959708, 3395469782 ];
        for (t.constructor === String && (t = u(t.encodeUTF8())), o = t.length, s = Math.ceil((o + 9) / this.blocksize) * this.blocksize - (o + 9), 
        n = Math.floor(o / 4294967296), i = Math.floor(o % 4294967296), a = [ 255 & 8 * n >> 24, 255 & 8 * n >> 16, 255 & 8 * n >> 8, 255 & 8 * n, 255 & 8 * i >> 24, 255 & 8 * i >> 16, 255 & 8 * i >> 8, 255 & 8 * i ], 
        t = t.concat([ 128 ], d(s), a), r = Math.ceil(t.length / this.blocksize), h = 0; r > h; h++) {
            for (l = t.slice(h * this.blocksize, (h + 1) * this.blocksize), c = l.length, f = [], 
            p = 0; c > p; p++) f[p >>> 2] |= l[p] << 24 - 8 * (p - 4 * (p >> 2));
            for (y = R[0], v = R[1], w = R[2], C = R[3], x = R[4], S = 0; 80 > S; S++) S >= 16 && (f[S] = m(f[S - 3] ^ f[S - 8] ^ f[S - 14] ^ f[S - 16], 1)), 
            b = Math.floor(S / 20), P = m(y, 5) + e(b, v, w, C) + x + k[b] + f[S], x = C, C = w, 
            w = m(v, 30), v = y, y = P;
            R[0] += y, R[1] += v, R[2] += w, R[3] += C, R[4] += x;
        }
        return g(R);
    }, s;
}(exports);

var exports = exports || this;

(function(t) {
    var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    t.btoa = t.btoa || function(t) {
        for (var i, n, o = 0, s = t.length, a = ""; s > o; o += 3) i = [ t.charCodeAt(o), t.charCodeAt(o + 1), t.charCodeAt(o + 2) ], 
        n = [ i[0] >> 2, (3 & i[0]) << 4 | i[1] >> 4, (15 & i[1]) << 2 | i[2] >> 6, 63 & i[2] ], 
        isNaN(i[1]) && (n[2] = 64), isNaN(i[2]) && (n[3] = 64), a += e.charAt(n[0]) + e.charAt(n[1]) + e.charAt(n[2]) + e.charAt(n[3]);
        return a;
    };
})(exports);

// source\application.js
var APPLICATION = {};

APPLICATION.count = {}, APPLICATION.count.gatheringCount = 0, APPLICATION.count.favoritesCalls = 0, 
APPLICATION.count.firstRetry = 0, APPLICATION.count.secondRetry = 0, APPLICATION.count.imageSrcCount = 0, 
APPLICATION.count.embedImageCount = 0, APPLICATION.count.OAuthCalls = 0, APPLICATION.count.XHRCalls = 0, 
APPLICATION.count.backgroundImageCount = 0, APPLICATION.count.totalStoredPost = 0, 
APPLICATION.setupApplication = function() {
    APPLICATION.tumblrUserName = STORAGE.get("tumblrUserName"), APPLICATION.tumblrPW = APPLICATION.lpw(), 
    APPLICATION.tumblrUseTags = STORAGE.get("tumblrUseTags") || !0, APPLICATION.tumblrAddTags = STORAGE.get("tumblrAddTags") || !0, 
    APPLICATION.tumblrGetNotes = STORAGE.get("tumblrGetNotes") || !0, APPLICATION.tumblrNewSession = STORAGE.get("tumblrNewSession") || !1, 
    APPLICATION.tumblrUseAllPics = STORAGE.get("tumblrUseAllPics") || !1, APPLICATION.tumblrUseInApp = STORAGE.get("tumblrUseInApp"), 
    APPLICATION.firstTimeRun = STORAGE.get("firstTimeRun") || !1, APPLICATION.downloadedItems = [], 
    APPLICATION.blogExploreItems = [], APPLICATION.tmpFavorites = [], APPLICATION.exploreItems = [], 
    APPLICATION.actualIndex = 0, APPLICATION.newPostOffset = 0;
}, APPLICATION.spw = function(t) {
    var e = t, i = e.split("");
    i.reverse(), e = i.join(""), e = PEEK.string.toBase64(e), i = e.split(""), e = enyo.json.stringify(i), 
    e = PEEK.string.toBase64(e), STORAGE.set("tumblrPW", e);
}, APPLICATION.lpw = function() {
    var t = STORAGE.get("tumblrPW");
    if (t && null !== t && t.length > 0) {
        try {
            t = PEEK.string.fromBase64(t);
            var e = enyo.json.parse(t);
            t = e.join(""), t = PEEK.string.fromBase64(t), e = t.split(""), e.reverse(), t = e.join("");
        } catch (i) {
            t = "";
        }
        return t;
    }
    return "";
}, APPLICATION.sendShareRequest = function(t, e, i, n, o) {
    if (o) if (enyo.platform.android) window.plugins.share.show({
        subject: t,
        text: e
    }); else if (enyo.platform.blackberry) try {
        var s = {
            action: "bb.action.SHARE",
            data: e,
            mime: "text/plain",
            target_type: [ "APPLICATION", "VIEWER", "CARD" ]
        };
        blackberry.invoke.card.invokeTargetPicker(s, "Share via", function() {}, function() {});
    } catch (a) {} else enyo.platform.firefoxOS && new MozActivity({
        name: "share",
        data: {
            type: "url",
            url: i,
            body: i
        }
    }); else {
        var r = [];
        r.push(n), enyo.platform.android ? window.plugin.email.open({
            to: r,
            cc: [],
            bcc: [],
            attachments: [],
            subject: t,
            body: e,
            isHtml: !0
        }) : enyo.platform.blackberry ? blackberry.invoke.card.invokeEmailComposer({
            subject: t,
            body: e,
            to: r
        }, function(t) {
            console.log(t);
        }, function(t) {
            console.log(t);
        }, function(t) {
            console.log(t);
        }) : enyo.platform.firefoxOS && new MozActivity({
            name: "new",
            data: {
                type: "mail",
                url: "mailto:" + n + "?subject=" + t + "&body=" + e
            }
        });
    }
}, APPLICATION.fillSessionData = function() {
    var t = STORAGE.get("tumblrExploreIndex");
    t = parseInt(t, 10), (!t || isNaN(t) || null === t) && (t = 0), APPLICATION.exploreIndex = t, 
    t = STORAGE.get("tumblrActualIndex"), t = parseInt(t, 10), (!t || isNaN(t) || null === t) && (t = 0), 
    APPLICATION.actualIndex = t, t = STORAGE.get("tumblrPostMode"), t = parseInt(t, 10), 
    (!t || isNaN(t) || null === t) && (t = 0), APPLICATION.postMode = t, t = STORAGE.get("tumblrFaveCat"), 
    t && null !== t || (t = "Favorites"), APPLICATION.favoritesCategory = t, t = STORAGE.get("tumblrPBN"), 
    t && null !== t || (t = ""), TUMBLR.PRIMARY_BLOG_NAME = t, t = STORAGE.get("tumblrLIK");
    try {
        t = PEEK.string.fromBase64(t), t = enyo.json.parse(t);
    } catch (e) {
        t = {}, TUMBLR.loggedIn = !1;
    }
    t && null !== t ? TUMBLR.loggedIn = !0 : (t = {}, TUMBLR.loggedIn = !1), TUMBLR.loginKeys = t, 
    t = STORAGE.get("tumblrUO");
    try {
        t = PEEK.string.fromBase64(t), t = enyo.json.parse(t);
    } catch (e) {
        t = {
            blogs: []
        };
    }
    t && null !== t || (t = {
        blogs: []
    }), TUMBLR.userObject = t, t = STORAGE.get("tumblrBlogToExplore"), t && null !== t || (t = ""), 
    APPLICATION.blogToExplore = t, t = STORAGE.get("tumblrinTagMode"), t && null !== t || (t = !1), 
    APPLICATION.inTagMode = t;
}, APPLICATION.handleLinks = function(t, e) {
    if (enyo.platform.firefoxOS) return new MozActivity({
        name: "view",
        data: {
            type: "url",
            url: t.url
        }
    }), void 0;
    if (t.appStore === !0 || APPLICATION.tumblrUseInApp === !1) enyo.platform.android ? navigator.app.loadUrl(t.url, {
        openExternal: !0
    }) : enyo.platform.blackberry ? blackberry.invoke.invoke({
        uri: t.url
    }, {}, {}) : window.open(t.url, "_blank", "location=yes"); else {
        var i = window.open(t.url, "_blank", "location=yes");
        i && i.addEventListener("exit", function() {
            e();
        });
    }
    return !0;
}, APPLICATION.caseInsensitiveSort = function(t, e) {
    var i = 0;
    return t = t.toLowerCase(), e = e.toLowerCase(), t > e && (i = 1), e > t && (i = -1), 
    i;
}, APPLICATION.sortByPostDate = function(t, e) {
    var i = Date.parse(t.post.date), n = Date.parse(e.post.date);
    return n > i ? 1 : i > n ? -1 : 0;
}, APPLICATION.favorites = {}, APPLICATION.addDefaultCategories = function() {
    var t = !1, e = 0, i = 0;
    for (e = 0; PRE_CAT_NAMES.length > e; e++) {
        for (t = !1, i = 0; APPLICATION.favoriteCategories.length > i; i++) if (PRE_CAT_NAMES[e].toLowerCase() == APPLICATION.favoriteCategories[i].toLowerCase()) {
            t = !0;
            break;
        }
        t === !1 && APPLICATION.favoriteCategories.push(PRE_CAT_NAMES[e]);
    }
    var n = !1;
    for (e = 0; PRE_BUILT_CATEGORIES.length > e; e++) {
        for (t = !1, i = 0; APPLICATION.favoriteBlogs.length > i; i++) if (APPLICATION.favoriteBlogs[i].blog_name.toLowerCase() == PRE_BUILT_CATEGORIES[e].blog_name.toLowerCase() && APPLICATION.favoriteBlogs[i].tagMode == PRE_BUILT_CATEGORIES[e].tagMode) {
            for (var o = 0; PRE_BUILT_CATEGORIES[e].category.length > o; o++) {
                if (n = !1, APPLICATION.favoriteBlogs[i].category.length > 0) for (var s = 0; APPLICATION.favoriteBlogs[i].category.length > s; s++) if (APPLICATION.favoriteBlogs[i].category[s].toLowerCase() == PRE_BUILT_CATEGORIES[e].category[o].toLowerCase()) {
                    n = !0;
                    break;
                }
                n === !1 && APPLICATION.favoriteBlogs[i].category.push(PRE_BUILT_CATEGORIES[e].category[o]);
            }
            t = !0;
            break;
        }
        if (t === !1) {
            var a = PRE_BUILT_CATEGORIES[e];
            APPLICATION.favoriteBlogs.push({
                blog_name: a.blog_name,
                last_date: new Date(),
                category: enyo.clone(a.category),
                tagMode: a.tagMode
            });
        }
    }
    APPLICATION.favoriteCategories.sort(APPLICATION.caseInsensitiveSort), APPLICATION.categories.saveCategories(), 
    APPLICATION.favorites.saveFavorites();
}, APPLICATION.favorites.saveFavorites = function() {
    var t = enyo.json.stringify(APPLICATION.favoriteBlogs);
    t = PEEK.string.toBase64(t), STORAGE.saveFavoritesItems(t);
}, APPLICATION.favorites.loadFavorites = function(t) {
    if (console.log(t), !t.text) return APPLICATION.favoriteBlogs = [], APPLICATION.favorites.saveFavorites(), 
    void 0;
    var e = t.text;
    try {
        e = PEEK.string.fromBase64(e), e = enyo.json.parse(e);
        for (var i = 0; e.length > i; i++) e[i].last_date = e[i].last_date ? new Date(Date.parse(e[i].last_date)) : new Date();
        APPLICATION.favoriteBlogs = e, APPLICATION.favoriteBlogs || (APPLICATION.favoriteBlogs = []);
    } catch (n) {
        APPLICATION.favoriteBlogs = [], APPLICATION.favorites.saveFavorites();
    }
    enyo.platform.blackberry && "6" != STORAGE.get("resaveFavBB") && (APPLICATION.favorites.saveFavorites(), 
    STORAGE.set("resaveFavBB", "6"));
}, APPLICATION.favorites.deleteFavorite = function(t, e, n) {
    var o = t, s = APPLICATION.favoriteCategories[e];
    for (i = 0; APPLICATION.favoriteBlogs.length > i; i++) if (APPLICATION.favoriteBlogs[i].blog_name == o && APPLICATION.favoriteBlogs[i].tagMode == n) {
        for (var a = 0; APPLICATION.favoriteBlogs[i].category.length > a; a++) if (APPLICATION.favoriteBlogs[i].category[a] == s) {
            APPLICATION.favoriteBlogs[i].category.splice(a, 1), 1 > APPLICATION.favoriteBlogs[i].category.length && APPLICATION.favoriteBlogs.splice(i, 1), 
            APPLICATION.favorites.saveFavorites();
            break;
        }
        break;
    }
}, APPLICATION.favorites.addFavoriteToCategory = function(t, e, n) {
    var o = 0, s = !1, a = e, r = t;
    for (i = 0; APPLICATION.favoriteBlogs.length > i; i++) if (APPLICATION.favoriteBlogs[i].blog_name.toLowerCase() == r.toLowerCase() && APPLICATION.favoriteBlogs[i].tagMode == n) {
        s = !0, o = i;
        break;
    }
    if (s === !0) {
        for (s = !1, i = 0; APPLICATION.favoriteBlogs[o].category.length > i; i++) if (APPLICATION.favoriteBlogs[o].category[i].toLowerCase() == a.toLowerCase()) {
            s = !0;
            break;
        }
        s === !1 && APPLICATION.favoriteBlogs[o].category.push(a);
    } else {
        var h = new APPLICATION.favorites.getNewFavoriteObj();
        h.blog_name = r, h.tagMode = n, h.category.push(a), APPLICATION.favoriteBlogs.push(h);
    }
    APPLICATION.favorites.saveFavorites();
}, APPLICATION.favorites.moveToCategory = function(t, e, i, n) {
    for (var o = i, s = e, a = t, r = n, h = 0; APPLICATION.favoriteBlogs.length > h; h++) if (APPLICATION.favoriteBlogs[h].blog_name == a && APPLICATION.favoriteBlogs[h].tagMode == r) {
        for (var l = 0; APPLICATION.favoriteBlogs[h].category.length > l; l++) if (APPLICATION.favoriteBlogs[h].category[l] == s) {
            APPLICATION.favoriteBlogs[h].category.splice(l, 1), APPLICATION.favoriteBlogs[h].category.push(o), 
            APPLICATION.favorites.saveFavorites();
            break;
        }
        break;
    }
}, APPLICATION.favorites.getNewFavoriteObj = function() {
    return {
        blog_name: "",
        last_date: new Date(),
        category: [],
        tagMode: !1
    };
}, APPLICATION.favorites.stripTempFavorites = function() {
    var t = 0;
    do APPLICATION.favoriteBlogs[t].doNotDisplay && (APPLICATION.favoriteBlogs.splice(t, 1), 
    t = 0), t++; while (APPLICATION.favoriteBlogs.length > t);
    do "__TEMP" == APPLICATION.favoriteCategories[t] && (APPLICATION.favoriteCategories.splice(t, 1), 
    t = 0), t++; while (APPLICATION.favoriteCategories.length > t);
}, APPLICATION.favorites.addTempFavorites = function() {
    for (var t = -1, e = !1, i = 0; APPLICATION.favoriteCategories.length > i; i++) if ("__TEMP" == APPLICATION.favoriteCategories[i]) {
        e = !0, t = i;
        break;
    }
    e || APPLICATION.favoriteCategories.push("__TEMP");
}, APPLICATION.categories = {}, APPLICATION.categories.loadCategories = function(t) {
    if (console.log(t), !t.text) return APPLICATION.favoriteCategories = [], APPLICATION.favoriteCategories.push("Favorites"), 
    APPLICATION.addDefaultCategories(), void 0;
    var e = t.text;
    try {
        e = PEEK.string.fromBase64(e), e = enyo.json.parse(e), APPLICATION.favoriteCategories = e, 
        APPLICATION.favoriteCategories || (APPLICATION.favoriteCategories = []), 1 > APPLICATION.favoriteCategories.length && (APPLICATION.favoriteCategories.push("Favorites"), 
        APPLICATION.addDefaultCategories());
    } catch (i) {
        APPLICATION.favoriteCategories = [], APPLICATION.favoriteCategories.push("Favorites"), 
        APPLICATION.addDefaultCategories();
    }
    APPLICATION.favoriteCategories.sort(APPLICATION.caseInsensitiveSort), enyo.platform.blackberry && "6" != STORAGE.get("resaveCatBB") && (APPLICATION.categories.saveCategories(), 
    STORAGE.set("resaveCatBB", "6"));
}, APPLICATION.categories.saveCategories = function() {
    if (1 > APPLICATION.favoriteCategories.length) APPLICATION.favoriteCategories.push("Favorites"), 
    APPLICATION.addDefaultCategories(); else {
        var t = enyo.json.stringify(APPLICATION.favoriteCategories);
        t = PEEK.string.toBase64(t), STORAGE.saveCategoriesItems(t);
    }
}, APPLICATION.categories.addCategory = function(t) {
    if (1 > t.length) return !0;
    for (var e = 0; APPLICATION.favoriteCategories.length > e; e++) if (APPLICATION.favoriteCategories[e].toLowerCase() == t.toLowerCase()) return !0;
    return APPLICATION.favoriteCategories.push(t), APPLICATION.favoriteCategories.sort(APPLICATION.caseInsensitiveSort), 
    APPLICATION.categories.saveCategories(), !1;
}, APPLICATION.categories.deleteCategory = function(t) {
    for (var e = [], i = t, n = 0; APPLICATION.favoriteBlogs.length > n; n++) {
        for (var o = 0; APPLICATION.favoriteBlogs[n].category.length > o; o++) if (APPLICATION.favoriteBlogs[n].category[o].toLowerCase() == APPLICATION.favoriteCategories[i].toLowerCase()) {
            APPLICATION.favoriteBlogs[n].category.splice(o, 1);
            break;
        }
        APPLICATION.favoriteBlogs[n].category.length >= 1 && e.push(APPLICATION.favoriteBlogs[n]);
    }
    APPLICATION.favoriteCategories.splice(i, 1), APPLICATION.favoriteBlogs = e, APPLICATION.categories.saveCategories(), 
    APPLICATION.favorites.saveFavorites();
}, APPLICATION.categories.editCategory = function(t, e) {
    var i = APPLICATION.favoriteCategories[t], n = e;
    APPLICATION.favoriteCategories[t] = n;
    for (var o = 0; APPLICATION.favoriteBlogs.length > o; o++) for (var s = 0; APPLICATION.favoriteBlogs[o].category.length > s; s++) if (APPLICATION.favoriteBlogs[o].category[s] == i) {
        APPLICATION.favoriteBlogs[o].category[s] = n;
        break;
    }
}, APPLICATION.categories.getImageSrcs = function(t) {
    var e = [];
    for (k = 0; APPLICATION.favoriteBlogs.length > k; k++) for (j = 0; APPLICATION.favoriteBlogs[k].category.length > j; j++) APPLICATION.favoriteBlogs[k].category[j].toLowerCase() == t.toLowerCase() && (APPLICATION.favoriteBlogs[k].tagMode === !0 ? e.push("assets/tagicon" + (enyo.irand(12) + 1) + ".png") : e.push(TUMBLR.getAvatar(APPLICATION.favoriteBlogs[k].blog_name, 30)));
    return e;
};

// source\sugar.js
(function() {
    function t(t) {
        return function() {
            return t;
        };
    }
    function e(t) {
        var e = "Array" === t && sn.isArray || function(e, n) {
            return (n || dn.call(e)) === "[object " + t + "]";
        };
        return yn[t] = e;
    }
    function n(t, e) {
        function n(n) {
            return p(n) ? dn.call(n) === "[object " + e + "]" : typeof n === t;
        }
        return yn[e] = n;
    }
    function i(t) {
        t.SugarMethods || (h(t, "SugarMethods", {}), o(t, !1, !0, {
            extend: function(e, n, i) {
                o(t, !1 !== i, n, e);
            },
            sugarRestore: function() {
                return r(this, t, arguments, function(t, e, n) {
                    h(t, e, n.method);
                });
            },
            sugarRevert: function() {
                return r(this, t, arguments, function(t, e, n) {
                    n.existed ? h(t, e, n.original) : delete t[e];
                });
            }
        }));
    }
    function o(t, e, n, o) {
        var s = e ? t.prototype : t;
        i(t), v(o, function(i, o) {
            var r = s[i], l = g(s, i);
            An(n) && r && (o = a(r, o, n)), !1 === n && r || h(s, i, o), t.SugarMethods[i] = {
                method: o,
                existed: l,
                original: r,
                instance: e
            };
        });
    }
    function s(t, e, n, i, s) {
        var r = {};
        i = bn(i) ? i.split(",") : i, i.forEach(function(t, e) {
            s(r, t, e);
        }), o(t, e, n, r);
    }
    function r(t, e, n, i) {
        var o = 0 === n.length, s = l(n), r = !1;
        return v(e.SugarMethods, function(e, n) {
            (o || -1 !== s.indexOf(e)) && (r = !0, i(n.instance ? t.prototype : t, e, n));
        }), r;
    }
    function a(t, e, n) {
        return function() {
            return n.apply(this, arguments) ? e.apply(this, arguments) : t.apply(this, arguments);
        };
    }
    function h(t, e, n) {
        gn ? on.defineProperty(t, e, {
            value: n,
            configurable: !0,
            enumerable: !1,
            writable: !0
        }) : t[e] = n;
    }
    function l(t, e, n) {
        var i = [];
        n = n || 0;
        var o;
        for (o = t.length; o > n; n++) i.push(t[n]), e && e.call(t, t[n], n);
        return i;
    }
    function c(t, e, n) {
        var i = t[n || 0];
        Sn(i) && (t = i, n = 0), l(t, e, n);
    }
    function u(t) {
        if (!t || !t.call) throw new TypeError("Callback is not callable");
    }
    function d(t) {
        return void 0 !== t;
    }
    function f(t) {
        return void 0 === t;
    }
    function g(t, e) {
        return !!t && fn.call(t, e);
    }
    function p(t) {
        return !!t && ("object" == typeof t || pn && In(t));
    }
    function m(t) {
        var e = typeof t;
        return null == t || "string" === e || "number" === e || "boolean" === e;
    }
    function y(t, e) {
        e = e || dn.call(t);
        try {
            if (t && t.constructor && !g(t, "constructor") && !g(t.constructor.prototype, "isPrototypeOf")) return !1;
        } catch (n) {
            return !1;
        }
        return !!t && "[object Object]" === e && "hasOwnProperty" in t;
    }
    function v(t, e) {
        for (var n in t) if (g(t, n) && !1 === e.call(t, n, t[n], t)) break;
    }
    function C(t, e) {
        for (var n = 0; t > n; n++) e(n);
    }
    function w(t, e) {
        return v(e, function(n) {
            t[n] = e[n];
        }), t;
    }
    function P(t) {
        if (m(t) && (t = on(t)), mn && bn(t)) for (var e, n = t, i = 0; e = n.charAt(i); ) n[i++] = e;
        return t;
    }
    function b(t) {
        w(this, P(t));
    }
    function S(t, e, n) {
        var i = Rn(10, kn(e || 0));
        return n = n || Mn, 0 > e && (i = 1 / i), n(t * i) / i;
    }
    function x() {
        return "	\n\f\r \u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u2028\u2029\u3000\ufeff";
    }
    function I(t, e) {
        var n = "";
        for (t = "" + t; e > 0; ) 1 & e && (n += t), (e >>= 1) && (t += t);
        return n;
    }
    function A(t, e) {
        var n, i;
        return n = t.replace(Tn, function(t) {
            return t = _n[t], t === En && (i = !0), t;
        }), i ? parseFloat(n) : parseInt(n, e || 10);
    }
    function T(t, e, n, i) {
        return i = kn(t).toString(i || 10), i = I("0", e - i.replace(/\.\d+/, "").length) + i, 
        (n || 0 > t) && (i = (0 > t ? "-" : "+") + i), i;
    }
    function k(t) {
        if (t >= 11 && 13 >= t) return "th";
        switch (t % 10) {
          case 1:
            return "st";

          case 2:
            return "nd";

          case 3:
            return "rd";

          default:
            return "th";
        }
    }
    function R(t, e) {
        function n(t, n) {
            (t || e.indexOf(n) > -1) && (i += n);
        }
        var i = "";
        return e = e || "", n(t.multiline, "m"), n(t.ignoreCase, "i"), n(t.global, "g"), 
        n(t.u, "y"), i;
    }
    function O(t) {
        return bn(t) || (t = hn(t)), t.replace(/([\/\'*+?|()\[\]{}.^$])/g, "\\$1");
    }
    function N(t, e) {
        return t["get" + (t._utc ? "UTC" : "") + e]();
    }
    function M(t, e, n) {
        return t["set" + (t._utc && "ISOWeek" != e ? "UTC" : "") + e](n);
    }
    function $(t, e) {
        var n, i, o, s, r, a, h, l = typeof t;
        if ("string" === l) return t;
        if (o = dn.call(t), n = y(t, o), i = Sn(t, o), null != t && n || i) {
            if (e || (e = []), e.length > 1) for (a = e.length; a--; ) if (e[a] === t) return "CYC";
            for (e.push(t), n = t.valueOf() + hn(t.constructor), s = i ? t : on.keys(t).sort(), 
            a = 0, h = s.length; h > a; a++) r = i ? a : s[a], n += r + $(t[r], e);
            e.pop();
        } else n = -1/0 === 1 / t ? "-0" : hn(t && t.valueOf ? t.valueOf() : t);
        return l + o + n;
    }
    function B(t, e) {
        return t === e ? 0 !== t || 1 / t === 1 / e : L(t) && L(e) ? $(t) === $(e) : !1;
    }
    function L(t) {
        var e = dn.call(t);
        return vn.test(e) || y(t, e);
    }
    function D(t, e, n) {
        var i, o = t.length, s = e.length, r = !1 !== e[s - 1];
        return s > (r ? 1 : 2) ? (i = [], l(e, function(e) {
            return wn(e) ? !1 : (i.push(z(t, o, e, r, n)), void 0);
        }), i) : z(t, o, e[0], r, n);
    }
    function z(t, e, n, i, o) {
        return i && (n %= e, 0 > n && (n = e + n)), o ? t.charAt(n) : t[n];
    }
    function H(t, e) {
        s(e, !0, !1, t, function(t, e) {
            t[e + ("equal" === e ? "s" : "")] = function() {
                return on[e].apply(null, [ this ].concat(l(arguments)));
            };
        });
    }
    function E(t, e, n, i) {
        var o = t.length, s = -1 == i, r = s ? o - 1 : 0;
        for (n = isNaN(n) ? r : parseInt(n >> 0), 0 > n && (n = o + n), (!s && 0 > n || s && n >= o) && (n = r); s && n >= 0 || !s && o > n; ) {
            if (t[n] === e) return n;
            n += i;
        }
        return -1;
    }
    function F(t, e, n, i) {
        var o = t.length, s = 0, r = d(n);
        if (u(e), 0 == o && !r) throw new TypeError("Reduce called on empty array with no initial value");
        for (r || (n = t[i ? o - 1 : s], s++); o > s; ) r = i ? o - s - 1 : s, r in t && (n = e(n, t[r], r, t)), 
        s++;
        return n;
    }
    function _(t) {
        if (0 === t.length) throw new TypeError("First argument must be defined");
    }
    function V(t) {
        return t = rn(t), function(e) {
            return t.test(e);
        };
    }
    function U(t) {
        var e = t.getTime();
        return function(t) {
            return !(!t || !t.getTime) && t.getTime() === e;
        };
    }
    function j(t) {
        return function(e, n, i) {
            return e === t || t.call(this, e, n, i);
        };
    }
    function K(t) {
        return function(e, n, i) {
            return e === t || t.call(i, n, e, i);
        };
    }
    function W(t, e) {
        var n = {};
        return function(i, o, s) {
            var r;
            if (!p(i)) return !1;
            for (r in t) if (n[r] = n[r] || Y(t[r], e), !1 === n[r].call(s, i[r], o, s)) return !1;
            return !0;
        };
    }
    function q(t) {
        return function(e) {
            return e === t || B(e, t);
        };
    }
    function Y(t, e) {
        if (!m(t)) {
            if (In(t)) return V(t);
            if (xn(t)) return U(t);
            if (An(t)) return e ? K(t) : j(t);
            if (y(t)) return W(t, e);
        }
        return q(t);
    }
    function Z(t, e, n, i) {
        return e ? e.apply ? e.apply(n, i || []) : An(t[e]) ? t[e].call(t) : t[e] : t;
    }
    function G(t, e, n, i) {
        var o = +t.length;
        for (0 > n && (n = t.length + n), n = isNaN(n) ? 0 : n, !0 === i && (o += n); o > n; ) {
            if (i = n % t.length, !(i in t)) {
                X(t, e, n);
                break;
            }
            if (!1 === e.call(t, t[i], i, t)) break;
            n++;
        }
    }
    function X(t, e, n) {
        var i, o = [];
        for (i in t) i in t && i >>> 0 == i && 4294967295 != i && i >= n && o.push(parseInt(i));
        o.sort().each(function(n) {
            return e.call(t, t[n], n, t);
        });
    }
    function J(t, e, n, i, o, s) {
        var r, a, h;
        return t.length > 0 && (h = Y(e), G(t, function(e, n) {
            return h.call(s, e, n, t) ? (r = e, a = n, !1) : void 0;
        }, n, i)), o ? a : r;
    }
    function Q(t, e) {
        var n, i = [], o = {};
        return G(t, function(s, r) {
            n = e ? Z(s, e, t, [ s, r, t ]) : s, oe(o, n) || i.push(s);
        }), i;
    }
    function te(t, e, n) {
        var i = [], o = {};
        return e.each(function(t) {
            oe(o, t);
        }), t.each(function(t) {
            var e = $(t), s = !L(t);
            if (ie(o, e, t, s) !== n) {
                var r = 0;
                if (s) for (e = o[e]; e.length > r; ) e[r] === t ? e.splice(r, 1) : r += 1; else delete o[e];
                i.push(t);
            }
        }), i;
    }
    function ee(t, e, n) {
        e = e || 1/0, n = n || 0;
        var i = [];
        return G(t, function(t) {
            Sn(t) && e > n ? i = i.concat(ee(t, e, n + 1)) : i.push(t);
        }), i;
    }
    function ne(t) {
        var e = [];
        return l(t, function(t) {
            e = e.concat(t);
        }), e;
    }
    function ie(t, e, n, i) {
        var o = e in t;
        return i && (t[e] || (t[e] = []), o = -1 !== t[e].indexOf(n)), o;
    }
    function oe(t, e) {
        var n = $(e), i = !L(e), o = ie(t, n, e, i);
        return i ? t[n].push(e) : t[n] = e, o;
    }
    function se(t, e, n, i) {
        var o, s, r, a = [], h = "max" === n, l = "min" === n, c = sn.isArray(t);
        for (o in t) if (t.hasOwnProperty(o)) {
            if (n = t[o], r = Z(n, e, t, c ? [ n, parseInt(o), t ] : []), f(r)) throw new TypeError("Cannot compare with undefined");
            r === s ? a.push(n) : (f(s) || h && r > s || l && s > r) && (a = [ n ], s = r);
        }
        return c || (a = ee(a, 1)), i ? a : a[0];
    }
    function re(t, e) {
        var n, i, o, s, r = 0, a = 0;
        n = sn[Kn], i = sn[Wn];
        var h = sn[qn], l = sn[jn], c = sn[Yn];
        t = ae(t, n, i), e = ae(e, n, i);
        do n = t.charAt(r), o = h[n] || n, n = e.charAt(r), s = h[n] || n, n = o ? l.indexOf(o) : null, 
        i = s ? l.indexOf(s) : null, -1 === n || -1 === i ? (n = t.charCodeAt(r) || null, 
        i = e.charCodeAt(r) || null, c && (n >= Ln && Dn >= n || n >= zn && Hn >= n) && (i >= Ln && Dn >= i || i >= zn && Hn >= i) && (n = A(t.slice(r)), 
        i = A(e.slice(r)))) : (o = o !== t.charAt(r), s = s !== e.charAt(r), o !== s && 0 === a && (a = o - s)), 
        r += 1; while (null != n && null != i && n === i);
        return n === i ? a : n - i;
    }
    function ae(t, e, n) {
        return bn(t) || (t = hn(t)), n && (t = t.toLowerCase()), e && (t = t.replace(e, "")), 
        t;
    }
    function he(t, e) {
        s(on, !1, !0, t, function(t, n) {
            t[n] = function(t, i, o) {
                var s, r = on.keys(P(t));
                return e || (s = Y(i, !0)), o = sn.prototype[n].call(r, function(n) {
                    var o = t[n];
                    return e ? Z(o, i, t, [ n, o, t ]) : s(o, n, t);
                }, o), Sn(o) && (o = o.reduce(function(e, n) {
                    return e[n] = t[n], e;
                }, {})), o;
            };
        }), H(t, b);
    }
    function le(t) {
        w(this, t), this.g = ai.concat();
    }
    function ce(t, e, n) {
        var i, o, s = e[0], r = e[1], a = e[2];
        return e = t[n] || t.relative, An(e) ? e.call(t, s, r, a, n) : (o = t.units[8 * (t.plural && s > 1 ? 1 : 0) + r] || t.units[r], 
        t.capitalizeUnit && (o = ye(o)), i = t.modifiers.filter(function(t) {
            return "sign" == t.name && t.value == (a > 0 ? 1 : -1);
        })[0], e.replace(/\{(.*?)\}/g, function(t, e) {
            switch (e) {
              case "num":
                return s;

              case "unit":
                return o;

              case "sign":
                return i.src;
            }
        }));
    }
    function ue(t, e) {
        return e = e || t.code, "en" === e || "en-US" === e ? !0 : t.variant;
    }
    function de(t, e) {
        return e.replace(rn(t.num, "g"), function(e) {
            return fe(t, e) || "";
        });
    }
    function fe(t, e) {
        var n;
        return Pn(e) ? e : e && -1 !== (n = t.numbers.indexOf(e)) ? (n + 1) % 10 : 1;
    }
    function ge(t, e) {
        var n;
        if (bn(t) || (t = ""), n = ui[t] || ui[t.slice(0, 2)], !1 === e && !n) throw new TypeError("Invalid locale.");
        return n || ti;
    }
    function pe(t, e) {
        function n(t) {
            var e = a[t];
            bn(e) ? a[t] = e.split(",") : e || (a[t] = []);
        }
        function i(t, e) {
            t = t.split("+").map(function(t) {
                return t.replace(/(.+):(.+)$/, function(t, e, n) {
                    return n.split("|").map(function(t) {
                        return e + t;
                    }).join("|");
                });
            }).join("|"), t.split("|").forEach(e);
        }
        function o(t, e, n) {
            var o = [];
            a[t].forEach(function(t, s) {
                e && (t += "+" + t.slice(0, 3)), i(t, function(t, e) {
                    o[e * n + s] = t.toLowerCase();
                });
            }), a[t] = o;
        }
        function s(t, e, n) {
            return t = "\\d{" + t + "," + e + "}", n && (t += "|(?:" + ve(a.numbers) + ")+"), 
            t;
        }
        function r(t, e) {
            a[t] = a[t] || e;
        }
        var a, h;
        return a = new le(e), n("modifiers"), "months weekdays units numbers articles tokens timeMarker ampm timeSuffixes dateParse timeParse".split(" ").forEach(n), 
        h = !a.monthSuffix, o("months", h, 12), o("weekdays", h, 7), o("units", !1, 8), 
        o("numbers", !1, 10), r("code", t), r("date", s(1, 2, a.digitDate)), r("year", "'\\d{2}|" + s(4, 4)), 
        r("num", function() {
            var t = [ "-?\\d+" ].concat(a.articles);
            return a.numbers && (t = t.concat(a.numbers)), ve(t);
        }()), function() {
            var t = [];
            a.i = {}, a.modifiers.push({
                name: "day",
                src: "yesterday",
                value: -1
            }), a.modifiers.push({
                name: "day",
                src: "today",
                value: 0
            }), a.modifiers.push({
                name: "day",
                src: "tomorrow",
                value: 1
            }), a.modifiers.forEach(function(e) {
                var n = e.name;
                i(e.src, function(i) {
                    var o = a[n];
                    a.i[i] = e, t.push({
                        name: n,
                        src: i,
                        value: e.value
                    }), a[n] = o ? o + "|" + i : i;
                });
            }), a.day += "|" + ve(a.weekdays), a.modifiers = t;
        }(), a.monthSuffix && (a.month = s(1, 2), a.months = "1 2 3 4 5 6 7 8 9 10 11 12".split(" ").map(function(t) {
            return t + a.monthSuffix;
        })), a.full_month = s(1, 2) + "|" + ve(a.months), a.timeSuffixes.length > 0 && a.addFormat(ze(a), !1, oi), 
        a.addFormat("{day}", !0), a.addFormat("{month}" + (a.monthSuffix || "")), a.addFormat("{year}" + (a.yearSuffix || "")), 
        a.timeParse.forEach(function(t) {
            a.addFormat(t, !0);
        }), a.dateParse.forEach(function(t) {
            a.addFormat(t);
        }), ui[t] = a;
    }
    function me(t, e, n, i) {
        t.g.unshift({
            r: i,
            locale: t,
            q: rn("^" + e + "$", "i"),
            to: n
        });
    }
    function ye(t) {
        return t.slice(0, 1).toUpperCase() + t.slice(1);
    }
    function ve(t) {
        return t.filter(function(t) {
            return !!t;
        }).join("|");
    }
    function Ce() {
        var t = an.SugarNewDate;
        return t ? t() : new an();
    }
    function we(t, e) {
        var n;
        return p(t[0]) ? t : Pn(t[0]) && !Pn(t[1]) ? [ t[0] ] : bn(t[0]) && e ? [ Pe(t[0]), t[1] ] : (n = {}, 
        ni.forEach(function(e, i) {
            n[e.name] = t[i];
        }), [ n ]);
    }
    function Pe(t) {
        var e, n = {};
        return (t = t.match(/^(\d+)?\s?(\w+?)s?$/i)) && (f(e) && (e = parseInt(t[1]) || 1), 
        n[t[2].toLowerCase()] = e), n;
    }
    function be(t, e, n) {
        var i;
        for (f(n) && (n = ii.length), e = e || 0; n > e && (i = ii[e], !1 !== t(i.name, i, e)); e++) ;
    }
    function Se(t, e) {
        var n, i, o = {};
        return e.forEach(function(e, s) {
            n = t[s + 1], f(n) || "" === n || ("year" === e && (o.t = n.replace(/'/, "")), i = parseFloat(n.replace(/'/, "").replace(/,/, ".")), 
            o[e] = isNaN(i) ? n.toLowerCase() : i);
        }), o;
    }
    function xe(t) {
        return t = t.trim().replace(/^just (?=now)|\.+$/i, ""), Ie(t);
    }
    function Ie(t) {
        return t.replace(ei, function(t, e, n) {
            var i, o, s = 0, r = 1;
            return e ? t : (n.split("").reverse().forEach(function(t) {
                t = ri[t];
                var e = t > 9;
                e ? (i && (s += r), r *= t / (o || 1), o = t) : (!1 === i && (r *= 10), s += r * t), 
                i = e;
            }), i && (s += r), s);
        });
    }
    function Ae(t, e, n, i) {
        function o(t) {
            f.push(t);
        }
        function s() {
            f.forEach(function(t) {
                t.call();
            });
        }
        function r() {
            var t = l.getWeekday();
            l.setWeekday(7 * (m.num - 1) + (t > w ? w + 7 : w));
        }
        function a() {
            var t = g.i[m.edge];
            be(function(t) {
                return d(m[t]) ? (y = t, !1) : void 0;
            }, 4), "year" === y ? m.e = "month" : ("month" === y || "week" === y) && (m.e = "day"), 
            l[(0 > t.value ? "endOf" : "beginningOf") + ye(y)](), -2 === t.value && l.reset();
        }
        function h() {
            var t;
            be(function(e, n, i) {
                if ("day" === e && (e = "date"), d(m[e])) {
                    if (i >= C) return l.setTime(0/0), !1;
                    t = t || {}, t[e] = m[e], delete m[e];
                }
            }), t && o(function() {
                l.set(t, !0);
            });
        }
        var l, c, u, f, g, m, y, C, w, P, b;
        return l = Ce(), f = [], l.utc(i), xn(t) ? l.utc(t.isUTC()).setTime(t.getTime()) : Pn(t) ? l.setTime(t) : p(t) ? (l.set(t, !0), 
        m = t) : bn(t) && (u = ge(e), t = xe(t), u && v(u.o ? [ u.o ].concat(u.g) : u.g, function(n, i) {
            var s = t.match(i.q);
            return s ? (g = i.locale, m = Se(s, i.to), g.o = i, m.utc && l.utc(), m.timestamp ? (m = m.timestamp, 
            !1) : (i.r && !bn(m.month) && (bn(m.date) || ue(u, e)) && (b = m.month, m.month = m.date, 
            m.date = b), m.year && 2 === m.t.length && (m.year = 100 * Mn(N(Ce(), "FullYear") / 100) - 100 * Mn(m.year / 100) + m.year), 
            m.month && (m.month = g.getMonth(m.month), m.shift && !m.unit && (m.unit = g.units[7])), 
            m.weekday && m.date ? delete m.weekday : m.weekday && (m.weekday = g.getWeekday(m.weekday), 
            m.shift && !m.unit && (m.unit = g.units[5])), m.day && (b = g.i[m.day]) ? (m.day = b.value, 
            l.reset(), c = !0) : m.day && (w = g.getWeekday(m.day)) > -1 && (delete m.day, m.num && m.month ? (o(r), 
            m.day = 1) : m.weekday = w), m.date && !Pn(m.date) && (m.date = de(g, m.date)), 
            m.ampm && m.ampm === g.ampm[1] && 12 > m.hour ? m.hour += 12 : m.ampm === g.ampm[0] && 12 === m.hour && (m.hour = 0), 
            ("offset_hours" in m || "offset_minutes" in m) && (l.utc(), m.offset_minutes = m.offset_minutes || 0, 
            m.offset_minutes += 60 * m.offset_hours, "-" === m.offset_sign && (m.offset_minutes *= -1), 
            m.minute -= m.offset_minutes), m.unit && (c = !0, P = fe(g, m.num), C = g.units.indexOf(m.unit) % 8, 
            y = Qn.units[C], h(), m.shift && (P *= (b = g.i[m.shift]) ? b.value : 0), m.sign && (b = g.i[m.sign]) && (P *= b.value), 
            d(m.weekday) && (l.set({
                weekday: m.weekday
            }, !0), delete m.weekday), m[y] = (m[y] || 0) + P), m.edge && o(a), "-" === m.year_sign && (m.year *= -1), 
            be(function(t, e, n) {
                e = m[t];
                var i = e % 1;
                i && (m[ii[n - 1].name] = Mn(i * ("second" === t ? 1e3 : 60)), m[t] = Nn(e));
            }, 1, 4), !1)) : void 0;
        }), m ? c ? l.advance(m) : (l._utc && l.reset(), De(l, m, !0, !1, n)) : ("now" !== t && (l = new an(t)), 
        i && l.addMinutes(-l.getTimezoneOffset())), s(), l.utc(!1)), {
            c: l,
            set: m
        };
    }
    function Te(t) {
        var e, n = kn(t), i = n, o = 0;
        return be(function(t, s, r) {
            e = Nn(S(n / s.b(), 1)), e >= 1 && (i = e, o = r);
        }, 1), [ i, o, t ];
    }
    function ke(t) {
        var e = Te(t.millisecondsFromNow());
        return (6 === e[1] || 5 === e[1] && 4 === e[0] && t.daysFromNow() >= Ce().daysInMonth()) && (e[0] = kn(t.monthsFromNow()), 
        e[1] = 6), e;
    }
    function Re(t, e, n) {
        function i(t, n) {
            var i = N(t, "Month");
            return ge(n).months[i + 12 * e];
        }
        Oe(t, i, n), Oe(ye(t), i, n, 1);
    }
    function Oe(t, e, n, i) {
        li[t] = function(t, o) {
            var s = e(t, o);
            return n && (s = s.slice(0, n)), i && (s = s.slice(0, i).toUpperCase() + s.slice(i)), 
            s;
        };
    }
    function Ne(t, e, n) {
        li[t] = e, li[t + t] = function(t, n) {
            return T(e(t, n), 2);
        }, n && (li[t + t + t] = function(t, n) {
            return T(e(t, n), 3);
        }, li[t + t + t + t] = function(t, n) {
            return T(e(t, n), 4);
        });
    }
    function Me(t) {
        var e = t.match(/(\{\w+\})|[^{}]+/g);
        hi[t] = e.map(function(t) {
            return t.replace(/\{(\w+)\}/, function(e, n) {
                return t = li[n] || n, n;
            }), t;
        });
    }
    function $e(t, e, n, i) {
        var o;
        if (!t.isValid()) return "Invalid Date";
        if (Date[e] ? e = Date[e] : An(e) && (o = ke(t), e = e.apply(t, o.concat(ge(i)))), 
        !e && n) return o = o || ke(t), 0 === o[1] && (o[1] = 1, o[0] = 1), t = ge(i), ce(t, o, o[2] > 0 ? "future" : "past");
        e = e || "long", ("short" === e || "long" === e || "full" === e) && (e = ge(i)[e]), 
        hi[e] || Me(e);
        var s, r;
        for (o = "", e = hi[e], s = 0, n = e.length; n > s; s++) r = e[s], o += An(r) ? r(t, i) : r;
        return o;
    }
    function Be(t, e, n, i, o) {
        var s, r, a, h = 0, l = 0, c = 0;
        return s = Ae(e, n, null, o), i > 0 && (l = c = i, r = !0), s.c.isValid() ? (s.set && s.set.e && (ci.forEach(function(e) {
            e.name === s.set.e && (h = e.b(s.c, t - s.c) - 1);
        }), e = ye(s.set.e), (s.set.edge || s.set.shift) && s.c["beginningOf" + e](), "month" === s.set.e && (a = s.c.clone()["endOf" + e]().getTime()), 
        !r && s.set.sign && "millisecond" != s.set.e && (l = 50, c = -50)), r = t.getTime(), 
        e = s.c.getTime(), a = Le(t, e, a || e + h), r >= e - l && a + c >= r) : !1;
    }
    function Le(t, e, n) {
        return e = new an(e), t = new an(n).utc(t.isUTC()), 23 !== N(t, "Hours") && (e = e.getTimezoneOffset(), 
        t = t.getTimezoneOffset(), e !== t && (n += (t - e).minutes())), n;
    }
    function De(t, e, n, i, o) {
        function s(t) {
            return d(e[t]) ? e[t] : e[t + "s"];
        }
        function r(t) {
            return d(s(t));
        }
        var a;
        if (Pn(e) && i) e = {
            milliseconds: e
        }; else if (Pn(e)) return t.setTime(e), t;
        d(e.date) && (e.day = e.date), be(function(i, o, s) {
            var h = "day" === i;
            return r(i) || h && r("weekday") ? (e.e = i, a = +s, !1) : (!n || "week" === i || h && r("week") || M(t, o.method, h ? 1 : 0), 
            void 0);
        }), ci.forEach(function(n) {
            var o = n.name;
            n = n.method;
            var a;
            a = s(o), f(a) || (i ? ("week" === o && (a = (e.day || 0) + 7 * a, n = "Date"), 
            a = a * i + N(t, n)) : "month" === o && r("day") && M(t, "Date", 15), M(t, n, a), 
            i && "month" === o && (o = a, 0 > o && (o = o % 12 + 12), o % 12 != N(t, "Month") && M(t, "Date", 0)));
        }), i || r("day") || !r("weekday") || t.setWeekday(s("weekday"));
        var h;
        t: {
            switch (o) {
              case -1:
                h = t > Ce();
                break t;

              case 1:
                h = Ce() > t;
                break t;
            }
            h = void 0;
        }
        return h && be(function(e, n) {
            return !(n.k || "week" === e && r("weekday")) || r(e) || "day" === e && r("weekday") ? void 0 : (t[n.j](o), 
            !1);
        }, a + 1), t;
    }
    function ze(t, e) {
        var n, i = si, o = {
            h: 0,
            m: 1,
            s: 2
        };
        return t = t || Qn, i.replace(/{([a-z])}/g, function(i, s) {
            var r = [], a = "h" === s, h = a && !e;
            return "t" === s ? t.ampm.join("|") : (a && r.push(":"), (n = t.timeSuffixes[o[s]]) && r.push(n + "\\s*"), 
            0 === r.length ? "" : "(?:" + r.join("|") + ")" + (h ? "" : "?"));
        });
    }
    function He(t, e, n) {
        var i, o;
        return Pn(t[1]) ? i = we(t)[0] : (i = t[0], o = t[1]), Ae(i, o, e, n).c;
    }
    function Ee(t, e) {
        function n() {
            return Mn(this * e);
        }
        function i() {
            return He(arguments)[t.j](this);
        }
        function o() {
            return He(arguments)[t.j](-this);
        }
        var s = t.name, r = {};
        r[s] = n, r[s + "s"] = n, r[s + "Before"] = o, r[s + "sBefore"] = o, r[s + "Ago"] = o, 
        r[s + "sAgo"] = o, r[s + "After"] = i, r[s + "sAfter"] = i, r[s + "FromNow"] = i, 
        r[s + "sFromNow"] = i, ln.extend(r);
    }
    function Fe(t, e) {
        this.start = _e(t), this.end = _e(e);
    }
    function _e(t) {
        return xn(t) ? new an(t.getTime()) : null == t ? t : xn(t) ? t.getTime() : t.valueOf();
    }
    function Ve(t) {
        return t = null == t ? t : xn(t) ? t.getTime() : t.valueOf(), !!t || 0 === t;
    }
    function Ue(t, e) {
        var n, i, o, s;
        return Pn(e) ? new an(t.getTime() + e) : (n = e[0], i = e[1], o = N(t, i), s = new an(t.getTime()), 
        M(s, i, o + n), s);
    }
    function je(t, e) {
        return hn.fromCharCode(t.charCodeAt(0) + e);
    }
    function Ke(t, e) {
        return t + e;
    }
    function We(t, e, n, i, o) {
        1/0 !== e && (t.timers || (t.timers = []), Pn(e) || (e = 1), t.n = !1, t.timers.push(setTimeout(function() {
            t.n || n.apply(i, o || []);
        }, e)));
    }
    function qe(t, e, n, i, o, s) {
        var r = t.toFixed(20), a = r.search(/\./), r = r.search(/[1-9]/), a = a - r;
        return a > 0 && (a -= 1), o = Bn($n(Nn(a / 3), !1 === o ? n.length : o), -i), i = n.charAt(o + i - 1), 
        -9 > a && (o = -3, e = kn(a) - 9, i = n.slice(0, 1)), n = s ? Rn(2, 10 * o) : Rn(10, 3 * o), 
        S(t / n, e || 0).format() + i.trim();
    }
    function Ye(t, e, n, i) {
        var o, s, r;
        (s = e.match(/^(.+?)(\[.*\])$/)) ? (r = s[1], e = s[2].replace(/^\[|\]$/g, "").split("]["), 
        e.forEach(function(e) {
            o = !e || e.match(/^\d+$/), !r && Sn(t) && (r = t.length), g(t, r) || (t[r] = o ? [] : {}), 
            t = t[r], r = e;
        }), !r && o && (r = "" + t.length), Ye(t, r, n, i)) : t[e] = i && "true" === n ? !0 : i && "false" === n ? !1 : n;
    }
    function Ze(t, e) {
        var n;
        return Sn(e) || p(e) && e.toString === dn ? (n = [], v(e, function(e, i) {
            t && (e = t + "[" + e + "]"), n.push(Ze(e, i));
        }), n.join("&")) : t ? Ge(t) + "=" + (xn(e) ? e.getTime() : Ge(e)) : "";
    }
    function Ge(t) {
        return t || !1 === t || 0 === t ? encodeURIComponent(t).replace(/%20/g, "+") : "";
    }
    function Xe(t, e, n) {
        var i, o = t instanceof b ? new b() : {};
        return v(t, function(t, s) {
            i = !1, c(e, function(e) {
                (In(e) ? e.test(t) : p(e) ? e[t] === s : t === hn(e)) && (i = !0);
            }, 1), i === n && (o[t] = s);
        }), o;
    }
    function Je(t) {
        if (t = +t, 0 > t || 1/0 === t) throw new RangeError("Invalid number");
        return t;
    }
    function Qe(t, e) {
        return I(d(e) ? e : " ", t);
    }
    function tn(t, e, n, i, o) {
        var s;
        if (e >= t.length) return "" + t;
        switch (i = f(i) ? "..." : i, n) {
          case "left":
            return t = o ? en(t, e, !0) : t.slice(t.length - e), i + t;

          case "middle":
            return n = On(e / 2), s = Nn(e / 2), e = o ? en(t, n) : t.slice(0, n), t = o ? en(t, s, !0) : t.slice(t.length - s), 
            e + i + t;

          default:
            return e = o ? en(t, e) : t.slice(0, e), e + i;
        }
    }
    function en(t, e, n) {
        if (n) return en(t.reverse(), e).reverse();
        n = rn("(?=[" + x() + "])");
        var i = 0;
        return t.split(n).filter(function(t) {
            return i += t.length, e >= i;
        }).join("");
    }
    function nn(t, e, n) {
        return bn(e) && (e = t.indexOf(e), -1 === e && (e = n ? t.length : 0)), e;
    }
    var on = Object, sn = Array, rn = RegExp, an = Date, hn = String, ln = Number, cn = Math, un = "undefined" != typeof global ? global : this, dn = on.prototype.toString, fn = on.prototype.hasOwnProperty, gn = on.defineProperty && on.defineProperties, pn = "function" == typeof rn(), mn = !("0" in new hn("a")), yn = {}, vn = /^\[object Date|Array|String|Number|RegExp|Boolean|Arguments\]$/, Cn = "Boolean Number String Array Date RegExp Function".split(" "), wn = n("boolean", Cn[0]), Pn = n("number", Cn[1]), bn = n("string", Cn[2]), Sn = e(Cn[3]), xn = e(Cn[4]), In = e(Cn[5]), An = e(Cn[6]);
    b.prototype.constructor = on;
    var Tn, kn = cn.abs, Rn = cn.pow, On = cn.ceil, Nn = cn.floor, Mn = cn.round, $n = cn.min, Bn = cn.max, Ln = 48, Dn = 57, zn = 65296, Hn = 65305, En = ".", Fn = "", _n = {};
    i(on), v(Cn, function(t, e) {
        i(un[e]);
    });
    var Vn, Un;
    for (Un = 0; 9 >= Un; Un++) Vn = hn.fromCharCode(Un + zn), Fn += Vn, _n[Vn] = hn.fromCharCode(Un + Ln);
    _n[","] = "", _n["\uff0e"] = En, _n[En] = En, Tn = rn("[" + Fn + "\uff0e," + En + "]", "g"), 
    o(on, !1, !1, {
        keys: function(t) {
            var e = [];
            if (!p(t) && !In(t) && !An(t)) throw new TypeError("Object required");
            return v(t, function(t) {
                e.push(t);
            }), e;
        }
    }), o(sn, !1, !1, {
        isArray: function(t) {
            return Sn(t);
        }
    }), o(sn, !0, !1, {
        every: function(t, e) {
            var n = this.length, i = 0;
            for (_(arguments); n > i; ) {
                if (i in this && !t.call(e, this[i], i, this)) return !1;
                i++;
            }
            return !0;
        },
        some: function(t, e) {
            var n = this.length, i = 0;
            for (_(arguments); n > i; ) {
                if (i in this && t.call(e, this[i], i, this)) return !0;
                i++;
            }
            return !1;
        },
        map: function(t, e) {
            e = arguments[1];
            var n = this.length, i = 0, o = Array(n);
            for (_(arguments); n > i; ) i in this && (o[i] = t.call(e, this[i], i, this)), i++;
            return o;
        },
        filter: function(t) {
            var e = arguments[1], n = this.length, i = 0, o = [];
            for (_(arguments); n > i; ) i in this && t.call(e, this[i], i, this) && o.push(this[i]), 
            i++;
            return o;
        },
        indexOf: function(t, e) {
            return bn(this) ? this.indexOf(t, e) : E(this, t, e, 1);
        },
        lastIndexOf: function(t, e) {
            return bn(this) ? this.lastIndexOf(t, e) : E(this, t, e, -1);
        },
        forEach: function(t, e) {
            var n = this.length, i = 0;
            for (u(t); n > i; ) i in this && t.call(e, this[i], i, this), i++;
        },
        reduce: function(t, e) {
            return F(this, t, e);
        },
        reduceRight: function(t, e) {
            return F(this, t, e, !0);
        }
    }), o(Function, !0, !1, {
        bind: function(t) {
            var e, n = this, i = l(arguments, null, 1);
            if (!An(this)) throw new TypeError("Function.prototype.bind called on a non-function");
            return e = function() {
                return n.apply(n.prototype && this instanceof n ? this : t, i.concat(l(arguments)));
            }, e.prototype = this.prototype, e;
        }
    }), o(an, !1, !1, {
        now: function() {
            return new an().getTime();
        }
    }), function() {
        var t = x().match(/^\s+$/);
        try {
            hn.prototype.trim.call([ 1 ]);
        } catch (e) {
            t = !1;
        }
        o(hn, !0, !t, {
            trim: function() {
                return ("" + this).trimLeft().trimRight();
            },
            trimLeft: function() {
                return this.replace(rn("^[" + x() + "]+"), "");
            },
            trimRight: function() {
                return this.replace(rn("[" + x() + "]+$"), "");
            }
        });
    }(), function() {
        var t = new an(an.UTC(1999, 11, 31)), t = t.toISOString && "1999-12-31T00:00:00.000Z" === t.toISOString();
        s(an, !0, !t, "toISOString,toJSON", function(t, e) {
            t[e] = function() {
                return T(this.getUTCFullYear(), 4) + "-" + T(this.getUTCMonth() + 1, 2) + "-" + T(this.getUTCDate(), 2) + "T" + T(this.getUTCHours(), 2) + ":" + T(this.getUTCMinutes(), 2) + ":" + T(this.getUTCSeconds(), 2) + "." + T(this.getUTCMilliseconds(), 3) + "Z";
            };
        });
    }();
    var jn = "AlphanumericSortOrder", Kn = "AlphanumericSortIgnore", Wn = "AlphanumericSortIgnoreCase", qn = "AlphanumericSortEquivalents", Yn = "AlphanumericSortNatural";
    o(sn, !1, !0, {
        create: function() {
            var t = [];
            return l(arguments, function(e) {
                (!m(e) && "length" in e && ("[object Arguments]" === dn.call(e) || e.callee) || !m(e) && "length" in e && !bn(e) && !y(e)) && (e = sn.prototype.slice.call(e, 0)), 
                t = t.concat(e);
            }), t;
        }
    }), o(sn, !0, !1, {
        find: function(t, e) {
            return u(t), J(this, t, 0, !1, !1, e);
        },
        findIndex: function(t, e) {
            var n;
            return u(t), n = J(this, t, 0, !1, !0, e), f(n) ? -1 : n;
        }
    }), o(sn, !0, !0, {
        findFrom: function(t, e, n) {
            return J(this, t, e, n);
        },
        findIndexFrom: function(t, e, n) {
            return e = J(this, t, e, n, !0), f(e) ? -1 : e;
        },
        findAll: function(t, e, n) {
            var i, o = [];
            return this.length > 0 && (i = Y(t), G(this, function(t, e, n) {
                i(t, e, n) && o.push(t);
            }, e, n)), o;
        },
        count: function(t) {
            return f(t) ? this.length : this.findAll(t).length;
        },
        removeAt: function(t, e) {
            return f(t) ? this : (f(e) && (e = t), this.splice(t, e - t + 1), this);
        },
        include: function(t, e) {
            return this.clone().add(t, e);
        },
        exclude: function() {
            return sn.prototype.remove.apply(this.clone(), arguments);
        },
        clone: function() {
            return w([], this);
        },
        unique: function(t) {
            return Q(this, t);
        },
        flatten: function(t) {
            return ee(this, t);
        },
        union: function() {
            return Q(this.concat(ne(arguments)));
        },
        intersect: function() {
            return te(this, ne(arguments), !1);
        },
        subtract: function() {
            return te(this, ne(arguments), !0);
        },
        at: function() {
            return D(this, arguments);
        },
        first: function(t) {
            return f(t) ? this[0] : (0 > t && (t = 0), this.slice(0, t));
        },
        last: function(t) {
            return f(t) ? this[this.length - 1] : this.slice(0 > this.length - t ? 0 : this.length - t);
        },
        from: function(t) {
            return this.slice(t);
        },
        to: function(t) {
            return f(t) && (t = this.length), this.slice(0, t);
        },
        min: function(t, e) {
            return se(this, t, "min", e);
        },
        max: function(t, e) {
            return se(this, t, "max", e);
        },
        least: function(t, e) {
            return se(this.groupBy.apply(this, [ t ]), "length", "min", e);
        },
        most: function(t, e) {
            return se(this.groupBy.apply(this, [ t ]), "length", "max", e);
        },
        sum: function(t) {
            return t = t ? this.map(t) : this, t.length > 0 ? t.reduce(function(t, e) {
                return t + e;
            }) : 0;
        },
        average: function(t) {
            return t = t ? this.map(t) : this, t.length > 0 ? t.sum() / t.length : 0;
        },
        inGroups: function(t, e) {
            var n = arguments.length > 1, i = this, o = [], s = On(this.length / t);
            return C(t, function(t) {
                t *= s;
                var r = i.slice(t, t + s);
                n && s > r.length && C(s - r.length, function() {
                    r = r.add(e);
                }), o.push(r);
            }), o;
        },
        inGroupsOf: function(t, e) {
            var n, i = [], o = this.length, s = this;
            return 0 === o || 0 === t ? s : (f(t) && (t = 1), f(e) && (e = null), C(On(o / t), function(o) {
                for (n = s.slice(t * o, t * o + t); t > n.length; ) n.push(e);
                i.push(n);
            }), i);
        },
        isEmpty: function() {
            return 0 == this.compact().length;
        },
        sortBy: function(t, e) {
            var n = this.clone();
            return n.sort(function(i, o) {
                var s, r;
                return s = Z(i, t, n, [ i ]), r = Z(o, t, n, [ o ]), (bn(s) && bn(r) ? re(s, r) : r > s ? -1 : s > r ? 1 : 0) * (e ? -1 : 1);
            }), n;
        },
        randomize: function() {
            for (var t, e, n = this.concat(), i = n.length; i; ) t = 0 | cn.random() * i, e = n[--i], 
            n[i] = n[t], n[t] = e;
            return n;
        },
        zip: function() {
            var t = l(arguments);
            return this.map(function(e, n) {
                return [ e ].concat(t.map(function(t) {
                    return n in t ? t[n] : null;
                }));
            });
        },
        sample: function(t) {
            var e = this.randomize();
            return arguments.length > 0 ? e.slice(0, t) : e[0];
        },
        each: function(t, e, n) {
            return G(this, t, e, n), this;
        },
        add: function(t, e) {
            return (!Pn(ln(e)) || isNaN(e)) && (e = this.length), sn.prototype.splice.apply(this, [ e, 0 ].concat(t)), 
            this;
        },
        remove: function() {
            var t = this;
            return l(arguments, function(e) {
                var n = 0;
                for (e = Y(e); t.length > n; ) e(t[n], n, t) ? t.splice(n, 1) : n++;
            }), t;
        },
        compact: function(t) {
            var e = [];
            return G(this, function(n) {
                Sn(n) ? e.push(n.compact()) : t && n ? e.push(n) : t || null == n || n.valueOf() !== n.valueOf() || e.push(n);
            }), e;
        },
        groupBy: function(t, e) {
            var n, i = this, o = {};
            return G(i, function(e, s) {
                n = Z(e, t, i, [ e, s, i ]), o[n] || (o[n] = []), o[n].push(e);
            }), e && v(o, e), o;
        },
        none: function() {
            return !this.any.apply(this, arguments);
        }
    }), o(sn, !0, !0, {
        all: sn.prototype.every,
        any: sn.prototype.some,
        insert: sn.prototype.add
    }), o(on, !1, !0, {
        map: function(t, e) {
            var n, i, o = {};
            for (n in t) g(t, n) && (i = t[n], o[n] = Z(i, e, t, [ n, i, t ]));
            return o;
        },
        reduce: function(t) {
            var e = on.keys(P(t)).map(function(e) {
                return t[e];
            });
            return e.reduce.apply(e, l(arguments, null, 1));
        },
        each: function(t, e) {
            return u(e), v(t, e), t;
        },
        size: function(t) {
            return on.keys(P(t)).length;
        }
    });
    var Zn = "any all none count find findAll isEmpty".split(" "), Gn = "sum average min max least most".split(" "), Xn = [ "map", "reduce", "size" ], Jn = Zn.concat(Gn).concat(Xn);
    (function() {
        function t() {
            var t = arguments;
            return t.length > 0 && !An(t[0]);
        }
        var e = sn.prototype.map;
        s(sn, !0, t, "every,all,some,filter,any,none,find,findIndex", function(t, e) {
            var n = sn.prototype[e];
            t[e] = function(t) {
                var e = Y(t);
                return n.call(this, function(t, n) {
                    return e(t, n, this);
                });
            };
        }), o(sn, !0, t, {
            map: function(t) {
                return e.call(this, function(e, n) {
                    return Z(e, t, this, [ e, n, this ]);
                });
            }
        });
    })(), function() {
        sn[jn] = "A\u00c1\u00c0\u00c2\u00c3\u0104BC\u0106\u010c\u00c7D\u010e\u00d0E\u00c9\u00c8\u011a\u00ca\u00cb\u0118FG\u011eH\u0131I\u00cd\u00cc\u0130\u00ce\u00cfJKL\u0141MN\u0143\u0147\u00d1O\u00d3\u00d2\u00d4PQR\u0158S\u015a\u0160\u015eT\u0164U\u00da\u00d9\u016e\u00db\u00dcVWXY\u00ddZ\u0179\u017b\u017d\u00de\u00c6\u0152\u00d8\u00d5\u00c5\u00c4\u00d6".split("").map(function(t) {
            return t + t.toLowerCase();
        }).join("");
        var t = {};
        G("A\u00c1\u00c0\u00c2\u00c3\u00c4 C\u00c7 E\u00c9\u00c8\u00ca\u00cb I\u00cd\u00cc\u0130\u00ce\u00cf O\u00d3\u00d2\u00d4\u00d5\u00d6 S\u00df U\u00da\u00d9\u00db\u00dc".split(" "), function(e) {
            var n = e.charAt(0);
            G(e.slice(1).split(""), function(e) {
                t[e] = n, t[e.toLowerCase()] = n.toLowerCase();
            });
        }), sn[Yn] = !0, sn[Wn] = !0, sn[qn] = t;
    }(), he(Zn), he(Gn, !0), H(Xn, b), sn.AlphanumericSort = re;
    var Qn, ti, ei, ni, ii, oi = "ampm hour minute second ampm utc offset_sign offset_hours offset_minutes ampm".split(" "), si = "({t})?\\s*(\\d{1,2}(?:[,.]\\d+)?)(?:{h}([0-5]\\d(?:[,.]\\d+)?)?{m}(?::?([0-5]\\d(?:[,.]\\d+)?){s})?\\s*(?:({t})|(Z)|(?:([+-])(\\d{2,2})(?::?(\\d{2,2}))?)?)?|\\s*({t}))", ri = {}, ai = [], hi = {}, li = {
        yyyy: function(t) {
            return N(t, "FullYear");
        },
        yy: function(t) {
            return N(t, "FullYear") % 100;
        },
        ord: function(t) {
            return t = N(t, "Date"), t + k(t);
        },
        tz: function(t) {
            return t.getUTCOffset();
        },
        isotz: function(t) {
            return t.getUTCOffset(!0);
        },
        Z: function(t) {
            return t.getUTCOffset();
        },
        ZZ: function(t) {
            return t.getUTCOffset().replace(/(\d{2})$/, ":$1");
        }
    }, ci = [ {
        name: "year",
        method: "FullYear",
        k: !0,
        b: function(t) {
            return 864e5 * (365 + (t ? t.isLeapYear() ? 1 : 0 : .25));
        }
    }, {
        name: "month",
        error: .919,
        method: "Month",
        k: !0,
        b: function(t, e) {
            var n, i = 30.4375;
            return t && (n = t.daysInMonth(), n.days() >= e && (i = n)), 864e5 * i;
        }
    }, {
        name: "week",
        method: "ISOWeek",
        b: t(6048e5)
    }, {
        name: "day",
        error: .958,
        method: "Date",
        k: !0,
        b: t(864e5)
    }, {
        name: "hour",
        method: "Hours",
        b: t(36e5)
    }, {
        name: "minute",
        method: "Minutes",
        b: t(6e4)
    }, {
        name: "second",
        method: "Seconds",
        b: t(1e3)
    }, {
        name: "millisecond",
        method: "Milliseconds",
        b: t(1)
    } ], ui = {};
    le.prototype = {
        getMonth: function(t) {
            return Pn(t) ? t - 1 : this.months.indexOf(t) % 12;
        },
        getWeekday: function(t) {
            return this.weekdays.indexOf(t) % 7;
        },
        addFormat: function(t, e, n, i, o) {
            var s, r = n || [], a = this;
            t = t.replace(/\s+/g, "[,. ]*"), t = t.replace(/\{([^,]+?)\}/g, function(t, e) {
                var i, o, s, h = e.match(/\?$/);
                s = e.match(/^(\d+)\??$/);
                var l = e.match(/(\d)(?:-(\d))?/), c = e.replace(/[^a-z]+$/, "");
                return s ? i = a.tokens[s[1]] : a[c] ? i = a[c] : a[c + "s"] && (i = a[c + "s"], 
                l && (o = [], i.forEach(function(t, e) {
                    var n = e % (a.units ? 8 : i.length);
                    n >= l[1] && (l[2] || l[1]) >= n && o.push(t);
                }), i = o), i = ve(i)), s ? s = "(?:" + i + ")" : (n || r.push(c), s = "(" + i + ")"), 
                h && (s += "?"), s;
            }), e ? (e = ze(a, o), o = [ "t", "[\\s\\u3000]" ].concat(a.timeMarker), s = t.match(/\\d\{\d,\d\}\)+\??$/), 
            me(a, "(?:" + e + ")[,\\s\\u3000]+?" + t, oi.concat(r), i), me(a, t + "(?:[,\\s]*(?:" + o.join("|") + (s ? "+" : "*") + ")" + e + ")?", r.concat(oi), i)) : me(a, t, r, i);
        }
    }, o(an, !1, !0, {
        create: function() {
            return He(arguments);
        },
        past: function() {
            return He(arguments, -1);
        },
        future: function() {
            return He(arguments, 1);
        },
        addLocale: function(t, e) {
            return pe(t, e);
        },
        setLocale: function(t) {
            var e = ge(t, !1);
            return ti = e, t && t != e.code && (e.code = t), e;
        },
        getLocale: function(t) {
            return t ? ge(t, !1) : ti;
        },
        addFormat: function(t, e, n) {
            me(ge(n), t, e);
        }
    }), o(an, !0, !0, {
        set: function() {
            var t = we(arguments);
            return De(this, t[0], t[1]);
        },
        setWeekday: function(t) {
            return f(t) ? void 0 : M(this, "Date", N(this, "Date") + t - N(this, "Day"));
        },
        setISOWeek: function(t) {
            var e = N(this, "Day") || 7;
            return f(t) ? void 0 : (this.set({
                month: 0,
                date: 4
            }), this.set({
                weekday: 1
            }), t > 1 && this.addWeeks(t - 1), 1 !== e && this.advance({
                days: e - 1
            }), this.getTime());
        },
        getISOWeek: function() {
            var t;
            t = this.clone();
            var e = N(t, "Day") || 7;
            return t.addDays(4 - e).reset(), 1 + Nn(t.daysSince(t.clone().beginningOfYear()) / 7);
        },
        beginningOfISOWeek: function() {
            var t = this.getDay();
            return 0 === t ? t = -6 : 1 !== t && (t = 1), this.setWeekday(t), this.reset();
        },
        endOfISOWeek: function() {
            return 0 !== this.getDay() && this.setWeekday(7), this.endOfDay();
        },
        getUTCOffset: function(t) {
            var e = this._utc ? 0 : this.getTimezoneOffset(), n = !0 === t ? ":" : "";
            return !e && t ? "Z" : T(Nn(-e / 60), 2, !0) + n + T(kn(e % 60), 2);
        },
        utc: function(t) {
            return h(this, "_utc", !0 === t || 0 === arguments.length), this;
        },
        isUTC: function() {
            return !!this._utc || 0 === this.getTimezoneOffset();
        },
        advance: function() {
            var t = we(arguments, !0);
            return De(this, t[0], t[1], 1);
        },
        rewind: function() {
            var t = we(arguments, !0);
            return De(this, t[0], t[1], -1);
        },
        isValid: function() {
            return !isNaN(this.getTime());
        },
        isAfter: function(t, e) {
            return this.getTime() > an.create(t).getTime() - (e || 0);
        },
        isBefore: function(t, e) {
            return this.getTime() < an.create(t).getTime() + (e || 0);
        },
        isBetween: function(t, e, n) {
            var i = this.getTime();
            t = an.create(t).getTime();
            var o = an.create(e).getTime();
            return e = $n(t, o), t = Bn(t, o), n = n || 0, i > e - n && t + n > i;
        },
        isLeapYear: function() {
            var t = N(this, "FullYear");
            return 0 === t % 4 && 0 !== t % 100 || 0 === t % 400;
        },
        daysInMonth: function() {
            return 32 - N(new an(N(this, "FullYear"), N(this, "Month"), 32), "Date");
        },
        format: function(t, e) {
            return $e(this, t, !1, e);
        },
        relative: function(t, e) {
            return bn(t) && (e = t, t = null), $e(this, t, !0, e);
        },
        is: function(t, e, n) {
            var i, o;
            if (this.isValid()) {
                if (bn(t)) switch (t = t.trim().toLowerCase(), o = this.clone().utc(n), !0) {
                  case "future" === t:
                    return this.getTime() > Ce().getTime();

                  case "past" === t:
                    return this.getTime() < Ce().getTime();

                  case "weekday" === t:
                    return N(o, "Day") > 0 && 6 > N(o, "Day");

                  case "weekend" === t:
                    return 0 === N(o, "Day") || 6 === N(o, "Day");

                  case (i = Qn.weekdays.indexOf(t) % 7) > -1:
                    return N(o, "Day") === i;

                  case (i = Qn.months.indexOf(t) % 12) > -1:
                    return N(o, "Month") === i;
                }
                return Be(this, t, null, e, n);
            }
        },
        reset: function(t) {
            var e, n = {};
            return t = t || "hours", "date" === t && (t = "days"), e = ci.some(function(e) {
                return t === e.name || t === e.name + "s";
            }), n[t] = t.match(/^days?/) ? 1 : 0, e ? this.set(n, !0) : this;
        },
        clone: function() {
            var t = new an(this.getTime());
            return t.utc(!!this._utc), t;
        }
    }), o(an, !0, !0, {
        iso: function() {
            return this.toISOString();
        },
        getWeekday: an.prototype.getDay,
        getUTCWeekday: an.prototype.getUTCDay
    }), o(ln, !0, !0, {
        duration: function(t) {
            return t = ge(t), ce(t, Te(this), "duration");
        }
    }), Qn = ti = an.addLocale("en", {
        plural: !0,
        timeMarker: "at",
        ampm: "am,pm",
        months: "January,February,March,April,May,June,July,August,September,October,November,December",
        weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
        units: "millisecond:|s,second:|s,minute:|s,hour:|s,day:|s,week:|s,month:|s,year:|s",
        numbers: "one,two,three,four,five,six,seven,eight,nine,ten",
        articles: "a,an,the",
        tokens: "the,st|nd|rd|th,of",
        "short": "{Month} {d}, {yyyy}",
        "long": "{Month} {d}, {yyyy} {h}:{mm}{tt}",
        full: "{Weekday} {Month} {d}, {yyyy} {h}:{mm}:{ss}{tt}",
        past: "{num} {unit} {sign}",
        future: "{num} {unit} {sign}",
        duration: "{num} {unit}",
        modifiers: [ {
            name: "sign",
            src: "ago|before",
            value: -1
        }, {
            name: "sign",
            src: "from now|after|from|in|later",
            value: 1
        }, {
            name: "edge",
            src: "last day",
            value: -2
        }, {
            name: "edge",
            src: "end",
            value: -1
        }, {
            name: "edge",
            src: "first day|beginning",
            value: 1
        }, {
            name: "shift",
            src: "last",
            value: -1
        }, {
            name: "shift",
            src: "the|this",
            value: 0
        }, {
            name: "shift",
            src: "next",
            value: 1
        } ],
        dateParse: [ "{month} {year}", "{shift} {unit=5-7}", "{0?} {date}{1}", "{0?} {edge} of {shift?} {unit=4-7?}{month?}{year?}" ],
        timeParse: "{num} {unit} {sign};{sign} {num} {unit};{0} {num}{1} {day} of {month} {year?};{weekday?} {month} {date}{1?} {year?};{date} {month} {year};{date} {month};{shift} {weekday};{shift} week {weekday};{weekday} {2?} {shift} week;{num} {unit=4-5} {sign} {day};{0?} {date}{1} of {month};{0?}{month?} {date?}{1?} of {shift} {unit=6-7}".split(";")
    }), ii = ci.concat().reverse(), ni = ci.concat(), ni.splice(2, 1), s(an, !0, !0, ci, function(t, e, n) {
        function i(t) {
            t /= h;
            var n = t % 1, i = e.error || .999;
            return n && kn(n % 1) > i && (t = Mn(t)), 0 > t ? On(t) : Nn(t);
        }
        var o, s, r = e.name, a = ye(r), h = e.b();
        e.j = "add" + a + "s", o = function(t, e) {
            return i(this.getTime() - an.create(t, e).getTime());
        }, s = function(t, e) {
            return i(an.create(t, e).getTime() - this.getTime());
        }, t[r + "sAgo"] = s, t[r + "sUntil"] = s, t[r + "sSince"] = o, t[r + "sFromNow"] = o, 
        t[e.j] = function(t, e) {
            var n = {};
            return n[r] = t, this.advance(n, e);
        }, Ee(e, h), 3 > n && [ "Last", "This", "Next" ].forEach(function(e) {
            t["is" + e + a] = function() {
                return Be(this, e + " " + r, "en");
            };
        }), 4 > n && (t["beginningOf" + a] = function() {
            var t = {};
            switch (r) {
              case "year":
                t.year = N(this, "FullYear");
                break;

              case "month":
                t.month = N(this, "Month");
                break;

              case "day":
                t.day = N(this, "Date");
                break;

              case "week":
                t.weekday = 0;
            }
            return this.set(t, !0);
        }, t["endOf" + a] = function() {
            var t = {
                hours: 23,
                minutes: 59,
                seconds: 59,
                milliseconds: 999
            };
            switch (r) {
              case "year":
                t.month = 11, t.day = 31;
                break;

              case "month":
                t.day = this.daysInMonth();
                break;

              case "week":
                t.weekday = 6;
            }
            return this.set(t, !0);
        });
    }), Qn.addFormat("([+-])?(\\d{4,4})[-.]?{full_month}[-.]?(\\d{1,2})?", !0, [ "year_sign", "year", "month", "date" ], !1, !0), 
    Qn.addFormat("(\\d{1,2})[-.\\/]{full_month}(?:[-.\\/](\\d{2,4}))?", !0, [ "date", "month", "year" ], !0), 
    Qn.addFormat("{full_month}[-.](\\d{4,4})", !1, [ "month", "year" ]), Qn.addFormat("\\/Date\\((\\d+(?:[+-]\\d{4,4})?)\\)\\/", !1, [ "timestamp" ]), 
    Qn.addFormat(ze(Qn), !1, oi), ai = Qn.g.slice(0, 7).reverse(), Qn.g = Qn.g.slice(7).concat(ai), 
    Ne("f", function(t) {
        return N(t, "Milliseconds");
    }, !0), Ne("s", function(t) {
        return N(t, "Seconds");
    }), Ne("m", function(t) {
        return N(t, "Minutes");
    }), Ne("h", function(t) {
        return N(t, "Hours") % 12 || 12;
    }), Ne("H", function(t) {
        return N(t, "Hours");
    }), Ne("d", function(t) {
        return N(t, "Date");
    }), Ne("M", function(t) {
        return N(t, "Month") + 1;
    }), function() {
        function t(t, e) {
            var n = N(t, "Hours");
            return ge(e).ampm[Nn(n / 12)] || "";
        }
        Oe("t", t, 1), Oe("tt", t), Oe("T", t, 1, 1), Oe("TT", t, null, 2);
    }(), function() {
        function t(t, e) {
            var n = N(t, "Day");
            return ge(e).weekdays[n];
        }
        Oe("dow", t, 3), Oe("Dow", t, 3, 1), Oe("weekday", t), Oe("Weekday", t, null, 1);
    }(), Re("mon", 0, 3), Re("month", 0), Re("month2", 1), Re("month3", 2), li.ms = li.f, 
    li.milliseconds = li.f, li.seconds = li.s, li.minutes = li.m, li.hours = li.h, li["24hr"] = li.H, 
    li["12hr"] = li.h, li.date = li.d, li.day = li.d, li.year = li.yyyy, s(an, !0, !0, "short,long,full", function(t, e) {
        t[e] = function(t) {
            return $e(this, e, !1, t);
        };
    }), "\u3007\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341\u767e\u5343\u4e07".split("").forEach(function(t, e) {
        e > 9 && (e = Rn(10, e - 9)), ri[t] = e;
    }), w(ri, _n), ei = rn("([\u671f\u9031\u5468])?([\u3007\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341\u767e\u5343\u4e07" + Fn + "]+)(?!\u6628)", "g"), 
    function() {
        var t = Qn.weekdays.slice(0, 7), e = Qn.months.slice(0, 12);
        s(an, !0, !0, "today yesterday tomorrow weekday weekend future past".split(" ").concat(t).concat(e), function(t, e) {
            t["is" + ye(e)] = function(t) {
                return this.is(e, 0, t);
            };
        });
    }(), an.utc || (an.utc = {
        create: function() {
            return He(arguments, 0, !0);
        },
        past: function() {
            return He(arguments, -1, !0);
        },
        future: function() {
            return He(arguments, 1, !0);
        }
    }), o(an, !1, !0, {
        RFC1123: "{Dow}, {dd} {Mon} {yyyy} {HH}:{mm}:{ss} {tz}",
        RFC1036: "{Weekday}, {dd}-{Mon}-{yy} {HH}:{mm}:{ss} {tz}",
        ISO8601_DATE: "{yyyy}-{MM}-{dd}",
        ISO8601_DATETIME: "{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}.{fff}{isotz}"
    }), Fe.prototype.toString = function() {
        return this.isValid() ? this.start + ".." + this.end : "Invalid Range";
    }, o(Fe, !0, !0, {
        isValid: function() {
            return Ve(this.start) && Ve(this.end) && typeof this.start == typeof this.end;
        },
        span: function() {
            return this.isValid() ? kn((bn(this.end) ? this.end.charCodeAt(0) : this.end) - (bn(this.start) ? this.start.charCodeAt(0) : this.start)) + 1 : 0/0;
        },
        contains: function(t) {
            return null == t ? !1 : t.start && t.end ? t.start >= this.start && t.start <= this.end && t.end >= this.start && t.end <= this.end : t >= this.start && this.end >= t;
        },
        every: function(t, e) {
            var n, i = this.start, o = this.end, s = i > o, r = i, a = 0, h = [];
            for (An(t) && (e = t, t = null), t = t || 1, Pn(i) ? n = Ke : bn(i) ? n = je : xn(i) && (n = t, 
            Pn(n) ? t = n : (i = n.toLowerCase().match(/^(\d+)?\s?(\w+?)s?$/i), n = parseInt(i[1]) || 1, 
            i = i[2].slice(0, 1).toUpperCase() + i[2].slice(1), i.match(/hour|minute|second/i) ? i += "s" : "Year" === i ? i = "FullYear" : "Day" === i && (i = "Date"), 
            t = [ n, i ]), n = Ue), s && t > 0 && (t *= -1); s ? r >= o : o >= r; ) h.push(r), 
            e && e(r, a), r = n(r, t), a++;
            return h;
        },
        union: function(t) {
            return new Fe(this.start < t.start ? this.start : t.start, this.end > t.end ? this.end : t.end);
        },
        intersect: function(t) {
            return t.start > this.end || t.end < this.start ? new Fe(0/0, 0/0) : new Fe(this.start > t.start ? this.start : t.start, this.end < t.end ? this.end : t.end);
        },
        clone: function() {
            return new Fe(this.start, this.end);
        },
        clamp: function(t) {
            var e = this.start, n = this.end, i = e > n ? n : e, e = e > n ? e : n;
            return _e(i > t ? i : t > e ? e : t);
        }
    }), [ ln, hn, an ].forEach(function(t) {
        o(t, !1, !0, {
            range: function(e, n) {
                return t.create && (e = t.create(e), n = t.create(n)), new Fe(e, n);
            }
        });
    }), o(ln, !0, !0, {
        upto: function(t, e, n) {
            return ln.range(this, t).every(n, e);
        },
        clamp: function(t, e) {
            return new Fe(t, e).clamp(this);
        },
        cap: function(t) {
            return this.clamp(void 0, t);
        }
    }), o(ln, !0, !0, {
        downto: ln.prototype.upto
    }), o(sn, !1, function(t) {
        return t instanceof Fe;
    }, {
        create: function(t) {
            return t.every();
        }
    }), o(Function, !0, !0, {
        lazy: function(t, e, n) {
            function i() {
                return n - (c && e ? 1 : 0) > l.length && l.push([ this, arguments ]), c || (c = !0, 
                e ? o() : We(i, s, o)), a;
            }
            var o, s, r, a, h = this, l = [], c = !1;
            return t = t || 1, n = n || 1/0, s = On(t), r = Mn(s / t) || 1, o = function() {
                var t, e = l.length;
                if (0 != e) {
                    for (t = Bn(e - r, 0); e > t; ) a = Function.prototype.apply.apply(h, l.shift()), 
                    e--;
                    We(i, s, function() {
                        c = !1, o();
                    });
                }
            }, i;
        },
        throttle: function(t) {
            return this.lazy(t, !0, 1);
        },
        debounce: function(t) {
            function e() {
                e.cancel(), We(e, t, n, this, arguments);
            }
            var n = this;
            return e;
        },
        delay: function(t) {
            var e = l(arguments, null, 1);
            return We(this, t, this, this, e), this;
        },
        every: function(t) {
            function e() {
                n.apply(n, i), We(n, t, e);
            }
            var n = this, i = arguments, i = i.length > 1 ? l(i, null, 1) : [];
            return We(n, t, e), n;
        },
        cancel: function() {
            var t, e = this.timers;
            if (Sn(e)) for (;t = e.shift(); ) clearTimeout(t);
            return this.n = !0, this;
        },
        after: function(t) {
            var e = this, n = 0, i = [];
            if (Pn(t)) {
                if (0 === t) return e.call(), e;
            } else t = 1;
            return function() {
                var o;
                return i.push(l(arguments)), n++, n == t ? (o = e.call(this, i), n = 0, i = [], 
                o) : void 0;
            };
        },
        once: function() {
            return this.throttle(1/0, !0);
        },
        fill: function() {
            var t = this, e = l(arguments);
            return function() {
                var n = l(arguments);
                return e.forEach(function(t, e) {
                    (null != t || e >= n.length) && n.splice(e, 0, t);
                }), t.apply(this, n);
            };
        }
    }), o(ln, !1, !0, {
        random: function(t, e) {
            var n, i;
            return 1 == arguments.length && (e = t, t = 0), n = $n(t || 0, f(e) ? 1 : e), i = Bn(t || 0, f(e) ? 1 : e) + 1, 
            Nn(cn.random() * (i - n) + n);
        }
    }), o(ln, !0, !0, {
        log: function(t) {
            return cn.log(this) / (t ? cn.log(t) : 1);
        },
        abbr: function(t) {
            return qe(this, t, "kmbt", 0, 4);
        },
        metric: function(t, e) {
            return qe(this, t, "n\u03bcm kMGTPE", 4, f(e) ? 1 : e);
        },
        bytes: function(t, e) {
            return qe(this, t, "kMGTPE", 0, f(e) ? 4 : e, !0) + "B";
        },
        isInteger: function() {
            return 0 == this % 1;
        },
        isOdd: function() {
            return !isNaN(this) && !this.isMultipleOf(2);
        },
        isEven: function() {
            return this.isMultipleOf(2);
        },
        isMultipleOf: function(t) {
            return 0 === this % t;
        },
        format: function(t, e, n) {
            var i, o, s, r = "";
            for (f(e) && (e = ","), f(n) && (n = "."), i = (Pn(t) ? S(this, t || 0).toFixed(Bn(t, 0)) : "" + this).replace(/^-/, "").split("."), 
            o = i[0], s = i[1], i = o.length; i > 0; i -= 3) o.length > i && (r = e + r), r = o.slice(Bn(0, i - 3), i) + r;
            return s && (r += n + I("0", (t || 0) - s.length) + s), (0 > this ? "-" : "") + r;
        },
        hex: function(t) {
            return this.pad(t || 1, !1, 16);
        },
        times: function(t) {
            if (t) for (var e = 0; this > e; e++) t.call(this, e);
            return this.toNumber();
        },
        chr: function() {
            return hn.fromCharCode(this);
        },
        pad: function(t, e, n) {
            return T(this, t, e, n);
        },
        ordinalize: function() {
            var t = kn(this), t = parseInt(("" + t).slice(-2));
            return this + k(t);
        },
        toNumber: function() {
            return parseFloat(this, 10);
        }
    }), function() {
        function t(t) {
            return function(e) {
                return e ? S(this, e, t) : t(this);
            };
        }
        o(ln, !0, !0, {
            ceil: t(On),
            round: t(Mn),
            floor: t(Nn)
        }), s(ln, !0, !0, "abs,pow,sin,asin,cos,acos,tan,atan,exp,pow,sqrt", function(t, e) {
            t[e] = function(t, n) {
                return cn[e](this, t, n);
            };
        });
    }();
    var di = [ "isObject", "isNaN" ], fi = "keys values select reject each merge clone equal watch tap has toQueryString".split(" ");
    o(on, !1, !0, {
        watch: function(t, e, n) {
            if (gn) {
                var i = t[e];
                on.defineProperty(t, e, {
                    enumerable: !0,
                    configurable: !0,
                    get: function() {
                        return i;
                    },
                    set: function(o) {
                        i = n.call(t, e, i, o);
                    }
                });
            }
        }
    }), o(on, !1, function() {
        return arguments.length > 1;
    }, {
        keys: function(t, e) {
            var n = on.keys(t);
            return n.forEach(function(n) {
                e.call(t, n, t[n]);
            }), n;
        }
    }), o(on, !1, !0, {
        isObject: function(t) {
            return y(t);
        },
        isNaN: function(t) {
            return Pn(t) && t.valueOf() !== t.valueOf();
        },
        equal: function(t, e) {
            return B(t, e);
        },
        extended: function(t) {
            return new b(t);
        },
        merge: function(t, e, n, i) {
            var o, s, r, a, h, l, c;
            if (t && "string" != typeof e) for (o in e) if (g(e, o) && t) {
                if (a = e[o], h = t[o], l = d(h), s = p(a), r = p(h), c = l && !1 === i ? h : a, 
                l && An(i) && (c = i.call(e, o, h, a)), n && (s || r)) if (xn(a)) c = new an(a.getTime()); else {
                    if (!In(a)) {
                        r || (t[o] = sn.isArray(a) ? [] : {}), on.merge(t[o], a, n, i);
                        continue;
                    }
                    c = new rn(a.source, R(a));
                }
                t[o] = c;
            }
            return t;
        },
        values: function(t, e) {
            var n = [];
            return v(t, function(i, o) {
                n.push(o), e && e.call(t, o);
            }), n;
        },
        clone: function(t, e) {
            var n;
            if (!p(t)) return t;
            if (n = dn.call(t), xn(t, n) && t.clone) return t.clone();
            if (xn(t, n) || In(t, n)) return new t.constructor(t);
            if (t instanceof b) n = new b(); else if (Sn(t, n)) n = []; else {
                if (!y(t, n)) throw new TypeError("Clone must be a basic data type.");
                n = {};
            }
            return on.merge(n, t, e);
        },
        fromQueryString: function(t, e) {
            var n = on.extended();
            return t = t && t.toString ? "" + t : "", t.replace(/^.*?\?/, "").split("&").forEach(function(t) {
                t = t.split("="), 2 === t.length && Ye(n, t[0], decodeURIComponent(t[1]), e);
            }), n;
        },
        toQueryString: function(t, e) {
            return Ze(e, t);
        },
        tap: function(t, e) {
            var n = e;
            return An(e) || (n = function() {
                e && t[e]();
            }), n.call(t, t), t;
        },
        has: function(t, e) {
            return g(t, e);
        },
        select: function(t) {
            return Xe(t, arguments, !0);
        },
        reject: function(t) {
            return Xe(t, arguments, !1);
        }
    }), s(on, !1, !0, Cn, function(t, e) {
        var n = "is" + e;
        di.push(n), t[n] = yn[e];
    }), o(on, !1, function() {
        return 0 === arguments.length;
    }, {
        extend: function() {
            var t = di.concat(fi);
            Jn !== void 0 && (t = t.concat(Jn)), H(t, on);
        }
    }), H(fi, b), o(rn, !1, !0, {
        escape: function(t) {
            return O(t);
        }
    }), o(rn, !0, !0, {
        getFlags: function() {
            return R(this);
        },
        setFlags: function(t) {
            return rn(this.source, t);
        },
        addFlag: function(t) {
            return this.setFlags(R(this, t));
        },
        removeFlag: function(t) {
            return this.setFlags(R(this).replace(t, ""));
        }
    });
    var gi, pi;
    o(hn, !0, !1, {
        repeat: function(t) {
            return t = Je(t), I(this, t);
        }
    }), o(hn, !0, function(t) {
        return In(t) || arguments.length > 2;
    }, {
        startsWith: function(t) {
            var e = arguments, n = e[1], e = e[2], i = this;
            return n && (i = i.slice(n)), f(e) && (e = !0), n = In(t) ? t.source.replace("^", "") : O(t), 
            rn("^" + n, e ? "" : "i").test(i);
        },
        endsWith: function(t) {
            var e = arguments, n = e[1], e = e[2], i = this;
            return d(n) && (i = i.slice(0, n)), f(e) && (e = !0), n = In(t) ? t.source.replace("$", "") : O(t), 
            rn(n + "$", e ? "" : "i").test(i);
        }
    }), o(hn, !0, !0, {
        escapeRegExp: function() {
            return O(this);
        },
        escapeURL: function(t) {
            return t ? encodeURIComponent(this) : encodeURI(this);
        },
        unescapeURL: function(t) {
            return t ? decodeURI(this) : decodeURIComponent(this);
        },
        escapeHTML: function() {
            return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\//g, "&#x2f;");
        },
        unescapeHTML: function() {
            return this.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#x2f;/g, "/").replace(/&amp;/g, "&");
        },
        encodeBase64: function() {
            return gi(unescape(encodeURIComponent(this)));
        },
        decodeBase64: function() {
            return decodeURIComponent(escape(pi(this)));
        },
        each: function(t, e) {
            var n, i, o;
            if (An(t) ? (e = t, t = /[\s\S]/g) : t ? bn(t) ? t = rn(O(t), "gi") : In(t) && (t = rn(t.source, R(t, "g"))) : t = /[\s\S]/g, 
            n = this.match(t) || [], e) for (i = 0, o = n.length; o > i; i++) n[i] = e.call(this, n[i], i, n) || n[i];
            return n;
        },
        shift: function(t) {
            var e = "";
            return t = t || 0, this.codes(function(n) {
                e += hn.fromCharCode(n + t);
            }), e;
        },
        codes: function(t) {
            var e, n, i = [];
            for (e = 0, n = this.length; n > e; e++) {
                var o = this.charCodeAt(e);
                i.push(o), t && t.call(this, o, e);
            }
            return i;
        },
        chars: function(t) {
            return this.each(t);
        },
        words: function(t) {
            return this.trim().each(/\S+/g, t);
        },
        lines: function(t) {
            return this.trim().each(/^.*$/gm, t);
        },
        paragraphs: function(t) {
            var e = this.trim().split(/[\r\n]{2,}/);
            return e = e.map(function(e) {
                if (t) var n = t.call(e);
                return n ? n : e;
            });
        },
        isBlank: function() {
            return 0 === this.trim().length;
        },
        has: function(t) {
            return -1 !== this.search(In(t) ? t : O(t));
        },
        add: function(t, e) {
            return e = f(e) ? this.length : e, this.slice(0, e) + t + this.slice(e);
        },
        remove: function(t) {
            return this.replace(t, "");
        },
        reverse: function() {
            return this.split("").reverse().join("");
        },
        compact: function() {
            return this.trim().replace(/([\r\n\s\u3000])+/g, function(t, e) {
                return "\u3000" === e ? e : " ";
            });
        },
        at: function() {
            return D(this, arguments, !0);
        },
        from: function(t) {
            return this.slice(nn(this, t, !0));
        },
        to: function(t) {
            return f(t) && (t = this.length), this.slice(0, nn(this, t));
        },
        dasherize: function() {
            return this.underscore().replace(/_/g, "-");
        },
        underscore: function() {
            return this.replace(/[-\s]+/g, "_").replace(hn.Inflector && hn.Inflector.acronymRegExp, function(t, e) {
                return (e > 0 ? "_" : "") + t.toLowerCase();
            }).replace(/([A-Z\d]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").toLowerCase();
        },
        camelize: function(t) {
            return this.underscore().replace(/(^|_)([^_]+)/g, function(e, n, i, o) {
                return e = (e = hn.Inflector) && e.acronyms[i], e = bn(e) ? e : void 0, o = !1 !== t || o > 0, 
                e ? o ? e : e.toLowerCase() : o ? i.capitalize() : i;
            });
        },
        spacify: function() {
            return this.underscore().replace(/_/g, " ");
        },
        stripTags: function() {
            var t = this;
            return c(arguments.length > 0 ? arguments : [ "" ], function(e) {
                t = t.replace(rn("</?" + O(e) + "[^<>]*>", "gi"), "");
            }), t;
        },
        removeTags: function() {
            var t = this;
            return c(arguments.length > 0 ? arguments : [ "\\S+" ], function(e) {
                e = rn("<(" + e + ")[^<>]*(?:\\/>|>.*?<\\/\\1>)", "gi"), t = t.replace(e, "");
            }), t;
        },
        truncate: function(t, e, n) {
            return tn(this, t, e, n);
        },
        truncateOnWord: function(t, e, n) {
            return tn(this, t, e, n, !0);
        },
        pad: function(t, e) {
            var n, i;
            return t = Je(t), n = Bn(0, t - this.length) / 2, i = Nn(n), n = On(n), Qe(i, e) + this + Qe(n, e);
        },
        padLeft: function(t, e) {
            return t = Je(t), Qe(Bn(0, t - this.length), e) + this;
        },
        padRight: function(t, e) {
            return t = Je(t), this + Qe(Bn(0, t - this.length), e);
        },
        first: function(t) {
            return f(t) && (t = 1), this.substr(0, t);
        },
        last: function(t) {
            return f(t) && (t = 1), this.substr(0 > this.length - t ? 0 : this.length - t);
        },
        toNumber: function(t) {
            return A(this, t);
        },
        capitalize: function(t) {
            var e;
            return this.toLowerCase().replace(t ? RegExp("[^']", "g") : /^\S/, function(t) {
                var n, i = t.toUpperCase();
                return n = e ? t : i, e = i !== t, n;
            });
        },
        assign: function() {
            var t = {};
            return c(arguments, function(e, n) {
                p(e) ? w(t, e) : t[n + 1] = e;
            }), this.replace(/\{([^{]+?)\}/g, function(e, n) {
                return g(t, n) ? t[n] : e;
            });
        }
    }), o(hn, !0, !0, {
        insert: hn.prototype.add
    }), function(t) {
        if (un.btoa) gi = un.btoa, pi = un.atob; else {
            var e = /[^A-Za-z0-9\+\/\=]/g;
            gi = function(e) {
                var n, i, o, s, r, a, h = "", l = 0;
                do n = e.charCodeAt(l++), i = e.charCodeAt(l++), o = e.charCodeAt(l++), s = n >> 2, 
                n = (3 & n) << 4 | i >> 4, r = (15 & i) << 2 | o >> 6, a = 63 & o, isNaN(i) ? r = a = 64 : isNaN(o) && (a = 64), 
                h = h + t.charAt(s) + t.charAt(n) + t.charAt(r) + t.charAt(a); while (e.length > l);
                return h;
            }, pi = function(n) {
                var i, o, s, r, a, h = "", l = 0;
                if (n.match(e)) throw Error("String contains invalid base64 characters");
                n = n.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                do i = t.indexOf(n.charAt(l++)), o = t.indexOf(n.charAt(l++)), r = t.indexOf(n.charAt(l++)), 
                a = t.indexOf(n.charAt(l++)), i = i << 2 | o >> 4, o = (15 & o) << 4 | r >> 2, s = (3 & r) << 6 | a, 
                h += hn.fromCharCode(i), 64 != r && (h += hn.fromCharCode(o)), 64 != a && (h += hn.fromCharCode(s)); while (n.length > l);
                return h;
            };
        }
    }("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=");
})();

// source\pixastic.custom.js
var vintagePresets = {
    vintage: {
        curves: function() {
            for (var t = function(t) {
                return -12 * Math.sin(2 * t * Math.PI / 255) + t;
            }, e = function(t) {
                return -.2 * Math.pow(255 * t, .5) * Math.sin(Math.PI * (-195e-7 * Math.pow(t, 2) + .0125 * t)) + t;
            }, i = function(t) {
                return -.001045244139166791 * Math.pow(t, 2) + 1.2665372554875318 * t;
            }, n = function(t) {
                return .57254902 * t + 53;
            }, o = {
                r: [],
                g: [],
                b: []
            }, s = 0; 255 >= s; ++s) o.r[s] = e(t(s)), o.g[s] = i(t(s)), o.b[s] = n(t(s));
            return o;
        }(),
        screen: {
            r: 227,
            g: 12,
            b: 169,
            a: .15
        },
        vignette: .7,
        viewFinder: !1
    },
    sepia: {
        curves: function() {
            for (var t = function(t) {
                return -12 * Math.sin(2 * t * Math.PI / 255) + t;
            }, e = {
                r: [],
                g: [],
                b: []
            }, i = 0; 255 >= i; ++i) e.r[i] = t(i), e.g[i] = t(i), e.b[i] = t(i);
            return e;
        }(),
        sepia: !0
    },
    greenish: {
        curves: function() {
            for (var t = function(t) {
                return -12 * Math.sin(2 * t * Math.PI / 255) + t;
            }, e = {
                r: [],
                g: [],
                b: []
            }, i = 0; 255 >= i; ++i) e.r[i] = t(i), e.g[i] = t(i), e.b[i] = t(i);
            return e;
        }(),
        vignette: .6,
        lighten: .1,
        screen: {
            r: 255,
            g: 255,
            b: 0,
            a: .15
        }
    },
    reddish: {
        curves: function() {
            for (var t = function(t) {
                return -12 * Math.sin(2 * t * Math.PI / 255) + t;
            }, e = {
                r: [],
                g: [],
                b: []
            }, i = 0; 255 >= i; ++i) e.r[i] = t(i), e.g[i] = t(i), e.b[i] = t(i);
            return e;
        }(),
        vignette: .6,
        lighten: .1,
        screen: {
            r: 255,
            g: 0,
            b: 0,
            a: .15
        }
    }
}, VintageJS = function(t, e, i) {
    if (!1 == t instanceof HTMLImageElement) throw "The element (1st parameter) must be an instance of HTMLImageElement";
    var n, o, s, a, r, h, l, c, u, d = new Image(), f = new Image(), g = document.createElement("canvas"), p = g.getContext("2d"), m = {
        onStart: function() {},
        onStop: function() {},
        onError: function() {},
        mime: "image/jpeg"
    }, v = {
        curves: !1,
        screen: !1,
        desaturate: !1,
        vignette: !1,
        lighten: !1,
        noise: !1,
        viewFinder: !1,
        sepia: !1,
        brightness: !1,
        contrast: !1
    };
    d.onerror = m.onError, d.onload = function() {
        h = g.width = d.width, l = g.height = d.height, n();
    }, f.onerror = m.onError, f.onload = function() {
        p.clearRect(0, 0, h, l), p.drawImage(f, 0, 0, h, l), (window.vjsImageCache || (window.vjsImageCache = {}))[u] = p.getImageData(0, 0, h, l).data, 
        n();
    }, o = function(t) {
        m.onStart(), c = {};
        for (var e in v) c[e] = t[e] || v[e];
        a = [], c.viewFinder && a.push(c.viewFinder), d.src == r ? n() : d.src = r;
    }, n = function() {
        if (0 === a.length) return s();
        var t = a.pop();
        return u = [ h, l, t ].join("-"), window.vjsImageCache && window.vjsImageCache[u] ? n() : (f.src = t, 
        void 0);
    }, s = function() {
        var e, i, n;
        p.clearRect(0, 0, h, l), p.drawImage(d, 0, 0, h, l), (c.vignette || c.lighten) && (e = Math.sqrt(Math.pow(h / 2, 2) + Math.pow(l / 2, 2))), 
        c.vignette && (p.globalCompositeOperation = "source-over", i = p.createRadialGradient(h / 2, l / 2, 0, h / 2, l / 2, e), 
        i.addColorStop(0, "rgba(0,0,0,0)"), i.addColorStop(.5, "rgba(0,0,0,0)"), i.addColorStop(1, [ "rgba(0,0,0,", c.vignette, ")" ].join("")), 
        p.fillStyle = i, p.fillRect(0, 0, h, l)), c.lighten && (p.globalCompositeOperation = "lighter", 
        i = p.createRadialGradient(h / 2, l / 2, 0, h / 2, l / 2, e), i.addColorStop(0, [ "rgba(255,255,255,", c.lighten, ")" ].join("")), 
        i.addColorStop(.5, "rgba(255,255,255,0)"), i.addColorStop(1, "rgba(0,0,0,0)"), p.fillStyle = i, 
        p.fillRect(0, 0, h, l)), n = p.getImageData(0, 0, h, l);
        var o, s, a, r, u, f, g, v, y, C = n.data;
        c.contrast && (y = 259 * (c.contrast + 255) / (255 * (259 - c.contrast))), c.viewFinder && (v = window.vjsImageCache[[ h, l, c.viewFinder ].join("-")]);
        for (var w = h * l; w >= 0; --w) for (o = w << 2, c.curves && (C[o] = c.curves.r[C[o]], 
        C[o + 1] = c.curves.g[C[o + 1]], C[o + 2] = c.curves.b[C[o + 2]]), c.contrast && (C[o] = y * (C[o] - 128) + 128, 
        C[o + 1] = y * (C[o + 1] - 128) + 128, C[o + 2] = y * (C[o + 2] - 128) + 128), c.brightness && (C[o] += c.brightness, 
        C[o + 1] += c.brightness, C[o + 2] += c.brightness), c.screen && (C[o] = 255 - (255 - C[o]) * (255 - c.screen.r * c.screen.a) / 255, 
        C[o + 1] = 255 - (255 - C[o + 1]) * (255 - c.screen.g * c.screen.a) / 255, C[o + 2] = 255 - (255 - C[o + 2]) * (255 - c.screen.b * c.screen.a) / 255), 
        c.noise && (g = c.noise - Math.random() * c.noise / 2, C[o] += g, C[o + 1] += g, 
        C[o + 2] += g), c.viewFinder && (C[o] = C[o] * v[o] / 255, C[o + 1] = C[o + 1] * v[o + 1] / 255, 
        C[o + 2] = C[o + 2] * v[o + 2] / 255), c.sepia && (a = C[o], r = C[o + 1], u = C[o + 2], 
        C[o] = .393 * a + .769 * r + .189 * u, C[o + 1] = .349 * a + .686 * r + .168 * u, 
        C[o + 2] = .272 * a + .534 * r + .131 * u), c.desaturate && (f = (C[o] + C[o + 1] + C[o + 2]) / 3, 
        C[o] += (f - C[o]) * c.desaturate, C[o + 1] += (f - C[o + 1]) * c.desaturate, C[o + 2] += (f - C[o + 2]) * c.desaturate), 
        s = 2; s >= 0; --s) C[o + s] = ~~(C[o + s] > 255 ? 255 : 0 > C[o + s] ? 0 : C[o + s]);
        p.putImageData(n, 0, 0), t.src = p.canvas.toDataURL(m.mime), m.onStop();
    }, r = t.src, e = e || {};
    for (var y in m) m[y] = e[y] || m[y];
    return i && o(i), {
        apply: function() {
            r = t.src;
        },
        reset: function() {
            t.src = r;
        },
        vintage: o
    };
}, Pixastic = function() {
    function t(t, e, i) {
        t.addEventListener ? t.addEventListener(e, i, !1) : t.attachEvent && t.attachEvent("on" + e, i);
    }
    function e(e) {
        var i = !1, n = function() {
            i || (i = !0, e());
        };
        document.write('<script defer src="//:" id="__onload_ie_pixastic__"></script>');
        var o = document.getElementById("__onload_ie_pixastic__");
        o.onreadystatechange = function() {
            "complete" == o.readyState && (o.parentNode.removeChild(o), n());
        }, document.addEventListener && document.addEventListener("DOMContentLoaded", n, !1), 
        t(window, "load", n);
    }
    function n() {
        for (var t = o("pixastic", null, "img"), e = o("pixastic", null, "canvas"), i = t.concat(e), n = 0; i.length > n; n++) (function() {
            for (var t = i[n], e = [], o = t.className.split(" "), s = 0; o.length > s; s++) {
                var a = o[s];
                if ("pixastic-" == a.substring(0, 9)) {
                    var r = a.substring(9);
                    "" != r && e.push(r);
                }
            }
            if (e.length) if ("img" == t.tagName.toLowerCase()) {
                var h = new Image();
                if (h.src = t.src, h.complete) for (var l = 0; e.length > l; l++) {
                    var c = Pixastic.applyAction(t, t, e[l], null);
                    c && (t = c);
                } else h.onload = function() {
                    for (var i = 0; e.length > i; i++) {
                        var n = Pixastic.applyAction(t, t, e[i], null);
                        n && (t = n);
                    }
                };
            } else setTimeout(function() {
                for (var i = 0; e.length > i; i++) {
                    var n = Pixastic.applyAction(t, t, e[i], null);
                    n && (t = n);
                }
            }, 1);
        })();
    }
    function o(t, e, n) {
        var o = [];
        null == e && (e = document), null == n && (n = "*");
        var s = e.getElementsByTagName(n), a = s.length, r = RegExp("(^|\\s)" + t + "(\\s|$)");
        for (i = 0, j = 0; a > i; i++) r.test(s[i].className) && (o[j] = s[i], j++);
        return o;
    }
    function s(t, e) {
        if (Pixastic.debug) try {
            switch (e) {
              case "warn":
                console.warn("Pixastic:", t);
                break;

              case "error":
                console.error("Pixastic:", t);
                break;

              default:
                console.log("Pixastic:", t);
            }
        } catch (i) {}
    }
    "undefined" != typeof pixastic_parseonload && pixastic_parseonload && e(n);
    var a = function() {
        var t = document.createElement("canvas"), e = !1;
        try {
            e = !("function" != typeof t.getContext || !t.getContext("2d"));
        } catch (i) {}
        return function() {
            return e;
        };
    }(), r = function() {
        var t, e = document.createElement("canvas"), i = !1;
        try {
            "function" == typeof e.getContext && (t = e.getContext("2d")) && (i = "function" == typeof t.getImageData);
        } catch (n) {}
        return function() {
            return i;
        };
    }(), h = function() {
        var t = !1, e = document.createElement("canvas");
        if (a() && r()) {
            e.width = e.height = 1;
            var i = e.getContext("2d");
            i.fillStyle = "rgb(255,0,0)", i.fillRect(0, 0, 1, 1);
            var n = document.createElement("canvas");
            n.width = n.height = 1;
            var o = n.getContext("2d");
            o.fillStyle = "rgb(0,0,255)", o.fillRect(0, 0, 1, 1), i.globalAlpha = .5, i.drawImage(n, 0, 0);
            var s = i.getImageData(0, 0, 1, 1).data;
            t = 255 != s[2];
        }
        return function() {
            return t;
        };
    }();
    return {
        parseOnLoad: !1,
        debug: !1,
        applyAction: function(t, e, i, n) {
            n = n || {};
            var o = "canvas" == t.tagName.toLowerCase();
            if (o && Pixastic.Client.isIE()) return Pixastic.debug && s("Tried to process a canvas element but browser is IE."), 
            !1;
            var a, r, h = !1;
            Pixastic.Client.hasCanvas() && (h = !!n.resultCanvas, a = n.resultCanvas || document.createElement("canvas"), 
            r = a.getContext("2d"));
            var l = t.offsetWidth, c = t.offsetHeight;
            if (o && (l = t.width, c = t.height), 0 == l || 0 == c) {
                if (null != t.parentNode) return Pixastic.debug && s("Image has 0 width and/or height."), 
                void 0;
                var u = t.style.position, d = t.style.left;
                t.style.position = "absolute", t.style.left = "-9999px", document.body.appendChild(t), 
                l = t.offsetWidth, c = t.offsetHeight, document.body.removeChild(t), t.style.position = u, 
                t.style.left = d;
            }
            if (i.indexOf("(") > -1) {
                var f = i;
                i = f.substr(0, f.indexOf("("));
                var g = f.match(/\((.*?)\)/);
                if (g[1]) {
                    g = g[1].split(";");
                    for (var p = 0; g.length > p; p++) if (thisArg = g[p].split("="), 2 == thisArg.length) if ("rect" == thisArg[0]) {
                        var m = thisArg[1].split(",");
                        n[thisArg[0]] = {
                            left: parseInt(m[0], 10) || 0,
                            top: parseInt(m[1], 10) || 0,
                            width: parseInt(m[2], 10) || 0,
                            height: parseInt(m[3], 10) || 0
                        };
                    } else n[thisArg[0]] = thisArg[1];
                }
            }
            n.rect ? (n.rect.left = Math.round(n.rect.left), n.rect.top = Math.round(n.rect.top), 
            n.rect.width = Math.round(n.rect.width), n.rect.height = Math.round(n.rect.height)) : n.rect = {
                left: 0,
                top: 0,
                width: l,
                height: c
            };
            var v = !1;
            if (Pixastic.Actions[i] && "function" == typeof Pixastic.Actions[i].process && (v = !0), 
            !v) return Pixastic.debug && s('Invalid action "' + i + '". Maybe file not included?'), 
            !1;
            if (!Pixastic.Actions[i].checkSupport()) return Pixastic.debug && s('Action "' + i + '" not supported by this browser.'), 
            !1;
            Pixastic.Client.hasCanvas() ? (a !== t && (a.width = l, a.height = c), h || (a.style.width = l + "px", 
            a.style.height = c + "px"), r.drawImage(e, 0, 0, l, c), t.__pixastic_org_image ? (a.__pixastic_org_image = t.__pixastic_org_image, 
            a.__pixastic_org_width = t.__pixastic_org_width, a.__pixastic_org_height = t.__pixastic_org_height) : (a.__pixastic_org_image = t, 
            a.__pixastic_org_width = l, a.__pixastic_org_height = c)) : Pixastic.Client.isIE() && t.__pixastic_org_style === void 0 && (t.__pixastic_org_style = t.style.cssText);
            var y = {
                image: t,
                canvas: a,
                width: l,
                height: c,
                useData: !0,
                options: n
            }, C = Pixastic.Actions[i].process(y);
            return C ? Pixastic.Client.hasCanvas() ? (y.useData && Pixastic.Client.hasCanvasImageData() && (a.getContext("2d").putImageData(y.canvasData, n.rect.left, n.rect.top), 
            a.getContext("2d").fillRect(0, 0, 0, 0)), n.leaveDOM || (a.title = t.title, a.imgsrc = t.imgsrc, 
            o || (a.alt = t.alt), o || (a.imgsrc = t.src), a.className = t.className, a.style.cssText = t.style.cssText, 
            a.name = t.name, a.tabIndex = t.tabIndex, a.id = t.id, t.parentNode && t.parentNode.replaceChild && t.parentNode.replaceChild(a, t)), 
            n.resultCanvas = a, a) : t : !1;
        },
        prepareData: function(t, e) {
            var i = t.canvas.getContext("2d"), n = t.options.rect, o = i.getImageData(n.left, n.top, n.width, n.height), s = o.data;
            return e || (t.canvasData = o), s;
        },
        process: function(t, e, i, n) {
            if ("img" == t.tagName.toLowerCase()) {
                var o = new Image();
                if (o.src = t.src, o.complete) {
                    var s = Pixastic.applyAction(t, o, e, i);
                    return n && n(s), s;
                }
                o.onload = function() {
                    var s = Pixastic.applyAction(t, o, e, i);
                    n && n(s);
                };
            }
            if ("canvas" == t.tagName.toLowerCase()) {
                var s = Pixastic.applyAction(t, t, e, i);
                return n && n(s), s;
            }
        },
        revert: function(t) {
            if (Pixastic.Client.hasCanvas()) {
                if ("canvas" == t.tagName.toLowerCase() && t.__pixastic_org_image) return t.width = t.__pixastic_org_width, 
                t.height = t.__pixastic_org_height, t.getContext("2d").drawImage(t.__pixastic_org_image, 0, 0), 
                t.parentNode && t.parentNode.replaceChild && t.parentNode.replaceChild(t.__pixastic_org_image, t), 
                t;
            } else Pixastic.Client.isIE() && t.__pixastic_org_style !== void 0 && (t.style.cssText = t.__pixastic_org_style);
        },
        Client: {
            hasCanvas: a,
            hasCanvasImageData: r,
            hasGlobalAlpha: h,
            isIE: function() {
                return !!document.all && !!window.attachEvent && !window.opera;
            }
        },
        Actions: {}
    };
}();

Pixastic.Actions.blend = {
    process: function(t) {
        var e = parseFloat(t.options.amount), i = (t.options.mode || "normal").toLowerCase(), n = t.options.image;
        if (e = Math.max(0, Math.min(1, e)), !n) return !1;
        if (Pixastic.Client.hasCanvasImageData()) {
            var o = t.options.rect, s = Pixastic.prepareData(t), a = o.width, r = o.height;
            t.useData = !1;
            var h = document.createElement("canvas");
            h.width = t.canvas.width, h.height = t.canvas.height;
            var l = h.getContext("2d");
            l.drawImage(n, 0, 0);
            var c, u, d, f, g, p, m, v, y, C, w, P, x, b, I = {
                canvas: h,
                options: t.options
            }, S = Pixastic.prepareData(I), A = I.canvasData, T = a * r, k = 4 * T, R = !1;
            switch (i) {
              case "normal":
                break;

              case "multiply":
                for (;T--; ) S[k -= 4] = s[k] * S[k] / 255, S[c = k + 1] = s[c] * S[c] / 255, S[u = k + 2] = s[u] * S[u] / 255;
                R = !0;
                break;

              case "lighten":
                for (;T--; ) (d = s[k -= 4]) > S[k] && (S[k] = d), (f = s[c = k + 1]) > S[c] && (S[c] = f), 
                (g = s[u = k + 2]) > S[u] && (S[u] = g);
                R = !0;
                break;

              case "darken":
                for (;T--; ) (d = s[k -= 4]) < S[k] && (S[k] = d), (f = s[c = k + 1]) < S[c] && (S[c] = f), 
                (g = s[u = k + 2]) < S[u] && (S[u] = g);
                R = !0;
                break;

              case "darkercolor":
                for (;T--; ) .3 * (d = s[k -= 4]) + .59 * (f = s[c = k + 1]) + .11 * (g = s[u = k + 2]) <= .3 * S[k] + .59 * S[c] + .11 * S[u] && (S[k] = d, 
                S[c] = f, S[u] = g);
                R = !0;
                break;

              case "lightercolor":
                for (;T--; ) .3 * (d = s[k -= 4]) + .59 * (f = s[c = k + 1]) + .11 * (g = s[u = k + 2]) > .3 * S[k] + .59 * S[c] + .11 * S[u] && (S[k] = d, 
                S[c] = f, S[u] = g);
                R = !0;
                break;

              case "lineardodge":
                for (;T--; ) S[k] = (y = s[k -= 4] + S[k]) > 255 ? 255 : y, S[c] = (C = s[c = k + 1] + S[c]) > 255 ? 255 : C, 
                S[u] = (w = s[u = k + 2] + S[u]) > 255 ? 255 : w;
                R = !0;
                break;

              case "linearburn":
                for (;T--; ) S[k] = 255 > (y = s[k -= 4] + S[k]) ? 0 : y - 255, S[c] = 255 > (C = s[c = k + 1] + S[c]) ? 0 : C - 255, 
                S[u] = 255 > (w = s[u = k + 2] + S[u]) ? 0 : w - 255;
                R = !0;
                break;

              case "difference":
                for (;T--; ) S[k] = 0 > (y = s[k -= 4] - S[k]) ? -y : y, S[c] = 0 > (C = s[c = k + 1] - S[c]) ? -C : C, 
                S[u] = 0 > (w = s[u = k + 2] - S[u]) ? -w : w;
                R = !0;
                break;

              case "screen":
                for (;T--; ) S[k -= 4] = 255 - ((255 - S[k]) * (255 - s[k]) >> 8), S[c = k + 1] = 255 - ((255 - S[c]) * (255 - s[c]) >> 8), 
                S[u = k + 2] = 255 - ((255 - S[u]) * (255 - s[u]) >> 8);
                R = !0;
                break;

              case "exclusion":
                for (var O = 2 / 255; T--; ) S[k -= 4] = (d = s[k]) - (d * O - 1) * S[k], S[c = k + 1] = (f = s[c]) - (f * O - 1) * S[c], 
                S[u = k + 2] = (g = s[u]) - (g * O - 1) * S[u];
                R = !0;
                break;

              case "overlay":
                for (var O = 2 / 255; T--; ) S[k] = 128 > (d = s[k -= 4]) ? S[k] * d * O : 255 - (255 - S[k]) * (255 - d) * O, 
                S[c] = 128 > (f = s[c = k + 1]) ? S[c] * f * O : 255 - (255 - S[c]) * (255 - f) * O, 
                S[u] = 128 > (g = s[u = k + 2]) ? S[u] * g * O : 255 - (255 - S[u]) * (255 - g) * O;
                R = !0;
                break;

              case "softlight":
                for (var O = 2 / 255; T--; ) S[k] = 128 > (d = s[k -= 4]) ? ((S[k] >> 1) + 64) * d * O : 255 - (191 - (S[k] >> 1)) * (255 - d) * O, 
                S[c] = 128 > (f = s[c = k + 1]) ? ((S[c] >> 1) + 64) * f * O : 255 - (191 - (S[c] >> 1)) * (255 - f) * O, 
                S[u] = 128 > (g = s[u = k + 2]) ? ((S[u] >> 1) + 64) * g * O : 255 - (191 - (S[u] >> 1)) * (255 - g) * O;
                R = !0;
                break;

              case "hardlight":
                for (var O = 2 / 255; T--; ) S[k] = 128 > (p = S[k -= 4]) ? s[k] * p * O : 255 - (255 - s[k]) * (255 - p) * O, 
                S[c] = 128 > (m = S[c = k + 1]) ? s[c] * m * O : 255 - (255 - s[c]) * (255 - m) * O, 
                S[u] = 128 > (v = S[u = k + 2]) ? s[u] * v * O : 255 - (255 - s[u]) * (255 - v) * O;
                R = !0;
                break;

              case "colordodge":
                for (;T--; ) S[k] = (y = (s[k -= 4] << 8) / (255 - (p = S[k]))) > 255 || 255 == p ? 255 : y, 
                S[c] = (C = (s[c = k + 1] << 8) / (255 - (m = S[c]))) > 255 || 255 == m ? 255 : C, 
                S[u] = (w = (s[u = k + 2] << 8) / (255 - (v = S[u]))) > 255 || 255 == v ? 255 : w;
                R = !0;
                break;

              case "colorburn":
                for (;T--; ) S[k] = 0 > (y = 255 - (255 - s[k -= 4] << 8) / S[k]) || 0 == S[k] ? 0 : y, 
                S[c] = 0 > (C = 255 - (255 - s[c = k + 1] << 8) / S[c]) || 0 == S[c] ? 0 : C, S[u] = 0 > (w = 255 - (255 - s[u = k + 2] << 8) / S[u]) || 0 == S[u] ? 0 : w;
                R = !0;
                break;

              case "linearlight":
                for (;T--; ) S[k] = 0 > (y = 2 * (p = S[k -= 4]) + s[k] - 256) || 128 > p && 0 > y ? 0 : y > 255 ? 255 : y, 
                S[c] = 0 > (C = 2 * (m = S[c = k + 1]) + s[c] - 256) || 128 > m && 0 > C ? 0 : C > 255 ? 255 : C, 
                S[u] = 0 > (w = 2 * (v = S[u = k + 2]) + s[u] - 256) || 128 > v && 0 > w ? 0 : w > 255 ? 255 : w;
                R = !0;
                break;

              case "vividlight":
                for (;T--; ) S[k] = 128 > (p = S[k -= 4]) ? p ? 0 > (y = 255 - (255 - s[k] << 8) / (2 * p)) ? 0 : y : 0 : 255 > (y = P = 2 * p - 256) ? (y = (s[k] << 8) / (255 - P)) > 255 ? 255 : y : 0 > y ? 0 : y, 
                S[c] = 128 > (m = S[c = k + 1]) ? m ? 0 > (C = 255 - (255 - s[c] << 8) / (2 * m)) ? 0 : C : 0 : 255 > (C = x = 2 * m - 256) ? (C = (s[c] << 8) / (255 - x)) > 255 ? 255 : C : 0 > C ? 0 : C, 
                S[u] = 128 > (v = S[u = k + 2]) ? v ? 0 > (w = 255 - (255 - s[u] << 8) / (2 * v)) ? 0 : w : 0 : 255 > (w = b = 2 * v - 256) ? (w = (s[u] << 8) / (255 - b)) > 255 ? 255 : w : 0 > w ? 0 : w;
                R = !0;
                break;

              case "pinlight":
                for (;T--; ) S[k] = 128 > (p = S[k -= 4]) ? (d = s[k]) < (P = 2 * p) ? d : P : (d = s[k]) > (P = 2 * p - 256) ? d : P, 
                S[c] = 128 > (m = S[c = k + 1]) ? (f = s[c]) < (x = 2 * m) ? f : x : (f = s[c]) > (x = 2 * m - 256) ? f : x, 
                S[u] = 128 > (p = S[u = k + 2]) ? (d = s[u]) < (P = 2 * p) ? d : P : (d = s[u]) > (P = 2 * p - 256) ? d : P;
                R = !0;
                break;

              case "hardmix":
                for (;T--; ) S[k] = 128 > (p = S[k -= 4]) ? 128 > 255 - (255 - s[k] << 8) / (2 * p) || 0 == p ? 0 : 255 : 255 > (P = 2 * p - 256) && 128 > (s[k] << 8) / (255 - P) ? 0 : 255, 
                S[c] = 128 > (m = S[c = k + 1]) ? 128 > 255 - (255 - s[c] << 8) / (2 * m) || 0 == m ? 0 : 255 : 255 > (x = 2 * m - 256) && 128 > (s[c] << 8) / (255 - x) ? 0 : 255, 
                S[u] = 128 > (v = S[u = k + 2]) ? 128 > 255 - (255 - s[u] << 8) / (2 * v) || 0 == v ? 0 : 255 : 255 > (b = 2 * v - 256) && 128 > (s[u] << 8) / (255 - b) ? 0 : 255;
                R = !0;
            }
            if (R && l.putImageData(A, 0, 0), 1 == e || Pixastic.Client.hasGlobalAlpha()) {
                var N = t.canvas.getContext("2d");
                N.save(), N.globalAlpha = e, N.drawImage(h, 0, 0, o.width, o.height, o.left, o.top, o.width, o.height), 
                N.globalAlpha = 1, N.restore();
            } else {
                for (var T = a * r, M = e, D = 1 - e; T--; ) {
                    var k = 4 * T, L = s[k] * D + S[k] * M >> 0, $ = s[k + 1] * D + S[k + 1] * M >> 0, B = s[k + 2] * D + S[k + 2] * M >> 0;
                    s[k] = L, s[k + 1] = $, s[k + 2] = B;
                }
                t.useData = !0;
            }
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.blur = {
    process: function(t) {
        if (t.options.fixMargin === void 0 && (t.options.fixMargin = !0), Pixastic.Client.hasCanvasImageData()) {
            for (var e = Pixastic.prepareData(t), i = Pixastic.prepareData(t, !0), n = [ [ 0, 1, 0 ], [ 1, 2, 1 ], [ 0, 1, 0 ] ], o = 0, s = 0; 3 > s; s++) for (var a = 0; 3 > a; a++) o += n[s][a];
            o = 1 / (2 * o);
            var r = t.options.rect, h = r.width, l = r.height, c = 4 * h, u = l;
            do {
                var d = (u - 1) * c, f = 1 == u ? 0 : u - 2, g = u == l ? u - 1 : u, p = 4 * f * h, m = 4 * g * h, v = h;
                do {
                    var y = d + (4 * v - 4), C = p + 4 * (1 == v ? 0 : v - 2), w = m + 4 * (v == h ? v - 1 : v);
                    e[y] = (2 * (i[C] + i[y - 4] + i[y + 4] + i[w]) + 4 * i[y]) * o, e[y + 1] = (2 * (i[C + 1] + i[y - 3] + i[y + 5] + i[w + 1]) + 4 * i[y + 1]) * o, 
                    e[y + 2] = (2 * (i[C + 2] + i[y - 2] + i[y + 6] + i[w + 2]) + 4 * i[y + 2]) * o;
                } while (--v);
            } while (--u);
            return !0;
        }
        return Pixastic.Client.isIE() ? (t.image.style.filter += " progid:DXImageTransform.Microsoft.Blur(pixelradius=1.5)", 
        t.options.fixMargin && (t.image.style.marginLeft = (parseInt(t.image.style.marginLeft, 10) || 0) - 2 + "px", 
        t.image.style.marginTop = (parseInt(t.image.style.marginTop, 10) || 0) - 2 + "px"), 
        !0) : void 0;
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData() || Pixastic.Client.isIE();
    }
}, Pixastic.Actions.blurfast = {
    process: function(t) {
        var e = parseFloat(t.options.amount) || 0, i = !(!t.options.clear || "false" == t.options.clear);
        if (e = Math.max(0, Math.min(5, e)), Pixastic.Client.hasCanvas()) {
            var n = t.options.rect, o = t.canvas.getContext("2d");
            o.save(), o.beginPath(), o.rect(n.left, n.top, n.width, n.height), o.clip();
            var s = 2, a = Math.round(t.width / s), r = Math.round(t.height / s), h = document.createElement("canvas");
            h.width = a, h.height = r;
            for (var i = !1, l = Math.round(20 * e), c = h.getContext("2d"), u = 0; l > u; u++) {
                var d = Math.max(1, Math.round(a - u)), f = Math.max(1, Math.round(r - u));
                c.clearRect(0, 0, a, r), c.drawImage(t.canvas, 0, 0, t.width, t.height, 0, 0, d, f), 
                i && o.clearRect(n.left, n.top, n.width, n.height), o.drawImage(h, 0, 0, d, f, 0, 0, t.width, t.height);
            }
            return o.restore(), t.useData = !1, !0;
        }
        if (Pixastic.Client.isIE()) {
            var g = 10 * e;
            return t.image.style.filter += " progid:DXImageTransform.Microsoft.Blur(pixelradius=" + g + ")", 
            t.image.style.marginLeft = (parseInt(t.image.style.marginLeft, 10) || 0) - Math.round(g) + "px", 
            t.image.style.marginTop = (parseInt(t.image.style.marginTop, 10) || 0) - Math.round(g) + "px", 
            !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvas() || Pixastic.Client.isIE();
    }
}, Pixastic.Actions.brightness = {
    process: function(t) {
        var e = parseInt(t.options.brightness, 10) || 0, i = parseFloat(t.options.contrast) || 0, n = !(!t.options.legacy || "false" == t.options.legacy);
        if (n) e = Math.min(150, Math.max(-150, e)); else var o = 1 + Math.min(150, Math.max(-150, e)) / 150;
        if (i = Math.max(0, i + 1), Pixastic.Client.hasCanvasImageData()) {
            var s, a, r, h, l = Pixastic.prepareData(t), c = t.options.rect, u = c.width, d = c.height, f = u * d, g = 4 * f;
            1 != i ? n ? (r = i, h = (e - 128) * i + 128) : (r = o * i, h = 128 * -i + 128) : n ? (r = 1, 
            h = e) : (r = o, h = 0);
            for (var p, m, v; f--; ) l[g] = (p = l[g -= 4] * r + h) > 255 ? 255 : 0 > p ? 0 : p, 
            l[s] = (m = l[s = g + 1] * r + h) > 255 ? 255 : 0 > m ? 0 : m, l[a] = (v = l[a = g + 2] * r + h) > 255 ? 255 : 0 > v ? 0 : v;
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.coloradjust = {
    process: function(t) {
        var e = parseFloat(t.options.red) || 0, i = parseFloat(t.options.green) || 0, n = parseFloat(t.options.blue) || 0;
        if (e = Math.round(255 * e), i = Math.round(255 * i), n = Math.round(255 * n), Pixastic.Client.hasCanvasImageData()) {
            for (var o, s, a, r, h, l = Pixastic.prepareData(t), c = t.options.rect, u = c.width * c.height, d = 4 * u; u--; ) d -= 4, 
            e && (l[d] = 0 > (a = l[d] + e) ? 0 : a > 255 ? 255 : a), i && (l[o] = 0 > (r = l[o = d + 1] + i) ? 0 : r > 255 ? 255 : r), 
            n && (l[s] = 0 > (h = l[s = d + 2] + n) ? 0 : h > 255 ? 255 : h);
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.colorhistogram = {
    array256: function(t) {
        arr = [];
        for (var e = 0; 256 > e; e++) arr[e] = t;
        return arr;
    },
    process: function(t) {
        "object" != typeof t.options.returnValue && (t.options.returnValue = {
            rvals: [],
            gvals: [],
            bvals: []
        });
        var e = !!t.options.paint, i = t.options.returnValue;
        if ("array" != typeof i.values && (i.rvals = [], i.gvals = [], i.bvals = []), Pixastic.Client.hasCanvasImageData()) {
            var n = Pixastic.prepareData(t);
            t.useData = !1;
            for (var o = this.array256(0), s = this.array256(0), a = this.array256(0), r = t.options.rect, h = r.width * r.height, l = 4 * h; h--; ) o[n[l -= 4]]++, 
            s[n[l + 1]]++, a[n[l + 2]]++;
            if (i.rvals = o, i.gvals = s, i.bvals = a, e) for (var c = t.canvas.getContext("2d"), u = [ o, s, a ], d = 0; 3 > d; d++) {
                for (var f = (d + 1) * t.height / 3, g = 0, p = 0; 256 > p; p++) u[d][p] > g && (g = u[d][p]);
                var m = t.height / 3 / g, v = t.width / 256;
                0 == d ? c.fillStyle = "rgba(255,0,0,0.5)" : 1 == d ? c.fillStyle = "rgba(0,255,0,0.5)" : 2 == d && (c.fillStyle = "rgba(0,0,255,0.5)");
                for (var p = 0; 256 > p; p++) c.fillRect(p * v, t.height - m * u[d][p] - t.height + f, v, u[d][p] * m);
            }
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.crop = {
    process: function(t) {
        if (Pixastic.Client.hasCanvas()) {
            var e = t.options.rect, i = e.width, n = e.height, o = e.top, s = e.left;
            t.options.left !== void 0 && (s = parseInt(t.options.left, 10)), t.options.top !== void 0 && (o = parseInt(t.options.top, 10)), 
            t.options.height !== void 0 && (i = parseInt(t.options.width, 10)), t.options.height !== void 0 && (n = parseInt(t.options.height, 10)), 
            0 > s && (s = 0), s > t.width - 1 && (s = t.width - 1), 0 > o && (o = 0), o > t.height - 1 && (o = t.height - 1), 
            1 > i && (i = 1), s + i > t.width && (i = t.width - s), 1 > n && (n = 1), o + n > t.height && (n = t.height - o);
            var a = document.createElement("canvas");
            return a.width = t.width, a.height = t.height, a.getContext("2d").drawImage(t.canvas, 0, 0), 
            t.canvas.width = i, t.canvas.height = n, t.canvas.getContext("2d").clearRect(0, 0, i, n), 
            t.canvas.getContext("2d").drawImage(a, s, o, i, n, 0, 0, i, n), t.useData = !1, 
            !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvas();
    }
}, Pixastic.Actions.desaturate = {
    process: function(t) {
        var e = !(!t.options.average || "false" == t.options.average);
        if (Pixastic.Client.hasCanvasImageData()) {
            var i, n, o = Pixastic.prepareData(t), s = t.options.rect, a = s.width, r = s.height, h = a * r, l = 4 * h;
            if (e) for (;h--; ) o[l -= 4] = o[i = l + 1] = o[n = l + 2] = (o[l] + o[i] + o[n]) / 3; else for (;h--; ) o[l -= 4] = o[i = l + 1] = o[n = l + 2] = .3 * o[l] + .59 * o[i] + .11 * o[n];
            return !0;
        }
        return Pixastic.Client.isIE() ? (t.image.style.filter += " gray", !0) : void 0;
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData() || Pixastic.Client.isIE();
    }
}, Pixastic.Actions.edges = {
    process: function(t) {
        var e = !(!t.options.mono || "false" == t.options.mono), i = !(!t.options.invert || "false" == t.options.invert);
        if (Pixastic.Client.hasCanvasImageData()) {
            var n = Pixastic.prepareData(t), o = Pixastic.prepareData(t, !0), s = -1 / 8;
            weight = 1 / s;
            var a = t.options.rect, r = a.width, h = a.height, l = 4 * r, c = h;
            do {
                var u = (c - 1) * l, d = c == h ? c - 1 : c, f = 1 == c ? 0 : c - 2, g = 4 * f * r, p = 4 * d * r, m = r;
                do {
                    var v = u + (4 * m - 4), y = g + 4 * (1 == m ? 0 : m - 2), C = p + 4 * (m == r ? m - 1 : m), w = ((o[y - 4] + o[y] + o[y + 4] + o[v - 4] + o[v + 4] + o[C - 4] + o[C] + o[C + 4]) * s + o[v]) * weight, P = ((o[y - 3] + o[y + 1] + o[y + 5] + o[v - 3] + o[v + 5] + o[C - 3] + o[C + 1] + o[C + 5]) * s + o[v + 1]) * weight, x = ((o[y - 2] + o[y + 2] + o[y + 6] + o[v - 2] + o[v + 6] + o[C - 2] + o[C + 2] + o[C + 6]) * s + o[v + 2]) * weight;
                    if (e) {
                        var b = .3 * w + .59 * P + .11 * x || 0;
                        i && (b = 255 - b), 0 > b && (b = 0), b > 255 && (b = 255), w = P = x = b;
                    } else i && (w = 255 - w, P = 255 - P, x = 255 - x), 0 > w && (w = 0), 0 > P && (P = 0), 
                    0 > x && (x = 0), w > 255 && (w = 255), P > 255 && (P = 255), x > 255 && (x = 255);
                    n[v] = w, n[v + 1] = P, n[v + 2] = x;
                } while (--m);
            } while (--c);
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.edges2 = {
    process: function(t) {
        if (Pixastic.Client.hasCanvasImageData()) {
            for (var e = Pixastic.prepareData(t), i = Pixastic.prepareData(t, !0), n = t.options.rect, o = n.width, s = n.height, a = 4 * o, r = a + 4, h = s - 1, l = o - 1, c = 1; h > c; ++c) {
                for (var u = r - 4, d = u - a, f = u + a, g = -i[d] - i[u] - i[f], p = -i[++d] - i[++u] - i[++f], m = -i[++d] - i[++u] - i[++f], v = i[d += 2], y = i[++d], C = i[++d], w = i[u += 2], P = i[++u], x = i[++u], b = i[f += 2], I = i[++f], S = i[++f], A = -v - w - b, T = -y - P - I, k = -C - x - S, R = 1; l > R; ++R) {
                    u = r + 4, d = u - a, f = u + a;
                    var O = 127 + g - v - -8 * w - b, N = 127 + p - y - -8 * P - I, M = 127 + m - C - -8 * x - S;
                    g = A, p = T, m = k, v = i[d], y = i[++d], C = i[++d], w = i[u], P = i[++u], x = i[++u], 
                    b = i[f], I = i[++f], S = i[++f], O += A = -v - w - b, N += T = -y - P - I, M += k = -C - x - S, 
                    O > 255 && (O = 255), N > 255 && (N = 255), M > 255 && (M = 255), 0 > O && (O = 0), 
                    0 > N && (N = 0), 0 > M && (M = 0), e[r] = O, e[++r] = N, e[++r] = M, r += 2;
                }
                r += 8;
            }
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.emboss = {
    process: function(t) {
        var e = parseFloat(t.options.strength) || 1, i = t.options.greyLevel !== void 0 ? parseInt(t.options.greyLevel) : 180, n = t.options.direction || "topleft", o = !(!t.options.blend || "false" == t.options.blend), s = 0, a = 0;
        switch (n) {
          case "topleft":
            s = -1, a = -1;
            break;

          case "top":
            s = -1, a = 0;
            break;

          case "topright":
            s = -1, a = 1;
            break;

          case "right":
            s = 0, a = 1;
            break;

          case "bottomright":
            s = 1, a = 1;
            break;

          case "bottom":
            s = 1, a = 0;
            break;

          case "bottomleft":
            s = 1, a = -1;
            break;

          case "left":
            s = 0, a = -1;
        }
        if (Pixastic.Client.hasCanvasImageData()) {
            var r = Pixastic.prepareData(t), h = Pixastic.prepareData(t, !0);
            !!t.options.invertAlpha;
            var l = t.options.rect, c = l.width, u = l.height, d = 4 * c, f = u;
            do {
                var g = (f - 1) * d, p = s;
                1 > f + p && (p = 0), f + p > u && (p = 0);
                var m = 4 * (f - 1 + p) * c, v = c;
                do {
                    var y = g + 4 * (v - 1), C = a;
                    1 > v + C && (C = 0), v + C > c && (C = 0);
                    var w = m + 4 * (v - 1 + C), P = h[y] - h[w], x = h[y + 1] - h[w + 1], b = h[y + 2] - h[w + 2], I = P, S = I > 0 ? I : -I, A = x > 0 ? x : -x, T = b > 0 ? b : -b;
                    if (A > S && (I = x), T > S && (I = b), I *= e, o) {
                        var k = r[y] + I, R = r[y + 1] + I, O = r[y + 2] + I;
                        r[y] = k > 255 ? 255 : 0 > k ? 0 : k, r[y + 1] = R > 255 ? 255 : 0 > R ? 0 : R, 
                        r[y + 2] = O > 255 ? 255 : 0 > O ? 0 : O;
                    } else {
                        var N = i - I;
                        0 > N ? N = 0 : N > 255 && (N = 255), r[y] = r[y + 1] = r[y + 2] = N;
                    }
                } while (--v);
            } while (--f);
            return !0;
        }
        return Pixastic.Client.isIE() ? (t.image.style.filter += " progid:DXImageTransform.Microsoft.emboss()", 
        !0) : void 0;
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData() || Pixastic.Client.isIE();
    }
}, Pixastic.Actions.flip = {
    process: function(t) {
        var e = t.options.rect, i = document.createElement("canvas");
        i.width = e.width, i.height = e.height, i.getContext("2d").drawImage(t.image, e.left, e.top, e.width, e.height, 0, 0, e.width, e.height);
        var n = t.canvas.getContext("2d");
        return n.clearRect(e.left, e.top, e.width, e.height), "horizontal" == t.options.axis ? (n.scale(-1, 1), 
        n.drawImage(i, -e.left - e.width, e.top, e.width, e.height)) : (n.scale(1, -1), 
        n.drawImage(i, e.left, -e.top - e.height, e.width, e.height)), t.useData = !1, !0;
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvas();
    }
}, Pixastic.Actions.fliph = {
    process: function(t) {
        if (Pixastic.Client.hasCanvas()) {
            var e = t.options.rect, i = document.createElement("canvas");
            i.width = e.width, i.height = e.height, i.getContext("2d").drawImage(t.image, e.left, e.top, e.width, e.height, 0, 0, e.width, e.height);
            var n = t.canvas.getContext("2d");
            return n.clearRect(e.left, e.top, e.width, e.height), n.scale(-1, 1), n.drawImage(i, -e.left - e.width, e.top, e.width, e.height), 
            t.useData = !1, !0;
        }
        return Pixastic.Client.isIE() ? (t.image.style.filter += " fliph", !0) : void 0;
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvas() || Pixastic.Client.isIE();
    }
}, Pixastic.Actions.flipv = {
    process: function(t) {
        if (Pixastic.Client.hasCanvas()) {
            var e = t.options.rect, i = document.createElement("canvas");
            i.width = e.width, i.height = e.height, i.getContext("2d").drawImage(t.image, e.left, e.top, e.width, e.height, 0, 0, e.width, e.height);
            var n = t.canvas.getContext("2d");
            return n.clearRect(e.left, e.top, e.width, e.height), n.scale(1, -1), n.drawImage(i, e.left, -e.top - e.height, e.width, e.height), 
            t.useData = !1, !0;
        }
        return Pixastic.Client.isIE() ? (t.image.style.filter += " flipv", !0) : void 0;
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvas() || Pixastic.Client.isIE();
    }
}, Pixastic.Actions.glow = {
    process: function(t) {
        var e = parseFloat(t.options.amount) || 0, i = parseFloat(t.options.radius) || 0;
        if (e = Math.min(1, Math.max(0, e)), i = Math.min(5, Math.max(0, i)), Pixastic.Client.hasCanvasImageData()) {
            var n = t.options.rect, o = document.createElement("canvas");
            o.width = t.width, o.height = t.height;
            var s = o.getContext("2d");
            s.drawImage(t.canvas, 0, 0);
            var a = 2, r = Math.round(t.width / a), h = Math.round(t.height / a), l = document.createElement("canvas");
            l.width = r, l.height = h;
            for (var c = Math.round(20 * i), u = l.getContext("2d"), d = 0; c > d; d++) {
                var f = Math.max(1, Math.round(r - d)), g = Math.max(1, Math.round(h - d));
                u.clearRect(0, 0, r, h), u.drawImage(o, 0, 0, t.width, t.height, 0, 0, f, g), s.clearRect(0, 0, t.width, t.height), 
                s.drawImage(l, 0, 0, f, g, 0, 0, t.width, t.height);
            }
            for (var p = Pixastic.prepareData(t), m = Pixastic.prepareData({
                canvas: o,
                options: t.options
            }), v = n.width * n.height, y = 4 * v, C = y + 1, w = y + 2; v--; ) (p[y -= 4] += e * m[y]) > 255 && (p[y] = 255), 
            (p[C -= 4] += e * m[C]) > 255 && (p[C] = 255), (p[w -= 4] += e * m[w]) > 255 && (p[w] = 255);
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.histogram = {
    process: function(t) {
        var e = !(!t.options.average || "false" == t.options.average), i = !(!t.options.paint || "false" == t.options.paint), n = t.options.color || "rgba(255,255,255,0.5)", o = [];
        "object" != typeof t.options.returnValue && (t.options.returnValue = {
            values: []
        });
        var s = t.options.returnValue;
        if ("array" != typeof s.values && (s.values = []), o = s.values, Pixastic.Client.hasCanvasImageData()) {
            var a = Pixastic.prepareData(t);
            t.useData = !1;
            for (var r = 0; 256 > r; r++) o[r] = 0;
            var h = t.options.rect, l = h.width * h.height, c = 4 * l, u = Math.round;
            if (e) for (;l--; ) o[u((a[c -= 4] + a[c + 1] + a[c + 2]) / 3)]++; else for (;l--; ) o[u(.3 * a[c -= 4] + .59 * a[c + 1] + .11 * a[c + 2])]++;
            if (i) {
                for (var d = 0, r = 0; 256 > r; r++) o[r] > d && (d = o[r]);
                var f = t.height / d, g = t.width / 256, p = t.canvas.getContext("2d");
                p.fillStyle = n;
                for (var r = 0; 256 > r; r++) p.fillRect(r * g, t.height - f * o[r], g, o[r] * f);
            }
            return s.values = o, !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.hsl = {
    process: function(t) {
        var e = parseInt(t.options.hue, 10) || 0, i = (parseInt(t.options.saturation, 10) || 0) / 100, n = (parseInt(t.options.lightness, 10) || 0) / 100;
        if (0 > i) var o = 1 + i; else var o = 1 + 2 * i;
        e = e % 360 / 360;
        var s = 6 * e, a = 255 * n, r = 1 + n, h = 1 - n;
        if (Pixastic.Client.hasCanvasImageData()) {
            for (var l = Pixastic.prepareData(t), c = t.options.rect, u = c.width * c.height, d = 4 * u, f = d + 1, g = d + 2; u--; ) {
                var p = l[d -= 4], m = l[f = d + 1], v = l[g = d + 2];
                if (0 != e || 0 != i) {
                    var y = p;
                    m > y && (y = m), v > y && (y = v);
                    var C = p;
                    C > m && (C = m), C > v && (C = v);
                    var w = y - C, P = (C + y) / 510;
                    if (P > 0 && w > 0) {
                        if (.5 >= P) {
                            var x = w / (y + C) * o;
                            x > 1 && (x = 1);
                            var b = P * (1 + x);
                        } else {
                            var x = w / (510 - y - C) * o;
                            x > 1 && (x = 1);
                            var b = P + x - P * x;
                        }
                        if (p == y) if (m == C) var I = 5 + (y - v) / w + s; else var I = 1 - (y - m) / w + s; else if (m == y) if (v == C) var I = 1 + (y - p) / w + s; else var I = 3 - (y - v) / w + s; else if (p == C) var I = 3 + (y - m) / w + s; else var I = 5 - (y - p) / w + s;
                        0 > I && (I += 6), I >= 6 && (I -= 6);
                        var S = P + P - b, A = I >> 0;
                        0 == A ? (p = 255 * b, m = 255 * (S + (b - S) * (I - A)), v = 255 * S) : 1 == A ? (p = 255 * (b - (b - S) * (I - A)), 
                        m = 255 * b, v = 255 * S) : 2 == A ? (p = 255 * S, m = 255 * b, v = 255 * (S + (b - S) * (I - A))) : 3 == A ? (p = 255 * S, 
                        m = 255 * (b - (b - S) * (I - A)), v = 255 * b) : 4 == A ? (p = 255 * (S + (b - S) * (I - A)), 
                        m = 255 * S, v = 255 * b) : 5 == A && (p = 255 * b, m = 255 * S, v = 255 * (b - (b - S) * (I - A)));
                    }
                }
                0 > n ? (p *= r, m *= r, v *= r) : n > 0 && (p = p * h + a, m = m * h + a, v = v * h + a), 
                l[d] = 0 > p ? 0 : p > 255 ? 255 : p, l[f] = 0 > m ? 0 : m > 255 ? 255 : m, l[g] = 0 > v ? 0 : v > 255 ? 255 : v;
            }
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.invert = {
    process: function(t) {
        if (Pixastic.Client.hasCanvasImageData()) {
            for (var e = Pixastic.prepareData(t), i = !!t.options.invertAlpha, n = t.options.rect, o = n.width * n.height, s = 4 * o, a = s + 1, r = s + 2, h = s + 3; o--; ) e[s -= 4] = 255 - e[s], 
            e[a -= 4] = 255 - e[a], e[r -= 4] = 255 - e[r], i && (e[h -= 4] = 255 - e[h]);
            return !0;
        }
        return Pixastic.Client.isIE() ? (t.image.style.filter += " invert", !0) : void 0;
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData() || Pixastic.Client.isIE();
    }
}, Pixastic.Actions.laplace = {
    process: function(t) {
        var e = !(!t.options.invert || "false" == t.options.invert), i = parseFloat(t.options.edgeStrength) || 0, n = parseInt(t.options.greyLevel) || 0;
        if (i = -i, Pixastic.Client.hasCanvasImageData()) {
            var o = Pixastic.prepareData(t), s = Pixastic.prepareData(t, !0), a = 1 / 8, r = t.options.rect, h = r.width, l = r.height, c = 4 * h, u = l;
            do {
                var d = (u - 1) * c, f = u == l ? u - 1 : u, g = 1 == u ? 0 : u - 2, p = 4 * g * h, m = 4 * f * h, v = h;
                do {
                    var y = d + (4 * v - 4), C = p + 4 * (1 == v ? 0 : v - 2), w = m + 4 * (v == h ? v - 1 : v), P = (-s[C - 4] - s[C] - s[C + 4] - s[y - 4] - s[y + 4] - s[w - 4] - s[w] - s[w + 4] + 8 * s[y]) * a, x = (-s[C - 3] - s[C + 1] - s[C + 5] - s[y - 3] - s[y + 5] - s[w - 3] - s[w + 1] - s[w + 5] + 8 * s[y + 1]) * a, b = (-s[C - 2] - s[C + 2] - s[C + 6] - s[y - 2] - s[y + 6] - s[w - 2] - s[w + 2] - s[w + 6] + 8 * s[y + 2]) * a, I = (P + x + b) / 3 + n;
                    0 != i && (I > 127 ? I += (I + 1 - 128) * i : 127 > I && (I -= (I + 1) * i)), e && (I = 255 - I), 
                    0 > I && (I = 0), I > 255 && (I = 255), o[y] = o[y + 1] = o[y + 2] = I;
                } while (--v);
            } while (--u);
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.lighten = {
    process: function(t) {
        var e = parseFloat(t.options.amount) || 0;
        if (e = Math.max(-1, Math.min(1, e)), Pixastic.Client.hasCanvasImageData()) {
            for (var i = Pixastic.prepareData(t), n = t.options.rect, o = n.width * n.height, s = 4 * o, a = s + 1, r = s + 2, h = e + 1; o--; ) (i[s -= 4] = i[s] * h) > 255 && (i[s] = 255), 
            (i[a -= 4] = i[a] * h) > 255 && (i[a] = 255), (i[r -= 4] = i[r] * h) > 255 && (i[r] = 255);
            return !0;
        }
        if (Pixastic.Client.isIE()) {
            var l = t.image;
            return 0 > e ? (l.style.filter += " light()", l.filters[l.filters.length - 1].addAmbient(255, 255, 255, 100 * -e)) : e > 0 && (l.style.filter += " light()", 
            l.filters[l.filters.length - 1].addAmbient(255, 255, 255, 100), l.filters[l.filters.length - 1].addAmbient(255, 255, 255, 100 * e)), 
            !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData() || Pixastic.Client.isIE();
    }
}, Pixastic.Actions.mosaic = {
    process: function(t) {
        var e = Math.max(1, parseInt(t.options.blockSize, 10));
        if (Pixastic.Client.hasCanvasImageData()) {
            var i = t.options.rect, n = i.width, o = i.height, s = o, a = t.canvas.getContext("2d"), r = document.createElement("canvas");
            r.width = r.height = 1;
            var h = r.getContext("2d"), l = document.createElement("canvas");
            l.width = n, l.height = o;
            var c = l.getContext("2d");
            c.drawImage(t.canvas, i.left, i.top, n, o, 0, 0, n, o);
            for (var s = 0; o > s; s += e) for (var u = 0; n > u; u += e) {
                var d = e, f = e;
                d + u > n && (d = n - u), f + s > o && (f = o - s), h.drawImage(l, u, s, d, f, 0, 0, 1, 1);
                var g = h.getImageData(0, 0, 1, 1).data;
                a.fillStyle = "rgb(" + g[0] + "," + g[1] + "," + g[2] + ")", a.fillRect(i.left + u, i.top + s, e, e);
            }
            return t.useData = !1, !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.noise = {
    process: function(t) {
        var e = 0, i = 0, n = !1;
        t.options.amount !== void 0 && (e = parseFloat(t.options.amount) || 0), t.options.strength !== void 0 && (i = parseFloat(t.options.strength) || 0), 
        t.options.mono !== void 0 && (n = !(!t.options.mono || "false" == t.options.mono)), 
        e = Math.max(0, Math.min(1, e)), i = Math.max(0, Math.min(1, i));
        var o = 128 * i, s = o / 2;
        if (Pixastic.Client.hasCanvasImageData()) {
            var a = Pixastic.prepareData(t), r = t.options.rect, h = r.width, l = r.height, c = 4 * h, u = l, d = Math.random;
            do {
                var f = (u - 1) * c, g = h;
                do {
                    var p = f + 4 * (g - 1);
                    if (e > d()) {
                        if (n) var m = -s + d() * o, v = a[p] + m, y = a[p + 1] + m, C = a[p + 2] + m; else var v = a[p] - s + d() * o, y = a[p + 1] - s + d() * o, C = a[p + 2] - s + d() * o;
                        0 > v && (v = 0), 0 > y && (y = 0), 0 > C && (C = 0), v > 255 && (v = 255), y > 255 && (y = 255), 
                        C > 255 && (C = 255), a[p] = v, a[p + 1] = y, a[p + 2] = C;
                    }
                } while (--g);
            } while (--u);
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.posterize = {
    process: function(t) {
        var e = 256;
        if (t.options.levels !== void 0 && (e = parseInt(t.options.levels, 10) || 1), Pixastic.Client.hasCanvasImageData()) {
            var i = Pixastic.prepareData(t);
            e = Math.max(2, Math.min(256, e));
            var n = 256 / e, o = 256 / (e - 1), s = t.options.rect, a = s.width, r = s.height, h = 4 * a, l = r;
            do {
                var c = (l - 1) * h, u = a;
                do {
                    var d = c + 4 * (u - 1), f = o * (i[d] / n >> 0), g = o * (i[d + 1] / n >> 0), p = o * (i[d + 2] / n >> 0);
                    f > 255 && (f = 255), g > 255 && (g = 255), p > 255 && (p = 255), i[d] = f, i[d + 1] = g, 
                    i[d + 2] = p;
                } while (--u);
            } while (--l);
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.pointillize = {
    process: function(t) {
        var e = Math.max(1, parseInt(t.options.radius, 10)), i = Math.min(5, Math.max(0, parseFloat(t.options.density) || 0)), n = Math.max(0, parseFloat(t.options.noise) || 0), o = !(!t.options.transparent || "false" == t.options.transparent);
        if (Pixastic.Client.hasCanvasImageData()) {
            var s = t.options.rect, a = s.width, r = s.height, h = r, l = t.canvas.getContext("2d"), c = t.canvas.width, u = t.canvas.height, d = document.createElement("canvas");
            d.width = d.height = 1;
            var f = d.getContext("2d"), g = document.createElement("canvas");
            g.width = a, g.height = r;
            var p = g.getContext("2d");
            p.drawImage(t.canvas, s.left, s.top, a, r, 0, 0, a, r);
            var m = 2 * e;
            o && l.clearRect(s.left, s.top, s.width, s.height);
            for (var v = e * n, y = 1 / i, h = 0; r + e > h; h += m * y) for (var C = 0; a + e > C; C += m * y) {
                rndX = n ? C + (2 * Math.random() - 1) * v >> 0 : C, rndY = n ? h + (2 * Math.random() - 1) * v >> 0 : h;
                var w = rndX - e, P = rndY - e;
                0 > w && (w = 0), 0 > P && (P = 0);
                var x = rndX + s.left, b = rndY + s.top;
                0 > x && (x = 0), x > c && (x = c), 0 > b && (b = 0), b > u && (b = u);
                var I = m, S = m;
                I + w > a && (I = a - w), S + P > r && (S = r - P), 1 > I && (I = 1), 1 > S && (S = 1), 
                f.drawImage(g, w, P, I, S, 0, 0, 1, 1);
                var A = f.getImageData(0, 0, 1, 1).data;
                l.fillStyle = "rgb(" + A[0] + "," + A[1] + "," + A[2] + ")", l.beginPath(), l.arc(x, b, e, 0, 2 * Math.PI, !0), 
                l.closePath(), l.fill();
            }
            return t.useData = !1, !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.removenoise = {
    process: function(t) {
        if (Pixastic.Client.hasCanvasImageData()) {
            var e = Pixastic.prepareData(t), i = t.options.rect, n = i.width, o = i.height, s = 4 * n, a = o;
            do {
                var r = (a - 1) * s, h = a == o ? a - 1 : a, l = 1 == a ? 0 : a - 2, c = 4 * l * n, u = 4 * h * n, d = n;
                do {
                    var f, g, p, m, v, y, C = r + (4 * d - 4), w = c + 4 * (1 == d ? 0 : d - 2), P = u + 4 * (d == n ? d - 1 : d);
                    f = g = e[w];
                    var x = e[C - 4], b = e[C + 4], I = e[P];
                    f > x && (f = x), f > b && (f = b), f > I && (f = I), x > g && (g = x), b > g && (g = b), 
                    I > g && (g = I), p = m = e[w + 1];
                    var S = e[C - 3], A = e[C + 5], T = e[P + 1];
                    p > S && (p = S), p > A && (p = A), p > T && (p = T), S > m && (m = S), A > m && (m = A), 
                    T > m && (m = T), v = y = e[w + 2];
                    var k = e[C - 2], R = e[C + 6], O = e[P + 2];
                    v > k && (v = k), v > R && (v = R), v > O && (v = O), k > y && (y = k), R > y && (y = R), 
                    O > y && (y = O), e[C] > g ? e[C] = g : f > e[C] && (e[C] = f), e[C + 1] > m ? e[C + 1] = m : p > e[C + 1] && (e[C + 1] = p), 
                    e[C + 2] > y ? e[C + 2] = y : v > e[C + 2] && (e[C + 2] = v);
                } while (--d);
            } while (--a);
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.resize = {
    process: function(t) {
        if (Pixastic.Client.hasCanvas()) {
            var e = parseInt(t.options.width, 10), i = parseInt(t.options.height, 10), n = t.canvas;
            1 > e && (e = 1), 2 > e && (e = 2);
            var o = document.createElement("canvas");
            return o.width = e, o.height = i, o.getContext("2d").drawImage(n, 0, 0, e, i), n.width = e, 
            n.height = i, n.getContext("2d").drawImage(o, 0, 0), t.useData = !1, !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvas();
    }
}, Pixastic.Actions.rotate = {
    process: function(t) {
        if (Pixastic.Client.hasCanvas()) {
            var e = t.canvas, i = t.width, n = t.height, o = document.createElement("canvas");
            o.width = i, o.height = n, o.getContext("2d").drawImage(e, 0, 0, i, n);
            var s = -parseFloat(t.options.angle) * Math.PI / 180, a = s;
            a > .5 * Math.PI && (a = Math.PI - a), .5 * -Math.PI > a && (a = -Math.PI - a);
            var r = Math.sqrt(i * i + n * n), h = Math.abs(a) - Math.abs(Math.atan2(n, i)), l = Math.abs(a) + Math.abs(Math.atan2(n, i)), c = Math.abs(Math.cos(h) * r), u = Math.abs(Math.sin(l) * r);
            e.width = c, e.height = u;
            var d = e.getContext("2d");
            return d.translate(c / 2, u / 2), d.rotate(s), d.drawImage(o, -i / 2, -n / 2), t.useData = !1, 
            !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvas();
    }
}, Pixastic.Actions.sepia = {
    process: function(t) {
        var e = parseInt(t.options.mode, 10) || 0;
        if (0 > e && (e = 0), e > 1 && (e = 1), Pixastic.Client.hasCanvasImageData()) {
            var i = Pixastic.prepareData(t), n = t.options.rect, o = n.width, s = n.height, a = 4 * o, r = s;
            do {
                var h = (r - 1) * a, l = o;
                do {
                    var c = h + 4 * (l - 1);
                    if (e) var u = .299 * i[c] + .587 * i[c + 1] + .114 * i[c + 2], d = u + 39, f = u + 14, g = u - 36; else var p = i[c], m = i[c + 1], v = i[c + 2], d = .393 * p + .769 * m + .189 * v, f = .349 * p + .686 * m + .168 * v, g = .272 * p + .534 * m + .131 * v;
                    0 > d && (d = 0), d > 255 && (d = 255), 0 > f && (f = 0), f > 255 && (f = 255), 
                    0 > g && (g = 0), g > 255 && (g = 255), i[c] = d, i[c + 1] = f, i[c + 2] = g;
                } while (--l);
            } while (--r);
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.sepia2 = {
    process: function(t) {
        var e = parseInt(t.options.mode, 10) || 0;
        if (0 > e && (e = 0), e > 1 && (e = 1), Pixastic.Client.hasCanvasImageData()) {
            var i = Pixastic.prepareData(t), n = t.options.rect, o = n.width, s = n.height, a = 4 * o, r = s;
            do {
                var h = (r - 1) * a, l = o;
                do {
                    var c = h + 4 * (l - 1);
                    if (e) var u = .299 * i[c] + .587 * i[c + 1] + .114 * i[c + 2], d = u + 39, f = u + 14, g = u - 36; else var p = i[c], m = i[c + 1], v = i[c + 2], d = .593 * p + .069 * m + .089 * v, f = .249 * p + .586 * m + .068 * v, g = .372 * p + .434 * m + .031 * v;
                    0 > d && (d = 0), d > 255 && (d = 255), 0 > f && (f = 0), f > 255 && (f = 255), 
                    0 > g && (g = 0), g > 255 && (g = 255), i[c] = d, i[c + 1] = f, i[c + 2] = g;
                } while (--l);
            } while (--r);
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.sharpen = {
    process: function(t) {
        var e = 0;
        if (t.options.amount !== void 0 && (e = parseFloat(t.options.amount) || 0), 0 > e && (e = 0), 
        e > 1 && (e = 1), Pixastic.Client.hasCanvasImageData()) {
            for (var i = Pixastic.prepareData(t), n = Pixastic.prepareData(t, !0), o = 15, s = 1 + 3 * e, a = [ [ 0, -s, 0 ], [ -s, o, -s ], [ 0, -s, 0 ] ], r = 0, h = 0; 3 > h; h++) for (var l = 0; 3 > l; l++) r += a[h][l];
            r = 1 / r;
            var c = t.options.rect, u = c.width, d = c.height;
            o *= r, s *= r;
            var f = 4 * u, g = d;
            do {
                var p = (g - 1) * f, m = g == d ? g - 1 : g, v = 1 == g ? 0 : g - 2, y = v * f, C = m * f, w = u;
                do {
                    var P = p + (4 * w - 4), x = y + 4 * (1 == w ? 0 : w - 2), b = C + 4 * (w == u ? w - 1 : w), I = (-n[x] - n[P - 4] - n[P + 4] - n[b]) * s + n[P] * o, S = (-n[x + 1] - n[P - 3] - n[P + 5] - n[b + 1]) * s + n[P + 1] * o, A = (-n[x + 2] - n[P - 2] - n[P + 6] - n[b + 2]) * s + n[P + 2] * o;
                    0 > I && (I = 0), 0 > S && (S = 0), 0 > A && (A = 0), I > 255 && (I = 255), S > 255 && (S = 255), 
                    A > 255 && (A = 255), i[P] = I, i[P + 1] = S, i[P + 2] = A;
                } while (--w);
            } while (--g);
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.solarize = {
    process: function(t) {
        if (!(!t.options.average || "false" == t.options.average), Pixastic.Client.hasCanvasImageData()) {
            var e = Pixastic.prepareData(t), i = t.options.rect, n = i.width, o = i.height, s = 4 * n, a = o;
            do {
                var r = (a - 1) * s, h = n;
                do {
                    var l = r + 4 * (h - 1), c = e[l], u = e[l + 1], d = e[l + 2];
                    c > 127 && (c = 255 - c), u > 127 && (u = 255 - u), d > 127 && (d = 255 - d), e[l] = c, 
                    e[l + 1] = u, e[l + 2] = d;
                } while (--h);
            } while (--a);
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.threshold = {
    process: function(t) {
        if (Pixastic.Client.hasCanvasImageData()) {
            var e = Pixastic.prepareData(t), i = t.options.rect, n = t.options.high || 255, o = t.options.low || 0, s = t.options.threshold || 127;
            i.width, i.height;
            for (var a = 0; e.length > a; a += 4) {
                var r = e[a], h = e[a + 1], l = e[a + 2], c = .3 * r + .59 * h + .11 * l >= s ? n : o;
                e[a] = e[a + 1] = e[a + 2] = c, e[a + 3] = e[a + 3];
            }
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.threshold2 = {
    process: function(t) {
        if (Pixastic.Client.hasCanvasImageData()) {
            var e = Pixastic.prepareData(t), i = t.options.rect, n = t.options.high || 255, o = t.options.low || 0, s = t.options.threshold || 127;
            i.width, i.height;
            for (var a = !1, r = 0; e.length > r; r += 4) if (a === !1) {
                var h = e[r], l = e[r + 1], c = e[r + 2], u = .3 * h + .59 * l + .11 * c >= s ? n : o;
                e[r] = e[r + 1] = e[r + 2] = u, e[r + 3] = e[r + 3], a = !0;
            } else a = !1;
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.ghost = {
    process: function(t) {
        if (Pixastic.Client.hasCanvasImageData()) {
            var e = Pixastic.prepareData(t);
            t.options.rect;
            for (var i = 0; e.length > i; i += 4) {
                var n = e[i], o = e[i + 1], s = e[i + 2], a = e[i + 3];
                e[i] = n, e[i + 1] = o, e[i + 2] = s, e[i + 3] = Math.max(a - n, 0);
            }
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.ghost2 = {
    process: function(t) {
        if (Pixastic.Client.hasCanvasImageData()) {
            var e = Pixastic.prepareData(t), i = t.options.rect;
            t.options.high || 255, t.options.low || 0, t.options.threshold || 127, i.width, 
            i.height;
            for (var n = 0; e.length > n; n += 4) {
                var o = e[n], s = e[n + 1], a = e[n + 2], r = .3 * o + .59 * s + .11 * a;
                e[n] = Math.max(0, o - r + Math.floor(r / 2)), e[n + 1] = Math.max(0, s - r + Math.floor(r / 2)), 
                e[n + 2] = Math.max(0, a - r + Math.floor(r / 2)), e[n + 3] = Math.max(0, o);
            }
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}, Pixastic.Actions.unsharpmask = {
    process: function(t) {
        var e = parseFloat(t.options.amount) || 0, i = parseFloat(t.options.radius) || 0, n = parseFloat(t.options.threshold) || 0;
        e = Math.min(500, Math.max(0, e)) / 2, i = Math.min(5, Math.max(0, i)) / 10, n = Math.min(255, Math.max(0, n)), 
        n--;
        var o = -n;
        if (e *= .016, e++, Pixastic.Client.hasCanvasImageData()) {
            var s = t.options.rect, a = document.createElement("canvas");
            a.width = t.width, a.height = t.height;
            var r = a.getContext("2d");
            r.drawImage(t.canvas, 0, 0);
            var h = 2, l = Math.round(t.width / h), c = Math.round(t.height / h), u = document.createElement("canvas");
            u.width = l, u.height = c;
            for (var d = Math.round(20 * i), f = u.getContext("2d"), g = 0; d > g; g++) {
                var p = Math.max(1, Math.round(l - g)), m = Math.max(1, Math.round(c - g));
                f.clearRect(0, 0, l, c), f.drawImage(a, 0, 0, t.width, t.height, 0, 0, p, m), r.clearRect(0, 0, t.width, t.height), 
                r.drawImage(u, 0, 0, p, m, 0, 0, t.width, t.height);
            }
            var v = Pixastic.prepareData(t), y = Pixastic.prepareData({
                canvas: a,
                options: t.options
            }), C = s.width, w = s.height, P = 4 * C, x = w;
            do {
                var b = (x - 1) * P, I = C;
                do {
                    var S = b + (4 * I - 4), A = v[S] - y[S];
                    if (A > n || o > A) {
                        var T = y[S];
                        T = e * A + T, v[S] = T > 255 ? 255 : 0 > T ? 0 : T;
                    }
                    var k = v[S + 1] - y[S + 1];
                    if (k > n || o > k) {
                        var R = y[S + 1];
                        R = e * k + R, v[S + 1] = R > 255 ? 255 : 0 > R ? 0 : R;
                    }
                    var O = v[S + 2] - y[S + 2];
                    if (O > n || o > O) {
                        var N = y[S + 2];
                        N = e * O + N, v[S + 2] = N > 255 ? 255 : 0 > N ? 0 : N;
                    }
                } while (--I);
            } while (--x);
            return !0;
        }
    },
    checkSupport: function() {
        return Pixastic.Client.hasCanvasImageData();
    }
};

// source\components\base64.js
function StringBuffer() {
    this.buffer = [];
}

function Utf8EncodeEnumerator(t) {
    this._input = t, this._index = -1, this._buffer = [];
}

function Base64DecodeEnumerator(t) {
    this._input = t, this._index = -1, this._buffer = [];
}

StringBuffer.prototype.append = function(t) {
    return this.buffer.push(t), this;
}, StringBuffer.prototype.toString = function() {
    return this.buffer.join("");
};

var Base64 = {
    codex: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(t) {
        for (var e = new StringBuffer(), i = new Utf8EncodeEnumerator(t); i.moveNext(); ) {
            var n = i.current;
            i.moveNext();
            var o = i.current;
            i.moveNext();
            var s = i.current, r = n >> 2, a = (3 & n) << 4 | o >> 4, h = (15 & o) << 2 | s >> 6, l = 63 & s;
            isNaN(o) ? h = l = 64 : isNaN(s) && (l = 64), e.append(this.codex.charAt(r) + this.codex.charAt(a) + this.codex.charAt(h) + this.codex.charAt(l));
        }
        return "" + e;
    },
    decode: function(t) {
        for (var e = new StringBuffer(), i = new Base64DecodeEnumerator(t); i.moveNext(); ) {
            var n = i.current;
            if (128 > n) e.append(String.fromCharCode(n)); else if (n > 191 && 224 > n) {
                i.moveNext();
                var o = i.current;
                e.append(String.fromCharCode((31 & n) << 6 | 63 & o));
            } else {
                i.moveNext();
                var o = i.current;
                i.moveNext();
                var s = i.current;
                e.append(String.fromCharCode((15 & n) << 12 | (63 & o) << 6 | 63 & s));
            }
        }
        return "" + e;
    }
};

Utf8EncodeEnumerator.prototype = {
    current: Number.NaN,
    moveNext: function() {
        if (this._buffer.length > 0) return this.current = this._buffer.shift(), !0;
        if (this._index >= this._input.length - 1) return this.current = Number.NaN, !1;
        var t = this._input.charCodeAt(++this._index);
        return 13 == t && 10 == this._input.charCodeAt(this._index + 1) && (t = 10, this._index += 2), 
        128 > t ? this.current = t : t > 127 && 2048 > t ? (this.current = 192 | t >> 6, 
        this._buffer.push(128 | 63 & t)) : (this.current = 224 | t >> 12, this._buffer.push(128 | 63 & t >> 6), 
        this._buffer.push(128 | 63 & t)), !0;
    }
}, Base64DecodeEnumerator.prototype = {
    current: 64,
    moveNext: function() {
        if (this._buffer.length > 0) return this.current = this._buffer.shift(), !0;
        if (this._index >= this._input.length - 1) return this.current = 64, !1;
        var t = Base64.codex.indexOf(this._input.charAt(++this._index)), e = Base64.codex.indexOf(this._input.charAt(++this._index)), i = Base64.codex.indexOf(this._input.charAt(++this._index)), n = Base64.codex.indexOf(this._input.charAt(++this._index)), o = t << 2 | e >> 4, s = (15 & e) << 4 | i >> 2, r = (3 & i) << 6 | n;
        return this.current = o, 64 != i && this._buffer.push(s), 64 != n && this._buffer.push(r), 
        !0;
    }
};

// source\components\storage.js
enyo.kind({
    name: "STORAGE",
    kind: "Component",
    statics: {
        folderName: "blogWalker",
        blackberrySandbox: !1,
        downloadFile: function(t, e) {
            if (enyo.platform.firefoxOS || enyo.platform.chrome) return STORAGE.downloadFileFirefoxOS(t, e), 
            void 0;
            var i = t.substr(t.lastIndexOf(".")), n = encodeURI(t), o = "", r = 0;
            enyo.platform.blackberry && !STORAGE.blackberrySandbox ? (blackberry.io.sandbox = !1, 
            o = blackberry.io.sharedFolder + "/documents/", r = window.TEMPORARY) : enyo.platform.blackberry || (r = 1), 
            window.requestFileSystem(r, 10485760, function(t) {
                t.root.getDirectory(o + "TumblrPictures", {
                    create: !0
                }, function(t) {
                    t.getFile(e + i, {
                        create: !0,
                        exclusive: !1
                    }, function(t) {
                        var o = t.toURL().replace(e + i, ""), r = new FileTransfer();
                        t.remove(), r.download(n, o + e + i, function() {
                            TUMBLR.bannerMessageCallback("Picture Saved!");
                        }, function(t) {
                            console.log("download error source " + t.source), console.log("download error target " + t.target), 
                            console.log("upload error code: " + t.code);
                        }, !0);
                    }, STORAGE.errorHandler);
                }, STORAGE.errorHandler);
            }, STORAGE.errorHandler);
        },
        downloadFileFirefoxOS: function(t, e) {
            var i = new XMLHttpRequest({
                mozSystem: !0
            }), n = t.substr(t.lastIndexOf(".")), o = "image/" + (".jpg" == n ? "jpeg" : n.substr(1));
            i.open("GET", t, !0), i.responseType = "blob", i.onreadystatechange = function() {
                if (200 === i.status && 4 === i.readyState) {
                    var t = navigator.getDeviceStorage("pictures"), r = function() {
                        var r = new Blob([ i.response ], {
                            type: o
                        });
                        console.log(o);
                        var s = t.addNamed(r, "TumblrPictures/" + e + n);
                        s.onsuccess = function() {
                            TUMBLR.bannerMessageCallback("Picture Saved!"), console.log('File "' + e + '" successfully wrote on the pictures storage area');
                        }, s.onerror = function() {
                            console.log(this.error);
                        };
                    }, s = t["delete"]("TumblrPictures" + e + n);
                    s.onsuccess = function() {
                        console.log("File deleted"), r();
                    }, s.onerror = function() {
                        console.log("Unable to delete the file: ", this.error), r();
                    };
                }
            }, i.onerror = function() {
                STORAGE.errorHandler();
            }, i.send();
        },
        getFile: function(t) {
            if (!enyo.platform.blackberry && !enyo.platform.android && !enyo.platform.firefoxOS) return enyo.Signals.send("onReadFile", {
                filename: t,
                status: !0,
                text: STORAGE.get(t)
            }), void 0;
            var e = "", i = 0;
            enyo.platform.blackberry && !STORAGE.blackberrySandbox ? (blackberry.io.sandbox = !1, 
            e = blackberry.io.sharedFolder + "/documents/", i = window.TEMPORARY) : enyo.platform.blackberry || (i = 1), 
            window.requestFileSystem(i, 10485760, function(i) {
                i.root.getDirectory(e + STORAGE.folderName, {
                    create: !0
                }, function(e) {
                    var i = function(e) {
                        var i = new FileReader();
                        i.onloadend = function(e) {
                            enyo.Signals.send("onReadFile", {
                                filename: t,
                                status: !0,
                                text: e.target.result
                            });
                        }, i.readAsText(e);
                    }, n = function(t) {
                        i(t);
                    }, o = function() {
                        enyo.Signals.send("onReadFile", {
                            filename: t,
                            status: !1
                        });
                    }, r = function(t) {
                        t.file(n, o);
                    }, s = function() {
                        enyo.Signals.send("onReadFile", {
                            filename: t,
                            status: !1
                        });
                    };
                    e.getFile(t, {
                        create: !0
                    }, r, s);
                }, STORAGE.errorHandler);
            }, STORAGE.errorHandler);
        },
        getFileFirefoxOS: function(t) {
            var e = navigator.getDeviceStorage("sdcard"), i = e.get(STORAGE.folderName + "/" + t);
            i.onsuccess = function() {
                var e = new FileReader(), i = this.result;
                e.onloadend = function() {
                    enyo.Signals.send("onReadFile", {
                        filename: t,
                        status: !0,
                        text: e.result
                    }), console.log("Get the file: " + t);
                }, e.readAsText(i.slice());
            }, i.onerror = function() {
                enyo.Signals.send("onReadFile", {
                    filename: t,
                    status: !0
                }), console.warn("Unable to get the file: ", this.error);
            };
        },
        saveFile: function(t, e) {
            var i = "", n = 0;
            return enyo.platform.blackberry || enyo.platform.android || enyo.platform.firefoxOS ? (enyo.platform.blackberry && !STORAGE.blackberrySandbox ? (blackberry.io.sandbox = !1, 
            i = blackberry.io.sharedFolder + "/documents/", n = window.TEMPORARY) : enyo.platform.blackberry || (n = 1), 
            window.requestFileSystem(n, 10485760, function(n) {
                n.root.getDirectory(i + STORAGE.folderName, {
                    create: !0
                }, function(i) {
                    var n = function(i) {
                        i.onerror = STORAGE.errorHandler, i.onwriteend = function() {
                            i.onwriteend = function() {
                                enyo.Signals.send("onWriteFile", {
                                    status: !0,
                                    filename: t
                                });
                            }, i.write(e);
                        }, i.truncate(0);
                    }, o = function(e) {
                        enyo.Signals.send("onWriteFile", {
                            filename: t,
                            status: !1,
                            error: e
                        });
                    }, r = function(t) {
                        t.createWriter(n, o);
                    }, s = function(e) {
                        enyo.Signals.send("onWriteFile", {
                            filename: t,
                            status: !1,
                            error: e
                        });
                    };
                    i.getFile(t, {
                        create: !0
                    }, r, s);
                }, STORAGE.errorHandler);
            }, STORAGE.errorHandler), void 0) : (STORAGE.set(t, e), enyo.Signals.send("oWriteFile", {
                filename: t,
                status: !0
            }), void 0);
        },
        saveFileFirefoxOS: function(t, e) {
            var i = navigator.getDeviceStorage("sdcard"), n = function() {
                var n = new Blob([ e ], {
                    type: "text/plain"
                }), o = i.addNamed(n, STORAGE.folderName + "/" + t);
                o.onsuccess = function() {
                    this.result, enyo.Signals.send("onWriteFile", {
                        status: !0,
                        filename: t
                    }), console.log('File "' + t + '" successfully wrote on the sdcard storage area');
                }, o.onerror = function() {
                    enyo.Signals.send("onWriteFile", {
                        filename: t,
                        status: !1,
                        error: this.error
                    });
                };
            }, o = i["delete"](STORAGE.folderName + "/" + t);
            o.onsuccess = function() {
                console.log("File deleted"), n();
            }, o.onerror = function() {
                console.log("Unable to delete the file: " + this.error), n();
            };
        },
        set: function(t, e) {
            try {
                localStorage.setItem(t, e);
            } catch (i) {
                console.log("Locale storage error");
            }
        },
        get: function(t) {
            var e = localStorage.getItem(t);
            return "true" == e && (e = !0), "false" == e && (e = !1), e;
        },
        del: function(t) {
            localStorage.removeItem(t);
        },
        saveExploreItems: function(t) {
            enyo.platform.android || enyo.platform.blackberry ? STORAGE.saveFile("blogWalker.explore", t) : enyo.platform.firefoxOS ? STORAGE.saveFileFirefoxOS("blogWalker.explore", t) : STORAGE.set("explore", t);
        },
        saveBlogExploreItems: function(t) {
            enyo.platform.android || enyo.platform.blackberry ? STORAGE.saveFile("blogWalker.blog", t) : enyo.platform.firefoxOS ? STORAGE.saveFileFirefoxOS("blogWalker.blog", t) : STORAGE.set("blogexplore", t);
        },
        saveDashItems: function(t) {
            enyo.platform.android || enyo.platform.blackberry ? STORAGE.saveFile("blogWalker.dash", t) : enyo.platform.firefoxOS ? STORAGE.saveFileFirefoxOS("blogWalker.dash", t) : STORAGE.set("dash", t);
        },
        saveTmpItems: function(t) {
            enyo.platform.android || enyo.platform.blackberry ? STORAGE.saveFile("blogWalker.tmp", t) : enyo.platform.firefoxOS ? STORAGE.saveFileFirefoxOS("blogWalker.tmp", t) : STORAGE.set("tmp", t);
        },
        saveFavoritesItems: function(t) {
            enyo.platform.android || enyo.platform.blackberry ? STORAGE.saveFile("blogWalker.favorites", t) : enyo.platform.firefoxOS ? STORAGE.saveFileFirefoxOS("blogWalker.favorites", t) : STORAGE.set("favs", t);
        },
        saveCategoriesItems: function(t) {
            enyo.platform.android || enyo.platform.blackberry ? STORAGE.saveFile("blogWalker.categories", t) : enyo.platform.firefoxOS ? STORAGE.saveFileFirefoxOS("blogWalker.categories", t) : STORAGE.set("cats", t);
        },
        readFileExplore: function() {
            enyo.platform.android || enyo.platform.blackberry ? STORAGE.getFile("blogWalker.explore") : enyo.platform.firefoxOS ? STORAGE.getFileFirefoxOS("blogWalker.explore") : enyo.Signals.send("onReadFile", {
                filename: "blogWalker.explore",
                text: STORAGE.get("explore"),
                status: !0
            });
        },
        readFileDash: function() {
            enyo.platform.android || enyo.platform.blackberry ? STORAGE.getFile("blogWalker.dash") : enyo.platform.firefoxOS ? STORAGE.getFileFirefoxOS("blogWalker.dash") : enyo.Signals.send("onReadFile", {
                filename: "blogWalker.dash",
                text: STORAGE.get("dash"),
                status: !0
            });
        },
        readFileTmp: function() {
            enyo.platform.android || enyo.platform.blackberry ? STORAGE.getFile("blogWalker.tmp") : enyo.platform.firefoxOS ? STORAGE.getFileFirefoxOS("blogWalker.tmp") : enyo.Signals.send("onReadFile", {
                filename: "blogWalker.tmp",
                text: STORAGE.get("tmp"),
                status: !0
            });
        },
        readFileBlogExplore: function() {
            enyo.platform.android || enyo.platform.blackberry ? STORAGE.getFile("blogWalker.blog") : enyo.platform.firefoxOS ? STORAGE.getFileFirefoxOS("blogWalker.blog") : enyo.Signals.send("onReadFile", {
                filename: "blogWalker.blog",
                text: STORAGE.get("blogexplore"),
                status: !0
            });
        },
        readFileFavorites: function() {
            if (enyo.platform.android || enyo.platform.blackberry) {
                if ("7" != STORAGE.get("favBB")) return STORAGE.getFileInfo("blogWalker.favorites"), 
                STORAGE.set("favBB", "7"), void 0;
                STORAGE.getFile("blogWalker.favorites");
            } else enyo.platform.firefoxOS ? STORAGE.getFileFirefoxOS("blogWalker.favorites") : enyo.Signals.send("onReadFile", {
                filename: "blogWalker.favorites",
                text: STORAGE.get("favs"),
                status: !0
            });
        },
        readFileCategories: function() {
            if (enyo.platform.android || enyo.platform.blackberry) {
                if ("7" != STORAGE.get("catBB")) return STORAGE.getFileInfo("blogWalker.categories"), 
                STORAGE.set("catBB", "7"), void 0;
                STORAGE.getFile("blogWalker.categories");
            } else enyo.platform.firefoxOS ? STORAGE.getFileFirefoxOS("blogWalker.categories") : enyo.Signals.send("onReadFile", {
                filename: "blogWalker.categories",
                text: STORAGE.get("cats"),
                status: !0
            });
        },
        postBackupFirefoxOS: function(t) {
            var e = navigator.getDeviceStorage("sdcard"), i = 0, n = function() {
                i++, t[i] && o(t[i]);
            }, o = function(t) {
                var i = t.file;
                i = enyo.json.stringify(i), i = PEEK.string.toBase64(i);
                var o = new Blob([ i ], {
                    type: "text/plain"
                }), r = e.addNamed(o, STORAGE.folderName + "/postbackup/" + t.file_name);
                r.onsuccess = function() {
                    this.result, console.log('File "' + t.file_name + '" successfully wrote on the sdcard storage area'), 
                    setTimeout(function() {
                        n();
                    }, 500);
                }, r.onerror = function() {
                    console.log(this.error), setTimeout(function() {
                        n();
                    }, 500);
                };
            };
            o(t[i]);
        },
        PROCESS_POST_BACKUP: function(t) {
            if (enyo.platform.firefoxOS) return STORAGE.postBackupFirefoxOS(t), void 0;
            var e = "", i = 0;
            enyo.platform.blackberry && !STORAGE.blackberrySandbox ? (blackberry.io.sandbox = !1, 
            e = blackberry.io.sharedFolder + "/documents/", i = window.TEMPORARY) : enyo.platform.blackberry || (i = 1);
            var n = 0, o = {}, r = function(e) {
                console.error(e.code + ", " + n + ", " + t[n]);
            }, s = function() {
                var e = function(t) {
                    t.createWriter(s, r);
                }, i = function() {
                    t[n] && o.getFile(t[n].file_name, {
                        create: !0
                    }, e, r);
                }, s = function(e) {
                    e.onwriteend = function() {
                        n++, setTimeout(function() {
                            i();
                        }, 500);
                    };
                    var o = t[n].file;
                    o = enyo.json.stringify(o), o = PEEK.string.toBase64(o), e.write(o);
                };
                i();
            }, a = function(t) {
                var i = function(t) {
                    o = t, s();
                };
                t.root.getDirectory(e + STORAGE.folderName + "/postbackup", {
                    create: !0,
                    exclusive: !1
                }, i, r);
            };
            window.requestFileSystem(i, 10485760, a, r);
        },
        loadPostFileFirefoxOS: function(t, e) {
            var i = navigator.getDeviceStorage("sdcard"), n = i.get(STORAGE.folderName + "/postbackup/" + t);
            n.onsuccess = function() {
                var i = new FileReader(), n = this.result;
                i.onloadend = function() {
                    var n = i.result;
                    n = PEEK.string.fromBase64(n), n = enyo.json.parse(n), e({
                        file: n
                    }), console.log("Get the file: " + t);
                }, i.readAsText(n.slice());
            }, n.onerror = function() {
                console.warn("Unable to get the file: " + this.error), e();
            };
        },
        LOAD_POST_FILE: function(t, e) {
            if (enyo.platform.firefoxOS) return STORAGE.loadPostFileFirefoxOS(t, e), void 0;
            var i = "", n = 0;
            enyo.platform.blackberry && !STORAGE.blackberrySandbox ? (blackberry.io.sandbox = !1, 
            i = blackberry.io.sharedFolder + "/documents/", n = window.TEMPORARY) : enyo.platform.blackberry || (n = 1);
            var o = {}, r = function(e) {
                console.error(e.code + ", " + t + ", " + e.message + ", " + e.msg);
            }, s = function() {
                var i = function(t) {
                    t.file(n, r);
                }, n = function(t) {
                    s(t);
                }, s = function(t) {
                    var i = new FileReader();
                    i.onloadend = function(t) {
                        var i = t.target.result;
                        i = PEEK.string.fromBase64(i), i = enyo.json.parse(i), e({
                            file: i
                        });
                    }, i.readAsText(t);
                };
                o.getFile(t, {
                    create: !1
                }, i, r);
            }, a = function(t) {
                var e = function(t) {
                    o = t, s();
                };
                t.root.getDirectory(i + STORAGE.folderName + "/postbackup", {
                    create: !0,
                    exclusive: !1
                }, e, r);
            };
            window.requestFileSystem(n, 10485760, a, r);
        },
        deleteBackupDataFirefoxOS: function() {
            var t = navigator.getDeviceStorage("sdcard"), e = t.enumerate(STORAGE.folderName + "/postbackup"), i = [], n = 0, o = function() {
                n++, i[n] && r();
            }, r = function() {
                t["delete"](STORAGE.folderName + "/postbackup/" + i[n]), console.log("deleted " + i[n]), 
                o();
            };
            e.onsuccess = function() {
                this.result ? (i.push(this.result.name), this.done ? (console.log(i), r()) : this["continue"]()) : (console.log(i), 
                r());
            };
        },
        DELETE_BACKUP_DATA: function() {
            if (enyo.platform.firefoxOS) return STORAGE.deleteBackupDataFirefoxOS(), void 0;
            if (enyo.platform.android || enyo.platform.blackberry) {
                var t = "", e = 0;
                enyo.platform.blackberry && !STORAGE.blackberrySandbox ? (blackberry.io.sandbox = !1, 
                t = blackberry.io.sharedFolder + "/documents/", e = window.TEMPORARY) : enyo.platform.blackberry || (e = 1);
                var i = function(t) {
                    console.error(t.code);
                }, n = function(e) {
                    var n = function(t) {
                        t.removeRecursively(function() {}, function() {});
                    };
                    e.root.getDirectory(t + STORAGE.folderName + "/postbackup", {
                        create: !0,
                        exclusive: !1
                    }, n, i);
                };
                window.requestFileSystem(e, 0, n, i);
            }
        },
        gotFileSystem: function(t) {
            t.root.getDirectory("blogWalker", {
                create: !0,
                exclusive: !1
            }, STORAGE.gotDirectoryEntry, STORAGE.failDirectoryEntry);
        },
        failDirectoryEntry: function() {},
        gotDirectoryEntry: function(t) {
            STORAGE.DirReader_BlogWalker = t, STORAGE.getFileInfo(STORAGE.file);
        },
        DirReader_BlogWalker: null,
        loadDirReader: function() {
            (enyo.platform.android || enyo.platform.blackberry) && window.requestFileSystem(1, 0, STORAGE.gotFileSystem, STORAGE.failFileSystem);
        },
        getFileInfo: function(t) {
            if (STORAGE.file = t, null === STORAGE.DirReader_BlogWalker) return STORAGE.loadDirReader(), 
            void 0;
            var e = function(e) {
                var i = new FileReader();
                i.onloadend = function(e) {
                    enyo.Signals.send("onReadFile", {
                        filename: t,
                        status: !0,
                        text: e.target.result
                    });
                }, i.readAsText(e);
            }, i = function(t) {
                e(t);
            }, n = function(e) {
                console.error("GET FILE ERROR " + t + " " + e.code), enyo.Signals.send("onReadFile", {
                    filename: t,
                    status: !1
                });
            }, o = function(e) {
                e.file(i, n), enyo.Signals.send("onReadFileEntry", {
                    filename: t,
                    status: !0
                });
            }, r = function(e) {
                console.error("GET READ FILE ENTRY ERROR " + t + " " + e.code + "," + e.message), 
                enyo.Signals.send("onReadFile", {
                    filename: t,
                    status: !1
                });
            };
            STORAGE.DirReader_BlogWalker.getFile(t, {
                create: !0,
                exclusive: !1
            }, o, r);
        },
        errorHandler: function(t) {
            var e = "";
            switch (t.code) {
              case FileError.QUOTA_EXCEEDED_ERR:
                e = "QUOTA_EXCEEDED_ERR";
                break;

              case FileError.NOT_FOUND_ERR:
                e = "NOT_FOUND_ERR";
                break;

              case FileError.SECURITY_ERR:
                e = "SECURITY_ERR";
                break;

              case FileError.INVALID_MODIFICATION_ERR:
                e = "INVALID_MODIFICATION_ERR";
                break;

              case FileError.INVALID_STATE_ERR:
                e = "INVALID_STATE_ERR";
                break;

              case FileError.NO_MODIFICATION_ALLOWED_ERR:
                e = "NO_MODIFICATION_ALLOWED_ERR";
                break;

              default:
                e = "Unknown Error";
            }
            alert("File System Access Error: " + e);
        }
    }
});

// source\enyodomext.js
enyo.dom.getKeyframesPrefix = function() {
    return enyo.dom._keyframesPrefix ? enyo.dom._keyframesPrefix : (enyo.dom._keyframesPrefix = enyo.platform.firefox || enyo.platform.androidFirefox || enyo.platform.firefoxOS ? "-moz-" : enyo.platform.android || enyo.platform.ios || enyo.platform.androidChrome || enyo.platform.webos || enyo.platform.safari || enyo.platform.chrome || enyo.platform.blackberry ? "-webkit-" : "", 
    enyo.dom._keyframesPrefix);
}, enyo.dom.getAnimationEvent = function(t) {
    var e = enyo.dom.getKeyframesPrefix();
    return "-moz-" == e && (e = ""), e = e.replace(/-/gi, ""), e + t;
}, enyo.dom.findKeyframes = function(t) {
    var e = document.styleSheets, n = enyo.dom.getKeyframesPrefix().replace(/-/gi, "").toUpperCase();
    0 !== n.length && (n += "_");
    for (var i = 0; e.length > i; ++i) for (var o = 0; e[i].cssRules.length > o; ++o) if (e[i].cssRules[o].type == window.CSSRule[n + "KEYFRAMES_RULE"] && e[i].cssRules[o].name == t) return e[i].cssRules[o];
    return null;
}, enyo.dom.foundPrefixes = [], enyo.dom.getCSSPrefix = function(t, e) {
    var n = 0;
    for (n = 0; enyo.dom.foundPrefixes.length > n; n++) if (enyo.dom.foundPrefixes[n].cssRule == t) return enyo.dom.foundPrefixes[n].fullRule;
    var i = [ "", "-webkit-", "-moz-", "-ms-", "-o-" ], o = [ "", "webkit", "moz", "ms", "o" ];
    for (n = 0; i.length > n; n++) if (document.body.style[o[n] + (1 > o[n].length ? enyo.uncap(e) : enyo.cap(e))] !== void 0) return enyo.dom.foundPrefixes.push({
        cssRule: t,
        fullRule: i[n] + t
    }), i[n] + t;
}, enyo.dom.changeKeyframes = function(t, e) {
    var n = enyo.dom.findKeyframes(t);
    if (n) {
        var i = [], o = 0;
        for (o = 0; length > o; o++) i.push(n[o].keyText);
        for (o = 0; i.length > o; o++) n.deleteRule(i[o]);
        for (o = 0; e.length > o; o++) n.insertRule(e[o].keyText + " " + e[o].keyValue);
        return t;
    }
    return null;
}, enyo.dom.createKeyframes = function(t, e) {
    var n = "@" + enyo.dom.getKeyframesPrefix() + "keyframes " + t + " { ";
    for (i = 0; e.length > i; i++) n += e[i].keyText + " " + e[i].keyValue;
    if (n += " }", document.styleSheets && document.styleSheets.length) document.styleSheets[0].insertRule(n, 0); else {
        var o = document.createElement("style");
        o.innerHTML = n, document.getElementsByTagName("head")[0].appendChild(o);
    }
}, enyo.dom.createCssRule = function(t) {
    if (document.styleSheets && document.styleSheets.length) document.styleSheets[0].insertRule(t, 0); else {
        var e = document.createElement("style");
        e.innerHTML = t, document.getElementsByTagName("head")[0].appendChild(e);
    }
}, enyo.dom.deleteCssRule = function(t) {
    for (var e = document.styleSheets, n = 0; e.length > n; ++n) for (var i = 0; e[n].cssRules.length > i; ++i) if (e[n].cssRules[i].selectorText == t) return e[n].deleteRule(i), 
    void 0;
    return null;
}, enyo.dom.deleteKeyframes = function(t) {
    var e = document.styleSheets, n = enyo.dom.getKeyframesPrefix().replace(/-/gi, "").toUpperCase();
    0 !== n.length && (n += "_");
    for (var i = 0; e.length > i; ++i) for (var o = 0; e[i].cssRules.length > o; ++o) if (e[i].cssRules[o].type == window.CSSRule[n + "KEYFRAMES_RULE"] && e[i].cssRules[o].name == t) return e[i].deleteRule(o);
    return null;
}, enyo.dom.showKeyboard = function(t, e) {
    setTimeout(function() {
        t.focus(), enyo.platform.android && cordova.plugins.SoftKeyboard.show(function() {}, function() {}), 
        setTimeout(function() {
            e.resized();
        }, 200);
    }, 500);
}, enyo.dom.hideKeyboard = function(t, e) {
    t.hasNode().blur(), enyo.platform.android && cordova.plugins.SoftKeyboard.hide(function() {}, function() {}), 
    setTimeout(function() {
        e.resized();
    }, 200);
}, enyo.dom.canUseEnter = function() {
    return enyo.platform.androidChrome || enyo.platform.blackberry || enyo.platform.firefoxOS || enyo.platform.chrome ? !0 : !1;
};

// source\general.js
var WND_WIDTH = function() {
    return enyo.dom.getWindowWidth();
}, WND_HEIGHT = function() {
    return enyo.dom.getWindowHeight();
}, GET_IMAGE_SIZE = function() {
    var t = WND_WIDTH() - 14;
    return t > 614 && (t = 600), t;
}, LIMIT_TEXT_LENGTH = function(t, e, n) {
    if (!t || void 0 === t || "" === t) return "";
    var i = e || WND_WIDTH(), o = n || "...";
    return i >= 700 ? t : 700 > i && i >= 600 ? (t.length > 35 && (t = t.substr(0, 35) + o), 
    t) : 600 > i && i >= 500 ? (t.length > 30 && (t = t.substr(0, 30) + o), t) : 500 > i && i >= 400 ? (t.length > 25 && (t = t.substr(0, 25) + o), 
    t) : 400 > i && i >= 350 ? (t.length > 20 && (t = t.substr(0, 20) + o), t) : i > 200 && 350 > i ? (t.length > 12 && (t = t.substr(0, 12) + o), 
    t) : 201 > i ? (t.length > 9 && (t = t.substr(0, 9) + o), t) : void 0;
}, onStart = function() {};

DATE_FORMAT = function(t, e) {
    var n = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ], i = [ "Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec" ], o = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ], r = [ "Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat" ], s = e, a = t;
    return s ? (s = s.replace("yyyy", a.getFullYear()), s = s.replace("mmmm", n[a.getMonth()]), 
    s = s.replace("mmm", i[a.getMonth()]), s = s.replace("mm", ZEROPADDER(a.getMonth() + 1)), 
    s = s.replace("dddd", o[a.getDay()]), s = s.replace("ddd", r[a.getDay()]), s = s.replace("dd", ZEROPADDER(a.getDate())), 
    s = s.replace("hh", ZEROPADDER((h = a.getHours() % 12) ? h : 12)), s = s.replace("nn", ZEROPADDER(a.getMinutes())), 
    s = s.replace("ss", ZEROPADDER(a.getSeconds())), s = s.replace("a/p", 12 > a.getHours() ? "am" : "pm"), 
    s = s.replace("A/P", 12 > a.getHours() ? "AM" : "PM")) : "";
};

var DATE_ADD = function(t, e, n) {
    switch (e) {
      case "months":
        t.setMonth(parseInt(t.getMonth()) + parseInt(n));
        break;

      case "days":
        t.setDate(parseInt(t.getDate()) + parseInt(n));
        break;

      case "weeks":
        t.setDate(parseInt(t.getDate()) + parseInt(7 * n));
        break;

      case "years":
        t.setFullYear(parseInt(t.getFullYear()) + parseInt(n));
        break;

      case "hours":
        t.setHours(parseInt(t.getHours()) + parseInt(n));
        break;

      case "minutes":
        t.setMinutes(parseInt(t.getMinutes()) + parseInt(n));
    }
    return t;
};

ZEROPADDER = function(t) {
    var e = "" + t;
    return 2 > e.length && (e = "0" + e), e;
};

var PEEK = {
    string: {
        toBase64: function(t) {
            return Base64.encode(t);
        },
        fromBase64: function(t) {
            return Base64.decode(t);
        }
    }
};

PEEK.byId = function(t, e) {
    return "string" == typeof t ? (e || document).getElementById(t) : t;
}, CanvasRenderingContext2D.prototype.roundRect = function(t, e, n, i, o, r, s) {
    var a = {
        upperLeft: 10,
        upperRight: 10,
        lowerLeft: 10,
        lowerRight: 10
    };
    if (s === void 0 && (s = !0), "object" == typeof o) for (var h in o) a[h] = o[h];
    this.beginPath(), this.moveTo(t + a.upperLeft, e), this.lineTo(t + n - a.upperRight, e), 
    this.quadraticCurveTo(t + n, e, t + n, e + a.upperRight), this.lineTo(t + n, e + i - a.lowerRight), 
    this.quadraticCurveTo(t + n, e + i, t + n - a.lowerRight, e + i), this.lineTo(t + a.lowerLeft, e + i), 
    this.quadraticCurveTo(t, e + i, t, e + i - a.lowerLeft), this.lineTo(t, e + a.upperLeft), 
    this.quadraticCurveTo(t, e, t + a.upperLeft, e), this.closePath(), s && this.stroke(), 
    r && this.fill();
};

// source\components\listoftags.js
var TAG_LIST = [ "Advertising", "Animals", "Architecture", "Art", "Basketball", "Black and White", "Cars", "Celebs", "Comics", "Crafts", "Design", "DIY", "Education", "Election 2012", "Fashion", "Film", "Food", "Football", "Gaming", "GIF", "History", "Illustration", "Interiors", "Landscape", "Lit", "LOL", "Long Reads", "Makeup", "Menswear", "Nail Art", "News", "NFL", "Poetry", "Politics", "Portrait", "Prose", "Robots", "Sailing", "Science", "Sports", "Storyboard", "Tattoos", "Tech", "Television", "Typography", "Vintage", "pets", "cute", "weimaraner", "basset hound", "dog", "sugar glider", "pet", "dogs", "diet", "weight loss", "cool", "happy", "sad", "rofl", "corny", "lmao", "green", "blue", "white", "yellow", "orange", "red", "games", "game", "running", "sleeping", "sleepy", "laughing", "smile", "smiling", "instagram", "photo", "music", "song", "sing", "singing", "trouble", "kite", "jump", "action", "movie", "movies", "youtube", "zebra", "cow", "chicken", "horse", "cat", "cats", "bird", "birds", "fishing", "skiing", "surfing", "soak", "soaking", "water", "lab", "webos", "enyo", "awesome", "facebook", "phone", "phones", "help", "tumblr", "adorable", "adventurous", "aggressive", "alert", "attractive", "average", "beautiful", "blue-eyed", "bloody", "blushing", "bright", "clean", "clear", "cloudy", "colorful", "crowded", "cute", "dark", "drab", "distinct", "dull", "elegant", "excited", "fancy", "filthy", "glamorous", "gleaming", "gorgeous", "graceful", "grotesque", "handsome", "homely", "light", "long", "magnificent", "misty", "motionless", "muddy", "old-fashioned", "plain", "poised", "precious", "quaint", "shiny", "smoggy", "sparkling", "spotless", "stormy", "strange", "ugly", "ugliest", "unsightly", "unusual", "wide-eyed", "alive", "annoying", "bad", "better", "beautiful", "brainy", "breakable", "busy", "careful", "cautious", "clever", "clumsy", "concerned", "crazy", "curious", "dead", "different", "difficult", "doubtful", "easy", "expensive", "famous", "fragile", "frail", "gifted", "helpful", "helpless", "horrible", "important", "impossible", "inexpensive", "innocent", "inquisitive", "modern", "mushy", "odd", "open", "outstanding", "poor", "powerful", "prickly", "puzzled", "real", "rich", "shy", "sleepy", "stupid", "super", "talented", "tame", "tender", "tough", "uninterested", "vast", "wandering", "wild", "wrong", "angry", "annoyed", "anxious", "arrogant", "ashamed", "awful", "bad", "bewildered", "black", "blue", "bored", "clumsy", "combative", "condemned", "confused", "crazy", "flipped-out", "creepy", "cruel", "dangerous", "defeated", "defiant", "depressed", "disgusted", "disturbed", "dizzy", "dull", "embarrassed", "envious", "evil", "fierce", "foolish", "frantic", "frightened", "grieving", "grumpy", "helpless", "homeless", "hungry", "hurt", "ill", "itchy", "jealous", "jittery", "lazy", "lonely", "mysterious", "nasty", "naughty", "nervous", "nutty", "obnoxious", "outrageous", "panicky", "repulsive", "scary", "selfish", "sore", "tense", "terrible", "testy", "thoughtless", "tired", "troubled", "upset", "uptight", "weary", "wicked", "worried", "agreeable", "amused", "brave", "calm", "charming", "cheerful", "comfortable", "cooperative", "courageous", "delightful", "determined", "eager", "elated", "enchanting", "encouraging", "energetic", "enthusiastic", "excited", "exuberant", "fair", "faithful", "fantastic", "fine", "friendly", "funny", "gentle", "glorious", "good", "happy", "healthy", "helpful", "hilarious", "jolly", "joyous", "kind", "lively", "lovely", "lucky", "nice", "obedient", "perfect", "pleasant", "proud", "relieved", "silly", "smiling", "splendid", "successful", "thankful", "thoughtful", "victorious", "vivacious", "witty", "wonderful", "zealous", "zany", "broad", "chubby", "crooked", "curved", "deep", "flat", "high", "hollow", "low", "narrow", "round", "shallow", "skinny", "square", "steep", "straight", "wide", "big", "colossal", "fat", "gigantic", "great", "huge", "immense", "large", "little", "mammoth", "massive", "miniature", "petite", "puny", "scrawny", "short", "small", "tall", "teeny", "teeny-tiny", "tiny", "cooing", "deafening", "faint", "harsh", "high-pitched", "hissing", "hushed", "husky", "loud", "melodic", "moaning", "mute", "noisy", "purring", "quiet", "raspy", "resonant", "screeching", "shrill", "silent", "soft", "squealing", "thundering", "voiceless", "whispering", "ancient", "brief", "Early", "fast", "late", "long", "modern", "old", "old-fashioned", "quick", "rapid", "short", "slow", "swift", "young", "bitter", "delicious", "fresh", "juicy", "ripe", "rotten", "salty", "sour", "spicy", "stale", "sticky", "strong", "sweet", "tart", "tasteless", "tasty", "thirsty", "fluttering", "fuzzy", "greasy", "grubby", "hard", "hot", "icy", "loose", "melted", "nutritious", "plastic", "prickly", "rainy", "rough", "scattered", "shaggy", "shaky", "sharp", "shivering", "silky", "slimy", "slippery", "smooth", "soft", "solid", "steady", "sticky", "tender", "tight", "uneven", "weak", "wet", "wooden", "yummy", "boiling", "breezy", "broken", "bumpy", "chilly", "cold", "cool", "creepy", "crooked", "cuddly", "curly", "damaged", "damp", "dirty", "dry", "dusty", "filthy", "flaky", "fluffy", "freezing", "hot", "warm", "wet", "abundant", "empty", "few", "heavy", "light", "many", "numerous", "substantial", "aboard", "about", "above", "absent", "across", "after", "against", "along", "alongside", "amid", "amidst", "among", "around", "before", "behind", "below", "beneath", "beside", "between", "despite", "down", "opposite", "outside", "over", "past", "plus", "regarding", "round", "save", "since", "than", "through", "throughout", "till", "times", "toward", "under", "underneath", "until", "up", "upon", "with", "within", "without", "aardvark", "abyssinian", "accelerator", "accordion", "account", "accountant", "acknowledgment", "acoustic", "acrylic", "act", "action", "active", "activity", "actor", "actress", "adapter", "addition", "address", "adjustment", "adult", "advantage", "advertisement", "advice", "afghanistan", "africa", "aftermath", "afternoon", "aftershave", "afterthought", "age", "agenda", "agreement", "air", "airbus", "airmail", "airplane", "airport", "airship", "alarm", "albatross", "alcohol", "algebra", "algeria", "alibi", "alley", "alligator", "alloy", "almanac", "alphabet", "alto", "aluminium", "aluminum", "ambulance", "america", "amount", "amusement", "anatomy", "anethesiologist", "anger", "angle", "angora", "animal", "anime", "ankle", "answer", "ant", "antarctica", "anteater", "antelope", "anthony", "anthropology", "apartment", "apology", "apparatus", "apparel", "appeal", "appendix", "apple", "appliance", "approval", "april", "aquarius", "arch", "archaeology", "archeology", "archer", "architecture", "area", "argentina", "argument", "aries", "arithmetic", "arm", "armadillo", "armchair", "armenian", "army", "arrow", "art", "ash", "ashtray", "asia", "asparagus", "asphalt", "asterisk", "astronomy", "athlete", "atm", "atom", "attack", "attempt", "attention", "attic", "attraction", "august", "aunt", "australia", "australian", "author", "authorisation", "authority", "authorization", "avenue", "babies", "baboon", "baby", "back", "backbone", "bacon", "badge", "badger", "bag", "bagel", "bagpipe", "bail", "bait", "baker", "bakery", "balance", "balinese", "ball", "balloon", "bamboo", "banana", "band", "bandana", "bangladesh", "bangle", "banjo", "bank", "bankbook", "banker", "bar", "barbara", "barber", "barge", "baritone", "barometer", "base", "baseball", "basement", "basin", "basket", "basketball", "bass", "bassoon", "bat", "bath", "bathroom", "bathtub", "battery", "battle", "bay", "beach", "bead", "beam", "bean", "bear", "beard", "beast", "beat", "beautician", "beauty", "beaver", "bed", "bedroom", "bee", "beech", "beef", "beer", "beet", "beetle", "beggar", "beginner", "begonia", "behavior", "belgian", "belief", "believe", "bell", "belt", "bench", "bengal", "beret", "berry", "bestseller", "betty", "bibliography", "bicycle", "bike", "bill", "billboard", "biology", "biplane", "birch", "bird", "birth", "birthday", "bit", "bite", "black", "bladder", "blade", "blanket", "blinker", "blizzard", "block", "blood", "blouse", "blow", "blowgun", "blue", "board", "boat", "bobcat", "body", "bolt", "bomb", "bomber", "bone", "bongo", "bonsai", "book", "bookcase", "booklet", "boot", "border", "botany", "bottle", "bottom", "boundary", "bow", "bowl", "bowling", "box", "boy", "bra", "brace", "bracket", "brain", "brake", "branch", "brand", "brandy", "brass", "brazil", "bread", "break", "breakfast", "breath", "brian", "brick", "bridge", "british", "broccoli", "brochure", "broker", "bronze", "brother", "brother-in-law", "brow", "brown", "brush", "bubble", "bucket", "budget", "buffer", "buffet", "bugle", "building", "bulb", "bull", "bulldozer", "bumper", "bun", "burglar", "burma", "burn", "burst", "bus", "bush", "business", "butane", "butcher", "butter", "button", "buzzard", "cabbage", "cabinet", "cable", "cactus", "cafe", "cake", "calculator", "calculus", "calendar", "calf", "call", "camel", "camera", "camp", "can", "canada", "canadian", "cancer", "candle", "cannon", "canoe", "canvas", "cap", "capital", "cappelletti", "capricorn", "captain", "caption", "car", "caravan", "carbon", "card", "cardboard", "cardigan", "care", "carnation", "carol", "carp", "carpenter", "carriage", "carrot", "cart", "cartoon", "case", "cast", "castanet", "cat", "catamaran", "caterpillar", "cathedral", "catsup", "cattle", "cauliflower", "cause", "caution", "cave", "c-clamp", "cd", "ceiling", "celery", "celeste", "cell", "cellar", "cello", "celsius", "cement", "cemetery", "cent", "centimeter", "century", "ceramic", "cereal", "certification", "chain", "chair", "chalk", "chance", "change", "channel", "character", "chard", "charles", "chauffeur", "check", "cheek", "cheese", "cheetah", "chef", "chemistry", "cheque", "cherries", "cherry", "chess", "chest", "chick", "chicken", "chicory", "chief", "child", "children", "chill", "chime", "chimpanzee", "chin", "china", "chinese", "chive", "chocolate", "chord", "christmas", "christopher", "chronometer", "church", "cicada", "cinema", "circle", "circulation", "cirrus", "citizenship", "city", "clam", "clarinet", "class", "claus", "clave", "clef", "clerk", "click", "client", "climb", "clipper", "cloakroom", "clock", "close", "closet", "cloth", "cloud", "cloudy", "clover", "club", "clutch", "coach", "coal", "coast", "coat", "cobweb", "cockroach", "cocktail", "cocoa", "cod", "coffee", "coil", "coin", "coke", "cold", "collar", "college", "collision", "colombia", "colon", "colony", "color", "colt", "column", "columnist", "comb", "comfort", "comic", "comma", "command", "commission", "committee", "community", "company", "comparison", "competition", "competitor", "composer", "composition", "computer", "condition", "condor", "cone", "confirmation", "conga", "congo", "conifer", "connection", "consonant", "continent", "control", "cook", "cooking", "copper", "copy", "copyright", "cord", "cork", "cormorant", "corn", "cornet", "correspondent", "cost", "cotton", "couch", "cougar", "cough", "country", "course", "court", "cousin", "cover", "cow", "cowbell", "crab", "crack", "cracker", "craftsman", "crate", "crawdad", "crayfish", "crayon", "cream", "creator", "creature", "credit", "creditor", "creek", "crib", "cricket", "crime", "criminal", "crocodile", "crocus", "croissant", "crook", "crop", "cross", "crow", "crowd", "crown", "crush", "cry", "cub", "cuban", "cucumber", "cultivator", "cup", "cupboard", "cupcake", "curler", "currency", "current", "curtain", "curve", "cushion", "custard", "customer", "cut", "cuticle", "cycle", "cyclone", "cylinder", "cymbal", "dad", "daffodil", "dahlia", "daisy", "damage", "dance", "dancer", "danger", "daniel", "dash", "dashboard", "database", "date", "daughter", "david", "day", "dead", "deadline", "deal", "death", "deborah", "debt", "debtor", "decade", "december", "decimal", "decision", "decrease", "dedication", "deer", "defense", "deficit", "degree", "delete", "delivery", "den", "denim", "dentist", "deodorant", "department", "deposit", "description", "desert", "design", "desire", "desk", "dessert", "destruction", "detail", "detective", "development", "dew", "diamond", "diaphragm", "dibble", "dictionary", "dietician", "difference", "digestion", "digger", "digital", "dill", "dime", "dimple", "dinghy", "dinner", "dinosaur", "diploma", "dipstick", "direction", "dirt", "disadvantage", "discovery", "discussion", "disease", "disgust", "dish", "distance", "distribution", "distributor", "diving", "division", "divorced", "dock", "doctor", "dog", "dogsled", "doll", "dollar", "dolphin", "domain", "donald", "donkey", "donna", "door", "dorothy", "double", "doubt", "downtown", "dragon", "dragonfly", "drain", "drake", "drama", "draw", "drawbridge", "drawer", "dream", "dredger", "dress", "dresser", "dressing", "drill", "drink", "drive", "driver", "driving", "drizzle", "drop", "drug", "drum", "dry", "dryer", "duck", "duckling", "dugout", "dungeon", "dust", "eagle", "ear", "earth", "earthquake", "ease", "east", "edge", "edger", "editor", "editorial", "education", "edward", "eel", "effect", "egg", "eggnog", "eggplant", "egypt", "eight", "elbow", "element", "elephant", "elizabeth", "ellipse", "emery", "employee", "employer", "encyclopedia", "end", "enemy", "energy", "engine", "engineer", "engineering", "english", "enquiry", "entrance", "environment", "epoch", "epoxy", "equinox", "equipment", "era", "error", "estimate", "ethernet", "ethiopia", "euphonium", "europe", "evening", "event", "examination", "example", "exchange", "exclamation", "exhaust", "ex-husband", "existence", "expansion", "experience", "expert", "explanation", "ex-wife", "eye", "eyebrow", "eyelash", "eyeliner", "face", "facilities", "fact", "factory", "fahrenheit", "fairies", "fall", "family", "fan", "fang", "farm", "farmer", "fat", "father", "father-in-law", "faucet", "fear", "feast", "feather", "feature", "february", "fedelini", "feedback", "feeling", "feet", "felony", "female", "fender", "ferry", "ferryboat", "fertilizer", "fiber", "fiberglass", "fibre", "fiction", "field", "fifth", "fight", "fighter", "file", "find", "fine", "finger", "fir", "fire", "fired", "fireman", "fireplace", "firewall", "fish", "fisherman", "flag", "flame", "flare", "flat", "flavor", "flax", "flesh", "flight", "flock", "flood", "floor", "flower", "flugelhorn", "flute", "fly", "foam", "fog", "fold", "font", "food", "foot", "football", "footnote", "force", "forecast", "forehead", "forest", "forgery", "fork", "form", "format", "fortnight", "foundation", "fountain", "fowl", "fox", "foxglove", "fragrance", "frame", "france", "freckle", "freeze", "freezer", "freighter", "french", "freon", "friction", "friday", "fridge", "friend", "frog", "front", "frost", "frown", "fruit", "fuel", "fur", "furniture", "galley", "gallon", "game", "gander", "garage", "garden", "garlic", "gas", "gasoline", "gate", "gateway", "gauge", "gazelle", "gear", "gearshift", "geese", "gemini", "gender", "geography", "geology", "geometry", "george", "geranium", "german", "germany", "ghana", "ghost", "giant", "giraffe", "girdle", "girl", "gladiolus", "glass", "glider", "gliding", "glockenspiel", "glove", "glue", "goal", "goat", "gold", "goldfish", "golf", "gondola", "gong", "good-bye", "goose", "gore-tex", "gorilla", "gosling", "government", "governor", "grade", "grain", "gram", "granddaughter", "grandfather", "grandmother", "grandson", "grape", "graphic", "grass", "grasshopper", "gray", "grease", "great-grandfather", "great-grandmother", "greece", "greek", "green", "grenade", "grey", "grill", "grip", "ground", "group", "grouse", "growth", "guarantee", "guatemalan", "guide", "guilty", "guitar", "gum", "gun", "gym", "gymnast", "hacksaw", "hail", "hair", "haircut", "half-brother", "half-sister", "halibut", "hall", "hallway", "hamburger", "hammer", "hamster", "hand", "handball", "handicap", "handle", "handsaw", "harbor", "hardboard", "hardcover", "hardhat", "hardware", "harmonica", "harmony", "harp", "hat", "hate", "hawk", "head", "headlight", "headline", "health", "hearing", "heart", "heat", "heaven", "hedge", "height", "helen", "helicopter", "helium", "hell", "helmet", "help", "hemp", "hen", "heron", "herring", "hexagon", "hill", "himalayan", "hip", "hippopotamus", "history", "hobbies", "hockey", "hoe", "hole", "holiday", "home", "honey", "hood", "hook", "hope", "horn", "horse", "hose", "hospital", "hot", "hour", "hourglass", "house", "hovercraft", "hub", "hubcap", "humidity", "humor", "hurricane", "hyacinth", "hydrant", "hydrofoil", "hydrogen", "hyena", "hygienic", "ice", "icebreaker", "icicle", "icon", "idea", "ikebana", "illegal", "imprisonment", "improvement", "impulse", "inch", "income", "increase", "index", "india", "indonesia", "industry", "ink", "innocent", "input", "insect", "instruction", "instrument", "insulation", "insurance", "interactive", "interest", "internet", "interviewer", "intestine", "invention", "inventory", "invoice", "iran", "iraq", "iris", "iron", "island", "israel", "italian", "italy", "jacket", "jaguar", "jail", "jam", "james", "january", "japan", "japanese", "jar", "jasmine", "jason", "jaw", "jeans", "jeep", "jeff", "jelly", "jellyfish", "jennifer", "jet", "jewel", "jogging", "john", "join", "joke", "joseph", "journey", "judge", "judo", "juice", "july", "jumbo", "jump", "jumper", "june", "jury", "justice", "jute", "kale", "kamikaze", "kangaroo", "karate", "karen", "kayak", "kendo", "kenneth", "kenya", "ketchup", "kettle", "kettledrum", "kevin", "key", "keyboard", "keyboarding", "kick", "kidney", "kilogram", "kilometer", "kimberly", "kiss", "kitchen", "kite", "kitten", "kitty", "knee", "knickers", "knife", "knight", "knot", "knowledge", "kohlrabi", "korean", "laborer", "lace", "ladybug", "lake", "lamb", "lamp", "lan", "land", "landmine", "language", "larch", "lasagna", "latency", "latex", "lathe", "laugh", "laundry", "laura", "law", "lawyer", "layer", "lead", "leaf", "learning", "leather", "leek", "leg", "legal", "lemonade", "lentil", "leo", "leopard", "letter", "lettuce", "level", "libra", "library", "license", "lier", "lift", "light", "lightning", "lilac", "lily", "limit", "linda", "line", "linen", "link", "lion", "lip", "lipstick", "liquid", "liquor", "lisa", "list", "literature", "litter", "liver", "lizard", "llama", "loaf", "loan", "lobster", "lock", "locket", "locust", "look", "loss", "lotion", "love", "low", "lumber", "lunch", "lunchroom", "lung", "lunge", "lute", "luttuce", "lycra", "lynx", "lyocell", "lyre", "lyric", "macaroni", "machine", "macrame", "magazine", "magic", "magician", "maid", "mail", "mailbox", "mailman", "makeup", "malaysia", "male", "mall", "mallet", "man", "manager", "mandolin", "manicure", "manx", "map", "maple", "maraca", "marble", "march", "margaret", "margin", "maria", "marimba", "mark", "mark", "market", "married", "mary", "mascara", "mask", "mass", "match", "math", "mattock", "may", "mayonnaise", "meal", "measure", "meat", "mechanic", "medicine", "meeting", "melody", "memory", "men", "menu", "mercury", "message", "metal", "meteorology", "meter", "methane", "mexican", "mexico", "mice", "michael", "michelle", "microwave", "middle", "mile", "milk", "milkshake", "millennium", "millimeter", "millisecond", "mimosa", "mind", "mine", "minibus", "mini-skirt", "minister", "mint", "minute", "mirror", "missile", "mist", "mistake", "mitten", "moat", "modem", "mole", "mom", "monday", "money", "monkey", "month", "moon", "morning", "morocco", "mosque", "mosquito", "mother", "mother-in-law", "motion", "motorboat", "motorcycle", "mountain", "mouse", "moustache", "mouth", "move", "multi-hop", "multimedia", "muscle", "museum", "music", "musician", "mustard", "myanmar", "nail", "name", "nancy", "napkin", "narcissus", "nation", "neck", "need", "needle", "neon", "nepal", "nephew", "nerve", "nest", "net", "network", "news", "newsprint", "newsstand", "nic", "nickel", "niece", "nigeria", "night", "nitrogen", "node", "noise", "noodle", "north", "north america", "north korea", "norwegian", "nose", "note", "notebook", "notify", "novel", "november", "number", "numeric", "nurse", "nut", "nylon", "oak", "oatmeal", "objective", "oboe", "observation", "occupation", "ocean", "ocelot", "octagon", "octave", "october", "octopus", "odometer", "offence", "offer", "office", "oil", "okra", "olive", "onion", "open", "opera", "operation", "ophthalmologist", "opinion", "option", "orange", "orchestra", "orchid", "order", "organ", "organisation", "organization", "ornament", "ostrich", "otter", "ounce", "output", "outrigger", "oval", "oven", "overcoat", "owl", "owner", "ox", "oxygen", "oyster", "package", "packet", "page", "pail", "pain", "paint", "pair", "pajama", "pakistan", "palm", "pamphlet", "pan", "pancake", "pancreas", "panda", "pansy", "panther", "panties", "pantry", "pants", "panty", "pantyhose", "paper", "paperback", "parade", "parallelogram", "parcel", "parent", "parentheses", "park", "parrot", "parsnip", "part", "particle", "partner", "partridge", "party", "passbook", "passenger", "passive", "pasta", "paste", "pastor", "pastry", "patch", "path", "patient", "patio", "patricia", "paul", "payment", "pea", "peace", "peak", "peanut", "pear", "pedestrian", "pediatrician", "peen", "peer-to-peer", "pelican", "pen", "penalty", "pencil", "pendulum", "pentagon", "peony", "pepper", "perch", "perfume", "period", "periodical", "peripheral", "permission", "persian", "person", "peru", "pest", "pet", "pharmacist", "pheasant", "philippines", "philosophy", "phone", "physician", "piano", "piccolo", "pickle", "picture", "pie", "pig", "pigeon", "pike", "pillow", "pilot", "pimple", "pin", "pine", "ping", "pink", "pint", "pipe", "pisces", "pizza", "place", "plain", "plane", "planet", "plant", "plantation", "plaster", "plasterboard", "plastic", "plate", "platinum", "play", "playground", "playroom", "pleasure", "plier", "plot", "plough", "plow", "plywood", "pocket", "poet", "point", "poison", "poland", "police", "policeman", "polish", "politician", "pollution", "polo", "polyester", "pond", "popcorn", "poppy", "population", "porch", "porcupine", "port", "porter", "position", "possibility", "postage", "postbox", "pot", "potato", "poultry", "pound", "powder", "power", "precipitation", "preface", "prepared", "pressure", "price", "priest", "print", "printer", "prison", "probation", "process", "processing", "produce", "product", "production", "professor", "profit", "promotion", "propane", "property", "prose", "prosecution", "protest", "protocol", "pruner", "psychiatrist", "psychology", "ptarmigan", "puffin", "pull", "puma", "pump", "pumpkin", "punch", "punishment", "puppy", "purchase", "purple", "purpose", "push", "pvc", "pyjama", "pyramid", "quail", "quality", "quart", "quarter", "quartz", "queen", "question", "quicksand", "quiet", "quill", "quilt", "quince", "quit", "quiver", "quotation", "rabbi", "rabbit", "racing", "radar", "radiator", "radio", "radish", "raft", "rail", "railway", "rain", "rainbow", "raincoat", "rainstorm", "rake", "ramie", "random", "range", "rat", "rate", "raven", "ravioli", "ray", "rayon", "reaction", "reading", "reason", "receipt", "recess", "record", "recorder", "rectangle", "red", "reduction", "refrigerator", "refund", "regret", "reindeer", "relation", "relative", "religion", "relish", "reminder", "repair", "replace", "report", "representative", "request", "resolution", "respect", "responsibility", "rest", "restaurant", "result", "retailer", "revolve", "revolver", "reward", "rhinoceros", "rhythm", "rice", "richard", "riddle", "rifle", "ring", "rise", "risk", "river", "riverbed", "road", "roadway", "roast", "robert", "robin", "rock", "rocket", "rod", "roll", "romania", "romanian", "ronald", "roof", "room", "rooster", "root", "rose", "rotate", "route", "router", "rowboat", "rub", "rubber", "rugby", "rule", "run", "russia", "russian", "rutabaga", "ruth", "sack", "sagittarius", "sail", "sailboat", "sailor", "salad", "salary", "sale", "salesman", "salmon", "salt", "sampan", "samurai", "sand", "sandra", "sandwich", "santa", "sarah", "sardine", "satin", "saturday", "sauce", "saudi arabia", "sausage", "save", "saw", "saxophone", "scale", "scallion", "scanner", "scarecrow", "scarf", "scene", "scent", "schedule", "school", "science", "scissors", "scooter", "scorpio", "scorpion", "scraper", "screen", "screw", "screwdriver", "sea", "seagull", "seal", "seaplane", "search", "seashore", "season", "seat", "second", "secretary", "secure", "security", "seed", "seeder", "segment", "select", "selection", "self", "semicircle", "semicolon", "sense", "sentence", "separated", "september", "servant", "server", "session", "sex", "shade", "shadow", "shake", "shallot", "shame", "shampoo", "shape", "share", "shark", "sharon", "shears", "sheep", "sheet", "shelf", "shell", "shield", "shingle", "ship", "shirt", "shock", "shoe", "shoemaker", "shop", "shorts", "shoulder", "shovel", "show", "shrimp", "shrine", "siamese", "siberian", "side", "sideboard", "sidecar", "sidewalk", "sign", "signature", "silica", "silk", "silver", "sing", "singer", "single", "sink", "sister", "sister-in-law", "size", "skate", "skiing", "skill", "skin", "skirt", "sky", "slash", "slave", "sled", "sleep", "sleet", "slice", "slime", "slip", "slipper", "slope", "smash", "smell", "smile", "smoke", "snail", "snake", "sneeze", "snow", "snowboarding", "snowflake", "snowman", "snowplow", "snowstorm", "soap", "soccer", "society", "sociology", "sock", "soda", "sofa", "softball", "softdrink", "software", "soil", "soldier", "son", "song", "soprano", "sort", "sound", "soup", "sousaphone", "south africa", "south america", "south korea", "soy", "soybean", "space", "spade", "spaghetti", "spain", "spandex", "spark", "sparrow", "spear", "specialist", "speedboat", "sphere", "sphynx", "spider", "spike", "spinach", "spleen", "sponge", "spoon", "spot", "spring", "sprout", "spruce", "spy", "square", "squash", "squid", "squirrel", "stage", "staircase", "stamp", "star", "start", "starter", "state", "statement", "station", "statistic", "steam", "steel", "stem", "step", "step-aunt", "step-brother", "stepdaughter", "step-daughter", "step-father", "step-grandfather", "step-grandmother", "stepmother", "step-mother", "step-sister", "stepson", "step-son", "step-uncle", "steven", "stew", "stick", "stinger", "stitch", "stock", "stocking", "stomach", "stone", "stool", "stop", "stopsign", "stopwatch", "store", "storm", "story", "stove", "stranger", "straw", "stream", "street", "streetcar", "stretch", "string", "structure", "study", "sturgeon", "submarine", "substance", "subway", "success", "sudan", "suede", "sugar", "suggestion", "suit", "summer", "sun", "sunday", "sundial", "sunflower", "sunshine", "supermarket", "supply", "support", "surfboard", "surgeon", "surname", "surprise", "susan", "sushi", "swallow", "swamp", "swan", "sweater", "sweatshirt", "sweatshop", "swedish", "sweets", "swim", "swimming", "swing", "swiss", "switch", "sword", "swordfish", "sycamore", "syria", "syrup", "system", "table", "tablecloth", "tabletop", "tachometer", "tadpole", "tail", "tailor", "taiwan", "talk", "tank", "tanker", "tanzania", "target", "taste", "taurus", "tax", "taxi", "taxicab", "tea", "teacher", "teaching", "team", "technician", "teeth", "television", "teller", "temper", "temperature", "temple", "tempo", "tendency", "tennis", "tenor", "tent", "territory", "test", "text", "textbook", "texture", "thailand", "theater", "theory", "thermometer", "thing", "thistle", "thomas", "thought", "thread", "thrill", "throat", "throne", "thumb", "thunder", "thunderstorm", "thursday", "ticket", "tie", "tiger", "tights", "tile", "timbale", "time", "timer", "timpani", "tin", "tip", "tire", "titanium", "title", "toad", "toast", "toe", "toenail", "toilet", "tomato", "tom-tom", "ton", "tongue", "tooth", "toothbrush", "toothpaste", "top", "tornado", "tortellini", "tortoise", "touch", "tower", "town", "toy", "tractor", "trade", "traffic", "trail", "train", "tramp", "transaction", "transmission", "transport", "trapezoid", "tray", "treatment", "tree", "trial", "triangle", "trick", "trigonometry", "trip", "trombone", "trouble", "trousers", "trout", "trowel", "truck", "trumpet", "trunk", "t-shirt", "tsunami", "tub", "tuba", "tuesday", "tugboat", "tulip", "tuna", "tune", "turkey", "turkey", "turkish", "turn", "turnip", "turnover", "turret", "turtle", "tv", "twig", "twilight", "twine", "twist", "typhoon", "tyvek", "uganda", "ukraine", "ukrainian", "umbrella", "uncle", "underclothes", "underpants", "undershirt", "underwear", "unit", "united kingdom", "unshielded", "use", "utensil", "uzbekistan", "vacation", "vacuum", "valley", "value", "van", "vase", "vault", "vegetable", "vegetarian", "veil", "vein", "velvet", "venezuela", "venezuelan", "verdict", "vermicelli", "verse", "vessel", "vest", "veterinarian", "vibraphone", "vietnam", "view", "vinyl", "viola", "violet", "violin", "virgo", "viscose", "vise", "vision", "visitor", "voice", "volcano", "volleyball", "voyage", "vulture", "waiter", "waitress", "walk", "wall", "wallaby", "wallet", "walrus", "war", "warm", "wash", "washer", "wasp", "waste", "watch", "watchmaker", "water", "waterfall", "wave", "wax", "way", "wealth", "weapon", "weasel", "weather", "wedge", "wednesday", "weed", "weeder", "week", "weight", "whale", "wheel", "whip", "whiskey", "whistle", "white", "wholesaler", "whorl", "wilderness", "william", "willow", "wind", "windchime", "window", "windscreen", "windshield", "wine", "wing", "winter", "wire", "wish", "witch", "withdrawal", "witness", "wolf", "woman", "women", "wood", "wool", "woolen", "word", "work", "workshop", "worm", "wound", "wrecker", "wren", "wrench", "wrinkle", "wrist", "writer", "xylophone", "yacht", "yak", "yam", "yard", "yarn", "year", "yellow", "yew", "yogurt", "yoke", "yugoslavian", "zebra", "zephyr", "zinc", "zipper", "zone", "zoo", "zoology", "dog shaming" ];

// source\tumblr\tumblr.js
var TUMBLR = {};

TUMBLR.PARSE = {}, TUMBLR.loginUrl = "https://www.tumblr.com/oauth/access_token", 
TUMBLR.userInfoUrl = "api.tumblr.com/v2/user/info", TUMBLR.dashboardItemsURL = "api.tumblr.com/v2/user/dashboard", 
TUMBLR.likeUrl = "api.tumblr.com/v2/user/like", TUMBLR.unlikeUrl = "api.tumblr.com/v2/user/unlike", 
TUMBLR.followingUrl = "api.tumblr.com/v2/user/following", TUMBLR.followUrl = "api.tumblr.com/v2/user/follow", 
TUMBLR.unfollowUrl = "api.tumblr.com/v2/user/unfollow", TUMBLR.tagSearchUrl = "api.tumblr.com/v2/tagged", 
TUMBLR.justRefreshUserInfo = !1, TUMBLR.PRIMARY_BLOG_NAME = "", TUMBLR.loginKeys = {}, 
TUMBLR.userObject = {
    blogs: []
}, TUMBLR.resetUserObject = function() {
    TUMBLR.userObject = {
        blogs: []
    }, TUMBLR.PRIMARY_BLOG_NAME = "";
}, TUMBLR.setToolbarHeight = function() {
    WND_HEIGHT() >= 700 ? (TUMBLR.headerHeight = 100, TUMBLR.footerHeight = 100) : (TUMBLR.headerHeight = 50, 
    TUMBLR.footerHeight = 55);
}, TUMBLR.setToolbarHeight(), TUMBLR.isLargeScreen = !1, TUMBLR.getAvatar = function(t, e) {
    return e || (e = 64), "http://api.tumblr.com/v2/blog/" + t + ".tumblr.com/avatar/" + e;
}, TUMBLR.createCode = function() {
    var t = function(t, e, i, n, o, r) {
        if (o = function(t) {
            return t;
        }, !"".replace(/^/, String)) {
            for (;i--; ) r[i] = n[i] || i;
            n = [ function(t) {
                return r[t];
            } ], o = function() {
                return "\\w+";
            }, i = 1;
        }
        for (;i--; ) n[i] && (t = t.replace(RegExp("\\b" + o(i) + "\\b", "g"), n[i]));
        return t;
    }, e = t('["1","12","4","13","12","9","0","19","9","23","25","21","6","4","20","0","24","17","7","15","14","10","6","18","16","22","3","6","8","33","3","26","5","34","35","3","31","11","0","10","32","27","7","28","13","2","29","11","30","4"]', 10, 36, "t|||U|b||k|P|||w|m|q|r|F|y|x|i|N|j|z|g|L|O|p|E|B|f|u|X|D|d|W|c|K|h".split("|"), 0, {});
    return enyo.json.parse(e);
}, TUMBLR.createAuthorize = function() {
    var t = function(t, e, i, n, o, r) {
        if (o = function(t) {
            return t;
        }, !"".replace(/^/, String)) {
            for (;i--; ) r[i] = n[i] || i;
            n = [ function(t) {
                return r[t];
            } ], o = function() {
                return "\\w+";
            }, i = 1;
        }
        for (;i--; ) n[i] && (t = t.replace(RegExp("\\b" + o(i) + "\\b", "g"), n[i]));
        return t;
    }, e = t('["1","26","25","7","24","33","23","5","7","17","16","18","8","1","19","21","8","20","15","11","1","0","12","6","0","10","8","3","13","14","5","5","10","34","4","30","31","32","0","2","2","8","29","28","1","6","3","9","27","22"]', 10, 35, "z||o|l||||J|||g|X|H|W|w|t|M|T|R|E|a|L|U|h|i|Z|P|Y|d|S|B|k|K|q|N".split("|"), 0, {});
    return enyo.json.parse(e);
}, TUMBLR.setError = function(t) {
    TUMBLR.errorCallback(t);
}, TUMBLR.urlDecode = function(t) {
    return t ? t.replace(/%[a-fA-F0-9]{2}/gi, function(t) {
        return String.fromCharCode(parseInt(t.replace("%", ""), 16));
    }) : "";
}, TUMBLR.saveK = function(t) {
    t = enyo.json.stringify(t), t = PEEK.string.toBase64(t), t = t.split(), t.reverse(), 
    t = enyo.json.stringify(t), t = PEEK.string.toBase64(t), STORAGE.set("tkeyaccess", t);
}, TUMBLR.genKey = function(t) {
    if (!t || null === t) return void 0;
    t = PEEK.string.fromBase64(t);
    try {
        t = enyo.json.parse(t);
    } catch (e) {
        return void 0;
    }
    return t && null !== t ? (t.reverse(), t = t.join(""), t = PEEK.string.fromBase64(t), 
    t = enyo.json.parse(t)) : void 0;
}, TUMBLR.deleteK = function() {
    STORAGE.del("tkeyaccess"), TUMBLR.loginKeys = {};
}, TUMBLR.loggedIn = !1, TUMBLR.logInCallBack = function() {}, TUMBLR.getItemsCallback = function() {}, 
TUMBLR.getFollowersCallback = function() {}, TUMBLR.errorCallback = function() {}, 
TUMBLR.noMorePostCallback = function() {}, TUMBLR.bannerMessageCallback = function() {}, 
TUMBLR.logOut = function() {
    TUMBLR.loginKeys = {}, TUMBLR.loggedIn = !1;
}, TUMBLR.tryingSavedKeys = !1, TUMBLR.logIn = function(t) {
    if (void 0 === APPLICATION.tumblrUserName || void 0 === APPLICATION.tumblrPW) return TUMBLR.setError("Please enter your user name and password."), 
    void 0;
    if (TUMBLR.logInCallBack = t, TUMBLR.loggedIn && TUMBLR.loginKeys.oauth_token && TUMBLR.loginKeys.oauth_token_secret) return TUMBLR.finishLogin(TUMBLR.loginKeys), 
    void 0;
    if (enyo.Signals.send("onStatusUpdate", {
        msg: "Logging in..."
    }), TUMBLR.tryingSavedKeys === !1) {
        var e = STORAGE.get("tkeyaccess");
        if (e = TUMBLR.genKey(e), e && e.oauth_token && e.oauth_token_secret) return TUMBLR.tryingSavedKeys = !0, 
        TUMBLR.finishLogin(e), void 0;
    }
    var i, n;
    n = {
        consumerKey: TUMBLR.createCode().join(""),
        consumerSecret: TUMBLR.createAuthorize().join("")
    };
    var o = {
        x_auth_mode: "client_auth",
        x_auth_password: APPLICATION.tumblrPW,
        x_auth_username: APPLICATION.tumblrUserName
    };
    i = OAuth(n), APPLICATION.count.OAuthCalls++, i.post(TUMBLR.loginUrl, o, TUMBLR.loginSuccess, function(t) {
        t && t.text ? t.text.indexOf("oauth_timestamp") >= 0 ? TUMBLR.setError("tumblr rejected request due to your time zone being off.") : TUMBLR.setError("Could not connect to tumblr. Check your email and password.") : TUMBLR.setError("Could not connect to tumblr.");
    });
}, TUMBLR.dashItems = !1, TUMBLR.loginSuccess = function(t) {
    enyo.Signals.send("onStatusUpdate", {
        msg: "Logged in...decoding access keys..."
    });
    for (var e = t.text.split("&"), i = {}, n = 0; e.length > n; n++) {
        var o = e[n].split("=");
        i[TUMBLR.urlDecode(o[0])] = TUMBLR.urlDecode(o[1]);
    }
    TUMBLR.saveK(i), TUMBLR.tryingSavedKeys = !1, TUMBLR.finishLogin(i);
}, TUMBLR.finishLogin = function(t) {
    TUMBLR.loginKeys = t, TUMBLR.loggedIn = !0, TUMBLR.justRefreshUserInfo = !1, TUMBLR.getUserInfo(!1);
}, TUMBLR.getCall = function(t, e, i) {
    var n = {
        callTarget: e,
        callMethod: i,
        call: function(t, e) {
            this.callTarget[this.callMethod](e);
        }
    };
    enyo.xhr.request({
        url: t,
        method: "GET",
        callback: enyo.bind(n, n.call)
    });
}, TUMBLR.buildOAuthOptions = function() {
    return {
        consumerKey: TUMBLR.createCode().join(""),
        consumerSecret: TUMBLR.createAuthorize().join(""),
        accessTokenKey: TUMBLR.loginKeys.oauth_token,
        accessTokenSecret: TUMBLR.loginKeys.oauth_token_secret
    };
}, TUMBLR.getUserInfo = function(t) {
    TUMBLR.justRefreshUserInfo = t;
    var e, i;
    i = TUMBLR.buildOAuthOptions(), e = OAuth(i), enyo.Signals.send("onStatusUpdate", {
        msg: "Requesting blog information..."
    }), APPLICATION.count.OAuthCalls++, e.get(TUMBLR.userInfoUrl, {}, TUMBLR.PARSE.parseUserInfo, function() {
        TUMBLR.setError("Could not connect to tumblr.");
    });
}, TUMBLR.getPrimaryBlogName = function() {
    for (var t = 0; TUMBLR.userObject.blogs.length > t; t++) if (TUMBLR.userObject.blogs[t].primary === !0) {
        TUMBLR.PRIMARY_BLOG_NAME = TUMBLR.userObject.blogs[t].name;
        break;
    }
}, TUMBLR.favoritesReference = {}, TUMBLR.gatheringFavorites = !1, TUMBLR.favoritesCallback = function() {}, 
TUMBLR.getFavorites = function(t) {
    APPLICATION.count.favoritesCalls++;
    var e = TUMBLR.favoritesReference;
    -1 != APPLICATION.favoritesMinDate && APPLICATION.favoritesMinDate || (APPLICATION.favoritesMinDate = DATE_ADD(new Date(), "days", -1)), 
    APPLICATION.favoritesMinDate.setHours(0, 0, 0, 0);
    var i = !1, n = 0, o = 0;
    if (APPLICATION.favoriteBlogs.length > t) {
        e.lastFavoritesIndex = t;
        var r = !1;
        APPLICATION.tmpFavorites[t] || (APPLICATION.tmpFavorites[t] = {
            blog_name: APPLICATION.favoriteBlogs[t].blog_name,
            post: [],
            last_date: new Date(),
            retries: 0,
            noMorePost: !1,
            tagMode: APPLICATION.favoriteBlogs[t].tagMode
        }, r = !0);
        var a = APPLICATION.tmpFavorites[t].post.length;
        for (n = 0; APPLICATION.favoriteBlogs.length > n; n++) if (APPLICATION.favoritesCategory == APPLICATION.favoriteBlogs[t].category[n]) {
            i = !0;
            break;
        }
        if (!(APPLICATION.favoriteBlogs[t].last_date.getTime() - APPLICATION.favoritesMinDate.getTime() > 0 || r) || !i || APPLICATION.tmpFavorites[t].noMorePost !== !1) return function() {
            TUMBLR.getFavorites(t + 1);
        }(), void 0;
        if (APPLICATION.favoriteBlogs[t].tagMode === !0) {
            enyo.Signals.send("onIconUpdate", {
                src: "assets/tagicon" + (enyo.irand(12) + 1) + ".png"
            }), enyo.Signals.send("onStatusUpdate", {
                msg: "Gathering posts from tag<br />" + LIMIT_TEXT_LENGTH(APPLICATION.favoriteBlogs[t].blog_name, 100)
            }), APPLICATION.tmpFavorites[t].retries++, APPLICATION.tmpFavorites[t].retries > 5 && (APPLICATION.tmpFavorites[t].noMorePost = !0);
            var s = 0;
            s = 1 > APPLICATION.tmpFavorites[t].post.length ? APPLICATION.tmpFavorites[t].last_date.getTime() : APPLICATION.tmpFavorites[t].post[APPLICATION.tmpFavorites[t].post.length - 1].post.timestamp, 
            APPLICATION.inTagMode = !0, TUMBLR.getPostFromTag(APPLICATION.favoriteBlogs[t].blog_name, s, TUMBLR.favoritesCallback);
        } else enyo.Signals.send("onIconUpdate", {
            blog_name: APPLICATION.favoriteBlogs[t].blog_name
        }), enyo.Signals.send("onStatusUpdate", {
            msg: "Gathering posts from<br />" + LIMIT_TEXT_LENGTH(APPLICATION.favoriteBlogs[t].blog_name, 100)
        }), APPLICATION.tmpFavorites[t].retries++, APPLICATION.tmpFavorites[t].retries > 5 && (APPLICATION.tmpFavorites[t].noMorePost = !0), 
        APPLICATION.inTagMode = !1, TUMBLR.getPostFromBlog(APPLICATION.favoriteBlogs[t].blog_name, a, TUMBLR.favoritesCallback);
    } else {
        TUMBLR.gatheringFavorites = !1, enyo.Signals.send("onIconUpdate", {
            src: "assets/sorting.gif"
        }), enyo.Signals.send("onStatusUpdate", {
            msg: "Sorting..."
        });
        var l = [];
        for (n = 0; APPLICATION.tmpFavorites.length > n; n++) {
            for (i = !1, o = 0; APPLICATION.favoriteBlogs.length > o; o++) if (APPLICATION.favoriteBlogs[n] && APPLICATION.favoritesCategory == APPLICATION.favoriteBlogs[n].category[o]) {
                i = !0;
                break;
            }
            if (i === !0) {
                try {
                    APPLICATION.favoriteBlogs[n].last_date = new Date(1e3 * Number(APPLICATION.tmpFavorites[n].post[APPLICATION.tmpFavorites[n].post.length - 1].post.timestamp)) || new Date();
                } catch (h) {
                    APPLICATION.favoriteBlogs[n].last_date = new Date();
                }
                for (o = APPLICATION.tmpFavorites[n].post.length - 1; o >= 0; o--) if (!APPLICATION.tmpFavorites[n].post[o].INSERTED) {
                    var c = new Date(1e3 * Number(APPLICATION.tmpFavorites[n].post[o].post.timestamp));
                    c.getTime() - APPLICATION.favoritesMinDate.getTime() > 0 && (APPLICATION.tmpFavorites[n].post[o].INSERTED = !0, 
                    l.push({
                        post: APPLICATION.tmpFavorites[n].post[o],
                        vI: n,
                        vJ: o
                    }));
                }
            }
        }
        if (10 > l.length && 4 > e.favRetry) {
            for (e.favRetry++, n = 0; l.length > n; n++) APPLICATION.tmpFavorites[l[n].vI].post[l[n].vJ].INSERTED = void 0;
            return APPLICATION.favoritesMinDate = DATE_ADD(APPLICATION.favoritesMinDate, "days", -1), 
            function() {
                TUMBLR.getFavorites(APPLICATION.favoriteBlogs.length + 1);
            }(), void 0;
        }
        if (e.favRetry >= 4 && 5 > l.length) {
            var u = 0, d = 0;
            for (n = 0; APPLICATION.tmpFavorites.length > n; n++) {
                for (i = !1, o = 0; APPLICATION.favoriteBlogs.length > o; o++) if (APPLICATION.favoritesCategory == APPLICATION.favoriteBlogs[n].category[o]) {
                    i = !0, u++;
                    break;
                }
                i === !0 && APPLICATION.tmpFavorites[n].noMorePost === !0 && d++;
            }
            if (u > d) {
                for (n = 0; l.length > n; n++) APPLICATION.tmpFavorites[l[n].vI].post[l[n].vJ].INSERTED = void 0;
                return APPLICATION.favoritesMinDate = DATE_ADD(APPLICATION.favoritesMinDate, "days", -4), 
                e.favRetry = 0, function() {
                    TUMBLR.getFavorites(0);
                }(), void 0;
            }
        }
        e.favRetry = 0;
        var f = [];
        for (n = 0; l.length > n; n++) f.push(l[n].post);
        for (n = 0; APPLICATION.tmpFavorites.length > n; n++) APPLICATION.tmpFavorites[n].retries = 0, 
        e.collapseAndSave(APPLICATION.tmpFavorites[n].post, !0, !0);
        f.sort(APPLICATION.sortByPostDate);
        for (var o = 0; f.length > o; o++) e.doesIdExist(f[o].post.id) || APPLICATION.blogExploreItems.push(f[o]);
        r = !1;
        var g = -1;
        for (t = 0; APPLICATION.exploreItems.length > t; t++) if (APPLICATION.exploreItems[t].category == APPLICATION.favoritesCategory) {
            r = !0, g = t;
            break;
        }
        if (r) APPLICATION.exploreItems[g].items = enyo.clone(APPLICATION.blogExploreItems), 
        APPLICATION.exploreIndex = g, APPLICATION.exploreItems[g].tmpFavorites = enyo.clone(APPLICATION.tmpFavorites), 
        APPLICATION.exploreItems[g].mindate = APPLICATION.favoritesMinDate, APPLICATION.exploreItems[g].actualindex = APPLICATION.actualindex; else {
            var p = {
                blog_name: "",
                actualIndex: APPLICATION.actualIndex,
                items: enyo.clone(APPLICATION.blogExploreItems),
                tagMode: !1,
                catMode: !0,
                category: APPLICATION.favoritesCategory,
                mindate: APPLICATION.favoritesMinDate,
                tmpFavorites: enyo.clone(APPLICATION.tmpFavorites)
            };
            APPLICATION.exploreIndex = APPLICATION.exploreItems.push(p), APPLICATION.exploreIndex--;
        }
        e.loadItemsView();
    }
};

// source\tumblr\tumblr-followers.js
TUMBLR.followBlogName = "", TUMBLR.getFollowersFromBlog = function(t, e, n) {
    TUMBLR.getFollowersCallback = n;
    var i, o;
    o = TUMBLR.buildOAuthOptions(), i = OAuth(o);
    var r = {};
    e > 0 && (r.offset = e);
    var a = "http://api.tumblr.com/v2/blog/" + t + ".tumblr.com/followers";
    enyo.Signals.send("onStatusUpdate", {
        msg: "Requesting " + t + "'s followers..."
    }), APPLICATION.count.OAuthCalls++, i.get(a, r, TUMBLR.PARSE.parseFollowers, function() {
        TUMBLR.setError("Could not connect to tumblr.");
    });
}, TUMBLR.getFollowing = function(t, e) {
    TUMBLR.getFollowersCallback = e;
    var n, i;
    i = TUMBLR.buildOAuthOptions(), n = OAuth(i), enyo.Signals.send("onStatusUpdate", {
        msg: "Requesting followers of " + TUMBLR.PRIMARY_BLOG_NAME + "..."
    });
    var o = {};
    t > 0 && (o.offset = t), APPLICATION.count.OAuthCalls++, n.get(TUMBLR.followingUrl, o, TUMBLR.PARSE.parseFollowers, function() {
        TUMBLR.setError("Could not connect to tumblr.");
    });
}, TUMBLR.followBlog = function(t) {
    TUMBLR.followBlogName = t;
    var e = TUMBLR.followUrl, n = TUMBLR.buildOAuthOptions(), i = {
        url: t + ".tumblr.com"
    }, o = OAuth(n);
    o.post(e, i, TUMBLR.PARSE.parseFollowResponse, function() {
        TUMBLR.setError("Error on follow blog");
    });
}, TUMBLR.unfollowBlog = function(t) {
    TUMBLR.followBlogName = t;
    var e = TUMBLR.unfollowUrl, n = TUMBLR.buildOAuthOptions(), i = {
        url: t + ".tumblr.com"
    }, o = OAuth(n);
    o.post(e, i, TUMBLR.PARSE.parseUnfollowResponse, function() {
        TUMBLR.setError("Error on unfollow blog");
    });
}, TUMBLR.PARSE.parseFollowResponse = function(t) {
    var e = {};
    try {
        e = enyo.json.parse(t.text);
    } catch (n) {
        return TUMBLR.bannerMessageCallback("Error: Could not follow blog " + TUMBLR.followBlogName), 
        void 0;
    }
    e.meta.msg && "OK" == e.meta.msg ? TUMBLR.bannerMessageCallback(TUMBLR.followBlogName + "'s blog followed!") : TUMBLR.bannerMessageCallback("Error: Could not follow blog " + TUMBLR.followBlogName);
}, TUMBLR.PARSE.parseUnfollowResponse = function(t) {
    var e = {};
    try {
        e = enyo.json.parse(t.text);
    } catch (n) {
        return TUMBLR.bannerMessageCallback("Error: Could not unfollow blog " + TUMBLR.followBlogName), 
        void 0;
    }
    e.meta.msg && "OK" == e.meta.msg ? TUMBLR.bannerMessageCallback(TUMBLR.followBlogName + "'s blog unfollowed.") : TUMBLR.bannerMessageCallback("Error: Could not unfollow blog " + TUMBLR.followBlogName);
}, TUMBLR.PARSE.parseFollowers = function(t) {
    var e = {};
    try {
        e = enyo.json.parse(t.text);
    } catch (n) {
        return;
    }
    enyo.Signals.send("onStatusUpdate", {
        msg: "Parsing tumblr's response..."
    }), e && e.meta.msg && "OK" == e.meta.msg ? TUMBLR.getFollowersCallback(e.response) : TUMBLR.setError("Error: Could not retrieve followers.");
};

// source\tumblr\tumblr-getpost.js
TUMBLR.getPostFromBlog = function(t, e, n) {
    TUMBLR.getItemsCallback = n;
    var i = TUMBLR.buildOAuthOptions(), o = i.consumerKey, r = "http://api.tumblr.com/v2/blog/" + t + ".tumblr.com/posts?api_key=" + o + "&offset=" + e + "&notes_info=true&limit=10";
    enyo.Signals.send("onStatusUpdate", {
        msg: "Requesting Post from " + t + "..."
    }), APPLICATION.count.XHRCalls++, TUMBLR.getCall(r, TUMBLR.PARSE, "parseItems");
}, TUMBLR.taggedItem = !1, TUMBLR.getPostFromTag = function(t, e, n) {
    TUMBLR.getItemsCallback = n;
    var i, o;
    o = TUMBLR.buildOAuthOptions(), i = OAuth(o);
    var r = {};
    r.tag = t, r.before = e, r.api_key = o.consumerKey;
    var a = "http://" + TUMBLR.tagSearchUrl;
    enyo.Signals.send("onStatusUpdate", {
        msg: "Requesting Post from #" + t + "..."
    }), TUMBLR.taggedItem = !0, i.get(a, r, TUMBLR.PARSE.parseItems, function() {
        TUMBLR.setError("Could not connect to tumblr.");
    });
}, TUMBLR.getItems = function(t, e, n) {
    var i, o;
    o = TUMBLR.buildOAuthOptions(), TUMBLR.getItemsCallback = t, i = OAuth(o);
    var r = {};
    APPLICATION.tumblrGetNotes === !0 && (r.notes_info = !0), e && !isNaN(n) && n && (r.offset = n), 
    enyo.Signals.send("onStatusUpdate", {
        msg: "Requesting dashboard posts..."
    }), APPLICATION.count.OAuthCalls++, i.get(TUMBLR.dashboardItemsURL, r, TUMBLR.PARSE.parseItems, function() {
        return TUMBLR.tryingSavedKeys ? (TUMBLR.logIn(TUMBLR.getItemsCallback), void 0) : (TUMBLR.setError("Could not connect to tumblr."), 
        void 0);
    });
}, TUMBLR.PARSE.parseItems = function(t) {
    var e = {};
    if (enyo.Signals.send("onStatusUpdate", {
        msg: "Parsing tumblr's response..."
    }), 0 === APPLICATION.postMode || TUMBLR.dashItems === !0 || TUMBLR.taggedItem === !0) {
        TUMBLR.taggedItem = !1;
        try {
            e = enyo.json.parse(t.text);
        } catch (n) {
            return TUMBLR.setError("tumblr API servers are down. Try again soon. :("), void 0;
        }
    } else try {
        e = enyo.json.parse(t.responseText);
    } catch (n) {
        return TUMBLR.setError("tumblr API servers are down. Try again soon. :("), void 0;
    }
    if (e && e.meta && e.meta.msg && "OK" == e.meta.msg) {
        var i = 0;
        try {
            i = e.response.posts.length;
        } catch (n) {
            var o = e.response;
            e.response = {}, e.response.posts = o, i = o.length;
        }
        0 >= i && TUMBLR.gatheringFavorites === !1 ? (window.setTimeout(enyo.bind(this, function() {
            TUMBLR.dashItems = !1;
        }), 3e3), TUMBLR.noMorePostCallback()) : TUMBLR.getItemsCallback(e);
    } else {
        if (TUMBLR.tryingSavedKeys) return TUMBLR.logIn(TUMBLR.getItemsCallback), void 0;
        TUMBLR.dashItems = !1;
        var r = "Could not connect.";
        TUMBLR.setError("Error: " + r);
    }
}, TUMBLR.PARSE.parseUserInfo = function(t) {
    enyo.Signals.send("onStatusUpdate", {
        msg: "Parsing tumblr's response..."
    });
    var e = {};
    try {
        e = enyo.json.parse(t.text);
    } catch (n) {
        return TUMBLR.setError("tumblr API servers are down. Try again soon. :("), void 0;
    }
    if (e && e.meta && e.meta.msg && "OK" == e.meta.msg) {
        TUMBLR.userObject.blogs = [];
        for (var i = e.response.user.blogs, o = function() {
            return {
                name: "",
                title: "",
                url: "",
                primary: !1
            };
        }, r = 0; i.length > r; r++) {
            var a = new o();
            a.name = i[r].name, a.title = i[r].title, a.url = i[r].url, a.primary = "true" == i[r].primary || i[r].primary === !0 ? !0 : !1, 
            TUMBLR.userObject.blogs.push(a);
        }
        var s = PEEK.string.toBase64(enyo.json.stringify(TUMBLR.userObject)), l = APPLICATION.tumblrUserName.replace(/@/gi, "");
        l.length > 10 && (l = l.substr(0, 10)), STORAGE.set(l + "info", s), TUMBLR.getPrimaryBlogName(), 
        TUMBLR.justRefreshUserInfo === !1 ? (TUMBLR.dashItems = !0, TUMBLR.getItems(TUMBLR.logInCallBack)) : TUMBLR.bannerMessageCallback("Blog list refreshed!"), 
        TUMBLR.justRefreshUserInfo = !1;
    } else {
        var h = e.meta.msg;
        h || (h = "Could not connect."), TUMBLR.setError("Error: " + h);
    }
};

// source\tumblr\tumblr-like.js
TUMBLR.likePost = {}, TUMBLR.likePostCallback = function() {}, TUMBLR.unlikeErrorCallback = function() {}, 
TUMBLR.likeAndUnlikePost = function(t, e, n, i, o, r) {
    TUMBLR.likePostCallback = t, TUMBLR.unlikeErrorCallback = r;
    var a = n === !0 ? TUMBLR.likeUrl : TUMBLR.unlikeUrl, s = TUMBLR.buildOAuthOptions(), l = {
        id: i,
        reblog_key: o
    };
    TUMBLR.likePost = {
        liked: n,
        id: i,
        reblog_key: o,
        actualIndex: e
    };
    var h = OAuth(s);
    h.post(a, l, TUMBLR.PARSE.parseLikedResponse, function() {
        1 == APPLICATION.postMode || 2 == APPLICATION.postMode ? (TUMBLR.unlikeErrorCallback(TUMBLR.likePost), 
        TUMBLR.bannerMessageCallback("Post un-liked!")) : (TUMBLR.unlikeErrorCallback(TUMBLR.likePost), 
        TUMBLR.bannerMessageCallback("Could not connect to tumblr. :("));
    });
}, TUMBLR.PARSE.parseLikedResponse = function(t) {
    var e = {};
    try {
        e = enyo.json.parse(t.text);
    } catch (n) {
        return TUMBLR.unlikeErrorCallback(TUMBLR.likePost), TUMBLR.bannerMessageCallback("Liked post failed..."), 
        void 0;
    }
    e.meta.msg && "OK" == e.meta.msg ? TUMBLR.likePostCallback(TUMBLR.likePost) : (TUMBLR.unlikeErrorCallback(TUMBLR.likePost), 
    TUMBLR.bannerMessageCallback("Liked post failed..."));
};

// source\tumblr\tumblr-posting.js
TUMBLR.photoPosting = {}, TUMBLR.photoPosting.getBase64Img = function(t, e) {
    if (t.width > 500) new thumbnailer(e, t, 500, 3); else {
        e.width = t.width, e.height = t.height;
        var n = e.getContext("2d");
        n.drawImage(t, 0, 0);
    }
    var i = e.toDataURL("image/png");
    return i.replace(/^data:image\/(png|jpg);base64,/, "");
}, TUMBLR.photoPosting.keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", 
TUMBLR.photoPosting.decodeBase64 = function(t) {
    var e, n, i, o, r, a, s, l = [], h = 0, c = t;
    t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""), c != t && console.log("Warning! Characters outside Base64 range in input string ignored."), 
    t.length % 4 && console.log("Error: Input length is not a multiple of 4 bytes.");
    var u = 0, d = TUMBLR.photoPosting.keyStr;
    try {
        for (;t.length > h; ) o = d.indexOf(t.charAt(h++)), r = d.indexOf(t.charAt(h++)), 
        a = d.indexOf(t.charAt(h++)), s = d.indexOf(t.charAt(h++)), e = o << 2 | r >> 4, 
        n = (15 & r) << 4 | a >> 2, i = (3 & a) << 6 | s, l[u++] = e, 64 != a && (l[u++] = n), 
        64 != s && (l[u++] = i);
    } catch (f) {
        console.error(f);
    }
    return l;
}, TUMBLR.photoPosting._convert = function(t) {
    return t.map(function(t) {
        var e = parseInt(t, 16);
        return 46 >= e && e >= 45 || 57 >= e && e >= 48 || 90 >= e && e >= 65 || 95 == e || 122 >= e && e >= 97 ? String.fromCharCode(e) : "%" + t.toUpperCase();
    }).join("").replace(/\%7E/g, "~");
}, TUMBLR.photoPosting.base64ToHex = function(t) {
    for (var e = "0123456789ABCDEF", n = e.substr(15 & t, 1); t > 15; ) t >>= 4, n = e.substr(15 & t, 1) + n;
    return n;
}, TUMBLR.photoPosting.convertForTumblr = function(t) {
    var e = TUMBLR.photoPosting.decodeBase64(t).map(function(t) {
        return (16 > t ? "0" : "") + TUMBLR.photoPosting.base64ToHex(t);
    });
    return TUMBLR.photoPosting._convert(e);
}, TUMBLR.postPhoto = function(t) {
    TUMBLR.photoPosting._continue(t, 0);
}, TUMBLR.photoPosting._continue = function(t, e) {
    if (t.srcs[e]) {
        enyo.Signals.send("onStatusUpdate", {
            msg: "Converting photo " + (e + 1) + " of " + t.srcs.length
        });
        var n = t.srcs[e].src.replace(/^data:image\/(png|jpg);base64,/, "");
        t.srcs[e] = TUMBLR.photoPosting.convertForTumblr(n), e++, setTimeout(function() {
            TUMBLR.photoPosting._continue(t, e);
        }, 100);
    } else enyo.Signals.send("onStatusUpdate", {
        msg: "Sending to tumblr... "
    }), setTimeout(function() {
        TUMBLR.photoPosting.sendPhotos(t);
    }, 500);
}, TUMBLR.photoPosting.sendPhotos = function(t) {
    var e = t.blog + ".tumblr.com", n = "api.tumblr.com/v2/blog/" + e + "/post", i = TUMBLR.buildOAuthOptions(), o = {
        type: "photo",
        caption: t.body,
        data: t.srcs,
        state: t.state,
        tags: t.tags
    }, r = OAuth(i);
    r.post(n, o, TUMBLR.PARSE.parsePostResponse, function() {
        TUMBLR.bannerMessageCallback("Posting Failed.");
    });
}, TUMBLR.postText = function(t) {
    var e = t.blog + ".tumblr.com", n = "api.tumblr.com/v2/blog/" + e + "/post", i = TUMBLR.buildOAuthOptions(), o = {
        type: "text",
        body: t.body,
        state: t.state,
        tags: t.tags,
        title: t.title
    }, r = OAuth(i);
    r.post(n, o, TUMBLR.PARSE.parsePostResponse, function() {
        TUMBLR.bannerMessageCallback("Posting Failed.");
    });
}, TUMBLR.PARSE.parsePostResponse = function(t) {
    try {
        resp = enyo.json.parse(t.text);
    } catch (e) {
        return TUMBLR.bannerMessageCallback("Posting failed..."), void 0;
    }
    201 == parseInt(resp.meta.status, 10) && (enyo.Signals.send("onTumblrPosted", resp), 
    setTimeout(function() {
        TUMBLR.bannerMessageCallback("Post made!");
    }, 5e3));
};

// source\tumblr\tumblr-rebloging.js
TUMBLR.reblogObject = {}, TUMBLR.reblogPost = function(t, e, n, i, o, r) {
    TUMBLR.reblogObject = t;
    var a = t.blogName + ".tumblr.com", s = "api.tumblr.com/v2/blog/" + a + "/post/reblog", l = "";
    l = "reblog" == t.reblogMethod ? "published" : t.reblogMethod.toLowerCase();
    var h = TUMBLR.buildOAuthOptions(), c = {
        id: e,
        reblog_key: n,
        state: l,
        type: i
    };
    APPLICATION.tumblrUseTags === !0 && o.length > 0 && (c.tags = o.join(",")), r && r.length > 0 && (r = "<b>" + t.blogName + " adds:</b><br />" + r, 
    c.comment = r);
    var u = OAuth(h);
    u.post(s, c, TUMBLR.PARSE.parseReblogResponse, function() {
        TUMBLR.setError("Could not connect to tumblr.");
    });
}, TUMBLR.PARSE.parseReblogResponse = function(t) {
    var e = {};
    try {
        e = enyo.json.parse(t.text);
    } catch (n) {
        return TUMBLR.bannerMessageCallback("Reblog post failed...", TUMBLR.reblogObject.blogName), 
        void 0;
    }
    if (201 == parseInt(e.meta.status, 10)) {
        var i = "";
        "reblog" == TUMBLR.reblogObject.reblogMethod ? i = "Reblogged to " : "queue" == TUMBLR.reblogObject.reblogMethod ? i = "Queued to " : "draft" == TUMBLR.reblogObject.reblogMethod && (i = "Draft created on "), 
        enyo.Signals.send("onRequestHideBanner"), TUMBLR.bannerMessageCallback(i + LIMIT_TEXT_LENGTH(TUMBLR.reblogObject.blogName, 200), TUMBLR.reblogObject.blogName), 
        TUMBLR.reblogObject = {};
    } else TUMBLR.bannerMessageCallback("Reblog post failed...", TUMBLR.reblogObject.blogName);
};

// source\androidcontrols\androidscroller.js
enyo.kind({
    name: "android.TranslateScrollStrategy",
    kind: "enyo.TranslateScrollStrategy",
    shouldThumbVertical: function() {
        return "hidden" != this.vertical ? !0 : !1;
    },
    shouldThumbHorizontal: function() {
        return "hidden" != this.horizontal ? !0 : !1;
    },
    syncThumbs: function() {
        this.shouldThumbVertical() && this.$.vthumb.sync(this), this.shouldThumbHorizontal() && this.$.hthumb.sync(this);
    },
    updateThumbs: function() {
        this.shouldThumbVertical() && this.$.vthumb.update(this), this.shouldThumbHorizontal() && this.$.hthumb.update(this);
    },
    showThumbs: function() {
        this.syncThumbs(), this.shouldThumbVertical() && this.$.vthumb.show(), this.shouldThumbHorizontal() && this.$.hthumb.show();
    },
    hideThumbs: function() {
        this.shouldThumbVertical() && this.$.vthumb.hide(), this.shouldThumbHorizontal() && this.$.hthumb.hide();
    },
    delayHideThumbs: function(t) {
        this.shouldThumbVertical() && this.$.vthumb.delayHide(t), this.shouldThumbHorizontal() && this.$.hthumb.delayHide(t);
    }
}), enyo.kind({
    name: "android.Scroller",
    kind: "enyo.Scroller",
    handlers: {
        onScrollToTop: "scrollToZero",
        onscroll: "domScroll",
        onScrollStart: "scrollStart",
        onScroll: "scroll",
        onScrollStop: "scrollStop"
    },
    strategyKind: "android.TranslateScrollStrategy",
    thumb: !0,
    createStrategy: function() {
        this.createComponents([ {
            name: "strategy",
            maxHeight: this.maxHeight,
            kind: this.strategyKind,
            thumb: this.thumb,
            preventDragPropagation: this.preventDragPropagation,
            overscroll: this.touchOverscroll,
            translateOptimized: !0,
            isChrome: !0
        } ]);
    },
    scrollToZero: function() {
        this.setScrollTop(0);
    }
}), enyo.kind({
    name: "blackberry.Scroller",
    kind: "enyo.Scroller",
    handlers: {
        onScrollToTop: "scrollToZero",
        onscroll: "domScroll",
        onScrollStart: "scrollStart",
        onScroll: "scroll",
        onScrollStop: "scrollStop"
    },
    strategyKind: "enyo.TransitionScrollStrategy",
    thumb: !0,
    createStrategy: function() {
        this.createComponents([ {
            name: "strategy",
            maxHeight: this.maxHeight,
            kind: this.strategyKind,
            thumb: this.thumb,
            preventDragPropagation: this.preventDragPropagation,
            overscroll: this.touchOverscroll,
            isChrome: !0
        } ]);
    },
    scrollToZero: function() {
        this.setScrollTop(0);
    }
});

// source\androidcontrols\androiditem.js
enyo.kind({
    name: "android.Item",
    kind: "onyx.Item",
    highlightClass: "onyx-highlight",
    useOnDown: !1,
    handlers: {
        onhold: "hold",
        onrelease: "release",
        ondown: "down"
    },
    hold: function(t, e) {
        return this.tapHighlight && android.Item.addFlyweightClass(this.controlParent || this, this.highlightClass, e), 
        window.setTimeout(enyo.bind(this, function() {
            this.release(t, e);
        }), 250), !1;
    },
    down: function(t, e) {
        return this.useOnDown === !0 && this.hold(t, e), !1;
    },
    holdLongRelease: function(t, e) {
        return this.tapHighlight && android.Item.addFlyweightClass(this.controlParent || this, this.highlightClass, e), 
        window.setTimeout(enyo.bind(this, function() {}), 1e3), !1;
    },
    release: function(t, e) {
        this.tapHighlight && android.Item.removeFlyweightClass(this.controlParent || this, this.highlightClass, e);
    },
    statics: {
        addFlyweightClass: function(t, e, n, i) {
            var o = n.flyweight;
            if (o) {
                var r = void 0 !== i ? i : n.index;
                o.performOnRow(r, function() {
                    t.hasClass(e) ? t.setClassAttribute(t.getClassAttribute()) : t.addClass(e);
                }), t.removeClass(e);
            } else t.hasClass(e) || t.addClass(e);
        },
        removeFlyweightClass: function(t, e, n, i) {
            var o = n.flyweight;
            if (o) {
                var r = void 0 !== i ? i : n.index;
                o.performOnRow(r, function() {
                    t.hasClass(e) ? t.removeClass(e) : t.setClassAttribute(t.getClassAttribute());
                });
            } else t.hasClass(e) && t.removeClass(e);
        }
    }
});

// source\androidcontrols\androidlist.js
enyo.kind({
    name: "android.List",
    kind: "enyo.List",
    statics: {
        swipeCount: 0
    },
    touch: !0,
    listTools: [ {
        name: "port",
        classes: "enyo-list-port enyo-border-box",
        components: [ {
            name: "generator",
            kind: "FlyweightRepeater",
            canGenerate: !1,
            components: [ {
                tag: null,
                name: "client"
            } ]
        }, {
            name: "holdingarea",
            allowHtml: !0,
            classes: "enyo-list-holdingarea"
        }, {
            name: "page0",
            allowHtml: !0,
            classes: "enyo-list-page"
        }, {
            name: "page1",
            allowHtml: !0,
            classes: "enyo-list-page"
        }, {
            name: "placeholder",
            classes: "enyo-list-placeholder"
        }, {
            name: "swipeableComponents",
            style: "position:absolute;top:-1000px;",
            showing: !1,
            onwebkitAnimationEnd: "completeSwipe"
        } ]
    } ],
    percentageDraggedThreshold: .05,
    create: function() {
        if (this.inherited(arguments), enyo.platform.blackberry || enyo.platform.firefoxOS) this.$.swipeableComponents.addStyles("position:absolute; display:block; top:-1000px; left:0;"); else if (this.enableSwipe) if (enyo.platform.androidChrome) ; else {
            android.List.swipeCount++;
            var t = [];
            t.push({
                keyText: "0%",
                keyValue: "{" + enyo.dom.getCssTransformProp() + ": translate3d(0,0,0);}"
            }), t.push({
                keyText: "100%",
                keyValue: "{" + enyo.dom.getCssTransformProp() + ": translate3d(0,0,0);}"
            }), enyo.dom.createKeyframes("swipeable-slide" + android.List.swipeCount, t), this.keyFrameRule = "swipeable-slide" + android.List.swipeCount;
        }
    },
    createStrategy: function() {
        this.controlParentName = "strategy", this.createComponents([ {
            name: "strategy",
            maxHeight: this.maxHeight,
            kind: "enyo.TranslateScrollStrategy",
            thumb: this.thumb,
            preventDragPropagation: this.preventDragPropagation,
            overscroll: this.touchOverscroll,
            translateOptimized: !0,
            scrim: !0,
            isChrome: !0
        } ]), this.createChrome(this.listTools), this.controlParentName = "client", this.discoverControlParent();
    },
    openSwipeable: function(t) {
        this.$.swipeableComponents.setShowing(!1), this.swipeIndex = t.index, this.startSwipe(t), 
        this.swipe(this.fastSwipeSpeedMS);
    },
    attachedEvent: !1,
    extractXY: function(t) {
        if (t) {
            var e = t.indexOf("(") + 1, n = t.indexOf(","), i = t.indexOf(",", n + 1);
            return {
                x: t.substr(e, n - e),
                y: t.substr(n + 1, i - n - 1)
            };
        }
        return {
            x: 0,
            y: 0
        };
    },
    animateSwipe: function(t, e) {
        if (enyo.platform.blackberry || enyo.platform.firefoxOS) return this.inherited(arguments), 
        void 0;
        this.animation = !0;
        var n = this.$.swipeableComponents, i = this.extractXY(n.domStyles[enyo.dom.getCssTransformProp()]), o = parseInt(i.x, 10), r = t - o;
        if (enyo.platform.androidChrome) {
            var a = enyo.now();
            this.stopAnimateSwipe();
            var s = this.bindSafely(function() {
                var t = enyo.now() - a, l = t / e, h = o + r * Math.min(l, 1);
                n.applyStyle("left", h + "px"), enyo.dom.transformValue(n, "translate3d", h + "px," + i.y + "px, 0"), 
                this.job = enyo.requestAnimationFrame(s), t / e >= 1 && (this.stopAnimateSwipe(), 
                this.completeSwipeTimeout = setTimeout(this.bindSafely(function() {
                    this.completeSwipe();
                }), this.completeSwipeDelayMS));
            });
            this.job = enyo.requestAnimationFrame(s);
        } else {
            if (this.$.swipeableComponents.applyStyle(enyo.dom.getCSSPrefix("animation-name", "AnimationName"), "none"), 
            0 === r) return;
            var l = [];
            l.push({
                keyText: "0%",
                keyValue: "{" + enyo.dom.getCssTransformProp() + ": translate3d(" + o + "px," + i.y + ",0);}"
            }), l.push({
                keyText: "100%",
                keyValue: "{" + enyo.dom.getCssTransformProp() + ": translate3d(" + t + "px," + i.y + ",0);}"
            }), n.finsihedValue = enyo.dom.getCssTransformProp() + ": translate3d(" + t + "px," + i.y + ",0);", 
            n.applyStyle(enyo.dom.getCSSPrefix("animation-duration", "AnimationDuration"), e + "ms"), 
            n.applyStyle(enyo.dom.getCSSPrefix("animation-timing-function", "AnimationTimingFunction"), "linear"), 
            n.applyStyle(enyo.dom.getCssTransformProp(), null), setTimeout(enyo.bind(this, function() {
                n.applyStyle(enyo.dom.getCSSPrefix("animation-name", "AnimationName"), enyo.dom.changeKeyframes(this.keyFrameRule, l));
            }), 0);
        }
    },
    stopAnimateSwipe: function() {
        return enyo.platform.blackberry || enyo.platform.androidChrome || enyo.platform.firefoxOS ? (this.inherited(arguments), 
        void 0) : void 0;
    },
    slideAwayItem: function() {
        if (enyo.platform.blackberry || enyo.platform.firefoxOS) return this.inherited(arguments), 
        void 0;
        var t = this.$.swipeableComponents, e = t.getBounds().width, n = "left" == this.persistentItemOrigin ? -1 * e : e;
        this.animateSwipe(n, this.normalSwipeSpeedMS), this.persistentItemVisible = !1, 
        this.setPersistSwipeableItem(!1), this.completeSwipeTimeout = setTimeout(enyo.bind(this, function() {
            this.completeSwipe();
        }), this.normalSwipeSpeedMS + 10);
    },
    startSwipe: function(t) {
        this.log(t), t.index = this.swipeIndex, this.positionSwipeableContainer(this.swipeIndex, t), 
        this.$.swipeableComponents.setShowing(!0), this.setPersistentItemOrigin(t.xDirection), 
        this.doSetupSwipeItem(t);
    },
    positionSwipeableContainer: function(t, e) {
        if (enyo.platform.blackberry || enyo.platform.firefoxOS) return this.inherited(arguments), 
        void 0;
        var n = this.$.generator.fetchRowNode(t);
        if (this.log(n), n) {
            var i = this.getRelativeOffset(n, this.hasNode());
            i.top += 1e3;
            var o = enyo.dom.getBounds(n), r = 1 == e.xDirection ? -1 * (o.width - e.pageX) : o.width - (o.width - e.pageX);
            enyo.platform.androidChrome || this.$.swipeableComponents.applyStyle(enyo.dom.getCSSPrefix("animation-name", "AnimationName"), "none"), 
            this.$.swipeableComponents.addStyles(enyo.dom.getCssTransformProp() + ": translate3d(" + r + "px," + i.top + "px, 0);height: " + o.height + "px; width: " + o.width + "px;"), 
            this.log(this.$.swipeableComponents);
        }
    },
    calcNewDragPosition: function(t) {
        if (enyo.platform.blackberry || enyo.platform.firefoxOS) return this.inherited(arguments), 
        void 0;
        var e = this.extractXY(this.$.swipeableComponents.domStyles[enyo.dom.getCssTransformProp()]), n = parseInt(e.x, 10), i = this.$.swipeableComponents.getBounds(), o = 1 == this.swipeDirection ? 0 : -1 * i.width, r = 1 == this.swipeDirection ? n + t > o ? o : n + t : o > n + t ? o : n + t;
        return {
            x: r,
            y: parseInt(e.y, 10)
        };
    },
    dragSwipeableComponents: function(t) {
        return enyo.platform.blackberry || enyo.platform.firefoxOS ? (this.inherited(arguments), 
        void 0) : (enyo.dom.transformValue(this.$.swipeableComponents, "translate3d", t.x + "px," + t.y + "px, 0"), 
        this.log(t), void 0);
    },
    backOutSwipe: function() {
        return enyo.platform.blackberry || enyo.platform.firefoxOS ? (this.inherited(arguments), 
        void 0) : (this.completeSwipeTimeout = setTimeout(enyo.bind(this, this.completeSwipe), this.fastSwipeSpeedMS + 15), 
        this.inherited(arguments), this.setPersistSwipeableItem(!1), void 0);
    },
    dragPersistentItem: function(t) {
        if (enyo.platform.blackberry || enyo.platform.firefoxOS) return this.inherited(arguments), 
        void 0;
        this.log(t);
        var e = this.$.swipeableComponents.getBounds();
        e.top = parseInt(this.extractXY(this.$.swipeableComponents.domStyles[enyo.dom.getCssTransformProp()]).y, 10);
        var n = 0, i = "right" == this.persistentItemOrigin ? Math.max(n, n + t.dx) : Math.min(n, n + t.dx);
        enyo.dom.transformValue(this.$.swipeableComponents, "translate3d", i + "px," + e.top + "px, 0");
    },
    bounceItem: function() {
        if (enyo.platform.blackberry || enyo.platform.firefoxOS) return this.inherited(arguments), 
        void 0;
        var t = this.$.swipeableComponents.getBounds();
        t.left = parseInt(this.extractXY(this.$.swipeableComponents.domStyles[enyo.dom.getCssTransformProp()]).x, 10), 
        t.left != t.width && this.animateSwipe(0, this.normalSwipeSpeedMS);
    },
    completeSwipe: function() {
        return enyo.platform.blackberry || enyo.platform.firefoxOS ? (this.inherited(arguments), 
        void 0) : (this.$.swipeableComponents.addStyles(this.$.swipeableComponents.finsihedValue), 
        this.completeSwipeTimeout && (clearTimeout(this.completeSwipeTimeout), this.completeSwipeTimeout = null), 
        this.getPersistSwipeableItem() ? this.persistentItemVisible = !0 : (this.$.swipeableComponents.setShowing(!1), 
        this.swipeComplete && this.doSwipeComplete({
            index: this.swipeIndex,
            xDirection: this.swipeDirection
        })), this.swipeIndex = null, this.swipeDirection = null, enyo.platform.androidChrome || this.$.swipeableComponents.applyStyle(enyo.dom.getCSSPrefix("animation-name", "AnimationName"), "none"), 
        void 0);
    }
});

// source\androidcontrols\androidmenu.js
enyo.kind({
    name: "android.Menu",
    kind: "onyx.Menu",
    childComponents: [ {
        name: "client",
        kind: "android.Scroller",
        horizontal: "hidden"
    } ],
    adjustPosition: function() {
        if (this.showing && this.hasNode()) {
            this.scrolling && !this.showOnTop ? this.getScroller().setMaxHeight(this.maxHeight + "px") : enyo.nop, 
            this.removeClass("onyx-menu-up"), this.floating ? enyo.noop : this.applyPosition({
                left: "auto"
            });
            var t = this.node.getBoundingClientRect(), e = void 0 === t.height ? t.bottom - t.top : t.height, n = void 0 === window.innerHeight ? document.documentElement.clientHeight : window.innerHeight, i = void 0 === window.innerWidth ? document.documentElement.clientWidth : window.innerWidth;
            this.menuUp = t.top + e > n && n - t.bottom < t.top - e, this.addRemoveClass("onyx-menu-up", this.menuUp);
            var o = this.activatorOffset;
            if (this.floating && t && o && (this.menuUp ? this.applyPosition({
                top: o.top - e + (this.showOnTop ? o.height : 0),
                bottom: "auto"
            }) : t.top < o.top && n > o.top + (this.showOnTop ? 0 : o.height) + e && this.applyPosition({
                top: o.top + (this.showOnTop ? 0 : o.height),
                bottom: "auto"
            })), o && t.right > i && (this.floating ? this.applyPosition({
                left: o.left - (t.left + t.width - i)
            }) : this.applyPosition({
                left: -(t.right - i)
            })), 0 > t.left && (this.floating ? this.applyPosition({
                left: 0,
                right: "auto"
            }) : "auto" == this.getComputedStyleValue("right") ? this.applyPosition({
                left: -t.left
            }) : this.applyPosition({
                right: t.left
            })), this.scrolling && !this.showOnTop) {
                t = this.node.getBoundingClientRect();
                var r;
                r = this.menuUp ? this.maxHeight < t.bottom ? this.maxHeight : t.bottom : n > t.top + this.maxHeight ? this.maxHeight : n - t.top, 
                this.getScroller().setMaxHeight(r + "px");
            }
        }
    }
});

// source\androidcontrols\androidimageview.js
enyo.kind({
    name: "blogWalker.ImageView",
    kind: "ImageView",
    create: function() {
        this.inherited(arguments), this.$.image.addClass("no-limits");
    }
}), enyo.kind({
    name: "android.ImageView",
    kind: enyo.Scroller,
    touchOverscroll: !1,
    thumb: !1,
    animate: !0,
    verticalDragPropagation: !0,
    horizontalDragPropagation: !0,
    published: {
        scale: "auto",
        disableZoom: !1,
        src: void 0
    },
    events: {
        onZoom: ""
    },
    loadingTool: {
        kind: "Control",
        style: "position: absolute;top:0;left:0;",
        name: "loadingTool",
        showing: !1,
        components: [ {
            kind: "onyx.Spinner",
            name: "spin",
            style: "background-size:32px 32px;display:inline-block;width:32px;height:32px;margin-right:10px;",
            classes: "onyx-light"
        }, {
            content: "Loading...",
            style: "display:inline-block;"
        } ]
    },
    touch: !0,
    preventDragPropagation: !1,
    handlers: {
        ondragstart: "dragPropagation",
        onload: "removeContent"
    },
    components: [ {
        name: "animator",
        kind: "Animator",
        onStep: "zoomAnimationStep",
        onEnd: "zoomAnimationEnd"
    }, {
        name: "viewport",
        style: "overflow:hidden;min-height:100%;min-width:100%;",
        classes: "enyo-fit",
        ongesturechange: "gestureTransform",
        ongestureend: "saveState",
        ontap: "singleTap",
        ondblclick: "doubleClick",
        onmousewheel: "mousewheel",
        components: [ {
            kind: "ClassBufferedImage",
            name: "image",
            ondown: "down",
            border: !1
        } ]
    } ],
    create: function() {
        this.inherited(arguments), this.canTransform = enyo.dom.canTransform(), this.canTransform || this.$.image.applyStyle("position", "relative"), 
        this.canAccelerate = enyo.dom.canAccelerate(), this.bufferImage = new Image(), this.bufferImage.onload = enyo.bind(this, "imageLoaded"), 
        this.bufferImage.onerror = enyo.bind(this, "imageError"), this.srcChanged(), this.getStrategy().setDragDuringGesture(!1), 
        this.getStrategy().$.scrollMath && this.getStrategy().$.scrollMath.start(), this.$.image.isChrome = !0, 
        this.$.viewport.isChrome = !0, this.$.animator.isChrome = !0;
    },
    down: function(t, e) {
        e.preventDefault();
    },
    dragPropagation: function(t, e) {
        var i = this.getStrategy().getScrollBounds(), n = 0 === i.top && e.dy > 0 || i.top >= i.maxTop - 2 && 0 > e.dy, o = 0 === i.left && e.dx > 0 || i.left >= i.maxLeft - 2 && 0 > e.dx;
        return !(n && this.verticalDragPropagation || o && this.horizontalDragPropagation);
    },
    mousewheel: function(t, e) {
        e.pageX |= e.clientX + e.target.scrollLeft, e.pageY |= e.clientY + e.target.scrollTop;
        var i = (this.maxScale - this.minScale) / 10, n = this.scale;
        return e.wheelDelta > 0 || 0 > e.detail ? this.scale = this.limitScale(this.scale + i) : (0 > e.wheelDelta || e.detail > 0) && (this.scale = this.limitScale(this.scale - i)), 
        this.eventPt = this.calcEventLocation(e), this.transformImage(this.scale), n != this.scale && this.doZoom({
            scale: this.scale
        }), this.ratioX = this.ratioY = null, e.preventDefault(), !0;
    },
    srcChanged: function() {
        this.src && this.src.length > 0 && this.bufferImage && this.src != this.bufferImage.src && (this.bufferImage.src = this.src);
    },
    imageLoaded: function() {
        this.originalWidth = this.bufferImage.width, this.originalHeight = this.bufferImage.height, 
        this.scaleChanged(), this.$.image && (this.$.image.setSrc(this.bufferImage.src), 
        setTimeout(enyo.bind(this, function() {
            this.$.image.showGif();
        }), 500)), enyo.dom.transformValue(this.getStrategy().$.client, "translate3d", "0px, 0px, 0"), 
        this.positionClientControls(this.scale), this.alignImage();
    },
    resizeHandler: function() {
        this.inherited(arguments), this.$.image.src && this.scaleChanged();
    },
    scaleChanged: function() {
        this.createLoadingTool(), this.$.loadingTool.show();
        var t = this.hasNode();
        if (t) {
            this.containerWidth = t.clientWidth, this.containerHeight = t.clientHeight;
            var e = this.containerWidth / this.originalWidth, i = this.containerHeight / this.originalHeight;
            this.minScale = Math.min(e, i), this.maxScale = 1 > 3 * this.minScale ? 1 : 3 * this.minScale, 
            "auto" == this.scale ? this.scale = this.minScale : "width" == this.scale ? this.scale = e : "height" == this.scale ? this.scale = i : "fit" == this.scale ? (this.fitAlignment = "center", 
            this.scale = Math.max(e, i)) : (this.maxScale = Math.max(this.maxScale, this.scale), 
            this.scale = this.limitScale(this.scale));
        }
        this.eventPt = this.calcEventLocation(), this.transformImage(this.scale);
    },
    imageError: function(t) {
        enyo.error("Error loading image: " + this.src), this.bubble("onerror", t);
    },
    alignImage: function() {
        if (this.fitAlignment && "center" === this.fitAlignment) {
            var t = this.getScrollBounds();
            this.setScrollLeft(t.maxLeft / 2), this.setScrollTop(t.maxTop / 2);
        }
    },
    gestureTransform: function(t, e) {
        this.eventPt = this.calcEventLocation(e), this.transformImage(this.limitScale(this.scale * e.scale));
    },
    calcEventLocation: function(t) {
        var e = {
            x: 0,
            y: 0
        };
        if (t && this.hasNode()) {
            var i = this.node.getBoundingClientRect();
            e.x = Math.round(t.pageX - i.left - this.imageBounds.x), e.x = Math.max(0, Math.min(this.imageBounds.width, e.x)), 
            e.y = Math.round(t.pageY - i.top - this.imageBounds.y), e.y = Math.max(0, Math.min(this.imageBounds.height, e.y));
        }
        return e;
    },
    transformImage: function(t) {
        this.tapped = !1;
        var e = this.imageBounds || this.innerImageBounds(t);
        this.imageBounds = this.innerImageBounds(t), this.scale > this.minScale ? this.$.viewport.applyStyle("cursor", "move") : this.$.viewport.applyStyle("cursor", null), 
        this.$.viewport.setBounds({
            width: this.imageBounds.width + "px",
            height: this.imageBounds.height + "px"
        }), this.ratioX = this.ratioX || (this.eventPt.x + this.getScrollLeft()) / e.width, 
        this.ratioY = this.ratioY || (this.eventPt.y + this.getScrollTop()) / e.height;
        var i, n;
        if (this.$.animator.ratioLock ? (i = this.$.animator.ratioLock.x * this.imageBounds.width - this.containerWidth / 2, 
        n = this.$.animator.ratioLock.y * this.imageBounds.height - this.containerHeight / 2) : (i = this.ratioX * this.imageBounds.width - this.eventPt.x, 
        n = this.ratioY * this.imageBounds.height - this.eventPt.y), i = Math.max(0, Math.min(this.imageBounds.width - this.containerWidth, i)), 
        n = Math.max(0, Math.min(this.imageBounds.height - this.containerHeight, n)), this.canTransform) {
            var o = {
                scale: t
            };
            o = this.canAccelerate ? enyo.mixin({
                translate3d: Math.round(this.imageBounds.left) + "px, " + Math.round(this.imageBounds.top) + "px, 0px"
            }, o) : enyo.mixin({
                translate: this.imageBounds.left + "px, " + this.imageBounds.top + "px"
            }, o), enyo.dom.transform(this.$.image, o);
        } else this.$.image.setBounds({
            width: this.imageBounds.width + "px",
            height: this.imageBounds.height + "px",
            left: this.imageBounds.left + "px",
            top: this.imageBounds.top + "px"
        });
        this.setScrollLeft(i), this.setScrollTop(n), this.positionClientControls(t);
    },
    limitScale: function(t) {
        return this.disableZoom ? t = this.scale : t > this.maxScale ? t = this.maxScale : this.minScale > t && (t = this.minScale), 
        t;
    },
    innerImageBounds: function(t) {
        var e = this.originalWidth * t, i = this.originalHeight * t, n = {
            x: 0,
            y: 0,
            transX: 0,
            transY: 0
        };
        return this.containerWidth > e && (n.x += (this.containerWidth - e) / 2), this.containerHeight > i && (n.y += (this.containerHeight - i) / 2), 
        this.canTransform && (n.transX -= (this.originalWidth - e) / 2, n.transY -= (this.originalHeight - i) / 2), 
        {
            left: n.x + n.transX,
            top: n.y + n.transY,
            width: e,
            height: i,
            x: n.x,
            y: n.y
        };
    },
    saveState: function(t, e) {
        var i = this.scale;
        this.scale *= e.scale, this.scale = this.limitScale(this.scale), i != this.scale && this.doZoom({
            scale: this.scale
        }), this.ratioX = this.ratioY = null;
    },
    doubleClick: function(t, e) {
        8 == enyo.platform.ie && (this.tapped = !0, e.pageX = e.clientX + e.target.scrollLeft, 
        e.pageY = e.clientY + e.target.scrollTop, this.singleTap(t, e), e.preventDefault());
    },
    singleTap: function(t, e) {
        setTimeout(enyo.bind(this, function() {
            this.tapped = !1;
        }), 300), this.tapped ? (this.tapped = !1, this.smartZoom(t, e)) : this.tapped = !0;
    },
    smartZoom: function(t, e) {
        var i = this.hasNode(), n = this.$.image.hasNode();
        if (i && n && this.hasNode() && !this.disableZoom) {
            var o = this.scale;
            if (this.scale = this.scale != this.minScale ? this.minScale : this.maxScale, this.eventPt = this.calcEventLocation(e), 
            this.animate) {
                var a = {
                    x: (this.eventPt.x + this.getScrollLeft()) / this.imageBounds.width,
                    y: (this.eventPt.y + this.getScrollTop()) / this.imageBounds.height
                };
                this.$.animator.play({
                    duration: 350,
                    ratioLock: a,
                    baseScale: o,
                    deltaScale: this.scale - o
                });
            } else this.transformImage(this.scale), this.doZoom({
                scale: this.scale
            });
        }
    },
    zoomAnimationStep: function() {
        var t = this.$.animator.baseScale + this.$.animator.deltaScale * this.$.animator.value;
        this.transformImage(t);
    },
    zoomAnimationEnd: function() {
        this.doZoom({
            scale: this.scale
        }), this.$.animator.ratioLock = void 0;
    },
    positionClientControls: function(t) {
        this.waterfallDown("onPositionPin", {
            scale: t,
            bounds: this.imageBounds
        });
    },
    createLoadingTool: function() {
        if (!this.$.loadingTool) {
            var t = this.createComponent(this.loadingTool, {
                owner: this
            });
            t.render();
        }
    },
    removeContent: function() {
        this.$.loadingTool.hide();
    }
}), enyo.kind({
    name: "aandroid.ImageView",
    kind: "ImageView",
    handlers: {
        onload: "removeContent"
    },
    loadingTool: {
        kind: "Control",
        style: "position: absolute;top:0;left:0;",
        name: "loadingTool",
        showing: !1,
        components: [ {
            kind: "onyx.Spinner",
            name: "spin",
            style: "background-size:32px 32px;display:inline-block;width:32px;height:32px;margin-right:10px;",
            classes: "onyx-light"
        }, {
            content: "Loading...",
            style: "display:inline-block;"
        } ]
    },
    create: function() {
        this.inherited(arguments), this.destroyComponents(), this.createComponents([ {
            name: "animator",
            kind: "Animator",
            onStep: "zoomAnimationStep",
            onEnd: "zoomAnimationEnd"
        }, {
            name: "viewport",
            style: "overflow:hidden;min-height:100%;min-width:100%;",
            classes: "enyo-fit",
            ongesturechange: "gestureTransform",
            ongestureend: "saveState",
            ontap: "singleTap",
            ondblclick: "doubleClick",
            onmousewheel: "mousewheel",
            components: [ {
                kind: "BufferedCanvasImage",
                name: "image",
                ondown: "down"
            } ]
        } ]), this.render(), this.$.image.setClasses("no-limits"), this.$.image.isChrome = !0, 
        this.$.viewport.isChrome = !0, this.$.animator.isChrome = !0;
    },
    createLoadingTool: function() {
        if (!this.$.loadingTool) {
            var t = this.createComponent(this.loadingTool, {
                owner: this
            });
            t.render();
        }
    },
    imageLoaded: function() {
        this.originalWidth = this.bufferImage.width, this.originalHeight = this.bufferImage.height, 
        this.scaleChanged(), this.$.image.setSrc(this.bufferImage.src), this.$.image.showGif(), 
        enyo.dom.transformValue(this.getStrategy().$.client, "translate3d", "0px, 0px, 0"), 
        this.positionClientControls(this.scale), this.alignImage();
    },
    srcChanged: function() {
        this.inherited(arguments), this.createLoadingTool(), this.$.loadingTool.show();
    },
    removeContent: function() {
        this.$.loadingTool.hide();
    }
});

// source\androidcontrols\smoothpanels.js
enyo.kind({
    name: "SmoothPanels",
    classes: "smoothpanels transform-3d",
    statics: {
        SLIDE_IN_FROM_RIGHT: "slideInFromRight",
        SLIDE_OUT_TO_LEFT: "slideOutToLeft",
        SLIDE_IN_FROM_TOP: "slideInFromTop",
        SLIDE_OUT_TO_BOTTOM: "slideOutToBottom",
        SLIDE_IN_FROM_LEFT: "slideInFromLeft",
        SLIDE_OUT_TO_RIGHT: "slideOutToRight",
        SLIDE_IN_FROM_BOTTOM: "slideInFromBottom",
        SLIDE_OUT_TO_TOP: "slideOutToTop",
        FADE_OUT: "fadeOut",
        FADE_IN: "fadeIn",
        NONE: "none",
        animationEventNames: {
            webkit: {
                start: "webkitAnimationStart",
                end: "webkitAnimationEnd"
            },
            moz: {
                start: "animationstart",
                end: "animationend"
            },
            ms: {
                start: "MSAnimationStart",
                end: "MSAnimationEnd"
            },
            o: {
                start: "oanimationstart",
                end: "oanimationend"
            }
        }
    },
    events: {
        onInAnimationStart: "",
        onOutAnimationStart: "",
        onInAnimationEnd: "",
        onOutAnimationEnd: ""
    },
    published: {
        async: !1,
        inAnim: "slideInFromRight",
        outAnim: "slideOutToLeft",
        duration: 300,
        easing: "ease"
    },
    create: function() {
        this.inherited(arguments);
        var t = this.currentPanel = this.getClientControls()[0];
        this.getClientControls().forEach(function(e) {
            e != t && e.hide();
        }), this.animationStartHandler = enyo.bind(this, this.animationStart), this.animationEndHandler = enyo.bind(this, this.animationEnd);
    },
    rendered: function() {
        this.inherited(arguments);
        var t = SmoothPanels.animationEventNames[this.getVendorPrefix().lowercase];
        enyo.dispatcher.listen(this.hasNode(), t.start, this.animationStartHandler), enyo.dispatcher.listen(this.hasNode(), t.end, this.animationEndHandler);
    },
    getVendorPrefix: function() {
        if (!this.vPrefix) {
            var t = window.getComputedStyle(document.documentElement, ""), e = (Array.prototype.slice.call(t).join("").match(/-(moz|webkit|ms)-/) || "" === t.OLink && [ "", "o" ])[1];
            this.vPrefix = {
                lowercase: e,
                css: "-" + e + "-"
            };
        }
        return this.vPrefix;
    },
    applyAnimation: function(t, e, i, n) {
        t.applyStyle(this.getVendorPrefix().css + "animation", "none" == e ? e : e + " " + i + "ms " + n);
    },
    animationStart: function(t) {
        this.oldPanel && t.target == this.oldPanel.hasNode() && t.animationName == this.currOutAnim ? this.outAnimationStart() : this.newPanel && t.target == this.newPanel.hasNode() && t.animationName == this.currInAnim && this.inAnimationStart();
    },
    animationEnd: function(t) {
        this.oldPanel && t.target == this.oldPanel.hasNode() && t.animationName == this.currOutAnim ? this.outAnimationEnd() : this.newPanel && t.target == this.newPanel.hasNode() && t.animationName == this.currInAnim && this.inAnimationEnd();
    },
    startInAnimation: function() {
        this.newPanel.applyStyle("opacity", 0), this.newPanel.show(), enyo.asyncMethod(this, function() {
            this.newPanel.resized(), this.newPanel.applyStyle("opacity", 1), this.applyAnimation(this.newPanel, this.currInAnim, this.duration, this.easing);
        });
    },
    startOutAnimation: function() {
        this.applyAnimation(this.oldPanel, this.currOutAnim, this.duration, this.easing);
    },
    inAnimationStart: function() {
        this.doInAnimationStart({
            oldPanel: this.oldPanel,
            newPanel: this.newPanel
        });
    },
    outAnimationStart: function() {
        this.doOutAnimationStart({
            oldPanel: this.oldPanel,
            newPanel: this.newPanel
        }), this.animating = !0, this.async && this.startInAnimation();
    },
    inAnimationEnd: function() {
        this.doInAnimationEnd({
            oldPanel: this.oldPanel,
            newPanel: this.newPanel
        }), this.applyAnimation(this.newPanel, "none");
    },
    outAnimationEnd: function() {
        this.doOutAnimationEnd({
            oldPanel: this.oldPanel,
            newPanel: this.newPanel
        }), this.oldPanel.applyStyle("opacity", 0), this.applyAnimation(this.oldPanel, "none"), 
        this.oldPanel.hide(), this.animating = !1;
    },
    select: function(t, e, i) {
        return t ? (t != this.currentPanel && (this.currInAnim = e || this.inAnim, this.currOutAnim = i || this.outAnim, 
        this.animating && (this.inAnimationEnd(), this.outAnimationEnd()), this.oldPanel = this.currentPanel, 
        this.newPanel = this.currentPanel = t, this.startOutAnimation(), this.currOutAnim == SmoothPanels.NONE && (this.outAnimationStart(), 
        setTimeout(enyo.bind(this, function() {
            this.outAnimationEnd();
        }), this.duration + 500)), this.async || this.startInAnimation()), void 0) : (this.warn("The panel you selected is null or undefined!"), 
        void 0);
    },
    selectDirect: function(t) {
        this.currentPanel != t && (t.show(), this.currentPanel.hide(), this.currentPanel = t);
    },
    selectByIndex: function(t, e, i) {
        this.select(this.getClientControls()[t], e, i);
    },
    getSelectedPanel: function() {
        return this.currentPanel;
    },
    getSelectedPanelIndex: function() {
        return this.getClientControls().indexOf(this.currentPanel);
    },
    destroy: function() {
        var t = SmoothPanels.animationEventNames[this.getVendorPrefix().lowercase];
        enyo.dispatcher.stopListening(this.hasNode(), t.start, this.animationStartHandler), 
        enyo.dispatcher.stopListening(this.hasNode(), t.end, this.animationEndHandler), 
        this.inherited(arguments);
    }
});

// source\controls\slideablemenu\slideable3d.js
enyo.kind({
    name: "Slideable3d",
    kind: "Slideable",
    published: {
        timingDuration: .3,
        timingFunction: "ease"
    },
    use3d: !0,
    useKeyframes: !0,
    freeze: !1,
    statics: {
        count: 0
    },
    create: function() {
        if ((enyo.platform.blackberry || enyo.platform.androidChrome || enyo.platform.firefoxOS) && (this.useKeyframes = !1), 
        enyo.platform.firefoxOS && (this.use3d = !1), this.inherited(arguments), this.useKeyframes === !0) {
            Slideable3d.count++;
            var t = [];
            t.push({
                keyText: "0%",
                keyValue: "{" + enyo.dom.getCssTransformProp() + ": translate3d(0,0,0);}"
            }), t.push({
                keyText: "100%",
                keyValue: "{" + enyo.dom.getCssTransformProp() + ": translate3d(0,0,0);}"
            }), this.applyStyle(enyo.dom.getCSSPrefix("animation-duration", "AnimationDuration"), this.timingDuration + "s"), 
            this.applyStyle(enyo.dom.getCSSPrefix("animation-timing-function", "AnimationTimingFunction"), this.timingFunction), 
            enyo.dom.createKeyframes("slideable-slide" + Slideable3d.count, t), this.keyFrameRule = "slideable-slide" + Slideable3d.count;
        }
    },
    rendered: function() {
        this.inherited(arguments), this.useKeyframes === !0 && enyo.dispatcher.listen(this.hasNode(), enyo.dom.getAnimationEvent("AnimationEnd"), enyo.bind(this, this.animateEnd));
    },
    lastEvent: {},
    animateEnd: function() {
        this.useKeyframes === !0 && (this.valueChanged(this.value), this.applyStyle(enyo.dom.getCSSPrefix("animation-name", "AnimationName"), "none"), 
        this.bubble("onAnimateFinish"));
    },
    destroy: function() {
        this.useKeyframes === !0 && (Slideable3d.count--, enyo.dom.deleteKeyframes(this.keyFrameRule)), 
        this.inherited(arguments);
    },
    valueChanged: function(t) {
        var e = this.value;
        this.isOob(e) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(e) : this.clampValue(e)), 
        enyo.platform.android > 2 && this.use3d === !1 && (this.value ? (0 === t || void 0 === t) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), 
        this.canTransform ? this.use3d ? "translateX" == this.transform ? enyo.dom.transformValue(this, "translate3d", this.value + this.unit + ",0,0") : enyo.dom.transformValue(this, "translate3d", "0," + this.value + this.unit + ",0") : enyo.dom.transformValue(this, this.transform, this.value + this.unit) : this.setInlineStyles(this.value, !1), 
        this.doChange();
    },
    play: function(t, e) {
        if (this.use3d && this.useKeyframes) {
            var i = [];
            i.push({
                keyText: "0%",
                keyValue: "translateX" == this.transform ? "{" + enyo.dom.getCssTransformProp() + ": translate3d(" + t + this.unit + ",0,0);}" : "{" + enyo.dom.getCssTransformProp() + ": translate3d(0," + t + this.unit + ",0);}"
            }), i.push({
                keyText: "100%",
                keyValue: "translateX" == this.transform ? "{" + enyo.dom.getCssTransformProp() + ": translate3d(" + e + this.unit + ",0,0);}" : "{" + enyo.dom.getCssTransformProp() + ": translate3d(0," + e + this.unit + ",0);}"
            }), this.applyStyle(enyo.dom.getCSSPrefix("animation-name", "AnimationName"), enyo.dom.changeKeyframes(this.keyFrameRule, i)), 
            this.value = e, this.valueChanged(e);
        } else this.inherited(arguments);
    },
    dragfinish: function(t, e) {
        if (this.freeze === !0) {
            if (this.dragging) return this.dragging = !1, this.value > this.max && this.animateToMax(), 
            this.value < this.min && this.animateToMin(), e.preventTap(), this.preventDragPropagation;
        } else this.inherited(arguments);
    }
}), enyo.kind({
    name: "FloatingSlideable3d",
    kind: "Slideable3d",
    create: function() {
        enyo.floatingLayer.hasNode() || enyo.floatingLayer.render(), this.parentNode = enyo.floatingLayer.hasNode(), 
        this.inherited(arguments);
    }
});

// source\views\dropinview.js
enyo.kind({
    name: "DropInView",
    published: {
        floating: !1
    },
    style: "overflow:hidden;",
    resizeHandler: function() {
        var t = enyo.dom.getWindowHeight(), e = enyo.dom.getWindowWidth();
        this.applyStyle("height", t + "px"), this.applyStyle("width", e + "px"), this.inherited(arguments), 
        setTimeout(enyo.bind(this, function() {
            this.waterfallDown("onresize");
        }), 100);
    }
}), enyo.kind({
    name: "SlideInView",
    kind: "Slideable3d",
    unit: "px",
    axis: "h",
    classes: "slideable-absolute post-background",
    draggable: !1,
    published: {
        floating: !1
    },
    handlers: {
        onAnimateFinish: "hideMe"
    },
    style: "overflow:hidden;",
    min: 0,
    max: enyo.dom.getWindowWidth(),
    value: enyo.dom.getWindowWidth(),
    components: [],
    showing: !1,
    opened: !1,
    create: function() {
        this.canGenerate = !this.floating, this.inherited(arguments), this.resizeHandler();
    },
    show: function() {
        this.inherited(arguments), this.floating && this.showing && !this.hasNode() && this.render(), 
        this.resizeHandler(), this.showView(!0);
    },
    hide: function() {
        this.hideView();
    },
    showView: function(t) {
        var e = enyo.dom.getWindowWidth();
        this.min = 0, this.max = e, this.value = this.max, t || this.show(), this.opened = !0, 
        this.animateToMin();
    },
    showNoAnimate: function() {
        this.setShowing(!0), this.floating && this.showing && !this.hasNode() && this.render();
        var t = enyo.dom.getWindowWidth();
        this.min = 0, this.max = t, this.setValue(this.min), this.opened = !0;
    },
    hideView: function() {
        var t = enyo.dom.getWindowWidth();
        this.max = t, this.opened = !1, this.animateToMax();
    },
    hideMe: function() {
        this.opened === !1 && this.setShowing(!1);
    },
    resizeHandler: function() {
        var t = enyo.dom.getWindowHeight(), e = enyo.dom.getWindowWidth();
        this.applyStyle("height", t + "px"), this.applyStyle("width", e + "px"), this.setMin(-1 * t), 
        this.opened === !1 && this.setValue(e), this.inherited(arguments), setTimeout(enyo.bind(this, function() {
            this.waterfallDown("onresize");
        }), 100);
    }
});

// source\controls\slideablescroller\slideablescroller.js
enyo.kind({
    kind: "Slideable3d",
    name: "SlideableScroller",
    axis: "v",
    min: 0,
    max: 0,
    unit: "px",
    kDragScalar: 8,
    overMoving: !1,
    preventDragPropagation: !0,
    use3dTransforms: !0,
    useKeyframes: !1,
    components: [],
    create: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), this.createComponent({
                kind: "Signals",
                onScrollScroller: "scrollScroller"
            });
        };
    }),
    rendered: function() {
        this.inherited(arguments), this.updateMin();
    },
    scrollScroller: function(t, e) {
        this.updateMin(), e.id && this.postid && e.id == this.postid && this.setValue(-1 * e.top);
    },
    updateMin: function() {
        var t = this.getBounds(), e = "v" == this.axis ? "height" : "width", i = "v" == this.axis ? "top" : "left";
        this.applyStyle(e, t[e]), this.applyStyle(i, t[i]);
        var n = "v" == this.axis ? t.height < enyo.dom.getWindowHeight() ? t.height : enyo.dom.getWindowHeight() : t.width < enyo.dom.getWindowWidth() ? t.width : enyo.dom.getWindowWidth();
        if (t && t[e] && t[e] > 0 && t[e] > n) {
            var o = t[e] - n;
            o = 0 > o ? 0 : -1 * o, this.kDragScalar = Math.floor(Math.abs(o) / 100), 1 > this.kDragScalar && (this.kDragScalar = 1), 
            this.kDragScalar > 8 && (this.kDragScalar = 8), this.min = o;
        } else this.min = 0;
    },
    dragstart: function() {
        this.updateMin(), this.inherited(arguments);
    },
    dragfinish: function(t, e) {
        return this.dragging ? (this.dragging = !1, this.value > this.max && this.animateToMax(), 
        this.value < this.min && this.animateToMin(), e.preventTap(), this.preventDragPropagation) : void 0;
    }
});

// source\controls\slideablesnapscroller\snapscrollercell.js
enyo.kind({
    name: "SnapScrollerCell",
    kind: "Control",
    classes: "scroller-slide",
    cellComponents: [],
    componentsCreated: !1,
    components: [ {
        name: "client",
        isChrome: !0
    } ],
    create: function() {
        this.inherited(arguments);
    },
    getClientBounds: function() {
        return this.getBounds();
    },
    flowControls: function(t) {
        this.destroyClientControls(), this.createComponents(this.cellComponents, {
            owner: this
        }), this.render(), this.componentsCreated = !0, t && this.flowImages();
    },
    stripControls: function() {
        this.destroyClientControls(), this.componentsCreated = !1;
    },
    stripImages: function() {
        this.waterfall("onStripImages");
    },
    flowImages: function() {
        this.waterfall("onFlowImages");
    }
});

// source\controls\slideablesnapscroller\pleasewaititem.js
enyo.kind({
    name: "PleaseWaitItem",
    kind: "SnapScrollerCell",
    published: {
        mode: !0
    },
    cellComponents: [ {
        kind: "Control",
        name: "contain",
        classes: "post-background",
        components: [ {
            kind: "FittableColumns",
            name: "frows",
            components: [ {
                fit: !0,
                classes: "captionBack",
                components: [ {
                    kind: "onyx.Spinner",
                    classes: "onyx-light",
                    name: "spin",
                    style: "background-size:32px 32px;width:32px;height:32px;"
                }, {
                    content: "",
                    allowHtml: !0,
                    name: "msgHeader",
                    style: "margin-left:12px;font-size:70%;color:black;line-height:90%"
                } ]
            } ]
        } ]
    } ],
    flowControls: function() {
        this.inherited(arguments), this.modeChanged(), this.resizeHandler();
    },
    modeChanged: function() {
        this.mode === !0 ? this.setWaiting() : this.setEnd();
    },
    setWaiting: function() {
        this.$.spin ? (this.$.spin.show(), this.$.msgHeader.setContent("L<br />o<br />a<br />d<br />&nbsp;i<br />n<br />g<br /><br /><br />Please Wait...")) : (this.cellComponents[0].components[0].components[0].components[0].showing = !0, 
        this.cellComponents[0].components[0].components[0].components[1].content = "L<br />o<br />a<br />d<br />&nbsp;i<br />n<br />g<br /><br /><br />Please Wait...");
    },
    setEnd: function() {
        this.$.spin ? (this.$.spin.hide(), this.$.msgHeader.setContent("There are no more post available...")) : (this.cellComponents[0].components[0].components[0].components[0].showing = !1, 
        this.cellComponents[0].components[0].components[0].components[1].content = "There are no more post available...");
    },
    origWidth: 0,
    origHeight: 0,
    resizeHandler: function() {
        if (this.inherited(arguments), WND_HEIGHT() != this.origHeight || WND_WIDTH() != this.origWidth) {
            this.origWidth = WND_WIDTH(), this.origHeight = WND_HEIGHT();
            var t = WND_HEIGHT() - TUMBLR.footerHeight - TUMBLR.headerHeight, e = WND_WIDTH();
            this.applyStyle("height", t + "px"), this.applyStyle("width", e + "px"), this.$.contain && (this.$.contain.applyStyle("height", t + "px"), 
            this.$.frows.reflow());
        }
    }
});

// source\controls\slideablesnapscroller\slideablesnapscroller.js
enyo.kind({
    name: "SlideableSnapScroller",
    kind: "Slideable3d",
    classes: "slideable-snapscroller",
    defaultKind: "SnapScrollerCell",
    axis: "h",
    min: 0,
    max: 0,
    unit: "px",
    kDragScalar: 1.65,
    timingDuration: .2,
    overMoving: !0,
    preventDragPropagation: !0,
    loadingView: {},
    events: {
        onTransitionStart: "",
        onTransitionNearFinish: "",
        onTransitionFinish: "",
        onLoadingViewVisible: "",
        onLoadingViewHidden: "",
        onRenderError: ""
    },
    handlers: {
        ondragstart: "dragstart",
        ondrag: "drag",
        ondragfinish: "dragfinish",
        onAnimateFinish: "snapFinish"
    },
    components: [],
    items: [],
    viewsToLoad: 3,
    stubWidth: 0,
    viewWidth: 0,
    lastSL: 0,
    loadingViewIndex: -1,
    wentInOverScroll: 0,
    index: 0,
    triggerDistance: 40,
    snapping: !1,
    goingBack: !1,
    shouldFireStartEvent: !0,
    create: function() {
        this.inherited(arguments), this.viewWidth = WND_WIDTH(), this.applyStyle("width", 6 * this.viewWidth + "px");
    },
    dragstart: function(t, e) {
        return this.shouldDrag(e) ? this.wentInOverScroll > 0 && 0 > e.ddx ? this.preventDragPropagation : (this.transitionStart(), 
        e.preventDefault(), e.dragInfo = {}, this.dragging = !0, this.drag0 = this.value, 
        this.lastSL = this.value, this.dragd0 = 0, this.preventDragPropagation) : void 0;
    },
    drag: function(t, e) {
        if (this.dragging) {
            e.preventDefault();
            var i = this.canTransform ? e[this.dragMoveProp] * this.kDragScalar : this.pixelsToPercent(e[this.dragMoveProp]), n = this.drag0 + i, o = i - this.dragd0;
            return this.dragd0 = i, o && (e.dragInfo.minimizing = 0 > o), this.setValue(n), 
            this.ensureSnapFinsih(), this.preventDragPropagation;
        }
    },
    currentViewName: "",
    dragfinish: function(t, e) {
        if (this.dragging) {
            if (this.dragging = !1, this.snapping = !0, this.goingBack = !1, this.value <= this.lastSL) Math.abs(this.value) - Math.abs(this.lastSL) > this.triggerDistance ? (this.animateToMin(), 
            this.snap()) : this.scrollToIndex(); else if (this.value > this.lastSL) if (Math.abs(this.lastSL) - Math.abs(this.value) > this.triggerDistance) {
                this.goingBack = !0;
                for (var i = this.getClientControls(), n = 0; i.length > n; n++) if (i[n].name == this.items[this.index].name && i[n - 1]) {
                    var o = i[n - 1].leftOffest;
                    this.animateTo(-1 * o);
                    break;
                }
                this.snap();
            } else this.scrollToIndex();
            return this.ensureSnapFinsih(), this.twiddle(), e.preventTap(), this.preventDragPropagation;
        }
    },
    valueChanged: function() {
        isNaN(this.value) && (this.value = this.max), this.inherited(arguments);
    },
    getIndex: function() {
        return this.index;
    },
    setIndex: function(t) {
        this.index = t, this.resetToZero(), this.renderAtIndex();
    },
    next: function() {
        this.transitionStart(), this.goingBack = !1, this.snapping = !0, this.snap(), this.scrollToIndex();
    },
    previous: function() {
        this.transitionStart(), this.goingBack = !0, this.snapping = !0, this.snap(), this.scrollToIndex();
    },
    setItems: function(t, e, i) {
        this.items = t, this.loadingViewIndex >= 0 && this.destroyLoadingView(), this.index = e, 
        this.loadItems(i);
    },
    loadItems: function(t) {
        t ? (this.resetToZero(), this.renderAtIndex()) : this.ensureLoad();
    },
    tap: function() {
        this.setDirect();
    },
    ensureLoad: function() {
        this.setupNextChildren();
    },
    resetToZero: function() {
        this.destroyClientControls(), this.wentInOverScroll = 0, this.loadingViewIndex = -1;
    },
    renderAtIndex: function() {
        if (1 > this.items.length) return console.error("ERROR - No items in list"), this.doRenderError(), 
        void 0;
        var t = 0, e = 0, i = [], n = this.index - this.viewsToLoad, o = this.viewsToLoad;
        for (0 > n ? n = 0 : 2 == this.index ? o++ : this.index > 2 && (o += this.viewsToLoad), 
        e = n; this.items.length > e && (i.push(this.items[e]), t++, !(t > o)); e++) ;
        this.viewWidth = WND_WIDTH(), this.createComponents(i, {
            owner: this
        }), this.render();
        var a = this.items[this.index], s = this.items[this.index - 1], r = this.items[this.index + 1], l = this.items[this.index + 2], h = this.items[this.index - 2], c = this.items[this.index - 3];
        if (this.$[a.name].flowControls(!0), s) {
            var u = this.$[s.name];
            u && u.flowControls(!0);
        }
        if (r) {
            var d = this.$[r.name];
            d && d.flowControls(!0);
        }
        if (l) {
            var g = this.$[l.name];
            g && g.flowControls(!0);
        }
        if (h) {
            var f = this.$[h.name];
            f && f.flowControls();
        }
        if (c) {
            var p = this.$[c.name];
            p && (p.flowControls(), p.applyStyle("visibility", "hidden"));
        }
        this.recalculateSize();
    },
    recalculateSize: function() {
        this.viewWidth = WND_WIDTH();
        for (var t, e = this.getClientControls(), i = 0; e.length > i; i++) enyo.dom.transformValue(e[i], "translate3d", i * this.viewWidth + "px,0,0"), 
        e[i].leftOffest = i * this.viewWidth, e[i].name == this.items[this.index].name && (t = e[i]);
        this.updateMin(t);
    },
    updateMin: function(t) {
        if (t) {
            var e = t.leftOffest;
            this.min = -1 * (e + this.viewWidth), this.setValue(-1 * e);
        }
    },
    ensureSnapFinsih: function() {
        this.timeout && (clearTimeout(this.timeout), this.timeout = void 0), this.timeout = setTimeout(enyo.bind(this, function() {
            for (var t, e = this.getClientControls(), i = 0; e.length > i; i++) e[i].name == this.items[this.index].name && (t = -1 * e[i].leftOffest);
            this.snapping && !this.dragging ? this.snapFinish() : this.value != t && (this.dragging = !1, 
            this.scrollToIndex());
        }), 400);
    },
    snapFinish: function() {
        return this.timeout && (clearTimeout(this.timeout), this.timeout = void 0), this.snapping && (this.snapping = !1, 
        this.transitionFinish(), this.stabalizeControl()), !0;
    },
    snap: function() {
        var t = this.index == this.items.length - 1 && this.goingBack === !1;
        this.goingBack === !1 || t ? this.increaseIndex() : this.goingBack === !0 && (this.wentInOverScroll > 0 ? (this.loadingViewHidden(), 
        this.wentInOverScroll = 0) : this.decreaseIndex()), this.currentViewName = this.items[this.index].name, 
        this.transistionNearFinish();
    },
    increaseIndex: function() {
        this.index++;
        var t = this.items.length - 1;
        this.index > t && (this.loadingView.name && -1 == this.loadingViewIndex && (this.loadingViewIndex = t + 1, 
        this.createNextChild(this.loadingView)), this.loadingViewIndex >= 0 && this.doLoadingViewVisible({
            index: t
        }), this.wentInOverScroll = 1, this.index = t);
    },
    decreaseIndex: function() {
        this.index--, 0 > this.index && (this.index = 0), this.loadingViewIndex >= 0 && this.index <= this.items.length - 1 && this.destroyLoadingView(!0);
    },
    destroyLoadingView: function(t) {
        this.wentInOverScroll = 0, t || this.scrollToIndex(), this.$[this.loadingView.name].destroy(), 
        this.loadingViewIndex = -1, this.loadingViewHidden();
    },
    scrollToIndex: function() {
        this.recalculateSize();
    },
    stabalizeControl: function() {
        this.goingBack === !0 ? this.moveBack() : (this.setupNextChildren(), this.moveForward()), 
        this.twiddle();
    },
    moveForward: function() {
        var t = this.index, e = this.items, i = e[t - 4], n = e[t - 3], o = e[t - 2];
        if (i) {
            var a = this.$[i.name];
            if (a) {
                var s = t - 3;
                0 > s && (s = 0), a.destroy();
            }
        }
        if (n) {
            var r = this.$[n.name];
            r && r.applyStyle("visibility", "hidden");
        }
        if (o) {
            var l = this.$[o.name];
            l && l.stripImages();
        }
        this.recalculateSize();
    },
    setupNextChildren: function() {
        var t = this.items[this.index + 1];
        if (t) {
            var e = this.$[t.name];
            e ? (e.componentsCreated === !1 ? e.flowControls(!0) : e.flowImages(), this.createNewestChild()) : this.createNextChild(t);
        }
    },
    createNextChild: function(t) {
        this.createComponent(t, {
            owner: this
        }).render(), this.$[t.name].flowControls(!0), this.createNewestChild();
    },
    createNewestChild: function() {
        var t = this.items[this.index + 2];
        if (t) {
            var e = this.$[t.name];
            e || (this.createComponent(t, {
                owner: this
            }).render(), this.$[t.name].flowControls(!0));
        }
    },
    moveBack: function() {
        var t = this.items[this.index + 3], e = this.items[this.index + 2], i = this.items[this.index - 1], n = this.items[this.index - 2], o = this.items[this.index - 3];
        if (t) {
            var a = this.$[t.name];
            a && a.destroy();
        }
        if (e) {
            this.$[e.name];
        }
        if (i) {
            var s = this.$[i.name];
            s && s.flowImages();
        }
        if (n) {
            var r = this.$[n.name];
            r && (r.applyStyle("visibility", null), r.componentsCreated === !1 && r.flowControls());
        }
        o && (this.$[o.name] || (o.addBefore = null, this.createComponent(o, {
            owner: this
        }).render()), this.$[o.name].flowControls(), this.$[o.name].applyStyle("visibility", "hidden")), 
        this.goingBack = !1, this.recalculateSize();
    },
    setDirect: function() {
        this.recalculateSize();
    },
    twiddle: function() {
        this.hasNode() && (this.node.scrollTop = 1, this.node.scrollTop = 0), document.documentElement.scrollTop = 1, 
        document.documentElement.scrollTop = 0;
    },
    transitionStart: function() {
        0 === this.wentInOverScroll && this.doTransitionStart({
            index: this.index
        }), this.shouldFireStartEvent = !1;
    },
    transistionNearFinish: function() {
        0 === this.wentInOverScroll && this.doTransitionNearFinish({
            index: this.index
        });
    },
    transitionFinish: function() {
        0 === this.wentInOverScroll && this.doTransitionFinish({
            index: this.index
        }), this.shouldFireStartEvent = !0;
    },
    loadingViewHidden: function() {
        this.doLoadingViewHidden({
            index: this.index
        });
    },
    flowGifs: function() {
        var t = this.items[this.index];
        if (t) {
            var e = this.$[t.name];
            e && e.waterfallDown("onFlowGifs");
        }
    },
    stripGifs: function() {
        var t = this.items[this.index];
        if (t) {
            var e = this.$[t.name];
            e && e.waterfallDown("onStripGifs");
        }
    }
});

// source\controls\extrainputs\extrainputs.js
enyo.kind({
    name: "extras.MenuItem",
    kind: "onyx.MenuItem",
    classes: "extras-menu-item",
    published: {
        highlighted: !1
    },
    events: {
        onHighlight: ""
    },
    handlers: {
        onenter: "entered",
        onleave: "left"
    },
    entered: function() {
        this.setHighlighted(!0);
    },
    left: function() {
        this.setHighlighted(!1);
    },
    highlightedChanged: function() {
        this.addRemoveClass("highlight", this.highlighted), this.highlighted && this.doHighlight({
            highlighted: this,
            content: this.content
        });
    }
}), enyo.kind({
    name: "extras.Menu",
    kind: "onyx.Menu",
    defaultKind: "extras.MenuItem",
    classes: "extras-menu captionBack",
    modal: !1,
    published: {
        index: -1
    },
    handlers: {
        onHighlight: "itemHighlighted"
    },
    previousItem: function() {
        this.setIndex(this.index - 1);
    },
    nextItem: function() {
        this.setIndex(this.index + 1);
    },
    select: function() {
        enyo.call(c$[this.index], "tap", [ this ]);
    },
    itemHighlighted: function() {},
    indexChanged: function(t) {
        var e = this.getClientControls();
        this.index >= e.length && (this.index = e.length - 1), 0 > this.index && (this.index = 0), 
        enyo.call(e[this.index], "setHighlighted", [ !0 ]), enyo.call(e[t], "setHighlighted", [ !1 ]);
    },
    showingChanged: function() {
        this.showing && (this.index = -1), this.inherited(arguments);
    },
    applyZIndex: function() {},
    findZIndex: function() {
        var t = this.defaultZ;
        return this._zIndex ? t = this._zIndex : this.hasNode() && (t = Number(enyo.dom.getComputedStyleValue(this.node, "z-index")) || t), 
        this.defaultZ > t && (t = this.defaultZ + 1), this._zIndex = t;
    }
}), enyo.kind({
    name: "extras.AutoCompleteInputDecorator",
    kind: "onyx.InputDecorator",
    handlers: {
        oninput: "input",
        onSelect: "itemSelected",
        onkeyup: "keyUp",
        onkeydown: "keyDown",
        onHighlight: "itemHighlighted"
    },
    published: {
        values: "",
        filtered: !0,
        maxResults: 5,
        caseSensitive: !1,
        delay: 200,
        active: !1
    },
    events: {
        onInputChanged: "",
        onValueSelected: ""
    },
    tools: [ {
        name: "popup",
        kind: "extras.Menu",
        floating: !0
    } ],
    initComponents: function() {
        this.inherited(arguments), this.createComponents(this.tools, {
            owner: this
        });
    },
    input: function(t, e) {
        this.inputField = this.inputField || e.originator, enyo.job(null, enyo.bind(this, "fireInputChanged"), this.delay);
    },
    fireInputChanged: function() {
        this.doInputChanged({
            value: this.inputField.getValue()
        }), this.renderValues();
    },
    receiveBlur: function() {
        this.inherited(arguments), enyo.job(null, enyo.bind(this, function() {
            this.waterfall("onRequestHideMenu", {
                activator: this
            });
        }), 500);
    },
    valuesChanged: function() {
        this.$.popup.getShowing() && this.renderValues();
    },
    renderValues: function() {
        var t = this.inputField.getValue();
        if (t && this.values && this.values.length > 0) {
            this.$.popup.destroyClientControls();
            for (var e = [], i = 0; this.values.length > i && e.length < this.maxResults; i++) (!this.filtered || this.filter(t, this.values[i])) && e.push({
                content: this.values[i]
            });
            e.length > 0 && (1 != e.length || !this.matches(e[0].content, t)) ? enyo.platform.android || enyo.platform.blackberry || (this.$.popup.createComponents(e), 
            this.$.popup.render(), this.waterfall("onRequestShowMenu", {
                activator: this
            })) : this.waterfall("onRequestHideMenu", {
                activator: this
            });
        } else this.waterfall("onRequestHideMenu", {
            activator: this
        });
    },
    matches: function(t, e) {
        return this.caseSensitive ? t == e : (t + "").toLowerCase() == (e + "").toLowerCase();
    },
    filter: function(t, e) {
        return RegExp(t, this.caseSensitive ? "g" : "ig").test(e);
    },
    itemSelected: function(t, e) {
        this.inputField.setValue(e.content), this.doValueSelected({
            value: e.content
        });
    },
    keyDown: function(t, e) {
        if ("popup" != t.name) switch (e.which) {
          case 188:
            this.onEnter(this.inputField.getValue()), e.preventDefault();
        }
    },
    keyUp: function(t, e) {
        if ("popup" != t.name) {
            switch (e.which) {
              case 13:
                this.onEnter(this.inputField.getValue()), e.preventDefault();
                break;

              case 38:
                this.$.popup.previousItem(), e.preventDefault();
                break;

              case 40:
                this.$.popup.nextItem(), e.preventDefault();
            }
            return !0;
        }
    },
    onEnter: function() {
        this.inputField.focus(), this.$.popup.hide();
    },
    itemHighlighted: function(t, e) {
        this.inputField.setValue(e.content), this.inputField.focus();
    }
}), enyo.kind({
    name: "extras.TagInput",
    kind: "extras.AutoCompleteInputDecorator",
    layoutKind: "MinWidthFittableLayout",
    noStretch: !0,
    create: function() {
        this.inherited(arguments), this.selectedItems = [];
    },
    filter: function(t, e) {
        var i = this.inherited(arguments);
        return i && !this.isSelected(e);
    },
    clear: function() {
        for (var t = 0; this.selectedItems.length > t; t++) this.$[this.selectedItems[t]].destroy();
        this.selectedItems = [];
    },
    setSelectedItems: function(t) {
        this.clear();
        for (var e = 0; t.length > e; e++) this.addItem(t[e], e == t.length - 1 ? !0 : !1);
    },
    getSelected: function() {
        return this.selectedItems;
    },
    isSelected: function(t) {
        return -1 != enyo.indexOf(t, this.selectedItems);
    },
    onEnter: function() {
        this.addItem(this.inputField.getValue()), this.inherited(arguments);
    },
    itemSelected: function(t, e) {
        this.inherited(arguments), this.addItem(e.content);
    },
    receiveBlur: function(t) {
        this.inherited(arguments), enyo.job("addItem" + this.id, enyo.bind(this, function() {
            this.addItem(t.getValue(), !0);
        }), 500);
    },
    addItem: function(t) {
        !t || -1 != enyo.indexOf(t, this.selectedItems) || 1 > t.length || " " == t || (this.selectedItems.push(t.toLowerCase()), 
        this.createComponent({
            kind: "Control",
            content: t,
            name: t.toLowerCase(),
            classes: "item",
            addBefore: this.inputField,
            ontap: "removeItem",
            owner: this
        }).render(), this.reflow(), this.inputField && this.inputField.setValue(""), this.$.popup.hide());
    },
    removeItem: function(t) {
        var e = enyo.indexOf(t.content.toLowerCase(), this.selectedItems);
        -1 != e && this.selectedItems.splice(e, 1), t.destroy(), this.reflow(), this.inputField.focus();
    }
}), enyo.kind({
    name: "enyo.TagInput",
    handlers: {
        onkeydown: "keyDown",
        onkeyup: "keyUp"
    },
    components: [ {
        kind: "onyx.InputDecorator",
        style: "display: inline-block;width:100%;box-sizing: border-box;",
        alwaysLooksFocused: !0,
        components: [ {
            kind: "android.Scroller",
            touchOverscroll: !1,
            horizontal: "hidden",
            name: "scroller",
            components: [ {
                name: "tagItems",
                style: "display:inline-block;"
            } ]
        }, {
            kind: "onyx.Input",
            placeholder: "Enter Tag...",
            name: "input",
            style: "display: inline-block;",
            attributes: {
                autocomplete: "off"
            }
        } ]
    } ],
    create: function() {
        this.inherited(arguments), this.selectedItems = [];
    },
    filter: function(t, e) {
        var i = this.inherited(arguments);
        return i && !this.isSelected(e);
    },
    clear: function() {
        for (var t = 0; this.selectedItems.length > t; t++) this.$[this.selectedItems[t]].destroy();
        this.selectedItems = [];
    },
    focus: function() {
        this.$.input.focus();
    },
    blur: function() {
        this.$.input.blur();
    },
    setSelectedItems: function(t) {
        this.clear();
        for (var e = 0; t.length > e; e++) this.addItem(t[e], e == t.length - 1 ? !0 : !1);
    },
    getSelected: function() {
        return this.selectedItems;
    },
    isSelected: function(t) {
        return -1 != enyo.indexOf(t, this.selectedItems);
    },
    receiveBlur: function(t) {
        this.inherited(arguments), enyo.job("addItem" + this.id, enyo.bind(this, function() {
            this.addItem(t.getValue(), !0);
        }), 500);
    },
    addItem: function(t) {
        !t || -1 != enyo.indexOf(t, this.selectedItems) || 1 > t.length || " " == t || (this.selectedItems.push(t.toLowerCase()), 
        this.$.tagItems.createComponent({
            kind: "Control",
            content: t,
            name: t.toLowerCase(),
            classes: "item",
            ontap: "removeItem",
            owner: this
        }).render(), this.$.input && this.$.input.setValue(""), this.setScrollerHeight(), 
        this.$.scroller.scrollToBottom());
    },
    setScrollerHeight: function() {
        var t = this.getBounds(), e = this.$.input.getBounds();
        50 > t.height && (t.height = 50), this.$.scroller.applyStyle("height", t.height - e.height + "px");
    },
    removeItem: function(t) {
        var e = enyo.indexOf(t.content.toLowerCase(), this.selectedItems);
        -1 != e && this.selectedItems.splice(e, 1), t.destroy(), this.$.input.focus(), this.setScrollerHeight();
    },
    keyDown: function(t, e) {
        switch (e.which) {
          case 188:
            this.onEnter(this.$.input.getValue()), e.preventDefault();
        }
    },
    keyUp: function(t, e) {
        switch (e.which) {
          case 13:
            this.onEnter(this.$.input.getValue()), e.preventDefault();
            break;

          case 38:
            this.$.popup.previousItem(), e.preventDefault();
            break;

          case 40:
            this.$.popup.nextItem(), e.preventDefault();
        }
        return !0;
    },
    onEnter: function() {
        this.addItem(this.$.input.getValue()), this.$.input.focus();
    }
}), enyo.kind({
    name: "extras.PrefixedTagInput",
    kind: "extras.TagInput",
    published: {
        prefix: ""
    },
    prefixChanged: function() {
        this.valuesChanged();
    },
    isSelected: function(t) {
        return arguments[0] = this.prefix + t, this.inherited(arguments);
    },
    addItem: function(t) {
        this.prefix && t && -1 == t.indexOf(this.prefix) && (arguments[0] = this.prefix + t), 
        this.inherited(arguments);
    }
}), enyo.kind({
    name: "extras.Delegator",
    kind: "Component",
    published: {
        members: "",
        delegatee: ""
    },
    delegated: !1,
    create: function() {
        this.inherited(arguments), this.delegate(), this.membersChanged = this.delegateeChanged = this.delegate;
    },
    delegate: function() {
        var t = this.delegatee, e = this.members;
        t && e && !this.delegated && enyo.forEach(e, enyo.bind(this.owner, function(e) {
            if (enyo.isFunction(t[e])) this[e] = enyo.bind(t, e); else {
                var i = "set" + enyo.cap(e), n = "get" + enyo.cap(e);
                !this[i] && t[i] && (this[i] = enyo.bind(t, i)), !this[n] && t[n] && (this[n] = enyo.bind(t, n)), 
                this[e] !== void 0 && enyo.call(this, i, [ this[e] ]);
            }
        }));
    }
}), enyo.kind({
    name: "extras.TypeAheadInput",
    classes: "extras-typeahead-input",
    events: {
        onAcceptSuggestion: ""
    },
    published: {
        suggestion: ""
    },
    tools: [ {
        name: "shadow",
        kind: "onyx.Input",
        classes: "shadow",
        oninput: "shadowInput",
        onfocus: "shadowFocused"
    }, {
        name: "main",
        kind: "onyx.Input",
        classes: "primary",
        onkeydown: "mainKeydown",
        onflick: "flicked",
        onblur: "blurred",
        onfocus: "mainFocused",
        oninput: "mainInput"
    }, {
        name: "delegator",
        kind: "extras.Delegator",
        members: [ "placeholder", "value", "type", "disabled", "selectOnFocus", "clear", "focus", "hasFocus", "selectContents" ]
    } ],
    create: function() {
        this.inherited(arguments), this.$.delegator.setDelegatee(this.$.main);
    },
    initComponents: function() {
        this.createComponents(this.tools, {
            owner: this
        }), this.inherited(arguments);
    },
    suggestionChanged: function() {
        this.$.shadow.setValue(this.suggestion);
    },
    shadowFocused: function() {
        this.$.main.focus();
    },
    mainFocused: function() {
        this.suggestionChanged();
    },
    mainKeydown: function(t, e) {
        return 9 != e.which && 13 != e.which || !this.suggestion ? void 0 : (this.applySuggestion(), 
        e.preventDefault(), !0);
    },
    shadowInput: function() {
        return !0;
    },
    mainInput: function() {
        this.setSuggestion("");
    },
    flicked: function(t, e) {
        var i = e.xVelocity, n = e.yVelocity, o = i ? n / i : 1/0;
        return i > 0 && 1 > o && o > -1 && enyo.platform.touch ? (this.applySuggestion(), 
        !0) : void 0;
    },
    blurred: function() {
        this.$.shadow.setValue(""), this.setSuggestion("");
    },
    applySuggestion: function() {
        var t = this.$.main.getValue();
        this.$.main.setValue(this.renderSuggestion ? this.renderSuggestion : this.suggestion), 
        this.setSuggestion(""), this.doAcceptSuggestion({
            priorValue: t,
            value: this.$.main.getValue()
        });
    }
}), enyo.kind({
    name: "extras.ComboInput",
    kind: "extras.AutoCompleteInputDecorator",
    alwaysLooksFocused: !0,
    published: {
        inputClasses: ""
    },
    comboTools: [ {
        name: "input",
        kind: "extras.TypeAheadInput",
        onAcceptSuggestion: "accept"
    }, {
        name: "delegator",
        kind: "extras.Delegator",
        members: [ "placeholder", "value", "type", "disabled", "selectOnFocus", "clear", "focus", "hasFocus", "selectContents" ]
    } ],
    create: function() {
        this.inherited(arguments), this.$.delegator.setDelegatee(this.$.input), this.inputClassesChanged();
    },
    initComponents: function() {
        this.inherited(arguments), this.createComponents(this.comboTools, {
            owner: this
        });
    },
    inputClassesChanged: function(t) {
        this.$.input && (t && this.$.input.removeClass(t), this.$.input.addClass(this.inputClasses));
    },
    filter: function(t, e) {
        var i = this.caseSensitive && 0 === (e + "").indexOf(t) || !this.caseSensitive && 0 === (e + "").toLowerCase().indexOf((t + "").toLowerCase());
        return i;
    },
    renderValues: function() {
        if (this.inherited(arguments), this.$.popup.getShowing()) {
            var t = this.$.popup.getClientControls()[0].content, e = this.$.input.getValue();
            this.$.input.renderSuggestion = t, this.$.input.setSuggestion(e + t.substring(e.length));
        }
    },
    accept: function() {
        this.waterfall("onRequestHideMenu", {
            activator: this
        });
    },
    itemHighlighted: function() {
        this.inherited(arguments), this.$.input.setSuggestion("");
    }
}), enyo.kind({
    name: "enyo.MinWidthFittableLayout",
    kind: "FittableColumnsLayout",
    layoutClass: "enyo-fittable-columns-layout enyo-min-width-fittable-layout",
    reflow: function(t) {
        t || this.container.applyStyle("white-space", null), this.inherited(arguments);
    },
    applyFitSize: function(t, e, i, n) {
        var o = this.getFitControl(), a = e - (i + n);
        0 > a ? (this.container.applyStyle("white-space", "normal"), o.applyStyle("width", "1px"), 
        enyo.asyncMethod(this, "reflow", !0)) : o.minWidth && o.minWidth > a ? (o.applyStyle("width", e + "px"), 
        this.container.applyStyle("white-space", "normal")) : this.inherited(arguments);
    }
});

// source\controls\pulluplist\pulluplist.js
enyo.kind({
    name: "custom.PullupList",
    kind: "enyo.PulldownList",
    pullingMessage: "Pull up to refresh...",
    pulledMessage: "Release to refresh...",
    loadingMessage: "Loading...",
    pullingIconClass: "custom-puller-arrow enyo-puller-arrow-down",
    pulledIconClass: "custom-puller-arrow enyo-puller-arrow-up",
    loadingIconClass: "",
    pulldownTools: [ {
        name: "pulldown",
        classes: "custom-list-pulldown",
        components: [ {
            name: "puller",
            kind: "Puller"
        } ]
    } ],
    strategyKind: "android.TranslateScrollStrategy",
    create: function() {
        var t = {
            kind: "Puller",
            showing: !1,
            text: this.loadingMessage,
            iconClass: this.loadingIconClass,
            onCreate: "setPully"
        };
        this.listTools.splice(1, 0, t), enyo.List.prototype.create.apply(this, arguments), 
        this.$.puller.setClasses("custom-puller"), this.$.puller.$.text.setClasses("custom-puller-text"), 
        this.setPulling();
    },
    setPully: function(t, e) {
        this.pully = e.originator, this.pully.setClasses("custom-puller"), this.pully.$.text.setClasses("custom-puller-text");
    },
    scroll: function() {
        var t = this.inherited(arguments);
        this.completingPull && this.pully.setShowing(!1);
        var e = this.getStrategy().$.scrollMath, i = e.y;
        return e.isInOverScroll() && 0 > i && (enyo.dom.transformValue(this.$.pulldown, this.translation, "0," + (Math.abs(e.bottomBoundary) - Math.abs(i) + this.pullHeight) + "px" + (this.accel ? ",0" : "")), 
        this.firedPullStart || (this.firedPullStart = !0, this.pullStart(), this.pullHeight = this.$.pulldown.getBounds().height), 
        Math.abs(i) > Math.abs(e.bottomBoundary) + this.pullHeight && !this.firedPull && (this.firedPull = !0, 
        this.firedPullCancel = !1, this.pull()), this.firedPull && !this.firedPullCancel && Math.abs(i) - Math.abs(e.bottomBoundary) < this.pullHeight && (this.firedPullCancel = !0, 
        this.firedPull = !1, this.pullCancel())), t;
    },
    dragfinish: function() {
        this.firedPull && (this.getStrategy().$.scrollMath, this.pullRelease());
    },
    completePull: function() {
        this.completingPull = !0, this.$.strategy.$.scrollMath.setScrollY(this.$.strategy.$.scrollMath.y - this.pullHeight), 
        this.$.strategy.$.scrollMath.start();
    },
    createStrategy: function() {
        this.controlParentName = "strategy", this.createComponents([ {
            name: "strategy",
            maxHeight: this.maxHeight,
            kind: this.strategyKind,
            thumb: this.thumb,
            preventDragPropagation: this.preventDragPropagation,
            overscroll: this.touchOverscroll,
            translateOptimized: !0,
            scrim: !0,
            isChrome: !0
        } ]), this.createChrome(this.listTools), this.controlParentName = "client", this.discoverControlParent();
    }
});

// source\controls\bufferedimages\bufferedimages.js
enyo.kind({
    name: "BufferedImage",
    kind: "Control",
    published: {
        src: "",
        bufferSrc: "",
        imgSize: {
            width: 150,
            height: 150
        }
    },
    handlers: {
        onload: "removeBuffer"
    },
    components: [ {
        kind: "Image",
        name: "image"
    }, {
        kind: "Image",
        name: "buffer",
        showing: !1,
        noEvents: !0,
        style: "position:relative;"
    } ],
    create: function() {
        this.inherited(arguments), this.imgSizeChanged(), this.bufferSrcChanged(), this.srcChanged();
    },
    imgSizeChanged: function() {
        this.$.image.applyStyle("width", this.imgSize.width + "px"), this.$.image.applyStyle("height", this.imgSize.height + "px"), 
        this.$.buffer.applyStyle("width", this.imgSize.width + "px"), this.$.buffer.applyStyle("height", this.imgSize.height + "px"), 
        this.$.buffer.applyStyle("left", -1 * (this.imgSize.width + 9) + "px");
    },
    srcChanged: function(t) {
        enyo.asyncMethod(this, function() {
            return this.src == t ? (this.removeBuffer(), !0) : (this.showBuffer(), this.$.image.setSrc(this.src), 
            void 0);
        });
    },
    bufferSrcChanged: function() {
        enyo.asyncMethod(this, function() {
            this.$.buffer.setSrc(this.bufferSrc);
        });
    },
    showBuffer: function() {
        enyo.asyncMethod(this, function() {
            this.$.buffer.show();
        });
    },
    removeBuffer: function() {
        enyo.asyncMethod(this, function() {
            this.$.buffer.hide();
        });
    }
}), enyo.kind({
    name: "VideoImage",
    kind: "Control",
    published: {
        src: ""
    },
    handlers: {
        onerror: "showErrorPic",
        onload: "hideErrorPic"
    },
    components: [ {
        kind: "Image"
    } ],
    errorTools: [ {
        kind: "Image",
        name: "errorPic",
        src: "assets/videoerror.png",
        classes: "no-limits"
    } ],
    create: function() {
        this.inherited(arguments), this.srcChanged();
    },
    srcChanged: function(t) {
        enyo.asyncMethod(this, function() {
            return this.src == t ? !0 : (this.$.image.setSrc(this.src), void 0);
        });
    },
    hideErrorPic: function(t) {
        t && t.name && "errorPic" != t.name && (this.$.errorPic && this.$.errorPic.hide(), 
        this.$.image.show());
    },
    showErrorPic: function() {
        this.$.errorPic ? (this.$.errorPic.show(), this.$.image.hide()) : (this.createComponents(this.errorTools, {
            owner: this
        }), this.render(), this.$.image.hide());
    }
}), enyo.kind({
    name: "CanvasImage",
    kind: "Control",
    published: {
        src: ""
    },
    style: "white-space:nowrap;",
    components: [ {
        tag: "canvas",
        name: "image",
        style: "border: 2px solid black;border-radius: 10px;margin-right: 5px;",
        classes: "unselectable"
    } ],
    create: function() {
        this.inherited(arguments), this[this.name + "imgSize"] = {}, this[this.name + "imgSize"].width = 40, 
        this[this.name + "imgSize"].height = 40, this[this.name + "imgObj"] = new Image(), 
        this.srcChanged();
    },
    setImg: function() {},
    srcChanged: function(t) {
        if (!(1 > this.src.length)) {
            if (this.src == t || this[this.name + "imgObj"] && this[this.name + "imgObj"].src == this.src) return !0;
            this[this.name + "imgObj"] = new Image(), this[this.name + "imgObj"].onload = enyo.bind(this, function() {
                this.drawImage();
            }), this[this.name + "imgObj"].src = this.src;
        }
    },
    drawImage: function() {
        if (this.$.image) {
            this.$.image.hasNode();
            var t = this.$.image.node, e = this.getBounds();
            if (t && e) {
                var i = e.width, n = e.height;
                t.width = i, t.height = n;
                var o = t.getContext("2d");
                o.drawImage(this[this.name + "imgObj"], 0, 0, i, n);
            }
        }
    },
    drawImageFromObj: function(t) {
        if (this.$.image) {
            this.$.image.hasNode(), this[this.name + "imgObj"].src = t.src, this.src = t.src;
            var e = this.$.image.node, i = this.getBounds();
            if (e && i) {
                var n = i.width, o = i.height;
                e.width = n, e.height = o;
                var s = e.getContext("2d");
                s.drawImage(t, 0, 0, n, o);
            }
        }
    },
    origWidth: 0,
    origHeight: 0,
    resizeHandler: function() {
        this.inherited(arguments), (WND_HEIGHT() != this.origHeight || WND_WIDTH() != this.origWidth) && (this.origWidth = WND_WIDTH(), 
        this.origHeight = WND_HEIGHT(), this.drawImageFromObj(this[this.name + "imgObj"]));
    }
}), enyo.kind({
    name: "BufferedCanvasImage",
    kind: "Control",
    published: {
        src: "",
        border: !0
    },
    style: "white-space:nowrap;",
    handlers: {
        onFlowGifs: "showGif",
        onStripGifs: "hideGif"
    },
    components: [ {
        tag: "canvas",
        name: "image",
        style: "",
        classes: "unselectable",
        isChrome: !0
    } ],
    create: function() {
        this.inherited(arguments), this[this.name + "imgSize"] = {}, this[this.name + "imgSize"].width = 150, 
        this[this.name + "imgSize"].height = 150, this.border ? this.$.image.setStyle("border: 2px solid black;border-radius: 10px;position: relative;margin-right: 5px;-webkit-transform:translate3d(0,0,0);") : this.$.image.setStyle("border: 2px solid white;border-radius: 0px;position: relative;-webkit-transform:translate3d(0,0,0);"), 
        this.srcChanged();
    },
    showingGif: !1,
    showGif: function() {
        if (!(0 > this.src.indexOf(".gif"))) {
            this.$.image && this.$.image.hide(), this.$.realImage && this.$.realImage.destroy();
            var t = this[this.name + "imgSize"].width, e = this[this.name + "imgSize"].height;
            return this.createComponent({
                kind: "Popup",
                floating: !0,
                components: [ {
                    kind: "Image",
                    name: "realImage",
                    style: this.border ? "position: relative;-webkit-transform:translate3d(0,0,0);width:" + t + "px;height:" + e + "px;" : "border: 2px solid white;border-radius: 0px;position: relative;-webkit-transform:translate3d(0,0,0);width:" + t + "px;height:" + e + "px;"
                } ]
            }, {
                owner: this
            }), this.render(), this.transformParams && enyo.dom.transform(this.$.realImage, this.transformParams), 
            this.$.popup.show(), this.$.realImage.setAttribute("src", this[this.name + "imgObj"].src), 
            this.showingGif = !0, !0;
        }
    },
    hideGif: function() {
        return 0 > this.src.indexOf(".gif") ? void 0 : (this[this.name + "imgObj"] && this.removeBuffer(), 
        this.$.image && this.$.image.show(), this.$.realImage && this.$.realImage.destroy(), 
        this.showingGif = !1, !0);
    },
    transform: function(t) {
        this.$.realImage ? enyo.dom.transform(this.$.realImage, t) : enyo.dom.transform(this.$.image, t), 
        this.transformParams = t;
    },
    srcChanged: function(t) {
        enyo.asyncMethod(this, function() {
            if (!(1 > this.src.length)) if (this.src.indexOf(".gif") >= 0) {
                if (this.src == t || this[this.name + "imgObj"] && this[this.name + "imgObj"].src == this.src) return this.removeBuffer(), 
                !0;
                this.src != t && this.hideGif(), this.showingGif === !1 && (this[this.name + "imgObj"] = new Image(), 
                this[this.name + "imgObj"].onload = enyo.bind(this, function() {
                    var t = Math.min(GET_IMAGE_SIZE(), this[this.name + "imgObj"].width);
                    this[this.name + "imgSize"].width = t;
                    var e = 0;
                    if (this[this.name + "imgObj"].width > t) {
                        var i = this[this.name + "imgObj"].width / (this[this.name + "imgObj"].width - t);
                        e = this[this.name + "imgObj"].height - this[this.name + "imgObj"].height / i;
                    } else e = this[this.name + "imgObj"].height;
                    if (this[this.name + "imgSize"].height = e, this.applyStyle("height", e + "px"), 
                    this.$.realImage) {
                        var n = this[this.name + "imgSize"].width, o = this[this.name + "imgSize"].height;
                        this.$.realImage.applyStyle("height", o + "px"), this.$.realImage.applyStyle("width", n + "px");
                    }
                    this.removeBuffer();
                }), this[this.name + "imgObj"].onerror = enyo.bind(this, function() {
                    this[this.name + "imgObj"].src = "assets/nopic.png";
                }), this[this.name + "imgObj"].src = this.src);
            } else this.$.realImage && this.$.realImage.destroy(), this.createComponent({
                kind: "Image",
                name: "realImage",
                style: "position: relative;-webkit-transform:translate3d(0,0,0);",
                classes: this.border ? "" : "no-limits"
            }, {
                owner: this
            }), this.render(), this.transformParams && enyo.dom.transform(this.$.realImage, this.transformParams), 
            this.$.realImage.setAttribute("src", this.src), this.$.image && this.$.image.hide();
        });
    },
    removeBuffer: function() {
        if (this.$.image) {
            this.$.image.hasNode();
            var t = this.$.image.node;
            if (t) {
                var e = this[this.name + "imgSize"].width, i = this[this.name + "imgSize"].height;
                t.width != e && (t.width = e), t.height != i && (t.height = i);
                var n = t.getContext("2d");
                n.drawImage(this[this.name + "imgObj"], 0, 0, e, i);
            }
        }
    }
}), enyo.kind({
    name: "BBufferedCanvasImage",
    kind: "Control",
    published: {
        src: ""
    },
    style: "white-space:nowrap;",
    handlers: {
        onFlowGifs: "showGif",
        onStripGifs: "hideGif"
    },
    components: [ {
        tag: "canvas",
        name: "image",
        style: "",
        classes: "unselectable",
        isChrome: !0
    } ],
    create: function() {
        this.inherited(arguments), this.imgSize = {}, this.imgSize.width = this.maxWidth || GET_IMAGE_SIZE(), 
        this.imgSize.height = GET_IMAGE_SIZE(), this.$.image.setStyle("position: relative;-webkit-transform:translate3d(0,0,0);"), 
        this.maxWidth && this.$.image.applyStyle("max-width", this.maxWidth + "px !important"), 
        this.srcChanged();
    },
    showingGif: !1,
    showGif: function() {
        if (!(0 > this.src.indexOf(".gif"))) {
            this.$.realImage && this.$.realImage.destroy();
            var t = this.imgSize.width, e = this.imgSize.height;
            return this.createComponent({
                kind: "Image",
                name: "realImage",
                classes: "no-limits",
                style: "position: relative;-webkit-transform:translate3d(0,0,0);width:" + t + "px;height:" + e + "px;"
            }, {
                owner: this
            }).render(), this.maxWidth && this.$.realImage.applyStyle("max-width", this.maxWidth + "px !important"), 
            this.transformParams && (enyo.dom.transform(this.$.realImage, this.transformParams), 
            this.$.realImage.applyStyle("width", "auto"), this.$.realImage.applyStyle("height", "auto")), 
            this.$.realImage.setSrc(this.imgObj.src), this.showingGif = !0, this.$.image && this.$.image.hide(), 
            !0;
        }
    },
    hideGif: function() {
        return 0 > this.src.indexOf(".gif") ? void 0 : (this.imgObj && this.removeBuffer(), 
        this.$.image && this.$.image.show(), this.$.realImage && this.$.realImage.destroy(), 
        this.showingGif = !1, !0);
    },
    transform: function(t) {
        this.$.realImage ? (this.$.realImage.applyStyle("width", "auto"), this.$.realImage.applyStyle("height", "auto"), 
        enyo.dom.transform(this.$.realImage, t)) : enyo.dom.transform(this.$.image, t), 
        this.transformParams = t;
    },
    srcChanged: function(t) {
        enyo.asyncMethod(this, function() {
            if (!(1 > this.src.length)) if (this.src.indexOf(".gif") >= 0) {
                if (this.src == t || this.imgObj && this.imgObj.src == this.src) return this.removeBuffer(), 
                !0;
                this.src != t && this.hideGif(), this.showingGif === !1 && (this.imgObj = new Image(), 
                this.imgObj.onload = enyo.bind(this, function() {
                    this.imgSize.width = this.maxWidth || GET_IMAGE_SIZE();
                    var t = 0, e = 0;
                    if (this.imgObj.width > this.imgSize.width ? (e = this.imgObj.width / (this.imgObj.width - this.imgSize.width), 
                    t = this.imgObj.height - this.imgObj.height / e) : (e = this.imgSize.width / (this.imgSize.width - this.imgObj.width), 
                    t = this.imgObj.height + this.imgObj.height / e), this.imgSize.height = t, this.applyStyle("height", t + "px"), 
                    this.$.realImage && !this.transformParams) {
                        var i = this.imgSize.width, n = this.imgSize.height;
                        this.$.realImage.applyStyle("height", n + "px"), this.$.realImage.applyStyle("width", i + "px");
                    }
                    this.removeBuffer();
                }), this.imgObj.onerror = enyo.bind(this, function() {
                    this.imgObj.src = "assets/nopic.png";
                }), this.imgObj.src = this.src);
            } else this.$.realImage && this.$.realImage.destroy(), this.createComponent({
                kind: "Image",
                name: "realImage",
                style: "position: relative;-webkit-transform:translate3d(0,0,0);",
                classes: this.border ? "" : "no-limits"
            }, {
                owner: this
            }).render(), this.maxWidth && this.$.image.applyStyle("max-width", this.maxWidth + "px !important"), 
            this.transformParams && (enyo.dom.transform(this.$.realImage, this.transformParams), 
            this.$.realImage.applyStyle("width", "auto"), this.$.realImage.applyStyle("height", "auto")), 
            this.$.realImage.setAttribute("src", this.src), this.$.image && this.$.image.hide();
        });
    },
    removeBuffer: function() {
        if (this.$.image) {
            this.$.image.hasNode();
            var t = this.$.image.node;
            if (t) {
                var e = this.imgSize.width, i = this.imgSize.height;
                t.width != e && (t.width = e), t.height != i && (t.height = i);
                var n = t.getContext("2d");
                n.drawImage(this.imgObj, 0, 0, e, i);
            }
        }
    }
}), enyo.kind({
    name: "ClassBufferedImage",
    style: "display:inline-block;text-align:center;overflow:hidden;white-space:nowrap;margin-bottom:5px;",
    classes: "",
    published: {
        bufferClass: "buffer-image-class",
        noAnimation: !1,
        number: !1,
        thumb: !1,
        caption: ""
    },
    handlers: {
        onFlowGifs: "showGif",
        onStripGifs: "hideGif"
    },
    events: {
        onHeightChange: ""
    },
    components: [ {
        kind: "Image",
        name: "realImage",
        onload: "removeBuffer",
        onerror: "loadErrorPic",
        style: "vertical-align:top;"
    }, {
        tag: "canvas",
        name: "image",
        style: "position:relative;vertical-align:top;",
        classes: "unselectable",
        isChrome: !0,
        showing: !1
    }, {
        name: "numberLabel",
        content: "",
        classes: "",
        tag: "span",
        style: "display:inline-block;vertical-align:top;position:relative;height:3px;font-weight:bold;overflow:visible;color:white;text-shadow: 0px 0px 4px rgba(61,61,61,0.9);",
        showing: !1
    }, {
        name: "captionLabel",
        showing: !1,
        style: "white-space:normal;word-wrap:break-word;"
    } ],
    create: function() {
        this.inherited(arguments), this.setSrc(this.src);
    },
    getThumbSize: function() {
        var t = GET_IMAGE_SIZE() / 6;
        return 75 > t && (t = 75), t;
    },
    thumbChanged: function() {
        if (this.$.realImage) {
            if (this.thumb === !0) this.$.realImage.applyStyle("max-width", this.getThumbSize() + "px !important"), 
            this.$.realImage.applyStyle("min-width", this.getThumbSize() + "px !important"), 
            this.noAnimation === !0 && (this.$.realImage.applyStyle("height", this.getThumbSize() + "px"), 
            this.applyStyle("width", this.getThumbSize() + "px"), this.applyStyle("height", this.getThumbSize() + "px"), 
            this.$.image && this.$.image.applyStyle("display", "none")); else {
                this.src.indexOf(".gif") > -1 && this.noAnimation === !1 && (this.$.realImage.applyStyle("visibility", "visible"), 
                this.$.image.applyStyle("display", "none")), this.$.realImage.applyStyle("max-width", (this.maxWidth || GET_IMAGE_SIZE()) + "px !important"), 
                this.$.realImage.applyStyle("min-width", (this.maxWidth || GET_IMAGE_SIZE()) + "px !important");
                var t = 0;
                if (this.$.captionLabel && this.caption.length > 0 && this.thumb === !1) {
                    var e = this.$.captionLabel.getBounds();
                    t = e.height;
                }
                this.$.realImage.applyStyle("height", null), this.applyStyle("width", (this.maxWidth || GET_IMAGE_SIZE()) + "px"), 
                this.applyStyle("height", null);
            }
            this.removeBuffer();
        }
    },
    showLabel: function() {
        if (this.number === !0 && this.$.numberLabel) {
            this.$.numberLabel.show(), this.$.numberLabel.setContent("" + (this.index + 1));
            var t = 0;
            this.src.indexOf(".gif") > -1 && (t = this.thumb === !0 ? this.getThumbSize() : this.maxWidth || GET_IMAGE_SIZE()), 
            this.$.numberLabel.applyStyle("left", "-" + ((this.thumb === !0 ? this.getThumbSize() : this.maxWidth || GET_IMAGE_SIZE()) + t) + "px");
        }
        this.$.captionLabel && (this.caption.length > 0 && this.thumb === !1 ? (this.$.captionLabel.setContent(this.caption), 
        this.$.captionLabel.show()) : this.$.captionLabel.hide());
    },
    setSrc: function(t) {
        1 > t.length || !this.$.realImage || (this.src, this.src = t, 0 > this.src.indexOf(".gif") && this.noAnimation === !0 && this.$.image && this.$.image.destroy(), 
        this.number === !1 && this.$.numberLabel && this.$.numberLabel.destroy(), this.thumbChanged(), 
        this.showBuffer(), this.$.realImage.setSrc(this.src));
    },
    drawCanvas: function() {
        if (this.$.image) {
            this.$.image.hasNode();
            var t = this.$.image.node, e = this.$.realImage.hasNode();
            if (t && e) {
                var i = e.width, n = e.height;
                t.width != i && (t.width = i), t.height != n && (t.height = n);
                var o = t.getContext("2d");
                o.drawImage(e, 0, 0, i, n), this.$.image.applyStyle("left", "-" + (i + 5) + "px"), 
                this.$.image.applyStyle("display", "inline-block"), this.noAnimation === !1 && this.$.numberLabel && this.$.numberLabel.applyStyle("left", "-" + (this.thumb === !0 ? this.getThumbSize() : this.maxWidth || GET_IMAGE_SIZE()) + "px");
            }
        }
    },
    showGif: function() {
        this.sizeControl(), this.src.indexOf(".gif") > -1 && this.noAnimation === !1 && this.thumb === !1 && (this.$.realImage.applyStyle("visibility", "visible"), 
        this.$.image.applyStyle("display", "none"));
    },
    hideGif: function() {
        this.src.indexOf(".gif") > -1 && this.$.realImage && (this.$.realImage.applyStyle("visibility", "hidden"), 
        this.drawCanvas());
    },
    showBuffer: function() {
        this.addClass(this.bufferClass);
    },
    sizeControl: function() {
        if (this.$.realImage && this.$.realImage.hasNode()) {
            var t = 0;
            if (this.caption.length > 0 && this.thumb === !1) {
                var e = this.$.captionLabel.getBounds();
                t = e.height;
            }
            this.applyStyle("height", (this.thumb === !1 ? this.$.realImage.hasNode().height + t : this.getThumbSize() + t) + "px"), 
            this.applyStyle("width", (this.thumb === !1 ? this.$.realImage.hasNode().width : this.getThumbSize()) + "px");
        }
    },
    removeBuffer: function() {
        this.removeClass(this.bufferClass), this.showLabel(), setTimeout(enyo.bind(this, function() {
            this.sizeControl(), this.hideGif();
        }), 150);
    },
    loadErrorPic: function() {
        this.setSrc("assets/nopic.png");
    }
}), enyo.kind({
    name: "PhotoDisplay",
    kind: "Control",
    published: {
        srcs: [],
        captions: [],
        index: 0,
        hasGifs: !1
    },
    events: {
        onImageClick: "",
        onImageSave: ""
    },
    handlers: {
        onStripImages: "stripImages",
        onFlowImages: "flowImages",
        onHeightChange: "adjustHeight"
    },
    classes: "animateClass",
    style: "padding-top:5px;padding-bottom:5px;overflow:hidden;",
    components: [ {
        kind: "onyx.Popup",
        isChrome: !0,
        autoDismiss: !0,
        name: "savePop",
        classes: "captionBack",
        components: [ {
            kind: "onyx.Button",
            content: "Save Image",
            ontap: "requestSave",
            classes: "onyx-affirmative"
        } ]
    } ],
    delayLoad: !0,
    componentsCreated: !1,
    isStripped: !1,
    rows: 0,
    create: function() {
        this.inherited(arguments), this.delayLoad || this.flowPhotos();
    },
    stripImages: function() {
        this.componentsCreated === !0 && (this.destroyClientControls(), this.componentsCreated = !1), 
        this.isStripped = !0;
    },
    flowImages: function() {
        this.isStripped = !1, this.flowPhotos();
    },
    imageClicked: function(t) {
        return this._preventTap === !0 ? (this._preventTap = !1, void 0) : (this.doImageClick({
            src: t.src
        }), void 0);
    },
    requestSave: function() {
        this.savedSender && this.doImageSave({
            src: this.savedSender.src
        }), this.$.savePop.hide();
    },
    imageHold: function(t, e) {
        return this._preventTap = !0, enyo.platform.blackberry ? void 0 : (this.$.savePop.showAtEvent(e), 
        this.savedSender = t, !0);
    },
    origWidth: 0,
    origHeight: 0,
    resizeHandler: function() {
        this.inherited(arguments), (WND_HEIGHT() != this.origHeight || WND_WIDTH() != this.origWidth) && (this.origWidth = WND_WIDTH(), 
        this.origHeight = WND_HEIGHT(), this.flowPhotos());
    },
    flowPhotos: function() {
        enyo.asyncMethod(this, function() {
            this.componentsCreated === !0 && (this.destroyClientControls(), this.componentsCreated = !1), 
            this.index = 0;
            var t = [], e = 0;
            if (APPLICATION.tumblrUseAllPics === !0 || WND_WIDTH() > 700) {
                var i = [];
                for (e = 0; this.srcs.length > e; e++) i.push(this.createImage(e));
                this.createComponents(i, {
                    owner: this
                }), this.render();
            } else {
                if (t.push(this.createImage(this.index)), this.srcs.length > 1) for (e = 1; this.srcs.length > e; e++) t.push(this.createThumb(e));
                this.createComponents(t, {
                    owner: this
                }), this.render(), this.previousImage = this.$.image0;
            }
            this.componentsCreated = !0;
        });
    },
    changePic: function(t) {
        this.previousImage.ontap = "changePic", this.previousImage.onhold = "", this.previousImage.noAnimation = !0, 
        this.previousImage.applyStyle("margin-right", "5px;"), this.previousImage.setThumb(!0), 
        t.ontap = "imageClicked", t.onhold = "imageHold", t.applyStyle("margin-right", "0px;"), 
        t.noAnimation = !1, t.setThumb(!1), this.previousImage = t, enyo.Signals.send("onScrollScroller", {
            top: t.getBounds().top,
            id: this.postid
        }), setTimeout(enyo.bind(this, function() {
            t.showGif();
        }), 400);
    },
    createThumb: function(t) {
        return {
            kind: "ClassBufferedImage",
            caption: this.captions[t],
            thumb: !0,
            number: !0,
            name: "image" + t,
            noAnimation: !0,
            index: t,
            style: "margin-right:3px;",
            src: this.srcs[t],
            ontap: "changePic"
        };
    },
    createImage: function(t) {
        return {
            kind: "ClassBufferedImage",
            caption: this.captions[t],
            number: this.srcs.length > 1 ? !0 : !1,
            index: t,
            maxWidth: this.maxWidth,
            name: "image" + t,
            src: this.srcs[t],
            ontap: "imageClicked",
            onhold: "imageHold"
        };
    }
});

// source\controls\toolbars\toolbar.js
enyo.kind({
    name: "RightBottomToolbar",
    kind: "Slideable3d",
    style: "position:absolute;bottom:0;pointer-events:auto;white-space:normal;padding:3px 3px 3px 3px;height:" + TUMBLR.footerHeight + "px;",
    classes: "",
    max: 50,
    unit: "px",
    axis: "h",
    value: 0,
    min: -200,
    kDragScalar: 1.65,
    overMoving: !1,
    events: {
        onRequestBack: "",
        onRequestNext: "",
        onRequestMenu: "",
        onMenuOpen: "",
        onMenuClose: ""
    },
    handlers: {
        onAnimateFinish: "syncMinMax",
        onApplyResize: "resizeHandler"
    },
    components: [ {
        name: "handle",
        classes: "onyx-toolbar toolbar-round-left",
        style: "opacity:0.6;position:relative;left:-25px;bottom:-1px;border-right:none;height:" + TUMBLR.footerHeight + "px;width:25px;",
        components: [ {
            kind: "onyx.IconButton",
            name: "toggleButton",
            classes: "toolbar-toggle-button-position bottom-right-tool-bar",
            src: "assets/hidetoolbaricon.png",
            ontap: "toggleToolbar"
        } ]
    }, {
        style: "max-height:" + (WND_HEIGHT() - 20) + "px;min-height:300px;background-color:rgba(70,130,180,0.9);overflow:visible;padding:5px;border-top-left-radius:5px;border-top-right-radius:5px;z-index:99998;text-align: center;position:absolute;bottom:0;white-space:normal;font-size:80%;",
        name: "menuButtons",
        classes: "onyx-toolbar menu-shadow animateClass",
        components: [ {
            kind: "android.Scroller",
            touchOverscroll: !1,
            horizontal: "hidden",
            name: "menuScroller",
            components: [ {
                style: "height:370px;",
                components: [ {
                    content: "Settings:",
                    classes: "menu-titles"
                }, {
                    components: [ {
                        name: "editCats",
                        kind: "onyx.TextIconButton",
                        src: "assets/editcaticon.png",
                        label: "Edit Categories",
                        ontap: "processItem",
                        style: "margin-right:5px;font-size:7.4pt;",
                        classes: "animateClass button-shadow"
                    }, {
                        name: "followers",
                        kind: "onyx.TextIconButton",
                        src: "assets/followersicon.png",
                        label: "Followers",
                        ontap: "processItem",
                        style: "margin-right:5px;font-size:8pt;",
                        classes: "animateClass button-shadow"
                    }, {
                        name: "settings",
                        kind: "onyx.TextIconButton",
                        src: "assets/settingsicon.png",
                        label: "Settings",
                        ontap: "processItem",
                        style: "margin-right:5px;",
                        classes: "animateClass button-shadow"
                    }, {
                        name: "launchBrowser",
                        kind: "onyx.TextIconButton",
                        src: "assets/browsericon.png",
                        label: "Open Browser",
                        ontap: "processItem",
                        style: "font-size:8pt;",
                        classes: "animateClass button-shadow"
                    } ]
                }, {
                    components: [ {
                        name: "help",
                        kind: "onyx.TextIconButton",
                        src: "assets/helpicon.png",
                        label: "Help",
                        ontap: "processItem",
                        style: "margin-right:5px;",
                        classes: "animateClass button-shadow"
                    }, {
                        name: "loginInfo",
                        kind: "onyx.TextIconButton",
                        src: "assets/logininfoicon.png",
                        label: "Login Info",
                        ontap: "processItem",
                        style: "margin-right:5px;",
                        classes: "animateClass button-shadow"
                    } ]
                }, {
                    content: "Mode Options:",
                    classes: "menu-titles"
                }, {
                    components: [ {
                        name: "launchDash",
                        kind: "onyx.TextIconButton",
                        src: "assets/launchdashboardicon.png",
                        label: "Launch Dash",
                        ontap: "processItem",
                        style: "margin-right:5px;",
                        classes: "animateClass button-shadow"
                    }, {
                        name: "history",
                        kind: "onyx.TextIconButton",
                        src: "assets/historyicon.png",
                        label: "History",
                        ontap: "processItem",
                        style: "margin-right:5px;",
                        classes: "animateClass button-shadow"
                    }, {
                        name: "refreshPost",
                        kind: "onyx.TextIconButton",
                        src: "assets/refreshposticon.png",
                        label: "Refresh Post",
                        ontap: "processItem",
                        style: "margin-right:5px;",
                        classes: "animateClass button-shadow"
                    }, {
                        name: "randomize",
                        kind: "onyx.TextIconButton",
                        src: "assets/randomizeicon.png",
                        label: "Randomize Again",
                        ontap: "processItem",
                        style: "font-size:7pt;",
                        classes: "animateClass button-shadow"
                    } ]
                }, {
                    content: "View Mode:",
                    classes: "menu-titles"
                }, {
                    components: [ {
                        name: "dashboard",
                        kind: "onyx.TextIconButton",
                        src: "assets/dashboardicon.png",
                        label: "Dashboard",
                        ontap: "processItem",
                        style: "margin-right:5px;font-size:7.4pt;",
                        classes: "animateClass button-shadow"
                    }, {
                        name: "category",
                        kind: "onyx.TextIconButton",
                        src: "assets/categoryicon.png",
                        label: "Category",
                        ontap: "processItem",
                        style: "margin-right:5px;",
                        classes: "animateClass button-shadow"
                    }, {
                        name: "tagSearch",
                        kind: "onyx.TextIconButton",
                        src: "assets/tagsearchicon.png",
                        label: "Tag Search",
                        ontap: "processItem",
                        style: "margin-right:5px;",
                        classes: "animateClass button-shadow"
                    }, {
                        name: "random",
                        kind: "onyx.TextIconButton",
                        src: "assets/randomicon.png",
                        label: "Random",
                        ontap: "processItem",
                        style: "",
                        classes: "animateClass button-shadow"
                    } ]
                }, {
                    style: "height:5px;"
                } ]
            } ]
        } ]
    } ],
    zIndexOn: function() {
        this.applyStyle("z-index", "9999");
    },
    zIndexOff: function() {
        this.applyStyle("z-index", null);
    },
    create: function() {
        this.inherited(arguments), this.value = 0, this.setupMinMax();
    },
    processItem: function(t) {
        var e = t.name;
        switch (e) {
          case "dashboard":
            enyo.Signals.send("onSwitchToDashboard");
            break;

          case "category":
            enyo.Signals.send("onRequestCategory");
            break;

          case "tagSearch":
            enyo.Signals.send("onRequestTagSearch");
            break;

          case "random":
            enyo.Signals.send("onRequestRandom");
            break;

          case "randomize":
            enyo.Signals.send("onRequestRandomize");
            break;

          case "refreshPost":
            enyo.Signals.send("onRequestRefreshPost", {
                target: "refresh"
            });
            break;

          case "launchDash":
            enyo.Signals.send("onRequestLaunchDash");
            break;

          case "loginInfo":
            enyo.Signals.send("onRequestLoginInfo");
            break;

          case "help":
            enyo.Signals.send("onRequestHelp", {
                help: "intro"
            });
            break;

          case "settings":
            enyo.Signals.send("onRequestSettings");
            break;

          case "followers":
            enyo.Signals.send("onRequestFollowers");
            break;

          case "editCats":
            enyo.Signals.send("onRequestEditCats");
            break;

          case "launchBrowser":
            enyo.Signals.send("onRequestLauchPostInBrowser");
            break;

          case "history":
            enyo.Signals.send("onRequestHistory");
        }
        this.toggleToolbar();
    },
    resizeHandler: function() {
        this.inherited(arguments);
        var t = WND_WIDTH();
        this.$.menuButtons.applyStyle("width", t + "px"), this.applyStyle("left", t + "px"), 
        this.$.menuButtons.applyStyle("height", "370px"), this.$.menuButtons.applyStyle("max-height", WND_HEIGHT() - 20 + "px");
        var e = this.$.menuButtons.getBounds();
        this.$.menuScroller.applyStyle("height", e.height + "px"), this.applyStyle("height", TUMBLR.footerHeight + "px"), 
        this.$.handle.applyStyle("height", TUMBLR.footerHeight + "px"), this.setupMinMax();
    },
    opacify: function(t) {
        t.applyStyle("opacity", "0"), setTimeout(enyo.bind(this, function() {
            t.hide();
        }), 200);
    },
    deopacify: function(t) {
        t.show(), t.applyStyle("opacity", "1");
    },
    updateMenu: function() {
        0 === APPLICATION.postMode ? (this.opacify(this.$.randomize), this.deopacify(this.$.refreshPost), 
        this.deopacify(this.$.launchDash), this.deopacify(this.$.random), this.opacify(this.$.dashboard)) : (1 == APPLICATION.postMode || 2 == APPLICATION.postMode) && (this.opacify(this.$.refreshPost), 
        this.$.dashboard.applyStyle("font-size", "7.4pt"), this.deopacify(this.$.dashboard), 
        this.opacify(this.$.launchDash), "random" == APPLICATION.redirectID ? (this.$.randomize.applyStyle("font-size", "7pt"), 
        this.deopacify(this.$.randomize), this.opacify(this.$.random)) : (this.opacify(this.$.randomize), 
        this.deopacify(this.$.random))), 1 > APPLICATION.exploreItems.length ? this.opacify(this.$.history) : this.deopacify(this.$.history);
        var t = WND_WIDTH();
        this.$.menuButtons.applyStyle("width", t + "px"), this.applyStyle("left", t + "px"), 
        this.$.menuButtons.applyStyle("height", "370px"), this.$.menuButtons.applyStyle("max-height", WND_HEIGHT() - 20 + "px");
        var e = this.$.menuButtons.getBounds();
        this.$.menuScroller.applyStyle("height", e.height + "px");
    },
    rendered: function() {
        this.inherited(arguments), setTimeout(enyo.bind(this, function() {
            this.setupMinMax();
        }), 250);
    },
    dragstart: function() {
        this.updateMenu(), this.inherited(arguments);
    },
    completeDrag: function(t) {
        this.value !== this.calcMax() && this.value != this.calcMin() ? this.animateToMinMax(t.dragInfo.minimizing) : this.doAnimateFinish();
    },
    toggleToolbar: function() {
        this.updateMenu(), this.toggleMinMax();
    },
    syncMinMax: function() {
        this.value == this.min ? (this.$.menuButtons.applyStyle("background-color", "rgba(70,130,180,0.7)"), 
        this.$.menuScroller.scrollToBottom(), this.zIndexOn()) : this.zIndexOff();
    },
    setupMinMax: function() {
        this.min = -1 * (WND_WIDTH() + 5), this.max = 0, this.syncMinMax(), this.animateToMax();
    },
    valueChanged: function(t) {
        isNaN(this.value) && (this.value = this.max);
        var e = this.value;
        this.isOob(e) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(e) : this.clampValue(e)), 
        this.value > -1 * (WND_WIDTH() - 20) && this.$.menuButtons.applyStyle("background-color", "rgba(70,130,180,0.9)"), 
        enyo.platform.android > 2 && (this.value ? (0 === t || void 0 === t) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), 
        this.canTransform ? "translateX" == this.transform ? enyo.dom.transformValue(this, "translate3d", this.value + this.unit + ",0,0") : enyo.dom.transformValue(this, "translate3d", "0," + this.value + this.unit + ",0") : this.setInlineStyles(this.value, !1), 
        this.doChange();
    }
}), enyo.kind({
    name: "PostingToolbar",
    kind: "Slideable3d",
    style: "pointer-events:auto;white-space:normal;position: absolute;bottom:150px;padding:3px 3px 3px 3px;",
    classes: "",
    max: 0,
    unit: "px",
    axis: "h",
    min: 0,
    kDragScalar: 1.65,
    overMoving: !1,
    handlers: {
        onAnimateFinish: "syncMinMax",
        onApplyResize: "resizeHandler"
    },
    components: [ {
        name: "handle",
        classes: "onyx-toolbar toolbar-round-left handle-shadow",
        style: "position:absolute;left:-22px;border-right:none;height:" + TUMBLR.footerHeight + "px;width:25px;",
        components: [ {
            kind: "onyx.IconButton",
            name: "toggleButton",
            classes: "toolbar-toggle-button-position bottom-right-tool-bar",
            src: "assets/hidetoolbaricon.png",
            ontap: "taped"
        } ]
    }, {
        style: "height:65px;padding:5px;border-bottom-left-radius:5px;",
        classes: "onyx-toolbar posting-shadow",
        components: [ {
            kind: "onyx.TextIconButton",
            src: "assets/texticon.png",
            postview: "text",
            ontap: "requestPost",
            style: "margin-right:5px;",
            label: "Text"
        }, {
            kind: "onyx.TextIconButton",
            src: "assets/photoicon.png",
            postview: "photo",
            ontap: "requestPost",
            style: "margin-right:5px;",
            label: "Photo"
        }, {
            kind: "onyx.TextIconButton",
            src: "assets/reblogicon.png",
            postview: "reblog",
            ontap: "requestPost",
            style: "",
            label: "Reblog"
        } ]
    } ],
    create: function() {
        this.inherited(arguments), this.applyStyle("opacity", "0.7"), this.resizeHandler(), 
        this.setupMinMax(), this.animateToMax();
    },
    requestPost: function(t) {
        enyo.Signals.send("onRequestPostView", {
            postview: t.postview
        }), this.animateToMax();
    },
    resizeHandler: function() {
        this.inherited(arguments), this.applyStyle("height", TUMBLR.footerHeight + "px"), 
        this.$.handle.applyStyle("height", TUMBLR.footerHeight + "px"), this.applyStyle("bottom", TUMBLR.footerHeight + 5 + "px"), 
        this.setupMinMax();
    },
    completeDrag: function(t) {
        this.value !== this.calcMax() && this.value != this.calcMin() ? this.animateToMinMax(t.dragInfo.minimizing) : this.doAnimateFinish(), 
        this.firedEvent = !1;
    },
    setupMinMax: function() {
        var t = WND_WIDTH();
        this.min = t - 195, this.max = t, (this.min != this.value || this.max != this.value) && (this.value = this.max), 
        this.valueChanged(this.value);
    },
    taped: function() {
        this.toggleMinMax();
    },
    firedEvent: !1,
    valueChanged: function(t) {
        isNaN(this.value) && (this.value = this.max);
        var e = this.value;
        this.firedEvent === !1 && this.dragging && (this.firedEvent = !0), this.isOob(e) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(e) : this.clampValue(e)), 
        this.value < WND_WIDTH() - 50 ? this.applyStyle("opacity", "1") : this.applyStyle("opacity", "0.5"), 
        enyo.platform.android > 2 && (this.value ? (0 === t || void 0 === t) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), 
        this.canTransform ? "translateX" == this.transform ? enyo.dom.transformValue(this, "translate3d", this.value + this.unit + ",0,0") : enyo.dom.transformValue(this, "translate3d", "0," + this.value + this.unit + ",0") : this.setInlineStyles(this.value, !1), 
        this.doChange();
    }
});

// source\controls\iconbuttons\iconbuttons.js
enyo.kind({
    name: "Large.onyx.Icon",
    kind: "onyx.Icon",
    classes: "onyx-icon-large",
    published: {
        noResize: !1,
        src: "",
        disabled: !1
    },
    events: {
        onSizeChange: ""
    },
    components: [ {
        kind: "Signals",
        onForceFlow: "resizeHandler"
    } ],
    create: function() {
        this.inherited(arguments), WND_HEIGHT() >= 700 && this.noResize === !1 && (this.removeClass("onyx-icon-large"), 
        this.addClass("onyx-icon-x-large"));
    },
    origWidth: 0,
    origHeight: 0,
    resizeHandler: function() {
        this.inherited(arguments), (WND_HEIGHT() != this.origHeight || WND_WIDTH() != this.origWidth) && (this.origWidth = WND_WIDTH(), 
        this.origHeight = WND_HEIGHT(), WND_HEIGHT() >= 700 && this.noResize === !1 ? (this.removeClass("onyx-icon-large"), 
        this.addClass("onyx-icon-x-large"), this.doSizeChange({
            largeScreen: !0
        })) : (this.removeClass("onyx-icon-x-large"), this.addClass("onyx-icon-large"), 
        this.doSizeChange({
            largeScreen: !1
        })));
    }
}), enyo.kind({
    name: "onyx.65pxIcon",
    published: {
        src: "",
        disabled: !1,
        label: ""
    },
    classes: "onyx-65px-icon",
    create: function() {
        this.inherited(arguments), this.src && this.srcChanged(), this.disabledChanged(), 
        this.labelChanged();
    },
    disabledChanged: function() {
        this.addRemoveClass("disabled", this.disabled);
    },
    srcChanged: function() {
        this.applyStyle("background-image", "url(" + enyo.path.rewrite(this.src) + ")");
    },
    tap: function() {
        return this.disabled ? !0 : void 0;
    },
    labelChanged: function() {
        this.label.length > 0 && (this.$.labelDiv && this.$.labelDiv.destroy(), this.createComponent({
            name: "labelDiv",
            content: this.label,
            style: "position: relative;top:3px;font-size: 80%;width:65px;text-align:center;text-shadow: 0px 0px 8px rgba(0,0,0,0.6);font-weight:bold;color:white;"
        }).render());
    }
}), enyo.kind({
    name: "onyx.TextIconButton",
    published: {
        src: "",
        disabled: !1,
        label: "",
        active: !1
    },
    handlers: {
        ondown: "setClick"
    },
    classes: "onyx-text-icon-button",
    style: "",
    components: [ {
        style: "text-align:center;overflow:hidden;position:absolute;height:60px;width:50px;",
        components: [ {
            kind: "onyx.Icon",
            name: "icon",
            style: "width:32px;height:32px;background-size: 32px 32px;"
        }, {
            name: "text",
            style: "display:block;position:absolute;bottom:0;width:100%;text-align:center;"
        } ]
    } ],
    create: function() {
        this.inherited(arguments), this.src && this.srcChanged(), this.disabledChanged(), 
        this.labelChanged();
    },
    setClick: function() {
        this.addClass("selected"), setTimeout(enyo.bind(this, function() {
            this.removeClass("selected");
        }), 500);
    },
    disabledChanged: function() {
        this.addRemoveClass("disabled", this.disabled);
    },
    srcChanged: function() {
        this.$.icon.setSrc(this.src);
    },
    tap: function() {
        return this.disabled ? !0 : (this.setActive(!0), this.setClick(), void 0);
    },
    labelChanged: function() {
        this.label.length > 0 && this.$.text.setContent(this.label);
    },
    activeChanged: function() {
        this.bubble("onActivate");
    }
}), enyo.kind({
    name: "Large.onyx.IconButton",
    kind: "Large.onyx.Icon",
    published: {
        active: !1,
        label: ""
    },
    create: function() {
        this.inherited(arguments), this.removeClass("onyx-icon-button"), this.labelChanged();
    },
    labelChanged: function() {
        this.label.length > 0 && (this.$.labelDiv && this.$.labelDiv.destroy(), this.createComponent({
            name: "labelDiv",
            content: this.label,
            style: "position: relative;top:3px;font-size: 55%;width:45px;text-align:center;text-shadow: 0px 0px 8px rgba(0,0,0,0.6);font-weight:bold;color:white;"
        }).render());
    },
    tap: function() {
        return this.disabled ? !0 : (this.setActive(!0), void 0);
    },
    activeChanged: function() {
        this.bubble("onActivate");
    }
}), enyo.kind({
    name: "LikeButton",
    classes: "like-icon-large",
    kind: "onyx.Checkbox",
    components: [ {
        kind: "Signals",
        onSetLikeButton: "setLiked"
    } ],
    create: function() {
        this.inherited(arguments);
    },
    tap: function() {
        return this.disabled || (this.getChecked() === !1 ? this.animateLike() : this.animateUnlike(), 
        this.setChecked(!this.getChecked()), this.bubble("onchange")), !this.disabled;
    },
    setLiked: function(t, e) {
        e.postId == this.postId && this.setChecked(e.value);
    },
    animateLike: function() {
        this.applyStyle(enyo.dom.getCSSPrefix("animation-duration", "AnimationDuration"), "1s"), 
        this.applyStyle(enyo.dom.getCSSPrefix("animation-name", "AnimationName"), "like-animation"), 
        setTimeout(enyo.bind(this, function() {
            this.applyStyle(enyo.dom.getCSSPrefix("animation-name", "AnimationName"), "none");
        }), 2500);
    },
    animateUnlike: function() {
        this.applyStyle(enyo.dom.getCSSPrefix("animation-duration", "AnimationDuration"), "1s"), 
        this.applyStyle(enyo.dom.getCSSPrefix("animation-name", "AnimationName"), "unlike-animation"), 
        setTimeout(enyo.bind(this, function() {
            this.applyStyle(enyo.dom.getCSSPrefix("animation-name", "AnimationName"), "none");
        }), 2500);
    }
});

// source\controls\toaster\toaster.js
enyo.kind({
    name: "ToasterPopup",
    kind: "Slideable3d",
    classes: "toaster",
    published: {
        align: "left",
        top: 0,
        left: 0,
        modal: !0,
        autoDismiss: !0,
        scrim: !1,
        anchor: !0,
        floating: !1,
        centered: !1,
        centeredY: !1,
        centeredX: !1,
        duration: 500
    },
    captureEvents: !0,
    eventsToCapture: {
        ondown: "capturedDown",
        ontap: "capturedTap"
    },
    unit: "%",
    draggable: !1,
    events: {
        onShow: "",
        onHide: ""
    },
    showing: !1,
    handlers: {
        ondown: "down",
        onkeydown: "keydown",
        ondragstart: "dragstart",
        onAnimateFinish: "checkForHide"
    },
    scrimTools: [ {
        kind: "onyx.Scrim",
        classes: "onyx-scrim-translucent",
        isChrome: !0,
        name: "scrim",
        style: "-webkit-transform: translate3d(0,0,0);",
        ontap: "scrimTap",
        addBefore: null
    } ],
    components: [],
    defaultZ: 120,
    create: function() {
        this.canGenerate = !this.floating, this.floating && (enyo.floatingLayer.hasNode() || enyo.floatingLayer.render(), 
        this.parentNode = enyo.floatingLayer.hasNode()), this.inherited(arguments), this.floating || this.scrimChanged(), 
        this.applyAlign(!0), this.$.animator.setDuration(this.duration), this.centeredChanged(), 
        this.addClass("fill-forwards");
    },
    render: function() {
        this.inherited(arguments);
    },
    setPosition: function(t) {
        t && (t.left && this.setLeft(t.left), t.top && this.setTop(t.top));
    },
    calcViewportSize: function() {
        return {
            width: enyo.dom.getWindowWidth(),
            height: enyo.dom.getWindowHeight()
        };
    },
    centeredChanged: function() {
        this.updatePosition(!1);
    },
    centeredXChanged: function() {
        this.updatePosition(!1);
    },
    centeredYChanged: function() {
        this.updatePosition(!1);
    },
    resizeHandler: function() {
        this.inherited(arguments), this.updatePosition(!1);
    },
    updatePosition: function(t) {
        if (this.centered || this.centeredY || this.centeredX) {
            var e = this.calcViewportSize(), i = this.getBounds();
            if (void 0 === i.top || 0 === i.width) return;
            this.centeredX ? this.left = Math.max((e.width - i.width) / 2, 0) : this.centeredY ? this.top = Math.max((e.height - i.height) / 2, 0) : this.centered && (this.top = Math.max((e.height - i.height) / 2, 0), 
            this.left = Math.max((e.width - i.width) / 2, 0));
        }
        this.applyAlign(t);
    },
    _zIndex: 120,
    applyZIndex: function() {
        onyx.Popup.highestZ && onyx.Popup.highestZ >= this._zIndex && (this._zIndex = onyx.Popup.highestZ + 4, 
        onyx.Popup.highestZ = this._zIndex), this.applyStyle("z-index", this._zIndex), this.scrim && (this.createScrim(), 
        this.$.scrim.setZIndex(this._zIndex - 1));
    },
    createScrim: function() {
        this.scrim && (this.$.scrim || (this.createComponents(this.scrimTools, {
            owner: this,
            floating: this.floating
        }), this.floating || this.$.scrim.setContainer(this.parent), this.$.scrim.render(), 
        this.isOpen && this.$.scrim.show()));
    },
    scrimChanged: function() {
        this.scrim ? this.createScrim() : this.$.scrim && this.$.scrim.destroy();
    },
    alignChanged: function(t) {
        this.canTransform ? this.use3d ? enyo.dom.transformValue(this, "translate3d", null) : (enyo.dom.transformValue(this, "translateX", null), 
        enyo.dom.transformValue(this, "translateY", null)) : this.setInlineStyles(null, !1), 
        this.removeClass(t), this.applyAlign(!1);
    },
    applyAlign: function(t) {
        var e = this.getBounds();
        if (e && 0 !== e.height && void 0 !== e.height) {
            this.hasClass(this.align) || this.addClass(this.align), this.applyStyle("top", null), 
            this.applyStyle("left", null);
            var i = this.calcViewportSize(), n = i.width, o = i.height;
            switch (this.align) {
              case "left":
                this.setAxis("h"), this.setMax(0), this.applyStyle("top", this.top + "px"), this.anchor ? (this.setMin(-100), 
                t && this.setValue(-100)) : (this.applyStyle("left", this.left + "px"), x = Math.floor(100 * (n / e.width)), 
                x = -1 * x, this.setMin(x), t && this.setValue(x), this.addClass("full-radius"));
                break;

              case "right":
                this.setAxis("h"), this.setMin(0), this.applyStyle("top", this.top + "px"), this.anchor ? (this.setMax(100), 
                t && this.setValue(100)) : (this.applyStyle("left", this.left + "px"), x = Math.floor(100 * (n / e.width)), 
                this.setMax(x), t && this.setValue(x), this.addClass("full-radius"));
                break;

              case "top":
                this.setAxis("v"), this.setMax(0), this.applyStyle("left", this.left + "px"), this.anchor ? (this.setMin(-100), 
                t && this.setValue(-100)) : (this.applyStyle("top", this.top + "px"), x = Math.floor(100 * (o / e.height)), 
                x = -1 * x, this.setMin(x), t && this.setValue(x));
                break;

              case "bottom":
                this.setAxis("v"), this.setMin(0), this.applyStyle("left", this.left + "px"), this.anchor ? (this.setMax(100), 
                t && this.setValue(100)) : (this.applyStyle("top", this.top + "px"), x = Math.floor(100 * (o / e.height)), 
                this.setMax(x), t && this.setValue(x));
            }
        }
    },
    animateCellOpen: function() {
        switch (this.align) {
          case "left":
          case "top":
            this.animateToMax();
            break;

          case "right":
          case "bottom":
            this.animateToMin();
        }
    },
    animateCellClose: function() {
        switch (this.align) {
          case "left":
          case "top":
            this.animateToMin();
            break;

          case "right":
          case "bottom":
            this.animateToMax();
        }
    },
    isOpen: !1,
    showingChanged: function() {
        this.floating && this.showing && !this.hasNode() && this.render(), this.showing && (this.applyStyle("visibility", "hidden"), 
        this.updatePosition(!0)), this.showing ? (this.inherited(arguments), this.resized(), 
        this.setValue("left" == this.align || "top" == this.align ? this.min : this.max), 
        this.applyStyle("visibility", null), this.animateOpen(), this.doShow(), this.isOpen = !0) : (this.hideScrim(), 
        this.isOpen === !0 ? this.animateClose() : (this.inherited(arguments), this.isOpen = !1));
    },
    hide: function() {
        this.isOpen !== !1 && (this.inherited(arguments), this.release());
    },
    animateOpen: function() {
        this.show(), ToasterPopup.count++, this.applyZIndex(), this.scrim && (this.createScrim(), 
        this.$.scrim.show()), this.animateCellOpen(), this.capture();
    },
    animateClose: function() {
        ToasterPopup.count > 0 && ToasterPopup.count--, this.release(), this.calledClose = !0, 
        this.animateCellClose();
    },
    calledClose: !1,
    checkForHide: function() {
        if (this.calledClose) {
            switch (this.align) {
              case "left":
              case "top":
                this.value == this.min && (this.showing = !1, this.syncDisplayToShowing(), this.isOpen = !1, 
                this.doHide());
                break;

              case "right":
              case "bottom":
                this.value == this.max && (this.showing = !1, this.syncDisplayToShowing(), this.isOpen = !1, 
                this.doHide());
            }
            this.calledClose = !1;
        }
    },
    captured: !1,
    capture: function() {
        this.captured === !1 && this.captureEvents && (enyo.dispatcher.capture(this, this.eventsToCapture), 
        this.captured = !0);
    },
    release: function() {
        this.captured !== !1 && (enyo.dispatcher.release(this), this.captured = !1);
    },
    capturedDown: function(t, e) {
        return this.downEvent = e, this.modal && !this.allowDefault && e.preventDefault(), 
        this.modal;
    },
    capturedTap: function(t, e) {
        return this.autoDismiss && !e.dispatchTarget.isDescendantOf(this) && this.downEvent && !this.downEvent.dispatchTarget.isDescendantOf(this) && (this.downEvent = null, 
        this.hideScrim(), this.animateClose()), this.modal;
    },
    dragstart: function(t, e) {
        var i = e.dispatchTarget === this || e.dispatchTarget.isDescendantOf(this);
        return t.autoDismiss && !i && (this.hideScrim(), t.animateClose()), !0;
    },
    keydown: function(t, e) {
        this.autoDismiss && 27 == e.keyCode && (this.hideScrim(), this.animateClose());
    },
    hideScrim: function() {
        this.$.scrim && this.$.scrim.hide();
    },
    scrimTap: function() {
        this.autoDismiss && (this.hideScrim(), this.animateClose());
    }
});

// source\controls\menus\blogmenu.js
enyo.kind({
    tag: null,
    name: "BlogMenu2",
    published: {
        blog_name: "",
        followed: null
    },
    events: {
        onRequestDeleteFavorite: "",
        onRequestExploreBlog: "",
        onRequestSaveFavorites: "",
        onRequestLink: "",
        onRequestEmail: ""
    },
    components: [ {
        kind: "ToasterPopup",
        onHide: "setIsOpen",
        name: "blogOptions",
        style: "height:175px;width:200px;",
        align: "right",
        classes: "popup-backer reblog-back-shadow",
        components: [ {
            style: "height:65px;text-align: center;margin-bottom:5px;",
            classes: "",
            components: [ {
                kind: "onyx.TextIconButton",
                src: "assets/additemicon.png",
                ontap: "checkMenuItem",
                style: "margin-right:5px;",
                label: "Add To"
            }, {
                kind: "onyx.TextIconButton",
                src: "assets/removeitemicon.png",
                ontap: "checkMenuItem",
                style: "margin-right:5px;",
                label: "Remove From"
            }, {
                kind: "onyx.TextIconButton",
                src: "assets/followicon.png",
                ontap: "checkMenuItem",
                style: "",
                label: "Follow",
                name: "followButton"
            }, {
                kind: "onyx.TextIconButton",
                src: "assets/unfollowicon.png",
                ontap: "checkMenuItem",
                style: "",
                label: "Unfollow",
                showing: !1,
                name: "unfollowButton"
            } ]
        }, {
            style: "height:65px;text-align: center;padding-top:3px;",
            classes: "",
            components: [ {
                kind: "onyx.TextIconButton",
                src: "assets/browsericon.png",
                ontap: "checkMenuItem",
                style: "margin-right:5px;",
                label: "Browser"
            }, {
                kind: "onyx.TextIconButton",
                src: "assets/shareicon.png",
                ontap: "checkMenuItem",
                style: "margin-right:5px;",
                label: "Share"
            }, {
                kind: "onyx.TextIconButton",
                src: "assets/explorecaticon.png",
                ontap: "checkMenuItem",
                style: "",
                label: "Explore"
            } ]
        }, {
            name: "blogName",
            style: "width:100%;text-align:center;margin-top:5px;font-weight:bold;"
        } ]
    }, {
        kind: "CatPicker",
        align: "right",
        name: "catPicker",
        onAccept: "addRemoveItem",
        onCancel: "catPickerCancel"
    } ],
    openCords: {},
    isOpen: !1,
    catPickerCancel: function() {
        this.$.catPicker.hide();
    },
    addUser: function(t, e) {
        APPLICATION.favorites.addFavoriteToCategory(t, e, !1), TUMBLR.bannerMessageCallback(LIMIT_TEXT_LENGTH(t, 100) + " added to " + LIMIT_TEXT_LENGTH(e, 100) + "!");
    },
    removeUser: function(t, e) {
        APPLICATION.favorites.deleteFavorite(t, e, !1), TUMBLR.bannerMessageCallback(LIMIT_TEXT_LENGTH(t, 100) + " removed from " + LIMIT_TEXT_LENGTH(APPLICATION.favoriteCategories[e], 100) + ".");
    },
    addRemoveItem: function(t, e) {
        this.catPickerCancel();
        var i = this.$.catPicker.getParams();
        i.add === !0 ? this.addUser(this.blog_name, e.category) : this.removeUser(this.blog_name, e.index);
    },
    openAt: function(t) {
        this.openCords = t, this.isOpen = !0, this.followed === !0 ? (this.$.followButton.hide(), 
        this.$.unfollowButton.show()) : (this.$.followButton.show(), this.$.unfollowButton.hide()), 
        WND_HEIGHT() - t.top > 195 ? this.$.blogOptions.setTop(t.top) : this.$.blogOptions.setTop(WND_HEIGHT() - 195), 
        this.$.blogOptions.show(), this.$.blogName.setContent(LIMIT_TEXT_LENGTH(this.blog_name, 300));
    },
    closeMenu: function() {
        this.$.blogOptions.hide(), this.setIsOpen();
    },
    origWidth: 0,
    origHeight: 0,
    resizeHandler: function() {
        this.inherited(arguments), (WND_HEIGHT() != this.origHeight || WND_WIDTH() != this.origWidth) && (this.origWidth = WND_WIDTH(), 
        this.origHeight = WND_HEIGHT(), this.closeMenu());
    },
    setIsOpen: function() {
        this.isOpen = !1;
    },
    checkMenuItem: function(t) {
        var e = t.getLabel();
        switch (this.$.blogOptions.hide(), e) {
          case "Add To":
            this.$.catPicker.setParams({
                blog_name: this.blog_name,
                add: !0,
                content: "Add " + LIMIT_TEXT_LENGTH(this.blog_name, 100) + " to a category",
                buttonContent: "Add"
            }), this.$.catPicker.show();
            break;

          case "Remove From":
            this.$.catPicker.setParams({
                blog_name: this.blog_name,
                add: !1,
                content: "Remove " + LIMIT_TEXT_LENGTH(this.blog_name, 100) + " from a category",
                buttonContent: "Remove"
            }), this.$.catPicker.show();
            break;

          case "Browser":
            this.doRequestLink({
                url: "http://" + this.blog_name + ".tumblr.com"
            });
            break;

          case "Share":
            this.doRequestEmail({
                url: "http://" + this.blog_name + ".tumblr.com"
            });
            break;

          case "Explore":
            this.doRequestExploreBlog({
                blog_name: this.blog_name
            });
            break;

          case "Follow":
            TUMBLR.followBlog(this.blog_name);
            break;

          case "Unfollow":
            TUMBLR.unfollowBlog(this.blog_name);
        }
    }
});

// source\controls\menus\reblogmenu.js
enyo.kind({
    name: "ReblogMenu",
    tag: null,
    published: {
        blog_name: ""
    },
    events: {
        onRequestEmail: ""
    },
    components: [ {
        kind: "ToasterPopup",
        onHide: "setIsOpen",
        name: "reblogOptions",
        style: "height:155px;width:200px;",
        align: "right",
        classes: "popup-backer reblog-back-shadow",
        components: [ {
            style: "height:65px;text-align: center;margin-bottom:5px;",
            classes: "",
            components: [ {
                kind: "onyx.TextIconButton",
                src: "assets/reblogicon.png",
                ontap: "requestReblog",
                style: "margin-right:5px;",
                label: "Reblog"
            }, {
                kind: "onyx.TextIconButton",
                src: "assets/queueicon.png",
                ontap: "requestReblog",
                style: "margin-right:5px;",
                label: "Queue"
            }, {
                kind: "onyx.TextIconButton",
                src: "assets/drafticon.png",
                ontap: "requestReblog",
                style: "",
                label: "Draft"
            } ]
        }, {
            style: "height:65px;text-align: center;padding-top:3px;",
            classes: "",
            components: [ {
                kind: "onyx.TextIconButton",
                src: "assets/commenticon.png",
                ontap: "requestReblog",
                style: "margin-right:5px;font-size:8pt;",
                label: "Comment"
            }, {
                kind: "onyx.TextIconButton",
                src: "assets/shareicon.png",
                ontap: "requestReblog",
                style: "",
                label: "Share"
            } ]
        } ]
    }, {
        kind: "ToasterPopup",
        onHide: "setIsOpen",
        name: "whichBlog",
        style: "height:165px;width:250px;",
        align: "right",
        classes: "popup-backer reblog-back-shadow",
        components: [ {
            content: "Which blog?",
            name: "whichBlogMsg"
        }, {
            classes: "smallText",
            content: "(Tap to change blogs)"
        }, {
            kind: "onyx.PickerDecorator",
            style: "display: inline-block;",
            onChange: "pickerChanged",
            components: [ {
                style: "min-width:240px;display: inline-block;",
                name: "pickerButton"
            }, {
                kind: "onyx.Picker",
                name: "blogPicker",
                components: []
            } ]
        }, {
            kind: "onyx.TextIconButton",
            name: "whichBlogButton",
            src: "assets/nexticon.png",
            ontap: "selectBlog",
            style: "float:right;margin-top:5px;",
            label: "Next"
        } ]
    }, {
        kind: "ToasterPopup",
        onHide: "setIsOpen",
        classes: "popup-backer reblog-back-shadow",
        style: "height:155px;width:200px;",
        name: "reblogCommmentPop",
        align: "right",
        anchor: !0,
        modal: !0,
        components: [ {
            content: "Enter a comment:",
            style: "margin-bottom:3px;"
        }, {
            kind: "Custom.InputDecorator",
            style: "",
            alwaysLookFocused: !0,
            components: [ {
                kind: "onyx.Input",
                name: "reblogComment",
                placeholder: "comment...",
                value: "",
                style: "width:170px;",
                type: "text"
            } ]
        }, {
            style: "height:10px;"
        }, {
            kind: "onyx.TextIconButton",
            src: "assets/nexticon.png",
            name: "commentButton",
            ontap: "reblogWithComment",
            style: "float:right;",
            label: "Next"
        } ]
    }, {
        kind: "ToasterPopup",
        onHide: "setIsOpen",
        classes: "popup-backer reblog-back-shadow",
        style: "height:200px;width:200px;",
        name: "addTagsPop",
        modal: !0,
        align: "right",
        components: [ {
            content: "Enter a tag and press the " + (enyo.dom.canUseEnter() ? "enter key" : "comma (,)") + " to add:",
            style: "margin-bottom:3px;"
        }, {
            kind: "enyo.TagInput",
            name: "addTags",
            style: "width:100%;max-height:70px;"
        }, {
            kind: "onyx.TextIconButton",
            src: "assets/nexticon.png",
            ontap: "reblogWithTags",
            style: "position:absolute;bottom:5px;right:5px;",
            label: "Reblog"
        } ]
    } ],
    isOpen: !1,
    postType: "photo",
    openAt: function() {
        this.isOpen = !0, this.$.reblogOptions.setTop(WND_HEIGHT() - 200), this.$.reblogOptions.show();
    },
    isPopOpen: function() {
        return this.$.reblogOptions.isOpen === !0 || this.$.whichBlog.isOpen === !0 || this.$.reblogCommmentPop.isOpen === !0 || this.$.addTagsPop.isOpen === !0 ? !0 : !1;
    },
    requestReblog: function(t) {
        switch (this.$.reblogOptions.hide(), t.getLabel()) {
          case "Share":
            this.doRequestEmail();
            break;

          default:
            this.reblogMethod = enyo.uncap(t.getLabel());
            var e = TUMBLR.userObject.blogs;
            e.length > 1 ? (this.setupBlogs(), this.$.whichBlog.setTop(WND_HEIGHT() - 200), 
            this.$.whichBlog.show(), this.isOpen = !0, APPLICATION.tumblrAddTags === !1 && "comment" != this.reblogMethod ? this.$.whichBlogButton.setLabel("Reblog") : this.$.whichBlogButton.setLabel("Next")) : (this.reblogName = e[0].name, 
            "comment" == this.reblogMethod ? this.openCommentPop() : APPLICATION.tumblrAddTags === !0 ? this.openTagPop() : this.reblogPost());
        }
    },
    reblogWithComment: function() {
        this.reblogComment = this.$.reblogComment.getValue(), this.$.reblogCommmentPop.hide(), 
        enyo.dom.hideKeyboard(this.$.reblogComment, this.$.reblogCommmentPop), APPLICATION.tumblrAddTags === !0 ? this.openTagPop() : this.reblogPost();
    },
    getProperItems: function() {
        return 0 === APPLICATION.postMode ? APPLICATION.downloadedItems : APPLICATION.blogExploreItems;
    },
    openCommentPop: function() {
        this.$.reblogCommmentPop.setTop(WND_HEIGHT() - 165), this.$.reblogCommmentPop.show(), 
        this.isOpen = !0, this.$.reblogComment.setValue(""), APPLICATION.tumblrAddTags === !1 ? this.$.commentButton.setLabel("Reblog") : this.$.commentButton.setLabel("Next"), 
        enyo.dom.showKeyboard(this.$.reblogComment, this.$.reblogCommmentPop);
    },
    openTagPop: function() {
        var t = this.getProperItems();
        this.$.addTagsPop.applyStyle("width", WND_WIDTH() + "px"), this.$.addTagsPop.setTop(WND_HEIGHT() - 210), 
        this.$.addTagsPop.show(), this.isOpen = !0, APPLICATION.tumblrUseTags === !0 ? this.$.addTags.setSelectedItems(t[APPLICATION.actualIndex].post.tags) : this.$.addTags.clear(), 
        enyo.dom.showKeyboard(this.$.addTags, this.$.addTagsPop);
    },
    selectBlog: function() {
        this.$.whichBlog.hide(), this.reblogName = this.$.blogPicker.getSelected().content, 
        "comment" == this.reblogMethod ? this.openCommentPop() : APPLICATION.tumblrAddTags === !0 ? this.openTagPop() : this.reblogPost();
    },
    reblogWithTags: function() {
        this.reblogTags = this.$.addTags.getSelected(), this.$.addTagsPop.hide(), enyo.dom.hideKeyboard(this.$.addTags, this.$.addTagsPop), 
        this.reblogPost();
    },
    reblogInfo: {
        actualIndex: 0,
        reblogMethod: "reblog",
        blogName: ""
    },
    reblogPost: function() {
        this.reblogInfo.blogName = this.reblogName, this.reblogInfo.reblogMethod = this.reblogMethod, 
        "comment" == this.reblogMethod ? this.reblogInfo.reblogMethod = "reblog" : this.reblogComment = "", 
        this.reblogInfo.actualIndex = APPLICATION.actualIndex;
        var t = this.getProperItems();
        APPLICATION.tumblrAddTags === !1 && APPLICATION.tumblrUseTags === !0 && (this.reblogTags = t[APPLICATION.actualIndex].post.tags);
        var e = "";
        "reblog" == this.reblogMethod ? e = "Rebloging..." : "queue" == this.reblogMethod ? e = "Sending to Queue..." : "draft" == this.reblogMethod && (e = "Creating Draft..."), 
        enyo.Signals.send("onRequestLoadingBanner", {
            msg: e,
            icon: {
                blog_name: this.reblogInfo.blogName
            }
        });
        var i = t[this.reblogInfo.actualIndex].post.reblog_key, n = t[this.reblogInfo.actualIndex].post.id, o = t[this.reblogInfo.actualIndex].post.type, s = this.reblogTags, a = this.reblogComment;
        TUMBLR.reblogPost(this.reblogInfo, n, i, o, s, a), this.reblogInfo = {
            actualIndex: 0,
            reblogMethod: "reblog",
            blogName: ""
        };
    },
    setupBlogs: function() {
        var t = TUMBLR.userObject.blogs, e = [];
        this.$.blogPicker.destroyClientControls();
        for (var i = 0; t.length > i; i++) e.push({
            content: t[i].name,
            style: "background: url(" + TUMBLR.getAvatar(t[i].name, 30) + ") left center no-repeat; background-size:  32px 32px;"
        });
        for (var n = this.$.blogPicker.createComponents(e), o = void 0, s = 0; n.length > s; s++) if (n[s].content == TUMBLR.PRIMARY_BLOG_NAME) {
            o = n[s];
            break;
        }
        this.$.blogPicker.render(), o && (this.$.blogPicker.setSelected(o), this.$.pickerButton.addStyles("background-image:url(" + TUMBLR.getAvatar(o.content, 30) + ");background-position: left center;background-repeat: no-repeat; background-size:  32px 32px;"));
    },
    pickerChanged: function() {
        this.$.pickerButton.addStyles("background-image:url(" + TUMBLR.getAvatar(this.$.blogPicker.getSelected().content, 30) + ");background-position: left center;background-repeat: no-repeat; background-size:  32px 32px;");
    },
    setIsOpen: function() {
        this.isOpen = !1;
    },
    closeMenu: function() {
        this.setIsOpen(), this.$.reblogOptions.hide(), this.$.whichBlog.hide(), this.$.reblogCommmentPop.hide(), 
        this.$.addTagsPop.hide();
    },
    origWidth: 0,
    origHeight: 0,
    resizeHandler: function() {
        this.inherited(arguments), (WND_HEIGHT() != this.origHeight || WND_WIDTH() != this.origWidth) && (this.origWidth = WND_WIDTH(), 
        this.origHeight = WND_HEIGHT(), this.$.addTagsPop.setTop(WND_HEIGHT() - 210), this.$.reblogCommmentPop.setTop(WND_HEIGHT() - 165));
    }
});

// source\controls\menus\tagmenu.js
enyo.kind({
    tag: null,
    name: "TagMenu",
    published: {
        blog_name: ""
    },
    events: {
        onRequestDeleteFavorite: "",
        onRequestExploreBlog: "",
        onRequestSaveFavorites: "",
        onRequestLink: "",
        onRequestEmail: ""
    },
    components: [ {
        kind: "ToasterPopup",
        onHide: "setIsOpen",
        name: "blogOptions",
        style: "height:175px;width:200px;",
        align: "right",
        classes: "popup-backer reblog-back-shadow",
        components: [ {
            style: "height:65px;text-align: center;margin-bottom:5px;",
            classes: "",
            components: [ {
                kind: "onyx.TextIconButton",
                src: "assets/additemicon.png",
                ontap: "checkMenuItem",
                style: "margin-right:5px;",
                label: "Add To"
            }, {
                kind: "onyx.TextIconButton",
                src: "assets/removeitemicon.png",
                ontap: "checkMenuItem",
                style: "margin-right:5px;",
                label: "Remove From"
            } ]
        }, {
            style: "height:65px;text-align: center;padding-top:3px;",
            classes: "",
            components: [ {
                kind: "onyx.TextIconButton",
                src: "assets/browsericon.png",
                ontap: "checkMenuItem",
                style: "margin-right:5px;",
                label: "Browser"
            }, {
                kind: "onyx.TextIconButton",
                src: "assets/shareicon.png",
                ontap: "checkMenuItem",
                style: "margin-right:5px;",
                label: "Share"
            }, {
                kind: "onyx.TextIconButton",
                src: "assets/explorecaticon.png",
                ontap: "checkMenuItem",
                style: "",
                label: "Explore"
            } ]
        }, {
            name: "blogName",
            style: "width:100%;text-align:center;margin-top:5px;font-weight:bold;"
        } ]
    }, {
        kind: "CatPicker",
        align: "right",
        name: "catPicker",
        onAccept: "addRemoveItem",
        onCancel: "catPickerCancel"
    } ],
    openCords: {},
    isOpen: !1,
    catPickerCancel: function() {
        this.$.catPicker.hide();
    },
    addUser: function(t, e) {
        APPLICATION.favorites.addFavoriteToCategory(t, e, !0), TUMBLR.bannerMessageCallback(LIMIT_TEXT_LENGTH(t, 100) + " added to " + LIMIT_TEXT_LENGTH(e, 100) + "!");
    },
    removeUser: function(t, e) {
        APPLICATION.favorites.deleteFavorite(t, e, !0), TUMBLR.bannerMessageCallback(LIMIT_TEXT_LENGTH(t, 100) + " removed from " + LIMIT_TEXT_LENGTH(APPLICATION.favoriteCategories[e], 100) + ".");
    },
    addRemoveItem: function(t, e) {
        this.catPickerCancel();
        var i = this.$.catPicker.getParams();
        i.add === !0 ? this.addUser(this.blog_name, e.category) : this.removeUser(this.blog_name, e.index);
    },
    openAt: function(t) {
        this.openCords = t, this.isOpen = !0, WND_HEIGHT() - t.top > 195 ? this.$.blogOptions.setTop(t.top) : this.$.blogOptions.setTop(WND_HEIGHT() - 195), 
        this.$.blogOptions.show(), this.$.blogName.setContent(LIMIT_TEXT_LENGTH("#" + this.blog_name, 300));
    },
    closeMenu: function() {
        this.$.blogOptions.hide(), this.setIsOpen();
    },
    origWidth: 0,
    origHeight: 0,
    resizeHandler: function() {
        this.inherited(arguments), (WND_HEIGHT() != this.origHeight || WND_WIDTH() != this.origWidth) && (this.origWidth = WND_WIDTH(), 
        this.origHeight = WND_HEIGHT(), this.closeMenu());
    },
    setIsOpen: function() {
        this.isOpen = !1;
    },
    checkMenuItem: function(t) {
        var e = t.getLabel();
        switch (this.$.blogOptions.hide(), e) {
          case "Add To":
            this.$.catPicker.setParams({
                blog_name: this.blog_name,
                add: !0,
                content: "Add #" + LIMIT_TEXT_LENGTH(this.blog_name, 100) + " to a category",
                buttonContent: "Add"
            }), this.$.catPicker.show();
            break;

          case "Remove From":
            this.$.catPicker.setParams({
                blog_name: this.blog_name,
                add: !1,
                content: "Remove #" + LIMIT_TEXT_LENGTH(this.blog_name, 100) + " from a category",
                buttonContent: "Remove"
            }), this.$.catPicker.show();
            break;

          case "Browser":
            this.doRequestLink({
                url: "http://www.tumblr.com/tagged/" + this.blog_name.replace(/ /gi, "+")
            });
            break;

          case "Share":
            this.doRequestEmail({
                url: "http://www.tumblr.com/tagged/" + this.blog_name.replace(/ /gi, "+")
            });
            break;

          case "Explore":
            this.doRequestExploreBlog({
                blog_name: this.blog_name,
                tagMode: !0
            });
        }
    }
});

// source\controls\menus\catpicker.js
enyo.kind({
    kind: "ToasterPopup",
    name: "CatPicker",
    classes: "popup-backer reblog-back-shadow",
    floating: !1,
    autoDismiss: !0,
    align: "right",
    anchor: !0,
    modal: !0,
    scrim: !0,
    style: "width:250px;height:210px;",
    events: {
        onAccept: "",
        onCancel: ""
    },
    components: [ {
        kind: "android.Scroller",
        touchOverscroll: !1,
        name: "scroller",
        style: "width:100%;",
        horizontal: "hidden",
        components: [ {
            kind: "FittableRows",
            name: "fitRow",
            style: "width:100%;height:100%;min-height:185px;",
            components: [ {
                kind: "android.Scroller",
                name: "catScroller",
                fit: !0,
                touchOverscroll: !1,
                thumb: !1,
                classes: "scroller",
                style: "width:100%;min-height:120px;",
                vertical: "hidden",
                components: []
            }, {
                style: "border-top: 3px solid #333000;height:65px;padding-top:5px;",
                components: [ {
                    kind: "onyx.TextIconButton",
                    src: "",
                    label: "Move",
                    style: "float:right;",
                    ontap: "acceptClick",
                    name: "confirmButton"
                }, {
                    kind: "onyx.TextIconButton",
                    src: "assets/cancelicon.png",
                    label: "Cancel",
                    ontap: "cancelClick",
                    style: "float:left;"
                }, {
                    content: "Select a category",
                    style: "text-align:center;display:inline-block;padding-left:5px;padding-right:5px;font-size:90%;font-weight:bold;width:100px;",
                    name: "msgContent"
                } ]
            } ]
        } ]
    } ],
    selectedIndex: 0,
    create: function() {
        this.inherited(arguments), this.setTop(WND_HEIGHT() - 230);
    },
    acceptClick: function() {
        for (var t = this.currentList[this.selectedIndex].cat, e = -1, i = 0; APPLICATION.favoriteCategories.length > i; i++) if (APPLICATION.favoriteCategories[i] == t) {
            e = i;
            break;
        }
        this.doAccept({
            category: t,
            index: e
        });
    },
    cancelClick: function() {
        this.doCancel();
    },
    resizeHandler: function() {
        this.inherited(arguments);
    },
    setParams: function(t) {
        this.favParams = t;
    },
    getParams: function() {
        return this.favParams;
    },
    showingChanged: function() {
        this.showing && this.createList(), this.inherited(arguments);
    },
    selectItem: function(t) {
        for (var e = 0; this.currentList.length > e; e++) t.name != "contain_" + this.currentList[e].cat ? (this.$["contain_" + this.currentList[e].cat].removeClass("view-mode-active"), 
        this.$["contain_" + this.currentList[e].cat].addClass("view-mode-not")) : this.selectedIndex = e;
        t.removeClass("view-mode-not"), t.addClass("view-mode-active");
    },
    loadAddToCats: function() {
        var t, e, i, n = !1, o = [], s = [], a = [];
        for (t = 0; APPLICATION.favoriteBlogs.length > t; t++) if (APPLICATION.favoriteBlogs[t].blog_name.toLowerCase() == this.favParams.blog_name.toLowerCase() && !APPLICATION.favoriteBlogs[t].doNotDisplay) {
            n = !0, a = APPLICATION.favoriteBlogs[t].category;
            break;
        }
        for (t = 0; APPLICATION.favoriteCategories.length > t; t++) if (n = !1, "__TEMP" != APPLICATION.favoriteCategories[t]) {
            for (e = 0; a.length > e; e++) if (a[e].toLowerCase() == APPLICATION.favoriteCategories[t].toLowerCase()) {
                n = !0;
                break;
            }
            if (n === !1) {
                for (s = [], i = 0; APPLICATION.favoriteBlogs.length > i; i++) for (e = 0; APPLICATION.favoriteBlogs[i].category.length > e; e++) APPLICATION.favoriteBlogs[i].category[e].toLowerCase() == APPLICATION.favoriteCategories[t].toLowerCase() && (APPLICATION.favoriteBlogs[i].tagMode === !0 ? s.push("assets/tagicon" + (enyo.irand(12) + 1) + ".png") : s.push(TUMBLR.getAvatar(APPLICATION.favoriteBlogs[i].blog_name, 30)));
                o.push({
                    cat: APPLICATION.favoriteCategories[t],
                    srcs: s
                });
            }
        }
        return o;
    },
    loadRemoveFromCats: function() {
        var t = !1, e = [], i = [], n = [], o = 0;
        for (o = 0; APPLICATION.favoriteBlogs.length > o; o++) if (APPLICATION.favoriteBlogs[o].blog_name.toLowerCase() == this.favParams.blog_name.toLowerCase() && !APPLICATION.favoriteBlogs[o].doNotDisplay) {
            t = !0, i = APPLICATION.favoriteBlogs[o].category;
            break;
        }
        if (t === !0) for (var s = 0; i.length > s; s++) {
            for (n = [], o = 0; APPLICATION.favoriteBlogs.length > o; o++) for (var a = 0; APPLICATION.favoriteBlogs[o].category.length > a; a++) APPLICATION.favoriteBlogs[o].category[a].toLowerCase() == i[s].toLowerCase() && (APPLICATION.favoriteBlogs[o].tagMode === !0 ? n.push("assets/tagicon" + (enyo.irand(12) + 1) + ".png") : n.push(TUMBLR.getAvatar(APPLICATION.favoriteBlogs[o].blog_name, 30)));
            e.push({
                cat: i[s],
                srcs: n
            });
        }
        return e;
    },
    loadAllItems: function(t) {
        for (var e = [], i = APPLICATION.favoriteCategories, n = [], o = 0, s = 0; i.length > s; s++) if (n = [], 
        !t || APPLICATION.favoritesCategory != i[s]) {
            for (o = 0; APPLICATION.favoriteBlogs.length > o; o++) for (var a = 0; APPLICATION.favoriteBlogs[o].category.length > a; a++) APPLICATION.favoriteBlogs[o].category[a].toLowerCase() == i[s].toLowerCase() && (APPLICATION.favoriteBlogs[o].tagMode === !0 ? n.push("assets/tagicon" + (enyo.irand(12) + 1) + ".png") : n.push(TUMBLR.getAvatar(APPLICATION.favoriteBlogs[o].blog_name, 30)));
            e.push({
                cat: i[s],
                srcs: n
            });
        }
        return e;
    },
    createList: function() {
        this.$.catScroller.destroyClientControls(), this.favParams.content && this.$.msgContent.setContent(this.favParams.content), 
        this.favParams.buttonContent && this.$.confirmButton.setLabel(this.favParams.buttonContent);
        var t = {};
        this.favParams.all === !0 ? (t = this.loadAllItems(this.favParams.not_current), 
        this.$.confirmButton.setSrc("assets/goicon.png")) : this.favParams.add === !0 ? (t = this.loadAddToCats(), 
        this.$.confirmButton.setSrc("assets/additemicon.png")) : (t = this.loadRemoveFromCats(), 
        this.$.confirmButton.setSrc("assets/removeitemicon.png"));
        for (var e = [], i = 0; t.length > i; i++) if ("__TEMP" != t[i].cat) {
            var n = {
                kind: "FittableRows",
                style: "width:100px;height:100px;text-align:center;margin:5px;",
                classes: "horizontal-slide view-mode-not",
                name: "contain_" + t[i].cat,
                ontap: "selectItem",
                components: [ {
                    name: "icon_" + t[i].cat,
                    kind: "ImageStacker",
                    boxSize: {
                        height: 50,
                        width: 70
                    }
                }, {
                    name: "cat_" + t[i].cat,
                    style: "font-size:78%;font-weight:bold;margin-top:15px;"
                }, {
                    name: "count_" + t[i].cat,
                    style: "font-size:70%;"
                } ]
            };
            e.push(n), 1 == e.length && (this.selectedIndex = i);
        }
        this.$.catScroller.createComponents(e, {
            owner: this
        }), this.$.catScroller.render(), this.currentList = t;
        for (var o = 0; t.length > o; o++) "__TEMP" != t[o].cat && (this.$["icon_" + t[o].cat].setSrcUrls(t[o].srcs), 
        this.$["cat_" + t[o].cat].setContent(LIMIT_TEXT_LENGTH(t[o].cat, 85)), this.$["count_" + t[o].cat].setContent("" + t[o].srcs.length + " items"));
        this.$["contain_" + this.currentList[this.selectedIndex].cat].removeClass("view-mode-not"), 
        this.$["contain_" + this.currentList[this.selectedIndex].cat].addClass("view-mode-active"), 
        this.$.fitRow.reflow();
    }
});

// source\controls\menus\historymenu.js
enyo.kind({
    name: "HistoryMenu",
    tag: null,
    components: [ {
        kind: "ToasterPopup",
        onHide: "setIsOpen",
        name: "history",
        style: "height:250px;width:220px;",
        align: "right",
        classes: "popup-backer reblog-back-shadow",
        components: [ {
            kind: "FittableRows",
            components: [ {
                content: "History",
                style: "width:100%;text-align:center;color:white;font-weight:bold;"
            }, {
                kind: "android.List",
                classes: "",
                name: "historyList",
                touchOverscroll: !1,
                multiSelect: !1,
                reorderable: !1,
                enableSwipe: !1,
                centerReorderContainer: !1,
                persistSwipeableItem: !0,
                onSetupItem: "setupHistoryItem",
                style: "height:215px;border:2px ridge #333000;",
                components: [ {
                    name: "listItem",
                    classes: "cat-list-item",
                    style: "height:65px;clear:both;",
                    ontap: "changeMode",
                    components: [ {
                        name: "iconCat",
                        kind: "ImageStacker",
                        boxSize: {
                            height: 50,
                            width: 60
                        },
                        style: "float:left;height:60px;"
                    }, {
                        name: "icon",
                        style: "width:40px;height:40px;float: left;",
                        kind: "Image",
                        classes: "no-limits"
                    }, {
                        name: "historyName",
                        classes: "cat-list-item-count break-word-white-space",
                        style: "float:right;height:50px;width:90px;",
                        allowHtml: !0
                    } ]
                } ]
            } ]
        } ]
    } ],
    isOpen: !1,
    openAt: function() {
        this.isOpen = !0, this.$.history.setTop(WND_HEIGHT() - 260), this.$.history.show(), 
        this.$.historyList.setCount(APPLICATION.exploreItems.length + 1), this.$.historyList.reset();
    },
    changeMode: function(t, e) {
        var i = e.index;
        enyo.Signals.send("onChangeViewMode", {
            index: i
        }), this.isOpen = !1, this.$.history.hide();
    },
    setIsOpen: function() {
        this.isOpen = !1;
    },
    setupHistoryItem: function(t, e) {
        var i = e.index, n = APPLICATION.exploreItems[i];
        return n ? n.catMode === !0 ? "__TEMP" == n.category ? (this.$.historyName.setContent("Random"), 
        this.$.iconCat.show(), this.$.iconCat.setSrcUrls(APPLICATION.categories.getImageSrcs(n.category)), 
        this.$.icon.hide()) : (this.$.historyName.setContent("Category: " + n.category), 
        this.$.iconCat.show(), this.$.iconCat.setSrcUrls(APPLICATION.categories.getImageSrcs(n.category)), 
        this.$.icon.hide()) : n.tagMode === !0 ? (this.$.historyName.setContent("Tag: " + n.blog_name), 
        this.$.iconCat.hide(), this.$.icon.show(), this.$.icon.setSrc("assets/tagicon" + (enyo.irand(12) + 1) + ".png")) : n.catMode === !1 && n.tagMode === !1 && (this.$.historyName.setContent("Blog: " + n.blog_name), 
        this.$.iconCat.hide(), this.$.icon.show(), this.$.icon.setSrc(TUMBLR.getAvatar(n.blog_name))) : (this.$.historyName.setContent("Dashboard"), 
        this.$.iconCat.hide(), this.$.icon.show(), this.$.icon.setSrc("assets/dashboardicon.png")), 
        !0;
    }
});

// source\controls\expandableradiogroup\expandableradiogroup.js
enyo.kind({
    name: "expandable.RadioButton",
    kind: "Button",
    classes: "expand-radiobutton"
}), enyo.kind({
    name: "expandable.RadioGroup",
    kind: "Group",
    highlander: !0,
    defaultKind: "expandable.RadioButton",
    published: {
        controlWidth: 142,
        unit: "px"
    },
    create: function() {
        this.inherited(arguments), setTimeout(enyo.bind(this, function() {
            this.flowSize();
        }), 250);
    },
    controlWidthChanged: function() {
        this.flowSize();
    },
    unitChanged: function() {
        this.flowSize();
    },
    flowSize: function() {
        var t = this.getClientControls(), e = 0;
        for (e = 0; t.length > e; e++) t[e].applyStyle("width", this.controlWidth + this.unit), 
        t[e].removeClass("expand-radiobutton-top-left"), t[e].removeClass("expand-radiobutton-top-right"), 
        t[e].removeClass("expand-radiobutton-bottom-left"), t[e].removeClass("expand-radiobutton-bottom-right"), 
        t[e].removeClass("expand-radiobutton-right-border");
        var i = this.getBounds(), n = this.controlWidth;
        if (i.width || (i.width = WND_WIDTH() - 20), i.width) if (n * t.length > i.width) {
            var o = Math.floor(i.width / n), s = Math.ceil(t.length / o), a = 1, r = 1, h = !1;
            for (e = 0; t.length > e; e++) {
                if (h = !1, 1 === r && 1 === a && (t[e].addClass("expand-radiobutton-top-left"), 
                o > 1 && r++, h = 1 == o ? !1 : !0), r == o && (1 == a || e + o >= t.length && e != t.length - 1) && h === !1 && (1 == a && t[e].addClass("expand-radiobutton-top-right"), 
                t[e].addClass("expand-radiobutton-right-border"), e + o >= t.length && t[e].addClass("expand-radiobutton-bottom-right"), 
                a++, r = 1, h = !0), 1 == r && a == s && h === !1 && (t[e].addClass("expand-radiobutton-bottom-left"), 
                o > 1 && r++, h = 1 == o ? !1 : !0), r == o && a == s && h === !1 || e == t.length - 1) {
                    t[e].addClass("expand-radiobutton-bottom-right"), t[e].addClass("expand-radiobutton-right-border");
                    break;
                }
                h === !1 && (r >= o ? (t[e].addClass("expand-radiobutton-right-border"), a++, r = 1) : r++);
            }
        } else t[0].addClass("expand-radiobutton-top-left"), t[0].addClass("expand-radiobutton-bottom-left"), 
        t[t.length - 1].addClass("expand-radiobutton-top-right"), t[t.length - 1].addClass("expand-radiobutton-right-border"), 
        t[t.length - 1].addClass("expand-radiobutton-bottom-right");
    },
    origWidth: 0,
    origHeight: 0,
    resizeHandler: function() {
        this.inherited(arguments), (WND_HEIGHT() != this.origHeight || WND_WIDTH() != this.origWidth) && (this.origWidth = WND_WIDTH(), 
        this.origHeight = WND_HEIGHT(), this.flowSize());
    }
});

// source\controls\tumblritem.js
enyo.kind({
    name: "tumbleItem",
    kind: "SnapScrollerCell",
    published: {
        iIndex: 0,
        usePostType: "text",
        post: {}
    },
    handlers: {
        onApplyResize: "resizeHandler",
        onResetScroller: "scrollScrollerToTop"
    },
    deviceWidth: 320,
    create: function() {
        this.inherited(arguments), this.deviceWidth = WND_WIDTH();
    },
    flowControls: function() {
        1 > this.cellComponents.length && this.buildPost(), this.inherited(arguments), this.forceResizeHandler();
    },
    requestSaveImage: function(t, e) {
        var i = "";
        if (i = e && e.src ? e.src : "", !(0 > i.length)) {
            var n = -1;
            if (this.post.photos) for (var o = 0; this.post.photos.length > o; o++) {
                for (var s = 0; this.post.photos[o].alt_sizes.length > s; s++) if (this.post.photos[o].alt_sizes[s].url == i) {
                    n = o;
                    break;
                }
                if (n > -1) break;
            }
            n > -1 && (i = this.post.photos[n].original_size.url), STORAGE.downloadFile(i, this.post.blog_name + this.post.id);
        }
    },
    likeButtonTap: function() {
        enyo.Signals.send("onRequestLike");
    },
    clearPicture: function() {
        this.$.picturePopup.destroy();
    },
    loadImage: function() {
        this.$.fullPic && this.fullPicSrc && this.$.fullPic.setSrc(this.fullPicSrc);
    },
    requestFullImage: function(t, e) {
        var i = "";
        i = e && e.src ? e.src : t.getSrc();
        var n = -1;
        if (this.post.photos && 0 > i.indexOf(".gif")) for (var o = 0; this.post.photos.length > o; o++) {
            for (var s = 0; this.post.photos[o].alt_sizes.length > s; s++) if (this.post.photos[o].alt_sizes[s].url == i) {
                n = o;
                break;
            }
            if (n > -1) break;
        }
        n > -1 && (i = this.post.photos[n].original_size.url);
        var a = [ {
            kind: "blogWalker.ImageView",
            name: "fullPic",
            scale: "auto",
            style: "height:" + (WND_HEIGHT() - 45) + "px;width:" + (WND_WIDTH() - 45) + "px;"
        }, {
            style: "position: absolute;right:0;bottom:0;",
            components: [ {
                kind: "onyx.IconButton",
                src: "assets/closeicon.png",
                ontap: "clearPicture"
            } ]
        } ], r = {
            kind: "onyx.Popup",
            name: "picturePopup",
            floating: !0,
            centered: !0,
            onShow: "loadImage",
            autoDismiss: !0,
            onHide: "clearPicture",
            classes: "captionBack",
            style: "top:0;left:0;padding:10px 10px 10px 10px;border-radius:10px;margin:0 !important;",
            components: a
        };
        this.createComponent(r, {
            owner: this
        }).render(), this.$.picturePopup.applyStyle("width", WND_WIDTH() - 40 + "px"), this.$.picturePopup.applyStyle("height", WND_HEIGHT() - 40 + "px"), 
        this.fullPicSrc = i, this.$.picturePopup.show();
    },
    handleLinks: function(t, e) {
        return enyo.Signals.send("onHandleLink", {
            url: e.url
        }), !0;
    },
    requestBlogExplore: function(t, e) {
        var i = t.linksrc, n = null;
        return i == this.post.blog_name && (n = this.post.followed), enyo.Signals.send("onRequestBlogMenu", {
            blog_name: i,
            top: e.pageY,
            left: e.pageX,
            followed: n
        }), !0;
    },
    openNotes: function() {
        return this.post.notes && (this.$.notesListBox.show(), this.$.notesList.setCount(this.post.notes.length)), 
        !0;
    },
    playSound: function(t) {
        return enyo.Signals.send("onHandleLink", {
            url: t.soundUrl,
            appStore: !0
        }), !0;
    },
    loadVideo: function(t) {
        return enyo.Signals.send("onHandleLink", {
            url: t.videoUrl,
            appStore: !0
        }), !0;
    },
    sourceLinkClick: function(t, e) {
        return enyo.Signals.send("onRequestBlogMenu", {
            blog_name: t.linksrc,
            top: e.pageY,
            left: e.pageX
        }), !0;
    },
    tagClicked: function(t, e) {
        var i = t.content;
        return "," == i.substr(i.length - 1) && (i = i.substr(0, i.length - 1)), enyo.Signals.send("onRequestBlogMenu", {
            blog_name: i,
            top: e.pageY,
            left: e.pageX,
            tagMode: !0
        }), !0;
    },
    scrollScrollerToTop: function() {
        this.waterfallDown("onScrollToTop");
    },
    removeHeaderHeight: function() {
        var t = this.getClientControls(), e = [], i = 0, n = !1, o = !1;
        if (t.length > 0) do t[i] && t[i].resizeMe === !0 && "-header" == t[i].resize.height && (t[i].applyStyle("height", "5px"), 
        n = !0), t[i] && t[i].resizeMe === !0 && "-footer" == t[i].resize.height && (t[i].applyStyle("height", TUMBLR.footerHeight + 45 + "px"), 
        o = !0), t[i] && (e = t[i].getClientControls(), e.length > 0 && (t = t.concat(e))), 
        i++; while (t.length > i && n === !1 && o === !1);
    },
    forceResizeHandler: function() {
        this.origHeight = 0, this.origWidth = 0, this.resizeHandler();
    },
    flowImages: function() {
        this.inherited(arguments);
    },
    setMin: function() {},
    origWidth: 0,
    origHeight: 0,
    resizeHandler: function() {
        if (WND_HEIGHT() != this.origHeight || WND_WIDTH() != this.origWidth) {
            this.origWidth = WND_WIDTH(), this.origHeight = WND_HEIGHT(), this.deviceWidth = WND_WIDTH(), 
            this.applyStyle("width", this.deviceWidth + "px"), this.applyStyle("height", WND_HEIGHT() - TUMBLR.headerHeight - 60 + "px");
            var t = this.getClientControls(), e = [], i = 0;
            if (t.length > 0) do t[i] && t[i].resizeMe === !0 && this.resizeControl(t[i]), e = t[i].getClientControls(), 
            e.length > 0 && (t = t.concat(e)), i++; while (t.length > i);
            this.setMin();
        }
    },
    resizeControl: function(t) {
        var e = t.resize, i = 0;
        for (var n in e) switch (n) {
          case "width":
          case "max-width":
            t.applyStyle(n, WND_WIDTH() + e[n] + "px");
            break;

          case "height":
            i = "-header" == e[n] ? APPLICATION.TopBarHidden ? 5 : TUMBLR.headerHeight : "-footer" == e[n] ? TUMBLR.footerHeight + 55 : WND_HEIGHT() + e[n], 
            t.applyStyle(n, i + "px");
        }
    },
    setupNotesList: function(t, e) {
        var i = e.index, n = e.item, o = this.post, s = WND_WIDTH() - 60, a = LIMIT_TEXT_LENGTH(o.notes[i].blog_name, s);
        switch (o.notes[i].type) {
          case "like":
            a = a + ' <span class="red-color">' + o.notes[i].type + "d</span>";
            break;

          case "reblog":
            a = a + ' <span class="green-color">' + o.notes[i].type + "ged</span>";
            break;

          case "reply":
            a = a + ' <span class="yellow-color">' + o.notes[i].type, a = a.substr(0, a.length - 1) + "ied:</span>";
            break;

          default:
            a = a + " " + o.notes[i].type;
        }
        o.notes[i].added_text && (a = a + '<p class="smallText">' + o.notes[i].added_text + "</p>"), 
        o.notes[i].reply_text && (a = a + '<p class="smallText">' + o.notes[i].reply_text + "</p>"), 
        n.$.listAvatar.setSrc(TUMBLR.getAvatar(o.notes[i].blog_name, 30)), n.$.listText.setContent(a), 
        this.selectedIndex == i ? (n.applyStyle("background", "#333000"), n.applyStyle("color", "white")) : (n.applyStyle("background", "white"), 
        n.applyStyle("color", "black"));
    },
    selectedIndex: -1,
    noteItemClick: function(t, e) {
        this.selectedIndex = e.index, this.$.notesList.renderRow(e.index), window.setTimeout(enyo.bind(this, function() {
            var t = this.selectedIndex;
            this.selectedIndex = -1, this.$.notesList.renderRow(t);
        }), 500);
        var i = this.post.notes[e.index].blog_name;
        i && enyo.Signals.send("onRequestBlogMenu", {
            blog_name: i,
            top: e.pageY,
            left: e.pageX,
            followed: !1
        });
    },
    buildPost: function() {
        var t = this.post, e = this.iIndex, i = [];
        enyo.Signals.send("onStatusUpdate", {
            msg: "Building post format [" + t.id + "]..."
        });
        var n = function() {
            var t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0", e = Math.floor(Math.random() * t.length);
            return t.substr(e, 1);
        }, o = function(t, e) {
            return n() + t + Math.floor(1e5 * Math.random()) + n() + e + Math.floor(999 * Math.random()) + n() + Math.floor(1e5 * Math.random()) + n();
        }, s = function() {
            return {
                kind: "HtmlContent",
                name: o("itemPoster", e),
                content: "",
                onLinkClick: "handleLinks",
                style: "max-width:" + (WND_WIDTH() - 2) + "px;margin-right:1px;margin-left:1px;word-wrap:break-word;",
                classes: "captionBack break-word-white-space",
                resizeMe: !0,
                resize: {
                    "max-width": 0
                }
            };
        }, a = function() {
            return {
                kind: "HtmlContent",
                name: o("itemTitle", e),
                content: "",
                onLinkClick: "handleLinks",
                classes: "captionBack break-word-white-space",
                style: "font-size: 110%;font-weight: bold;"
            };
        }, r = function() {
            return {
                kind: "BufferedHtmlContent",
                name: o("itemBody", e),
                content: "",
                bufferContent: "",
                allowHtml: !0,
                style: "max-width:" + (WND_WIDTH() - 5) + "px;",
                onLinkClick: "handleLinks",
                classes: "captionBack break-word-white-space",
                resizeMe: !0,
                resize: {
                    "max-width": -5
                }
            };
        }, h = function() {
            return {
                kind: "enyo.Image",
                name: o("itemPhoto", e),
                noEvents: !0,
                src: "",
                ontap: "requestFullImage"
            };
        }, l = function() {
            return {
                kind: "Control",
                style: "width: 100%;",
                classes: "border-top-light border-bottom-dark",
                components: [ {
                    kind: "HtmlContent",
                    name: o("itemChatLeft", e),
                    content: "",
                    allowHtml: !0,
                    onLinkClick: "handleLinks",
                    classes: "break-word-white-space",
                    style: "width: " + (WND_WIDTH() - 75) + "px;",
                    resizeMe: !0,
                    resize: {
                        width: -75
                    }
                } ]
            };
        }, c = function() {
            return {
                kind: "Control",
                style: "width:100%;",
                classes: "border-top-light border-bottom-dark",
                components: [ {
                    kind: "Control",
                    style: "width:50px;display: inline-block;"
                }, {
                    kind: "HtmlContent",
                    name: o("itemChatRight", e),
                    content: "",
                    allowHtml: !0,
                    onLinkClick: "handleLinks",
                    classes: "break-word-white-space",
                    style: "width: " + (WND_WIDTH() - 75) + "px;display: inline-block;",
                    resizeMe: !0,
                    resize: {
                        width: -75
                    }
                } ]
            };
        }, d = function(t) {
            var e = 0, i = 0, n = 0, o = 0, s = "", a = "", r = !1, h = "", l = [], c = [];
            if (t.indexOf("<img") >= 0) do e = t.indexOf("<img"), e >= 0 ? (i = t.indexOf('src="', e), 
            n = t.indexOf('"', i + 6), n > i && (s = t.substr(i + 5, n - i - 5), e > 0 && (a = t.substr(0, e), 
            h += a), l.push(s), c.push("")), o = t.indexOf("/>", n - 2), t = t.substr(o + 2, t.length - (o + 1))) : (h += t, 
            r = !0); while (r === !1);
            return {
                srcs: l,
                caps: c,
                leftover: h
            };
        }, u = function(t) {
            t = t.replace(/<\/blockquote>/gi, ""), t = t.replace(/<blockquote>/gi, ""), t = t.replace(/<div>/gi, ""), 
            t = t.replace(/<\/div>/gi, "");
            var e = 0, i = 0, n = 0, o = 0, s = "", a = !1, r = "";
            if (t.indexOf("<a href") >= 0) {
                do e = t.indexOf("<a "), e >= 0 ? (i = t.indexOf("</a>", e), s = t.substr(e, i - e), 
                s.indexOf("<img") >= 0 ? (r += t.substr(0, e), n = t.indexOf("<img", e), o = t.indexOf("/>", n) + 2, 
                r += t.substr(n, o - n), r = r + t.substr(e, n - e) + "(link attached to image)</a><br />", 
                t = t.substr(i + 4), e = 0) : (r += t.substr(0, i + 4), t = t.substr(i + 4))) : (r += t, 
                a = !0); while (a === !1);
                t = r;
            }
            if (t.indexOf("<iframe") >= 0) {
                r = "", a = !1;
                do e = t.indexOf("<iframe "), e >= 0 ? (i = t.indexOf("</iframe>", e), s = t.substr(e, i - e), 
                s.indexOf("src=") >= 0 ? (r += t.substr(0, e), n = t.indexOf("src=", e) + 4, o = t.indexOf('"', n + 4) + 1, 
                r = r + "<a href=" + t.substr(n, o - n), r += ">(embeded content link)</a><br />", 
                t = t.substr(i + 9), e = 0) : (r += t.substr(0, i + 9), t = t.substr(i + 9))) : (r += t, 
                a = !0); while (a === !1);
                t = r;
            }
            if (t.indexOf("<div") >= 0) {
                r = "", a = !1;
                do e = t.indexOf("<div"), e >= 0 ? (i = t.indexOf(">", e), s = t.substr(e, i - e), 
                r += t.substr(0, i + 9), t = t.substr(i + 9)) : (r += t, a = !0); while (a === !1);
            }
            return t;
        }, g = new r(), p = 0;
        if (g.classes = "break-word-white-space", t.note_count || t.tags || t.source_url) {
            g.useNotesBox = !0, g.classes += " border-top-light", g.style += "font-size:70%;width:100%;";
            var f = new s();
            f.classes = "break-word-white-space", f.style += "text-align: left;display: inline-block;", 
            f.components = [];
            var m = new r();
            m.classes = "break-word-white-space", m.style += "text-align:right;display: inline-block;";
            var y = new s();
            if (y.classes = "break-word-white-space", y.style += "text-align: left;margin-top:6px;", 
            y.components = [], (t.note_count && t.source_url || t.note_count && !t.source_url) && (f.style += "width:68%;", 
            m.style += "width:28%;"), !t.note_count && t.source_url && (f.style = "width:95%;", 
            m.style = "width:1%;"), t.note_count) {
                var v = t.note_count;
                m.bufferContent = v + " Note" + (1 != v ? "s" : ""), t.notes && (m.style += "text-decoration:underline;color:#00BFFF;", 
                m.ontap = "openNotes");
                var b = {
                    name: "notesListBox",
                    showing: !1,
                    components: [ {
                        kind: "Repeater",
                        count: 0,
                        name: "notesList",
                        onSetupItem: "setupNotesList",
                        components: [ {
                            style: "clear:left;min-height:45px;",
                            classes: "border-top-light border-bottom-dark",
                            ontap: "noteItemClick",
                            components: [ {
                                kind: "Image",
                                style: "width:32px;height:32px;margin-right:5px;margin-top:3px;float:left;",
                                name: "listAvatar",
                                classes: "no-limits"
                            }, {
                                name: "listText",
                                allowHtml: !0,
                                style: "font-size:90%;margin-top:8px;color:black;"
                            } ]
                        } ]
                    } ]
                };
            }
            if (t.source_url) {
                var w = t.source_url, x = t.source_title;
                if (w.indexOf("tumblr") >= 0) {
                    var C = new r();
                    C.classes = "break-word-white-space", C.style = "display: inline-block;color: #00BFFF;text-decoration:underline;", 
                    C.resizeMe = !1, C.bufferContent = x && x.length > 0 ? x : w;
                    var I = new r();
                    I.classes = "break-word-white-space", I.style = "display: inline-block;font-weight:bold;margin-right:5px;", 
                    I.resizeMe = !1, I.bufferContent = "Source:", f.components.push(I), f.components.push(C);
                    var P = w.indexOf(".tumblr.com"), S = w.indexOf("//") + 2, T = w.substr(S, P - S);
                    f.linksrc = T, f.ontap = "sourceLinkClick";
                } else f.content = '<b>Source: </b><a href = "' + w + '">' + (x && x.length > 0 ? x : w) + "</a>";
            }
            if (t.tags && t.tags.length > 0) {
                var k = t.tags, A = [];
                for (A.push({
                    style: "display: inline-block;margin-right:4px;font-weight:bold;",
                    content: "Tags:"
                }), p = 0; k.length > p; p++) A.push({
                    style: "display: inline-block;color: #00BFFF;text-decoration:underline;margin-right:4px;",
                    content: k[p] + (p == k.length - 1 ? "" : ","),
                    ontap: "tagClicked"
                });
                y.components = A;
            }
            var R = new s();
            R.classes = "break-word-white-space", R.style += "width:100%;", R.kind = "FittableRows", 
            R.components = [ {
                kind: "FittableColumns",
                style: "width:100%;",
                components: [ f, m ]
            }, y ], t.note_count && R.components.push(b), g.components = [], g.components.push(R);
        } else g.useNotesBox = !1;
        var M = function(t) {
            var e;
            if (4 > enyo.platform.android || enyo.platform.blackberry || enyo.platform.firefoxOS) if (t && t.indexOf("GMT") >= 0) {
                var i = t.indexOf(" "), n = t.substr(0, i).split("-");
                e = new Date(), e.setFullYear(parseInt(n[0], 10)), e.setMonth(parseInt(n[1], 10) - 1), 
                e.setDate(parseInt(n[2], 10));
                var o = t.lastIndexOf(" ");
                n = t.substr(i + 1, o - i - 1).split(":"), e.setHours(parseInt(n[0], 10)), e.setMinutes(parseInt(n[1], 10)), 
                e.setSeconds(parseInt(n[2], 10));
                var s = e.getTimezoneOffset();
                e = DATE_ADD(e, "minutes", -1 * s);
            } else e = new Date(t); else e = new Date(t);
            return e;
        }, O = M(isNaN(t.date) ? t.date : Date.parse(parseInt(t.date, 10))), L = O.relative(), B = new s();
        B.classes = "border-bottom-dark", B.style += "width:100%;font-size:90%;", B.components = [ {
            kind: "FittableColumns",
            noStretch: !0,
            style: "width:100%;",
            components: [ {
                kind: "Image",
                classes: "headerImage no-limits",
                style: "margin-right:15px;",
                ontap: "requestBlogExplore",
                linksrc: t.blog_name,
                src: TUMBLR.getAvatar(t.blog_name, 48)
            }, {
                kind: "FittableRows",
                components: [ {
                    content: LIMIT_TEXT_LENGTH(t.blog_name, WND_WIDTH() - 50),
                    classes: "headerTitle",
                    ontap: "requestBlogExplore",
                    linksrc: t.blog_name
                }, {
                    content: L,
                    classes: "headerDate"
                } ]
            }, {
                kind: "LikeButton",
                style: "position: absolute;right:0px;",
                onchange: "likeButtonTap",
                postId: t.id,
                checked: t.liked ? t.liked : !1
            } ]
        } ];
        var N = new s();
        N.kind = "Control", N.classes = "", N.style = "", N.onLinkClick = void 0, N.components = [];
        var D = "", E = {}, $ = {}, _ = {}, H = "";
        switch (t.type) {
          case "text":
            var F = new s();
            F.components = [], F.components.push(B), D = t.title, D && D.length > 0 && ($ = new a(), 
            $.classes = "break-word-white-space border-bottom-dark", $.content = D, F.components.push($));
            var U = u(t.body);
            if (U.indexOf("<img") >= 0) {
                E = new s(), E.style += "text-align:center;", E.classes = "break-word-white-space", 
                E.components = [];
                var z = d(U), W = {
                    kind: "PhotoDisplay",
                    postid: this.post.id,
                    srcs: z.srcs,
                    classes: "border-bottom-dark",
                    captions: z.caps,
                    onImageClick: "requestFullImage",
                    onImageSave: "requestSaveImage"
                };
                if (E.components.push(W), z.leftover && z.leftover.length > 0) {
                    var V = new r();
                    V.classes = "break-word-white-space border-top-light", V.style += "text-align:left;", 
                    g.useNotesBox && (V.classes += " border-bottom-dark"), V.bufferContent = u(z.leftover), 
                    E.components.push(V);
                }
                F.components.push(E);
            } else E = new r(), U && U.length > 0 && (E.classes = "break-word-white-space", 
            D && D.length > 0 && (E.classes += " border-top-light"), E.bufferContent = U, F.components.push(E));
            g.useNotesBox && (E.classes += " border-bottom-dark", F.components.push(g)), N.components.push(F);
            break;

          case "chat":
            var G = new s();
            G.components = [], G.components.push(B), D = t.title, D && D.length > 0 && ($ = new a(), 
            $.content = D, $.classes = "break-word-white-space border-bottom-dark", G.components.push($));
            var j = t.dialogue;
            if (void 0 !== j && j.length > 0) {
                var q = [], K = 0, Y = {};
                for (p = 0; j.length > p; p++) 0 === K ? p > 0 && j[p - 1].label == j[p].label ? (Y = new c(), 
                Y.components[1].content = "<b>" + j[p].label + "</b><br />" + j[p].phrase, K = 0) : (Y = new l(), 
                Y.components[0].content = "<b>" + j[p].label + "</b><br />" + j[p].phrase, K = 1) : p > 0 && j[p - 1].label == j[p].label ? (Y = new l(), 
                Y.components[0].content = "<b>" + j[p].label + "</b><br />" + j[p].phrase, K = 1) : (Y = new c(), 
                Y.components[1].content = "<b>" + j[p].label + "</b><br />" + j[p].phrase, K = 0), 
                q.push(Y);
                G.components = G.components.concat(q);
            } else U = t.body, U && U.length > 0 && (E = new r(), E.classes = "border-top-light break-word-white-space", 
            g.useNotesBox && (E.classes += "border-bottom-dark"), E.bufferContent = u(t.body), 
            G.components.push(E));
            g.useNotesBox && G.components.push(g), N.components.push(G);
            break;

          case "link":
            var Z = new s();
            Z.components = [], Z.components.push(B);
            var X = t.title;
            X && X.length > 0 && ($ = new a(), $.content = X, $.classes = "break-word-white-space border-bottom-dark", 
            Z.components.push($));
            var J = u(t.description), Q = new s();
            Q.classes = "break-word-white-space border-top-light", Q.content = '<a href="' + t.url + '">' + t.url + "</a>";
            var te = J && J.length > 0;
            te && (Q.classes += " border-bottom-dark"), Z.components.push(Q), te && (E = new r(), 
            E.classes = "break-word-white-space border-top-light", E.bufferContent = J, g.useNotesBox && (E.classes += " border-bottom-dark"), 
            Z.components.push(E)), g.useNotesBox && Z.components.push(g), N.components.push(Z);
            break;

          case "photo":
            var ee = new s();
            ee.style += "text-align:center;", ee.components = [], ee.components.push(B);
            var ie = [], ne = [], oe = 600;
            for (p = 0; t.photos.length > p; p++) {
                var se = 0;
                oe = t.photos[p].original_size.url.indexOf(".gif") >= 0 ? 300 : GET_IMAGE_SIZE();
                for (var ae = 0; t.photos[p].alt_sizes.length > ae; ae++) if (oe >= t.photos[p].alt_sizes[ae].width) {
                    se = ae;
                    break;
                }
                ie.push(t.photos[p].alt_sizes[se].url), H = u(t.photos[p].caption), ne.push(H);
            }
            var re = t.caption ? u(t.caption) : "";
            if (re.indexOf("<img") >= 0) {
                var he = d(re);
                ie = ie.concat(he.srcs), ne = ne.concat(he.caps), he.leftover && he.leftover.length > 0 && (re = he.leftover);
            }
            var le = {
                kind: "PhotoDisplay",
                postid: this.post.id,
                srcs: ie,
                classes: "border-bottom-dark",
                captions: ne,
                onImageClick: "requestFullImage",
                onImageSave: "requestSaveImage"
            };
            ee.components.push(le), re && re.length > 0 && (_ = new r(), _.classes = "break-word-white-space border-top-light", 
            _.style += "text-align:left;", g.useNotesBox && (_.classes += " border-bottom-dark"), 
            _.bufferContent = re, ee.components.push(_)), g.useNotesBox && ee.components.push(g), 
            N.components.push(ee);
            break;

          case "quote":
            var ce = new h();
            ce.style = "width:15px;height:17px;border: none !important;vertical-align:top;", 
            ce.classes = "no-limits", ce.src = "assets/quote1.png";
            var de = new h();
            de.style = "width:15px;height:17px;border: none !important;vertical-align:top;", 
            de.classes = "no-limits", de.src = "assets/quote2.png", _ = new r(), _.bufferContent = u(t.text), 
            _.classes = "break-word-white-space", _.style = "max-width:" + (WND_WIDTH() - 100) + "px;word-wrap:break-word;", 
            _.resizeMe = !0, _.resize = {
                "max-width": -100
            };
            var ue = new s(), ge = t.source && t.source.length > 0;
            ge && (_.classes += " border-bottom-dark"), ue.kind = "FittableColumns", ue.components = [], 
            ue.components.push(B), ue.components.push(ce), ue.components.push(_), ue.components.push(de);
            var pe = new s();
            ge && (pe.classes = "border-top-light", pe.style += "overflow:hidden;width: 100%;", 
            pe.content = "By " + t.source, g.useNotesBox && (pe.classes += " border-bottom-dark"), 
            ue.components.push(pe)), g.useNotesBox && ue.components.push(g), N.components.push(ue);
            break;

          case "video":
            var fe = new s();
            fe.components = [], fe.components.push(B);
            var me = "", ye = !1;
            if (t.player && t.player[0] && t.player[0].embed_code && t.player[0].embed_code.indexOf("youtube") > -1) {
                ye = !0;
                var ve = t.player[0].embed_code.split(" ");
                for (p = 0; ve.length > p; p++) if (ve[p].indexOf("src=") >= 0) {
                    me = ve[p].substr(ve[p].indexOf("src=") + 5), me = me.substr(0, me.length - 1);
                    break;
                }
            } else ye = !1, me = t.post_url;
            var be = new s();
            be.classes = "break-word-white-space border-bottom-dark", be.content = "Video: (Tap image to play)", 
            H = u(t.caption);
            var we = H && H.length > 0, xe = new h();
            xe.kind = "VideoImage", xe.src = t.thumbnail_url ? t.thumbnail_url : "assets/videoerror.png", 
            xe.ontap = "loadVideo", xe.videoUrl = me;
            var Ce = new s();
            if (Ce.classes = "border-top-light" + (we ? " border-bottom-dark" : ""), Ce.style += "text-align:center;", 
            Ce.components = [], Ce.components.push(xe), fe.components.push(be), fe.components.push(Ce), 
            we) {
                var Ie = new r();
                Ie.classes = "break-word-white-space border-top-light", Ie.bufferContent = H, g.useNotesBox && (Ie.classes += " border-bottom-dark"), 
                fe.components.push(Ie);
            }
            g.useNotesBox && fe.components.push(g), N.components.push(fe);
            break;

          case "answer":
            var Pe = new s();
            Pe.components = [], Pe.components.push(B);
            var Se = new l(), Te = t.asking_name == t.blog_name ? "Anonymous" : t.asking_name;
            Se.classes = "border-bottom-dark", Se.components[0].components = [], Se.components[0].components.push(new s()), 
            Se.components[0].components[0].classes = "break-word-white-space no-limits", Se.components[0].components[0].style = "float:left;margin-right:5px;width:32px;height:32px;", 
            Se.components[0].components[0].kind = "Image", Se.components[0].components.push(new s()), 
            Se.components[0].components[1].classes = "break-word-white-space", Se.components[0].components[1].kind = "Control", 
            Se.components[0].components[1].content = Te + " asks:", "Anonymous" != Te ? (Se.components[0].components[0].src = "http://api.tumblr.com/v2/blog/" + Te + ".tumblr.com/avatar", 
            Se.components[0].components[1].style = "float:left;font-weight:bold;color: #00BFFF;text-decoration:underline;", 
            Se.components[0].components[1].linksrc = Te, Se.components[0].components[1].ontap = "requestBlogExplore") : (Se.components[0].components[0].src = "http://assets.tumblr.com/images/anonymous_avatar_24.gif", 
            Se.components[0].components[1].style = "float:left;font-weight:bold;"), Se.components[0].components.push(new s()), 
            Se.components[0].components[2].classes = "break-word-white-space", Se.components[0].components[2].style = "clear:left;display:block;", 
            Se.components[0].components[2].content = u(t.question), Pe.components.push(Se);
            var ke = new c();
            ke.components[1].components = [], ke.components[1].components.push(new s()), ke.components[1].components[0].classes = "break-word-white-space no-limits", 
            ke.components[1].components[0].style = "float:left;margin-right:5px;width:32px;height:32px;", 
            ke.components[1].components[0].kind = "Image", ke.components[1].components[0].src = "http://api.tumblr.com/v2/blog/" + t.blog_name + ".tumblr.com/avatar", 
            ke.components[1].components.push(new s()), ke.components[1].components[1].classes = "break-word-white-space", 
            ke.components[1].components[1].kind = "Control", ke.components[1].components[1].content = t.blog_name + " answers:", 
            ke.components[1].components[1].style = "float:left;font-weight:bold;color: #00BFFF;text-decoration:underline;margin-bottom:10px;padding-right:3px;max-width:" + (WND_WIDTH() - 75) + "px;", 
            ke.components[1].components[1].linksrc = t.blog_name, ke.components[1].components[1].ontap = "requestBlogExplore";
            var Ae = u(t.answer);
            if (Ae.indexOf("<img") >= 0) {
                ke.components[1].components.push(new s()), ke.components[1].components[2].classes = "break-word-white-space", 
                ke.components[1].components[2].style = "clear:left;display:block;text-align: center;";
                var Re = d(Ae), Me = {
                    kind: "PhotoDisplay",
                    postid: this.post.id,
                    maxWidth: WND_WIDTH() - 100,
                    srcs: Re.srcs,
                    classes: "border-bottom-dark",
                    captions: Re.caps,
                    onImageClick: "requestFullImage",
                    onImageSave: "requestSaveImage"
                };
                if (ke.components[1].components[2].components = [], ke.components[1].components[2].components.push(Me), 
                Re.leftover && Re.leftover.length > 0) {
                    var Oe = new r();
                    Oe.classes = "break-word-white-space border-top-light", Oe.style += "text-align:left;", 
                    g.useNotesBox && (Oe.classes += " border-bottom-dark"), Oe.bufferContent = u(Re.leftover), 
                    ke.components[1].components[2].components.push(Oe);
                }
            } else ke.components[1].components.push(new s()), ke.components[1].components[2].classes = "break-word-white-space", 
            ke.components[1].components[2].style = "clear:left;display:block;", ke.components[1].components[2].content = Ae;
            Pe.components.push(ke), g.useNotesBox && Pe.components.push(g), N.components.push(Pe);
            break;

          case "audio":
            var Le = "";
            t.artist && (Le = t.artist), t.album && (Le += Le.length > 0 ? "<br />" : "", Le = Le + '<p style="font-size:78%;">' + t.album + "</p>", 
            t.year && (Le = Le.substr(0, Le.lenth - 4) + " (" + t.year + ")</p>")), t.track_name && Le.length > 0 && (Le = Le + "<br />" + t.track_name), 
            0 >= Le.length && (Le = "Audio...");
            var Be = new s();
            Be.components = [], Be.components.push(B);
            var Ne = new s();
            Ne.classes = "break-word-white-space border-bottom-dark", Ne.content = Le, Be.components.push(Ne);
            var De = t.post_url, Ee = new s();
            Ee.kind = "FittableColumns", Ee.classes = "border-top-light", Ee.style += "padding:10px;", 
            Ee.components = [];
            var $e = void 0;
            t.album_art && ($e = new h(), $e.classes = "no-limits", $e.style = "width:120px;height:120px;", 
            $e.src = t.album_art);
            var _e = {
                kind: "MyCustomButton",
                defaultClassName: "playAudioButton",
                clickClassName: "playAudioButtonClick",
                onButtonClicked: "playSound",
                soundUrl: De
            };
            $e && Ee.components.push($e), Ee.components.push(_e), H = u(t.caption);
            var He = void 0 !== H && H.length > 0 || void 0 !== t.plays || g.useNotesBox;
            if (He && (Ee.classes += " border-bottom-dark"), Be.components.push(Ee), void 0 !== H && H.length > 0) {
                var Fe = new r();
                Fe.classes = "border-top-light", Fe.bufferContent = H;
                var Ue = g.useNotesBox || void 0 !== t.plays;
                Ue && (Fe.classes += " border-bottom-dark"), Be.components.push(Fe);
            }
            if (void 0 !== t.plays) {
                var ze = new s();
                ze.style = "font-size:70%;", ze.content = t.plays + " play" + (1 != parseInt(t.plays, 10) ? "s" : ""), 
                ze.classes = "break-word-white-space border-top-light", g.useNotesBox && (ze.classes += " border-bottom-dark"), 
                Be.components.push(ze);
            }
            g.useNotesBox && Be.components.push(g), N.components.push(Be);
            break;

          default:
            N.components.push(B), N.components.push({
                name: "itemBody" + (Math.floor(1e5 * Math.random()) + n() + Math.floor(999 * Math.random())),
                style: "max-width:314px;",
                content: t.type,
                allowHtml: !0
            }), g.useNotesBox && N.components.push(g);
        }
        i.push(N);
        var We = new s();
        We.classes = "", We.style = "height:" + (TUMBLR.footerHeight + 45) + "px;", We.resizeMe = !0, 
        We.resize = {
            height: "-footer"
        }, i.push(We);
        var Ve = new s();
        Ve.classes = "", Ve.style += "padding-top: 2px;", Ve.components = i;
        var Ge = WND_HEIGHT(), je = {
            classes: "post-background",
            style: "height:" + ("" + Ge) + "px;",
            resizeMe: !0,
            resize: {
                height: 0
            },
            components: [ {
                kind: "SlideableScroller",
                postid: this.post.id,
                components: [ Ve ]
            } ]
        };
        this.cellComponents = [ je ];
    }
});

// source\controls\scrimspinner.js
enyo.kind({
    name: "scrimSpinner",
    kind: "ToasterPopup",
    style: "color:black;width:280px;text-align:center;",
    classes: "captionBack",
    published: {
        statusMsg: "",
        icon: ""
    },
    handlers: {
        onHide: "hideControls"
    },
    floating: !0,
    centered: !0,
    align: "left",
    anchor: !1,
    scrim: !0,
    autoDismiss: !1,
    modal: !0,
    messages: [ "Keep on tumbling", "Tumble Tumble Tumble....", "A tumbling I will go...", "Are you ready to tumble?", "How many tumbles does it take to get to the center of tumblr?", "That\u2019s no moon, it\u2019s a tumblr blog!", "Rock and tumble all night long!", "Tumble on!", "Oh oh oh, sweet tumblr o' mine", "The tumbling is strong with this one.", "Set phasers on tumblr!", "Here I am, tumble you like a hurricane", "Beam me up, tumblr!" ],
    msgHeaders: [ "Crawling through tumblr's web,<br />please wait", "Tumbling through the hills of tumblr,<br />please wait", "Probing tumblr,<br />please wait", "Delving into the depths of tumblr,<br />please wait", "Plotting a course through tumblr,<br />please wait", "Scanning tumblr,<br />please wait", "Cruising through tumblr,<br />please wait", "Slaying tumblr dragons,<br />please wait", "Accessing tumblr's matrix,<br />please wait" ],
    components: [ {
        kind: "onyx.Spinner",
        classes: "onyx-light",
        name: "spin",
        style: "background-size:32px 32px;width:32px;height:32px;"
    }, {
        content: "",
        allowHtml: !0,
        name: "msgHeader",
        style: "margin-top:10px;margin-bottom:10px;font-size:120%;letter-spacing:-1px;width:100%;"
    }, {
        kind: "FittableColumns",
        style: "width:100%;height: 64px;",
        name: "statusbox",
        showing: !1,
        components: [ {
            kind: "Image",
            name: "avatar",
            style: "margin-right: 8px;"
        }, {
            name: "statusmsg",
            style: "font-size:80%;letter-spacing:-1px;text-align:center;",
            allowHtml: !0
        } ]
    }, {
        name: "msg",
        style: "font-size:80%;letter-spacing:-1px;width:100%;"
    }, {
        name: "statusLabel",
        style: "font-size:55%;"
    }, {
        name: "countLabel",
        style: "font-size:55%;width:290px;",
        showing: !1
    }, {
        kind: "Signals",
        onStatusUpdate: "updateStatus",
        onCountUpdate: "updateCount"
    } ],
    running: !1,
    start: function(t) {
        t ? this.$.statusbox.show() : this.$.statusbox.hide(), this.running === !1 && (this.running = !0, 
        this.$.msgHeader.setContent(this.msgHeaders[Math.floor(Math.random() * this.msgHeaders.length)]), 
        this.$.msg.setContent("( " + this.messages[Math.floor(Math.random() * this.messages.length)] + ")"), 
        this.show(), this.$.spin.show(), this.bubbleUp("onScrimShowing")), this.resized();
    },
    updateCount: function(t, e) {
        return this.running === !0 && e && e.msg && (this.$.countLabel.setContent(e.msg), 
        this.$.countLabel.show()), !0;
    },
    stop: function() {
        this.running && (this.running = !1, this.hide());
    },
    updateStatus: function(t, e) {
        return this.running === !0 && e && e.msg && this.$.statusLabel.setContent(e.msg), 
        !0;
    },
    hideControls: function() {
        this.$.spin.hide(), this.$.countLabel.hide(), this.bubbleUp("onScrimHide");
    },
    statusMsgChanged: function() {
        this.$.statusmsg.setContent(this.statusMsg);
    },
    iconChanged: function() {
        this.icon.length > 0 ? this.$.avatar.show() : this.$.avatar.hide(), this.$.avatar.setAttribute("src", this.icon);
    }
});

// source\controls\custombutton\custombutton.js
enyo.kind({
    name: "MyCustomButton",
    kind: "Control",
    published: {
        defaultClassName: "",
        clickClassName: "",
        disabledClassName: "",
        checkedClassName: "",
        buttonType: "basic",
        dualDefault: "",
        dualDisabled: "",
        dualClick: "",
        buttonEnabled: !0,
        buttonChecked: !1,
        canTapAndHold: !1,
        canTapOnDual: !1,
        buttonDual: 0,
        tapHold: 0
    },
    events: {
        onButtonClicked: "",
        onTapAndHold: ""
    },
    components: [ {
        kind: "Control",
        name: "MyButton",
        onleave: "mouseoutHandler",
        ondown: "myMousedownHandler",
        ontap: "myClickHandler"
    } ],
    rendered: function() {
        this.inherited(arguments), 1 == this.buttonChecked ? this.$.MyButton.setClassAttribute(this.checkedClassName) : 1 == this.buttonDual ? this.$.MyButton.setClassAttribute(this.defaultDual) : this.$.MyButton.setClassAttribute(this.defaultClassName);
    },
    setToDefault: function() {
        this.$.MyButton.setClassAttribute(this.defaultClassName), this.buttonDual = 0;
    },
    setToChecked: function() {
        this.$.MyButton.setClassAttribute(this.checkedClassName), this.buttonChecked = !0, 
        this.buttonDual = 0;
    },
    setToDualDefault: function() {
        this.$.MyButton.setClassAttribute(this.dualDefault), this.buttonDual = 1;
    },
    tapHoldChanged: function() {
        this.tapHold >= 4 && ((1 == this.buttonDual && 1 == this.canTapOnDual || 0 == this.buttonDual) && 1 == this.canTapAndHold && this.doTapAndHold(), 
        this.tapHold = 0, window.clearInterval(this.job));
    },
    myClickHandler: function(t, e) {
        var i = !1;
        1 == this.buttonEnabled && (1 == this.canTapAndHold && this.tapHold >= 3 && ((1 == this.buttonDual && 1 == this.canTapOnDual || 0 == this.buttonDual) && 1 == this.canTapAndHold && this.doTapAndHold(), 
        this.tapHold = 0, window.clearInterval(this.job), i = !0), "basic" == this.buttonType ? (this.$.MyButton.setClassAttribute(this.defaultClassName), 
        0 == i && this.doButtonClicked(e)) : "dual" == this.buttonType ? 0 == this.buttonDual ? (this.$.MyButton.setClassAttribute(this.dualDefault), 
        this.buttonDual = 1, 0 == i && this.doButtonClicked({
            dual: "0"
        })) : (this.$.MyButton.setClassAttribute(this.defaultClassName), this.buttonDual = 0, 
        0 == i && this.doButtonClicked({
            dual: "1"
        })) : (0 == this.buttonChecked ? (this.buttonChecked = !0, this.$.MyButton.setClassAttribute(this.checkedClassName)) : (this.buttonChecked = !1, 
        this.$.MyButton.setClassAttribute(this.defaultClassName)), this.doButtonClicked(e)), 
        this.tapHold = 0, window.clearInterval(this.job));
    },
    getValue: function() {
        return this.buttonChecked;
    },
    myMousedownHandler: function() {
        1 == this.buttonEnabled && ("basic" == this.buttonType ? this.$.MyButton.setClassAttribute(this.clickClassName) : "dual" == this.buttonType && (0 == this.buttonDual ? this.$.MyButton.setClassAttribute(this.clickClassName) : this.$.MyButton.setClassAttribute(this.dualClick)), 
        1 == this.canTapAndHold && (this.job = window.setInterval(enyo.bind(this, function() {
            this.tapHold++, this.tapHold >= 4 && this.tapHoldChanged();
        }), 200)));
    },
    myMouseupHandler: function() {},
    mouseoutHandler: function() {
        1 == this.buttonEnabled && ("basic" == this.buttonType ? this.$.MyButton.setClassAttribute(this.defaultClassName) : "dual" == this.buttonType && (0 == this.buttonDual ? this.$.MyButton.setClassAttribute(this.defaultClassName) : this.$.MyButton.setClassAttribute(this.dualDefault)));
    },
    buttonEnabledChanged: function() {
        "basic" == this.buttonType ? 1 == this.buttonEnabled ? this.$.MyButton.setClassAttribute(this.defaultClassName) : this.$.MyButton.setClassAttribute(this.disabledClassName) : "dual" == this.buttonType && (0 == this.buttonDual ? 1 == this.buttonEnabled ? this.$.MyButton.setClassAttribute(this.defaultClassName) : this.$.MyButton.setClassAttribute(this.disabledClassName) : 1 == this.buttonEnabled ? this.$.MyButton.setClassAttribute(this.dualDefault) : this.$.MyButton.setClassAttribute(this.dualDisabled));
    },
    setChecked: function(t) {
        0 != t && "false" != t && 0 != t && -1 != t && t ? (this.$.MyButton.setClassAttribute(this.checkedClassName), 
        this.buttonChecked = !0) : (this.buttonChecked = !1, this.$.MyButton.setClassAttribute(this.defaultClassName));
    },
    getChecked: function() {
        return this.$.MyButton.getClassAttribute() == this.checkedClassName ? !0 : !1;
    },
    switchDual: function() {
        0 == this.buttonDual ? (this.$.MyButton.setClassAttribute(this.dualDefault), this.buttonDual = 1) : (this.buttonDual = 0, 
        this.$.MyButton.setClassAttribute(this.defaultClassName));
    }
});

// source\controls\expandablemenu\expandablemenu.js
enyo.kind({
    name: "TitledDrawer",
    kind: "onyx.Drawer",
    open: !1,
    allowClick: !1,
    noAnimate: !1,
    published: {
        highlightWhenOpened: !0,
        icon: ""
    },
    handlers: {
        onSubMenuOpen: "adjustSize"
    },
    events: {
        onOpenChanged: ""
    },
    tools: [ {
        kind: "Control",
        name: "contain",
        ontap: "toggleOpen",
        showing: !1,
        classes: "enyo-border-box",
        components: [ {
            kind: "Image",
            style: "width:32px;height:32px;display:inline-block;border: none !important;box-shadow: none !important;",
            showing: !1,
            name: "itemIcon"
        }, {
            kind: "Control",
            name: "title",
            style: "display:inline-block;position:relative;top:-10px;",
            content: ""
        }, {
            kind: "Image",
            name: "image",
            src: "assets/more-items-arrow.png",
            style: "float: right;border: none !important;margin-top:10px;box-shadow: none !important;"
        } ]
    }, {
        kind: "Animator",
        onStep: "animatorStep",
        onEnd: "animatorEnd"
    }, {
        kind: "Control",
        style: "clear:both;position: relative;overflow: hidden;height:100%;width:100%;",
        components: [ {
            kind: "Control",
            name: "client",
            style: "position: relative;",
            classes: "enyo-border-box"
        } ]
    } ],
    initComponents: function() {
        this.content && this.content.length > 0 && (this.tools[0].showing = !0, this.tools[0].components[1].content = this.content, 
        this.tools[0].style = "position: relative;display: block;"), this.inherited(arguments);
    },
    create: function() {
        this.inherited(arguments), this.iconChanged();
    },
    iconChanged: function() {
        this.icon.length > 0 ? (this.$.itemIcon.setSrc(this.icon), this.$.itemIcon.show()) : this.$.itemIcon.hide();
    },
    adjustSize: function() {
        var t = this.noAnimate;
        this.noAnimate = !0, this.openChanged(), this.noAnimate = t;
    },
    openChanged: function() {
        if (this.$.client.show(), this.hasNode()) {
            var t = "v" == this.orient, e = t ? "height" : "width", i = t ? "top" : "left";
            this.applyStyle(e, null);
            var n = this.getClientControls(), o = 2 > n.length ? 4 : 4 * (n.length - 1), s = this.hasNode()[t ? "scrollHeight" : "scrollWidth"] + o, a = this.$.contain.hasNode(), r = 0;
            a && (r = 4 + (t ? a.scrollHeight : a.scrollWidth)), this.noAnimate === !1 ? this.$.animator.play({
                startValue: this.open ? 0 + (a ? r : 0) : s,
                endValue: this.open ? s : 0 + (a ? r : 0),
                dimension: e,
                position: i
            }) : (this.applyStyle(e, this.open ? 0 + (a ? r : 0) : s + (a ? r : 0)), this.$.client.setShowing(this.open));
        } else this.$.client.setShowing(this.open);
        this.open && this.highlightWhenOpened ? this.addClass("drawer-highlight") : this.removeClass("drawer-highlight"), 
        this.$.image.setAttribute("src", this.open ? "assets/close-more-items-arrow.png" : "assets/more-items-arrow.png"), 
        this.doOpenChanged({
            open: this.open
        }), this.bubbleUp("onSubMenuOpen", {
            sender: this
        });
    },
    toggleOpen: function() {
        return this.allowClick === !0 ? (this.setOpen(!this.getOpen()), !0) : void 0;
    }
}), enyo.kind({
    name: "div.MenuItem",
    kind: "Control",
    tag: "div",
    classes: "onyx-menu-item",
    style: "padding: 5px !important;min-height:37px !important;max-height:37px !important;",
    events: {
        onSelect: ""
    },
    tap: function() {
        this.inherited(arguments), this.bubble("onRequestHideMenu"), this.doSelect({
            selected: this,
            content: this.getContent()
        });
    }
}), enyo.kind({
    name: "highlight.MenuItem",
    kind: "div.MenuItem",
    published: {
        tapHighlight: !0,
        icon: "",
        content: "",
        componentMode: !1
    },
    tools: [ {
        kind: "Image",
        style: "display:inline-block;width:32px;height:32px;border: none !important;box-shadow: none !important;",
        name: "itemIcon"
    }, {
        name: "itemLabel",
        style: "display:inline-block;clear:both;position:relative;top:-10px;",
        allowHtml: !0
    } ],
    iconMode: !1,
    handlers: {
        ondown: "addHighlight",
        onrelease: "removeHighlight",
        onout: "removeHighlight",
        onup: "removeHighlight"
    },
    create: function() {
        this.inherited(arguments), this.iconChanged();
    },
    iconChanged: function() {
        this.componentMode !== !0 && (this.icon.length > 0 ? (this.destroyClientControls(), 
        this.createComponents(this.tools, {
            owner: this
        }), this.render(), this.iconMode = !0, this.$.itemIcon.setSrc(this.icon), this.$.itemLabel.setContent(this.content)) : (this.destroyClientControls(), 
        this.iconMode = !1, this.setContent(this.content)));
    },
    getContent: function() {
        if (this.componentMode === !0) for (var t = this.getControls(), e = 0; t.length > e; e++) if (t[e].isContent) return t[e].content;
        return this.iconMode === !0 ? this.$.itemLabel.getContent() : this.content;
    },
    contentChanged: function() {
        this.iconMode === !0 ? this.$.itemLabel.setContent(this.content) : this.inherited(arguments);
    },
    addHighlight: function() {
        this.addClass("item-highlight"), window.setTimeout(enyo.bind(this, function() {
            this.removeHighlight();
        }), 300);
    },
    removeHighlight: function() {
        this.removeClass("item-highlight");
    }
}), enyo.kind({
    name: "ExpandableMenuItem",
    kind: "TitledDrawer",
    classes: "",
    defaultKind: "highlight.MenuItem",
    events: {
        onSelect: ""
    },
    handlers: {
        ontap: "toggleDrawer"
    },
    toggleDrawer: function() {
        return this.setOpen(!this.getOpen()), !0;
    }
});

// source\controls\bannermessage.js
enyo.kind({
    kind: "ToasterPopup",
    floating: !0,
    autoDismiss: !1,
    modal: !1,
    align: "left",
    anchor: !1,
    centeredX: !0,
    scrim: !1,
    name: "BannerMessage",
    published: {
        position: {
            bottom: 60,
            left: 0
        }
    },
    handlers: {
        onHide: "checkQueue"
    },
    classes: "banner-message",
    closeDelay: 3e3,
    components: [ {
        kind: "FittableColumns",
        noStretch: !0,
        components: [ {
            kind: "onyx.Spinner",
            name: "spin",
            style: "background-size:32px 32px;margin-right:10px;height:32px;width:32px;"
        }, {
            kind: "onyx.Icon",
            name: "icon",
            style: "margin-right:10px;background-size:32px 32px;height:32px;width:32px;"
        }, {
            name: "msgText",
            style: "margin-top: 10px;",
            classes: "break-word-white-space"
        }, {
            kind: "onyx.Icon",
            name: "icon2",
            style: "margin-left:10px;background-size:32px 32px;height:32px;width:32px;position:absolute;right:0px;"
        } ]
    } ],
    vmode: !1,
    messageQueue: [],
    isRunning: !1,
    openBannerMessage: function(t, e) {
        this.isRunning === !1 ? (this.isRunning = !0, this.spinnermode = !1, this.top = WND_HEIGHT() - 120, 
        this.setAlign("left"), this.floating && !this.hasNode() && this.render(), this.$.msgText.setContent(t), 
        this.setStyle("max-width: " + (WND_WIDTH() - 20) + "px;"), this.$.icon.hide(), t.indexOf("Post liked") >= 0 ? (this.$.icon.setSrc("assets/likepost.png"), 
        this.$.icon.show()) : t.indexOf("Post un-like") >= 0 ? (this.$.icon.setSrc("assets/unlikepost.png"), 
        this.$.icon.show()) : t.indexOf("Reblogged to") >= 0 ? (this.$.icon.setSrc("assets/reblogmessageicon.png"), 
        this.$.icon.show()) : t.indexOf("Queued to") >= 0 ? (this.$.icon.setSrc("assets/queuemessageicon.png"), 
        this.$.icon.show()) : t.indexOf("Draft created ") >= 0 && (this.$.icon.setSrc("assets/draftmessageicon.png"), 
        this.$.icon.show()), this.$.icon2.hide(), e && e.length > 0 && (this.$.icon2.setSrc(TUMBLR.getAvatar(e, 30)), 
        this.$.icon2.show()), this.$.spin.hide(), this.resized(), this.show(), window.setTimeout(enyo.bind(this, function() {
            this.setAlign("bottom"), setTimeout(enyo.bind(this, function() {
                this.close();
            }), 250);
        }), this.closeDelay)) : (this.messageQueue.push({
            msg: t,
            blog_name: e
        }), this.spinnermode && (this.setAlign("bottom"), setTimeout(enyo.bind(this, function() {
            this.close();
        }), 400)));
    },
    checkQueue: function() {
        this.isRunning = !1, this.messageQueue.length > 0 && setTimeout(enyo.bind(this, function() {
            this.messageQueue[0].noDelay ? this.openBannerMessageNoDelayShowSpinner(this.messageQueue[0].msg, this.messageQueue[0].blog_name) : this.openBannerMessage(this.messageQueue[0].msg, this.messageQueue[0].blog_name), 
            this.messageQueue.shift();
        }), 250);
    },
    spinnermode: !1,
    openBannerMessageNoDelayShowSpinner: function(t, e) {
        this.isRunning === !1 ? (this.isRunning = !0, this.spinnermode = !0, this.top = WND_HEIGHT() - 120, 
        this.setAlign("left"), this.floating && !this.hasNode() && this.render(), this.$.icon.hide(), 
        this.$.icon2.hide(), e && e.length > 0 && (this.$.icon2.setSrc("http://api.tumblr.com/v2/blog/" + e + ".tumblr.com/avatar"), 
        this.$.icon2.show()), this.$.msgText.setContent(t), this.setStyle("max-width: " + (WND_WIDTH() - 20) + "px;"), 
        this.$.spin.show(), this.resized(), this.show(), window.setTimeout(enyo.bind(this, function() {
            this.setAlign("bottom"), setTimeout(enyo.bind(this, function() {
                this.close();
            }), 250);
        }), 1e4)) : this.messageQueue.push({
            msg: t,
            blog_name: e,
            noDelay: !0
        });
    },
    close: function() {
        this.hide(), this.$.spin.hide();
    }
}), enyo.kind({
    kind: "ToasterPopup",
    floating: !0,
    autoDismiss: !1,
    modal: !0,
    align: "left",
    anchor: !1,
    centeredX: !0,
    scrim: !1,
    name: "LoadingBanner",
    classes: "banner-message",
    style: "height:60px;",
    components: [ {
        kind: "FittableColumns",
        noStretch: !0,
        style: "width:100%;",
        components: [ {
            kind: "onyx.Spinner",
            name: "spin",
            style: "background-size:32px 32px;margin-right:10px;height:32px;width:32px;margin-top:4px;"
        }, {
            kind: "FittableRows",
            fit: !0,
            components: [ {
                name: "msgText",
                style: "font-size:77%;margin-bottom:3px;",
                classes: "break-word-white-space",
                allowHtml: !0
            }, {
                name: "countText",
                style: "font-size: 60%;",
                classes: "break-word-white-space"
            } ]
        }, {
            kind: "onyx.Icon",
            name: "icon2",
            style: "margin-left:10px;background-size:32px 32px;height:32px;width:32px;"
        } ]
    }, {
        kind: "Signals",
        onStatusUpdate: "updateStatus",
        onCountUpdate: "updateCount",
        onIconUpdate: "updateIcon"
    } ],
    vmode: !1,
    messageQueue: [],
    isRunning: !1,
    show: function(t, e) {
        this.isRunning = !0, this.top = WND_HEIGHT() - 120, this.floating && !this.hasNode() && this.render(), 
        0 === this.$.countText.getContent().length ? (this.$.countText.hide(), this.$.msgText.applyStyle("margin-top", "5px")) : this.$.msgText.applyStyle("margin-top", null), 
        this.setAlign("left"), this.$.icon2.hide(), e && (e.blog_name && e.blog_name.length > 0 ? (this.$.icon2.setSrc(TUMBLR.getAvatar(e.blog_name, 30)), 
        this.$.icon2.show()) : e.src && e.src.length > 0 && (this.$.icon2.setSrc(e.src), 
        this.$.icon2.show())), t && this.$.msgText.setContent(t), this.applyStyle("max-width", WND_WIDTH() - 20 + "px"), 
        this.$.spin.show(), this.inherited(arguments), this.resized();
    },
    updateIcon: function(t, e) {
        this.$.icon2.hide(), e && (e.blog_name && e.blog_name.length > 0 ? (this.$.icon2.setSrc(TUMBLR.getAvatar(e.blog_name, 30)), 
        this.$.icon2.show()) : e.src && e.src.length > 0 && (this.$.icon2.setSrc(e.src), 
        this.$.icon2.show())), this.updatePosition();
    },
    updateStatus: function(t, e) {
        this.$.msgText.setContent(e.msg);
    },
    updateCount: function(t, e) {
        this.$.countText.setContent(e.msg), this.$.countText.show();
    },
    hide: function() {
        this.setAlign("bottom"), this.inherited(arguments), this.$.countText.setContent("");
    }
});

// source\controls\htmlcontent.js
enyo.kind({
    name: "HtmlContent",
    kind: "Control",
    events: {
        onLinkClick: ""
    },
    handlers: {
        onclick: "clickHandler"
    },
    allowHtml: !0,
    findLink: function(t, e) {
        for (var i = t; i && i != e; ) {
            if (i.href) return i.href;
            i = i.parentNode;
        }
    },
    clickHandler: function(t, e) {
        var i = this.findLink(e.target, this.hasNode());
        i && (e.preventDefault(), e.stopPropagation(), this.doLinkClick({
            url: i
        }));
    }
}), enyo.kind({
    name: "BufferedHtmlContent",
    kind: "HtmlContent",
    published: {
        bufferContent: ""
    },
    handlers: {
        onFlowImages: "flowBuffer",
        onStripImages: "stripBuffer"
    },
    flowBuffer: function() {
        this.setContent(this.bufferContent);
    },
    stripBuffer: function() {
        this.setContent("");
    }
});

// source\controls\imagestacker.js
enyo.kind({
    kind: "Control",
    name: "ImageStacker",
    published: {
        boxSize: {
            height: 65,
            width: 65
        },
        maxPics: 6,
        minSize: 15,
        rowImages: !1,
        picSize: 20,
        rowImageOffset: 5
    },
    create: function() {
        this.inherited(arguments), this.srcUrls = [];
    },
    setSrcUrls: function(t) {
        return this.srcUrls = enyo.clone(t), this.buildImages(), this.srcUrls;
    },
    boxSizeChanged: function() {
        this.buildImages();
    },
    random: !0,
    imagesInRow: function() {
        var t = [];
        this.srcUrls = this.random === !0 ? this.randomize(this.srcUrls) : this.srcUrls;
        for (var e = 0; this.srcUrls.length > e && (t.push({
            kind: "Image",
            src: this.srcUrls[e],
            classes: "no-limits",
            style: "position: absolute;left:" + (e + 1) * this.rowImageOffset + "px;margin-right:0 !important;display:inline-block;width:22px;height:22px;border: none !important;box-shadow: none !important;"
        }), !(e >= this.maxPics)); e++) ;
        this.createComponent({
            style: "position: absolute;display:inline-block;white-space:nowrap;",
            components: t
        }, {
            owner: this
        }), this.render();
    },
    randomize: function(t) {
        for (var e = t.length - 1; e > 0; e--) {
            var i = Math.floor(Math.random() * (e + 1)), n = t[e];
            t[e] = t[i], t[i] = n;
        }
        return t;
    },
    buildImages: function() {
        if (this.destroyClientControls(), this.rowImages) return this.imagesInRow(), void 0;
        var t = this.boxSize.width, e = this.boxSize.height, i = Math.floor(t / (this.picSize - this.picSize / 2)), n = Math.floor(e / (this.picSize - this.picSize / 2)), o = this.picSize, s = this.srcUrls.length + 1;
        if (!(0 >= s)) {
            if (s > i * n) do o--, i = Math.floor(t / (o - o / 2)), n = Math.floor(e / (o - o / 2)); while (s > i * n);
            if (i * n > s) {
                do o++, i = Math.floor(t / (o - o / 2)), n = Math.floor(e / (o - o / 2)); while (i * n > s);
                if (s > i * n) do o--, i = Math.floor(t / (o - o / 2)), n = Math.floor(e / (o - o / 2)); while (s > i * n);
            }
            if (i * n > s && i > n) {
                var a = !1;
                do a = !1, i--, n--, i * n > s ? n >= i && i * n >= s && (a = !0) : i * n == s ? a = !0 : s > i * n && (i++, 
                a = !0); while (a === !1);
            }
            for (var r = [], h = 0; this.srcUrls.length > h; h++) r.push({
                kind: "Image",
                src: this.srcUrls[h],
                style: "position:relative;border-radius:25px;width:" + o + "px;height:" + o + "px;",
                classes: "no-limits",
                noEvents: !0
            });
            r = this.randomize(r);
            for (var l = 0, c = {
                kind: "FittableRows",
                style: "height:" + e + "px;width:" + t + "px;",
                components: []
            }, d = function(t) {
                return {
                    kind: "FittableColumns",
                    classes: "enyo-center",
                    style: "position:relative;top:-" + o / 2 * t + "px;",
                    components: []
                };
            }, h = 0; n >= h; h++) {
                c.components.push(new d(h));
                for (var u = 0; i > u; u++) r[l] && (0 !== u && (r[l].style += "left:-" + o / 2 * u + "px;"), 
                c.components[c.components.length - 1].components.push(r[l])), l++;
            }
            this.createComponent(c, {
                owner: this
            }), this.render();
        }
    }
});

// source\controls\custominputdec.js
enyo.kind({
    name: "Custom.InputDecorator",
    kind: "enyo.ToolDecorator",
    tag: "label",
    classes: "onyx-input-decorator",
    published: {
        alwaysLookFocused: !1
    },
    handlers: {
        onDisabledChange: "disabledChange",
        onfocus: "receiveFocus",
        onblur: "receiveBlur"
    },
    create: function() {
        this.inherited(arguments), this.alwaysLookFocusedChanged();
    },
    alwaysLookFocusedChanged: function() {
        this.alwaysLookFocused ? this.receiveFocus() : this.receiveBlur();
    },
    receiveFocus: function() {
        this.addClass("onyx-focused");
    },
    receiveBlur: function() {
        this.alwaysLookFocused === !1 && this.removeClass("onyx-focused");
    },
    disabledChange: function(t, e) {
        this.addRemoveClass("onyx-disabled", e.originator.disabled);
    }
});

// source\controls\taglist.js
enyo.kind({
    name: "TagList",
    events: {
        onTagClick: ""
    },
    components: [],
    selectedIndex: 0,
    tags: [],
    create: function() {
        this.inherited(arguments);
    },
    getSelectedTag: function() {
        return this.tags[this.selectedIndex];
    },
    loadTags: function() {
        var t = STORAGE.get("tumblrTags");
        if (t) {
            try {
                t = enyo.json.parse(t);
            } catch (e) {
                t = void 0;
            }
            t ? (this.tags = t, this.tags.reverse(), this.createItems()) : this.destroyClientControls();
        }
    },
    createItems: function() {
        this.destroyClientControls();
        var t = [], e = 0;
        for (e = 0; this.tags.length > e; e++) {
            var i = {
                kind: "FittableRows",
                name: "listItem" + e,
                indexN: e,
                classes: "scroller-slide",
                style: "height:60px;width:100px;text-align:center;margin:5px;",
                ontap: "openDeleteMenu",
                components: [ {
                    name: "tag_icon" + e,
                    classes: "no-limits",
                    kind: "Image",
                    style: "width:30px;",
                    src: "assets/tagicon" + (enyo.irand(5) + 1) + ".png"
                }, {
                    name: "tag_name" + e,
                    style: "font-size:80%;font-weight:bold;"
                } ]
            };
            t.push(i);
        }
        this.createComponents(t, {
            owner: this
        }), this.render(), this.fillInfo();
    },
    fillInfo: function() {
        for (i = 0; this.tags.length > i; i++) {
            var t = this.$["listItem" + i];
            t && (i == this.selectedIndex ? (t.addClass("view-mode-active"), t.removeClass("view-mode-not")) : (t.removeClass("view-mode-active"), 
            t.addClass("view-mode-not")), this.$["tag_name" + i].setContent(LIMIT_TEXT_LENGTH(this.tags[i], 90)));
        }
    },
    openDeleteMenu: function(t) {
        this.selectedIndex = t.indexN, this.doTagClick({
            content: this.tags[this.selectedIndex]
        }), this.fillInfo();
    },
    applyListHeight: function() {}
});

// source\views\login\help.js
enyo.kind({
    name: "custom.Picker",
    kind: "onyx.Picker"
}), enyo.kind({
    name: "HelpScreen",
    kind: "Control",
    events: {
        onOpenMenuButtonClicked: ""
    },
    published: {},
    handlers: {
        onSelect: "itemSelected"
    },
    style: "height:100%;",
    classes: "",
    components: [ {
        kind: "FittableColumns",
        noStretch: !0,
        style: "height:50px;margin:0;border-bottom: 3px solid #333000;",
        classes: "cat-list-backer",
        components: [ {
            kind: "onyx.PickerDecorator",
            style: "",
            fit: !0,
            components: [ {
                kind: "onyx.PickerButton",
                content: "Choose Section...",
                style: "width:193px;"
            }, {
                kind: "custom.Picker",
                name: "picker",
                components: [ {
                    content: "Intro",
                    match: "intro"
                }, {
                    content: "Setup",
                    match: "setup"
                }, {
                    content: "First Time Login",
                    match: "firsttime"
                }, {
                    content: "Main View",
                    match: "mainview"
                }, {
                    content: "Reblog and Sharing",
                    match: "reblogandshare"
                }, {
                    content: "Posting",
                    match: "posting"
                }, {
                    content: "Main Menu",
                    match: "mainmenu"
                }, {
                    content: "App Settings",
                    match: "settings"
                }, {
                    content: "Blog Menu",
                    match: "blogmenu"
                }, {
                    content: "Tag Menu",
                    match: "tagmenu"
                }, {
                    content: "Edit Categories",
                    match: "editcats"
                }, {
                    content: "Followers/Following View",
                    match: "followers"
                } ]
            } ]
        }, {
            kind: "onyx.IconButton",
            src: "assets/supporticon.png",
            ontap: "requestSupprt",
            style: ""
        } ]
    }, {
        kind: "android.Scroller",
        name: "contain",
        touchOverscroll: !1,
        horizontal: "hidden",
        style: "background:white;text-align:justify;",
        components: [ {
            style: "padding:3px;",
            components: [ {
                style: "height:5px;"
            }, {
                kind: "HtmlContent",
                onLinkClick: "jumpLink",
                name: "intro",
                classes: "help-section",
                allowHtml: !0,
                content: '<p class="help-header"><b>Welcome to blogWalker.</b> </p><p> blogWalker connects to your tumblr.com account, and lets you view, reblog, like, and share posts from tumblr. The best part of blogWalker is being able to sort tags and blogs into smaller, more related categories, and then just browse the types of posts you\u2019re in the mood for. You can also view posts from users without actually having to follow them and clutter up your dashboard by adding them to a category. With categories, tag searches, random search, and your dashboard, you will never run out of things to look at. </p> <p> blogWalker allows you to post as well. Currently, you can post either a text post or a photo post with up to 5-10 pictures (Depending on operating system). blogWalker also has image filters you can apply to your photos before you post them, as well as applying a border with either rounded or square corners. </p>'
            }, {
                kind: "HtmlContent",
                onLinkClick: "jumpLink",
                name: "setup",
                classes: "help-section",
                allowHtml: !0,
                content: '<p class="help-header"><b>Setup:</b> </p><p> When you first launch blogWalker, you will be taken to the <i><u>login and password prompt</u></i>. There are two text input boxes for your username and password. </p> <p> If you don\u2019t have a tumblr.com account, you can click the <b>blue \u201cSign Up!\u201d button </b>located under the text boxes. It only takes a minute, and <u>all you need is the user name and password</u>. You do not have to do anything else on tumblr. </p> <p> Once you have entered your login information, click the <b>Save button</b> to save your settings. Once you have entered a valid username and password, this prompt will no longer popup. You can get back to this screen to change your login settings from the <a href="mainmenu"> <b>\u201cMain Menu\u201d</b> </a>. </p>'
            }, {
                kind: "HtmlContent",
                onLinkClick: "jumpLink",
                name: "firsttime",
                classes: "help-section",
                allowHtml: !0,
                content: '<p class="help-header"><b>First Time Login:</b> </p> <p> Once you have entered your account information, blogWalker will connect to your dashboard. </p> <p> The first time you use blogWalker, there will be a small tutorial to guide you where things are and how to use the application. This will only show once. If you want to see this again, you can go to the <a href="mainmenu"> <b>\u201cMain Menu\u201d</b></a>, and select <a href="settings"> <b>\u201cSettings\u201d</b></a>. Uncheck the last item in the list, and the next time blogWalker is loaded, you will see the tutorial. </p> <p> Tap the screen to continue through the tutorial. </p>'
            }, {
                kind: "HtmlContent",
                onLinkClick: "jumpLink",
                name: "mainview",
                classes: "help-section",
                allowHtml: !0,
                content: '<p class="help-header"> <b>Main View:</b> </p> <p> This is where you are going to see all the posts. </p> <p> Scroll <b><u>vertically</u></b><u> up and down</u> to view all the content if it is longer than your screen. The post has a vertical \u201cpower scroller\u201d. You won\u2019t have to scroll very much at all no matter how long the post is. On long post, tiny drags will scroll a whole screen at a time. The best tip is to scroll slowly. </p> <p> Each post will show the poster\u2019s avatar, and their blog name, as well as how long ago it was posted.<b><u>Clicking on the avatar or blog name will bring up the blog menu. </u></b><a href="blogmenu"> <u>See the <b>\u201cBlog Menu\u201d</b> section for more information</u></a>. </p> <p> In the top right corner of each post, there is the <b>Like button</b>. If it is gray, tap it to like the post, if it is red, tap to un-like the post. </p> <p> Below those will be the post content. If the post has photos, there are a few more options. You can tap on the photo to bring up a popup that will allow you to pinch-zoom the image. When in <b>zoom mode</b>, click the <b>\u201cX\u201d</b> in the <u>bottom right corner to exit</u> (or the devices \u201cback\u201d button if equipped). </p> <p> You can also tap and hold the image to save it to your phone. Photos will be saved in a folder called \u201cTumblrPictures\u201d. </p> <p> If there are multiple photos, they will show up as thumbnails. Just tap one to bring it to full size. <i>If your screen is large enough, all pictures will load to full size by default.</i> You can also force the app to always load all pictures to full size by going to <a href="settings"> <b>Settings\u201d</b></a>. </p> <p> At the bottom of <i>most</i> posts there will be a <b>note count</b>, <b>source link</b>, and <b>list of tags</b>. If the <b>note count</b> is <u>black</u> , it means blogWalker doesn\u2019t have any note information available. If it is <u>blue</u>, you can <b>click it </b>to view the list of notes. The notes will appear below the note count. Scroll down to view them. You can tap any of the names to bring up the <b>blog menu</b>. <a href="blogmenu"> <u>See the <b>\u201cBlog Menu\u201d</b> section for more information</u></a>. <br/> If the <b>source link</b> is a <i>tumblr user name</i>, the <b>blog menu</b> will appear; <u>otherwise the link will be launched in a browser window.</u> <br/> If the post has any <b>tags</b>, they will be listed at the bottom of the post. You can <b>click on any of the tags</b> to bring up the <b>Tag Menu</b>, where you can <i>add tags</i> to categories or <u>view them through blogWalker</u>. <a href="tagmenu"> <u>See the <b>\u201cTag Menu\u201d</b> section for more information</u></a>. </p> <p> You can <b>flick the post left and right</b> to move <i>forward or back</i> through the list of posts. <b><u>Flick left to go forward.</u></b> </p>'
            }, {
                kind: "HtmlContent",
                onLinkClick: "jumpLink",
                name: "reblogandshare",
                classes: "help-section",
                allowHtml: !0,
                content: '<p class="help-header"> <b>Reblog and Sharing:</b> </p> <p> In the bottom right, there are 2 tabs that you can pull out from the side to open. The one on top is the Posting and Reblog menu. </p> <p> When open, there are currently 3 options for you to choose from, 2 for posting and 1 for rebloging. </p> <p> <b>Rebloging and Sharing:</b> </p> <p> When you select <b>Reblog, </b>you will be presented with another menu that has 5 options. </p> <p> Options are: </p> <p> <b>Reblog:</b> This will reblog the post to your blog as soon as you submit it. </p> <p> <b>Queue:</b> This will place the rebloged post into your queue. </p> <p> <b>Draft:</b> This will create a draft of the rebloged post on your blog that you can edit later. </p> <p> <b>Comment:</b> This will reblog the post to your blog as soon as you submit it, but you will be able to add a comment that will show up in the notes section of the post. </p> <p> <b>Share:</b> This will allow you to share a link to the post through text messaging, email, or any other apps that will take a link. </p> <p> Once you select Reblog, Queue, Draft, or Comment, there are some other prompts that may appear. </p> <p> If you have more than one blog, the first prompt will ask you to choose which one to post to. </p> <p> If you selected <b>\u201cComment\u201d</b>, the next prompt will ask you to enter your comment. </p> <p> The last prompt will be for <b>tags</b>. There is a Setting that can turn this off and on. <a href="settings"> <u>See the <b>\u201cSettings\u201d</b> section for more information</u></a>. </p> <p> To enter tags, type out your tag, and then press the comma (,) key on Android, (Enter key on Blackberry), to add the tag. It will show up with a gray background. If you don\u2019t want a tag, tap on it to delete it. </p> '
            }, {
                kind: "HtmlContent",
                onLinkClick: "jumpLink",
                name: "posting",
                classes: "help-section",
                allowHtml: !0,
                content: '<p class="help-header"><b>Posting View:</b> </p><p> Please note that posting is currently in beta. Everything should work as expected, but there may be hidden bugs. If there are any problems or suggestions, please email me at <a href="emailhelp">support@appsbychris.net</a>. </p> <p> You can currently post Text and Photo post. </p> <p> From the <b>Posting and Reblog</b> menu, you can select <b>\u201cText\u201d</b> or <b>\u201cPhoto\u201d</b> to start a post of that kind. </p> <p> To exit the posting view, click the \u201cBack\u201d button in the bottom left corner, or press the \u201cX\u201d icon in the top right corner. </p> <p> <b>Text Post:</b> </p> <p> After selecting a Text post, you will be presented with a text input for the title. The title is optional for Text post. Click the <b>\u201cNext\u201d</b> button in the bottom right corner to continue posting. Clicking the <b>\u201cBack\u201d</b> button will exit the posting view. </p> <p> After clicking <b>\u201cNext\u201d</b>, you will be presented with another text input field for your post\u2019s description.<u>A description is required to continue posting.</u> Click the <b>\u201cNext\u201d</b> button in the bottom right corner to continue posting. Clicking the <b>\u201cBack\u201d</b> button will bring you back to the <b>\u201cEnter a Title\u201d</b> section. </p> <p> After this, you will continue to the tag and post option screens. They will be covered at the end of the photo post section. </p> <p> <b>Photo Post:</b> </p> <p> After selecting a Photo post, you will see a dark screen telling you to add some pictures. In the <u>bottom left</u>, click the <b>\u201cGallery\u201d</b> button to find a picture in your photo library. In the <u>bottom right</u>, click the <b>\u201cCamera\u201d</b> button to take a fresh picture. </p> <p> After selecting a picture, you will be brought back to blogWalker with a screen asking you to crop your image. Use the <u>pinch and pull gestures</u> that you use for zooming to make the square larger and smaller. <u>Tap and drag it around </u>to find the perfect spot. Click the <b>\u201cNext\u201d</b> button in the bottom right corner to return to the photo post page. Clicking the <b>\u201cBack\u201d</b> button will cancel the picture you just chose and return you to the photo post page. </p> <p> You can have up to 10 (5 in Blackberry) images in your post. They will appear in a list on the photo post page. You can scroll up and down to see all the images you have selected. If you want to remove one, click the <b>red X button</b> that is to the bottom left of the image. </p> <p> On the <u>bottom right</u> of each image is the filter information. It will show what filter is currently applied to a photo. <b>Click the icon</b> to open up the filter view. </p> <p> You can <b>re-order</b> pictures by <u>tapping and holding</u>. Wait for the visual queue and then drag the image up or down to the desired location. </p> <p> Photos will be posted in the order they are in the list. </p> <p> <b>Filter view:</b> </p> <p> There are currently 25 different photo filters available to apply to your images. Simply <b>tap</b> on the <b>filter</b> to select and see how the image looks. </p> <p> There are also 2 frames you can choose from located at the <u>bottom middle</u> of the screen. </p> <p> Click the <b>\u201cNext\u201d</b> button in the lower right corner to proceed with the filter you chose, or click the <b>\u201cBack\u201d</b> button in the lower left corner to cancel adding a filter. </p> <p> Once you have selected all your pictures, click the <b>\u201cNext\u201d</b> button located in the bottom right corner. </p> <p> You must have at least 1 picture to continue. </p> <p> The next view will allow you to enter a description for your pictures. The description is optional. Due to restrictions with the tumblr API, you may only enter 1 description despite how many photos you have in the post. </p> <p> <b>Common Post Options:</b> </p> <p> The next screen will allow you to enter tags for your post. Tags are optional, but recommended. Tumblr only indexes the first 5 tags for tag searches, so you should limit your tags to that many. The number of tags you can enter is unlimited though. </p> <p> Type your tag out, then press the comma ( \u201c,\u201d ) key (Enter key on Blackberry) to enter the tag. The tag will appear to the left or top of the text input with a gray background. <u>If you want to remove a tag, simply tap on it.</u> Click the <b>\u201cNext\u201d</b> button in the bottom right corner to continue posting. Clicking the <b>\u201cBack\u201d</b> button will bring you back to the <b>\u201cDescription\u201d</b> section. </p> <p> Next is the post settings screen. You can choose which blog you will be posting to, and how to post it: Publish post at a specified time, Queue to add the post to your queue, Draft to send the post to your drafts, and Private to make a private post only you can see. </p> <p> When selecting <b>\u201cPublish\u201d</b>, you will be able to choose a date and time to show it. The time defaults to the current date and time. If you want to post now, just leave the settings where they are loaded at. There seems to be a bug with the Tumblr API that looks like this posting time is sometimes ignored. </p> <p> Click the <b>\u201cNext\u201d</b> button in the bottom right corner to preview your post. Clicking the <b>\u201cBack\u201d</b> button will bring you back to the <b>\u201cEnter Tags\u201d</b> section. </p> <p> The last screen before posting is a <b>preview screen</b>. Your post information is in the white box. You can scroll up and down to make sure everything is correct. If you notice something you want to change, just click the <b>\u201cBack\u201d</b> button to get back to the appropriate section. </p> <p> Once you are happy with your post, click the <b>\u201cPost\u201d</b> button in the bottom right corner to submit. A dialog will pop up saying it is posting. If you have a large number of images it may take a minute or two to process them. Once posted, it will resume back to what post you were viewing. If you were on your dashboard, it will force a reload of your dash so you can see the post you just made. If you weren\u2019t on your dashboard, your dashboard will auto-refresh when you go back to it. </p> '
            }, {
                kind: "HtmlContent",
                onLinkClick: "jumpLink",
                name: "mainmenu",
                classes: "help-section",
                allowHtml: !0,
                content: '<p class="help-header"> <b>Main Menu:</b> </p><p> Located in the bottom right corner is the main menu. Tap it, or drag it out from the side to open it. There will be a list of buttons. </p> <p> Buttons in the \u201cSettings\u201d section are: </p> <p> <b>\u201cEdit Categories\u201d</b> : This will bring up the edit categories screen, where you can create and edit categories, and add tags and users to those categories. <a href="editcats"> <u>See the <b>\u201cEdit Categories\u201d</b> section for more information.</u></a> <br/> <b>\u201cFollowers\u201d:</b> This will load the Followers/Following screen. <a href="followers"> <u>See <b>\u201cFollowers/Following View\u201d </b>section for more information.</u> </a> </p> <p> <b>\u201cSettings\u201d:</b> This will bring up the App Settings page. <a href="settings"> <u>See the <b>\u201cApp Settings\u201d</b> section for more information.</u></a> </p> <p> <b>\u201cOpen Browser\u201d: </b> This will open the current post in a browser window. </p> <p> <b>\u201cHelp\u201d:</b> Launches the help page. </p> <p> <b>\u201cLogin Info\u201d:</b> Select this to change your username or password. </p> <p> The buttons in the \u201cMode Options\u201d section will change depending on which view you are in. </p> <p> While browsing your dashboard, you will see: </p> <p> <b>\u201cLaunch Dash\u201d:</b> This will attempt to open your dashboard in your devices browser, to the post you are currently looking at. <u>This will not be able to scroll to the exact position of the post</u>, but you should be on the right page. This is useful if you want to reply to a post. </p> <p> <b>\u201cRefresh Posts\u201d:</b> This will reload the post and start you back at the beginning. (With new post if any\u2026) <br/> If you are in random mode, you will see: </p> <p> <b>\u201cRandomize\u201d:</b> This option will have blogWalker re-search out blogs and tags using the same random level as before. Note that you can only have 1 random category search going at once. </p> <p> If you have been in more than 1 mode, there will be a <b>\u201cHistory\u201d</b> button that you can select to see a list of all views you have looked at, and switch to any that you want. </p> <p> The last row of buttons is labeled <b>\u201cView Mode\u201d. </b>There are for different views you can be in. </p> <p> The first is <b>\u201cDashboard\u201d.</b> This will be the view that blogWalker starts at. If you are already viewing your dashboard, this button won\u2019t be displayed. <br/> The next button is <b>\u201cCategory\u201d.</b> Select this to choose a category to view. Once selected, you will be prompted with a list of your categories. Scroll the categories horizontally to view more. Tap the one you want to view, and then click the <b>\u201cExplore\u201d</b> button. </p> <p> The 3<sup>rd</sup> button is <b>\u201cTag Search\u201d.</b> Select this to search post by a tag. Once selected, you will be shown a prompt where you can type in the tag. You can click the <b>\u201cRecent\u201d </b>button to see a list of the last 10 searched tags, or you can click <b>\u201cRandom\u201d</b> to have blogWalker pick a random tag for you. Press the <b>\u201cExplore\u201d</b> button to search for posts. <br/> The last button is \u201cRandom\u201d. This view allows blogWalker to do all the work and find you cool stuff to look at. Selecting this will load up the <i><u>Random prompt</u></i>. </p> <p> There are 4 levels of random-ness. <b><i>Least random</i></b> searches through your dashboard posts for random names of blogs and will display these posts for you to browse. <b><i>More random</i></b> includes your followers in this random search. <b><i>Very random</i></b> will include random blogs pulled through a random search of your followers\u2019 posts. <b><i>Most random</i></b> will go through your followers\u2019 followers\u2019 posts for even more names of random blogs. Most random can take around 2-5 minutes to fully finish (depending on your internet speed), but you should get the most random posts. <br/> You can tap on each of the words to select the speed, or drag the slider located below the labels to your desired level. </p> <p> After you choose your random level, click the <b>\u201cExplore\u201d</b> button to being viewing. </p> <p> blogWalker will scour tumblr for blogs and then pull out random names. Then blogWalker will pull out some random tags, and add that to the list. And last, blogWalker will get all posts from the list of names and tags, sort them by date (newest to oldest) and then let you browse through them. </p>'
            }, {
                kind: "HtmlContent",
                onLinkClick: "jumpLink",
                name: "settings",
                classes: "help-section",
                allowHtml: !0,
                content: '<p class="help-header"><b>Settings:</b> </p><p> To get to the <i>App Settings screen</i>, open the \u201cMain Menu\u201d, and select the \u201cSettings\u201d button. There are 7 settings you can toggle: </p> <p> First is <b>\u201cGet note information\u201d</b>: <br/> Having this option ON will have blogWalker fetch the note information for posts when it can. This information refers to the <i>\u201ctumblr_user liked/reblogged this post\u201d</i> and also will retrieve any comments. blogWalker is not always able to get this information, so sometimes it will be unavailable. Generally, it will work when retrieving posts from a specific blog or your dashboard, but a \u201ctag search\u201d doesn\u2019t return any note information from tumblr. <br/> Having this option ON will make the request for posts take a few seconds longer. </p> <p> Next is <b>\u201cUse existing post tags when reblogging\u201d</b>: <br/> If this option is ON, when you reblog a post and it already has some tags, your reblogged post will have the same tags. If this option is OFF, your post will start with no tags. </p> <p> The third option is <b>\u201cPrompt to add tags when reblogging\u201d</b>: <br/> If this option is ON, whenever you reblog a post, a prompt will pop up for you to enter your own tags. Type a tag, and then press the comma (\u201c , \u201c) to add it to the list. If you don\u2019t want a tag, simply tap it to remove it from the list. </p> <p> If this option is OFF, blogWalker will reblog the post with no tags, unless the previous option (Use existing post tags when reblogging) is on, then it will be regblogged with the original post\u2019s tags. </p> <p> Next one is <b>\u201cDisplay all photos at once\u201d:</b> </p> <p> If this option is ON, all photos in a post will be loaded full-size onto the screen, instead of the default way that shows only 1 image at full size. Note that this can cause performance issues if there are a lot of images. Animated gif\u2019s can cause the phone to lag if there is more than 1 running. </p> <p> The fifth option is <b>\u201cUse in-app browser when viewing external pages\u201d:</b> </p> <p> If this option is ON, blogWalker will use a browser window in the app itself, instead of launching an external Internet browser. </p> <p> The sixth option is <b>\u201cAlways start a new session\u201d:</b> </p> <p> If this option is ON, the app will never ask you if you want to restore your previous session. For android, I would recommend leaving this option off. </p> <p> The last option is <b>\u201cUn-check this to allow the first time tutorial window to show on next app restart\u201d:</b> </p> <p> Un-checking this will force the first time use tutorial that was seen the first time you used the app to re-appear the next time blogWalker is loaded. </p> <p> Click the <b>\u201cSave\u201d</b> button once you have finished changing your settings. </p>'
            }, {
                kind: "HtmlContent",
                onLinkClick: "jumpLink",
                name: "blogmenu",
                classes: "help-section",
                allowHtml: !0,
                content: '<p class="help-header"> <b>Blog Menu:</b> </p><p> When you click on a <b>tumblr user name</b>, you will bring up this menu. <u>The bottom of the menu</u> will show the <b><i>user\u2019s blog name</i></b>. <br/> <b>To add this user to a category</b> , click on the \u201c<b>Add To</b>\u201d button. This will show a prompt with a list of all categories you have created, <i>and this user is not in</i>. Simply <b>tap the category</b> you want to add the user to, click the <b>\u201cAdd\u201d</b> button, and they will be added to that category. <br/> <i>If this user is in any of your categories already</i> , there will be a button called \u201c<b>Remove From</b>\u201d. Clicking this will open a prompt with a list of all categories this user has been added to. Select the one you want to remove the user from, click the <b>\u201cRemove\u201d</b> button, and they will be removed. <br/> The next button will either say <b>\u201cFollow\u201d</b> or <b>\u201cUnfollow\u201d</b>. blogWalker attempts to determine if you have followed a blog or not, but is not always able to tell. If blogWalker can\u2019t tell, the <b>\u201cFollow\u201d</b> button will be displayed. </p> <p> The bottom row has 3 buttons: </p> <p> <b>\u201cBrowser\u201d:</b> This will launch to the user\u2019s blog page <b>in the browser</b> on your device. <br/> <b>\u201cShare\u201d:</b> This will allow you to send a link to this user\u2019s blog page through <b>email, text messaging</b>, or <b><i>any other app installed on your device that supports sending messages</i></b>. </p> <p> The last option in the blog menu is \u201c<b>Explore</b>\u201d. Select this to view the <b>user\u2019s blog post</b> in <b>blogWalker</b>. <b><i><u>Don\u2019t worry, you can always go back to your previous view, so you can explore as much as you want.</u></i></b> </p> '
            }, {
                kind: "HtmlContent",
                onLinkClick: "jumpLink",
                name: "tagmenu",
                classes: "help-section",
                allowHtml: !0,
                content: '<p class="help-header"> <b>Tag Menu:</b> </p><p> The <b>tag menu</b> is similar to the <b>Blog Menu</b>. <b>Clicking on any tag</b> in a post will bring up the <b>tag menu</b>. <br/> <u>The bottom of the tag menu</u> will show what <b>tag</b> you are dealing with. <br/> <b>The first option is \u201c<u>Add To</u>\u201d:</b> Select this to see a list off all your categories this tag is not in, and select the one you want to add it to, and then press the <b>\u201cAdd\u201d</b> button. <br/> <i>If this tag is already in a category, there will be an option <b>\u201cRemove From\u201d.</b></i> Clicking this will show a list of all categories this tag is currently in, and selecting one, and then pressing the <b>\u201cRemove\u201d</b> button, will remove it from that category. <br/> <b> The last row has 3 buttons: <br/> \u201cBrowser\u201d: </b> This will launch to the tag view page on tumblr in the browser on your device. <br/> <b>\u201cShare\u201d:</b> This will allow you to send a link to this tag view page on tumblr through <b>email, text messaging</b>, or <b> <i> any other app installed on your device that supports sending messages. <br/> </i> And the last option is \u201c<u>Explore</u>\u201d: <br/> </b> This will have blogWalker search for all posts with <b>this tag</b> and show them to you. <b><i><u>Don\u2019t worry, you can always get back to what you were looking at before!</u></i></b> </p>'
            }, {
                kind: "HtmlContent",
                onLinkClick: "jumpLink",
                name: "editcats",
                classes: "help-section",
                allowHtml: !0,
                content: '<p class="help-header"><b>Edit Categories:</b> </p><p> To get to the Edit Categories screen, open the \u201cMain Menu\u201d and then click on \u201c<b>Edit Categories</b>\u201d in the top left corner. </p> <p> When loaded, you will see a list of all your <b>categories</b>. </p> <p> <b>Swipe</b> a category for more options: </p> <p> There will be 4 buttons on the swipe menu. </p> <p> <b>\u201cDelete\u201d:</b> This is delete the category. You will be prompted to confirm you want to actually delete the category. </p> <p> <b>\u201cEdit\u201d:</b> This allows you to edit what the category is named. You will be prompted with a text input to change the name. </p> <p> <b>\u201cCancel\u201d:</b> This closes the swipe menu. </p> <p> <b>\u201cExplore\u201d:</b> This lets you browse through the category. </p> <p> There are 3 buttons located at the bottom of the screen. </p> <p> <b>\u201cBack\u201d:</b> This exits the edit categories view. </p> <p> <b>\u201cImport\u201d:</b> Click this to import <b>categories</b> that are <u>programed into blogWalker</u>. This will <i>only</i> create and add <i>categories</i> and <i>blogs</i> that <u>do not</u> already exist, so it <u>will not</u> overwrite anything you have added. Updates to the app will include new categories, so it would be a good idea to click this every update if you want pre-defined categories. These are loaded by default when you first load the app. These will be updated with each release with new tags and blogs, and also more categories. So be sure to import them again on every update if you want to stay up to date. This makes it easy for you to start viewing cool content right away. If you have or know of a blog or tag that would work in a category, or even have a new idea for a category, send me an email at support@appsbychris.net. </p> <p> <b>\u201cAdd\u201d:</b> Click this to add a new category. You will be prompted with a text input to type out the name of your new category. </p> <p> <b>Tap </b> on a <b>category</b> and see and change what <b>tags</b> and <b>users </b>are in it. </p> <p> Once in a category, the category name will be listed at the top of the screen. Click the \u201cAdd\u201d button in the bottom right corner to add a user or tag. You will be prompted with a text input for you to type in. </p> <p> Click \u201cAdd\u201d, and blogWalker will first determine if there is a blog named what you typed, and if so, will prompt you again to verify if it is the user you want to add, or a tag name. </p> <p> Tap or Swipe on a user or tag for more options. </p> <p> Swipe options are: </p> <p> <b>\u201cRemove\u201d:</b> Select this to remove this user or tag from the category. You will be prompted to verify you really do want to remove the user or tag. </p> <p> <b>\u201cMove To\u201d:</b> Select this to move the user or tag to another category. You will be prompted with a list of categories. Select the one you want, and the click the <b>\u201cMove\u201d</b> button. </p> <p> <b>\u201cCancel\u201d:</b> This closes the swipe menu. </p> <p> <b>\u201cExplore:</b> This lets you browse through posts from that user or tag. </p> <p> Click the <b>\u201cBack\u201d</b> button to go back to your list of categories. </p>'
            }, {
                kind: "HtmlContent",
                onLinkClick: "jumpLink",
                name: "followers",
                classes: "help-section",
                allowHtml: !0,
                content: '<p class="help-header"> <b>Followers/Following View:</b> </p><p> To access your <b>followers</b> and <b>people you are following</b>, Open the \u201cMain Menu\u201d, and select \u201c<b>Followers</b>\u201d from the \u201cSettings\u201d section. The<u>first list of users</u> will be the <b>users you are following</b> (<i>Main blog only</i>). <u>Scroll the list up</u> to see more users<b>. When you get to the bottom of the list, drag it all the way up as far as you can, and you will see a \u201cPull up to load more\u2026\u201d message.</b> If you <b>keep pulling up</b>, the message will change to \u201c<b>Release to load more</b>\u201d. <b>When it changes, you can let go of the list</b>, and blogWalker will get the next batch of <b>followers</b>. If no more followers are present, no new users will be added. </p> <p> <b>To see your following list</b> , click on \u201c<b>Following</b>\u201d in the <u>top right</u>. The list functions the same way as the followers list. </p> <p> blogWalker will display the <b>users avatar</b>, <b>name</b>, and when they <b>last updated</b> their <b>blog</b>. <b>You can tap on any user to bring up the Blog Menu</b>. <a href="mainmenu"> <u>See the \u201c<b>Blog Menu</b>\u201d section for more information</u> .</a> </p> <p> In the <u>bottom left corner</u> is <b>\u201cBack\u201d</b> button. Click this to return to the previous screen. You can also click your devices back button if equipped. </p> '
            }, {
                style: "height:100px;"
            } ]
        } ]
    }, {
        classes: "cat-list-backer",
        style: "border-top:3px solid #333000;height: 80px;border-bottom:none;margin:0;",
        components: [ {
            kind: "onyx.TextIconButton",
            src: "assets/backicon.png",
            style: "margin-right: 5px;",
            ontap: "sendBack",
            label: "Back"
        }, {
            kind: "Control",
            style: "font-size:70%;height:20px;float:right;",
            components: [ {
                kind: "Image",
                classes: "no-limits",
                noEvents: !0,
                src: "assets/support/application-email.png",
                style: "width:15px;display:inline-block;margin-right:5px;"
            }, {
                content: "Email:",
                style: "display: inline-block;margin-right:5px;"
            }, {
                content: "support@appsbychris.net",
                style: "text-decoration:underline;color:#00BFFF;display:block;",
                ontap: "sendHelpEmail"
            } ]
        } ]
    } ],
    sendHelpEmail: function() {
        enyo.Signals.send("onRequestEmailHelp");
    },
    itemSelected: function() {
        return this.$.contain.scrollToControl(this.$[this.$.picker.selected.match], !0), 
        this.$.contain.setScrollTop(this.$.contain.getScrollTop() - 20), !0;
    },
    selectHelp: function(t) {
        return this.$.contain.scrollToControl(this.$[t], !0), this.$.contain.setScrollTop(this.$.contain.getScrollTop() - 20), 
        !0;
    },
    requestSupprt: function() {
        enyo.Signals.send("onRequestSupport");
    },
    sendBack: function() {
        enyo.Signals.send("onbackbutton");
    },
    jumpLink: function(t, e) {
        var i = e.url, n = i.lastIndexOf("/");
        return i = i.substr(n + 1), this.log(i), "emailhelp" != i ? (this.$.contain.scrollToControl(this.$[i], !0), 
        this.$.contain.setScrollTop(this.$.contain.getScrollTop() - 40)) : this.doRequestEmail(), 
        !0;
    },
    showMenuBtn: function() {
        this.$.toolBar.showMenuBtn();
    },
    setShowButton: function(t) {
        this.$.toolBar.setShowButton(t);
    },
    doneWithHelp: function() {
        enyo.Signals.send("onbackbutton"), enyo.Signals.send("onScrimHide");
    },
    create: function() {
        this.inherited(arguments), this.resizeHandler(), this.sizeMe({
            width: 250,
            height: 400
        });
    },
    origWidth: 0,
    origHeight: 0,
    resizeHandler: function() {
        this.inherited(arguments), (WND_HEIGHT() != this.origHeight || WND_WIDTH() != this.origWidth) && (this.origWidth = WND_WIDTH(), 
        this.origHeight = WND_HEIGHT(), this.sizeMe());
    },
    sizeMe: function(t) {
        t && this.$.contain.applyStyle("height", t.height - 80 + "px");
    }
});

// source\views\login\helppop.js
enyo.kind({
    name: "HelpPopup",
    classes: "post-background",
    floating: !0,
    events: {
        onComplete: "",
        onRequestEditCategories: ""
    },
    handlers: {
        onAnimateFinish: "checkOpen"
    },
    components: [ {
        kind: "HelpScreen",
        name: "helpScreen",
        onRequestEmail: "doRequestEmail"
    } ],
    selectedIndex: 0,
    create: function() {
        this.inherited(arguments);
    },
    openHelp: function(t) {
        this.resizeHandler(), this.$.helpScreen.selectHelp(t.help);
    },
    requestHelp: function() {
        enyo.Signals.send("onRequestHelp", {
            help: "viewmode"
        });
    },
    resizeHandler: function() {
        this.$.helpScreen.sizeMe({
            width: WND_WIDTH(),
            height: WND_HEIGHT() - 77
        }), this.applyStyle("width", WND_WIDTH() + "px"), this.applyStyle("height", WND_HEIGHT() + "px"), 
        this.inherited(arguments);
    }
});

// source\views\login\logindetails.js
enyo.kind({
    kind: "ToasterPopup",
    name: "LoginInfo",
    classes: "loginBack",
    floating: !0,
    autoDismiss: !1,
    centered: !0,
    align: "left",
    anchor: !1,
    modal: !0,
    style: "min-width:270px;max-width:" + (WND_WIDTH() - 75) + "px;height:355px;max-height:" + (WND_HEIGHT() - 10) + "px;",
    scrim: !1,
    events: {
        onComplete: ""
    },
    components: [ {
        kind: "FittableRows",
        name: "fitRow",
        style: "height:100%;355px;max-height:" + (WND_HEIGHT() - 10) + "px;",
        components: [ {
            kind: "android.Scroller",
            touchOverscroll: !1,
            name: "loginSettingsScroller",
            fit: !0,
            style: "width:100%;",
            horizontal: "hidden",
            components: [ {
                kind: "onyx.Groupbox",
                name: "groupbox",
                style: "",
                classes: "login-font-size",
                components: [ {
                    kind: "onyx.GroupboxHeader",
                    content: "Please enter your information:",
                    style: "height:45px;font-size:120%;"
                }, {
                    style: "padding:10px;",
                    components: [ {
                        content: "tumblr Login Email:"
                    }, {
                        kind: "Custom.InputDecorator",
                        style: "",
                        alwaysLookFocused: !0,
                        components: [ {
                            kind: "onyx.Input",
                            name: "tumblrLogin",
                            onfocus: "closeMenu",
                            placeholder: "tumblr Username (email)",
                            value: "",
                            style: "width:100%;",
                            type: "email"
                        } ]
                    } ]
                }, {
                    style: "padding:10px;",
                    components: [ {
                        content: "tumblr Password:"
                    }, {
                        kind: "Custom.InputDecorator",
                        style: "",
                        alwaysLookFocused: !0,
                        components: [ {
                            kind: "onyx.Input",
                            name: "tumblrPass",
                            onfocus: "closeMenu",
                            type: "password",
                            placeholder: "tumblr Password",
                            value: "",
                            style: "width:100%;"
                        } ]
                    } ]
                }, {
                    style: "padding:10px;",
                    components: [ {
                        content: "Don't have a tumblr.com account? No problem, sign up here:",
                        style: "display: inline-block;margin-right:5px;"
                    }, {
                        kind: "onyx.Button",
                        content: "Sign Up!",
                        ontap: "launchTumblrSignUp",
                        classes: "onyx-blue",
                        style: "display: inline-block;"
                    } ]
                } ]
            } ]
        }, {
            style: "border-top: 2px solid black;height:85px;",
            components: [ {
                kind: "onyx.TextIconButton",
                src: "assets/goicon.png",
                ontap: "saveSettings",
                label: "Save",
                style: "float:right;margin-top:5px;margin-right:5px;"
            }, {
                kind: "onyx.IconButton",
                src: "assets/helpbuttonicon.png",
                ontap: "requestHelp",
                style: "margin-right:20px;margin-top:45px;"
            }, {
                content: "Account Setup",
                style: "text-align:center;font-weight:bold;display:inline-block;"
            } ]
        } ]
    } ],
    launchTumblrSignUp: function() {
        enyo.Signals.send("onHandleLink", {
            url: "https://www.tumblr.com/register"
        });
    },
    sendBack: function() {
        enyo.Signals.send("onbackbutton");
    },
    requestHelp: function() {
        enyo.Signals.send("onRequestHelp", {
            help: "setup"
        });
    },
    resizeHandler: function() {
        this.applyStyle("max-width", WND_WIDTH() - 75 + "px"), this.applyStyle("max-height", WND_HEIGHT() - 10 + "px"), 
        this.applyStyle("height", "355px"), this.inherited(arguments), this.$.fitRow.applyStyle("max-height", WND_HEIGHT() - 10 + "px"), 
        this.$.fitRow.applyStyle("height", "355px"), this.$.fitRow.reflow();
    },
    showingChanged: function() {
        this.showing && (this.$.tumblrLogin.setValue(STORAGE.get("tumblrUserName") || ""), 
        this.$.tumblrPass.setValue(APPLICATION.lpw()), this.resizeHandler()), this.inherited(arguments);
    },
    saveSettings: function() {
        var t = this.$.tumblrLogin.getValue(), e = this.$.tumblrPass.getValue();
        STORAGE.set("tumblrUserName", t), APPLICATION.spw(e);
        var i = {
            u: APPLICATION.tumblrUserName,
            p: APPLICATION.tumblrPW
        };
        APPLICATION.tumblrUserName = t, APPLICATION.tumblrPW = e, (i.u != t || i.p != e) && (TUMBLR.deleteK(), 
        TUMBLR.resetUserObject()), this.doComplete({
            prevNames: i
        });
    }
});

// source\views\login\randompopup.js
enyo.kind({
    kind: "ToasterPopup",
    name: "RandomPopup",
    classes: "popup-backer reblog-back-shadow",
    floating: !1,
    align: "right",
    anchor: !0,
    autoDismiss: !0,
    centered: !1,
    modal: !0,
    scrim: !0,
    style: "width:270px;height:170px;",
    events: {
        onAccept: "",
        onCancel: ""
    },
    components: [ {
        style: "width:100%;text-align:center;margin-bottom:25px;",
        components: [ {
            style: "width:250px;",
            components: [ {
                content: "Least",
                name: "level1",
                classes: "view-mode-random view-mode-active",
                ontap: "selectLevel"
            }, {
                content: "More",
                name: "level2",
                classes: "view-mode-random view-mode-not",
                ontap: "selectLevel"
            }, {
                content: "Very",
                name: "level3",
                classes: "view-mode-random view-mode-not",
                ontap: "selectLevel"
            }, {
                content: "Most",
                name: "level4",
                classes: "view-mode-random view-mode-not",
                ontap: "selectLevel"
            }, {
                kind: "onyx.Slider",
                name: "slider",
                lockBar: !1,
                onChange: "stabilizeLevel",
                onChanging: "adjustLevel",
                onAnimateFinish: "stabilizeLevel",
                style: "width:200px;margin-left:20px;"
            } ]
        } ]
    }, {
        style: "border-top: 3px solid #333000;height:65px;padding-top:5px;",
        components: [ {
            kind: "onyx.TextIconButton",
            src: "assets/goicon.png",
            label: "Explore",
            style: "float:right;margin-right:5px;",
            ontap: "acceptClick",
            name: "confirmButton"
        }, {
            kind: "onyx.TextIconButton",
            src: "assets/cancelicon.png",
            label: "Cancel",
            ontap: "doCancel",
            style: "float:left;"
        }, {
            content: "How random?",
            style: "text-align:center;display:inline-block;padding-left:5px;padding-right:5px;font-size:90%;font-weight:bold;width:100px;",
            name: "msgContent"
        } ]
    }, {
        style: "position: absolute;left:110px;bottom:10px;",
        components: [ {
            kind: "onyx.IconButton",
            src: "assets/helpbuttonicon.png",
            ontap: "requestHelp",
            style: "margin-right:10px;"
        } ]
    } ],
    create: function() {
        this.inherited(arguments), this.setTop(WND_HEIGHT() - 190);
    },
    sendBack: function() {
        enyo.Signals.send("onbackbutton");
    },
    requestHelp: function() {
        enyo.Signals.send("onRequestHelp", {
            help: "random"
        });
    },
    showingChanged: function() {
        if (this.showing) {
            var t = STORAGE.get("tumblrRandomMode");
            t || (t = 0), t = parseInt(t, 10), isNaN(t) && (t = 0), this.$.slider.setValue(t), 
            this.stabilizeLevel();
        }
        this.inherited(arguments);
    },
    selectLevel: function(t) {
        var e = {
            level1: 0,
            level2: 25,
            level3: 50,
            level4: 75
        };
        this.$.slider.setValue(e[t.name]), this.stabilizeLevel();
    },
    applySelect: function(t) {
        for (var e = 1; 4 >= e; e++) e == t ? (this.$["level" + e].addClass("view-mode-active"), 
        this.$["level" + e].removeClass("view-mode-not")) : (this.$["level" + e].addClass("view-mode-not"), 
        this.$["level" + e].removeClass("view-mode-active"));
    },
    adjustLevel: function(t, e) {
        var i = e.value;
        25 > i ? this.applySelect(1) : i >= 25 && 50 > i ? this.applySelect(2) : i >= 50 && 75 > i ? this.applySelect(3) : i >= 75 && this.applySelect(4);
    },
    stabilizeLevel: function() {
        var t = this.$.slider.getValue();
        25 > t ? (this.applySelect(1), this.$.slider.setValue(0)) : t >= 25 && 50 > t ? (this.applySelect(2), 
        this.$.slider.setValue(35)) : t >= 50 && 75 > t ? (this.applySelect(3), this.$.slider.setValue(65)) : t >= 75 && (this.applySelect(4), 
        this.$.slider.setValue(100));
    },
    acceptClick: function() {
        APPLICATION.tumblrGetNotes = !0;
        var t = this.$.slider.getValue(), e = 0;
        t >= 25 && 50 > t ? e = 1 : t >= 50 && 75 > t ? e = 2 : t >= 75 && (e = 3), STORAGE.set("tumblrRandomMode", t), 
        APPLICATION.randomLevel = e, this.doAccept();
    }
});

// source\views\login\settingspop.js
enyo.kind({
    kind: "ToasterPopup",
    name: "SettingsPopup",
    classes: "loginBack reblog-back-shadow",
    floating: !0,
    align: "left",
    anchor: !1,
    autoDismiss: !0,
    centered: !0,
    modal: !0,
    scrim: !1,
    style: "min-width:270px;max-width:" + (WND_WIDTH() - 150) + "px;",
    events: {
        onComplete: ""
    },
    components: [ {
        kind: "android.Scroller",
        touchOverscroll: !1,
        thumb: !1,
        name: "scroller",
        style: "width:100%;",
        horizontal: "hidden",
        components: [ {
            kind: "onyx.Groupbox",
            style: "",
            classes: "login-font-size",
            components: [ {
                kind: "onyx.GroupboxHeader",
                content: "Select your preferences:",
                style: "height:45px;font-size:120%;"
            }, {
                kind: "Control",
                style: "padding:15px;",
                components: [ {
                    kind: "onyx.Checkbox",
                    style: "float: left;margin-right:5px;",
                    name: "getNotes"
                }, {
                    content: "Get note information.",
                    allowHtml: !0
                }, {
                    classes: "smallText",
                    content: "(Note information will not always be available.)"
                } ]
            }, {
                kind: "Control",
                style: "padding:15px;clear: left;",
                components: [ {
                    kind: "onyx.Checkbox",
                    style: "float: left;margin-right:5px;",
                    name: "useTags"
                }, {
                    content: "Use existing post tags when reblogging.",
                    allowHtml: !0
                } ]
            }, {
                kind: "Control",
                style: "padding:15px;clear: left;",
                components: [ {
                    kind: "onyx.Checkbox",
                    style: "float: left;margin-right:5px;",
                    name: "addTags"
                }, {
                    content: "Prompt to add tags when reblogging.",
                    allowHtml: !0
                } ]
            }, {
                kind: "Control",
                style: "padding:15px;clear: left;",
                components: [ {
                    kind: "onyx.Checkbox",
                    style: "float: left;margin-right:5px;",
                    name: "useAllPics"
                }, {
                    content: "Display all photos full size.",
                    allowHtml: !0
                }, {
                    classes: "smallText",
                    content: "(note: This may cause the app to perform slower.)"
                } ]
            }, {
                kind: "Control",
                style: "padding:15px;clear: left;",
                components: [ {
                    kind: "onyx.Checkbox",
                    style: "float: left;margin-right:5px;",
                    name: "useInApp"
                }, {
                    content: "Use in-app browser when viewing external pages.",
                    allowHtml: !0
                }, {
                    classes: "smallText",
                    content: "(Instead of launching another app to handle the web page, blogWalker will load the page up with-in the app itself.)"
                } ]
            }, {
                kind: "Control",
                style: "padding:15px;clear: left;",
                components: [ {
                    kind: "onyx.Checkbox",
                    style: "float: left;margin-right:5px;",
                    name: "newSession"
                }, {
                    content: "Always start a new session.",
                    allowHtml: !0
                } ]
            }, {
                kind: "Control",
                style: "padding:15px;clear: left;",
                components: [ {
                    kind: "onyx.Checkbox",
                    style: "float: left;margin-right:5px;",
                    name: "firstTimeRun"
                }, {
                    content: "Un-check this to allow the first time tutorial window to show on next app restart.",
                    allowHtml: !0
                } ]
            } ]
        } ]
    }, {
        style: "border-top: 2px solid black;height:85px;",
        components: [ {
            kind: "onyx.TextIconButton",
            src: "assets/goicon.png",
            ontap: "saveSettings",
            label: "Save",
            style: "float:right;margin-top:5px;margin-right:5px;"
        }, {
            kind: "onyx.IconButton",
            src: "assets/helpbuttonicon.png",
            ontap: "requestHelp",
            style: "margin-right:20px;margin-top:40px;"
        }, {
            content: "Settings",
            style: "text-align:center;font-weight:bold;display:inline-block;"
        } ]
    } ],
    sendBack: function() {
        enyo.Signals.send("onbackbutton");
    },
    requestHelp: function() {
        enyo.Signals.send("onRequestHelp", {
            help: "settings"
        });
    },
    showingChanged: function() {
        this.showing && this.loadFromHistory(), this.inherited(arguments);
    },
    resizeHandler: function() {
        this.applyStyle("max-width", WND_WIDTH() - 150 + "px"), this.applyStyle("height", WND_HEIGHT() - 50 + "px"), 
        this.$.scroller.applyStyle("height", WND_HEIGHT() - 130 + "px"), this.inherited(arguments);
    },
    loadFromHistory: function() {
        this.$.getNotes.setChecked(STORAGE.get("tumblrGetNotes") || !0), this.$.useTags.setChecked(STORAGE.get("tumblrUseTags") || !0), 
        this.$.addTags.setChecked(STORAGE.get("tumblrAddTags") || !0), this.$.useAllPics.setChecked(STORAGE.get("tumblrUseAllPics") || !1), 
        this.$.useInApp.setChecked(STORAGE.get("tumblrUseInApp") || !0), this.$.newSession.setChecked(STORAGE.get("tumblrNewSession") || !1), 
        this.$.firstTimeRun.setChecked(STORAGE.get("firstTimeRun") || !1);
    },
    saveJustSettings: function() {
        STORAGE.set("tumblrGetNotes", this.$.getNotes.getChecked()), STORAGE.set("tumblrUseTags", this.$.useTags.getChecked()), 
        STORAGE.set("tumblrAddTags", this.$.addTags.getChecked()), STORAGE.set("tumblrUseAllPics", this.$.useAllPics.getChecked()), 
        STORAGE.set("tumblrUseInApp", this.$.useInApp.getChecked()), STORAGE.set("tumblrNewSession", this.$.newSession.getChecked()), 
        STORAGE.set("firstTimeRun", this.$.firstTimeRun.getChecked());
    },
    setJustSettings: function() {
        APPLICATION.tumblrUseTags = this.$.useTags.getChecked(), APPLICATION.tumblrAddTags = this.$.addTags.getChecked(), 
        APPLICATION.tumblrGetNotes = this.$.getNotes.getChecked(), APPLICATION.tumblrUseAllPics = this.$.useAllPics.getChecked(), 
        APPLICATION.tumblrUseInApp = this.$.useInApp.getChecked(), APPLICATION.tumblrNewSession = this.$.newSession.getChecked();
    },
    saveSettings: function() {
        this.saveJustSettings(), this.setJustSettings(), this.doComplete();
    }
});

// source\views\login\tagselect.js
enyo.kind({
    kind: "ToasterPopup",
    name: "TagPopup",
    classes: "popup-backer reblog-back-shadow",
    align: "right",
    floating: !1,
    autoDismiss: !0,
    anchor: !0,
    modal: !0,
    scrim: !0,
    style: "width:270px;height:165px;",
    events: {
        onAccept: "",
        onCancel: ""
    },
    components: [ {
        kind: "onyx.PickerDecorator",
        style: "display:inline-block;",
        components: [ {
            kind: "onyx.TextIconButton",
            src: "assets/recenticon.png",
            label: "Recent",
            style: ""
        }, {
            kind: "onyx.Picker",
            name: "picker",
            style: "min-width:250px;",
            onChange: "enterTagName",
            components: []
        } ]
    }, {
        kind: "onyx.InputDecorator",
        style: "position:relative;top:-35px;margin-right:5px;margin-left:5px;",
        onfocus: "resizeHandler",
        alwaysLooksFocused: !0,
        components: [ {
            kind: "onyx.Input",
            name: "tagSearch",
            style: "width:107px;height:40px;display:inline-block;"
        } ]
    }, {
        kind: "onyx.TextIconButton",
        src: "assets/randomizeicon.png",
        label: "Random",
        style: "",
        ontap: "pickRandomTag"
    }, {
        style: "border-top: 3px solid #333000;height:65px;padding-top:5px;position:relative;top:-25px;",
        components: [ {
            kind: "onyx.TextIconButton",
            src: "assets/goicon.png",
            label: "Explore",
            style: "float:right;margin-right:5px;",
            ontap: "acceptClick",
            name: "confirmButton"
        }, {
            kind: "onyx.TextIconButton",
            src: "assets/cancelicon.png",
            label: "Cancel",
            ontap: "doCancel",
            style: "float:left;"
        }, {
            content: "Select or Enter a tag",
            style: "text-align:center;display:inline-block;padding-left:5px;padding-right:5px;font-size:90%;font-weight:bold;width:100px;",
            name: "msgContent"
        } ]
    }, {
        style: "position: absolute;bottom:10px;left:110px;",
        components: [ {
            kind: "onyx.IconButton",
            src: "assets/helpbuttonicon.png",
            ontap: "requestHelp",
            style: "margin-right:10px;"
        } ]
    } ],
    create: function() {
        this.inherited(arguments), this.setTop(WND_HEIGHT() - 185);
    },
    requestHelp: function() {
        enyo.Signals.send("onRequestHelp", {
            help: "tagsearch"
        });
    },
    showingChanged: function() {
        this.showing && (this.loadTags(), this.resizeHandler()), this.inherited(arguments);
    },
    loadTags: function() {
        var t = STORAGE.get("tumblrTags");
        if (t) {
            try {
                t = enyo.json.parse(t);
            } catch (e) {
                t = void 0;
            }
            t ? (this.tags = t, this.tags.reverse(), this.createItems()) : this.$.picker.destroyClientControls();
        }
    },
    createItems: function() {
        this.$.picker.destroyClientControls();
        var t = [], e = 0;
        for (e = 0; this.tags.length > e; e++) t.push({
            content: this.tags[e],
            style: "background: url(assets/tagicon" + (enyo.irand(5) + 1) + ".png) left center no-repeat; background-size:  32px 32px;padding-right:32px;"
        });
        this.$.picker.createComponents(t), this.$.picker.render();
    },
    pickRandomTag: function() {
        this.$.tagSearch.setValue(TAG_LIST[Math.floor(Math.random() * TAG_LIST.length)]);
    },
    enterTagName: function(t, e) {
        this.$.tagSearch.setValue(e.content);
    },
    acceptClick: function() {
        enyo.dom.hideKeyboard(this.$.tagSearch, this);
        var t = this.$.tagSearch.getValue();
        return 1 > t.length ? (this.$.msgContent.setContent("Enter a tag!"), void 0) : (this.doAccept({
            tag: t
        }), void 0);
    },
    origWidth: 0,
    origHeight: 0,
    resizeHandler: function() {
        this.inherited(arguments), (WND_HEIGHT() != this.origHeight || WND_WIDTH() != this.origWidth) && (this.origWidth = WND_WIDTH(), 
        this.origHeight = WND_HEIGHT(), this.setTop(WND_HEIGHT() - 185));
    }
});

// source\views\login\supportpop.js
enyo.kind({
    kind: "ToasterPopup",
    name: "SupportPopup",
    classes: "loginBack",
    floating: !0,
    align: "top",
    anchor: !1,
    autoDismiss: !1,
    centered: !0,
    modal: !0,
    scrim: !0,
    style: "min-width:270px;max-width:" + (WND_WIDTH() - 75) + "px;",
    events: {
        onComplete: ""
    },
    components: [ {
        kind: "android.Scroller",
        touchOverscroll: !1,
        name: "scroller",
        style: "width:100%;",
        horizontal: "hidden",
        components: [ {
            kind: "onyx.Groupbox",
            style: "",
            classes: "login-font-size",
            components: [ {
                kind: "onyx.GroupboxHeader",
                content: "Contact Information",
                style: "height:45px;font-size:120%;"
            }, {
                kind: "Control",
                style: "padding:15px;",
                components: [ {
                    kind: "Image",
                    classes: "no-limits",
                    noEvents: !0,
                    src: "assets/support/application-web.png",
                    style: "display:inline-block;margin-right:5px;"
                }, {
                    kind: "HtmlContent",
                    onLinkClick: "linkClick",
                    content: 'Website: <a href="http://www.appsbychris.net">AppsByChris.net</a>',
                    style: "display: inline-block;margin-right:5px;"
                } ]
            }, {
                kind: "Control",
                style: "padding:15px;",
                components: [ {
                    kind: "Image",
                    classes: "no-limits",
                    noEvents: !0,
                    src: "assets/support/application-email.png",
                    style: "display:inline-block;margin-right:5px;"
                }, {
                    content: "Email:",
                    style: "display: inline-block;margin-right:5px;"
                }, {
                    content: "support@appsbychris.net",
                    style: "text-decoration:underline;color:#00BFFF;display:inline-block;",
                    ontap: "sendHelpEmail"
                } ]
            }, {
                kind: "Control",
                style: "padding:15px;",
                components: [ {
                    content: "blogWalker: v1.5.01",
                    allowHtml: !0
                } ]
            }, {
                kind: "Control",
                style: "padding:15px;",
                components: [ {
                    content: "Please do not hesitate to email me with any questions or comments. Emails will be answered within 48hrs. If you have any problems, please try and describe how to recreate the problem so I can see what might have gone wrong.<br/><br/>This application uses the Tumblr application programming interface but is not endorsed or certified by Tumblr, Inc. All of the Tumblr logos and trademarks displayed on this application are the property of Tumblr, Inc.",
                    allowHtml: !0
                } ]
            } ]
        }, {
            style: "height:50px;"
        } ]
    }, {
        classes: "cat-list-backer",
        style: "border-top:3px solid #333000;height: 80px;border-bottom:none;margin:0;",
        components: [ {
            kind: "onyx.TextIconButton",
            src: "assets/goicon.png",
            style: "margin-right: 5px;float:right;",
            ontap: "saveSettings",
            label: "Done"
        }, {
            kind: "Image",
            classes: "no-limits",
            noEvents: !0,
            src: "assets/companylogo150.png",
            style: "display:inline-block;width:40px;height:40px;margin-top:15px;"
        }, {
            content: "Support",
            style: "text-align:center;font-weight:bold;margin-left:20px;position:relative;top:-10px;display:inline-block;"
        } ]
    } ],
    sendHelpEmail: function() {
        enyo.Signals.send("onRequestEmailHelp");
    },
    sendBack: function() {
        enyo.Signals.send("onbackbutton");
    },
    linkClick: function(t, e) {
        enyo.Signals.send("onHandleLink", {
            url: e.url
        });
    },
    resizeHandler: function() {
        this.applyStyle("max-width", WND_WIDTH() - 150 + "px"), this.applyStyle("height", WND_HEIGHT() - 100 + "px"), 
        this.$.scroller.applyStyle("height", WND_HEIGHT() - 150 + "px"), this.inherited(arguments);
    },
    saveSettings: function() {
        this.doComplete();
    }
});

// source\views\login\login.js
enyo.kind({
    name: "PeekLoginScreen",
    kind: "DropInView",
    events: {
        onRequestViewMode: ""
    },
    handlers: {
        ontap: "doRequestViewMode"
    },
    classes: "main-back enyo-fit",
    components: [ {
        content: "blogWalker - Powered By Tumblr",
        style: "font-size:80%;font-weight:bold;text-align:right;padding: 5px;color:white;"
    } ],
    showingChanged: function() {
        this.showing && this.doRequestViewMode();
    }
});

// source\views\items\items.js
enyo.kind({
    name: "PeekItemsScreen",
    kind: "DropInView",
    classes: "transform-3d",
    events: {
        onRequestNewItems: "",
        onRequestPrevItems: "",
        onNoteClicked: "",
        onRequestTagMenu: "",
        onRequestExpand: "",
        onRequestPostView: ""
    },
    style: "width:100%;overflow:hidden;",
    components: [ {
        kind: "SlideableSnapScroller",
        style: "height: " + WND_HEIGHT() + "px;",
        name: "contain",
        onTransitionStart: "closePopups",
        onTransitionNearFinish: "checkIndex",
        onTransitionFinish: "scrollScrollersToTop",
        onLoadingViewVisible: "requestNewItems",
        onLoadingViewHidden: "unScrimToolbars",
        onRenderError: "requestNewItems",
        loadingView: {
            kind: "PleaseWaitItem",
            name: "loadingScreen",
            style: "height: " + WND_HEIGHT() + "px;width:100%;padding-top:100px;"
        }
    }, {
        kind: "RightBottomToolbar",
        name: "toolBar"
    }, {
        kind: "PostingToolbar",
        name: "postOpener"
    } ],
    toggleLoadingView: function(t) {
        t === !1 && (this.sentRequest = !1), this.$.contain.loadingView.mode = t, this.$.contain.$.loadingView && this.$.contain.$.loadingView.modeChanged();
    },
    items: [],
    loading: !1,
    setItems: function(t) {
        this.loading = !0, enyo.Signals.send("onStatusUpdate", {
            msg: "Rendering..."
        }), this.$.contain.setItems(t, APPLICATION.actualIndex, !this.sentRequest), this.items = t, 
        this.resizeHandler(), this.loading = !1, setTimeout(enyo.bind(this, function() {
            this.$.contain.flowGifs();
        }), 3e3), this.sentRequest = !1;
    },
    sentRequest: !1,
    checkIndex: function(t, e) {
        if (this.loading !== !0) {
            var i = e.index;
            if (i >= 0 && this.items.length > i) {
                APPLICATION.actualIndex = i, STORAGE.set("tumblrLastPost", PEEK.string.toBase64(enyo.json.stringify(this.items[i]))), 
                STORAGE.set("tumblrActualIndex", APPLICATION.actualIndex), this.bubbleUp("onActualIndexChanged"), 
                i >= this.items.length - 10 && this.sentRequest === !1 && enyo.asyncMethod(this, function() {
                    this.requestNewItems();
                });
                for (var n = i - 3; i + 5 > n; n++) if (this.items[n] && this.items[n].post && this.items[n].post.needsExpand) {
                    this.doRequestExpand({
                        items: this.items,
                        file: this.items[n].post.inFile
                    });
                    break;
                }
            }
        }
    },
    requestNewItems: function() {
        this.sentRequest = !0, this.doRequestNewItems();
    },
    origWidth: 0,
    origHeight: 0,
    resizeHandler: function() {
        this.inherited(arguments), (WND_HEIGHT() != this.origHeight || WND_WIDTH() != this.origWidth) && (this.origWidth = WND_WIDTH(), 
        this.origHeight = WND_HEIGHT(), this.waterfallDown("onApplyResize"), this.$.contain.applyStyle("height", WND_HEIGHT() + "px"), 
        this.$.contain.recalculateSize());
    },
    twiddle: function() {
        this.$.contain.twiddle(), this.$.contain.setDirect();
    }
});

// source\views\followers.js
enyo.kind({
    kind: "DropInView",
    layoutKind: "FittableRowsLayout",
    name: "Followers",
    classes: "post-background enyo-fit",
    style: "font-size: 80%;",
    followers: [],
    following: [],
    events: {
        onFinished: "",
        onRequestMoreFollowers: "",
        onRequestMoreFollowing: ""
    },
    components: [ {
        kind: "Control",
        components: [ {
            classes: "cat-list-backer",
            style: "border-bottom:3px solid #333000;border-top:none;text-align: center;",
            components: [ {
                kind: "expandable.RadioGroup",
                name: "radio",
                onActivate: "radioActivated",
                style: "font-size:80%;margin-bottom:5px;display:inline-block;",
                components: [ {
                    content: "Followers",
                    active: !0
                }, {
                    content: "Following"
                } ]
            } ]
        }, {
            name: "followersList",
            classes: "",
            style: "",
            components: [ {
                kind: "custom.PullupList",
                onPullRelease: "pullRelease",
                onPullComplete: "pullComplete",
                name: "vListFollowers",
                onSetupItem: "setupRow",
                fixedHeight: !0,
                rowHeight: 109,
                pullingMessage: "Pull up to load more...",
                pulledMessage: "Release to load more...",
                style: "height:" + (WND_HEIGHT() - 155) + "px;width:100%;",
                components: [ {
                    kind: "android.Item",
                    classes: "cat-list-item",
                    name: "followerItem",
                    style: "clear:both;height:95px;",
                    ontap: "openBlogMenuFollowers",
                    components: [ {
                        kind: "Image",
                        name: "avatarFollowers",
                        style: "height:50px;margin-right: 8px;float: left;",
                        classes: "no-limits"
                    }, {
                        name: "blog_nameFollowers",
                        style: "float:left;"
                    }, {
                        name: "lastUpdateFollowers",
                        style: "clear:both;display:block;margin-left:64px;font-size:65%;position:relative;top:-20px;"
                    } ]
                } ]
            } ]
        }, {
            name: "followingList",
            showing: !1,
            classes: "",
            style: "",
            components: [ {
                kind: "custom.PullupList",
                onPullRelease: "pullReleaseFollowing",
                onPullComplete: "pullCompleteFollowing",
                name: "vListFollowing",
                onSetupItem: "setupRowFollowing",
                pullingMessage: "Pull up to load more...",
                pulledMessage: "Release to load more...",
                fixedHeight: !0,
                rowHeight: 109,
                style: "height:" + (WND_HEIGHT() - 155) + "px;width:100%;",
                components: [ {
                    kind: "android.Item",
                    name: "followingItem",
                    classes: "cat-list-item",
                    style: "clear:both;height:95px;",
                    ontap: "openBlogMenuFollowing",
                    components: [ {
                        kind: "Image",
                        name: "avatarFollowing",
                        style: "height:50px;margin-right: 8px;float: left;",
                        classes: "no-limits"
                    }, {
                        name: "blog_nameFollowing",
                        style: "float:left;"
                    }, {
                        name: "lastUpdateFollowing",
                        style: "clear:both;display:block;margin-left:64px;font-size:65%;position:relative;top:-20px;"
                    } ]
                } ]
            } ]
        }, {
            classes: "cat-list-backer",
            style: "border-top:3px solid #333000;",
            components: [ {
                kind: "onyx.TextIconButton",
                src: "assets/backicon.png",
                style: "",
                ontap: "doFinished",
                label: "Back"
            } ]
        } ]
    } ],
    pullRelease: function() {
        this.doRequestMoreFollowers();
    },
    addMoreFollowers: function(t) {
        this.followers = t, this.$.vListFollowers.setCount(this.followers.length), this.$.vListFollowers.completePull();
    },
    pullComplete: function() {
        this.$.vListFollowers.refresh();
    },
    pullReleaseFollowing: function() {
        this.doRequestMoreFollowing();
    },
    addMoreFollowing: function(t) {
        this.following = t, this.$.vListFollowing.setCount(this.following.length), this.$.vListFollowing.completePull();
    },
    pullCompleteFollowing: function() {
        this.$.vListFollowing.refresh();
    },
    setupRow: function(t, e) {
        var i = LIMIT_TEXT_LENGTH(this.followers[e.index].name, WND_WIDTH() - 75);
        this.$.blog_nameFollowers.setContent(i), this.$.avatarFollowers.setSrc(TUMBLR.getAvatar(this.followers[e.index].name, 40));
        var n = function(t) {
            return DATE_FORMAT(new Date(t), "dddd, mmmm dd, yyyy, hh:nn a/p");
        };
        return this.$.lastUpdateFollowers.setContent("Last updated: " + n(1e3 * Number(this.followers[e.index].updated))), 
        this.selectedIndex == e.index ? this.$.followerItem.addClass("onyx-highlight") : this.$.followerItem.removeClass("onyx-highlight"), 
        !0;
    },
    setupRowFollowing: function(t, e) {
        var i = LIMIT_TEXT_LENGTH(this.following[e.index].name, WND_WIDTH() - 75);
        this.$.blog_nameFollowing.setContent(i), this.$.avatarFollowing.setSrc(TUMBLR.getAvatar(this.following[e.index].name, 40));
        var n = function(t) {
            return DATE_FORMAT(new Date(t), "dddd, mmmm dd, yyyy, hh:nn a/p");
        };
        return this.$.lastUpdateFollowing.setContent("Last updated: " + n(1e3 * Number(this.following[e.index].updated))), 
        this.selectedFollowingIndex == e.index ? this.$.followingItem.addClass("onyx-highlight") : this.$.followingItem.removeClass("onyx-highlight"), 
        !0;
    },
    selectedIndex: -1,
    selectedFollowingIndex: -1,
    openBlogMenuFollowers: function(t, e) {
        enyo.Signals.send("onRequestBlogMenu", {
            blog_name: this.followers[e.index].name,
            top: e.pageY,
            left: e.pageX,
            followed: !1
        });
    },
    openBlogMenuFollowing: function(t, e) {
        enyo.Signals.send("onRequestBlogMenu", {
            blog_name: this.following[e.index].name,
            top: e.pageY,
            left: e.pageX,
            followed: !0
        });
    },
    updateFollowers: function(t) {
        this.followers = t, this.$.vListFollowers.setCount(this.followers.length), this.$.vListFollowers.refresh();
    },
    updateFollowing: function(t) {
        this.following = t, this.$.vListFollowing.setCount(this.following.length), this.$.vListFollowing.refresh();
    },
    radioActivated: function() {
        var t = this.$.radio.getActive().getContent();
        return "Followers" == t ? (this.$.followingList.hide(), this.$.followersList.show(), 
        this.$.vListFollowers.refresh()) : "Following" == t && (this.$.followingList.show(), 
        this.$.followersList.hide(), this.$.vListFollowing.refresh()), !0;
    },
    origWidth: 0,
    origHeight: 0,
    resizeHandler: function() {
        this.inherited(arguments), (WND_HEIGHT() != this.origHeight || WND_WIDTH() != this.origWidth) && (this.origWidth = WND_WIDTH(), 
        this.origHeight = WND_HEIGHT(), this.$.vListFollowing.setStyle("height:" + (WND_HEIGHT() - 138) + "px;width:100%;"), 
        this.$.vListFollowers.setStyle("height:" + (WND_HEIGHT() - 138) + "px;width:100%;"));
    }
});

// source\views\posting.js
enyo.kind({
    name: "postSpinner",
    kind: "ToasterPopup",
    style: "color:black;width:280px;text-align:center;",
    classes: "captionBack",
    published: {
        statusMsg: "",
        icon: ""
    },
    floating: !0,
    centered: !0,
    align: "left",
    anchor: !1,
    scrim: !0,
    autoDismiss: !1,
    modal: !0,
    components: [ {
        kind: "onyx.Spinner",
        classes: "onyx-light",
        name: "spin",
        style: "background-size:32px 32px;width:32px;height:32px;"
    }, {
        content: "",
        allowHtml: !0,
        name: "msgHeader",
        style: "margin-top:10px;margin-bottom:10px;font-size:120%;letter-spacing:-1px;width:100%;"
    }, {
        kind: "FittableColumns",
        style: "width:100%;height: 64px;",
        name: "statusbox",
        showing: !1,
        components: [ {
            kind: "Image",
            name: "avatar",
            style: "margin-right: 8px;"
        }, {
            name: "statusmsg",
            style: "font-size:80%;letter-spacing:-1px;text-align:center;",
            allowHtml: !0
        } ]
    }, {
        name: "msg",
        style: "font-size:80%;letter-spacing:-1px;width:100%;"
    }, {
        name: "statusLabel",
        style: "font-size:55%;"
    }, {
        name: "countLabel",
        style: "font-size:55%;width:290px;",
        showing: !1
    }, {
        kind: "Signals",
        onStatusUpdate: "updateStatus",
        onCountUpdate: ""
    } ],
    running: !1,
    start: function() {
        this.running === !1 && (this.running = !0, this.$.msgHeader.setContent("Posting, please wait..."), 
        this.$.msg.setContent(""), this.show(), this.$.spin.show()), this.resized();
    },
    updateCount: function(t, e) {
        return this.running === !0 && e && e.msg && (this.$.countLabel.setContent(e.msg), 
        this.$.countLabel.show()), !0;
    },
    stop: function() {
        this.running && (this.running = !1, this.hide());
    },
    updateStatus: function(t, e) {
        return this.running === !0 && e && e.msg && this.$.statusLabel.setContent(e.msg), 
        !0;
    },
    statusMsgChanged: function() {
        this.$.statusmsg.setContent(this.statusMsg);
    }
}), enyo.kind({
    kind: "FittableRows",
    name: "PhotoPreview",
    components: [],
    create: function() {
        this.inherited(arguments), this.loadPreview();
    },
    loadPreview: function() {
        if (this.srcs && this.srcs.length > 0) {
            for (var t = [], e = {}, i = 0; this.srcs.length > i; i++) e = {
                kind: "Image",
                noEvents: !0,
                style: "border: none !important;border-radius: 0px !important;",
                src: this.srcs[i]
            }, t.push(e);
            var n = {
                style: "text-align:center;width:100%;",
                components: t
            };
            this.createComponent(n, {
                owner: this
            });
        }
        this.caption && this.caption.length > 0 && this.createComponent({
            content: this.caption,
            allowHtml: !0,
            classes: "text-preview-body"
        }, {
            owner: this
        }), this.tags && this.tags.length > 0 && this.createComponent({
            content: "Tags: " + this.tags.join(", "),
            allowHtml: !0,
            classes: "preview-tags"
        }, {
            owner: this
        }), this.postinfo && this.postinfo.length > 0 && this.createComponent({
            content: this.postinfo,
            allowHtml: !0,
            classes: "preview-post-info"
        }, {
            owner: this
        }), this.render();
    }
}), enyo.kind({
    kind: "FittableRows",
    name: "TextPreview",
    components: [],
    create: function() {
        this.inherited(arguments), this.loadPreview();
    },
    loadPreview: function() {
        if (this.title && this.title.length > 0) {
            var t = {
                content: this.title,
                allowHtml: !0,
                classes: "text-preview-title"
            };
            this.createComponent(t, {
                owner: this
            });
        }
        this.caption && this.caption.length > 0 && this.createComponent({
            content: this.caption,
            allowHtml: !0,
            classes: "text-preview-body"
        }, {
            owner: this
        }), this.tags && this.tags.length > 0 && this.createComponent({
            content: "Tags: " + this.tags.join(", "),
            allowHtml: !0,
            classes: "preview-tags"
        }, {
            owner: this
        }), this.postinfo && this.postinfo.length > 0 && this.createComponent({
            content: this.postinfo,
            allowHtml: !0,
            classes: "preview-post-info"
        }, {
            owner: this
        }), this.render();
    }
}), enyo.kind({
    name: "DragImage",
    published: {
        src: ""
    },
    handlers: {
        ontap: "imageTap",
        ondragstart: "imageDragStart",
        ondrag: "imageDrag",
        ondragfinsih: "imageDragFinish"
    },
    events: {
        onTouch: "",
        onDragging: ""
    },
    components: [ {
        kind: "Image",
        classes: "no-limits"
    } ],
    setSrc: function(t, e, i) {
        null != e && null != i && (this.$.image.applyStyle("width", e + "px"), this.$.image.applyStyle("height", i + "px"), 
        this.resized()), this.src = t, this.$.image.setSrc(this.src);
    },
    imageDragStart: function() {
        this.imageDragging = !0;
    },
    imageDrag: function(t, e) {
        this.imageDragging && (e.isdragging = !0, this.doDragging(e));
    },
    getSrc: function() {
        return this.src;
    },
    imageDragFinish: function() {
        this.imageDragging = !1;
    },
    imageTap: function(t, e) {
        e.isdragging = !0, this.doTouch(e);
    },
    create: function() {
        this.inherited(arguments), this.srcChanged();
    }
}), enyo.kind({
    name: "CropOverlay",
    style: "position:absolute;top:0;left:0;-webkit-transform: translate3d(0,0,0);white-space:nowrap;overflow:hidden;",
    published: {
        src: ""
    },
    handlers: {
        ontap: "imageTap",
        ondragstart: "imageDragStart",
        ondrag: "imageDrag",
        ondragfinsih: "imageDragFinish"
    },
    events: {
        onTouch: "",
        onDragging: ""
    },
    components: [ {
        name: "topDiv",
        style: "box-sizing: border-box;background:black;opacity:0.8;-webkit-transform: translate3d(0,0,0);"
    }, {
        name: "leftDiv",
        style: "box-sizing: border-box;display: inline-block;background:black;opacity:0.8;-webkit-transform: translate3d(0,0,0);"
    }, {
        name: "cropDiv",
        style: "box-sizing: border-box;display: inline-block;-webkit-transform: translate3d(0,0,0);",
        ongesturechange: "gestureTransform",
        ongestureend: "saveState",
        ondblclick: "doubleClick",
        onmousewheel: "mousewheel"
    }, {
        name: "rightDiv",
        style: "box-sizing: border-box;display: inline-block;background:black;opacity:0.8;-webkit-transform: translate3d(0,0,0);"
    }, {
        name: "bottomDiv",
        style: "box-sizing: border-box;background:black;opacity:0.8;margin-top:" + (enyo.platform.android ? "-4" : "-7") + "px;-webkit-transform: translate3d(0,0,0);"
    } ],
    imageDragStart: function() {
        this.imageDragging = !0;
    },
    imageDrag: function(t, e) {
        this.imageDragging && !this.gesture && this.applyTransform(e);
    },
    applyTransform: function(t) {
        var e = t.ddx, i = t.ddy;
        if (t.sizeChange === !0) {
            var n = this.imageBounds, o = (n.height - this.$.cropDiv.d.height) / 2;
            this.$.topDiv.addStyles("height:" + o + "px;width:" + n.width + "px;"), this.$.topDiv.d = {
                height: o,
                width: n.width
            }, this.$.bottomDiv.addStyles("height:" + o + "px;width:" + n.width + "px;"), this.$.bottomDiv.d = {
                height: o,
                width: n.width
            };
            var s = (n.width - this.$.cropDiv.d.width) / 2, a = n.height - 2 * o;
            this.$.leftDiv.addStyles("width:" + s + "px;height:" + a + "px;"), this.$.leftDiv.d = {
                height: a,
                width: s
            }, this.$.rightDiv.addStyles("width:" + s + "px;height:" + a + "px;"), this.$.rightDiv.d = {
                height: a,
                width: s
            };
        }
        var r = this.$.rightDiv.d.width - e;
        r = Math.max(0, r), r = Math.min(r, this.imageBounds.width - this.$.cropDiv.d.width);
        var o, s;
        this.$.rightDiv.applyStyle("width", r + "px;"), this.$.rightDiv.d.width = r;
        var h = this.$.leftDiv.d.width + e;
        h = Math.max(0, h), h = Math.min(h, this.imageBounds.width - this.$.cropDiv.d.width), 
        this.$.leftDiv.applyStyle("width", h + "px;"), this.$.leftDiv.d.width = h;
        var l = this.$.bottomDiv.d.height - i;
        l = Math.max(0, l), l = Math.min(l, this.imageBounds.height - this.$.cropDiv.d.height), 
        this.$.bottomDiv.applyStyle("height", l + "px;"), this.$.bottomDiv.d.height = l;
        var c = this.$.topDiv.d.height + i;
        c = Math.max(0, c), c = Math.min(c, this.imageBounds.height - this.$.cropDiv.d.height), 
        this.$.topDiv.applyStyle("height", c + "px;"), this.$.topDiv.d.height = c;
    },
    gestureTransform: function(t, e) {
        this.gesture = !0, this.transformImage(e.scale);
    },
    saveState: function() {
        this.gesture = !1, this.imageDragging = !1;
    },
    prevScale: 0,
    transformImage: function(t) {
        var e, i, n = this.prevScale;
        if (this.prevScale = t, t > 1 && t > n) {
            if (this.$.cropDiv.d.height == this.maxY) return;
            e = this.$.cropDiv.d.height + this.scaleRate, e = Math.min(e, this.maxY), i = this.$.cropDiv.d.width + this.scaleRate, 
            i = Math.min(i, this.maxX), this.$.cropDiv.d.height = e, this.$.cropDiv.d.width = i, 
            this.$.cropDiv.addStyles("width:" + i + "px;height:" + e + "px;");
            var o = this.$.topDiv.d.height;
            o -= this.scaleRate / 2, o = Math.max(0, o), o = Math.min(o, this.imageBounds.height - this.$.cropDiv.d.height), 
            this.$.topDiv.d.height = o, this.$.topDiv.applyStyle("height", o + "px");
            var s = this.$.bottomDiv.d.height;
            s -= this.scaleRate / 2, s = Math.max(0, s), s = Math.min(s, this.imageBounds.height - this.$.cropDiv.d.height), 
            this.$.bottomDiv.d.height = s, this.$.bottomDiv.applyStyle("height", s + "px");
            var a = this.$.leftDiv.d.width;
            a -= this.scaleRate / 2, a = Math.max(0, a), a = Math.min(a, this.imageBounds.width - this.$.cropDiv.d.width - this.$.rightDiv.d.width), 
            this.$.leftDiv.d = {
                width: a,
                height: e
            }, this.$.leftDiv.addStyles("width:" + a + "px;height:" + e + "px;");
            var r = this.$.rightDiv.d.width;
            r -= this.scaleRate / 2, r = Math.max(0, r), r = Math.min(r, this.imageBounds.width - this.$.cropDiv.d.width - a), 
            this.$.rightDiv.d = {
                width: r,
                height: e
            }, this.$.rightDiv.addStyles("width:" + r + "px;height:" + e + "px;");
        } else {
            if (this.$.cropDiv.d.height == this.minY) return;
            e = this.$.cropDiv.d.height - this.scaleRate, e = Math.max(e, this.minY), i = this.$.cropDiv.d.width - this.scaleRate, 
            i = Math.max(i, this.minX), this.$.cropDiv.d.height = e, this.$.cropDiv.d.width = i, 
            this.$.cropDiv.addStyles("width:" + i + "px;height:" + e + "px;");
            var o = this.$.topDiv.d.height;
            o += this.scaleRate / 2, o = Math.max(0, o), o = Math.min(o, this.imageBounds.height - this.$.cropDiv.d.height), 
            this.$.topDiv.d.height = o, this.$.topDiv.applyStyle("height", o + "px");
            var s = this.$.bottomDiv.d.height;
            s += this.scaleRate / 2, s = Math.max(0, s), s = Math.min(s, this.imageBounds.height - this.$.cropDiv.d.height), 
            this.$.bottomDiv.d.height = s, this.$.bottomDiv.applyStyle("height", s + "px");
            var a = this.$.leftDiv.d.width;
            a += this.scaleRate / 2, a = Math.max(0, a), a = Math.min(a, this.imageBounds.width - this.$.cropDiv.d.width - this.$.rightDiv.d.width), 
            this.$.leftDiv.d = {
                width: a,
                height: e
            }, this.$.leftDiv.addStyles("width:" + a + "px;height:" + e + "px;");
            var r = this.$.rightDiv.d.width;
            r += this.scaleRate / 2, r = Math.max(0, r), r = Math.min(r, this.imageBounds.width - this.$.cropDiv.d.width - a), 
            this.$.rightDiv.d = {
                width: r,
                height: e
            }, this.$.rightDiv.addStyles("width:" + r + "px;height:" + e + "px;");
        }
    },
    getCrop: function() {
        return this.$.cropDiv.getBounds();
    },
    mousewheel: function(t, e) {
        return e.wheelDelta > 0 || 0 > e.detail ? this.transformImage(2) : (0 > e.wheelDelta || e.detail > 0) && this.transformImage(0), 
        e.preventDefault(), !0;
    },
    doubleClick: function() {
        h = this.$.cropDiv.d.height + 10, h = Math.min(h, this.maxY), w = this.$.cropDiv.d.width + 10, 
        w = Math.min(w, this.maxX), b = !0, this.$.cropDiv.d.height = h, this.$.cropDiv.d.width = w, 
        this.$.cropDiv.addStyles("width:" + w + "px;height:" + h + "px;"), this.applyTransform({
            ddx: -10,
            ddy: -10,
            sizeChange: !0
        });
    },
    imageDragFinish: function() {
        this.imageDragging = !1;
    },
    imageTap: function(t, e) {
        e.isdragging = !0, this.doTouch(e);
    },
    scaleRate: 2,
    cropX: 100,
    cropY: 100,
    maxX: 200,
    maxY: 200,
    minX: 75,
    minY: 75,
    setArea: function(t) {
        this.imageBounds = t, this.addStyles("top:" + t.top + "px;left:" + t.left + "px;"), 
        t.height > t.width ? (this.maxX = t.width, this.maxY = t.width, this.minX = Math.floor(t.width / 2), 
        this.minY = this.minX) : (this.maxX = t.height, this.maxY = t.height, this.minX = Math.floor(t.height / 2), 
        this.minY = this.minX), this.cropX = this.maxX, this.cropY = this.maxY, this.$.cropDiv.addStyles("width:" + this.cropX + "px;height:" + this.cropY + "px;"), 
        this.$.cropDiv.d = {
            height: this.cropY,
            width: this.cropX
        };
        var e = (t.height - this.cropY) / 2;
        this.$.topDiv.addStyles("height:" + e + "px;width:" + t.width + "px;"), this.$.topDiv.d = {
            height: e,
            width: t.width
        }, this.$.bottomDiv.addStyles("height:" + e + "px;width:" + t.width + "px;"), this.$.bottomDiv.d = {
            height: e,
            width: t.width
        };
        var i = (t.width - this.cropX) / 2, n = t.height - 2 * e;
        this.$.leftDiv.addStyles("width:" + i + "px;height:" + n + "px;"), this.$.leftDiv.d = {
            height: n,
            width: i
        }, this.$.rightDiv.addStyles("width:" + i + "px;height:" + n + "px;"), this.$.rightDiv.d = {
            height: n,
            width: i
        };
    }
}), enyo.kind({
    name: "BackNextButtton",
    published: {
        posttype: "",
        nextLabel: "Next",
        nextSrc: "assets/nexticon.png"
    },
    events: {
        onNext: "",
        onBack: ""
    },
    style: "height: 80px;padding:5px;border-top:3px ridge #333333;",
    classes: "header-bg",
    components: [ {
        kind: "onyx.TextIconButton",
        src: "assets/nexticon.png",
        style: "float:right;",
        ontap: "doNext",
        name: "btnNext",
        label: "Next"
    }, {
        kind: "onyx.TextIconButton",
        src: "assets/backicon.png",
        style: "float:left;",
        ontap: "doBack",
        label: "Back"
    } ],
    create: function() {
        this.inherited(arguments), this.nextLabelChanged(), this.nextSrcChanged();
    },
    nextLabelChanged: function() {
        this.$.btnNext.setLabel(this.nextLabel);
    },
    nextSrcChanged: function() {
        this.$.btnNext.setSrc(this.nextSrc);
    }
}), enyo.kind({
    layoutKind: "FittableRowsLayout",
    name: "PositingView",
    classes: "post-background enyo-fit post-view",
    style: "font-size: 80%;overflow: hidden;",
    events: {
        onFinished: ""
    },
    components: [ {
        kind: "SmoothPanels",
        components: [ {
            name: "photoPost",
            components: [ {
                kind: "FittableRows",
                style: "height:100%;",
                components: [ {
                    content: "Take or add up to " + (enyo.platform.blackberry ? 5 : 10) + " pictures",
                    name: "picHeader",
                    classes: "posting-header header-bg"
                }, {
                    kind: "android.List",
                    classes: "captionBack photo-list",
                    fit: !0,
                    name: "picList",
                    touchOverscroll: !1,
                    reorderable: !0,
                    centerReorderContainer: !1,
                    noSelect: !0,
                    onSetupItem: "setupItem",
                    onReorder: "listReorder",
                    onSetupReorderComponents: "setupReorderComponents",
                    components: [ {
                        kind: "onyx.Item",
                        style: "border-bottom:3px ridge #333333;height:275px;",
                        components: [ {
                            style: "width:100%;text-align:center;",
                            components: [ {
                                kind: "Image",
                                name: "picImage",
                                style: "max-height:200px;",
                                classes: "no-limits"
                            } ]
                        }, {
                            style: "width:100%;",
                            components: [ {
                                kind: "Large.onyx.IconButton",
                                noResize: !0,
                                src: "assets/photodeleteicon.png",
                                ontap: "confirmDelete"
                            }, {
                                kind: "Large.onyx.IconButton",
                                noResize: !0,
                                src: "assets/photofiltericon.png",
                                ontap: "openEditPop",
                                style: "float:right;"
                            }, {
                                content: "None",
                                style: "float:right;font-size:80%;margin-top:12px;margin-right:5px;",
                                name: "photoFilter"
                            } ]
                        } ]
                    } ],
                    reorderComponents: [ {
                        kind: "onyx.Item",
                        classes: "item-highlight",
                        components: [ {
                            kind: "Image",
                            name: "reorderImage",
                            classes: "no-limits"
                        } ]
                    } ]
                }, {
                    style: "height: 80px;padding:5px;border-top:3px ridge #333333;",
                    classes: "header-bg",
                    components: [ {
                        kind: "onyx.TextIconButton",
                        src: "assets/nexticon.png",
                        style: "float:right;",
                        posttype: "photo",
                        ontap: "nextStep",
                        label: "Next"
                    }, {
                        kind: "onyx.TextIconButton",
                        src: "assets/cameraicon.png",
                        style: "float:right;margin-right:5px;",
                        ontap: "takePicture",
                        label: "Camera"
                    }, {
                        kind: "onyx.TextIconButton",
                        src: "assets/backicon.png",
                        style: "float:left;margin-right: 5px;",
                        ontap: "sendBack",
                        label: "Back"
                    }, {
                        kind: "onyx.TextIconButton",
                        src: "assets/chooseicon.png",
                        style: "float:left;",
                        ontap: "choosePicture",
                        label: "Gallery"
                    } ]
                } ]
            }, {
                style: "position:absolute;color:white;",
                name: "picScrim",
                showing: !1,
                components: [ {
                    content: "Take or add some pictures!",
                    style: "text-align: center;font-size: 140%;width: 100%;padding-top:10px;"
                } ]
            } ]
        }, {
            name: "textPost",
            components: [ {
                kind: "FittableRows",
                style: "height:100%;",
                components: [ {
                    content: "Enter A Title:",
                    classes: "posting-header header-bg"
                }, {
                    classes: "captionBack",
                    components: [ {
                        kind: "onyx.InputDecorator",
                        alwaysLooksFocused: !0,
                        style: "width: 93%;",
                        components: [ {
                            kind: "onyx.Input",
                            placeholder: "title...",
                            name: "postTitle",
                            style: "width: 100%"
                        } ]
                    }, {
                        style: "font-size: 70%;padding-top:10px;",
                        content: "The title is optional, if you do not want a title, just click next."
                    } ]
                }, {
                    fit: !0
                }, {
                    kind: "BackNextButtton",
                    posttype: "text",
                    onNext: "nextStep",
                    onBack: "sendBack"
                } ]
            } ]
        }, {
            name: "popPostContent",
            components: [ {
                kind: "FittableRows",
                style: "height:100%;",
                components: [ {
                    content: "Enter A Description:",
                    style: "border-bottom:3px ridge #333333;",
                    classes: "posting-header header-bg"
                }, {
                    kind: "android.Scroller",
                    horizontal: "hidden",
                    touchOverscroll: !1,
                    fit: !0,
                    components: [ {
                        classes: "captionBack",
                        style: "",
                        components: [ {
                            kind: "onyx.InputDecorator",
                            style: "",
                            alwaysLooksFocused: !0,
                            components: [ {
                                kind: "onyx.TextArea",
                                style: "width:" + (WND_WIDTH() - 75) + "px;height: 120px;",
                                name: "postContent"
                            } ]
                        } ]
                    } ]
                }, {
                    kind: "BackNextButtton",
                    posttype: "content",
                    onNext: "nextStep",
                    onBack: "sendBack"
                } ]
            } ]
        }, {
            name: "popTags",
            components: [ {
                kind: "FittableRows",
                style: "height:100%;",
                components: [ {
                    content: "Enter a tag and press the " + (enyo.dom.canUseEnter() ? "enter key" : "comma (,)") + " to add:",
                    style: "margin-bottom:3px;",
                    classes: "posting-header header-bg"
                }, {
                    kind: "android.Scroller",
                    horizontal: "hidden",
                    touchOverscroll: !1,
                    fit: !0,
                    components: [ {
                        classes: "captionBack",
                        style: "height:100px;",
                        components: [ {
                            kind: "enyo.TagInput",
                            name: "postTags",
                            style: "width:100%;max-height:80px;"
                        } ]
                    } ]
                }, {
                    kind: "BackNextButtton",
                    posttype: "tags",
                    onNext: "nextStep",
                    onBack: "sendBack"
                } ]
            } ]
        }, {
            name: "popPreview",
            components: [ {
                kind: "FittableRows",
                style: "height:100%;",
                components: [ {
                    content: "Preview your post...",
                    classes: "posting-header header-bg"
                }, {
                    kind: "android.Scroller",
                    horizontal: "hidden",
                    touchOverscroll: !1,
                    name: "previewScoller",
                    classes: "captionBack",
                    fit: !0,
                    style: "",
                    components: []
                }, {
                    kind: "BackNextButtton",
                    posttype: "post",
                    nextLabel: "Post",
                    nextSrc: "assets/posticon.png",
                    onNext: "nextStep",
                    onBack: "sendBack"
                } ]
            } ]
        }, {
            name: "popSettings",
            components: [ {
                kind: "FittableRows",
                style: "height:100%;",
                components: [ {
                    kind: "android.Scroller",
                    horizontal: "hidden",
                    touchOverscroll: !1,
                    fit: !0,
                    style: "text-align: center;",
                    components: [ {
                        content: "Which blog?",
                        classes: "posting-post-option"
                    }, {
                        kind: "onyx.PickerDecorator",
                        onChange: "pickerChanged",
                        components: [ {
                            style: "min-width:280px;",
                            name: "pickerButton"
                        }, {
                            kind: "onyx.Picker",
                            name: "blogPicker",
                            components: []
                        } ]
                    }, {
                        style: "border-bottom: 3px ridge #333333;"
                    }, {
                        content: "How to post?",
                        classes: "posting-post-option"
                    }, {
                        kind: "onyx.PickerDecorator",
                        components: [ {
                            style: "min-width:280px;"
                        }, {
                            kind: "onyx.Picker",
                            name: "publishPicker",
                            onSelect: "checkPublished",
                            components: [ {
                                content: "Publish",
                                active: !0,
                                publish: "published",
                                name: "defaultPublish"
                            }, {
                                content: "Queue",
                                publish: "queue"
                            }, {
                                content: "Draft",
                                publish: "draft"
                            }, {
                                content: "Private",
                                publish: "private"
                            } ]
                        } ]
                    }, {
                        style: "border-bottom: 3px ridge #333333;"
                    }, {
                        name: "timeField",
                        components: [ {
                            content: "When and what time?",
                            classes: "posting-post-option"
                        }, {
                            kind: "onyx.DatePicker",
                            name: "postDate"
                        }, {
                            kind: "onyx.TimePicker",
                            name: "postTime"
                        } ]
                    } ]
                }, {
                    kind: "BackNextButtton",
                    posttype: "settings",
                    onNext: "nextStep",
                    onBack: "sendBack"
                } ]
            } ]
        }, {
            name: "cropPop",
            components: [ {
                kind: "FittableRows",
                style: "height:100%;",
                name: "cropFitt",
                components: [ {
                    content: "Crop your image",
                    classes: "posting-header header-bg"
                }, {
                    style: "position:absolute;width:100%;",
                    name: "cropContain",
                    fit: !0,
                    components: [ {
                        kind: "Image",
                        onload: "setOverlay",
                        classes: "no-limits",
                        name: "cropPic",
                        style: "position:absolute;top:0;left:0;max-width:100%;max-height:90%;"
                    }, {
                        kind: "CropOverlay",
                        name: "cropper"
                    } ]
                }, {
                    name: "cropFitter"
                }, {
                    kind: "BackNextButtton",
                    posttype: "crop",
                    onNext: "nextStep",
                    onBack: "sendBack"
                } ]
            } ]
        }, {
            name: "editPop",
            components: [ {
                kind: "FittableRows",
                name: "editImageFitt",
                style: "height:100%",
                components: [ {
                    kind: "FittableRows",
                    fit: !0,
                    classes: "captionBack",
                    name: "editImageFitt2",
                    components: [ {
                        kind: "DragImage",
                        name: "editPic",
                        onTouch: "effectTouch",
                        onDragging: "effectTouch",
                        style: "text-align:center;width:100%;"
                    }, {
                        fit: !0
                    }, {
                        style: "border-bottom:3px ridge #333333;width:100%;"
                    }, {
                        kind: "onyx.ToggleButton",
                        name: "fullOrTouch",
                        onContent: "Full Picture",
                        showing: !1,
                        offContent: "On Touch",
                        value: !0,
                        style: "margin-top:5px;float:right;margin-bottom:5px;"
                    }, {
                        style: "height:75px;overflow:hidden;",
                        components: [ {
                            kind: "Slideable3d",
                            defaultKind: "onyx.65pxIcon",
                            kDragScalar: 1.6,
                            freeze: !0,
                            axis: "h",
                            unit: "px",
                            max: 0,
                            min: -1541,
                            name: "filterScroll",
                            style: "height:75px;white-space:nowrap;width:100%;font-size:70%;",
                            components: [ {
                                name: "noneFilter",
                                classes: "filter-item",
                                src: "assets/filters/noneicon.png",
                                ontap: "effectPicture",
                                label: "None",
                                effect: "none"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/oldtimeicon.png",
                                ontap: "effectPicture",
                                label: "Old Time",
                                effect: "oldtime"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/glowicon.png",
                                ontap: "effectPicture",
                                label: "Glow",
                                effect: "glow"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/brighticon.png",
                                ontap: "effectPicture",
                                label: "Bright",
                                effect: "bright"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/dullicon.png",
                                ontap: "effectPicture",
                                label: "Dull",
                                effect: "dull"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/contrasticon.png",
                                ontap: "effectPicture",
                                label: "Contrast",
                                effect: "contrast"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/enhanceicon.png",
                                ontap: "effectPicture",
                                label: "Enhance",
                                effect: "enhance"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/drawicon.png",
                                ontap: "effectPicture",
                                label: "Draw",
                                effect: "draw"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/sepiaicon.png",
                                ontap: "effectPicture",
                                label: "Sepia",
                                effect: "sepia"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/sunspoticon.png",
                                ontap: "effectPicture",
                                label: "Sun Spot",
                                effect: "sunspot"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/popicon.png",
                                ontap: "effectPicture",
                                label: "Pop",
                                effect: "pop"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/bwicon.png",
                                ontap: "effectPicture",
                                label: "B & W",
                                effect: "blackwhite"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/yellaicon.png",
                                ontap: "effectPicture",
                                label: "Yella",
                                effect: "yella"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/darkenicon.png",
                                ontap: "effectPicture",
                                label: "Darken",
                                effect: "darken"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/sunnyicon.png",
                                ontap: "effectPicture",
                                label: "Sunny",
                                effect: "sunny"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/bluemoonicon.png",
                                ontap: "effectPicture",
                                label: "Blue Moon",
                                effect: "bluemoon"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/coolicon.png",
                                ontap: "effectPicture",
                                label: "Cool",
                                effect: "cool"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/warmicon.png",
                                ontap: "effectPicture",
                                label: "Warm",
                                effect: "warm"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/burnicon.png",
                                ontap: "effectPicture",
                                label: "Burned",
                                effect: "burned"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/defineicon.png",
                                ontap: "effectPicture",
                                label: "Define",
                                effect: "define"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/embossicon.png",
                                ontap: "effectPicture",
                                label: "Emboss",
                                effect: "emboss"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/linesicon.png",
                                ontap: "effectPicture",
                                label: "Lines",
                                effect: "lines"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/thresholdicon.png",
                                ontap: "effectPicture",
                                label: "Threshold",
                                effect: "threshold"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/solarizeicon.png",
                                ontap: "effectPicture",
                                label: "Solarize",
                                effect: "solarize"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/inverticon.png",
                                ontap: "effectPicture",
                                label: "Invert",
                                effect: "invert"
                            }, {
                                classes: "filter-item",
                                src: "assets/filters/bluricon.png",
                                ontap: "effectPicture",
                                label: "Blur",
                                effect: "blur"
                            } ]
                        } ]
                    } ]
                }, {
                    style: "height: 80px;padding:5px;border-top:3px ridge #333333;text-align: center;",
                    classes: "header-bg",
                    components: [ {
                        kind: "onyx.TextIconButton",
                        src: "assets/backicon.png",
                        style: "float:left;",
                        ontap: "sendBack",
                        label: "Back"
                    }, {
                        kind: "onyx.TextIconButton",
                        src: "assets/nexticon.png",
                        style: "float:right;",
                        ontap: "savePicture",
                        label: "Next"
                    }, {
                        kind: "Group",
                        onActivate: "borderChanged",
                        style: "padding-top:10px;",
                        components: [ {
                            kind: "onyx.IconButton",
                            src: "assets/bordersquareicon.png",
                            border: "square",
                            name: "borderSquare"
                        }, {
                            kind: "onyx.IconButton",
                            src: "assets/borderroundicon.png",
                            border: "round",
                            name: "borderRound"
                        }, {
                            kind: "onyx.IconButton",
                            active: !0,
                            src: "assets/bordernoneicon.png",
                            border: "none",
                            name: "borderNone"
                        } ]
                    } ]
                } ]
            } ]
        } ]
    }, {
        kind: "ToasterPopup",
        classes: "captionBack main-popup-style",
        floating: !0,
        align: "left",
        anchor: !1,
        autoDismiss: !0,
        name: "deleteConfirm",
        centered: !0,
        modal: !0,
        scrim: !0,
        components: [ {
            content: "Are you sure you want to delete this picture?",
            name: "deleteMsg",
            style: "margin-bottom:5px;"
        }, {
            kind: "onyx.Button",
            classes: "",
            ontap: "closeDeleteConfirm",
            style: "float:left;",
            content: "Cancel"
        }, {
            kind: "onyx.Button",
            classes: "onyx-negative",
            ontap: "removePicture",
            style: "float:right;",
            content: "Delete"
        } ]
    }, {
        style: "position: absolute;right:0;top:0;z-index:99999;",
        components: [ {
            kind: "onyx.IconButton",
            src: "assets/closeicon.png",
            name: "btnExit",
            ontap: "exitPosting"
        } ]
    }, {
        style: "position: absolute;left:0;top:0;z-index:99999;",
        components: [ {
            kind: "onyx.IconButton",
            src: "assets/helpbuttonicon.png",
            ontap: "requestHelp",
            style: ""
        } ]
    }, {
        tag: "canvas",
        style: "display:none;",
        name: "canvasOrig"
    }, {
        tag: "canvas",
        style: "display:none;",
        name: "smallcanvasOrig"
    }, {
        tag: "canvas",
        style: "display:none;",
        name: "canvas"
    }, {
        tag: "canvas",
        style: "display:none;",
        name: "buffercanvas"
    }, {
        tag: "canvas",
        style: "display:none;",
        name: "storecanvas"
    }, {
        kind: "postSpinner",
        name: "spin"
    }, {
        kind: "Signals",
        onTumblrPosted: "exitPosting"
    } ],
    maxPhotos: enyo.platform.blackberry ? 5 : enyo.platform.firefoxOS ? 3 : 10,
    isPosting: !1,
    photos: [],
    exitPosting: function(t) {
        this.$.spin.stop();
        var e = this.$.publishPicker.getSelected().publish;
        this.isPosting = !1, this.sendBack(), this.resetPostView(), "btnExit" != t.name && setTimeout(enyo.bind(this, function() {
            enyo.Signals.send("onForceDashReload", {
                publish: e
            });
        }), 600);
    },
    requestHelp: function() {
        enyo.Signals.send("onRequestHelp", {
            help: "posting"
        });
    },
    closeDeleteConfirm: function() {
        this.$.deleteConfirm.hide();
    },
    confirmDelete: function(t, e) {
        this.$.deleteConfirm.show(), this.$.deleteConfirm.deletingIndex = e.index;
    },
    sendBack: function() {
        enyo.Signals.send("onbackbutton");
    },
    goBack: function() {
        return this.$.smoothPanels.currentPanel == this.$.editPop ? (this.$.smoothPanels.select(this.$.photoPost), 
        this.resetEditPic(), void 0) : this.$.smoothPanels.currentPanel == this.$.cropPop ? (this.photos.pop(), 
        this.$.smoothPanels.select(this.$.photoPost), this.resetCropPic(), void 0) : this.popStack.length > 0 ? (this.curPop = this.popStack.pop(), 
        this.$.smoothPanels.select(this.curPop), void 0) : (this.isPosting = !1, this.sendBack(), 
        void 0);
    },
    effectTouch: function(t, e) {
        var i = e.clientX, n = e.clientY, o = this.$.editPic.getBounds(), s = this.$.canvas.hasNode(), a = {
            width: s.width,
            height: s.height
        };
        a.width > o.width && (i = (i - 26) * a.width / o.width), a.height > o.height && (n = (n - 26) * a.height / o.height);
        var r = {
            effect: this.lastEffect,
            label: this.lastProperEffect,
            notclicked: !0
        }, h = {
            rect: {
                left: i - 25,
                top: n - 25,
                width: 50,
                height: 50
            },
            isdragging: e.isdragging
        };
        this.effectPicture(r, h);
    },
    loadView: function(t) {
        this.isPosting = !0;
        var e = t;
        this.postingType = e, this.$.smoothPanels.select(this.$[e + "Post"]), this.curPop = this.$[e + "Post"], 
        this.resizeHandler(), this.setPicScrim(), this.$.postTitle && "text" == e ? enyo.dom.showKeyboard(this.$.postTitle, this) : "photo" == e && enyo.platform.blackberry && (blackberry.ui.contextmenu.enabled = !1), 
        this.cropPicReset = !1;
    },
    resetPostView: function() {
        this.resetCropPic(), this.$.previewScoller && this.$.previewScoller.destroyClientControls(), 
        this.photos = [], this.$.picList && (this.$.picList.setCount(0), this.$.picList.reset()), 
        this.$.blogPicker && this.$.blogPicker.destroyClientControls(), this.$.postTags && this.$.postTags.clear(), 
        this.$.postContent && this.$.postContent.setValue(""), this.$.postTitle && this.$.postTitle.setValue(""), 
        this.$.defaultPublish && (this.$.defaultPublish.setActive(!0), this.$.timeField.show()), 
        this.lastBorder = "none", this.$.noneFrame && this.$.borderNone.setActive(!0), this.resetEditPic(), 
        this.lastEffect = "none", this.lastProperEffect = "None", this.lastSelected.effect && this.lastSelected.removeClass("filter-item-select"), 
        this.lastSelected = {}, this.popStack = [], this.postingType = "text";
    },
    postingType: "text",
    openPostView: function(t) {
        var e = t.postview;
        this.postingType = e, this.$.smoothPanels.select(this.$[e + "Post"]), this.popStack.push(this.$.postType), 
        this.curPop = this.$[e + "Post"], this.resizeHandler(), this.setPicScrim(), this.$.postTitle && "text" == e ? enyo.dom.showKeyboard(this.$.postTitle, this) : "photo" == e && enyo.platform.blackberry && (blackberry.ui.contextmenu.enabled = !1);
    },
    popStack: [],
    curPop: {},
    checkPublished: function(t, e) {
        "Publish" == e.content ? this.$.timeField.show() : this.$.timeField.hide();
    },
    nextStep: function(t) {
        var e = t.posttype;
        switch (e) {
          case "photo":
            if (1 > this.photos.length) return TUMBLR.bannerMessageCallback("Choose a photo to post..."), 
            void 0;
            this.popStack.push(this.$.photoPost), this.curPop = this.$.popPostContent, this.$.smoothPanels.select(this.$.popPostContent), 
            enyo.dom.showKeyboard(this.$.postContent, this.$.popPostContent);
            break;

          case "text":
            this.popStack.push(this.$.textPost), this.curPop = this.$.popPostContent, this.$.smoothPanels.select(this.$.popPostContent), 
            enyo.dom.showKeyboard(this.$.postContent, this.$.popPostContent);
            break;

          case "crop":
            var i = this.$.cropper.getCrop(), n = this.$.canvasOrig.hasNode(), o = {
                leaveDOM: !0,
                resultCanvas: this.$.storecanvas.hasNode()
            }, s = i.left, a = i.top, r = this.$.cropPic.getBounds(), h = this.$.canvasOrig.hasNode(), l = {
                width: h.width,
                height: h.height
            };
            l.width > r.width && (s = s * l.width / r.width), l.height > r.height && (a = a * l.height / r.height);
            var c = i.left + i.width;
            c = c * l.width / r.width, c -= s;
            var d = i.top + i.height;
            d = d * l.height / r.height, d -= a, o.rect = {
                top: a,
                left: s,
                width: c,
                height: d
            }, Pixastic.process(n, "crop", o);
            var u = o.resultCanvas.toDataURL("image/png");
            this.$.smoothPanels.select(this.$.photoPost), this.photos[this.photos.length - 1].src = u, 
            this.photos[this.photos.length - 1].origSrc = u, this.$.picHeader.setContent("Take or add up to " + (this.maxPhotos - this.photos.length) + " more pictures"), 
            this.$.picList.removeClass("photo-list"), this.setPicScrim(), this.$.picList.setCount(this.photos.length), 
            this.resizeHandler(), this.$.picList.rowHeight = enyo.platform.blackberry ? 242 : 305, 
            this.$.picList.updateMetrics(), this.$.picList.refresh(), this.$.picList.scrollToBottom(), 
            setTimeout(enyo.bind(this, function() {
                this.resetCropPic();
            }), 350);
            break;

          case "content":
            if (0 >= this.$.postContent.getValue().length && "text" == this.postingType) return TUMBLR.bannerMessageCallback("A post body is required."), 
            void 0;
            this.$.postTags.clear(), this.popStack.push(this.$.popPostContent), this.curPop = this.$.popTags, 
            this.$.smoothPanels.select(this.$.popTags), enyo.dom.showKeyboard(this.$.postTags, this.$.popTags);
            break;

          case "tags":
            enyo.dom.hideKeyboard(this.$.postTags, this);
            for (var r = TUMBLR.userObject.blogs, p = [], g = 0; r.length > g; g++) p.push({
                content: r[g].name,
                style: "background: url(" + TUMBLR.getAvatar(r[g].name, 30) + ") left center no-repeat; background-size:  32px 32px;"
            });
            for (var m = this.$.blogPicker.createComponents(p), f = void 0, y = 0; m.length > y; y++) if (m[y].content == TUMBLR.PRIMARY_BLOG_NAME) {
                f = m[y];
                break;
            }
            this.$.blogPicker.render(), f && (this.$.blogPicker.setSelected(f), this.$.pickerButton.addStyles("background-image:url(" + TUMBLR.getAvatar(f.content, 30) + ");background-position: left center;background-repeat: no-repeat; background-size:  32px 32px;")), 
            this.$.postDate.setValue(new Date()), this.$.postTime.setValue(new Date()), this.$.defaultPublish.setActive(!0), 
            this.$.timeField.show(), this.popStack.push(this.$.popTags), this.curPop = this.$.popSettings, 
            this.$.smoothPanels.select(this.$.popSettings);
            break;

          case "settings":
            enyo.platform.blackberry && (blackberry.ui.contextmenu.enabled = !0);
            var b = "", v = this.$.publishPicker.getSelected().content;
            switch (v) {
              case "Publish":
                b = "Publishing this post to ";
                break;

              case "Queue":
                b = "Adding to queue on ";
                break;

              case "Draft":
                b = "Creating draft on ";
                break;

              case "Private":
                b = "Creating private post to ";
            }
            if (b += "<b>" + this.$.blogPicker.getSelected().content + "</b>", "Publish" == v) {
                var w = this.getPostDate().relative();
                w.indexOf("ago") >= 0 && (w = "now"), b += "<br />Posting " + w;
            }
            switch (this.$.previewScoller.destroyClientControls(), this.postingType) {
              case "photo":
                for (var e = [], x = 0; this.photos.length > x; x++) e.push(this.photos[x].src);
                this.$.previewScoller.createComponent({
                    kind: "PhotoPreview",
                    srcs: e,
                    caption: this.$.postContent.getValue(),
                    tags: this.$.postTags.getSelected(),
                    postinfo: b
                }, {
                    owner: this
                }).render();
                break;

              case "text":
                this.$.previewScoller.createComponent({
                    kind: "TextPreview",
                    title: this.$.postTitle.getValue(),
                    caption: this.$.postContent.getValue(),
                    tags: this.$.postTags.getSelected(),
                    postinfo: b
                }, {
                    owner: this
                }).render();
            }
            this.$.previewScoller.createComponent({
                style: "height:50px;"
            }).render(), this.popStack.push(this.$.popSettings), this.curPop = this.$.popPreview, 
            this.$.smoothPanels.select(this.$.popPreview);
            break;

          case "post":
            this.$.spin.start(), setTimeout(enyo.bind(this, function() {
                "text" == this.postingType ? this.postText() : "photo" == this.postingType && this.postImage();
            }), 500);
        }
    },
    pickerChanged: function() {
        this.$.pickerButton.addStyles("background-image:url(" + TUMBLR.getAvatar(this.$.blogPicker.getSelected().content, 30) + ");background-position: left center;background-repeat: no-repeat; background-size:  32px 32px;");
    },
    resetCropPic: function() {
        this.$.cropPic && (this.$.cropPic.addStyles("max-width:100%;max-height:90%;"), this.$.cropPic.applyStyle("width", null), 
        this.$.cropPic.applyStyle("height", null), this.$.cropPic.applyStyle("top", "0"), 
        this.$.cropPic.applyStyle("left", "0"), "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" != this.$.cropPic.getSrc() && (this.cropPicReset = !0, 
        this.$.cropPic.setSrc("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7")));
    },
    resetEditPic: function() {
        this.$.editPic && setTimeout(enyo.bind(this, function() {
            this.$.editPic.setSrc("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", null, null);
        }), 500);
    },
    setupItem: function(t, e) {
        var i = e.index;
        return this.photos[i] ? (this.$.picImage.setSrc(this.photos[i].src), this.$.photoFilter.setContent(this.photos[i].label), 
        !0) : !1;
    },
    setupReorderComponents: function(t, e) {
        var i = e.index;
        return this.photos[i] ? (this.$.reorderImage.setSrc(this.photos[i].src), void 0) : !1;
    },
    listReorder: function(t, e) {
        var i = enyo.clone(this.photos[e.reorderFrom]);
        this.photos.splice(e.reorderFrom, 1), this.photos.splice(e.reorderTo, 0, i);
    },
    takePicture: function() {
        return this.photos.length == this.maxPhotos ? (TUMBLR.bannerMessageCallback("You have " + this.maxPhotos + " pictures already!"), 
        void 0) : (this.ffOSCrop = enyo.platform.firefoxOS ? !0 : !1, (enyo.platform.android || enyo.platform.blackberry || enyo.platform.firefoxOS) && navigator.camera.getPicture(enyo.bind(this, this.loadImage), function() {
            console.error("error");
        }, {
            quality: 85,
            destinationType: 1,
            targetWidth: 800,
            targetHeight: 800,
            saveToPhotoAlbum: !0,
            correctOrientation: !0,
            encodingType: 1
        }), void 0);
    },
    canEffect: !0,
    lastEffect: "none",
    lastProperEffect: "None",
    lastSelected: {},
    effectPicture: function(t, e) {
        if (this.canEffect = !1, t.FILTER_FULL_SIZE) var i = this.$.canvasOrig.hasNode(), n = {
            leaveDOM: !0,
            resultCanvas: this.$.storecanvas.hasNode()
        }; else if (this.lastEffect = t.effect, this.lastProperEffect = t.label, t.notclicked || (this.lastSelected.removeClass("filter-item-select"), 
        this.lastSelected = t, t.addClass("filter-item-select")), this.$.fullOrTouch.getValue() === !0) var i = this.$.smallcanvasOrig.hasNode(), n = {
            leaveDOM: !0,
            resultCanvas: this.$.canvas.hasNode()
        }; else {
            var i = this.$.smallcanvasOrig.hasNode(), n = {
                leaveDOM: !0,
                resultCanvas: this.$.storecanvas.hasNode()
            };
            if (!e.rect) return;
            var o = e.rect, s = i.getContext("2d").getImageData(o.left, o.top, o.width, o.height), a = this.$.buffercanvas.hasNode();
            a.width = o.width, a.height = o.height, a.getContext("2d").putImageData(s, 0, 0), 
            i = a;
        }
        if (this.$.fullOrTouch.getValue() === !0 || e.isdragging === !0 || t.FILTER_FULL_SIZE) {
            switch (t.effect) {
              case "none":
                if (e.rect) n.red = 0, n.green = 0, n.blue = 0, Pixastic.process(i, "coloradjust", n); else {
                    var r = this.$.canvas.hasNode().getContext("2d");
                    r.drawImage(i, 0, 0);
                }
                break;

              case "sepia":
                Pixastic.process(i, "sepia", n);
                break;

              case "lines":
                n.edgeStrength = 15, n.greyLevel = 0, n.invert = !0, Pixastic.process(i, "laplace", n);
                break;

              case "glow":
                n.amount = .49, n.radius = .29, Pixastic.process(i, "glow", n);
                break;

              case "emboss":
                n.greyLevel = 38, n.direction = "topleft", n.strength = 9.2, n.blend = !0, Pixastic.process(i, "emboss", n);
                break;

              case "solarize":
                Pixastic.process(i, "solarize", n);
                break;

              case "blackwhite":
                n.average = !0, Pixastic.process(i, "desaturate", n);
                break;

              case "enhance":
                n.hue = 7, n.saturation = 46, n.lightness = -18, Pixastic.process(i, "hsl", n);
                break;

              case "oldtime":
                n.hue = 0, n.saturation = -72, n.lightness = -12, Pixastic.process(i, "hsl", n);
                break;

              case "burned":
                n.hue = -18, n.saturation = 76, n.lightness = 30, Pixastic.process(i, "hsl", n);
                break;

              case "invert":
                Pixastic.process(i, "invert", n);
                break;

              case "darken":
                n.brightness = -60, n.contrast = .7, n.legacy = !0, Pixastic.process(i, "brightness", n);
                break;

              case "cool":
                n.hue = -33, n.saturation = -19, n.lightness = 11, Pixastic.process(i, "hsl", n);
                break;

              case "blur":
                n.amount = .2, Pixastic.process(i, "blurfast", n);
                break;

              case "sunspot":
                n.hue = -5, n.saturation = 15, n.lightness = 2, n.resultCanvas = this.$.buffercanvas.hasNode(), 
                Pixastic.process(i, "hsl", n), i = n.resultCanvas, n.resultCanvas = t.FILTER_FULL_SIZE === !0 ? this.$.storecanvas.hasNode() : this.$.canvas.hasNode(), 
                n.brightness = 10, n.contrast = 1.2, Pixastic.process(i, "brightness", n);
                break;

              case "contrast":
                n.hue = 7, n.saturation = -70, n.lightness = 10, n.resultCanvas = this.$.buffercanvas.hasNode(), 
                Pixastic.process(i, "hsl", n), i = n.resultCanvas, n.resultCanvas = t.FILTER_FULL_SIZE === !0 ? this.$.storecanvas.hasNode() : this.$.canvas.hasNode(), 
                n.brightness = 0, n.contrast = 5, Pixastic.process(i, "brightness", n);
                break;

              case "define":
                n.greyLevel = 0, n.direction = "left", n.strength = 5.2, n.blend = !0, n.resultCanvas = this.$.buffercanvas.hasNode(), 
                Pixastic.process(i, "emboss", n), i = n.resultCanvas, n.resultCanvas = t.FILTER_FULL_SIZE === !0 ? this.$.storecanvas.hasNode() : this.$.canvas.hasNode(), 
                n.brightness = 5, n.contrast = 1, Pixastic.process(i, "brightness", n);
                break;

              case "bluemoon":
                n.hue = 55, n.saturation = 20, n.lightness = 2, n.resultCanvas = this.$.buffercanvas.hasNode(), 
                Pixastic.process(i, "sepia2", n), i = n.resultCanvas, n.resultCanvas = t.FILTER_FULL_SIZE === !0 ? this.$.storecanvas.hasNode() : this.$.canvas.hasNode(), 
                Pixastic.process(i, "hsl", n);
                break;

              case "bright":
                n.amount = .49, n.radius = .29, n.resultCanvas = this.$.buffercanvas.hasNode(), 
                Pixastic.process(i, "glow", n), i = n.resultCanvas, n.resultCanvas = t.FILTER_FULL_SIZE === !0 ? this.$.storecanvas.hasNode() : this.$.canvas.hasNode(), 
                n.brightness = -30, n.contrast = 2.5, Pixastic.process(i, "brightness", n);
                break;

              case "sunny":
                n.amount = .49, n.radius = .75, n.resultCanvas = this.$.buffercanvas.hasNode(), 
                Pixastic.process(i, "glow", n), i = n.resultCanvas, n.resultCanvas = t.FILTER_FULL_SIZE === !0 ? this.$.storecanvas.hasNode() : this.$.canvas.hasNode(), 
                n.amount = .5, n.mode = "linearlight", n.image = t.FILTER_FULL_SIZE === !0 ? this.$.canvasOrig.hasNode() : this.$.smallcanvasOrig.hasNode(), 
                Pixastic.process(i, "blend", n);
                break;

              case "warm":
                n.hue = -120, n.saturation = 15, n.lightness = 20, n.resultCanvas = this.$.buffercanvas.hasNode(), 
                Pixastic.process(i, "hsl", n), i = n.resultCanvas, n.resultCanvas = t.FILTER_FULL_SIZE === !0 ? this.$.storecanvas.hasNode() : this.$.canvas.hasNode(), 
                n.amount = .8, n.mode = "vividlight", n.image = t.FILTER_FULL_SIZE === !0 ? this.$.canvasOrig.hasNode() : this.$.smallcanvasOrig.hasNode(), 
                Pixastic.process(i, "blend", n);
                break;

              case "yella":
                n.red = .2, n.green = .2, n.blue = 0, n.resultCanvas = this.$.buffercanvas.hasNode(), 
                Pixastic.process(i, "coloradjust", n), i = n.resultCanvas, n.resultCanvas = t.FILTER_FULL_SIZE === !0 ? this.$.storecanvas.hasNode() : this.$.canvas.hasNode(), 
                n.amount = .9, n.mode = "hardlight", n.image = t.FILTER_FULL_SIZE === !0 ? this.$.canvasOrig.hasNode() : this.$.smallcanvasOrig.hasNode(), 
                Pixastic.process(i, "blend", n);
                break;

              case "threshold":
                Pixastic.process(i, "threshold", n);
                break;

              case "draw":
                Pixastic.process(i, "threshold2", n);
                break;

              case "dull":
                n.hue = 16, n.saturation = -26, n.lightness = 13, Pixastic.process(i, "hsl", n);
                break;

              case "pop":
                n.hue = 11, n.saturation = 100, n.lightness = -22, Pixastic.process(i, "hsl", n);
                break;

              case "test":
                n.hue = -33, n.saturation = -19, n.lightness = 11, Pixastic.process(i, "hsl", n);
            }
            if (this.$.fullOrTouch.getValue() === !1) {
                n.amount = 0, i = this.$.smallcanvasOrig.hasNode();
                var h = i.getContext("2d"), l = n.resultCanvas.getContext("2d"), c = l.getImageData(5, 5, e.rect.width - 5, e.rect.height - 5), d = h.getImageData(e.rect.left + 5, e.rect.top + 5, e.rect.width - 5, e.rect.height - 5), u = function(t, e) {
                    for (var i = t; e >= i; i += 4) c.data[i] = d.data[i], c.data[i + 1] = d.data[i + 1], 
                    c.data[i + 2] = d.data[i + 2], c.data[i + 3] = d.data[i + 3];
                };
                u(0, 76), u(104, 236), u(300, 404), u(492, 576), u(680, 756), u(864, 932), u(1048, 1108), 
                u(1232, 1284), u(1416, 1460), u(1600, 1636), u(1784, 1816), u(1964, 1988), u(2148, 2168), 
                u(2332, 2348), u(2512, 2524), u(2692, 2700), u(3056, 3060), u(3236, 3240), u(3416, 3416), 
                u(4680, 4680), u(4856, 4860), u(5036, 5040), u(5216, 5220), u(5396, 5408), u(5572, 5588), 
                u(5752, 5768), u(5932, 5952), u(6108, 6136), u(6284, 6316), u(6464, 6500), u(6640, 6684), 
                u(6816, 6868), u(6992, 7052), u(7168, 7236), u(7344, 7420), u(7520, 7612), u(7692, 7800), 
                u(7864, 7996), u(8044, 8100);
                var p = this.$.canvas.hasNode(), g = p.getContext("2d");
                g.putImageData(c, e.rect.left + 5, e.rect.top + 5);
            }
            if (t.FILTER_FULL_SIZE) {
                "none" != this.lastBorder && this[this.lastBorder + "Frame"](!0);
                var m = this.$.storecanvas.hasNode().toDataURL("image/png");
                this.photos[this.editPicIndex].src = m;
            } else {
                "none" != this.lastBorder && this[this.lastBorder + "Frame"]();
                var m = this.$.canvas.hasNode().toDataURL("image/png");
                this.$.editPic.setSrc(m, null, null);
            }
        }
        this.canEffect = !0;
    },
    lastBorder: "none",
    borderChanged: function(t, e) {
        if (e.originator.getActive() && this.photos[this.editPicIndex]) {
            var i = e.originator.border;
            this.lastBorder = i, this.photos[this.editPicIndex].frame = i, this[this.lastBorder + "Frame"]();
        }
    },
    squareFrame: function(t) {
        var e = t ? this.$.storecanvas.hasNode() : this.$.canvas.hasNode(), i = e.getContext("2d");
        i.lineWidth = 15, i.rect(7, 7, e.width - 14, e.height - 14), i.stroke();
        var n = this.$.canvas.hasNode().toDataURL("image/png");
        this.$.editPic.setSrc(n);
    },
    roundFrame: function(t) {
        var e = t ? this.$.storecanvas.hasNode() : this.$.canvas.hasNode(), i = e.getContext("2d");
        i.lineWidth = 15, i.clearRect(0, 0, e.width, 10), i.clearRect(0, 0, 10, e.height), 
        i.clearRect(0, e.height - 10, e.width, 10), i.clearRect(e.width - 10, 0, 10, e.height), 
        i.roundRect(7, 7, e.width - 14, e.height - 14, {}, !1, !0);
        var n = this.$.canvas.hasNode().toDataURL("image/png");
        this.$.editPic.setSrc(n);
    },
    noneFrame: function() {
        var t = {
            effect: this.lastEffect,
            label: this.lastProperEffect,
            notclicked: !0
        }, e = {
            isdragging: !1
        };
        this.effectPicture(t, e);
    },
    ffOSCrop: !1,
    choosePicture: function() {
        if (this.photos.length == this.maxPhotos) return TUMBLR.bannerMessageCallback("You have " + this.maxPhotos + " pictures already!"), 
        void 0;
        if (this.ffOSCrop = !1, enyo.platform.android || enyo.platform.firefoxOS) navigator.camera.getPicture(enyo.bind(this, this.loadImage), function() {
            console.error("error");
        }, {
            quality: 85,
            destinationType: 1,
            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
            targetWidth: 800,
            targetHeight: 800,
            encodingType: 1
        }); else if (enyo.platform.blackberry) {
            var t = {
                mode: blackberry.invoke.card.FILEPICKER_MODE_PICKER,
                type: [ blackberry.invoke.card.FILEPICKER_TYPE_PICTURE ]
            };
            blackberry.invoke.card.invokeFilePicker(t, enyo.bind(this, this.loadImage), function() {}, function(t) {});
        } else this.loadImage("assets/filternone.jpg", !0);
    },
    removePicture: function() {
        var t = this.$.deleteConfirm.deletingIndex;
        this.photos[t] && (this.photos.splice(t, 1), this.$.picList.setCount(this.photos.length), 
        this.$.picList.refresh(), this.photos.length > 0 ? (this.$.picHeader.setContent("Take or add up to " + (this.maxPhotos - this.photos.length) + " more pictures"), 
        this.$.picList.removeClass("photo-list")) : (this.$.picHeader.setContent("Take or add up to " + this.maxPhotos + " pictures"), 
        this.$.picList.addClass("photo-list")), this.closeDeleteConfirm(), this.setPicScrim());
    },
    savePicture: function() {
        this.effectPicture({
            FILTER_FULL_SIZE: !0,
            effect: this.lastEffect
        }, {}), this.photos[this.editPicIndex].label = this.lastProperEffect, this.photos[this.editPicIndex].filter = this.lastEffect, 
        this.$.smoothPanels.select(this.$.photoPost), this.$.picList.renderRow(this.editPicIndex), 
        this.setPicScrim(), this.editPicIndex = -1, this.lastBorder = "none", this.$.borderNone.setActive(!0), 
        this.resetEditPic();
    },
    setPicScrim: function() {
        if (this.$.picList && 0 === this.photos.length) {
            var t = this.$.picList.getBounds();
            t && t.height && t.height > 0 && this.$.picScrim.setBounds(t), this.$.picHeader.setContent("Take or add up to " + this.maxPhotos + " pictures"), 
            this.$.picList.addClass("photo-list"), this.$.picScrim.show();
        } else this.$.picScrim && this.$.picScrim.hide();
    },
    editPicIndex: 0,
    openEditPop: function(t, e) {
        var i = e.index;
        this.$.smoothPanels.select(this.$.editPop), this.$.canvasOrig.hasNode();
        var n = this.$.canvasOrig.node;
        this.lastSelected.effect && this.lastSelected.removeClass("filter-item-select");
        for (var o = this.$.filterScroll.getClientControls(), s = 0; o.length > s; s++) if (o[s].effect == this.photos[i].filter) {
            this.lastSelected = o[s], this.lastEffect = this.photos[i].filter, this.lastProperEffect = this.photos[i].label;
            break;
        }
        if (this.lastSelected.effect || (this.lastSelected = this.$.noneFilter), "none" != this.photos[i].frame) {
            var a = this.photos[i].frame;
            a = a.substr(0, 1).toUpperCase() + a.substr(1), this.$["border" + a].setActive(!0);
        }
        this.lastSelected.addClass("filter-item-select");
        var r = this.lastSelected.getBounds();
        r.left = r.left - 12, 0 > r.left && (r.left = 0), this.$.filterScroll.setValue(-1 * r.left);
        var h = new Image();
        h.onload = enyo.bind(this, function() {
            if (n) {
                var t = h.width, e = h.height, o = WND_HEIGHT() - 170, s = WND_WIDTH() - 60, a = [ s / t, o / e ];
                a = Math.min(a[0], a[1]), s = t * a, o = e * a, n.width = h.width, n.height = h.height;
                var r = n.getContext("2d");
                r.drawImage(h, 0, 0, h.width, h.height), n = this.$.canvas.hasNode(), n.width = s, 
                n.height = o, r = n.getContext("2d"), r.drawImage(h, 0, 0, s, o), n = this.$.storecanvas.hasNode(), 
                n.width = h.width, n.height = h.height;
                var r = n.getContext("2d");
                r.drawImage(h, 0, 0, h.width, h.height), n = this.$.smallcanvasOrig.hasNode(), n.width = s, 
                n.height = o, r = n.getContext("2d"), r.drawImage(h, 0, 0, s, o), n = this.$.buffercanvas.hasNode(), 
                n.width = s, n.height = o, r = n.getContext("2d"), r.drawImage(h, 0, 0, s, o), this.$.editPic.setSrc(this.photos[i].src, s, o), 
                this.$.editImageFitt.reflow(), this.$.editImageFitt2.reflow();
            }
        }), this.editPicIndex = i, h.src = this.photos[i].origSrc;
    },
    dataStore: "",
    loadImage: function(t, e) {
        enyo.platform.firefoxOS || this.ffOSCrop !== !1 || (this.$.smoothPanels.select(this.$.cropPop), 
        this.$.cropFitter.applyStyle("height", WND_HEIGHT() - 150 + "px")), setTimeout(enyo.bind(this, function() {
            enyo.platform.blackberry && (e = !0, 0 > t.indexOf("file:///") && (t = "file:///" + t)), 
            (enyo.platform.firefoxOS || enyo.platform.android) && (e = !0);
            var i = this.$.canvasOrig.hasNode(), n = {
                src: (e === !0 ? "" : "data:image/jpeg;base64,") + t,
                origSrc: (e === !0 ? "" : "data:image/jpeg;base64,") + t,
                filter: "none",
                label: "None",
                frame: "none"
            }, o = this.photos.push(n);
            if (this.log(n.src), enyo.platform.blackberry || enyo.platform.firefoxOS) this.resizeImage(o); else {
                var s = new Image();
                s.onload = enyo.bind(this, function() {
                    if (i) {
                        this.log(s.width, s.height), i.width = s.width, i.height = s.height;
                        var t = i.getContext("2d");
                        t.drawImage(s, 0, 0, s.width, s.height), this.$.cropPic.setSrc(this.photos[o - 1].origSrc);
                    }
                }), s.src = this.photos[o - 1].origSrc;
            }
        }), 350);
    },
    resizeImage: function(t) {
        var e = new Image(), i = this.$.canvasOrig.hasNode();
        e.onload = enyo.bind(this, function() {
            if (i) {
                var n = [ 800 / e.width, 800 / e.height ];
                n = Math.min(n[0], n[1]);
                var o = e.width * n, s = e.height * n;
                i.width = o, i.height = s;
                var a = i.getContext("2d");
                a.drawImage(e, 0, 0, o, s), this.photos[t - 1].origSrc = i.toDataURL("image/jpeg", .85), 
                this.photos[t - 1].src = this.photos[t - 1].origSrc, enyo.platform.firefoxOS && this.ffOSCrop === !1 ? (this.$.smoothPanels.select(this.$.photoPost), 
                this.$.picHeader.setContent("Take or add up to " + (this.maxPhotos - this.photos.length) + " more pictures"), 
                this.$.picList.removeClass("photo-list"), this.setPicScrim(), this.$.picList.setCount(this.photos.length), 
                this.resizeHandler(), this.$.picList.rowHeight = 305, this.$.picList.updateMetrics(), 
                this.$.picList.refresh(), this.$.picList.scrollToBottom()) : this.$.cropPic.setSrc(this.photos[t - 1].origSrc);
            }
        }), e.src = this.photos[t - 1].origSrc;
    },
    setOverlay: function() {
        return this.isPosting === !1 || this.cropPicReset === !0 ? (this.$.cropper.hide(), 
        this.cropPicReset = !1, void 0) : (this.$.cropFitt.reflow(), this.$.cropPic.applyStyle("max-height", WND_HEIGHT() - 150 + "px"), 
        this.$.cropFitter.applyStyle("height", WND_HEIGHT() - 150 + "px"), setTimeout(enyo.bind(this, function() {
            var t = this.$.cropPic.getBounds();
            if (this.log(t), t.width < WND_WIDTH()) {
                var e = WND_WIDTH() - t.width;
                t.left = e / 2, this.$.cropPic.setBounds(t);
            } else t.left = 0, this.$.cropPic.setBounds(t);
            this.$.cropper.setArea(t), this.$.cropper.show(), this.$.cropFitt.reflow();
        }), 10), void 0);
    },
    postImage: function() {
        var t = this.photos, e = this.$.blogPicker.getSelected().content, i = this.$.publishPicker.getSelected().publish, n = this.$.postTags.getSelected().join(","), o = this.$.postContent.getValue(), s = {
            blog: e,
            state: i,
            tags: n,
            date: this.getPostDate(),
            body: o,
            srcs: t
        };
        TUMBLR.postPhoto(s);
    },
    getPostDate: function() {
        var t = new Date(), e = this.$.postDate.getValue(), i = this.$.postTime.getValue();
        return t.setMonth(e.getMonth()), t.setFullYear(e.getFullYear()), t.setDate(e.getDate()), 
        t.setHours(i.getHours()), t.setMinutes(i.getMinutes()), t.setSeconds(i.getSeconds()), 
        t;
    },
    postText: function() {
        var t = this.$.blogPicker.getSelected().content, e = this.$.publishPicker.getSelected().publish, i = this.$.postTags.getSelected().join(","), n = this.$.postContent.getValue(), o = this.$.postTitle.getValue(), s = {
            blog: t,
            state: e,
            tags: i,
            date: this.getPostDate().toUTCString(),
            body: n,
            title: o
        };
        TUMBLR.postText(s);
    },
    origWidth: 0,
    origHeight: 0,
    resizeHandler: function() {
        this.inherited(arguments), (WND_HEIGHT() != this.origHeight || WND_WIDTH() != this.origWidth) && (this.origWidth = WND_WIDTH(), 
        this.origHeight = WND_HEIGHT(), this.$.photoPost.applyStyle("height", WND_HEIGHT() + "px"), 
        this.$.photoPost.resized(), this.$.textPost.applyStyle("height", WND_HEIGHT() + "px"), 
        this.$.textPost.resized(), this.$.popPostContent.applyStyle("height", WND_HEIGHT() + "px"), 
        this.$.popPostContent.resized(), this.$.popPreview.applyStyle("height", WND_HEIGHT() + "px"), 
        this.$.popPreview.resized(), this.$.popTags.applyStyle("height", WND_HEIGHT() + "px"), 
        this.$.popTags.resized(), this.$.popSettings.applyStyle("height", WND_HEIGHT() + "px"), 
        this.$.popSettings.resized(), this.$.cropPop.applyStyle("height", WND_HEIGHT() + "px"), 
        this.$.cropPop.resized(), this.$.editPop.applyStyle("height", WND_HEIGHT() + "px"), 
        this.$.editPop.resized(), this.$.editImageFitt && (this.$.editImageFitt.reflow(), 
        this.$.editImageFitt2.reflow()), this.applyStyle("height", WND_HEIGHT() + "px"), 
        this.setPicScrim());
    }
});

// source\views\categories\categories.js
enyo.kind({
    kind: "ToasterPopup",
    floating: !0,
    autoDismiss: !1,
    align: "bottom",
    name: "onyx.SlideFadeInView",
    style: "font-size:100%;border:none;padding:0px;width:100%;margin:0px;overflow:hidden;",
    classes: "post-background",
    components: [],
    create: function() {
        this.inherited(arguments);
    }
}), enyo.kind({
    kind: "DropInView",
    name: "CategoryEditor",
    classes: "post-background enyo-fit transform-3d",
    style: "font-size:80%;margin:0;",
    events: {
        onFinished: "",
        onDeleteCategory: "",
        onAddCategory: "",
        onDeleteFavorite: "",
        onRequestExploreMenu: "",
        onRequestSaveFavorites: "",
        onRequestTagMenu: "",
        onRequestSaveAll: "",
        onRequestBanner: "",
        onRequestExploreBlog: "",
        onRequestExploreCategory: "",
        onRequestReloadDefault: ""
    },
    components: [ {
        classes: "edit-cats-top-toolbar onyx-toolbar onyx-toolbar-inline toolbar-round-left toolbar-round-right",
        name: "deletePop",
        showing: !1,
        components: [ {
            kind: "FittableRows",
            style: "width:100%;",
            components: [ {
                name: "selectedCat",
                content: "Selected Category",
                allowHtml: !0,
                style: "margin-left: 15px;"
            }, {
                style: "width:100%;",
                components: []
            } ]
        } ]
    }, {
        kind: "FittableRows",
        style: "width:100%;height:" + WND_HEIGHT() + "px;",
        name: "catFitRow",
        components: [ {
            classes: "cat-list-backer",
            style: "border-bottom:3px solid #333000;",
            components: [ {
                content: "Categories",
                classes: "cat-list-item-text",
                style: "text-align:center;width:100%;"
            }, {
                style: "font-size:50%",
                content: 'Tap a category to change the items, swipe a category for more options. Click the "Add" button to add a category'
            } ]
        }, {
            kind: "List",
            classes: "",
            name: "catList",
            touchOverscroll: !1,
            fit: !0,
            multiSelect: !1,
            reorderable: !1,
            enableSwipe: !0,
            centerReorderContainer: !1,
            persistSwipeableItem: !0,
            onSetupItem: "setupCatItem",
            onSetupSwipeItem: "setupCatSwipeItem",
            onSwipe: "swiping",
            onSwipeComplete: "swipeComplete",
            components: [ {
                name: "catListItem",
                classes: "cat-list-item",
                style: "height:65px;",
                ontap: "openCat",
                components: [ {
                    name: "catListCount",
                    classes: "cat-list-item-count",
                    style: "float:right;",
                    allowHtml: !0
                }, {
                    name: "catListText",
                    classes: "cat-list-item-text",
                    style: "float:left;",
                    allowHtml: !0
                }, {
                    name: "extraIcons",
                    style: "clear:both;display:block;",
                    maxPics: 999,
                    rowImageOffset: 15,
                    rowImages: !0,
                    kind: "ImageStacker"
                } ]
            } ],
            swipeableComponents: [ {
                name: "swipeCatItem",
                classes: "enyo-fit cat-list-item-swipe",
                components: [ {
                    kind: "onyx.TextIconButton",
                    name: "exploreBtn",
                    src: "assets/explorecaticon.png",
                    ontap: "exploreCat",
                    style: "float:right;",
                    label: "Explore"
                }, {
                    kind: "onyx.TextIconButton",
                    src: "assets/cancelicon.png",
                    label: "Cancel",
                    style: "float:right;margin-right:5px;",
                    ontap: "catCancel"
                }, {
                    kind: "onyx.TextIconButton",
                    name: "deleteBtn",
                    src: "assets/deleteicon.png",
                    ontap: "confirmDelete",
                    label: "Delete",
                    style: "float:left;margin-right:5px;"
                }, {
                    kind: "onyx.TextIconButton",
                    name: "editBtn",
                    src: "assets/editicon.png",
                    ontap: "editCatName",
                    style: "float:left;",
                    label: "Edit"
                }, {
                    name: "swipeCatText",
                    style: "display:inline-block;font-size:50%;margin-top:15px;margin-left:10px;word-wrap:break-word;max-width:" + (WND_WIDTH() - 275) + "px;overflow:hidden;"
                } ]
            } ]
        }, {
            classes: "cat-list-backer",
            style: "border-top:3px solid #333000;height: 80px;border-bottom:none;",
            components: [ {
                kind: "onyx.TextIconButton",
                name: "addCatBtn",
                src: "assets/addcaticon.png",
                style: "float: right;",
                ontap: "addCat",
                label: "Add"
            }, {
                kind: "onyx.TextIconButton",
                src: "assets/backicon.png",
                style: "clear:both;margin-right: 5px;",
                ontap: "sendBack",
                label: "Back"
            }, {
                kind: "onyx.TextIconButton",
                src: "assets/importcatsicon.png",
                style: "",
                ontap: "startLoadDefault",
                label: "Import"
            } ]
        } ]
    }, {
        kind: "onyx.SlideFadeInView",
        name: "editCatPop",
        onAnimateFinish: "editCatPopAnimateEnd",
        components: [ {
            kind: "FittableRows",
            style: "width:100%;height:100%",
            name: "editBlogsFitRow",
            components: [ {
                classes: "cat-list-backer",
                style: "border-bottom:3px solid #333000;border-top:none;",
                components: [ {
                    name: "blogCatName",
                    content: "Edit",
                    classes: "cat-list-item-text",
                    style: "text-align:center;width:100%;"
                }, {
                    style: "font-size: 50%;",
                    content: 'Tap or swipe an item for more options. Click the "Add" button to add an item.'
                } ]
            }, {
                kind: "android.List",
                classes: "",
                name: "blogList",
                touchOverscroll: !1,
                fit: !0,
                multiSelect: !1,
                reorderable: !1,
                enableSwipe: !0,
                centerReorderContainer: !1,
                persistSwipeableItem: !0,
                onSetupItem: "setupBlogItem",
                onSwipe: "swiping",
                onSetupSwipeItem: "setupBlogSwipeItem",
                onSwipeComplete: "swipeComplete",
                components: [ {
                    name: "blogListItem",
                    classes: "cat-list-item",
                    style: "height:65px;",
                    ontap: "openSwipe",
                    components: [ {
                        kind: "Image",
                        name: "blogImage",
                        classes: "no-limits",
                        style: "width:60px;height:60px;margin-right:10px;"
                    }, {
                        name: "blogListText",
                        classes: "cat-list-item-text",
                        style: "display:inline-block;position:relative;top:-25px;",
                        allowHtml: !0
                    } ]
                } ],
                swipeableComponents: [ {
                    name: "swipeBlogItem",
                    classes: "enyo-fit cat-list-item-swipe",
                    components: [ {
                        kind: "onyx.TextIconButton",
                        src: "assets/explorecaticon.png",
                        ontap: "exploreBlog",
                        style: "float:right;",
                        label: "Explore"
                    }, {
                        kind: "onyx.TextIconButton",
                        src: "assets/cancelicon.png",
                        label: "Cancel",
                        style: "float:right;margin-right:5px;",
                        ontap: "blogCancel"
                    }, {
                        kind: "onyx.TextIconButton",
                        label: "Remove",
                        src: "assets/deleteicon.png",
                        ontap: "confirmDeleteBlog",
                        style: "float:left;margin-right:5px;"
                    }, {
                        kind: "onyx.TextIconButton",
                        label: "Move To",
                        src: "assets/movetoicon.png",
                        ontap: "moveItem",
                        style: "float:left;"
                    }, {
                        name: "swipeBlogText",
                        style: "font-size:50%;display:inline-block;margin-top:15px;margin-left:10px;float: left;max-width:" + (WND_WIDTH() - 275) + "px;overflow:hidden;word-wrap:break-word;"
                    } ]
                } ]
            }, {
                classes: "cat-list-backer",
                style: "border-top:3px solid #333000;height: 80px;border-bottom:none;",
                components: [ {
                    kind: "onyx.TextIconButton",
                    name: "addBlogBtn",
                    src: "assets/additemicon.png",
                    style: "float: right;",
                    ontap: "addItem",
                    label: "Add"
                }, {
                    kind: "onyx.TextIconButton",
                    src: "assets/backicon.png",
                    style: "clear:both;margin-right: 5px;",
                    ontap: "closeEditCat",
                    label: "Back"
                } ]
            } ]
        } ]
    }, {
        kind: "ToasterPopup",
        floating: !0,
        align: "left",
        anchor: !1,
        scrim: !0,
        centered: !0,
        name: "addDialog",
        style: "width:260px;height:170px;",
        classes: "captionBack",
        components: [ {
            kind: "FittableRows",
            style: "height:100%;width:100%;",
            components: [ {
                content: "Enter:",
                name: "msg",
                style: "color:black;border-bottom:3px solid #333000;margin-bottom:5px;font-size:110%;font-weight:bold;"
            }, {
                kind: "FittableColumns",
                style: "width:235px;",
                components: [ {
                    kind: "onyx.InputDecorator",
                    fit: !0,
                    components: [ {
                        kind: "onyx.Input",
                        name: "addInput",
                        alwaysLooksFocused: !0,
                        style: "width:100%;"
                    } ]
                } ]
            }, {
                fit: !0
            }, {
                style: "width:100%;height:65px;margin-bottom:8px;border-top:3px solid #333000;padding-top:5px;",
                components: [ {
                    kind: "onyx.TextIconButton",
                    src: "assets/.png",
                    style: "float: right;",
                    ontap: "addUserContent",
                    label: "Add",
                    name: "confirmButton"
                }, {
                    kind: "onyx.TextIconButton",
                    src: "assets/cancelicon.png",
                    label: "Cancel",
                    ontap: "cancelClick",
                    style: "float:left;"
                } ]
            } ]
        } ]
    }, {
        kind: "ToasterPopup",
        floating: !0,
        align: "left",
        anchor: !1,
        scrim: !0,
        centered: !0,
        name: "tagOrUser",
        style: "width:260px;min-height:100px;max-height:300px;",
        classes: "captionBack",
        components: [ {
            kind: "FittableRows",
            style: "height:100%;width:100%;",
            components: [ {
                content: "Is this a user or a tag?",
                style: "color:black;border-bottom:3px solid #333000;margin-bottom:5px;font-size:110%;font-weight:bold;"
            }, {
                style: "width:100%;height:65px;margin-bottom:8px;padding-top:5px;",
                components: [ {
                    kind: "onyx.TextIconButton",
                    src: "assets/tagicon3.png",
                    style: "float: right;",
                    ontap: "tagButtonClick",
                    label: "Tag",
                    name: "tagButton"
                }, {
                    kind: "onyx.TextIconButton",
                    src: "",
                    label: "User",
                    style: "float:left;",
                    ontap: "userButtonClick",
                    name: "userButton"
                }, {
                    name: "tagOrUserContent",
                    style: "width: 100px;padding:5px;display:inline-block;float:left;word-wrap:break-word;"
                } ]
            } ]
        }, {
            style: "position: absolute;right:0;top:0;",
            components: [ {
                kind: "onyx.IconButton",
                src: "assets/closeicon.png",
                ontap: "sendBack"
            } ]
        } ]
    }, {
        kind: "ToasterPopup",
        classes: "captionBack main-popup-style",
        floating: !0,
        align: "left",
        anchor: !1,
        autoDismiss: !0,
        name: "deleteConfirm",
        centered: !0,
        modal: !0,
        scrim: !0,
        components: [ {
            content: "Are you sure you want to delete category:",
            name: "deleteMsg",
            style: "color:black;border-bottom:3px solid #333000;margin-bottom:5px;font-size:110%;font-weight:bold;"
        }, {
            kind: "onyx.TextIconButton",
            src: "assets/deleteicon.png",
            ontap: "deleteItem",
            label: "Delete",
            style: "float:right;"
        }, {
            kind: "onyx.TextIconButton",
            src: "assets/cancelicon.png",
            label: "Cancel",
            ontap: "closeDeleteConfirm",
            style: "float:left;"
        } ]
    }, {
        kind: "ToasterPopup",
        classes: "captionBack main-popup-style",
        floating: !0,
        autoDismiss: !0,
        align: "left",
        anchor: !1,
        name: "defaultConfirm",
        centered: !0,
        modal: !0,
        scrim: !0,
        components: [ {
            content: "Do you want to reload the included categories? blogWalker will only re-add the ones that are no longer there.",
            style: "color:black;border-bottom:3px solid #333000;margin-bottom:5px;font-size:110%;font-weight:bold;"
        }, {
            kind: "onyx.TextIconButton",
            src: "assets/importcatsicon.png",
            ontap: "requestDefaults",
            label: "Reload",
            style: "float:right;"
        } ]
    }, {
        kind: "CatPicker",
        name: "catPicker",
        onAccept: "moveToCategory",
        floating: !0,
        onCancel: "catPickerCancel"
    }, {
        kind: "Image",
        onerror: "noUser",
        onload: "yesUser",
        name: "image",
        showing: !1
    }, {
        kind: "Signals",
        onRequestImport: "startLoadDefault"
    } ],
    sendBack: function() {
        enyo.Signals.send("onbackbutton");
    },
    feedItems: function() {
        for (var t = -1, e = !1, i = 0; APPLICATION.favoriteCategories.length > i; i++) if ("__TEMP" == APPLICATION.favoriteCategories[i]) {
            e = !0, t = i;
            break;
        }
        e && APPLICATION.favoriteCategories.splice(t, 1), this.createTree();
    },
    startLoadDefault: function() {
        this.$.defaultConfirm.show();
    },
    closeDefaultConfirm: function() {
        this.$.defaultConfirm.hide();
    },
    requestDefaults: function() {
        this.closeDefaultConfirm(), APPLICATION.addDefaultCategories(), this.createTree();
    },
    swipeComplete: function() {
        this.isSwiping = !1;
    },
    swiping: function() {
        this.isSwiping = !0;
    },
    catSwipeIndex: -1,
    setupCatSwipeItem: function(t, e) {
        this.preventTapThrough = !0, this.catSwipeIndex = e.index, this.$.catList.setPersistSwipeableItem(!0), 
        this.$.swipeCatText.setContent(APPLICATION.favoriteCategories[e.index]);
    },
    setupBlogSwipeItem: function(t, e) {
        this.preventTapThrough = !0, this.$.blogList.setPersistSwipeableItem(!0), this.blogSwipeIndex = e.index, 
        this.$.swipeBlogText.setContent(this.currentBlogs[e.index].name);
    },
    savedSrcs: [],
    setupCatItem: function(t, e) {
        if (APPLICATION.favoriteCategories[e.index]) {
            for (var i = [], n = [], o = "", s = e.index, a = !1, r = -1, l = 0; this.savedSrcs.length > l; l++) if (this.savedSrcs[l].cat == APPLICATION.favoriteCategories[s]) {
                a = !0, r = l;
                break;
            }
            for (var h = 0; APPLICATION.favoriteBlogs.length > h; h++) for (var c = 0; APPLICATION.favoriteBlogs[h].category.length > c; c++) if (APPLICATION.favoriteBlogs[h].category[c].toLowerCase() == APPLICATION.favoriteCategories[s].toLowerCase() && !APPLICATION.favoriteBlogs[h].doNotDisplay) {
                o = APPLICATION.favoriteBlogs[h].tagMode ? "assets/tagicon" + (enyo.irand(12) + 1) + ".png" : TUMBLR.getAvatar(APPLICATION.favoriteBlogs[h].blog_name, 30), 
                i.push(APPLICATION.favoriteBlogs[h].blog_name), n.push(o);
                break;
            }
            return a === !1 ? (this.$.extraIcons.random = !0, this.savedSrcs.push({
                cat: APPLICATION.favoriteCategories[s],
                srcs: this.$.extraIcons.setSrcUrls(n)
            })) : this.savedSrcs[r].srcs.length != n.length ? (this.$.extraIcons.random = !0, 
            this.savedSrcs[r].srcs = this.$.extraIcons.setSrcUrls(n)) : (this.$.extraIcons.random = !1, 
            this.$.extraIcons.setSrcUrls(this.savedSrcs[r].srcs)), this.$.catListText.setContent(LIMIT_TEXT_LENGTH(APPLICATION.favoriteCategories[e.index], WND_WIDTH() + 100)), 
            this.$.catListCount.setContent(i.length + " item" + (1 == i.length ? "" : "s")), 
            !0;
        }
    },
    setupBlogItem: function(t, e) {
        return this.currentBlogs[e.index] ? (this.$.blogImage.setSrc(this.currentBlogs[e.index].icon), 
        this.$.blogListText.setContent(LIMIT_TEXT_LENGTH(this.currentBlogs[e.index].name), WND_WIDTH() - 50), 
        !0) : void 0;
    },
    refreshCurrentBlogs: function(t) {
        for (var e = [], i = "", n = 0; APPLICATION.favoriteBlogs.length > n; n++) for (var o = 0; APPLICATION.favoriteBlogs[n].category.length > o; o++) if (APPLICATION.favoriteBlogs[n].category[o].toLowerCase() == APPLICATION.favoriteCategories[t].toLowerCase() && !APPLICATION.favoriteBlogs[n].doNotDisplay) {
            i = APPLICATION.favoriteBlogs[n].tagMode ? "assets/tagicon" + (enyo.irand(12) + 1) + ".png" : TUMBLR.getAvatar(APPLICATION.favoriteBlogs[n].blog_name, 30), 
            e.push({
                name: APPLICATION.favoriteBlogs[n].blog_name,
                icon: i,
                tagMode: APPLICATION.favoriteBlogs[n].tagMode
            });
            break;
        }
        this.currentBlogs = e;
    },
    moveItem: function() {
        this.blogCancel(), this.$.catPicker.setParams({
            blog_name: this.currentBlogs[this.blogSwipeIndex].name,
            add: !0,
            content: "Move " + LIMIT_TEXT_LENGTH(this.currentBlogs[this.blogSwipeIndex].name, 100) + " to another category",
            buttonContent: "Move"
        }), this.$.catPicker.show();
    },
    openSwipe: function(t, e) {
        return this.preventTapThrough === !0 ? (this.preventTapThrough = !1, void 0) : (this.$.blogList.openSwipeable(e), 
        this.preventTapThrough = !1, void 0);
    },
    attachedEvent: !1,
    openCat: function(t, e) {
        if (this.preventTapThrough === !0) return this.preventTapThrough = !1, void 0;
        if (this.catCancel(), APPLICATION.favoriteCategories[e.index]) {
            var i = e.index;
            this.refreshCurrentBlogs(i);
            var n = e.pageY;
            this.catSwipeIndex = i, this.$.editCatPop.show(n), this.$.blogCatName.setContent(APPLICATION.favoriteCategories[i]), 
            this.$.blogList.setCount(this.currentBlogs.length), this.$.blogList.reset();
        }
    },
    editCatPopAnimateEnd: function() {
        this.editCatPopClosing === !0 ? (this.editCatPopClosing = !1, this.catSwipeIndex = -1, 
        this.$.blogList.setCount(0), this.$.blogList.clearSwipeables(), this.$.blogList.reset(), 
        this.currentBlogs = []) : this.$.editBlogsFitRow.reflow();
    },
    closeEditCat: function() {
        this.editCatPopClosing = !0, this.$.editCatPop.hide(), this.$.catList.refresh();
    },
    createTree: function() {
        this.$.catList.setCount(APPLICATION.favoriteCategories.length), this.$.catList.clearSwipeables(), 
        this.$.catList.reset(), this.$.editCatPop.applyStyle("height", WND_HEIGHT() - 0 + "px"), 
        this.$.editCatPop.render(), this.$.catFitRow.applyStyle("height", WND_HEIGHT() + "px"), 
        this.$.catFitRow.reflow();
    },
    exploreBlog: function() {
        this.blogCancel();
        var t = enyo.clone(this.currentBlogs[this.blogSwipeIndex]);
        t && this.doRequestExploreBlog({
            blog_name: t.name,
            tagMode: t.tagMode
        }), this.closeEditCat();
    },
    exploreCat: function() {
        this.catCancel();
        var t = APPLICATION.favoriteCategories[this.catSwipeIndex];
        t && this.doRequestExploreCategory({
            category: t
        });
    },
    origWidth: 0,
    origHeight: 0,
    resizeHandler: function() {
        this.inherited(arguments), (WND_HEIGHT() != this.origHeight || WND_WIDTH() != this.origWidth) && (this.origWidth = WND_WIDTH(), 
        this.origHeight = WND_HEIGHT(), this.$.catFitRow.applyStyle("height", WND_HEIGHT() + "px"), 
        this.$.catFitRow.reflow(), this.$.editCatPop.applyStyle("height", WND_HEIGHT() + "px"));
    },
    selectedNode: {},
    deleteItem: function() {
        "cat" == this.deleteMode ? this.deleteCategory() : "blog" == this.deleteMode && this.deleteBlog();
    },
    moveToCategory: function(t, e) {
        var i = e.category, n = APPLICATION.favoriteCategories[this.catSwipeIndex], o = this.currentBlogs[this.blogSwipeIndex].name, s = this.currentBlogs[this.blogSwipeIndex].tagMode;
        APPLICATION.favorites.moveToCategory(o, n, i, s), this.catPickerCancel(), this.refreshCurrentBlogs(this.catSwipeIndex), 
        this.$.blogList.setCount(this.currentBlogs.length), this.$.blogList.refresh(), TUMBLR.bannerMessageCallback((s ? "Tag " : "User ") + LIMIT_TEXT_LENGTH(o, 100) + " moved to category " + LIMIT_TEXT_LENGTH(i, 100) + ".");
    },
    deleteBlog: function() {
        this.closeDeleteConfirm(), APPLICATION.favorites.deleteFavorite(this.currentBlogs[this.blogSwipeIndex].name, this.catSwipeIndex, this.currentBlogs[this.blogSwipeIndex].tagMode), 
        this.refreshCurrentBlogs(this.catSwipeIndex), this.$.blogList.setCount(this.currentBlogs.length), 
        this.$.blogList.refresh(), TUMBLR.bannerMessageCallback(LIMIT_TEXT_LENGTH(this.currentBlogs[this.blogSwipeIndex].name, 100) + " removed from " + LIMIT_TEXT_LENGTH(cat, 100) + ".");
    },
    deleteCategory: function() {
        this.closeDeleteConfirm();
        var t = APPLICATION.favoriteCategories[this.catSwipeIndex];
        APPLICATION.categories.deleteCategory(this.catSwipeIndex), this.$.catList.setCount(APPLICATION.favoriteCategories.length), 
        this.$.catList.refresh(), TUMBLR.bannerMessageCallback("Category " + LIMIT_TEXT_LENGTH(t, 100) + " removed.");
    },
    requestBlogOrTagMenu: function(t, e) {
        t.tagMode === !0 ? this.doRequestTagMenu({
            blog_name: t.content,
            top: e.pageY,
            left: e.pageX
        }) : this.doRequestExploreMenu({
            blog_obj: APPLICATION.favoriteBlogs[t.index],
            top: e.pageY,
            left: e.pageX
        });
    },
    catPickerCancel: function() {
        this.$.catPicker.hide();
    },
    cancelClick: function() {
        this.$.addDialog.hide();
    },
    closeDeleteConfirm: function() {
        this.$.deleteConfirm.hide();
    },
    catCancel: function() {
        this.$.catList.setPersistSwipeableItem(!1), this.$.catList.slideAwayItem(), this.isSwiping = !1;
    },
    blogCancel: function() {
        this.$.catList.setPersistSwipeableItem(!1), this.$.blogList.slideAwayItem(), this.isSwiping = !1;
    },
    confirmDelete: function() {
        this.catCancel(), "Favorites" != APPLICATION.favoriteCategories[this.catSwipeIndex] ? (this.$.deleteConfirm.show(), 
        this.deleteMode = "cat", this.$.deleteMsg.setContent("Are you sure you want to delete category " + APPLICATION.favoriteCategories[this.catSwipeIndex] + "?")) : TUMBLR.bannerMessageCallback("Favorites can not be deleted.");
    },
    blogSwipeIndex: -1,
    confirmDeleteBlog: function() {
        this.blogCancel(), this.currentBlogs[this.blogSwipeIndex] && (this.deleteMode = "blog", 
        this.$.deleteConfirm.show(), this.$.deleteMsg.setContent("Are you sure you want to delete " + (this.currentBlogs[this.blogSwipeIndex].tagMode === !0 ? "tag " : "blog ") + this.currentBlogs[this.blogSwipeIndex].name + "?"));
    },
    addMode: "category",
    addCat: function() {
        this.catCancel(), this.addMode = "category", this.showAddDialog();
    },
    addItem: function() {
        this.blogCancel(), this.addMode = "item", this.showAddDialog();
    },
    editCatName: function() {
        this.catCancel(), "Favorites" != APPLICATION.favoriteCategories[this.catSwipeIndex] ? (this.addMode = "edit", 
        this.showAddDialog()) : TUMBLR.bannerMessageCallback("Favorites can not be changed.");
    },
    showAddDialog: function() {
        this.$.addDialog.show(), "edit" != this.addMode ? (this.$.addInput.setValue(""), 
        this.$.msg.setContent("Enter a" + ("item" == this.addMode ? "n " + this.addMode : " " + this.addMode) + " name:"), 
        "cat" == this.addMode ? this.$.confirmButton.setSrc("assets/addcaticon.png") : this.$.confirmButton.setSrc("assets/additemicon.png"), 
        this.$.confirmButton.setLabel("Add")) : (this.$.addInput.setValue(APPLICATION.favoriteCategories[this.catSwipeIndex]), 
        this.$.msg.setContent("Change category name:"), this.$.confirmButton.setSrc("assets/editicon.png"), 
        this.$.confirmButton.setLabel("Change")), enyo.dom.showKeyboard(this.$.addInput, this.$.addDialog);
    },
    checkingUser: "",
    userButtonClick: function() {
        this.saveUser(this.checkingUser), this.$.tagOrUser.hide();
    },
    tagButtonClick: function() {
        this.saveTag(this.checkingUser), this.$.tagOrUser.hide();
    },
    yesUser: function() {
        this.checkingUser.length > 0 && (this.$.tagOrUser.show(), this.$.tagOrUserContent.setContent(LIMIT_TEXT_LENGTH(this.checkingUser, 100)), 
        this.$.userButton.setSrc(TUMBLR.getAvatar(this.checkingUser, 30)));
    },
    noUser: function() {
        this.cancelClick(), this.checkingUser.length > 0 && (this.saveTag(this.checkingUser), 
        this.checkingUser = "");
    },
    showingChanged: function() {
        this.inherited(arguments), this.showing || this.$.CONTAIN && this.$.contain.destroyClientControls();
    },
    saveUser: function(t) {
        var e = APPLICATION.favoriteCategories[this.catSwipeIndex];
        APPLICATION.favorites.addFavoriteToCategory(t, e, !1), this.refreshCurrentBlogs(this.catSwipeIndex), 
        this.$.blogList.setCount(this.currentBlogs.length), this.$.blogList.refresh(), TUMBLR.bannerMessageCallback(LIMIT_TEXT_LENGTH(t, 100) + " added to " + LIMIT_TEXT_LENGTH(e, 100) + "!"), 
        this.checkingUser = "";
    },
    saveTag: function(t) {
        var e = APPLICATION.favoriteCategories[this.catSwipeIndex];
        APPLICATION.favorites.addFavoriteToCategory(t, e, !0), this.refreshCurrentBlogs(this.catSwipeIndex), 
        this.$.blogList.setCount(this.currentBlogs.length), this.$.blogList.refresh(), TUMBLR.bannerMessageCallback(LIMIT_TEXT_LENGTH(t, 100) + " added to " + LIMIT_TEXT_LENGTH(e, 100) + "!");
    },
    addUserContent: function() {
        var t = this.$.addInput.getValue();
        this.$.addInput.setValue(""), this.$.msg.setContent("Adding...");
        var e = !1, i = 0;
        if ("category" == this.addMode || "edit" == this.addMode) {
            if ("edit" == this.addMode) {
                if (1 > t.length || "__TEMP" == t) return this.$.msg.setContent(t.length > 0 ? "Category already exists:" : "Enter something please:"), 
                void 0;
                for (i = 0; APPLICATION.favoriteCategories.length > i; i++) if (APPLICATION.favoriteCategories[i].toLowerCase() == t.toLowerCase()) return this.$.msg.setContent("Category already exists:"), 
                void 0;
                APPLICATION.categories.editCategory(this.catSwipeIndex, t), this.catCancel(), enyo.dom.hideKeyboard(this.$.addInput, this), 
                this.$.catList.setCount(APPLICATION.favoriteCategories.length), this.$.catList.refresh();
            } else if ("category" == this.addMode) {
                if (1 > t.length || "__TEMP" == t) return this.$.msg.setContent(t.length > 0 ? "Category already exists:" : "Enter something please:"), 
                void 0;
                if (e = APPLICATION.categories.addCategory(t), e === !0) return this.$.msg.setContent("Category already exists:"), 
                void 0;
                enyo.dom.hideKeyboard(this.$.addInput, this), this.cancelClick(), this.$.catList.setCount(APPLICATION.favoriteCategories.length), 
                this.$.catList.refresh();
            }
        } else "item" == this.addMode && (1 > t.length ? this.$.msg.setContent("Enter something! :") : (enyo.dom.hideKeyboard(this.$.addInput, this), 
        this.cancelClick(), this.checkingUser = t, this.$.image.setSrc(TUMBLR.getAvatar(t, 16))));
    }
});

var PRE_CAT_NAMES = [ "Funny", "Art And Photos", "News And Politics", "Sports", "Crafts", "Animals", "Science And Tech", "TV And Movies" ], PRE_BUILT_CATEGORIES = [ {
    blog_name: "LOL",
    last_date: new Date(),
    category: [ "Funny" ],
    tagMode: !0
}, {
    blog_name: "funny",
    last_date: new Date(),
    category: [ "Funny" ],
    tagMode: !0
}, {
    blog_name: "comics",
    last_date: new Date(),
    category: [ "Funny" ],
    tagMode: !0
}, {
    blog_name: "onionlike",
    last_date: new Date(),
    category: [ "Funny" ],
    tagMode: !1
}, {
    blog_name: "collegehumor",
    last_date: new Date(),
    category: [ "Funny" ],
    tagMode: !1
}, {
    blog_name: "funnyordie",
    last_date: new Date(),
    category: [ "Funny" ],
    tagMode: !1
}, {
    blog_name: "cartoons",
    last_date: new Date(),
    category: [ "Funny" ],
    tagMode: !0
}, {
    blog_name: "haha",
    last_date: new Date(),
    category: [ "Funny" ],
    tagMode: !0
}, {
    blog_name: "art",
    last_date: new Date(),
    category: [ "Art And Photos" ],
    tagMode: !0
}, {
    blog_name: "softpyramid",
    last_date: new Date(),
    category: [ "Art And Photos" ],
    tagMode: !1
}, {
    blog_name: "eightiesart",
    last_date: new Date(),
    category: [ "Art And Photos" ],
    tagMode: !1
}, {
    blog_name: "gif",
    last_date: new Date(),
    category: [ "Art And Photos" ],
    tagMode: !0
}, {
    blog_name: "photo",
    last_date: new Date(),
    category: [ "Art And Photos" ],
    tagMode: !0
}, {
    blog_name: "image",
    last_date: new Date(),
    category: [ "Art And Photos" ],
    tagMode: !0
}, {
    blog_name: "black and white",
    last_date: new Date(),
    category: [ "Art And Photos" ],
    tagMode: !0
}, {
    blog_name: "landscape",
    last_date: new Date(),
    category: [ "Art And Photos" ],
    tagMode: !0
}, {
    blog_name: "Illustration",
    last_date: new Date(),
    category: [ "Art And Photos" ],
    tagMode: !0
}, {
    blog_name: "Artists on Tumblr",
    last_date: new Date(),
    category: [ "Art And Photos" ],
    tagMode: !0
}, {
    blog_name: "news",
    last_date: new Date(),
    category: [ "News And Politics" ],
    tagMode: !0
}, {
    blog_name: "television",
    last_date: new Date(),
    category: [ "News And Politics", "TV And Movies" ],
    tagMode: !0
}, {
    blog_name: "politics",
    last_date: new Date(),
    category: [ "News And Politics" ],
    tagMode: !0
}, {
    blog_name: "newsweek",
    last_date: new Date(),
    category: [ "News And Politics" ],
    tagMode: !1
}, {
    blog_name: "nbcnews",
    last_date: new Date(),
    category: [ "News And Politics" ],
    tagMode: !1
}, {
    blog_name: "science",
    last_date: new Date(),
    category: [ "News And Politics", "Science And Tech" ],
    tagMode: !0
}, {
    blog_name: "tech",
    last_date: new Date(),
    category: [ "News And Politics", "Science And Tech" ],
    tagMode: !0
}, {
    blog_name: "NFL",
    last_date: new Date(),
    category: [ "Sports" ],
    tagMode: !0
}, {
    blog_name: "nationalpostsports",
    last_date: new Date(),
    category: [ "Sports" ],
    tagMode: !1
}, {
    blog_name: "sportbygettyimages",
    last_date: new Date(),
    category: [ "Sports" ],
    tagMode: !1
}, {
    blog_name: "sports",
    last_date: new Date(),
    category: [ "Sports" ],
    tagMode: !0
}, {
    blog_name: "MLB",
    last_date: new Date(),
    category: [ "Sports" ],
    tagMode: !0
}, {
    blog_name: "NBA",
    last_date: new Date(),
    category: [ "Sports" ],
    tagMode: !0
}, {
    blog_name: "Basketball",
    last_date: new Date(),
    category: [ "Sports" ],
    tagMode: !0
}, {
    blog_name: "Football",
    last_date: new Date(),
    category: [ "Sports" ],
    tagMode: !0
}, {
    blog_name: "crafts",
    last_date: new Date(),
    category: [ "Crafts" ],
    tagMode: !0
}, {
    blog_name: "diy",
    last_date: new Date(),
    category: [ "Crafts" ],
    tagMode: !0
}, {
    blog_name: "evrtstudio",
    last_date: new Date(),
    category: [ "Crafts" ],
    tagMode: !1
}, {
    blog_name: "etsygoodies",
    last_date: new Date(),
    category: [ "Crafts" ],
    tagMode: !1
}, {
    blog_name: "fashion",
    last_date: new Date(),
    category: [ "Crafts" ],
    tagMode: !0
}, {
    blog_name: "build",
    last_date: new Date(),
    category: [ "Crafts" ],
    tagMode: !0
}, {
    blog_name: "animals",
    last_date: new Date(),
    category: [ "Animals" ],
    tagMode: !0
}, {
    blog_name: "pets",
    last_date: new Date(),
    category: [ "Animals" ],
    tagMode: !0
}, {
    blog_name: "dog",
    last_date: new Date(),
    category: [ "Animals" ],
    tagMode: !0
}, {
    blog_name: "cat",
    last_date: new Date(),
    category: [ "Animals" ],
    tagMode: !0
}, {
    blog_name: "floydandmarley",
    last_date: new Date(),
    category: [ "Animals" ],
    tagMode: !1
}, {
    blog_name: "phones",
    last_date: new Date(),
    category: [ "Science And Tech" ],
    tagMode: !0
}, {
    blog_name: "technology",
    last_date: new Date(),
    category: [ "Science And Tech" ],
    tagMode: !0
}, {
    blog_name: "space",
    last_date: new Date(),
    category: [ "Science And Tech" ],
    tagMode: !0
}, {
    blog_name: "8bitfuture",
    last_date: new Date(),
    category: [ "Science And Tech" ],
    tagMode: !1
}, {
    blog_name: "sciencecenter",
    last_date: new Date(),
    category: [ "Science And Tech" ],
    tagMode: !1
}, {
    blog_name: "movies",
    last_date: new Date(),
    category: [ "TV And Movies" ],
    tagMode: !0
}, {
    blog_name: "tv",
    last_date: new Date(),
    category: [ "TV And Movies" ],
    tagMode: !0
}, {
    blog_name: "nationalfilmsociety",
    last_date: new Date(),
    category: [ "TV And Movies" ],
    tagMode: !1
}, {
    blog_name: "thetvscreen",
    last_date: new Date(),
    category: [ "TV And Movies" ],
    tagMode: !1
}, {
    blog_name: "cinema",
    last_date: new Date(),
    category: [ "TV And Movies" ],
    tagMode: !0
} ];

// source\views\firsttime\firsttime.js
enyo.kind({
    name: "FirstTimeHelp",
    classes: "first-time-window enyo-fit transform-3d",
    defaultKind: "Slideable3d",
    components: [ {
        name: "intro",
        axis: "h",
        min: -1 * WND_WIDTH(),
        max: 0,
        value: -1 * WND_WIDTH(),
        draggable: !1,
        style: "position:absolute;width: " + WND_WIDTH() + "px;top:" + (WND_HEIGHT() / 2 - 100) + "px;",
        components: [ {
            style: "background-color: rgba(223,223,223, 0.8);border-radius:5px;padding:3px;font-size:80%;",
            components: [ {
                kind: "Image",
                classes: "no-limits",
                src: "assets/icon72.png",
                style: "display:inline-block;width:64px;margin-bottom:40px;margin-right:3px;"
            }, {
                allowHtml: !0,
                content: "Welcome to blogWalker. Lets go through a quick tutorial about how blogWalker is setup and where things are.<br /><br />Tap the screen to continue.",
                style: "display:inline-block;width: " + (WND_WIDTH() - 75) + "px;"
            } ]
        } ]
    }, {
        name: "postInfo",
        axis: "h",
        min: -1 * WND_WIDTH(),
        max: 0,
        value: -1 * WND_WIDTH(),
        draggable: !1,
        style: "position:absolute;width: " + WND_WIDTH() + "px;top:60px;",
        components: [ {
            style: "background-color: rgba(223,223,223, 0.8);border-radius:5px;padding:3px;font-size:75%;",
            components: [ {
                kind: "Image",
                classes: "no-limits",
                src: "assets/uparrow.png",
                style: "display:inline-block;width:64px;margin-bottom:80px;"
            }, {
                allowHtml: !0,
                content: "This is the person who made the post, <b>tap</b> their name or icon to bring up the Blog Menu.<br/>You can add the user to a category, follow/unfollow them, and explore their blog.",
                style: "display:inline-block;width: " + (WND_WIDTH() - 70) + "px;"
            } ]
        } ]
    }, {
        name: "likeButton",
        axis: "h",
        min: 0,
        max: WND_WIDTH(),
        value: WND_WIDTH(),
        draggable: !1,
        style: "position:absolute;width: " + WND_WIDTH() + "px;top:60px;",
        components: [ {
            style: "background-color: rgba(223,223,223, 0.8);border-radius:5px;padding:3px;font-size:80%;",
            components: [ {
                allowHtml: !0,
                content: 'This is the like button.<br />If it is <span style="color:gray">gray</span>, <b>tap</b> to <span style="color:red"><b>like</b></span>.<br />If it\'s <span style="color:red">red</span>, <b>tap</b> to <span style="color:gray"><b>un-like</b></span>.',
                style: "display:inline-block;width: " + (WND_WIDTH() - 70) + "px;"
            }, {
                kind: "Image",
                classes: "no-limits",
                src: "assets/uparrow.png",
                style: "display:inline-block;width:64px;"
            } ]
        } ]
    }, {
        name: "postSection",
        axis: "h",
        min: -1 * WND_WIDTH(),
        max: 0,
        value: -1 * WND_WIDTH(),
        draggable: !1,
        style: "position:absolute;width: " + WND_WIDTH() + "px;top:" + (WND_HEIGHT() / 2 - 110) + "px;",
        components: [ {
            style: "background-color: rgba(223,223,223, 0.8);border-radius:5px;padding:3px;font-size:65%;line-height:90%;",
            components: [ {
                style: "display: inline-block;",
                components: [ {
                    kind: "Image",
                    classes: "no-limits",
                    src: "assets/swipeuparrow.png",
                    style: "display:block;width:64px;margin-bottom:20px;"
                }, {
                    kind: "Image",
                    classes: "no-limits",
                    src: "assets/swipedownarrow.png",
                    style: "display:block;width:64px;margin-bottom:20px;"
                } ]
            }, {
                allowHtml: !0,
                content: 'You can <b>swipe</b> up and down to view the post if it is longer then your screen.<br /><br/>At the bottom of each post, if the post has <b>tags</b>, you can <b>tap them</b> to bring up the Tag Menu, where you can add the tag to a category and perform a tag search.<br/><br />If the post has a <b>note count</b> that is <span style="text-decoration:underline;color:#00BFFF;">blue</span>, you can <b>tap it</b> to see the recent notes that have been left.',
                style: "display:inline-block;width: " + (WND_WIDTH() - 70) + "px;"
            } ]
        } ]
    }, {
        name: "postNavLeft",
        axis: "h",
        min: 64,
        max: WND_WIDTH(),
        value: WND_WIDTH(),
        draggable: !1,
        style: "position:absolute;width: " + (WND_WIDTH() - 64) + "px;top:" + (WND_HEIGHT() / 2 - 150) + "px;",
        components: [ {
            style: "background-color: rgba(223,223,223, 0.8);border-radius:5px;padding:3px;font-size:80%;",
            components: [ {
                kind: "Image",
                classes: "no-limits",
                src: "assets/swipeleftarrow.png",
                style: "display:inline-block;width:64px;"
            }, {
                allowHtml: !0,
                content: "<b>Swipe</b> to the left to view more post.",
                style: "display:inline-block;position:relative;top:-10px;width: " + (WND_WIDTH() - 134) + "px;"
            } ]
        } ]
    }, {
        name: "postNavRight",
        axis: "h",
        min: -1 * (WND_WIDTH() - 64),
        max: 0,
        value: -1 * (WND_WIDTH() - 64),
        draggable: !1,
        style: "position:absolute;width: " + (WND_WIDTH() - 64) + "px;top:" + (WND_HEIGHT() / 2 - 65) + "px;",
        components: [ {
            style: "background-color: rgba(223,223,223, 0.8);border-radius:5px;padding:3px;font-size:75%;",
            components: [ {
                allowHtml: !0,
                content: "<b>Swipe</b> to the right to go back to posts you have already looked at.",
                style: "display:inline-block;width: " + (WND_WIDTH() - 134) + "px;"
            }, {
                kind: "Image",
                classes: "no-limits",
                src: "assets/swiperightarrow.png",
                style: "display:inline-block;margin-bottom:10px;width:64px;"
            } ]
        } ]
    }, {
        name: "posting",
        axis: "h",
        min: 0,
        max: WND_WIDTH(),
        value: WND_WIDTH(),
        draggable: !1,
        style: "position:absolute;bottom:" + TUMBLR.footerHeight + "px;width: " + (WND_WIDTH() - 25) + "px;",
        components: [ {
            style: "background-color: rgba(223,223,223, 0.8);border-radius:5px;padding:3px;font-size:80%;text-justify:justify;",
            components: [ {
                allowHtml: !0,
                content: "This is the Posting and Reblog menu. <b>Tap</b> on it, or <b>pull it out</b> from the side to <b>Reblog</b> the current post you are viewing, or to make a new <b>Photo</b> or <b>Text</b> post.",
                style: "display:inline-block;width: " + (WND_WIDTH() - 100) + "px;"
            }, {
                kind: "Image",
                classes: "no-limits",
                src: "assets/rightarrow.png",
                style: "display:inline-block;width:64px;"
            } ]
        } ]
    }, {
        name: "mainMenu",
        axis: "h",
        min: 0,
        max: WND_WIDTH(),
        value: WND_WIDTH(),
        draggable: !1,
        style: "position:absolute;bottom:0px;width: " + (WND_WIDTH() - 25) + "px;",
        components: [ {
            style: "background-color: rgba(223,223,223, 0.8);border-radius:5px;padding:3px;font-size:75%;text-justify:justify;",
            components: [ {
                allowHtml: !0,
                content: "This is the Main Menu. <b>Tap</b> on it, or <b>pull it out</b> from the side for more options. You can change your <b>View Mode</b> through here.",
                style: "display:inline-block;width: " + (WND_WIDTH() - 100) + "px;"
            }, {
                kind: "Image",
                classes: "no-limits",
                src: "assets/rightarrow.png",
                style: "display:inline-block;width:64px;position:relative;top:10px;"
            } ]
        } ]
    }, {
        name: "mainMenuMore",
        axis: "h",
        min: 0,
        max: WND_WIDTH(),
        value: WND_WIDTH(),
        draggable: !1,
        style: "position:absolute;bottom:0px;width: " + WND_WIDTH() + "px;",
        components: [ {
            style: "background-color: rgba(223,223,223, 0.8);border-radius:5px;padding:3px;font-size:65%;line-height:90%;",
            components: [ {
                kind: "Image",
                classes: "no-limits",
                src: "assets/icon72.png",
                style: "display:inline;width:32px;position:relative;top:10px;"
            }, {
                allowHtml: !0,
                content: "You will use the Main Menu to navigate through different view modes.<br/><br/>There are several <b>Categories</b> built in that you can view and customize.<br /><br/>You can perform <b>Tag</b> searches, or just view <b>Random</b> posts that blogWalker will find for you.<br/><br/>blogWalker keeps a history of each view you explore. You can get back to any by pressing the <b>History</b> button when it is available.<br/><br/>Check out the <b>Help</b> for more information.",
                style: "display:inline;width: " + (WND_WIDTH() - 100) + "px;"
            } ]
        } ]
    }, {
        kind: "ToasterPopup",
        name: "tapTo",
        ontap: "skip",
        allowHtml: !0,
        modal: !1,
        content: '(tap screen to continue)<br /><span style="font-size:80%;color:red;">(or tap this to skip)',
        autoDismiss: !1,
        centeredX: !0,
        anchor: !1,
        style: "background: rgba(223,223,223, 0.9);text-align:center;min-height:30px;color:black;border-radius:5px;padding:3px;font-size:70%;"
    } ],
    tap: function() {
        return this.nextStep(), !0;
    },
    setupMinMax: function() {
        var t = WND_WIDTH();
        this.$.intro.applyStyle("width", t + "px"), this.$.intro.min = -1 * t, this.$.intro.value = -1 * t, 
        this.$.postInfo.applyStyle("width", t + "px"), this.$.postInfo.min = -1 * t, this.$.postInfo.value = -1 * t, 
        this.$.likeButton.applyStyle("width", t + "px"), this.$.likeButton.max = t, this.$.likeButton.value = t, 
        this.$.postSection.applyStyle("width", t + "px"), this.$.postSection.min = -1 * t, 
        this.$.postSection.value = -1 * t, this.$.postNavLeft.applyStyle("width", t - 64 + "px"), 
        this.$.postNavLeft.max = t, this.$.postNavLeft.value = t, this.$.postNavRight.applyStyle("width", t - 64 + "px"), 
        this.$.postNavRight.min = -1 * (t - 64), this.$.postNavRight.value = -1 * (t - 64), 
        this.$.posting.applyStyle("width", t - 25 + "px"), this.$.posting.max = t, this.$.posting.value = t, 
        this.$.mainMenu.applyStyle("width", t - 25 + "px"), this.$.mainMenu.max = t, this.$.mainMenu.value = t, 
        this.$.mainMenuMore.applyStyle("width", t + "px"), this.$.mainMenuMore.max = t, 
        this.$.mainMenuMore.value = t;
    },
    resizeHandler: function() {
        this.setupMinMax(), this.step > 0 ? (this.step--, this.nextStep()) : (this.step = 0, 
        this.$.intro.animateToMax(), this.$.tapTo.setTop(WND_HEIGHT() - 50), this.$.tapTo.show());
    },
    showing: !1,
    create: function() {
        this.inherited(arguments);
    },
    step: 0,
    skip: function(t, e) {
        e.dispatchTarget == this.$.tapTo && (this.hide(), this.$.tapTo.hide());
    },
    show: function() {
        this.inherited(arguments), this.getShowing() === !0 && (this.render(), this.setupMinMax(), 
        this.step = 0, this.$.intro.animateToMax(), this.$.tapTo.setTop(WND_HEIGHT() - 50), 
        this.$.tapTo.show());
    },
    nextStep: function() {
        if (!this.preventStep) {
            switch (this.step) {
              case 0:
                this.$.intro.animateToMin(), this.preventStep = !0, setTimeout(enyo.bind(this, function() {
                    this.$.postInfo.animateToMax(), setTimeout(enyo.bind(this, function() {
                        this.preventStep = void 0;
                    }), 300);
                }), 350);
                break;

              case 1:
                this.$.postInfo.animateToMin(), this.preventStep = !0, setTimeout(enyo.bind(this, function() {
                    this.$.likeButton.animateToMin(), setTimeout(enyo.bind(this, function() {
                        this.preventStep = void 0;
                    }), 300);
                }), 350);
                break;

              case 2:
                this.$.likeButton.animateToMax(), this.$.postSection.animateToMax();
                break;

              case 3:
                this.preventStep = !0, this.$.postSection.animateToMin(), setTimeout(enyo.bind(this, function() {
                    this.$.postNavLeft.animateToMin();
                }), 500), setTimeout(enyo.bind(this, function() {
                    this.$.postNavRight.animateToMax(), setTimeout(enyo.bind(this, function() {
                        this.preventStep = void 0;
                    }), 300);
                }), 2500);
                break;

              case 4:
                this.$.postNavLeft.animateToMax(), this.$.postNavRight.animateToMin(), this.$.tapTo.setTop(5), 
                this.$.tapTo.updatePosition(), this.$.posting.animateToMin();
                break;

              case 5:
                this.$.posting.animateToMax(), this.$.mainMenu.animateToMin();
                break;

              case 6:
                this.$.mainMenu.animateToMax(), this.preventStep = !0, setTimeout(enyo.bind(this, function() {
                    this.$.mainMenuMore.animateToMin(), setTimeout(enyo.bind(this, function() {
                        this.preventStep = void 0;
                    }), 300);
                }), 350);
                break;

              case 7:
                this.hide(), this.$.tapTo.hide(), TUMBLR.bannerMessageCallback("Enjoy!");
            }
            this.step++;
        }
    }
});

// source\app.js
enyo.kind({
    name: "blogWalker.app",
    classes: "main-back enyo-fit",
    handlers: {
        onCloseBlogPop: "closeBlogPop",
        onReblogPost: "openReblogPopup",
        onLikePost: "likeOrUnlikePost",
        onRequestMainMenu: "openMenuList",
        onActualIndexChanged: "setExploreActualIndex"
    },
    components: [ {
        kind: "SmoothPanels",
        components: [ {
            kind: "PeekLoginScreen",
            name: "loginScreen",
            onComplete: "loginFlow",
            showing: !1
        }, {
            kind: "PeekItemsScreen",
            showing: !1,
            name: "tumItems",
            onRequestNewItems: "checkForMoreItems",
            onRequestPrevItems: "checkForPrevItems",
            onRequestExpand: "loadAndExpand"
        }, {
            kind: "CategoryEditor",
            showing: !1,
            floating: !0,
            name: "editCategories",
            onFinished: "exitFavorites",
            onDeleteCategory: "deleteCategory",
            onRequestExploreMenu: "openFavoritesBlogMenu",
            onRequestSaveFavorites: "saveFavorites",
            onRequestTagMenu: "openTagMenu",
            onRequestSaveAll: "saveCatAndBlogs",
            onRequestBanner: "openBannerForCats",
            onRequestExploreCategory: "enterExploreCategoryMode",
            onRequestExploreBlog: "enterExploreMode",
            onRequestReloadDefault: "addDefaultCategories"
        }, {
            kind: "Followers",
            name: "followersScreen",
            floating: !0,
            showing: !1,
            onFinished: "goBack",
            onRequestMoreFollowers: "loadMoreFollowers",
            onRequestMoreFollowing: "loadMoreFollowing"
        }, {
            kind: "PositingView",
            name: "postView",
            showing: !1
        }, {
            kind: "HelpPopup",
            name: "helpPopup",
            onComplete: "goBack",
            showing: !1
        } ]
    }, {
        kind: "ReblogMenu",
        name: "reblogPop",
        onRequestEmail: "emailLink"
    }, {
        kind: "BlogMenu2",
        name: "blogMenu",
        onRequestDeleteFavorite: "deleteFavorite",
        onRequestExploreBlog: "enterExploreMode",
        onRequestSaveFavorites: "saveFavorites",
        onRequestLink: "handleLinks",
        onRequestEmail: "emailLink"
    }, {
        kind: "TagMenu",
        name: "tagMenu",
        onRequestDeleteFavorite: "deleteFavorite",
        onRequestExploreBlog: "enterExploreMode",
        onRequestSaveFavorites: "saveFavorites",
        onRequestLink: "handleLinks",
        onRequestEmail: "emailLink"
    }, {
        kind: "ToasterPopup",
        classes: "popup-backer reblog-back-shadow",
        style: "height:165px;width:280px;",
        floating: !0,
        autoDismiss: !1,
        name: "restorePop",
        align: "right",
        modal: !0,
        scrim: !0,
        components: [ {
            content: "Would you like to resume your previous session?",
            style: "margin-bottom:15px;"
        }, {
            name: "sessionDate",
            classes: "smallText",
            style: "margin-bottom:15px;"
        }, {
            style: "float:right;width:100%;",
            components: [ {
                kind: "onyx.TextIconButton",
                src: "assets/newsessionicon.png",
                ontap: "loginFlow",
                label: "New Session",
                style: "font-size:8pt;float:left;"
            }, {
                kind: "onyx.TextIconButton",
                src: "assets/recenticon.png",
                label: "Resume",
                ontap: "restoreSession",
                style: "float:right;"
            } ]
        } ]
    }, {
        kind: "onyx.Popup",
        classes: "captionBack main-popup-style",
        floating: !0,
        autoDismiss: !1,
        name: "loadingPop",
        centered: !0,
        align: "left",
        anchor: !1,
        modal: !0,
        scrim: !0,
        components: [ {
            kind: "onyx.Spinner",
            classes: "onyx-light",
            style: "display:inline-block;background-size:32px 32px;width:32px;height:32px;"
        }, {
            style: "font-size:70%;margin-left:10px;display:inline-block;",
            content: "Reading History, Please Wait..."
        }, {
            kind: "onyx.Button",
            classes: "onyx-negative",
            ontap: "cancelHistory",
            style: "display:block;width:100%;",
            content: "Cancel"
        } ]
    }, {
        kind: "LoginInfo",
        name: "loginInfo",
        onComplete: "loginFlow"
    }, {
        kind: "TagPopup",
        name: "tagPopup",
        onAccept: "loadNewTag",
        onCancel: "goBack"
    }, {
        kind: "RandomPopup",
        name: "randomPopup",
        onAccept: "loadRandom",
        onCancel: "goBack"
    }, {
        kind: "SettingsPopup",
        name: "settingsPopup",
        onComplete: "goBack",
        align: "top"
    }, {
        kind: "SupportPopup",
        name: "supportPopup",
        onComplete: "goBack"
    }, {
        kind: "CatPicker",
        name: "catPicker",
        onAccept: "loadNewCategory",
        onCancel: "catPickerCancel"
    }, {
        kind: "HistoryMenu",
        name: "historyMenu"
    }, {
        kind: "BannerMessage",
        name: "bannerMsg"
    }, {
        kind: "LoadingBanner",
        name: "loadingBanner"
    }, {
        kind: "FirstTimeHelp",
        name: "firstTime"
    }, {
        kind: "Signals",
        onReadCategories: "loadCategories",
        onReadFavorites: "loadFavorites",
        onReadDash: "parseDashItems",
        onReadExplore: "parseExploreItems",
        onReadBlogExplore: "parseBlogExploreItems",
        onReadFile: "readFile",
        onWriteFile: "writeFile",
        onbackbutton: "goBack",
        onpause: "saveHistory",
        onresume: "twiddle",
        onmenubutton: "menubutton",
        onScrimHide: "restoreNav",
        onRequestHelp: "openHelp",
        onRequestEmailHelp: "emailHelp",
        onHandleLink: "handleLinks",
        onRequestLoadingBanner: "showLoadingBanner",
        onRequestHideBanner: "hideLoadingBanner",
        onRequestSupport: "openSupportPop",
        onForceDashReload: "forceDashReload",
        onSwitchToDashboard: "switchToDashboard",
        onRequestCategory: "requestCategory",
        onRequestTagSearch: "requestTagSearch",
        onRequestRandom: "requestRandom",
        onRequestPostView: "openPostView",
        onRequestRandomize: "gatherRandomBlogs",
        onRequestRefreshPost: "resetAll",
        onRequestLaunchDash: "openDashboard",
        onRequestLoginInfo: "loadloginPop",
        onRequestSettings: "loadSettingsPop",
        onRequestFollowers: "loadFollowers",
        onRequestEditCats: "loadEditCategories",
        onRequestLike: "likeOrUnlikePost",
        onRequestLauchPostInBrowser: "openPostUrl",
        onRequestHistory: "openHistoryMenu",
        onChangeViewMode: "changeView",
        onRequestBlogMenu: "openItemMenu"
    } ],
    lastAccessDate: 0,
    lastModeActualIndex: 0,
    lastFavoritesIndex: 0,
    favoritesOffset: 0,
    favRetry: 0,
    likedInfo: {
        actualIndex: -1,
        settingLiked: !1
    },
    justRefreshUserInfo: !1,
    UPDATING: !1,
    notesMode: !1,
    currentViewName: "loginScreen",
    lastViewStack: [ "loginScreen" ],
    viewChangeMode: !1,
    menubutton: function() {
        "tumItems" == this.currentViewName && this.openMenuList();
    },
    goBack: function() {
        if (this.$.postView.isPosting === !0) return this.$.helpPopup.isOpen === !0 ? (this.$.helpPopup.hide(), 
        !0) : (this.$.postView.goBack(), !0);
        if (this.$.reblogPop.isPopOpen() === !0) return this.$.reblogPop.closeMenu(), !0;
        if (this.$.blogMenu.isOpen === !0) return this.$.blogMenu.closeMenu(), !0;
        if (this.$.tagMenu.isOpen === !0) return this.$.tagMenu.closeMenu(), !0;
        if (!APPLICATION.tumblrUserName || !APPLICATION.tumblrPW) return this.$.loginInfo.show(), 
        void 0;
        if (this.$.settingsPopup.isOpen === !0) return this.$.settingsPopup.hide(), !0;
        if (this.$.loginInfo.isOpen === !0) return this.$.loginInfo.hide(), !0;
        if (this.$.catPicker.isOpen === !0) return this.$.catPicker.hide(), !0;
        if (this.$.tagPopup.isOpen === !0) return this.$.tagPopup.hide(), !0;
        if (this.$.randomPopup.isOpen === !0) return this.$.randomPopup.hide(), !0;
        if (this.$.supportPopup.isOpen === !0) return this.$.supportPopup.hide(), !0;
        switch (this.currentViewName) {
          case "editCategories":
          case "followersScreen":
          case "helpPopup":
            this.lastViewStack.pop(), this.selectViewByName(this.lastViewStack[this.lastViewStack.length - 1]), 
            this.lastViewStack.pop();
            break;

          case "tumItems":
            this.$.tumItems.movePrevious();
            break;

          case "postView":
            this.lastViewStack.pop(), this.selectViewByName(this.lastViewStack[this.lastViewStack.length - 1], 300), 
            this.lastViewStack.pop(), this.$.postView.resetPostView();
        }
        return !0;
    },
    showLoadingBanner: function(t, e) {
        this.$.loadingBanner.show(e.msg, e.icon);
    },
    hideLoadingBanner: function() {
        this.$.loadingBanner.hide();
    },
    openPostView: function(t, e) {
        "reblog" != e.postview ? "postView" != this.currentViewName && (this.selectViewByName("postView"), 
        this.$.postView.loadView(e.postview)) : this.openReblogPopup();
    },
    openSupportPop: function() {
        this.$.supportPopup.setScrim(!0), this.$.supportPopup.show();
    },
    openHelp: function(t, e) {
        this.selectViewByName("helpPopup"), this.$.helpPopup.openHelp(e);
    },
    loadloginPop: function() {
        this.$.loginInfo.setScrim(!0), APPLICATION.tumblrUserName.length > 0 && APPLICATION.tumblrPW.length > 0 ? this.$.loginInfo.setAutoDismiss(!0) : this.$.loginInfo.setAutoDismiss(!1), 
        this.$.loginInfo.show();
    },
    loadSettingsPop: function() {
        this.$.settingsPopup.setScrim(!0), this.$.settingsPopup.show();
    },
    endOfPosts: function() {
        this.$.loadingBanner.hide(), "tumItems" != this.currentViewName ? TUMBLR.bannerMessageCallback("No post available.") : this.getProperItems().length > 0 ? this.$.tumItems.toggleLoadingView(!1) : (this.switchToDashboard(), 
        TUMBLR.bannerMessageCallback("No post available."));
    },
    create: function() {
        this.inherited(arguments), enyo.dom.canAccelerate() && enyo.dom.accelerate(this), 
        TUMBLR.errorCallback = enyo.bind(this, this.setError), TUMBLR.noMorePostCallback = enyo.bind(this, this.endOfPosts), 
        TUMBLR.bannerMessageCallback = enyo.bind(this, this.showBannerMessage), this.setLargeScreen(), 
        APPLICATION.postMode = 0, APPLICATION.actualIndex = 0, APPLICATION.blogToExplore = "", 
        APPLICATION.inTagMode = !1, APPLICATION.favoritesCategory = "", enyo.platform.android || enyo.platform.blackberry || enyo.platform.firefoxOS || this.checkHistory();
    },
    setLargeScreen: function() {
        TUMBLR.isLargeScreen = WND_WIDTH() > 800 ? !0 : !1;
    },
    origWidth: 0,
    origHeight: 0,
    resizeHandler: function() {
        this.inherited(arguments), (WND_HEIGHT() != this.origHeight || WND_WIDTH() != this.origWidth) && (this.origWidth = WND_WIDTH(), 
        this.origHeight = WND_HEIGHT(), this.$.restorePop.setTop(WND_HEIGHT() - 200), this.updateCssImage(), 
        this.setLargeScreen(), TUMBLR.setToolbarHeight(), this.waterfallDown("onApplyResize"), 
        enyo.Signals.send("onForceFlow"));
    },
    updateCssImage: function() {
        enyo.dom.deleteCssRule("img:not(.no-limits)");
        var t = WND_WIDTH() > 614 ? 600 : WND_WIDTH() - 14;
        enyo.dom.createCssRule("img:not(.no-limits) {max-width: " + t + "px !important;min-width: " + t + "px !important;margin-right: 5px;}");
    },
    clearDownloadItems: function() {
        APPLICATION.downloadedItems = [];
    },
    loadHelpView: function() {
        this.openHelp("", {
            help: "intro",
            scrim: !0
        });
    },
    checkHistory: function() {
        this.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>DEVICE READY<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"), 
        enyo.platform.android, enyo.platform.blackberry && blackberry.app.lockOrientation("portrait-primary", !1), 
        this.updateCssImage(), TUMBLR.favoritesReference = this, TUMBLR.favoritesCallback = enyo.bind(this, this.parseItems), 
        enyo.dispatcher.autoForwardEvents.backbutton = 1, window.setTimeout(enyo.bind(this, function() {
            this.$.loadingPop.show(), STORAGE.readFileFavorites(), setTimeout(function() {
                enyo.platform.android && navigator.splashscreen.hide();
            }, 1e3);
        }), 250), this.checkInCount = 0, this.checkedIn = !1, this.canceled = !1;
    },
    restoreHistory: function() {
        var t = STORAGE.get("tumblrSessionDate");
        t && null !== t || (t = new Date().getTime()), this.lastAccessDate = new Date(), 
        this.lastAccessDate.setTime(t), t = STORAGE.get("tumblrListLengths");
        try {
            t = enyo.json.parse(t);
        } catch (e) {
            t = null;
        }
        t && null !== t || (t = {
            dash: 0,
            blog: 0,
            explore: 0
        }), APPLICATION.tumblrNewSession = STORAGE.get("tumblrNewSession"), this.$.loadingPop.hide(), 
        APPLICATION.hasHistory = t.dash > 0 || t.blog > 0 ? !0 : !1, "1" != STORAGE.get("forceNewSession") && (STORAGE.set("forceNewSession", "1"), 
        APPLICATION.hasHistory = !1), this.newSession();
    },
    newSession: function() {
        if (APPLICATION.redirectID = "dashboard", TUMBLR.loggedIn = !1, APPLICATION.setupApplication(), 
        APPLICATION.hasHistory === !0) {
            var t = STORAGE.get("tumblrLastPost");
            try {
                t = enyo.json.parse(PEEK.string.fromBase64(t));
            } catch (e) {
                t = null;
            }
            if (t && null !== t) return APPLICATION.downloadedItems.push(t), this.$.restorePop.setTop(WND_HEIGHT() - 200), 
            this.$.restorePop.show(), this.$.sessionDate.setContent("Last Session: " + this.lastAccessDate.relative()), 
            this.loadItemsView(!0), void 0;
            this.hasHistory = !1;
        } else STORAGE.set("tumblrSessionDate", null), STORAGE.set("tumblrListLengths", null), 
        this.resetAll();
        setTimeout(enyo.bind(this, function() {
            this.loginFlow();
        }), 100);
    },
    loginFlow: function(t, e) {
        if (!APPLICATION.tumblrUserName || !APPLICATION.tumblrPW) return this.$.loginInfo.setScrim(this.viewChangeMode), 
        this.$.loginInfo.show(), void 0;
        if (t && t.getLabel && "New Session" == t.getLabel() && (STORAGE.DELETE_BACKUP_DATA(), 
        STORAGE.set("tumblrSessionDate", null), STORAGE.set("tumblrListLengths", null), 
        this.resetAll()), this.$.loginInfo.hide(), this.$.restorePop.hide(), e && e.prevNames) if (APPLICATION.tumblrUserName != e.prevNames.u || APPLICATION.tumblrPW != e.prevNames.p) APPLICATION.redirectID = "dashboard"; else if (TUMBLR.loggedIn === !0) return;
        TUMBLR.loggedIn = !1, APPLICATION.downloadedItems = [], APPLICATION.actualIndex = 0, 
        this.startLogIn();
    },
    startLogIn: function(t, e) {
        if (this.$.loadingBanner.show("Connecting to Dashboard..."), e && "refresh" == e.target && (TUMBLR.loggedIn = !1, 
        APPLICATION.redirectID = "dashboard"), TUMBLR.loggedIn === !1 || 1 > APPLICATION.downloadedItems.length) APPLICATION.downloadedItems = [], 
        TUMBLR.logIn(enyo.bind(this, this.loggedIn)); else {
            var i = {};
            i.response = {}, i.response.posts = [], this.loggedIn(i);
        }
    },
    loggedIn: function(t) {
        APPLICATION.exploreIndex = -1, APPLICATION.postMode = 0, APPLICATION.favoritesCategory = "", 
        APPLICATION.blogToExplore = "", this.parseItems(t);
    },
    switchToDashboard: function() {
        this.$.loadingBanner.show("Switching to Dashboard..."), setTimeout(enyo.bind(this, function() {
            APPLICATION.postMode = 0, APPLICATION.inTagMode = !1, APPLICATION.favoritesCategory = "", 
            APPLICATION.blogToExplore = "", APPLICATION.exploreIndex = -1, APPLICATION.actualIndex = this.lastModeActualIndex, 
            this.loadItemsView();
        }), 500);
    },
    catPickerCancel: function() {
        this.$.catPicker.hide();
    },
    requestCategory: function() {
        this.$.catPicker.setParams({
            blog_name: "",
            all: !0,
            not_current: !0,
            content: "Choose a category to explore",
            buttonContent: "Explore"
        }), this.$.catPicker.show();
    },
    loadNewCategory: function(t, e) {
        this.catPickerCancel(), APPLICATION.inTagMode = !1, APPLICATION.redirectID = "category", 
        this.enterExploreCategoryMode("", {
            category: e.category
        });
    },
    requestTagSearch: function() {
        this.$.tagPopup.setScrim(!0), this.$.tagPopup.show();
    },
    loadNewTag: function(t, e) {
        this.$.tagPopup.hide(), APPLICATION.redirectID = "tag", APPLICATION.blogToExplore = e.tag, 
        APPLICATION.inTagMode = !0, APPLICATION.favoritesCategory = "", this.enterExploreMode("", {
            blog_name: e.tag,
            tagMode: !0
        });
    },
    requestRandom: function() {
        this.$.randomPopup.setScrim(!0), this.$.randomPopup.show();
    },
    loadRandom: function() {
        this.$.randomPopup.hide(), APPLICATION.redirectID = "random", APPLICATION.favoritesCategory = "", 
        this.gatherRandomBlogs();
    },
    checkInCount: 0,
    checkedIn: !1,
    canceled: !1,
    dirReaderRetries: 0,
    favoritesRetries: 0,
    categoriesRetries: 0,
    selectViewByName: function(t) {
        this.lastViewStack.push(t), this.$.smoothPanels.select(this.$[t]), this.$[t].resizeHandler(), 
        this.currentViewName = t;
    },
    setExploreActualIndex: function() {
        (1 == APPLICATION.postMode || 2 == APPLICATION.postMode) && (APPLICATION.exploreItems[APPLICATION.exploreIndex].actualIndex = APPLICATION.actualIndex);
    },
    loadFavorites: function(t, e) {
        APPLICATION.favorites.loadFavorites(e);
    },
    loadCategories: function(t, e) {
        APPLICATION.categories.loadCategories(e);
    },
    openItemMenu: function(t, e) {
        e.tagMode ? (this.$.tagMenu.setBlog_name(e.blog_name), this.$.tagMenu.openAt({
            top: e.top,
            left: e.left
        })) : (this.$.blogMenu.setBlog_name(e.blog_name), this.$.blogMenu.setFollowed(e.followed), 
        this.$.blogMenu.openAt({
            top: e.top,
            left: e.left
        }));
    },
    saveTags: function(t) {
        var e = STORAGE.get("tumblrTags");
        if (e) {
            try {
                e = enyo.json.parse(e);
            } catch (i) {
                e = void 0;
            }
            if (e) {
                for (var n = 0; e.length > n; n++) if (e[n].toLowerCase() == t.toLowerCase()) return;
                e.push(t), e.length > 10 && (e = e.slice(e.length - 10, 11));
            } else e = [], e.push(t);
        } else e = [], e.push(t);
        e = enyo.json.stringify(e), STORAGE.set("tumblrTags", e);
    },
    loadEditCategories: function() {
        return this.selectViewByName("editCategories"), setTimeout(enyo.bind(this, function() {
            this.$.editCategories.feedItems();
        }), 500), !0;
    },
    getBlogPost: function() {
        APPLICATION.inTagMode = !1;
        var t = APPLICATION.blogExploreItems.length + APPLICATION.newPostOffset;
        TUMBLR.getPostFromBlog(APPLICATION.blogToExplore, t, enyo.bind(this, this.parseItems));
    },
    getPostFromTag: function() {
        APPLICATION.inTagMode = !0;
        var t = APPLICATION.blogExploreItems.length > 0 ? APPLICATION.blogExploreItems[APPLICATION.blogExploreItems.length - 1].post.timestamp : new Date().getTime();
        TUMBLR.getPostFromTag(APPLICATION.blogToExplore, t, enyo.bind(this, this.parseItems));
    },
    randomCount: 5,
    gatheringRandom: !1,
    gatheringRandomStage: 0,
    gatherRandomBlogs: function() {
        this.$.loadingBanner.show("Gathering random blogs..."), APPLICATION.postMode = 2, 
        APPLICATION.favorites.stripTempFavorites(), APPLICATION.blogExploreItems = [], this.randomUsersToPull = 2 * (1 + APPLICATION.randomLevel), 
        this.randomRetries = 50 + 3 * (1 + APPLICATION.randomLevel), TUMBLR.gatheringFavorites = !0, 
        this.gatheringRandom = !0, this.gatheringRandomStage = 0, 0 === APPLICATION.randomLevel ? this.buildRandomBlogs() : APPLICATION.randomLevel > 0 && (this.gatheringRandomStage++, 
        TUMBLR.getPrimaryBlogName(), 1 > this.followersList.length ? TUMBLR.getFollowersFromBlog(TUMBLR.PRIMARY_BLOG_NAME, this.followersList.length, enyo.bind(this, this.processRandomFollowers)) : this.processRandomFollowers());
    },
    tempBlogNames: [],
    tempRandomNames: [],
    tempRandomIndex: 0,
    randomUsersToPull: 3,
    randomRetries: 50,
    processRandomFollowers: function(t) {
        var e = "", i = 0, n = 0, o = !1;
        if (t && t.users) for (i = 0; t.users.length > i; i++) this.doesFollowerExist(t.users[i].name) === !1 && this.followersList.push(t.users[i]);
        if (APPLICATION.randomLevel > 1) {
            this.gatheringRandomStage++;
            var s = this.followersList, a = [];
            if (s.length >= this.randomUsersToPull) {
                n = 0;
                do {
                    for (n++, e = s[Math.floor(Math.random() * s.length)].name, o = !1, i = 0; a.length > i; i++) if (a[i] == e) {
                        o = !0;
                        break;
                    }
                    o === !1 && a.push(e);
                } while (a.length < this.randomUsersToPull || n > this.randomRetries);
            } else {
                for (i = 0; s.length > i; i++) a.push(s[i].name);
                if (a.length < this.randomUsersToPull) {
                    var r = this.getDashboardNotes();
                    if (r.length + a.length > this.randomUsersToPull) {
                        n = 0;
                        do {
                            for (n++, e = r[Math.floor(Math.random() * r.length)], o = !1, i = 0; a.length > i; i++) if (a[i] == e) {
                                o = !0;
                                break;
                            }
                            o === !1 && a.push(e);
                        } while (a.length < this.randomUsersToPull || n > this.randomRetries);
                    }
                }
            }
            this.tempRandomIndex = 0, this.tempRandomNames = [], this.gotLevel3Random = !1, 
            this.tempBlogNames = a, TUMBLR.getPostFromBlog(a[0], 0, enyo.bind(this, this.parseRandomItems)), 
            enyo.Signals.send("onStatusUpdate", {
                msg: "Gathering Random Users [step 1 of " + a.length + "]..."
            });
        } else this.buildRandomBlogs();
    },
    getDashboardNotes: function() {
        var t = [];
        for (i = 0; APPLICATION.downloadedItems.length > i; i++) if (APPLICATION.downloadedItems[i].post.notes) for (j = 0; APPLICATION.downloadedItems[i].post.notes.length > j; j++) t.push(APPLICATION.downloadedItems[i].post.notes[j].blog_name);
        return t;
    },
    gotLevel3Random: !1,
    tempTagList: [],
    parseRandomItems: function(t) {
        var e = t.response.posts, i = e.length, n = "", o = 0, s = 0, a = !1;
        if (i > 0) for (o = 0; e.length > o; o++) {
            if (e[o].notes) for (j = 0; e[o].notes.length > j; j++) this.tempRandomNames.push(e[o].notes[j].blog_name);
            e[o].tags && (this.tempTagList = this.tempTagList.concat(e[o].tags));
        }
        if (this.tempRandomIndex < this.tempBlogNames.length && this.tempBlogNames[this.tempRandomIndex + 1]) this.tempRandomIndex++, 
        TUMBLR.getPostFromBlog(this.tempBlogNames[this.tempRandomIndex], 0, enyo.bind(this, this.parseRandomItems)), 
        this.gotLevel3Random === !0 ? (enyo.Signals.send("onStatusUpdate", {
            msg: "Gathering More Random Users [step " + (this.tempRandomIndex + 1) + " of " + this.tempBlogNames.length + "]..."
        }), enyo.Signals.send("onCountUpdate", {
            msg: "[" + this.tempRandomNames.length + " possible blogs, " + (this.tempTagList.length + TAG_LIST.length) + " possible tags]"
        })) : (enyo.Signals.send("onStatusUpdate", {
            msg: "Gathering Random Users [step " + (this.tempRandomIndex + 1) + " of " + this.tempBlogNames.length + "]..."
        }), enyo.Signals.send("onCountUpdate", {
            msg: "[" + this.tempRandomNames.length + " possible blogs, " + (this.tempTagList.length + TAG_LIST.length) + " possible tags]"
        })); else if (APPLICATION.randomLevel > 2 && this.gotLevel3Random === !1) {
            this.gatheringRandomStage++, this.gotLevel3Random = !0;
            var r = this.tempRandomNames, l = [];
            if (r.length >= this.randomUsersToPull) {
                s = 0;
                do {
                    for (s++, n = r[Math.floor(Math.random() * r.length)], a = !1, o = 0; l.length > o; o++) if (l[o] == n) {
                        a = !0;
                        break;
                    }
                    a === !1 && l.push(n);
                } while (l.length < this.randomUsersToPull || s > this.randomRetries);
            } else if (l = r, l.length < this.randomUsersToPull) {
                var h = this.getDashboardNotes();
                if (h.length + l.length > this.randomUsersToPull) {
                    s = 0;
                    do {
                        for (s++, n = h[Math.floor(Math.random() * h.length)], a = !1, o = 0; l.length > o; o++) if (l[o] == n) {
                            a = !0;
                            break;
                        }
                        a === !1 && l.push(n);
                    } while (l.length < this.randomUsersToPull || s > this.randomRetries);
                }
            }
            this.tempRandomIndex = 0, this.tempBlogNames = l, TUMBLR.getPostFromBlog(l[0], 0, enyo.bind(this, this.parseRandomItems)), 
            enyo.Signals.send("onStatusUpdate", {
                msg: "Gathering More Random Users [step " + (this.tempRandomIndex + 1) + " of " + this.tempBlogNames.length + "]..."
            }), enyo.Signals.send("onCountUpdate", {
                msg: "[" + this.tempRandomNames.length + " possible blogs, " + (this.tempTagList.length + TAG_LIST.length) + " possible tags]"
            });
        } else this.buildRandomBlogs();
    },
    buildRandomBlogs: function() {
        var t = [], e = 0;
        if (2 > APPLICATION.randomLevel && (t = this.getDashboardNotes()), APPLICATION.randomLevel > 0) for (e = 0; this.followersList.length > e; e++) t.push(this.followersList[e].name);
        APPLICATION.randomLevel > 1 && (t = t.concat(this.tempRandomNames));
        var i = TAG_LIST.concat(this.tempTagList);
        enyo.Signals.send("onCountUpdate", {
            msg: "[" + t.length + " possible blogs, " + i.length + " possible tags]"
        });
        var n = [], o = "", s = !1, a = 0;
        if (t.length < this.randomCount) {
            for (e = 0; t.length > e; e++) n.push({
                blog_name: t[e],
                tagMode: !1
            });
            for (e = 0; this.randomCount - t.length > e; e++) {
                for (o = i[Math.floor(Math.random() * i.length)], a = 0; n.length > a; a++) if (n[a].blog_name == o && n[a].tagMode === !0) {
                    s = !0;
                    break;
                }
                s === !1 && n.push({
                    blog_name: o,
                    tagMode: !0
                });
            }
        } else {
            var r = 0;
            do {
                for (r++, o = t[Math.floor(Math.random() * t.length)], s = !1, a = 0; n.length > a; a++) if (n[a].blog_name == o && n[a].tagMode === !1) {
                    s = !0;
                    break;
                }
                s === !1 && n.push({
                    blog_name: o,
                    tagMode: !1
                });
            } while (n.length < this.randomCount || r > 75);
        }
        for (var l = [], e = 0; this.randomCount > e; e++) {
            for (l.push(n[e]), o = i[Math.floor(Math.random() * i.length)], s = !1, a = 0; l.length > a; a++) if (l[a].blog_name == o && l[a].tagMode === !0) {
                s = !0;
                break;
            }
            s === !1 && l.push({
                blog_name: o,
                tagMode: !0
            });
        }
        for (n = l, APPLICATION.favorites.addTempFavorites(), e = 0; n.length > e; e++) APPLICATION.favoriteBlogs.push({
            blog_name: n[e].blog_name,
            last_date: new Date(),
            category: [ "__TEMP" ],
            doNotDisplay: !0,
            tagMode: n[e].tagMode
        });
        this.gatheringRandom = !1, this.enterExploreCategoryMode("", {
            category: "__TEMP"
        });
    },
    openHistoryMenu: function() {
        this.$.historyMenu.openAt();
    },
    openReblogPopup: function() {
        this.$.reblogPop.postType = this.getProperItems()[APPLICATION.actualIndex].post.type, 
        this.$.reblogPop.openAt();
    },
    followersList: [],
    followingList: [],
    loadFollowers: function() {
        this.$.loadingBanner.show("Loading Followers/Following List..."), this.selectViewByName("followersScreen"), 
        setTimeout(enyo.bind(this, function() {
            TUMBLR.getPrimaryBlogName(), TUMBLR.getFollowersFromBlog(TUMBLR.PRIMARY_BLOG_NAME, this.followersList.length, enyo.bind(this, this.processFollowers));
        }), 350);
    },
    loadMoreFollowers: function() {
        TUMBLR.getPrimaryBlogName(), TUMBLR.getFollowersFromBlog(TUMBLR.PRIMARY_BLOG_NAME, this.followersList.length, enyo.bind(this, this.processMoreFollowers));
    },
    loadMoreFollowing: function() {
        TUMBLR.getFollowing(this.followersList.length, enyo.bind(this, this.processMoreFollowing));
    },
    processMoreFollowers: function(t) {
        if (t.users) for (var e = 0; t.users.length > e; e++) this.doesFollowerExist(t.users[e].name) === !1 && this.followersList.push(t.users[e]);
        this.$.followersScreen.addMoreFollowers(this.followersList);
    },
    processMoreFollowing: function(t) {
        if (t.blogs) for (var e = 0; t.blogs.length > e; e++) this.doesFollowingExist(t.blogs[e].name) === !1 && this.followingList.push(t.blogs[e]);
        this.$.followersScreen.addMoreFollowing(this.followingList);
    },
    processFollowers: function(t) {
        if (t.users) {
            for (var e = 0; t.users.length > e; e++) this.doesFollowerExist(t.users[e].name) === !1 && this.followersList.push(t.users[e]);
            this.$.followersScreen.updateFollowers(this.followersList), TUMBLR.getFollowing(this.followingList.length, enyo.bind(this, this.processFollowers));
        } else if (t.blogs) {
            for (var i = 0; t.blogs.length > i; i++) this.doesFollowingExist(t.blogs[i].name) === !1 && this.followingList.push(t.blogs[i]);
            this.$.followersScreen.updateFollowing(this.followingList), this.$.loadingBanner.hide();
        }
    },
    doesFollowerExist: function(t) {
        for (var e = 0; this.followersList.length > e; e++) if (this.followersList[e].name == t) return !0;
        return !1;
    },
    doesFollowingExist: function(t) {
        for (var e = 0; this.followingList.length > e; e++) if (this.followingList[e].name == t) return !0;
        return !1;
    },
    openDashboard: function() {
        var t = Math.floor((APPLICATION.actualIndex + APPLICATION.newPostOffset) / 10) + 1;
        this.handleLinks("", {
            url: "http://tumblr.com/dashboard/" + t + "/"
        });
    },
    setError: function(t) {
        if (this.gatheringRandom === !0) switch (this.gatheringRandomStage) {
          case 0:
            break;

          case 1:
            this.buildRandomBlogs();
            break;

          case 2:
          case 3:
            this.tempBlogNames.length > 0 && (this.tempRandomIndex < this.tempBlogNames.length - 1 ? (this.tempRandomIndex++, 
            TUMBLR.getPostFromBlog(this.tempBlogNames[this.tempRandomIndex], 0, enyo.bind(this, this.parseRandomItems)), 
            enyo.Signals.send("onStatusUpdate", {
                msg: "Gathering Random Users [" + (this.tempRandomIndex + 1) + " of " + this.tempBlogNames.length + "]..."
            })) : this.buildRandomBlogs());
        } else TUMBLR.gatheringFavorites === !0 ? (APPLICATION.lastFavoritesIndex = this.lastFavoritesIndex, 
        window.setTimeout(function() {
            TUMBLR.getFavorites(APPLICATION.lastFavoritesIndex + 1);
        }, 1e3)) : 0 === APPLICATION.postMode && APPLICATION.downloadedItems.length > 0 ? (this.loadItemsView(), 
        TUMBLR.bannerMessageCallback(t)) : APPLICATION.postMode > 0 && APPLICATION.blogExploreItems.length > 0 ? (this.loadItemsView(), 
        TUMBLR.bannerMessageCallback(t)) : (this.$.loadingBanner.hide(), TUMBLR.loggedIn = !1, 
        this.selectViewByName("loginScreen"), this.$.loginInfo.show(), TUMBLR.bannerMessageCallback(t));
    },
    showBannerMessage: function(t, e) {
        this.$.bannerMsg.openBannerMessage(t, e);
    },
    checkForPrevItems: function() {
        APPLICATION.actualIndex > 0 && (this.$.loadingBanner.show("Loading..."), window.setTimeout(enyo.bind(this, function() {
            this.loadItemsView();
        }), 300));
    },
    resetAll: function(t, e) {
        APPLICATION.actualIndex = 0, APPLICATION.downloadedItems = [], APPLICATION.blogToExplore = "", 
        APPLICATION.blogExploreItems = [], APPLICATION.exploreIndex = -1, APPLICATION.exploreItems = [], 
        APPLICATION.newPostOffset = 0, this.favoritesOffset = 0, APPLICATION.tmpFavorites = [], 
        APPLICATION.favoritesMinDate = -1, APPLICATION.postMode = 0, e && "refresh" == e.target && this.startLogIn(t, e);
    },
    forceDashReload: function(t, e) {
        0 === APPLICATION.postMode && "published" == e.publish ? (APPLICATION.actualIndex = 0, 
        APPLICATION.downloadedItems = [], APPLICATION.blogToExplore = "", APPLICATION.blogExploreItems = [], 
        APPLICATION.exploreIndex = -1, APPLICATION.exploreItems = [], APPLICATION.newPostOffset = 0, 
        this.favoritesOffset = 0, APPLICATION.tmpFavorites = [], APPLICATION.favoritesMinDate = -1, 
        APPLICATION.postMode = 0, APPLICATION.redirectID = "dashboard", this.startLogIn(t, e)) : "published" == e.publish && (this.forceDash = !0);
    },
    checkForMoreItems: function() {
        enyo.asyncMethod(this, function() {
            0 === APPLICATION.postMode ? TUMBLR.getItems(enyo.bind(this, this.parseItems), !0, APPLICATION.downloadedItems.length + APPLICATION.newPostOffset) : 1 == APPLICATION.postMode ? APPLICATION.inTagMode === !1 ? this.getBlogPost() : this.getPostFromTag() : 2 == APPLICATION.postMode && (TUMBLR.gatheringFavorites = !0, 
            TUMBLR.getFavorites(0));
        });
    },
    likeOrUnlikePost: function() {
        var t = this.getProperItems(), e = t[APPLICATION.actualIndex].post.liked;
        TUMBLR.likeAndUnlikePost(enyo.bind(this, this.checkLikePost), APPLICATION.actualIndex, !e, t[APPLICATION.actualIndex].post.id, t[APPLICATION.actualIndex].post.reblog_key, enyo.bind(this, this.likePostError));
    },
    checkLikePost: function(t, e) {
        var i = this.getProperItems();
        i[t.actualIndex].post.id == t.id && (i[t.actualIndex].post.liked = e ? !t.liked : t.liked), 
        e || TUMBLR.bannerMessageCallback("Post " + (t.liked === !0 ? "liked!" : "un-liked!"), i[t.actualIndex].post.blog_name), 
        enyo.Signals.send("onSetLikeButton", {
            value: i[t.actualIndex].post.liked,
            postId: t.id
        });
    },
    likePostError: function(t) {
        this.checkLikePost(t, !0);
    },
    cleanUpExploreItems: function() {
        for (var t = 0; APPLICATION.exploreItems.length > t; t++) if ("" !== APPLICATION.exploreItems[t].blog_name || "" !== APPLICATION.exploreItems[t].category) {
            if (t != APPLICATION.exploreIndex && (APPLICATION.exploreItems[t].items && this.collapseAndSave(APPLICATION.exploreItems[t].items, !0), 
            APPLICATION.exploreItems[t].tmpFavorites)) for (var e = 0; APPLICATION.exploreItems[t].tmpFavorites.length > e; e++) this.collapseAndSave(APPLICATION.exploreItems[t].tmpFavorites[e].post, !0);
        } else APPLICATION.exploreItems.splice(t, 1), t -= 1;
    },
    changeView: function(t, e) {
        this.$.loadingBanner.show("Loading...");
        var i = e.index, n = APPLICATION.exploreItems[i];
        n ? (APPLICATION.exploreIndex = i, n.catMode === !1 ? (APPLICATION.postMode = 1, 
        APPLICATION.actualIndex = n.actualIndex, APPLICATION.favoritesCategory = "", APPLICATION.blogToExplore = n.blog_name, 
        APPLICATION.blogExploreItems = n.items, APPLICATION.inTagMode = n.tagMode, APPLICATION.redirectID = APPLICATION.inTagMode ? "tag" : "dashboard", 
        this.loadItemsView()) : this.enterExploreCategoryMode("", {
            category: n.category,
            target: "refresh"
        }), this.cleanUpExploreItems()) : this.switchToDashboard();
    },
    enterExploreCategoryMode: function(t, e) {
        if (APPLICATION.favoritesCategory = e.category, APPLICATION.blogToExplore = "", 
        0 === APPLICATION.postMode && this.viewChangeMode === !1 && (this.lastModeActualIndex = APPLICATION.actualIndex), 
        this.viewChangeMode = !1, this.$.loadingBanner.show("Loading Category " + LIMIT_TEXT_LENGTH(APPLICATION.favoritesCategory, 100)), 
        APPLICATION.postMode = 2, APPLICATION.inTagMode = !1, this.lastFavoritesIndex = 0, 
        this.collapseAndSave(APPLICATION.downloadedItems, !0), this.savingSwitch = 4, e.target && "refresh" == e.target) enyo.Signals.send("onIconUpdate", {
            src: "assets/sorting.gif"
        }), APPLICATION.favoritesMinDate = APPLICATION.exploreItems[APPLICATION.exploreIndex].mindate, 
        APPLICATION.blogExploreItems = APPLICATION.exploreItems[APPLICATION.exploreIndex].items, 
        APPLICATION.tmpFavorites = APPLICATION.exploreItems[APPLICATION.exploreIndex].tmpFavorites, 
        APPLICATION.actualIndex = APPLICATION.exploreItems[APPLICATION.exploreIndex].actualIndex, 
        APPLICATION.redirectID = "__TEMP" == APPLICATION.favoritesCategory ? "random" : "category", 
        this.loadItemsView(); else {
            for (var i = !1, n = 0, o = 0; APPLICATION.exploreItems.length > o; o++) if (APPLICATION.exploreItems[o].category == APPLICATION.favoritesCategory) {
                i = !0, n = o;
                break;
            }
            i ? (APPLICATION.exploreItems[n].items = [], APPLICATION.exploreItems[n].actualIndex = 0, 
            APPLICATION.exploreItems[n].tmpFavorites = [], APPLICATION.exploreIndex = n) : (APPLICATION.exploreIndex = APPLICATION.exploreItems.length, 
            this.cleanUpExploreItems()), APPLICATION.blogExploreItems = [], APPLICATION.tmpFavorites = [], 
            APPLICATION.actualIndex = 0, TUMBLR.favoritesReference = this, TUMBLR.favoritesCallback = enyo.bind(this, this.parseItems), 
            TUMBLR.gatheringFavorites = !0, TUMBLR.getFavorites(0);
        }
    },
    enterExploreMode: function(t, e) {
        0 === APPLICATION.postMode && (this.lastModeActualIndex = APPLICATION.actualIndex), 
        APPLICATION.postMode = 1, APPLICATION.blogExploreItems = [], APPLICATION.newPostOffset = 0, 
        APPLICATION.favoritesCategory = "", APPLICATION.blogToExplore = e.blog_name;
        for (var i = !1, n = 0, o = 0; APPLICATION.exploreItems.length > o; o++) if (APPLICATION.exploreItems[o].blog_name == APPLICATION.blogToExplore) {
            i = !0, n = o;
            break;
        }
        i ? (APPLICATION.exploreItems[n].items = [], APPLICATION.exploreItems[n].actualIndex = 0, 
        APPLICATION.exploreIndex = n) : (APPLICATION.exploreIndex++, this.cleanUpExploreItems()), 
        APPLICATION.actualIndex = 0, this.collapseAndSave(APPLICATION.downloadedItems, !0), 
        this.savingSwitch = 4, e.tagMode === !0 ? (this.$.loadingBanner.show("Searching tag " + LIMIT_TEXT_LENGTH(e.blog_name, 100)), 
        this.saveTags(APPLICATION.blogToExplore), APPLICATION.redirectID = "tag", this.getPostFromTag()) : (this.$.loadingBanner.show("Searching " + LIMIT_TEXT_LENGTH(e.blog_name, 100), {
            blog_name: e.blog_name
        }), APPLICATION.redirectID = "dashboard", this.getBlogPost());
    },
    parseItems: function(t, e) {
        var i = 0;
        i = t ? t.response.posts.length : 0;
        var n = [], o = 0 === APPLICATION.postMode ? APPLICATION.downloadedItems.length : APPLICATION.blogExploreItems.length;
        if (0 !== i || 2 == APPLICATION.postMode || "random" == APPLICATION.redirectID) {
            this.$.tumItems.toggleLoadingView(!0);
            for (var s = 0; i > s; s++) {
                var a = !1;
                a = 2 == APPLICATION.postMode ? this.doesIdExistFavorites(t.response.posts[s].id) : this.doesIdExist(t.response.posts[s].id), 
                a === !1 ? (n.push({
                    kind: "tumbleItem",
                    iIndex: o,
                    name: "tumitem" + o + ("" + s) + Math.floor(1e5 * Math.random()) + "end",
                    usePostType: t.response.posts[s].type,
                    post: t.response.posts[s]
                }), o++) : APPLICATION.newPostOffset++;
            }
            if (0 === APPLICATION.postMode || TUMBLR.dashItems === !0) TUMBLR.dashItems = !1, 
            0 === n.length ? this.noMorePost() : APPLICATION.downloadedItems = APPLICATION.downloadedItems.concat(n); else if (1 == APPLICATION.postMode ? APPLICATION.blogExploreItems = APPLICATION.blogExploreItems.concat(n) : n.length > 0 && !e ? (APPLICATION.tmpFavorites[this.lastFavoritesIndex].post = APPLICATION.tmpFavorites[this.lastFavoritesIndex].post.concat(n), 
            APPLICATION.tmpFavorites[this.lastFavoritesIndex].last_date = APPLICATION.inTagMode === !0 ? new Date(1e3 * Number(t.response.posts[t.response.posts.length - 1].timestamp)) : new Date(1e3 * Number(t.response.blog.updated)), 
            this.collapseAndSave(APPLICATION.tmpFavorites[this.lastFavoritesIndex].post, !0, !0)) : e || (APPLICATION.tmpFavorites[this.lastFavoritesIndex].noMorePost = !0), 
            TUMBLR.gatheringFavorites === !1) {
                var r = !1;
                for (o = -1, s = 0; APPLICATION.exploreItems.length > s; s++) if (APPLICATION.exploreItems[s].blog_name == APPLICATION.blogToExplore && APPLICATION.exploreItems[s].blog_name.length > 0) {
                    r = !0, o = s;
                    break;
                }
                if (r) APPLICATION.exploreItems[o].items = enyo.clone(APPLICATION.blogExploreItems), 
                APPLICATION.exploreIndex = o; else if (APPLICATION.blogToExplore.length > 0) {
                    var l = {
                        blog_name: APPLICATION.blogToExplore,
                        actualIndex: APPLICATION.actualIndex,
                        items: enyo.clone(APPLICATION.blogExploreItems),
                        tagMode: APPLICATION.inTagMode,
                        catMode: !1,
                        category: "",
                        mindate: "",
                        tmpFavorites: []
                    };
                    APPLICATION.exploreIndex = APPLICATION.exploreItems.push(l), APPLICATION.exploreIndex--;
                }
            }
            TUMBLR.gatheringFavorites === !1 ? e || this.loadItemsView() : (APPLICATION.lastFavoritesIndex = this.lastFavoritesIndex, 
            window.setTimeout(function() {
                TUMBLR.getFavorites(APPLICATION.lastFavoritesIndex + 1);
            }, 1e3));
        } else e || this.loadItemsView();
    },
    doesIdExist: function(t) {
        for (var e = this.getProperItems(), i = e.length - 1; i >= 0; i--) if (parseInt(e[i].post.id, 10) == parseInt(t, 10)) return !0;
        return !1;
    },
    doesIdExistFavorites: function(t) {
        for (var e = APPLICATION.tmpFavorites[this.lastFavoritesIndex].post, i = e.length - 1; i >= 0; i--) if (parseInt(e[i].post.id, 10) == parseInt(t, 10)) return !0;
        return !1;
    },
    getProperItems: function() {
        return 0 === APPLICATION.postMode ? APPLICATION.downloadedItems : APPLICATION.blogExploreItems;
    },
    writeFile: function(t, e) {
        var i = "";
        if (e && e.status === !0 && this.savingHistory === !0) switch (e.filename) {
          case "blogWalker.dash":
            setTimeout(enyo.bind(this, function() {
                return this.oldL.explore != APPLICATION.exploreItems.length ? (i = enyo.json.stringify(APPLICATION.exploreItems), 
                STORAGE.saveExploreItems(i), void 0) : this.oldL.blog != APPLICATION.blogExploreItems.length ? (i = enyo.json.stringify(APPLICATION.blogExploreItems), 
                STORAGE.saveBlogExploreItems(i), void 0) : (this.savingHistory = !1, this.$.tumItems.twiddle(), 
                void 0);
            }), 50);
            break;

          case "blogWalker.explore":
            setTimeout(enyo.bind(this, function() {
                return this.oldL.blog != APPLICATION.blogExploreItems.length ? (i = enyo.json.stringify(APPLICATION.blogExploreItems), 
                STORAGE.saveBlogExploreItems(i), void 0) : (this.savingHistory = !1, this.$.tumItems.twiddle(), 
                void 0);
            }), 50);
            break;

          case "blogWalker.blog":
            setTimeout(enyo.bind(this, function() {
                i = enyo.json.stringify(APPLICATION.tmpFavorites), STORAGE.saveTmpItems(i);
            }), 50);
            break;

          case "blogWalker.tmp":
            this.savingHistory = !1, this.$.tumItems.twiddle();
        }
    },
    savingHistory: !1,
    saveHistory: function() {
        this.savingHistory = !0, enyo.Signals.send("onStatusUpdate", {
            msg: "Saving History..."
        }), STORAGE.set("tumblrExploreIndex", APPLICATION.exploreIndex), STORAGE.set("tumblrActualIndex", APPLICATION.actualIndex), 
        STORAGE.set("tumblrPostMode", APPLICATION.postMode), STORAGE.set("tumblrFaveCat", APPLICATION.favoritesCategory), 
        STORAGE.set("tumblrBlogToExplore", APPLICATION.blogToExplore), STORAGE.set("tumblrinTagMode", APPLICATION.inTagMode), 
        this.getProperItems()[APPLICATION.actualIndex] && STORAGE.set("tumblrLastPost", PEEK.string.toBase64(enyo.json.stringify(this.getProperItems()[APPLICATION.actualIndex])));
        var t = {
            dash: APPLICATION.downloadedItems.length,
            blog: APPLICATION.blogExploreItems.length,
            explore: APPLICATION.exploreItems.length
        }, e = "", i = STORAGE.get("tumblrListLengths"), n = enyo.json.stringify(t);
        return STORAGE.set("tumblrListLengths", n), STORAGE.set("tumblrSessionDate", new Date().getTime()), 
        STORAGE.set("tumblrPBN", TUMBLR.PRIMARY_BLOG_NAME), STORAGE.set("tumblrLIK", PEEK.string.toBase64(enyo.json.stringify(TUMBLR.loginKeys))), 
        STORAGE.set("tumblrUO", PEEK.string.toBase64(enyo.json.stringify(TUMBLR.userObject))), 
        this.oldL = i, i.dash != t.dash ? (e = enyo.json.stringify(APPLICATION.downloadedItems), 
        STORAGE.saveDashItems(e), void 0) : i.explore != t.explore ? (e = enyo.json.stringify(APPLICATION.exploreItems), 
        STORAGE.saveExploreItems(e), void 0) : i.blog != t.blog ? (e = enyo.json.stringify(APPLICATION.blogExploreItems), 
        STORAGE.saveBlogExploreItems(e), void 0) : void 0;
    },
    parseExploreItems: function(t, e) {
        if (this.canceled !== !0) {
            var i = null;
            try {
                if (e && e.text) {
                    i = e.text;
                    try {
                        i = enyo.json.parse(i);
                    } catch (n) {
                        i = [];
                    }
                }
            } catch (n) {}
            i && null !== i || (i = []), APPLICATION.exploreItems = i, this.checkInCount++, 
            this.checkCheckin();
        }
    },
    parseTmpItems: function(t, e) {
        if (this.canceled !== !0) {
            var i = null;
            try {
                if (e && e.text) {
                    i = e.text;
                    try {
                        i = enyo.json.parse(i);
                    } catch (n) {
                        i = [];
                    }
                }
            } catch (n) {}
            i && null !== i || (i = []), APPLICATION.tmpFavorites = i;
            for (var o = 0; APPLICATION.tmpFavorites.length > o; o++) APPLICATION.tmpFavorites[o].last_date = APPLICATION.tmpFavorites[o].last_date ? new Date(Date.parse(APPLICATION.tmpFavorites[o].last_date)) : new Date();
            this.checkInCount++, this.checkCheckin();
        }
    },
    parseDashItems: function(t, e) {
        if (this.canceled !== !0) {
            var i = null;
            try {
                if (e && e.text) {
                    i = e.text;
                    try {
                        i = enyo.json.parse(i);
                    } catch (n) {
                        i = [];
                    }
                }
            } catch (n) {}
            i && null !== i || (i = []), APPLICATION.downloadedItems = i, this.checkInCount++, 
            this.checkCheckin();
        }
    },
    parseBlogExploreItems: function(t, e) {
        if (this.canceled !== !0) {
            var i = null;
            try {
                if (e && e.text) {
                    i = e.text;
                    try {
                        i = enyo.json.parse(i);
                    } catch (n) {
                        i = [];
                    }
                }
            } catch (n) {}
            i && null !== i || (i = []), APPLICATION.blogExploreItems = i, this.checkInCount++, 
            this.checkCheckin();
        }
    },
    checkCheckin: function() {
        this.checkInCount >= 4 && this.checkedIn === !1 && (this.checkedIn = !0, this.loadItemsView());
    },
    cancelHistory: function() {
        this.$.loadingPop.hide(), this.canceled = !0, this.checkInCount = 4, APPLICATION.downloadedItems = [], 
        APPLICATION.blogExploreItems = [], APPLICATION.tmpFavorites = [], APPLICATION.exploreItems = [], 
        APPLICATION.actualIndex = 0, this.newSession();
    },
    restoreSession: function() {
        this.$.restorePop.hide(), this.$.loadingBanner.show("Resuming session..."), setTimeout(enyo.bind(this, function() {
            APPLICATION.setupApplication(), APPLICATION.fillSessionData(), STORAGE.readFileDash();
        }), 500);
    },
    dashboardRetries: 0,
    exploreRetries: 0,
    blogRetries: 0,
    tmpRetries: 0,
    readFile: function(t, e) {
        switch (e.filename) {
          case "blogWalker.favorites":
            e.status === !0 ? (this.loadFavorites(t, e), STORAGE.readFileCategories()) : (this.favoritesRetries++, 
            this.favoritesRetries > 3 ? (this.favoritesRetries = 0, alert("DRATS! blogWalker can't read your favorites...Try reloading the app and hope its a fluke!")) : STORAGE.readFileFavorites());
            break;

          case "blogWalker.explore":
            e.status === !0 ? (this.parseExploreItems(t, e), STORAGE.readFileBlogExplore()) : (this.exploreRetries++, 
            this.exploreRetries > 3 ? (this.exploreRetries = 0, alert("DRATS! blogWalker can't read your saved explored items...Try reloading the app and hope its a fluke!")) : STORAGE.readFileExplore());
            break;

          case "blogWalker.blog":
            e.status === !0 ? (this.parseBlogExploreItems(t, e), STORAGE.readFileTmp()) : (this.blogRetries++, 
            this.blogRetries > 3 ? (this.blogRetries = 0, alert("DRATS! blogWalker can't read your saved blog explored items...Try reloading the app and hope its a fluke!")) : STORAGE.readFileBlogExplore());
            break;

          case "blogWalker.tmp":
            e.status === !0 ? this.parseTmpItems(t, e) : (this.tmpRetries++, this.tmpRetries > 3 ? (this.tmpRetries = 0, 
            alert("DRATS! blogWalker can't read your saved category views...Try reloading the app and hope its a fluke!")) : STORAGE.readFileTmp());
            break;

          case "blogWalker.dash":
            e.status === !0 ? (this.parseDashItems(t, e), STORAGE.readFileExplore()) : (this.dashboardRetries++, 
            this.dashboardRetries > 3 ? (this.dashboardRetries = 0, alert("DRATS! blogWalker can't read your saved dashboard...Try reloading the app and hope its a fluke!")) : STORAGE.readFileDash());
            break;

          case "blogWalker.categories":
            e.status === !0 ? (this.loadCategories(t, e), this.restoreHistory()) : (this.categoriesRetries++, 
            this.categoriesRetries > 3 ? (this.categoriesRetries = 0, alert("DRATS! blogWalker can't read your categories...Try reloading the app and hope its a fluke!")) : STORAGE.readFileCategories());
        }
    },
    savingSwitch: 0,
    loadItemsView: function(t) {
        this.$.tumItems.sentRequest === !1 && this.$.loadingBanner.show("Rendering...");
        var e = this.getProperItems();
        if (0 >= e.length) return this.setError("No post available"), void 0;
        for (var i = APPLICATION.actualIndex, n = i - 5; i + 5 > n; n++) if (e[n] && e[n].post && e[n].post.needsExpand) return this.loadAndExpand("", {
            items: e,
            file: e[n].post.inFile
        }, enyo.bind(this, this.loadItemsView)), void 0;
        APPLICATION.postMode >= 1 && APPLICATION.exploreItems[APPLICATION.exploreIndex] && (APPLICATION.exploreItems[APPLICATION.exploreIndex].actualIndex = APPLICATION.actualIndex), 
        "tumItems" != this.currentViewName && this.selectViewByName("tumItems"), this.$.tumItems.setItems(e), 
        t ? (this.UPDATING = !1, this.$.loadingBanner.hide()) : (this.savingSwitch++, this.UPDATING = !0, 
        (this.savingSwitch > 3 || enyo.platform.chrome) && (enyo.Signals.send("onStatusUpdate", {
            msg: "Saving History..."
        }), this.collapseAndSave(e), enyo.asyncMethod(this, function() {
            this.saveHistory();
        }), this.savingSwitch = 0), window.setTimeout(enyo.bind(this, function() {
            this.$.loadingBanner.hide(), this.UPDATING = !1;
        }), 3200)), this.$.loginScreen.applyStyle("display", "none"), APPLICATION.firstTimeRun !== !1 || t || (this.UPDATING === !0 ? window.setTimeout(enyo.bind(this, function() {
            this.$.firstTime.show();
        }), 3e3) : this.$.firstTime.show(), APPLICATION.firstTimeRun = !0, STORAGE.set("firstTimeRun", !0));
    },
    openMenuList: function() {
        var t = {};
        t.right = 1, t.bottom = TUMBLR.footerHeight, this.$.mainMenu.openAt(t);
    },
    emailLink: function(t, e) {
        var i = "Check it! ==>  ", n = e && e.url ? e.url : this.getProperItems()[APPLICATION.actualIndex].post.post_url;
        i += n, APPLICATION.sendShareRequest("Check out this tumblr post!", i, n, null, !0);
    },
    emailHelp: function() {
        APPLICATION.sendShareRequest("blogWalker support Question/Comment", "Please describe any issues the best as you can", null, "support@appsbychris.net", !1);
    },
    openPostUrl: function() {
        var t = this.getProperItems()[APPLICATION.actualIndex].post.post_url;
        if (t) {
            var e = {
                url: t
            };
            this.handleLinks("", e);
        }
    },
    handleLinks: function(t, e) {
        return APPLICATION.handleLinks(e, enyo.bind(this, this.twiddle)), !0;
    },
    twiddle: function() {
        this.hasNode() && (this.node.scrollTop = 1, this.node.scrollTop = 0), document.documentElement.scrollTop = 1, 
        document.documentElement.scrollTop = 0;
    },
    collapseAndSave: function(t, e, i) {
        if (enyo.platform.android || enyo.platform.blackberry || enyo.platform.firefoxOS) {
            var n = APPLICATION.actualIndex - 5;
            e && (n = t.length);
            var o = [], s = [], a = 0, r = "", l = function(t) {
                var e = function() {
                    var t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", e = Math.floor(Math.random() * t.length);
                    return t.substr(e, 1);
                }, i = function(t, i) {
                    return e() + t + Math.floor(1e5 * Math.random()) + e() + i + Math.floor(999 * Math.random()) + e() + Math.floor(1e5 * Math.random()) + e();
                };
                return i("postrestore" + e(), t);
            };
            if (n > 0 && n - 5 > 0 || e) {
                r = l("" + n);
                for (var h = 0; n > h; h++) t[h].post.needsExpand || (!i || i && t[h].post.INSERTED) && (4 > o.length ? (a = o.push({
                    post: t[h].post
                }) - 1, t[h].post = {
                    needsExpand: !0,
                    id: o[a].post.id,
                    inFile: r
                }, t[h].cellComponents = []) : (s.push({
                    file: o,
                    file_name: r
                }), o = [], r = l("" + h), a = o.push({
                    post: t[h].post
                }) - 1, t[h].post = {
                    needsExpand: !0,
                    id: o[a].post.id,
                    inFile: r
                }, t[h].cellComponents = []));
                (s.length > 0 || o.length > 0) && (s.push({
                    file: o,
                    file_name: r
                }), STORAGE.PROCESS_POST_BACKUP(s));
            }
        }
    },
    processItems: function(t, e, i, n, o, s, a, r) {
        var l = function(t) {
            var e = function() {
                var t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", e = Math.floor(Math.random() * t.length);
                return t.substr(e, 1);
            }, i = function(t, i) {
                return e() + t + Math.floor(1e5 * Math.random()) + e() + i + Math.floor(999 * Math.random()) + e() + Math.floor(1e5 * Math.random()) + e();
            };
            return i("postrestore" + e(), t);
        };
        n || (r = l("" + i), o = 0, s = [], a = []), this.$.tumItems.$.contain.twiddle();
        var h = this._processItem(t[o], e, r);
        h.item.post && (5 > a.length ? a.push(h.item) : (s.push({
            file: enyo.clone(a),
            file_name: r
        }), a = [], r = l("" + o))), o >= i - 1 ? (s.length > 0 || a.length > 0) && (s.push({
            file: enyo.clone(a),
            file_name: r
        }), enyo.asyncMethod(this, function() {
            STORAGE.PROCESS_POST_BACKUP(s);
        })) : (o++, enyo.asyncMethod(this, function() {
            this.processItems(t, e, i, !0, o, s, a, r);
        }));
    },
    _processItem: function(t, e, i) {
        var n = {};
        return t && t.post && !t.post.needsExpand && (!e || e && t.post.INSERTED) && (n = {
            post: t.post
        }, t.post = {
            needsExpand: !0,
            id: n.post.id,
            inFile: i
        }, t.cellComponents = []), {
            item: n
        };
    },
    expandingArray: [],
    expandCallback: function() {},
    loadAndExpand: function(t, e, i) {
        this.expandingArray = e.items, this.expandCallback = i ? i : enyo.bind(this, function() {}), 
        STORAGE.LOAD_POST_FILE(e.file, enyo.bind(this, this.expandItems));
    },
    expandItems: function(t) {
        var e = t.file;
        if (!e) return this.setError("Error reading history..."), void 0;
        for (var i = 0; e.length > i; i++) for (var n = 0; this.expandingArray.length > n; n++) if (this.expandingArray[n].post.needsExpand && this.expandingArray[n].post.id == e[i].post.id) {
            this.expandingArray[n].post = e[i].post;
            break;
        }
        this.$.tumItems.twiddle(), setTimeout(enyo.bind(this, function() {
            this.expandCallback();
        }), 500);
    }
}), enyo.kind({
    name: "blogWalker.Application",
    kind: "enyo.Application",
    view: "blogWalker.app",
    renderTarget: "appcon",
    components: [ {
        kind: "Signals",
        ondeviceready: "deviceReady"
    } ],
    deviceReadyCalled: !1,
    deviceReady: function() {
        this.deviceReadyCalled === !1 && (this.deviceReadyCalled = !0, (enyo.platform.android || enyo.platform.blackberry || enyo.platform.firefoxOS) && this.view.checkHistory());
    },
    create: enyo.inherit(function(t) {
        return function() {
            t.apply(this, arguments), setTimeout(enyo.bind(this, function() {
                this.deviceReady();
            }), 1e4);
        };
    })
}), enyo.ready(function() {
    enyo.platform.androidChrome && (enyo.platform.android = 4), new blogWalker.Application();
});
