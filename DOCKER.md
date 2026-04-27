# Docker Deploy

## 1. เตรียม env

คัดลอกไฟล์ตัวอย่าง:

```bash
cp .env.docker.example .env
```

แล้วแก้ค่าที่จำเป็นใน `.env` โดยเฉพาะ:

- `DJANGO_SECRET_KEY`
- `DJANGO_ALLOWED_HOSTS`
- `DJANGO_CORS_ALLOWED_ORIGINS`
- `DASHBOARD_PASSWORD`
- `DB_*`
- `LINE_CHANNEL_SECRET`
- `LINE_CHANNEL_ACCESS_TOKEN`
- `DIFY_API_KEY`

## 2. เปิดระบบ

```bash
docker compose up --build
```

หลังจากรันเสร็จ:

- frontend + nginx: `http://localhost`
- Django admin: `http://localhost/admin/`
- API: `http://localhost/api/`

## 3. สร้าง admin user

เปิด shell ใน backend:

```bash
docker compose exec backend python manage.py createsuperuser
```

## โครงสร้าง

- `db` = PostgreSQL
- `backend` = Django + Gunicorn
- `nginx` = เสิร์ฟ React build และ reverse proxy ไป Django

## หมายเหตุ

- static files ของ Django จะถูก collect ไปที่ volume กลาง แล้ว nginx เสิร์ฟที่ `/static/`
- frontend ถูก build เข้า image nginx เลย เหมาะกับ production มากกว่า dev
