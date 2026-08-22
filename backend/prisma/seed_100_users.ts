import { PrismaClient, Role, TripStatus, ExpenseCategory } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('========================================================================');
  console.log('  OPTIMIZED PARALLEL SEEDING: 100 REAL USERS & ADMIN ACCOUNTS  ');
  console.log('========================================================================\n');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Seed 4 Explicit Admin Accounts
  const adminsData = [
    { name: 'System Admin', email: 'admin@globetrotter.app', bio: 'GlobeTrotter Lead Explorer & System Admin' },
    { name: 'Operations Admin', email: 'admin1@globetrotter.app', bio: 'Lead Operations & Platform Integrity Admin' },
    { name: 'Analytics Admin', email: 'admin2@globetrotter.app', bio: 'Growth Analytics & User Success Manager' },
    { name: 'Community Admin', email: 'admin3@globetrotter.app', bio: 'Community Quality & Itinerary Curation Lead' },
  ];

  for (const adm of adminsData) {
    await prisma.user.upsert({
      where: { email: adm.email },
      update: { passwordHash, role: Role.ADMIN },
      create: {
        name: adm.name,
        email: adm.email,
        passwordHash,
        role: Role.ADMIN,
        bio: adm.bio,
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
        preference: {
          create: {
            defaultCurrency: 'USD',
            preferredLanguage: 'en',
            travelStyle: 'Luxury & Adventure',
          },
        },
      },
    });
  }
  console.log('✅ Seeded 4 Admin Accounts (admin@, admin1@, admin2@, admin3@globetrotter.app)');

  // 2. Fetch existing destinations
  const destinations = await prisma.destination.findMany();
  const destList = destinations.length > 0 ? destinations : [
    { name: 'Goa', country: 'India', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80' },
    { name: 'Jaipur', country: 'India', imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80' },
    { name: 'Paris', country: 'France', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
    { name: 'Tokyo', country: 'Japan', imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80' },
    { name: 'Bali', country: 'Indonesia', imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
  ];

  // 100 Realistic First & Last Name combinations
  const firstNames = [
    'Aarav', 'Sophia', 'Liam', 'Priya', 'Alex', 'Ananya', 'Rohan', 'Emily', 'Kabir', 'Ava',
    'Dev', 'Olivia', 'Ethan', 'Meera', 'Mason', 'Zara', 'Lucas', 'Ishaan', 'Isabella', 'Vivaan',
    'Mia', 'Noah', 'Diya', 'Jackson', 'Kavya', 'Aiden', 'Sanya', 'Elijah', 'Tara', 'Oliver',
    'Riya', 'Benjamin', 'Nisha', 'James', 'Tanvi', 'Henry', 'Aditi', 'Alexander', 'Simran', 'Sebastian',
    'Pooja', 'Jack', 'Ayesha', 'Daniel', 'Krutika', 'Matthew', 'Sneha', 'Samuel', 'Karan', 'David',
    'Jahnavi', 'Joseph', 'Swati', 'Carter', 'Shruti', 'Owen', 'Shweta', 'Wyatt', 'Varun', 'John',
    'Alok', 'Jack', 'Deepak', 'Luke', 'Gautam', 'Jayden', 'Manish', 'Dylan', 'Pranav', 'Grayson',
    'Rahul', 'Levi', 'Siddharth', 'Isaac', 'Vikram', 'Gabriel', 'Yash', 'Julian', 'Kunal', 'Mateo',
    'Abhishek', 'Anthony', 'Nikhil', 'Jaxon', 'Amit', 'Lincoln', 'Mayank', 'Joshua', 'Sameer', 'Christopher',
    'Nitin', 'Andrew', 'Ashish', 'Theodore', 'Tarun', 'Caleb', 'Gaurav', 'Ryan', 'Harsh', 'Asher'
  ];

  const lastNames = [
    'Sharma', 'Smith', 'Patel', 'Johnson', 'Gupta', 'Williams', 'Verma', 'Brown', 'Mehta', 'Jones',
    'Roy', 'Garcia', 'Deshmukh', 'Miller', 'Joshi', 'Davis', 'Nair', 'Rodriguez', 'Kumar', 'Martinez',
    'Singh', 'Hernandez', 'Chopra', 'Lopez', 'Reddy', 'Gonzalez', 'Bhat', 'Wilson', 'Iyer', 'Anderson',
    'Saxena', 'Thomas', 'Kulkarni', 'Taylor', 'Kapoor', 'Moore', 'Banerjee', 'Jackson', 'Aggarwal', 'Martin',
    'Rao', 'Lee', 'Thakur', 'Perez', 'Pandey', 'Thompson', 'Tripathi', 'White', 'Dutta', 'Harris',
    'Sen', 'Sanchez', 'Gowda', 'Clark', 'Menon', 'Ramirez', 'Shenoy', 'Lewis', 'Pillai', 'Robinson',
    'Hegde', 'Walker', 'Vaidya', 'Young', 'Chatterjee', 'Allen', 'Mahajan', 'King', 'Dubey', 'Wright',
    'Mishra', 'Scott', 'Bose', 'Torres', 'Ghosh', 'Nguyen', 'Chowdhury', 'Hill', 'Ranganathan', 'Flores',
    'Deshpande', 'Green', 'Bhattacharya', 'Adams', 'Subramanian', 'Nelson', 'Kashyap', 'Baker', 'Mukherjee', 'Hall',
    'Sengupta', 'Rivera', 'Srivastava', 'Campbell', 'Rastogi', 'Mitchell', 'Nambiar', 'Carter', 'Solanki', 'Roberts'
  ];

  const emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];

  const totalUsersToSeed = 100;
  console.log(`▶ Processing ${totalUsersToSeed} user records in parallel batches...`);

  // Helper function to seed single user + trips asynchronously
  async function seedSingleUser(index: number) {
    const fn = firstNames[index % firstNames.length];
    const ln = lastNames[index % lastNames.length];
    const domain = emailDomains[index % emailDomains.length];
    const name = `${fn} ${ln}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${index > 15 ? index : ''}@${domain}`;

    const daysAgoJoined = Math.floor(Math.random() * 30);
    const createdAt = new Date(Date.now() - daysAgoJoined * 24 * 60 * 60 * 1000);

    const user = await prisma.user.upsert({
      where: { email },
      update: { name, passwordHash },
      create: {
        name,
        email,
        passwordHash,
        role: Role.USER,
        createdAt,
        bio: `Travel enthusiast & explorer based in ${index % 2 === 0 ? 'India' : 'International'}.`,
        avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + (index * 500)}?auto=format&fit=crop&w=200&q=80`,
        preference: {
          create: {
            defaultCurrency: index % 3 === 0 ? 'INR' : 'USD',
            preferredLanguage: 'en',
            travelStyle: index % 2 === 0 ? 'Backpacker' : 'Luxury',
          },
        },
      },
    });

    const tripCount = (index % 6 === 0) ? 0 : ((index % 2) + 1);

    for (let t = 0; t < tripCount; t++) {
      const isCompleted = (t === 0 || index % 2 === 0);
      const status = isCompleted ? TripStatus.COMPLETED : (t === 1 ? TripStatus.UPCOMING : TripStatus.PLANNED);

      let startDate: Date;
      let endDate: Date;

      if (isCompleted) {
        const daysAgo = Math.floor(Math.random() * 45) + 5;
        startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        endDate = new Date(startDate.getTime() + (Math.floor(Math.random() * 4) + 2) * 24 * 60 * 60 * 1000);
      } else {
        const daysFuture = Math.floor(Math.random() * 30) + 5;
        startDate = new Date(Date.now() + daysFuture * 24 * 60 * 60 * 1000);
        endDate = new Date(startDate.getTime() + (Math.floor(Math.random() * 5) + 2) * 24 * 60 * 60 * 1000);
      }

      const dest = destList[(index + t * 3) % destList.length];
      const hasItinerary = (index + t) % 10 < 6; // 60% with itineraries, 40% without

      const trip = await prisma.trip.create({
        data: {
          userId: user.id,
          name: `${dest.name} ${isCompleted ? 'Escapes' : 'Vacation'} ${2025 + (t % 2)}`,
          description: `Explored ${dest.name}, ${dest.country} with sights and local dining.`,
          startDate,
          endDate,
          status,
          isPublic: (index + t) % 4 === 0,
          coverImageUrl: dest.imageUrl,
          stops: {
            create: [
              {
                destinationName: dest.name,
                city: dest.name,
                country: dest.country,
                arrivalDate: startDate,
                departureDate: endDate,
                orderIndex: 0,
              },
            ],
          },
          budget: {
            create: {
              totalBudget: Math.floor(Math.random() * 30000) + 12000,
            },
          },
          expenses: {
            create: [
              { category: ExpenseCategory.ACCOMMODATION, amount: Math.floor(Math.random() * 6000) + 3000, description: 'Resort Stay' },
              { category: ExpenseCategory.TRANSPORT, amount: Math.floor(Math.random() * 4000) + 1500, description: 'Travel Transfers' },
              { category: ExpenseCategory.MEALS, amount: Math.floor(Math.random() * 2500) + 1000, description: 'Dining & Cafes' },
            ],
          },
        },
      });

      if (hasItinerary) {
        await prisma.itinerarySection.create({
          data: {
            tripId: trip.id,
            title: `Day 1: Arrival & ${dest.name} City Tour`,
            startDate: startDate,
            endDate: startDate,
            orderIndex: 0,
            sectionBudget: 6000,
            items: {
              create: [
                {
                  title: `Hotel Check-in & Breakfast`,
                  date: startDate,
                  startTime: '09:00 AM',
                  cost: 1000,
                  orderIndex: 0,
                },
                {
                  title: `City Center Promenade Walk`,
                  date: startDate,
                  startTime: '02:00 PM',
                  cost: 400,
                  orderIndex: 1,
                },
              ],
            },
          },
        });
      }

      if (trip.isPublic && (index % 3 === 0)) {
        await prisma.communityPost.create({
          data: {
            userId: user.id,
            tripId: trip.id,
            title: `Unforgettable Journey to ${dest.name}`,
            content: `Complete travel plan and recommendations for visiting ${dest.name}. Feel free to adopt to your account!`,
          },
        });
      }
    }
  }

  // Execute parallel batching (chunks of 10)
  const batchSize = 10;
  for (let i = 0; i < totalUsersToSeed; i += batchSize) {
    const chunk = Array.from({ length: Math.min(batchSize, totalUsersToSeed - i) }, (_, k) => i + k);
    await Promise.all(chunk.map((idx) => seedSingleUser(idx)));
    console.log(`  ✓ Processed users ${i + 1} to ${Math.min(i + batchSize, totalUsersToSeed)}`);
  }

  console.log('\n========================================================================');
  console.log(`  SEEDING COMPLETE SUCCESS  `);
  console.log(`  • 100 Real Users Seeded`);
  console.log(`  • 4 Admin Accounts Active (admin@, admin1@, admin2@, admin3@globetrotter.app)`);
  console.log('========================================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
