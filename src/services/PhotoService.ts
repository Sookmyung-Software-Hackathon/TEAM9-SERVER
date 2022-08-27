const convertSnakeToCamel = require('../modules/convertSnakeToCamel');

const getPhoto = async (client: any, userId: number) => {
  const { rows } = await client.query(
    `
      SELECT *
      FROM "user" u, photo
      WHERE u.id = $1 AND u.family_id = photo.family_id
      ORDER BY created_at
      `,
    [userId],
  );

  return convertSnakeToCamel.keysToCamel(rows[0]);
};

export default {
  getPhoto,
};
