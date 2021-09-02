FROM ubuntu@sha256:cf31af331f38d1d7158470e095b132acd126a7180a54f263d386da88eb681d93
LABEL maintainer="Radosław Szamszur, radoslawszamszur@gmail.com"

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/Warsaw

COPY . /pdf-resume-builder

RUN apt update && \
    apt install -y build-essential npm nginx && \
    unlink /etc/nginx/sites-enabled/default && \
    cp /pdf-resume-builder/image/pdf-resume-builder.conf /etc/nginx/conf.d/ && \
    apt purge -y --auto-remove && \
    cd /pdf-resume-builder && \
    npm install && \
    npm run build
    
EXPOSE 80

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]