<template>
  <div id="app">
    
    <Header/>
     <UploadFile/>


  </div>
</template>

<script>
import Header from './components/Header.vue'
import UploadFile from './components/UploadFile.vue'

export default {
  name: 'app',
  components: {
    Header,
    UploadFile
  }
}
</script>

<style lang="scss">

</style>
