Ext.define('SimpleCMS.view.article.MainController', {
    extend: 'SimpleCMS.ux.app.BaseViewController',
    alias: 'controller.article',

    init: function () {
        var me = this,
            store = me.getStore('categories'),
            root = store.getRootNode();
        root.appendChild([
            { Id: 1, Title: I18N.AllArticle, leaf: true },
            { Id: 10000, Title: I18N.NoCategoryArticle, leaf: true },
            { Id: 2, Title: I18N.CategoryArticle, expanded: true }
        ]);
    },

    categoryDelUrl: URI.get('category', 'destroy'),
    onCategoryDelete: function () {
        var me = this,
            selection = me.getView().getViewModel().get('categorySelection');
        if (selection.isLeaf()) {
            me.onDelete([selection],
                me.categoryDelUrl,
                "Title",
                I18N.Category,
                function (response, opts) {
                    var me = this,
                        obj = Ext.decode(response.responseText),
                        selection = me.getView().getViewModel().get('categorySelection'),
                        parent = selection.parentNode;
                    Ext.Msg.hide();
                    if (obj.success) {
                        parent.removeChild(selection);
                        me.lookupReference('CategoryTree').getSelectionModel().select(parent);
                    }
                    TOAST.toast(obj.msg, null, 'b');
                });

        } else {
            Ext.Msg.alert(I18N.DefaultMessageTitle, I18N.HasChild);
        }
    },

    onCategoryRefresh: function () {
        var me = this,
            view = me.getView(),
            vm = view.getViewModel(),
            selection = vm.get('categorySelection'),
            store = me.getStore('categories'),
            node = store.getNodeById(2);
        if (selection && selection.data.Id > 10000) {
            node = selection.isLeaf() ? selection.parentNode : selection;
        }
        if (node.isExpanded())
            store.load({ node: node });
        else
            node.expand();
    },

    setCurrentView: function (view, params) {
        var me = this,
            contentPanel = me.getView(),
            layout = contentPanel.getLayout(),
            currentItem = layout.getActiveItem(),
            nextView = contentPanel.down(view);

        if (!contentPanel || view === '' || currentItem.xtype === view) {
            return false;
        }
        if (!nextView) {
            nextView = Ext.create({ xtype: view });
            if (view === 'categoryEdit') {
                nextView.on('recordupdate', me.onCategoryRecordUpdate, me);
                nextView.on('aftersaved', me.onCategoryAfterSaved, me);
            } else if (view === 'contentEdit') {
                nextView.on('aftersaved', me.onContentAfterSaved, me);
            }
            contentPanel.add(nextView);
        }

        if (view === 'articleDetails') {
            nextView.setTitle(params.title);
            nextView.update(params.html);
        }

        if (params && params.action) {
            if (params.action === 'add') {
                nextView.addRecord(true);
            } else if (params.action === 'edit') {
                if (params.record) {
                    nextView.loadRecord(params.record);
                    nextView.editRecord(true);
                } else {
                    Ext.raise('没有要编辑的记录');
                }
            }
        }


        layout.setActiveItem(nextView);

    },

    onCategoryAdd: function () {
        this.setCurrentView('categoryEdit', { action: 'add' });
    },

    insertNode: function (store, pid, record) {
        var node = store.getNodeById(pid);
        if (node) node.appendChild(record);
    },

    onCategoryRecordUpdate: function (form, record, isEdit, eOpts) {
        var me = this,
            store = me.getStore('categories'),
            pid = record.data.ParentId || 2,
            node, pnode;
        if (isEdit) {
            record.hasAllData = true;
            pnode = record.parentNode;
            if (pnode.data.Id !== pid) {
                pnode.removeChild(record);
                me.insertNode(store, pid, record);
            }
        } else {
            record.hasAllData = true;
            record.set('leaf', true);
            record.commit();
            me.insertNode(store, pid, record);
        }
    },

    categoryDetailsUrl: URI.get('category', 'details'),
    onCategoryEdit: function () {
        var me = this,
            selection = me.getViewModel().get('categorySelection');
        if (selection) {
            if (selection.hasAllData) {
                me.setCurrentView('categoryEdit', { action: 'edit', record: selection });
            } else {
                me.send({
                    url: me.categoryDetailsUrl,
                    scope: me,
                    record: selection,
                    params: { id: selection.data.Id },
                    success: function (response, opts) {
                        var obj = Ext.decode(response.responseText),
                            record = opts.record;
                        Ext.Msg.hide();
                        if (obj.success) {
                            record.set(obj.data);
                            record.commit();
                            record.hasAllData = true;
                            this.setCurrentView('categoryEdit', { action: 'edit', record: record });
                        } else {
                            Ext.Msg.alert(I18N.DefaultMessageTitle, obj.msg);
                        }
                    }
                }, I18N.Loading);
            }
        } else {
            Ext.Msg.alert(I18N.DefaultMessageTitle, Ext.String.format(I18N.NoSelection, I18N.Category, I18N.Edit));
            return;
        }
    },

    onCategoryAfterSaved: function () {
        this.setCurrentView('articleList');
    },

    categoryDetailsTpl: [
        '<h2  style="text-align:center">{Title}</h2>',
        '<p style="text-align:center">{Created:date("' + I18N.DefaultDatetimeFormat + '")}</p>' +
        '<table style="border:0;width:100%">',
        '<tr>',
        '<td style="border:0;width:50%;"><b>' + I18N.CategoryModel.ParentId + '</b>：{ParentTitle:defaultValue("' + I18N.EmptyValue + '")}</td>',
        '<td style="border:0;width:50%;"><b>' + I18N.CategoryModel.SortOrder + '</b>：{SortOrder}</td>',
        '</tr>',
        '</table>',
        '<h3 style="border-bottom:1px solid;line-height:30px;">题图</h3>',
        '<p style="text-align:center">{Image:this.image}</p>',
        '<h3 style="border-bottom:1px solid;;line-height:30px;">内容</h3>',
        '{Content:defaultValue("' + I18N.EmptyValue + '")}',
        {
            image: function (v) {
                return Ext.isEmpty(v) ? I18N.EmptyValue : '<img src="' + v + '" />';
            }
        }
    ],

    onCategoryDetails: function () {
        var me = this,
            selection = me.getViewModel().get('categorySelection'),
            title, html;
        if (selection) {
            title = selection.data.Title;
            if (selection.hasAllData) {
                me.doCategoryDetails(selection);
            } else {
                me.send({
                    url: me.categoryDetailsUrl,
                    scope: me,
                    record: selection,
                    params: { id: selection.data.Id },
                    success: function (response, opts) {
                        var obj = Ext.decode(response.responseText),
                            record = opts.record;
                        Ext.Msg.hide();
                        if (obj.success) {
                            record.set(obj.data);
                            record.commit();
                            record.hasAllData = true;
                            this.doCategoryDetails(record);
                        } else {
                            Ext.Msg.alert(I18N.DefaultMessageTitle, obj.msg);
                        }
                    }
                }, I18N.Loading);
            }
        } else {
            Ext.Msg.alert(I18N.DefaultMessageTitle, Ext.String.format(I18N.NoSelection, I18N.Category, I18N.ShowDetails));
            return;
        }
    },


    doCategoryDetails: function (record) {
        var me = this,
            tpl = me.categoryDetailsTpl,
            html;
        if (Ext.isArray(tpl)) {
            tpl = new Ext.Template(tpl);
            me.categoryDetailsTpl = tpl;
        }
        html = tpl.apply(record.data);
        me.setCurrentView('articleDetails', { title: I18N.Category + '：' + record.data.Title, html: html });
    },

    onContentStoreLoad: function (store, records, successful, operation, eOpts) {
        this.getViewModel().set('count', store.getTotalCount());
    },

    onListActivate: function () {
        var me = this,
            view = me.getView(),
            vm = view.getViewModel(),
            selection = vm.get('categorySelection'),
            store = me.getStore('categories'),
            node;
        if (!selection) {
            node = store.getNodeById(1);
            me.lookupReference('CategoryTree').getSelectionModel().select(node);
        }

    },

    onCategorySelectionChange: function (tree, selects) {
        var me = this,
            view = me.getView(),
            vm = view.getViewModel(),
            selection = selects[0],
            store = me.getStore('contents'),
            proxy = store.getProxy(),
            params = proxy.extraParams;
        if (selection) {
            params['cid'] = selection.getId();
            me.lookupReference('ContentGrid').getSelectionModel().deselectAll();
            params['startDate'] = null;
            params['endDate'] = null;
            params['query'] = null;
            me.lookupReference('startSearchButton').setIconCls('x-fa fa-play');
            store.load();
        }
    },

    getSearchFieldValue: function (itemId) {
        var me = this,
            tb = me.lookupReference('searchToolbar'),
            field = tb.down('#' + itemId);
        return field.isValid() ? field.getValue() : '';
    },

    onStartSearch: function (button) {
        var me = this,
            view = me.getView(),
            vm = view.getViewModel(),
            cls = button.iconCls,
            search = cls.indexOf('play') >= 0,
            store = me.getStore('contents'),
            proxy = store.getProxy(),
            params = proxy.extraParams,
            start = me.getSearchFieldValue('StartDate'),
            end = me.getSearchFieldValue('EndDate'),
            query = me.getSearchFieldValue('Query');
        if (search && Ext.isEmpty(start) && Ext.isEmpty(end) && Ext.isEmpty(query)) {
            Ext.Msg.alert(I18N.DefaultMessageTitle, I18N.NoSearchValue);
            return;
        }
        button.setIconCls('x-fa fa-' + (search ? 'times' : 'play'));
        params['startDate'] = search ? start : null;
        params['endDate'] = search ? end : null;
        params['query'] = search ? query : null;
        vm.set('searchValue', search ? Ext.String.format(I18N.ContentSearchTitle,
                Ext.isEmpty(start) ? '无' : Ext.util.Format.date(start, I18N.DefaultDateFormat),
                Ext.isEmpty(end) ? '无' : Ext.util.Format.date(end, I18N.DefaultDateFormat),
                Ext.isEmpty(query) ? '无' : query)
            : '');
        me.lookupReference('ContentGrid').getSelectionModel().deselectAll();
        store.load();
    },

    onContentTitleRenderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
        metaData.tdAttr = 'column-data-index=title';
        metaData.tdStyle = 'text-decoration: underline;cursor:pointer;color: blue;';
        return this.onHighLightRenderer(value, metaData, record, rowIndex, colIndex, store, view);
    },

    contentDetailsUrl: URI.get('content', 'details'),
    onContentGridCellClick: function (viewTable, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        var me = this;
        if (td.getAttribute('column-data-index') === 'title') {
            if (record.hasAllData) {
                me.doContentDetails(record);
            } else {
                me.send({
                    url: me.contentDetailsUrl,
                    scope: me,
                    record: record,
                    params: { id: record.getId() },
                    success: function (response, opts) {
                        var obj = Ext.decode(response.responseText),
                            record = opts.record;
                        Ext.Msg.hide();
                        if (obj.success) {
                            record.set(obj.data);
                            record.commit();
                            record.hasAllData = true;
                            this.doContentDetails(record);
                        } else {
                            Ext.Msg.alert(I18N.DefaultMessageTitle, obj.msg);
                        }
                    }
                }, I18N.Loading);
            }
        }
    },

    contentDetailsTpl: [
        '<h2  style="text-align:center">{Title}</h2>',
        '<p style="text-align:center">{Created:date("' + I18N.DefaultDatetimeFormat + '")}</p>' +
        '<table style="border:0;width:100%">',
        '<tr>',
        '<td style="border:0;width:50%;"><b>' + I18N.Category + '</b>：{CategoryTitle:defaultValue("' + I18N.EmptyValue + '")}</td>',
        '<td style="border:0;width:50%;"><b>' + I18N.ContentModel.Tags + '</b>：{Tags:defaultValue("' + I18N.EmptyValue + '")}</td>',
        '</tr>',
        '<tr>',
        '<td style="border:0;width:50%;"><b>' + I18N.ContentModel.SortOrder + '</b>：{SortOrder}</td>',
        '<td style="border:0;width:50%;"><b>' + I18N.ContentModel.Hits + '</b>：{Hits}</td>',
        '</tr>',
        '</table>',
        '<h3 style="border-bottom:1px solid;line-height:30px;">题图</h3>',
        '<p style="text-align:center">{Image:this.image}</p>',
        '<h3 style="border-bottom:1px solid;;line-height:30px;">摘要</h3>',
        '{Summary:defaultValue("' + I18N.EmptyValue + '")}',
        '<h3 style="border-bottom:1px solid;;line-height:30px;">内容</h3>',
        '{Body:defaultValue("' + I18N.EmptyValue + '")}',
        {
            image: function (v) {
                return Ext.isEmpty(v) ? I18N.EmptyValue : '<img src="' + v + '" />';
            }
        }
    ],

    doContentDetails: function (record) {
        var me = this,
            tpl = me.contentDetailsTpl,
            html;
        if (Ext.isArray(tpl)) {
            tpl = new Ext.Template(tpl);
            me.contentDetailsTpl = tpl;
        }
        html = tpl.apply(record.data);
        me.setCurrentView('articleDetails', { title: I18N.Content + '：' + record.data.Title, html: html });
    },

    contentDeleteUrl: URI.get('content', 'destroy'),
    onContentDelete: function () {
        var me = this;
        me.onDelete(me.lookupReference('ContentGrid').getSelection(),
            me.contentDeleteUrl,
            "Title",
            I18N.Content,
            function (response, opts) {
                var me = this,
                    obj = Ext.decode(response.responseText);
                Ext.Msg.hide();
                if (obj.success) {
                    me.getStore('contents').load();
                    me.lookupReference('ContentGrid').getSelectionModel().deselectAll();
                }
                TOAST.toast(obj.msg, null, 'b');

            });
    },

    onContentRefresh: function () {
        this.getStore('contents').load();
    },

    contentDropUrl: URI.get('content', 'drop'),
    onContentDrop: function (node, data, overModel, dropPosition, dropHandlers, eOpts) {
        var me = this,
            cid = overModel.getId(),
            records = data.records,
            ln = records.length,
            ids = [],
            i, record;
        if (cid < 10000) {
            TOAST.toast(I18N.NoDrop, null, 'b');
            return false;
        }
        for (i = 0; i < ln; i++) {
            record = records[i];
            ids.push(record.getId());
        }
        me.send({
            url: me.contentDropUrl,
            scope: me,
            node: overModel,
            params: { id: ids, cid: cid },
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                Ext.Msg.hide();
                if (obj.success) {
                    me.lookupReference('CategoryTree').getSelectionModel().select(opts.node);
                } else {
                    Ext.Msg.alert(I18N.DefaultMessageTitle, obj.msg);
                }
            }
        }, I18N.Loading);

    },

    onContentAfterSaved: function (form) {
        if (form.hasNew) {
            this.getStore('contents').load();
        }
        this.setCurrentView('articleList');
    },

    onContentAdd: function () {
        this.setCurrentView('contentEdit', { action: 'add' });
    },

    onContentEdit: function () {
        var me = this,
            selection = me.getViewModel().get('selection');
        if (selection) {
            if (selection.hasAllData) {
                me.setCurrentView('contentEdit', { action: 'edit', record: selection });
            } else {
                me.send({
                    url: me.contentDetailsUrl,
                    scope: me,
                    record: selection,
                    params: { id: selection.getId() },
                    success: function (response, opts) {
                        var obj = Ext.decode(response.responseText),
                            record = opts.record;
                        Ext.Msg.hide();
                        if (obj.success) {
                            record.set(obj.data);
                            record.commit();
                            record.hasAllData = true;
                            this.setCurrentView('contentEdit', { action: 'edit', record: record });
                        } else {
                            Ext.Msg.alert(I18N.DefaultMessageTitle, obj.msg);
                        }
                    }
                }, I18N.Loading);
            }
        } else {
            Ext.Msg.alert(I18N.DefaultMessageTitle, Ext.String.format(I18N.NoSelection, I18N.Content, I18N.Edit));
            return;
        }
    },

    onTagManager: function () {
        var me = this,
            view = CFG.getDialog('tagView');
        view.show();
    }

});
