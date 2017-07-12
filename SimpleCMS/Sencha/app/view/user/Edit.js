Ext.define('SimpleCMS.view.user.Edit', {
    extend: 'Ext.window.Window',
    xtype: 'userEditView',

    requires: [
        'SimpleCMS.ux.form.BaseForm',
        'SimpleCMS.ux.button.SaveAndNew'
    ],

    width: 400,
    height: 300,
    modal: true,
    closeAction: 'hide',
    hideMode: 'offsets',
    layout: 'fit',
    closable: true,
    resizable: false,
    defaultListenerScope: true,


    items: [
        {
            xtype: 'baseform',
            defaultFocus: 'textfield[name=UserName]',
            baseModel: 'SimpleCMS.model.User',
            entityName: 'User',
            items: [
                { xtype: 'hiddenfield', name: 'Id' },
                { fieldLabel: I18N.UserModel.UserName, name: 'UserName', allowBlank: false, bind: { readOnly: '{isEdit}' } },
                {
                    fieldLabel: I18N.Password, name: 'Password', inputType: 'password',
                    itemId: 'Password',
                    regex: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\W]{6,}$/,
                    regexText: I18N.PasswordRegexText,
                    validator: function (value) {
                        var form = this.up('baseform'),
                            isEdit = form.getViewModel().get('isEdit');
                        return !isEdit && Ext.isEmpty(value) ? I18N.Required : true;
                    }
                },
                {
                    fieldLabel: I18N.ConfirmPassword, name: 'ConfirmPassword', inputType: 'password',
                    vtype: 'password',
                    initialPassField: 'Password',
                    validator: function (value) {
                        var me = this,
                            form = me.up('baseform'),
                            passwod = form.down('#' + me.initialPassField).getValue(),
                            isEdit = form.getViewModel().get('isEdit');
                        if (isEdit) {
                            return !Ext.isEmpty(passwod) && Ext.isEmpty(value) ? I18N.PasswordNoEqual : true;
                        } else {
                            return Ext.isEmpty(value) ? I18N.Required : true;
                        }

                    }
                },
                {
                    fieldLabel: I18N.UserModel.Roles, xtype: 'combobox', queryMode: "local", displayField: 'Name', valueField: 'Name', name: 'Roles',
                    forceSelection: true,
                    store: {
                        type: 'array',
                        fields: ["Name"],
                        data: [["系统管理员"], ["编辑"], ["注册用户"]]
                    }
                },
                { xtype: 'box', padding: '0 0 0 85px', html: I18N.PasswordNoChange, bind: { hidden: '{!isEdit}' } }
            ],
            fbar: [
                {
                    width: 120, disabled: true, formBind: true, ui: 'blue',
                    xtype: 'saveandnewbutton', saveMenuStateId: 'usereditview-savemenu', saveAndNewMenuStateId: 'usereditview-saveandnewmenu'
                },
                { text: I18N.Reset, width: 120, itemId: 'resetButton', ui: 'soft-purple' }
            ]
        }
    ]

});
