<template>
    <div v-if="wordsLoaded" class="my-personalHeight d-flex align-items-center position-relative">
        <div class="d-flex flex-column justify-content-center align-items-center container-fluid gap-3 h-100">
            <div class="text-light col-12 d-flex flex-column justify-content-center align-items-center gap-3">
                <div class="w-100 d-flex flex-column gap-1 justify-content-center">
                    <div class="d-flex justify-content-between w-100 py-3 pb-2 align-items-center">
                        <div class="fs-6">
                            Punti: {{ this.totalScore }}
                        </div>
                        <!-- <div>
                            Se indovini: +{{ this.game.state.wordLength - this.currentTry }}
                        </div> -->
                        <div class="d-flex fs-5 gap-3">
                            <button
                                @click="confirmSettingText = '1Vuoi tornare al menù principale? I dati e il punteggio di questa partita andranno persi'"
                                class="text-light bg-dark border-0 p-0"><i class="fa-solid fa-house"></i></button>
                            <button
                                @click="confirmSettingText = '2Vuoi cominciare una nuova partita da zero? I dati e il punteggio di questa partita andranno persi'"
                                class="text-light bg-dark border-0 p-0"><i class="fa-solid fa-rotate-left"></i></button>
                            <button v-if="isChallengeMode" @click="shareChallenge()" class="text-light bg-dark border-0 p-0"><i
                                    class="fa-solid fa-user-plus"></i></button>
                            <transition name="fade-slide" mode="out-in">
                                <div v-if="showCopyToClipboardMsg"
                                    class="position-absolute text-center bg-light text-dark p-3 px-2 rounded w-100 start-0">
                                    URL della sfida copiato negli appunti!
                                </div>
                            </transition>
                        </div>
                    </div>
                    <hr class="m-0">
                    <div class="text-center pb-2">
                        <div v-if="isChallengeMode">
                            <h1 class="display-1">MODALITA' SFIDA</h1>
                            <p class="m-0">Ancora {{ this.game.state.wordsToGuess.length - this.currentIndexWordToGuess }}
                                parole da
                                indovinare!</p>
                        </div>
                        <div v-else>
                            <h1 class="display-1">SOLITARIA</h1>
                            <p class="m-0">Riuscirai ad indovinare la {{ this.wordCounter }} parola?</p>
                        </div>
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
                        <button
                            class="btn text-light p-0 d-flex align-items-center justify-content-center flex-fill rounded-1 bgTransition"
                            v-for="(key, keyIndex) in row" :key="'key' + keyIndex" @click="handleKeyPress(key)"
                            :class="calculateKeyButtonClass(key)"
                            :style="currentTry == 0 && tryWords[0].length == 0 ? { transitionDelay: '0s' } : { transitionDelay: game.state.wordLength * (1 / 3) + 's' }">
                            <span :class="{ 'btn-keyboard': key.length == 1 }">{{ key.toUpperCase() }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <transition class="p-4 zIndexPrimary" name="fade-slide" mode="out-in">
            <div v-if="endMatch" class="position-absolute w-100 text-light">
                <div class="bg-primary d-flex flex-column rounded overflow-hidden p-3">
                    <div class="w-100 d-flex justify-content-center align-items-center text-center">
                        <div v-if="matchGuessed">
                            <h2 class="text-success h1">OTTIMO!</h2>
                            <p>Hai indovinato la parola al {{ this.currentTry + 1 }}º tentativo!</p>
                        </div>
                        <div v-else>
                            <h2 class="text-danger h1">CHE SFORTUNA!</h2>
                            <p>Non sei riuscito ad indovinare la parola, ma puoi sempre riprovare con un'altra</p>
                        </div>
                    </div>
                    <p v-if="isChallengeMode && !this.game.state.wordsToGuess[this.currentIndexWordToGuess + 1]"
                        class="text-center">Hai terminato la sfida da {{ this.currentIndexWordToGuess + 1 }} parole,
                        confronta i punteggi con i tuoi amici :)</p>
                    <div class="w-100 d-flex justify-content-center align-items-center h-100">
                        <div class="d-flex flex-column col-12 rounded p-2">
                            <h2 class="text-center">INFORMAZIONI PARTITA</h2>
                            <div class="d-flex col-12 gap-2">
                                <div class="text-end col-6">
                                    Parola:
                                </div>
                                <div class="col-6 d-flex align-items-end flex-fill">
                                    {{ this.game.state.wordsToGuess[this.currentIndexWordToGuess].toUpperCase() }}
                                </div>
                            </div>
                            <div class="d-flex col-12 gap-2">
                                <div class="text-end col-6">
                                    Punti guadagnati:
                                </div>
                                <div class="col-6 d-flex align-items-end flex-fill">
                                    +{{ this.matchGuessed ? this.game.state.wordLength - this.currentTry : 0 }}
                                </div>
                            </div>
                            <div class="d-flex col-12 gap-2">
                                <div class="text-end col-6">
                                    Punti totali:
                                </div>
                                <div class="col-6 d-flex align-items-end flex-fill">
                                    {{ this.totalScore }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-100 d-flex justify-content-center align-items-center gap-3">
                        <button class="btn btn-secondary border border-light rounded-4 fs-5 p-2 px-3"
                            @click="this.$router.push({ path: '/' });">TORNA AL MENU</button>
                        <button
                            v-if="!isChallengeMode || isChallengeMode && this.game.state.wordsToGuess[this.currentIndexWordToGuess + 1]"
                            class="btn btn-warning rounded-4 text-light fs-5 p-2 px-3"
                            @click="isChallengeMode ? prepareForNextChallengeMatch() : prepareForNextSolo()">PROSSIMA
                            PAROLA</button>
                        <button
                            v-else-if="isChallengeMode && !this.game.state.wordsToGuess[this.currentIndexWordToGuess + 1]"
                            class="btn btn-warning rounded-4 text-light fs-5 p-2 px-3" @click="newChallengeGame()">NUOVA
                            SFIDA</button>
                    </div>
                </div>
            </div>
            <div v-else-if="confirmSettingText.length > 0" class="position-absolute w-100 text-light">
                <div class="bg-primary d-flex flex-column rounded overflow-hidden p-3">
                    <div class="w-100 d-flex justify-content-center align-items-center text-center">
                        <div>
                            <h2 class="text-danger h1">ATTENZIONE!</h2>
                        </div>
                    </div>
                    <div class="w-100 d-flex justify-content-center align-items-center h-100">
                        <div class="d-flex flex-column col-12 rounded p-2">
                            <p class="text-center py-3">{{ isChallengeMode ?
                                confirmSettingText.substring(1).replace(/partita/g, 'sfida') :
                                confirmSettingText.substring(1) }}</p>
                        </div>
                    </div>
                    <div class="w-100 d-flex justify-content-center align-items-center gap-3">
                        <button class="btn btn-secondary border border-light rounded-4 fs-5 p-2 px-3"
                            @click="confirmSettingText = ''">CONTINUA A GIOCARE</button>

                        <button v-if="confirmSettingText.substring(0, 1) == '1'"
                            class="btn btn-warning rounded-4 text-light fs-5 p-2 px-3"
                            @click="this.$router.push({ path: '/' })">TORNA AL MENU PRINCIPALE</button>
                        <button v-if="confirmSettingText.substring(0, 1) == '2'"
                            class="btn btn-warning rounded-4 text-light fs-5 p-2 px-3"
                            @click="isChallengeMode ? newChallengeGame() : newSoloGame()">NUOVA {{ isChallengeMode ? 'SFIDA'
                                : 'PARTITA' }}</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
    <transition name="fade" mode="out-in">
        <div v-if="endMatch || confirmSettingText.length > 0" class="position-absolute vh-100 w-100 start-0 top-0 blackOverlay"></div>
    </transition>
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
            endMatch: false,
            matchGuessed: null,
            totalScore: 0,
            tryPointsMoltiplicator: 1,
            sendedLastTry: false,
            confirmSettingText: '',
            wordCounter: 1,
            showCopyToClipboardMsg: false,
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
            if (this.canWrite) {
                this.tryWords[this.currentTry] += char;
                if (this.tryWords[this.currentTry].length >= this.game.state.wordLength) {
                    this.canWrite = false;
                }
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
                } else {
                    this.lettersNoInTheWord += guessedWord[i];
                }
            }

            return currentWord === guessedWord;
        },

        removeAccents(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        },

        visualizeScore(isWordGuessed) {
            this.sendedLastTry = true;
            let delay = this.game.state.wordLength * (1 / 3) * 1000 + 1000; // Converti in millisecondi
            setTimeout(() => {
                this.sendedLastTry = false;
                this.matchGuessed = isWordGuessed;
                this.endMatch = true;
                if (this.matchGuessed) {
                    this.totalScore += this.game.state.wordLength - this.currentTry;
                }
            }, delay);
        },

        prepareForNextChallengeMatch() {
            this.endMatch = false;
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
            this.confirmSettingText = '';
        },
        newChallengeGame() {
            let randomChallenge = Math.floor(Math.random() * 900000) + 100000;
            this.$router.push({ path: '/game', query: { challenge: randomChallenge, letters: this.game.state.wordLength, challengeLength: this.game.state.challengeLength } });
        },
        newSoloGame() {
            this.$router.go(0);
        },
        prepareForNextSolo() {
            this.wordCounter += 1;
            this.endMatch = false;
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
            this.confirmSettingText = '';
        },
        calculateSquareClass(letterIndex, tryWordIndex) {
            const currentLetter = this.tryWords[tryWordIndex][letterIndex - 1];
            console.log(currentLetter);
            if (currentLetter) {
                const currentLetterUpperCase = currentLetter.toUpperCase();
                const wordToGuess = this.removeAccents(this.game.state.wordsToGuess[this.currentIndexWordToGuess].toUpperCase());
                const letterCountInWordToGuess = (wordToGuess.match(new RegExp(currentLetterUpperCase, 'g')) || []).length;
                const letterCountInPreviousSubstring = (this.tryWords[tryWordIndex].substring(0, letterIndex - 1).toUpperCase().match(new RegExp(currentLetterUpperCase, 'g')) || []).length;
                const letterCountInCorrectPositions = (this.guessedLettersInPosition[tryWordIndex].match(new RegExp(currentLetterUpperCase, 'g')) || []).length;

                let thisTryIsCompleted = false;

                if ((this.canWrite && this.tryWords[tryWordIndex].length >= this.game.state.wordLength) ||
                    !this.canWrite && this.tryWords[tryWordIndex + 1] && this.tryWords[tryWordIndex + 1].length >= this.game.state.wordLength ||
                    this.sendedLastTry) {
                    thisTryIsCompleted = true;
                }

                if (thisTryIsCompleted && this.lettersNoInTheWord.includes(currentLetterUpperCase)) {
                    return 'd-flex align-items-center justify-content-center bg-dark rounded-1 square-box fw-bold border border-3 border-primary scaleDown';
                }

                if (this.guessedLettersInPosition[tryWordIndex].includes(currentLetterUpperCase) && wordToGuess[letterIndex - 1] === currentLetterUpperCase) {
                    return 'd-flex align-items-center justify-content-center bg-success rounded-1 square-box fw-bold scaleDown';
                } else if (letterCountInCorrectPositions >= letterCountInWordToGuess) {
                    if (thisTryIsCompleted) {
                        return 'd-flex align-items-center justify-content-center bg-dark rounded-1 square-box fw-bold border border-3 border-primary scaleDown';
                    }
                    return 'd-flex align-items-center justify-content-center rounded-1 square-box fw-bold bg-primary blockTransitionDelay popscaleAnim';
                } else if (this.guessedLetters[tryWordIndex].includes(currentLetterUpperCase) && letterCountInPreviousSubstring < letterCountInWordToGuess) {
                    return 'd-flex align-items-center justify-content-center bg-info rounded-1 square-box fw-bold scaleDown';
                } else {
                    if (thisTryIsCompleted) {
                        return 'd-flex align-items-center justify-content-center bg-dark rounded-1 square-box fw-bold border border-3 border-primary scaleDown';
                    }
                    return 'd-flex align-items-center justify-content-center rounded-1 square-box fw-bold bg-primary blockTransitionDelay popscaleAnim';
                }
            }
            return 'd-flex align-items-center justify-content-center bg-dark rounded-1 square-box fw-bold border border-3 border-primary blockTransitionDelay';
        },
        calculateKeyButtonClass(letter) {
            const upperCaseLetter = letter.toUpperCase();
            if (upperCaseLetter != "INVIO" && upperCaseLetter != "CANC") {
                if (this.lettersNoInTheWord.includes(upperCaseLetter)) {
                    return 'border border-2 border-primary';
                } else if (this.guessedLetters.some(guessedLetter => guessedLetter.includes(upperCaseLetter)) && !this.guessedLettersInPosition.some(guessedLetter => guessedLetter.includes(upperCaseLetter))) {
                    return 'bg-info';
                } else if (this.guessedLettersInPosition.some(guessedLetter => guessedLetter.includes(upperCaseLetter))) {
                    return 'bg-success';
                }
            }
            return 'bg-primary';
        },
        shareChallenge() {
            if (navigator.share) {
                navigator.share({
                    title: 'Accetta la mia sfida!',
                    text: 'Gioca la mia sfida su Parolando e vediamo se totalizzi più punti di me!',
                    url: window.location.href,
                })
            } else {
                navigator.clipboard.writeText(window.location.href);
                this.showCopyToClipboardMsg = true;
                setTimeout(() => {
                    this.showCopyToClipboardMsg = false;
                }, 3000);
            }
        }
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
    transition: background-color .3s ease, scale .3s ease;
    width: 100%;
    aspect-ratio: 1 / 1;
}

.square-box.popscaleAnim {
    animation: popscale .3s ease;
}

.scaleDown {
    scale: .9;
}

@keyframes popscale {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(0.9);
    }

    100% {
        transform: scale(1);
    }
}


.bgTransition {
    transition: background-color .3s ease
}

.blockTransitionDelay {
    transition-delay: 0s !important;
}

.blackOverlay{
    z-index: 999;
    background-color: rgba(0, 0, 0, .5)
}

.zIndexPrimary{
    z-index: 9999;
}
</style>

