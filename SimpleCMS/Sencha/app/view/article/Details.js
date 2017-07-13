Ext.define('SimpleCMS.view.article.Details', {
    extend: 'Ext.panel.Panel',
    xtype: 'articleDetails',

    onReturn: function () {
        this.up('articleView').getController().setCurrentView('articleList');
    },

    ui: 'light',
    defaultListenerScope: true,

    padding: 20,
    header: {
        titlePosition: 1,
        items: [
            {
                xtype: 'button',
                iconCls: 'x-fa fa-arrow-left',
                tooltip: I18N.Return,
                ui: 'facebook',
                margin: '0 10px 0 0',
                handler: 'onReturn'
            }
        ]
    }

})
