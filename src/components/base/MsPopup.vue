<script setup lang="ts">
import { computed, useSlots } from 'vue';

interface MsPopupProps {
    open: boolean
    width?: string
    showClose?: boolean
}

const props = withDefaults(defineProps<MsPopupProps>(), {
    width: '415px',
    showClose: true,
});

const emit = defineEmits<{
    close: []
}>();

const slots = useSlots();

const popupStyle = computed(() => ({
    width: props.width,
}));

const closePopup = () => {
    emit('close');
};
</script>

<template>
    <Teleport to="body">
        <div v-if="open" class="fixed inset-0 z-1000 flex items-center justify-center bg-[rgba(0,0,0,0.32)] p-4"
            role="dialog" aria-modal="true">
            <div class="max-w-[calc(100vw-32px)] rounded-xl bg-white px-4 py-6
                shadow-[0_16px_48px_rgba(0,0,0,0.18)]" :style="popupStyle">
                <header class="flex items-center justify-between mx-2">
                    <h2 v-if="slots.title" class="m-0 text-[16px] font-bold leading-7 text-[#212121]">
                        <slot name="title"></slot>
                    </h2>

                    <button v-if="showClose" type="button" class="inline-flex size-8 shrink-0 cursor-pointer
                        items-center justify-center rounded-md border-0 bg-transparent text-[#6b7280]
                        transition hover:bg-[#f2f2f2] hover:text-[#212121] focus:outline-none
                        focus:ring-2 focus:ring-primary/20" aria-label="Dong popup" @click="closePopup">
                        <svg class="size-5.5" viewBox="0 0 24 20" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </header>

                <div class="mt-2 mx-2 text-[13px] leading-4.5 text-[#1f2937]">
                    <slot></slot>
                </div>

                <footer v-if="slots.footer" class="mt-5 flex justify-end gap-2.5">
                    <slot name="footer"></slot>
                </footer>
            </div>
        </div>
    </Teleport>
</template>
