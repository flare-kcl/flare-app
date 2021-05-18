#!/usr/bin/env python3
import os

import requests
from requests.structures import CaseInsensitiveDict


if __name__ == "__main__":
    TEMP_DUMMY_KEY = os.environ.get("TEMP_DUMMY_KEY")
    TEMP_BASIC_AUTH = os.environ.get("TEMP_BASIC_AUTH")
    url = "https://onetimesecret.com/api/v1/share"
    headers = CaseInsensitiveDict()
    headers["Content-Type"] = "application/x-www-form-urlencoded"
    headers["Authorization"] = f"Basic {TEMP_BASIC_AUTH}"
    data = f"secret={TEMP_DUMMY_KEY}&ttl=1800&passphrase=abc"
    resp = requests.post(url, headers=headers, data=data)
    print(resp.status_code)
