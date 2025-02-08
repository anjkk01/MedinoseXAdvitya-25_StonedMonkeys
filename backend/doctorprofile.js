const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const doctoprofile = async(req , res) =>{
    const doctor_id = req.doctor.id;
}