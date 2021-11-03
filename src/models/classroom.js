import mongoose from 'mongoose';

const ClassroomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  createdDate: {
    type: Date,
    required: true,
  },
  teacher:{
    id: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    }
  },
  students: [
    {
      id: {
        type: String,
        required: true,
      }
    }
  ]

},{ collection: 'classrooms' });

export default mongoose.model('ClassroomModel', ClassroomSchema);