import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // ADDED ROLE FIELD
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user' // Default role for new users
  }
});

export default User;
