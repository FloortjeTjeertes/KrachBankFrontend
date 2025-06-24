<template>
    <form>
        
        <fieldset  role="group">
            <button type="button" class="btn btn-primary" @click="$emit('prev')">Previous</button>
            <span class="page-info">{{ currentPageProp }} / {{ totalPagesProp }}</span>
            <button type="button" class="btn btn-primary" @click="$emit('next')">Next</button>
        </fieldset>

    </form>
</template>

<script setup>
import { ref, watch } from 'vue';
const currentPage = ref(1);
const totalPages = ref(1);
const props = defineProps({
    currentPageProp: {
        type: Number,
        required: true
    }
    , totalPagesProp: {
        type: Number,
        required: true
    }
   
});
watch(() => props.currentPage, 
(newVal) => {
    if (newVal < 1) {
        throw new Error('currentPage must be at least 1');
        

    }
    currentPage.value = newVal;
});
watch(() => props.totalPages, (newVal) => {
    if (newVal < 1) {
        throw new Error('totalPages must be at least 1');
    }
    totalPages.value = newVal;
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