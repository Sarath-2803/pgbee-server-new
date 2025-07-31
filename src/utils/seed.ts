import { sequelize } from "@/utils";
import { User, Role, Owner, Hostel, Ammenities, Rent } from "@/models"; // Removed File model
import fs from "fs";
import path from "path";
import csv from "csv-parser";

// --- Interface for the CSV Row Data ---
interface HostelCsvRow {
  Timestamp: string;
  "Hostel name ": string;
  "Type of PG": string;
  "owner's name  ": string;
  "owner's phone number ": string;
  "Owner's email address ": string;
  "Address of the PG": string;
  "Photo of the PG": string;
  "Amenities ": string;
  "Number  of sharing  ": string;
  "Price for single room ": string;
  "Price for single  room + attached bathroom ": string;
  "Price for 2 sharing ": string;
  "Price for 2 sharing + attached bathroom ": string;
  "Price of 3 sharing ": string;
  "Price for 3 sharing + attached bathroom ": string;
  "Price of 3+ sharing ": string;
  "Price for 3+ sharing and attached bathroom ": string;
  "Curfew ": string;
  "Location ": string;
}

// --- Helper Functions ---
const sanitizePhoneNumber = (phone: string): string => {
  if (!phone) return "";
  return phone.replace(/[^0-9]/g, "");
};

const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// --- Main Seeding Function ---
const seedDatabase = async () => {
  try {
    // Synchronize all models
    console.log("Connecting to database and syncing models...");
    await sequelize.sync({ force: true });
    console.log("Database synced!");

    // Seed Roles
    console.log("Seeding Roles...");
    const ownerRole = await Role.create({ name: "owner" });
    await Role.create({ name: "student" });
    console.log("Roles seeded successfully.");

    // Read and Process CSV Data
    const results: HostelCsvRow[] = [];
    const csvFilePath = path.join(
      process.cwd(),
      "PG FORM (Responses) - Form Responses 1.csv",
    );
    console.log(`Reading CSV file from: ${csvFilePath}`);

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (data: HostelCsvRow) => results.push(data))
      .on("end", async () => {
        console.log(
          `CSV file successfully processed. Found ${results.length} records.`,
        );
        console.log("Starting to seed data...");

        // Seeding Counters
        let hostelsAdded = 0;
        let ownersAdded = 0;
        let rowsWithDefaults = 0;
        let rowsFailed = 0;
        let invalidEmailCounter = 0;
        const defaultedRowsInfo: {
          hostelName: string;
          defaultedFields: string[];
        }[] = [];

        for (const row of results) {
          const hostelName = (row["Hostel name "] || "").trim();
          if (!hostelName) {
            rowsFailed++;
            console.warn("Skipping row with empty hostel name.");
            continue;
          }
          const defaultedFields: string[] = [];

          try {
            // Find or Create User and Owner
            let user: User;
            let ownerEmail = (row["Owner's email address "] || "").trim();

            if (!isValidEmail(ownerEmail)) {
              invalidEmailCounter++;
              const originalEmail = ownerEmail;
              ownerEmail = `placeholder-${invalidEmailCounter}@example.com`;
              console.warn(
                `Invalid email "${originalEmail}" for hostel "${hostelName}". Using default: "${ownerEmail}"`,
              );
              defaultedFields.push(`email (was: "${originalEmail}")`);
            }

            let sanitizedPhone = sanitizePhoneNumber(
              row["owner's phone number "],
            );
            const is10Digit = sanitizedPhone.length === 10;
            const is12DigitWith91 =
              sanitizedPhone.length === 12 && sanitizedPhone.startsWith("91");

            if (!is10Digit && !is12DigitWith91) {
              const originalPhone = sanitizedPhone;
              sanitizedPhone = "0000000000";
              console.warn(
                `Invalid phone number "${originalPhone}" for hostel "${hostelName}". Using default: "${sanitizedPhone}"`,
              );
              if (!defaultedFields.some((f) => f.startsWith("phone"))) {
                defaultedFields.push(`phone (was: "${originalPhone}")`);
              }
            }

            if (
              defaultedFields.length > 0 &&
              !defaultedRowsInfo.some((info) => info.hostelName === hostelName)
            ) {
              rowsWithDefaults++;
              defaultedRowsInfo.push({ hostelName, defaultedFields });
            }

            const existingUser = await User.findOne({
              where: { email: ownerEmail },
            });

            if (existingUser) {
              user = existingUser;
            } else {
              user = await User.create({
                name: row["owner's name  "] || "Unnamed Owner",
                email: ownerEmail,
                phoneNo: sanitizedPhone,
                password: "password123",
                roleId: ownerRole.dataValues.id,
              });

              await Owner.create({
                name: row["owner's name  "] || "Unnamed Owner",
                phone: sanitizedPhone,
                userId: user.dataValues.id,
              });
              ownersAdded++;
            }

            // Create Hostel
            const rawGender = (row["Type of PG"] || "").toLowerCase();
            const gender = rawGender.includes("men") ? "men" : "women";

            const hostel = await Hostel.create({
              hostelName: hostelName,
              phone: sanitizedPhone,
              address: row["Address of the PG"],
              gender: gender,
              curfew: !!row["Curfew "],
              location: row["Location "] || null,
              files:
                "https://via.placeholder.com/400x300.png?text=Hostel+Image", // Using placeholder image
              rent: 0,
              userId: user.dataValues.id,
            });
            hostelsAdded++;

            // Create Amenities
            const amenitiesString = row["Amenities "] || "";
            const amenitiesList = amenitiesString
              .toLowerCase()
              .split(",")
              .map((a: string) => a.trim());
            await Ammenities.create({
              hostelId: hostel.dataValues.id,
              wifi: amenitiesList.includes("wifi"),
              ac:
                amenitiesList.includes("ac") ||
                !amenitiesList.includes("non ac rooms"),
              kitchen: amenitiesList.includes("kitchen"),
              parking: amenitiesList.includes("parking"),
              laundry: amenitiesList.includes("laundry service"),
              tv: amenitiesList.includes("tv"),
              firstAid: amenitiesList.includes("first aid"),
              workspace: amenitiesList.includes("workspace"),
              security: amenitiesList.includes("security"),
              currentBill: amenitiesList.includes("power back up"),
              waterBill: true,
              food: amenitiesList.includes("food"),
              furniture: amenitiesList.includes("furniture"),
              bed: true,
              water: amenitiesList.includes("water filter"),
              studentsCount: 0,
            });

            // Create Rent Entries
            const rentMappings = {
              "1-sharing": row["Price for single room "],
              "1-sharing-attached":
                row["Price for single  room + attached bathroom "],
              "2-sharing": row["Price for 2 sharing "],
              "2-sharing-attached":
                row["Price for 2 sharing + attached bathroom "],
              "3-sharing": row["Price of 3 sharing "],
              "3-sharing-attached":
                row["Price for 3 sharing + attached bathroom "],
              "3+-sharing": row["Price of 3+ sharing "],
              "3+-sharing-attached":
                row["Price for 3+ sharing and attached bathroom "],
            };
            for (const [sharingType, rentValue] of Object.entries(
              rentMappings,
            )) {
              if (rentValue) {
                const rentAmount = parseInt(
                  rentValue.replace(/[^0-9]/g, ""),
                  10,
                );
                if (!isNaN(rentAmount) && rentAmount <= 1000000) {
                  await Rent.create({
                    hostelId: hostel.dataValues.id,
                    sharingType: sharingType,
                    rent: rentAmount,
                  });
                }
              }
            }
            console.log(
              `Seeded hostel: ${hostel.hostelName} for owner ${user.dataValues.name}`,
            );
          } catch (error) {
            console.error(
              `Error processing a row for hostel "${hostelName}":`,
              error,
            );
            rowsFailed++;
          }
        }
        console.log("\n--- Seeding Summary ---");
        console.log(`Total rows in CSV: ${results.length}`);
        console.log(`Hostels successfully added: ${hostelsAdded}`);
        console.log(`New owners added: ${ownersAdded}`);
        console.log(`Rows processed with default values: ${rowsWithDefaults}`);
        console.log(`Rows that failed to process: ${rowsFailed}`);

        if (defaultedRowsInfo.length > 0) {
          console.log("\n--- Details of Rows with Default Values ---");
          defaultedRowsInfo.forEach((info) => {
            console.log(
              `Hostel: "${info.hostelName}" had default values for: ${info.defaultedFields.join(", ")}`,
            );
          });
        }

        console.log("\n--- Seeding Completed Successfully! ---\n");

        await sequelize.close();
      });
  } catch (error) {
    console.error("Failed to seed database:", error);
    await sequelize.close();
  }
};

// --- Execute the Seeder ---
seedDatabase();
