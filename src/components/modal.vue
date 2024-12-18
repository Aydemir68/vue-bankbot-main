<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="modal-container">
      <div class="modal-header">
        <span class="close-button" @click="closeModal">&times;</span>
      </div>
      <div class="modal-body">
        <p>Запрос отправлен в нейросеть</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  text-align: center;
}

.modal-header {
  display: flex;
  justify-content: flex-end;
}

.close-button {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  background: none;
  border: none;
  cursor: pointer;
  line-height: 1;
}

.modal-body {
  margin-top: 20px;
}

p {
  font-size: 1.2rem;
  color: #333;
}
</style>
