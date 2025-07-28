import { Student, Owner, User, Role, Hostel } from "@/models";

Role.hasOne(User, {
  foreignKey: {
    name: "roleId",
    allowNull: true,
  },
  foreignKeyConstraint: true,
});

User.belongsTo(Role, {
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
