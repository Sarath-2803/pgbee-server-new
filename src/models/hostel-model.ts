import { DataTypes, Model, Optional } from "sequelize";
import { v4 as uuid } from "uuid";
import { sequelize } from "@/utils";

import { User } from "@/models";

interface HostelAttributes {
  id?: string;
  hostelName?: string;
  phone?: string;
  address?: string;
  curfew?: boolean;
  distance?: number;
  location?: string;
  rent?: number;
  gender?: string;
  files?: string;
  bedrooms?: number;
  bathrooms?: number;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Hostel extends Model<HostelAttributes> implements HostelAttributes {
  declare id: string;
  declare hostelName?: string;
  declare phone?: string;
  declare address?: string;
  declare curfew?: boolean;
  declare location?: string;
  declare distance?: number;
  declare rent?: number;
  declare gender?: string;
  declare bedrooms?: number;
  declare bathrooms?: number;
  declare files?: string;
  declare userId?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  public static async findById(id: string): Promise<Hostel | null> {
    return await this.findOne({ where: { id } });
  }

  public setUser!: (user: string) => Promise<void>;
  public getUser!: () => Promise<User>;

  public static async createHostel(
    HostelData: Optional<HostelAttributes, "id" | "files">,
  ): Promise<Hostel> {
    return await this.create(HostelData);
  }
}

Hostel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
      primaryKey: true,
    },
    hostelName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    distance: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    curfew: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rent: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    files: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "Hostel",
    tableName: "hostels",
    timestamps: true,
  },
);

export default Hostel;
