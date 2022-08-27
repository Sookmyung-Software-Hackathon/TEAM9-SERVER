const convertSnakeToCamel = require('../modules/convertSnakeToCamel');

const createFamily = async (client: any, code: string) => {
  const { rows } = await client.query(
    `
    INSERT INTO family (code)
    VALUES ($1)
    RETURNING *
    `,
    [code],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

export default {
  createFamily,
};
