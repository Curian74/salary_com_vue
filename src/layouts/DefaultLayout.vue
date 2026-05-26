<script setup lang="ts">
import TheHeader from '@/components/layouts/TheHeader.vue';
import TheSidebar from '@/components/layouts/TheSidebar.vue';
</script>

<template>
    <div class="min-h-screen bg-background">
        <TheHeader />
        <div class="flex min-h-[calc(100vh-48px)]">
            <TheSidebar />
            <main class="relative min-w-0 flex-1 overflow-hidden bg-background">
                <router-view />
            </main>
        </div>
    </div>
</template>
