Ext.define('SimpleCMS.view.article.Main', {
    extend: 'Ext.container.Container',
    xtype: 'articleView',

    requires: [
        'Ext.layout.container.Card',
        'SimpleCMS.view.article.MainController',
        'SimpleCMS.view.article.MainModel',
        'SimpleCMS.view.article.List',
        'SimpleCMS.view.article.CategoryEdit',
        'SimpleCMS.view.article.ContentEdit',
        'SimpleCMS.view.article.Details'
    ],

    controller: 'article',
    viewModel: 'article',

    layout: 'card',

    items: [
        {xtype: 'articleList'}
    ]

});
