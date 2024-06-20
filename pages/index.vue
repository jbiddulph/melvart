<template>
  <div class="container mx-auto p-6 md:p-0">
    <h1 class="text-4xl mt-4 md:mt-8 mb-4">Melvyn Biddulph</h1>
    <ul>
      <li>BORN IN ROCHDALE 1949</li>
      <li>ROCHDALE COLLEGE OF ART</li>
      <li>ST MARTINS SCHOOL OF ART 1964 - 1971</li>
      <li>EXHIBITED IN 1972</li>
      <li>SOLO EXHIBITION 2018 - BACK FROM THE DEAD</li>
    </ul>
    <div class="flex md:flex-row flex-col">
      <div class="w-full md:w-1/2 mr-8 mb-8">
        <p class="mb-6">I think I must have been about 12 when the new art teacher joined the school.</p>

        <p class="mb-6">Miss Wiggins' hair was blonde, in a beehive style. She wore short micro skirts, sometimes with tassels. She would arrive at the school on her cobalt blue Vespa in hairnet and rollers. I think she was the best thing to ever happen to me. She told me I could draw. Got me to go to Saturday morning classes and encouraged me to join the Rochdale College of Art when I left School just before my 15th birthday. She had then, apparently, saved me from a life working in some factory.</p>

        <p class="mb-6">I was lucky. Rochdale was thought to be one of the best provincial art colleges. Good tuition combined a traditional approach with acceptance of new ideas, resulting in an impressive pool of students. I enrolled on a one year Prelim course then a two year Pre-Diploma. This gave me experience of a wide range of art disciplines, which was invaluable for my artwork and essential in my life time career.</p>

        <p class="mb-6">In 1968 I was accepted directly into St Martin’s School of Art, without any of the academic qualifications normally required, to take a three year degree course in painting.</p>

        <p class="mb-6">My time at St. Martin's was both exciting and confusing. It was a time of great change, not only in the arts but also in politics, popular culture, fashion and music. The School was a leader in breaking down traditional boundaries between disciplines. It was here that I studied alongside contemporaries who went on to be successful in a wide range of careers.</p>

        <p class="mb-6">The new 'conceptual' thinking in the art world was difficult for me. I looked for alternative approaches in fields such as writing and film making, but I missed my direct way of painting. I missed my background. I didn’t want to invent a painting style or gimmick in order to be 'recognised'.</p>

        <p class="mb-6">After obtaining my degree and leaving St Martin’s I needed to support my family. I became a textile designer, and enjoyed a very successful and fruitful career.</p>

        <p class="mb-6">However, and most importantly, I never stopped producing personal artwork - privately. A key aspect of this has been my need for artistic freedom:
        <ul>
          <li>freedom from being classified as a particular type of artist;</li>
          <li>freedom to make art based on my own life experiences;</li>
          <li>freedom to express myself without feeling limited by ability or technique;</li>
          <li>freedom from the demands of commercial galleries or clients to produce a particular kind of work;</li>
          <li>freedom from the influence of others’ opinions on my work.</li>
        </ul></p>
        <p class="mb-6">After my solo exhibition in 2018 I thought my freedom would be compromised. It hasn't, I still follow my basic approach of never producing art for anyone but myself.</p>
      </div>
      <div class="w-full md:w-1/2">
        <p class="text-lg mb-6 font-bold">If you have any enquiries regarding a piece of art, please contact John on: 07935 085 736 quoting the ID you are interested in.</p>
        <h3 class="text-2xl mb-4">The interview</h3>
        <div class="aspect-w-16 aspect-h-9 video-wrapper">
        <iframe class="w-full h-full video-iframe" src="https://www.youtube.com/embed/IwLl3q98hUs?si=D3-1VecdaLiNDXD4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
        <br /><br />
        <h3 class="text-2xl mb-4">Grossic</h3>
        <div class="aspect-w-16 aspect-h-9 video-wrapper">
        <iframe class="w-full h-full video-iframe" src="https://www.youtube.com/embed/5ZwmCjyZVe0?si=ndPXnN7VVqn25ujw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
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
const delias = ref([]);
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
  const response = await $fetch(`/api/delias/`, {
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
  const { delias: fetchedGalleries, totalGalleries: fetchedTotalGalleries, totalPages: fetchedTotalPages, currentPage: fetchedCurrentPage } = await getGalleries(page, limit.value);
  delias.value = fetchedGalleries;
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

watch(delias, () => {
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
