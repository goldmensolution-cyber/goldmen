<script lang="ts">



</script>
<template>
    <UCard variant="solid" :ui="{body: 'grid grid-cols-1 md:grid-cols-4',footer: 'w-full flex justify-center'}" class="w-full rounded-none ">
        <div>
            <h1>Quick Links</h1>
            <div class="flex flex-col">
            <UButton label="Home" to="/" variant="link" />
            <UButton label="Buy Airtime" to="/airtime" variant="link" />
            <UButton label="Buy Bundles" to="/bundles" variant="link" />
            <UButton label="SMS Services" to="/" variant="link" />
            </div>
        </div>
        <div>
            <h1>Company</h1>
            <div class="flex flex-col">
            <UButton label=" About Us" to="faq" variant="link" />
            <UButton label="Blog" to="/blog" variant="link" />
            <UButton label="Contact Us" variant="link" />
            <UButton label="Terms of Service" to="terms" variant="link" />
            </div>
        </div>
        <div>
            <h1>Support</h1>
             <div class="flex flex-col">
            <UButton label="FAQ" to="/faq" variant="link" />
            <UButton label="Help Center" to="/help" variant="link" />
            <UButton label="Privacy Policy" to="/privacy" variant="link" />
            </div>
        </div>
        <div>
            <h1>Connect With Us</h1>
            <div class="flex flex-col ">
                <UButton icon="i-logos-facebook" variant="link" to="https://web.facebook.com/CreditForAllNetwork"  label="Facebook"/>
                <UButton icon="i-logos-twitter" variant="link" to="https://x.com/BonsusMwangiLTD" label="Twitter"/>
                <UButton icon="i-logos-instagram-icon" variant="link" to="https://www.instagram.com/xbonsus/" label="instagram"/>
            </div>

        </div>
        <template #footer>
            <p>© 2025 goldmen. All rights reserved.</p>
        </template>
    </UCard>
</template>
