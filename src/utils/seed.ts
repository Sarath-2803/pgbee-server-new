import { sequelize } from "@/utils"; // Assuming your sequelize instance is exported from here
import { User, Role, Owner, Hostel, Ammenities, Rent } from "@/models"; // Import all necessary models
import fs from "fs";
import path from "path";
import csv from "csv-parser";

// --- Interface for the CSV Row Data ---
// Provides type safety for the data parsed from the CSV file.
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
}

// --- Helper function to clean phone numbers ---
const sanitizePhoneNumber = (phone: string): string => {
  if (!phone) return "";
  // Removes all non-digit characters from the string
  return phone.replace(/[^0-9]/g, "");
};

// --- Helper function to validate email format ---
const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  // A simple regex to check for a valid email structure.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// --- Main Seeding Function ---
const seedDatabase = async () => {
  try {
    // Synchronize all models, dropping existing tables
    // Use { force: true } only in development/seeding environments
    console.log("Connecting to database and syncing models...");
    await sequelize.sync({ force: true });
    console.log("Database synced!");

    // --- 1. Seed Roles ---
    // Create default roles that the system needs to function.
    console.log("Seeding Roles...");
    const ownerRole = await Role.create({ name: "owner" });
    await Role.create({ name: "student" });
    console.log("Roles seeded successfully.");

    // --- 2. Read and Process CSV Data ---
    const results: HostelCsvRow[] = [];
    // Use process.cwd() to get the root directory of the project
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
        console.log("Starting to seed data into tables...");

        // --- Seeding Counters ---
        let hostelsAdded = 0;
        let ownersAdded = 0;
        let rowsWithDefaults = 0;
        let rowsFailed = 0;
        let invalidEmailCounter = 0;
        const defaultedRowsInfo: {
          hostelName: string;
          defaultedFields: string[];
        }[] = [];

        // Process each row from the CSV
        for (const row of results) {
          const hostelName =
            row["Hostel name "] || `Unnamed Hostel ${hostelsAdded + 1}`;
          const defaultedFields: string[] = [];

          try {
            // --- 3. Find or Create User and Owner ---
            let user: User;
            let ownerEmail = (row["Owner's email address "] || "").trim();

            // If email is invalid, create a placeholder and flag it
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

            // Validate phone number length: must be 10 digits, or 12 digits starting with 91
            const is10Digit = sanitizedPhone.length === 10;
            const is12DigitWith91 =
              sanitizedPhone.length === 12 && sanitizedPhone.startsWith("91");

            if (!is10Digit && !is12DigitWith91) {
              const originalPhone = sanitizedPhone;
              sanitizedPhone = "0000000000";
              console.warn(
                `Invalid phone number "${originalPhone}" for hostel "${hostelName}". Must be 10 digits or 12 digits starting with 91. Using default: "${sanitizedPhone}"`,
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

            // Find if user already exists
            const existingUser = await User.findOne({
              where: { email: ownerEmail },
            });

            if (existingUser) {
              user = existingUser;
            } else {
              // If user doesn't exist, create a new user and owner
              user = await User.create({
                name: row["owner's name  "] || "Unnamed Owner",
                email: ownerEmail,
                phoneNo: sanitizedPhone,
                password: "password123", // Set a default password
                roleId: ownerRole.dataValues.id,
              });

              await Owner.create({
                name: row["owner's name  "] || "Unnamed Owner",
                phone: sanitizedPhone,
                userId: user.dataValues.id,
              });
              ownersAdded++;
            }

            // --- 4. Create Hostel ---
            const rawGender = (row["Type of PG"] || "").toLowerCase();
            const gender = rawGender.includes("men") ? "men" : "women";

            const hostel = await Hostel.create({
              hostelName: hostelName,
              phone: sanitizedPhone,
              address: row["Address of the PG"],
              gender: gender,
              curfew: !!row["Curfew "], // Sets to true if any value exists, false if empty
              files: row["Photo of the PG"],
              location: "Sreekaryam", // Default location, can be extracted if available in CSV
              rent: 0, // This is handled by the Rent table, but the model requires it.
              userId: user.dataValues.id,
            });
            hostelsAdded++;

            // --- 5. Create Amenities ---
            // Parse the comma-separated amenities string and map to boolean fields.
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
              waterBill: true, // Assuming always available
              food: amenitiesList.includes("food"),
              furniture: amenitiesList.includes("furniture"),
              bed: true, // Assuming always available
              water: amenitiesList.includes("water filter"),
              studentsCount: 0,
            });

            // --- 6. Create Rent Entries ---
            // Create a separate entry for each sharing type that has a price.
            const rentMappings: { [key: string]: string } = {
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
                // Parse rent to get only the numeric value
                const rentAmount = parseInt(
                  rentValue.replace(/[^0-9]/g, ""),
                  10,
                );
                if (!isNaN(rentAmount)) {
                  // Add a check to prevent out-of-range errors for rent
                  if (rentAmount > 1000000) {
                    console.warn(
                      `Skipping rent entry for hostel "${hostel.hostelName}" due to out-of-range value: ${rentAmount}`,
                    );
                    continue;
                  }
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
