import base64
import hashlib
import hmac
import json
import os
import statistics
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests

BASE_URL = os.getenv("BASE_URL", "https://astroflow.a-zens.com")
WEBHOOK_PATH = os.getenv("WEBHOOK_PATH", "/api/line/webhook/")
CHANNEL_SECRET = os.getenv("LINE_CHANNEL_SECRET", "")
WEBHOOK_MESSAGE = os.getenv("WEBHOOK_MESSAGE", "ไพ่ทาโร่")

TOTAL_REQUESTS = int(os.getenv("TOTAL_REQUESTS", "20"))
CONCURRENCY = int(os.getenv("CONCURRENCY", "2"))
    
URL = f"{BASE_URL}{WEBHOOK_PATH}"


def make_body(index):
    return {
        "destination": "test-destination",
        "events": [
            {
                "type": "message",
                "mode": "active",
                "timestamp": int(time.time() * 1000),
                "source": {
                    "type": "user",
                    "userId": f"loadtest-user-{index}",
                },
                "webhookEventId": f"loadtest-event-{index}-{int(time.time() * 1000)}",
                "deliveryContext": {"isRedelivery": False},
                "replyToken": f"dummy-reply-token-{index}",
                "message": {
                    "id": f"{index}",
                    "type": "text",
                    "text": WEBHOOK_MESSAGE,
                },
            }
        ],
    }


def sign_body(raw_body: str) -> str:
    digest = hmac.new(
        CHANNEL_SECRET.encode("utf-8"),
        raw_body.encode("utf-8"),
        hashlib.sha256,
    ).digest()
    return base64.b64encode(digest).decode("utf-8")


def run_one(index):
    body = make_body(index)
    raw_body = json.dumps(body, ensure_ascii=False, separators=(",", ":"))
    signature = sign_body(raw_body)

    headers = {
        "Content-Type": "application/json",
        "X-Line-Signature": signature,
    }

    started = time.perf_counter()
    response = requests.post(URL, data=raw_body.encode("utf-8"), headers=headers, timeout=30)
    elapsed_ms = (time.perf_counter() - started) * 1000

    return {
        "index": index,
        "status": response.status_code,
        "ok": response.ok,
        "elapsed_ms": elapsed_ms,
        "body": response.text[:200],
    }


def main():
    if not CHANNEL_SECRET:
        raise SystemExit("Please set LINE_CHANNEL_SECRET before running this script.")

    results = []
    started = time.perf_counter()

    with ThreadPoolExecutor(max_workers=CONCURRENCY) as executor:
        futures = [executor.submit(run_one, i) for i in range(1, TOTAL_REQUESTS + 1)]
        for future in as_completed(futures):
            results.append(future.result())

    wall = time.perf_counter() - started
    latencies = [item["elapsed_ms"] for item in results]
    success = [item for item in results if item["ok"]]
    failed = [item for item in results if not item["ok"]]

    print(f"Total requests: {TOTAL_REQUESTS}")
    print(f"Concurrency: {CONCURRENCY}")
    print(f"Message: {WEBHOOK_MESSAGE}")
    print(f"Wall time: {wall:.2f}s")
    print(f"Requests/sec: {TOTAL_REQUESTS / wall:.2f}")
    print(f"Success: {len(success)}")
    print(f"Failed: {len(failed)}")
    print(f"Min latency: {min(latencies):.2f} ms")
    print(f"Median latency: {statistics.median(latencies):.2f} ms")
    print(f"Mean latency: {statistics.mean(latencies):.2f} ms")
    print(f"Max latency: {max(latencies):.2f} ms")

    if failed:
        print("\nFailed samples:")
        for item in failed[:5]:
            print(json.dumps(item, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
