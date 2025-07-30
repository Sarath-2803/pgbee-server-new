import { v4 as uuid } from "uuid";
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/utils";

interface RoleAttributes {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Role
  extends Model<Optional<RoleAttributes, "id">>
  implements RoleAttributes
{
  declare id: string;
  declare name: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public static async findByName(name: string): Promise<Role | null> {
    return await this.findOne({ where: { name } });
  }

  public static async createRole(
    roleData: Optional<RoleAttributes, "id">,
  ): Promise<Role> {
    return await this.create(roleData);
  }
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Role",
    tableName: "roles",
    timestamps: true,
  },
);

export default Role;
