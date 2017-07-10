Ext.define('SimpleCMS.view.pages.Error500Window', {
    extend: 'SimpleCMS.view.pages.ErrorBase',
    xtype: 'page500',

    requires: [
        'Ext.container.Container',
        'Ext.form.Label',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Spacer'
    ],

    items: [
        {
            xtype: 'container',
            width: 600,
            cls:'error-page-inner-container',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'label',
                    cls: 'error-page-top-text',
                    text: '500'
                },
                {
                    xtype: 'label',
                    cls: 'error-page-desc',
                    html: I18N.Error500HTML
                },
                {
                    xtype: 'tbspacer',
                    flex: 1
                }
            ]
        }
    ]
});
