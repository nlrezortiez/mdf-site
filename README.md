DF-MDF MVP (Next.js + Directus + Meilisearch)
===========================================

Цель: поднять локально MVP, функционально похожий на df-mdf.ru по структуре разделов (каталог по секциям + единый поиск + новости + акции + галерея + готовые решения + контакты + избранное).

Стек:
- Next.js (App Router)
- Directus + Postgres
- Meilisearch

Документация (ключевые источники):
- Directus: Docker + ADMIN_* переменные для автосоздания админа (11.10.0 и выше) citeturn1view1turn0search9
- Directus: Collections API (POST /collections) citeturn3view0
- Directus: Fields API (POST /fields/{collection}) citeturn4view0
- Meilisearch: Search API citeturn0search6

Требования
----------
- Docker + Docker Compose

Быстрый запуск (полностью с нуля)
---------------------------------
1) Скопируйте env:

   cp .env.example .env

   Важно:
   - DIRECTUS_TOKEN и MEILI_API_KEY должны быть непустыми и одинаковыми с тем, что используется в docker-compose.yml.
   - DIRECTUS_TOKEN используется как ADMIN_TOKEN (статический токен админа Directus на первом старте). citeturn0search9turn1view1

2) Поднимите сервисы:

   docker compose up -d --build

3) Создайте структуру данных в Directus (коллекции и поля) автоматически:

   docker compose run --rm tools scripts/bootstrap-directus.mjs

   Скрипт создаст коллекции:
   - product_types_items, millings, films, colors, edges, patinas
   - special_offers, news, solutions, gallery_items
   - site_settings (singleton)

4) Заполните демо-данные:

   docker compose run --rm tools scripts/seed.mjs

5) Постройте индекс поиска в Meilisearch:

   docker compose run --rm tools scripts/reindex.mjs

6) Откройте сайт:

   http://localhost:3000

7) (Опционально) Откройте Directus Studio:

   http://localhost:8055

   Логин/пароль по умолчанию (на первом старте):
   - admin@example.com
   - admin12345

   Примечание: если вы уже запускали контейнер раньше, Directus не пересоздаст админа с новыми переменными — нужно удалить volume pgdata и начать заново. citeturn0search3turn6search13

Команды
-------
- Остановить:

  docker compose down

- Сбросить всё (включая базу и индекс) и начать заново:

  docker compose down -v

Как это устроено
----------------
1) Directus хранит контент (коллекции).
2) Скрипт scripts/reindex.mjs читает контент из Directus и выгружает опубликованные записи в индекс Meilisearch "catalog".
3) Страница /search делает запросы в Meilisearch и строит выдачу.
4) Разделы каталога (/catalog/...) читаются напрямую из Directus.

Важно про безопасность
----------------------
В MVP сайт читает Directus по серверному токену (DIRECTUS_TOKEN) и не открывает публичные права. Это упрощает запуск и снижает риск “случайно открыть” данные наружу.

Следующие шаги (если будете расширять)
--------------------------------------
- Добавить загрузку изображений (Directus Files) и вывести галереи.
- Добавить “заявки” (requests) как коллекцию + форму на фронте.
- Добавить вебхук Directus (outgoing webhook) на переиндексацию Meilisearch при изменениях. citeturn2search0turn0search19
