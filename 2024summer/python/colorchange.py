#===========================================================
# 実行の仕方；
# なんとなく、Windowsが悪い気がしますが。。(10->11)
# > python3.11 aa3.py
#===========================================================
import numpy as np
#https://teratail.com/questions/222001
#numbaがいいと
#import numba as nb
import cv2


#@nb.njit
def convert(v, color_base, color_target):
# R,G,B,A ??? 、、(10は閾値)
    # 入力 V は使ってない。
    if(color_base[1] < 100 and color_base[0] < 100):
        color_target[0] = color_base[2] #赤→青
        color_target[1] = color_base[1]
        color_target[2] = color_base[0] #青→赤
    else:
        color_target[0] = color_base[0] #あお
        color_target[1] = color_base[1] #みどり
        color_target[2] = color_base[2] #あか
    color_target[3] = color_base[3]*v[3]

#@nb.njit
def process_numba(v, base, target):
    rows, cols, _ = base.shape # 幅、高さ
    ss = str(rows)+':'+str(cols)
    print(ss)
    for i in range(rows):
        for j in range(cols):
            convert(v, base[i, j], target[i, j])

# 関数の書き方
def mainfunc(v, inf, outf):
    image = cv2.imread(inf, cv2.IMREAD_UNCHANGED) 
    #空の配列を用意
    work  = np.empty_like(image)
    #numbaをつかって配列計算
    process_numba(v,image, work)
    cv2.imwrite(outf,work)

c = [0.0,1.0,1.0] # RGB

v1 = [c[0],c[1],c[2],1.0]
mainfunc(v1, "Actor3_6.png","aa1.png")
mainfunc(v1, "Actor3.png","aa0.png")
mainfunc(v1, "Actor3_6S.png","aa3.png")

