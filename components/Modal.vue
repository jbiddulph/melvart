<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
    <div class="relative p-8 bg-white w-full max-w-md m-auto flex-col flex">
      {{ data.title }}
      <span @click="close" class="absolute top-0 right-0 p-4 cursor-pointer text-gray-600">&times;</span>
      <img :src="imageSrc" class="w-full h-auto" />
      <p>Size: {{ data.size }}</p>
      <p>Notes: {{ data.artistNotes }}</p>
      <p v-if="data.price !== 0">Price: {{ data.price }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    imageSrc: {
      type: String,
      required: true
    },
    data: {
      type: String,
      required: true
    }
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style>
.bg-smoke-light {
  background: rgba(0, 0, 0, 0.5);
}
</style>
