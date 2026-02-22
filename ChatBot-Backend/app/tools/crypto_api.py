import requests

BASE_URL = "https://api.coingecko.com/api/v3/simple/price"


def get_crypto_price(coin: str):
    """
    Fetch live crypto price in USD
    Example input: 'bitcoin', 'ethereum', 'solana'
    """

    params = {
        "ids": coin.lower(),
        "vs_currencies": "usd"
    }

    response = requests.get(BASE_URL, params=params, timeout=10)
    response.raise_for_status()

    data = response.json()

    if coin.lower() not in data:
        raise ValueError(f"Unknown coin: {coin}")

    return {
        "coin": coin,
        "price_usd": data[coin.lower()]["usd"]
    }



if __name__ == "__main__":
    print(get_crypto_price("bitcoin"))