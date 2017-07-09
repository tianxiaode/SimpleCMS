Ext.define('SimpleCMS.util.Failed', {
    singleton: true,
    alternateClassName: 'FAILED',

    requires: [
        'SimpleCMS.locale.Locale'
    ],

    ajax: function (response, options) {
        var title = I18N.FailedTitle;
        if (response.status === 404) {
            Ext.Msg.alert(title, I18N.Failed404);
        } else if (response.status === 500) {
            Ext.Msg.alert(title, I18N.Failed500);
        } else if (!Ext.isEmpty(response.responseText)) {
            Ext.Msg.alert(title, Ext.String.format(I18N.FailedOtherCode, response.status, response.responseText));
        }
    },

    proxy: function (proxy, response, options, epots) {
        var status = response.status;
        if (status === 200 && !Ext.isEmpty(options.error)) {
            Ext.Msg.alert(I18N.FailedTitle, options.error);
        } else {
            FAILED.ajax(response, options);
        }
    },

    form: function (form, action) {
        if (action.result) {
            if (action.result.errors) return;
            if (!Ext.isEmpty(action.result.msg)) {
                Ext.Msg.alert(I18N.FailureProcessTitle, action.result.msg);
                return;
            }
        }
        FAILED.ajax(action.response);
    }

});
