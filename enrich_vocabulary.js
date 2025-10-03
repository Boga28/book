#!/usr/bin/env node

/**
 * Vocabulary Enrichment Script
 * Converts simple comma-separated word lists into enriched vocabulary entries
 * with definitions, examples, and standardized formats
 */

const fs = require('fs');
const path = require('path');

// Load vocabulary dictionary
let vocabularyDict = {};
try {
  const dictPath = path.join(__dirname, 'vocabulary_dictionary.json');
  const dictData = fs.readFileSync(dictPath, 'utf8');
  const dict = JSON.parse(dictData);
  vocabularyDict = dict.words || {};
} catch (error) {
  console.warn('Warning: Could not load vocabulary dictionary:', error.message);
}

// Common word corrections (truncated words in the original data)
const WORD_CORRECTIONS = {
  'anarchis': 'anarchist',
  'duches': 'duchess',
  'headles': 'headless',
  'painles': 'painless',
  'aquariu': 'aquarium',
  'ballroo': 'ballroom',
  'jealou': 'jealous',
  'fashioned': 'old-fashioned',
  'remover': 'remover',
  'leaning': 'leaning',
  'fiancee': 'fiancée',
  'hind': 'hind',
  'casualtie': 'casualties',
  'newlywed': 'newlyweds',
  'clinging': 'clinging',
  'grief-stricken': 'grief-stricken'
};

// Time word standardization
const TIME_STANDARDS = {
  'a.m.': ['A.M.', 'am', 'AM', 'a.m'],
  'p.m.': ['P.M.', 'pm', 'PM', 'p.m'],
  "o'clock": ['oclock', 'o clock', "o'clock"]
};

// Difficulty levels based on word complexity
const DIFFICULTY_LEVELS = {
  'A1': ['time', 'day', 'night', 'morning', 'afternoon', 'evening', 'today', 'tomorrow', 'yesterday'],
  'A2': ['queen', 'king', 'castle', 'prince', 'princess', 'house', 'family', 'friend'],
  'B1': ['lord', 'cheque', 'shilling', 'detective', 'police', 'office', 'business'],
  'B2': ['toxicology', 'telepathy', 'doppelganger', 'fiancée', 'housekeeper'],
  'C1': ['anarchist', 'insurgent', 'etymology', 'pharmaceutical'],
  'C2': ['obsequious', 'pernicious', 'recalcitrant', 'sycophant']
};

/**
 * Corrects truncated or misspelled words
 */
function correctWord(word) {
  const trimmed = word.trim().toLowerCase();
  return WORD_CORRECTIONS[trimmed] || trimmed;
}

/**
 * Standardizes word to its base form
 */
function standardizeWord(word) {
  const corrected = correctWord(word);
  
  // Check for time word standards
  for (const [standard, variants] of Object.entries(TIME_STANDARDS)) {
    if (variants.includes(corrected) || corrected === standard) {
      return standard;
    }
  }
  
  return corrected;
}

/**
 * Determines difficulty level based on word
 */
function getDifficultyLevel(word) {
  for (const [level, words] of Object.entries(DIFFICULTY_LEVELS)) {
    if (words.includes(word.toLowerCase())) {
      return level;
    }
  }
  // Default to B1 for unknown words
  return 'B1';
}

/**
 * Parses old hardWord format: "Text Analysis: Unique words: 680 Total words: 4175\n\n\tHard words: word1, word2, word3"
 */
function parseOldFormat(hardWordString) {
  if (!hardWordString || typeof hardWordString !== 'string') {
    return { uniqueWords: 0, totalWords: 0, words: [] };
  }
  
  // Extract text analysis
  const uniqueMatch = hardWordString.match(/Unique words:\s*(\d+)/);
  const totalMatch = hardWordString.match(/Total words:\s*(\d+)/);
  
  const uniqueWords = uniqueMatch ? parseInt(uniqueMatch[1]) : 0;
  const totalWords = totalMatch ? parseInt(totalMatch[1]) : 0;
  
  // Extract words after "Hard words:"
  const wordsMatch = hardWordString.match(/Hard words:(.+)/s);
  let words = [];
  
  if (wordsMatch) {
    // Split by comma and clean up
    words = wordsMatch[1]
      .split(',')
      .map(w => w.trim())
      .filter(w => w.length > 0)
      .map(w => standardizeWord(w));
    
    // Remove duplicates
    words = [...new Set(words)];
  }
  
  return { uniqueWords, totalWords, words };
}

/**
 * Creates enriched vocabulary entry
 */
function createEnrichedEntry(word, bookLevel = 'B1') {
  // Check if word exists in dictionary
  const dictEntry = vocabularyDict[word];
  
  if (dictEntry) {
    // Use dictionary data
    return {
      word: word,
      variants: dictEntry.variants || [],
      partOfSpeech: dictEntry.partOfSpeech || 'unknown',
      definition: dictEntry.definition || '',
      exampleSentence: dictEntry.exampleSentence || '',
      difficulty: dictEntry.difficulty || getDifficultyLevel(word),
      pronunciation: dictEntry.pronunciation || '',
      synonyms: dictEntry.synonyms || [],
      category: dictEntry.category || 'general'
    };
  }
  
  // Fallback to basic entry if not in dictionary
  return {
    word: word,
    variants: [],
    partOfSpeech: 'unknown',
    definition: '',
    exampleSentence: '',
    difficulty: getDifficultyLevel(word),
    pronunciation: '',
    synonyms: [],
    category: 'general'
  };
}

/**
 * Converts old hardWord format to enriched format
 */
function enrichHardWord(hardWordString, bookLevel = 'B1') {
  const parsed = parseOldFormat(hardWordString);
  
  return {
    textAnalysis: {
      uniqueWords: parsed.uniqueWords,
      totalWords: parsed.totalWords
    },
    vocabulary: parsed.words.map(word => createEnrichedEntry(word, bookLevel))
  };
}

/**
 * Process a single book entry
 */
function processBook(book) {
  if (book.hardWord && typeof book.hardWord === 'string') {
    const enriched = enrichHardWord(book.hardWord, book.aciklama);
    return {
      ...book,
      hardWord: enriched,
      hardWordLegacy: book.hardWord  // Keep original for reference
    };
  }
  return book;
}

/**
 * Process entire books.json file
 */
function processBooks(inputFile, outputFile) {
  try {
    const data = fs.readFileSync(inputFile, 'utf8');
    const json = JSON.parse(data);
    
    if (json.meditasyonlar && Array.isArray(json.meditasyonlar)) {
      json.meditasyonlar = json.meditasyonlar.map(book => processBook(book));
    }
    
    fs.writeFileSync(outputFile, JSON.stringify(json, null, 2), 'utf8');
    console.log(`✓ Processed ${json.meditasyonlar?.length || 0} books`);
    console.log(`✓ Output saved to: ${outputFile}`);
  } catch (error) {
    console.error('Error processing books:', error.message);
    process.exit(1);
  }
}

// Example usage
if (require.main === module) {
  const inputFile = process.argv[2] || 'books.json';
  const outputFile = process.argv[3] || 'books_enriched.json';
  
  console.log('Vocabulary Enrichment Tool');
  console.log('===========================');
  console.log(`Input: ${inputFile}`);
  console.log(`Output: ${outputFile}`);
  console.log('');
  
  processBooks(inputFile, outputFile);
}

module.exports = {
  correctWord,
  standardizeWord,
  parseOldFormat,
  enrichHardWord,
  processBook,
  WORD_CORRECTIONS,
  TIME_STANDARDS
};
