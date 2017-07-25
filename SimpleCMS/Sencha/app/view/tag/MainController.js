Ext.define('SimpleCMS.view.tag.MainController',{
    extend: 'SimpleCMS.ux.app.BaseViewController',
    alias: 'controller.tag',

    onTagsStoreLoad: function (store, records, successful, operation, eOpts) {
        this.getViewModel().set('count', store.getTotalCount());
    },

    onRefresh: function() {
        this.getStore('tags').load();
    },


    tagDeleteUrl: URI.get('tag', 'destroy'),
    onTagDelete: function() {
        var me = this,
            view = me.getView();
        me.onDelete(me.lookupReference('TagGrid').getSelection(),
            me.tagDeleteUrl,
            "Name",
            I18N.Tag,
            function (response, opts) {
                var me = this,
                    obj = Ext.decode(response.responseText);
                Ext.Msg.hide();
                if (obj.success) {
                    me.getStore('tags').load();
                    me.lookupReference('TagGrid').getSelectionModel().deselectAll();
                }
                TOAST.toast(obj.msg, view.el, 'b');

            });
    },

    tagAddUrl: URI.get('tag', 'create'),
    onTagAdd: function () {
        var me = this,
            value = me.getView().getViewModel().get('tagName');
        me.send({
            url: me.tagAddUrl,
            params: { value: value},
            success: function (response, opts) {
                var me = this,
                    view = me.getView(),
                    store = me.getStore('tags'),
                    field = me.lookupReference('tagNameField'),
                    obj = Ext.decode(response.responseText);
                Ext.Msg.hide();
                if (obj.success) {
                    TOAST.toast(I18N.SavedAndNothing, view.el, 'b');
                    store.load();
                    field.setValue('');
                } else {
                    if (obj.errors) {
                        field.markInvalid(obj.errors['Name']);
                    } else {
                        TOAST.toast(obj.msg,view.el, 'b');
                    }

                }
            }
        }, I18N.SaveWaitMsg);

    }

});