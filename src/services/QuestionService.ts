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

  const { rows: question } = await client.query(
    `
    SELECT *
    FROM week
    WHERE family_id = $1
    ORDER BY created_at DESC
    `,
    [rows[0].family_id],
  );
  const { rows: answer } = await client.query(
    `
    SELECT *
    FROM answer
    WHERE week_id = $1 AND user_id = $2
    
    `,
    [question[0].id, userId],
  );
  console.log(answer);
  let isAnswered = true;
  if (!answer[0]) {
    isAnswered = false;
  }
  const data = {
    id: question[0].id,
    question: question[0].question,
    isAnswered,
  };

  return convertSnakeToCamel.keysToCamel(data);
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
    let week = rows[0].week_num;
    let day = rows[0].day;
    if (day == 6) {
      day = 0;
      week = week + 1;
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

      if (!rows[0]) {
        const { rows } = await client.query(
          `
          UPDATE family
          SET "order" = 0
          WHERE id = $1
          RETURNING *
          `,
          [id],
        );
        const { rows: selectQuestion } = await client.query(
          `
          SELECT *
          FROM question
          WHERE "order" = $1
          `,
          [1],
        );
        question = selectQuestion[0].question;
      } else {
        question = rows[0].question;
      }

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

const postAnswer = async (client: any, userId: number, weekId: number, answer: string) => {
  const { rows } = await client.query(
    `
    INSERT INTO answer(week_id, answer, user_id)
    VALUES ($1, $2, $3)
    RETURNING * 
    `,
    [weekId, answer, userId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const postQuestion = async (client: any, userId: number, question: string) => {
  const { rows } = await client.query(
    `
    SELECT *
    FROM "user"u
    WHERE id = $1
    `,
    [userId],
  );
  const familyId = rows[0].family_id;

  const { rows: insertFamilyQuestion } = await client.query(
    `
    INSERT INTO family_question(family_id, question)
    VALUES ($1, $2)
    RETURNING * 
    `,
    [familyId, question],
  );
  return convertSnakeToCamel.keysToCamel(insertFamilyQuestion[0]);
};

const getWeekList = async (client: any, userId: number) => {
  const { rows: weeks } = await client.query(
    `
    SELECT max(week_num)
    FROM "user" u, week
    WHERE u.id = $1 AND u.family_id = week.family_id
    `,
    [userId],
  );
  console.log(weeks);

  return convertSnakeToCamel.keysToCamel(weeks[0]);
};

const addPhoto = async (client: any, userId: number, location: string, week: number) => {
  const { rows: userFamily } = await client.query(
    `
    SELECT *
    FROM "user" u
    WHERE u.id = $1
    `,
    [userId],
  );

  const familyId = userFamily[0].family_id;
  const { rows } = await client.query(
    `
    INSERT INTO photo(url, week, family_id)
    VALUES ($1, $2, $3)
    RETURNING * 
    `,
    [location, week, familyId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const getWeekQuestion = async (client: any, userId: number, week: number) => {
  const { rows } = await client.query(
    `
    SELECT *
    FROM "user" u, week
    WHERE u.id = $1 AND u.family_id = week.family_id AND week.week_num = $2
    ORDER BY week_num
    `,
    [userId, week],
  );

  return convertSnakeToCamel.keysToCamel(rows);
};

const getDayAnswer = async (client: any, userId: number, week: number, day: number) => {
  const { rows } = await client.query(
    `
    SELECT *
    FROM week, answer
    WHERE week_num = $1 AND day = $2 AND week.id = answer.week_id
    `,
    [week, day],
  );

  return convertSnakeToCamel.keysToCamel(rows);
};
export default {
  getQuestion,
  addQuestion,
  postAnswer,
  postQuestion,
  getWeekList,
  addPhoto,
  getWeekQuestion,
  getDayAnswer,
};
