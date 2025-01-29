<template>
  <div class="camera-container">
    <!-- Крестик для закрытия -->
    <button class="close-button" @click="closeScanner">×</button>

    <!-- Область камеры -->
    <div class="camera-view">
      <video ref="videoElement" autoplay playsinline></video>
      <canvas ref="canvasElement" class="hidden"></canvas>

      <!-- Поле для сканирования -->
      <div class="scan-area">
        <p class="scan-text">Наведите камеру на QR-код...</p>
      </div>
    </div>

    <!-- Нижняя панель -->
    <div class="controls">
      <button @click="capturePhoto" class="capture-button"></button>
    </div>
  </div>
</template>

<script>
import jsQR from "jsqr";

export default {
  data() {
    return {
      mediaStream: null,
      error: null,
      scanning: true,
    };
  },
  mounted() {
    this.startCamera();
  },
  methods: {
    async startCamera() {
      const constraints = {
        video: { facingMode: "environment" },
        audio: false,
      };
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoElement = this.$refs.videoElement;
        if (videoElement) {
          videoElement.srcObject = this.mediaStream;
          videoElement.onloadedmetadata = () => {
            videoElement.play();
            this.scanQRCode();
          };
        }
      } catch (err) {
        this.error = `Ошибка: ${err.message}`;
      }
    },
    scanQRCode() {
      if (!this.scanning) return;
      const video = this.$refs.videoElement;
      const canvas = this.$refs.canvasElement;
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const scan = () => {
        if (!this.scanning) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
        if (qrCode) {
          this.scanning = false;
          alert(`QR-код найден: ${qrCode.data}`);
          window.location.href = qrCode.data; // Открываем ссылку
        } else {
          requestAnimationFrame(scan);
        }
      };
      requestAnimationFrame(scan);
    },
    capturePhoto() {
      console.log("Сделать фото (логика обработки изображения будет добавлена)");
    },
    closeScanner() {
      this.stopCamera();
      this.$router.push('/user');
    },
    stopCamera() {
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach((track) => track.stop());
        this.mediaStream = null;
      }
    },
  },
  beforeDestroy() {
    this.stopCamera();
  },
};
</script>
<style scoped>
/* Общий контейнер */
.camera-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: black;
  color: white;
  position: relative;
}

/* Заголовок */
.header {
  text-align: center;
  padding: 10px;
  font-size: 18px;
  background-color: #ffd700; /* Желтый цвет для заголовка */
  color: black;
  font-weight: bold;
}

/* Крестик для закрытия */
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
}

.close-button:hover {
  color: #ff4c4c; /* Красный цвет при наведении */
}

/* Область камеры */
.camera-view {
  flex: 1;
  position: relative;
  overflow: hidden;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Поле для сканирования */
.scan-area {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 250px;
  height: 250px;
  transform: translate(-50%, -50%);
  border: 4px solid white;
  border-radius: 20px; /* Закругленные углы */
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5); /* Подсветка границ */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3); /* Прозрачный черный фон */
}

/* Текст внутри поля */
.scan-text {
  color: white;
  font-size: 14px;
  text-align: center;
  line-height: 1.5;
  margin: 0;
  padding: 0 10px;
  background: rgba(0, 0, 0, 0.6); /* Фон текста для читаемости */
  border-radius: 10px;
  padding: 5px 10px;
}

/* Нижняя панель управления */
.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: black;
}

.capture-button {
  width: 70px;
  height: 70px;
  border: 2px solid white;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  position: absolute;
  bottom: 30px; /* Расположить кнопку ближе к нижнему краю */
  left: 50%;
  transform: translateX(-50%);
}

.hidden {
  display: none;
}
</style>
