import { v4 as uuid } from "uuid";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/utils";

interface StudentAttributes {
  id?: string;
  userName?: string;
  name?: string;
  dob?: string;
  address?: string;
  phoneNo?: string;
  gender?: string;
  userId?: string;
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
  declare dob?: string;
  declare name?: string;
  declare address?: string;
  declare phoneNo?: string;
  declare gender?: string;
  declare userId?: string;
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female"),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNo: {
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
