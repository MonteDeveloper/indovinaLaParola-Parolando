<template>
    <div v-if="wordsLoaded" class="vh-100 d-flex justify-content-center align-items-center container-fluid">
        <div class="bg-primary text-light p-5 rounded">
            <div class="fs-3 m-0">
                <h2 v-if="isChallengeMode">CODE: {{ game.state.challengeCode }}</h2>
                <ul>
                    <li v-for="(word, index) in game.state.wordsToGuess" :key="index">{{ word }}</li>
                </ul>
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
        };
    },
    async mounted() {
        await this.game.actions.loadWords();
        this.wordsLoaded = true;
        console.log(this.game.state.words);
        this.$route.query.challenge ? this.isChallengeMode = true : this.isChallengeMode = false;
        if(this.isChallengeMode){
            this.game.state.challengeCode = this.$route.query.challenge;
            this.game.state.wordLength = this.$route.query.letters;
            this.game.state.challengeLength = this.$route.query.challengeLength;
            this.game.actions.generateChallenge();
        }else{
            this.game.actions.generateOneGame();
        }
    },
};
</script>

<style lang="scss" scoped>
</style>

