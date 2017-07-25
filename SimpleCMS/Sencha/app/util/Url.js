Ext.define('SimpleCMS.util.Url', {
    alternateClassName: 'URI',
    singleton: true,

    config: {
    },

    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
    },

    defaultActions: {
        create: 'create',
        read: 'list',
        update: 'update',
        destroy: 'delete',
        details: 'details'
    },

    actions: {},

    urlFormat: '{0}/{1}/{2}',

    get: function (controller, action) {
        var me = this;
        if (!Ext.isString(controller) || Ext.isEmpty(controller)) Ext.raise('非法的控制器名称');
        if (!Ext.isString(action) && !Ext.isNumber(action)) Ext.raise('非法的操作名称');
        return Ext.String.format(me.urlFormat, ROOTPATH, controller, me.defaultActions[action] || me.actions[action] || action);
    },

    crud: {
        c: 'create',
        r: 'read',
        u: 'update',
        d: 'destroy'
    },

    getApi: function (controller, action) {
        var me = this, act, ln, i, result = {};
        action = Ext.isString(action) ? action.toLowerCase() : '';
        ln = action.length;
        for (i = 0; i < ln; i++) {
            act = me.crud[action[i]];
            if (act) {
                result[act] = me.get(controller, act);
            }
        }
        return result;
    },

    DEBUG: true,

    resources: {
        logo: 'resources/images/company-logo.png'
    },

    getResource: function (res) {
        var me = this;
        return ROOTPATH + (me.DEBUG ? '/sencha/' : '/') + me.resources[res];
    }

});
