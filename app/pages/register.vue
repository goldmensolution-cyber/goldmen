<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import * as z from 'zod'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const error = ref<string | null>(null)

const fields = [
    {
        name: 'name',
        type: 'text' as const,
        label: 'Name',
        placeholder: 'Enter your name',
        required: true
    },
    {
        name: 'email',
        type: 'text' as const,
        label: 'Email',
        placeholder: 'Enter your email',
        required: true
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password' as const,
        placeholder: 'Enter your password',
        required: true
    }
]

const schema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

async function onSubmit({ data }: { data: Schema }) {
    loading.value = true
    error.value = null
    try {
        await $fetch('/api/auth/register', {
            method: 'POST',
            body: data
        })
        router.replace('/login')
    } catch (e: unknown) {
        error.value = (typeof e === 'object' && e !== null && 'data' in e && typeof (e as any).data === 'object' && (e as any).data !== null && 'statusMessage' in (e as any).data)
            ? (e as any).data.statusMessage
            : 'Registration failed'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="flex flex-col items-center justify-center gap-4 p-4 w-full">
        <UPageCard class="w-full max-w-md">
            <UAuthForm
                :schema="schema"
                :fields="fields"
                title="Create your account"
                icon="i-lucide-user-plus"
                :loading="loading"
                @submit="onSubmit"
            >
                <template #footer>
                    <div>
                        Already have an account?
                        <ULink to="/login" class="text-primary font-medium">Sign in</ULink>
                    </div>
                    <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
                </template>
            </UAuthForm>
        </UPageCard>
    </div>
</template>