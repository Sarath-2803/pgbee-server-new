import { DataTypes, Model, Optional } from "sequelize";
import { v4 as uuid } from "uuid";
import { sequelize } from "@/utils";

import { Hostel } from "@/models";

interface RentAttributes {
  id?: string;
  hostelId?: string;
  sharingType?: string;
  rent?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Rent extends Model<RentAttributes> implements RentAttributes {
  declare id: string;
  declare hostelId?: string;
  declare sharingType?: string;
  declare rent?: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  public static async findById(id: string): Promise<Rent | null> {
    return await this.findOne({ where: { id } });
  }

  //   public setUser!: (user: string) => Promise<void>;
  //   public getUser!: () => Promise<User>;

  public static async createRent(
    rentData: Optional<RentAttributes, "id">,
  ): Promise<Rent> {
    return await this.create(rentData);
  }
}

Rent.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
      primaryKey: true,
    },
    hostelId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Hostel,
        key: "id",
      },
    },
    sharingType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rent: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Rent",
    tableName: "rents",
    timestamps: true,
  },
);

export default Rent;
