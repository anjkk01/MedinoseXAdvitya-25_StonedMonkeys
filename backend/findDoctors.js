const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findAvailableDoctors = async (req, res) => {
    try {
        const { date, specialities } = req.body; // Example: { date: "2025-02-10", specialities: ["Cardiologist", "Dermatologist"] }

        if (!date || !specialities || specialities.length === 0) {
            return res.status(400).json({ message: "Date and specialities are required." });
        }

        const availableDoctors = await prisma.doctor_table.findMany({
            where: {
                speciality_table: {
                    some: {
                        speciality_name: {
                            in: specialities, // Doctors must have at least one of the specialities
                        },
                    },
                },
                doctor_availability: {
                    some: {
                        available_date: new Date(date),
                    },
                },
            },
            include: {
                doctor_availability: {
                    where: {
                        available_date: new Date(date),
                    },
                },
                speciality_table: true, // Include doctor specialities
            },
        });

        // Filter doctors who have ALL required specialities
        const filteredDoctors = availableDoctors.filter(doctor => {
            const doctorSpecialities = doctor.speciality_table.map(s => s.speciality_name);
            return specialities.every(speciality => doctorSpecialities.includes(speciality));
        });

        return res.status(200).json({ doctors: filteredDoctors });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { findAvailableDoctors };
