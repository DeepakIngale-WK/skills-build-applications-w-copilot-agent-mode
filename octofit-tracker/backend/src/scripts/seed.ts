/**
 * Seed the octofit_db database with test data
 *
 * This script initializes the MongoDB database with sample data for:
 * - Users
 * - Teams
 * - Activities
 * - Leaderboard
 * - Workouts
 *
 * Usage: npx ts-node src/scripts/seed.ts
 */

import mongoose from 'mongoose';
import User from '../models/User';
import Team from '../models/Team';
import Activity from '../models/Activity';
import Leaderboard from '../models/Leaderboard';
import Workout from '../models/Workout';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(connectionString);
    console.log('✓ Connected to octofit_db');

    // Clear existing data
    console.log('\nClearing existing collections...');
    await User.deleteMany({});
    await Team.deleteMany({});
    await Activity.deleteMany({});
    await Leaderboard.deleteMany({});
    await Workout.deleteMany({});
    console.log('✓ Cleared all collections');

    // Seed Users
    console.log('\nSeeding users...');
    const users = await User.insertMany([
      {
        username: 'alex_runner',
        email: 'alex@example.com',
        fitnessLevel: 'advanced',
      },
      {
        username: 'sam_yoga',
        email: 'sam@example.com',
        fitnessLevel: 'intermediate',
      },
      {
        username: 'jordan_strength',
        email: 'jordan@example.com',
        fitnessLevel: 'advanced',
      },
      {
        username: 'casey_beginner',
        email: 'casey@example.com',
        fitnessLevel: 'beginner',
      },
      {
        username: 'taylor_cyclist',
        email: 'taylor@example.com',
        fitnessLevel: 'intermediate',
      },
    ]);
    console.log(`✓ Created ${users.length} users`);

    // Seed Teams
    console.log('\nSeeding teams...');
    const teams = await Team.insertMany([
      {
        name: 'Trail Blazers',
        goal: 'Weekly distance challenge - 50 miles per member',
        members: [users[0]._id, users[1]._id],
      },
      {
        name: 'Power Squad',
        goal: 'Strength and mobility training 4x per week',
        members: [users[2]._id, users[3]._id, users[4]._id],
      },
      {
        name: 'Wellness Warriors',
        goal: 'Daily yoga and meditation practice',
        members: [users[1]._id, users[4]._id],
      },
    ]);
    console.log(`✓ Created ${teams.length} teams`);

    // Seed Activities
    console.log('\nSeeding activities...');
    const activities = await Activity.insertMany([
      {
        userId: users[0]._id,
        type: 'Run',
        duration: 45,
        calories: 520,
        date: new Date('2026-08-10'),
      },
      {
        userId: users[0]._id,
        type: 'Run',
        duration: 35,
        calories: 420,
        date: new Date('2026-08-11'),
      },
      {
        userId: users[1]._id,
        type: 'Yoga',
        duration: 60,
        calories: 240,
        date: new Date('2026-08-10'),
      },
      {
        userId: users[2]._id,
        type: 'Strength Training',
        duration: 50,
        calories: 480,
        date: new Date('2026-08-11'),
      },
      {
        userId: users[3]._id,
        type: 'Walk',
        duration: 30,
        calories: 150,
        date: new Date('2026-08-12'),
      },
      {
        userId: users[4]._id,
        type: 'Cycling',
        duration: 75,
        calories: 650,
        date: new Date('2026-08-09'),
      },
      {
        userId: users[2]._id,
        type: 'Swimming',
        duration: 40,
        calories: 400,
        date: new Date('2026-08-12'),
      },
    ]);
    console.log(`✓ Created ${activities.length} activities`);

    // Seed Leaderboard
    console.log('\nSeeding leaderboard...');
    const leaderboard = await Leaderboard.insertMany([
      {
        userId: users[0]._id,
        username: users[0].username,
        points: 1420,
        rank: 1,
      },
      {
        userId: users[2]._id,
        username: users[2].username,
        points: 1280,
        rank: 2,
      },
      {
        userId: users[1]._id,
        username: users[1].username,
        points: 1100,
        rank: 3,
      },
      {
        userId: users[4]._id,
        username: users[4].username,
        points: 980,
        rank: 4,
      },
      {
        userId: users[3]._id,
        username: users[3].username,
        points: 650,
        rank: 5,
      },
    ]);
    console.log(`✓ Created ${leaderboard.length} leaderboard entries`);

    // Seed Workouts
    console.log('\nSeeding workouts...');
    const workouts = await Workout.insertMany([
      {
        title: 'HIIT Cardio Blast',
        description: 'High-intensity interval training focusing on cardio endurance',
        difficulty: 'hard',
        duration: 30,
        caloriesBurned: 400,
        exercises: ['Burpees', 'High Knees', 'Mountain Climbers', 'Jump Squats'],
      },
      {
        title: 'Core Strength Builder',
        description: 'Effective core strengthening exercises for beginners',
        difficulty: 'easy',
        duration: 20,
        caloriesBurned: 150,
        exercises: ['Planks', 'Crunches', 'Leg Raises', 'Russian Twists'],
      },
      {
        title: 'Full Body Power',
        description: 'Complete full-body workout combining strength and cardio',
        difficulty: 'moderate',
        duration: 45,
        caloriesBurned: 500,
        exercises: ['Deadlifts', 'Push-ups', 'Squats', 'Rows', 'Sprints'],
      },
      {
        title: 'Morning Yoga Flow',
        description: 'Gentle yoga sequence perfect for starting your day',
        difficulty: 'easy',
        duration: 30,
        caloriesBurned: 120,
        exercises: ['Sun Salutation', 'Warrior Pose', 'Tree Pose', 'Corpse Pose'],
      },
      {
        title: 'Advanced Circuit Training',
        description: 'Challenging circuit with minimal rest for experienced athletes',
        difficulty: 'hard',
        duration: 60,
        caloriesBurned: 650,
        exercises: ['Battle Ropes', 'Kettlebell Swings', 'Box Jumps', 'Tire Flips'],
      },
    ]);
    console.log(`✓ Created ${workouts.length} workouts`);

    console.log('\n=================================================');
    console.log('Database seed completed successfully! ✓');
    console.log('=================================================');
    console.log('\nSummary:');
    console.log(`  • Users: ${users.length}`);
    console.log(`  • Teams: ${teams.length}`);
    console.log(`  • Activities: ${activities.length}`);
    console.log(`  • Leaderboard entries: ${leaderboard.length}`);
    console.log(`  • Workouts: ${workouts.length}`);
    console.log('\nYou can now verify the data by running the backend and checking API responses.');

    await mongoose.disconnect();
    console.log('\n✓ Disconnected from database');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
