const { Op } = require("sequelize");

const buildUserNameSearch = (q) => {
  if (!q?.trim()) return {};

  const keywords = q.trim().split(/\s+/);

  return {
    [Op.and]: keywords.map((keyword) => ({
      [Op.or]: [
        { first_name: { [Op.like]: `%${keyword}%` } },
        { last_name: { [Op.like]: `%${keyword}%` } },
      ],
    })),
  };
};

module.exports = {
  buildUserNameSearch,
};
