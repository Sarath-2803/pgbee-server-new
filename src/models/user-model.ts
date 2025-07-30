import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/utils";
import bcrypt from "bcryptjs";

// Import Role type for association methods
import { Role } from "@/models";

interface UserAttributes {
  id?: string;
  name: string;
  email: string;
  password: string;
  roleId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// interface UserCreationAttributes extends Optional<UserAttributes, "id"> {
//   verifyPassword(
//     this: UserCreationAttributes,
//     password: string,
//   ): Promise<boolean>;
// }

class User
  // extends Model<UserAttributes, UserCreationAttributes>
  extends Model<UserAttributes>
  implements UserAttributes
{
  public id!: string;
  public name!: string; // Assuming you want to add a name field
  public email!: string;
  public password!: string;
  public roleId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association methods (added by Sequelize)
  public setRole!: (role: Role) => Promise<void>;
  public getRole!: () => Promise<Role>;

  public async verifyPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.dataValues.password);
  }

  public static async findByEmail(email: string): Promise<User | null> {
    return await this.findOne({ where: { email } });
  }

  public static async createUser(
    // userData: UserCreationAttributes,
    userData: UserAttributes,
  ): Promise<User> {
    return await this.create(userData);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value: string) {
        const hashedPassword = bcrypt.hashSync(value, 10);
        this.setDataValue("password", hashedPassword);
      },
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  },
);

export default User;
