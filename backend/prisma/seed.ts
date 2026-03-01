import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
    console.log('Clearing old data...');
    await prisma.appointment.deleteMany();
    await prisma.availability.deleteMany();
    await prisma.service.deleteMany();
    await prisma.user.deleteMany();

    console.log('Seeding new data...');
    const passwordHash = await bcrypt.hash('password123', 10);

    const user1 = await prisma.user.create({
        data: {
            name: 'Alice User',
            email: 'alice@example.com',
            passwordHash,
            role: 'USER' as any,
        },
    });

    const provider1 = await prisma.user.create({
        data: {
            name: 'Dr. Bob Provider',
            email: 'bob@example.com',
            passwordHash,
            role: 'SERVICE_PROVIDER' as any,
        },
    });

    const service1 = await prisma.service.create({
        data: {
            name: 'General Checkup',
            type: 'MEDICAL' as any,
            providerId: provider1.id,
            durationMinutes: 30,
        },
    });

    const service2 = await prisma.service.create({
        data: {
            name: 'Therapy Session',
            type: 'MEDICAL' as any,
            providerId: provider1.id,
            durationMinutes: 60,
        },
    });

    // Add availability for Bob on Monday, Wednesday, Friday
    const days = ['Monday', 'Wednesday', 'Friday'] as any[];
    for (const day of days) {
        await prisma.availability.create({
            data: {
                serviceId: service1.id,
                dayOfWeek: day,
                startTime: '09:00',
                endTime: '12:00',
            },
        });

        await prisma.availability.create({
            data: {
                serviceId: service2.id,
                dayOfWeek: day,
                startTime: '13:00',
                endTime: '17:00',
            },
        });
    }

    console.log('Seeding complete! 🚀');
    console.log('Login credentials:');
    console.log('User: alice@example.com / password123');
    console.log('Provider: bob@example.com / password123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
