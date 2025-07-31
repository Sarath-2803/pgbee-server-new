import fs from "fs";
import csv from "csv-parser";
import axios from "axios";

const CSV_FILE_PATH = "owners.csv";
const SIGNUP_URL = "http://52.220.0.200/auth/signup";
const OWNER_URL = "http://52.220.0.200/owner/owners";
const DEFAULT_PASSWORD = "pgbeeowner";
const DEFAULT_ROLE = "owner";

interface Owner {
  name: string;
  email: string;
  phone: string;
}

const owners: Owner[] = [];

fs.createReadStream(CSV_FILE_PATH)
  .pipe(csv())
  .on("data", (row) => {
    const name = row["owners's name"];
    const email = row["owner's email address"];
    const phone = row["owner's phone number"];

    if (name && email && phone) {
      owners.push({ name, email, phone });
    }
  })
  .on("end", async () => {
    console.log(`Read ${owners.length} owners from CSV. Sending requests...\n`);

    for (const owner of owners) {
      try {
        // Step 1: Signup
        const signupResponse = await axios.post(SIGNUP_URL, {
          name: owner.name,
          email: owner.email,
          password: DEFAULT_PASSWORD,
          role: DEFAULT_ROLE,
        });

        const accessToken = signupResponse.data?.accessToken;
        if (!accessToken) {
          console.error(`❌ No accessToken received for ${owner.email}`);
          continue;
        }

        // Step 2: Send owner details
        const ownerResponse = await axios.post(
          OWNER_URL,
          {
            name: owner.name,
            phone: owner.phone,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        console.log(
          `✅ Created owner: ${owner.email} -> ${ownerResponse.status}`,
        );
      } catch (error: unknown) {
        if (error && typeof error === "object" && "response" in error) {
          const err = error as {
            response?: { status?: number };
            message?: string;
          };
          console.error(
            `❌ Error for ${owner.email}: ${err.response?.status || err.message}`,
          );
        } else {
          console.error(`❌ Error for ${owner.email}: ${String(error)}`);
        }
      }
    }
  });
