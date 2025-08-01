import { DataTypes, Model, Optional } from "sequelize";
import { v4 as uuid } from "uuid";
import { sequelize } from "@/utils";

import { User } from "@/models";

interface FileAttributes {
  id?: string;
  Location?: string;
  key?: string;
  Key?: string;
  ETag?: string;
  hostelId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class File extends Model<FileAttributes> implements FileAttributes {
  declare id: string;
  declare Location?: string;
  declare key?: string;
  declare Key?: string;
  declare ETag?: string;
  hostelId?: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  public static async findById(id: string): Promise<File | null> {
    return await this.findOne({ where: { id } });
  }

  public setUser!: (user: string) => Promise<void>;
  public getUser!: () => Promise<User>;

  public static async createFile(
    FileData: Optional<FileAttributes, "id">,
  ): Promise<File> {
    return await this.create(FileData);
  }
}

File.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
      primaryKey: true,
    },
    Location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ETag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "File",
    tableName: "files",
    timestamps: true,
  },
);

export default File;
