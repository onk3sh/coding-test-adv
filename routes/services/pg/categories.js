/* eslint-disable no-console */
const { connect, release } = require('./connection');

/**
 *
 * @typedef {Object} categories
 * @property {number} id
 * @property {string} category
 */

/**
 *
 * @param {string} category
 * @return {Promise.<categories>}
 */
const create = async (category) => {
  let pgClient;

  try {
    pgClient = await connect();

    // eslint-disable-next-line operator-linebreak
    const insertQuery =
      'INSERT INTO animal_categories(category) VALUES ($1) Returning *';
    const values = [category];
    const result = await pgClient.query(insertQuery, values);
    if (result.rows.length === 0) {
      throw new Error('There is an error in the INSERT');
    }

    return result.rows[0]; // Only insert one row hence expecting 1 row
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    release(pgClient); // Release client once operation is done
  }
};

/**
 *
 * @returns {Promise.<Array.<categories>>}
 */
const get = async () => {
  let pgClient;
  try {
    pgClient = await connect();
    const getQuery = 'SELECT * FROM animal_categories';

    const result = await pgClient.query(getQuery);
    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    release(pgClient); // Release client once operation is done
  }
};

/**
 *
 * @param {number} catId - Category ID
 */
const remove = async (catId) => {
  let pgClient;
  // Assumption when this function is called confirmation has been provided to delete child
  // Remove from photos Foreign Key
  // Remove Categories
  try {
    pgClient = await connect();

    await pgClient.query('BEGIN');
    const removePhoto = 'DELETE FROM animal_photos WHERE category_id = $1';
    await pgClient.query(removePhoto, [catId]);

    const removeCategories = 'DELETE FROM animal_categories WHERE id = $1';
    await pgClient.query(removeCategories, [catId]);
    await pgClient.query('COMMIT');
  } catch (error) {
    await pgClient.query('ROLLBACK');
    console.error(error);
    throw error;
  } finally {
    release(pgClient); // Release client once operation is done
  }
};

exports.create = create;
exports.get = get;
exports.remove = remove;
