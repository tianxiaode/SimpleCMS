Ext.define('SimpleCMS.view.article.CategoryEdit', {
    extend: 'SimpleCMS.ux.form.BaseForm',
    xtype: 'categoryEdit',

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
    entityName: 'Category',
    titleCmp: 'self',
    baseModel: 'SimpleCMS.model.Category',

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
        { xtype: 'hidden', name: 'ParentTitle' },
        { fieldLabel: I18N.CategoryModel.Title, name: 'Title', allowBlank: false, maxLength: 255 },
        { xtype: 'categorySelect', fieldLabel: I18N.CategoryModel.ParentId, name: 'ParentId', listeners: { change: 'onParentIdChage' } },
        { xtype: 'imageselectfield', fieldLabel: I18N.CategoryModel.Image, maxLength: 255, name: 'Image' },
        /*
        {
            xtype: 'fieldcontainer', fieldLabel: I18N.CategoryModel.Image, layout: 'hbox', items: [
                { xtype: 'textfield', name: 'Image', maxLength: 255, flex: 1 },
                { xtype: 'button', iconCls: 'x-fa fa-image', tooltip: I18N.InsertImage, handler: 'onInsertImage' }
            ]
        },
        */
        { xtype: 'numberfield', fieldLabel: I18N.CategoryModel.SortOrder, minValue: 0, name: 'SortOrder' },
        { xtype: 'tinymceplusfield', fieldLabel: I18N.CategoryModel.Content, name: 'Content', columnWidth: 1, maxLength: 4000, labelAlign: 'top', height: Ext.Element.getViewportHeight() - 350 }
        
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

    loadRecord: function (record) {
        var me = this,
            store = me.down('categorySelect').getStore(),
            proxy = store.getProxy(),
            params = proxy.extraParams,
            id = record.getId();
        params['id'] = id > 10000 ? id : null;
        store.load();
        this.callParent(arguments);
    },

    initComponent: function () {
        var me = this,
            store,
            reader;
        me.callParent(arguments);
        store = me.down('categorySelect').getStore();
        reader = store.getProxy().getReader();
        reader.setTransform(Ext.bind(me.onReaderTransform, me));
        store.on('load', me.onStoreLoad, me);
    },

    onReaderTransform: function (response) {
        var me = this,
            isEdit = me.getViewModel().get('isEdit'),
            record = me.getRecord(),
            pid = record.data.ParentId,
            title = record.data.ParentTitle,
            data = response.data || [],
            exist = false,
            ln = data.length,
            i;
        if (pid > 10000) {
            for (i = 0; i < ln; i++) {
                if (data[i].Id === pid) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                data.push({ Id: pid, Title: title });
                response['data'] = data;
            }
        }
        return response;
    },

    onParentIdChage: function (field, newValue, oldValue) {
        var me = this;
        if (newValue !== oldValue) {
            me.down('hiddenfield[name=ParentTitle]').setValue(field.getRawValue());
        }
    },

    onReturn: function () {
        this.up('articleView').getController().setCurrentView('articleList');
    },

    onStoreLoad: function() {
        var me = this,
            record = me.getRecord(),
            pid = record.data.ParentId,
            field = me.down('categorySelect'),
            value = field.getValue();
        if (Ext.isEmpty(value) && pid > 10000 ) {
            field.setValue(pid);
            field.resetOriginalValue();
        };
    }


});
