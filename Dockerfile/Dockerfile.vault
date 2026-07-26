FROM hashicorp/vault:latest

USER root

RUN apk add --no-cache jq

COPY ../vault/scripts/entrypoint.sh /entrypoint.sh
COPY ../vault/config/config.hcl /vault/config/config.hcl

RUN chmod +x /entrypoint.sh

EXPOSE 8200

ENTRYPOINT [ "/entrypoint.sh" ]