Ext.define('SimpleCMS.view.media.MediaPanelModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.media',

    requires: [
        'SimpleCMS.model.Media'
    ],

    data: {
        count: 0,
        selection: null
    },

    stores: {
        mediae: {
            model: 'SimpleCMS.model.Media',
            remoteSort: true,
            pageSize: 50,
            proxy: {
                type: 'format',
                extraParams: { type: [1, 2, 3] },
                url: URI.get('media', 'read')
            },
            sorters: {
                property: 'Uploaded',
                direction: 'DESC'
            }
        },
        datelists: {
            autoLoad: true,
            pageSize: 0,
            field: ['Id', 'Text'],
            proxy: {
                type: 'format',
                url: URI.get('media', 'datelist')
            }
        }
    }
});