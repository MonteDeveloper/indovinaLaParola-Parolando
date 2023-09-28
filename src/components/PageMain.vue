<script>

export default {
    name: "PageMain",
    props: {
        text: String
    },
    data() {
        return {
        }
    },
    mounted() {
        console.log("Caricato il componente 'PageMain'.");
    }
}
</script>

<template>
    <div class="vh-100 d-flex justify-content-center align-items-center container-fluid">
        <div class="bg-primary text-light p-5 rounded">
            <div class="fs-3 m-0">Questo è un template con
                <span class="bg-warning rounded-pill p-1 px-3 text-dark">Vite</span>,
                <span class="bg-danger rounded-pill p-1 px-3">Vue3</span>,
                <span class="bg-warning rounded-pill p-1 px-3 text-dark">Bootstrap</span>,
                <span class="bg-danger rounded-pill p-1 px-3">FontAwesome</span>,
                <span class="bg-warning rounded-pill p-1 px-3 text-dark">SCSS</span>
                già installati e configurati. Divertiti!
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
