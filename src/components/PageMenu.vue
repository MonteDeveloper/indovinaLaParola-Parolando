<template>
    <div class="d-flex flex-column justify-content-center align-items-around vh-100 container">
        <!-- LOGO -->
        <div class="d-flex justify-content-center align-items-center h-25">
            <div class="text-light border p-5">LOGO</div>
        </div>

        <!-- PULSANTI -->
        <div class="d-flex justify-content-center align-items-center h-25">
            <div class="d-flex flex-wrap gap-3 justify-content-center">
                <button class="btn btn-primary fs-5 py-3" @click="$router.push({ path: '/game'})">GIOCA DA SOLO</button>
                <button class="btn btn-primary fs-5 py-3" @click="$router.push({ path: '/game', query: { challenge: '123456', letters: game.state.wordLength } })">SFIDA UN AMICO</button>
            </div>
        </div>

        <!-- DIFFICOLTA -->
        <div class="d-flex flex-column gap-3 text-light justify-content-center align-items-center h-25">
            <h2 class="text-center">NUMERO DI LETTERE</h2>
            <div class="d-flex gap-3 align-items-center">
                <button class="btn btn-primary" @click="game.actions.decrementWordLength()" :disabled="game.state.wordLength <= 4"><i class="fa-solid fa-caret-left"></i></button>
                <div class="h-100 fs-4">{{ game.state.wordLength }}</div>
                <button class="btn btn-primary" @click="game.actions.incrementWordLength()" :disabled="game.state.wordLength >= 8"><i class="fa-solid fa-caret-right"></i></button>
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
            wordsLoaded: false,
        };
    },
};
</script>

<style lang="scss" scoped>
</style>

