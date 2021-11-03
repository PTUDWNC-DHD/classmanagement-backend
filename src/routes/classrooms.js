import express from 'express';

import ClassroomModel from '../models/classroom';

const router = express.Router();



// all route here start with '/classrooms'
router.get('/', async (req, res) => {
  try {
    const classrooms = await ClassroomModel.find();
    res.json(classrooms);
  }
  catch (err) {
    res.json({'error messages': err});
  }
  
});

router.get('/:id', async (req, res) => {
  res.send('This is specific classroom');
});

router.post('/', async (req, res) => {

  const newClassroom = new ClassroomModel({
    name: req.body.name,
    subject: req.body.subject,
    description: req.body.description,
    createdDate: Date.now(),
    teachers: {
      id: req.body.teacher ? req.body.teacher.id : "",
      name: req.body.teacher ? req.body.teacher.name : ""
    },
    students: []
  });
  await newClassroom.save((err)=>{
    if (err) {
      console.log('error messages:', err);
    }
  });
  res.json(newClassroom);
});

export default router;