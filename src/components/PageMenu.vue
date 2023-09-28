<template>
    <div class="d-flex flex-column justify-content-center align-items-around vh-100 position-relative container">
        <!-- LOGO -->
        <div class="d-flex justify-content-center align-items-center h-25">
            <div class="text-light border p-5">LOGO</div>
        </div>

        <!-- PULSANTI -->
        <div class="d-flex justify-content-center align-items-center h-25">
            <div class="d-flex flex-wrap gap-3 justify-content-center">
                <button class="btn btn-primary fs-5 p-3" @click="openSettingsAlone = true">GIOCA DA SOLO</button>
                <button class="btn btn-primary fs-5 p-3" @click="openSettingsChallenge = true">SFIDA
                    UN AMICO</button>
            </div>
        </div>

        <!-- IMPOSTAZIONI -->
        <transition class="position-relative" name="fade-slide" mode="out-in">
        <div v-if="openSettingsAlone || openSettingsChallenge" class="bg-dark rounded overflow-hidden p-3 h-50 position-absolute top-50 start-50 translate-middle">
            <button :disabled="currentSettingSlide === 1" class="btn bg-primary text-light position-absolute top-0 start-0 fs-4 px-4 m-2" @click="previewSettingSlide">I</button>
            <button class="btn bg-primary text-light position-absolute top-0 end-0 fs-4 px-4 m-2" @click="closeSettings">X</button>
                <transition class="d-flex align-items-center h-100 py-3"
                    :name="nameDirectionSlide" mode="out-in">
                    <div v-if="currentSettingSlide === 1" key="1">
                        <div class="d-flex flex-column gap-3 text-light justify-content-center align-items-center">
                            <h2 class="text-center">NUMERO DI LETTERE</h2>
                            <div class="d-flex gap-3 align-items-center">
                                <button class="btn btn-primary p-2 px-3 fs-4" @click="game.actions.decrementWordLength()"
                                    :disabled="game.state.wordLength <= 4">-</button>
                                <div class="h-100 fs-4 d-flex align-items-center">{{ game.state.wordLength }}</div>
                                <button class="btn btn-primary p-2 px-3 fs-4" @click="game.actions.incrementWordLength()"
                                    :disabled="game.state.wordLength >= 8">+</button>
                            </div>
                            <button v-if="openSettingsChallenge" class="btn btn-primary fs-5 p-2 px-3 position-absolute bottom-0 start-50 translate-middle" @click="nextSettingSlide">PROSSIMO</button>
                            <button v-else class="btn btn-primary fs-5 p-2 px-3 position-absolute bottom-0 start-50 translate-middle" @click="goToGame()">CONFERMA</button>
                        </div>
                    </div>
                    <div v-else-if="currentSettingSlide === 2" key="2">
                        <div class="d-flex flex-column gap-3 text-light justify-content-center align-items-center">
                            <h2 class="text-center">PAROLE DA INDOVINARE</h2>
                            <div class="d-flex gap-3 align-items-center">
                                <button class="btn btn-primary p-2 px-3 fs-4" @click="game.actions.decrementChallengeLength()"
                                    :disabled="game.state.challengeLength <= game.state.minChallengeLength">-</button>
                                <div class="h-100 fs-4 d-flex align-items-center">{{ game.state.challengeLength }}</div>
                                <button class="btn btn-primary p-2 px-3 fs-4" @click="game.actions.incrementChallengeLength()"
                                    :disabled="game.state.challengeLength >= game.state.maxChallengeLength">+</button>
                            </div>
                            <button class="btn btn-primary fs-5 p-2 px-3 position-absolute bottom-0 start-50 translate-middle" @click="goToGame()">CONFERMA</button>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>
    </div>
</template>

<script>
import game from '../game.js';

export default {
    data() {
        return {
            game,
            wordsLoaded: false,
            currentSettingSlide: 1,
            openSettingsAlone: false,
            openSettingsChallenge: false,
            nameDirectionSlide: 'slidesx',
        };
    },
    methods: {
        nextSettingSlide() {
            this.nameDirectionSlide = 'slidesx';
            if (this.currentSettingSlide < 2) {
                this.currentSettingSlide++;
            }
        },
        previewSettingSlide(){
            this.nameDirectionSlide = 'slidedx';
            if (this.currentSettingSlide > 1) {
                this.currentSettingSlide--;
            }
        },
        goToGame() {
            if (this.openSettingsAlone) {
                this.$router.push({ path: '/game', query: { letters: game.state.wordLength}});
            } else {
                this.$router.push({ path: '/game', query: { challenge: '123456', letters: game.state.wordLength, challengeLength: game.state.challengeLength } })
            }
        },
        closeSettings() {
            this.openSettingsAlone = false;
            this.openSettingsChallenge = false;
            this.currentSettingSlide = 1;
        },
    }
};
</script>

<style lang="scss" scoped>
.fade-slide-enter-from {
    scale: 0;
    transform: translate(-150%, -150%) !important;
    opacity: 0;
}

.fade-slide-leave-to {
    scale: 0;
    transform: translate(-150%, -150%) !important;
    opacity: 0;
}

.fade-slide-enter-to,
.fade-slide-leave-from {
    scale: 1;
    opacity: 1;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all .3s ease;
}


/* Animazione slide da destra a sinistra */
.slidesx-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.slidesx-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}

.slidesx-enter-to,
.slidesx-leave-from {
    transform: translateX(0);
    opacity: 1;
}

.slidesx-enter-active,
.slidesx-leave-active {
    transition: all .3s ease;
}

/* Animazione slide da sinistra a destra */
.slidedx-enter-from {
    transform: translateX(-100%);
    opacity: 0;
}

.slidedx-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

.slidedx-enter-to,
.slidedx-leave-from {
    transform: translateX(0);
    opacity: 1;
}

.slidedx-enter-active,
.slidedx-leave-active {
    transition: all .3s ease;
}

</style>

