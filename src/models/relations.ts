import { Student, Owner, User, Role } from "@/models";

// Role-User relationship (bidirectional)
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
