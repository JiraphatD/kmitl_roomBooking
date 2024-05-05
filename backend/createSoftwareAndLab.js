
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); 

async function addSoftware() {
    await prisma.software.create({
        data: {
            software_name: 'Counter-Strike 2',
            laboratory: {
                connect: {
                    room_id: 'L308'
                }
            }
        }
    })
}


addSoftware();