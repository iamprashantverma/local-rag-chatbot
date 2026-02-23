from langchain.tools import tool
from app.tools.crypto_api import get_crypto_price

@tool
def fetch_crypto_price(coin: str) -> dict:
    """Fetch the current price of a cryptocurrency in INR. Use coin names like 'bitcoin', 'ethereum', 'solana'."""
    return get_crypto_price(coin)


available_tools = [fetch_crypto_price]
