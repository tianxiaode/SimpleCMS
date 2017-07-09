Ext.define('SimpleCMS.ux.data.proxy.Format', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.format',

    requires: [
        'SimpleCMS.util.Failed'
    ],

    reader: {
        type: 'json',
        rootProperty: "data",
        messageProperty: "msg"
    },

    writer: {
        type: "json",
        encode: true,
        rootProperty: "data",
        allowSingle: false
    },

    listeners: {
        exception: FAILED.proxy
    }


})
