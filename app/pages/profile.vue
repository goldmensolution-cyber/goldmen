<script setup lang="ts">
const user = import.meta.client ? useSupabaseUser() : ref(null)
</script>
<template>
    <UPage>
        <UUser :name="user?.user_metadata.name || user?.email" />
    </UPage>
</template>