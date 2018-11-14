# Dockerfile to build a docker container for the UL website (production).  You would typically use that image and mount its filesystem content using a command like:
#
# docker run -d \
#  -it \
#  --name ul-website \
#  --mount type=bind,source=/srv,target=/srv \
#  -p 4896:4896 \
#  ul-website:latest
#
# If you are working to develop a new image, you'll typically build it using a command like:
#
# docker build -t ul-website-dev .
#
#  You would then replace "ul-website:latest" in the above command with "ul-website-dev".

FROM node:8.12.0-alpine

# Store a copy of our code in a TLD in the container.
WORKDIR /ul-website
COPY . /ul-website

# Make sure not to install any dev dependencies.
ENV NODE_ENV production

# Install our dependencies
RUN apk update && \
    apk add --no-cache --virtual build-dependencies python make git g++ && \
    rm -rf node_modules/* && \
    npm install && \
    npm cache clean --force && \
    apk del build-dependencies && \
    apk add busybox-extras

# The UL API express instance runs on this port with the "prod.json" config file.
EXPOSE 4896

# The base command is always the same
ENTRYPOINT ["node", "launch-ul.js"]

# By default, pass the options to load the "prod" config.
CMD ["--optionsFile", "configs/prod.json", "--setLogging", "true"]
