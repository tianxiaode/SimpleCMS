Ext.define('SimpleCMS.view.article.List', {
    extend: 'SimpleCMS.ux.container.FixedHeightOfFirstItem',
    xtype: 'articleList',

    requires: [
        'Ext.tree.Panel',
        'Ext.grid.Panel',
        'Ext.grid.plugin.DragDrop',
        'Ext.tree.plugin.TreeViewDragDrop',
        'Ext.layout.container.Border',
        'Ext.grid.plugin.DragDrop',
        'Ext.tree.plugin.TreeViewDragDrop',
        'SimpleCMS.view.tag.Main'
    ],

    items: [
        {
            xtype: 'container',
            layout: 'border',
            padding: 20,
            items: [
                {
                    xtype: 'treepanel', collapsible: true, region: 'west', width: 250, maxWidth: 500, minWidth: 200, split: true, reference: 'CategoryTree',
                    ui: 'light', title: I18N.Category, iconCls: 'x-fa fa-list', stateId: 'articleView-treepanel', stateful: true, stateEvents: ['resize'],
                    rootVisible: false, useArrows: true, displayField: 'Title', bind: { store: '{categories}', selection:'{categorySelection}' },
                    tbar: [
                        { iconCls: "x-fa fa-file", ui: 'soft-green', tooltip: I18N.Add, handler: 'onCategoryAdd' },
                        { iconCls: "x-fa fa-pencil", ui: 'soft-blue', tooltip: I18N.Edit, handler: 'onCategoryEdit', bind: { disabled: '{isDisabledCategoryButton}' } },
                        { iconCls: "x-fa fa-newspaper-o", ui: 'soft-purple', tooltip: I18N.Details, handler: 'onCategoryDetails', bind: { disabled: '{isDisabledCategoryButton}' } },
                        { iconCls: "x-fa fa-trash", ui: 'soft-red', tooltip: I18N.Delete, handler: 'onCategoryDelete', bind: { disabled: '{isLeaf}' } },
                        { iconCls: "x-fa fa-refresh", ui: 'soft-cyan', tooltip: I18N.Refresh, handler: 'onCategoryRefresh' }
                    ],
                    listeners: {
                        selectionchange: 'onCategorySelectionChange'
                    },
                    viewConfig: {
                        plugins: [
                            {
                                ptype: 'treeviewdragdrop',
                                dropGroup: 'ContentDrag',
                                enableDrag: false,
                                containerScroll: true,
                                dropZone: {
                                    handleNodeDrop: Ext.emptyFn
                                }
                            }
                        ],
                        listeners: {
                            drop: 'onContentDrop'
                        }
                    }
                },
                {
                    xtype: 'grid', region: 'center', flex: 1, ui: 'light', iconCls: 'x-fa fa-file-text',
                    emptyText: I18N.EmptyText,
                    reference: 'ContentGrid',
                    selModel: {
                        selType: 'checkboxmodel',
                        showHeaderCheckbox: false
                    },
                    cls: 'email-inbox-panel shadow',
                    headerBorders: false,
                    rowLines: false,  
                    bind: { selection: '{selection}', store: '{contents}', title: '{title}>{categoryTitle}{searchValue}'},
                    columns: [
                        { xtype: 'rownumberer' },
                        { text: I18N.ContentModel.ContentId, dataIndex: 'Id', width: 80 },
                        { text: I18N.ContentModel.Title, dataIndex: 'Title', flex: 1, renderer: 'onContentTitleRenderer' },
                        { text: I18N.ContentModel.Tags, dataIndex: 'Tags', flex: 1, sortable: false },
                        { text: I18N.ContentModel.Created, dataIndex: 'Created', width: 150, xtype: 'datecolumn', format: I18N.DefaultDatetimeFormat },
                        { text: I18N.ContentModel.SortOrder, dataIndex: 'SortOrder', width: 80 },
                        { text: I18N.ContentModel.Hits, dataIndex: 'Hits', width: 80 }
                    ],
                    dockedItems: [
                        {
                            xtype: 'toolbar', dock: 'top', items: [
                                { iconCls: "x-fa fa-file", ui: 'soft-green', tooltip: I18N.Add, handler: 'onContentAdd' },
                                { iconCls: "x-fa fa-pencil", ui: 'soft-blue', tooltip: I18N.Edit, handler: 'onContentEdit', bind: { disabled: '{!selection}' } },
                                { iconCls: "x-fa fa-trash", ui: 'soft-red', tooltip: I18N.Delete, handler: 'onContentDelete', bind: { disabled: '{!selection}' } },
                                { iconCls: "x-fa fa-refresh", ui: 'soft-cyan', tooltip: I18N.Refresh, handler: 'onContentRefresh' },
                                '-',
                                { iconCls: 'x-fa fa-search', tooltip: I18N.Search, enableToggle: true, reference: 'contentSearchButton', pressed: false },
                                { iconCls: 'x-fa fa-tag', tooltip: I18N.TagManager, handler: 'onTagManager' },
                                '->',
                                { xtype: 'tbtext', bind: '共{count}条' }
                            ]
                        },
                        {
                            xtype: 'toolbar', dock: 'top', bind: { hidden: '{!contentSearchButton.pressed}' }, reference: 'searchToolbar',
                            items: [
                                { xtype: 'tbtext', text: I18N.SearchDate },
                                {
                                    xtype: 'datefield', name: 'StartDate', width: 150, vtype: 'daterange',
                                    parentXtype: 'toolbar', itemId: 'StartDate', endDateField: 'EndDate', format: I18N.DefaultDateFormat
                                },
                                { xtype: 'tbtext', text: '～' },
                                {
                                    xtype: 'datefield', name: 'EndDate', width: 150, vtype: 'daterange',
                                    parentXtype: 'toolbar', itemId: 'EndDate', startDateField: 'StartDate', format: I18N.DefaultDateFormat
                                },
                                { xtype: 'tbtext', text: I18N.SearchText },
                                { xtype: 'textfield', name: 'Query', width: 150, itemId: 'Query' },
                                { iconCls: 'x-fa fa-play', tooltip: I18N.SearchStart, handler: 'onStartSearch', reference: 'startSearchButton' }
                            ]
                        }
                    ],
                    listeners: {
                        cellclick: 'onContentGridCellClick'
                    },
                    viewConfig: {
                        plugins: {
                            ptype: 'gridviewdragdrop',
                            dragGroup: 'ContentDrag',
                            enableDrop: false
                        }
                    }
                }
            ]
        }
    ],

    listeners: {
        activate: 'onListActivate'
    }
   
})