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

const joinFamily = async (client: any, code: string, device: string) => {
  const { rows } = await client.query(
    `
      SELECT *
      FROM family
      WHERE code = $1
      `,
    [code],
  );
  if (!rows[0]) {
    throw 400;
  }

  const { rows: user } = await client.query(
    `
        INSERT INTO "user" (family_id, device)
        VALUES ($1, $2)
        RETURNING *
        `,
    [rows[0].id, device],
  );
  return convertSnakeToCamel.keysToCamel(user[0]);
};

export default {
  createFamily,
  joinFamily,
};
