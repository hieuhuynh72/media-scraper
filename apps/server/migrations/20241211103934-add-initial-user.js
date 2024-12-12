// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          username: 'momos',
          password: bcrypt.hashSync('admin123', 10),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', { username: 'momos' }, {});
  },
};
