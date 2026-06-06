import os
import shutil
import subprocess
from PIL import Image

PROJECT_DIR = "/Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site"
VIDEO_PATH = os.path.join(PROJECT_DIR, "public", "video", "The_golden_shanyrak_gently_rot.mp4")
TEMP_DIR = os.path.join(PROJECT_DIR, "temp_png_frames")
DESKTOP_DIR = os.path.join(PROJECT_DIR, "public", "sequence", "desktop")
MOBILE_DIR = os.path.join(PROJECT_DIR, "public", "sequence", "mobile")

def setup_dirs():
    for d in [DESKTOP_DIR, MOBILE_DIR]:
        if os.path.exists(d):
            shutil.rmtree(d)
        os.makedirs(d, exist_ok=True)
    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR)
    os.makedirs(TEMP_DIR, exist_ok=True)

def extract_png_frames():
    print("Извлечение временных PNG кадров с помощью ffmpeg (30 fps)...")
    cmd = [
        "ffmpeg", "-y",
        "-i", VIDEO_PATH,
        "-vf", "fps=30",
        os.path.join(TEMP_DIR, "frame_%04d.png")
    ]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if result.returncode != 0:
        print("Ошибка при извлечении кадров:")
        print(result.stderr.decode("utf-8"))
        sys.exit(1)
    print("Извлечение завершено.")

def process_and_compress():
    frames = sorted([f for f in os.listdir(TEMP_DIR) if f.endswith(".png")])
    total = len(frames)
    print(f"Всего найдено кадров для обработки: {total}")
    
    for idx, f in enumerate(frames):
        src_path = os.path.join(TEMP_DIR, f)
        img = Image.open(src_path)
        
        # Сохранение для десктопа (1920x1080)
        desktop_img = img.resize((1920, 1080), Image.Resampling.LANCZOS)
        desktop_name = f"frame_{idx + 1:04d}.webp"
        desktop_img.save(
            os.path.join(DESKTOP_DIR, desktop_name),
            "WEBP",
            quality=75,
            method=4
        )
        
        # Сохранение для мобильных (960x540)
        mobile_img = img.resize((960, 540), Image.Resampling.LANCZOS)
        mobile_name = f"frame_{idx + 1:04d}.webp"
        mobile_img.save(
            os.path.join(MOBILE_DIR, mobile_name),
            "WEBP",
            quality=65,
            method=4
        )
        
        if (idx + 1) % 50 == 0 or idx + 1 == total:
            print(f"Обработано кадров: {idx + 1}/{total}")

def clean_up():
    print("Очистка временных файлов...")
    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR)
    print("Обработка успешно завершена!")

if __name__ == "__main__":
    setup_dirs()
    extract_png_frames()
    process_and_compress()
    clean_up()
