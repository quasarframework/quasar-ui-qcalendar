<template>
  <q-card class="article-card" @click="onClicked">
    <q-skeleton v-if="coverImage !== true" height="150px" />
    <div ref="imageRef" class="article-image"></div>
    <q-card-section>
      <div class="h6-text ellipsis">{{ article.title }}</div>
      <div class="text-subtitle2">{{ article.publish }}</div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ArticlesGridItem',
  props: {
    article: Object
  },
  setup (props) {
    const coverImage = ref(false),
      coverImagePath = ref(null),
      imageRef = ref(null),
      $router = useRouter()

    onMounted(() => {
      function testImage(url) {
        const imgPromise = new Promise(function imgPromise(resolve, reject) {
          const imgElement = new Image()

          // When image is loaded, resolve the promise
          imgElement.addEventListener('load', function imgOnLoad() {
            resolve(this)
          })

          // When there's an error during load, reject the promise
          imgElement.addEventListener('error', function imgOnError() {
            reject();
          })

          // Assign URL
          imgElement.src = url
        })

        return imgPromise
      }

      const src = '/articles/' + props.article.name + '/index.jpg'
      testImage(src).then(
        function fulfilled(img) {
          img.style = 'max-width: 225px; max-height: 150px;'
          coverImage.value = true
          coverImagePath.value = src
          imageRef.value.appendChild(img)
        },
        function rejected() {
          if (process.env.NODE_ENV !== 'production') {
            console.error('The image was not found:', src )
          }
        }
      )
    })

    function onClicked () {
      $router.push(props.article.path)
    }

    return {
      coverImage,
      coverImagePath,
      imageRef,
      onClicked
    }
  }
})
</script>

<style lang="sass" scoped>
.article-card
  width: 100%
  height: 100%
  max-width: 225px
  max-height: 225px
  cursor: pointer
  transition: box-shadow .3s

  &:hover
    box-shadow: 0 10px 13px -6px rgb(0 0 0 / 20%), 0 20px 31px 3px rgb(0 0 0 / 14%), 0 8px 38px 7px rgb(0 0 0 / 12%)



.article-image
  width: auto
  max-width: 100%
  max-height: 150px
  overflow: hidden
</style>
