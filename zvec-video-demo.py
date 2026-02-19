#!/usr/bin/env python3
"""
zvec Video Storage Example
Stores video frames as vectors for similarity search
"""

import zvec
import numpy as np
from PIL import Image
import os

# Configuration
VIDEO_DIR = "/tmp/openclaw-video"
DB_PATH = "/home/node/.openclaw/workspace/zvec-video-db"

def setup_video_collection():
    """Create zvec collection for video frames"""
    # Define schema for video frames
    # Each frame is stored as a 512-dimensional vector (can be adjusted)
    schema = zvec.CollectionSchema(
        name="video_frames",
        vectors=zvec.VectorSchema("embedding", zvec.DataType.VECTOR_FP32, 512),
        fields=[
            zvec.FieldSchema("frame_id", zvec.DataType.STRING),
            zvec.FieldSchema("video_name", zvec.DataType.STRING),
            zvec.FieldSchema("timestamp", zvec.DataType.FLOAT),
        ]
    )
    
    # Create or open collection
    collection = zvec.create_and_open(path=DB_PATH, schema=schema)
    return collection

def extract_frame_features(image_path):
    """
    Extract simple feature vector from image
    In production, use a proper image embedding model like CLIP
    """
    img = Image.open(image_path).convert('RGB')
    img = img.resize((64, 64))  # Resize for consistency
    
    # Convert to numpy and flatten
    arr = np.array(img).astype(np.float32) / 255.0
    
    # Create a 512-dim vector by:
    # 1. Flatten the image (64*64*3 = 12288)
    # 2. Average pool to 512 dimensions
    flat = arr.flatten()
    
    # Simple pooling to 512 dims
    pool_size = len(flat) // 512
    features = []
    for i in range(512):
        start = i * pool_size
        end = start + pool_size
        features.append(np.mean(flat[start:end]))
    
    return np.array(features, dtype=np.float32)

def store_video_frames(collection, video_name, frame_dir):
    """Store video frames in zvec"""
    frame_files = sorted([f for f in os.listdir(frame_dir) if f.endswith('.jpg')])
    
    docs = []
    for i, frame_file in enumerate(frame_files):
        frame_path = os.path.join(frame_dir, frame_file)
        
        # Extract features
        embedding = extract_frame_features(frame_path)
        
        # Create document
        doc = zvec.Doc(
            id=f"{video_name}_frame_{i}",
            vectors={"embedding": embedding.tolist()},
            fields={
                "frame_id": frame_file,
                "video_name": video_name,
                "timestamp": float(i)
            }
        )
        docs.append(doc)
        print(f"  Processed: {frame_file}")
    
    # Insert all frames
    collection.insert(docs)
    return len(docs)

def search_similar_frames(collection, query_frame_path, topk=5):
    """Search for frames similar to query"""
    query_embedding = extract_frame_features(query_frame_path)
    
    results = collection.query(
        zvec.VectorQuery("embedding", vector=query_embedding.tolist()),
        topk=topk
    )
    
    return results

def main():
    print("🎬 zvec Video Storage Demo")
    print("=" * 50)
    
    # Setup
    print("\n1️⃣ Setting up zvec collection...")
    collection = setup_video_collection()
    print(f"   ✅ Collection ready at: {DB_PATH}")
    
    # Store video frames
    print("\n2️⃣ Storing OpenClaw intro video frames...")
    frame_dir = "/tmp/video-frames"
    if os.path.exists(frame_dir):
        count = store_video_frames(collection, "openclaw_intro", frame_dir)
        print(f"   ✅ Stored {count} frames")
    else:
        print(f"   ⚠️  Frame directory not found: {frame_dir}")
    
    # Search demo
    print("\n3️⃣ Testing similarity search...")
    if os.path.exists(f"{frame_dir}/frame1.jpg"):
        results = search_similar_frames(collection, f"{frame_dir}/frame1.jpg", topk=3)
        print(f"   🔍 Top 3 similar frames to frame1.jpg:")
        for r in results:
            print(f"      - {r['id']}: score={r['score']:.4f}")
    
    print("\n" + "=" * 50)
    print("✅ Video storage demo complete!")
    print(f"📁 Database location: {DB_PATH}")
    print("\n💡 Features:")
    print("   • Vector embeddings for each frame")
    print("   • Similarity search across videos")
    print("   • Metadata storage (frame_id, timestamp)")
    print("   • Scalable to millions of frames")

if __name__ == "__main__":
    main()