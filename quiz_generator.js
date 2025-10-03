#!/usr/bin/env node

/**
 * Quiz Generator
 * Generates various types of quiz questions from enriched vocabulary
 */

const fs = require('fs');
const path = require('path');

/**
 * Load vocabulary dictionary
 */
function loadVocabulary() {
  try {
    const dictPath = path.join(__dirname, 'vocabulary_dictionary.json');
    const data = fs.readFileSync(dictPath, 'utf8');
    const dict = JSON.parse(data);
    return Object.entries(dict.words || {});
  } catch (error) {
    console.error('Error loading vocabulary:', error.message);
    return [];
  }
}

/**
 * Quiz Type 1: Word Standardization
 * Choose the correct standard form
 */
function generateStandardizationQuiz(word, wordData) {
  if (wordData.variants.length === 0) return null;
  
  const options = [word, ...wordData.variants].sort(() => Math.random() - 0.5);
  
  return {
    type: 'standardization',
    question: `Which is the correct standard form?`,
    context: wordData.definition,
    options: options,
    correctAnswer: word,
    difficulty: wordData.difficulty,
    explanation: `The standard form is "${word}". Variants include: ${wordData.variants.join(', ')}`
  };
}

/**
 * Quiz Type 2: Definition Match
 * Match word to its definition
 */
function generateDefinitionQuiz(word, wordData, allWords) {
  // Get 3 random wrong definitions from other words
  const wrongDefinitions = allWords
    .filter(([w, _]) => w !== word)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(([_, data]) => data.definition);
  
  const options = [wordData.definition, ...wrongDefinitions].sort(() => Math.random() - 0.5);
  
  return {
    type: 'definition',
    question: `What does "${word}" mean?`,
    options: options,
    correctAnswer: wordData.definition,
    difficulty: wordData.difficulty,
    partOfSpeech: wordData.partOfSpeech,
    explanation: `"${word}" (${wordData.partOfSpeech}) means: ${wordData.definition}`
  };
}

/**
 * Quiz Type 3: Fill in the Blank
 * Complete the sentence
 */
function generateFillBlankQuiz(word, wordData) {
  if (!wordData.exampleSentence) return null;
  
  // Replace the word in the example sentence with a blank
  const sentence = wordData.exampleSentence.replace(
    new RegExp(`\\b${word}\\b`, 'i'),
    '___'
  );
  
  // Generate wrong options from synonyms or variants
  let wrongOptions = [...wordData.synonyms];
  if (wordData.variants.length > 0) {
    wrongOptions.push(...wordData.variants);
  }
  
  // Add some random distractors if not enough options
  wrongOptions = wrongOptions.slice(0, 3);
  const options = [word, ...wrongOptions].sort(() => Math.random() - 0.5);
  
  return {
    type: 'fillBlank',
    question: `Fill in the blank:`,
    sentence: sentence,
    options: options,
    correctAnswer: word,
    difficulty: wordData.difficulty,
    fullSentence: wordData.exampleSentence,
    explanation: `Correct sentence: "${wordData.exampleSentence}"`
  };
}

/**
 * Quiz Type 4: Synonym Match
 * Find the synonym
 */
function generateSynonymQuiz(word, wordData, allWords) {
  if (wordData.synonyms.length === 0) return null;
  
  const correctSynonym = wordData.synonyms[0];
  
  // Get wrong options from other words
  const wrongOptions = allWords
    .filter(([w, _]) => w !== word)
    .map(([w, _]) => w)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  const options = [correctSynonym, ...wrongOptions].sort(() => Math.random() - 0.5);
  
  return {
    type: 'synonym',
    question: `Which word is a synonym of "${word}"?`,
    options: options,
    correctAnswer: correctSynonym,
    difficulty: wordData.difficulty,
    allSynonyms: wordData.synonyms,
    explanation: `Synonyms of "${word}": ${wordData.synonyms.join(', ')}`
  };
}

/**
 * Quiz Type 5: Category Classification
 * Identify the category
 */
function generateCategoryQuiz(word, wordData, allWords) {
  // Get 3 other categories
  const allCategories = [...new Set(allWords.map(([_, data]) => data.category))];
  const wrongCategories = allCategories
    .filter(cat => cat !== wordData.category)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  const options = [wordData.category, ...wrongCategories].sort(() => Math.random() - 0.5);
  
  return {
    type: 'category',
    question: `Which category does "${word}" belong to?`,
    options: options,
    correctAnswer: wordData.category,
    difficulty: wordData.difficulty,
    definition: wordData.definition,
    explanation: `"${word}" belongs to the "${wordData.category}" category`
  };
}

/**
 * Generate quiz set
 */
function generateQuizSet(count = 10, types = ['all']) {
  const vocabulary = loadVocabulary();
  
  if (vocabulary.length === 0) {
    console.error('No vocabulary loaded');
    return [];
  }
  
  const quizzes = [];
  const selectedWords = vocabulary.sort(() => Math.random() - 0.5).slice(0, count);
  
  selectedWords.forEach(([word, wordData]) => {
    // Randomly select quiz type or use specified types
    const quizType = types.includes('all') 
      ? ['standardization', 'definition', 'fillBlank', 'synonym', 'category'][Math.floor(Math.random() * 5)]
      : types[Math.floor(Math.random() * types.length)];
    
    let quiz = null;
    
    switch (quizType) {
      case 'standardization':
        quiz = generateStandardizationQuiz(word, wordData);
        break;
      case 'definition':
        quiz = generateDefinitionQuiz(word, wordData, vocabulary);
        break;
      case 'fillBlank':
        quiz = generateFillBlankQuiz(word, wordData);
        break;
      case 'synonym':
        quiz = generateSynonymQuiz(word, wordData, vocabulary);
        break;
      case 'category':
        quiz = generateCategoryQuiz(word, wordData, vocabulary);
        break;
    }
    
    if (quiz) {
      quiz.word = word;
      quizzes.push(quiz);
    }
  });
  
  return quizzes;
}

/**
 * Format quiz for display
 */
function formatQuiz(quiz, index) {
  let output = `\n${index + 1}. ${quiz.question}\n`;
  
  if (quiz.sentence) {
    output += `   ${quiz.sentence}\n`;
  }
  
  if (quiz.context) {
    output += `   Context: ${quiz.context}\n`;
  }
  
  output += `\n   Options:\n`;
  quiz.options.forEach((option, i) => {
    const letter = String.fromCharCode(65 + i); // A, B, C, D
    const marker = option === quiz.correctAnswer ? ' ✓' : '';
    output += `   ${letter}) ${option}${marker}\n`;
  });
  
  output += `\n   Difficulty: ${quiz.difficulty}\n`;
  output += `   Explanation: ${quiz.explanation}\n`;
  
  return output;
}

/**
 * Main execution
 */
if (require.main === module) {
  console.log('Quiz Generator - Vocabulary Practice');
  console.log('=====================================\n');
  
  const quizCount = parseInt(process.argv[2]) || 5;
  const quizType = process.argv[3] || 'all';
  
  console.log(`Generating ${quizCount} quiz questions...`);
  console.log(`Type: ${quizType}\n`);
  
  const quizzes = generateQuizSet(quizCount, [quizType]);
  
  quizzes.forEach((quiz, index) => {
    console.log(formatQuiz(quiz, index));
  });
  
  console.log('\n=====================================');
  console.log(`Total questions generated: ${quizzes.length}`);
}

module.exports = {
  generateQuizSet,
  generateStandardizationQuiz,
  generateDefinitionQuiz,
  generateFillBlankQuiz,
  generateSynonymQuiz,
  generateCategoryQuiz,
  formatQuiz
};
