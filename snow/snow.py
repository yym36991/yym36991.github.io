
import pygame, random

# 初始化 Pygame
pygame.init()

# 创建屏幕
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Python 雪景")

# 定义颜色
WHITE = (255, 255, 255)
BLUE = (135, 206, 250)  # 淡蓝色
GREEN = (34, 139, 34)    # 森林绿

# 创建雪花列表
snow_list = []
for i in range(300): # 疏密
    x = random.randrange(0, 800)
    y = random.randrange(0, 600)
    snow_list.append([x, y])

# 创建时钟对象
clock = pygame.time.Clock()

# 循环标志
done = False

# 游戏循环
while not done:
    # 处理事件
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            done = True

    # 绘制蓝天和青草地的背景
    screen.fill(BLUE)  # 蓝天
    pygame.draw.rect(screen, GREEN, (0, 400, 800, 200))  # 青草地

    # 循环雪花列表
    for i in range(len(snow_list)):
        # 绘制雪花,半径
        pygame.draw.circle(screen, WHITE, snow_list[i], 5)

        # 移动雪花
        snow_list[i][1] += 2

        # 雪花超出屏幕，重置位置
        if snow_list[i][1] > 600:
            y = random.randrange(-50, -10)
            snow_list[i][1] = y
            x = random.randrange(0, 800)
            snow_list[i][0] = x

    # 更新屏幕
    pygame.display.flip()

    # 控制帧率
    clock.tick(60)

# 退出 Pygame
pygame.quit()
