<template>
  <div class="q-pa-md">
    <div class="row justify-evenly items-start">
      <articles-grid-item
        v-for="article in articles"
        :key="article.name"
        :article="article"
        class="q-ma-xs"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import ArticlesGridItem from './ArticlesGridItem.vue'
import articles from 'assets/articles.js'

export default defineComponent({
  components: { ArticlesGridItem },
  name: 'ArticlesGrid',
  componenets: {
    ArticlesGridItem
  },
  setup () {
    console.log('articles:', articles)
    return {
      articles
    }
  }
})
</script>
