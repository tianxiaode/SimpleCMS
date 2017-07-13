/**
 * @class Ext.ux.upload.Basic
 * @extends Ext.util.Observable
 * 
 * @author Harald Hanek (c) 2011-2012
 * @license http://harrydeluxe.mit-license.org
 */
Ext.define('SimpleCMS.ux.button.UploadBasic', {
    extend: 'Ext.util.Observable',
    autoStart: true,
    autoRemoveUploaded: true,

    statusQueuedText: 'Ready to upload',
    statusUploadingText: 'Uploading ({0}%)',
    statusFailedText: 'Error',
    statusDoneText: 'Complete',
    statusInvalidSizeText: 'File too large',
    statusInvalidExtensionText: 'Invalid file type',


    configs: {
        uploader: {
            runtimes: '',
            url: '',
            browse_button: null,
            //container: null,
            max_file_size: '128mb',
            resize: '',
            flash_swf_url: '',
            silverlight_xap_url: '',
            filters: [],
            //chunk_size: '1mb', // @see http://www.plupload.com/punbb/viewtopic.php?id=1259
            chunk_size: null,
            unique_names: true,
            multipart: true,
            multipart_params: {},
            multi_selection: true,
            //drop_element: null,
            required_features: null
        }
    },

    constructor: function (owner, config) {
        var me = this;
        me.owner = owner;
        Ext.apply(me, config.listeners);
        me.uploaderConfig = Ext.apply(me, config.uploader, me.configs.uploader);

        me.callParent();
    },

    /**
     * @private
     */
    initialize: function () {
        var me = this;
        if (!me.initialized) {
            me.initialized = true;
            me.initializeUploader();
        }
    },

    /**
     * Destroys this object.
     */
    destroy: function () {
        this.clearListeners();
    },

    setUploadPath: function (path) {
        this.uploadpath = path;
    },

    initializeUploader: function () {
        var me = this;

        if (!me.uploaderConfig.runtimes) {
            var runtimes = ['html5'];

            me.uploaderConfig.flash_swf_url && runtimes.push('flash');
            me.uploaderConfig.silverlight_xap_url && runtimes.push('silverlight');

            runtimes.push('html4');

            me.uploaderConfig.runtimes = runtimes.join(',');
        }

        me.uploader = Ext.create('plupload.Uploader', me.uploaderConfig);

        Ext.each(['Init',
            'ChunkUploaded',
            'FilesAdded',
            'FilesRemoved',
            'FileUploaded',
            'PostInit',
            'QueueChanged',
            'Refresh',
            'StateChanged',
            'BeforeUpload',
            'UploadFile',
            'UploadProgress',
            'Error'], function (v) {
                me.uploader.bind(v, eval("me._" + v), me);
            }, me);

        me.uploader.init();
    },

    updateProgress: function () {
        var me = this,
            t = me.uploader.total,
            speed = Ext.util.Format.fileSize(t.bytesPerSec),
            total = me.store.data.length,
            failed = me.failed.length,
            success = me.success.length,
            sent = failed + success,
            queued = total - success - failed,
            percent = t.percent;

        me.fireEvent('updateprogress', me, total, percent, sent, success, failed, queued, speed);
    },

    fileMsg: function (file) {
        var me = this;
        if (file.status && file.server_error != 1) {
            switch (file.status) {
                case 1:
                    file.msg = me.statusQueuedText;
                    break;
                case 2:
                    file.msg = Ext.String.format(me.statusUploadingText, file.percent);
                    break;
                case 4:
                    file.msg = file.msg || me.statusFailedText;
                    break;
                case 5:
                    file.msg = me.statusDoneText;
                    break;
            }
        }
        return file;
    },

    /**
     * Plupload EVENTS
     */
    _Init: function (uploader, data) {
        this.runtime = data.runtime;
        this.owner.enable(true); // button aktiv schalten
        this.fireEvent('uploadready', this);
    },

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    _BeforeUpload: function (uploader, file) {
        this.fireEvent('beforeupload', this, uploader, file);
    },

    _ChunkUploaded: function () {
    },

    _FilesAdded: function (uploader, files) {
        var me = this;

        if (me.uploaderConfig.multi_selection != true) {

            files = [files[0]];
            uploader.files = [files[0]];
        }

        if (me.fireEvent('filesadded', me, files) !== false) {
            if (me.autoStart && uploader.state != 2)
                Ext.defer(function () {
                    me.uploader.start();
                }, 300);
        }
    },

    _FilesRemoved: function (uploader, files) {
    },

    _FileUploaded: function (uploader, file, status) {
        var me = this,
            response = Ext.JSON.decode(status.response);

        if (response.success == true) {
            file.server_error = 0;
            me.fireEvent('fileuploaded', me, file, response);
        }
        else {
            if (response.msg) {
                file.msg = response.msg;
            }
            file.server_error = 1;
            me.fireEvent('uploaderror', me, Ext.apply(status, {
                file: file
            }));
        }
    },

    _PostInit: function (uploader) {
    },

    _QueueChanged: function (uploader) {
    },

    _Refresh: function (uploader) {
    },

    _StateChanged: function (uploader) {
        if (uploader.state == 2) {
            this.fireEvent('uploadstarted', this);
        }
        else {
            this.fireEvent('uploadcomplete', this, this.success, this.failed);
        }
    },

    _UploadFile: function (uploader, file) {
    },

    _UploadProgress: function (uploader, file) {
        var me = this,
            name = file.name,
            size = file.size,
            percent = file.percent;

        me.fireEvent('uploadprogress', me, file, name, size, percent);

        if (file.server_error)
            file.status = 4;

    },

    _Error: function (uploader, data) {
        if (data.file) {
            data.file.status = 4;
            if (data.code == -600) {
                data.file.msg = Ext.String.format('<span style="color: red">{0}</span>', this.statusInvalidSizeText);
            }
            else if (data.code == -700) {
                data.file.msg = Ext.String.format('<span style="color: red">{0}</span>', this.statusInvalidExtensionText);
            }
            else {
                data.file.msg = Ext.String.format('<span style="color: red">{2} ({0}: {1})</span>', data.code, data.details,
                    data.message);
            }
        }
        this.fireEvent('uploaderror', this, data);
    }
});