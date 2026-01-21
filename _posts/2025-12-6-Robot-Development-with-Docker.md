---
layout: post
author: Davide Capuzzo
title: Docker introduction
body_class: ""
menu: "header.html"
return_home: "/index.html"
excerpt_separator: <!--end_excerpt-->
category: Docker
image_header: "/assets/images/post_images/docker/docker_logo.png"
order: 1
---

Docker and ROS are two powerful tools that are quickly becoming **fundamental in modern robotics development**.
They help engineers build reproducible systems, scale projects, and collaborate more effectively. That said, like many powerful tools, the first integration steps are not always straightforward.

In this article, I introduce how to develop **ROS applications inside a Docker container**, focusing on why Docker is useful and how to structure a clean development setup.

<!--end_excerpt-->

## What is Docker ?

Docker is an open-source platform that allows developers to build, package, ship, and run applications inside isolated environments called containers.

When you develop an application, you usually depend on many external components: compilers, system libraries, and third-party dependencies. Installing everything directly on your machine often works fine at first. After a few hours, you typically have a working setup.

The real problems appear later:
- You switch to another project that requires different library versions
- A colleague tries to run your code on a different machine
- The operating system or architecture is not exactly the same

At that point, things can quickly become frustrating. Libraries may conflict, dependencies may break, and what worked perfectly on your machine suddenly fails elsewhere.

Docker containers solve these problems by providing isolated and reproducible environments. A container includes all the instructions required to recreate a specific setup, while remaining separated from the host system. Unlike traditional virtual machines, containers are lightweight: they include only the essential libraries and share the host machine’s kernel, which makes them fast and efficient.



The two main concepts of Docker are **Docker images** and **Docker containers**:

- **Docker images** contain the operating system and all required packages. They can be compared to a powered-off computer or a template.
- **Containers** are created by running an image. A container is a live, running instance that includes processes, runtime state, and network connections.

Multiple containers can run from the same image at the same time, each fully isolated from the others.

## File Setup

To set up a clean and flexible Docker-based development environment, I recommend using four main files:

- Dockerfile
- entrypoint.sh
- docker-compose.yml
- devcontainer.json

Each file has a specific role and helps keep responsibilities clearly separated.

### Dockerfile

The Dockerfile is the core configuration file. It defines 
- the operating system, 
- the packages to install, 
- all required environment variables. 

You can think of it as a **blueprint** for your development environment.

### entrypoint.sh

The entrypoint.sh file is a Bash script that is executed when the container starts. It applies final configuration steps and runtime settings.

**Note:** the entrypoint script is commonly used to:
- Configure the .bashrc file that runs every time a terminal is opened inside the container
- Start background services via a supervisor.conf file (for example, GUI-related services)

### docker-compose.yml

The docker-compose.yml file is responsible for running one or more containers based on the images defined by your Dockerfile. It allows you to configure:

- Networking
- Volumes and persistent storage
- Environment variables
- Resource limits

A single Docker Compose file can start multiple containers from different images and manage communication between them.

### devcontainer.json

The devcontainer.json file is specific to development environments and IDEs (such as VS Code or Clion). It allows you to define editor-specific settings, extensions, and development tools required inside the container.

## How to install Docker

To install Docker on Ubuntu, it is best to follow the official documentation provided on the Docker website:
[Docker installation guide](https://docs.docker.com/engine/install/ubuntu/)

After installation, I recommend configuring Docker to run without 'sudo' by executing the following commands:

<pre class="language-bash"><span class="language-label">BASH</span><button class="copy-button">Copy</button>
  <code>sudo usermod -aG docker $USER
newgrp docker</code>
</pre>



## Usefull links

- [Docker Official website](https://docs.docker.com/engine/install/ubuntu)
- [Best Ros2 Docker youtube series  by Articulated Robotics](https://www.youtube.com/watch?v=dihfA7Ol6Mw&list=PLunhqkrRNRhaqt0UfFxxC_oj7jscss2qe&index=6)
- [automaticaddison ROS2 docker tutorial](https://automaticaddison.com/the-complete-guide-to-docker-for-ros-2-jazzy-projects/)
- [Guide for ROS and Docker](https://blog.robotair.io/the-complete-beginners-guide-to-using-docker-for-ros-2-deployment-2025-edition-0f259ca8b378)
- [Ros2 and gui setup](https://medium.com/ai-casts-blog/2-quick-ways-to-use-gui-with-ros-ros-2-docker-images-44c24057e147)
- [Uinversity of Ottawa docker setup](https://github.com/wail-uottawa/docker-ros2-elg5228)




