/* eslint-disable comma-dangle */
/* eslint-disable no-console */
const format = require('pg-format');
const { connect, release } = require('./connection');

/**
 *
 * @typedef {Object} photos
 * @property {number} id
 * @property {number} category_id
 * @property {string} photo_url
 */

/**
 *
 * @typedef {Object} newPhoto
 * @property {number} categoryid
 * @property {string} photourl
 */

/**
 *
 * @param {Array.<newPhoto>} newPhotos
 * @return {Promise.<photos>}
 */
const create = async (newPhotos) => {
  let pgClient;
  try {
    pgClient = await connect();

    const values = newPhotos.map((elem) => [elem.categoryid, elem.photourl]);

    // eslint-disable-next-line operator-linebreak
    const insertQuery = format(
      'INSERT INTO animal_photos(category_id, photo_url) VALUES %L Returning *',
      values
    );

    const result = await pgClient.query(insertQuery);
    if (result.rows.length === 0) {
      throw new Error('There is an error in the INSERT');
    }

    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    release(pgClient); // Release client once operation is done
  }
};

/**
 * Get Animal Photo based on Category ID
 * @param {Array.<number>} category_ids
 * @returns {Promise.<Array.<photos>>}
 */
const get = async (categoryIds) => {
  let pgClient;
  try {
    pgClient = await connect();

    const pgParam = [];
    for (let i = 1; i <= categoryIds.length; i += 1) {
      pgParam.push(`$${i}`);
    }

    const getQuery = `SELECT * FROM animal_photos 
    WHERE category_id IN (${pgParam.join(',')})`;
    const result = await pgClient.query(getQuery, categoryIds);
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
 * @param {Array.<number>} photoIds - Photo ID
 */
const remove = async (photoIds) => {
  const pgClient = await connect();

  const pgParam = [];
  for (let i = 1; i <= photoIds.length; i += 1) {
    pgParam.push(`$${i}`);
  }

  try {
    const removePhoto = `DELETE FROM animal_photos 
    WHERE id IN(${pgParam.join(',')})`;
    await pgClient.query(removePhoto, photoIds);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    release(pgClient); // Release client once operation is done
  }
};

exports.create = create;
exports.get = get;
exports.remove = remove;
