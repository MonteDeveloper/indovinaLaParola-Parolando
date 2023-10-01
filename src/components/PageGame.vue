<template>
    <div v-if="wordsLoaded" class="my-personalHeight d-flex align-items-center">
        <div class="d-flex flex-column justify-content-center align-items-center container-fluid gap-3 h-100">
            <div class="text-light col-12 d-flex flex-column justify-content-center align-items-center gap-3">
                <div class="w-100 d-flex flex-column gap-1 justify-content-center">
                    <div class="text-center py-3">
                        <div v-if="isChallengeMode">
                            <h1 class="display-1">CHALLENGE</h1>
                            <p class="m-0">Ancora {{ this.game.state.wordsToGuess.length - this.currentIndexWordToGuess }}
                                parole da
                                indovinare!</p>
                        </div>
                        <div v-else>
                            <h1 class="display-1">SOLO</h1>
                        </div>
                        <p class="m-0 text-center">debug: {{
                            this.game.state.wordsToGuess[this.currentIndexWordToGuess].toUpperCase() }}</p>
                    </div>
                    <div class="w-100" :class="{ 'opacity-25 ': currentTry < tryWordIndex }"
                        v-for="(singleTry, tryWordIndex) in totalTry">
                        <div class="d-grid gap-1"
                            :style="{ gridTemplateColumns: 'repeat(' + game.state.wordLength + ', 1fr)' }">
                            <div v-for="letterIndex in game.state.wordLength"
                                :class="calculateSquareClass(letterIndex, tryWordIndex) + ' square-box'" ref="squareBox"
                                :style="{ transitionDelay: letterIndex / 3 + 's' }">
                                <span class="d-flex align-items-center h-100 m-0"
                                    :class="'h' + (game.state.wordLength - 3)">{{
                                        tryWords[tryWordIndex] && tryWords[tryWordIndex][letterIndex - 1] ?
                                        tryWords[tryWordIndex][letterIndex - 1].toUpperCase() : '' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="keyboard" class="d-flex flex-column justify-content-center gap-2 h-100 w-100">
                <div class="flex-fill d-flex flex-column justify-content-around">
                    <div class="d-flex justify-content-center gap-1 mb-1 flex-fill"
                        v-for="(row, rowIndex) in keyboardLayout" :key="'row' + rowIndex">
                        <button class="btn text-light p-0 d-flex align-items-center justify-content-center flex-fill rounded-1 bgTransition"
                            v-for="(key, keyIndex) in row" :key="'key' + keyIndex" @click="handleKeyPress(key)"
                            :class="calculateKeyButtonClass(key)">
                            <span :class="{'btn-keyboard': key.length == 1}">{{ key.toUpperCase() }}</span>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import game from '../game.js';

export default {
    data() {
        return {
            game,
            canWrite: true,
            isChallengeMode: null,
            wordsLoaded: false,
            currentIndexWordToGuess: 0,
            totalTry: null,
            currentTry: 0,
            keyboardLayout: [
                ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
                ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
                ['INVIO', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'CANC']
            ],
            lettersNoInTheWord: '',
            tryWords: [],
            guessedLetters: [],
            guessedLettersInPosition: [],
        };
    },
    async mounted() {
        await this.game.actions.loadWords();
        this.game.state.wordLength = +this.$route.query.letters;
        this.$route.query.challenge ? this.isChallengeMode = true : this.isChallengeMode = false;
        if (this.isChallengeMode) {
            this.game.state.challengeCode = this.$route.query.challenge;
            this.game.state.challengeLength = this.$route.query.challengeLength;
            this.game.actions.generateChallenge();
        } else {
            this.game.actions.generateOneGame();
        }
        this.totalTry = this.game.state.wordLength;

        for (let i = 0; i < this.totalTry; i++) {
            this.tryWords.push('');
            this.guessedLetters.push('');
            this.guessedLettersInPosition.push('');
        }
        this.wordsLoaded = true;

        this.$nextTick(() => {
            this.updateBoxHeight();
            window.addEventListener('resize', this.updateBoxHeight);
        });
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.updateBoxHeight);
    },
    methods: {
        updateBoxHeight() {
            const squareBoxes = this.$refs.squareBox;
            squareBoxes.forEach(box => {
                box.style.height = `${box.clientWidth}px`;
            });
        },
        handleKeyPress(key) {
            const currentWord = this.tryWords[this.currentTry];

            if (key.toUpperCase() === 'INVIO' && currentWord.length < this.game.state.wordLength) {
                return;
            }
            if (key.toUpperCase() === 'INVIO') {
                let isWordGuessed = this.checkGuessWord(this.tryWords[this.currentTry]);
                if (this.currentTry + 1 >= this.tryWords.length || isWordGuessed) {
                    this.visualizeScore(isWordGuessed);
                }
                else {
                    this.currentTry += 1;
                    this.canWrite = true;
                }
            } else if (key.toUpperCase() === 'CANC') {
                this.cancCharacter();
            } else if (this.canWrite) {
                this.addCharacter(key);
            }
        },

        addCharacter(char) {
            if (this.tryWords[this.currentTry].length < this.game.state.wordLength) {
                this.tryWords[this.currentTry] += char;
            } else {
                this.canWrite = false;
            }
        },
        cancCharacter() {
            if (this.tryWords[this.currentTry].length > 0) {
                this.tryWords[this.currentTry] = this.tryWords[this.currentTry].slice(0, -1);
                this.canWrite = true;
            }
        },
        checkGuessWord(inputWord) {
            const currentWord = this.removeAccents(this.game.state.wordsToGuess[this.currentIndexWordToGuess].toUpperCase());
            const guessedWord = inputWord.toUpperCase();

            this.guessedLetters[this.currentTry] = '';
            this.guessedLettersInPosition[this.currentTry] = '';

            for (let i = 0; i < guessedWord.length; i++) {
                if (currentWord[i] === guessedWord[i]) {
                    this.guessedLettersInPosition[this.currentTry] += guessedWord[i];
                } else if (currentWord.includes(guessedWord[i])) {
                    this.guessedLetters[this.currentTry] += guessedWord[i];
                }else{
                    this.lettersNoInTheWord += guessedWord[i];
                }
            }

            return currentWord === guessedWord;
        },

        removeAccents(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        },

        visualizeScore(isWordGuessed) {
            if (isWordGuessed) {
                alert("Parola indovinata! [" + this.game.state.wordsToGuess[this.currentIndexWordToGuess].toUpperCase() + "]");
            } else {
                alert("Parola NON indovinata... [" + this.game.state.wordsToGuess[this.currentIndexWordToGuess].toUpperCase() + "]");
            }

            //inserire pulsantletterIndex che iniziano nuovo gioco o vanno alla prossima parola challenge
            if (this.isChallengeMode) {
                if (this.currentIndexWordToGuess + 1 < this.game.state.challengeLength) {
                    this.prepareForNextChallenge();
                }
            } else {
                this.prepareForNextSolo();
            }
        },

        prepareForNextChallenge() {
            this.currentIndexWordToGuess += 1;
            this.guessedLetters = [];
            this.guessedLettersInPosition = [];
            this.tryWords = [];
            for (let i = 0; i < this.totalTry; i++) {
                this.tryWords.push('');
                this.guessedLetters.push('');
                this.guessedLettersInPosition.push('');
            }
            this.lettersNoInTheWord = '';
            this.currentTry = 0;
            this.canWrite = true;
        },
        prepareForNextSolo() {
            this.game.actions.generateOneGame();
            this.guessedLetters = [];
            this.guessedLettersInPosition = [];
            this.tryWords = [];
            for (let i = 0; i < this.totalTry; i++) {
                this.tryWords.push('');
                this.guessedLetters.push('');
                this.guessedLettersInPosition.push('');
            }
            this.currentTry = 0;
            this.lettersNoInTheWord = '';
            this.canWrite = true;
        },
        calculateSquareClass(letterIndex, tryWordIndex) {
            const currentLetter = this.tryWords[tryWordIndex][letterIndex - 1];
            if (currentLetter) {
                const currentLetterUpperCase = currentLetter.toUpperCase();
                const wordToGuess = this.removeAccents(this.game.state.wordsToGuess[this.currentIndexWordToGuess].toUpperCase());
                const letterCountInWordToGuess = (wordToGuess.match(new RegExp(currentLetterUpperCase, 'g')) || []).length;
                const letterCountInPreviousSubstring = (this.tryWords[tryWordIndex].substring(0, letterIndex - 1).toUpperCase().match(new RegExp(currentLetterUpperCase, 'g')) || []).length;
                const letterCountInCorrectPositions = (this.guessedLettersInPosition[tryWordIndex].match(new RegExp(currentLetterUpperCase, 'g')) || []).length;

                if (this.guessedLettersInPosition[tryWordIndex].includes(currentLetterUpperCase) && wordToGuess[letterIndex - 1] === currentLetterUpperCase) {
                    return 'd-flex align-items-center justify-content-center bg-success rounded-1 square-box fw-bold';
                } else if (letterCountInCorrectPositions >= letterCountInWordToGuess) {
                    return 'd-flex align-items-center justify-content-center rounded-1 square-box fw-bold bg-primary border border-3 border-primary blockTransitionDelay';
                } else if (this.guessedLetters[tryWordIndex].includes(currentLetterUpperCase) && letterCountInPreviousSubstring < letterCountInWordToGuess) {
                    return 'd-flex align-items-center justify-content-center bg-warning rounded-1 square-box fw-bold';
                } else {
                    return 'd-flex align-items-center justify-content-center rounded-1 square-box fw-bold bg-primary border border-3 border-primary blockTransitionDelay';
                }
            }
            return 'd-flex align-items-center justify-content-center bg-dark rounded-1 square-box fw-bold border border-3 border-primary blockTransitionDelay';
        },
        calculateKeyButtonClass(letter) {
            const upperCaseLetter = letter.toUpperCase();
            if(upperCaseLetter != "INVIO" && upperCaseLetter != "CANC"){
                if (this.lettersNoInTheWord.includes(upperCaseLetter)) {
                    return 'bg-primary';
                } else if (this.guessedLetters.some(guessedLetter => guessedLetter.includes(upperCaseLetter)) && !this.guessedLettersInPosition.some(guessedLetter => guessedLetter.includes(upperCaseLetter))) {
                    return 'bg-warning';
                } else if (this.guessedLettersInPosition.some(guessedLetter => guessedLetter.includes(upperCaseLetter))) {
                    return 'bg-success';
                }
            }
            return 'border border-2 border-primary';
        },
    }
};
</script>

<style lang="scss" scoped>
.my-personalHeight {
    height: 100vh;
    height: 100dvh;
}

.btn-keyboard {
    width: 20px;
}

#keyboard {
    max-height: 250px;
}

.square-box {
    transition: background-color .3s ease, opacity .5s ease;
    width: 100%;
    aspect-ratio: 1 / 1;
}

.bgTransition{
    transition: background-color .3s ease
}

.blockTransitionDelay {
    transition-delay: 0s !important;
}
</style>

