import cv2
import numpy as np
import base64

# pip install opencv-python
# pip install numpy

isShinyImg = cv2.imread('shinyCheckShiny.png', 0)
notShinyImg = cv2.imread('shinyCheckNotShiny.png', 0)

def detect_shiny(image):
    #cv2.imwrite('shinyCheckShiny.png', image)
    shiny_match = cv2.matchTemplate(image, isShinyImg, cv2.TM_CCOEFF_NORMED)
    not_shiny_match = cv2.matchTemplate(image, notShinyImg, cv2.TM_CCOEFF_NORMED)
    
    _, max_shiny, _, _ = cv2.minMaxLoc(shiny_match)
    _, max_not_shiny, _, _ = cv2.minMaxLoc(not_shiny_match)

    isShiny = max_shiny > max_not_shiny
    return {"shiny": isShiny}




def handle_request(request):
    image_data = request.json['image']
    nparr = np.frombuffer(base64.b64decode(image_data.split(',')[1]), np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    result = detect_shiny(image)
    return result

# Export the function for use outside this file
if __name__ == "__main__":
    # Example usage
    request = "example request"
    print(handle_request(request))
