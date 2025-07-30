import { DataTypes, Model, Optional } from "sequelize";
import { v4 as uuid } from "uuid";
import { sequelize } from "@/utils";

interface EnquiryAttributes {
  id?: string;
  hostelId?: string;
  studentId?: string;
  enquiry?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class Enquiry extends Model<EnquiryAttributes> implements EnquiryAttributes {
  public id!: string;
  public hostelId?: string;
  public studentId?: string;
  public enquiry?: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public static async findById(id: string): Promise<Enquiry | null> {
    return await this.findOne({ where: { id } });
  }

  public static async createEnquiry(
    EnquiryData: Optional<EnquiryAttributes, "id">,
  ): Promise<Enquiry> {
    return await this.create(EnquiryData);
  }
}

Enquiry.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
      primaryKey: true,
    },
    hostelId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    enquiry: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Enquiry",
    tableName: "enqiries",
    timestamps: true,
  },
);

export default Enquiry;
