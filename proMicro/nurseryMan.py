import cv2
import numpy as np
import base64

# pip install opencv-python
# pip install numpy

manRight = cv2.imread('nurseryManRight.png', 0)
manLeft = cv2.imread('nurseryManLeft.png', 0)
manNone = cv2.imread('nurseryManNone.png', 0)

def detect_facing_direction(image):
    #cv2.imwrite('nurseryMan_.png', image)

    right_match = cv2.matchTemplate(image, manRight, cv2.TM_CCOEFF_NORMED)
    left_match = cv2.matchTemplate(image, manLeft, cv2.TM_CCOEFF_NORMED)
    none_match = cv2.matchTemplate(image, manNone, cv2.TM_CCOEFF_NORMED)
    
    _, max_right, _, _ = cv2.minMaxLoc(right_match)
    _, max_left, _, _ = cv2.minMaxLoc(left_match)
    _, max_none, _, _ = cv2.minMaxLoc(none_match)

    if max_none > max_right and max_none > max_left:
        return {"direction": "none"}
    
    if max_right > max_left:
        return {"direction": "right"}
    else:
        return {"direction": "left"}



def handle_request(request):
    image_data = request.json['image']
    nparr = np.frombuffer(base64.b64decode(image_data.split(',')[1]), np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    result = detect_facing_direction(image)
    return result

# Export the function for use outside this file
if __name__ == "__main__":
    # Example usage
    request = "example request"
    print(handle_request(request))


# def detect_shiny_icon(image_data):
#     # Decode the base64 image
#     nparr = np.frombuffer(base64.b64decode(image_data.split(',')[1]), np.uint8)
#     img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)  # Convert to grayscale

#     # Match template
#     result = cv2.matchTemplate(img, shiny_icon, cv2.TM_CCOEFF_NORMED)
#     _, max_val, _, _ = cv2.minMaxLoc(result)
    
#     # Check for match
#     threshold = 0.8  # Similarity threshold
#     is_shiny = max_val >= threshold
#     return {"isShiny": is_shiny}


