import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  username: DataTypes.STRING,
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: true },
  googleId: { type: DataTypes.STRING, allowNull: true, unique: true },
  role: { type: DataTypes.STRING, defaultValue: 'user' }
}, {
  // Optional: If you want to keep username as required
  validate: {
    usernameOrGoogleId() {
      if (!this.username && !this.googleId) {
        throw new Error('Either username or googleId must be provided');
      }
    }
  }
});
export default User;