const app = require('./app');
const scheduleReminders = require('./utils/cronJob');
const startTaskScheduler = require('./utils/taskScheduler');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`[Life Admin Manager] System running live on http://localhost:${PORT}`);
    
    // Initialize the daily document expiry checker and new precision task scheduler
    try { 
        scheduleReminders(); 
        startTaskScheduler();
        console.log('[Life Admin Manager] All reminder systems (Daily & Precision) initialized');
    } catch(e) {
        console.error('[Life Admin Manager] Scheduler initialization failed:', e.message);
    }
});
