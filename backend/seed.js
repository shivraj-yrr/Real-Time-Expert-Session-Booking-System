// seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const Expert = require("./models/expert");
const Booking = require("./models/booking");
const categories = ["Fitness", "Finance", "Career", "Health", "Technology"];

const generateSlots = () => {
  return [
    {
      date: "2026-02-22",
      slots: ["10:00", "11:00", "12:00"]
    },
    {
      date: "2026-02-23",
      slots: ["14:00", "15:00", "16:00"]
    }
  ];
};

const seedExperts = async () => {
  await Expert.deleteMany();
  await Booking.deleteMany();

  const experts = [];

  for (let i = 1; i <= 30; i++) {
    experts.push({
      name: `Expert ${i}`,
      category: categories[i % categories.length],
      experience: Math.floor(Math.random() * 10) + 1,
      rating: (Math.random() * 2 + 3).toFixed(1),
      availableSlots: generateSlots()
    });
  }

  await Expert.insertMany(experts);

  console.log("30 Experts Seeded Successfully");
};

module.exports = seedExperts;

if (require.main === module) {
  const run = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      await seedExperts();
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
    } finally {
      await mongoose.disconnect();
    }
  };

  run();
}