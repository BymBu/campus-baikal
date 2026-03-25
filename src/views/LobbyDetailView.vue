<template>
  <div class="container py-4">

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    
    <div v-else-if="lobby">
      <div class="row">
        <div class="col-md-6">
          <img :src="`https://webcomp.bsu.ru/uploads/finals26/${lobby.img}`" class="img-fluid rounded">
        </div>
        <div class="col-md-6">
          <h1>{{ lobby.title }}</h1>
          <p><strong>Назначение:</strong> {{ lobby.purpose }}</p>
          <p>{{ lobby.description }}</p>
        </div>
      </div>
      
      <!-- Форма бронирования -->
      <div v-if="auth.isAuthenticated" class="mt-4 p-3 border rounded">
        <h5>Забронировать "{{ lobby.title }}"</h5>
        
        <div class="row">
          <div class="col-md-6">
            <input type="datetime-local" v-model="book.time" class="form-control" :min="minDate">
          </div>
          <div class="col-md-6">
            <button class="btn btn-primary w-100" @click="bookRoom" :disabled="!book.time">
              Забронировать
            </button>
          </div>
        </div>
        
        <div v-if="book.msg" class="mt-2 alert" :class="book.msg.type">{{ book.msg.text }}</div>
      </div>
      
      <div v-else class="alert alert-warning mt-4">
        <router-link to="/login">Авторизуйтесь</router-link> для бронирования
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/api/api';

const route = useRoute();
const auth = useAuthStore();

const lobby = ref(null);
const error = ref(null);
const myReservations = ref([]);
const book = ref({ time: '', msg: null });

const minDate = computed(() => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
});

onMounted(async () => {
  await loadLobby();
  if (auth.isAuthenticated) {
    const res = await api.getUserReservations();
    myReservations.value = res.data || res || [];
  }
});

async function loadLobby() {
  try {
    const res = await api.getRoom(route.params.id);
    lobby.value = res.data || res;
  } catch (err) {
    error.value = 'Зал не найден';
  } 
}

// Проверка 30 минут
function hasConflict() {
  if (!book.value.time) return false;
  
  const newTime = new Date(book.value.time).getTime();
  
  return myReservations.value.some(r => {
    if (r.room_id != lobby.value.id) return false;
    const oldTime = new Date(r.reservation_date).getTime();
    const diff = Math.abs(newTime - oldTime) / (1000 * 60);
    return diff < 30;
  });
}

async function bookRoom() {
  if (!book.value.time) return;
  
  // Проверка интервала
  if (hasConflict()) {
    book.value.msg = { type: 'alert-danger', text: 'Есть бронь в интервале ±30 минут' };
    return;
  }
  
  book.value.loading = true;
  book.value.msg = null;
  
  try {
    const time = book.value.time.replace('T', ' ') + ':00';
    const res = await api.bookRoom(lobby.value.id, time);
    
    // Добавляем в список
    myReservations.value.push({
      id: res.id || Date.now(),
      room_id: lobby.value.id,
      room_title: lobby.value.title,
      reservation_date: time
    });
    
    book.value.msg = { type: 'alert-success', text: 'Забронировано!' };
    book.value.time = '';
    
    setTimeout(() => book.value.msg = null, 2000);
  } catch (err) {
    if (err.status === 409) {
      book.value.msg = { type: 'alert-danger', text: 'Уже есть бронь на это время' };
      // Обновляем список
      const res = await api.getUserReservations();
      myReservations.value = res.data || res || [];
    } else {
      book.value.msg = { type: 'alert-danger', text: 'Ошибка бронирования' };
    }
  } finally {
    book.value.loading = false;
  }
}
</script>

<style scoped>
.lobby-detail {
  padding: 40px 0;
  background: #f8f9fa;
  min-height: 100vh;
}

.lobby-img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.lobby-title {
  font-size: 32px;
  margin-bottom: 20px;
  color: #333;
}

.lobby-purpose {
  padding: 10px 0;
  border-bottom: 1px solid #dee2e6;
}

.lobby-description {
  line-height: 1.6;
  color: #555;
}

.booking-section {
  max-width: 600px;
}

.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-header {
  background: #007bff !important;
}

.btn-primary {
  background: #007bff;
  border: none;
  padding: 10px 30px;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #6c757d;
}

.alert-warning a {
  color: #856404;
  text-decoration: underline;
}

.alert-warning a:hover {
  color: #533f03;
}
</style>