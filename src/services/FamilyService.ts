const convertSnakeToCamel = require('../modules/convertSnakeToCamel');

const createFamily = async (client: any, code: string) => {
  const { rows } = await client.query(
    `
    INSERT INTO family (code, "order")
    VALUES ($1, $2)
    RETURNING *
    `,
    [code, '1'],
  );
  const { rows: question } = await client.query(
    `
    SELECT *
    FROM question
    WHERE "order" = $1
    `,
    [1],
  );
  var d = new Date();
  var n = d.getDay();
  const { rows: insertWeek } = await client.query(
    `
    INSERT INTO week (family_id, question, week_num, day)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [rows[0].id, question[0].question, 1, n],
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

  const { rows: checkedUser } = await client.query(
    `
      SELECT *
      FROM "user"
      WHERE device = $1
      `,
    [device],
  );
  if (checkedUser[0]) {
    return convertSnakeToCamel.keysToCamel(checkedUser[0]);
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
