<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import HomePortal from './components/HomePortal.vue'
import SidebarProfile from './components/SidebarProfile.vue'

const { frontmatter } = useData()
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-before>
      <HomePortal v-if="frontmatter.portalHome" />
    </template>
    <template #sidebar-nav-after>
      <SidebarProfile />
    </template>
  </DefaultTheme.Layout>
</template>
