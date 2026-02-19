# zvec Video Storage Demo

## Overview
This demonstration shows how zvec vector database can store and search video frames.

## What is zvec?
zvec is Alibaba's open-source, in-process vector database designed for AI applications.
- ⚡ Lightning-fast similarity search
- 🔒 In-process (no separate server)
- 📦 Lightweight and embeddable
- 🤖 Perfect for AI/ML applications

## Files
- `vectors.npy` - Vector embeddings (512-dim per frame)
- `metadata.json` - Frame metadata

## Usage
```python
import zvec

# Create collection
schema = zvec.CollectionSchema(
    name="video_frames",
    vectors=zvec.VectorSchema("embedding", zvec.DataType.VECTOR_FP32, 512),
)
collection = zvec.create_and_open(path="./zvec-video-db", schema=schema)

# Insert frame
frame_vector = extract_features(frame_image)
collection.insert([
    zvec.Doc(id="frame_1", vectors={"embedding": frame_vector})
])

# Search similar frames
results = collection.query(
    zvec.VectorQuery("embedding", vector=query_vector),
    topk=10
)
```

## Performance
- Search billions of vectors in milliseconds
- In-process = zero network latency
- Minimal memory footprint

## Links
- GitHub: https://github.com/alibaba/zvec
- Docs: https://zvec.org/en/docs/
- PyPI: https://pypi.org/project/zvec/
