// Prints the HSK 1 recordings needed by scripts/generate-audio.py as JSON.
import { hsk1AudioItems } from "../lib/hsk1-reading.ts";

console.log(JSON.stringify(hsk1AudioItems()));
