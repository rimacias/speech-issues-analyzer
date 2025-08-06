import os
import torch
import librosa
import re
from transformers import WhisperProcessor, WhisperForConditionalGeneration

# Cache model and processor
MODEL_PATH = os.path.join(os.path.dirname(__file__), '.\whisper-finetuned')
_model = None
_processor = None
_device = None

def _load_model():
    global _model, _processor, _device
    if _model is None or _processor is None or _device is None:
        _processor = WhisperProcessor.from_pretrained(MODEL_PATH)
        _model = WhisperForConditionalGeneration.from_pretrained(MODEL_PATH)
        _device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        _model = _model.to(_device)
    return _model, _processor, _device

def find_disfluencies(text: str):
    """
    Find common Spanish disfluencies in the text using regex.
    Returns a list of found disfluencies.
    """
    # Common Spanish disfluencies (muletillas, fillers, hesitations, repetitions, etc.)
    disfluency_patterns = [
        r"\b(eh+)\b",           # eh, eeh, eeeh
        r"\b(ah+)\b",           # ah, aah
        r"\b(um+)\b",           # um, umm
        r"\b(am+)\b",           # am, amm
        r"\b(emm+)\b",          # em, emm, emmm
        r"\b(este)\b",          # este
        r"\b(pues)\b",          # pues
        r"\b(osea|o sea)\b",    # o sea, osea
        r"\b(bueno)\b",         # bueno
        r"\b(a ver)\b",         # a ver
        r"\b(entonces)\b",      # entonces
        r"\b(digo)\b",          # digo
        r"\b(no sé)\b",         # no sé
        r"\b(mmm+)\b",          # mmm, mmmm
        r"\b(ya)\b",            # ya (sometimes used as filler)
        r"\b(verdad)\b",        # verdad (as a tag question)
        r"\b(¿vale\??)\b",     # vale, ¿vale?
        r"\b(ajá)\b",           # ajá
        r"\b(igual)\b",         # igual
        r"\b(nada)\b",          # nada
        r"\b(o sea)\b",         # o sea
        r"\b(en plan)\b",       # en plan
        r"\b(tipo)\b",          # tipo
        r"\b(ya sabes?)\b",     # ya sabes, ya sabe
        r"\b(esteeee+)\b",      # esteeee
        r"\b(eeeh+)\b",         # eeeh
        r"\b(aja+)\b",          # aja, ajá
    ]
    found = []
    for pattern in disfluency_patterns:
        found += re.findall(pattern, text, flags=re.IGNORECASE)
    return found

def analyze_audio(file_path: str, base: bool = False) -> dict:
    """
    Transcribe audio using fine-tuned Whisper or base Whisper (if base=True) and return transcript and simple metrics.
    """
    if base:
        model_name = "openai/whisper-medium"  # or "openai/whisper-base" for a smaller model
        processor = WhisperProcessor.from_pretrained(model_name)
        model = WhisperForConditionalGeneration.from_pretrained(model_name)
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model = model.to(device)
    else:
        model, processor, device = _load_model()
    try:
        audio, sr = librosa.load(file_path, sr=16000)
        inputs = processor(audio, sampling_rate=16000, return_tensors="pt", return_attention_mask=True)
        inputs = inputs.to(device)
        with torch.no_grad():
            generated_ids = model.generate(
                inputs.input_features,
                attention_mask=inputs.attention_mask,
                do_sample=False,
                num_beams=1,
                language="es",
                task="transcribe",
            )
        transcription = processor.batch_decode(generated_ids, skip_special_tokens=True)[0].strip()
        if not transcription:
            with torch.no_grad():
                generated_ids = model.generate(
                    inputs.input_features,
                    attention_mask=inputs.attention_mask,
                    language="es",
                    task="transcribe",
                )
                transcription = processor.batch_decode(generated_ids, skip_special_tokens=True)[0].strip()
        # Simple metrics
        print(transcription)
        words = transcription.split()
        word_count = len(words)
        unique_words = set(words)
        lexical_richness = len(unique_words) / word_count if word_count > 0 else 0
        # Regex-based disfluency detection
        disfluencies = find_disfluencies(transcription)
        return {
            "transcript": transcription,
            "metrics": {
                "word_count": word_count,
                "lexical_richness": lexical_richness,
                "disfluencies": disfluencies,
            },
            "recommendation": "Evaluar con especialista si persiste el retraso en el habla."
        }
    except Exception as e:
        return {
            "transcript": "",
            "metrics": {},
            "recommendation": f"Error: {str(e)}"
        }
