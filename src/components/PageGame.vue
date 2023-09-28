<template>
    <div v-if="wordsLoaded" class="vh-100 d-flex justify-content-center align-items-center container-fluid">
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
        <div v-else class="text-light col-12 d-flex flex-column align-items-center gap-3">
            <h1 class="display-1 py-3">SOLO</h1>
            <!-- QUADRATI PAROLE -->
            <div @click="alert('funziona')" class="w-100" :class="{'opacity-50 ' : currentTry < index + 1}" v-for="(singleTry, index) in totalTry">
                <div class="d-grid gap-1" :style="{ gridTemplateColumns: 'repeat(' + game.state.wordLength + ', 1fr)' }">
                    <div v-for="(letter, index) in game.state.wordLength"
                        class="d-flex align-items-center justify-content-center bg-primary rounded-1 square-box fw-bold"
                        ref="squareBox">
                        <span class="d-flex align-items-center h-100 m-0" :class="'h' + (game.state.wordLength - 3)">A</span>
                    </div>
                </div>
            </div>
            <button class="btn btn-danger text-light fw-bold p-3 fs-3 col-12">ARRENDITI</button>
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
        }
    }
};
</script>

<style lang="scss" scoped></style>

