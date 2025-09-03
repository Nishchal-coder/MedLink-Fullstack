import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Questionnaire } from '../models';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medlink';

async function migrateQuestionnaires() {
  try {
    console.log('🔄 Starting questionnaire migration...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all questionnaires that don't have a user field or have an invalid user reference
    const questionnaires = await Questionnaire.find({
      $or: [
        { user: { $exists: false } },
        { user: null },
        { user: { $type: 'string' } } // If user is stored as string instead of ObjectId
      ]
    });

    console.log(`📊 Found ${questionnaires.length} questionnaires to migrate`);

    if (questionnaires.length === 0) {
      console.log('🎉 All questionnaires already have valid user references!');
      return;
    }

    let migratedCount = 0;
    let errorCount = 0;

    for (const questionnaire of questionnaires) {
      try {
        console.log(`📋 Processing questionnaire ${questionnaire._id}`);
        console.log(`   Fields: ${Object.keys(questionnaire.toObject())}`);
        
        // Try to find user by email if it exists
        const email = (questionnaire as any).email;
        if (email) {
          const user = await User.findOne({ email: email });
          
          if (user) {
            // Update the questionnaire with the user ID
            await Questionnaire.findByIdAndUpdate(questionnaire._id, {
              user: user._id
            });
            
            console.log(`✅ Migrated questionnaire ${questionnaire._id} -> user ${user._id} (${user.email})`);
            migratedCount++;
          } else {
            console.log(`⚠️  No user found for email: ${email} (questionnaire: ${questionnaire._id})`);
            errorCount++;
          }
        } else {
          // If no email field, we need to find the user through the patient record
          const patient = await mongoose.model('Patient').findById(questionnaire.patient);
          if (patient && patient.user) {
            // Update the questionnaire with the user ID from patient
            await Questionnaire.findByIdAndUpdate(questionnaire._id, {
              user: patient.user
            });
            
            console.log(`✅ Migrated questionnaire ${questionnaire._id} -> user ${patient.user} (via patient record)`);
            migratedCount++;
          } else {
            console.log(`⚠️  No user found via patient record for questionnaire ${questionnaire._id}`);
            errorCount++;
          }
        }
      } catch (error) {
        console.error(`❌ Error migrating questionnaire ${questionnaire._id}:`, error);
        errorCount++;
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`✅ Successfully migrated: ${migratedCount} questionnaires`);
    console.log(`❌ Errors: ${errorCount} questionnaires`);
    console.log(`📊 Total processed: ${questionnaires.length} questionnaires`);

    // Verify migration
    const remainingUnmigrated = await Questionnaire.find({
      $or: [
        { user: { $exists: false } },
        { user: null },
        { user: { $type: 'string' } }
      ]
    });

    if (remainingUnmigrated.length === 0) {
      console.log('🎉 All questionnaires have been successfully migrated!');
    } else {
      console.log(`⚠️  ${remainingUnmigrated.length} questionnaires still need migration`);
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateQuestionnaires()
    .then(() => {
      console.log('🏁 Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

export default migrateQuestionnaires;
