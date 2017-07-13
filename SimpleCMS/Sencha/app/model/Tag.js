Ext.define('SimpleCMS.model.Tag', {
    extend: 'SimpleCMS.model.Base',

    fields: [
        { name: 'Name', type: 'string', defaultValue: '' }
    ],
    idProperty: 'Name'
});
