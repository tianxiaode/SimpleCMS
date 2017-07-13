Ext.define('SimpleCMS.ux.button.SaveAndNew', {
    extend: 'Ext.button.Split',
    xtype: 'saveandnewbutton',

    requires: [
        'Ext.menu.CheckItem'
    ],

    saveAndNewText: I18N.SaveAndNewButtonText,
    saveText: I18N.SaveButtonText,
    saveMenuStateId: null,
    saveAndNewMenuStateId: null,
    saveMenuSaved: 'close',
    saved: 'new',

    initComponent: function () {
        var me = this,
            menus = me.getMenus();
        me.menu = menus;
        me.text = me.saveAndNewText;
        me.callParent(arguments);
    },

    getMenus: function () {
        var me = this;
        if (Ext.isEmpty(me.saveMenuStateId)) Ext.raise('没有定义saveMenuStateId');
        if (Ext.isEmpty(me.saveAndNewMenuStateId)) Ext.raise('没有定义saveMenuStateId');
        return [
            {
                xtype: 'menucheckitem',
                text: me.saveText,
                saved: me.saveMenuSaved,
                group: 'saveMenu',
                checked: false,
                handler: me.onSaveMenuClick,
                scope: me,
                stateful: { checked: true },
                stateEvents: ['checkchange'],
                itemId: 'saveMenu',
                stateId: me.saveMenuStateId,
                listeners: {
                    staterestore: me.onMenuStateRestore,
                    scope: me
                }
            },
            {
                xtype: 'menucheckitem',
                text: me.saveAndNewText,
                saved: 'new',
                group: 'saveMenu',
                checked: true,
                handler: me.onSaveMenuClick,
                stateEvents: ['checkchange'],
                itemId: 'saveAndNewMenu',
                scope: me,
                stateful: { checked: true },
                stateId: me.saveAndNewMenuStateId,
                listeners: {
                    staterestore: me.onMenuStateRestore,
                    scope: me
                }
            }
        ];
    },

    onSaveMenuClick: function (menu, item, e, eOpts) {
        var me = this;
        me.setText(menu.text);
        me.saved = menu.saved;
        me.fireHandler(e);
    },

    onMenuStateRestore: function (menu, state, eOpts) {
        var me = this;
        if (menu.checked) {
            me.saved = menu.saved;
            me.setText(menu.text);
        }
    }

});
