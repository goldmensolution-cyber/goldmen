<script setup lang="ts">
import type { FooterColumn } from '@nuxt/ui'

const columns: FooterColumn[] = [
{
  label: 'Goldmen Solutions',
  children: [
    {
      label: 'Your one stop shop for all your airtime needs'
    }
  ]
},
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
        label: 'Twitter(x)',
        icon: 'i-logos-twitter',
        to: "https://x.com/BonsusMwangiLTD",
        target: '_blank'
      },
      {
        label: 'Instagram',
        icon: 'i-logos-instagram-icon',
        to: "https://www.instagram.com/xbonsus/",
        target: '_blank'
      },
      {
        label: 'Youtube',
        icon: 'i-logos-youtube-icon',
        to: "https://www.youtube.com/@BuyAirtime/videos",
        target: '_blank'
      },
      {
        label: 'Whatsapp Group',
        icon: 'i-logos-whatsapp-icon',
        to: "https://chat.whatsapp.com/DubNnwYSX76IVEOMwdaFMJ?mode=ems_share_c",
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
    <p class="w-full text-center">© 2025 goldmen. All rights reserved.</p>
</template>
</UFooter>
</template>
