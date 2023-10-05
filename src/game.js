import { reactive } from 'vue';
import axios from 'axios';

function* pseudoRandomGenerator(seed) {
  let value = seed;
  while (true) {
    value = Math.sin(value) * 10000;
    yield value - Math.floor(value);
  }
}

function hashCode(s) {
  let h;
  for(let i = 0; i < s.length; i++)
    h = Math.imul(31, h) + s.charCodeAt(i) | 0;

  return (h / 2147483647) + 0.5; // Normalizza a un valore tra 0 e 1
}

const state = reactive({
  words: [],
  moreWords: [],
  wordsToGuess: [],
  wordLength: 5,
  challengeLength: 5,
  maxLetters: 7,
  minLetters: 4,
  maxChallengeLength: 10,
  minChallengeLength: 1,
  challengeCode: null,
  seed: null,
});

const actions = {
  async loadWords() {
    const wordsCommon = await axios.get('/1800_parole_italiane_comuni.txt');
    const otherWords = await axios.get('/660000_parole_italiane.txt');
    state.words = wordsCommon.data.split('\n').filter(word => word.length >= state.minLetters && word.length <= state.maxLetters);
    state.moreWords = otherWords.data.split('\n').filter(word => word.length >= state.minLetters && word.length <= state.maxLetters);
    console.log(state.moreWords);
  },
  generateChallenge() {
    actions.setSeed(state.challengeCode)
    const filteredWords = state.words.filter(word => word.length == state.wordLength);
    const prng = pseudoRandomGenerator(state.seed);
    state.wordsToGuess = [];
    for (let i = 0; i < state.challengeLength; i++) {
      const index = Math.floor(prng.next().value * filteredWords.length);
      state.wordsToGuess.push(filteredWords[index]);
      filteredWords.splice(index, 1); // Remove the selected word from the array to avoid duplicates
    }
  },
  generateOneGame() {
    const filteredWords = state.words.filter(word => word.length == state.wordLength);
    const index = Math.floor(Math.random() * filteredWords.length);
    state.wordsToGuess = [filteredWords[index]];
  },
  incrementWordLength() {
    if (state.wordLength < state.maxLetters) {
      state.wordLength++;
    }
  },
  decrementWordLength() {
    if (state.wordLength > state.minLetters) {
      state.wordLength--;
    }
  },
  incrementChallengeLength() {
    if (state.challengeLength < state.maxChallengeLength) {
      state.challengeLength++;
    }
  },
  decrementChallengeLength() {
    if (state.challengeLength > state.minChallengeLength) {
      state.challengeLength--;
    }
  },
  setSeed(value) {
    state.seed = hashCode(value);
  },
};

export default { state, actions };
