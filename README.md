# Taskflow Projesi 

## Bu proje, PHP (Laravel) tabanlı bir RESTful API ile React tabanlı bir ön yüzü birleştiren kapsamlı bir yapılacaklar listesi uygulamasıdır. Kullanıcılar, yapılacaklar listelerini kategorilere ayırabilir, yeni görevler ekleyebilir, mevcut görevleri düzenleyebilir ve tamamlayabilir.

## Özellikler

- Kullanıcı girişi
- Kategori Yönetimi
- Todo Ekleme/Düzenleme
- Ana Sayfa
- CRUD (Create, Read, Update, Delete) işlemleri
- Responsive tasarım
- Gerçek zamanlı veri güncelleme
- ORM Kullanımı: Eloquent
- Migrasyon Scriptleri
- Seed Data
- OOP prensipleri uygun
- Sınıf autoloading için PSR-4 standardı kullanma
- Composer kullanımı (dependency management için)
- Kendi router yapısını oluşturma
- Filtreleme
- Her todo için hızlı durum değiştirme
- Loading States
- Toast Notifications
- Empty States
- React Hook kullanımı

## 🛠️ Teknoloji Stack’i

**Frontend:**

- JavaScript Kütüphanesi: React (Sürüm: 19.1.0)
- Routing Kütüphanesi: React Router (Sürüm: v6+)
- State Yönetimi: Context API
- HTTP İstek Kütüphanesi: Axios
- UI Kütüphanesi/Styling: Tailwind CSS (Sürüm: 3.4.17)
- Kullanılan Diğer Front-end Kütüphaneleri:
    @dnd-kit/core (6.3.1) - Sürükle ve bırak işlevselliği için temel kütüphane.
    @dnd-kit/modifiers (9.0.0) - Sürükle ve bırak etkileşimleri için değiştiriciler.
    @dnd-kit/sortable (10.0.0) - Sıralanabilir listeler için sürükle ve bırak desteği.
    @dnd-kit/utilities (3.2.2) - Dnd-kit yardımcı fonksiyonları.
    @heroicons/react (2.2.0) - Heroicons kütüphanesinden React bileşenleri.
    @testing-library/dom (10.4.0) - DOM test yardımcıları.
    @testing-library/jest-dom (6.6.3) - Jest DOM için özel eşleştiriciler.
    @testing-library/react (16.3.0) - React bileşenleri için test yardımcıları.
    @testing-library/user-event (13.5.0) - Kullanıcı etkileşimlerini simüle etmek için kütüphane.
    autoprefixer (10.4.21) - CSS satıcı öneklerini otomatik ekler.
    postcss (8.5.3) - CSS dönüşüm aracı.
    react-datepicker (8.3.0) - React için tarih seçici bileşeni.
    react-dom (19.1.0) - React'i DOM'a bağlayan paket.
    react-hook-form (7.56.4) - Form yönetimi için performanslı, esnek ve genişletilebilir kütüphane.
    react-icons (5.5.0) - Popüler ikon setlerinin React bileşenleri olarak kullanımı.
    react-scripts (5.0.1) - Create React App tarafından kullanılan scriptler.
    react-toastify (11.0.5) - React uygulamaları için toast bildirimleri.
    recharts (2.15.3) - React bileşenleri ile grafik oluşturma kütüphanesi.
    web-vitals (2.1.4) - Web performansını ölçmek için kütüphane.

**Backend:**

- Programlama Dili: PHP (Sürüm: 8.3.16)
- Framework: Laravel (Sürüm: 12.15.0)
- Veritabanı: MySQL (Sürüm: 8.4.3)
- Bağımlılık Yönetimi: Composer
- Kod Standardı: PSR-4 Autoloading
- Mimari Yaklaşım: RESTful API
- ary-precision arithmetic...
    brick/math (0.12.3) - Arbitrary-precision arithmetic.
    carbonphp/carbon-doctrine-types (3.2.0) - Types to use Carbon in Doctrine.
    darkaonline/l5-swagger (9.0.1) - OpenAPI (Swagger) entegrasyonu.
    dflydev/dot-access-data (3.0.3) - Given a deep data structure, access data using dot notation.
    doctrine/annotations (2.0.2) - Docblock Annotations Parser.
    doctrine/inflector (2.0.10) - PHP Doctrine Inflector for singular/plural transformations.
    doctrine/lexer (3.0.1) - PHP Doctrine Lexer parser library.
    dragonmantank/cron-expression (3.4.0) - CRON for PHP: Calculate the next/previous run date.
    egulias/email-validator (4.0.4) - A library for validating emails.
    fakerphp/faker (1.24.1) - PHP için sahte veri üretici kütüphane.
    filp/whoops (2.18.0) - PHP hata işleme kütüphanesi.
    fruitcake/php-cors (1.3.0) - Cross-origin resource sharing (CORS) library.
    graham-campbell/result-type (1.1.3) - An Implementation Of The Result Type.
    guzzlehttp/guzzle (7.9.3) - PHP HTTP istemci kütüphanesi.
    guzzlehttp/promises (2.2.0) - Guzzle promises library.
    guzzlehttp/psr7 (2.7.1) - PSR-7 mesaj uygulaması.
    guzzlehttp/uri-template (1.0.4) - A polyfill class for uri_template.
    hamcrest/hamcrest-php (2.1.1) - PHP port of Hamcrest.
    laravel/framework (12.15.0) - Laravel Framework.
    laravel/pail (1.2.2) - Laravel günlüğüne kolayca dalın.
    laravel/pint (1.22.1) - Laravel için kod biçimlendirici.
    laravel/prompts (0.3.5) - Beautiful and user-friendly prompts.
    laravel/sail (1.43.0) - Docker files for running a basic Laravel application.
    laravel/sanctum (4.1.1) - Laravel Sanctum API kimlik doğrulaması.
    laravel/serializable-closure (2.0.4) - Laravel Serializable Closure.
    laravel/tinker (2.10.1) - Laravel için güçlü REPL.
    laravel/ui (4.6.1) - Laravel UI yardımcıları ve ön ayarları.
    league/commonmark (2.7.0) - Highly-extensible PHP Markdown parser.
    league/config (1.2.0) - Define configuration arrays.
    league/flysystem (3.29.1) - PHP için dosya depolama soyutlama.
    league/flysystem-local (3.29.0) - Yerel dosya sistemi adaptörü.
    league/mime-type-detection (1.16.0) - Mime-type algılama.
    league/uri (7.5.1) - URI işleme kütüphanesi.
    league/uri-interfaces (7.5.0) - URI için ortak arayüzler.
    mockery/mockery (1.6.12) - PHP için esnek alay kütüphanesi.
    monolog/monolog (3.9.0) - Logları dosyalara, soketlere vb. gönderir.
    myclabs/deep-copy (1.13.1) - Derin kopyalar oluşturur.
    nesbot/carbon (3.9.1) - DateTime için bir API uzantısı.
    nette/schema (1.3.2) - Nette Şema: veri yapısını doğrulama.
    nette/utils (4.0.6) - Nette Yardımcıları: hafif yardımcı fonksiyonlar.
    nikic/php-parser (5.4.0) - PHP ile yazılmış PHP ayrıştırıcısı.
    nunomaduro/collision (8.8.0) - Konsol uygulamaları için CLI hata işleme.
    nunomaduro/termwind (2.3.1) - CLI için Tailwind CSS benzeri bir yapı.
    phar-io/manifest (2.0.4) - Phar.io manifestlerini okuma bileşeni.
    phar-io/version (3.2.1) - Sürüm bilgilerini işlemek için kütüphane.
    phpoption/phpoption (1.9.3) - PHP için Seçenek Türü.
    phpunit/php-code-coverage (11.0.9) - Kod kapsamı toplama.
    phpunit/php-file-iterator (5.1.0) - Dosya yineleyici.
    phpunit/php-invoker (5.0.1) - Zaman aşımı ile çağrılabilirleri çağırma.
    phpunit/php-text-template (4.0.1) - Basit şablon motoru.
    phpunit/php-timer (7.0.1) - Zamanlama için yardımcı sınıf.
    phpunit/phpunit (11.5.21) - PHP Birim Test Çerçevesi.
    psr/cache (3.0.0) - Önbellekleme için ortak arayüz.
    psr/clock (1.0.0) - Saati okumak için ortak arayüz.
    psr/container (2.0.2) - Ortak Konteyner Arayüzü.
    psr/event-dispatcher (1.0.0) - Olay işleme için standart arayüzler.
    psr/http-client (1.0.3) - HTTP istemcileri için ortak arayüz.
    psr/http-factory (1.1.0) - PSR-17: HTTP mesajları için ortak arayüzler.
    psr/http-message (2.0) - HTTP mesajları için ortak arayüz.
    psr/log (3.0.2) - Günlük kaydı için ortak arayüz.
    psr/simple-cache (3.0.0) - Basit önbellek için ortak arayüzler.
    psy/psysh (0.12.8) - Modern PHP için etkileşimli bir kabuk.
    ralouphie/getallheaders (3.0.3) - getallheaders için polyfill.
    ramsey/collection (2.1.1) - Koleksiyonları temsil etmek için PHP kütüphanesi.
    ramsey/uuid (4.7.6) - UUID oluşturmak için PHP kütüphanesi.
    sebastian/cli-parser (3.0.2) - CLI seçeneklerini ayrıştırma kütüphanesi.
    sebastian/code-unit (3.0.3) - Kod birimlerini temsil eden değer nesneleri koleksiyonu.
    sebastian/code-unit-reverse-lookup (4.0.1) - Fonksiyon veya metod arama.
    sebastian/comparator (6.3.1) - Karşılaştırma işlevselliği.
    sebastian/complexity (4.0.1) - Karmaşıklığı hesaplama kütüphanesi.
    sebastian/diff (6.0.2) - Fark (Diff) uygulaması.
    sebastian/environment (7.2.1) - Ortam bilgilerini işleme işlevselliği.
    sebastian/exporter (6.3.0) - Değerleri dışa aktarma işlevselliği.
    sebastian/global-state (7.0.2) - Küresel durumu anlık görüntüleme.
    sebastian/lines-of-code (3.0.1) - Kod satırlarını sayma kütüphanesi.
    sebastian/object-enumerator (6.0.1) - Dizi yapılarını ve nesneleri gezinme.
    sebastian/object-reflector (4.0.1) - Nesne özelliklerinin yansıması.
    sebastian/recursion-context (6.0.2) - Özyineleme bağlamı.
    sebastian/type (5.1.2) - Türleri temsil eden değer nesneleri koleksiyonu.
    sebastian/version (5.0.2) - Sürüm yönetimi.
    staabm/side-effects-detector (1.0.5) - Yan etkileri algılamak için statik analiz aracı.
    swagger-api/swagger-ui (5.22.0) - Swagger UI'nin ön yüz bileşenleri.
    symfony/clock (7.2.0) - Uygulamaları zamanlamadan ayırır.
    symfony/console (7.2.6) - Konsol uygulamaları oluşturmayı kolaylaştırır.
    symfony/css-selector (7.2.0) - CSS seçicileri XPath'e dönüştürür.
    symfony/deprecation-contracts (3.5.1) - Geçersizleştirme sözleşmeleri.
    symfony/error-handler (7.2.5) - Hataları yönetme araçları.
    symfony/event-dispatcher (7.2.0) - Olayları göndermek için araçlar.
    symfony/event-dispatcher-contracts (3.5.1) - Olay dağıtımıyla ilgili genel soyutlamalar.
    symfony/finder (7.2.2) - Dosya ve dizinleri bulur.
    symfony/http-foundation (7.2.6) - HTTP istekleri ve yanıtları için nesne yönelimli katman.
    symfony/http-kernel (7.2.6) - Yapılandırılmış bir istek işleme süreci sağlar.
    symfony/mailer (7.2.6) - E-posta göndermeye yardımcı olur.
    symfony/mime (7.2.6) - MIME mesajlarını işleme.
    symfony/polyfill-ctype (1.32.0) - ctype fonksiyonları için polyfill.
    symfony/polyfill-intl-grapheme (1.32.0) - intl'in grapheme fonksiyonları için polyfill.
    symfony/polyfill-intl-idn (1.32.0) - intl'in IDN fonksiyonları için polyfill.
    symfony/polyfill-intl-normalizer (1.32.0) - intl'in Normalizer fonksiyonları için polyfill.
    symfony/polyfill-mbstring (1.32.0) - Çok baytlı dizeler için polyfill.
    symfony/polyfill-php80 (1.32.0) - PHP 8.0 özellikleri için polyfill.
    symfony/polyfill-php83 (1.32.0) - PHP 8.3 özellikleri için polyfill.
    symfony/polyfill-uuid (1.32.0) - UUID fonksiyonları için polyfill.
    symfony/process (7.2.5) - Alt işlemlerde komutları yürütür.
    symfony/routing (7.2.3) - HTTP isteğini bir dizi rotaya eşler.
    symfony/service-contracts (3.5.1) - Servis sözleşmeleri.
    symfony/string (7.2.6) - Nesne yönelimli API sağlar.
    symfony/translation (7.2.6) - Uluslararasılaştırma ve yerelleştirme araçları.
    symfony/translation-contracts (3.5.1) - Çeviri sözleşmeleri.
    symfony/uid (7.2.0) - UUID oluşturmak için nesne yönelimli API.
    symfony/var-dumper (7.2.6) - Değişkenleri dump etme mekanizmaları.
    symfony/yaml (7.2.6) - YAML dosyalarını yükler ve dışa aktarır.
    theseer/tokenizer (1.2.3) - Metinleri jetonlara dönüştürmek için küçük bir kütüphane.
    tijsverkoyen/css-to-inline-styles (2.3.0) - CSS'i satır içi stillere dönüştürür.
    vlucas/phpdotenv (5.6.2) - Ortam değişkenlerini .env dosyasından yükler.
    voku/portable-ascii (2.0.3) - Taşınabilir ASCII kütüphanesi.
    webmozart/assert (1.11.0) - Metot girdilerini doğrulamak için iddialar.
    zircote/swagger-php (5.1.3) - Etkileşimli API dokümantasyonu oluşturur.

**Genel Geliştirme Ortamı**

- Laragon: Sürüm: 7.0.4
- Bağımlılık Yönetimi (PHP): Composer
- Bağımlılık Yönetimi (React): npm

## Kurulum Adımları

### Ön Gereksinimler
- Laragon (veya PHP, Composer, MySQL kurulu bir ortam zampp olabilir)
- Node.js ve npm

### Back-End Kurulumu

1. Depoyu klonlayın:
   git clone https://github.com/Esra-Demirtas/taskflow
   cd backend

2. Bağımlılıkları Yükleyin:
   composer install

3. Ortam Değişkenlerini Ayarlayın:
   - backend dizininde bulunan .env.example dosyasını backend/.env olarak kopyalayın.
   - backend/.env dosyasını açın ve MySQL veritabanı bağlantı bilgilerinizi güncelleyin. Laragon kullanıyorsanız varsayılan bilgiler genellikle aşağıdaki gibidir:
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=taskflow
   DB_USERNAME=root
   DB_PASSWORD=yeni_sifreniz
   - Veritabanınızı oluşturmayı unutmayın (örneğin PhpMyAdmin veya MySQL Workbench kullanarak taskflow adında bir veritabanı oluşturun).

4. Uygulama anahtarını oluşturun:
    php artisan key:generate

5. Veritabanı tablolarını oluşturun ve başlangıç verilerini ekleyin (isteğe bağlı):
    php artisan migrate --seed


### Front-end Kurulumu

1. Depoyu klonlayın:
   git clone https://github.com/Esra-Demirtas/taskflow
   cd frontend

2. Bağımlılıkları Yükleyin:
   npm install

3. Ortam Değişkenlerini Ayarlayın:
   - Eğer front-end için API URL'i gibi ortam değişkenleri kullanıyorsanız, frontend/.env.example dosyasını frontend/.env olarak kopyalayın ve gerekli değerleri doldurun. Örneğin:
   REACT_APP_API_URL=http://localhost:8000/api

### Back-end Çalıştırma Talimatları

1. Back-end dizininde olduğunuzdan emin olun:
   cd taskflow/backend

2. Laravel geliştirme sunucusunu başlatın:
   php artisan serve

3. Ortam Değişkenlerini Ayarlayın:
   - Eğer front-end için API URL'i gibi ortam değişkenleri kullanıyorsanız, frontend/.env.example dosyasını frontend/.env olarak kopyalayın ve gerekli değerleri doldurun. Örneğin:
   REACT_APP_API_URL=http://localhost:8000/api

### Front-end Çalıştırma Talimatları

1. Front-end dizininde olduğunuzdan emin olun:
   cd taskflow/frontend

2. React geliştirme sunucusunu başlatın:
   npm start

##  API Dokümantasyonu

### Kategoriler (Categories)
    - GET /api/categories: Tüm kategorileri listele
    - POST /api/categories: Yeni bir kategori oluştur
    - PUT /api/categories/{id}: Belirli bir kategoriyi günceller.
    - DELETE /api/categories/{id}: Belirli bir kategoriyi siler.

### Yapılaccaklar (Todos)
    - GET /api/todos: Tüm görevleri listeler.
    - POST /api/todos: Yeni bir görev oluşturur.
    - GET /api/todos/{id}: Belirli bir göreve ait detayları getirir.
    - PUT /api/todos/{id}: Belirli bir görevi günceller.
    - DELETE /api/todos/{id}: Belirli bir görevi siler.

### Örnek Kullanım Senaryoları

   1. Yeni Bir Kategori Oluşturma:
   - Tarayıcınızda http://localhost:3000 adresine gidin.
   - Kategori ekleme bölümünden "İş" adında yeni bir kategori oluşturun.

   2. Yeni Bir Görev Ekleme:
   - Görev ekleme bölümünden "Case Çalışması" adında yeni bir görev oluşturun

   3. Görevi Düzenleme:
   - Görev başlığını "Proje Çalışması" olarak değiştirin ve kaydedin.

### Bonus
- Rate limiting
- Middleware
- Tema Desteği
- Kullanıcı kaydı ve girişi
- WT tabanlı kimlik doğrulama
- WebSocket ile gerçek zamanlı güncellemeler
- Sürükle ve bırak ile durum değiştirme (Kanban board)
- Todo'lar için etiketler ve renkli işaretler