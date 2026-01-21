---
layout: post
author: Davide Capuzzo
title: The Dockerfile
body_class: ""
menu: "header.html"
return_home: "/index.html"
excerpt_separator: <!--end_excerpt-->
category: Docker
image_header: "/assets/images/post_images/docker/docker_logo.png"
order: 2
---

The Dockerfile is the blueprint of your Docker image, containing all the instructions for setting up the operating system and environment. In this article, I'll dive deep into my Dockerfile, explaining step-by-step all the configuration choices and the reasoning behind them.
<!--end_excerpt-->

You can find my complete template on my GitHub page:

- [ROS2 Docker Template](https://github.com/DavideCapuzz/ros2docker/blob/master/Dockerfile)

---

## What is a Dockerfile?

A Dockerfile is a text document containing a series of instructions that Docker uses to automatically build an image. Think of it as a recipe that defines:

- **Base operating system** – What Linux distribution or pre-built Docker image sourced from Docker Hub to start with
- **Software packages** - What tools and libraries to install
- **Configuration** - How to set up the environment
- **Entry point** - What command to run when the container starts

The beauty of Docker is its **layered architecture**. Each instruction creates a new layer, and Docker caches these layers for efficient rebuilds.

---

## The Layer System: Building Like Lego

Imagine building a LEGO skyscraper where each floor is an instruction. When you modify a floor (layer), you only need to rebuild that floor and all floors above it—the floors below remain intact. This is Docker's layer caching system, and it dramatically speeds up development.

**Key Benefits:**
- **Fast rebuilds** - Only changed layers are rebuilt
- **Efficient storage** - Shared layers are stored once
- **Version control** - Each layer has a unique signature

---

## Multi-Stage Architecture

My Dockerfile uses a **multi-stage build** approach, organizing the setup into logical stages. This provides:

- **Modularity** - Each stage serves a specific purpose
- **Flexibility** - Different final images from the same base
- **Optimization** - Only necessary components in production

### The Six Stages

For a modular approach, I organize the Docker image into six stages.

| Stage | Purpose | Base |
|-------|---------|------|
| **stage-base** | Core system setup | Official ROS2 image |
| **stage-graphics** | GUI and VNC support | stage-base |
| **stage-ros2-core** | Common ROS2 packages | stage-graphics |
| **stage-extra-ros2-packages** | Custom robot packages | stage-ros2-core |
| **stage-workspace** | ROS2 workspace creation | stage-extra-ros2-packages |
| **stage-finalization** | Final configuration | stage-workspace |

---

## Stage 1: Base System Setup

This stage establishes the foundation by installing essential development tools and utilities.

### Defining the ROS Distribution

```dockerfile
ARG ROS_DISTRO=jazzy
```

Using a build argument allows easy version changes across all files. This makes it simple to upgrade to a new ROS2 distribution.

### Selecting the Base Image

```dockerfile
ARG ROS_INSTALL=osrf/ros:${ROS_DISTRO}-desktop-full
FROM ${ROS_INSTALL} AS stage-base
```

We start from the official ROS2 Docker Hub image, which provides:
- Correct Ubuntu version
- Pre-configured ROS2 installation
- Essential ROS2 dependencies

The `desktop-full` variant includes development tools, but you can override this with lighter options like `ros-base` for production or multi-robot setups.

**Available options:**
- `ros-core` - Minimal ROS2 installation
- `ros-base` - Core + build tools
- `desktop` - Base + GUI tools
- `desktop-full` - Everything including simulators

Find all options at: 

- [OSRF Dockerfile](https://github.com/osrf/docker_images/blob/master/ros/jazzy/ubuntu/noble/desktop-full/Dockerfile)

### Environment Configuration

```dockerfile
ENV ROS_DISTRO=${ROS_DISTRO}
ENV DEBIAN_FRONTEND=noninteractive
SHELL ["/bin/bash", "-c"]
```

- **ROS_DISTRO** - Makes the distribution available to all subsequent commands
- **DEBIAN_FRONTEND=noninteractive** - Prevents package installation prompts
- **SHELL=["/bin/bash", "-c"]** - Uses bash instead of sh for advanced features:
  - Multiple commands with `&&`
  - Source command for environment setup
  - Better error handling

### Platform Architecture Support

```dockerfile
ARG TARGETPLATFORM
```

Docker automatically provides this during multi-platform builds. It enables building for different CPU architectures:

- `linux/amd64` - Intel/AMD 64-bit (desktops/servers)
- `linux/arm64` - ARM 64-bit (Apple M1/M2, Raspberry Pi 4)
- `linux/arm/v7` - ARM 32-bit (older Raspberry Pi)

Learn more: 

- [Docker Multi-platform Documentation](https://docs.docker.com/build/building/multi-platform/)

### Essential Packages Installation

```dockerfile
RUN apt-get update && apt-get install -y \
    # Build tools
    build-essential \
    cmake \
    git \
    wget \
    curl \
    python3-pip \
    # Utilities
    dos2unix \
    nano vim \
    tmux zsh \
    iputils-ping \
    net-tools \
    supervisor \
    tini \
    # Graphics
    libglu1-mesa-dev \
    mesa-utils \
    # Locales
    locales \
    tzdata \
    && rm -rf /var/lib/apt/lists/*
```

**Package Categories:**

#### Build Tools

| Package | Purpose |
|---------|---------|
| build-essential | C/C++ compilers (gcc, g++, make) |
| cmake | Build system for complex C++ projects |
| git | Version control |
| wget/curl | Download files from the internet |
| python3-pip | Python package manager |

#### Development Utilities

| Package | Purpose |
|---------|---------|
| dos2unix | Convert Windows line endings to Unix |
| nano/vim | Text editors |
| tmux | Terminal multiplexer |
| zsh | Advanced shell |
| supervisor | Process manager |
| tini | Minimal init system for containers |

#### System Tools

| Package | Purpose |
|---------|---------|
| iputils-ping | Network diagnostics |
| net-tools | Networking commands (ifconfig, netstat) |
| locales | Language and regional settings |
| tzdata | Timezone data |

---

## Stage 2: Graphics & VNC Setup

This stage adds graphical capabilities and remote desktop access through noVNC.

### Design Decision: Minimal vs Full Desktop

There are two approaches for GUI support:

**Option 1: Full Desktop Environment**
```dockerfile
# Commented out - use for complete desktop experience
# RUN apt-get install -y ubuntu-mate-desktop
```
Pros: Complete desktop experience
Cons: Very heavy (~1-2 GB additional size)

**Option 2: Minimal Graphics Stack** (Recommended)
```dockerfile
RUN apt-get install -y \
    x11-xserver-utils \
    xauth \
    xfonts-base \
    openbox \
    libgl1 \
    dbus-x11 \
    libqt5gui5 \
    && rm -rf /var/lib/apt/lists/*
```
Pros: Lightweight (~100-200 MB)
Pros: Sufficient for ROS2 GUI tools
Cons: No desktop environment features

### Graphics Packages Explained

| Package | Purpose |
|---------|---------|
| x11-xserver-utils | Essential X Window System tools |
| xauth | X11 authentication management |
| xfonts-base | Basic fonts for X11 |
| openbox | Minimal window manager |
| libgl1 | OpenGL compatibility layer |
| dbus-x11 | Message bus for X11 applications |
| libqt5* | Qt5 libraries for GUI applications |

### Critical Environment Variables

```dockerfile
ENV QT_QPA_PLATFORM=xcb
ENV QT_X11_NO_MITSHM=1
ENV LIBGL_ALWAYS_SOFTWARE=1
```

#### QT_QPA_PLATFORM=xcb
Forces Qt applications to use the X11 backend. Without this:
- Qt might try to use Wayland
- Applications crash on startup
- Black windows or no rendering

#### QT_X11_NO_MITSHM=1
Disables shared memory for Qt rendering. In containers:
- Shared memory works differently
- MIT-SHM causes segmentation faults
- Prevents random crashes

#### LIBGL_ALWAYS_SOFTWARE=1
Forces software OpenGL rendering because:
- Containers often lack GPU driver access
- Hardware acceleration attempts fail
- Software rendering is slower but reliable

### noVNC Installation

```dockerfile
RUN apt-get install -y \
    novnc \
    websockify \
    tigervnc-standalone-server \
    tigervnc-common \
    && ln -sf /usr/share/novnc/vnc.html /usr/share/novnc/index.html
```

**Components:**

| Package | Role |
|---------|------|
| novnc | HTML5 VNC client for browsers |
| websockify | WebSocket-to-TCP bridge |
| tigervnc-standalone-server | VNC server (X server + VNC protocol) |
| tigervnc-common | TigerVNC shared libraries |

The symbolic link creates an easy-to-remember URL: `http://localhost:6080/`

**Learn more:** 

- [noVNC GitHub](https://github.com/novnc/noVNC)
- [Websockify GitHub](https://github.com/novnc/websockify)

---

## Stage 3: ROS2 Core Packages

This stage installs common ROS2 packages used across all robot configurations.

```dockerfile
FROM stage-graphics AS stage-ros2-core

RUN apt-get update && apt-get install -y \
    ros-$ROS_DISTRO-can-msgs \
    ros-$ROS_DISTRO-bondcpp \
    ros-$ROS_DISTRO-rosbag2-storage-mcap \
    nlohmann-json3-dev \
    python3-jinja2 \
    && rm -rf /var/lib/apt/lists/*
```

### Core Packages Explained

| Package | Purpose |
|---------|---------|
| can-msgs | CAN bus message definitions |
| bondcpp | Process health monitoring |
| rosbag2-storage-mcap | Convert ROS2 bags to MCAP format |
| nlohmann-json3-dev | Modern C++ JSON library |
| python3-jinja2 | Template engine for configuration files |

### Rosdep Initialization

```dockerfile
RUN rosdep init || true && \
    rosdep update --rosdistro ${ROS_DISTRO}
```

**rosdep** is ROS's dependency management tool. This step:
- Initializes the rosdep database
- Updates package lists for the ROS distribution
- Enables automatic dependency resolution

The `|| true` prevents errors if rosdep is already initialized.

---

## Stage 4: Custom Robot Packages

This stage provides **maximum flexibility** by allowing different package installations per robot configuration.

```dockerfile
FROM stage-ros2-core AS stage-extra-ros2-packages

ARG INSTALL_PROFILE=default
ARG ROBOT_NAME=robot1

COPY ./install_robot_deps.sh /tmp/install_robot_deps.sh
RUN chmod +x /tmp/install_robot_deps.sh && \
    /tmp/install_robot_deps.sh ${INSTALL_PROFILE}
```

### The Power of Profiles

The `INSTALL_PROFILE` argument allows one Dockerfile to create multiple specialized images:

```ini
# setup.ini example
[robot1]
install_profile=navigation  # Gets Nav2, SLAM, etc.

[robot2]
install_profile=perception  # Gets vision, PCL, etc.

[gazebo]
install_profile=gazebo      # Gets simulation tools
```

### install_robot_deps.sh Structure

```bash
case "${PROFILE}" in
    navigation)
        # Navigation2, SLAM Toolbox, Cartographer
        ;;
    perception)
        # Vision, PCL, depth processing
        ;;
    gazebo)
        # Gazebo bridge, simulation
        ;;
    custom)
        # Your custom packages
        ;;
esac
```

**Benefits:**
- One Dockerfile for all robots
- Easy to add new profiles
- No repository modifications needed
- Maintainable and scalable

Learn more in the 

- [customization guide](/customization).

---

## Stage 5: Workspace Creation

This stage creates and initializes the ROS2 workspace.

```dockerfile
FROM stage-extra-ros2-packages AS stage-workspace

ENV USER=ubuntu
ENV HOME=/home/ubuntu
ENV ROS2_WS=$HOME/ros2_ws

RUN mkdir -p $ROS2_WS/src && \
    cd $ROS2_WS && \
    . /opt/ros/$ROS_DISTRO/setup.sh && \
    colcon build --symlink-install
```

### Workspace Structure

```
/home/ubuntu/ros2_ws/
├── src/        # Source code (your packages)
├── build/      # Build artifacts
├── install/    # Installed packages
└── log/        # Build logs
```

### Why Build in the Dockerfile?

Building during image creation provides:
- **Faster startup** - Container starts immediately
- **Error detection** - Build issues caught during image creation
- **Consistency** - Same build across all containers

The `--symlink-install` flag creates symbolic links instead of copying files, enabling faster rebuilds during development.

---

## Stage 6: Finalization

The final stage cleans up and configures the container entry point.

### Cleanup

```dockerfile
RUN apt-get autoremove -y && \
    apt-get clean -y && \
    rm -rf /var/lib/apt/lists/*

RUN rm -f /etc/apt/apt.conf.d/docker-clean
```

**Why cleanup matters:**
- Removes unnecessary packages
- Deletes package cache
- Reduces final image size by hundreds of MB

The second command re-enables apt cache for development convenience.

### Entry Point Configuration

```dockerfile
COPY ./entrypoint.sh /
RUN chmod +x entrypoint.sh && \
    dos2unix /entrypoint.sh
```

The **entrypoint.sh** script:
- Configures supervisor for process management
- Sets up .bashrc for ROS2 environment
- Starts VNC and noVNC servers
- Launches user-defined applications

`dos2unix` ensures the script works even if edited on Windows.

### Robot-Specific Configuration

```dockerfile
ARG ROBOT_NAME=robot1
ENV ROBOT_NAME=${ROBOT_NAME}

COPY ${ROBOT_NAME}/endfunction.sh /tmp/endfunction.sh
RUN chmod +x /tmp/endfunction.sh
```

Each robot can have its own **endfunction.sh** containing:
- Launch files to run on startup
- Build commands for specific packages
- Robot-specific initialization

**Example:**
```bash
# robot1/endfunction.sh
ros2 launch my_robot navigation.launch.py
```

### Container Entry Point

```dockerfile
ENTRYPOINT ["/bin/bash", "-c", "/entrypoint.sh"]
```

This ensures the entrypoint script runs when the container starts, initializing all services.

### Metadata Labels

```dockerfile
LABEL robot.name="${ROBOT_NAME}"
LABEL robot.ros_distro="${ROS_DISTRO}"
```

Labels provide metadata for container management and identification.

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [OSRF Dockerfile](https://github.com/osrf/docker_images/blob/master/ros/jazzy/ubuntu/noble/desktop-full/Dockerfile)
- [ROS2 Docker Images](https://github.com/osrf/docker_images)
- [noVNC Documentation](https://github.com/novnc/noVNC)
- [Example of ROS2 Docker File by Tiryoh](https://github.com/Tiryoh/docker-ros2-desktop-vnc/blob/master/jazzy/Dockerfile)
- [Docker NoVNC setup](medium.com/@danielpepuho/running-firefox-in-docker-yes-with-a-gui-and-novnc-8f5f9ca9dbdb)
- [Ros2 docker Tutorial](https://roboticseabass.com/2023/07/09/updated-guide-docker-and-ros2/)
- [My GitHub Repository](https://github.com/DavideCapuzz/ros2docker)

