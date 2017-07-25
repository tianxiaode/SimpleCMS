Ext.define("SimpleCMS.ux.form.BaseForm", {
    extend: 'Ext.form.Panel',
    xtype: 'baseform',

    requires: [
        'Ext.form.field.*',
        'Ext.toolbar.*',
        'Ext.button.*',
        'Ext.state.*'
    ],

    viewModel: {
        data: {
            isEdit: false
        }
    },


    waitMsg: I18N.SaveWaitMsg,
    waitTitle: I18N.Save,

    fieldDefaults: {
        labelWidth: 80,
        anchor: '0'
    },
    border: false,
    trackResetOnLoad: true,
    defaultType: 'textfield',
    bodyPadding: 10,

    saved: null,
    onSave: function (button) {
        var me = this,
            f = me.getForm();
        if (button) me.saved = button.saved;
        if (f.isValid()) {
            f.submit({
                submitEmptyText: false,
                url: me.url,
                waitMsg: me.waitMsg,
                waitTitle: me.waitTitle,
                success: me.onSubmitSuccess,
                failure: me.onSubmitFailure,
                scope: me
            });
        }
    },

    onSubmitFailure: function (form, action) {
        var me = this;
        FAILED.form(form, action);
    },

    saveButton: 'button[formBind=true]',
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.bindButtonEvent();
    },

    resetButton: 'resetButton',

    onReset: function () {
        var me = this;
        me.getForm().reset();
        me.initFocus();
    },

    initFocus: function () {
        var me = this,
            field = me.down(me.defaultFocus);
        if (field) {
            field.focus(true, 10);
        }
    },

    bindButtonEvent: function () {
        var me = this,
            saveButton = me.saveButton,
            resetButton = me.resetButton,
            i, ln;
        if (Ext.isString(saveButton)) {
            saveButton = me.query(saveButton);
            ln = saveButton.length;
            for (i = 0; i < ln; i++) {
                saveButton[i].on('click', me.onSave, me);
            }
            me.saveButton = saveButton;
        }
        if (Ext.isString(resetButton)) {
            resetButton = me.down('#' + resetButton);
            me.resetButton = resetButton;
            resetButton.on('click', me.onReset, me);
        }
    },

    getSavedMessage: function (saved) {
        return saved === 'new'
            ? I18N.SavedAndNew
            : saved === 'close' ? I18N.SavedAndClose : I18N.SavedAndNothing;
    },

    onSubmitSuccess: function (form, eOpts) {
        var me = this,
            saved = me.saved, msg, fn,
            record = me.getRecord(),
            isEdit = me.getViewModel().get('isEdit');
        me.hasSaved = true;
        me.updateRecord();
        if (!isEdit) {
            record.set(eOpts.result.data);
            me.hasNew = true;
        }
        record.commit();
        me.fireEvent('recordupdate', me, record, isEdit, eOpts);
        TOAST.toast(me.getSavedMessage(saved), me.el, null,
            saved === 'close' ? me.onFormClose : me.initFocus,
            me);
        if (me.saved === 'new') me.addRecord();
        if (me.saved === 'custom') me.fireEvent('aftersaved', me, record, isEdit, eOpts);
    },

    onFormClose: function () {
        var me = this;
        me.up(me.closeCmp).close();
    },

    titleCmp: 'window',
    switchTitle: function (title) {
        var me = this,
            titleCmp = me.titleCmp;
        if (Ext.isEmpty(titleCmp)) return;
        if(Ext.isString(titleCmp)){
            if (titleCmp === 'self') {
                titleCmp = me;
            } else {
                titleCmp = me.up(titleCmp);
            }
            me.titleCmp = titleCmp;
        }
        titleCmp.setTitle(title);
    },

    initState: function () {
        var me = this;
        me.hasSaved = false;
        me.hasNew = false;
    },

    entityName: '',
    config: {
        defaultModelValue: {}
    },
    addRecord: function (initState) {
        var me = this,
            model = me.baseModel,
            entityName = me.entityName;
        if (initState === true) me.initState();
        if (Ext.isEmpty(model)) Ext.raise('没有定义baseModel');
        if (Ext.isEmpty(entityName)) Ext.raise('没有定义entityName');
        me.fireEvent('beforeaddrecord', me);
        me.switchTitle(I18N.Add + I18N[entityName] );
        me.loadRecord(Ext.create(model, Ext.apply({}, me.getDefaultModelValue())));
        me.url = URI.get(entityName.toLocaleLowerCase(), 'create');
        me.getViewModel().set('isEdit', false);
        me.onReset();
        me.fireEvent('afteraddrecord', me);
    },

    editRecord: function (initState) {
        var me = this,
            entityName = me.entityName;
        if (Ext.isEmpty(entityName)) Ext.raise('没有定义entityName');
        if (initState === true) me.initState();
        me.switchTitle(I18N.Edit + I18N[entityName]);
        me.url = URI.get(entityName.toLocaleLowerCase(), 'update');
        me.getViewModel().set('isEdit', true);
        me.onReset();
    }

});
