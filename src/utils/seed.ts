import {
  User,
  Role,
  Student,
  Owner,
  Hostel,
  Ammenities,
  Review,
} from "@/models";
import { faker } from "@faker-js/faker";
import { Logger } from "@/utils"; // Assuming you have a Logger utility

// A utility function to get a random item from an array
const getRandomItem = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const seedDatabase = async () => {
  try {
    // Synchronize all models. Using { force: true } will drop the tables if they already exist.
    // Be cautious with this in a production environment.
    await Role.sync();
    await User.sync();
    await Owner.sync();
    await Hostel.sync();
    await Review.sync();
    await Student.sync();
    await Ammenities.sync();
    Logger.info("Database synchronized successfully.");

    // --- 1. Seed Roles ---
    await Role.bulkCreate([
      { name: "student" },
      { name: "owner" },
      { name: "admin" },
    ]);
    const studentRole = await Role.findOne({ where: { name: "student" } });
    const ownerRole = await Role.findOne({ where: { name: "owner" } });
    Logger.info("Roles seeded successfully.");

    if (!studentRole || !ownerRole) {
      throw new Error("Essential roles could not be created.");
    }

    // --- 2. Seed Users ---
    const users = [];
    // Create 10 student users
    for (let i = 0; i < 10; i++) {
      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "password123", // Password will be hashed by the model's hook
        roleId: studentRole.dataValues.id,
      });
    }
    // Create 5 owner users
    for (let i = 0; i < 5; i++) {
      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "password123",
        roleId: ownerRole.dataValues.id,
      });
    }
    const createdUsers = await User.bulkCreate(users);
    const studentUsers = createdUsers.filter(
      (u) => u.dataValues.roleId === studentRole.dataValues.id,
    );
    const ownerUsers = createdUsers.filter(
      (u) => u.dataValues.roleId === ownerRole.dataValues.id,
    );
    Logger.info("Users seeded successfully.");

    // --- 3. Seed Students and Owners Profiles ---
    // Create student profiles
    const studentProfiles = studentUsers.map((user) => ({
      id: faker.string.uuid(),
      userName: user.dataValues.name,
      dob: faker.date.birthdate({ min: 18, max: 25, mode: "age" }),
      country: "India",
      permanentAddress: faker.location.streetAddress(true),
      presentAddress: faker.location.streetAddress(true),
      city: "Thiruvananthapuram",
      postalCode: faker.location.zipCode(),
      userId: user.dataValues.id, // Associate with user
    }));
    await Student.bulkCreate(studentProfiles);
    Logger.info("Student profiles seeded successfully.");

    // Create owner profiles
    const ownerProfiles = ownerUsers.map((user) => ({
      id: faker.string.uuid(),
      name: user.dataValues.name,
      phone: faker.phone.number(),
      userId: user.dataValues.id, // Associate with user
    }));
    await Owner.bulkCreate(ownerProfiles);
    Logger.info("Owner profiles seeded successfully.");

    // --- 4. Seed Hostels ---
    const hostels = [];
    for (const owner of ownerUsers) {
      // Each owner will have 2 hostels
      for (let i = 0; i < 2; i++) {
        hostels.push({
          hostelName: `${faker.company.name()} Hostels`,
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
          curfew: faker.datatype.boolean(),
          description: faker.lorem.paragraph(),
          distance: faker.number.float({ min: 0.5, max: 10 }),
          location: faker.location.city(),
          rent: faker.number.int({ min: 5000, max: 15000 }),
          gender: faker.helpers.arrayElement(["boys", "girls", "co-ed"]),
          bedrooms: faker.number.int({ min: 1, max: 5 }),
          bathrooms: faker.number.int({ min: 1, max: 3 }),
          userId: owner.dataValues.id, // Associate with an owner
        });
      }
    }
    const createdHostels = await Hostel.bulkCreate(hostels);
    Logger.info("Hostels seeded successfully.");

    // --- 5. Seed Ammenities ---
    const ammenities = createdHostels.map((hostel) => ({
      wifi: faker.datatype.boolean(),
      ac: faker.datatype.boolean(),
      kitchen: faker.datatype.boolean(),
      parking: faker.datatype.boolean(),
      laundry: faker.datatype.boolean(),
      tv: faker.datatype.boolean(),
      firstAid: true,
      workspace: faker.datatype.boolean(),
      security: true,
      currentBill: faker.datatype.boolean(),
      waterBill: faker.datatype.boolean(),
      food: faker.datatype.boolean(),
      furniture: true,
      bed: true,
      water: true,
      studentsCount: faker.number.int({ min: 10, max: 50 }),
      hostelId: hostel.dataValues.id, // Associate with a hostel
    }));
    await Ammenities.bulkCreate(ammenities);
    Logger.info("Ammenities seeded successfully.");

    // --- 6. Seed Reviews ---
    const reviews = [];
    for (let i = 0; i < 20; i++) {
      // Create 20 reviews
      reviews.push({
        rating: faker.number.int({ min: 1, max: 5 }),
        text: faker.lorem.sentence(),
        image: faker.datatype.boolean(0.25) ? faker.image.url() : null, // 25% chance of having an image
        date: faker.date.past(),
        userId: getRandomItem(studentUsers).dataValues.id, // Random student
        hostelId: getRandomItem(createdHostels).dataValues.id, // Random hostel
      });
    }
    await Review.bulkCreate(reviews as Review[]);
    Logger.info("Reviews seeded successfully.");

    Logger.info("✅ Database seeding completed!");
  } catch (error) {
    Logger.error("Error seeding database:", error as unknown as Error);
  } finally {
    Logger.info("Database connection closed.");
  }
};

// Execute the seeder
export default seedDatabase;
