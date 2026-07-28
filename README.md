# Panini Adrenalyn XL WC26 — чекліст (MVP)

React + TypeScript + Rsbuild. Крок 1–2 з плану: інтерактивний чекліст
колекції та вхід через Google (Firebase Auth).

## Запуск

```bash
npm install
cp .env.example .env.local   # заповни Firebase-ключі (нижче)
npm run dev
```

Без заповненого `.env.local` застосунок все одно працює — чекліст і
локальне збереження прогресу (в localStorage) доступні одразу, кнопка
входу просто показує «Вхід недоступний».

## Налаштування Firebase (Google-вхід)

1. Створи проєкт на https://console.firebase.google.com
2. Додай Web-застосунок (`</>` іконка) — Firebase покаже конфіг:
   `apiKey`, `authDomain`, `projectId`, `appId`.
3. Authentication → Sign-in method → увімкни **Google**.
4. Встав значення в `.env.local` (префікс `PUBLIC_` — так Rsbuild
   експонує змінні у клієнтський код, див. `src/config/firebaseConfig.ts`).

## Структура

```
src/
  types/card.ts          — модель картки, рідкість, стан колекції
  data/cardSet.ts         — ЗАГЛУШКА даних, заміни на офіційний чекліст
  config/firebaseConfig.ts
  context/AuthContext.tsx — Google-вхід, м'яко вимикається без конфігу
  hooks/useCollection.ts  — прогрес користувача (localStorage зараз,
                            легко замінити на Firestore пізніше)
  components/
    AuthButton, ProgressBar, StatusFilterBar, CardTile, Checklist
```

## Що далі (з плану)

3. Дошка обміну — оголошення «віддаю/шукаю» + фільтр за містом
4. Розумний підбір взаємних обмінів
5. PWA-маніфест + офлайн-кеш, шеринг прогресу
