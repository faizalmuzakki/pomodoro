// Pomodoro Timer Application
// 100% Client-Side with LocalStorage persistence

// Default Settings
const DEFAULT_SETTINGS = {
    workTime: 25,
    shortBreakTime: 5,
    sessionsBeforeLongBreak: 4,
    autoStart: false,
    soundEnabled: true,
    browserNotifications: false
};

// Application State
let settings = { ...DEFAULT_SETTINGS };
let timerInterval = null;
let totalSeconds = settings.workTime * 60;
let currentSeconds = totalSeconds;
let isRunning = false;
let currentSession = 1;
let sessionType = 'work'; // 'work', 'shortBreak', 'longBreak'
let todayStats = {
    date: new Date().toDateString(),
    completedSessions: 0,
    totalFocusTime: 0
};

// DOM Elements
const timerDisplay = document.getElementById('timerDisplay');
const progressCircle = document.getElementById('progressCircle');
const sessionTypeEl = document.getElementById('sessionType');
const sessionCount = document.getElementById('sessionCount');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const skipBtn = document.getElementById('skipBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeModal = document.getElementById('closeModal');
const saveSettings = document.getElementById('saveSettings');
const todaySessionsEl = document.getElementById('todaySessions');
const totalTimeEl = document.getElementById('totalTime');

// Settings Inputs
const workTimeInput = document.getElementById('workTime');
const shortBreakTimeInput = document.getElementById('shortBreakTime');
const sessionsBeforeLongBreakInput = document.getElementById('sessionsBeforeLongBreak');
const autoStartInput = document.getElementById('autoStart');
const soundEnabledInput = document.getElementById('soundEnabled');
const browserNotificationsInput = document.getElementById('browserNotifications');
const testNotificationBtn = document.getElementById('testNotification');
const resetStatsBtn = document.getElementById('resetStats');

// Initialize
init();

function init() {
    loadSettings();
    loadStats();
    updateDisplay();
    updateSessionInfo();
    updateStats();
    setupEventListeners();
    requestNotificationPermission();
}

// Load settings from localStorage
function loadSettings() {
    const saved = localStorage.getItem('pomodoroSettings');
    if (saved) {
        settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
    updateSettingsUI();
}

// Save settings to localStorage
function saveSettingsToStorage() {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
}

// Load stats from localStorage
function loadStats() {
    const saved = localStorage.getItem('pomodoroStats');
    if (saved) {
        const stats = JSON.parse(saved);
        // Check if it's today's stats
        if (stats.date === new Date().toDateString()) {
            todayStats = stats;
        } else {
            // Reset stats for new day
            todayStats = {
                date: new Date().toDateString(),
                completedSessions: 0,
                totalFocusTime: 0
            };
            saveStats();
        }
    }
}

// Save stats to localStorage
function saveStats() {
    localStorage.setItem('pomodoroStats', JSON.stringify(todayStats));
}

// Update settings UI
function updateSettingsUI() {
    workTimeInput.value = settings.workTime;
    shortBreakTimeInput.value = settings.shortBreakTime;
    sessionsBeforeLongBreakInput.value = settings.sessionsBeforeLongBreak;
    autoStartInput.checked = settings.autoStart;
    soundEnabledInput.checked = settings.soundEnabled;
    browserNotificationsInput.checked = settings.browserNotifications;
}

// Setup Event Listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    skipBtn.addEventListener('click', skipSession);
    settingsBtn.addEventListener('click', openSettings);
    closeModal.addEventListener('click', closeSettings);
    saveSettings.addEventListener('click', handleSaveSettings);
    testNotificationBtn.addEventListener('click', testNotification);
    resetStatsBtn.addEventListener('click', resetStats);

    // Close modal when clicking outside
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            closeSettings();
        }
    });

    // +/- buttons for settings
    document.querySelectorAll('.btn-adjust').forEach(btn => {
        btn.addEventListener('click', handleAdjustButton);
    });

    // Prevent page close when timer is running
    window.addEventListener('beforeunload', (e) => {
        if (isRunning) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

// Start Timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-flex';

        timerInterval = setInterval(() => {
            currentSeconds--;
            updateDisplay();

            if (currentSeconds <= 0) {
                completeSession();
            }
        }, 1000);
    }
}

// Pause Timer
function pauseTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        startBtn.style.display = 'inline-flex';
        pauseBtn.style.display = 'none';
    }
}

// Reset Timer
function resetTimer() {
    pauseTimer();
    currentSeconds = totalSeconds;
    updateDisplay();
}

// Skip Session
function skipSession() {
    pauseTimer();
    completeSession();
}

// Complete Session
function completeSession() {
    pauseTimer();

    // Play notification
    playNotification();
    showNotification();

    // Update stats
    if (sessionType === 'work') {
        todayStats.completedSessions++;
        todayStats.totalFocusTime += settings.workTime;
        saveStats();
        updateStats();
    }

    // Move to next session
    if (sessionType === 'work') {
        if (currentSession >= settings.sessionsBeforeLongBreak) {
            sessionType = 'longBreak';
            currentSession = 1;
        } else {
            sessionType = 'shortBreak';
            currentSession++;
        }
    } else {
        sessionType = 'work';
    }

    // Set new timer
    setSessionType(sessionType);

    // Auto-start if enabled
    if (settings.autoStart) {
        setTimeout(() => startTimer(), 2000);
    }
}

// Set Session Type
function setSessionType(type) {
    sessionType = type;

    if (type === 'work') {
        totalSeconds = settings.workTime * 60;
        sessionTypeEl.querySelector('.session-label').textContent = 'Work Session';
        sessionTypeEl.className = 'session-type';
        document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else if (type === 'shortBreak') {
        totalSeconds = settings.shortBreakTime * 60;
        sessionTypeEl.querySelector('.session-label').textContent = 'Short Break';
        sessionTypeEl.className = 'session-type break';
        document.body.style.background = 'linear-gradient(135deg, #10b981 0%, #14a800 100%)';
    } else {
        totalSeconds = settings.shortBreakTime * 3 * 60;
        sessionTypeEl.querySelector('.session-label').textContent = 'Long Break';
        sessionTypeEl.className = 'session-type long-break';
        document.body.style.background = 'linear-gradient(135deg, #f59e0b 0%, #f093fb 100%)';
    }

    currentSeconds = totalSeconds;
    updateDisplay();
    updateSessionInfo();
}

// Update Display
function updateDisplay() {
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Update progress circle
    const circumference = 2 * Math.PI * 150;
    const progress = (totalSeconds - currentSeconds) / totalSeconds;
    const offset = circumference * (1 - progress);
    progressCircle.style.strokeDashoffset = offset;

    // Update page title
    document.title = `${timerDisplay.textContent} - Pomodoro Timer`;

    // Pulse effect when time is almost up
    if (currentSeconds <= 10 && currentSeconds > 0 && isRunning) {
        timerDisplay.classList.add('pulse');
    } else {
        timerDisplay.classList.remove('pulse');
    }
}

// Update Session Info
function updateSessionInfo() {
    if (sessionType === 'work') {
        sessionCount.textContent = `Session ${currentSession} of ${settings.sessionsBeforeLongBreak}`;
    } else {
        sessionCount.textContent = 'Take a break! 🎉';
    }
}

// Update Stats
function updateStats() {
    todaySessionsEl.textContent = todayStats.completedSessions;
    const hours = Math.floor(todayStats.totalFocusTime / 60);
    const mins = todayStats.totalFocusTime % 60;
    if (hours > 0) {
        totalTimeEl.textContent = `${hours}h ${mins}m`;
    } else {
        totalTimeEl.textContent = `${mins}m`;
    }
}

// Play Notification Sound
function playNotification() {
    if (!settings.soundEnabled) return;

    // Create beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    // Second beep
    setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();

        osc2.connect(gain2);
        gain2.connect(audioContext.destination);

        osc2.frequency.value = 1000;
        osc2.type = 'sine';

        gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 0.5);
    }, 200);
}

// Show Browser Notification
function showNotification() {
    if (!settings.browserNotifications || Notification.permission !== 'granted') return;

    let title, body;
    if (sessionType === 'work') {
        title = '🎉 Work session complete!';
        body = 'Time for a well-deserved break!';
    } else {
        title = '⏰ Break time is over!';
        body = 'Ready to focus again?';
    }

    new Notification(title, {
        body: body,
        icon: '🍅',
        badge: '🍅'
    });
}

// Request Notification Permission
async function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
    }
}

// Test Notification
async function testNotification() {
    if (!('Notification' in window)) {
        alert('Browser notifications are not supported in your browser.');
        return;
    }

    if (Notification.permission === 'denied') {
        alert('Notifications are blocked. Please enable them in your browser settings.');
        return;
    }

    if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            return;
        }
    }

    new Notification('🍅 Pomodoro Timer', {
        body: 'Notifications are working perfectly!',
        icon: '🍅'
    });

    playNotification();
}

// Open Settings
function openSettings() {
    settingsModal.classList.add('active');
}

// Close Settings
function closeSettings() {
    settingsModal.classList.remove('active');
}

// Handle Save Settings
function handleSaveSettings() {
    settings.workTime = parseInt(workTimeInput.value);
    settings.shortBreakTime = parseInt(shortBreakTimeInput.value);
    settings.sessionsBeforeLongBreak = parseInt(sessionsBeforeLongBreakInput.value);
    settings.autoStart = autoStartInput.checked;
    settings.soundEnabled = soundEnabledInput.checked;
    settings.browserNotifications = browserNotificationsInput.checked;

    saveSettingsToStorage();

    // Reset timer with new settings if not running
    if (!isRunning) {
        setSessionType('work');
        currentSession = 1;
    }

    closeSettings();

    // Show feedback
    saveSettings.textContent = '✓ Saved!';
    setTimeout(() => {
        saveSettings.textContent = 'Save Settings';
    }, 2000);
}

// Handle Adjust Buttons (+/-)
function handleAdjustButton(e) {
    const action = e.target.dataset.action || e.target.parentElement.dataset.action;
    const target = e.target.dataset.target || e.target.parentElement.dataset.target;
    const input = document.getElementById(target);

    if (!input) return;

    let value = parseInt(input.value);
    const min = parseInt(input.min);
    const max = parseInt(input.max);

    if (action === 'increase' && value < max) {
        input.value = value + 1;
    } else if (action === 'decrease' && value > min) {
        input.value = value - 1;
    }
}

// Reset Stats
function resetStats() {
    if (confirm('Are you sure you want to reset today\'s statistics?')) {
        todayStats = {
            date: new Date().toDateString(),
            completedSessions: 0,
            totalFocusTime: 0
        };
        saveStats();
        updateStats();
    }
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Space to start/pause
    if (e.code === 'Space' && !settingsModal.classList.contains('active')) {
        e.preventDefault();
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }

    // R to reset
    if (e.code === 'KeyR' && !settingsModal.classList.contains('active')) {
        resetTimer();
    }

    // Escape to close modal
    if (e.code === 'Escape' && settingsModal.classList.contains('active')) {
        closeSettings();
    }
});

// Console welcome message
console.log('%c🍅 Pomodoro Timer', 'font-size: 24px; font-weight: bold; color: #667eea;');
console.log('%c⏱️ Stay focused and productive!', 'font-size: 16px; color: #764ba2;');
console.log('%c⌨️ Keyboard shortcuts: Space (start/pause), R (reset)', 'font-size: 14px; color: #6b7280;');

