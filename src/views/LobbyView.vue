<template>
  <div class="container py-4">
    <h1>Залы кампуса</h1>

    <!-- Быстрое бронирование -->
    <div class="card mb-4" v-if="auth.isAuthenticated">
      <div class="card-body">
        <div class="row">
          <div class="col-md-5">
            <select v-model="book.roomId" class="form-select">
              <option value="">Выберите зал</option>
              <option v-for="hall in halls" :value="hall.id">{{ hall.title }}</option>
            </select>
          </div>
          <div class="col-md-5">
            <input type="datetime-local" v-model="book.time" class="form-control">
          </div>
          <div class="col-md-2">
            <button class="btn btn-success w-100" @click="bookRoom" :disabled="!book.time || !book.roomId">
              Забронировать
            </button>
          </div>
        </div>
        <div v-if="book.msg" class="mt-2 alert" :class="book.msg.type">{{ book.msg.text }}</div>
      </div>
    </div>

    <!-- Список залов -->

    <div class="row">
      <div v-for="hall in halls" class="col-md-4 mb-3" :key="hall.id">
        <div class="card h-100" @click="goToHall(hall.id)" style="cursor: pointer">
          <img :src="`https://webcomp.bsu.ru/uploads/finals26/${hall.img}`" class="card-img-top">
          <div class="card-body">
            <h5>{{ hall.title }}</h5>
            <p class="text-muted">{{ hall.purpose }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/api/api';

const router = useRouter();
const auth = useAuthStore();

const halls = ref([]);
const myReservations = ref([]);
const book = ref({ roomId: '', time: '', msg: null });

onMounted(async () => {
  const res = await api.getRooms();
  halls.value = res.data || res;

  if (auth.isAuthenticated) {
    const reservations = await api.getUserReservations();
    myReservations.value = reservations.data;
  }
});

function goToHall(id) {
  router.push(`/lobby/${id}`);
}

// Проверка 30 минут
function hasConflict(roomId, newTime) {
  const newDate = new Date(newTime).getTime();

  return myReservations.value.some(r => {
    if (r.room_id != roomId) return false;
    const oldDate = new Date(r.reservation_date).getTime();
    const diff = Math.abs(newDate - oldDate) / (1000 * 60);
    return diff < 30;
  });
}

async function bookRoom() {
  if (!book.value.roomId || !book.value.time) return;

  // Проверка интервала
  if (hasConflict(book.value.roomId, book.value.time)) {
    book.value.msg = { type: 'alert-danger', text: 'Есть бронь в интервале ±30 минут' };
    return;
  }

  try {
    const time = book.value.time.replace('T', ' ') + ':00';
    const res = await api.bookRoom(book.value.roomId, time);

    // Добавляем в список
    const hall = halls.value.find(h => h.id == book.value.roomId);
    myReservations.value.push({
      id: res.id || Date.now(),
      room_id: book.value.roomId,
      room_title: hall.title,
      reservation_date: time
    });

    book.value.msg = { type: 'alert-success', text: 'Забронировано!' };
    book.value.roomId = '';
    book.value.time = '';
    setTimeout(() => book.value.msg = null, 2000);

  } catch (err) {
    if (err.status === 409) {
      book.value.msg = { type: 'alert-danger', text: 'Уже есть бронь на это время' };
      // Обновляем список
      const reservations = await api.getUserReservations();
      myReservations.value = reservations.data;
    } else {
      book.value.msg = { type: 'alert-danger', text: 'Ошибка' };
    }
  }
}
</script>

<style scoped>
.halls-page {
  padding: 40px 0;
  background: #f8f9fa;
  min-height: 100vh;
}

.page-title {
  margin-bottom: 30px;
  color: #333;
  font-size: 32px;
}

.quick-booking {
  background: white;
  margin-bottom: 30px;
}

.halls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.hall-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.hall-card:hover {
  transform: translateY(-5px);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

.card-title {
  margin-bottom: 10px;
  font-size: 18px;
}

.card-text {
  font-size: 14px;
}
</style>