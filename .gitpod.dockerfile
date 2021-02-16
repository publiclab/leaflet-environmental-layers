FROM gitpod/workspace-full

USER root

# Install Xvfb
RUN apt-get update \
    && apt-get install -yq xvfb x11vnc xterm \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/*
