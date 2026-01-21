---
layout: post
author: Davide Capuzzo
title: The dentrypoint.sh
body_class: ""
menu: "header.html"
return_home: "/index.html"
excerpt_separator: <!--end_excerpt-->
category: Docker
image_header: "/assets/images/post_images/docker/docker_logo.png"
order: 4
---

The entrypoint.sh file is a bash script that is been executed when the container start.
Usually is in charge of starting some programs or creating a bashrc file.
<!--end_excerpt-->
You can find my template on my GitHub page.

[entrypoint.sh](https://github.com/DavideCapuzz/ros2docker/blob/master/template/entrypoint.sh)

## What is a entrypoint.sh?

If the docker file and docercmser have a fix structure the entrpyoint is absh scrit that usually can have a pretty free setup. 
I have diegned mine to:

- Configure display, VNC, noVNC
- Create a user
- Set up ROS 2 environment
- Start everything under Supervisor
- Keep the container alive

## 1. Configure display VNC noVNC port

first give the enviriemotnal vaiable dispaly number i setup automatically the dispaly number i setup automatically the Novnc port and vnc port

'''bash
DISPLAY=${DISPLAY:-:1}
DISPLAY_NUM=${DISPLAY:1}
'''

If DISPLAY is not provided, default to :1 and DISPLAY_NUM=${DISPLAY:1} strips the colon (:1 → 1, :2 → 2)        

This allows one variable (DISPLAY) to drive everything.
Automatic port calculation

'''bash
VNC_PORT=${VNC_PORT:-$((5900 + DISPLAY_NUM))}
NOVNC_PORT=${NOVNC_PORT:-$((6080 + DISPLAY_NUM - 1))}
'''

VNC ports conventionally start at 5901 and noVNC ports start at 6080 in this way it has been enables multiple robot containers without port collisions.

Example:
DISPLAY	VNC	noVNC
:1	5901	6080
:2	5902	6081

## 2. Configure display VNC noVNC port
