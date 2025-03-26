const remindersService = require('../services/inititateTrainingRemindersService');

const createReminder = async (req, res) => {
    try {
        const reminder = req.body;
        await remindersService.createReminder(reminder);
        res.status(201).json({ message: 'Reminder created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteReminder = async (req, res) => {
    try {
        const { reminder_id } = req.params;
        await remindersService.deleteReminder(reminder_id);
        res.status(200).json({ message: 'Reminder deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateReminder = async (req, res) => {
    try {
        const { reminder_id } = req.params;
        const updatedFields = req.body;
        await remindersService.updateReminder(reminder_id, updatedFields);
        res.status(200).json({ message: 'Reminder updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getRemindersByDate = async (req, res) => {
    try {
        
        const reminders = await remindersService.getRemindersByDate(); // No destructuring needed here
        res.status(200).json(reminders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    createReminder,
    deleteReminder,
    updateReminder,
    getRemindersByDate,
 
};