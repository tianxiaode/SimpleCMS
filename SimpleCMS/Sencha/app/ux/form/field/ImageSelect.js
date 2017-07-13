Ext.define('SimpleCMS.ux.form.field.ImageSelect', {
    extend: 'Ext.form.field.Text',
    xtype: 'imageselectfield',

    requires: [
        'SimpleCMS.view.media.Win'
    ],

    config: {
        triggers: {
            picker: {
                cls: 'x-fa fa-image',
                handler: 'onTriggerClick',
                scope: 'this'
            }
        }
    },

    onTriggerClick: function () {
        var me = this,
            win = CFG.getDialog('mediaWin');
        win.on('selected', me.onImageSelected, me, { single: true });
        win.setTitle(I18N.SelectedTitleImage);
        win.setImageOnly(true);
        win.show();
    },

    onImageSelected: function (win, records) {
        var me = this,
            record = records[0];
        if (record && record.data.Type === 1) {
            me.setValue(Ext.String.format('{0}/upload/{1}/{2}', ROOTPATH, record.data.Path, record.data.FileName));
        }
    }
})