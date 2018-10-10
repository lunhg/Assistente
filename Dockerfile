# --- redelivre/assistente:latest ---
FROM redelivre/alpine-node:latest

# Pass arguments defined somewhere in your system (a `.bash_profile`, `.profile`. `.env` or direct bash export) and pass to arguments, that transform to process.env in a private container
ARG node_env
ARG port
ARG redis_host
ARG redis_port
ARG redis_db
ARG secret
ARG jwt_audience
ARG jwt_issuer
ENV NODE_ENV $node_env
ENV PORT $port
ENV REDIS_HOST $redis_host
ENV REDIS_PORT $redis_port
ENV REDIS_DB $redis_db
ENV SECRET $secret
ENV JWT_AUDIENCE $jwt_audience
ENV JWT_ISSUER $jwt_issuer

# Run server
COPY . /home/$username/assistente
WORKDIR /home/$username/assistente
RUN yarn --$node_env
EXPOSE $port
CMD npm run start
