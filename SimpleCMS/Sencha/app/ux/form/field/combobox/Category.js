Ext.define('SimpleCMS.ux.form.field.combobox.Category', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'categorySelect',

    requires: [
        'SimpleCMS.model.Category'
    ],

    minChars: 2,
    queryMode: 'remote',
    displayField: 'Title',
    valueField: 'Id',

    store: {
        model: 'SimpleCMS.model.Category',
        pageSize: 50,
        proxy: {
            type: 'format',
            url: URI.get('category', 'select')
        }

    }

})
