import { DataTypes, Model, Optional } from "sequelize";
import { v4 as uuid } from "uuid";
import { sequelize } from "@/utils";

interface ReviewAttributes {
  id?: string;
  date?: Date;
  rating?: number;
  text?: string;
  image?: string;
  userId?: string;
  hostelId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Review extends Model<ReviewAttributes> implements ReviewAttributes {
  public id!: string;
  public date?: Date;
  public text?: string;
  public image?: string;
  public rating?: number;
  public userId?: string;
  public hostelId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public static async findById(id: string): Promise<Review | null> {
    return await this.findOne({ where: { id } });
  }

  // public setUser!: (user: string) => Promise<void>;
  // public getUser!: () => Promise<User>;

  public static async createReview(
    reviewData: Optional<ReviewAttributes, "id">,
  ): Promise<Review> {
    return await this.create(reviewData);
  }
}

Review.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    hostelId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "hostels",
        key: "id",
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "reviews",
    timestamps: true,
  },
);

export default Review;
