const convertSnakeToCamel = require('../modules/convertSnakeToCamel');

const getQuestion = async (client: any, userId: number) => {
  const { rows } = await client.query(
    `
    SELECT *
    FROM "user" u, family
    WHERE u.id = $1 AND u.family_id = family.id
    `,
    [userId],
  );
  rows[0].family_id;
  const order = rows[0].order + 1;

  const { rows: question } = await client.query(
    `
    SELECT *
    FROM 
    WHERE 
    `,
    [userId],
  );

  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const addQuestion = async (client: any) => {
  const { rows } = await client.query(
    `
    SELECT *
    FROM family
    `,
  );

  for (let r of rows) {
    const id = r.id;
    const order = r.order + 1;
    console.log(id);
    console.log(order);
    const { rows } = await client.query(
      `
      SELECT *
      FROM week
      WHERE family_id = $1
      ORDER BY created_at DESC
      `,
      [id],
    );
    console.log(rows);
    let week = rows[0].week_num + 1;
    let day = rows[0].day;
    if (day == 6) {
      day = 0;
    } else {
      day = day + 1;
    }

    const { rows: checkedFamilyQuestion } = await client.query(
      `
      SELECT *
      FROM family_question
      WHERE family_id = $1
      `,
      [id],
    );
    let question;
    if (!checkedFamilyQuestion[0]) {
      const { rows } = await client.query(
        `
        SELECT *
        FROM question
        WHERE "order" = $1
        `,
        [order],
      );
      question = rows[0].question;
      const { rows: updateFamily } = await client.query(
        `
        UPDATE family
        SET "order" = "order" +1
        WHERE id = $1
        RETURNING *
        `,
        [id],
      );
    } else {
      const { rows } = await client.query(
        `
        SELECT *
        FROM family_question
        WHERE family_id = $1
        ORDER BY created_at
        `,
        [id],
      );
      question = rows[0].question;
      const { rows: deleteFamilyQuestion } = await client.query(
        `
        DELETE FROM family_question
        WHERE id = $1
        `,
        [rows[0].id],
      );
    }
    const { rows: insertWeek } = await client.query(
      `
      INSERT INTO week(family_id, question, week_num, day)
      VALUES ($1, $2, $3, $4)
      RETURNING * 
      `,
      [id, question, week, day],
    );
  }

  return convertSnakeToCamel.keysToCamel(rows[0]);
};

export default {
  getQuestion,
  addQuestion,
};
