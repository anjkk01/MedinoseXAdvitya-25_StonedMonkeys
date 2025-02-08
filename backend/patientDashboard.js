const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const patientDashboard = async (req, res) => {
    try {
        const { patient_id } = req.body;
        if (!patient_id) {
            return res.status(400).json({ message: "Patient ID is required" });
        }

        const appointments = await prisma.doctor_appointment.findMany({
            where: { patient_id},
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

module.exports = { patientDashboard };
