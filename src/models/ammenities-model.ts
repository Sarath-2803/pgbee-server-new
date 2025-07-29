import { v4 as uuid } from "uuid";
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/utils";

interface AmmenitiesAttributes {
  id?: string;
  wifi?: boolean;
  ac?: boolean;
  kitchen?: boolean;
  parking?: boolean;
  laundry?: boolean;
  tv?: boolean;
  firstAid?: boolean;
  workspace?: boolean;
  security?: boolean;
  currentBill?: boolean;
  waterBill?: boolean;
  food?: boolean;
  furniture?: boolean;
  bed?: boolean;
  water?: boolean;
  studentsCount?: number;
  hostelId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// interface OwnerCreationAttributes
//     // extends Optional<OwnerAttributes, "id" | "files"> {
//     extends Optional<AmmenitiesAttributes, "id"> {
//     verifyPassword(
//         this: AmmenitiesCreationAttributes,
//         password: string,
//     ): Promise<boolean>;
// }

class Ammenities
  extends Model<AmmenitiesAttributes>
  implements AmmenitiesAttributes
{
  public id!: string;
  public wifi?: boolean;
  public ac?: boolean;
  public kitchen?: boolean;
  public parking?: boolean;
  public laundry?: boolean;
  public tv?: boolean;
  public firstAid?: boolean;
  public workspace?: boolean;
  public security?: boolean;
  public currentBill?: boolean;
  public waterBill?: boolean;
  public food?: boolean;
  public furniture?: boolean;
  public bed?: boolean;
  public water?: boolean;
  public studentsCount?: number;
  public hostelId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public static async findById(id: string): Promise<Ammenities | null> {
    return await this.findOne({ where: { id } });
  }
  public static async createAmmenities(
    // ownerData: Optional<OwnerAttributes, "id" | "files">,
    ammenitiesData: Optional<AmmenitiesAttributes, "id">,
  ): Promise<Ammenities> {
    return await this.create(ammenitiesData);
  }
}

Ammenities.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
      primaryKey: true,
    },
    wifi: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    ac: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    kitchen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    parking: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    laundry: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    tv: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    firstAid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    workspace: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    security: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    currentBill: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    waterBill: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    food: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    furniture: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    bed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    water: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    studentsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    hostelId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Ammenities",
    tableName: "ammenities",
    timestamps: true,
  },
);

export default Ammenities;
