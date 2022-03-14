/* eslint-disable consistent-return */
const { Pool } = require('pg');
/**
 *
 * @returns {Promise.<import('pg').PoolClient>}
 */
const connect = async () => {
  let pool;
  if (global.gPgPool) {
    // Attempts to use existing pool
    pool = global.gPgPool;
  } else {
    pool = new Pool();
    global.gPgPool = pool;
  }

  return pool.connect();
};

/**
 *
 * @param {import('pg').PoolClient} client
 */
const release = (client) => {
  if (client) {
    client.release();
  }
};

exports.connect = connect;
exports.release = release;
