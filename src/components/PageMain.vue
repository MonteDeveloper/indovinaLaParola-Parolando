<script>
import game from '../game.js';

export default {
    data() {
        return {
            game,
        };
    },
    async mounted() {
        await this.game.actions.loadWords();
    },
};
</script>

<template>
    <div class="vh-100 d-flex justify-content-center align-items-center container-fluid">
        <div class="bg-primary text-light p-5 rounded">
            <div class="fs-3 m-0">
                <input type="number" v-model="game.state.wordLength" min="1" max="10">
                <input type="text" v-model="game.state.challengeCode" min="6" max="6">
                <button @click="game.actions.generateChallenge">Genera parole</button>
                <ul>
                    <li v-for="(word, index) in game.state.wordsToGuess" :key="index">{{ word }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
