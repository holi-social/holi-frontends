# Development container for holi-frontends
FROM node:22.14.0-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    unzip \
    python3 \
    make \
    g++ \
    openjdk-17-jdk \
    iproute2 \
    && rm -rf /var/lib/apt/lists/*

# Set up Android SDK (for React Native development)
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools

# Create android sdk directory
RUN mkdir -p ${ANDROID_HOME}

# Install Android Command Line Tools
RUN wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmdline-tools.zip \
    && unzip cmdline-tools.zip -d ${ANDROID_HOME} \
    && mv ${ANDROID_HOME}/cmdline-tools ${ANDROID_HOME}/cmdline-tools-temp \
    && mkdir -p ${ANDROID_HOME}/cmdline-tools/latest \
    && mv ${ANDROID_HOME}/cmdline-tools-temp/* ${ANDROID_HOME}/cmdline-tools/latest/ \
    && rm -rf ${ANDROID_HOME}/cmdline-tools-temp cmdline-tools.zip

# Accept Android licenses and install platform tools
RUN yes | sdkmanager --licenses
RUN sdkmanager "platform-tools" "platforms;android-36" "build-tools;36.0.0"

# Install Expo CLI globally
RUN npm install -g @expo/cli@latest eas-cli@latest

# Set up Yarn (using the version specified in package.json)
RUN corepack enable && corepack prepare yarn@4.7.0 --activate

# Create workspace directory
WORKDIR /workspace

# Create node user and set ownership
RUN groupadd --gid 1000 node \
    && useradd --uid 1000 --gid node --shell /bin/bash --create-home node \
    || true

# Set ownership of workspace and android sdk to node user
RUN chown -R node:node /workspace ${ANDROID_HOME}

# Switch to node user
USER node

# Set default shell for node user
SHELL ["/bin/bash", "-c"]

# Set environment variables for development
ENV NODE_ENV=development
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

# Expose ports for development servers
EXPOSE 3000 19000 19001 19002 19006 8081

# Keep container running
CMD ["tail", "-f", "/dev/null"]