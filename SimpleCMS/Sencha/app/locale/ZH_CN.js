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
        Count: '共{count}条',

        DeleteNoSelection: '请选择要删除的{0}',
        DeleteWaitMsg: '正在删除，请等待……',
        DeleteConfirmMessageTitle: '删除',
        DeleteConfirmMessage: '<p>确定要删除以下{0}？</p>{1}',

        Add: '新建',
        Edit: '编辑',
        Delete: '删除',
        Details: '详细信息',
        ShowDetails:'查看详细信息',
        Refresh: '刷新',
        Search: '查询',
        Cancel: '取消',
        Selected: '确定',
        SelectedTitleImage: '选择题图',
        SelectedMedia: '选择媒体',
        InsertMedia: '从媒体库插入媒体',
        NoModel: '没有定义模型',
        NoSelection: '请选择{0}，再{1}',
        Loading: '正在加载数据，请等待......',
        SaveAndNewButtonText: '保存和新建',
        SaveButtonText: '保存',
        PasswordNoChange: '注意：如果不修改密码，可留空',
        Sorter: '排序',
        SorterASC: '正序',
        SorterDESC: '倒序',
        EmptyValue: '无',
        HasChild: '节点下还有子节点，不允许删除',
        NoDrop: '拖放操作失败，当前节点不是有效的类别',

        User: '用户',
        UserModel: {
            UserName: '用户名',
            Roles: '角色',
            Created: '创建日期',
            LastLogin: '最后登录时间',
            Lockout: '已锁定',
            IsApprove: '允许登录'
        },

        Media: '媒体',
        Upload: '上传',
        Image: '图片文件',
        Audio: '音频文件',
        Video: '视频文件',
        FileUploadError: '文件“{0}”不能上传，错误：{1}',
        Uploading: '正在上传{0}......，{1}%',
        MediaModel: {
            FieldName: '文件名',
            Description: '描述',
            Path: '路径',
            Type: '类型',
            UploadedDate: '上传日期',
            Size: '文件大小'
        },

        Category: '类别',
        CategoryModel: {
            Title: '标题',
            Image: '题图',
            ParentId: '父类别',
            SortOrder: '排序顺序',
            Content: '内容'
        },

        Content: '文章',
        ContentModel: {
            ContentId: '编号',
            Title: '标题',
            CategoryId: '类别编号',
            CategoryTitle: '类别标题',
            Image: '题图',
            SortOrder: '排序顺序',
            Body: '内容',
            Summary: '摘要',
            Created: '创建时间',
            Tags: '标签',
            Hits: '点击量'

        },

        Tag: '标签',
        TagManager: '标签管理',
        AddTag: '请输入标签名称',

        SearchDate: '日期：',
        SearchText: '文本：',
        SearchStart: '开始/取消搜索',
        NoSearchValue: '请输入正确的搜索值再进行搜索',
        ContentSearchTitle: ' > 开始时间：{0}，结束时间：{1}，文本：{2}',

        AllArticle: '全部文章',
        NoCategoryArticle: '未分类',
        CategoryArticle: '文章类别'

    }
})