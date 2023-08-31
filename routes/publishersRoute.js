const express = require('express');
const router = express.Router();
const publisherController = require('../controllers/publisherController');
//publisher routes
router.get('/', publisherController.publisher_list);

router.get('/create', publisherController.publisher_form);

router.post('/create', publisherController.publisher_create_post);

router.get('/:id', publisherController.publisher_detail);

router.get('/:id/update', publisherController.publisher_form);

router.post('/:id/update', publisherController.publisher_update_post);

router.get('/:id/delete', publisherController.publisher_delete_get);

router.post('/:id/delete', publisherController.publisher_delete_post);

module.exports = router;
