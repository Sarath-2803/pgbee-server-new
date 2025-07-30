import {
  Student,
  Owner,
  User,
  Role,
  Hostel,
  Review,
  Ammenities,
  Enquiry,
} from "@/models";

Role.hasOne(User, {
  foreignKey: {
    name: "roleId",
    allowNull: true,
  },
  foreignKeyConstraint: true,
});

User.hasOne(Owner, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  foreignKeyConstraint: true,
});

User.hasOne(Student, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  foreignKeyConstraint: true,
});

User.hasMany(Hostel, {
  foreignKey: {
    name: "userId",
    allowNull: true,
  },
  foreignKeyConstraint: true,
});

Hostel.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: true,
  },
});

User.hasMany(Review, {
  foreignKey: "userId",
});

Review.belongsTo(User, {
  foreignKey: "userId",
});

Hostel.hasMany(Review, {
  foreignKey: "hostelId",
});

Review.belongsTo(Hostel, {
  foreignKey: "hostelId",
});

Hostel.hasOne(Ammenities, {
  foreignKey: "hostelId",
});

Ammenities.belongsTo(Hostel, {
  foreignKey: "hostelId",
});

Student.belongsToMany(Hostel, {
  through: Enquiry,
  foreignKey: "studentId",
});

Hostel.belongsToMany(Student, {
  through: Enquiry,
  foreignKey: "hostelId",
});
