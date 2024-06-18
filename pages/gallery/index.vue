<template>
  <div class="container mx-auto">
    <h1 class="text-4xl py-10 px-4">The Gallery</h1>
    <div v-if="totalPages > 1" class="flex mx-auto w-100 justify-center mb-10">
      <button class="bg-green-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center mr-2" @click="prevPage" :disabled="currentPage === 1">Prev</button>
      <button class="bg-green-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center mr-2" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
    <div ref="grid" class="grid">
      <div v-for="item in galleries" :key="item.id" class="grid-item bg-white m-4 md:m-0 border md:border-slate-300 p-4 flex flex-col">
        <img
          :src="`${config.public.supabase.url}/storage/v1/object/public/images/public/gallery/${item.file ? (item.file.toLowerCase().endsWith('.jpg') ? item.file : item.file + '.jpg') : 'public/images/public/items/default.jpg'}`"
          :alt="item.title"
          class="cursor-pointer m-0 w-full"
          @load="imageLoaded"
          @click="openModal(item)"
        />
        <div class="mt-2">{{item.title}}</div>
        <div>{{item.item_status}}</div>
        <div>{{item.item_type}}</div>
      </div>
    </div>
    <div v-if="totalPages > 1" class="flex mx-auto w-100 justify-center mt-10 mb-10">
      <button class="bg-green-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center mr-2" @click="prevPage" :disabled="currentPage === 1">Prev</button>
      <button class="bg-green-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center mr-2" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
    <Modal
      :isVisible="showModal"
      :imageSrc="selectedImageSrc"
      :data="selectedItem"
      @close="showModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

useHead({
  title: "Items page"
})

const config = useRuntimeConfig();
const galleries = ref([]);
const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();
const showModal = ref(false);
const selectedItem = ref(null);
const selectedImageSrc = ref("");
const totalGalleries = ref(0);
const totalPages = ref(1);
const currentPage = ref(1);
const limit = ref(30);
const grid = ref(null);
let msnry;

const getGalleries = async (page = 1, limit = 30) => {
  const response = await $fetch(`/api/galleries/`, {
    params: {
      page,
      limit,
    },
  });

  return response;
};

const openModal = (item: any) => {
  selectedImageSrc.value = `${config.public.supabase.url}/storage/v1/object/public/images/public/gallery/${item.file ? (item.file.toLowerCase().endsWith('.jpg') ? item.file : item.file + '.jpg') : 'public/images/public/items/default.jpg'}`;
  showModal.value = true;
  selectedItem.value = item;
}

const fetchItems = async (page = 1) => {
  const { galleries: fetchedGalleries, totalGalleries: fetchedTotalGalleries, totalPages: fetchedTotalPages, currentPage: fetchedCurrentPage } = await getGalleries(page, limit.value);
  galleries.value = fetchedGalleries;
  totalGalleries.value = fetchedTotalGalleries;
  totalPages.value = fetchedTotalPages;
  currentPage.value = fetchedCurrentPage;
  if (typeof window !== 'undefined') {
    initializeMasonry();
  }
};

const initializeMasonry = async () => {
  const Masonry = (await import('masonry-layout')).default;
  msnry = new Masonry(grid.value, {
    itemSelector: '.grid-item',
    columnWidth: '.grid-item',
    percentPosition: true
  });
};

const imageLoaded = () => {
  if (msnry) {
    msnry.reloadItems();
    msnry.layout();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    fetchItems(currentPage.value + 1);
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    fetchItems(currentPage.value - 1);
  }
};

onMounted(() => {
  fetchItems(currentPage.value);
});

watch(galleries, () => {
  if (typeof window !== 'undefined') {
    initializeMasonry();
  }
});

const deleteItem = async (id: string, image: string) => {
  if (confirm("Are you sure you want to delete this item?")) {
    try {
      const imagePath = `${image}`;
      console.log("ImagePath: ", imagePath);
      const { error: storageError } = await client.storage.from('images').remove([imagePath]);
      if (storageError) {
        console.error('Error removing image from storage:', storageError);
        return createError({ statusCode: 500, statusMessage: "Error deleting image from storage" });
      }
      await $fetch(`/api/items`, {
        method: 'DELETE',
        body: { id }
      });
      // Refresh the item list after deletion
      await fetchItems(currentPage.value);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }
};
</script>

<style scoped>
.grid {
  display: flex;
  flex-wrap: wrap;
  margin: -10px;
}

.grid-item {
  margin: 10px;
  width: calc(33.333% - 20px); /* Adjust this percentage based on your desired column count */
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .grid-item {
    width: calc(50% - 20px);
  }
}

@media (max-width: 480px) {
  .grid-item {
    width: calc(100% - 20px);
  }
}
</style>
