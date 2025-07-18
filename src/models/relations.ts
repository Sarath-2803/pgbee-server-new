import { Student, Owner, Role, User } from "@/models";

Role.hasOne(User, {
  foreignKey: {
    name: "roleId",
    allowNull: false,
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
