const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const doctorDashboard = async (req, res) => {
    try {
        const { doctor_id } = req.body;
        if (!doctor_id) {
            return res.status(400).json({ message: "Doctor ID is required" });
        }

        const appointments = await prisma.doctor_appointment.findMany({
            where: { doctor_id },
            orderBy: [
                { appointment_date: "desc" },
                { time_from: "desc" }
            ],
        });
        
        return res.status(200).json({ appointments });
    } catch (error) {
        console.error("Error fetching doctor appointments:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { doctorDashboard };
