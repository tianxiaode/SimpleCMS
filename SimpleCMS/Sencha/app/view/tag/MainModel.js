Ext.define('SimpleCMS.view.tag.MainModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.tag',

    requires: [
        'Ext.data.BufferedStore',
        'SimpleCMS.ux.data.proxy.Format',
        'SimpleCMS.model.Tag'
    ],

    data: {
        selection: null,
        count: 0,
        tagName: ''
    },

    formulas: {
        isDisabled: function(get) {
            var v = get('tagName');
            return Ext.isEmpty(v) || (v.length > 255);
        }
    },

    stores: {
        tags: {
            type: 'buffered',
            model:'SimpleCMS.model.Tag',
            autoLoad:true,
            pageSize: 100,
            proxy: {
                type: 'format',
                url: URI.get('tag','read')
            },
            sorters: {
                property: 'Name',
                direction: ''
            },
            listeners: {
                load: 'onTagsStoreLoad'
            }
        }
    }
});
