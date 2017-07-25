Ext.define('SimpleCMS.view.authentication.AuthenticationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authentication',

    //TODO: implement central Facebook OATH handling here

    onLoginButton: function () {
        var me = this,
            f = me.getView().getForm();
        if (f.isValid()) {
            f.submit({
                url: URI.get('account', 'login'),
                waitMsg: I18N.LoginSubmitWaitMsg,
                waitTitle: I18N.LoginSubmitWaitTitle,
                success: function (form, action) {
                    window.location.reload();
                },
                failure: FAILED.form,
                scope: me
            });
        }
    },

    onResetClick:  function() {
        var me = this,
            view = me.getView(),
            f = view.getForm();
        if (f.isValid()) {
            f.submit({
                url: URI.get('account', 'passwordreset'),
                waitMsg: I18N.SaveWaitMsg,
                waitTitle: I18N.PasswordResetTitle,
                success: function (form, action) {
                    TOAST.toast(I18N.PasswordResetSuccess, view.el, null, function () {
                        window.location.reload(); 
                
                    });
                },
                failure: FAILED.form,
                scope: me
            });
        }
    },

    onReturnClick: function () {
        window.history.back();
    },

    verifyCodeUrl: URI.get('VerifyCode', ''),
    onRefrestVcode: function () {
        var me = this,
            view = me.getView(),
            img = view.down('image');
        img.setSrc(me.verifyCodeUrl + '?_dc=' + (new Date().getTime()));
    },

    onLoginViewShow: function () {
        this.onRefrestVcode();
    }

});