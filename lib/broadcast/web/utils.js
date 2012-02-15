var utils = module.exports = {
  api: {
    // formats an array of rows returned from couchdb for use by api users
    formatRows: function (rows) {
      return rows.map(function (row) {
        delete row.value.type;
        return row.value;
      });
    },
    sortRowsByName: function (rows, desc) {
      rows = rows.sort(function (a, b) {
        return (desc) ? a.name < b.name : a.name > b.name;
      });
      
      return rows;
    }
  }
};
