Ext.define('SimpleCMS.view.media.Win',{
    extend: 'Ext.window.Window',
    xtype: 'mediaWin',

    requires: [
        'SimpleCMS.view.media.MediaPanel'
    ],

    width: Ext.Element.getViewportWidth() - 40,
    height: Ext.Element.getViewportHeight() - 40,
    modal: true,
    closeAction: 'hide',
    hideMode: 'offsets',
    layout: 'fit',
    closable: true,
    resizable: true,

    items: [
        {
            xtype: 'mediaPanel',
            fbar: [
                { text: I18N.Selected, bind: { disabled: '{!selection}' }, itemId: 'selectedButton' },
                { text: I18N.Cancel, itemId: 'cancelButton' }
            ]
        }
    ],

    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.down('#selectedButton').on('click', me.onInsertMedia, me);
        me.down('#cancelButton').on('click', me.onCancel, me);
        me.on('close', me.onDialogClose, me);
        me.on('show', me.onDialogShow, me);
    },

    onInsertMedia: function () {
        var me = this,
            dt = me.down('mediaPanel').down('dataview'),
            selections = dt.getSelectionModel().getSelection();
        me.fireEvent('selected', me, selections);
        me.close();
    },

    onCancel: function () {
        this.close();
    },

    onDialogClose: function () {
        var me = this,
            listeners, ln, i;
        if (me.hasListener('selected')) {
            listeners = me.events['selected'].listeners;
            ln = listeners.length;
            for (i = 0; i < ln; i++) {
                me.un('selected', listeners[i].fn, listeners[i].scope);
            }
        }
    },

    config: {
        imageOnly: false
    },

    updateImageOnly: function (value) {
        var me = this;
        if (me.items.isMixedCollection) {
            me.initImageOnly(value);
        }
        return value;
    },

    initImageOnly: function (only) {
        var me = this,
            panel = me.down('mediaPanel'),
            segbtn = panel.down('segmentedbutton[allowMultiple=true]'),
            btns = segbtn.items.items,
            ln = btns.length, i, btn, state;
        for (i = 0; i < ln; i++) {
            btn = btns[i];
            state = btn.fileType === 1;
            btn.setDisabled(only ? !state : false);
            btn.setPressed(only ? state : true);
        }
    },

    onDialogShow: function () {
        var store = this.down('mediaPanel').getViewModel().getStore('mediae');
        if (!store.isLoaded()) store.load();
    }

})