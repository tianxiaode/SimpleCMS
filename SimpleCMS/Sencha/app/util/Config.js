Ext.define('SimpleCMS.util.Config', {
    alternateClassName: 'CFG',
    singleton: true,

    config: {
        userInfo: null
    },

    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
    },

    dialogs: {},

    getDialog: function (xtype) {
        var me = this,
            dialog = me.dialogs[xtype];
        if (!dialog) {
            dialog = Ext.ClassManager.getByAlias('widget.' + xtype);
            if (dialog === undefined) Ext.raise('没有找到xtype为' + xtype + '的类');
            if (typeof (dialog) === 'function') {
                dialog = Ext.create(dialog);
            };
            me.dialogs[xtype] = dialog;
        }
        return dialog;
    }


});
