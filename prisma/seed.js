import { PrismaClient, UserRole, BookingStatus, PaymentStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean database (optional but useful for dev)
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.category.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  // Hash password
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@tripbuddy.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      name: "Rudra",
      email: "rudra@test.com",
      password: hashedPassword,
      role: UserRole.USER,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "John",
      email: "john@test.com",
      password: hashedPassword,
      role: UserRole.USER,
    },
  });

  // Categories
  const adventure = await prisma.category.create({
    data: { name: "Adventure" },
  });

  const luxury = await prisma.category.create({
    data: { name: "Luxury" },
  });

  const family = await prisma.category.create({
    data: { name: "Family" },
  });

  // Destinations
  const goa = await prisma.destination.create({
    data: {
      name: "Goa",
      country: "India",
      description: "Beach paradise",
    },
  });

  const bali = await prisma.destination.create({
    data: {
      name: "Bali",
      country: "Indonesia",
      description: "Island adventure",
    },
  });

  const dubai = await prisma.destination.create({
    data: {
      name: "Dubai",
      country: "UAE",
      description: "Luxury city experience",
    },
  });

  // Tours
  const tour1 = await prisma.tour.create({
    data: {
      title: "Goa Beach Adventure",
      description: "3 days beach fun",
      price: 4999,
      durationDays: 3,
      maxGuests: 10,
      imageUrl: "https://example.com/goa.jpg",
      destinationId: goa.id,
      categoryId: adventure.id,
    },
  });

  const tour2 = await prisma.tour.create({
    data: {
      title: "Luxury Dubai Escape",
      description: "5 days luxury stay",
      price: 15000,
      durationDays: 5,
      maxGuests: 5,
      imageUrl: "https://example.com/dubai.jpg",
      destinationId: dubai.id,
      categoryId: luxury.id,
    },
  });

  const tour3 = await prisma.tour.create({
    data: {
      title: "Bali Family Trip",
      description: "7 days family fun",
      price: 12000,
      durationDays: 7,
      maxGuests: 8,
      imageUrl: "https://example.com/bali.jpg",
      destinationId: bali.id,
      categoryId: family.id,
    },
  });

  // Bookings
  const booking1 = await prisma.booking.create({
    data: {
      userId: user1.id,
      tourId: tour1.id,
      guests: 2,
      status: BookingStatus.CONFIRMED,
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      userId: user2.id,
      tourId: tour2.id,
      guests: 1,
      status: BookingStatus.PENDING,
    },
  });

  // Payments
  await prisma.payment.create({
    data: {
      bookingId: booking1.id,
      amount: 9998,
      status: PaymentStatus.SUCCESS,
      paymentRef: "PAY123456",
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: booking2.id,
      amount: 15000,
      status: PaymentStatus.PENDING,
    },
  });

  // Reviews
  await prisma.review.create({
    data: {
      userId: user1.id,
      tourId: tour1.id,
      rating: 5,
      comment: "Amazing trip!",
    },
  });

  await prisma.review.create({
    data: {
      userId: user2.id,
      tourId: tour2.id,
      rating: 4,
      comment: "Very luxurious experience",
    },
  });

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });