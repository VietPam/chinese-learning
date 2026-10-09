"""Generate only missing/changed sentence recordings. --check needs Python stdlib only."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
REPO = "hexgrad/Kokoro-82M-v1.1-zh"
REVISION = "01e7505bd6a7a2ac4975463114c3a7650a9f7218"
VOICE = "zm_010"
SPEED = 0.9
RATE = 24000
MANIFEST = ROOT / "lib/audio-manifest.json"

def digest(data):
    return hashlib.sha256(data).hexdigest()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    content = (ROOT / "lib/content.ts").read_text()
    phrases = json.loads(content.split("export const phrases: readonly Phrase[] = ", 1)[1].strip().removesuffix(";"))
    # Dedupe repeated vocabulary by both Hanzi and pronunciation.
    words = {f'word:{w["hanzi"]}:{w["pinyin"]}': w for phrase in phrases for w in phrase["words"]}
    phrases += [{"id": key, "hanzi": word["hanzi"], "pinyin": word["pinyin"]} for key, word in words.items()]
    old = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    entries, pending = {}, []
    for phrase in phrases:
        identity = [phrase["hanzi"], REPO, REVISION, VOICE, SPEED, (ROOT / "scripts/audio-requirements.txt").read_text(), 1]
        if "pinyin" in phrase and phrase["id"].startswith("word:"):
            identity += [phrase["pinyin"], "word-v1"]
        key = digest(json.dumps(identity, ensure_ascii=False).encode())[:16]
        prefix = "word" if phrase["id"].startswith("word:") else phrase["id"]
        src = f'/audio/{prefix}-{key}.mp3'
        previous = old.get(phrase["id"], {})
        target = ROOT / "public" / src.lstrip("/")
        if not args.force and previous.get("src") == src and previous.get("text") == phrase["hanzi"] and target.exists() and digest(target.read_bytes()) == previous.get("sha256"):
            entries[phrase["id"]] = previous
        else:
            pending.append((phrase, src, target))
    if args.check:
        if pending or set(old) != set(entries):
            raise SystemExit(f'Audio missing/stale: {[p[0]["id"] for p in pending]}')
        print(f"Verified {len(entries)} recordings")
        return
    if pending:
        import numpy as np
        import soundfile as sf
        import torch
        from huggingface_hub import hf_hub_download
        from kokoro import KModel, KPipeline
        torch.set_num_threads(2)
        torch.manual_seed(0)
        def download(filename):
            return hf_hub_download(repo_id=REPO, filename=filename, revision=REVISION)
        model = KModel(repo_id=REPO, config=download("config.json"), model=download("kokoro-v1_1-zh.pth")).to("cpu").eval()
        pipeline = KPipeline(lang_code="z", repo_id=REPO, model=model)
        voice = torch.load(download(f"voices/{VOICE}.pt"), map_location="cpu", weights_only=True)
        for phrase, src, target in pending:
            chunks = [result.audio.numpy() for result in pipeline(phrase["hanzi"], voice=voice, speed=SPEED)]
            if not chunks:
                raise RuntimeError(f'No audio for {phrase["id"]}')
            waveform = np.concatenate(chunks)
            duration = len(waveform) / RATE
            if not np.isfinite(waveform).all() or np.max(np.abs(waveform)) < .001 or not .3 < duration < 30:
                raise RuntimeError(f'Invalid recording for {phrase["id"]}')
            target.parent.mkdir(parents=True, exist_ok=True)
            with tempfile.TemporaryDirectory() as temp:
                wav = Path(temp) / "audio.wav"
                mp3 = Path(temp) / "audio.mp3"
                sf.write(wav, waveform, RATE)
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-codec:a", "libmp3lame", "-b:a", "64k", str(mp3)], check=True)
                target.write_bytes(mp3.read_bytes())
            entries[phrase["id"]] = {"text": phrase["hanzi"], "src": src, "sha256": digest(target.read_bytes()), "duration": round(duration, 3)}
            print(f'{phrase["id"]}: {duration:.2f}s', flush=True)
    MANIFEST.write_text(json.dumps(dict(sorted(entries.items())), ensure_ascii=False, indent=2) + "\n")
    print(f"Generated {len(pending)}; reused {len(entries) - len(pending)}")

if __name__ == "__main__":
    main()
