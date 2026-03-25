<template>
  <main>
    <section class="hero-section">
      <div class="container">
        <h1>Межвузовский кампус «Байкал»</h1>
        <p>Пространство для развития, учебы и инноваций</p>
      </div>
    </section>

    <section class="news-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Новости вузов</h2>
        </div>
        <div class="news-grid">
          <div v-for="item in newsList" :key="item.id" class="news-card">
            <div class="news-card__header">
              <img :src="`/logo/${item.logo}`" :alt="item.university" class="news-card__logo">
              <span class="news-card__date">{{ item.date }}</span>
            </div>
            <img :src="`/img/${item.img}`" :alt="item.title" class="news-card__image">
            <div class="news-card__content">
              <h3 class="news-card__title">{{ item.title }}</h3>
              <p class="news-card__preview">{{ item.preview }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { news } from '@/utils/news-mock';

const newsList = news;



// Динамический заголовок страницы
document.title = 'Главная | Кампус Байкал';
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.container h1 {
    color: white;
}

.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/img/hero-bg.jpg');
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  padding: 100px 0;
}

.hero-section h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.hero-section p {
  font-size: 20px;
}

.news-section {
  padding: 60px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 32px;
  color: #333;
  position: relative;
  display: inline-block;
  padding-bottom: 10px;
}

.section-title:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #4CAF50;
}

.news-grid {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.news-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  width: 100%;
  max-width: 350px;
}

.news-card:hover {
  transform: translateY(-5px);
}

.news-card__header {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.news-card__logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.news-card__date {
  font-size: 14px;
  color: #777;
}

.news-card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.news-card__content {
  padding: 20px;
}

.news-card__title {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

.news-card__preview {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
}

.news-card__link {
  color: #4CAF50;
  text-decoration: none;
  font-weight: bold;
}

.news-card__link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 32px;
  }
  
  .news-grid {
    gap: 20px;
  }
  
  .news-card {
    max-width: 100%;
  }
}
</style>