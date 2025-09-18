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
      {
        label: 'Contact Us',
        to: '/contact'
      }
      
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
  <UFooter :ui="{root:'bg-error text-white', bottom: 'py-0 lg:py-0 '}">
    <template #top>
  <UFooterColumns :columns="columns" :ui="{root: 'bg-inherit mb-0 flex md:flex-row w-full flex-col text-white  justify between', center: 'w-full', left: 'w-fit h-full'}">
    <template #left>
      <UAlert 
        title="Goldmen Solutions"
        description="For your Airtime needs"
        variant="soft"
        :ui="{title: 'font-extrabold  text-3xl'}"
        class="h-full bg-transparent flex"
        color="neutral"/>
    </template>
  </UFooterColumns>
    
</template>
<template #bottom>
    <p class="w-full text-center">© 2025 goldmen. All rights reserved.</p>
</template>
</UFooter>
</template>
