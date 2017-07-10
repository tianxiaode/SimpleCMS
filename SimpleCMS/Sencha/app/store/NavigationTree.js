Ext.define('SimpleCMS.store.NavigationTree', {
    extend: 'Ext.data.TreeStore',

    storeId: 'NavigationTree',

    fields: [{
        name: 'text'
    }],

    root: {
        expanded: true,
        children: [
            {
                text: 'ø’∞◊“≥',
                viewType: 'pageblank',
                leaf: true,
                visible: false
            },
            {
                text: '500 ”Õº',
                viewType: 'page500',
                leaf: true,
                visible: false
            },
            {
                text: 'µ«¬º ”Õº',
                viewType: 'login',
                leaf: true,
                visible: false
            },
            {
                text: '–ﬁ∏ƒ√‹¬Î ”Õº',
                viewType: 'passwordreset',
                leaf: true,
                visible: false
            }
        ]
    }
});
