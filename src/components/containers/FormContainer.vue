<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import UserForm from '../common/UserForm.vue'
import { fetchUserById } from '../../queries/users'
import { useQuery } from '@tanstack/vue-query'
import router from '../../Router'

const route = useRoute()
const isUpdate = computed(() => !!route.params.id)
const isVerifyMode = computed(() => route.query.verify === "1")

const { isLoading, isError, data: user, error } = useQuery({
    queryKey: ['user', route.params.id],
    queryFn: () => fetchUserById(route.params.id),
    enabled: isUpdate.value // Only fetch if it's an update
})

function handleSuccess() {
    // handle success (e.g., navigate away or show a message)
    console.log('User saved successfully');
    router.push('/admin/users'); // Redirect to users list
}
function handleCancel() {
    // handle cancel (e.g., navigate away)
    console.log('User creation/update cancelled');
    router.push('/admin/users'); // Redirect to users list
}
</script>

<template>
    <div>
        <UserForm
            v-if="!isUpdate || user"
            :user="user"
            :isUpdate="isUpdate"
            :disableCancel="isVerifyMode"
            @success="handleSuccess"
            @cancel="handleCancel"
        />
    </div>
</template>