#  TaskFlow - Jira Clone

TaskFlow, modern web teknolojileri kullanılarak geliştirilmiş, sürükle-bırak (Drag & Drop) destekli bir Proje Yönetim ve Kanban uygulamasıdır. Kullanıcıların proje oluşturmasına, görev atamasına ve süreçleri anlık olarak takip etmesine olanak tanır.

##  Özellikler

- **Proje Yönetimi:** Yeni projeler oluşturma ve listeleme.
- **Kanban Panosu:** Görevleri "Yapılacak", "Sürüyor" ve "Bitti" sütunlarında görselleştirme.
- **Drag & Drop:** Görev kartlarını sürükleyip bırakarak statü değiştirme (`@dnd-kit` ile).
- **Görev Yönetimi:** Öncelik (Düşük, Orta, Yüksek), Başlık ve Açıklama ile görev oluşturma/silme.
- **Kullanıcı Atama:** Görevlere kullanıcı atama ve baş harflerden oluşan dinamik avatar gösterimi.
- **Modern Arayüz:** Tailwind CSS ile tasarlanmış responsive ve şık UI.

##  Teknolojiler

### Backend (API)
- **.NET 8 Web API:** Güçlü ve hızlı RESTful servisler.
- **Entity Framework Core:** ORM ve veritabanı yönetimi.
- **PostgreSQL:** İlişkisel veritabanı.
- **Docker:** Veritabanı konteynerizasyonu.
- **Swagger:** API dokümantasyonu.

### Frontend (UI)
- **React (Vite):** Hızlı ve modern frontend kütüphanesi.
- **Tailwind CSS:** Stil ve tasarım.
- **Axios:** API iletişimi.
- **@dnd-kit:** Sürükle ve bırak mantığı.
- **React Router:** Sayfa yönlendirmeleri.

##  Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### Gereksinimler
- Node.js & npm
- .NET 8 SDK
- Docker Desktop (PostgreSQL için)

### 1. Backend Kurulumu

```bash
# API klasörüne gidin
cd TaskFlow.API

# Docker konteynerini ayağa kaldırın (PostgreSQL)
docker-compose up -d

# Veritabanını oluşturun (Migration)
dotnet ef database update

# Projeyi çalıştırın
dotnet run
Backend https://localhost:7124 (veya benzeri) adresinde çalışacaktır.

2. Frontend Kurulumu
Bash
# UI klasörüne gidin
cd TaskFlow.UI

# Paketleri yükleyin
npm install

# Projeyi başlatın
npm run dev
Frontend http://localhost:5173 adresinde çalışacaktır.
