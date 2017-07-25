Ext.define('SimpleCMS.view.user.MainModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.user',

    requires: [
        'SimpleCMS.model.User'
    ],

    data: {
        count: 0,
        selection: null
    },

    stores: {
        users: {
            type: 'buffered',
            model: 'SimpleCMS.model.User',
            autoLoad: true,
            pageSize: 100,
            proxy: {
                type: 'format',
                url: URI.get('user', 'read')
            },
            sorters: {
                property: 'UserName',
                direction: ''
            },
            listeners: {
                load: 'onUsersStoreLoad'
            }
        }
    }
});
