<template>
    <div class="d-flex flex-column justify-content-center align-items-around vh-100 position-relative">
        <!-- LOGO -->
        <div class="d-flex justify-content-center align-items-center h-25 gap-2 fs-6">
            <div class="w-100 h-100 d-flex align-items-center">
                <img class="img-fluid bounce" src="/logo.png" alt="">
            </div>
        </div>

        <!-- PULSANTI -->
        <div class="d-flex justify-content-center align-items-center h-25">
            <div class="d-flex flex-column gap-3 justify-content-center">
                <button class="btn btn-warning text-light fs-6 p-3 fw-bold" @click="openSettingsAlone = true"><i class="fa-solid fa-user"></i> GIOCA DA
                    SOLO</button>
                <button class="btn btn-primary border border-light text-light text-light fs-6 p-3"
                    @click="openSettingsChallenge = true"><i class="fa-solid fa-users"></i> SFIDA
                    UN AMICO</button>
            </div>
        </div>

        <!-- IMPOSTAZIONI -->
        <transition name="fade-slide" mode="out-in">
            <div v-if="openSettingsAlone || openSettingsChallenge"
                class="bg-primary d-flex flex-column rounded overflow-hidden p-3 h-50 position-absolute w-100">
                <div class="w-100 d-flex justify-content-between">
                    <div class="col-6">
                        <Transition name="slidesx" mode="out-in">
                            <button v-if="currentSettingSlide > 1" class="btn border text-light fs-4 p-2 px-3 m-2"
                                @click="previewSettingSlide"><i class="fa-solid fa-angle-left"></i></button>
                        </Transition>
                    </div>
                    <div class="col-6 d-flex justify-content-end">
                        <button class="btn btn-danger text-light fs-4 p-2 px-3 m-2" @click="closeSettings"><i
                                class="fa-solid fa-xmark"></i></button>
                    </div>
                </div>
                <transition class="d-flex align-items-center justify-content-center text-center h-100 py-3"
                    :name="nameDirectionSlide" mode="out-in">
                    <div v-if="currentSettingSlide === 1" key="1">
                        <div class="d-flex flex-column gap-3 text-light justify-content-between h-100 align-items-center">
                            <div class="d-flex flex-column gap-3 justify-content-center align-items-center h-100">
                                <h2 class="text-center">NUMERO DI LETTERE</h2>
                                <div class="d-flex gap-3 align-items-center">
                                    <button class="btn border text-light p-2 px-3 fs-4"
                                        @click="game.actions.decrementWordLength()"
                                        :disabled="game.state.wordLength <= 4"><i class="fa-solid fa-minus"></i></button>
                                    <div class="h-100 fs-4 d-flex align-items-center px-3">{{ game.state.wordLength }}</div>
                                    <button class="btn border text-light p-2 px-3 fs-4"
                                        @click="game.actions.incrementWordLength()"
                                        :disabled="game.state.wordLength >= 8"><i class="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                            <button v-if="openSettingsChallenge" class="btn btn-light fs-6 p-2 px-3 rounded-4"
                                @click="nextSettingSlide">PROSSIMO</button>
                            <button v-else class="btn btn-warning text-light fs-6 p-2 px-3 rounded-4"
                                @click="goToGame()">CONFERMA</button>
                        </div>
                    </div>
                    <div v-else-if="currentSettingSlide === 2" key="2">
                        <div class="d-flex flex-column gap-3 text-light justify-content-between h-100 align-items-center">
                            <div class="d-flex flex-column gap-3 justify-content-center align-items-center h-100">
                                <h2 class="text-center">PAROLE DA INDOVINARE</h2>
                                <div class="d-flex gap-3 align-items-center">
                                    <button class="btn border text-light p-2 px-3 fs-4"
                                        @click="game.actions.decrementChallengeLength()"
                                        :disabled="game.state.challengeLength <= game.state.minChallengeLength"><i
                                            class="fa-solid fa-minus"></i></button>
                                    <div class="h-100 fs-4 d-flex align-items-center px-3">{{ game.state.challengeLength }}
                                    </div>
                                    <button class="btn border text-light p-2 px-3 fs-4"
                                        @click="game.actions.incrementChallengeLength()"
                                        :disabled="game.state.challengeLength >= game.state.maxChallengeLength"><i
                                            class="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                            <button class="btn btn-warning text-light fs-6 p-2 px-3 rounded-4" @click="goToGame()">CONFERMA</button>
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
            nameApp: "Parolando!",
        };
    },
    methods: {
        nextSettingSlide() {
            this.nameDirectionSlide = 'slidesx';
            if (this.currentSettingSlide < 2) {
                this.currentSettingSlide++;
            }
        },
        previewSettingSlide() {
            this.nameDirectionSlide = 'slidedx';
            if (this.currentSettingSlide > 1) {
                this.currentSettingSlide--;
            }
        },
        goToGame() {
            if (this.openSettingsAlone) {
                this.$router.push({ path: '/game', query: { letters: this.game.state.wordLength } });
            } else {
                let randomChallenge = Math.floor(Math.random() * 900000) + 100000;
                this.$router.push({ path: '/game', query: { challenge: randomChallenge, letters: this.game.state.wordLength, challengeLength: this.game.state.challengeLength } });
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
@keyframes bounce {
  0%, 5%, 10% {
    transform: translateY(0);
  }
  2% {
    transform: translateY(-15px);
  }
  7%{
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

.bounce {
  animation: bounce 7s ease infinite;
}


</style>

