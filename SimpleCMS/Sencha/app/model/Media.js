Ext.define('SimpleCMS.model.Media', {
    extend: 'SimpleCMS.model.Base',

    fields: [
        { name: 'FieldName', defaultValue: '' },
        { name: 'Description', defaultValue: '' },
        { name: 'Path', defaultValue: '' },
        { name: 'Type', type: 'int', defaultValue: '1', min: 1, max: 3 },
        { name: 'Size', type: 'int', defaultValue: '0' },
        { name: 'Uploaded', type: 'date', dateFormat: I18N.DefaultDatetimeFormat }
    ]

})