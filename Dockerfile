FROM clojure:alpine

RUN mkdir /app
WORKDIR /app

COPY project.clj /app/
RUN lein deps

COPY asciinema-player /app/asciinema-player
COPY src /app/src
COPY externs /app/externs
RUN lein cljsbuild once main && lein cljsbuild once page

FROM ubuntu:16.04

RUN apt-get update && apt-get install -y wget build-essential automake
RUN wget https://github.com/kornelski/giflossy/archive/1.91.tar.gz
RUN tar xzf 1.91.tar.gz
RUN cd giflossy-1.91 && autoreconf -i && ./configure --disable-gifview && make && make install

FROM ubuntu:16.04

ARG DEBIAN_FRONTEND=noninteractive
ARG NODE_VERSION=node_6.x
ARG DISTRO=xenial

RUN apt-get update && \
    apt-get install -y wget apt-transport-https && \
    echo "deb https://deb.nodesource.com/$NODE_VERSION $DISTRO main" >/etc/apt/sources.list.d/nodesource.list && \
    wget --quiet -O - https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
    apt-get update && \
    apt-get install -y \
      bzip2 \
      imagemagick \
      libfontconfig1 \
      nodejs \
      ttf-bitstream-vera && \
    rm -rf /var/lib/apt/lists/*

ARG PHANTOMJS_VERSION=2.1.1

RUN wget --quiet -O /opt/phantomjs.tar.bz2 https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-$PHANTOMJS_VERSION-linux-x86_64.tar.bz2 && \
    tar xjf /opt/phantomjs.tar.bz2 -C /opt && \
    rm /opt/phantomjs.tar.bz2 && \
    ln -sf /opt/phantomjs-$PHANTOMJS_VERSION-linux-x86_64/bin/phantomjs /usr/local/bin

RUN mkdir /app
WORKDIR /app

COPY package.json /app/
RUN npm install

COPY asciicast2gif /app/
COPY renderer.js /app/
COPY page /app/page
COPY --from=0 /app/main.js /app/
COPY --from=0 /app/page/page.js /app/page/
COPY --from=1 /usr/local/bin/gifsicle /usr/local/bin/

WORKDIR /data
VOLUME ["/data"]

ENTRYPOINT ["/app/asciicast2gif"]
