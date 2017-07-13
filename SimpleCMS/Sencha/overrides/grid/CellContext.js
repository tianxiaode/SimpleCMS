Ext.define('Overrides.grid.CellContext', {
    override: "Ext.grid.CellContext",

    setRow: function (row) {
        var me = this,
            dataSource = me.view.dataSource,
            oldRecord = me.record,
            count;
        if (!Ext.isEmpty(row)) {
            // Row index passed, < 0 meaning count from the tail (-1 is the last, etc)
            if (typeof row === 'number') {
                count = dataSource.getCount();
                row = row < 0 ? Math.max(count + row, 0) : Math.max(Math.min(row, count - 1), 0);
                me.rowIdx = row;
                me.record = dataSource.getAt(row);
            }
            // row is a Record
            else if (row.isModel) {
                me.record = row;
                me.rowIdx = dataSource.indexOf(row);
            }
            // row is a grid row, or Element wrapping row
            else if (row.tagName || row.isElement) {
                me.record = me.view.getRecord(row);
                me.rowIdx = dataSource.indexOf(me.record);
            }
        }
        if (me.record !== oldRecord) {
            me.generation++;
        }
        return me;
    }
});
