Ext.define('SimpleCMS.model.Content', {
    extend: 'SimpleCMS.model.Base',

    fields: [
        { name: 'CategoryId', type: 'auto', defaultValue: null },
        { name: 'CategoryTitle', type: 'string', defaultValue: '' },
        { name: 'Title', type: 'string', defaultValue: '' },
        { name: 'Image', type: 'string', defaultValue: '' },
        { name: 'Summary', type: 'string', defaultValue: '' },
        { name: 'Body', type: 'string', defaultValue: '' },
        { name: 'Tags', type: 'string', defaultValue: '' },
        { name: 'Created', type: 'date', dateFormat: I18N.DefaultDatetimeFormat},
        { name: 'Hits', type: 'int' },
        { name: 'SortOrder', type: 'int', defaultValue: 0 }
    ]
});
