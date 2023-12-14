FROM node
ENV HOME=/code
COPY . $HOME
#COPY package.json package-lock.json $HOME/node_docker/
WORKDIR $HOME/frontend/web
RUN npm install --silent --progress=false
CMD ["npm", "start"]