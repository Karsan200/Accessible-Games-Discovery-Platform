// server/controllers/gameController.js
import { Publisher } from "../models/dbSetup.js";

export async function addPublisher(req, res) {
    try {
        const { name, description, email } = req.body;

        const newPublisher = new Publisher({
            name,
            description,
            email,
        });

        await newPublisher.save();
        res.status(201).json({ message: "Publisher added successfully", publisher: newPublisher });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}