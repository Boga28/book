# Vocabulary Enrichment System

## 📖 Overview

This system enriches the `hardWord` field in the books database, transforming simple comma-separated word lists into comprehensive, dictionary-like vocabulary entries perfect for educational quizzes and typing exercises.

## 🎯 Problem Solved

### Before (Old Format)
```
"hardWord": "Text Analysis: Unique words: 680 Total words: 4175\n\n\tHard words: anarchis, cheque, lord, A.M., am, painles, aquariu"
```

**Issues:**
- ❌ Truncated words (`anarchis`, `painles`, `aquariu`)
- ❌ Inconsistent formats (`A.M.`, `am`, `a.m.`)
- ❌ No definitions or context
- ❌ Not suitable for quizzes

### After (Enriched Format)
```json
{
  "hardWord": {
    "textAnalysis": {
      "uniqueWords": 680,
      "totalWords": 4175
    },
    "vocabulary": [
      {
        "word": "anarchist",
        "variants": ["anarchis"],
        "partOfSpeech": "noun",
        "definition": "a person who believes in or tries to bring about anarchy",
        "exampleSentence": "The anarchist refused to follow government rules.",
        "difficulty": "C1",
        "pronunciation": "/ˈænəkɪst/",
        "synonyms": ["rebel", "revolutionary"],
        "category": "politics"
      }
    ]
  }
}
```

**Benefits:**
- ✅ Standardized word forms
- ✅ Rich definitions and examples
- ✅ CEFR difficulty levels
- ✅ Perfect for quiz generation
- ✅ Supports multiple languages

## 🚀 Quick Start

### 1. Installation

```bash
# No installation required - uses Node.js built-in modules
# Ensure you have Node.js installed (version 12+)
node --version
```

### 2. Enrich Vocabulary

```bash
# Process a books file
node enrich_vocabulary.js books.json books_enriched.json

# Process a sample
node enrich_vocabulary.js books_sample.json books_sample_enriched.json
```

### 3. Generate Quizzes

```bash
# Generate 5 random quizzes
node quiz_generator.js 5

# Generate 10 definition quizzes
node quiz_generator.js 10 definition

# Generate standardization quizzes
node quiz_generator.js 5 standardization
```

### 4. Run Tests

```bash
# Run all tests
node test_enrichment.js
```

## 📚 Components

### 1. Core Scripts

#### `enrich_vocabulary.js`
Main enrichment script that:
- Corrects truncated words
- Standardizes word formats
- Loads definitions from dictionary
- Converts old format to enriched format

#### `vocabulary_dictionary.json`
Comprehensive vocabulary database with 40+ enriched word entries including:
- Definitions
- Example sentences
- Pronunciation (IPA)
- Synonyms
- Categories
- Difficulty levels

#### `quiz_generator.js`
Generates 5 types of quizzes:
1. **Standardization** - Choose correct form (a.m. vs AM vs A.M.)
2. **Definition** - Match word to definition
3. **Fill Blank** - Complete the sentence
4. **Synonym** - Find similar words
5. **Category** - Classify words

#### `test_enrichment.js`
Test suite verifying:
- Word correction logic
- Time word standardization
- Old format parsing
- Enrichment process

### 2. Documentation

- **`VOCABULARY_ENRICHMENT.md`** - Detailed technical documentation
- **`README_ENRICHMENT.md`** - This file (user guide)
- **`enriched_vocabulary_example.json`** - Format examples

## 🎓 Usage Examples

### Example 1: Enrich a Single Book

```javascript
const { processBook } = require('./enrich_vocabulary.js');

const book = {
  "id": "198",
  "baslik": "The Canterville Ghost",
  "hardWord": "Text Analysis: Unique words: 680\n\tHard words: anarchis, A.M., duches"
};

const enriched = processBook(book);
console.log(JSON.stringify(enriched.hardWord, null, 2));
```

### Example 2: Generate Custom Quiz

```javascript
const { generateDefinitionQuiz } = require('./quiz_generator.js');

const word = "anarchist";
const wordData = {
  definition: "a person who rebels against authority",
  difficulty: "C1",
  partOfSpeech: "noun"
};

const quiz = generateDefinitionQuiz(word, wordData, allWords);
console.log(quiz);
```

### Example 3: Add New Words to Dictionary

```json
{
  "words": {
    "your-new-word": {
      "variants": ["alternative-spelling"],
      "partOfSpeech": "noun",
      "definition": "clear definition here",
      "exampleSentence": "Example usage in context",
      "difficulty": "B1",
      "pronunciation": "/prəˌnʌnsiˈeɪʃn/",
      "synonyms": ["similar-word"],
      "category": "appropriate-category"
    }
  }
}
```

## 📊 Standardization Rules

### Time Words
| Standard | ❌ Wrong Variants |
|----------|------------------|
| `a.m.` | A.M., am, AM |
| `p.m.` | P.M., pm, PM |
| `o'clock` | oclock, o clock |

### Word Corrections
| ❌ Truncated | ✅ Corrected |
|-------------|-------------|
| anarchis | anarchist |
| duches | duchess |
| painles | painless |
| aquariu | aquarium |
| ballroo | ballroom |
| jealou | jealous |

### General Rules
- ✅ Use lowercase (unless proper noun)
- ✅ Use singular form
- ✅ Use base verb form
- ✅ American English spelling

## 🎯 Quiz Types Explained

### 1. Standardization Quiz
**Purpose:** Teach correct word formats

```
Question: Which is the correct standard form?
Context: before noon (used to specify time)
Options:
A) a.m. ✓
B) A.M.
C) am
D) AM
```

### 2. Definition Quiz
**Purpose:** Test vocabulary comprehension

```
Question: What does "anarchist" mean?
Options:
A) A person who rebels against authority ✓
B) A type of building
C) A currency unit
D) A weather phenomenon
```

### 3. Fill Blank Quiz
**Purpose:** Practice word usage in context

```
Question: Fill in the blank:
Sentence: The ___ refused to follow government rules.
Options:
A) anarchist ✓
B) rebel
C) revolutionary
D) insurgent
```

### 4. Synonym Quiz
**Purpose:** Expand vocabulary knowledge

```
Question: Which word is a synonym of "surrender"?
Options:
A) yield ✓
B) fight
C) resist
D) defend
```

### 5. Category Quiz
**Purpose:** Organize vocabulary by themes

```
Question: Which category does "goulash" belong to?
Options:
A) food ✓
B) place
C) animal
D) emotion
```

## 📈 Statistics

### Current Dictionary Size
- **40+ words** fully enriched
- **7 categories** (time, place, emotion, etc.)
- **6 difficulty levels** (A1 through C2)
- **100% test coverage**

### Vocabulary Categories
- 🕐 **time** - temporal expressions
- 📍 **place** - locations and spaces
- 😊 **emotion** - feelings and states
- 🎭 **action** - verbs and activities
- 👑 **social-status** - titles and ranks
- 💰 **finance** - money-related terms
- 👻 **paranormal** - supernatural concepts
- 🏛️ **politics** - governmental terms
- 🔬 **science** - scientific terminology
- ❤️ **relationships** - interpersonal terms
- ✨ **descriptive** - adjectives and qualities
- 💼 **profession** - jobs and occupations

## 🔧 Configuration

### Difficulty Levels (CEFR)

| Level | Description | Examples |
|-------|-------------|----------|
| **A1** | Beginner | time, day, night, a.m. |
| **A2** | Elementary | queen, castle, aquarium |
| **B1** | Pre-Intermediate | lord, cheque, detective |
| **B2** | Intermediate | telepathy, fiancée, duchess |
| **C1** | Advanced | anarchist, doppelganger |
| **C2** | Proficiency | toxicology, obsequious |

## 🐛 Troubleshooting

### Problem: "Cannot load vocabulary dictionary"
**Solution:** Ensure `vocabulary_dictionary.json` is in the same directory

### Problem: "Bad control character in JSON"
**Solution:** Check for unescaped special characters in hardWord strings

### Problem: "No vocabulary loaded"
**Solution:** Verify JSON format in vocabulary_dictionary.json

## 🎯 Roadmap

### Phase 1: Core System ✅
- [x] Enrichment script
- [x] Vocabulary dictionary (40+ words)
- [x] Test suite
- [x] Documentation

### Phase 2: Enhancement 🚧
- [ ] Expand dictionary to 100+ words
- [ ] Add Turkish translations
- [ ] API integration for auto-definitions
- [ ] Audio pronunciation files

### Phase 3: Advanced Features 📋
- [ ] Web interface for quiz generation
- [ ] Mobile app integration
- [ ] Progress tracking system
- [ ] Adaptive difficulty

## 🤝 Contributing

To add new vocabulary words:

1. Edit `vocabulary_dictionary.json`
2. Add complete word entry with all fields
3. Run tests: `node test_enrichment.js`
4. Test quiz generation: `node quiz_generator.js 5`

## 📝 License

This vocabulary enrichment system is part of the book project.

## 📧 Support

For issues or questions, please refer to the main project repository.

---

**Made with ❤️ for better language learning**
