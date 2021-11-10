const pg = require('pg');

let connection;
exports.connect = function (connectionString) {
  if (connection) {
    const oldConnection = connection;
    connection = null;
    return oldConnection.end().then(() => exports.connect(connectionString));
  }
  connection = new pg.Pool({
    connectionString,
    max: 5, // New things
  });
  return connection.connect().catch(function (error) {
    connection = null;
    throw error;
  });
};

exports.query = function (text, params, callback) {
  if (!connection) {
    return callback(new Error('Not connected to database'));
  }
  const start = Date.now();
  return connection.query(text, params, function (error, result) {
    const duration = Date.now() - start;
    console.log('executed query', { text, duration });
    callback(error, result);
  });
};



exports.queryPromise = function (text, params) {
  if (!connection) {
    return Promise.reject(new Error('Not connected to database'));
  }
  const start = Date.now();
  return new Promise((resolve, reject) => {
    connection.query(text, params).then(function (result) {
      // if error: reject(error)
      const duration = Date.now() - start;
      console.log('executed query', { text, duration });
      resolve(result);
    });
  });
};
