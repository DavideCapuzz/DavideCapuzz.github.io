---
layout: post
author: Davide Capuzzo
title: The docker-compose
body_class: ""
menu: "header.html"
return_home: "/index.html"
excerpt_separator: <!--end_excerpt-->
category: Docker
image_header: "/assets/images/post_images/docker/docker_logo.png"
order: 3
---

If the Dockerfile tells you how to build a container, the docker-compose.yml tells you how to orchestrate multiple containers, volumes, and networks together. In this article, I'll dig into my docker-compose file, explaining step-by-step all the configuration choices and how they enable multi-robot ROS2 development.
<!--end_excerpt-->

You can find my template on my GitHub page:

- [docker-compose.yml](https://github.com/DavideCapuzz/ros2docker/blob/master/template/docker-compose.yml)

---

## What is docker-compose.yml?

A docker-compose.yml is a YAML configuration file that defines and orchestrates multi-container Docker applications. Think of it as a blueprint that specifies:

- **Services** - The Docker containers and their characteristics
- **Volumes** - Persistent storage drives isolated from your host system
- **Networks** - Custom network setup between containers and the outside environment

The power of docker-compose lies in its ability to **manage multiple containers simultaneously** with a single command. This is perfect for multi-robot simulations where each robot runs in its own isolated container but needs to communicate with others.

---

## The Complete docker-compose Structure

Here's the full structure of a typical multi-robot setup:

```yaml
services:
  robot1:
    container_name: robot1
    build: ...
    environment: ...
    networks: ...
    volumes: ...
    ports: ...

volumes:
  robot1_build:
  robot1_install:
  robot1_log:

networks:
  ros2_network:
    driver: bridge
```

Let's break down each section in detail.

---

## Services: The Heart of docker-compose

Services are the main components of docker-compose.yml because they define how containers are built, configured, and connected. Each service corresponds to one Docker container, and you can define multiple services in a single file.

### Container Name

```yaml
container_name: robot1
```

The container name is a unique identifier for your container. Even if multiple containers are built from the same Docker image, each must have a distinct name. This makes it easy to:

- Identify containers: `docker ps` shows readable names
- Connect to specific containers: `docker exec -it robot1 bash`
- Manage containers individually: `docker stop robot1`

**Naming convention:** Use descriptive names like `gazebo`, `robot1`, `robot2` rather than generic names.

**NB** If the name is not been provided docker will choose a name by it self and it will a combination a two random words.

---

### Build Configuration

The build section defines how to create the container image. You can build from a Dockerfile or pull from Docker Hub.

```yaml
build:
  context: .
  dockerfile: ../Dockerfile
  args:
    ROS_DISTRO: jazzy
    ROS_INSTALL: ros:jazzy-ros-base-noble
    USERNAME: ubuntu
    USER_UID: 1000
    USER_GID: 1000
    INSTALL_PROFILE: custom
    ROBOT_NAME: robot1
```

#### Build Parameters Explained

| Parameter | Purpose | Default | Options |
|-----------|---------|---------|---------|
| **context** | Starting directory for build | `.` | Any path relative to compose file |
| **dockerfile** | Path to Dockerfile | `../Dockerfile` | Any valid Dockerfile path |

#### Build Arguments (args)

Build arguments allow you to customize the Docker image at build time without modifying the Dockerfile itself. This enables **one Dockerfile to create many different containers**.

##### ROS_DISTRO
```yaml
ROS_DISTRO: jazzy
```
Specifies the ROS2 distribution.
##### ROS_INSTALL
```yaml
ROS_INSTALL: ros:jazzy-ros-base-noble
```
Defines the base Docker image from [OSRF Docker Hub](https://hub.docker.com/r/osrf/ros).

**Available variants:**

| Variant | Size | Use Case |
|---------|------|----------|
| `ros-core` | ~400 MB | Minimal ROS2, production deployments |
| `ros-base` | ~600 MB | Core + build tools, lightweight development |
| `desktop` | ~2 GB | GUI tools (RViz, rqt) |
| `desktop-full` | ~3 GB | Everything including Gazebo |

**Recommendation:** 
- **Development:** `desktop-full` for single containers
- **Multi-robot:** `ros-base` to save resources
- **Production:** `ros-core` for minimal footprint

##### User Configuration
```yaml
USERNAME: ubuntu
USER_UID: 1000
USER_GID: 1000
```

Creates a non-root user inside the container. This is important for:
- **Security:** Running as root is dangerous
- **File permissions:** UID/GID 1000 typically matches your host user
- **Volume mounting:** Files created in volumes have correct ownership

##### INSTALL_PROFILE
```yaml
INSTALL_PROFILE: custom
```

Selects which package installation profile to use during the `stage-extra-ros2-packages` build stage. This enables **extreme customization** without modifying the Dockerfile.

**Example:** Create different robot types from one Dockerfile:
```yaml
# Navigation robot
robot1:
  build:
    args:
      INSTALL_PROFILE: navigation

# Vision robot  
robot2:
  build:
    args:
      INSTALL_PROFILE: perception

# Simulation
gazebo:
  build:
    args:
      INSTALL_PROFILE: gazebo
```

##### ROBOT_NAME
```yaml
ROBOT_NAME: robot1
```

Internal identifier used to:
- Copy the correct `endfunction.sh` script
- Set environment variables
- Organize robot-specific configurations

This must match the folder structure in your `.devcontainer` directory.

---

### Environment Variables

Environment variables configure the container's runtime behavior. These are available to all processes running inside the container.

```yaml
environment:
  DISPLAY: ":1"
  ROS_DISTRO: "jazzy"
  ROS_DOMAIN_ID: 0
  PYTHONUNBUFFERED: "1"
  LIBGL_ALWAYS_SOFTWARE: "1"
  MESA_GL_VERSION_OVERRIDE: "3.3"
  QT_X11_NO_MITSHM: "1"
  QT_QPA_PLATFORM: "xcb"
  GZ_SIM_RENDER_ENGINE: "ogre"
  GZ_PARTITION: ros2_gz_partition
  ROBOT_NAME: robot1
```

#### Display & Graphics Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| **DISPLAY** | `:1` | X11 display number for graphics rendering |
| **LIBGL_ALWAYS_SOFTWARE** | `1` | Force software OpenGL (no GPU required) |
| **MESA_GL_VERSION_OVERRIDE** | `3.3` | Override OpenGL version for compatibility |
| **QT_X11_NO_MITSHM** | `1` | Disable shared memory for Qt (prevents crashes) |
| **QT_QPA_PLATFORM** | `xcb` | Force Qt to use X11 backend |

**Why these matter:** Containers don't have direct GPU access. These variables ensure graphics work reliably without hardware acceleration.

#### ROS2 Configuration

| Variable | Value | Purpose |
|----------|-------|---------|
| **ROS_DISTRO** | `jazzy` | ROS2 distribution for package paths |
| **ROS_DOMAIN_ID** | `0` | DDS domain for robot isolation |

#### Gazebo Simulation Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| **GZ_SIM_RENDER_ENGINE** | `ogre` | Use Ogre1 renderer (**No Nvidia bridge required!!**) |
| **GZ_PARTITION** | `ros2_gz_partition` | Gazebo communication namespace |

**GZ_SIM_RENDER_ENGINE options:**
- `ogre` - Ogre1 (stable, works everywhere)
- `ogre2` - Ogre2 (faster, **requires GPU and bridge tools like nvidia bridge**)

#### Python Configuration

| Variable | Value | Purpose |
|----------|-------|---------|
| **PYTHONUNBUFFERED** | `1` | Show Python output immediately (essential for debugging) |

Without this, Python output is buffered and you won't see `print()` statements in real-time.

#### Custom Variables

```yaml
ROBOT_NAME: robot1
```

Your custom environment variables are available to all scripts and launch files. Use them for:
- Robot identification
- Position of the robot
- Other custom configuration

---

### Networks

```yaml
networks:
  - ros2_network
```

Connects this container to the `ros2_network` Docker network. All containers on the same network can communicate using container names as hostnames.

**Example:** From `robot1`, you can ping `gazebo`:
```bash
ping gazebo  # Uses container name as hostname
```

**Benefits:**
- Automatic DNS resolution
- Isolated from other Docker projects
- Configurable subnet and gateway

---

### Volumes

Volumes provide persistent storage and enable code sharing between host and containers.

```yaml
volumes:
  # Shared source code
  - ../../../src:/home/ubuntu/ros2_ws/src
  - ../../../launch:/home/ubuntu/ros2_ws/launch
  
  # Container-specific build artifacts
  - robot1_build:/home/ubuntu/ros2_ws/build
  - robot1_install:/home/ubuntu/ros2_ws/install
  - robot1_log:/home/ubuntu/ros2_ws/log
```

#### Volume Types

**Bind Mounts** (Host → Container)
```yaml
- ../../../src:/home/ubuntu/ros2_ws/src
```
Maps a host directory directly into the container. Changes are **immediately visible** in both places.

**Benefits:**
- Live code editing
- No container rebuild needed
- Version control on host

**Named Volumes** (Container-specific)
```yaml
- robot1_build:/home/ubuntu/ros2_ws/build
```
Docker-managed storage that persists between container restarts.

**Benefits:**
- Faster than bind mounts
- Data survives container deletion
- Isolated per robot

#### Why Separate Build Volumes?

```yaml
volumes:
  robot1_build:
  robot1_install:
  robot1_log:
```

Each robot has its own build artifacts because:

1. **Different configurations** - Robot1 might have navigation, Robot2 might have perception
2. **Parallel builds** - No conflicts when building simultaneously
3. **Performance** - Cached builds speed up development
4. **Isolation** - One robot's build doesn't affect others

**Workspace structure:**
```
robot1 container:
  /home/ubuntu/ros2_ws/
    src/      → Shared (bind mount)
    build/    → robot1_build volume
    install/  → robot1_install volume
    log/      → robot1_log volume

robot2 container:
  /home/ubuntu/ros2_ws/
    src/      → Shared (same bind mount)
    build/    → robot2_build volume
    install/  → robot2_install volume
    log/      → robot2_log volume
```

---

### Ports

```yaml
ports:
  - "6080:6080"   # noVNC web interface
  - "5901:5901"   # VNC server
```

Port mapping exposes container services to the host machine using the format `HOST:CONTAINER`.

#### Understanding Port Mapping

```
Host Machine                Container
┌──────────────┐           ┌──────────────┐
│              │           │              │
│ localhost:   │ ───────→  │ :6080        │ noVNC
│   6080       │           │              │
│              │           │              │
│ localhost:   │ ───────→  │ :5901        │ VNC
│   5901       │           │              │
└──────────────┘           └──────────────┘
```

#### Accessing Containers

**Single container:**
- noVNC: `http://localhost:6080`
- VNC: `localhost:5901`

**Multiple containers:** Increment ports automatically
```yaml
# Gazebo (Display :1)
ports:
  - "6080:6080"  # localhost:6080
  - "5901:5901"

# Robot1 (Display :2)  
ports:
  - "6081:6081"  # localhost:6081
  - "5902:5902"

# Robot2 (Display :3)
ports:
  - "6082:6082"  # localhost:6082
  - "5903:5903"
```

**Port selection logic (executed in the entrypoint.sh file):**
```
Display number: N
VNC port: 5900 + N
noVNC port: 6080 + (N - 1)
```

---

## Networks Section

The top-level networks section defines custom networks for container communication.

```yaml
networks:
  ros2_network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
          gateway: 172.20.0.1
```

### Network Configuration Explained

#### Bridge Driver
```yaml
driver: bridge
```
Creates a private internal network on the host. Containers can communicate with each other and the internet.

**Alternatives:**
- `host` - Container uses host network (no isolation)
- `overlay` - Multi-host networking (Docker Swarm)
- `macvlan` - Assigns MAC addresses to containers

#### IP Address Management (IPAM)

```yaml
ipam:
  config:
    - subnet: 172.20.0.0/16
      gateway: 172.20.0.1
```

Defines the network's IP address range:

- **Subnet:** `172.20.0.0/16` provides 65,534 available addresses
- **Gateway:** `172.20.0.1` is the exit point to other networks

**IP assignment:** Docker automatically assigns IPs like `172.20.0.2`, `172.20.0.3`, etc.

**Benefits of custom subnet:**
- Avoid conflicts with other Docker networks
- Consistent IP ranges for debugging
- Network isolation from default Docker networks

---

## Complete Multi-Robot Example

Here's a complete example orchestrating Gazebo simulation with two robots:

```yaml
services:
  gazebo:
    container_name: gazebo
    build:
      context: .
      dockerfile: ../Dockerfile
      args:
        ROS_DISTRO: jazzy
        ROS_INSTALL: ros:jazzy-ros-base-noble
        INSTALL_PROFILE: gazebo
        ROBOT_NAME: gazebo
    environment:
      DISPLAY: ":1"
      ROS_DOMAIN_ID: 0
      GZ_SIM_RENDER_ENGINE: "ogre"
    networks:
      - ros2_network
    volumes:
      - ../../../src:/home/ubuntu/ros2_ws/src
      - ../../../launch:/home/ubuntu/ros2_ws/launch
    ports:
      - "6080:6080"
      - "5901:5901"

  robot1:
    container_name: robot1
    build:
      context: .
      dockerfile: ../Dockerfile
      args:
        INSTALL_PROFILE: navigation
        ROBOT_NAME: robot1
    environment:
      DISPLAY: ":2"
      ROS_DOMAIN_ID: 0
      ROBOT_NAME: robot1
    networks:
      - ros2_network
    volumes:
      - ../../../src:/home/ubuntu/ros2_ws/src
      - robot1_build:/home/ubuntu/ros2_ws/build
      - robot1_install:/home/ubuntu/ros2_ws/install
    ports:
      - "6081:6081"
      - "5902:5902"

  robot2:
    container_name: robot2
    build:
      context: .
      dockerfile: ../Dockerfile
      args:
        INSTALL_PROFILE: perception
        ROBOT_NAME: robot2
    environment:
      DISPLAY: ":3"
      ROS_DOMAIN_ID: 0
      ROBOT_NAME: robot2
    networks:
      - ros2_network
    volumes:
      - ../../../src:/home/ubuntu/ros2_ws/src
      - robot2_build:/home/ubuntu/ros2_ws/build
      - robot2_install:/home/ubuntu/ros2_ws/install
    ports:
      - "6082:6082"
      - "5903:5903"

volumes:
  robot1_build:
  robot1_install:
  robot2_build:
  robot2_install:

networks:
  ros2_network:
    driver: bridge
```

---

## Other configurations options

### 1. Health Checks

Add health checks to ensure containers are ready:

```yaml
healthcheck:
  test: ["CMD", "ros2", "topic", "list"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### 2. Resource Limits

Prevent containers from consuming all resources:

```yaml
deploy:
  resources:
    limits:
      cpus: '2.0'
      memory: 4G
    reservations:
      cpus: '1.0'
      memory: 2G
```

### 3. Dependency Management

Ensure services start in order:

```yaml
robot1:
  depends_on:
    - gazebo
```

### 4. Restart Policies

```yaml
restart: unless-stopped  # Always restart except manual stop
```

---

---

## Related Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [OSRF Dockerfile](https://github.com/osrf/docker_images/blob/master/ros/jazzy/ubuntu/noble/desktop-full/Dockerfile)
- [ROS2 Docker Images](https://github.com/osrf/docker_images)
- [noVNC Documentation](https://github.com/novnc/noVNC)
- [Example of ROS2 Docker File by Tiryoh](https://github.com/Tiryoh/docker-ros2-desktop-vnc/blob/master/jazzy/Dockerfile)
- [Docker NoVNC setup](medium.com/@danielpepuho/running-firefox-in-docker-yes-with-a-gui-and-novnc-8f5f9ca9dbdb)
- [Ros2 docker Tutorial](https://roboticseabass.com/2023/07/09/updated-guide-docker-and-ros2/)
- [My GitHub Repository](https://github.com/DavideCapuzz/ros2docker)
