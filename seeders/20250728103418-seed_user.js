'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin1',
        password: 'hashed_admin_pass', 
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'user1',
        password: 'hashed_user_pass', 
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  
  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
