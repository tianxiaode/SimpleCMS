Ext.define("SimpleCMS.model.Category", {
    extend: "SimpleCMS.model.Base",

    fields: [
        { name: 'ParentId', type: 'auto', defaultValue: null },
        { name: 'ParentTitle', defaultValue: '' },
        { name: 'Title', defaultValue: '' },
        { name: 'Image', defaultValue: '' },
        { name: 'Content', defaultValue: '' },
        { name: 'SortOrder', type: 'int', defaultValue: 0 },
        { name: 'Created', type: 'date', dateFormat: I18N.DefaultDatetimeFormat }
    ]
});
