Ext.define('SimpleCMS.view.media.MediaPanelController', {
    extend: 'SimpleCMS.ux.app.BaseViewController',
    alias: 'controller.media',

    onBeforeUpload: function (cmp, uploader, file) {
        var me = this,
            tb = me.lookupReference('progressToolBar'),
            progress = tb.down('progressbar');
        progress.setValue(0);
        progress.updateText(Ext.String.format(I18N.Uploading, file.name, 0));
        tb.show();
    },

    onUploadProgress: function (cmp1, uploader, filename, size, precent) {
        var me = this,
            tb = me.lookupReference('progressToolBar'),
            progress = tb.down('progressbar');
        progress.setValue(precent);
        progress.updateText(Ext.String.format(I18N.Uploading, filename, precent));
    },

    onFileUploaded: function (cmp, file, response) {
        var me = this,
            store = me.getStore('mediae');
        store.insert(0, response.data);
    },

    onUploadComplete: function () {
        var me = this,
            tb = me.lookupReference('progressToolBar');
        tb.hide();
    },


    onUploadError: function (uploader, data) {
        TOAST.toast(Ext.String.format(I18N.FileUploadError, data.file.name, data.status && data.status === 200 ? data.file.msg : data.message), this.getView().el);
    },

    onSorterToggle: function (cmp, btn, isPressed, eOpts) {
        btn.switch = true;
    },

    onSorterButtonClick: function (btn) {
        var store = this.getStore('mediae'),
            cls = btn.iconCls,
            dir = '';
        if (btn.switch === true) {
            btn.switch = false;
        } else {
            btn.setIconCls(cls.indexOf('down') > 0 ? 'x-fa fa-long-arrow-up' : 'x-fa fa-long-arrow-down');
            cls = btn.iconCls;
        }
        dir = cls.indexOf('down') > 0 ? 'DESC' : 'ASC';
        store.sort(btn.dataIndex, dir);
    },

    onFileTypeToggle: function (cmp, btn, isPressed, eOpts) {
        var store = this.getStore('mediae'),
            proxy = store.getProxy(),
            btns = cmp.items.items,
            ln = btns.length, i, values = [];
        for (i = 0; i < ln; i++) {
            if (btns[i].pressed) {
                values.push(btns[i].fileType);
            }
        }
        proxy.extraParams['type'] = values;
        store.load();
    },

    onDateQueryChange: function (cmp, newValue, oldValue, eOpts) {
        var store = this.getStore('mediae'),
            proxy = store.getProxy(),
            params = proxy.extraParams,
            dt = new Date(),
            v;
        if (newValue !== oldValue) {
            if (newValue === 'all') {
                params['year'] = null;
                params['month'] = null;
                params['day'] = null;
            } else if (newValue === 'today') {
                params['year'] = dt.getFullYear();
                params['month'] = dt.getMonth() + 1;
                params['day'] = dt.getDate();
            } else {
                v = newValue.split(',');
                params['year'] = v[0];
                params['month'] = v[1];
                params['day'] = null;
            }
            store.load();
        }

    },

    init: function () {
        var me = this,
            dv = me.lookupReference('mediaDataView'),
            plugins = dv.getPlugins(),
            ln = plugins.length, i, plugin;
        for (i = 0; i < ln; i++) {
            plugin = plugins[i];
            if (plugin.xclass === 'Ext.ux.DataView.LabelEditor') {
                plugin.on('complete', me.onDescriptionEditComplete, me);
                break;
            }
        }
    },

    descriptionEditUrl: URI.get('media', 'update'),
    onDescriptionEditComplete: function (cmp, value, startValue, eOpts) {
        var me = this,
            record = cmp.activeRecord;
        if (value !== startValue) {
            me.send({
                url: me.descriptionEditUrl,
                params: { id: record.getId(), value: value },
                record: record,
                success: function (response, opts) {
                    var obj = Ext.decode(response.responseText);
                    if (obj.success) {
                        opts.record.commit();
                    } else {
                        opts.record.reject();
                        TOAST.toast(obj.msg, null, 'b');
                    }
                }
            });
        }
    },


    mediaDeleteUrl: URI.get('media', 'destroy'),
    onMediaDelete: function () {
        var me = this;
        me.onDelete(me.lookupReference('mediaDataView').getSelection(),
            me.mediaDeleteUrl,
            "Description",
            I18N.Media,
            function (response, opts) {
                var me = this,
                    obj = Ext.decode(response.responseText);
                Ext.Msg.hide();
                if (obj.success) {
                    me.getStore('mediae').load();
                    me.lookupReference('mediaDataView').getSelectionModel().deselectAll();
                }
                TOAST.toast(obj.msg, null, 'b');

            });
    },

    pathString: '{0}/upload/{1}/{2}',
    playString: '<{0} src="{1}" autoplay="true" controls="controls" />',
    onMediaShow: function (dataview, record, item, index, e, eOpts) {
        var me = this,
            type = record.get('Type'),
            fm = Ext.util.Format.format,
            path = fm(me.pathString, ROOTPATH, record.get('Path'), record.get('FileName'));
        if (type === 1) {
            window.open(path);
        } else {
            Ext.Msg.alert('播放', fm(me.playString, type === 2 ? 'audio' : 'video', path), function () { Ext.Msg.updateText('') });
        }
    }


});