import hashlib
import uuid
from typing import Optional

import anthropic
from pinecone import Pinecone

from app.config import settings

anthropic_client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)


def get_pinecone_index():
    """Get or create the Pinecone index."""
    if not settings.pinecone_api_key:
        return None
    pc = Pinecone(api_key=settings.pinecone_api_key)
    return pc.Index(settings.pinecone_index_name)


async def get_embedding(text: str) -> list[float]:
    """Generate an embedding using Anthropic's Voyage via the messages API.

    For MVP, we use a simple hash-based mock embedding when Pinecone is not configured.
    In production, swap this for voyage-3-large or similar.
    """
    # Simple deterministic embedding for MVP when no vector DB is configured
    hash_bytes = hashlib.sha256(text.encode()).digest()
    return [float(b) / 255.0 for b in hash_bytes[:128]]


async def upsert_embedding(
    entry_id: uuid.UUID,
    text: str,
    metadata: dict,
) -> Optional[str]:
    """Embed text and upsert into Pinecone."""
    index = get_pinecone_index()
    if index is None:
        return None

    embedding = await get_embedding(text)
    vector_id = str(entry_id)

    index.upsert(vectors=[{
        "id": vector_id,
        "values": embedding,
        "metadata": metadata,
    }])

    return vector_id


async def query_similar(
    query_text: str,
    employee_id: uuid.UUID,
    top_k: int = 5,
) -> list[dict]:
    """Query Pinecone for similar knowledge entries."""
    index = get_pinecone_index()
    if index is None:
        return []

    embedding = await get_embedding(query_text)

    results = index.query(
        vector=embedding,
        top_k=top_k,
        filter={"employee_id": str(employee_id)},
        include_metadata=True,
    )

    return [
        {
            "id": match["id"],
            "score": match["score"],
            "metadata": match.get("metadata", {}),
        }
        for match in results["matches"]
    ]
