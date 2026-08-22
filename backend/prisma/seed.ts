import { PrismaClient, Role, TripStatus, ExpenseCategory } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Neon PostgreSQL database...');

  // 1. Password Hash
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 2. Upsert Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@globetrotter.app' },
    update: { passwordHash },
    create: {
      name: 'System Admin',
      email: 'admin@globetrotter.app',
      passwordHash,
      role: Role.ADMIN,
      bio: 'GlobeTrotter Lead Explorer & Administrator',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      preference: {
        create: {
          defaultCurrency: 'USD',
          preferredLanguage: 'en',
          travelStyle: 'Luxury & Adventure',
        },
      },
    },
  });

  // 3. Upsert Demo User
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@globetrotter.app' },
    update: { passwordHash },
    create: {
      name: 'Demo Traveler',
      email: 'demo@globetrotter.app',
      passwordHash,
      role: Role.USER,
      bio: 'Passionate globetrotter exploring beaches, mountain trails, and street food across the world.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      preference: {
        create: {
          defaultCurrency: 'INR',
          preferredLanguage: 'en',
          travelStyle: 'Backpacker & Explorer',
        },
      },
    },
  });

  // 4. Seed Activity Categories
  const categories = [
    { name: 'Beaches & Islands', iconName: 'Palmtree', description: 'Tropical beaches, scuba diving, island hopping, and boat cruises' },
    { name: 'Cultural & Heritage', iconName: 'Landmark', description: 'Ancient forts, UNESCO monuments, museums, and royal palaces' },
    { name: 'Hill Stations & Treks', iconName: 'Mountain', description: 'Scenic mountain peaks, tea plantations, alpine lakes, and hiking trails' },
    { name: 'Food & Dining', iconName: 'Utensils', description: 'Street food walks, night markets, wine tasting, and culinary workshops' },
    { name: 'Adventures & Safaris', iconName: 'Zap', description: 'White water rafting, hot air ballooning, desert safaris, and wildlife tracking' },
    { name: 'Spiritual Trails', iconName: 'Flame', description: 'Ghat rituals, holy shrines, temple walks, and meditation retreats' },
  ];

  for (const cat of categories) {
    await prisma.activityCategory.upsert({
      where: { name: cat.name },
      update: cat,
      create: cat,
    });
  }

  const catMap = new Map<string, string>();
  const fetchedCats = await prisma.activityCategory.findMany();
  for (const c of fetchedCats) {
    catMap.set(c.name, c.id);
  }

  // 5. Seed 35+ Activities across India & International destinations
  const activitiesData = [
    // Beaches & Islands (6)
    {
      name: 'Scuba Diving & Coral Reef Tour',
      locationName: 'Goa, India',
      estimatedCost: 3500,
      durationMinutes: 240,
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
      description: 'Underwater scuba dive with certified PADI instructors at Malvan island coral reef with HD video session.',
      categoryName: 'Beaches & Islands',
    },
    {
      name: 'Nusa Penida Island Speedboat Day Cruise',
      locationName: 'Bali, Indonesia',
      estimatedCost: 4200,
      durationMinutes: 480,
      rating: 4.88,
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
      description: 'Full-day island cruise visiting Kelingking T-Rex beach, Angel’s Billabong, and Broken Beach with snorkeling.',
      categoryName: 'Beaches & Islands',
    },
    {
      name: 'Catamaran Sunset Cruise with Live DJ',
      locationName: 'Goa, India',
      estimatedCost: 2200,
      durationMinutes: 180,
      rating: 4.75,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      description: 'Scenic evening sailing along Mandovi river into the Arabian Sea with complimentary drinks and snacks.',
      categoryName: 'Beaches & Islands',
    },
    {
      name: 'Radhanagar Beach Sea Kayaking & Mangrove Tour',
      locationName: 'Havelock Island, Andaman',
      estimatedCost: 2800,
      durationMinutes: 150,
      rating: 4.82,
      imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=600&q=80',
      description: 'Guided sea kayaking excursion through calm bioluminescent mangroves and pristine coastline.',
      categoryName: 'Beaches & Islands',
    },
    {
      name: 'Phuket Phi Phi Islands Speedboat Excursion',
      locationName: 'Phuket, Thailand',
      estimatedCost: 5500,
      durationMinutes: 540,
      rating: 4.85,
      imageUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80',
      description: 'Island hopping to Maya Bay, Viking Cave, and Monkey Beach with buffet lunch and snorkeling gear.',
      categoryName: 'Beaches & Islands',
    },
    {
      name: 'Varkala Cliff Beach Parasailing Excursion',
      locationName: 'Varkala, India',
      estimatedCost: 2500,
      durationMinutes: 60,
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      description: 'High-flying parasailing above the dramatic Arabian sea cliffs of Varkala Beach with safety harness.',
      categoryName: 'Beaches & Islands',
    },

    // Cultural & Heritage (7)
    {
      name: 'Eiffel Tower Priority Access Sunset Tour',
      locationName: 'Paris, France',
      estimatedCost: 5800,
      durationMinutes: 150,
      rating: 4.85,
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
      description: 'Skip-the-line elevator ticket to 2nd floor summit with champagne toast as city lights illuminate.',
      categoryName: 'Cultural & Heritage',
    },
    {
      name: 'Amer Fort & City Palace Guided Heritage Walk',
      locationName: 'Jaipur, India',
      estimatedCost: 1500,
      durationMinutes: 240,
      rating: 4.91,
      imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80',
      description: 'Deep-dive historic walk covering Sheesh Mahal (Mirror Palace), Hawa Mahal, and royal courtyards with historian guide.',
      categoryName: 'Cultural & Heritage',
    },
    {
      name: 'Colosseum & Roman Forum VIP Guided Tour',
      locationName: 'Rome, Italy',
      estimatedCost: 6200,
      durationMinutes: 210,
      rating: 4.89,
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
      description: 'Exclusive arena floor entrance to the ancient Colosseum, Palatine Hill, and Roman Forum ruins.',
      categoryName: 'Cultural & Heritage',
    },
    {
      name: 'Sunrise Taj Mahal & Agra Fort Private Excursion',
      locationName: 'Agra, India',
      estimatedCost: 2900,
      durationMinutes: 300,
      rating: 4.95,
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80',
      description: 'Breathtaking sunrise guided tour of the marble Taj Mahal followed by Mughal history tour at Agra Fort.',
      categoryName: 'Cultural & Heritage',
    },
    {
      name: 'Old Delhi Shahjahanabad Heritage Heritage Walk',
      locationName: 'Delhi, India',
      estimatedCost: 1100,
      durationMinutes: 180,
      rating: 4.78,
      imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
      description: 'Explore Jama Masjid, spice market, and Haveli architecture via traditional cycle rickshaw.',
      categoryName: 'Cultural & Heritage',
    },
    {
      name: 'Kyoto Fushimi Inari & Golden Pavilion Temple Walk',
      locationName: 'Kyoto, Japan',
      estimatedCost: 3800,
      durationMinutes: 240,
      rating: 4.93,
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
      description: 'Stroll through thousands of vermilion Torii gates at Fushimi Inari and visit Kinkaku-ji Golden Temple.',
      categoryName: 'Cultural & Heritage',
    },
    {
      name: 'Tower of London & Crown Jewels Tour',
      locationName: 'London, UK',
      estimatedCost: 4500,
      durationMinutes: 180,
      rating: 4.81,
      imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
      description: 'Historic royal fortress tour guided by Yeoman Warders (Beefeaters) featuring the official Crown Jewels.',
      categoryName: 'Cultural & Heritage',
    },

    // Hill Stations & Treks (6)
    {
      name: 'Munnar Tea Factory & Plantation Walk',
      locationName: 'Munnar, India',
      estimatedCost: 600,
      durationMinutes: 120,
      rating: 4.82,
      imageUrl: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=600&q=80',
      description: 'Guided walk through rolling tea estates, cardamom gardens, and orthodox tea processing demonstration.',
      categoryName: 'Hill Stations & Treks',
    },
    {
      name: 'Triund Hill Day Trek & Himalayan View',
      locationName: 'Dharamshala, India',
      estimatedCost: 1400,
      durationMinutes: 360,
      rating: 4.87,
      imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
      description: 'Panoramic mountain day trek through oak forests up to Triund Ridge facing Dhauladhar snow peaks.',
      categoryName: 'Hill Stations & Treks',
    },
    {
      name: 'Solang Valley Snow Point Hike & Cable Car',
      locationName: 'Manali, India',
      estimatedCost: 1800,
      durationMinutes: 240,
      rating: 4.76,
      imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
      description: 'Ropeway ride to Mount Phatru followed by scenic snow trail walk with panoramic views of Pir Panjal range.',
      categoryName: 'Hill Stations & Treks',
    },
    {
      name: 'Pangong Tso High-Altitude Lake Excursion',
      locationName: 'Leh Ladakh, India',
      estimatedCost: 4800,
      durationMinutes: 600,
      rating: 4.96,
      imageUrl: 'https://images.unsplash.com/photo-1617854818583-09e7f077a156?auto=format&fit=crop&w=600&q=80',
      description: 'Cross Chang La Pass (17,590 ft) to reach the sapphire blue high-altitude Pangong Lake bordering Tibet.',
      categoryName: 'Hill Stations & Treks',
    },
    {
      name: 'Tiger Hill Sunrise & Batasia Loop Tour',
      locationName: 'Darjeeling, India',
      estimatedCost: 800,
      durationMinutes: 180,
      rating: 4.79,
      imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
      description: 'Early morning sunrise view over Mount Kanchenjunga followed by Toy Train ride through Batasia Loop.',
      categoryName: 'Hill Stations & Treks',
    },
    {
      name: 'Doddabetta Peak & Ooty Botanical Walk',
      locationName: 'Ooty, India',
      estimatedCost: 700,
      durationMinutes: 150,
      rating: 4.71,
      imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80',
      description: 'Highest viewpoint excursion in Nilgiris hills featuring telescope house observation and floral gardens.',
      categoryName: 'Hill Stations & Treks',
    },

    // Food & Dining (6)
    {
      name: 'Gion District Ramen & Izakaya Food Walk',
      locationName: 'Kyoto, Japan',
      estimatedCost: 4500,
      durationMinutes: 180,
      rating: 4.92,
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      description: 'Guided evening street food tour tasting Tonkotsu ramen, yakitori skewers, and matcha sweets in Gion geisha alleyways.',
      categoryName: 'Food & Dining',
    },
    {
      name: 'Chandni Chowk Street Food & Jalebi Crawl',
      locationName: 'Delhi, India',
      estimatedCost: 950,
      durationMinutes: 150,
      rating: 4.88,
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      description: 'Culinary trail sampling authentic Parathewali Gali paranthas, hot rabri jalebi, chole bhature, and lassi.',
      categoryName: 'Food & Dining',
    },
    {
      name: 'Khaosan Road Night Market & Thai Cooking Class',
      locationName: 'Bangkok, Thailand',
      estimatedCost: 2600,
      durationMinutes: 210,
      rating: 4.84,
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
      description: 'Market ingredient shopping followed by hands-on cooking class making Pad Thai, Tom Yum soup, and Mango Sticky Rice.',
      categoryName: 'Food & Dining',
    },
    {
      name: 'Mumbai Khau Galli Seafood & Pav Bhaji Walk',
      locationName: 'Mumbai, India',
      estimatedCost: 1200,
      durationMinutes: 180,
      rating: 4.81,
      imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80',
      description: 'Taste iconic butter Pav Bhaji, Kanda Bhajji, Malvani prawns, and Iranian Irani Chai at Mohammad Ali Road.',
      categoryName: 'Food & Dining',
    },
    {
      name: 'Amritsar Kulcha & Golden Temple Community Kitchen Tour',
      locationName: 'Amritsar, India',
      estimatedCost: 800,
      durationMinutes: 150,
      rating: 4.96,
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      description: 'Taste authentic stuffed Amritsari Kulcha with Chole, followed by behind-the-scenes visit to Golden Temple’s mega Langar kitchen.',
      categoryName: 'Food & Dining',
    },
    {
      name: 'Tuscan Vineyard Wine Tasting & Pasta Workshop',
      locationName: 'Florence, Italy',
      estimatedCost: 6800,
      durationMinutes: 300,
      rating: 4.91,
      imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
      description: 'Trip to Chianti countryside winery featuring 5 wine pairings, olive oil tasting, and fresh handmade tagliatelle cooking session.',
      categoryName: 'Food & Dining',
    },

    // Adventures & Safaris (6)
    {
      name: 'Thar Desert Sunset Camel Safari & Folk Dance',
      locationName: 'Jaisalmer, India',
      estimatedCost: 1800,
      durationMinutes: 300,
      rating: 4.88,
      imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
      description: 'Sunset camel trek across Sam Sand Dunes followed by Rajasthani dinner buffet and live Kalbelia folk performance.',
      categoryName: 'Adventures & Safaris',
    },
    {
      name: 'White Water Ganges River Rafting (16 km)',
      locationName: 'Rishikesh, India',
      estimatedCost: 1200,
      durationMinutes: 180,
      rating: 4.86,
      imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
      description: 'Thrill rafting from Shivpuri to Laxman Jhula negotiating Grade III/IV rapids with cliff jumping session.',
      categoryName: 'Adventures & Safaris',
    },
    {
      name: 'Dubai Red Dune Desert Safari & Quad Biking',
      locationName: 'Dubai, UAE',
      estimatedCost: 4900,
      durationMinutes: 360,
      rating: 4.87,
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
      description: '4x4 dune bashing, quad bike riding, sandboarding, and VIP BBQ dinner show under the desert stars.',
      categoryName: 'Adventures & Safaris',
    },
    {
      name: 'Cappadocia Sunrise Hot Air Balloon Flight',
      locationName: 'Cappadocia, Turkey',
      estimatedCost: 14500,
      durationMinutes: 180,
      rating: 4.98,
      imageUrl: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=600&q=80',
      description: 'Float over fairy chimneys, rock houses, and volcanic valleys at sunrise with champagne landing certificate.',
      categoryName: 'Adventures & Safaris',
    },
    {
      name: 'Ranthambore Tiger Safari Jeep Excursion',
      locationName: 'Ranthambore, India',
      estimatedCost: 3200,
      durationMinutes: 240,
      rating: 4.83,
      imageUrl: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=600&q=80',
      description: 'Open 4x4 Gypsy safari through Ranthambore National Park tracking Bengal tigers, leopards, and sloth bears.',
      categoryName: 'Adventures & Safaris',
    },
    {
      name: 'Dudhsagar Waterfalls Jeep Safari & Spice Plantation',
      locationName: 'Goa, India',
      estimatedCost: 2100,
      durationMinutes: 360,
      rating: 4.77,
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
      description: 'Off-road jungle jeep drive to India’s 4th tallest waterfall with natural pool swim and traditional Goan lunch.',
      categoryName: 'Adventures & Safaris',
    },

    // Spiritual Trails (5)
    {
      name: 'Varanasi Sunrise Boat Tour & Evening Ganga Aarti',
      locationName: 'Varanasi, India',
      estimatedCost: 900,
      durationMinutes: 240,
      rating: 4.95,
      imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
      description: 'Dawn wooden rowboat ride past Dashashwamedh ghats followed by reserved seat for evening brass-lamp Aarti ceremony.',
      categoryName: 'Spiritual Trails',
    },
    {
      name: 'Golden Temple Night Palki Sahib Ceremony',
      locationName: 'Amritsar, India',
      estimatedCost: 0,
      durationMinutes: 120,
      rating: 4.97,
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      description: 'Soulful evening procession carrying the holy Guru Granth Sahib under illuminated marble corridors.',
      categoryName: 'Spiritual Trails',
    },
    {
      name: 'Rishikesh Parmarth Niketan Yoga & Meditation',
      locationName: 'Rishikesh, India',
      estimatedCost: 500,
      durationMinutes: 150,
      rating: 4.84,
      imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80',
      description: 'Hatha yoga session on holy Ganges banks followed by Vedic chanting and guided chakra meditation.',
      categoryName: 'Spiritual Trails',
    },
    {
      name: 'Madurai Meenakshi Amman Temple Heritage Walk',
      locationName: 'Madurai, India',
      estimatedCost: 650,
      durationMinutes: 180,
      rating: 4.89,
      imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=600&q=80',
      description: 'Exploration of 1,000-pillar hall, colorful Gopuram towers, and temple complex history with expert guide.',
      categoryName: 'Spiritual Trails',
    },
    {
      name: 'Kyoto Arashiyama Bamboo Grove & Tenryu-ji Temple',
      locationName: 'Kyoto, Japan',
      estimatedCost: 2200,
      durationMinutes: 180,
      rating: 4.88,
      imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
      description: 'Tranquil walk through towering green bamboo stalks and UNESCO Zen garden at Tenryu-ji.',
      categoryName: 'Spiritual Trails',
    },
  ];

  let count = 0;
  for (const act of activitiesData) {
    const categoryId = catMap.get(act.categoryName);
    const existing = await prisma.activity.findFirst({ where: { name: act.name } });
    const payload = {
      name: act.name,
      locationName: act.locationName,
      estimatedCost: act.estimatedCost,
      durationMinutes: act.durationMinutes,
      rating: act.rating,
      imageUrl: act.imageUrl,
      description: act.description,
      categoryId: categoryId || null,
    };

    if (!existing) {
      await prisma.activity.create({ data: payload });
      count++;
    } else {
      await prisma.activity.update({ where: { id: existing.id }, data: payload });
      count++;
    }
  }

  console.log(`Successfully seeded ${count} activities!`);

  // 6. Seed Demo Trips for Demo User
  const upcomingTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      name: 'Goa Beach & Heritage Weekend',
      description: 'Relaxing 4-day escape in North Goa featuring watersports and fort walks.',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days in future
      endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
      status: TripStatus.UPCOMING,
      coverImageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      stops: {
        create: [
          {
            destinationName: 'Calangute & Anjuna',
            city: 'Goa',
            country: 'India',
            arrivalDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            departureDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
            orderIndex: 0,
          },
        ],
      },
      budget: {
        create: {
          totalBudget: 25000,
        },
      },
      expenses: {
        create: [
          { category: ExpenseCategory.ACCOMMODATION, amount: 9000, description: 'Beachfront Resort Stay (3 Nights)' },
          { category: ExpenseCategory.ACTIVITIES, amount: 3500, description: 'Scuba Diving Package' },
          { category: ExpenseCategory.TRANSPORT, amount: 4500, description: 'Return Flight Tickets' },
        ],
      },
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
