const app = require('./app');
const scheduleReminders = require('./utils/cronJob');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`[Life Admin Manager] System running live on http://localhost:${PORT}`);
    
    // Initialize the daily document expiry checker and reminder system
    try { 
        scheduleReminders(); 
        console.log('[Life Admin Manager] Reminder schedule initialized');
    } catch(e) {
        console.error('[Life Admin Manager] Scheduler initialization failed:', e.message);
    }
});
