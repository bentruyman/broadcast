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
  },
  string: {
    // Generates a URL-friendly "slug" from a provided string.
    // For example: "This Is Great!!!" transforms into "this-is-great"
    generateSlug: function (value) {
      // 1) convert to lowercase
      // 2) remove dashes and pluses
      // 3) replace spaces with dashes
      // 4) remove everything but alphanumeric characters and dashes
      return value.toLowerCase().replace(/-+/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    }
  }
  
};
