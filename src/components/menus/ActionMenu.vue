<script setup>

</script>
<template>
    <section class="action-menu">
        <form>
                <legend>Actions</legend>
                <input type="text" placeholder="iban" class="form-control mb-2">
                <fieldset role="group">
                <input type="number" placeholder="MinBalance" class="form-control mb-2">
                <input type="number" placeholder="MaxBalance" class="form-control mb-2">
                </fieldset>
                <button type="submit" class="btn btn-primary mb-2">filter</button>
        </form>
       <button class="btn btn-primary">new Transfer</button>
    </section>
</template>



<style lang="scss" scoped>

</style>