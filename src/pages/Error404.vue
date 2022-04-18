<template>
  <div
    class="fullscreen bg-image text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh">(˚Δ˚)b</div>

      <div class="text-h2" style="opacity: 0.6">404错误</div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="回主页"
        no-caps
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorNotFound",
};
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #feda03 10%, #f072b6 100%);
}
</style>
