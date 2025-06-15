<template>
    <form>
        
        <fieldset  role="group">
            <button type="button" class="btn btn-primary" @click="$emit('prev')">Previous</button>
            <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
            <button type="button" class="btn btn-primary" @click="$emit('next')">Next</button>
        </fieldset>

    </form>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    }
});

</script>

<style lang="css" scoped>
form{
    width: 20%;
}
.page-info {
    display: flex;
    min-width: 50%;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

</style>