Ext.define('SimpleCMS.locale.zh_CN',{
    override: 'SimpleCMS.locale.Locale',

    statics: {
        ApplicationUpdate: '应用程序更新',
        ApplicationUpdateMsg: '应用程序已经更新，重新加载？',

        DaterangeText: '开始日期必须小于结束日期',
        PasswordText: '两次输入的密码不同',

        FailedTitle: '错误信息',
        Failed404: '错误的请求地址',
        Failed500: '服务器内部错误',
        FailedOtherCode:'错误代码：{0}<br\>响应：{1}',

        AppTitle: '简单的CMS系统',
        DefaultMessageTitle: '信息',
        GetUserInfo: '正在加载用户信息......',
        StateRestoreWait: '正在恢复状态信息...',
        EmptyText: '没有任何数据',

        ComingSoon: '即将推出！',
        StayTunedForUpdates: '敬请期待。',
        Error404HTML: '<div>页面不存在</div><div>尝试返回<a href="/">首页</a></div>',
        Error500HTML: '<div>服务器内部错误</div><div>尝试返回<a href="/">首页</a></div>',

        DefaultDatetimeFormat: 'Y-m-d H:i:s',
        DefaultDateFormat: 'Y-m-d',

        Logout: '退出',
        LoginTitle: '登录',
        LoginLabel: '使用帐号登录',
        LoginSubmitWaitMsg: '正在登录，请等待......',
        LoginSubmitWaitTitle: '正在登录',
        VerifyCode: '验证码',
        VerifyCodeAlt: '单击图片可刷新验证码',
        PasswordResetTitle: '修改密码',
        PasswordResetLabel: '输入以下字段以修改密码',
        PasswordResetSuccess: '密码已修改，请重新登录',
        OldPasswordEqualNew: '新密码不能与旧密码相同',
        UserId: '用户名',
        Password: '密码',
        NewPassword: '新密码',
        PasswordRegexText: '密码必须由字母和数字组成,且长度至少为6位',
        ConfirmPassword: '确认密码',
        RememberMe: '记住我',

        Save: '保存',
        SaveWaitMsg: '正在保存，请等待......',
        SavedAndClose: '数据已成功保存，窗口将关闭',
        SavedAndNothing: '数据已成功保存',
        SavedAndNew: '数据已成功保存，可继续添加新的数据',
        Reset: '重置',
        Return: '返回',
        Required: '该输入项为必输项',
        PasswordNoEqual: '两次输入的密码不同',

        DeleteNoSelection: '请选择要删除的{0}',
        DeleteWaitMsg: '正在删除，请等待……',
        DeleteConfirmMessageTitle: '删除',
        DeleteConfirmMessage: '<p>确定要删除以下{0}？</p>{1}'

    }
})