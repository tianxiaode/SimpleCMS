Ext.define('SimpleCMS.view.user.MainController', {
    extend: 'SimpleCMS.ux.app.BaseViewController',
    alias: 'controller.user',

    onUsersStoreLoad: function (store, records, successful, operation, eOpts) {
        this.getViewModel().set('count', store.getTotalCount());
    },

    userCheckChangeUrl: URI.get('user', 'checkchange'),
    onUserCheckChange: function (column, rowIndex, checked, record, e, eOpts) {
        var me = this;
        me.onColumnCheckChange(me.userCheckChangeUrl, record, column.dataIndex);
    },
   

    onRefresh: function() {
        this.getStore('users').load();
    },

    userDeleteUrl: URI.get('user', 'destroy'),
    onUserDelete: function() {
        var me = this;
        me.onDelete(me.lookupReference('UserGrid').getSelection(),
            me.userDeleteUrl,
            "UserName",
            I18N.User,
            function(response, opts) {
                var me = this,
                    obj = Ext.decode(response.responseText);
                Ext.Msg.hide();
                if (obj.success) {
                    me.getStore('users').load();
                    me.lookupReference('UserGrid').getSelectionModel().deselectAll();
                }
                TOAST.toast(obj.msg, null, 'b');

            });
    },

    onUserAdd: function () {
        var me = this,
            view = CFG.getDialog('userEditView'),
            form = view.down('baseform');
        view.show();
        form.addRecord(true);
    },

    init: function () {
        var me = this,
            view = CFG.getDialog('userEditView');
        view.on('close', me.onDialogClose, me);
    },

    onDialogClose: function (dialog) {
        var me = this,
            store = me.getStore('users'),
            form = dialog.down('baseform');
        if (form.hasNew && !form.getViewModel().get('isEdit')) {
            store.sort('CreatedDate', 'DESC');
        }
    },

    onUserEdit: function () {
        var me = this,
            selection = me.lookupReference('UserGrid').getSelection()[0],
            view = CFG.getDialog('userEditView'),
            form = view.down('baseform');
        if (!selection) {
            Ext.Msg.alert(I18N.DefaultMessageTitle, Ext.String.format(I18N.NoSelection, I18N.User, I18N.Edit));
            return;
        }
        view.show();
        form.loadRecord(selection);
        form.editRecord(true);
    }


});
