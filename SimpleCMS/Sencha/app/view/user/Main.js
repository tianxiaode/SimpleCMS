Ext.define('SimpleCMS.view.user.Main', {
    extend: 'SimpleCMS.ux.container.FixedHeightOfFirstItem',
    xtype: 'userView',

    requires: [
        'Ext.grid.Panel',
        'SimpleCMS.view.user.MainModel',
        'SimpleCMS.view.user.MainController',
        'SimpleCMS.view.user.Edit'
    ],

    controller: 'user',
    viewModel: 'user',

    items: [
        {
            xtype: 'grid',
            emptyText: I18N.EmptyText,
            reference: 'UserGrid',
            columns: [
                { xtype: 'rownumberer' },
                { text: I18N.UserModel.UserName, dataIndex: 'UserName', flex: 1, renderer: 'onHighLightRenderer' },
                { text: I18N.UserModel.Roles, dataIndex: 'Roles', width: 100 },
                { xtype: 'datecolumn', text: I18N.UserModel.Created, dataIndex: 'Created', format: I18N.DefaultDatetimeFormat, width: 150 },
                { xtype: 'datecolumn', text: I18N.UserModel.LastLogin, dataIndex: 'LastLogin', format: I18N.DefaultDatetimeFormat, width: 150 },
                { xtype: 'checkcolumn', text: I18N.UserModel.Lockout, dataIndex: 'Lockout', width: 100, listeners: { checkchange: 'onUserCheckChange' } },
                { xtype: 'checkcolumn', text: I18N.UserModel.IsApprove, dataIndex: 'IsApprove', width: 100, listeners: { checkchange: 'onUserCheckChange' }}
            ],

            selModel: {
                selType: 'checkboxmodel',
                showHeaderCheckbox: false
            }, 
            cls: 'email-inbox-panel shadow',
            headerBorders: false,
            rowLines: false,
            padding: 20,

            tbar: [
                { iconCls: "x-fa fa-file", ui: 'soft-green', tooltip: I18N.Add, handler: 'onUserAdd' },
                { iconCls: "x-fa fa-pencil", ui: 'soft-blue', tooltip: I18N.Edit, handler: 'onUserEdit', bind:{ disabled: '{!selection}'} },
                { iconCls: "x-fa fa-trash", ui: 'soft-red', tooltip: I18N.Delete, handler: 'onUserDelete', bind: { disabled: '{!selection}' } },
                { iconCls: "x-fa fa-refresh", ui: 'soft-cyan', tooltip: I18N.Refresh, handler: 'onRefresh' },
                '-',
                { xtype: 'uxsearchfield', fieldLabel: I18N.Search, labelWidth: 40, width: 260, bind: { store: '{users}' } },
                '->',
                { xtype: 'tbtext', bind: I18N.Count }
            ],

            bind: { selection: '{selection}' , store: '{users}'}
        }
    ]


})
