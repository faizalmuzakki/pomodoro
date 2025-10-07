# 🍅 Pomodoro Timer

A beautiful, feature-rich Pomodoro timer to boost your productivity. Built with vanilla JavaScript, fully client-side with localStorage persistence.

🌐 **[Live Demo](https://pomodoro.solork.dev)**

## ✨ Features

### ⏱️ Core Pomodoro Functionality
- **Customizable work sessions** (default: 25 minutes)
- **Short breaks** between work sessions (default: 5 minutes)
- **Long breaks** after completing multiple sessions (3× short break duration)
- **Session tracking** - counts your progress through the Pomodoro cycle
- **Visual progress ring** - animated circular progress indicator

### 🎯 Productivity Features
- **Session counter** - tracks completed Pomodoros before long break
- **Today's statistics** - see completed sessions and total focus time
- **Auto-start next session** - optional automatic transition between sessions
- **Pause/Resume** - take control when you need it
- **Skip session** - move to the next phase instantly

### 🔔 Notifications
- **Sound notifications** - pleasant beep sound using Web Audio API
- **Browser notifications** - desktop notifications when sessions complete (even in background!)
- **Test notification** - check your notification settings
- **Background timing** - notifications fire at exact time, even if tab/browser is inactive

### 💾 Data Persistence
- **LocalStorage** - all settings and stats saved locally
- **Daily stats reset** - fresh start each day, automatic tracking
- **Settings persistence** - your preferences are remembered

### ⚙️ Customization
- **Adjustable work duration** (1-60 minutes)
- **Adjustable break duration** (1-30 minutes)
- **Sessions before long break** (2-10 sessions)
- **Toggle auto-start**
- **Toggle sound notifications**
- **Toggle browser notifications**

### 🎨 User Experience
- **Modern gradient design** - beautiful, calming interface
- **Color-coded sessions** - different colors for work and breaks
- **Responsive design** - works perfectly on all devices
- **Keyboard shortcuts** - Space (start/pause), R (reset)
- **Page title updates** - see timer in your browser tab
- **Pulse animation** - visual alert when time is running out

## 🚀 Getting Started

### Option 1: Open Locally

Simply open `index.html` in your web browser!

```bash
cd /home/solork/Projects/pomodoro
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

### Option 2: Run with Local Server

```bash
# Using npx
npx serve -p 3000

# Using Python
python -m http.server 3000

# Then open http://localhost:3000
```

## 📖 How to Use

### Basic Usage

1. **Start Timer**: Click the "Start" button or press `Space`
2. **Work**: Focus for 25 minutes (or your custom duration)
3. **Break**: Take a 5-minute break when the session completes
4. **Repeat**: After 4 work sessions, take a longer break

### Customizing Settings

1. Click the **⚙️ Settings** button in the top right
2. Adjust your preferred durations:
   - Work time (1-60 minutes)
   - Short break time (1-30 minutes)
   - Sessions before long break (2-10)
3. Toggle features:
   - Auto-start next session
   - Sound notifications
   - Browser notifications
4. Click **Save Settings**

### Keyboard Shortcuts

- `Space` - Start/Pause timer
- `R` - Reset current timer
- `Esc` - Close settings modal

## 🎯 The Pomodoro Technique

The Pomodoro Technique is a time management method that uses a timer to break work into intervals:

1. **Work** for 25 minutes
2. **Short break** for 5 minutes
3. Repeat steps 1-2
4. After 4 work sessions, take a **long break** (15-30 minutes)

Benefits:
- 🧠 Improved focus and concentration
- ⚡ Increased productivity
- 😌 Reduced mental fatigue
- 📊 Better time awareness
- 🎯 Enhanced work quality

## 🌐 Deployment

### Cloudflare Pages (Recommended)

**Option A: Direct Upload**

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy . --project-name=pomodoro
```

**Option B: Git Integration**

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Pomodoro timer"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
3. Click **Create a project**
4. Connect your GitHub repository
5. Configure:
   - **Framework preset**: None
   - **Build command**: (leave empty)
   - **Build output directory**: `/`
6. Deploy!

### GitHub Pages

```bash
# Enable GitHub Pages in repository settings
# Select main branch, root directory
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 🔧 Technical Details

### Tech Stack
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid, Flexbox, animations
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Web Workers** - Background timing (unaffected by tab throttling)
- **Web Audio API** - Notification sounds
- **Notifications API** - Browser notifications
- **LocalStorage API** - Data persistence

### Browser Compatibility
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)

### Features Used
- CSS custom properties (variables)
- CSS Grid & Flexbox
- SVG for progress ring
- Web Workers for background timing
- Web Audio API for sounds
- Browser Notifications API
- LocalStorage for persistence
- ES6+ JavaScript features
- Timestamp-based timing (immune to tab throttling)

## 📊 Data Storage

All data is stored locally in your browser using `localStorage`:

### Settings Stored
```javascript
{
  workTime: 25,
  shortBreakTime: 5,
  sessionsBeforeLongBreak: 4,
  autoStart: false,
  soundEnabled: true,
  browserNotifications: false
}
```

### Stats Stored
```javascript
{
  date: "Mon Oct 07 2025",
  completedSessions: 5,
  totalFocusTime: 125  // minutes
}
```

**Note**: Stats reset automatically each day. No data is sent to any server.

## 🔒 Privacy & Security

- ✅ **100% Client-Side** - All code runs in your browser
- ✅ **No Data Collection** - We don't track or collect anything
- ✅ **No Analytics** - No third-party scripts
- ✅ **No Cookies** - Only localStorage for your settings
- ✅ **Works Offline** - After initial load, works without internet
- ✅ **Open Source** - Full transparency

## 🎨 Customization

### Change Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary: #667eea;
    --secondary: #764ba2;
    --success: #10b981;
    /* ... */
}
```

### Modify Default Settings

Edit `DEFAULT_SETTINGS` in `app.js`:

```javascript
const DEFAULT_SETTINGS = {
    workTime: 25,
    shortBreakTime: 5,
    sessionsBeforeLongBreak: 4,
    // ...
};
```

## 🐛 Troubleshooting

### Notifications Not Working
1. Check browser permissions for notifications
2. Click "Test Notification" in settings
3. Ensure notifications aren't blocked in browser settings

### Sound Not Playing
1. Ensure "Sound notifications" is enabled in settings
2. Check browser's audio permissions
3. Some browsers require user interaction before playing sounds

### Settings Not Saving
1. Check if localStorage is enabled in your browser
2. Ensure you're not in private/incognito mode
3. Clear browser cache and try again

### Timer Not Accurate
~~1. Browser throttles timers when tab is inactive~~ **FIXED!**
- ✅ Timer now uses Web Worker for accurate background timing
- ✅ Works perfectly even when tab is inactive or browser is minimized
- ✅ Notifications fire at the exact right time

## 📝 Future Enhancements

Possible features for future versions:
- Task list integration
- Weekly/monthly statistics
- Multiple timer presets
- Custom notification sounds
- Themes (light/dark mode)
- Export statistics
- Pomodoro history log
- Integration with calendar apps

## 📄 License

MIT License - Feel free to use and modify!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show Your Support

If you find this Pomodoro timer helpful:
- Star the repository
- Share it with others
- Use it to boost your productivity!

---

**Built with ❤️ using the Pomodoro Technique**

*Focus • Break • Repeat • Achieve*

