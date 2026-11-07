const mongoose = require('mongoose');

const seedDefaultData = async () => {
  try {
    const User = require('../models/User');
    const Item = require('../models/Item');

    const defaultEmail = 'lakshmi@gmail.com';
    let adminUser = await User.findOne({ email: defaultEmail });

    if (!adminUser) {
      adminUser = await User.create({
        name: 'Lakshmi',
        email: defaultEmail,
        phone: '9032093472',
        password: 'password123',
        role: 'ADMIN',
        status: 'ACTIVE',
      });
      console.log(`👤 Seeded Default Account: ${defaultEmail} | Password: password123`);
    }

    const itemCount = await Item.countDocuments();
    if (itemCount < 20) {
      const initialItems = [
        {
          title: 'Silver MacBook Pro 14-inch (M2)',
          description: 'Space Gray 14-inch MacBook Pro in a dark gray felt sleeve. Left near table 14 in the Central Campus Library second floor study zone.',
          category: 'Electronics',
          status: 'lost',
          location: 'Central Campus Library, 2nd Floor',
          date: '2026-09-17',
          time: '10:30 AM',
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Has a GitHub sticker on top lid. $50 reward offered!',
          owner: adminUser._id,
        },
        {
          title: 'Brown Leather Bi-fold Wallet',
          description: 'Fossil brand brown leather wallet containing a student card and public transit pass. Found under cafeteria table 8.',
          category: 'Wallets',
          status: 'found',
          location: 'Student Union Cafeteria',
          date: '2026-09-18',
          time: '02:15 PM',
          image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Handed over to Security Desk Office #102.',
          owner: adminUser._id,
        },
        {
          title: 'Sony WH-1000XM4 Wireless Headphones',
          description: 'Black Sony noise-canceling headphones in a round zippered protective case. Left on a outdoor quad bench.',
          category: 'Electronics',
          status: 'lost',
          location: 'Science Complex Quad',
          date: '2026-09-16',
          time: '04:45 PM',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Includes charging cable inside headphone case.',
          owner: adminUser._id,
        },
        {
          title: 'Black Samsung Galaxy S23 Ultra',
          description: 'Black Samsung Galaxy phone with a transparent protective case. Found near bus shelter platform.',
          category: 'Electronics',
          status: 'found',
          location: 'Guntur Bus Stand',
          date: '2026-09-19',
          time: '09:00 AM',
          image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Lock screen wallpaper shows a mountain landscape.',
          owner: adminUser._id,
        },
        {
          title: 'Herschel Canvas Backpack',
          description: 'Navy blue canvas backpack containing calculus textbooks, spiral notebooks, and a stainless steel water bottle.',
          category: 'Bags',
          status: 'lost',
          location: 'Engineering Hall, Room 304',
          date: '2026-09-15',
          time: '11:20 AM',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Has a small metal keychain attached to front zipper.',
          owner: adminUser._id,
        },
        {
          title: 'Apple Watch Series 8 (Midnight)',
          description: 'Midnight aluminum case with a black sport band. Found on bench inside locker room.',
          category: 'Electronics',
          status: 'found',
          location: 'Campus Gym Locker Room',
          date: '2026-09-20',
          time: '06:30 PM',
          image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Turned in to gym reception counter.',
          owner: adminUser._id,
        },
        {
          title: 'Toyota Car Key Fob & Blue Lanyard',
          description: 'Remote key fob for Toyota vehicle with two brass keys on a blue woven lanyard.',
          category: 'Keys',
          status: 'found',
          location: 'North Parking Lot, Row D',
          date: '2026-09-19',
          time: '01:10 PM',
          image: 'https://images.unsplash.com/photo-1583472014484-6c23557a3df6?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Found near parking spot #42.',
          owner: adminUser._id,
        },
        {
          title: 'Ray-Ban Classic Aviator Sunglasses',
          description: 'Gold frame Ray-Ban sunglasses with green lenses inside a dark brown protective leather pouch.',
          category: 'Accessories',
          status: 'lost',
          location: 'Student Center Outdoor Patio',
          date: '2026-09-14',
          time: '03:00 PM',
          image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Microfiber cleaning cloth inside case.',
          owner: adminUser._id,
        },
        {
          title: 'Student ID Card & Metro Transit Pass',
          description: 'University Student Identification card and monthly city metro pass in a clear plastic holder.',
          category: 'ID Cards',
          status: 'lost',
          location: 'Main Campus Dining Hall',
          date: '2026-09-21',
          time: '08:30 AM',
          image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Name on card matches Lakshmi.',
          owner: adminUser._id,
        },
        {
          title: 'Dell XPS 15 OLED Laptop',
          description: 'Silver aluminum laptop with a black protective sleeve. Forgotten in Computer Science Lab 101.',
          category: 'Electronics',
          status: 'lost',
          location: 'Computer Science Dept, Lab 101',
          date: '2026-09-20',
          time: '05:15 PM',
          image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Intel i9 processor, 32GB RAM. $100 reward for return!',
          owner: adminUser._id,
        },
        {
          title: 'Apple AirPods Pro 2nd Gen',
          description: 'White Apple AirPods Pro in magsafe charging case with a transparent silicone protective jacket.',
          category: 'Electronics',
          status: 'found',
          location: 'Library 3rd Floor Quiet Area',
          date: '2026-09-22',
          time: '11:45 AM',
          image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Handed over to librarian desk.',
          owner: adminUser._id,
        },
        {
          title: 'iPad Air 5th Gen (Space Gray)',
          description: '10.9-inch iPad Air with Apple Pencil attached magnetically. Found on lecture room desktop.',
          category: 'Electronics',
          status: 'found',
          location: 'Auditorium Hall B',
          date: '2026-09-23',
          time: '04:15 PM',
          image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Has a blue smart cover attached.',
          owner: adminUser._id,
        },
        {
          title: 'Black Slim Leather Cardholder Wallet',
          description: 'Minimalist black leather cardholder containing driver license and credit cards.',
          category: 'Wallets',
          status: 'lost',
          location: 'University Sports Complex',
          date: '2026-09-22',
          time: '05:00 PM',
          image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Initials J.D. stamped on corner.',
          owner: adminUser._id,
        },
        {
          title: 'Red Zippered Leather Purse',
          description: 'Chic red leather purse with gold hardware found on dining chair at cafeteria.',
          category: 'Wallets',
          status: 'found',
          location: 'Student Union Food Court',
          date: '2026-09-21',
          time: '01:30 PM',
          image: 'https://images.unsplash.com/photo-1563903530908-afdd15a631c6?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Contains keys and cosmetic compact.',
          owner: adminUser._id,
        },
        {
          title: 'Brown Leather Messenger Bag',
          description: 'Vintage brown leather crossbody messenger bag with brass buckles and laptop compartment.',
          category: 'Bags',
          status: 'lost',
          location: 'Humanities Block Corridor',
          date: '2026-09-23',
          time: '09:15 AM',
          image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Contains project documents and diary.',
          owner: adminUser._id,
        },
        {
          title: 'Minimalist Beige Canvas Tote Bag',
          description: 'Eco-friendly canvas tote bag with floral print containing art supplies and sketchbooks.',
          category: 'Bags',
          status: 'found',
          location: 'Fine Arts Studio 2',
          date: '2026-09-22',
          time: '03:40 PM',
          image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Kept safely with studio supervisor.',
          owner: adminUser._id,
        },
        {
          title: 'Brass House Keys on Leather Ring',
          description: 'Set of three brass house keys and one silver padlock key on a dark tan leather keychain.',
          category: 'Keys',
          status: 'lost',
          location: 'Central Lawn Quad',
          date: '2026-09-21',
          time: '06:00 PM',
          image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Small wooden tag attached.',
          owner: adminUser._id,
        },
        {
          title: 'BMW Smart Remote Key',
          description: 'Sleek BMW smart proximity key with metallic emblem found on parking walkway.',
          category: 'Keys',
          status: 'found',
          location: 'Faculty Parking Lot A',
          date: '2026-09-23',
          time: '08:20 AM',
          image: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Submitted to campus security office.',
          owner: adminUser._id,
        },
        {
          title: 'Employee ID Lanyard Access Badge',
          description: 'Corporate staff photo ID card with blue lanyard for Research & Development wing.',
          category: 'ID Cards',
          status: 'found',
          location: 'Innovation Hub Lobby',
          date: '2026-09-22',
          time: '10:10 AM',
          image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Name reads Dr. Robert H.',
          owner: adminUser._id,
        },
        {
          title: 'Driver License in Leather Case',
          description: 'State driver license inside a clear window foldover leather ID holder.',
          category: 'ID Cards',
          status: 'lost',
          location: 'University Transit Stop',
          date: '2026-09-20',
          time: '07:15 PM',
          image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Important identity document, reward offered.',
          owner: adminUser._id,
        },
        {
          title: 'Blue Passport & Travel Binder',
          description: 'Navy blue leather document binder containing passport, visa printouts, and tickets.',
          category: 'Documents',
          status: 'found',
          location: 'International Student Desk',
          date: '2026-09-21',
          time: '02:00 PM',
          image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Held securely at international center.',
          owner: adminUser._id,
        },
        {
          title: 'Leather Project Portfolio Binder',
          description: 'Black zip-around leather portfolio with engineering blueprints and research notes.',
          category: 'Documents',
          status: 'lost',
          location: 'Architecture Dept Library',
          date: '2026-09-22',
          time: '04:30 PM',
          image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Name label on inner pocket.',
          owner: adminUser._id,
        },
        {
          title: 'Classic Silver Stainless Steel Watch',
          description: 'Men silver stainless steel wristwatch with white dial chronograph display.',
          category: 'Accessories',
          status: 'lost',
          location: 'Sports Ground Pavilion',
          date: '2026-09-23',
          time: '05:45 PM',
          image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Engraved message on back case.',
          owner: adminUser._id,
        },
        {
          title: 'Stainless Steel Hydro Flask Water Bottle',
          description: '32oz matte olive green stainless steel insulated water bottle with stickers.',
          category: 'Other',
          status: 'found',
          location: 'Gym Basketball Court',
          date: '2026-09-22',
          time: '07:00 PM',
          image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Found on bench near Court 1.',
          owner: adminUser._id,
        },
        {
          title: 'Portable JBL Bluetooth Speaker',
          description: 'Teal waterproof JBL Flip bluetooth speaker found near amphitheater steps.',
          category: 'Other',
          status: 'found',
          location: 'Student Amphitheater',
          date: '2026-09-23',
          time: '08:30 PM',
          image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
          additionalDetails: 'Turned in to campus admin office.',
          owner: adminUser._id,
        },
      ];

      await Item.deleteMany({});
      await Item.insertMany(initialItems);
      console.log(`📦 Successfully seeded ${initialItems.length} sample Lost & Found items!`);
    }
  } catch (err) {
    console.error('Seed Error:', err.message);
  }
};

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (mongoURI && !mongoURI.includes('user:password') && !mongoURI.includes('your_mongodb')) {
    try {
      console.log('🔄 Attempting MongoDB Atlas Connection...');
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 4000,
      });

      console.log('----------------------------------------------------');
      console.log(`✅ [MongoDB Atlas] Connected successfully!`);
      console.log(`📍 Host: ${conn.connection.host}`);
      console.log(`🗄️ Database: ${conn.connection.name}`);
      console.log('----------------------------------------------------');
      await seedDefaultData();
      return true;
    } catch (error) {
      console.error('----------------------------------------------------');
      console.error(`⚠️ [MongoDB Atlas] Connection Failed: ${error.message}`);
      console.error('ℹ️ Atlas IP not whitelisted or unreachable. Switching to Local In-Memory Database Fallback...');
      console.error('----------------------------------------------------');
    }
  }

  // Fallback to MongoMemoryServer so application works locally immediately
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create({
      instance: {
        ip: '127.0.0.1',
      },
    });
    const uri = mongoServer.getUri();

    const conn = await mongoose.connect(uri, {
      directConnection: true,
    });

    console.log('====================================================');
    console.log(`⚡ [Local In-Memory MongoDB] Connected successfully!`);
    console.log(`📍 URI: ${uri}`);
    console.log(`💡 Note: To use MongoDB Atlas, whitelist your IP in Atlas Network Access.`);
    console.log('====================================================');
    await seedDefaultData();
    return true;
  } catch (err) {
    console.error('❌ Failed to launch Local In-Memory MongoDB:', err.message);
    return false;
  }
};

module.exports = connectDB;
