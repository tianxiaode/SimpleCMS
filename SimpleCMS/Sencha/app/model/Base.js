Ext.define('SimpleCMS.model.Base', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.identifier.Negative',
        'SimpleCMS.locale.Locale'
    ],

    fields: [
        { name: 'Id', type: 'int' }
    ],
    idProperty: 'Id',

    identifier: 'negative',
    schema: {
        namespace: 'SimpleCMS.model'
    }
});
