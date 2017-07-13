Ext.define('SimpleCMS.ux.form.field.TinymcePlus',{
    extend: 'SimpleCMS.ux.form.field.TinyMCE',
    xtype: 'tinymceplusfield',

    baseEditorConfig: {
        relative_urls: false,
        remove_script_host: false,
        document_base_url: ROOTPATH,
        plugins: [
            'advlist lists link image charmap  hr anchor pagebreak',
            'searchreplace wordcount visualblocks visualchars ',
            'media nonbreaking table code contextmenu',
            'paste textcolor colorpicker textpattern imagetools toc '
        ],
        toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify| forecolor backcolor | bullist numlist outdent indent | link image media | insertMedia'

    },

    initComponent: function () {
        var me = this,
            culture = Ext.util.Cookies.get('_culture') || 'zh_CN';
        me.tinyMCEConfig = Ext.apply({},
            me.baseEditorConfig,
            { language: culture, setup: Ext.bind(me.tinymceSetup, me) });
        me.callParent(arguments);
    },

    tinymceSetup: function (editor) {
        var me = this;
        editor.addButton('insertMedia', {
            text: I18N.InsertMedia,
            icon: false,
            onclick: Ext.bind(me.insertMedia, me)
        });
    },

    insertMedia: function () {
        var me = this,
            win = CFG.getDialog('mediaWin');
        win.on('selected', me.onMediaSelected, me, { single: true });
        win.setTitle(I18N.SelectedMedia);
        win.setImageOnly(false);
        win.show();
    },

    mediaTpl: [
        '<img src="{0}/upload/{1}/{2}" alt="{3}"/>',
        '<audio src="{0}/upload/{1}/{2}" controls="controls"></audio>',
        '<video controls="controls" width="300" height="150"><source src="{0}/upload/{1}/{2}"/></video>'
    ],

    onMediaSelected: function (win, records) {
        var me = this,
            ed = tinymce.get(me.getInputId()),
            ln = records.length,
            i, record;
        for (i = 0; i < ln; i++) {
            record = records[i];
            ed.insertContent(Ext.String.format(me.mediaTpl[record.data.Type - 1],
                ROOTPATH,
                record.data.Path,
                record.data.FileName,
                record.data.Description));
        }
    }

});
