Ext.define('SimpleCMS.ux.form.field.Search', {
    extend: 'Ext.form.field.Text',

    alias: 'widget.uxsearchfield',

    mixins: [
        'Ext.util.StoreHolder'
    ],

    triggers: {
        clear: {
            weight: 0,
            cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            hidden: true,
            handler: 'onClearClick',
            scope: 'this'
        },
        search: {
            weight: 1,
            cls: Ext.baseCSSPrefix + 'form-search-trigger',
            handler: 'onSearchClick',
            scope: 'this'
        }
    },

    hasSearch: false,
    paramName: 'query',

    initComponent: function () {
        var me = this,
            store = me.store,
            proxy;

        me.bindStore(me.store || 'ext-empty-store', true);

        me.callParent(arguments);
        me.on('specialkey', function (f, e) {
            if (e.getKey() == e.ENTER) {
                me.onSearchClick();
            }
        });

    },

    onClearClick: function () {
        var me = this,
            store = me.store,
            proxy = store.getProxy();

        me.setValue('');
        proxy.setExtraParam(me.paramName, '');
        store.load();
        me.getTrigger('clear').hide();
        me.updateLayout();
    },

    onSearchClick: function () {
        var me = this,
            value = me.getValue(),
            store = me.store,
            proxy = me.store.getProxy();

        if (value.length > 0) {
            proxy.setExtraParam(me.paramName, value);
            store.load();
            me.getTrigger('clear').show();
            me.updateLayout();
        }
    },

    doDestroy: function () {
        var me = this;

        me.bindStore(null);

        me.callParent();
    }
});