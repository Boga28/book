# Vocabulary Enrichment - Usage Examples

## Real-World Application Examples

### Example 1: Quiz Application Integration

```javascript
// Load enriched book data
const fs = require('fs');
const booksData = JSON.parse(fs.readFileSync('books_enriched.json', 'utf8'));

// Get vocabulary for a specific book
function getBookVocabulary(bookId) {
  const book = booksData.meditasyonlar.find(b => b.id === bookId);
  return book.hardWord.vocabulary;
}

// Filter by difficulty level
function getVocabularyByLevel(vocabulary, level) {
  return vocabulary.filter(word => word.difficulty === level);
}

// Example: Get B1 level words from book #198
const vocab = getBookVocabulary("198");
const b1Words = getVocabularyByLevel(vocab, "B1");

console.log(`Found ${b1Words.length} B1 level words`);
b1Words.forEach(word => {
  console.log(`- ${word.word}: ${word.definition}`);
});
```

### Example 2: Typing Practice Application

```javascript
// Generate typing practice text with word variants
function generateTypingPractice(word, wordData) {
  const variants = [word, ...wordData.variants];
  
  return {
    instruction: `Type the CORRECT standard form from these variants: ${variants.join(', ')}`,
    correctAnswer: word,
    variants: variants,
    hint: wordData.definition,
    difficulty: wordData.difficulty
  };
}

// Example usage
const timeWord = {
  word: "a.m.",
  variants: ["A.M.", "am", "AM"],
  definition: "before noon",
  difficulty: "A1"
};

const practice = generateTypingPractice("a.m.", timeWord);
console.log(practice);

// Output:
// {
//   instruction: "Type the CORRECT standard form from these variants: a.m., A.M., am, AM",
//   correctAnswer: "a.m.",
//   variants: ["a.m.", "A.M.", "am", "AM"],
//   hint: "before noon",
//   difficulty: "A1"
// }
```

### Example 3: Flashcard Application

```javascript
// Generate flashcard data
function createFlashcard(wordData) {
  return {
    front: {
      word: wordData.word,
      pronunciation: wordData.pronunciation,
      partOfSpeech: wordData.partOfSpeech
    },
    back: {
      definition: wordData.definition,
      example: wordData.exampleSentence,
      synonyms: wordData.synonyms,
      category: wordData.category
    },
    metadata: {
      difficulty: wordData.difficulty,
      variants: wordData.variants
    }
  };
}

// Example: Create flashcard for "anarchist"
const anarchistData = {
  word: "anarchist",
  pronunciation: "/ˈænəkɪst/",
  partOfSpeech: "noun",
  definition: "a person who believes in or tries to bring about anarchy",
  exampleSentence: "The anarchist refused to follow government rules.",
  synonyms: ["rebel", "revolutionary", "insurgent"],
  category: "politics",
  difficulty: "C1",
  variants: ["anarchis"]
};

const flashcard = createFlashcard(anarchistData);
```

### Example 4: Progress Tracking System

```javascript
// Track student progress with vocabulary
class VocabularyProgress {
  constructor(studentId) {
    this.studentId = studentId;
    this.masteredWords = new Set();
    this.learningWords = new Set();
  }
  
  // Add word to learning list
  startLearning(word) {
    this.learningWords.add(word);
  }
  
  // Mark word as mastered
  masterWord(word) {
    this.learningWords.delete(word);
    this.masteredWords.add(word);
  }
  
  // Get recommended words based on difficulty
  getRecommendedWords(vocabulary, currentLevel) {
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levelOrder.indexOf(currentLevel);
    
    // Recommend words at current level and one level up
    const targetLevels = [
      levelOrder[currentIndex],
      levelOrder[currentIndex + 1]
    ].filter(Boolean);
    
    return vocabulary.filter(word => 
      targetLevels.includes(word.difficulty) &&
      !this.masteredWords.has(word.word) &&
      !this.learningWords.has(word.word)
    );
  }
}

// Usage
const progress = new VocabularyProgress("student123");
progress.startLearning("anarchist");
progress.masterWord("queen");

const recommended = progress.getRecommendedWords(vocabulary, "B1");
```

### Example 5: Adaptive Quiz System

```javascript
// Adaptive difficulty quiz system
class AdaptiveQuiz {
  constructor(vocabulary) {
    this.vocabulary = vocabulary;
    this.correctAnswers = 0;
    this.totalQuestions = 0;
    this.currentDifficulty = "A2";
  }
  
  // Calculate accuracy
  getAccuracy() {
    return this.totalQuestions > 0 
      ? (this.correctAnswers / this.totalQuestions) * 100 
      : 0;
  }
  
  // Adjust difficulty based on performance
  adjustDifficulty() {
    const accuracy = this.getAccuracy();
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levelOrder.indexOf(this.currentDifficulty);
    
    if (accuracy > 80 && currentIndex < levelOrder.length - 1) {
      // Increase difficulty
      this.currentDifficulty = levelOrder[currentIndex + 1];
    } else if (accuracy < 50 && currentIndex > 0) {
      // Decrease difficulty
      this.currentDifficulty = levelOrder[currentIndex - 1];
    }
  }
  
  // Get next question at appropriate difficulty
  getNextQuestion() {
    const wordsAtLevel = this.vocabulary.filter(
      w => w.difficulty === this.currentDifficulty
    );
    
    if (wordsAtLevel.length === 0) return null;
    
    const randomWord = wordsAtLevel[
      Math.floor(Math.random() * wordsAtLevel.length)
    ];
    
    return {
      word: randomWord.word,
      question: `What does "${randomWord.word}" mean?`,
      options: this.generateOptions(randomWord),
      correctAnswer: randomWord.definition,
      difficulty: this.currentDifficulty
    };
  }
  
  // Generate multiple choice options
  generateOptions(correctWord) {
    const wrongOptions = this.vocabulary
      .filter(w => w.word !== correctWord.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.definition);
    
    return [correctWord.definition, ...wrongOptions]
      .sort(() => Math.random() - 0.5);
  }
  
  // Record answer
  recordAnswer(isCorrect) {
    this.totalQuestions++;
    if (isCorrect) this.correctAnswers++;
    
    // Adjust difficulty after every 5 questions
    if (this.totalQuestions % 5 === 0) {
      this.adjustDifficulty();
    }
  }
}

// Usage
const quiz = new AdaptiveQuiz(vocabulary);
const question = quiz.getNextQuestion();
quiz.recordAnswer(true);
```

### Example 6: Category-Based Learning

```javascript
// Organize vocabulary by categories for themed learning
function organizeByCategory(vocabulary) {
  const categories = {};
  
  vocabulary.forEach(word => {
    const category = word.category;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(word);
  });
  
  return categories;
}

// Get category statistics
function getCategoryStats(vocabulary) {
  const organized = organizeByCategory(vocabulary);
  
  return Object.entries(organized).map(([category, words]) => ({
    category: category,
    wordCount: words.length,
    averageDifficulty: calculateAverageDifficulty(words),
    examples: words.slice(0, 3).map(w => w.word)
  }));
}

function calculateAverageDifficulty(words) {
  const levelScores = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
  const totalScore = words.reduce((sum, word) => 
    sum + (levelScores[word.difficulty] || 0), 0
  );
  const avgScore = totalScore / words.length;
  
  // Convert back to level
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  return levels[Math.round(avgScore) - 1] || 'B1';
}

// Usage
const stats = getCategoryStats(vocabulary);
console.log('Category Statistics:');
stats.forEach(stat => {
  console.log(`${stat.category}: ${stat.wordCount} words (${stat.averageDifficulty})`);
  console.log(`  Examples: ${stat.examples.join(', ')}`);
});
```

### Example 7: Mobile App Data Format

```javascript
// Convert enriched data to mobile-friendly format
function prepareForMobile(vocabulary) {
  return vocabulary.map(word => ({
    id: word.word,
    w: word.word,                    // Shortened for bandwidth
    v: word.variants,
    d: word.definition,
    e: word.exampleSentence,
    l: word.difficulty,
    p: word.pronunciation,
    s: word.synonyms,
    c: word.category,
    pos: word.partOfSpeech
  }));
}

// Optimize by difficulty level (only send needed level)
function getMobileLevelData(vocabulary, levels = ['A1', 'A2', 'B1']) {
  const filtered = vocabulary.filter(w => levels.includes(w.difficulty));
  return {
    version: "1.0",
    levels: levels,
    count: filtered.length,
    words: prepareForMobile(filtered),
    lastUpdate: new Date().toISOString()
  };
}

// Usage
const beginnerData = getMobileLevelData(vocabulary, ['A1', 'A2']);
// Send to mobile app via API
```

### Example 8: REST API Endpoint

```javascript
// Express.js API endpoint example
const express = require('express');
const app = express();

// Endpoint: Get vocabulary for a book
app.get('/api/books/:id/vocabulary', (req, res) => {
  const bookId = req.params.id;
  const level = req.query.level;
  
  const book = booksData.meditasyonlar.find(b => b.id === bookId);
  
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  let vocabulary = book.hardWord.vocabulary;
  
  // Filter by level if specified
  if (level) {
    vocabulary = vocabulary.filter(w => w.difficulty === level);
  }
  
  res.json({
    bookId: book.id,
    bookTitle: book.baslik,
    bookLevel: book.aciklama,
    vocabulary: vocabulary,
    stats: {
      totalWords: book.hardWord.textAnalysis.totalWords,
      uniqueWords: book.hardWord.textAnalysis.uniqueWords,
      vocabularyCount: vocabulary.length
    }
  });
});

// Endpoint: Get random quiz questions
app.get('/api/quiz/generate', (req, res) => {
  const count = parseInt(req.query.count) || 5;
  const type = req.query.type || 'all';
  const level = req.query.level;
  
  let vocab = getAllVocabulary();
  
  if (level) {
    vocab = vocab.filter(w => w.difficulty === level);
  }
  
  const quizzes = generateQuizSet(count, [type]);
  
  res.json({
    count: quizzes.length,
    type: type,
    level: level,
    quizzes: quizzes
  });
});

// Start server
app.listen(3000, () => {
  console.log('Vocabulary API running on port 3000');
});
```

## Best Practices

### 1. Always Validate Input
```javascript
function validateWord(word) {
  return word && 
         typeof word === 'string' && 
         word.trim().length > 0;
}
```

### 2. Handle Missing Data Gracefully
```javascript
function getWordDefinition(word, defaultValue = 'No definition available') {
  return word.definition || defaultValue;
}
```

### 3. Cache Frequently Used Data
```javascript
const vocabularyCache = new Map();

function getCachedVocabulary(bookId) {
  if (!vocabularyCache.has(bookId)) {
    const vocab = getBookVocabulary(bookId);
    vocabularyCache.set(bookId, vocab);
  }
  return vocabularyCache.get(bookId);
}
```

### 4. Provide Fallbacks
```javascript
function getWordInfo(word) {
  const dictEntry = vocabularyDict[word];
  
  return dictEntry || {
    word: word,
    definition: 'Definition not available',
    difficulty: 'B1',
    category: 'general'
  };
}
```

## Performance Tips

1. **Lazy Loading**: Load vocabulary only when needed
2. **Pagination**: Don't load all words at once
3. **Caching**: Store frequently accessed data
4. **Indexing**: Create indexes by difficulty, category
5. **Compression**: Use gzip for API responses

## Testing Examples

```javascript
// Unit test example
describe('Vocabulary Enrichment', () => {
  it('should standardize time words', () => {
    expect(standardizeWord('A.M.')).toBe('a.m.');
    expect(standardizeWord('PM')).toBe('p.m.');
  });
  
  it('should correct truncated words', () => {
    expect(correctWord('anarchis')).toBe('anarchist');
    expect(correctWord('duches')).toBe('duchess');
  });
  
  it('should enrich vocabulary data', () => {
    const enriched = enrichHardWord(oldFormat);
    expect(enriched.vocabulary).toBeInstanceOf(Array);
    expect(enriched.vocabulary[0]).toHaveProperty('definition');
  });
});
```

---

These examples demonstrate practical applications of the enriched vocabulary system in real-world scenarios. Adapt them to your specific needs!
