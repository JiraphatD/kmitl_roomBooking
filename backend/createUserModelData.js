const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require('bcrypt');
require('dotenv').config();
const adminUser = process.env.ADMIN_USER;
const adminPassword = process.env.ADMIN_PASSWORD;
async function createSuperUser(username, password) {
    const hashedPassword = await hashPassword(password);

    const superuser = await prisma.superUser.create({
        data: {
            username,
            password: hashedPassword,
        },
    });

    return superuser;
}

async function findSuperUserByUsername(username) {
    const user = await prisma.user.findUnique({
        where: {
            username,
        },
    });

    return user;
}


async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

createSuperUser(adminUser, adminPassword);
