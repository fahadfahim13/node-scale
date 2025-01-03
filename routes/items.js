const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

router.post('/', async (req, res) => {
    try {
        const item = new Item(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const id = Math.floor(Math.random() * 100);
        const item = new Item({
            name: `item${id}`,
            description: `description${id}`,
        });
        await item.save();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
