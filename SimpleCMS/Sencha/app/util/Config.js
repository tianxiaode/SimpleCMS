Ext.define('SimpleCMS.util.Config', {
    alternateClassName: 'CFG',
    singleton: true,

    config: {
        userInfo: null
    },

    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
    }

});
