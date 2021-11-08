import express from 'express';

const router = express.Router();

// all route here start with '/'
router.get('/', async (req, res) => {
  res.json('api home page');
});


export default router;