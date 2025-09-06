<script setup lang="ts">
const user = useSupabaseUser()
</script>
<template>
    <UPage>
        <UUser :name="user?.user_metadata.name || user?.email" />
    </UPage>
</template>