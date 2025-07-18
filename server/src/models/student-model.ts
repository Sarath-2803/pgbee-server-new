import { v4 as uuid } from 'uuid';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@/utils';

interface StudentAttributes {
  id?: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface StudentCreationAttributes extends Optional<StudentAttributes, 'id'> {
  verifyStudent(id: string): Promise<Student>;
}

class Student
  extends Model<StudentAttributes, StudentCreationAttributes>
  implements StudentAttributes
{
  public id!: string;
  public email!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static async findByEmail(email: string): Promise<Student | null> {
    return await this.findOne({ where: { email } });
  }

  public static async createStudent(
    userData: StudentCreationAttributes
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Student',
    tableName: 'students',
    timestamps: true,
  }
);

export default Student;
