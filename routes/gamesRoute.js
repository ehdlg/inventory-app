const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
//Game routes
router.get('/', gameController.game_list);

router.get('/create', gameController.game_create_get);

router.get('/:id', gameController.game_detail);

router.post('/create', gameController.game_create_post);

router.get('/:id/update', gameController.game_update_get);

router.post('/:id/update', gameController.game_update_post);

router.get('/:id/delete', gameController.game_delete_get);

router.post('/:id/delete', gameController.game_delete_post);

module.exports = router;
