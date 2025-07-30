import { v4 as uuid } from "uuid";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/utils";

interface StudentAttributes {
  id?: string;
  userName?: string;
  dob?: Date;
  country?: string;
  permanentAddress?: string;
  presentAddress?: string;
  city?: string;
  postalCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// interface StudentCreationAttributes extends Optional<StudentAttributes, "id"> {
//   verifyStudent(id: string): Promise<Student>;
// }

class Student
  // extends Model<StudentAttributes, StudentCreationAttributes>
  extends Model<StudentAttributes>
  implements StudentAttributes
{
  declare id: string;
  declare userName?: string;
  declare dob?: Date;
  declare country?: string;
  declare permanentAddress?: string;
  declare presentAddress?: string;
  declare city?: string;
  declare postalCode?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public static async findById(id: string): Promise<Student | null> {
    return await this.findOne({ where: { id } });
  }

  public static async createStudent(
    // userData: StudentCreationAttributes,
    userData: StudentAttributes,
  ): Promise<Student> {
    return await this.create(userData);
  }
}

Student.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
      allowNull: false,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permanentAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    presentAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Student",
    tableName: "students",
    timestamps: true,
  },
);

export default Student;
