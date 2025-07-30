'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add email column (nullable for existing users)
    await queryInterface.addColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });

    // Add googleId column (nullable for non-OAuth users)
    await queryInterface.addColumn('Users', 'googleId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });

    // Update existing users to set email = username + '@example.com'
    // This is temporary - you should manually set proper emails later
    await queryInterface.sequelize.query(`
      UPDATE "Users" 
      SET email = username || '@example.com'
      WHERE email IS NULL
    `);

    // Now make email non-nullable
    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });

    // Make password nullable (for OAuth users)
    await queryInterface.changeColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // First remove googleId
    await queryInterface.removeColumn('Users', 'googleId');
    
    // Then remove email
    await queryInterface.removeColumn('Users', 'email');
    
    // Make password non-nullable again
    await queryInterface.sequelize.query(`
      UPDATE "Users" 
      SET password = '' 
      WHERE password IS NULL
    `);
    
    await queryInterface.changeColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};