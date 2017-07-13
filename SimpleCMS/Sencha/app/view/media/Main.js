Ext.define('SimpleCMS.view.media.Main', {
    extend: 'SimpleCMS.ux.container.FixedHeightOfFirstItem',
    xtype: 'mediaView',

    requires: [
        'SimpleCMS.view.media.MediaPanel'
    ],

    items: [
        {
            xtype: 'mediaPanel',
            padding: 20
        }
    ],

    initComponent: function() {
        var me = this;
        me.callParent(arguments);
        me.down('mediaPanel').getViewModel().getStore('mediae').load();
    }

})
