Ext.define('SimpleCMS.view.authentication.PasswordReset', {
    extend: 'SimpleCMS.view.authentication.LockingWindow',
    xtype: 'passwordreset',

    requires: [
        'SimpleCMS.view.authentication.Dialog',
        'Ext.form.Label',
        'Ext.form.field.Text',
        'Ext.button.Button'
    ],

    title: I18N.PasswordResetTitle,

    defaultFocus : 'authdialog',  // Focus the Auth Form to force field focus as well

    items: [
        {
            xtype: 'authdialog',
            width: 455,
            defaultButton: 'resetPassword',
            autoComplete: true,
            bodyPadding: '20 20',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            defaults : {
                margin: '10 0'
            },

            cls: 'auth-dialog-login',
            items: [
                {
                    xtype: 'label',
                    cls: 'lock-screen-top-label',
                    text: I18N.PasswordResetLabel
                },
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    height: 55,
                    name: 'Password',
                    inputType:'password',
                    hideLabel: true,
                    allowBlank: false,
                    emptyText: I18N.Password,
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-password-trigger'
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    height: 55,
                    name: 'NewPassword',
                    itemId: 'NewPassword',
                    inputType: 'password',
                    regex: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\W]{6,}$/,
                    regexText: I18N.PasswordRegexText,
                    hideLabel: true,
                    allowBlank: false,
                    emptyText: I18N.NewPassword,
                    validator: function (v) {
                        var me = this,
                            form = me.up('form'),
                            values = form.getForm().getValues(),
                            old = values["Password"];
                        return old === v ? I18N.OldPasswordEqualNew : true;
                    },
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-password-trigger'
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    height: 55,
                    name: 'ConfirmPassword',
                    vtype: 'password',
                    initialPassField: 'NewPassword',
                    inputType: 'password',
                    hideLabel: true,
                    allowBlank: false,
                    emptyText: I18N.ConfirmPassword,
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-password-trigger'
                        }
                    }
                },
                {
                    xtype: 'button',
                    reference: 'resetPassword',
                    scale: 'large',
                    ui: 'soft-green',
                    formBind: true,
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    text: I18N.Save,
                    listeners: {
                        click: 'onResetClick'
                    }
                },
                {
                    xtype: 'button',
                    scale: 'large',
                    ui: 'soft-blue',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    text: I18N.Return,
                    listeners: {
                        click: 'onReturnClick'
                    }
                }
            ]
        }
    ]
});
