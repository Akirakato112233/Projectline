import json
from datetime import datetime
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from django.utils.dateparse import parse_datetime

from myapp.models import ZodiacKnowledge


def extract_records(payload):
    if isinstance(payload, list):
        return payload

    if isinstance(payload, dict):
        for key in ("data", "items", "records", "results"):
            value = payload.get(key)
            if isinstance(value, list):
                return value

    raise CommandError("JSON must be a list or contain a list in data/items/records/results")


def first_value(record, *keys):
    for key in keys:
        value = record.get(key)
        if value not in (None, ""):
            return value
    return None


def parse_published_at(value):
    if not value:
        return None

    if isinstance(value, datetime):
        dt = value
    else:
        text = str(value).strip()
        dt = parse_datetime(text)
        if dt is None:
            try:
                dt = datetime.fromisoformat(text.replace("Z", "+00:00"))
            except ValueError as exc:
                raise CommandError(f"Invalid published_at value: {value}") from exc

    if timezone.is_naive(dt):
        dt = timezone.make_aware(dt, timezone.get_current_timezone())

    return dt


def normalize_record(record, index):
    if not isinstance(record, dict):
        raise CommandError(f"Record {index} is not an object")

    subject = first_value(record, "subject", "zodiac", "sign")
    category = first_value(record, "category", "section", "topic")
    content = first_value(record, "content", "text", "body", "description")

    if not subject or not category or not content:
        raise CommandError(
            f"Record {index} is missing required fields: subject/category/content"
        )

    return ZodiacKnowledge(
        subject=str(subject).strip(),
        category=str(category).strip(),
        content=str(content).strip(),
        source=str(first_value(record, "source") or "").strip(),
        source_url=str(first_value(record, "source_url", "url") or "").strip(),
        source_title=str(first_value(record, "source_title", "title") or "").strip(),
        published_at=parse_published_at(
            first_value(record, "published_at", "published", "published_date", "date")
        ),
    )


class Command(BaseCommand):
    help = "Import zodiac knowledge records from a JSON file"

    def add_arguments(self, parser):
        parser.add_argument("json_path", help="Path to the JSON file")
        parser.add_argument(
            "--replace",
            action="store_true",
            help="Delete existing ZodiacKnowledge rows before importing",
        )

    def handle(self, *args, **options):
        json_path = Path(options["json_path"]).expanduser()
        if not json_path.exists():
            raise CommandError(f"File not found: {json_path}")

        with json_path.open("r", encoding="utf-8") as file:
            payload = json.load(file)

        records = extract_records(payload)
        objects = [normalize_record(record, index) for index, record in enumerate(records, start=1)]

        if options["replace"]:
            ZodiacKnowledge.objects.all().delete()

        ZodiacKnowledge.objects.bulk_create(objects)
        self.stdout.write(self.style.SUCCESS(f"Imported {len(objects)} records"))
