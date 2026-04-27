FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential libpq-dev netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY myproject /app/myproject

RUN chmod +x /app/myproject/docker-entrypoint.sh

WORKDIR /app/myproject

EXPOSE 8000

CMD ["/app/myproject/docker-entrypoint.sh"]
