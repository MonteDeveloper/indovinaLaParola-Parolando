<template>
    <div v-if="wordsLoaded"
        class="vh-100 d-flex flex-column justify-content-center align-items-center container-fluid gap-3">
        <!-- CHALLENGE -->
        <div v-if="isChallengeMode" class="bg-primary text-light p-5 rounded">
            <div class="fs-3 m-0">
                <h2>CODE: {{ game.state.challengeCode }}</h2>
                <ul>
                    <li v-for="(word, index) in game.state.wordsToGuess" :key="index">{{ word }}</li>
                </ul>
            </div>
        </div>

        <!-- SOLO -->
        <div v-else class="text-light col-12 d-flex flex-column justify-content-center align-items-center gap-3 flex-fill">
            <h1 class="display-1 py-3">SOLO</h1>
            <!-- QUADRATI PAROLE -->
            <div @click="alert('funziona')" class="w-100" :class="{ 'opacity-50 ': currentTry < index + 1 }"
                v-for="(singleTry, index) in totalTry">
                <div class="d-grid gap-1" :style="{ gridTemplateColumns: 'repeat(' + game.state.wordLength + ', 1fr)' }">
                    <div v-for="i in game.state.wordLength"
                        class="d-flex align-items-center justify-content-center bg-primary rounded-1 square-box fw-bold"
                        ref="squareBox">
                        <span class="d-flex align-items-center h-100 m-0" :class="'h' + (game.state.wordLength - 3)">{{
                            tryWords[index] && tryWords[index][i - 1] ? tryWords[index][i - 1].toUpperCase() : '' }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div id="keyboard" class="d-flex flex-column justify-content-center gap-2 h-100 w-100">
            <div class="flex-fill d-flex flex-column justify-content-around">
                <div class="d-flex justify-content-center gap-1 mb-1 flex-fill" v-for="(row, rowIndex) in keyboardLayout"
                    :key="'row' + rowIndex">
                    <button class="btn btn-secondary rounded-1 d-flex align-items-center justify-content-center flex-fill"
                        v-for="(key, keyIndex) in row" :key="'key' + keyIndex" @click="handleKeyPress(key)">
                        {{ key.toUpperCase() }}
                    </button>
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
            isChallengeMode: null,
            wordsLoaded: false,
            currentIndexWord: 0,
            totalTry: 5,
            currentTry: 1,
            keyboardLayout: [
                ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
                ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
                ['CANC', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'INVIO']
            ],
            tryWords: [
                'ciao',
                'benone',
                'bene',
                '',
                ''
            ],
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
            console.log(key);
            // Qui puoi chiamare la tua funzione passando il carattere della lettera
        }
    }
};
</script>

<style lang="scss" scoped>
#keyboard {
    height: 250px !important;
}
</style>

