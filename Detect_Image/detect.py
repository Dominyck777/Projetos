#!/usr/bin/env python3
import cv2
from ultralytics import YOLO
import face_recognition
import os
import re

def clear_terminal():
    os.system('cls' if os.name == 'nt' else 'clear')

def load_known_faces(database_path):
    known_faces = []
    known_names = []
    for filename in os.listdir(database_path):
        if filename.endswith((".jpg", ".jpeg", ".png")):
            file_path = os.path.join(database_path, filename)
            try:
                image = face_recognition.load_image_file(file_path)
                image = cv2.resize(image, (0, 0), fx=0.5, fy=0.5)
                face_locations = face_recognition.face_locations(image)
                if face_locations:
                    encodings = face_recognition.face_encodings(image, face_locations)
                    if encodings:
                        known_faces.append(encodings[0])
                        name = os.path.splitext(filename)[0]
                        name = re.sub(r'\d+', '', name).strip()
                        known_names.append(name)
            except Exception:
                pass
    return known_faces, known_names

def detect_and_recognize(image_path, yolo_model, known_faces, known_names):
    try:
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Não foi possível carregar a imagem: {image_path}")
        
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        results = yolo_model(image, verbose=False)

        face_locations = face_recognition.face_locations(rgb_image)
        face_encodings = face_recognition.face_encodings(rgb_image, face_locations)

        for result in results:
            boxes = result.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0]
                class_id = box.cls[0]
                conf = box.conf[0]
                cv2.rectangle(image, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
                cv2.putText(image, f"{result.names[int(class_id)]}: {conf:.2f}", (int(x1), int(y1) - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            matches = face_recognition.compare_faces(known_faces, face_encoding)
            name = "Unknown"
            if True in matches:
                first_match_index = matches.index(True)
                name = known_names[first_match_index]
            cv2.rectangle(image, (left, top), (right, bottom), (0, 0, 255), 2)
            cv2.putText(image, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 255), 1)

        return image
    except Exception as e:
        print(f"Erro ao processar a imagem: {str(e)}")
        return None

def resize_image_to_fit_screen(image, max_width=1280, max_height=720):
    height, width = image.shape[:2]
    ratio = min(max_width / width, max_height / height)
    new_width = int(width * ratio)
    new_height = int(height * ratio)
    resized_image = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)
    return resized_image

def display_image(image):
    resized_image = resize_image_to_fit_screen(image)
    cv2.imshow("Resultado", resized_image)
    print("Pressione qualquer tecla na janela da imagem para fechar.")
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def main():
    clear_terminal()
    print("-----------------------------------------------------------------DETECT IMAGE--------------------------------------------------------")
    
    database_path = "/opt/lampp/htdocs/Detect_Image/database_images"
    
    print("Carregando...")
    known_faces, known_names = load_known_faces(database_path)
    
    clear_terminal()

    if not known_faces:
        print("Erro: Não foi possível carregar faces conhecidas.")
        return

    yolo_model = YOLO("yolov8n.pt")
    base_dir = "/opt/lampp/htdocs/Detect_Image"
    
    while True:
        image_path = input("\nDigite o nome da imagem ou 'exit' para sair: ")
        
        if image_path.lower() == 'exit':
            break
        
        if not os.path.isabs(image_path):
            image_path = os.path.join(base_dir, "imagens", image_path)
        
        if not os.path.exists(image_path):
            print(f"Arquivo não encontrado: {image_path}")
            continue
        
        result_image = detect_and_recognize(image_path, yolo_model, known_faces, known_names)
        if result_image is not None:
            display_image(result_image)
        else:
            print("Não foi possível processar a imagem. tente outra.")

    print("Programa encerrado.")

if __name__ == "__main__":
    main()