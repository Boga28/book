#!/usr/bin/env node

/**
 * Test cases for vocabulary enrichment
 */

const {
  correctWord,
  standardizeWord,
  parseOldFormat,
  enrichHardWord,
  WORD_CORRECTIONS,
  TIME_STANDARDS
} = require('./enrich_vocabulary.js');

// Test data
const testCases = [
  {
    name: 'Correct truncated words',
    input: 'anarchis',
    expected: 'anarchist',
    test: () => correctWord('anarchis')
  },
  {
    name: 'Standardize time format - AM',
    input: 'A.M.',
    expected: 'a.m.',
    test: () => standardizeWord('A.M.')
  },
  {
    name: 'Standardize time format - am',
    input: 'am',
    expected: 'a.m.',
    test: () => standardizeWord('am')
  },
  {
    name: 'Parse old format with text analysis',
    input: 'Text Analysis: Unique words: 680 Total words: 4175\n\n\tHard words: anarchis, cheque, lord',
    expected: { uniqueWords: 680, totalWords: 4175, words: ['anarchist', 'cheque', 'lord'] },
    test: () => parseOldFormat('Text Analysis: Unique words: 680 Total words: 4175\n\n\tHard words: anarchis, cheque, lord')
  },
  {
    name: 'Parse old format with multiple truncated words',
    input: 'Text Analysis: Unique words: 720 Total words: 5287\n\n\tHard words: queen, bush, jealou, aquariu, ballroo',
    expected: { uniqueWords: 720, totalWords: 5287, words: ['queen', 'bush', 'jealous', 'aquarium', 'ballroom'] },
    test: () => parseOldFormat('Text Analysis: Unique words: 720 Total words: 5287\n\n\tHard words: queen, bush, jealou, aquariu, ballroo')
  }
];

// Run tests
function runTests() {
  console.log('Running Vocabulary Enrichment Tests');
  console.log('=====================================\n');
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach((testCase, index) => {
    try {
      const result = testCase.test();
      const success = JSON.stringify(result) === JSON.stringify(testCase.expected);
      
      if (success) {
        console.log(`✓ Test ${index + 1}: ${testCase.name}`);
        passed++;
      } else {
        console.log(`✗ Test ${index + 1}: ${testCase.name}`);
        console.log(`  Expected: ${JSON.stringify(testCase.expected)}`);
        console.log(`  Got:      ${JSON.stringify(result)}`);
        failed++;
      }
    } catch (error) {
      console.log(`✗ Test ${index + 1}: ${testCase.name} - ERROR: ${error.message}`);
      failed++;
    }
  });
  
  console.log('\n=====================================');
  console.log(`Total: ${testCases.length} tests`);
  console.log(`✓ Passed: ${passed}`);
  console.log(`✗ Failed: ${failed}`);
  
  return failed === 0;
}

// Test enrichment of a sample entry
function testSampleEnrichment() {
  console.log('\n\nSample Enrichment Output');
  console.log('========================\n');
  
  const sampleHardWord = 'Text Analysis: Unique words: 680 Total words: 4175\n\n\tHard words: anarchis, cheque, lord, telepathy, shilling';
  const enriched = enrichHardWord(sampleHardWord, 'B1 Pre-Intermediate');
  
  console.log(JSON.stringify(enriched, null, 2));
}

if (require.main === module) {
  const success = runTests();
  testSampleEnrichment();
  
  process.exit(success ? 0 : 1);
}
