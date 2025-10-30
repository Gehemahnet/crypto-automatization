# Автоматизация для отработки протоколов в блокчейне

### Установка Solflare кошелька

1. [Ставим](https://chromewebstore.google.com/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic) на основной хром 
2. Вставляем в адресную строку chrome://version//version/ в браузере. Ищем строку `Путь к профилю`. Получаем примерно следующее \Google\Chrome\User Data\Default
3. Перейти в папку Extensions\{extensionId}.(его можно узнать в ссылке на магазин хрома) и скопировать все данные
4. Создать директорию в папке проекта solflare_extension и распаковать туда содержимое

### [Titan Dex](https://titan.exchange/@gehemahnet)

1. Установить расширение solflare
2. Создать директорию в папке проекта solflare_extension и распаковать туда расширение через архиватор
3. Загнать данные в .env (Solana)
4. Установить пакеты  `yarn install`
5. Установить браузеры  `npx playwright install`
6. Отрегулировать файл config.ts
7. Запустить `yarn run startTitanDex`

### [RangerFinance](https://www.app.ranger.finance?ref_code=6d1f6ad13df241549cb557ec46c5f2da)

Пока работает с небольшими грешками механизм авторизации, можно помочь автоматизатору дойти до свапов. Дальше он сам

1. Установить расширение solflare
2. Создать директорию в папке проекта solflare_extension и распаковать туда расширение через архиватор
3. Загнать данные в .env (Solana)
4. Установить пакеты  `yarn install`
5. Установить браузеры  `npx playwright install`
6. Отрегулировать файл config.ts
7. Запустить `yarn run startRangerFinance`

