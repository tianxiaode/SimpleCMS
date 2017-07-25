Ext.define('SimpleCMS.view.article.ContentEdit', {
    extend: 'SimpleCMS.ux.form.BaseForm',
    xtype: 'contentEdit',

    requires: [
        'Ext.layout.container.Column',
        'SimpleCMS.model.Category',
        'SimpleCMS.ux.form.field.ImageSelect',
        'SimpleCMS.ux.form.field.combobox.Category',
        'SimpleCMS.ux.form.field.TinymcePlus',
        'SimpleCMS.view.media.Win'
    ],

    ui: 'light',
    defaultListenerScope: true,

    padding: 20,
    defaultFocus: 'textfield[name=Title]',
    entityName: 'Content',
    titleCmp: 'self',
    baseModel: 'SimpleCMS.model.Content',
    height: 1300,

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
    },

    layout: 'column',
    defaults: {
        columnWidth: .5,
        padding: 5
    },

    items: [
        { xtype: 'hidden', name: 'Id' },
        { fieldLabel: I18N.ContentModel.Title, name: 'Title', allowBlank: false, maxLength: 255 },
        { xtype: 'imageselectfield', fieldLabel: I18N.ContentModel.Image, maxLength: 255, name: 'Image' },
        {
            xtype: 'combo', fieldLabel: I18N.ContentModel.CategoryId, name: 'CategoryId', listeners: { change: 'onCategoryIdChage' },
            displayField: 'Id', valueField: 'Id', queryModel: 'remote', minChars: 2,
            store: {
                model: 'SimpleCMS.model.Category',
                pageSize: 100,
                proxy: {
                    type: 'format',
                    url: URI.get('category', 'select')
                }
            },
            tpl: [
                '<ul class="x-list-plain" style="display:table;width:100%;">',
                '<tpl for=".">',
                '<li class="x-boundlist-item">',
                '<span style="width:80px;display:table-cell;">{CategoryId}</span>',
                '<span style="display:table-cell;">{Title}</span>',
                '</li>',
                '</tpl>',
                '</ul>'
            ]
        },
        { fieldLabel: I18N.ContentModel.CategoryTitle, name: 'CategoryTitle', readOnly: true },
        { xtype: 'numberfield', fieldLabel: I18N.ContentModel.SortOrder, minValue: 0, name: 'SortOrder', hideTrigger: true },
        {
            xtype: 'tagfield', fieldLabel: I18N.ContentModel.Tags, name: 'Tags',
            displayField: 'Name', valueField: 'Name', queryModel: 'remote', minChars: 2,
            store: {
                fields: ['Name'],
                pageSize: 100,
                proxy: {
                    type: 'format',
                    url: URI.get('tag', 'read')
                }
            },
            triggers: {
                plus: {
                    cls: 'x-fa fa-plus',
                    handler: 'onTagAdd'
                }
            }
        },
        { xtype: 'tinymceplusfield', name: 'Summary', fieldLabel: I18N.ContentModel.Summary, labelAlign: 'top', columnWidth: 1, maxLength: 500, height: 100 },
        { xtype: 'tinymceplusfield', name: 'Body', fieldLabel: I18N.ContentModel.Body, labelAlign: 'top', columnWidth: 1, maxLength: 4000, allowBlank: false, height: 600 }
    ],

    fbar: {
        layout: { pack: 'center' },
        items: [
            {
                width: 120, disabled: true, formBind: true, ui: 'blue',
                xtype: 'saveandnewbutton', saveMenuStateId: 'categoryEdit-savemenu', saveAndNewMenuStateId: 'categoryEdit-saveandnewmenu',
                saveMenuSaved: 'custom'
            },
            { text: I18N.Reset, width: 120, itemId: 'resetButton', ui: 'soft-purple' }
        ]
    },


    onCategoryIdChage: function (field, newValue, oldValue) {
        var me = this,
            store = field.getStore(),
            record;
        if (newValue !== oldValue) {
            record = store.getById(newValue);
            me.down('textfield[name=CategoryTitle]').setValue(record ? record.data.Title : '');
        }
    },

    onReturn: function () {
        var me = this,
            controller = me.up('articleView').getController();
        if (me.hasNew) {
            controller.getStore('contents').load();
        }
        controller.setCurrentView('articleList');
    },

    loadRecord: function (record) {
        var me = this,
            field = me.down('tagfield'),
            store = field.getStore(),
            params = store.getProxy().extraParams,
            id = record.getId();
        params["cid"] = id > 0 ? id : null;
        store.load();
        me.callParent(arguments);
    },

    onTagAdd: function () {
        var me = this,
            win = CFG.getDialog('tagView');
        win.on('close', me.onTagViewClose, me, { single: true });
        win.show();
    },

    onTagViewClose: function () {
        var me = this,
            field = me.down('tagfield'),
            store = field.getStore();
        store.load();
    }




});
