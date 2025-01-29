<template>
  <div class="camera-container">
    <!-- Кнопка закрытия камеры -->
    <button class="close-button" @click="closeScanner">×</button>

    <!-- Камера -->
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

    <!-- Уведомление об успешном сканировании -->
    <div v-if="showNotification" class="notification success">
      <p>Вы успешно зарегистрированы!</p>
    </div>

    <!-- Уведомление об ошибке -->
    <div v-if="showErrorNotification" class="notification error">
      <p>QR-код не поддерживается!</p>
      <button class="close-notification" @click="showErrorNotification = false">×</button>
    </div>
  </div>
</template>

<script>
import jsQR from "jsqr";

export default {
  data() {
    return {
      mediaStream: null,
      scanning: true,
      showNotification: false,
      showErrorNotification: false,
      allowedLinks: ["https://pollsync.ru"], // Разрешённые ссылки
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
        console.error("Ошибка камеры:", err);
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

          if (this.allowedLinks.includes(qrCode.data)) {
            // Показываем уведомление и закрываем камеру
            this.showNotification = true;
            setTimeout(() => {
              this.showNotification = false;
              this.closeScanner();
            }, 2000);
          } else {
            // QR-код не поддерживается
            this.showErrorNotification = true;
            setTimeout(() => {
              this.showErrorNotification = false;
              this.scanning = true; // Разрешаем повторное сканирование
              requestAnimationFrame(scan);
            }, 2000);
          }
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
      this.$router.push("/user");
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
/* Контейнер */
.camera-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: black;
  color: white;
  position: relative;
}

/* Кнопка закрытия */
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
  color: #ff4c4c;
}

/* Камера */
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
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
}

/* Текст в поле */
.scan-text {
  color: white;
  font-size: 14px;
  text-align: center;
  line-height: 1.5;
  margin: 0;
  padding: 5px 10px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
}

/* Панель управления */
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
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
}

.hidden {
  display: none;
}

/* Уведомления */
.notification {
  position: fixed;
  bottom: 16rem;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  padding: 1.2rem 1.8rem;
  border-radius: 10px;
  font-size: 16px;
  box-shadow: 0 1.5rem 1.9rem rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  animation: fadeInOut 2s ease-in-out;
}

/* Зеленое уведомление (успех) */
.notification.success {
  background-color: #4CAF50;
}

/* Красное уведомление (ошибка) */
.notification.error {
  background-color: #FF4C4C;
}

/* Кнопка закрытия уведомления */
.close-notification {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.close-notification:hover {
  color: black;
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}
</style>
