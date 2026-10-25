#!/usr/bin/env python3
"""Resize/pad a REAL screenshot to the Chrome Web Store size (1280x800).
Usage: python3 make_screenshot.py input.png output.png
Take the screenshots yourself in Brave on a watch page (extension ON and OFF)."""
import sys
from PIL import Image
src=Image.open(sys.argv[1]).convert("RGB"); W,H=1280,800
r=min(W/src.width,H/src.height); im=src.resize((int(src.width*r),int(src.height*r)),Image.LANCZOS)
bg=Image.new("RGB",(W,H),(0,0,0)); bg.paste(im,((W-im.width)//2,(H-im.height)//2)); bg.save(sys.argv[2])
