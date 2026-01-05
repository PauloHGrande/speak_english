# 🎓 Speak English - Interactive English Learning Platform

An interactive web application for practicing English conversation skills through voice interaction with an AI-powered avatar. Built with Angular and powered by Web Speech API.

![Version](https://img.shields.io/badge/version-1.4.0-blue.svg)
![Angular](https://img.shields.io/badge/Angular-17.3.0-red.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🎯 Core Functionality
- **Voice Interaction**: Practice English by speaking with a realistic animated avatar
- **Speech Recognition**: Real-time voice recognition using Web Speech API
- **Text-to-Speech**: Natural female voice responses powered by browser TTS
- **Smart Answer Validation**: Levenshtein distance algorithm with 80% similarity threshold
- **11 Comprehensive Modules**: Covering greetings, daily routines, family, shopping, dining, weather, directions, hobbies, work, travel, and small talk
- **165 Practice Questions**: 15 questions per module for thorough practice

### 🎨 Interactive Avatar
- **Realistic Design**: Beautiful blonde avatar with blue eyes and flowing hair
- **Natural Animations**:
  - Breathing animation (calm when idle, enhanced when active)
  - Blinking eyes every 8 seconds
  - Mouth synchronization with speech
  - Head movements during conversation
  - Visual glow effects (red when listening, blue when speaking)

### 📊 Learning Experience
- **Progressive Difficulty**: Beginner to Intermediate levels
- **Module Reset**: Each module starts from question 1 when selected
- **Instant Feedback**: Real-time validation with visual indicators (✅/❌)
- **Multiple Accepted Answers**: Flexible answer matching
- **Answer Hints**: Listen to correct answer on errors
- **Score Tracking**: Track your progress with point system
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🛠️ Technology Stack

- **Framework**: Angular 17.3.0
- **Language**: TypeScript 5.2.2
- **APIs**:
  - Web Speech API (Speech Recognition)
  - Speech Synthesis API (Text-to-Speech)
  - Web Audio API (Audio Analysis)
- **Styling**: Pure CSS with animations (no framework)
- **Build Tool**: Angular CLI
- **HTTP Client**: RxJS 7.8.1

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Modern web browser with Web Speech API support (Chrome recommended)
- Microphone access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/speak_english.git
   cd speak_english
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   Navigate to http://localhost:4200
   ```

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📚 Study Plan Overview

The application includes 11 carefully designed modules:

### Beginner Level (6 Modules)
1. **Greetings & Introductions** - Basic greetings, introductions, personal info
2. **Daily Routines** - Wake up times, meals, work schedules
3. **Family & Friends** - Family members, relationships, friendships
4. **Shopping & Money** - Prices, payments, sizes, colors
5. **Food & Dining** - Ordering food, restaurants, menus
6. **Weather & Time** - Weather descriptions, seasons, time expressions

### Intermediate Level (5 Modules)
7. **Directions & Places** - Asking/giving directions, locations
8. **Hobbies & Interests** - Sports, music, movies, free time activities
9. **Work & School** - Occupation, education, colleagues
10. **Travel & Transportation** - Airport, hotels, tickets, transportation
11. **Small Talk & Conversation** - Casual chitchat, weekend plans

**Total**: 165 questions | ~220 minutes of practice

## 🎮 How to Use

1. **Select a Module**: Click on any module card below the avatar
2. **Listen**: The avatar will speak the question in English
3. **Respond**: Click "Responder" button and speak your answer
4. **Get Feedback**: Receive instant feedback on your pronunciation and answer
5. **Progress**: Must answer correctly to unlock the next question
6. **Complete**: Finish all 15 questions to complete the module

### Tips for Best Results
- Use headphones to prevent audio feedback
- Speak clearly and at normal volume
- Practice in a quiet environment
- Answer naturally - multiple variations are accepted
- Use the "Repetir" button to hear questions again
- Click "Ouvir resposta correta" if you get stuck

## 📁 Project Structure

```
speak_english/
├── src/
│   ├── app/
│   │   ├── avatar/                 # Avatar component with animations
│   │   │   ├── avatar.component.ts
│   │   │   ├── avatar.component.html
│   │   │   └── avatar.component.css
│   │   ├── modules-menu/          # Module selection sidebar
│   │   │   ├── modules-menu.component.ts
│   │   │   ├── modules-menu.component.html
│   │   │   └── modules-menu.component.css
│   │   ├── voice.service.ts       # Speech recognition & TTS service
│   │   ├── app.component.ts       # Main app component
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   └── app.module.ts
│   ├── assets/
│   │   ├── avatar_modern.svg      # Avatar SVG with animations
│   │   └── modules/               # JSON files for each module
│   │       ├── greetings.json
│   │       ├── daily-routines.json
│   │       ├── family-friends.json
│   │       ├── shopping.json
│   │       ├── restaurant.json
│   │       ├── weather-time.json
│   │       ├── directions.json
│   │       ├── hobbies.json
│   │       ├── work-school.json
│   │       ├── travel.json
│   │       └── smalltalk.json
│   ├── styles.css                 # Global styles
│   └── index.html
├── package.json
├── angular.json
├── tsconfig.json
└── README.md
```

## 🎨 Avatar Features

The avatar includes sophisticated animations:

- **Idle State**: Calm breathing (4s cycle)
- **Active State**: Enhanced breathing when listening or speaking (2.5s cycle)
- **Blinking**: Natural eye blink every 8 seconds
- **Speaking**: Mouth synchronization with TTS output
- **Listening**: Mouth movement synced with microphone input
- **Visual Feedback**:
  - Red glow when listening (1.5s pulse)
  - Blue glow when speaking (2s pulse)
- **Head Movement**: Subtle tilts and sway during speech

## 🔧 Configuration

### Voice Settings
Female voice selection is prioritized in the following order:
1. Google UK English Female
2. Google US English Female
3. Microsoft Zira
4. Samantha, Karen, Moira, Victoria, Fiona

### Answer Validation
- Similarity threshold: 80%
- Algorithm: Levenshtein distance
- Normalization: Removes punctuation, handles contractions
- Multiple answers: Accepts arrays of valid responses

## 🌐 Browser Compatibility

| Browser | Speech Recognition | Speech Synthesis | Recommended |
|---------|-------------------|------------------|-------------|
| Chrome  | ✅ Full Support   | ✅ Full Support  | ✅ Yes      |
| Edge    | ✅ Full Support   | ✅ Full Support  | ✅ Yes      |
| Firefox | ⚠️ Limited        | ✅ Full Support  | ⚠️ Partial  |
| Safari  | ⚠️ Limited        | ✅ Full Support  | ⚠️ Partial  |

**Recommended**: Google Chrome for the best experience

## 📝 Adding New Modules

1. Create a new JSON file in `src/assets/modules/`:

```json
{
  "moduleId": "your-module-id",
  "title": "Module Title",
  "level": "Iniciante",
  "dialogs": [
    {
      "question": "English question?",
      "translation": "Pergunta em português?",
      "answer": ["Answer 1", "Answer 2"]
    }
  ]
}
```

2. Add module to `src/app/app.component.ts`:

```typescript
modules: ConversationModule[] = [
  // ... existing modules
  {
    id: 'your-module-id',
    title: 'Module Title',
    description: 'Module description',
    level: 'Iniciante',
    lessons: 15,
    duration: '20 min'
  },
]
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Avatar design: Custom SVG with gradient effects
- Speech APIs: Web Speech API and Speech Synthesis API
- Icons: Material Design Icons (inline SVG)
- Animations: Pure CSS keyframes

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check browser console for errors
- Ensure microphone permissions are granted
- Try using Google Chrome for best compatibility

## 🔮 Future Enhancements

- [ ] User progress tracking with localStorage
- [ ] Custom module creation interface
- [ ] Multiple avatar options
- [ ] Pronunciation scoring
- [ ] Offline mode support
- [ ] Multi-language support
- [ ] Social features (leaderboards, sharing)
- [ ] Mobile app versions (iOS/Android)

---

**Made with ❤️ for English learners worldwide**

*Version 1.4.0 - Last updated: January 2026*
