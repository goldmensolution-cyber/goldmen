<script setup lang="ts">
import type { FooterColumn } from '@nuxt/ui'

const columns: FooterColumn[] = [
  {
    label: 'Quick Links',
    children: [
      {
        label: 'Home',
        to: '/',
      },
      {
        label: 'Buy Airtime',
        to: '/airtime',
      },
      {
        label: 'Blog',
        to: '/blog',
      },
      {
        label: 'About Us',
        to: 'about',
      },
      {
        label: 'Contact Us',
        to: '/contact'
      }
    ]
  },
  {
    label: 'Company',
    children: [
      {
        label: 'Terms And Conditions',
        to: '/terms',
      },
      {
        label: 'Privacy Policy',
        to: '/privacy',
      },
      {
        label: 'FAQs',
        to: '/faq',
      },
      
    ]
  },
  {
    label: 'Socials',
    children: [
      {
        label: 'Facebook',
        icon: "i-logos-facebook" ,
        to: "https://web.facebook.com/CreditForAllNetwork",
        target: '_blank'

      },
      {
        label: 'Twitter',
        icon: 'i-lucide-twitter',
        to: "https://x.com/BonsusMwangiLTD",
        target: '_blank'
      },
      {
        label: 'Instagram',
        icon: 'i-lucide-instagram',
        to: "https://www.instagram.com/xbonsus/",
        target: '_blank'
      }
      
    ]
  }
]
</script>

<template>
  <UFooter>
    <template #top>
  <UFooterColumns :columns="columns"/>
    
</template>
<template #bottom>
    <p>© 2025 goldmen. All rights reserved.</p>
</template>
</UFooter>
</template>
