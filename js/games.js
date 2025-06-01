// ================================
// GAMES ENGINE
// ================================

class GameEngine {
  constructor() {
    this.currentGame = null;
    this.gameData = null;
    this.score = 0;
    this.timeLeft = 0;
    this.timer = null;
    this.gameState = 'idle'; // idle, playing, paused, finished
    this.currentQuestion = 0;
    this.totalQuestions = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.gameStartTime = null;
    this.gameEndTime = null;
  }

  // Start a new game
  startGame(gameType, vocabulary) {
    this.currentGame = gameType;
    this.gameData = this.prepareGameData(vocabulary, gameType);
    this.score = 0;
    this.currentQuestion = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.gameStartTime = Date.now();
    this.gameState = 'playing';

    const config = GAME_CONFIG[gameType];
    if (config.timeLimit) {
      this.timeLeft = config.timeLimit;
      this.startTimer();
    }

    this.renderGame();
    this.updateGameStats();
  }

  // Prepare game-specific data
  prepareGameData(vocabulary, gameType) {
    const shuffled = this.shuffleArray([...vocabulary]);
    const gameVocab = shuffled.slice(0, 20); // Limit to 20 questions per game

    switch (gameType) {
      case 'quiz':
        return this.prepareQuizData(gameVocab, vocabulary);
      case 'matching':
        return this.prepareMatchingData(gameVocab);
      case 'memory':
        return this.prepareMemoryData(gameVocab);
      case 'listening':
        return this.prepareListeningData(gameVocab);
      case 'typing':
        return this.prepareTypingData(gameVocab);
      default:
        return gameVocab;
    }
  }

  // Quiz game data preparation
  prepareQuizData(gameVocab, allVocab) {
    return gameVocab.map(word => {
      const wrongOptions = this.shuffleArray(
        allVocab.filter(w => w.id !== word.id)
      ).slice(0, 3).map(w => w.meaning);
      
      const options = this.shuffleArray([word.meaning, ...wrongOptions]);
      
      return {
        ...word,
        options,
        correctAnswer: word.meaning
      };
    });
  }

  // Matching game data preparation
  prepareMatchingData(gameVocab) {
    const pairs = gameVocab.slice(0, 6).map(word => ({
      word: word.word,
      meaning: word.meaning,
      id: word.id
    }));
    
    return {
      words: this.shuffleArray(pairs.map(p => ({ text: p.word, type: 'word', id: p.id }))),
      meanings: this.shuffleArray(pairs.map(p => ({ text: p.meaning, type: 'meaning', id: p.id })))
    };
  }

  // Memory game data preparation
  prepareMemoryData(gameVocab) {
    const pairs = gameVocab.slice(0, 6);
    const cards = [];
    
    pairs.forEach(word => {
      cards.push({ type: 'word', text: word.word, id: word.id, matched: false });
      cards.push({ type: 'meaning', text: word.meaning, id: word.id, matched: false });
    });
    
    return this.shuffleArray(cards);
  }

  // Listening game data preparation
  prepareListeningData(gameVocab) {
    return gameVocab.map(word => ({
      ...word,
      audioUrl: `${CONFIG.AUDIO_PATH}${currentLanguage}/${word.word.toLowerCase()}.mp3`
    }));
  }

  // Typing game data preparation
  prepareTypingData(gameVocab) {
    return gameVocab.map(word => ({
      ...word,
      userInput: '',
      hints: this.generateHints(word.word)
    }));
  }

  // Generate hints for typing game
  generateHints(word) {
    const hints = [];
    hints.push(`${word.length} অক্ষর`);
    hints.push(`"${word.charAt(0)}" দিয়ে শুরু`);
    if (word.length > 3) {
      hints.push(`"${word.slice(-1)}" দিয়ে শেষ`);
    }
    return hints;
  }

  // Timer functions
  startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft -= 1000;
      this.updateTimer();
      if (this.timeLeft <= 0) {
        this.timeUp();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  timeUp() {
    this.stopTimer();
    this.gameState = 'finished';
    this.showTimeUpMessage();
  }

  // Answer checking
  checkAnswer(userAnswer, correctAnswer, gameType) {
    const isCorrect = this.isAnswerCorrect(userAnswer, correctAnswer, gameType);
    const config = GAME_CONFIG[gameType];
    
    if (isCorrect) {
      this.correctAnswers++;
      this.score += config.pointsPerCorrect;
      this.showCorrectFeedback();
    } else {
      this.wrongAnswers++;
      this.score += config.pointsPerWrong;
      this.showWrongFeedback(correctAnswer);
    }

    this.updateGameStats();
    this.moveToNextQuestion();
  }

  isAnswerCorrect(userAnswer, correctAnswer, gameType) {
    switch (gameType) {
      case 'typing':
        return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
      case 'listening':
        return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
      default:
        return userAnswer === correctAnswer;
    }
  }

  // Game navigation
  moveToNextQuestion() {
    setTimeout(() => {
      this.currentQuestion++;
      if (this.currentQuestion >= this.gameData.length) {
        this.finishGame();
      } else {
        this.renderCurrentQuestion();
      }
    }, 1500);
  }

  finishGame() {
    this.gameState = 'finished';
    this.gameEndTime = Date.now();
    this.stopTimer();
    this.showGameResults();
    this.saveGameStats();
  }

  // Rendering functions
  renderGame() {
    const gameArea = document.getElementById('game-area');
    const gameContainer = document.getElementById('game-container');
    const gameTitle = document.getElementById('current-game-title');
    
    if (!gameArea || !gameContainer || !gameTitle) return;

    gameArea.style.display = 'block';
    gameTitle.textContent = GAME_CONFIG[this.currentGame].name;
    
    this.totalQuestions = this.gameData.length || (this.currentGame === 'matching' ? 6 : 12);
    this.renderCurrentQuestion();
  }

  renderCurrentQuestion() {
    switch (this.currentGame) {
      case 'flashcard':
        this.renderFlashcard();
        break;
      case 'quiz':
        this.renderQuiz();
        break;
      case 'matching':
        this.renderMatching();
        break;
      case 'memory':
        this.renderMemory();
        break;
      case 'listening':
        this.renderListening();
        break;
      case 'typing':
        this.renderTyping();
        break;
    }
  }

  // Flashcard rendering
  renderFlashcard() {
    const container = document.getElementById('game-container');
    const currentWord = this.gameData[this.currentQuestion];
    
    container.innerHTML = `
      <div class="flashcard-container">
        <div class="flashcard" id="flashcard">
          <div class="flashcard-front">
            <div class="flashcard-word">${currentWord.word}</div>
            <div class="flashcard-pronunciation">[${currentWord.pronunciation}]</div>
            <div class="flashcard-category">${currentWord.category}</div>
          </div>
          <div class="flashcard-back">
            <div class="flashcard-meaning">${currentWord.meaning}</div>
            <div class="flashcard-example">${currentWord.example}</div>
          </div>
        </div>
        <div class="flashcard-controls">
          <button class="difficulty-btn easy" onclick="gameEngine.handleFlashcardAnswer('easy')">
            <div class="difficulty-icon">😊</div>
            <div class="difficulty-label">সহজ</div>
          </button>
          <button class="difficulty-btn medium" onclick="gameEngine.handleFlashcardAnswer('medium')">
            <div class="difficulty-icon">😐</div>
            <div class="difficulty-label">মাঝারি</div>
          </button>
          <button class="difficulty-btn hard" onclick="gameEngine.handleFlashcardAnswer('hard')">
            <div class="difficulty-icon">😰</div>
            <div class="difficulty-label">কঠিন</div>
          </button>
        </div>
      </div>
    `;

    // Add click to flip functionality
    const flashcard = document.getElementById('flashcard');
    flashcard.addEventListener('click', () => {
      flashcard.classList.toggle('flipped');
    });
  }

  handleFlashcardAnswer(difficulty) {
    const points = { easy: 20, medium: 10, hard: 5 };
    this.score += points[difficulty];
    this.correctAnswers++;
    this.updateGameStats();
    this.moveToNextQuestion();
  }

  // Quiz rendering
  renderQuiz() {
    const container = document.getElementById('game-container');
    const currentQuestion = this.gameData[this.currentQuestion];
    
    container.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-progress">
          <div class="quiz-question-number">প্রশ্ন ${this.currentQuestion + 1}/${this.totalQuestions}</div>
          <div class="quiz-timer" id="quiz-timer">${this.formatTime(this.timeLeft)}</div>
        </div>
        <div class="quiz-question">
          <h3>এই শব্দের অর্থ কী?</h3>
          <div class="quiz-word">${currentQuestion.word}</div>
          <div class="quiz-pronunciation">[${currentQuestion.pronunciation}]</div>
        </div>
        <div class="quiz-options">
          ${currentQuestion.options.map((option, index) => 
            `<button class="quiz-option" onclick="gameEngine.handleQuizAnswer('${option}')">${option}</button>`
          ).join('')}
        </div>
      </div>
    `;
  }

  handleQuizAnswer(selectedAnswer) {
    const currentQuestion = this.gameData[this.currentQuestion];
    this.checkAnswer(selectedAnswer, currentQuestion.correctAnswer, 'quiz');
  }

  // Matching rendering
  renderMatching() {
    const container = document.getElementById('game-container');
    
    container.innerHTML = `
      <div class="matching-container">
        <div class="matching-grid">
          <div class="matching-column">
            <h4>শব্দ</h4>
            <div class="matching-items" id="words-column">
              ${this.gameData.words.map(item => 
                `<div class="matching-item" data-id="${item.id}" data-type="word" onclick="gameEngine.selectMatchingItem(this)">${item.text}</div>`
              ).join('')}
            </div>
          </div>
          <div class="matching-column">
            <h4>অর্থ</h4>
            <div class="matching-items" id="meanings-column">
              ${this.gameData.meanings.map(item => 
                `<div class="matching-item" data-id="${item.id}" data-type="meaning" onclick="gameEngine.selectMatchingItem(this)">${item.text}</div>`
              ).join('')}
            </div>
          </div>
        </div>
        <div class="matching-score">
          <div class="score-text">মিল: ${this.correctAnswers}/6</div>
        </div>
      </div>
    `;
  }

  selectMatchingItem(element) {
    const previousSelected = document.querySelector('.matching-item.selected');
    
    if (previousSelected) {
      if (previousSelected === element) {
        element.classList.remove('selected');
        return;
      }
      
      const id1 = previousSelected.getAttribute('data-id');
      const id2 = element.getAttribute('data-id');
      const type1 = previousSelected.getAttribute('data-type');
      const type2 = element.getAttribute('data-type');
      
      if (id1 === id2 && type1 !== type2) {
        // Correct match
        previousSelected.classList.add('matched');
        element.classList.add('matched');
        previousSelected.classList.remove('selected');
        this.correctAnswers++;
        this.score += GAME_CONFIG.matching.pointsPerCorrect;
        
        if (this.correctAnswers >= 6) {
          setTimeout(() => this.finishGame(), 1000);
        }
      } else {
        // Wrong match
        previousSelected.classList.add('wrong');
        element.classList.add('wrong');
        this.wrongAnswers++;
        this.score += GAME_CONFIG.matching.pointsPerWrong;
        
        setTimeout(() => {
          previousSelected.classList.remove('wrong', 'selected');
          element.classList.remove('wrong');
        }, 1000);
      }
      this.updateGameStats();
    } else {
      element.classList.add('selected');
    }
  }

  // Memory game rendering
  renderMemory() {
    const container = document.getElementById('game-container');
    
    container.innerHTML = `
      <div class="memory-container">
        <div class="memory-stats">
          <div class="memory-stat">
            <div class="memory-stat-value">${this.correctAnswers}</div>
            <div class="memory-stat-label">জোড়া</div>
          </div>
          <div class="memory-stat">
            <div class="memory-stat-value">${this.wrongAnswers}</div>
            <div class="memory-stat-label">ভুল</div>
          </div>
          <div class="memory-stat">
            <div class="memory-stat-value" id="memory-timer">${this.formatTime(this.timeLeft)}</div>
            <div class="memory-stat-label">সময়</div>
          </div>
        </div>
        <div class="memory-grid">
          ${this.gameData.map((card, index) => 
            `<div class="memory-card" data-index="${index}" onclick="gameEngine.flipMemoryCard(${index})">${card.matched ? card.text : ''}</div>`
          ).join('')}
        </div>
      </div>
    `;
  }

  flipMemoryCard(index) {
    const card = document.querySelector(`[data-index="${index}"]`);
    const cardData = this.gameData[index];
    
    if (cardData.matched || card.classList.contains('flipped')) return;
    
    card.classList.add('flipped');
    card.textContent = cardData.text;
    
    const flippedCards = document.querySelectorAll('.memory-card.flipped:not(.matched)');
    
    if (flippedCards.length === 2) {
      setTimeout(() => this.checkMemoryMatch(flippedCards), 1000);
    }
  }

  checkMemoryMatch(flippedCards) {
    const card1Index = parseInt(flippedCards[0].getAttribute('data-index'));
    const card2Index = parseInt(flippedCards[1].getAttribute('data-index'));
    const card1Data = this.gameData[card1Index];
    const card2Data = this.gameData[card2Index];
    
    if (card1Data.id === card2Data.id) {
      // Match found
      flippedCards.forEach(card => {
        card.classList.add('matched');
        card.classList.remove('flipped');
      });
      this.gameData[card1Index].matched = true;
      this.gameData[card2Index].matched = true;
      this.correctAnswers++;
      this.score += GAME_CONFIG.memory.pointsPerCorrect;
      
      if (this.correctAnswers >= 6) {
        setTimeout(() => this.finishGame(), 500);
      }
    } else {
      // No match
      flippedCards.forEach(card => {
        card.classList.add('wrong');
        setTimeout(() => {
          card.classList.remove('flipped', 'wrong');
          card.textContent = '';
        }, 500);
      });
      this.wrongAnswers++;
      this.score += GAME_CONFIG.memory.pointsPerWrong;
    }
    this.updateGameStats();
  }

  // Listening game rendering
  renderListening() {
    const container = document.getElementById('game-container');
    const currentWord = this.gameData[this.currentQuestion];
    
    container.innerHTML = `
      <div class="listening-container">
        <div class="listening-player">
          <div class="listening-icon">🎧</div>
          <div class="listening-word" style="display: none;">${currentWord.word}</div>
          <div class="listening-controls">
            <button class="audio-btn" onclick="gameEngine.playAudio('${currentWord.audioUrl}')">
              <i class="fas fa-play"></i>
            </button>
            <button class="audio-btn" onclick="gameEngine.showListeningHint()">
              <i class="fas fa-lightbulb"></i>
            </button>
          </div>
        </div>
        <input type="text" class="listening-input" id="listening-input" placeholder="যা শুনেছেন তা টাইপ করুন..." onkeypress="if(event.key==='Enter') gameEngine.submitListeningAnswer()">
        <button class="listening-submit" onclick="gameEngine.submitListeningAnswer()">উত্তর দিন</button>
      </div>
    `;
    
    // Auto-play audio
    this.playAudio(currentWord.audioUrl);
  }

  playAudio(audioUrl) {
    // For demo purposes, we'll show the word briefly
    const wordElement = document.querySelector('.listening-word');
    if (wordElement) {
      wordElement.style.display = 'block';
      setTimeout(() => {
        wordElement.style.display = 'none';
      }, 2000);
    }
    
    showToast('অডিও চালানো হচ্ছে...', 'info', 2000);
  }

  showListeningHint() {
    const currentWord = this.gameData[this.currentQuestion];
    const hint = `"${currentWord.word.charAt(0)}" দিয়ে শুরু হয় (${currentWord.word.length} অক্ষর)`;
    showToast(hint, 'info', 3000);
  }

  submitListeningAnswer() {
    const input = document.getElementById('listening-input');
    const userAnswer = input.value.trim();
    const currentWord = this.gameData[this.currentQuestion];
    
    if (!userAnswer) {
      showToast('অনুগ্রহ করে একটি উত্তর টাইপ করুন', 'warning');
      return;
    }
    
    this.checkAnswer(userAnswer, currentWord.word, 'listening');
  }

  // Typing game rendering
  renderTyping() {
    const container = document.getElementById('game-container');
    const currentWord = this.gameData[this.currentQuestion];
    
    container.innerHTML = `
      <div class="listening-container">
        <div class="listening-player">
          <div class="listening-icon">⌨️</div>
          <div class="flashcard-meaning">${currentWord.meaning}</div>
          <div class="flashcard-example" style="font-size: 0.9em; margin-top: 10px;">${currentWord.example}</div>
        </div>
        <div style="margin: 20px 0;">
          <div style="font-size: 0.9em; color: #666; margin-bottom: 10px;">
            হিন্ট: ${currentWord.hints.join(', ')}
          </div>
        </div>
        <input type="text" class="listening-input" id="typing-input" placeholder="সঠিক বানান টাইপ করুন..." onkeypress="if(event.key==='Enter') gameEngine.submitTypingAnswer()">
        <button class="listening-submit" onclick="gameEngine.submitTypingAnswer()">চেক করুন</button>
      </div>
    `;
  }

  submitTypingAnswer() {
    const input = document.getElementById('typing-input');
    const userAnswer = input.value.trim();
    const currentWord = this.gameData[this.currentQuestion];
    
    if (!userAnswer) {
      showToast('অনুগ্রহ করে বানান টাইপ করুন', 'warning');
      return;
    }
    
    this.checkAnswer(userAnswer, currentWord.word, 'typing');
  }

  // Feedback functions
  showCorrectFeedback() {
    showToast('সঠিক! 🎉', 'success', 1500);
  }

  showWrongFeedback(correctAnswer) {
    showToast(`ভুল! সঠিক উত্তর: ${correctAnswer}`, 'error', 2000);
  }

  showTimeUpMessage() {
    showToast('সময় শেষ! ⏰', 'warning', 2000);
    this.finishGame();
  }

  // Game results
  showGameResults() {
    const accuracy = Math.round((this.correctAnswers / (this.correctAnswers + this.wrongAnswers)) * 100) || 0;
    const timeTaken = Math.round((this.gameEndTime - this.gameStartTime) / 1000);
    
    const resultsHTML = `
      <div class="game-results">
        <h3>🎯 গেম সম্পন্ন!</h3>
        <div class="results-stats">
          <div class="result-item">
            <div class="result-value">${this.score}</div>
            <div class="result-label">স্কোর</div>
          </div>
          <div class="result-item">
            <div class="result-value">${accuracy}%</div>
            <div class="result-label">সঠিকতা</div>
          </div>
          <div class="result-item">
            <div class="result-value">${this.correctAnswers}</div>
            <div class="result-label">সঠিক</div>
          </div>
          <div class="result-item">
            <div class="result-value">${timeTaken}s</div>
            <div class="result-label">সময়</div>
          </div>
        </div>
        <div class="results-actions">
          <button class="game-btn" onclick="gameEngine.playAgain()">আবার খেলুন</button>
          <button class="game-btn" onclick="gameEngine.backToGames()">গেমস মেনু</button>
        </div>
      </div>
    `;
    
    document.getElementById('game-container').innerHTML = resultsHTML;
  }

  // Game actions
  playAgain() {
    if (currentLanguageData && this.currentGame) {
      this.startGame(this.currentGame, currentLanguageData);
    }
  }

  backToGames() {
    document.getElementById('game-area').style.display = 'none';
    showSection('game-content');
  }

  // Stats and progress
  updateGameStats() {
    const scoreElement = document.getElementById('current-score');
    if (scoreElement) {
      scoreElement.textContent = this.score;
    }
  }

  updateTimer() {
    const timerElements = ['quiz-timer', 'memory-timer'];
    timerElements.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = this.formatTime(this.timeLeft);
      }
    });
  }

  formatTime(milliseconds) {
    const seconds = Math.max(0, Math.floor(milliseconds / 1000));
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  saveGameStats() {
    const stats = loadFromStorage(CONFIG.STORAGE_KEYS.gameStats, {});
    const gameType = this.currentGame;
    
    if (!stats[gameType]) {
      stats[gameType] = {
        played: 0,
        bestScore: 0,
        totalScore: 0,
        bestAccuracy: 0,
        totalCorrect: 0,
        totalWrong: 0
      };
    }
    
    const accuracy = Math.round((this.correctAnswers / (this.correctAnswers + this.wrongAnswers)) * 100) || 0;
    
    stats[gameType].played++;
    stats[gameType].bestScore = Math.max(stats[gameType].bestScore, this.score);
    stats[gameType].totalScore += this.score;
    stats[gameType].bestAccuracy = Math.max(stats[gameType].bestAccuracy, accuracy);
    stats[gameType].totalCorrect += this.correctAnswers;
    stats[gameType].totalWrong += this.wrongAnswers;
    
    saveToStorage(CONFIG.STORAGE_KEYS.gameStats, stats);
    
    // Update high score display
    const highScoreElement = document.getElementById('high-score');
    if (highScoreElement) {
      highScoreElement.textContent = stats[gameType].bestScore;
    }
  }

  // Utility functions
  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
}

// ================================
// GLOBAL GAME ENGINE INSTANCE
// ================================

const gameEngine = new GameEngine();

// ================================
// GAME EVENT LISTENERS
// ================================

document.addEventListener('DOMContentLoaded', function() {
  // Game card click handlers
  const gameCards = document.querySelectorAll('.game-card');
  gameCards.forEach(card => {
    card.addEventListener('click', function() {
      const gameType = this.getAttribute('data-game');
      if (currentLanguageData && currentLanguageData.length > 0) {
        gameEngine.startGame(gameType, currentLanguageData);
      } else {
        showToast('প্রথমে একটি দেশ নির্বাচন করুন', 'warning');
      }
    });
  });

  // Close game button
  const closeGameBtn = document.getElementById('close-game');
  if (closeGameBtn) {
    closeGameBtn.addEventListener('click', function() {
      gameEngine.backToGames();
    });
  }

  // Game control buttons
  const hintBtn = document.getElementById('hint-btn');
  if (hintBtn) {
    hintBtn.addEventListener('click', function() {
      if (gameEngine.currentGame === 'listening') {
        gameEngine.showListeningHint();
      } else {
        showToast('হিন্ট উপলব্ধ নেই', 'info');
      }
    });
  }

  const skipBtn = document.getElementById('skip-btn');
  if (skipBtn) {
    skipBtn.addEventListener('click', function() {
      if (gameEngine.gameState === 'playing') {
        gameEngine.wrongAnswers++;
        gameEngine.score += GAME_CONFIG[gameEngine.currentGame].pointsPerWrong;
        gameEngine.updateGameStats();
        gameEngine.moveToNextQuestion();
      }
    });
  }

  const repeatAudioBtn = document.getElementById('repeat-audio-btn');
  if (repeatAudioBtn) {
    repeatAudioBtn.addEventListener('click', function() {
      if (gameEngine.currentGame === 'listening' && gameEngine.gameData) {
        const currentWord = gameEngine.gameData[gameEngine.currentQuestion];
        gameEngine.playAudio(currentWord.audioUrl);
      }
    });
  }
});

// ================================
// KEYBOARD SHORTCUTS
// ================================

document.addEventListener('keydown', function(event) {
  if (gameEngine.gameState !== 'playing') return;

  switch (event.key) {
    case 'Escape':
      gameEngine.backToGames();
      break;
    case ' ':
      if (gameEngine.currentGame === 'flashcard') {
        const flashcard = document.getElementById('flashcard');
        if (flashcard) {
          flashcard.classList.toggle('flipped');
        }
      }
      event.preventDefault();
      break;
    case '1':
    case '2':
    case '3':
    case '4':
      if (gameEngine.currentGame === 'quiz') {
        const options = document.querySelectorAll('.quiz-option');
        const index = parseInt(event.key) - 1;
        if (options[index]) {
          options[index].click();
        }
      }
      break;
  }
});

// ================================
// AUDIO SYSTEM (Mock Implementation)
// ================================

class AudioSystem {
  constructor() {
    this.currentAudio = null;
    this.audioCache = new Map();
  }

  async playWord(word, language) {
    try {
      // In a real implementation, this would play actual audio files
      // For demo purposes, we'll use Web Speech API or show visual feedback
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = this.getLanguageCode(language);
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
        return true;
      } else {
        // Fallback: show the word briefly
        this.showAudioFeedback(word);
        return true;
      }
    } catch (error) {
      console.error('Audio playback failed:', error);
      this.showAudioFeedback(word);
      return false;
    }
  }

  getLanguageCode(language) {
    const languageCodes = {
      'german': 'de-DE',
      'french': 'fr-FR',
      'spanish': 'es-ES',
      'italian': 'it-IT',
      'portuguese': 'pt-PT',
      'dutch': 'nl-NL',
      'polish': 'pl-PL',
      'czech': 'cs-CZ',
      'hungarian': 'hu-HU',
      'romanian': 'ro-RO',
      'bulgarian': 'bg-BG',
      'greek': 'el-GR',
      'estonian': 'et-EE',
      'latvian': 'lv-LV',
      'lithuanian': 'lt-LT',
      'finnish': 'fi-FI',
      'swedish': 'sv-SE',
      'danish': 'da-DK',
      'norwegian': 'no-NO',
      'icelandic': 'is-IS',
      'russian': 'ru-RU'
    };
    return languageCodes[language] || 'en-US';
  }

  showAudioFeedback(word) {
    showToast(`🔊 ${word}`, 'info', 2000);
  }

  stopAudio() {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }
}

const audioSystem = new AudioSystem();

// ================================
// GAME UTILITIES
// ================================

// Enhanced pronunciation generator
function generatePronunciation(word, language) {
  const rules = {
    german: {
      'ä': 'এ', 'ö': 'ও', 'ü': 'উ', 'ß': 'স',
      'ch': 'খ', 'sch': 'শ', 'ei': 'আই', 'au': 'আও',
      'eu': 'অয়', 'ie': 'ই', 'tion': 'সিওন'
    },
    french: {
      'è': 'এ', 'é': 'এ', 'ê': 'এ', 'ç': 'স',
      'ou': 'উ', 'eau': 'ও', 'ai': 'এ', 'oi': 'ওয়া',
      'an': 'আঁ', 'en': 'আঁ', 'in': 'আঁ', 'on': 'ওঁ'
    },
    spanish: {
      'ñ': 'নিয়', 'll': 'ইয়', 'rr': 'র্র', 'j': 'খ',
      'que': 'কে', 'qui': 'কি', 'gue': 'গে', 'gui': 'গি'
    }
  };

  let pronunciation = word.toLowerCase();
  const languageRules = rules[language] || {};

  Object.entries(languageRules).forEach(([pattern, replacement]) => {
    pronunciation = pronunciation.replace(new RegExp(pattern, 'g'), replacement);
  });

  return pronunciation;
}

// Word difficulty calculator
function calculateWordDifficulty(word) {
  let difficulty = 'basic';
  
  if (word.length > 8) difficulty = 'intermediate';
  if (word.length > 12) difficulty = 'advanced';
  
  // Check for special characters or complex patterns
  if (/[äöüßñçñáéíóúàèìòù]/.test(word)) {
    difficulty = difficulty === 'basic' ? 'intermediate' : 'advanced';
  }
  
  return difficulty;
}

// Game recommendation system
function recommendGame(userStats, vocabulary) {
  const stats = userStats || {};
  const totalWords = vocabulary.length;
  const learnedWords = vocabulary.filter(w => w.learned).length;
  const progressPercent = (learnedWords / totalWords) * 100;

  if (progressPercent < 25) {
    return ['flashcard', 'quiz'];
  } else if (progressPercent < 50) {
    return ['quiz', 'listening', 'typing'];
  } else if (progressPercent < 75) {
    return ['matching', 'memory', 'listening'];
  } else {
    return ['memory', 'typing', 'listening'];
  }
}

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GameEngine,
    audioSystem,
    generatePronunciation,
    calculateWordDifficulty,
    recommendGame
  };
}
