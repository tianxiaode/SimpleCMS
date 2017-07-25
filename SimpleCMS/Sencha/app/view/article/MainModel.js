Ext.define('SimpleCMS.view.article.MainModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.article',

    requires: [
        'SimpleCMS.model.Category',
        'SimpleCMS.model.Content'
    ],

    data: {
        count: 0,
        selection: null,
        categorySelection: null,
        title: I18N.Content,
        searchValue: ''
    },

    formulas: {
        isDisabledCategoryButton: function (get) {
            var sel = get('categorySelection');
            return sel ? sel.data.Id <= 10000 : true;
        },
        isLeaf: function (get) {
            var sel = get('categorySelection');
            return sel ? sel.data.Id <= 10000 || !sel.isLeaf() : true;
        },
        categoryTitle: function (get) {
            var sel = get('categorySelection');
            return sel ? sel.data.Title : '';
        }
    },

    stores: {
        categories: {
            type: 'tree',
            model: 'SimpleCMS.model.Category',
            root: {
                Id: 0,
                Title: 'root'
            },
            proxy: {
                type: 'format',
                url: URI.get('category', 'read')
            }
        },
        contents: {
            type: 'buffered',
            model: 'SimpleCMS.model.Content',
            pageSize: 100,
            proxy: {
                type: 'format',
                url: URI.get('content', 'read')
            },
            sorters: {
                property: 'ContentId',
                direction: 'DESC'
            },
            listeners: {
                load: 'onContentStoreLoad'
            }
        }
    }
});
