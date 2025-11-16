import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Game } from "./models/dbSetup.js";

async function run() {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to DB");

    // replace literal backslash-n (e.g. "\\n") with a real newline character
    const res = await Game.updateMany(
        { details: /\\n/ }, // match backslash + n
        [
            {
                $set: {
                    details: {
                        $replaceAll: { input: "$details", find: "\\n", replacement: "\n" }
                    }
                }
            }
        ]
    );

    console.log("Updated games:", res.modifiedCount ?? res.nModified ?? res);
    await mongoose.disconnect();
    console.log("Done");
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
