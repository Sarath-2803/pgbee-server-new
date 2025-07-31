import { DataTypes, Model, Optional } from "sequelize";
import { v4 as uuid } from "uuid";
import { sequelize } from "@/utils";

interface ReviewAttributes {
  id?: string;
  name?: string;
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
  declare id: string;
  declare name?: string;
  declare date?: Date;
  declare text?: string;
  declare image?: string;
  declare rating?: number;
  declare userId?: string;
  declare hostelId?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
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
    name: {
      type: DataTypes.STRING,
      allowNull: true,
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
